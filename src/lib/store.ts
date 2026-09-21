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
  Character,
  CombatParticipant,
  BestiaryEntry,
  GMRoll,
  GameTable,
  LogEntry,
  Mission,
  NPC,
  RollRequest,
  Scene,
  SceneLibraryItem,
  ScenePing,
  SheetChangeRequest,
} from '../types'
import { newId, newTableCode } from './id'

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
  await updateTable(tableId, { combatActive: true, combatOrder: order, combatTurnIndex: 0 })
}

export async function endCombat(tableId: string) {
  await updateTable(tableId, { combatActive: false, combatOrder: [], combatTurnIndex: 0 })
}

export async function advanceCombatTurn(tableId: string, currentIndex: number, participantCount: number) {
  const nextIndex = participantCount > 0 ? (currentIndex + 1) % participantCount : 0
  await updateTable(tableId, { combatTurnIndex: nextIndex })
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
export async function findCharacterByName(tableId: string, name: string): Promise<Character | null> {
  const q = query(charactersCol(tableId), where('name', '==', name.trim()), limit(1))
  const snap = await getDocs(q)
  return snap.empty ? null : (snap.docs[0].data() as Character)
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

export function listenLog(tableId: string, cb: (entries: LogEntry[]) => void, max = 150) {
  const q = query(logCol(tableId), orderBy('ts', 'desc'), limit(max))
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as LogEntry)), defaultOnError('registro da mesa'))
}
