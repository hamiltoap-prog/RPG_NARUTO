import { useCallback, useEffect, useRef, useState } from 'react'
import { enderecosDa, mensagemDeErro } from '../lib/audioLinks'
import { loadYouTubeApi, type YTPlayer } from '../lib/youtube'
import type { AudioTrack } from '../types'

/**
 * Um canal de som: ambientação, clima ou combate.
 *
 * O canal recebe a faixa que DEVERIA tocar e decide sozinho, comparando com a
 * que está tocando de fato, se precisa começar, trocar ou parar. Tem duas
 * saídas físicas — um `<audio>` para arquivo direto e um player do YouTube
 * escondido para vídeo — e escolhe pela `source` da faixa.
 *
 * Três armadilhas de navegador moldam este componente, e cada uma tem o seu
 * trecho marcado abaixo:
 *
 *  1. AUTOPLAY. Som só começa dentro de um gesto da pessoa. O `unlock()` é
 *     chamado DE DENTRO do clique em "Ligar o som" e toca um WAV de silêncio
 *     no `<audio>`: o navegador marca o elemento como já usado num gesto, e os
 *     `play()` seguintes — vindos de efeitos, de dados chegando do banco —
 *     passam a funcionar sem gesto novo.
 *  2. A CORRIDA DO YOUTUBE ("só funciona na segunda tentativa"). A faixa só é
 *     marcada como tocando DEPOIS de a chamada de play ter saído de fato — e o
 *     efeito que decide tocar depende de `ytReady`. Se o player ainda não
 *     carregou, o efeito espera; quando ele fica pronto, o efeito roda de novo
 *     e toca a faixa pendente, sem ninguém clicar de novo.
 *  3. LINK QUE NÃO SERVE O ARQUIVO. No erro do `<audio>`, o canal tenta o
 *     próximo endereço alternativo; só depois de esgotar todos ele reporta, e
 *     com uma frase que a pessoa entende.
 */

export type ChannelState = 'locked' | 'idle' | 'loading' | 'playing' | 'error'

export interface ChannelStatus {
  estado: ChannelState
  faixa?: string
  mensagem?: string
}

/** WAV de 8 amostras de silêncio. Vazio não serve: alguns navegadores recusam. */
const SILENCIO = 'data:audio/wav;base64,UklGRiwAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQgAAACAgICAgICAgA=='

/** Toda entrada, saída e troca passa por um fade — troca seca estoura no ouvido. */
const FADE_MS = 1200
const PASSOS = 30

/** Os erros que o YouTube devolve no `onError`. */
function erroDoYoutube(codigo: number): string {
  if (codigo === 101 || codigo === 150) return 'O dono deste vídeo não permite tocá-lo fora do YouTube. Escolha outro vídeo.'
  if (codigo === 100) return 'Vídeo removido ou privado.'
  if (codigo === 2) return 'Link do YouTube inválido.'
  if (codigo === 5) return 'O YouTube não conseguiu tocar este vídeo neste navegador.'
  return 'O YouTube recusou este vídeo.'
}

