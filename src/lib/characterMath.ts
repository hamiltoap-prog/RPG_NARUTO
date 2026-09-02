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

function dieValue(notation: string): number {
  const parts = notation.split('d')
  return Number(parts[1] ?? 6)
}

export interface DerivedStats {
  hp: number
  chakra: number
  armorClass: number
  proficiencyBonus: number
  modifiers: Modifiers
}

/** Réplica das fórmulas do protótipo anterior: PV = (dado de vida + mod. Constituição) * nível,
 * Chakra = (dado de chakra + mod. Constituição) * nível, CA = 10 + mod. Destreza + metade do bônus de proficiência. */
export function calculateDerivedStats(
  attributes: Attributes,
  charClass: CharClass,
  level: number,
): DerivedStats {
  const modifiers = calculateModifiers(attributes)
  const hitDieValue = dieValue(charClass.hitDie)
  const chakraDieValue = dieValue(charClass.chakraDie)

  const hp = Math.max(1, (hitDieValue + modifiers.constitution) * level)
  const chakra = Math.max(1, (chakraDieValue + modifiers.constitution) * level)

  const proficiencyBonus = getProficiencyBonus(level)
  const armorClass = 10 + modifiers.dexterity + Math.floor(proficiencyBonus / 2)

  return { hp, chakra, armorClass, proficiencyBonus, modifiers }
}

export function attributeKeysOrdered(): AttributeKey[] {
  return [...ATTRIBUTE_KEYS]
}
