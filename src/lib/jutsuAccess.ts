import { JUTSU_CATALOG } from '../data/jutsus'
import type { CharClass, Clan, JutsuCatalogEntry } from '../types'

/**
 * Quem pode aprender o quê.
 *
 * O manual tranca um jutsu por três portas independentes, e todas precisam
 * estar abertas:
 *   1. RANK — cresce com o nível, pela tabela da classe (D no 1º, C no 5º,
 *      B no 9º, A no 13º, S no 17º, igual nas oito classes);
 *   2. CLÃ — Hijutsu é do clã e de mais ninguém;
 *   3. ELEMENTO — "Palavras-chave de Liberação (Terra/Vento/Fogo/Água/
 *      Relâmpago) exigem afinidade de natureza correspondente, obtida via
 *      Clã, Classe ou o Talento Liberação de Natureza" (04-jutsus.md).
 *
 * O que não passa por nenhuma dessas portas — Genjutsu, Taijutsu, Bukijutsu e
 * Ninjutsu sem elemento — só depende do rank.
 */

export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'] as const
export type Rank = (typeof RANKS)[number]

/** O catálogo veio do manual com as duas grafias ("Rank-D" e "Rank D"). */
export function normalizeRank(raw: string | undefined): Rank {
  const letra = (raw ?? '').trim().toUpperCase().replace(/^RANK[\s-]*/, '').charAt(0)
  return (RANKS as readonly string[]).includes(letra) ? (letra as Rank) : 'D'
}

export function rankIndex(rank: Rank): number {
  return RANKS.indexOf(rank)
}

export const ELEMENTS = ['Fogo', 'Água', 'Terra', 'Vento', 'Relâmpago'] as const
export type Element = (typeof ELEMENTS)[number]

/**
 * Afinidades que o clã já dá de graça.
 *
 * Lida do próprio texto de traços do clã ("Afinidade Passiva: Liberação de
 * Fogo."), e não de uma lista fixa aqui — assim um clã que o mestre inventou
 * concede afinidade exatamente como um do manual, sem o app precisar conhecer
 * o nome dele.
 */
export function clanElements(clan: Pick<Clan, 'featuresText'> | undefined): Element[] {
  if (!clan?.featuresText) return []
  const m = clan.featuresText.match(/Afinidade Passiva:\s*([^.\n]+)/i)
  if (!m) return []
  return ELEMENTS.filter((el) => new RegExp(el, 'i').test(m[1]))
}

/** O elemento exigido por um jutsu, ou nulo se ele não exige nenhum. */
export function jutsuElement(entry: Pick<JutsuCatalogEntry, 'category' | 'keywords'>): Element | null {
  const texto = `${entry.category} ${entry.keywords ?? ''}`
  for (const el of ELEMENTS) {
    // "Estilo Fogo" na categoria, "Liberação de Fogo" nas palavras-chave.
    if (new RegExp(`(Estilo|Libera[çc][ãa]o)\\s+(de\\s+)?${el}`, 'i').test(texto)) return el
  }
  return null
}

/** Maior rank que a classe libera naquele nível. */
export function maxRankForLevel(charClass: CharClass | undefined, level: number): Rank {
  const entrada = charClass?.progression
    ?.filter((p) => p.level <= level)
    .sort((a, b) => b.level - a.level)
    .find((p) => p.maxRank)
  if (entrada?.maxRank) return normalizeRank(entrada.maxRank)
  // Sem tabela: o padrão comum do manual (06-progressao.md).
  if (level >= 17) return 'S'
  if (level >= 13) return 'A'
  if (level >= 9) return 'B'
  if (level >= 5) return 'C'
  return 'D'
}

/** Quantos jutsus a classe deixa conhecer naquele nível (0 = sem limite na tabela). */
export function jutsusKnownForLevel(charClass: CharClass | undefined, level: number): number {
  const entrada = charClass?.progression
    ?.filter((p) => p.level <= level)
    .sort((a, b) => b.level - a.level)
    .find((p) => p.jutsusKnown)
  return entrada?.jutsusKnown ?? 0
}

export interface LearnerContext {
  clanId: string
  /** Afinidades elementais do personagem (clã + classe + talentos). */
  elements: string[]
  maxRank: Rank
}

/** As afinidades que valem: as do clã somadas às do próprio personagem. */
export function effectiveElements(clan: Pick<Clan, 'featuresText'> | undefined, granted: string[] | undefined): Element[] {
  const todas = new Set<Element>(clanElements(clan))
  for (const e of granted ?? []) {
    const casa = ELEMENTS.find((x) => x.toLowerCase() === e.toLowerCase())
    if (casa) todas.add(casa)
  }
  return [...todas]
}

export type Blocker = { ok: true } | { ok: false; reason: string }

export function canLearn(entry: JutsuCatalogEntry, ctx: LearnerContext): Blocker {
  const rank = normalizeRank(entry.rank)
  if (rankIndex(rank) > rankIndex(ctx.maxRank)) {
    return { ok: false, reason: `Rank ${rank} — seu nível libera até Rank ${ctx.maxRank}.` }
  }
  if (entry.clanId && entry.clanId !== ctx.clanId) {
    return { ok: false, reason: 'Hijutsu de outro clã.' }
  }
  const el = jutsuElement(entry)
  if (el && !ctx.elements.some((x) => x.toLowerCase() === el.toLowerCase())) {
    return { ok: false, reason: `Exige afinidade com ${el}.` }
  }
  return { ok: true }
}

/** Os jutsus que o personagem pode aprender agora, em ordem alfabética. */
export function eligibleJutsus(ctx: LearnerContext): JutsuCatalogEntry[] {
  return JUTSU_CATALOG.filter((j) => canLearn(j, ctx).ok).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}
