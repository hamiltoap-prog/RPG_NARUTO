import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { normalizeImageUrl } from '../../lib/imageUrl'
import { ENTRADA_PADRAO_MS, TRANSICAO_PADRAO_MS, normalizarSlide, visivelNoPasso } from '../../lib/slides'
import type { SlideElemento, SlideForma, SlideImagem, SlideTexto, StorySlide } from '../../types'

/**
 * O palco de um slide: 16:9, com os elementos em camadas.
 *
 * É o MESMO desenho no editor, nas miniaturas e na apresentação. O palco é
 * um "container" do CSS e o texto mede `cqh` (% da altura do palco): o slide
 * fica idêntico em qualquer tamanho — o mestre monta no monitor e o jogador
 * vê igual no celular, só menor.
 */

export const FONTES: Record<NonNullable<SlideTexto['fonte']>, string> = {
  titulo: 'var(--font-display)',
  texto: 'var(--font-sans)',
  serifa: "Georgia, 'Times New Roman', serif",
}

/** "#rrggbb" + opacidade → rgba(). */
export function corComAlfa(hex: string | undefined, alfa = 1): string {
  const h = (hex ?? '#000000').replace('#', '')
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h.padEnd(6, '0').slice(0, 6)
  const v = Number.parseInt(n, 16)
  if (!Number.isFinite(v)) return `rgba(0,0,0,${alfa})`
  return `rgba(${(v >> 16) & 255},${(v >> 8) & 255},${v & 255},${alfa})`
}

const DIRECAO: Record<string, string> = { baixo: 'to bottom', cima: 'to top', esquerda: 'to left', direita: 'to right' }

function Forma({ e }: { e: SlideForma }) {
  const fundo =
    e.degrade && e.degrade !== 'nenhum'
      ? `linear-gradient(${DIRECAO[e.degrade]}, ${corComAlfa(e.cor, 0)}, ${corComAlfa(e.cor, 1)})`
      : e.cor
  return (
    <div
      className="h-full w-full"
      style={{
        background: fundo,
        borderRadius: e.forma === 'elipse' ? '50%' : `${e.raio ?? 0}cqmin`,
        border: e.borda ? `0.4cqmin solid ${e.borda}` : undefined,
      }}
    />
  )
}

function Imagem({ e }: { e: SlideImagem }) {
  const url = normalizeImageUrl(e.url)
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center border border-dashed border-white/30 text-[2cqh] text-white/40">
        sem imagem
      </div>
    )
  }
  return (
    <img
      src={url}
      alt=""
      draggable={false}
      className="pointer-events-none h-full w-full select-none"
      style={{
        objectFit: e.fit ?? 'contain',
        borderRadius: `${e.raio ?? 0}cqmin`,
        filter: e.sombra ? 'drop-shadow(0 1cqh 1.5cqh rgba(0,0,0,0.85))' : undefined,
        transform: e.espelhar ? 'scaleX(-1)' : undefined,
      }}
    />
  )
}

function Texto({ e }: { e: SlideTexto }) {
  const justificar = { top: 'flex-start', middle: 'center', bottom: 'flex-end' }[e.vertical ?? 'middle']
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden"
      style={{
        justifyContent: justificar,
        background: e.fundo ? corComAlfa(e.fundo, e.fundoOpacidade ?? 0.6) : undefined,
        padding: e.fundo ? '1cqh 1.5cqh' : undefined,
        borderRadius: e.fundo ? '0.8cqh' : undefined,
      }}
    >
      <p
        className="m-0 whitespace-pre-wrap break-words"
        style={{
          fontSize: `${e.tamanho}cqh`,
          lineHeight: 1.18,
          color: e.cor,
          fontFamily: FONTES[e.fonte ?? 'titulo'],
          fontWeight: e.negrito ? 700 : e.fonte === 'texto' ? 400 : 600,
          fontStyle: e.italico ? 'italic' : undefined,
          textAlign: e.alinhamento ?? 'center',
          textShadow: e.sombra ? '0 0.25cqh 0.8cqh rgba(0,0,0,0.95), 0 0 0.3cqh rgba(0,0,0,0.9)' : undefined,
        }}
      >
        {e.texto}
      </p>
    </div>
  )
}

/** Um elemento no palco, já posicionado. `animar` toca a entrada dele. */
export function ElementoNoPalco({ e, animar, fantasma = false }: { e: SlideElemento; animar: boolean; fantasma?: boolean }) {
  const caixa: CSSProperties = {
    left: `${e.x * 100}%`,
    top: `${e.y * 100}%`,
    width: `${e.w * 100}%`,
    height: `${e.h * 100}%`,
    transform: e.rotation ? `rotate(${e.rotation}deg)` : undefined,
    opacity: (e.opacity ?? 1) * (fantasma ? 0.35 : 1),
  }
  const entrada = animar && e.entrada && e.entrada !== 'nenhuma' ? `slide-entra-${e.entrada}` : ''
  return (
    <div className="pointer-events-none absolute" style={caixa} data-elemento={e.id}>
      <div
        className={`h-full w-full ${entrada}`}
        style={entrada ? { animationDuration: `${e.duracao ?? ENTRADA_PADRAO_MS}ms`, animationDelay: `${e.atraso ?? 0}ms` } : undefined}
      >
        {e.tipo === 'imagem' && <Imagem e={e} />}
        {e.tipo === 'texto' && <Texto e={e} />}
        {e.tipo === 'forma' && <Forma e={e} />}
      </div>
    </div>
  )
}

