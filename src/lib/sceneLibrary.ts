import type { SceneLibraryItem } from '../types'

/**
 * Pastas da biblioteca de cenas.
 *
 * Pasta aqui **não é documento**: é um nome repetido nos itens. Some sozinha
 * quando o último item sai, e renomear é reescrever o nome em todos. A mesa
 * ganha o que espera de pasta sem ter nada a administrar — nem pasta vazia
 * esquecida, nem faxina.
 */

/** O rótulo dos itens que ninguém guardou em pasta nenhuma. */
export const SEM_PASTA = 'Sem pasta'

/** O nome da pasta de um item, já aparado; vazio = solto. */
export function pastaDe(item: Pick<SceneLibraryItem, 'folder'>): string {
  return item.folder?.trim() ?? ''
}

/** As pastas que existem hoje, em ordem alfabética, com a solta por último. */
export function pastasDa(library: readonly SceneLibraryItem[]): string[] {
  const nomes = new Set<string>()
  let temSolto = false
  for (const i of library) {
    const p = pastaDe(i)
    if (p) nomes.add(p)
    else temSolto = true
  }
  const ordenadas = [...nomes].sort((a, b) => a.localeCompare(b, 'pt'))
  return temSolto ? [...ordenadas, SEM_PASTA] : ordenadas
}

/** Os itens de cada pasta, cada lista em ordem de nome. */
export function agruparPorPasta(library: readonly SceneLibraryItem[]): Map<string, SceneLibraryItem[]> {
  const m = new Map<string, SceneLibraryItem[]>()
  for (const i of library) {
    const p = pastaDe(i) || SEM_PASTA
    m.set(p, [...(m.get(p) ?? []), i])
  }
  for (const [, itens] of m) itens.sort((a, b) => a.label.localeCompare(b.label, 'pt'))
  return m
}
