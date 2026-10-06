import { newId } from './id'
import type { SlideElemento, SlideForma, SlideImagem, SlideTexto, StorySlide } from '../types'

/**
 * As regras dos slides do modo história, sem tela nenhuma: criar elementos,
 * mexer nas camadas, converter o formato antigo e decidir o que o "próximo"
 * do mestre faz. Tudo puro — a tela só desenha o resultado.
 */

/** Proporção fixa do palco do slide. */
export const ASPECTO_DO_SLIDE = 16 / 9

/** Duração padrão da transição de slide e da entrada de elemento. */
export const TRANSICAO_PADRAO_MS = 700
export const ENTRADA_PADRAO_MS = 600

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function slideVazio(): StorySlide {
  return { id: newId(), fundoCor: '#000000', elementos: [], transicao: 'fade' }
}

export function novoTexto(parcial: Partial<SlideTexto> = {}): SlideTexto {
  return {
    id: newId(),
    tipo: 'texto',
    x: 0.1,
    y: 0.4,
    w: 0.8,
    h: 0.2,
    texto: 'Escreva aqui',
    tamanho: 7,
    cor: '#ffffff',
    fonte: 'titulo',
    alinhamento: 'center',
    vertical: 'middle',
    sombra: true,
    entrada: 'aparecer',
    ...parcial,
  }
}

export function novaImagem(url: string, parcial: Partial<SlideImagem> = {}): SlideImagem {
  return { id: newId(), tipo: 'imagem', x: 0.25, y: 0.2, w: 0.5, h: 0.6, url, fit: 'contain', entrada: 'aparecer', ...parcial }
}

export function novaForma(parcial: Partial<SlideForma> = {}): SlideForma {
  return { id: newId(), tipo: 'forma', forma: 'retangulo', x: 0.3, y: 0.3, w: 0.4, h: 0.4, cor: '#000000', opacity: 0.6, ...parcial }
}

/**
 * Slide no formato de agora. Os slides antigos (imagem + título + texto) viram
 * fundo + faixa escura + dois textos, com a mesma cara que tinham — então as
 * histórias já guardadas continuam abrindo e podem ser editadas no editor novo.
 */
export function normalizarSlide(s: StorySlide): StorySlide {
  if (s.elementos) return s
  const elementos: SlideElemento[] = []
  const temImagem = Boolean(s.imageUrl)
  const temTexto = Boolean(s.title || s.text)
  if (temImagem && temTexto) {
    elementos.push(novaForma({ id: `${s.id}-faixa`, x: 0, y: 0.55, w: 1, h: 0.45, cor: '#000000', opacity: 0.9, degrade: 'baixo', entrada: 'nenhuma', nome: 'faixa' }))
  }
  if (s.title) {
    elementos.push(
      novoTexto({
        id: `${s.id}-titulo`,
        texto: s.title,
        x: 0.05,
        y: temImagem ? 0.68 : 0.25,
        w: 0.9,
        h: 0.12,
        tamanho: temImagem ? 6.5 : 9,
        alinhamento: temImagem ? 'left' : 'center',
        entrada: 'nenhuma',
        nome: 'título',
      }),
    )
  }
  if (s.text) {
    elementos.push(
      novoTexto({
        id: `${s.id}-texto`,
        texto: s.text,
        x: 0.05,
        y: temImagem ? 0.8 : s.title ? 0.42 : 0.3,
        w: 0.9,
        h: temImagem ? 0.17 : 0.4,
        tamanho: temImagem ? 3.4 : 4.2,
        fonte: 'texto',
        alinhamento: temImagem ? 'left' : 'center',
        vertical: 'top',
        entrada: 'nenhuma',
        nome: 'texto',
      }),
    )
  }
  return {
    id: s.id,
    fundoCor: '#000000',
    fundoUrl: s.imageUrl,
    fundoFit: s.imageFit ?? 'contain',
    elementos,
    transicao: 'fade',
  }
}

/** Quantos cliques o slide tem antes de passar para o próximo. */
export function passosDoSlide(s: StorySlide): number {
  return Math.max(0, ...(normalizarSlide(s).elementos ?? []).map((e) => e.passo ?? 0))
}

/** O elemento aparece neste passo? */
export function visivelNoPasso(e: SlideElemento, passo: number): boolean {
  return (e.passo ?? 0) <= passo
}

export interface Posicao {
  index: number
  step: number
}

/**
 * O "próximo" do mestre: primeiro revela os cliques que faltam no slide;
 * depois passa de slide. No fim, fica onde está (`null`).
 */
