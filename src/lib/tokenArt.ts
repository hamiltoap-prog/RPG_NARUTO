import { normalizeImageUrl } from './imageUrl'
import type { SceneToken, TokenArt, TokenMode } from '../types'

/**
 * Qual imagem a peça mostra no mapa.
 *
 * Duas imagens convivem em cada ficha: o **retrato**, redondo, que serve para
 * reconhecer a pessoa nas listas do app, e o **PNG de peça**, sem fundo, que
 * é o que fica bom em cima de um mapa. A ficha guarda as duas e diz qual está
 * valendo (`tokenMode`).
 *
 * A escolha é lida na HORA DE DESENHAR, a partir da ficha — e não gravada na
 * peça. É o que faz o mestre trocar o PNG de um NPC uma vez e todas as peças
 * dele, em todas as cenas, mudarem juntas; e é o que faz o clone acompanhar
 * o dono sem ninguém copiar link nenhum.
 */

export interface ArteDaPeca {
  url?: string
  /** PNG sem fundo: desenha inteiro, sem recorte redondo nem moldura. */
  recortado: boolean
}

/** Ficha que pode virar peça: tem retrato e, talvez, PNG de peça. */
type ComArte = TokenArt & { imageUrl?: string }

/**
 * Decide a arte da peça: o PNG quando o mestre ligou e ele existe; senão o
 * retrato da ficha; e, para peça solta (cenário, armadilha, um capanga sem
 * ficha), o link que foi digitado na própria peça.
 */
export function arteDaPeca(ficha: ComArte | undefined, token?: Pick<SceneToken, 'imageUrl'>): ArteDaPeca {
  // O link do Drive é traduzido na hora de desenhar, e não só na hora de
  // digitar: assim vale para o que já estava gravado e para o que entrou por
  // fora do app.
  if (ficha?.tokenMode === 'png' && ficha.tokenUrl) return { url: normalizeImageUrl(ficha.tokenUrl), recortado: true }
  const retrato = ficha?.imageUrl || token?.imageUrl
  return { url: normalizeImageUrl(retrato), recortado: false }
}

/** O modo que vale hoje, com o padrão explícito. */
export function modoDaPeca(ficha: ComArte | undefined): TokenMode {
  return ficha?.tokenMode === 'png' && ficha.tokenUrl ? 'png' : 'ficha'
}

/**
 * O mestre só consegue ligar o PNG depois de dar um link. Sem isso, ligar o
 * modo deixaria a peça invisível — e o app estaria mentindo sobre o estado.
 */
export function podeUsarPng(ficha: ComArte | undefined): boolean {
  return Boolean(ficha?.tokenUrl?.trim())
}
