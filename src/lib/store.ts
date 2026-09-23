import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import type {
  ActiveCondition,
  Companion,
  CompanionKind,
  Character,
  CombatParticipant,
  BestiaryEntry,
  Clan,
  ChakraGift,
  JutsuCast,
  SoundTrack,
  ShopItem,
  GMRoll,
  GameTable,
  LogEntry,
  Mission,
  NPC,
  RollRequest,
  Scene,
  SceneToken,
  SceneLibraryItem,
  ScenePing,
  SheetChangeRequest,
  Weapon,
} from '../types'
import { spendWeapon } from './equipment'
import { newId, newTableCode } from './id'
import { gridColumns, spotsAround, stageAspect } from './sceneGeometry'

function requireDb() {
  if (!db) throw new Error('Firebase não configurado. Confira o arquivo .env (veja .env.example).')
  return db
}

/** Firestore rejeita valores `undefined`. Removemos essas chaves
 * recursivamente antes de qualquer escrita. */
function stripUndefined<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((v) => stripUndefined(v)) as unknown as T
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) out[k] = stripUndefined(v)
    }
    return out as T
  }
  return value
}

/** Handler padrão pra listeners: erros de Firestore (ex: índice composto
 * faltando, permissão negada) não devem falhar em silêncio — sem isso, um
 * onSnapshot que dá erro simplesmente nunca mais chama o callback, e a UI
 * fica "vazia" sem nenhum aviso. */
function defaultOnError(context: string) {
  return (err: Error) => {
    console.error(`[Mesa Ninja] Erro ao escutar ${context}:`, err)
  }
}

// ---------- Mesas ----------

export async function createTable(gmName: string, gmUid: string, name: string, gmEmail?: string): Promise<GameTable> {
  const database = requireDb()
  for (let attempt = 0; attempt < 8; attempt++) {
    const code = newTableCode()
    const ref = doc(database, 'tables', code)
    const existing = await getDoc(ref)
    if (existing.exists()) continue
    const table: GameTable = {
      id: code,
      code,
      name: name || `Mesa de ${gmName}`,
      gmUid,
      gmName,
      gmEmail,
      createdAt: Date.now(),
      autoApproveFields: [],
      combatActive: false,
      combatOrder: [],
      combatTurnIndex: 0,
      requireRollApproval: true,
    }
    await setDoc(ref, stripUndefined(table))
    await rememberGMTable(gmUid, table)
    return table
  }
  throw new Error('Não foi possível gerar um código de mesa único. Tente novamente.')
}

// ---------- Índice de mesas por mestre ----------
//
// A listagem de /tables é negada a todo mundo (senão qualquer um descobriria
// os códigos das mesas alheias). Para o mestre reencontrar as próprias mesas
// ao entrar de outro dispositivo, cada mesa criada deixa uma entrada num
// índice particular, que só o dono lê.

export interface GMTableEntry {
  tableId: string
  name: string
  createdAt: number
}

export function gmTablesCol(uid: string) {
  return collection(requireDb(), 'gmTables', uid, 'tables')
}

export async function rememberGMTable(uid: string, table: GameTable) {
  const entry: GMTableEntry = { tableId: table.id, name: table.name, createdAt: table.createdAt }
  await setDoc(doc(gmTablesCol(uid), table.id), stripUndefined(entry))
}

export function listenGMTables(uid: string, cb: (tables: GMTableEntry[]) => void) {
  return onSnapshot(
    query(gmTablesCol(uid), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => d.data() as GMTableEntry)),
    defaultOnError('minhas mesas'),
  )
}

// ---------- Administração ----------

export async function isSuperAdmin(uid: string): Promise<boolean> {
  const snap = await getDoc(doc(requireDb(), 'superAdmins', uid))
  return snap.exists()
}

/** Lista de todas as mesas — negada pelas regras a quem não é super admin. */
export function listenAllTables(cb: (tables: GameTable[]) => void, onError?: (e: Error) => void) {
  return onSnapshot(
    query(collection(requireDb(), 'tables'), orderBy('createdAt', 'desc')),
    (snap) => cb(snap.docs.map((d) => d.data() as GameTable)),
    (err) => onError?.(err),
  )
}

const TABLE_SUBCOLLECTIONS = [
  'characters',
  'requests',
  'rollRequests',
  'npcs',
  'missions',
  'log',
  'scene',
  'sceneLibrary',
  'pings',
  'gmRolls',
  'bestiary',
  'clans',
  'shop',
  'chakraGifts',
  'jutsuCasts',
  'sound',
]

/** Apaga a mesa e tudo que vive dentro dela. Não tem volta. */
export async function deleteTableCompletely(tableId: string): Promise<void> {
  const database = requireDb()
  for (const sub of TABLE_SUBCOLLECTIONS) {
    const snap = await getDocs(collection(database, 'tables', tableId, sub))
    await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)))
  }
  await deleteDoc(doc(database, 'tables', tableId))
}

/** Mesas criadas antes de um campo existir não têm esse campo no documento.
 * Em vez de espalhar `?? padrão` por toda a interface, o valor é completado
 * aqui, no único ponto por onde a mesa entra no app. */