/**
 * O conteúdo de um slide (fundo + elementos), ocupando o pai inteiro. O pai é
 * que precisa ser o palco (`Palco`), para as medidas `cq*` valerem.
 *
 *  - `passo`: até qual clique já foi revelado (elementos depois dele não aparecem);
 *  - `animar`: toca as entradas — na apresentação sim, nas miniaturas não;
 *  - `todos`: o editor mostra tudo, e os elementos de clique ficam esmaecidos.
 */
export function ConteudoDoSlide({
  slide,
  passo = 0,
  animar = false,
  todos = false,
}: {
  slide: StorySlide
  passo?: number
  animar?: boolean
  todos?: boolean
}) {
  const s = normalizarSlide(slide)
  const fundo = normalizeImageUrl(s.fundoUrl)
  // Elemento escondido não é desenhado; ao ser revelado por um clique ele
  // nasce na tela e a entrada dele toca — e quem já estava não repete a sua.
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: s.fundoCor ?? '#000' }}>
      {fundo && (
        <img
          src={fundo}
          alt=""
          draggable={false}
          className={`pointer-events-none absolute inset-0 h-full w-full select-none ${animar && s.kenBurns ? 'slide-ken-burns' : ''}`}
          style={{ objectFit: s.fundoFit ?? 'cover' }}
        />
      )}
      {(s.elementos ?? []).map((e) => {
        if (!todos && !visivelNoPasso(e, passo)) return null
        return <ElementoNoPalco key={e.id} e={e} animar={animar} fantasma={todos && (e.passo ?? 0) > 0} />
      })}
    </div>
  )
}

/** O palco 16:9: um container do CSS, para o texto medir em % da altura. */
export function Palco({ children, className = '', style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '16 / 9', containerType: 'size', ...style }}>
      {children}
    </div>
  )
}

/**
 * A apresentação: um palco que troca de slide com transição.
 *
 * Quando o slide muda, o que sai continua desenhado por cima (ou por baixo,
 * conforme a transição) até a animação terminar — é isso que faz o
 * "deslizar" mostrar os dois slides andando juntos.
 */
export function PalcoDaApresentacao({
  slides,
  index,
  passo,
  className = '',
  style,
}: {
  slides: readonly StorySlide[]
  index: number
  passo: number
  className?: string
  style?: CSSProperties
}) {
  const atual = slides[index]
  const [saindo, setSaindo] = useState<{ slide: StorySlide; passo: number; chave: number } | null>(null)
  const anterior = useRef<{ index: number; slide?: StorySlide; passo: number }>({ index, slide: atual, passo })
  const [chave, setChave] = useState(0)

  useEffect(() => {
    const antes = anterior.current
    if (antes.index !== index && antes.slide) {
      const ms = normalizarSlide(atual ?? antes.slide).transicaoMs ?? TRANSICAO_PADRAO_MS
      const tipo = normalizarSlide(atual ?? antes.slide).transicao ?? 'fade'
      setChave((c) => c + 1)
      if (tipo !== 'nenhuma') {
        setSaindo({ slide: antes.slide, passo: antes.passo, chave: Date.now() })
        const t = window.setTimeout(() => setSaindo(null), ms + 60)
        anterior.current = { index, slide: atual, passo }
        return () => window.clearTimeout(t)
      }
      setSaindo(null)
    }
    anterior.current = { index, slide: atual, passo }
  }, [index, atual, passo])

  if (!atual) return null
  const n = normalizarSlide(atual)
  const tipo = n.transicao ?? 'fade'
  const ms = n.transicaoMs ?? TRANSICAO_PADRAO_MS
  const animacao = (lado: 'entra' | 'sai'): CSSProperties =>
    tipo === 'escurecer'
      ? { animationDuration: `${ms / 2}ms`, animationDelay: lado === 'entra' ? `${ms / 2}ms` : '0ms' }
      : { animationDuration: `${ms}ms` }

  return (
    <Palco className={`bg-black ${className}`} style={style}>
      {saindo && (
        <div key={`s${saindo.chave}`} className={`absolute inset-0 slide-sai-${tipo}`} style={animacao('sai')} data-slide-saindo>
          <ConteudoDoSlide slide={saindo.slide} passo={saindo.passo} />
        </div>
      )}
      <div
        key={`a${chave}`}
        className={`absolute inset-0 ${saindo ? `slide-entra-tr-${tipo}` : ''}`}
        style={saindo ? animacao('entra') : undefined}
        data-slide-atual={index}
      >
        <ConteudoDoSlide slide={atual} passo={passo} animar />
      </div>
    </Palco>
  )
}
