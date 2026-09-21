import { useEffect, useRef, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, TabChip } from './ui'
import { newId } from '../lib/id'
import { deleteSoundTrack, listenSoundTracks, saveSoundTrack, updateTable } from '../lib/store'
import { extractVideoId, loadYouTubeApi, type YTPlayer } from '../lib/youtube'
import { SOUND_CATEGORY_LABELS } from '../types'
import type { GameTable, SoundCategory, SoundTrack } from '../types'

/**
 * O player que toca na tela de todo mundo.
 *
 * Fica escondido — o que interessa é o áudio. Duas coisas valem explicar:
 *
 *  - NAVEGADOR NÃO DEIXA TOCAR SOZINHO. Sem um clique da pessoa, o áudio é
 *    bloqueado. Por isso existe o botão "ligar o som da mesa": ele é o gesto
 *    que o navegador exige, e só aparece uma vez.
 *  - SINCRONIA POR UM NÚMERO SÓ. A mesa guarda quando a faixa começou; quem
 *    chega no meio pula para o ponto certo, em vez de ouvir do início.
 */
export function TableSoundPlayer({ table }: { table: GameTable }) {
  const [liberado, setLiberado] = useState(false)
  const caixa = useRef<HTMLDivElement | null>(null)
  const player = useRef<YTPlayer | null>(null)
  const tocandoAgora = useRef<string>('')

  const audio = table.audio

  useEffect(() => {
    if (!liberado || !caixa.current) return
    let vivo = true
    loadYouTubeApi().then((YT) => {
      if (!vivo || !caixa.current || player.current) return
      player.current = new YT.Player(caixa.current, {
        height: '0',
        width: '0',
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, playsinline: 1 },
        events: {
          onReady: () => aplicar(),
          onStateChange: (e: { data: number }) => {
            // Repete a faixa quando ela acaba, se a mesa pediu laço.
            if (e.data === YT.PlayerState.ENDED && table.audio?.loop) player.current?.seekTo(0, true)
          },
        },
      })
    })
    return () => {
      vivo = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liberado])

  /** Põe o player no estado que a mesa mandou. */
  function aplicar() {
    const p = player.current
    if (!p || !audio) return
    p.setVolume(audio.volume ?? 60)
    if (!audio.videoId || !audio.playing) {
      p.pauseVideo()
      tocandoAgora.current = ''
      return
    }
    // Troca de faixa: entra no ponto em que a mesa já está.
    if (tocandoAgora.current !== audio.videoId) {
      const decorrido = Math.max(0, Math.floor((Date.now() - audio.startedAt) / 1000))
      p.loadVideoById({ videoId: audio.videoId, startSeconds: decorrido })
      tocandoAgora.current = audio.videoId
      return
    }
    p.playVideo()
  }

  useEffect(aplicar, [audio?.videoId, audio?.playing, audio?.volume, audio?.startedAt])

  if (!audio?.videoId || !audio.playing) return null

  return (
    <div className="fixed bottom-3 right-3 z-40">
      {liberado ? (
        <div className="plaque flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs">
          <span className="animate-ember inline-block h-2 w-2 rounded-full bg-[color:var(--orange)]" />
          <span className="text-orange-200">{audio.label}</span>
        </div>
      ) : (
        <Button variant="primary" onClick={() => setLiberado(true)}>
          🔊 Ligar o som da mesa
        </Button>
      )}
      <div ref={caixa} className="h-0 w-0 overflow-hidden" />
    </div>
  )
}

