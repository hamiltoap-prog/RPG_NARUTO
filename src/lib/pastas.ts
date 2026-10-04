/**
 * Pastas e subpastas.
 *
 * Pasta aqui **não é documento**: é um caminho repetido nos itens — o campo
 * `folder` guarda `"Cena 01/Konoha"`, e é isso que põe a "Sala do Hokage"
 * dentro de Konoha, dentro de Cena 01. A árvore é montada na hora, a partir
 * dos itens. Daí vêm as três propriedades que uma mesa espera de pasta sem ter
 * nada a administrar:
 *
 *  - pasta vazia some sozinha (não sobra lixo esquecido);
 *  - renomear ou mover uma pasta é trocar o começo do caminho em todos os
 *    itens dela — subpastas incluídas;
 *  - o mesmo código serve para cenas, NPCs, criaturas e histórias: qualquer
 *    coisa com um `folder`.
 *
 * Itens gravados antes das subpastas têm um nome só (`"Konoha"`) — que é
 * exatamente um caminho de um nível. Nada a migrar.
 */

/** O separador gravado. Na tela aparece como "›". */
export const SEPARADOR = '/'

/** O rótulo dos itens soltos, fora de qualquer pasta. Não é gravado. */
export const SEM_PASTA = 'Sem pasta'

/**
 * Caminho limpo: aceita o que a pessoa digita — "Cena 01 > Konoha",
 * "Cena 01 / Konoha", "Cena 01 › Konoha" — e devolve "Cena 01/Konoha".
 * Pedaço vazio sai; espaço em volta de cada pedaço sai.
 */
export function normalizarCaminho(bruto: string | undefined | null): string {
  if (!bruto) return ''
  return bruto
    .split(/\s*[/>›\\]\s*/)
    .map((p) => p.trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(SEPARADOR)
}

export function partesDo(caminho: string | undefined): string[] {
  const c = normalizarCaminho(caminho)
  return c ? c.split(SEPARADOR) : []
}

/** "Cena 01/Konoha" → "Cena 01 › Konoha". */
export function mostrarCaminho(caminho: string | undefined): string {
  const partes = partesDo(caminho)
  return partes.length ? partes.join(' › ') : SEM_PASTA
}

/** O último nome do caminho: "Cena 01/Konoha" → "Konoha". */
export function nomeDaPasta(caminho: string): string {
  const partes = partesDo(caminho)
  return partes[partes.length - 1] ?? ''
}

/** A pasta de cima: "Cena 01/Konoha" → "Cena 01"; de primeiro nível → "". */
export function pastaDeCima(caminho: string): string {
  return partesDo(caminho).slice(0, -1).join(SEPARADOR)
}

/** O item está nesta pasta ou em alguma subpasta dela? */
export function estaDentro(caminhoDoItem: string | undefined, pasta: string): boolean {
  const c = normalizarCaminho(caminhoDoItem)
  const p = normalizarCaminho(pasta)
  if (!p) return true
  return c === p || c.startsWith(p + SEPARADOR)
}

const comparar = (a: string, b: string) => a.localeCompare(b, 'pt', { sensitivity: 'base', numeric: true })

/** Todas as pastas que existem, com as de cima incluídas, em ordem de árvore. */
export function todasAsPastas(caminhos: readonly (string | undefined)[]): string[] {
  const todas = new Set<string>()
  for (const c of caminhos) {
    const partes = partesDo(c)
    for (let i = 1; i <= partes.length; i++) todas.add(partes.slice(0, i).join(SEPARADOR))
  }
  return [...todas].sort((a, b) => {
    const pa = a.split(SEPARADOR)
    const pb = b.split(SEPARADOR)
    for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
      const c = comparar(pa[i], pb[i])
      if (c !== 0) return c
    }
    return pa.length - pb.length
  })
}

export interface NoDaPasta<T> {
  /** Caminho completo; "" na raiz. */
  caminho: string
  nome: string
  subpastas: NoDaPasta<T>[]
  /** Itens diretamente nesta pasta. */
  itens: T[]
  /** Itens aqui e em todas as subpastas. */
  total: number
}

/**
 * Monta a árvore. A raiz guarda os itens soltos e as pastas de primeiro
 * nível; cada lista sai em ordem (pastas por nome, itens por `rotulo`).
 */
export function montarArvore<T>(
  itens: readonly T[],
  pastaDe: (item: T) => string | undefined,
  rotulo: (item: T) => string,
): NoDaPasta<T> {
  const raiz: NoDaPasta<T> = { caminho: '', nome: '', subpastas: [], itens: [], total: 0 }
  const porCaminho = new Map<string, NoDaPasta<T>>([['', raiz]])

  const no = (caminho: string): NoDaPasta<T> => {
    const existente = porCaminho.get(caminho)
    if (existente) return existente
    const pai = no(pastaDeCima(caminho))
    const novo: NoDaPasta<T> = { caminho, nome: nomeDaPasta(caminho), subpastas: [], itens: [], total: 0 }
    pai.subpastas.push(novo)
    porCaminho.set(caminho, novo)
    return novo
  }

  for (const item of itens) {
    const caminho = normalizarCaminho(pastaDe(item))
    no(caminho).itens.push(item)
    // Conta o item em todas as pastas do caminho.
    const partes = partesDo(caminho)
    raiz.total++
    for (let i = 1; i <= partes.length; i++) porCaminho.get(partes.slice(0, i).join(SEPARADOR))!.total++
  }

  const ordenar = (n: NoDaPasta<T>) => {
    n.subpastas.sort((a, b) => comparar(a.nome, b.nome))
    n.itens.sort((a, b) => comparar(rotulo(a), rotulo(b)))
    n.subpastas.forEach(ordenar)
  }
  ordenar(raiz)
  return raiz
}

/**
 * O caminho do item depois de a pasta `de` virar `para` — renomear e mover
 * são a mesma operação. Devolve `null` quando o item não está na pasta
 * (nada a gravar).
 *
 * `para` vazio põe o conteúdo da pasta na raiz. Mover uma pasta para dentro
 * dela mesma é recusado (`null`): sumiria com a árvore.
 */
export function caminhoDepoisDeMover(caminhoDoItem: string | undefined, de: string, para: string): string | null {
  const c = normalizarCaminho(caminhoDoItem)
  const origem = normalizarCaminho(de)
  const destino = normalizarCaminho(para)
  if (!origem || !estaDentro(c, origem)) return null
  if (destino !== origem && estaDentro(destino, origem)) return null
  const resto = c.slice(origem.length).replace(/^\//, '')
  return [destino, resto].filter(Boolean).join(SEPARADOR)
}

/** "Mover a pasta Konoha para dentro de Cena 01": o caminho novo dela. */
export function destinoDaPasta(pasta: string, novaPastaDeCima: string): string {
  return [normalizarCaminho(novaPastaDeCima), nomeDaPasta(pasta)].filter(Boolean).join(SEPARADOR)
}

/** Para gravar: caminho vazio vira `undefined` (o campo sai do documento). */
export function paraGravar(caminho: string | undefined | null): string | undefined {
  return normalizarCaminho(caminho) || undefined
}