function normalizeTable(data: Partial<GameTable>): GameTable {
  return {
    ...(data as GameTable),
    autoApproveFields: data.autoApproveFields ?? [],
    combatActive: data.combatActive ?? false,
    combatOrder: data.combatOrder ?? [],
    combatTurnIndex: data.combatTurnIndex ?? 0,
    // Padrão do sistema: o mestre libera cada rolagem.
    requireRollApproval: data.requireRollApproval ?? true,
  }
}

export async function getTableByCode(code: string): Promise<GameTable | null> {
  const database = requireDb()
  const ref = doc(database, 'tables', code.trim().toUpperCase())
  const snap = await getDoc(ref)
  return snap.exists() ? normalizeTable(snap.data() as Partial<GameTable>) : null
}

export function listenTable(tableId: string, cb: (t: GameTable | null) => void) {
  const database = requireDb()
  return onSnapshot(
    doc(database, 'tables', tableId),
    (snap) => cb(snap.exists() ? normalizeTable(snap.data() as Partial<GameTable>) : null),
    defaultOnError('mesa'),
  )
}

export async function updateTable(tableId: string, patch: Partial<GameTable>) {
  const database = requireDb()
  await updateDoc(doc(database, 'tables', tableId), stripUndefined(patch))
}

export async function startCombat(tableId: string, order: CombatParticipant[]) {
  await updateTable(tableId, { combatActive: true, combatOrder: order, combatTurnIndex: 0, combatRound: 1 })
}

export async function endCombat(tableId: string) {
  await updateTable(tableId, { combatActive: false, combatOrder: [], combatTurnIndex: 0, combatRound: 0 })
}

/** A ordem inteira, para mexer em condição, surpresa ou chefe sem reiniciar. */
export async function setCombatOrder(tableId: string, order: CombatParticipant[]) {
  await updateTable(tableId, { combatOrder: order })
}

/** Aponta a vez para um lugar da ordem — usado quando alguém sai da luta. */
export async function advanceTurnIndex(tableId: string, index: number) {
  await updateTable(tableId, { combatTurnIndex: Math.max(0, index) })
}

/**
 * Entra no meio da luta.
 *
 * Briga não começa com todo mundo na sala: chega reforço, o NPC escondido se
 * revela, o clone nasce no turno de alguém. O que não pode é a chegada
 * atropelar a vez de quem está jogando — então a lista é reordenada pela
 * iniciativa e o índice do turno é remendado para continuar apontando para a
 * MESMA pessoa que estava agindo.
 */
export async function addCombatants(tableId: string, table: GameTable, novos: CombatParticipant[]) {
  const jaEstao = new Set(table.combatOrder.map((p) => p.ref))
  const entram = novos.filter((p) => !jaEstao.has(p.ref))
  if (entram.length === 0) return

  const deQuemEraAVez = table.combatOrder[table.combatTurnIndex]?.ref
  const order = [...table.combatOrder, ...entram].sort(
    (a, b) => Number(a.surprised) - Number(b.surprised) || b.initiative - a.initiative,
  )
  const turno = deQuemEraAVez ? Math.max(0, order.findIndex((p) => p.ref === deQuemEraAVez)) : table.combatTurnIndex
  await updateTable(tableId, { combatOrder: order, combatTurnIndex: turno })
}

/**
 * Passa a vez. Ao voltar ao primeiro da lista, fecha a rodada — e é aí que as
 * condições com prazo perdem uma rodada e as que zeram caem sozinhas.
 */
export async function advanceCombatTurn(
  tableId: string,
  table: GameTable,
  /**
   * Quem está na luta, pelas fichas. Fechada a rodada, o prazo das condições
   * cai de um em CADA ficha — é lá que elas moram desde que jutsu passou a
   * impor condição fora de combate também.
   */
  fichas: { ref: string; conditions?: ActiveCondition[] }[] = [],
) {
  const total = table.combatOrder.length
  if (total === 0) return
  const nextIndex = (table.combatTurnIndex + 1) % total
  const fechouRodada = nextIndex === 0
  const round = (table.combatRound ?? 1) + (fechouRodada ? 1 : 0)

  /** Um turno a menos no prazo; a que zera sai sozinha. */
  const correr = (cs: ActiveCondition[]) =>
    cs.map((c) => (c.rounds === undefined ? c : { ...c, rounds: c.rounds - 1 })).filter((c) => c.rounds === undefined || c.rounds > 0)

  const order = fechouRodada
    ? table.combatOrder.map((p) => ({
        ...p,
        // Passada a primeira rodada, ninguém segue surpreso.
        surprised: false,
        conditions: correr(p.conditions ?? []),
      }))
    : table.combatOrder

  await updateTable(tableId, { combatTurnIndex: nextIndex, combatRound: round, combatOrder: order })
  if (!fechouRodada) return

  const database = requireDb()
  const batch = writeBatch(database)
  let mexeu = false
  for (const f of fichas) {
    const atuais = f.conditions ?? []
    if (atuais.length === 0) continue
    const proximas = correr(atuais)
    if (proximas.length === atuais.length && proximas.every((c, i) => c.rounds === atuais[i].rounds)) continue
    const [kind, id] = f.ref.split(':')
    const col = kind === 'character' ? charactersCol(tableId) : kind === 'npc' ? npcsCol(tableId) : companionsCol(tableId)
    batch.update(doc(col, id), { conditions: proximas })
    mexeu = true
  }
  if (mexeu) await batch.commit()
}

// ---------- Personagens ----------

export function charactersCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'characters')
}