/** A trilha da mesa: o mestre guarda as faixas e escolhe o que toca. */
export function SoundBoard({ table }: { table: GameTable }) {
  const [tracks, setTracks] = useState<SoundTrack[]>([])
  const [aba, setAba] = useState<SoundCategory>('ambiente')
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => listenSoundTracks(table.id, setTracks), [table.id])

  const audio = table.audio
  const doAba = tracks.filter((t) => t.category === aba)

  async function guardar() {
    const id = extractVideoId(url)
    if (!id) {
      setErro('Não reconheci esse link do YouTube. Cole o endereço do vídeo.')
      return
    }
    setErro('')
    await saveSoundTrack(table.id, {
      id: newId(),
      tableId: table.id,
      category: aba,
      label: label.trim() || 'Faixa sem nome',
      url: url.trim(),
      createdAt: Date.now(),
    })
    setLabel('')
    setUrl('')
  }

  async function tocar(t: SoundTrack) {
    await updateTable(table.id, {
      audio: {
        videoId: extractVideoId(t.url),
        label: t.label,
        startedAt: Date.now(),
        playing: true,
        loop: audio?.loop ?? true,
        volume: audio?.volume ?? 60,
      },
    })
  }

  async function parar() {
    if (!audio) return
    await updateTable(table.id, { audio: { ...audio, playing: false } })
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Mesa de som</SectionTitle>
          {audio?.videoId && audio.playing && (
            <span className="flex items-center gap-2">
              <Badge tone="good">no ar: {audio.label}</Badge>
              <Button variant="danger" className="px-2 py-0.5 text-[11px]" onClick={parar}>
                parar
              </Button>
            </span>
          )}
        </div>
        <p className="text-xs leading-relaxed text-orange-400/60">
          A faixa toca do YouTube no navegador de cada um. Quem entrar no meio pula para o ponto em que a mesa já está.
          Na primeira vez, cada pessoa precisa clicar em <b className="text-orange-200">Ligar o som da mesa</b> — o
          navegador não deixa tocar áudio sozinho.
        </p>

        {audio?.videoId && (
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 text-xs text-orange-200">
              volume
              <input
                type="range"
                min={0}
                max={100}
                value={audio.volume ?? 60}
                onChange={(e) => updateTable(table.id, { audio: { ...audio, volume: Number(e.target.value) } })}
                className="w-40"
              />
              <span className="w-8 text-right text-orange-400/60">{audio.volume ?? 60}</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs text-orange-200">
              <input
                type="checkbox"
                checked={audio.loop ?? true}
                onChange={(e) => updateTable(table.id, { audio: { ...audio, loop: e.target.checked } })}
              />
              repetir
            </label>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(SOUND_CATEGORY_LABELS) as SoundCategory[]).map((c) => (
          <TabChip key={c} active={aba === c} className="px-2.5 py-1 text-xs" onClick={() => setAba(c)}>
            {SOUND_CATEGORY_LABELS[c]} ({tracks.filter((t) => t.category === c).length})
          </TabChip>
        ))}
      </div>

      <Card className="flex flex-wrap items-end gap-2 p-3">
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          nome
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Floresta à noite" className="w-48" />
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          link do YouTube
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
        </label>
        <Button variant="primary" disabled={!url.trim()} onClick={guardar}>
          Guardar em {SOUND_CATEGORY_LABELS[aba]}
        </Button>
        {erro && <p className="basis-full text-xs text-red-300">{erro}</p>}
      </Card>

      <div className="flex flex-col gap-1.5">
        {doAba.map((t) => {
          const noAr = audio?.playing && audio.videoId === extractVideoId(t.url)
          return (
            <Card key={t.id} className="flex flex-wrap items-center gap-2 p-2.5 text-sm">
              <span className={noAr ? 'text-white' : 'text-orange-100'}>{t.label}</span>
              {noAr && <Badge tone="good">tocando</Badge>}
              <span className="ml-auto flex items-center gap-1.5">
                <Button variant={noAr ? 'secondary' : 'primary'} className="px-2 py-0.5 text-[11px]" onClick={() => tocar(t)}>
                  {noAr ? 'recomeçar' : 'tocar'}
                </Button>
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-400/60 hover:text-[color:var(--orange)]"
                >
                  abrir
                </a>
                <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => deleteSoundTrack(table.id, t.id)}>
                  remover
                </button>
              </span>
            </Card>
          )
        })}
        {doAba.length === 0 && (
          <p className="text-sm text-orange-300/50">Nenhuma faixa em {SOUND_CATEGORY_LABELS[aba]} ainda.</p>
        )}
      </div>
    </div>
  )
}