export function AudioChannel({
  nome,
  track,
  volume,
  onRegister,
  onStatus,
  preloadYoutube = false,
  tentativa = 0,
}: {
  nome: string
  track: AudioTrack | null
  /** 0 a 1, já com o silêncio local aplicado. */
  volume: number
  /** Entrega o `unlock` deste canal ao pai, que chama todos no mesmo clique. */
  onRegister: (nome: string, unlock: () => void) => void
  onStatus: (nome: string, s: ChannelStatus) => void
  /** Há faixa de YouTube no horizonte: cria o player antes, para estar pronto no primeiro clique. */
  preloadYoutube?: boolean
  /** Aumentar este número força uma nova tentativa depois de um erro. */
  tentativa?: number
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytBox = useRef<HTMLDivElement | null>(null)
  const yt = useRef<YTPlayer | null>(null)
  const [ytReady, setYtReady] = useState(false)
  const [liberado, setLiberado] = useState(false)

  /** A faixa que está tocando DE FATO — nunca a que se pretende tocar. */
  const playingId = useRef<string | null>(null)
  /** Qual saída está com som agora. */
  const saida = useRef<'direct' | 'youtube' | null>(null)
  /** Em qual endereço da faixa estamos, para os alternativos. */
  const indiceDoEndereco = useRef(0)
  /** O volume aplicado agora nas saídas — o ponto de partida de cada fade. */
  const volumeAtual = useRef(0)
  const fadeTimer = useRef<number | null>(null)
  /** A faixa pedida, para os callbacks (erro, fim do vídeo) lerem a atual. */
  const pedida = useRef<AudioTrack | null>(track)
  pedida.current = track
  const volumeAlvo = useRef(volume)
  volumeAlvo.current = volume

  const status = useCallback((s: ChannelStatus) => onStatus(nome, s), [nome, onStatus])

  /** Aplica um volume nas duas saídas de uma vez. */
  const aplicarVolume = useCallback((v: number) => {
    volumeAtual.current = v
    if (audioRef.current) audioRef.current.volume = Math.max(0, Math.min(1, v))
    yt.current?.setVolume(Math.round(Math.max(0, Math.min(1, v)) * 100))
  }, [])

  /** Interpola o volume até `alvo` em ~1,2s; `depois` roda ao chegar. */
  const fade = useCallback(
    (alvo: number, ms: number, depois?: () => void) => {
      if (fadeTimer.current) window.clearInterval(fadeTimer.current)
      const inicio = volumeAtual.current
      let passo = 0
      fadeTimer.current = window.setInterval(() => {
        passo += 1
        aplicarVolume(inicio + ((alvo - inicio) * passo) / PASSOS)
        if (passo >= PASSOS) {
          if (fadeTimer.current) window.clearInterval(fadeTimer.current)
          fadeTimer.current = null
          depois?.()
        }
      }, ms / PASSOS)
    },
    [aplicarVolume],
  )

  /** Cala as duas saídas, sem fade — para depois de um fade de saída. */
  const calarTudo = useCallback(() => {
    // A saída é esquecida ANTES de esvaziar o elemento: o `load()` sem fonte
    // não pode ser confundido com um link quebrado pelo `aoErrar`.
    saida.current = null
    const a = audioRef.current
    if (a) {
      a.pause()
      a.removeAttribute('src')
      a.load()
    }
    yt.current?.stopVideo()
  }, [])

  /* --- 1. Desbloqueio, dentro do clique ------------------------------------ */
  const unlock = useCallback(() => {
    const a = audioRef.current
    if (a) {
      a.src = SILENCIO
      a.volume = 0
      // O play PRECISA sair aqui, no mesmo tique do clique. O resultado não
      // importa: se a faixa de verdade trocar o src antes do fim, este play é
      // abortado — e tudo bem, o elemento já foi "abençoado".
      void a.play().catch(() => undefined)
    }
    setLiberado(true)
  }, [])

  useEffect(() => onRegister(nome, unlock), [nome, onRegister, unlock])

  /* --- YouTube: o player é criado cedo, e "pronto" é estado ---------------- */
  const precisaDoYoutube = preloadYoutube || track?.source === 'youtube'
  useEffect(() => {
    if (!precisaDoYoutube || yt.current || !ytBox.current) return
    let vivo = true
    loadYouTubeApi().then((YT) => {
      if (!vivo || !ytBox.current || yt.current) return
      yt.current = new YT.Player(ytBox.current, {
        height: '0',
        width: '0',
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, playsinline: 1, rel: 0 },
        events: {
          onReady: () => {
            yt.current?.setVolume(0)
            // Vira estado de propósito: é a dependência que faz o efeito de
            // tocar rodar de novo quando o player fica pronto.
            setYtReady(true)
          },
          onStateChange: (e: { data: number }) => {
            // O YouTube não tem laço para vídeo avulso: relança ao terminar.
            if (e.data === 0 && pedida.current?.source === 'youtube' && saida.current === 'youtube') {
              yt.current?.seekTo(0, true)
              yt.current?.playVideo()
            }
            if (e.data === 1 && saida.current === 'youtube') {
              status({ estado: 'playing', faixa: pedida.current?.label })
            }
          },
          onError: (e: { data: number }) => {
            playingId.current = null
            status({ estado: 'error', faixa: pedida.current?.label, mensagem: erroDoYoutube(e.data) })
          },
        },
      })
    })
    return () => {
      vivo = false
    }
  }, [precisaDoYoutube, status])

  /** Começa a faixa na saída certa. Devolve se a chamada de play saiu de fato. */
  const comecar = useCallback(
    (t: AudioTrack): boolean => {
      if (t.source === 'youtube') {
        // --- 2. A corrida: sem player pronto, NÃO marca como tocando. ---
        if (!yt.current || !ytReady || !t.youtubeId) {
          status({ estado: 'loading', faixa: t.label, mensagem: 'preparando o YouTube…' })
          return false
        }
        audioRef.current?.pause()
        aplicarVolume(0)
        yt.current.loadVideoById(t.youtubeId)
        yt.current.playVideo()
        saida.current = 'youtube'
        status({ estado: 'loading', faixa: t.label })
        return true
      }

      const a = audioRef.current
      if (!a) return false
      yt.current?.stopVideo()
      indiceDoEndereco.current = 0
      a.loop = true
      a.src = enderecosDa(t)[0]
      aplicarVolume(0)
      saida.current = 'direct'
      status({ estado: 'loading', faixa: t.label })
      a.play()
        .then(() => status({ estado: 'playing', faixa: t.label }))
        .catch((err: Error) => {
          // Autoplay recusado: só acontece se ninguém clicou em "Ligar o som".
          if (err.name === 'NotAllowedError') {
            playingId.current = null
            status({ estado: 'locked', faixa: t.label, mensagem: 'clique em Ligar o som' })
          }
          // Os outros erros chegam pelo onError do elemento, que tenta os alternativos.
        })
      return true
    },
    [aplicarVolume, status, ytReady],
  )

  /* --- O efeito que decide: começar, trocar ou parar ------------------------ */
  useEffect(() => {
    if (!liberado) {
      status({ estado: track ? 'locked' : 'idle', faixa: track?.label })
      return
    }
    const desejada = track

    // Nada para tocar: sai com fade e cala.
    if (!desejada) {
      if (playingId.current) {
        playingId.current = null
        fade(0, FADE_MS, calarTudo)
      }
      status({ estado: 'idle' })
      return
    }

    // Já é esta que toca: nada a fazer (o volume tem efeito próprio).
    if (playingId.current === desejada.id) return

    const entrar = () => {
      if (comecar(desejada)) {
        playingId.current = desejada.id
        // Se o mestre mexeu no volume no meio do fade de entrada, o efeito de
        // volume esperou; ao chegar, o canal confere e corrige.
        fade(volumeAlvo.current, FADE_MS, () => {
          if (Math.abs(volumeAtual.current - volumeAlvo.current) > 0.01) fade(volumeAlvo.current, 300)
        })
      }
    }

    // Troca: a anterior sai com fade, e só então a nova entra.
    if (playingId.current) {
      playingId.current = null
      fade(0, FADE_MS, () => {
        calarTudo()
        entrar()
      })
    } else {
      entrar()
    }
    // `tentativa` força nova tentativa depois de um erro.
  }, [track?.id, track?.source, liberado, ytReady, tentativa]) // eslint-disable-line react-hooks/exhaustive-deps

  /* --- Volume: acompanha o mestre, sem trocar de faixa ---------------------- */
  useEffect(() => {
    if (!playingId.current || fadeTimer.current) return
    fade(volume, 300)
  }, [volume, fade])

  /* --- 3. Endereço que não serve: tenta o próximo, só depois reporta -------- */
  function aoErrar() {
    const a = audioRef.current
    const t = pedida.current
    if (!a || !t || saida.current !== 'direct' || a.src === SILENCIO) return
    const enderecos = enderecosDa(t)
    const proximo = indiceDoEndereco.current + 1
    if (proximo < enderecos.length) {
      indiceDoEndereco.current = proximo
      status({ estado: 'loading', faixa: t.label, mensagem: `tentando endereço ${proximo + 1} de ${enderecos.length}…` })
      a.src = enderecos[proximo]
      void a.play().then(() => status({ estado: 'playing', faixa: t.label })).catch(() => undefined)
      return
    }
    playingId.current = null
    status({ estado: 'error', faixa: t.label, mensagem: mensagemDeErro(t.provider, a.error?.code) })
  }

  useEffect(
    () => () => {
      if (fadeTimer.current) window.clearInterval(fadeTimer.current)
      yt.current?.destroy()
    },
    [],
  )

  return (
    <>
      <audio ref={audioRef} preload="auto" onError={aoErrar} data-canal={nome} className="hidden" />
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
        <div ref={ytBox} data-canal-yt={nome} />
      </div>
    </>
  )
}
