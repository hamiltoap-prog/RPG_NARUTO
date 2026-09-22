import { JUTSU_CATALOG } from '../data/jutsus'
import { SUMMON_BESTIARY } from '../data/summons'
import { newId } from './id'
import { attackAttribute, findCatalogEntry, readArea, readJutsu } from './jutsuCast'
import type { CastMode } from './jutsuCast'
import { summonSize } from './summon'
import { SUMMON_RANKS } from '../types'
import type {
  AttributeKey,
  Attributes,
  Character,
  Companion,
  JutsuCatalogEntry,
  Modifiers,
  NpcAttack,
  PuppetSpec,
  SummonSizeKey,
} from '../types'

/**
 * Clones e invocações como fichas de verdade.
 *
 * Um clone das sombras não é um efeito: é um corpo com PV, CA e chakra que
 * age no turno de quem o criou. Antes isso vivia na cabeça da mesa — quem
 * lançava anotava "tenho 4 clones com 1 PV" num papel. Agora cada um vira uma
 * ficha temporária que o próprio dono controla, e uma peça ao lado da dele no
 * mapa.
 *
 * O que este módulo faz é ler da descrição do jutsu o que der, do mesmo jeito
 * honesto do `jutsuCast`: quantos clones, quanto de PV, de onde vem a CA e o
 * chakra, quanto custa cada um. O que não der para ler fica à vista e
 * editável antes de criar.
 */

const NUMEROS: Record<string, number> = {
  um: 1, uma: 1, dois: 2, duas: 2, tres: 3, quatro: 4, cinco: 5,
  seis: 6, sete: 7, oito: 8, nove: 9, dez: 10,
}

