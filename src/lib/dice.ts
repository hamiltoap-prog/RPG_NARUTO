export interface RollResult {
  notation: string
  rolls: number[]
  total: number
}

/** Rola uma notação simples "NdM+K" (ex: "2d6+1"). Usado no log de ações
 * livres — não representa nenhuma mecânica de teste/ataque específica do
 * sistema (essas fórmulas entram quando as regras definitivas chegarem). */
export function rollDice(notation: string): RollResult {
  const match = notation.trim().toLowerCase().match(/^(\d*)d(\d+)([+-]\d+)?$/)
  if (!match) {
    throw new Error('Notação de dado inválida. Use algo como "2d6" ou "1d20+3".')
  }
  const count = Math.min(20, Math.max(1, Number(match[1] || '1')))
  const sides = Math.min(1000, Math.max(2, Number(match[2])))
  const modifier = Number(match[3] || '0')

  const rolls = Array.from({ length: count }, () => 1 + Math.floor(Math.random() * sides))
  const total = rolls.reduce((a, b) => a + b, 0) + modifier

  return { notation, rolls, total }
}
