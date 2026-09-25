import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AudioChannel, type ChannelStatus } from './AudioChannel'
import { Badge, Button, Card, Input, SectionTitle, TabChip } from './ui'
import { newId } from '../lib/id'
import { normalizeAudioLink } from '../lib/audioLinks'
import { resolveAudioPlan, type AudioPlan } from '../lib/audioPlan'
import { deleteSoundTrack, listenSceneAudio, listenSoundTracks, saveSoundTrack, updateSceneAudio } from '../lib/store'
import { AUDIO_KIND_LABELS } from '../types'
import type { AudioKind, AudioProvider, AudioTrack, GameTable, SceneAudio } from '../types'

/**
 * Mesa de som.
 *
 * Duas peças, com papéis bem separados:
 *
 *  - `SoundHost` TOCA. Vive só na tela de jogo (nas fichas não toca nada), e
 *    cada pessoa liga o som na própria aba — o navegador não deixa ninguém
 *    ligar o som na tela de outro. Tem três canais fixos (ambientação, clima e
 *    combate), alimentados pelo plano que `resolveAudioPlan` calcula.
 *  - `SoundBoard` ESCOLHE. É do mestre: biblioteca de faixas, o que está no ar
 *    e os volumes de cada categoria, que valem para a mesa inteira.
 */

/* --- Dados que as duas peças usam ------------------------------------------ */

/** A biblioteca de faixas e o som da cena, ao vivo. */
export function useMesaDeSom(tableId: string) {
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [sceneAudio, setSceneAudio] = useState<SceneAudio | null>(null)
  useEffect(() => listenSoundTracks(tableId, setTracks), [tableId])
  useEffect(() => listenSceneAudio(tableId, setSceneAudio), [tableId])
  return { tracks, sceneAudio }
}

type Canal = 'ambience' | 'mood' | 'combat'
const CANAIS: Canal[] = ['ambience', 'mood', 'combat']
const NOME_DO_CANAL: Record<Canal, string> = { ambience: 'Ambientação', mood: 'Clima', combat: 'Combate' }

/** Preferências desta aba — ninguém mais vê. Guardadas no navegador, se der. */
function lerLocal<T>(chave: string, padrao: T): T {
  try {
    const v = window.localStorage.getItem(chave)
    return v === null ? padrao : (JSON.parse(v) as T)
  } catch {
    return padrao
  }
}
function gravarLocal(chave: string, valor: unknown) {
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // Aba anônima ou armazenamento bloqueado: a preferência vale só agora.
  }
}

/* --- O que toca, na tela de jogo ------------------------------------------- */