function semAcento(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

function lerNumero(bruto: string | undefined): number | undefined {
  if (!bruto) return undefined
  const n = Number(bruto)
  if (Number.isFinite(n)) return n
  return NUMEROS[semAcento(bruto)]
}

/** De onde sai a CA do clone, conforme o jutsu descreve. */
export type CloneArmorSource =
  | { from: 'attribute'; attribute: AttributeKey }
  | { from: 'owner' }
  | { from: 'fixed'; value: number }

export interface CloneReading {
  /** Quantos o jutsu deixa criar de uma vez. */
  maxClones: number
  /** PV de cada clone. Ausente = o jutsu não descreve um corpo com ficha. */
  hp?: number
  armor: CloneArmorSource
  /** 'none' = sem chakra; 'chakraDie' = o maior dado de chakra do dono. */
  chakra: 'none' | 'chakraDie'
  /** Chakra por clone, quando o jutsu cobra por unidade. */
  costPerClone?: number
  /** O jutsu diz que o dano dos jutsus do clone sai pela metade. */
  halfDamage: boolean
  /** Duração literal do jutsu, para a ficha lembrar quando acaba. */
  duration: string
  /**
   * Falso quando a descrição não traz um clone com PV próprio — "Clone de
   * Névoa" faz duplicatas estáticas, "Clone Mental" é outra coisa. Nesses
   * casos o app não finge que sabe e pede os números.
   */
  sheetWorthy: boolean
  /**
   * O jutsu diz que o clone não carrega armas nem ferramentas (é o caso do
   * Clone de Inseto). Sem isso, ele sairia com a mochila do original.
   */
  noWeapons: boolean
  /**
   * O jutsu diz que o clone não ataca nem conjura (o Clone Explosivo só
   * existe para explodir). Ele entra em campo, ocupa espaço e leva dano, mas
   * não tem ação nenhuma.
   */
  noActions: boolean
}

/** Todos os jutsus de clone do catálogo. */
export function cloneJutsus(): JutsuCatalogEntry[] {
  return JUTSU_CATALOG.filter((j) => /clone/i.test(j.name))
}

export function isCloneJutsu(name: string): boolean {
  return /clone/i.test(name)
}

/** O jutsu que invoca criaturas (Kuchiyose). */
export function isSummonJutsu(name: string): boolean {
  return /invoca[çc][ãa]o|kuchiyose/i.test(name)
}

/** Lê da descrição o que o clone é. */
export function readClone(entry: Pick<JutsuCatalogEntry, 'description' | 'cost' | 'duration'>): CloneReading {
  const d = entry.description ?? ''
  const plano = semAcento(d)

  // "Você pode criar até 4 clones", "criar até dois clones", "cria 2
  // duplicatas", "só pode criar um único clone".
  const quantos =
    lerNumero(plano.match(/at[ée]\s+(\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\s+clones/)?.[1]) ??
    lerNumero(plano.match(/cri[ae]\s+(\d+|um|uma|dois|duas|tres|quatro|cinco|seis|sete|oito|nove|dez)\s+(?:clones|duplicatas)/)?.[1]) ??
    (/(?:um|unico)\s+clone|clone\s+de\s+si\s+mesmo/.test(plano) ? 1 : undefined)

  // "1 ponto de vida", "5 pontos de vida", "1 PV".
  const pv =
    lerNumero(d.match(/(\d+)\s*pontos?\s+de\s+vida/i)?.[1]) ??
    lerNumero(d.match(/(\d+)\s*PV\b/)?.[1])

  // "CA igual à seu atributo de Inteligência" (o valor BRUTO), "CA igual à
  // sua" (a do dono), "Possui 10 de CA".
  const porAtributo = d.match(/CA[^.]{0,30}?atributo\s+de\s+(For[çc]a|Destreza|Constitui[çc][ãa]o|Intelig[êe]ncia|Sabedoria|Carisma)/i)
  const fixa = d.match(/(?:possui|tem)\s+(\d+)\s+de\s+CA/i)
  const armor: CloneArmorSource = porAtributo
    ? { from: 'attribute', attribute: ATRIBUTO_POR_NOME[semAcento(porAtributo[1])] }
    : fixa
      ? { from: 'fixed', value: Number(fixa[1]) }
      : { from: 'owner' }

  const semChakra = /nenhum chakra|nao possui chakra/.test(plano)
  const comDado = /chakra tempor[aá]ri/.test(plano)

  const porClone =
    lerNumero(d.match(/\((\d+)\s*de\s*chakra\s*cada\)/i)?.[1]) ??
    lerNumero(d.match(/(\d+)\s*de\s*chakra\s*por\s*clone/i)?.[1]) ??
    lerNumero(d.match(/cada\s+um\s+custando\s+(\d+)\s*chakra/i)?.[1])

  return {
    maxClones: quantos ?? 1,
    hp: pv,
    armor,
    chakra: comDado && !semChakra ? 'chakraDie' : 'none',
    costPerClone: porClone,
    halfDamage: /metade do dano/.test(plano),
    duration: entry.duration ?? '',
    sheetWorthy: pv !== undefined,
    noWeapons: /nao possui armas|sem armas ou ferramentas/.test(plano),
    noActions: /nao pode realizar acoes de ataque nem conjurar/.test(plano),
  }
}

const ATRIBUTO_POR_NOME: Record<string, AttributeKey> = {
  forca: 'strength',
  destreza: 'dexterity',
  constituicao: 'constitution',
  inteligencia: 'intelligence',
  sabedoria: 'wisdom',
  carisma: 'charisma',
}

/** Maior dado de chakra do dono, em número ("d8" -> 8). */
export function biggestChakraDie(chakraDie: string | undefined): number {
  const n = Number((chakraDie ?? '').replace(/^d/i, ''))
  return Number.isFinite(n) && n > 0 ? n : 6
}

/** CA do clone, resolvida contra a ficha de quem o criou. */
export function cloneArmorClass(
  armor: CloneArmorSource,
  owner: { armorClass: number; attributes: Attributes },
): number {
  if (armor.from === 'fixed') return armor.value
  if (armor.from === 'owner') return owner.armorClass
  // Atenção: o manual diz "CA igual à seu ATRIBUTO de Inteligência" — a
  // pontuação crua, não o modificador. Um ninja com Inteligência 16 faz
  // clones de CA 16.
  return owner.attributes[armor.attribute]
}

export interface BuildCloneInput {
  owner: Character
  ownerUid: string
  jutsuName: string
  reading: CloneReading
  count: number
  /** Maior dado de chakra da classe do dono, ex. "d8". */
  chakraDie?: string
}

/** Monta as fichas dos clones a partir da ficha de quem os criou. */
export function buildClones(input: BuildCloneInput): Companion[] {
  const { owner, reading } = input
  const ca = cloneArmorClass(reading.armor, owner)
  const chakraMax = reading.chakra === 'chakraDie' ? biggestChakraDie(input.chakraDie) : 0
  const pv = reading.hp ?? 1
  return Array.from({ length: Math.max(1, input.count) }, (_, i) => ({
    id: newId(),
    tableId: owner.tableId,
    kind: 'clone' as const,
    ownerCharacterId: owner.id,
    ownerName: owner.name,
    ownerUid: input.ownerUid,
    name: `Clone de ${owner.name} ${i + 1}`,
    sourceJutsu: input.jutsuName,
    hp: { current: pv, max: pv },
    chakra: { current: chakraMax, max: chakraMax },
    armorClass: ca,
    // "Se forçar um teste de resistência, os pontos de resistência dele são
    // iguais aos seus" — o clone resiste como o original.
    resistancePoints: owner.resistancePoints,
    modifiers: owner.modifiers,
    proficiencyBonus: owner.proficiencyBonus,
    // O clone usa os jutsus do dono, menos outros clones (o manual é
    // explícito: "exceto os que tenham Clone no nome").
    jutsus: reading.noActions ? [] : owner.jutsus.filter((j) => !isCloneJutsu(j.name)),
    // É uma cópia de uma pessoa: soca e usa as ferramentas que o original
    // tem na mão. O que o clone arremessa não sai da mochila do original —
    // some junto com ele.
    weapons: reading.noWeapons || reading.noActions ? [] : (owner.weapons ?? []).filter((w) => w.equipped),
    // Ataque desarmado do manual: 1 + Modificador de Força (05-combate.md).
    unarmedDamage: reading.noActions ? 0 : Math.max(1, 1 + owner.modifiers.strength),
    halfDamage: reading.halfDamage,
    duration: reading.duration,
    imageUrl: owner.imageUrl || undefined,
    notes: '',
    createdAt: Date.now(),
  }))
}

export interface BuildSummonInput {
  owner: Character
  ownerUid: string
  tribeId: string
  rankIndex: number
  size: SummonSizeKey
}

/** Média de um dado, para o PV da invocação sem obrigar ninguém a rolar. */
function mediaDoDado(notacao: string): number {
  const lados = Number((notacao ?? '').replace(/^d/i, '')) || 6
  return Math.floor(lados / 2) + 1
}

/**
 * Nomes das armas naturais, que no manual vêm como títulos soltos antes da
 * descrição ("Garras", "Mordida").
 */
function armasNaturais(texto: string): string[] {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && l.length < 28 && !/[.:]$/.test(l) && !/^(ataque|dano|alcance)/i.test(l))
    .slice(0, 3)
}

/**
 * Monta a ficha de uma criatura invocada por um personagem.
 *
 * Usa o subsistema do Kuchiyose: CA, PR, bônus de ataque e dado de dano vêm
 * da tabela de Modificadores de Tamanho, e o bônus de ataque soma o da tribo.
 */
export function buildSummon(input: BuildSummonInput): Companion | null {
  const tribo = SUMMON_BESTIARY.find((c) => c.id === input.tribeId)
  if (!tribo) return null
  const rank = SUMMON_RANKS[input.rankIndex] ?? SUMMON_RANKS[0]
  const t = summonSize(input.size)
  const pv = Math.round(rank.dice * mediaDoDado(tribo.hitDie))
  const chakra = Math.round(rank.dice * mediaDoDado(tribo.chakraDie))
  const modAtaque = Number(tribo.attackModifier.replace(/[^\d-]/g, '')) || 3
  const golpes: NpcAttack[] = armasNaturais(tribo.naturalWeapons).map((nome) => ({
    id: newId(),
    name: nome,
    bonus: modAtaque + t.attackBonus,
    damage: t.damageDie,
  }))
  const zero: Modifiers = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }
  return {
    id: newId(),
    tableId: input.owner.tableId,
    kind: 'summon',
    ownerCharacterId: input.owner.id,
    ownerName: input.owner.name,
    ownerUid: input.ownerUid,
    name: `${tribo.name} (Rank ${rank.rank} · ${rank.title})`,
    sourceJutsu: 'Técnica de Invocação',
    hp: { current: pv, max: pv },
    chakra: { current: chakra, max: chakra },
    armorClass: 10 + t.acBonus,
    resistancePoints: t.resistancePoints,
    modifiers: zero,
    proficiencyBonus: 3,
    attacks: golpes.length > 0 ? golpes : [{ id: newId(), name: 'Arma Natural', bonus: modAtaque + t.attackBonus, damage: t.damageDie }],
    summonSize: input.size,
    attackModifier: modAtaque,
    halfDamage: false,
    duration: `Tribo ${tribo.summonType} · ${rank.dice} DV / ${rank.dice} DC · custo ${rank.cost} de chakra`,
    notes: tribo.specialFeatures,
    createdAt: Date.now(),
  }
}