export async function createCharacter(tableId: string, character: Omit<Character, 'id'>): Promise<Character> {
  const id = newId()
  const full: Character = { ...character, id }
  await setDoc(doc(charactersCol(tableId), id), stripUndefined(full))
  return full
}

/** Escrita direta na ficha — só deve ser chamada pelo Mestre, ou para o
 * campo "notes", ou para campos marcados como auto-aprovados na mesa.
 * As Firestore Rules reforçam essa restrição do lado do servidor. */
export async function updateCharacterDirect(tableId: string, characterId: string, patch: Record<string, unknown>) {
  await updateDoc(doc(charactersCol(tableId), characterId), stripUndefined({ ...patch, updatedAt: Date.now() }))
}

export async function deleteCharacter(tableId: string, characterId: string) {
  await deleteDoc(doc(charactersCol(tableId), characterId))
}

export function listenCharacters(tableId: string, cb: (chars: Character[]) => void) {
  return onSnapshot(
    query(charactersCol(tableId), orderBy('createdAt', 'asc')),
    (snap) => cb(snap.docs.map((d) => d.data() as Character)),
    defaultOnError('personagens'),
  )
}

export function listenCharacter(tableId: string, characterId: string, cb: (c: Character | null) => void) {
  return onSnapshot(
    doc(charactersCol(tableId), characterId),
    (snap) => cb(snap.exists() ? (snap.data() as Character) : null),
    defaultOnError('personagem'),
  )
}

export async function findMyCharacter(tableId: string, ownerUid: string): Promise<Character | null> {
  const q = query(charactersCol(tableId), where('ownerUid', '==', ownerUid), limit(1))
  const snap = await getDocs(q)
  return snap.empty ? null : (snap.docs[0].data() as Character)
}

/** Busca um personagem pelo nome exato na mesa — usado pra reconhecer um
 * jogador que está retornando (outro dispositivo/navegador) e evitar criar
 * um personagem duplicado quando o nome já existe. */
/**
 * Procura um personagem de JOGADOR pelo nome — é o que permite entrar de
 * outro aparelho digitando o nome da ficha.
 *
 * Fichas de NPC ficam de fora de propósito: elas também vivem em
 * /characters, e sem esse filtro bastaria digitar o nome do vilão para
 * assumir a ficha dele.
 */
export async function findCharacterByName(tableId: string, name: string): Promise<Character | null> {
  const q = query(charactersCol(tableId), where('name', '==', name.trim()), limit(5))
  const snap = await getDocs(q)
  const doJogador = snap.docs.map((d) => d.data() as Character).find((c) => !c.isNPC)
  return doJogador ?? null
}

/** "Reivindica" um personagem existente pro uid atual — usado quando o
 * jogador digita o nome de um personagem já criado (ex: entrando de outro
 * dispositivo). As Firestore Rules só permitem essa transição estrita
 * (só o campo ownerUid muda, pro próprio uid de quem chama). */
export async function claimCharacter(tableId: string, characterId: string, uid: string) {
  await updateDoc(doc(charactersCol(tableId), characterId), { ownerUid: uid, updatedAt: Date.now() })
}

// ---------- Fila de aprovação (mudanças de ficha) ----------

export function requestsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'requests')
}

export async function createChangeRequest(
  tableId: string,
  request: Omit<SheetChangeRequest, 'id' | 'tableId' | 'status' | 'createdAt'>,
): Promise<SheetChangeRequest> {
  const id = newId()
  const full: SheetChangeRequest = {
    ...request,
    id,
    tableId,
    status: 'pending',
    createdAt: Date.now(),
  }
  await setDoc(doc(requestsCol(tableId), id), stripUndefined(full))
  return full
}

export function listenPendingRequests(tableId: string, cb: (reqs: SheetChangeRequest[]) => void) {
  const q = query(requestsCol(tableId), where('status', '==', 'pending'), orderBy('createdAt', 'asc'))
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => d.data() as SheetChangeRequest)),
    defaultOnError('pedidos pendentes (confira se os índices do Firestore foram publicados)'),
  )
}

export function listenRequestsForCharacter(tableId: string, characterId: string, cb: (reqs: SheetChangeRequest[]) => void) {
  const q = query(requestsCol(tableId), where('characterId', '==', characterId), orderBy('createdAt', 'desc'), limit(20))
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => d.data() as SheetChangeRequest)),
    defaultOnError('pedidos do personagem (confira se os índices do Firestore foram publicados)'),
  )
}

export async function approveRequests(tableId: string, requests: SheetChangeRequest[], reviewedBy: string) {
  const database = requireDb()
  const batch = writeBatch(database)
  const now = Date.now()
  for (const req of requests) {
    const charRef = doc(charactersCol(tableId), req.characterId)
    batch.update(charRef, stripUndefined({ ...req.patch, updatedAt: now }))
    const reqRef = doc(requestsCol(tableId), req.id)
    batch.update(reqRef, { status: 'approved', reviewedAt: now, reviewedBy })
  }
  await batch.commit()
}

export async function rejectRequests(tableId: string, requestIds: string[], reviewedBy: string, reviewNote?: string) {
  const database = requireDb()
  const batch = writeBatch(database)
  const now = Date.now()
  for (const id of requestIds) {
    const reqRef = doc(requestsCol(tableId), id)
    batch.update(reqRef, stripUndefined({ status: 'rejected', reviewedAt: now, reviewedBy, reviewNote }))
  }
  await batch.commit()
}