export function avancar(slides: readonly StorySlide[], p: Posicao): Posicao | null {
  const atual = slides[p.index]
  if (!atual) return null
  if (p.step < passosDoSlide(atual)) return { index: p.index, step: p.step + 1 }
  if (p.index + 1 < slides.length) return { index: p.index + 1, step: 0 }
  return null
}

/** O "anterior": desfaz um clique; no começo do slide, volta ao anterior já completo. */
export function voltar(slides: readonly StorySlide[], p: Posicao): Posicao | null {
  if (p.step > 0) return { index: p.index, step: p.step - 1 }
  if (p.index > 0) return { index: p.index - 1, step: passosDoSlide(slides[p.index - 1]) }
  return null
}

/** Mover uma camada: para a frente (em cima de tudo), para trás, ou um nível. */
export function moverCamada(
  elementos: readonly SlideElemento[],
  id: string,
  para: 'frente' | 'tras' | 'subir' | 'descer',
): SlideElemento[] {
  const i = elementos.findIndex((e) => e.id === id)
  if (i < 0) return [...elementos]
  const lista = [...elementos]
  const [el] = lista.splice(i, 1)
  const destino =
    para === 'frente' ? lista.length : para === 'tras' ? 0 : para === 'subir' ? Math.min(lista.length, i + 1) : Math.max(0, i - 1)
  lista.splice(destino, 0, el)
  return lista
}

/** Cópia com ids novos, deslocada um pouco para não ficar em cima da original. */
export function duplicarElemento(e: SlideElemento): SlideElemento {
  return { ...e, id: newId(), x: limitar(e.x + 0.03, 0, 1 - Math.min(e.w, 1)), y: limitar(e.y + 0.03, 0, 1 - Math.min(e.h, 1)) }
}

export function duplicarSlide(s: StorySlide): StorySlide {
  const n = normalizarSlide(s)
  return { ...n, id: newId(), elementos: (n.elementos ?? []).map((e) => ({ ...e, id: newId() })) }
}

/**
 * Prende o elemento ao palco: pode sair um pouco da borda (sangria, como num
 * editor de slides), mas nunca sumir de vez, e nunca fica minúsculo.
 */
export function prenderAoPalco<T extends SlideElemento>(e: T): T {
  const w = limitar(e.w, 0.02, 3)
  const h = limitar(e.h, 0.02, 3)
  return { ...e, w, h, x: limitar(e.x, -w + 0.02, 0.98), y: limitar(e.y, -h + 0.02, 0.98) }
}

/**
 * Ímã: encosta a borda ou o centro do elemento no centro e nas bordas do
 * palco quando passa perto. Devolve a posição ajustada e as guias a desenhar.
 */
export function ima(
  e: Pick<SlideElemento, 'x' | 'y' | 'w' | 'h'>,
  tolerancia = 0.012,
): { x: number; y: number; guiasX: number[]; guiasY: number[] } {
  const alvos = [0, 0.5, 1]
  let x = e.x
  let y = e.y
  const guiasX: number[] = []
  const guiasY: number[] = []
  const pegar = (pos: number, tam: number, guias: number[]) => {
    for (const a of alvos) {
      for (const [ponto, ajuste] of [
        [pos, 0],
        [pos + tam / 2, tam / 2],
        [pos + tam, tam],
      ] as const) {
        if (Math.abs(ponto - a) < tolerancia) {
          guias.push(a)
          return a - ajuste
        }
      }
    }
    return pos
  }
  x = pegar(x, e.w, guiasX)
  y = pegar(y, e.h, guiasY)
  return { x, y, guiasX, guiasY }
}

/** Os slides como vão para a tela dos jogadores: normalizados e sem as notas do mestre. */
export function slidesParaApresentar(slides: readonly StorySlide[]): StorySlide[] {
  return slides.map((s) => {
    const n = normalizarSlide(s)
    const copia = { ...n }
    delete copia.notas
    return copia
  })
}

/** A primeira imagem da história, para a miniatura da biblioteca. */
export function capaDaHistoria(slides: readonly StorySlide[]): string | undefined {
  for (const s of slides) {
    const n = normalizarSlide(s)
    if (n.fundoUrl) return n.fundoUrl
    const img = (n.elementos ?? []).find((e): e is SlideImagem => e.tipo === 'imagem' && Boolean(e.url))
    if (img) return img.url
  }
  return undefined
}

/** Slide que não tem nada para mostrar não vai para a mesa. */
export function slideTemConteudo(s: StorySlide): boolean {
  const n = normalizarSlide(s)
  return Boolean(n.fundoUrl || (n.elementos ?? []).length > 0 || (n.fundoCor && n.fundoCor !== '#000000'))
}