/** Custo em chakra de uma invocação, pela tabela de rank. */
export function summonCost(rankIndex: number): number {
  return (SUMMON_RANKS[rankIndex] ?? SUMMON_RANKS[0]).cost
}

/* ---------------------------------------------------------------------------
 * O que uma ficha temporária sabe fazer
 * ------------------------------------------------------------------------- */

/** Uma ação pronta para virar pedido de lançamento. */
export interface CompanionAction {
  id: string
  label: string
  source: 'unarmed' | 'weapon' | 'attack' | 'jutsu' | 'puppetJutsu'
  mode: CastMode
  /** Atributo da rolagem. Para o clone e a invocação é o próprio; para a
   * marionete é o do dono, porque quem manobra é o ninja. */
  attackAttribute: AttributeKey
  saveAttribute?: AttributeKey
  proficient: boolean
  /** Bônus plano do golpe, somado à rolagem. */
  extraBonus?: number
  damage?: string
  damageType?: string
  chakraCost: number
  /** Jutsu de clone sai pela metade do dano (regra do manual). */
  damageHalved?: boolean
  onSaveSuccess?: 'none' | 'half'
  /** Condições que a ação impõe, lidas do manual ou forjadas pelo mestre. */
  conditions?: string[]
  conditionRounds?: number
  /** Como a descrição fala da área, quando o golpe pega mais de um. */
  area?: string
  note?: string
}