// ---------- Fila de rolagens ----------

export function rollRequestsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'rollRequests')
}

export async function createRollRequest(
  tableId: string,
  request: Omit<RollRequest, 'id' | 'tableId' | 'status' | 'createdAt'>,
): Promise<RollRequest> {
  const id = newId()
  const full: RollRequest = { ...request, id, tableId, status: 'pending', createdAt: Date.now() }
  await setDoc(doc(rollRequestsCol(tableId), id), stripUndefined(full))
  return full
}

export function listenPendingRollRequests(tableId: string, cb: (reqs: RollRequest[]) => void) {
  const q = query(rollRequestsCol(tableId), where('status', '==', 'pending'), orderBy('createdAt', 'asc'))
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => d.data() as RollRequest)),
    defaultOnError('pedidos de rolagem (confira se os índices do Firestore foram publicados)'),
  )
}

export function listenMyRollRequests(tableId: string, characterId: string, cb: (reqs: RollRequest[]) => void) {
  const q = query(rollRequestsCol(tableId), where('characterId', '==', characterId), orderBy('createdAt', 'desc'), limit(10))
  return onSnapshot(
    q,
    (snap) => cb(snap.docs.map((d) => d.data() as RollRequest)),
    defaultOnError('minhas rolagens pendentes'),
  )
}

export async function resolveRollRequest(tableId: string, requestId: string, patch: Partial<RollRequest>) {
  await updateDoc(doc(rollRequestsCol(tableId), requestId), stripUndefined({ ...patch, resolvedAt: Date.now() }))
}

// ---------- NPCs / Adversários ----------

export function npcsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'npcs')
}

export async function createNPC(tableId: string, npc: Omit<NPC, 'id'>): Promise<NPC> {
  const id = newId()
  const full: NPC = { ...npc, id }
  await setDoc(doc(npcsCol(tableId), id), stripUndefined(full))
  return full
}

export async function updateNPC(tableId: string, npcId: string, patch: Partial<NPC>) {
  await updateDoc(doc(npcsCol(tableId), npcId), stripUndefined(patch))
}

export async function deleteNPC(tableId: string, npcId: string) {
  await deleteDoc(doc(npcsCol(tableId), npcId))
}

export function listenNPCs(tableId: string, cb: (npcs: NPC[]) => void) {
  return onSnapshot(
    query(npcsCol(tableId), orderBy('createdAt', 'asc')),
    (snap) => cb(snap.docs.map((d) => d.data() as NPC)),
    defaultOnError('NPCs'),
  )
}

/* ---------------------------------------------------------------------------
 * Fichas temporárias: clones e invocações
 *
 * Coleção própria, e não a de NPC, por causa de quem escreve: a ficha de NPC
 * é escrita exclusiva do mestre, e um clone precisa ser mexido pelo jogador
 * que o criou — é o corpo dele. As regras deixam o dono (pelo uid) e o mestre
 * escreverem; todo mundo lê, porque a peça aparece no mapa de todos.
 * ------------------------------------------------------------------------- */

export function companionsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'companions')
}

/** Cria várias de uma vez — quatro clones das sombras são quatro fichas. */
export async function createCompanions(tableId: string, companions: Companion[]) {
  if (companions.length === 0) return
  const database = requireDb()
  const batch = writeBatch(database)
  for (const c of companions) {
    batch.set(doc(companionsCol(tableId), c.id), stripUndefined(c))
  }
  await batch.commit()
}

export async function updateCompanion(tableId: string, companionId: string, patch: Partial<Companion>) {
  await updateDoc(doc(companionsCol(tableId), companionId), stripUndefined(patch))
}

export async function deleteCompanion(tableId: string, companionId: string) {
  await deleteDoc(doc(companionsCol(tableId), companionId))
}

/** Desfaz de uma vez as fichas temporárias que o jutsu criou. */
export async function dismissCompanions(tableId: string, ids: string[]) {
  if (ids.length === 0) return
  const database = requireDb()
  const batch = writeBatch(database)
  for (const id of ids) batch.delete(doc(companionsCol(tableId), id))
  await batch.commit()
}

/**
 * Põe as peças dos clones/invocações ao lado da peça do dono na cena ATUAL.
 *
 * Duas decisões importantes:
 *  - se o personagem não tem peça no tabuleiro, nada acontece. Não faz
 *    sentido materializar um clone num mapa onde o original nem está;
 *  - as peças nascem com `temporary`, e o retrato que a biblioteca guarda as
 *    ignora — carregar uma cena salva não ressuscita clone nenhum.
 *
 * Devolve quantas peças entraram, para a mesa saber o que aconteceu.
 */
