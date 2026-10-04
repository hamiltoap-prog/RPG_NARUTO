import { useEffect, useState } from 'react'
import { Button, Card, Input, SectionTitle, Select, Textarea } from './ui'
import { AvisoDoDrive } from './AvisoDoDrive'
import { newId } from '../lib/id'
import { ehLinkDoDrive, normalizeImageUrl } from '../lib/imageUrl'
import { normalizarCaminho, paraGravar } from '../lib/pastas'
import { addSceneLibraryItem, listenStoryShow, setStoryShow, updateSceneLibraryItem, updateStoryShow } from '../lib/store'
import type { SceneLibraryItem, StoryShow, StorySlide } from '../types'

/**
 * Modo história.
 *
 * O mestre prepara slides (imagem, título, texto), guarda na biblioteca e, na
 * hora, apresenta: a história cobre a tela de todos. Só ele passa os slides,
 * e fechar fecha para todo mundo.
 *
 * O que está no ar mora em `scene/story`, legível por todos, com os slides
 * COPIADOS da biblioteca — a biblioteca é bastidor do mestre e o jogador não
 * a lê. Quem entra no meio cai no slide em que a mesa está.
 */

/** Começa a apresentar uma história da biblioteca para a mesa toda. */
export async function apresentarHistoria(tableId: string, item: SceneLibraryItem) {
  await setStoryShow(tableId, {
    open: true,
    title: item.label,
    slides: item.slides ?? [],
    index: 0,
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

/**
 * A sobreposição. Vai na tela de jogo e nas telas de ficha: a história é para
 * todos, esteja cada um onde estiver na mesa.
 */
export function HistoriaNaTela({ tableId, isGM }: { tableId: string; isGM: boolean }) {
  const show = useHistoriaNoAr(tableId)
  // Minimizar é só do mestre e só na tela dele: ele pode precisar olhar o
  // mapa ou uma ficha sem tirar a história da tela dos jogadores.
  const [minimizada, setMinimizada] = useState(false)
  const slides = show?.slides ?? []
  const total = slides.length
  const index = Math.min(Math.max(0, show?.index ?? 0), Math.max(0, total - 1))
  const slide = slides[index]
  const aberta = Boolean(show?.open && total > 0)

  // Uma história nova sempre abre grande, mesmo se a anterior foi minimizada.
  useEffect(() => {
    if (show?.open) setMinimizada(false)
  }, [show?.libraryId, show?.open])

  function irPara(i: number) {
    if (!isGM || i < 0 || i >= total) return
    void updateStoryShow(tableId, { index: i })
  }

  function fechar() {
    if (!isGM) return
    void updateStoryShow(tableId, { open: false })
  }

  // Setas do teclado para o mestre passar os slides.
  useEffect(() => {
    if (!isGM || !aberta || minimizada) return
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null
      if (alvo && /input|textarea|select/i.test(alvo.tagName)) return
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        irPara(index + 1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') irPara(index - 1)
      if (e.key === 'Escape') setMinimizada(true)
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  // Pré-carrega o próximo slide para a troca não piscar.
  useEffect(() => {
    const prox = slides[index + 1]?.imageUrl
    if (!aberta || !prox) return
    const img = new Image()
    img.src = normalizeImageUrl(prox) ?? prox
  }, [aberta, index, slides])

  if (!aberta || !slide || !show) return null

  if (isGM && minimizada) {
    return (
      <div className="fixed left-1/2 top-3 z-[60] flex -translate-x-1/2 items-center gap-2 rounded-sm border border-[color:var(--orange)] bg-black/90 px-3 py-1.5 text-xs text-white shadow-lg" data-historia-minimizada>
        <span>📖 {show.title} · slide {index + 1}/{total} na tela dos jogadores</span>
        <button className="text-[color:var(--orange)] hover:text-white" onClick={() => setMinimizada(false)}>
          abrir
        </button>
        <button className="text-red-400 hover:text-red-200" onClick={fechar}>
          fechar para todos
        </button>
      </div>
    )
  }

  const imagem = normalizeImageUrl(slide.imageUrl)
  const temTexto = Boolean(slide.title || slide.text)

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-black text-white" data-historia role="dialog" aria-label={show.title}>
      {/* O slide: a chave força o fade a cada troca. */}
      <div key={slide.id} className="historia-slide relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {imagem && (
          <img
            src={imagem}
            alt=""
            className={`absolute inset-0 h-full w-full ${slide.imageFit === 'cover' ? 'object-cover' : 'object-contain'}`}
          />
        )}
        {temTexto && (
          <div
            className={
              imagem
                ? 'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent px-5 pb-6 pt-16 sm:px-12'
                : 'relative mx-auto max-w-3xl px-6 text-center'
            }
          >
            {slide.title && (
              <h2 className={`font-serif font-extrabold text-white ${imagem ? 'text-2xl sm:text-4xl' : 'hero-title text-3xl sm:text-5xl'}`}>
                {slide.title}
              </h2>
            )}
            {slide.text && (
              <p
                className={`mt-2 max-h-[30vh] overflow-y-auto whitespace-pre-line leading-relaxed text-orange-50/90 ${
                  imagem ? 'text-sm sm:text-lg' : 'text-base sm:text-xl'
                }`}
                data-texto-do-slide
              >
                {slide.text}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Rodapé: o mestre controla; o jogador só acompanha. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[color:var(--line)] bg-black px-3 py-2 text-xs">
        <span className="text-orange-300/70">
          📖 {show.title} · {index + 1}/{total}
        </span>
        <div className="flex items-center gap-1">
          {slides.map((s, i) => (
            <span key={s.id} className={`h-1.5 w-1.5 rounded-full ${i === index ? 'bg-[color:var(--orange)]' : 'bg-white/25'}`} />
          ))}
        </div>
        {isGM ? (
          <span className="flex items-center gap-1.5" data-controles-historia>
            <Button variant="secondary" className="px-3 py-1 text-xs" disabled={index === 0} onClick={() => irPara(index - 1)}>
              ◀ anterior
            </Button>
            <Button variant="primary" className="px-3 py-1 text-xs" disabled={index >= total - 1} onClick={() => irPara(index + 1)}>
              próximo ▶
            </Button>
            <Button variant="ghost" className="px-2 py-1 text-xs" title="Some só da sua tela; os jogadores continuam vendo" onClick={() => setMinimizada(true)}>
              minimizar
            </Button>
            <Button variant="danger" className="px-2 py-1 text-xs" onClick={fechar}>
              fechar para todos
            </Button>
          </span>
        ) : (
          <span className="text-orange-400/60">o mestre está contando a história</span>
        )}
      </div>
    </div>
  )
}

const slideVazio = (): StorySlide => ({ id: newId(), title: '', text: '', imageUrl: '' })

/**
 * Editor de história: abre por cima de tudo, para ter espaço (o painel da
 * tela de jogo é baixo demais para escrever).
 */
export function EditorDeHistoria({
  tableId,
  item,
  pastaInicial,
  show,
  onFechar,
}: {
  tableId: string
  /** História a editar; sem ela, uma nova. */
  item?: SceneLibraryItem
  pastaInicial?: string
  /** A história no ar, para a edição de uma história em cena chegar à mesa. */
  show: StoryShow | null
  onFechar: () => void
}) {
  const [titulo, setTitulo] = useState(item?.label ?? '')
  const [pasta, setPasta] = useState(item?.folder ?? pastaInicial ?? '')
  const [slides, setSlides] = useState<StorySlide[]>(item?.slides?.length ? item.slides : [slideVazio()])
  const [salvando, setSalvando] = useState(false)

  function mexer(id: string, patch: Partial<StorySlide>) {
    setSlides((l) => l.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }
  function mover(i: number, d: number) {
    setSlides((l) => {
      const j = i + d
      if (j < 0 || j >= l.length) return l
      const n = [...l]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
  }

  // Slide sem nada não vai para a mesa.
  const validos = slides.filter((s) => s.title?.trim() || s.text?.trim() || s.imageUrl?.trim())

  async function salvar() {
    if (validos.length === 0) return
    setSalvando(true)
    try {
      const limpos = validos.map((s) => ({
        ...s,
        title: s.title?.trim() || undefined,
        text: s.text?.trim() || undefined,
        imageUrl: normalizeImageUrl(s.imageUrl) || undefined,
      }))
      const label = titulo.trim() || 'História sem nome'
      if (item) {
        await updateSceneLibraryItem(tableId, item.id, { label, folder: paraGravar(pasta), slides: limpos })
        // Corrigiu uma história que está no ar: a mesa vê a correção.
        if (show?.open && show.libraryId === item.id) {
          await updateStoryShow(tableId, { title: label, slides: limpos, index: Math.min(show.index, limpos.length - 1) })
        }
      } else {
        await addSceneLibraryItem(tableId, {
          kind: 'story',
          label,
          folder: paraGravar(pasta),
          imageUrl: limpos.find((s) => s.imageUrl)?.imageUrl,
          slides: limpos,
          createdAt: Date.now(),
        })
      }
      onFechar()
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[55] flex items-start justify-center overflow-y-auto bg-black/80 p-2 sm:p-6" data-editor-historia>
      <Card className="flex w-full max-w-3xl flex-col gap-3 p-4">
        <div className="flex items-center justify-between gap-2">
          <SectionTitle>{item ? 'Editar história' : 'Nova história'}</SectionTitle>
          <button className="text-xs text-orange-400/60 hover:text-white" onClick={onFechar}>
            fechar
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-orange-400/60">
            título
            <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="A chegada a Konoha" data-titulo-historia />
          </label>
          <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-orange-400/60">
            pasta (opcional)
            <Input value={pasta} onChange={(e) => setPasta(e.target.value)} placeholder="Cena 01 > Konoha" />
          </label>
        </div>
        {pasta && normalizarCaminho(pasta) !== pasta.trim() && (
          <p className="-mt-2 text-[11px] text-orange-400/50">vai para: {normalizarCaminho(pasta).replace(/\//g, ' › ')}</p>
        )}

        {slides.map((s, i) => {
          const img = normalizeImageUrl(s.imageUrl)
          return (
            <div key={s.id} className="well flex flex-col gap-2 rounded-sm p-3" data-slide-editor={i}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/70">Slide {i + 1}</span>
                <span className="flex items-center gap-2 text-[11px]">
                  <button className="text-orange-400/60 hover:text-white disabled:opacity-30" disabled={i === 0} onClick={() => mover(i, -1)}>
                    ▲ subir
                  </button>
                  <button
                    className="text-orange-400/60 hover:text-white disabled:opacity-30"
                    disabled={i === slides.length - 1}
                    onClick={() => mover(i, 1)}
                  >
                    ▼ descer
                  </button>
                  <button
                    className="text-red-400 hover:text-red-200"
                    onClick={() => setSlides((l) => (l.length > 1 ? l.filter((x) => x.id !== s.id) : [slideVazio()]))}
                  >
                    remover
                  </button>
                </span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex flex-1 flex-col gap-2">
                  <Input value={s.title ?? ''} onChange={(e) => mexer(s.id, { title: e.target.value })} placeholder="Título do slide (opcional)" />
                  <Textarea
                    rows={4}
                    value={s.text ?? ''}
                    onChange={(e) => mexer(s.id, { text: e.target.value })}
                    placeholder="O texto que a mesa lê enquanto você narra (opcional)"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Input
                      value={s.imageUrl ?? ''}
                      onChange={(e) => mexer(s.id, { imageUrl: e.target.value })}
                      onBlur={() => mexer(s.id, { imageUrl: normalizeImageUrl(s.imageUrl) ?? '' })}
                      placeholder="Link da imagem (Drive também serve)"
                      className="min-w-40 flex-1"
                    />
                    <Select value={s.imageFit ?? 'contain'} onChange={(e) => mexer(s.id, { imageFit: e.target.value as 'contain' | 'cover' })} className="w-40">
                      <option value="contain">imagem inteira</option>
                      <option value="cover">preencher a tela</option>
                    </Select>
                  </div>
                  {ehLinkDoDrive(s.imageUrl) && <AvisoDoDrive />}
                </div>
                {img && <img src={img} alt="" className="h-28 w-full shrink-0 rounded-sm object-cover sm:w-44" />}
              </div>
            </div>
          )
        })}

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setSlides((l) => [...l, slideVazio()])}>
            + slide
          </Button>
          <Button variant="primary" disabled={validos.length === 0 || salvando} onClick={salvar} data-salvar-historia>
            {item ? 'Salvar história' : 'Guardar na biblioteca'}
          </Button>
          <span className="text-[11px] text-orange-400/50">
            {validos.length} slide(s) · cada slide precisa de imagem, título ou texto
          </span>
        </div>
      </Card>
    </div>
  )
}
