// Postos shinobi e suas faixas de nível — docs/rules/06-progressao.md,
// "Faixas de nível por posto shinobi (guia para NPCs — Capítulo 15)".
export interface ShinobiRank {
  id: string
  label: string
  /** Faixa de nível do manual. O Estudante fica abaixo da tabela. */
  min: number
  max: number
}

export const SHINOBI_RANKS: ShinobiRank[] = [
  { id: 'estudante', label: 'Estudante da Academia', min: 0, max: 0 },
  { id: 'genin', label: 'Genin', min: 1, max: 4 },
  { id: 'chunin', label: 'Chunin', min: 5, max: 8 },
  { id: 'jonin', label: 'Jonin', min: 9, max: 12 },
  { id: 'kage', label: 'Kage', min: 13, max: 15 },
  { id: 'lendario', label: 'Shinobi Lendário', min: 16, max: 20 },
]

/**
 * O posto que a faixa de nível sugere. É sugestão, não regra: o manual
 * apresenta a tabela como "guia para NPCs", e a mesa continua livre para ter
 * um Jonin de nível 6 ou um Genin veterano de nível 9.
 */
export function suggestedRank(level: number): ShinobiRank {
  return SHINOBI_RANKS.find((r) => level >= r.min && level <= r.max) ?? SHINOBI_RANKS[SHINOBI_RANKS.length - 1]
}

/** Postos que existem no universo mas o manual não põe em faixa de nível. */
export const EXTRA_RANK_SUGGESTIONS = ['Tokubetsu Jonin', 'ANBU', 'Sannin', 'Ninja Renegado', 'Civil']