export async function addCompanionTokens(
  tableId: string,
  ownerCharacterId: string,
  companions: readonly Companion[],
): Promise<number> {
  if (companions.length === 0) return 0
  const snap = await getDoc(sceneDoc(tableId))
  if (!snap.exists()) return 0
  const scene = snap.data() as Scene
  const tokens = scene.tokens ?? []
  const dono = tokens.find((t) => t.refType === 'character' && t.refId === ownerCharacterId && t.onBoard !== false)

  const colunas = gridColumns(scene)
  const aspecto = stageAspect(scene)
  const ocupadas = tokens.filter((t) => t.onBoard !== false).map((t) => ({ x: t.x, y: t.y }))
  // Com o dono no tabuleiro, as peças nascem ao lado dele. Sem o dono, elas
  // não somem: vão para a bandeja do mestre, prontas para entrar. Antes disto
  // uma marionete criada fora da cena simplesmente não virava peça nenhuma, e
  // o jeito de pôr ela no mapa era não existir.
  const vagas = dono
    ? spotsAround({ x: dono.x, y: dono.y }, companions.length, ocupadas, colunas, aspecto)
    : companions.map(() => ({ x: 0.5, y: 0.5 }))

  const novas: SceneToken[] = companions.map((c, i) => ({
    id: newId(),
    label: c.name,
    kind: 'companion',
    imageUrl: c.imageUrl,
    x: vagas[i].x,
    y: vagas[i].y,
    size: dono?.size ?? 0.06,
    squares: 1,
    refType: 'companion',
    refId: c.id,
    temporary: true,
    onBoard: Boolean(dono),
  }))
  await saveSceneTokens(tableId, [...tokens, ...novas])
  return dono ? novas.length : 0
}

/** Tira do mapa as peças das fichas temporárias que sumiram. */
export async function removeCompanionTokens(tableId: string, companionIds: readonly string[]) {
  if (companionIds.length === 0) return
  const snap = await getDoc(sceneDoc(tableId))
  if (!snap.exists()) return
  const scene = snap.data() as Scene
  const tokens = scene.tokens ?? []
  const restantes = tokens.filter((t) => !(t.refType === 'companion' && t.refId && companionIds.includes(t.refId)))
  if (restantes.length === tokens.length) return
  await saveSceneTokens(tableId, restantes)
}

export function listenCompanions(tableId: string, cb: (list: Companion[]) => void) {
  return onSnapshot(
    query(companionsCol(tableId), orderBy('createdAt', 'asc')),
    (snap) => cb(snap.docs.map((d) => d.data() as Companion)),
    defaultOnError('clones e invocações'),
  )
}

// ---------- Tela de jogo (cena) ----------

export function sceneDoc(tableId: string) {
  return doc(requireDb(), 'tables', tableId, 'scene', 'current')
}

export async function saveScene(tableId: string, scene: Scene) {
  await setDoc(sceneDoc(tableId), stripUndefined({ ...scene, updatedAt: Date.now() }))
}

/** Movimento de peça feito por jogador: escreve só `tokens`, que é o único
 * campo que as regras liberam para quem não é mestre. */
export async function saveSceneTokens(tableId: string, tokens: Scene['tokens']) {
  await updateDoc(sceneDoc(tableId), stripUndefined({ tokens, updatedAt: Date.now() }))
}

export function listenScene(tableId: string, cb: (scene: Scene | null) => void) {
  return onSnapshot(
    sceneDoc(tableId),
    (snap) => cb(snap.exists() ? (snap.data() as Scene) : null),
    defaultOnError('cena'),
  )
}

export function pingsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'pings')
}

export async function addScenePing(tableId: string, ping: { x: number; y: number; label: string }) {
  const id = newId()
  const full: ScenePing = { ...ping, id, at: Date.now() }
  await setDoc(doc(pingsCol(tableId), id), stripUndefined(full))
}

export function listenScenePings(tableId: string, cb: (pings: ScenePing[]) => void) {
  return onSnapshot(
    query(pingsCol(tableId), orderBy('at', 'desc'), limit(20)),
    (snap) => cb(snap.docs.map((d) => d.data() as ScenePing)),
    defaultOnError('marcações do mapa'),
  )
}

/** Faxina das marcações velhas, feita pelo cliente do mestre. */
export async function cleanupOldPings(tableId: string, olderThanMs: number) {
  const cutoff = Date.now() - olderThanMs
  const snap = await getDocs(pingsCol(tableId))
  await Promise.all(snap.docs.filter((d) => ((d.data() as ScenePing).at ?? 0) < cutoff).map((d) => deleteDoc(d.ref)))
}

export function sceneLibraryCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'sceneLibrary')
}

export async function addSceneLibraryItem(tableId: string, item: Omit<SceneLibraryItem, 'id'>): Promise<SceneLibraryItem> {
  const id = newId()
  const full: SceneLibraryItem = { ...item, id }
  await setDoc(doc(sceneLibraryCol(tableId), id), stripUndefined(full))
  return full
}

/** Grava por cima de um item guardado: a cena mexida volta para o mesmo lugar. */
export async function updateSceneLibraryItem(tableId: string, itemId: string, patch: Partial<SceneLibraryItem>) {
  await updateDoc(doc(sceneLibraryCol(tableId), itemId), stripUndefined({ ...patch, updatedAt: Date.now() }))
}

/**
 * Renomear pasta é reescrever o rótulo em todos os itens dela.
 *
 * Pasta não é documento nesta mesa — é um nome repetido nos itens. Sai mais
 * barato (nada para criar, nada para limpar quando esvazia) ao custo desta
 * varredura, que acontece só quando alguém renomeia.
 */
export async function renameSceneLibraryFolder(
  tableId: string,
  itens: readonly SceneLibraryItem[],
  de: string | undefined,
  para: string | undefined,
) {
  const alvos = itens.filter((i) => (i.folder ?? '') === (de ?? ''))
  if (alvos.length === 0) return
  const batch = writeBatch(requireDb())
  for (const i of alvos) {
    batch.update(doc(sceneLibraryCol(tableId), i.id), stripUndefined({ folder: para || undefined }))
  }
  await batch.commit()
}

