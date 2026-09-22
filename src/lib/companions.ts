import { JUTSU_CATALOG } from '../data/jutsus'
import { SUMMON_BESTIARY } from '../data/summons'
import { newId } from './id'
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
    jutsus: owner.jutsus.filter((j) => !isCloneJutsu(j.name)),
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
