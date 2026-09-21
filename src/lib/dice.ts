export interface RollResult {
  notation: string
  rolls: number[]
  diceTotal: number
  modifier: number
  total: number
}

/** Rola uma notação simples "NdM+K" (ex: "2d6+1"). Usado no log de ações
 * livres e no rolador de dano da ficha — não resolve nenhuma mecânica
 * automaticamente, só ajuda a rolar e registrar. */
export function rollDice(notation: string): RollResult {
  const match = notation.trim().toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/)
  if (!match) {
    throw new Error('Notação de dado inválida. Use algo como "2d6" ou "1d20+3".')
  }
  const count = Math.min(20, Math.max(1, Number(match[1] || '1')))
  const sides = Math.min(1000, Math.max(2, Number(match[2])))
  const modifier = Number(match[3] || '0')

  const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides))
  const diceTotal = rolls.reduce((a, b) => a + b, 0)

  return { notation, rolls, diceTotal, modifier, total: diceTotal + modifier }
}

export interface D20RollResult {
  roll: number
  modifier: number
  proficiencyBonus: number
  total: number
  isCritical: boolean
  isFumble: boolean
  /** Os dois d20 quando houve vantagem/desvantagem; `roll` é o que valeu. */
  bothRolls?: [number, number]
  edge?: Edge
}

/** Vantagem: rola dois d20 e fica com o melhor; desvantagem, com o pior. */
export type Edge = 'none' | 'advantage' | 'disadvantage'

/** 1d20 + Modificador de Atributo + Bônus de Proficiência (se treinado) —
 * a fórmula única de teste/ataque do sistema (ver docs/rules/05-combate.md
 * e 09-outras-mecanicas.md). O app não sabe contra o que comparar (CA ou
 * PR do alvo) — isso fica a critério da mesa, lendo o total no log. */
export function rollD20(
  modifier: number,
  proficient: boolean,
  proficiencyBonus: number,
  edge: Edge = 'none',
): D20RollResult {
  const d20 = () => 1 + Math.floor(Math.random() * 20)
  const a = d20()
  const b = edge === 'none' ? a : d20()
  const roll = edge === 'advantage' ? Math.max(a, b) : edge === 'disadvantage' ? Math.min(a, b) : a
  const bonus = proficient ? proficiencyBonus : 0
  return {
    roll,
    modifier,
    proficiencyBonus: bonus,
    total: roll + modifier + bonus,
    isCritical: roll === 20,
    isFumble: roll === 1,
    bothRolls: edge === 'none' ? undefined : [a, b],
    edge,
  }
}

/** Dano em acerto crítico: "dados de dano × Bônus de Proficiência"
 * (fórmula literal do manual — atípica em relação ao "dobrar os dados"
 * padrão de D&D, confirmada intencional pelo usuário). O modificador plano
 * do dano NÃO é multiplicado, só o total dos dados rolados. */
export function applyCriticalMultiplier(result: RollResult, proficiencyBonus: number): RollResult {
  const multipliedDice = result.diceTotal * proficiencyBonus
  return { ...result, diceTotal: multipliedDice, total: multipliedDice + result.modifier }
}