export async function deleteSceneLibraryItem(tableId: string, itemId: string) {
  await deleteDoc(doc(sceneLibraryCol(tableId), itemId))
}

export function listenSceneLibrary(tableId: string, cb: (items: SceneLibraryItem[]) => void) {
  return onSnapshot(
    query(sceneLibraryCol(tableId), orderBy('createdAt', 'asc')),
    (snap) => cb(snap.docs.map((d) => d.data() as SceneLibraryItem)),
    defaultOnError('biblioteca de cenas'),
  )
}

// ---------- Missões ----------

export function missionsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'missions')
}

export async function createMission(tableId: string, mission: Omit<Mission, 'id'>): Promise<Mission> {
  const id = newId()
  const full: Mission = { ...mission, id }
  await setDoc(doc(missionsCol(tableId), id), stripUndefined(full))
  return full
}

export async function updateMission(tableId: string, missionId: string, patch: Partial<Mission>) {
  await updateDoc(doc(missionsCol(tableId), missionId), stripUndefined(patch))
}

export async function deleteMission(tableId: string, missionId: string) {
  await deleteDoc(doc(missionsCol(tableId), missionId))
}

export function listenMissions(tableId: string, cb: (missions: Mission[]) => void) {
  return onSnapshot(
    query(missionsCol(tableId), orderBy('createdAt', 'asc')),
    (snap) => cb(snap.docs.map((d) => d.data() as Mission)),
    defaultOnError('missões'),
  )
}

// ---------- Log de mesa ----------

export function logCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'log')
}

export async function addLogEntry(tableId: string, entry: Omit<LogEntry, 'id' | 'tableId' | 'ts'>) {
  const id = newId()
  const full: LogEntry = { ...entry, id, tableId, ts: Date.now() }
  await setDoc(doc(logCol(tableId), id), stripUndefined(full))
}

/* ---------------------------------------------------------------------------
 * Rolagens secretas do mestre
 *
 * Coleção à parte, e não uma marca no registro da mesa: o log é legível por
 * todo mundo que está na mesa, então "secreto" ali seria secreto só na tela.
 * As regras do Firestore fecham esta coleção para quem não é o mestre.
 * ------------------------------------------------------------------------- */

export function gmRollsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'gmRolls')
}

export async function addGMRoll(tableId: string, roll: Omit<GMRoll, 'id' | 'tableId' | 'ts'>): Promise<GMRoll> {
  const id = newId()
  const entry: GMRoll = { ...roll, id, tableId, ts: Date.now() }
  await setDoc(doc(gmRollsCol(tableId), id), stripUndefined(entry))
  return entry
}

export function listenGMRolls(tableId: string, cb: (rolls: GMRoll[]) => void, max = 30) {
  const q = query(gmRollsCol(tableId), orderBy('ts', 'desc'), limit(max))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as GMRoll)), defaultOnError('rolagens do mestre'))
}

/* ---------------------------------------------------------------------------
 * Bestiário da mesa: as criaturas que o mestre inventou. Bastidor dele — as do
 * manual não vêm daqui, vivem no código (src/data/summons.ts).
 * ------------------------------------------------------------------------- */

export function bestiaryCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'bestiary')
}

export async function saveBestiaryEntry(tableId: string, entry: BestiaryEntry) {
  await setDoc(doc(bestiaryCol(tableId), entry.id), stripUndefined(entry))
}

export async function deleteBestiaryEntry(tableId: string, id: string) {
  await deleteDoc(doc(bestiaryCol(tableId), id))
}

export function listenBestiary(tableId: string, cb: (entries: BestiaryEntry[]) => void) {
  const q = query(bestiaryCol(tableId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as BestiaryEntry)), defaultOnError('bestiário'))
}

/* ---------------------------------------------------------------------------
 * Clãs da casa: os que o mestre inventou para a campanha dele. Valem como os
 * do manual em tudo — escolha na criação, bônus, jutsus exclusivos e
 * afinidade elemental. Lidos por todos (o jogador precisa vê-los para
 * escolher), escritos só pelo mestre.
 * ------------------------------------------------------------------------- */

export function clansCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'clans')
}

export async function saveCustomClan(tableId: string, clan: Clan) {
  await setDoc(doc(clansCol(tableId), clan.id), stripUndefined(clan))
}

export async function deleteCustomClan(tableId: string, id: string) {
  await deleteDoc(doc(clansCol(tableId), id))
}

export function listenCustomClans(tableId: string, cb: (clans: Clan[]) => void) {
  return onSnapshot(clansCol(tableId), (snap) => cb(snap.docs.map((d) => d.data() as Clan)), defaultOnError('clãs da mesa'))
}

/* ---------------------------------------------------------------------------
 * Loja da mesa: itens forjados pelo mestre. Todos leem (o grupo precisa ver a
 * vitrine), só o mestre escreve — preço e estoque não são do freguês.
 * ------------------------------------------------------------------------- */

export function shopCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'shop')
}

export async function saveShopItem(tableId: string, item: ShopItem) {
  await setDoc(doc(shopCol(tableId), item.id), stripUndefined(item))
}

export async function deleteShopItem(tableId: string, id: string) {
  await deleteDoc(doc(shopCol(tableId), id))
}

