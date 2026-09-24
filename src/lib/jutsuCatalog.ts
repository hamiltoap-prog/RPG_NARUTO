import { JUTSU_CATALOG } from '../data/jutsus'
import type { JutsuCatalogEntry } from '../types'

/**
 * O catálogo de jutsus que a mesa está usando: o do manual mais os da casa.
 *
 * O manual é constante e vive em `data/jutsus.ts`. Os jutsus que o mestre
 * escreve ficam no Firestore, por mesa, e chegam aqui por um `listen` — o
 * mesmo caminho dos clãs da casa.
 *
 * **Por que um registro de módulo e não uma prop.** O catálogo é lido em mais
 * de uma dúzia de lugares, muitos deles fundo de poço: `readClone` dentro de
 * `companions`, `findCatalogEntry` dentro de `jutsuCast`, a leitura de ações
 * de uma ficha temporária. Passar a lista por parâmetro até lá significaria
 * atravessar toda a cadeia de chamadas com um argumento que quase ninguém
 * usa. O preço desta escolha é estado global mutável, e ele só se paga porque
 * o app abre UMA mesa por aba: o registro é preenchido ao entrar na mesa e
 * limpo ao sair, e nunca existem dois catálogos ao mesmo tempo.
 *
 * Quem quiser a conta pura, sem o registro, chama `mergeJutsus` direto.
 */

let daCasa: JutsuCatalogEntry[] = []

/**
 * Quantas telas estão com o catálogo aberto.
 *
 * Mais de um componente assina ao mesmo tempo — o painel do mestre e a ficha
 * que ele abre por dentro dele, por exemplo. Sem esta contagem, fechar a ficha
 * esvaziava o catálogo enquanto o painel continuava aberto, e os jutsus da
 * casa sumiam da tela sem ninguém ter mexido neles. O `listen` do Firestore só
 * dispara quando o dado MUDA, então ninguém repunha a lista.
 */
let assinantes = 0

/**
 * Junta manual e casa. Jutsu da casa com o mesmo nome de um do manual SUBSTITUI
 * o do manual — é assim que a mesa corrige um texto sem editar o arquivo de
 * dados, e é o que a palavra "da casa" quer dizer.
 */
export function mergeJutsus(
  base: readonly JutsuCatalogEntry[],
  custom: readonly JutsuCatalogEntry[],
): JutsuCatalogEntry[] {
  if (custom.length === 0) return [...base]
  const chave = (n: string) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
  const substituidos = new Map(custom.map((j) => [chave(j.name), j]))
  const saida = base.map((j) => substituidos.get(chave(j.name)) ?? j)
  const jaEntraram = new Set(base.map((j) => chave(j.name)))
  return [...saida, ...custom.filter((j) => !jaEntraram.has(chave(j.name)))]
}

/** Troca os jutsus da casa (chamado pelo listen da mesa). */
export function setTableJutsus(custom: readonly JutsuCatalogEntry[]) {
  daCasa = [...custom]
}

/** Uma tela passou a acompanhar o catálogo. */
export function abrirCatalogo() {
  assinantes += 1
}

/**
 * Uma tela parou de acompanhar. O catálogo só é esvaziado quando a última
 * sai — é aí que a mesa foi de fato fechada.
 */
export function fecharCatalogo() {
  assinantes = Math.max(0, assinantes - 1)
  if (assinantes === 0) daCasa = []
}

/** Os jutsus da casa que estão valendo agora. */
export function tableJutsus(): JutsuCatalogEntry[] {
  return daCasa
}

/** O catálogo inteiro que vale agora: manual + casa. */
export function allJutsus(): JutsuCatalogEntry[] {
  return mergeJutsus(JUTSU_CATALOG, daCasa)
}

/**
 * O id do documento a partir do nome: sem acento, sem espaço, minúsculo.
 *
 * O id vem do NOME, e não de um sorteio, porque é o nome que liga um jutsu à
 * ficha de quem o conhece: dois jutsus da casa com o mesmo nome não podem
 * existir, e salvar de novo com o mesmo nome corrige em vez de duplicar.
 */
export function jutsuDocId(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'jutsu'
  )
}

/** O jutsu é da casa (e não do manual)? Para a tela poder marcar. */
export function ehDaCasa(name: string): boolean {
  const chave = (n: string) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
  return daCasa.some((j) => chave(j.name) === chave(name))
}
