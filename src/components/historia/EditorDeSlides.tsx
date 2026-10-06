import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button, Input, Select, Textarea } from '../ui'
import { AvisoDoDrive } from '../AvisoDoDrive'
import { ConteudoDoSlide, Palco, PalcoDaApresentacao } from './Palco'
import { ehLinkDoDrive, normalizeImageUrl } from '../../lib/imageUrl'
import { normalizarCaminho, paraGravar } from '../../lib/pastas'
import {
  ASPECTO_DO_SLIDE,
  TRANSICAO_PADRAO_MS,
  avancar,
  capaDaHistoria,
  duplicarElemento,
  duplicarSlide,
  ima,
  moverCamada,
  normalizarSlide,
  novaForma,
  novaImagem,
  novoTexto,
  passosDoSlide,
  prenderAoPalco,
  slideVazio,
  slidesParaApresentar,
  voltar,
  type Posicao,
} from '../../lib/slides'
import { addSceneLibraryItem, updateSceneLibraryItem, updateStoryShow } from '../../lib/store'
import type {
  SceneLibraryItem,
  SlideElemento,
  SlideEntrada,
  SlideForma,
  SlideImagem,
  SlideTexto,
  SlideTransicao,
  StoryShow,
  StorySlide,
} from '../../types'

/**
 * Editor de história, no jeito de um editor de slides.
 *
 *  - à esquerda, os slides (miniaturas que são o próprio slide desenhado);
 *  - no centro, o palco: clicar seleciona, arrastar move, as alças
 *    redimensionam (Shift mantém a proporção), e o ímã encosta no centro e nas
 *    bordas (Alt solta o ímã);
 *  - à direita, as propriedades do que está selecionado — ou do slide, sem
 *    nada selecionado — e as camadas, de cima para baixo.
 *
 * Desfazer e refazer valem para tudo (Ctrl+Z / Ctrl+Y). "Testar" toca a
 * apresentação só na tela do mestre, com as transições, antes de ir para a
 * mesa.
 */

const ENTRADAS: [SlideEntrada, string][] = [
  ['nenhuma', 'nenhuma'],
  ['aparecer', 'aparecer'],
  ['subir', 'subir'],
  ['descer', 'descer'],
  ['esquerda', 'vir da direita'],
  ['direita', 'vir da esquerda'],
  ['zoom', 'zoom'],
  ['desfocar', 'desfocar'],
]

const TRANSICOES: [SlideTransicao, string][] = [
  ['fade', 'dissolver'],
  ['escurecer', 'escurecer (passa pelo preto)'],
  ['deslizar', 'deslizar para o lado'],
  ['empurrar-cima', 'empurrar para cima'],
  ['zoom', 'zoom'],
  ['cortina', 'cortina'],
  ['nenhuma', 'corte seco'],
]