/**
 * Tudo que a ficha temporária pode fazer neste turno, já com a conta montada.
 *
 * Cada tipo rola de um jeito, e a diferença importa:
 *
 *  - **invocação**: a arma natural já vem com o bônus fechado (modificador da
 *    tribo + bônus do tamanho), então a rolagem é d20 + esse bônus, sem
 *    atributo nem proficiência por cima — é o que a seção de Kuchiyose manda;
 *  - **clone**: usa os jutsus do dono com os modificadores do dono (o clone é
 *    cópia), e o dano do jutsu sai pela metade;
 *  - **marionete**: o golpe soma o bônus próprio à rolagem do DONO, e o
 *    chakra do jutsu sai da ficha dele.
 */
export function companionActions(c: Companion): CompanionAction[] {
  const acoes: CompanionAction[] = []

  // Soco. O clone é cópia de uma pessoa, e pessoa soca: "Ataque desarmado =
  // 1 + Modificador de Força" (05-combate.md).
  if (c.unarmedDamage && c.unarmedDamage > 0) {
    acoes.push({
      id: 'unarmed',
      label: `Ataque desarmado · ${c.unarmedDamage} de dano`,
      source: 'unarmed',
      mode: 'attack',
      attackAttribute: 'strength',
      proficient: true,
      damage: String(c.unarmedDamage),
      damageType: 'Contusão',
      chakraCost: 0,
      note: '1 + Modificador de Força',
    })
  }

  // Ferramentas ninja que o clone carrega.
  for (const w of c.weapons ?? []) {
    const distancia = /Arremesso|Alcance/i.test(w.properties ?? '')
    const acuidade = /Acuidade/i.test(w.properties ?? '')
    acoes.push({
      id: `weapon:${w.id}`,
      label: `${w.name} · ${w.damage}${(w.quantity ?? 1) > 1 ? ` (${w.quantity})` : ''}`,
      source: 'weapon',
      mode: 'attack',
      attackAttribute: distancia || acuidade ? 'dexterity' : 'strength',
      proficient: true,
      damage: w.damage,
      damageType: w.damageType,
      chakraCost: 0,
      note: w.consumable ? 'a ferramenta do clone some com ele; não sai da sua mochila' : undefined,
    })
  }

  for (const a of c.attacks ?? []) {
    const daTribo = c.kind === 'summon'
    acoes.push({
      id: `attack:${a.id}`,
      label: `${a.name} ${a.bonus >= 0 ? '+' : ''}${a.bonus} · ${a.damage}`,
      source: 'attack',
      mode: 'attack',
      // Invocação não soma atributo: o bônus da tribo já é a conta inteira.
      attackAttribute: daTribo ? 'strength' : 'dexterity',
      proficient: !daTribo,
      extraBonus: a.bonus,
      damage: a.damage,
      damageType: a.damageType,
      chakraCost: 0,
      note: daTribo ? 'arma natural: o bônus da tribo e do tamanho já estão na conta' : undefined,
    })
  }

  for (const j of c.jutsus ?? []) {
    const entrada = findCatalogEntry(j.name)
    if (!entrada) continue
    const lido = readJutsu(entrada)
    acoes.push({
      id: `jutsu:${j.id}`,
      label: `${j.name}${lido.cost ? ` (${lido.cost} chakra)` : ''}`,
      source: 'jutsu',
      mode: lido.mode,
      attackAttribute: attackAttribute(entrada.classification),
      saveAttribute: lido.saveAttribute,
      proficient: true,
      damage: lido.damage,
      damageType: lido.damageType,
      chakraCost: lido.cost,
      damageHalved: c.halfDamage,
      conditions: lido.conditions,
      conditionRounds: lido.conditionRounds,
      area: lido.area,
      note: c.halfDamage ? 'jutsu de clone: o dano sai pela metade' : undefined,
    })
  }

  for (const j of c.ownJutsus ?? []) {
    acoes.push({
      id: `puppetJutsu:${j.id}`,
      label: `${j.name}${j.chakraCost ? ` (${j.chakraCost} chakra do dono)` : ''}`,
      source: 'puppetJutsu',
      mode: j.mode,
      attackAttribute: j.attackAttribute ?? 'dexterity',
      saveAttribute: j.saveAttribute,
      proficient: true,
      extraBonus: j.bonus,
      damage: j.damage,
      damageType: j.damageType,
      chakraCost: j.chakraCost,
      onSaveSuccess: j.onSaveSuccess,
      conditions: j.conditions,
      conditionRounds: j.conditionRounds,
      area: j.description ? readArea(j.description) : undefined,
      note: j.description,
    })
  }

  return acoes
}

