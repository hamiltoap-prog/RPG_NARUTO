/**
 * Mesa de som via YouTube.
 *
 * O vídeo toca escondido: o que interessa é o áudio. A sincronia vem de um
 * único número guardado na mesa — o instante em que a faixa começou. Quem
 * chega no meio da sessão pula para o ponto certo em vez de ouvir do início.
 */

/** Aceita as formas que o YouTube usa: watch, youtu.be, embed e shorts. */
export function extractVideoId(url: string): string {
  const limpo = url.trim()
  if (!limpo) return ''
  // Já é um id solto (11 caracteres do alfabeto do YouTube).
  if (/^[\w-]{11}$/.test(limpo)) return limpo
  const padroes = [
    /[?&]v=([\w-]{11})/,
    /youtu\.be\/([\w-]{11})/,
    /\/embed\/([\w-]{11})/,
    /\/shorts\/([\w-]{11})/,
    /\/live\/([\w-]{11})/,
  ]
  for (const p of padroes) {
    const m = limpo.match(p)
    if (m) return m[1]
  }
  return ''
}

/* ---------------------------------------------------------------------------
 * Carregamento da API de iframe do YouTube
 *
 * O script é global e só pode entrar uma vez na página; a promessa guardada
 * aqui faz todo mundo que precisar esperar a mesma carga.
 * ------------------------------------------------------------------------- */

interface YTPlayer {
  loadVideoById(opts: { videoId: string; startSeconds?: number }): void
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  setVolume(v: number): void
  seekTo(s: number, allowSeekAhead: boolean): void
  destroy(): void
  getPlayerState(): number
}

interface YTNamespace {
  Player: new (el: HTMLElement, opts: Record<string, unknown>) => YTPlayer
  PlayerState: { ENDED: number; PLAYING: number; PAUSED: number }
}

declare global {
  interface Window {
    YT?: YTNamespace
    onYouTubeIframeAPIReady?: () => void
  }
}

let carregando: Promise<YTNamespace> | null = null

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (carregando) return carregando
  carregando = new Promise((resolve) => {
    const anterior = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      anterior?.()
      resolve(window.YT!)
    }
    const s = document.createElement('script')
    s.src = 'https://www.youtube.com/iframe_api'
    document.head.append(s)
  })
  return carregando
}

export type { YTPlayer }