type Alca = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
const ALCAS: Alca[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w']
const POS_DA_ALCA: Record<Alca, string> = {
  nw: 'left-0 top-0 cursor-nwse-resize',
  n: 'left-1/2 top-0 cursor-ns-resize',
  ne: 'left-full top-0 cursor-nesw-resize',
  e: 'left-full top-1/2 cursor-ew-resize',
  se: 'left-full top-full cursor-nwse-resize',
  s: 'left-1/2 top-full cursor-ns-resize',
  sw: 'left-0 top-full cursor-nesw-resize',
  w: 'left-0 top-1/2 cursor-ew-resize',
}

function rotuloDoElemento(e: SlideElemento): string {
  if (e.nome) return e.nome
  if (e.tipo === 'texto') return `"${e.texto.split('\n')[0].slice(0, 22) || 'texto'}"`
  if (e.tipo === 'imagem') {
    // O nome do arquivo diz qual imagem é ("ninja", "kunai"); link do Drive não tem nome.
    const arquivo = /drive|googleusercontent/i.test(e.url) ? '' : decodeURIComponent(e.url.split(/[?#]/)[0].split('/').pop() ?? '')
    return arquivo.replace(/\.[a-z0-9]+$/i, '').slice(0, 24) || 'imagem'
  }
  return e.forma === 'elipse' ? 'círculo' : 'retângulo'
}
const ICONE = { texto: 'T', imagem: '🖼', forma: '■' } as const

/** Proporção natural de uma imagem, para a caixa nascer sem distorcer. */
function proporcaoDaImagem(url: string): Promise<number | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img.naturalWidth > 0 ? img.naturalHeight / img.naturalWidth : null)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/** Caixa (em frações do palco) para uma imagem de proporção `r` (altura/largura). */
function caixaPara(r: number | null, larguraMax = 0.6, alturaMax = 0.8) {
  if (!r) return { w: larguraMax, h: alturaMax * 0.75 }
  let w = larguraMax
  let h = w * ASPECTO_DO_SLIDE * r
  if (h > alturaMax) {
    h = alturaMax
    w = h / (ASPECTO_DO_SLIDE * r)
  }
  return { w, h, x: (1 - w) / 2, y: (1 - h) / 2 }
}

export function EditorDeSlides({
  tableId,
  item,
  pastaInicial,
  show,
  onFechar,
}: {
  tableId: string
  item?: SceneLibraryItem
  pastaInicial?: string
  show: StoryShow | null
  onFechar: () => void
}) {
  const [titulo, setTitulo] = useState(item?.label ?? '')
  const [pasta, setPasta] = useState(item?.folder ?? pastaInicial ?? '')
  const [slides, setSlides] = useState<StorySlide[]>(() =>
    item?.slides?.length ? item.slides.map(normalizarSlide) : [slideVazio()],
  )
  const [atual, setAtual] = useState(0)
  const [sel, setSel] = useState<string | null>(null)
  const [guias, setGuias] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] })
  const [testando, setTestando] = useState<Posicao | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [mudou, setMudou] = useState(false)
  const [linkImagem, setLinkImagem] = useState('')

  const slidesRef = useRef(slides)
  slidesRef.current = slides
  const passado = useRef<StorySlide[][]>([])
  const futuro = useRef<StorySlide[][]>([])
  const ultimaChave = useRef<{ chave: string; t: number }>({ chave: '', t: 0 })
  const [, setVersaoDoHistorico] = useState(0)

  const palcoRef = useRef<HTMLDivElement | null>(null)
  const textoRef = useRef<HTMLTextAreaElement | null>(null)

  const slide = slides[Math.min(atual, slides.length - 1)]
  const elementos = slide.elementos ?? []
  const selecionado = elementos.find((e) => e.id === sel) ?? null

  /**
   * Toda mudança passa por aqui. Mudanças seguidas na mesma coisa (arrastar,
   * mexer num controle deslizante) viram um passo só do desfazer.
   */
  const mudar = useCallback((fn: (l: StorySlide[]) => StorySlide[], chave = '') => {
    const antes = slidesRef.current
    const depois = fn(antes)
    if (depois === antes) return
    const agora = Date.now()
    const juntar = chave && ultimaChave.current.chave === chave && agora - ultimaChave.current.t < 900
    if (!juntar) {
      passado.current.push(antes)
      if (passado.current.length > 100) passado.current.shift()
      futuro.current = []
      setVersaoDoHistorico((v) => v + 1)
    }
    ultimaChave.current = { chave, t: agora }
    slidesRef.current = depois
    setSlides(depois)
    setMudou(true)
  }, [])

  function desfazer() {
    const antes = passado.current.pop()
    if (!antes) return
    futuro.current.push(slidesRef.current)
    ultimaChave.current = { chave: '', t: 0 }
    slidesRef.current = antes
    setSlides(antes)
    setVersaoDoHistorico((v) => v + 1)
  }
  function refazer() {
    const depois = futuro.current.pop()
    if (!depois) return
    passado.current.push(slidesRef.current)
    ultimaChave.current = { chave: '', t: 0 }
    slidesRef.current = depois
    setSlides(depois)
    setVersaoDoHistorico((v) => v + 1)
  }

  const mudarSlide = useCallback(
    (fn: (s: StorySlide) => StorySlide, chave = '') => {
      mudar((l) => l.map((s, i) => (i === Math.min(atual, l.length - 1) ? fn(s) : s)), chave)
    },
    [atual, mudar],
  )

  const mudarElemento = useCallback(
    (id: string, patch: Partial<SlideElemento>, chave = '') => {
      mudarSlide(
        (s) => ({ ...s, elementos: (s.elementos ?? []).map((e) => (e.id === id ? ({ ...e, ...patch } as SlideElemento) : e)) }),
        chave,
      )
    },
    [mudarSlide],
  )

  function adicionar(e: SlideElemento) {
    mudarSlide((s) => ({ ...s, elementos: [...(s.elementos ?? []), e] }))
    setSel(e.id)
  }

  async function adicionarImagem() {
    const url = normalizeImageUrl(linkImagem)
    if (!url) return
    const caixa = caixaPara(await proporcaoDaImagem(url))
    adicionar(novaImagem(url, caixa))
    setLinkImagem('')
  }

  function apagarSelecionado() {
    if (!sel) return
    mudarSlide((s) => ({ ...s, elementos: (s.elementos ?? []).filter((e) => e.id !== sel) }))
    setSel(null)
  }

  function duplicarSelecionado() {
    if (!selecionado) return
    const copia = duplicarElemento(selecionado)
    mudarSlide((s) => {
      const l = [...(s.elementos ?? [])]
      l.splice(l.findIndex((e) => e.id === selecionado.id) + 1, 0, copia)
      return { ...s, elementos: l }
    })
    setSel(copia.id)
  }

  function camada(para: 'frente' | 'tras' | 'subir' | 'descer', id = sel) {
    if (!id) return
    mudarSlide((s) => ({ ...s, elementos: moverCamada(s.elementos ?? [], id, para) }))
  }

  /* --- Arrastar e redimensionar no palco ---------------------------------- */
  const arraste = useRef<{
    id: string
    modo: 'mover' | Alca
    x0: number
    y0: number
    orig: SlideElemento
    chave: string
  } | null>(null)

  function pontoNoPalco(ev: { clientX: number; clientY: number }) {
    const r = palcoRef.current?.getBoundingClientRect()
    if (!r || r.width === 0) return null
    return { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height }
  }

  function comecarArraste(ev: React.PointerEvent, e: SlideElemento, modo: 'mover' | Alca) {
    ev.stopPropagation()
    ev.preventDefault()
    setSel(e.id)
    const p = pontoNoPalco(ev)
    if (!p) return
    arraste.current = { id: e.id, modo, x0: p.x, y0: p.y, orig: e, chave: `arraste:${e.id}:${Date.now()}` }
    palcoRef.current?.setPointerCapture?.(ev.pointerId)
  }

  function moverArraste(ev: React.PointerEvent) {
    const a = arraste.current
    if (!a) return
    const p = pontoNoPalco(ev)
    if (!p) return
    const dx = p.x - a.x0
    const dy = p.y - a.y0
    const o = a.orig
    let { x, y, w, h } = o
    if (a.modo === 'mover') {
      x = o.x + dx
      y = o.y + dy
      if (!ev.altKey) {
        const m = ima({ x, y, w, h })
        x = m.x
        y = m.y
        setGuias({ x: m.guiasX, y: m.guiasY })
      } else setGuias({ x: [], y: [] })
    } else {
      const modo = a.modo
      if (modo.includes('e')) w = o.w + dx
      if (modo.includes('s')) h = o.h + dy
      if (modo.includes('w')) {
        w = o.w - dx
        x = o.x + dx
      }
      if (modo.includes('n')) {
        h = o.h - dy
        y = o.y + dy
      }
      // Shift nos cantos (e sempre nas imagens, pelos cantos) mantém a proporção.
      const canto = modo.length === 2
      if (canto && (o.tipo === 'imagem') !== ev.shiftKey) {
        const r = o.h / o.w
        h = w * r
        if (modo.includes('n')) y = o.y + o.h - h
      }
      w = Math.max(0.02, w)
      h = Math.max(0.02, h)
    }
    mudarElemento(a.id, prenderAoPalco({ ...o, x, y, w, h }), a.chave)
  }

  function soltarArraste() {
    arraste.current = null
    setGuias({ x: [], y: [] })
  }

  /* --- Teclado ------------------------------------------------------------- */
  useEffect(() => {
    if (testando) return
    const tecla = (ev: KeyboardEvent) => {
      const alvo = ev.target as HTMLElement | null
      const digitando = alvo && /input|textarea|select/i.test(alvo.tagName)
      const ctrl = ev.ctrlKey || ev.metaKey
      if (ctrl && ev.key.toLowerCase() === 'z' && !digitando) {
        ev.preventDefault()
        if (ev.shiftKey) refazer()
        else desfazer()
        return
      }
      if (ctrl && ev.key.toLowerCase() === 'y' && !digitando) {
        ev.preventDefault()
        refazer()
        return
      }
      if (digitando) return
      if (ctrl && ev.key.toLowerCase() === 'd') {
        ev.preventDefault()
        duplicarSelecionado()
        return
      }
      if ((ev.key === 'Delete' || ev.key === 'Backspace') && sel) {
        ev.preventDefault()
        apagarSelecionado()
        return
      }
      if (ev.key === 'Escape') setSel(null)
      if (selecionado && ev.key.startsWith('Arrow')) {
        ev.preventDefault()
        const passo = ev.shiftKey ? 0.02 : 0.005
        const d = { ArrowLeft: [-passo, 0], ArrowRight: [passo, 0], ArrowUp: [0, -passo], ArrowDown: [0, passo] }[ev.key] ?? [0, 0]
        mudarElemento(selecionado.id, prenderAoPalco({ ...selecionado, x: selecionado.x + d[0], y: selecionado.y + d[1] }), `setas:${selecionado.id}`)
      }
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  })

  /* --- Slides -------------------------------------------------------------- */
  function novoSlide() {
    const s = slideVazio()
    mudar((l) => {
      const n = [...l]
      n.splice(atual + 1, 0, { ...s, transicao: l[atual]?.transicao ?? 'fade' })
      return n
    })
    setAtual(atual + 1)
    setSel(null)
  }
  function moverSlide(i: number, d: number) {
    const j = i + d
    if (j < 0 || j >= slides.length) return
    mudar((l) => {
      const n = [...l]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })
    setAtual(j)
  }
  function duplicar(i: number) {
    mudar((l) => {
      const n = [...l]
      n.splice(i + 1, 0, duplicarSlide(l[i]))
      return n
    })
    setAtual(i + 1)
  }
  function apagarSlide(i: number) {
    if (slides.length === 1) {
      mudar(() => [slideVazio()])
      setSel(null)
      return
    }
    mudar((l) => l.filter((_, k) => k !== i))
    setAtual(Math.max(0, Math.min(i, slides.length - 2)))
    setSel(null)
  }

  /* --- Salvar -------------------------------------------------------------- */
  async function salvar(fechar = true) {
    setSalvando(true)
    try {
      const label = titulo.trim() || 'História sem nome'
      const capa = capaDaHistoria(slides)
      if (item) {
        await updateSceneLibraryItem(tableId, item.id, { label, folder: paraGravar(pasta), slides, imageUrl: capa })
        // Corrigiu uma história que está no ar: a mesa vê a correção na hora.
        if (show?.open && show.libraryId === item.id) {
          await updateStoryShow(tableId, {
            title: label,
            slides: slidesParaApresentar(slides),
            index: Math.min(show.index, slides.length - 1),
            step: 0,
          })
        }
      } else {
        await addSceneLibraryItem(tableId, {
          kind: 'story',
          label,
          folder: paraGravar(pasta),
          imageUrl: capa,
          slides,
          createdAt: Date.now(),
        })
      }
      setMudou(false)
      if (fechar) onFechar()
    } finally {
      setSalvando(false)
    }
  }

  function fechar() {
    if (mudou && !window.confirm('Fechar sem salvar? As mudanças desde o último salvamento se perdem.')) return
    onFechar()
  }

  const maxPasso = passosDoSlide(slide)

  /* --- Tela ----------------------------------------------------------------- */
  // Em portal, direto no corpo da página: o editor nasce dentro do painel da
  // biblioteca, e lá dentro ficaria por baixo da barra da tela de jogo.
  return createPortal(
    <div className="fixed inset-0 z-[55] flex flex-col bg-[color:var(--surface-board,#0b0b0b)] text-white" data-editor-historia>
      {/* Barra de cima */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--line)] bg-black px-3 py-2">
        <Input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Título da história"
          className="w-56 py-1 text-sm"
          data-titulo-historia
        />
        <Input value={pasta} onChange={(e) => setPasta(e.target.value)} placeholder="pasta: Cena 01 > Konoha" className="w-48 py-1 text-xs" />
        {pasta && normalizarCaminho(pasta) && (
          <span className="hidden text-[11px] text-orange-400/50 md:inline">→ {normalizarCaminho(pasta).replace(/\//g, ' › ')}</span>
        )}
        <span className="ml-auto flex flex-wrap items-center gap-1.5">
          <Button variant="ghost" className="px-2 py-1 text-xs" disabled={passado.current.length === 0} onClick={desfazer} title="Ctrl+Z">
            ↶ desfazer
          </Button>
          <Button variant="ghost" className="px-2 py-1 text-xs" disabled={futuro.current.length === 0} onClick={refazer} title="Ctrl+Y">
            ↷ refazer
          </Button>
          <Button variant="secondary" className="px-2 py-1 text-xs" onClick={() => setTestando({ index: atual, step: 0 })} data-testar>
            ▶ testar daqui
          </Button>
          {item && (
            <Button variant="secondary" className="px-2 py-1 text-xs" disabled={salvando} onClick={() => salvar(false)}>
              salvar
            </Button>
          )}
          <Button variant="primary" className="px-3 py-1 text-xs" disabled={salvando} onClick={() => salvar(true)} data-salvar-historia>
            {item ? 'salvar e fechar' : 'guardar na biblioteca'}
          </Button>
          <Button variant="ghost" className="px-2 py-1 text-xs" onClick={fechar}>
            fechar
          </Button>
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Slides */}
        <div className="flex shrink-0 gap-2 overflow-x-auto border-b border-[color:var(--line)] p-2 lg:w-44 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r" data-miniaturas>
          {slides.map((s, i) => (
            <div key={s.id} className="flex w-36 shrink-0 flex-col gap-0.5 lg:w-full">
              <button
                onClick={() => {
                  setAtual(i)
                  setSel(null)
                }}
                className={`relative rounded-sm text-left outline-none ring-2 ${i === atual ? 'ring-[color:var(--orange)]' : 'ring-transparent hover:ring-white/30'}`}
                data-miniatura={i}
              >
                <Palco className="pointer-events-none w-full rounded-sm">
                  <ConteudoDoSlide slide={s} todos />
                </Palco>
                <span className="absolute left-1 top-0.5 rounded-sm bg-black/70 px-1 text-[10px]">{i + 1}</span>
              </button>
              {i === atual && (
                <span className="flex justify-between text-[10px] text-orange-300/70">
                  <button disabled={i === 0} className="disabled:opacity-30" onClick={() => moverSlide(i, -1)} title="Mover para cima">
                    ▲
                  </button>
                  <button disabled={i === slides.length - 1} className="disabled:opacity-30" onClick={() => moverSlide(i, 1)} title="Mover para baixo">
                    ▼
                  </button>
                  <button onClick={() => duplicar(i)}>duplicar</button>
                  <button className="text-red-400" onClick={() => apagarSlide(i)}>
                    apagar
                  </button>
                </span>
              )}
            </div>
          ))}
          <Button variant="secondary" className="w-36 shrink-0 py-1 text-xs lg:w-full" onClick={novoSlide} data-novo-slide>
            + slide
          </Button>
        </div>

        {/* Palco */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[color:var(--line)] px-3 py-1.5" data-ferramentas>
            <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => adicionar(novoTexto())} data-add-titulo>
              + Título
            </Button>
            <Button
              variant="secondary"
              className="px-2 py-0.5 text-[11px]"
              onClick={() =>
                adicionar(novoTexto({ texto: 'Texto da narração', tamanho: 3.6, fonte: 'texto', alinhamento: 'left', vertical: 'top', y: 0.62, h: 0.3 }))
              }
              data-add-texto
            >
              + Texto
            </Button>
            <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => adicionar(novaForma())}>
              + Retângulo
            </Button>
            <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => adicionar(novaForma({ forma: 'elipse', w: 0.25, h: 0.444 }))}>
              + Círculo
            </Button>
            <Button
              variant="secondary"
              className="px-2 py-0.5 text-[11px]"
              title="Degradê escuro na parte de baixo, para o texto ler bem em cima da imagem"
              onClick={() =>
                adicionar(novaForma({ x: 0, y: 0.5, w: 1, h: 0.5, cor: '#000000', opacity: 0.9, degrade: 'baixo', entrada: 'aparecer', nome: 'faixa escura' }))
              }
            >
              + Faixa escura
            </Button>
            <span className="flex items-center gap-1">
              <Input
                value={linkImagem}
                onChange={(e) => setLinkImagem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && adicionarImagem()}
                placeholder="link da imagem (Drive serve)"
                className="w-52 px-2 py-0.5 text-[11px]"
                data-link-imagem
              />
              <Button variant="primary" className="px-2 py-0.5 text-[11px]" disabled={!linkImagem.trim()} onClick={adicionarImagem} data-add-imagem>
                + Imagem
              </Button>
            </span>
            {ehLinkDoDrive(linkImagem) && <AvisoDoDrive />}
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[#1a1a1a] p-3"
            onPointerDown={() => setSel(null)}
          >
            <div
              ref={palcoRef}
              className="relative shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_10px_40px_rgba(0,0,0,0.6)]"
              style={{ width: `min(100%, calc((100dvh - 220px) * ${ASPECTO_DO_SLIDE}))`, aspectRatio: '16 / 9', touchAction: 'none' }}
              onPointerMove={moverArraste}
              onPointerUp={soltarArraste}
              onPointerCancel={soltarArraste}
              data-palco-editor
            >
              <Palco className="absolute inset-0">
                <ConteudoDoSlide slide={slide} todos />
              </Palco>
              {/* Caixas de seleção, por cima do desenho. */}
              {elementos.map((e) => {
                const ativo = e.id === sel
                return (
                  <div
                    key={e.id}
                    className={`absolute cursor-move ${ativo ? 'outline outline-2 outline-[color:var(--orange)]' : 'hover:outline hover:outline-1 hover:outline-white/50'}`}
                    style={{
                      left: `${e.x * 100}%`,
                      top: `${e.y * 100}%`,
                      width: `${e.w * 100}%`,
                      height: `${e.h * 100}%`,
                      transform: e.rotation ? `rotate(${e.rotation}deg)` : undefined,
                    }}
                    onPointerDown={(ev) => comecarArraste(ev, e, 'mover')}
                    onDoubleClick={() => e.tipo === 'texto' && textoRef.current?.focus()}
                    data-caixa={rotuloDoElemento(e)}
                  >
                    {(e.passo ?? 0) > 0 && (
                      <span className="pointer-events-none absolute -top-4 left-0 rounded-sm bg-[color:var(--orange)] px-1 text-[9px] font-bold text-black">
                        clique {e.passo}
                      </span>
                    )}
                    {ativo &&
                      ALCAS.map((a) => (
                        <span
                          key={a}
                          className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-sm border border-black bg-white ${POS_DA_ALCA[a]}`}
                          onPointerDown={(ev) => comecarArraste(ev, e, a)}
                          data-alca={a}
                        />
                      ))}
                  </div>
                )
              })}
              {guias.x.map((g) => (
                <div key={`gx${g}`} className="pointer-events-none absolute top-0 h-full w-px bg-fuchsia-400" style={{ left: `${g * 100}%` }} />
              ))}
              {guias.y.map((g) => (
                <div key={`gy${g}`} className="pointer-events-none absolute left-0 h-px w-full bg-fuchsia-400" style={{ top: `${g * 100}%` }} />
              ))}
            </div>
          </div>
          <p className="hidden border-t border-[color:var(--line)] px-3 py-1 text-[10px] text-orange-400/50 md:block">
            Arraste para mover · alças para redimensionar (imagem mantém a proporção; Shift solta) · Alt solta o ímã · setas
            ajustam · Delete apaga · Ctrl+D duplica · Ctrl+Z desfaz · duplo clique no texto edita
          </p>
        </div>

        {/* Propriedades */}
        <div className="flex shrink-0 flex-col gap-3 overflow-y-auto border-t border-[color:var(--line)] p-3 text-xs lg:w-80 lg:border-l lg:border-t-0" data-propriedades>
          {selecionado ? (
            <PainelDoElemento
              e={selecionado}
              maxPasso={maxPasso}
              textoRef={textoRef}
              mudar={(patch, chave) => mudarElemento(selecionado.id, patch, chave ? `${selecionado.id}:${chave}` : '')}
              camada={camada}
              duplicar={duplicarSelecionado}
              apagar={apagarSelecionado}
            />
          ) : (
            <PainelDoSlide slide={slide} mudar={(patch, chave) => mudarSlide((s) => ({ ...s, ...patch }), chave ? `slide:${chave}` : '')} />
          )}

          <Secao titulo={`Camadas (${elementos.length})`}>
            {elementos.length === 0 && <p className="text-orange-400/50">Slide vazio. Use a barra acima do palco.</p>}
            {[...elementos].reverse().map((e) => (
              <div
                key={e.id}
                className={`flex items-center gap-1.5 rounded-sm px-1.5 py-1 ${e.id === sel ? 'bg-[color:var(--orange)]/20 text-white' : 'text-orange-200 hover:bg-white/5'}`}
                data-camada={rotuloDoElemento(e)}
              >
                <button className="flex min-w-0 flex-1 items-center gap-1.5 text-left" onClick={() => setSel(e.id)}>
                  <span className="w-4 text-center">{ICONE[e.tipo]}</span>
                  <span className="truncate">{rotuloDoElemento(e)}</span>
                  {(e.passo ?? 0) > 0 && <span className="text-[9px] text-[color:var(--orange)]">clique {e.passo}</span>}
                </button>
                <button title="Subir uma camada" onClick={() => camada('subir', e.id)}>
                  ▲
                </button>
                <button title="Descer uma camada" onClick={() => camada('descer', e.id)}>
                  ▼
                </button>
              </div>
            ))}
          </Secao>
        </div>
      </div>

      {testando && (
        <TesteDaApresentacao slides={slides} inicio={testando} titulo={titulo || 'História sem nome'} onSair={() => setTestando(null)} />
      )}
    </div>,
    document.body,
  )
}

/* --- Painéis ----------------------------------------------------------------- */

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-display text-[10px] uppercase tracking-[0.14em] text-orange-400/70">{titulo}</p>
      {children}
    </div>
  )
}

function Linha({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-orange-300/80">
      <span className="w-20 shrink-0">{rotulo}</span>
      <span className="flex min-w-0 flex-1 items-center gap-1.5">{children}</span>
    </label>
  )
}

function Deslizante({
  valor,
  min,
  max,
  passo,
  onMudar,
  sufixo = '',
}: {
  valor: number
  min: number
  max: number
  passo: number
  onMudar: (v: number) => void
  sufixo?: string
}) {
  return (
    <>
      <input type="range" min={min} max={max} step={passo} value={valor} onChange={(e) => onMudar(Number(e.target.value))} className="min-w-0 flex-1" />
      <span className="w-10 text-right font-mono text-[10px]">
        {Math.round(valor * 10) / 10}
        {sufixo}
      </span>
    </>
  )
}

function Cor({ valor, onMudar }: { valor: string; onMudar: (v: string) => void }) {
  return (
    <>
      <input type="color" value={valor} onChange={(e) => onMudar(e.target.value)} className="h-6 w-10 cursor-pointer rounded-sm border border-[color:var(--line)] bg-transparent" />
      <span className="font-mono text-[10px] text-orange-400/60">{valor}</span>
    </>
  )
}

function Marcar({ rotulo, valor, onMudar }: { rotulo: string; valor: boolean; onMudar: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-1.5 text-orange-200">
      <input type="checkbox" checked={valor} onChange={(e) => onMudar(e.target.checked)} />
      {rotulo}
    </label>
  )
}

function PainelDoElemento({
  e,
  maxPasso,
  textoRef,
  mudar,
  camada,
  duplicar,
  apagar,
}: {
  e: SlideElemento
  maxPasso: number
  textoRef: React.RefObject<HTMLTextAreaElement | null>
  mudar: (patch: Partial<SlideElemento>, chave?: string) => void
  camada: (para: 'frente' | 'tras' | 'subir' | 'descer') => void
  duplicar: () => void
  apagar: () => void
}) {
  const pct = (v: number) => Math.round(v * 1000) / 10
  return (
    <>
      <Secao titulo={e.tipo === 'texto' ? 'Texto' : e.tipo === 'imagem' ? 'Imagem' : 'Forma'}>
        <Linha rotulo="nome da camada">
          <Input value={e.nome ?? ''} onChange={(ev) => mudar({ nome: ev.target.value || undefined }, 'nome')} placeholder={rotuloDoElemento({ ...e, nome: undefined })} className="py-0.5 text-xs" />
        </Linha>
        {e.tipo === 'texto' && <CamposDoTexto e={e} mudar={mudar} textoRef={textoRef} />}
        {e.tipo === 'imagem' && <CamposDaImagem e={e} mudar={mudar} />}
        {e.tipo === 'forma' && <CamposDaForma e={e} mudar={mudar} />}
      </Secao>

      <Secao titulo="Posição e tamanho (% do slide)">
        <div className="grid grid-cols-4 gap-1">
          {(['x', 'y', 'w', 'h'] as const).map((k) => (
            <label key={k} className="flex flex-col text-[10px] text-orange-400/60">
              {{ x: 'X', y: 'Y', w: 'largura', h: 'altura' }[k]}
              <Input
                type="number"
                step={0.5}
                value={pct(e[k])}
                onChange={(ev) => mudar(prenderAoPalco({ ...e, [k]: (Number(ev.target.value) || 0) / 100 }), `pos-${k}`)}
                className="px-1 py-0.5 text-xs"
              />
            </label>
          ))}
        </div>
        <span className="flex flex-wrap gap-1">
          <Button variant="ghost" className="px-1.5 py-0.5 text-[10px]" onClick={() => mudar({ x: (1 - e.w) / 2 })}>
            centralizar ↔
          </Button>
          <Button variant="ghost" className="px-1.5 py-0.5 text-[10px]" onClick={() => mudar({ y: (1 - e.h) / 2 })}>
            centralizar ↕
          </Button>
          <Button variant="ghost" className="px-1.5 py-0.5 text-[10px]" onClick={() => mudar({ x: 0, y: 0, w: 1, h: 1 })}>
            ocupar o slide
          </Button>
        </span>
        <Linha rotulo="giro">
          <Deslizante valor={e.rotation ?? 0} min={-180} max={180} passo={1} sufixo="°" onMudar={(v) => mudar({ rotation: v || undefined }, 'giro')} />
        </Linha>
        <Linha rotulo="opacidade">
          <Deslizante valor={(e.opacity ?? 1) * 100} min={0} max={100} passo={1} sufixo="%" onMudar={(v) => mudar({ opacity: v / 100 }, 'opac')} />
        </Linha>
      </Secao>

      <Secao titulo="Camada">
        <span className="grid grid-cols-2 gap-1">
          <Button variant="secondary" className="px-1.5 py-0.5 text-[10px]" onClick={() => camada('frente')} data-trazer-frente>
            trazer para a frente
          </Button>
          <Button variant="secondary" className="px-1.5 py-0.5 text-[10px]" onClick={() => camada('tras')} data-enviar-tras>
            enviar para trás
          </Button>
          <Button variant="ghost" className="px-1.5 py-0.5 text-[10px]" onClick={() => camada('subir')}>
            ▲ subir um nível
          </Button>
          <Button variant="ghost" className="px-1.5 py-0.5 text-[10px]" onClick={() => camada('descer')}>
            ▼ descer um nível
          </Button>
        </span>
      </Secao>

      <Secao titulo="Animação na apresentação">
        <Linha rotulo="entrada">
          <Select value={e.entrada ?? 'nenhuma'} onChange={(ev) => mudar({ entrada: ev.target.value as SlideEntrada })} className="py-0.5 text-xs" data-entrada>
            {ENTRADAS.map(([k, r]) => (
              <option key={k} value={k}>
                {r}
              </option>
            ))}
          </Select>
        </Linha>
        <Linha rotulo="aparece">
          <Select value={e.passo ?? 0} onChange={(ev) => mudar({ passo: Number(ev.target.value) || undefined })} className="py-0.5 text-xs" data-passo>
            <option value={0}>junto com o slide</option>
            {Array.from({ length: maxPasso + 1 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                no {n}º clique do mestre
              </option>
            ))}
          </Select>
        </Linha>
        {(e.entrada ?? 'nenhuma') !== 'nenhuma' && (
          <>
            <Linha rotulo="atraso">
              <Deslizante valor={(e.atraso ?? 0) / 1000} min={0} max={5} passo={0.1} sufixo="s" onMudar={(v) => mudar({ atraso: Math.round(v * 1000) || undefined }, 'atraso')} />
            </Linha>
            <Linha rotulo="duração">
              <Deslizante valor={(e.duracao ?? 600) / 1000} min={0.2} max={4} passo={0.1} sufixo="s" onMudar={(v) => mudar({ duracao: Math.round(v * 1000) }, 'duracao')} />
            </Linha>
          </>
        )}
      </Secao>

      <span className="flex gap-1.5">
        <Button variant="secondary" className="flex-1 py-1 text-[11px]" onClick={duplicar}>
          duplicar
        </Button>
        <Button variant="danger" className="flex-1 py-1 text-[11px]" onClick={apagar} data-apagar-elemento>
          apagar
        </Button>
      </span>
    </>
  )
}

function CamposDoTexto({
  e,
  mudar,
  textoRef,
}: {
  e: SlideTexto
  mudar: (patch: Partial<SlideTexto>, chave?: string) => void
  textoRef: React.RefObject<HTMLTextAreaElement | null>
}) {
  return (
    <>
      <Textarea ref={textoRef} rows={4} value={e.texto} onChange={(ev) => mudar({ texto: ev.target.value }, 'texto')} className="text-xs" data-texto-elemento />
      <Linha rotulo="tamanho">
        <Deslizante valor={e.tamanho} min={1} max={25} passo={0.1} onMudar={(v) => mudar({ tamanho: v }, 'tamanho')} />
      </Linha>
      <Linha rotulo="cor">
        <Cor valor={e.cor} onMudar={(v) => mudar({ cor: v }, 'cor')} />
      </Linha>
      <Linha rotulo="fonte">
        <Select value={e.fonte ?? 'titulo'} onChange={(ev) => mudar({ fonte: ev.target.value as SlideTexto['fonte'] })} className="py-0.5 text-xs">
          <option value="titulo">Título (Oswald)</option>
          <option value="texto">Texto (Inter)</option>
          <option value="serifa">Serifa (Georgia)</option>
        </Select>
      </Linha>
      <Linha rotulo="alinhar">
        {(['left', 'center', 'right'] as const).map((a) => (
          <Button key={a} variant={(e.alinhamento ?? 'center') === a ? 'primary' : 'ghost'} className="px-2 py-0.5 text-[10px]" onClick={() => mudar({ alinhamento: a })}>
            {{ left: 'esq.', center: 'centro', right: 'dir.' }[a]}
          </Button>
        ))}
      </Linha>
      <Linha rotulo="na caixa">
        {(['top', 'middle', 'bottom'] as const).map((a) => (
          <Button key={a} variant={(e.vertical ?? 'middle') === a ? 'primary' : 'ghost'} className="px-2 py-0.5 text-[10px]" onClick={() => mudar({ vertical: a })}>
            {{ top: 'topo', middle: 'meio', bottom: 'base' }[a]}
          </Button>
        ))}
      </Linha>
      <span className="flex flex-wrap gap-3">
        <Marcar rotulo="negrito" valor={Boolean(e.negrito)} onMudar={(v) => mudar({ negrito: v })} />
        <Marcar rotulo="itálico" valor={Boolean(e.italico)} onMudar={(v) => mudar({ italico: v })} />
        <Marcar rotulo="contorno" valor={Boolean(e.sombra)} onMudar={(v) => mudar({ sombra: v })} />
        <Marcar rotulo="fundo" valor={Boolean(e.fundo)} onMudar={(v) => mudar({ fundo: v ? '#000000' : undefined })} />
      </span>
      {e.fundo && (
        <>
          <Linha rotulo="cor do fundo">
            <Cor valor={e.fundo} onMudar={(v) => mudar({ fundo: v }, 'fundo')} />
          </Linha>
          <Linha rotulo="fundo visível">
            <Deslizante valor={(e.fundoOpacidade ?? 0.6) * 100} min={0} max={100} passo={1} sufixo="%" onMudar={(v) => mudar({ fundoOpacidade: v / 100 }, 'fundoop')} />
          </Linha>
        </>
      )}
    </>
  )
}

function CamposDaImagem({ e, mudar }: { e: SlideImagem; mudar: (patch: Partial<SlideImagem>, chave?: string) => void }) {
  const [link, setLink] = useState(e.url)
  useEffect(() => setLink(e.url), [e.url])
  return (
    <>
      <Linha rotulo="link">
        <Input
          value={link}
          onChange={(ev) => setLink(ev.target.value)}
          onBlur={() => link !== e.url && mudar({ url: normalizeImageUrl(link) ?? '' })}
          className="py-0.5 text-xs"
        />
      </Linha>
      {ehLinkDoDrive(link) && <AvisoDoDrive />}
      <Linha rotulo="encaixe">
        <Select value={e.fit ?? 'contain'} onChange={(ev) => mudar({ fit: ev.target.value as 'cover' | 'contain' })} className="py-0.5 text-xs">
          <option value="contain">imagem inteira</option>
          <option value="cover">preencher a caixa (recorta)</option>
        </Select>
      </Linha>
      <Button
        variant="ghost"
        className="self-start px-1.5 py-0.5 text-[10px]"
        title="Ajusta a altura da caixa à proporção da imagem"
        onClick={async () => {
          const r = await proporcaoDaImagem(normalizeImageUrl(e.url) ?? e.url)
          if (r) mudar({ h: e.w * ASPECTO_DO_SLIDE * r })
        }}
      >
        proporção original
      </Button>
      <Linha rotulo="cantos">
        <Deslizante valor={e.raio ?? 0} min={0} max={30} passo={0.5} onMudar={(v) => mudar({ raio: v || undefined }, 'raio')} />
      </Linha>
      <span className="flex flex-wrap gap-3">
        <Marcar rotulo="sombra (PNG)" valor={Boolean(e.sombra)} onMudar={(v) => mudar({ sombra: v })} />
        <Marcar rotulo="espelhar" valor={Boolean(e.espelhar)} onMudar={(v) => mudar({ espelhar: v })} />
      </span>
    </>
  )
}

function CamposDaForma({ e, mudar }: { e: SlideForma; mudar: (patch: Partial<SlideForma>, chave?: string) => void }) {
  return (
    <>
      <Linha rotulo="forma">
        <Select value={e.forma} onChange={(ev) => mudar({ forma: ev.target.value as SlideForma['forma'] })} className="py-0.5 text-xs">
          <option value="retangulo">retângulo</option>
          <option value="elipse">círculo / elipse</option>
        </Select>
      </Linha>
      <Linha rotulo="cor">
        <Cor valor={e.cor} onMudar={(v) => mudar({ cor: v }, 'cor')} />
      </Linha>
      <Linha rotulo="degradê">
        <Select value={e.degrade ?? 'nenhum'} onChange={(ev) => mudar({ degrade: ev.target.value as SlideForma['degrade'] })} className="py-0.5 text-xs">
          <option value="nenhum">cor sólida</option>
          <option value="baixo">mais forte embaixo</option>
          <option value="cima">mais forte em cima</option>
          <option value="esquerda">mais forte à esquerda</option>
          <option value="direita">mais forte à direita</option>
        </Select>
      </Linha>
      {e.forma === 'retangulo' && (
        <Linha rotulo="cantos">
          <Deslizante valor={e.raio ?? 0} min={0} max={30} passo={0.5} onMudar={(v) => mudar({ raio: v || undefined }, 'raio')} />
        </Linha>
      )}
      <Marcar rotulo="borda" valor={Boolean(e.borda)} onMudar={(v) => mudar({ borda: v ? '#f97316' : undefined })} />
      {e.borda && (
        <Linha rotulo="cor da borda">
          <Cor valor={e.borda} onMudar={(v) => mudar({ borda: v }, 'borda')} />
        </Linha>
      )}
    </>
  )
}

function PainelDoSlide({ slide, mudar }: { slide: StorySlide; mudar: (patch: Partial<StorySlide>, chave?: string) => void }) {
  const [link, setLink] = useState(slide.fundoUrl ?? '')
  useEffect(() => setLink(slide.fundoUrl ?? ''), [slide.id, slide.fundoUrl])
  return (
    <>
      <Secao titulo="Slide">
        <p className="text-orange-400/50">Nada selecionado: estas são as opções do slide inteiro.</p>
        <Linha rotulo="cor de fundo">
          <Cor valor={slide.fundoCor ?? '#000000'} onMudar={(v) => mudar({ fundoCor: v }, 'fundocor')} />
        </Linha>
        <Linha rotulo="imagem de fundo">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            onBlur={() => link !== (slide.fundoUrl ?? '') && mudar({ fundoUrl: normalizeImageUrl(link) || undefined })}
            placeholder="link (Drive serve)"
            className="py-0.5 text-xs"
            data-fundo-slide
          />
        </Linha>
        {ehLinkDoDrive(link) && <AvisoDoDrive />}
        {slide.fundoUrl && (
          <>
            <Linha rotulo="encaixe">
              <Select value={slide.fundoFit ?? 'cover'} onChange={(e) => mudar({ fundoFit: e.target.value as 'cover' | 'contain' })} className="py-0.5 text-xs">
                <option value="cover">preencher o slide</option>
                <option value="contain">imagem inteira</option>
              </Select>
            </Linha>
            <Marcar rotulo="zoom lento no fundo (efeito cinema)" valor={Boolean(slide.kenBurns)} onMudar={(v) => mudar({ kenBurns: v || undefined })} />
          </>
        )}
      </Secao>
      <Secao titulo="Transição de entrada deste slide">
        <Linha rotulo="efeito">
          <Select value={slide.transicao ?? 'fade'} onChange={(e) => mudar({ transicao: e.target.value as SlideTransicao })} className="py-0.5 text-xs" data-transicao>
            {TRANSICOES.map(([k, r]) => (
              <option key={k} value={k}>
                {r}
              </option>
            ))}
          </Select>
        </Linha>
        {(slide.transicao ?? 'fade') !== 'nenhuma' && (
          <Linha rotulo="duração">
            <Deslizante
              valor={(slide.transicaoMs ?? TRANSICAO_PADRAO_MS) / 1000}
              min={0.2}
              max={4}
              passo={0.1}
              sufixo="s"
              onMudar={(v) => mudar({ transicaoMs: Math.round(v * 1000) }, 'trms')}
            />
          </Linha>
        )}
      </Secao>
      <Secao titulo="Notas do mestre">
        <Textarea
          rows={4}
          value={slide.notas ?? ''}
          onChange={(e) => mudar({ notas: e.target.value || undefined }, 'notas')}
          placeholder="O que você quer lembrar enquanto narra. Só você vê — não vai para a tela dos jogadores."
          className="text-xs"
          data-notas
        />
      </Secao>
    </>
  )
}

/** "Testar": a apresentação só na tela do mestre, para conferir transições e cliques. */
function TesteDaApresentacao({
  slides,
  inicio,
  titulo,
  onSair,
}: {
  slides: StorySlide[]
  inicio: Posicao
  titulo: string
  onSair: () => void
}) {
  const [p, setP] = useState(inicio)
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault()
        setP((q) => avancar(slides, q) ?? q)
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') setP((q) => voltar(slides, q) ?? q)
      if (e.key === 'Escape') onSair()
    }
    window.addEventListener('keydown', tecla)
    return () => window.removeEventListener('keydown', tecla)
  }, [slides, onSair])
  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-black" data-teste-apresentacao>
      <div className="flex min-h-0 flex-1 items-center justify-center" onClick={() => setP((q) => avancar(slides, q) ?? q)}>
        <PalcoDaApresentacao slides={slides} index={p.index} passo={p.step} style={{ width: 'min(100%, calc((100dvh - 44px) * 16 / 9))' }} />
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-white/10 px-3 py-1.5 text-xs text-white">
        <span className="text-orange-300/70">
          teste — só você vê · {titulo} · slide {p.index + 1}/{slides.length}
          {passosDoSlide(slides[p.index]) > 0 && ` · clique ${p.step}/${passosDoSlide(slides[p.index])}`}
        </span>
        <span className="flex gap-1.5">
          <Button variant="secondary" className="px-2 py-0.5 text-xs" onClick={() => setP((q) => voltar(slides, q) ?? q)}>
            ◀
          </Button>
          <Button variant="primary" className="px-2 py-0.5 text-xs" onClick={() => setP((q) => avancar(slides, q) ?? q)} data-teste-proximo>
            ▶
          </Button>
          <Button variant="ghost" className="px-2 py-0.5 text-xs" onClick={onSair}>
            sair do teste
          </Button>
        </span>
      </div>
    </div>
  )
}