/**
 * Chakra que volta para o dono ao desfazer a ficha: **metade do que sobrou**,
 * arredondado para baixo. Marionete não devolve nada — o chakra dela nunca
 * foi dela.
 */
export function refundOnDismiss(c: Companion): number {
  if (c.usesOwnerChakra || c.kind === 'puppet') return 0
  return Math.floor((c.chakra?.current ?? 0) / 2)
}

/** Põe a marionete forjada em campo, como ficha do dono. */
export function buildPuppet(input: {
  owner: Character
  ownerUid: string
  puppetItemId: string
  name: string
  spec: PuppetSpec
  description?: string
}): Companion | null {
  const spec = input.spec
  if (!spec) return null
  return {
    id: newId(),
    tableId: input.owner.tableId,
    kind: 'puppet',
    ownerCharacterId: input.owner.id,
    ownerName: input.owner.name,
    ownerUid: input.ownerUid,
    name: input.name,
    sourceJutsu: 'Manobra de marionete',
    hp: { current: spec.hp, max: spec.hp },
    // Marionete não tem chakra próprio: o que os jutsus dela gastam sai da
    // ficha de quem a manobra.
    chakra: { current: 0, max: 0 },
    armorClass: spec.armorClass,
    resistancePoints: spec.resistancePoints,
    modifiers: input.owner.modifiers,
    proficiencyBonus: input.owner.proficiencyBonus,
    attacks: spec.attacks,
    ownJutsus: spec.jutsus,
    gearText: spec.gearText,
    halfDamage: false,
    duration: 'Fica em campo até ser guardada ou quebrar',
    usesOwnerChakra: true,
    puppetItemId: input.puppetItemId,
    status: 'active',
    notes: input.description ?? '',
    createdAt: Date.now(),
  }
}