export function listenShop(tableId: string, cb: (items: ShopItem[]) => void) {
  const q = query(shopCol(tableId), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as ShopItem)), defaultOnError('loja da mesa'))
}

/* ---------------------------------------------------------------------------
 * Doação de chakra: regra da casa, restrita ao Ninja Médico.
 *
 * Fila própria porque a transferência mexe em duas fichas, e um jogador não
 * escreve na ficha alheia. O médico pede; o mestre libera, e aí as duas
 * pontas mudam numa escrita só — ninguém fica sem o chakra que o outro não
 * recebeu.
 * ------------------------------------------------------------------------- */

export function chakraGiftsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'chakraGifts')
}

export async function createChakraGift(
  tableId: string,
  gift: Omit<ChakraGift, 'id' | 'tableId' | 'status' | 'createdAt'>,
): Promise<ChakraGift> {
  const id = newId()
  const full: ChakraGift = { ...gift, id, tableId, status: 'pending', createdAt: Date.now() }
  await setDoc(doc(chakraGiftsCol(tableId), id), stripUndefined(full))
  return full
}

export function listenPendingChakraGifts(tableId: string, cb: (gifts: ChakraGift[]) => void) {
  const q = query(chakraGiftsCol(tableId), where('status', '==', 'pending'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as ChakraGift)), defaultOnError('doações de chakra'))
}

export function listenMyChakraGifts(tableId: string, characterId: string, cb: (gifts: ChakraGift[]) => void) {
  const q = query(chakraGiftsCol(tableId), where('fromCharacterId', '==', characterId), orderBy('createdAt', 'desc'), limit(5))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as ChakraGift)), defaultOnError('minhas doações'))
}

/**
 * Libera a doação: tira do doador e põe no recebedor numa escrita só.
 *
 * O batch importa — sem ele, uma falha no meio deixaria o médico sem o
 * chakra que o aliado nunca recebeu.
 */
export async function approveChakraGift(tableId: string, gift: ChakraGift, doador: Character, recebedor: Character, gmName: string) {
  const database = requireDb()
  // Três limites ao mesmo tempo: o pedido, o que o doador tem, e o que cabe
  // no outro. Sem o terceiro, doar para quem está com o chakra cheio
  // queimaria o do médico sem ninguém ganhar nada.
  const cabe = Math.max(0, recebedor.chakra.max - recebedor.chakra.current)
  const saiu = Math.min(gift.amount, doador.chakra.current, cabe)
  const batch = writeBatch(database)
  batch.update(doc(charactersCol(tableId), doador.id), {
    chakra: { ...doador.chakra, current: doador.chakra.current - saiu },
    updatedAt: Date.now(),
  })
  batch.update(doc(charactersCol(tableId), recebedor.id), {
    chakra: { ...recebedor.chakra, current: recebedor.chakra.current + saiu },
    updatedAt: Date.now(),
  })
  batch.update(doc(chakraGiftsCol(tableId), gift.id), { status: 'approved', resolvedBy: gmName })
  await batch.commit()
  return saiu
}

export async function denyChakraGift(tableId: string, giftId: string, gmName: string, reason: string) {
  await updateDoc(doc(chakraGiftsCol(tableId), giftId), stripUndefined({ status: 'denied', resolvedBy: gmName, deniedReason: reason }))
}

/* ---------------------------------------------------------------------------
 * Lançamento de jutsu: o conjurador manda a intenção, o mestre libera.
 * ------------------------------------------------------------------------- */

export function jutsuCastsCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'jutsuCasts')
}

export async function createJutsuCast(
  tableId: string,
  cast: Omit<JutsuCast, 'id' | 'tableId' | 'status' | 'createdAt'>,
): Promise<JutsuCast> {
  const id = newId()
  const full: JutsuCast = { ...cast, id, tableId, status: 'pending', createdAt: Date.now() }
  await setDoc(doc(jutsuCastsCol(tableId), id), stripUndefined(full))
  return full
}

export function listenPendingJutsuCasts(tableId: string, cb: (casts: JutsuCast[]) => void) {
  const q = query(jutsuCastsCol(tableId), where('status', '==', 'pending'), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as JutsuCast)), defaultOnError('jutsus lançados'))
}

export function listenMyJutsuCasts(tableId: string, casterId: string, cb: (casts: JutsuCast[]) => void) {
  const q = query(jutsuCastsCol(tableId), where('casterId', '==', casterId), orderBy('createdAt', 'desc'), limit(5))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as JutsuCast)), defaultOnError('meus jutsus'))
}

/**
 * Aplica o resultado de um lançamento: desconta o chakra do conjurador, tira
 * os PV do alvo e marca o pedido como resolvido — tudo numa escrita só, para
 * não sobrar meio golpe se algo falhar no meio.
 */
/** De onde sai o chakra do lançamento, e de quem é a arma que se gasta. */
export interface CastChakraSource {
  kind: 'character' | 'companion'
  id: string
  chakra: { current: number; max: number }
  /** Só faz sentido para ficha de personagem: armas ficam nela. */
  weapons?: Weapon[]
}

/** Quem leva o golpe, e o que acontece quando o PV chega a zero. */
export interface CastHit {
  kind: 'character' | 'npc' | 'companion'
  id: string
  hpAfter: number
  hp: { current: number; max: number }
  /** Ficha temporária: clone e invocação somem a 0 PV; marionete quebra. */
  companionKind?: CompanionKind
  /**
   * A lista de condições que o alvo fica tendo depois do golpe — já mesclada
   * por quem resolveu, porque só lá se sabe o que o alvo já carregava. Ausente
   * = o golpe não mexe nas condições dele.
   */
  conditions?: ActiveCondition[]
}

