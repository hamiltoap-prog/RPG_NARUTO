import { useEffect, useState } from 'react'
import { Button, Select } from './ui'
import { PalcoDaApresentacao } from './historia/Palco'
import { normalizeImageUrl } from '../lib/imageUrl'
import { avancar, normalizarSlide, passosDoSlide, slidesParaApresentar, voltar } from '../lib/slides'
import { listenStoryShow, setStoryShow, updateStoryShow } from '../lib/store'
import type { SceneLibraryItem, StoryShow } from '../types'

export { EditorDeSlides as EditorDeHistoria } from './historia/EditorDeSlides'

/**
 * Modo história: a apresentação na sessão.
 *
 * O mestre monta os slides no editor (ver `historia/EditorDeSlides`), guarda
 * na biblioteca e, na hora, apresenta: a apresentação cobre a tela de jogo de
 * todos. Só ele passa — revelando primeiro os elementos "no clique" e depois
 * trocando de slide, com a transição de cada um — e fechar fecha para todos.
 *
 * O que está no ar mora em `scene/story`, legível por todos, com os slides
 * COPIADOS e sem as notas do mestre: a biblioteca continua sendo bastidor, e
 * as notas ele lê da própria biblioteca. Quem entra no meio cai no slide (e no
 * clique) em que a mesa está.
 */

/** Começa a apresentar uma história da biblioteca para a mesa toda. */
export async function apresentarHistoria(tableId: string, item: SceneLibraryItem, index = 0) {
  await setStoryShow(tableId, {
    open: true,
    title: item.label,
    slides: slidesParaApresentar(item.slides ?? []),
    index,
    step: 0,
    libraryId: item.id,
    updatedAt: Date.now(),
  })
}

/** A história no ar, ao vivo. */
export function useHistoriaNoAr(tableId: string) {
  const [show, setShow] = useState<StoryShow | null>(null)
  useEffect(() => listenStoryShow(tableId, setShow), [tableId])
  return show
}

/** Pré-carrega as imagens de um slide, para a troca não piscar. */
function preCarregar(slide: ReturnType<typeof normalizarSlide> | undefined) {
  if (!slide) return
  const urls = [slide.fundoUrl, ...(slide.elementos ?? []).map((e) => (e.tipo === 'imagem' ? e.url : undefined))]
  for (const u of urls) {
    const url = normalizeImageUrl(u)
    if (url) new Image().src = url
  }
}