export function SoundHost({
  table,
  tracks,
  sceneAudio,
}: {
  table: GameTable
  tracks: AudioTrack[]
  sceneAudio: SceneAudio | null
}) {
  const plano = resolveAudioPlan(table, { audio: sceneAudio }, tracks)

  const [ligado, setLigado] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [mudo, setMudo] = useState(() => lerLocal(`mesa-ninja:som-mudo:${table.id}`, false))
  const [volumeLocal, setVolumeLocal] = useState(() => lerLocal(`mesa-ninja:som-volume:${table.id}`, 1))
  const [status, setStatus] = useState<Partial<Record<Canal, ChannelStatus>>>({})
  const [tentativas, setTentativas] = useState<Record<Canal, number>>({ ambience: 0, mood: 0, combat: 0 })

  /* Desbloqueio: cada canal entrega o seu `unlock`, e o clique chama todos. */
  const unlocks = useRef(new Map<string, () => void>())
  const registrar = useCallback((nome: string, unlock: () => void) => {
    unlocks.current.set(nome, unlock)
  }, [])
  const aoMudarStatus = useCallback((nome: string, s: ChannelStatus) => {
    setStatus((antes) => {
      const velho = antes[nome as Canal]
      if (velho && velho.estado === s.estado && velho.faixa === s.faixa && velho.mensagem === s.mensagem) return antes
      return { ...antes, [nome]: s }
    })
  }, [])

  /** TUDO aqui dentro roda no mesmo tique do clique — é o que o navegador exige. */
  function ligarOSom() {
    for (const unlock of unlocks.current.values()) unlock()
    setLigado(true)
  }

  function alternarMudo() {
    setMudo((m) => {
      gravarLocal(`mesa-ninja:som-mudo:${table.id}`, !m)
      return !m
    })
  }

  function mudarVolumeLocal(v: number) {
    setVolumeLocal(v)
    gravarLocal(`mesa-ninja:som-volume:${table.id}`, v)
  }

  // Cria o player do YouTube de antemão quando a biblioteca daquele canal tem
  // vídeo — para ele já estar pronto quando a faixa for pedida.
  const temYoutube = (kinds: AudioKind[]) => tracks.some((t) => t.source === 'youtube' && kinds.includes(t.kind))
  const preload: Record<Canal, boolean> = {
    ambience: temYoutube(['ambience']),
    mood: temYoutube(['mood']),
    combat: temYoutube(['combat', 'boss']),
  }

  const fator = mudo ? 0 : volumeLocal
  const noAr = CANAIS.filter((c) => plano[c])
  const erros = CANAIS.filter((c) => plano[c] && status[c]?.estado === 'error')
  const carregando = CANAIS.some((c) => plano[c] && status[c]?.estado === 'loading')

  const canais = CANAIS.map((c) => (
    <AudioChannel
      key={c}
      nome={c}
      track={plano[c]}
      volume={plano.volumes[c] * fator}
      onRegister={registrar}
      onStatus={aoMudarStatus}
      preloadYoutube={preload[c]}
      tentativa={tentativas[c]}
    />
  ))

  // Sem nada no ar e sem faixa na mesa: não há o que ligar. Os canais ficam
  // montados assim mesmo, para o desbloqueio valer quando a música chegar.
  const semSom = tracks.length === 0

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end gap-1.5" data-som-da-mesa>
      {canais}

      {!semSom && !ligado && (
        <Button variant="primary" onClick={ligarOSom} data-ligar-som>
          🔊 Ligar o som
        </Button>
      )}

      {ligado && aberto && (
        <Card className="flex w-72 flex-col gap-2 p-3 text-xs">
          <div className="flex items-center justify-between">
            <SectionTitle>Som da mesa</SectionTitle>
            <button className="text-orange-400/60 hover:text-white" onClick={() => setAberto(false)}>
              fechar
            </button>
          </div>
          <PlanoNoAr plano={plano} status={status} />
          {CANAIS.map((c) =>
            plano[c] && status[c]?.estado === 'error' ? (
              <div key={c} className="flex flex-col gap-1 rounded-sm border border-red-500/40 bg-red-950/40 p-2" data-erro-som={c}>
                <p className="leading-relaxed text-red-200">{status[c]?.mensagem}</p>
                <button
                  className="self-start text-[11px] text-orange-300 hover:text-white"
                  onClick={() => setTentativas((t) => ({ ...t, [c]: t[c] + 1 }))}
                >
                  tentar de novo
                </button>
              </div>
            ) : null,
          )}
          <label className="flex items-center gap-2 text-orange-200">
            meu volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volumeLocal}
              onChange={(e) => mudarVolumeLocal(Number(e.target.value))}
              className="flex-1"
            />
          </label>
          <Button variant={mudo ? 'primary' : 'secondary'} className="py-1 text-[11px]" onClick={alternarMudo}>
            {mudo ? '🔇 Silenciado nesta aba — reativar' : '🔈 Silenciar só para mim'}
          </Button>
          <p className="leading-relaxed text-orange-400/50">Só o mestre escolhe as faixas; o volume daqui vale só para você.</p>
        </Card>
      )}

      {ligado && (
        <button
          onClick={() => setAberto((a) => !a)}
          className="plaque flex max-w-72 items-center gap-2 rounded-sm px-3 py-1.5 text-xs"
          data-placa-som
        >
          <span
            className={`inline-block h-2 w-2 shrink-0 rounded-full ${
              erros.length ? 'bg-red-500' : mudo ? 'bg-zinc-500' : noAr.length ? 'animate-ember bg-[color:var(--orange)]' : 'bg-zinc-600'
            }`}
          />
          <span className="truncate text-orange-200">
            {erros.length
              ? 'som com problema — ver'
              : `${mudo ? '🔇 silenciado · ' : ''}${
                  carregando
                    ? 'carregando o som…'
                    : noAr.length
                      ? noAr.map((c) => plano[c]?.label).join(' + ')
                      : 'som ligado — nada no ar'
                }`}
          </span>
        </button>
      )}
    </div>
  )
}