/**
 * Fecha o lançamento em uma escrita só: desconta o chakra de quem pagou,
 * aplica o dano em quem levou e marca o pedido como resolvido.
 *
 * Três casos que a conta precisa saber distinguir:
 *  - quem PAGA o chakra nem sempre é quem age: a marionete não tem chakra,
 *    então o custo sai da ficha do dono;
 *  - ficha temporária que chega a 0 PV some da mesa, porque clone desfeito é
 *    clone desfeito — não fica uma ficha morta ocupando a lista;
 *  - marionete a 0 PV não some: fica QUEBRADA, esperando o conserto do
 *    mestre, porque o item continua na mochila do dono.
 */
export async function applyJutsuCast(
  tableId: string,
  cast: JutsuCast,
  chakraFrom: CastChakraSource,
  targets: CastHit[],
  resultSummary: string,
) {
  const database = requireDb()
  const batch = writeBatch(database)

  const patchConjurador: Record<string, unknown> = {
    chakra: { ...chakraFrom.chakra, current: Math.max(0, chakraFrom.chakra.current - cast.chakraCost) },
  }
  // Arma de arremesso sai da mão: a unidade é descontada na mesma escrita do
  // chakra, para não existir estado em que o ataque saiu mas a shuriken não.
  if (cast.consumesWeapon && cast.weaponId && chakraFrom.weapons) {
    patchConjurador.weapons = spendWeapon(chakraFrom.weapons, cast.weaponId)
  }
  if (chakraFrom.kind === 'character') {
    patchConjurador.updatedAt = Date.now()
    batch.update(doc(charactersCol(tableId), chakraFrom.id), patchConjurador)
  } else {
    batch.update(doc(companionsCol(tableId), chakraFrom.id), patchConjurador)
  }

  for (const target of targets) {
    if (target.kind === 'companion') {
      const ref = doc(companionsCol(tableId), target.id)
      if (target.hpAfter === 0 && target.companionKind !== 'puppet') {
        // Clone desfeito some inteiro: nem adianta guardar condição nele.
        batch.delete(ref)
      } else if (target.hpAfter === 0) {
        batch.update(ref, stripUndefined({ hp: { ...target.hp, current: 0 }, status: 'broken', conditions: target.conditions }))
      } else {
        batch.update(ref, stripUndefined({ hp: { ...target.hp, current: target.hpAfter }, conditions: target.conditions }))
      }
    } else {
      const ref = target.kind === 'character' ? doc(charactersCol(tableId), target.id) : doc(npcsCol(tableId), target.id)
      const patch: Record<string, unknown> = { hp: { ...target.hp, current: target.hpAfter }, conditions: target.conditions }
      if (target.kind === 'character') {
        patch.updatedAt = Date.now()
        if (target.hpAfter === 0) patch.isAlive = false
      }
      batch.update(ref, stripUndefined(patch))
    }
  }

  batch.update(doc(jutsuCastsCol(tableId), cast.id), { status: 'resolved', resultSummary })
  await batch.commit()
}

/**
 * Dano em ficha temporária fora do lançamento (a lista de combate, o − da
 * ficha). Mesma regra do zero: clone e invocação somem, marionete quebra.
 */
export async function applyCompanionHp(tableId: string, companion: Companion, hpAfter: number) {
  const novo = Math.max(0, Math.min(companion.hp.max, hpAfter))
  if (novo > 0) {
    await updateCompanion(tableId, companion.id, { hp: { ...companion.hp, current: novo } })
    return
  }
  if (companion.kind === 'puppet') {
    await updateCompanion(tableId, companion.id, { hp: { ...companion.hp, current: 0 }, status: 'broken' })
    return
  }
  await deleteCompanion(tableId, companion.id)
}

export async function denyJutsuCast(tableId: string, castId: string, gmName: string, reason: string) {
  await updateDoc(doc(jutsuCastsCol(tableId), castId), stripUndefined({ status: 'denied', resolvedBy: gmName, deniedReason: reason }))
}

/* ---------------------------------------------------------------------------
 * Mesa de som: a trilha que o mestre guardou. Todos leem (o player de cada um
 * precisa saber o que tocar), só o mestre escreve.
 * ------------------------------------------------------------------------- */

export function soundCol(tableId: string) {
  return collection(requireDb(), 'tables', tableId, 'sound')
}

export async function saveSoundTrack(tableId: string, track: SoundTrack) {
  await setDoc(doc(soundCol(tableId), track.id), stripUndefined(track))
}

export async function deleteSoundTrack(tableId: string, id: string) {
  await deleteDoc(doc(soundCol(tableId), id))
}

export function listenSoundTracks(tableId: string, cb: (tracks: SoundTrack[]) => void) {
  const q = query(soundCol(tableId), orderBy('createdAt', 'asc'))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as SoundTrack)), defaultOnError('mesa de som'))
}

export function listenLog(tableId: string, cb: (entries: LogEntry[]) => void, max = 150) {
  const q = query(logCol(tableId), orderBy('ts', 'desc'), limit(max))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as LogEntry)), defaultOnError('registro da mesa'))
}
