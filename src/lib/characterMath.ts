import { ATTRIBUTE_KEYS } from '../types'
import type { AttributeKey, Attributes, CharClass, Clan, Modifiers } from '../types'
import { getProficiencyBonus } from '../data/xpTable'

export function calculateModifier(score: number): number {
  return Math.floor((score - 10) / 2)
}

export function calculateModifiers(attributes: Attributes): Modifiers {
  const mods = {} as Modifiers
  for (const key of ATTRIBUTE_KEYS) {
    mods[key] = calculateModifier(attributes[key])
  }
  return mods
}

/** Soma o valor base escolhido pelo jogador aos bônus fixos do clã. */
export function totalAttributes(base: Attributes, clan: Clan | undefined): Attributes {
  const out = {} as Attributes
  for (const key of ATTRIBUTE_KEYS) {
    out[key] = base[key] + (clan?.bonuses[key] ?? 0)
  }
  return out
}

function dieSides(notation: string): number {
  const parts = notation.split('d')
  return Number(parts[1] ?? 6)
}

/** Valor médio de um dado (arredondado para cima), usado para o ganho de
 * PV/PC em níveis acima do 1º sem depender de rolagem aleatória. */
function averageDie(sides: number): number {
  return Math.floor(sides / 2) + 1
}

export interface DerivedStats {
  hp: number
  chakra: number
  armorClass: number
  proficiencyBonus: number
  resistancePoints: number
  modifiers: Modifiers
}

/** PV/PC no 1º nível = dado máximo + Mod. Constituição; cada nível
 * seguinte soma a média do dado + Mod. Constituição (sem rolagem, para não
 * depender de aleatoriedade — o Mestre pode ajustar manualmente na ficha se
 * preferir rolar de verdade). CA = 10 + bônus de armadura + Mod. Destreza +
 * metade do Bônus de Proficiência (arredondado para baixo). PR (Pontos de
 * Resistência) vem direto da tabela de progressão da classe. */
export function calculateDerivedStats(
  attributes: Attributes,
  charClass: CharClass,
  level: number,
  armorBonus = 0,
): DerivedStats {
  const modifiers = calculateModifiers(attributes)
  const clampedLevel = Math.min(20, Math.max(1, level))

  const hitDie = dieSides(charClass.hitDie)
  const chakraDie = dieSides(charClass.chakraDie)

  const hp = Math.max(
    1,
    hitDie + modifiers.constitution + (clampedLevel - 1) * (averageDie(hitDie) + modifiers.constitution),
  )
  const chakra = Math.max(
    1,
    chakraDie + modifiers.constitution + (clampedLevel - 1) * (averageDie(chakraDie) + modifiers.constitution),
  )

  const proficiencyBonus = getProficiencyBonus(clampedLevel)
  const progressionEntry =
    charClass.progression.find((p) => p.level === clampedLevel) ?? charClass.progression[charClass.progression.length - 1]
  const resistancePoints = progressionEntry?.resistancePoints ?? 15

  const armorClass = 10 + armorBonus + modifiers.dexterity + Math.floor(proficiencyBonus / 2)

  return { hp, chakra, armorClass, proficiencyBonus, resistancePoints, modifiers }
}

export function attributeKeysOrdered(): AttributeKey[] {
  return [...ATTRIBUTE_KEYS]
}