/** O que está no ar, canal por canal, com o estado de cada um. */
function PlanoNoAr({ plano, status }: { plano: AudioPlan; status?: Partial<Record<Canal, ChannelStatus>> }) {
  const icone: Record<string, string> = { playing: '▶', loading: '…', error: '⚠', locked: '🔒', idle: '·' }
  return (
    <div className="flex flex-col gap-1">
      {plano.combatTakeover && (
        <p className="text-[11px] text-red-300">
          ⚔ Combate no ar — ambientação e clima voltam sozinhos quando a luta acabar.
          {plano.bossFallback && ' (Luta de chefe sem faixa de chefe: tocando a de combate.)'}
        </p>
      )}
      {CANAIS.map((c) => {
        const t = plano[c]
        if (!t && c === 'combat') return null
        const s = status?.[c]
        return (
          <div key={c} className="flex items-center gap-2" data-canal-no-ar={c}>
            <span className="w-20 text-orange-400/60">{NOME_DO_CANAL[c]}</span>
            <span className={t ? 'truncate text-white' : 'text-orange-400/40'}>{t ? t.label : 'nada'}</span>
            {t && s && (
              <span className="ml-auto text-orange-300/70" title={s.mensagem} data-estado={s.estado}>
                {icone[s.estado]}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* --- O que o mestre escolhe ------------------------------------------------ */

const NOME_DO_PROVEDOR: Record<AudioProvider, string> = {
  youtube: 'YouTube',
  drive: 'Google Drive',
  dropbox: 'Dropbox',
  onedrive: 'OneDrive',
  github: 'GitHub',
  other: 'arquivo direto',
}

const DICA_DA_CATEGORIA: Record<AudioKind, string> = {
  ambience: 'Som de fundo em laço — floresta, chuva, vila. Uma toca por vez.',
  mood: 'O clima da cena, tocando JUNTO com a ambientação — tenso, solene, triste.',
  combat: 'Assume sozinha quando o combate começa; ambientação e clima voltam quando ele acaba.',
  boss: 'Toca no lugar da de combate quando há um chefe na luta. Sem faixa de chefe, vale a de combate.',
}

export function SoundBoard({
  table,
  tracks: tracksDeFora,
  sceneAudio: audioDeFora,
  compacto = false,
}: {
  table: GameTable
  /** Quem já escuta a biblioteca (a tela de jogo) passa; o painel escuta sozinho se não. */
  tracks?: AudioTrack[]
  sceneAudio?: SceneAudio | null
  compacto?: boolean
}) {
  const proprio = useMesaDeSom(table.id)
  const tracks = tracksDeFora ?? proprio.tracks
  const sceneAudio = audioDeFora !== undefined ? audioDeFora : proprio.sceneAudio
  const audio = sceneAudio ?? {}
  const plano = resolveAudioPlan(table, { audio: sceneAudio }, tracks)

  const [aba, setAba] = useState<AudioKind>('ambience')
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [erro, setErro] = useState('')

  const doAba = tracks.filter((t) => t.kind === aba)
  const link = useMemo(() => (url.trim() ? normalizeAudioLink(url) : null), [url])

  /** Volume que o mestre está arrastando, antes de gravar — para o slider não pular. */
  const [arrastando, setArrastando] = useState<Partial<Record<Canal, number>>>({})
  const gravarVolume = useRef<Partial<Record<Canal, number>>>({})
  function mudarVolume(c: Canal, v: number) {
    setArrastando((a) => ({ ...a, [c]: v }))
    // Grava no máximo a cada ~150ms enquanto arrasta; a mesa acompanha ao vivo.
    const agora = Date.now()
    if (agora - (gravarVolume.current[c] ?? 0) > 150) {
      gravarVolume.current[c] = agora
      void updateSceneAudio(table.id, { [`${c}Volume`]: v })
    }
  }
  function soltarVolume(c: Canal) {
    const v = arrastando[c]
    if (v === undefined) return
    void updateSceneAudio(table.id, { [`${c}Volume`]: v }).then(() =>
      setArrastando((a) => {
        const { [c]: _, ...resto } = a
        return resto
      }),
    )
  }

  async function guardar() {
    const l = normalizeAudioLink(url)
    if (!l) {
      setErro('Não reconheci esse link. Cole o endereço do vídeo do YouTube ou do arquivo de áudio.')
      return
    }
    setErro('')
    await saveSoundTrack(table.id, {
      id: newId(),
      tableId: table.id,
      kind: aba,
      label: label.trim() || 'Faixa sem nome',
      url: l.url,
      sourceUrl: url.trim(),
      altUrls: l.altUrls,
      source: l.source,
      provider: l.provider,
      youtubeId: l.youtubeId,
      createdAt: Date.now(),
    })
    setLabel('')
    setUrl('')
  }

  /** Qual faixa desta categoria a cena escolheu (e a que o plano usa, para combate). */
  function escolhidaDe(kind: AudioKind): string | undefined {
    if (kind === 'ambience') return audio.ambienceId
    if (kind === 'mood') return audio.moodId
    const lista = tracks.filter((t) => t.kind === kind)
    const id = kind === 'combat' ? audio.combatId : audio.bossId
    return (lista.find((t) => t.id === id) ?? lista[0])?.id
  }

  function escolher(t: AudioTrack) {
    const campo = { ambience: 'ambienceId', mood: 'moodId', combat: 'combatId', boss: 'bossId' }[t.kind]
    void updateSceneAudio(table.id, { [campo]: t.id })
  }

  function parar(kind: 'ambience' | 'mood') {
    void updateSceneAudio(table.id, { [kind === 'ambience' ? 'ambienceId' : 'moodId']: null })
  }

  async function remover(t: AudioTrack) {
    if (!window.confirm(`Remover "${t.label}" da biblioteca?`)) return
    // Se era a escolhida, a escolha sai junto — o plano já ignoraria, mas o
    // cadastro fica limpo.
    const campo = { ambience: 'ambienceId', mood: 'moodId', combat: 'combatId', boss: 'bossId' }[t.kind] as keyof SceneAudio
    if (audio[campo] === t.id) await updateSceneAudio(table.id, { [campo]: null })
    await deleteSoundTrack(table.id, t.id)
  }

  const volume = (c: Canal) => arrastando[c] ?? plano.volumes[c]

  return (
    <div className="flex flex-col gap-3" data-mesa-de-som>
      <Card className="flex flex-col gap-3 p-4">
        <SectionTitle>No ar</SectionTitle>
        {plano.combatTakeover && (
          <p className="text-xs text-red-300" data-combate-assumiu>
            ⚔ Combate em andamento: a faixa de {plano.bossFallback ? 'combate (luta de chefe sem faixa de chefe)' : plano.combat?.kind === 'boss' ? 'chefe' : 'combate'} assumiu.
            Ambientação e clima continuam escolhidos e voltam sozinhos quando a luta acabar.
          </p>
        )}
        {CANAIS.map((c) => {
          const escolhida =
            c === 'combat'
              ? plano.combat
              : (tracks.find((t) => t.id === (c === 'ambience' ? audio.ambienceId : audio.moodId)) ?? null)
          const tocando = Boolean(plano[c])
          return (
            <div key={c} className="flex flex-wrap items-center gap-2 text-xs" data-controle={c}>
              <span className="w-24 text-orange-400/70">{NOME_DO_CANAL[c]}</span>
              <span className={`min-w-0 flex-1 truncate ${escolhida ? 'text-white' : 'text-orange-400/40'}`}>
                {escolhida ? escolhida.label : c === 'combat' ? 'só quando houver combate' : 'nada escolhido'}
              </span>
              {tocando && <Badge tone="good">no ar</Badge>}
              {escolhida && !tocando && c !== 'combat' && <Badge tone="warn">em pausa pelo combate</Badge>}
              {escolhida && c !== 'combat' && (
                <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => parar(c)}>
                  parar
                </button>
              )}
              <label className="flex basis-full items-center gap-2 text-orange-300/70 sm:basis-auto">
                vol.
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume(c)}
                  onChange={(e) => mudarVolume(c, Number(e.target.value))}
                  onPointerUp={() => soltarVolume(c)}
                  onKeyUp={() => soltarVolume(c)}
                  onBlur={() => soltarVolume(c)}
                  className="w-28"
                  data-volume={c}
                />
                <span className="w-8 text-right">{Math.round(volume(c) * 100)}%</span>
              </label>
            </div>
          )
        })}
        {!compacto && (
          <p className="text-[11px] leading-relaxed text-orange-400/50">
            O som toca na <b className="text-orange-200">tela de jogo</b> de cada um, e cada pessoa precisa clicar em{' '}
            <b className="text-orange-200">Ligar o som</b> uma vez na própria aba — o navegador não deixa tocar sozinho.
            Os volumes daqui valem para a mesa toda; cada jogador ainda pode silenciar só para si.
          </p>
        )}
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(AUDIO_KIND_LABELS) as AudioKind[]).map((k) => (
          <TabChip key={k} active={aba === k} className="px-2.5 py-1 text-xs" onClick={() => setAba(k)}>
            {AUDIO_KIND_LABELS[k]} ({tracks.filter((t) => t.kind === k).length})
          </TabChip>
        ))}
      </div>
      <p className="-mt-1 text-[11px] text-orange-400/60">{DICA_DA_CATEGORIA[aba]}</p>

      <div className="flex flex-col gap-1.5">
        {doAba.map((t) => {
          const escolhida = escolhidaDe(t.kind) === t.id
          const noAr = CANAIS.some((c) => plano[c]?.id === t.id)
          const automatica = t.kind === 'combat' || t.kind === 'boss'
          return (
            <div key={t.id} className="plaque flex flex-wrap items-center gap-2 rounded-lg p-2.5 text-sm" data-faixa={t.label}>
              <span className={escolhida ? 'text-white' : 'text-orange-100'}>{t.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-orange-400/50">{NOME_DO_PROVEDOR[t.provider ?? 'other']}</span>
              {noAr && <Badge tone="good">no ar</Badge>}
              {escolhida && !noAr && <Badge>{automatica ? 'vale nas lutas' : 'escolhida'}</Badge>}
              <span className="ml-auto flex items-center gap-1.5">
                {!escolhida && (
                  <Button variant="primary" className="px-2 py-0.5 text-[11px]" onClick={() => escolher(t)}>
                    {automatica ? 'usar nas lutas' : 'tocar'}
                  </Button>
                )}
                <a
                  href={t.sourceUrl || t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-400/60 hover:text-[color:var(--orange)]"
                >
                  abrir
                </a>
                <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => remover(t)}>
                  remover
                </button>
              </span>
            </div>
          )
        })}
        {doAba.length === 0 && <p className="text-sm text-orange-300/50">Nenhuma faixa em {AUDIO_KIND_LABELS[aba]} ainda.</p>}
      </div>

      <Card className="flex flex-wrap items-end gap-2 p-3">
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          nome
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Floresta à noite" className="w-44" />
        </label>
        <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-orange-400/60">
          link (YouTube, Dropbox, OneDrive, GitHub ou arquivo .mp3/.ogg)
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." data-link-som />
        </label>
        <Button variant="primary" disabled={!url.trim()} onClick={guardar}>
          Guardar em {AUDIO_KIND_LABELS[aba]}
        </Button>
        {url.trim() && (
          <p className="basis-full text-[11px] text-orange-300/70" data-link-reconhecido>
            {link
              ? link.provider === 'other'
                ? 'Arquivo direto — precisa ser o endereço do próprio arquivo de áudio, não de uma página.'
                : `${NOME_DO_PROVEDOR[link.provider]} reconhecido${link.source === 'direct' ? ' — convertido para o endereço do arquivo' : ''}.`
              : 'Link não reconhecido.'}
          </p>
        )}
        {link?.provider === 'drive' && (
          <p className="basis-full text-[11px] leading-relaxed text-amber-300/80" data-aviso-drive-som>
            Atenção: o Google Drive costuma <b className="text-amber-200">não entregar áudio</b> para outros sites (para
            imagem funciona, para som não). O app vai tentar vários endereços do Drive, mas se não tocar, não é o link que
            está errado — use YouTube ou outra hospedagem.
          </p>
        )}
        {erro && <p className="basis-full text-xs text-red-300">{erro}</p>}
      </Card>
    </div>
  )
}