/** A sobreposição. Vive só na tela de jogo — nas fichas a história não aparece. */
export function HistoriaNaTela({
  tableId,
  isGM,
  library = [],
}: {
  tableId: string
  isGM: boolean
  /** A biblioteca do mestre: é de lá que vêm as notas, que não vão ao ar. */
  library?: SceneLibraryItem[]
}) {
  const show = useHistoriaNoAr(tableId)
  // Minimizar é só do mestre e só na tela dele: ele pode olhar o mapa sem
  // tirar a história da tela dos jogadores.
  const [minimizada, setMinimizada] = useState(false)
  const [verNotas, setVerNotas] = useState(true)
  const slides = show?.slides ?? []
  const total = slides.length
  const index = Math.min(Math.max(0, show?.index ?? 0), Math.max(0, total - 1))
  const passos = slides[index] ? passosDoSlide(slides[index]) : 0
  const step = Math.min(Math.max(0, show?.step ?? 0), passos)
  const aberta = Boolean(show?.open && total > 0)
  const original = library.find((i) => i.id === show?.libraryId)
  const notas = original?.slides?.[index]?.notas

  // Uma história nova sempre abre grande, mesmo se a anterior foi minimizada.
  useEffect(() => {
    if (show?.open) setMinimizada(false)
  }, [show?.libraryId, show?.open])

  function ir(p: { index: number; step: number } | null) {
    if (!isGM || !p) return
    void updateStoryShow(tableId, { index: p.index, step: p.step })
  }
  const proximo = () => ir(avancar(slides, { index, step }))
  const anterior = () => ir(voltar(slides, { index, step }))

  function fechar() {
    if (!isGM) return
    void updateStoryShow(tableId, { open: false })
  }

  // Teclado do mestre: → / espaço / PageDown avançam; ← / PageUp voltam.
  useEffect(() => {
    if (!isGM || !aberta || minimizada) return
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null
      if (alvo && /input|textarea|select/i.test(alvo.tagName)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        proximo()
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') anterior()
      if (e.key === 'Escape') setMinimizada(true)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  // Pré-carrega o próximo slide.
  useEffect(() => {
    if (aberta) preCarregar(slides[index + 1] ? normalizarSlide(slides[index + 1]) : undefined)
  }, [aberta, index, slides])

  if (!aberta || !show) return null

  if (isGM && minimizada) {
    return (
      <div
        className="fixed left-1/2 top-3 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-sm border border-[color:var(--orange)] bg-black/90 px-3 py-1.5 text-xs text-white shadow-lg"
        data-historia-minimizada
      >
        <span>
          📖 {show.title} · slide {index + 1}/{total} na tela dos jogadores
        </span>
        <button className="text-[color:var(--orange)] hover:text-white" onClick={() => setMinimizada(false)}>
          abrir
        </button>
        <button className="text-red-400 hover:text-red-200" onClick={fechar}>
          fechar para todos
        </button>
      </div>
    )
  }

  const fim = !avancar(slides, { index, step })
  const barra = isGM ? (notas && verNotas ? 150 : 52) : 34

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black text-white" data-historia role="dialog" aria-label={show.title}>
      <div
        className={`flex min-h-0 flex-1 items-center justify-center ${isGM ? 'cursor-pointer' : ''}`}
        onClick={isGM ? proximo : undefined}
        title={isGM ? 'Clique para avançar' : undefined}
      >
        <PalcoDaApresentacao slides={slides} index={index} passo={step} style={{ width: `min(100%, calc((100dvh - ${barra}px) * 16 / 9))` }} />
      </div>

      {isGM ? (
        <div className="flex shrink-0 flex-col gap-1.5 border-t border-[color:var(--line)] bg-black px-3 py-2 text-xs">
          {notas && verNotas && (
            <p className="max-h-24 overflow-y-auto whitespace-pre-line rounded-sm border border-amber-500/30 bg-amber-950/30 px-2 py-1 text-amber-100/90" data-notas-do-mestre>
              <b className="text-amber-300">Notas (só você vê):</b> {notas}
            </p>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-orange-300/80">
              📖 {show.title}
              <Select
                value={index}
                onChange={(e) => ir({ index: Number(e.target.value), step: 0 })}
                className="w-28 px-1 py-0.5 text-[11px]"
                title="Ir para o slide"
                data-ir-para
              >
                {slides.map((s, i) => (
                  <option key={s.id} value={i}>
                    slide {i + 1}/{total}
                  </option>
                ))}
              </Select>
              {passos > 0 && (
                <span className="text-[color:var(--orange)]" data-cliques>
                  clique {step}/{passos}
                </span>
              )}
            </span>
            <span className="flex flex-wrap items-center gap-1.5" data-controles-historia>
              {notas && (
                <Button variant="ghost" className="px-2 py-1 text-xs" onClick={() => setVerNotas((v) => !v)}>
                  {verNotas ? 'esconder notas' : 'notas'}
                </Button>
              )}
              <Button variant="secondary" className="px-3 py-1 text-xs" disabled={index === 0 && step === 0} onClick={anterior}>
                ◀ anterior
              </Button>
              <Button variant="primary" className="px-3 py-1 text-xs" disabled={fim} onClick={proximo}>
                {step < passos ? 'revelar ▶' : 'próximo ▶'}
              </Button>
              <Button variant="ghost" className="px-2 py-1 text-xs" title="Some só da sua tela; os jogadores continuam vendo" onClick={() => setMinimizada(true)}>
                minimizar
              </Button>
              <Button variant="danger" className="px-2 py-1 text-xs" onClick={fechar}>
                fechar para todos
              </Button>
            </span>
          </div>
        </div>
      ) : (
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-black px-3 py-1.5 text-[11px] text-orange-400/60">
          <span>
            📖 {show.title} · {index + 1}/{total}
          </span>
          <span>o mestre está contando a história</span>
        </div>
      )}
    </div>
  )
}
