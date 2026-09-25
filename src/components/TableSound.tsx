import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AudioChannel, type ChannelStatus } from './AudioChannel'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
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
const NOME_DO_CANAL: Record<Canal, string> = {
  ambience: 'Ambientação',
  mood: 'Clima',
  combat: 'Combate',
}

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
  isGM = false,
}: {
  table: GameTable
  tracks: AudioTrack[]
  sceneAudio: SceneAudio | null
  /** O mestre ganha, na mesma caixa, a mesa de som inteira: escolher faixa e volume. */
  isGM?: boolean
}) {
  const plano = resolveAudioPlan(table, { audio: sceneAudio }, tracks)

  const [ligado, setLigado] = useState(false)
  const [aberto, setAberto] = useState(false)
  const [mudo, setMudo] = useState(() => lerLocal(`mesa-ninja:som-mudo:${table.id}`, false))
  const [volumeLocal, setVolumeLocal] = useState(() => lerLocal(`mesa-ninja:som-volume:${table.id}`, 1))
  const [status, setStatus] = useState<Partial<Record<Canal, ChannelStatus>>>({})
  const [tentativas, setTentativas] = useState<Record<Canal, number>>({
    ambience: 0,
    mood: 0,
    combat: 0,
  })

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

      {!semSom && !ligado && !aberto && (
        <Button variant="primary" onClick={ligarOSom} data-ligar-som>
          🔊 Ligar o som
        </Button>
      )}

      {aberto && (ligado || isGM) && (
        <Card className={`flex ${isGM ? 'w-80' : 'w-72'} max-h-[75vh] flex-col gap-2 overflow-y-auto p-3 text-xs`}>
          <div className="flex items-center justify-between">
            <SectionTitle>{isGM ? 'Mesa de som' : 'Som da mesa'}</SectionTitle>
            <button className="text-orange-400/60 hover:text-white" onClick={() => setAberto(false)}>
              fechar
            </button>
          </div>
          {isGM ? (
            <ControlesDoMestre table={table} tracks={tracks} sceneAudio={sceneAudio} plano={plano} status={status} />
          ) : (
            <PlanoNoAr plano={plano} status={status} />
          )}
          {CANAIS.map((c) =>
            plano[c] && status[c]?.estado === 'error' ? (
              <div
                key={c}
                className="flex flex-col gap-1 rounded-sm border border-red-500/40 bg-red-950/40 p-2"
                data-erro-som={c}
              >
                <p className="leading-relaxed text-red-200">
                  {isGM && <b>{plano[c]?.label}: </b>}
                  {status[c]?.mensagem}
                </p>
                <button
                  className="self-start text-[11px] text-orange-300 hover:text-white"
                  onClick={() => setTentativas((t) => ({ ...t, [c]: t[c] + 1 }))}
                >
                  tentar de novo
                </button>
              </div>
            ) : null,
          )}
          <div className="flex flex-col gap-1.5 border-t border-[color:var(--line)] pt-2">
            {isGM && <span className="text-[10px] uppercase tracking-wide text-orange-400/60">Só nesta aba</span>}
            {ligado ? (
              <>
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
                    data-meu-volume
                  />
                </label>
                <Button variant={mudo ? 'primary' : 'secondary'} className="py-1 text-[11px]" onClick={alternarMudo}>
                  {mudo ? '🔇 Silenciado nesta aba — reativar' : '🔈 Silenciar só para mim'}
                </Button>
              </>
            ) : (
              <Button variant="primary" className="py-1 text-[11px]" onClick={ligarOSom}>
                🔊 Ligar o som nesta aba
              </Button>
            )}
            {!isGM && (
              <p className="leading-relaxed text-orange-400/50">
                Só o mestre escolhe as faixas; o volume daqui vale só para você.
              </p>
            )}
          </div>
        </Card>
      )}

      {/* O mestre vê a placa sempre: é por ela que ele abre a mesa de som,
          mesmo antes de ligar o som na própria aba ou de ter faixa. */}
      {(ligado || isGM) && (
        <button
          onClick={() => setAberto((a) => !a)}
          className="plaque flex max-w-72 items-center gap-2 rounded-sm px-3 py-1.5 text-xs"
          data-placa-som
        >
          <span
            className={`inline-block h-2 w-2 shrink-0 rounded-full ${
              erros.length
                ? 'bg-red-500'
                : mudo
                  ? 'bg-zinc-500'
                  : noAr.length
                    ? 'animate-ember bg-[color:var(--orange)]'
                    : 'bg-zinc-600'
            }`}
          />
          <span className="truncate text-orange-200">
            {!ligado
              ? `🎚 Mesa de som${semSom ? ' — sem faixas' : ' · som desligado nesta aba'}`
              : erros.length
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
  const icone: Record<string, string> = {
    playing: '▶',
    loading: '…',
    error: '⚠',
    locked: '🔒',
    idle: '·',
  }
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

/** Em que campo do som da cena fica a escolha de cada categoria. */
const CAMPO_DA_ESCOLHA = {
  ambience: 'ambienceId',
  mood: 'moodId',
  combat: 'combatId',
  boss: 'bossId',
} as const satisfies Record<AudioKind, keyof SceneAudio>

/**
 * A faixa que vale para a categoria. Ambientação e clima: a escolhida, ou
 * nenhuma. Combate e chefe: a escolhida, ou a primeira cadastrada — é a mesma
 * regra do `resolveAudioPlan`.
 */
function escolhidaDe(kind: AudioKind, audio: SceneAudio, tracks: readonly AudioTrack[]): string | undefined {
  const id = audio[CAMPO_DA_ESCOLHA[kind]]
  if (kind === 'ambience' || kind === 'mood') return tracks.some((t) => t.id === id) ? id : undefined
  const lista = tracks.filter((t) => t.kind === kind)
  return (lista.find((t) => t.id === id) ?? lista[0])?.id
}

/**
 * Os volumes da mesa, como o mestre arrasta. Enquanto arrasta, o slider mostra
 * o valor da mão (senão ele pularia com cada gravação voltando do banco) e
 * grava no máximo a cada ~150ms — a mesa ouve a mudança ao vivo.
 */
function useVolumesDaMesa(tableId: string, plano: AudioPlan) {
  const [arrastando, setArrastando] = useState<Partial<Record<Canal, number>>>({})
  const ultimaGravacao = useRef<Partial<Record<Canal, number>>>({})
  return {
    volume: (c: Canal) => arrastando[c] ?? plano.volumes[c],
    mudar(c: Canal, v: number) {
      setArrastando((a) => ({ ...a, [c]: v }))
      const agora = Date.now()
      if (agora - (ultimaGravacao.current[c] ?? 0) > 150) {
        ultimaGravacao.current[c] = agora
        void updateSceneAudio(tableId, { [`${c}Volume`]: v })
      }
    },
    soltar(c: Canal) {
      const v = arrastando[c]
      if (v === undefined) return
      void updateSceneAudio(tableId, { [`${c}Volume`]: v }).then(() =>
        setArrastando((a) => {
          const resto = { ...a }
          delete resto[c]
          return resto
        }),
      )
    },
  }
}

type VolumesDaMesa = ReturnType<typeof useVolumesDaMesa>

function SliderDaMesa({
  canal,
  vols,
  className = '',
  larguraDoSlider = 'flex-1',
}: {
  canal: Canal
  vols: VolumesDaMesa
  className?: string
  larguraDoSlider?: string
}) {
  const v = vols.volume(canal)
  return (
    <label className={`flex items-center gap-2 text-orange-300/70 ${className}`}>
      vol.
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={v}
        onChange={(e) => vols.mudar(canal, Number(e.target.value))}
        onPointerUp={() => vols.soltar(canal)}
        onKeyUp={() => vols.soltar(canal)}
        onBlur={() => vols.soltar(canal)}
        className={larguraDoSlider}
        data-volume={canal}
      />
      <span className="w-8 text-right">{Math.round(v * 100)}%</span>
    </label>
  )
}

/**
 * Cadastrar uma faixa. Com `onKind`, a própria caixa escolhe a categoria (é o
 * caso da caixa de som da tela de jogo); sem, a categoria vem de fora (a aba
 * aberta do painel).
 */
function AdicionarFaixa({
  tableId,
  kind,
  onKind,
  compacto = false,
  onGuardou,
}: {
  tableId: string
  kind: AudioKind
  onKind?: (k: AudioKind) => void
  compacto?: boolean
  onGuardou?: (t: AudioTrack) => void
}) {
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [erro, setErro] = useState('')
  const link = useMemo(() => (url.trim() ? normalizeAudioLink(url) : null), [url])

  async function guardar() {
    const l = normalizeAudioLink(url)
    if (!l) {
      setErro('Não reconheci esse link. Cole o endereço do vídeo do YouTube ou do arquivo de áudio.')
      return
    }
    setErro('')
    const faixa: AudioTrack = {
      id: newId(),
      tableId,
      kind,
      label: label.trim() || 'Faixa sem nome',
      url: l.url,
      sourceUrl: url.trim(),
      altUrls: l.altUrls,
      source: l.source,
      provider: l.provider,
      youtubeId: l.youtubeId,
      createdAt: Date.now(),
    }
    await saveSoundTrack(tableId, faixa)
    setLabel('')
    setUrl('')
    onGuardou?.(faixa)
  }

  return (
    <div className={compacto ? 'flex flex-col gap-1.5' : 'flex flex-wrap items-end gap-2'} data-adicionar-faixa>
      {onKind && (
        <Select
          value={kind}
          onChange={(e) => onKind(e.target.value as AudioKind)}
          className="py-1 text-xs"
          data-tipo-da-faixa
        >
          {(Object.keys(AUDIO_KIND_LABELS) as AudioKind[]).map((k) => (
            <option key={k} value={k}>
              {AUDIO_KIND_LABELS[k]}
            </option>
          ))}
        </Select>
      )}
      <label className="flex flex-col gap-1 text-xs text-orange-400/60">
        nome
        <Input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Floresta à noite"
          className={compacto ? 'py-1 text-xs' : 'w-44'}
        />
      </label>
      <label className={`flex flex-col gap-1 text-xs text-orange-400/60 ${compacto ? '' : 'min-w-48 flex-1'}`}>
        {compacto
          ? 'link (YouTube, Dropbox, arquivo…)'
          : 'link (YouTube, Dropbox, OneDrive, GitHub ou arquivo .mp3/.ogg)'}
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={compacto ? 'py-1 text-xs' : ''}
          data-link-som
        />
      </label>
      <Button variant="primary" disabled={!url.trim()} onClick={guardar} className={compacto ? 'py-1 text-xs' : ''}>
        Guardar em {AUDIO_KIND_LABELS[kind]}
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
    </div>
  )
}

const ICONE_DO_ESTADO: Record<string, string> = {
  playing: '▶',
  loading: '…',
  error: '⚠',
  locked: '🔒',
  idle: '·',
}

/**
 * A mesa de som dentro da caixa da tela de jogo — o mestre troca a música e
 * mexe no volume sem sair do mapa. Cada categoria é uma lista: escolher já
 * põe no ar para a mesa toda.
 */
function ControlesDoMestre({
  table,
  tracks,
  sceneAudio,
  plano,
  status,
}: {
  table: GameTable
  tracks: AudioTrack[]
  sceneAudio: SceneAudio | null
  plano: AudioPlan
  status: Partial<Record<Canal, ChannelStatus>>
}) {
  const audio = sceneAudio ?? {}
  const vols = useVolumesDaMesa(table.id, plano)
  const [adicionando, setAdicionando] = useState(false)
  const [tipoNovo, setTipoNovo] = useState<AudioKind>('ambience')

  const linhas: { kind: AudioKind; canal: Canal | null }[] = [
    { kind: 'ambience', canal: 'ambience' },
    { kind: 'mood', canal: 'mood' },
    { kind: 'combat', canal: 'combat' },
    // O chefe toca pelo canal de combate, no volume do combate.
    { kind: 'boss', canal: null },
  ]

  function escolher(kind: AudioKind, id: string) {
    void updateSceneAudio(table.id, { [CAMPO_DA_ESCOLHA[kind]]: id || null })
  }

  return (
    <div className="flex flex-col gap-2" data-controle-rapido>
      {plano.combatTakeover && (
        <p className="text-[11px] leading-relaxed text-red-300">
          ⚔ Combate no ar
          {plano.bossFallback ? ' (luta de chefe sem faixa de chefe: tocando a de combate)' : ''}. Ambientação e clima
          voltam sozinhos quando a luta acabar.
        </p>
      )}
      {linhas.map(({ kind, canal }) => {
        const lista = tracks.filter((t) => t.kind === kind)
        const valor = escolhidaDe(kind, audio, tracks) ?? ''
        const canalDoIcone = canal ?? 'combat'
        const noAr = Boolean(valor) && plano[canalDoIcone]?.id === valor
        const s = status[canalDoIcone]
        const opcional = kind === 'ambience' || kind === 'mood'
        return (
          <div key={kind} className="flex flex-col gap-1" data-linha-som={kind}>
            <div className="flex items-center gap-2">
              <span className="w-[72px] shrink-0 text-orange-400/70">{AUDIO_KIND_LABELS[kind]}</span>
              <Select
                value={valor}
                disabled={lista.length === 0}
                onChange={(e) => escolher(kind, e.target.value)}
                className="min-w-0 flex-1 py-1 text-xs"
                data-escolha={kind}
              >
                {lista.length === 0 && <option value="">nenhuma faixa</option>}
                {lista.length > 0 && opcional && <option value="">— nada —</option>}
                {lista.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </Select>
              <span
                className={`w-4 shrink-0 text-center ${s?.estado === 'error' ? 'text-red-400' : 'text-orange-300/70'}`}
                title={noAr ? s?.mensagem : undefined}
              >
                {noAr && s ? ICONE_DO_ESTADO[s.estado] : ''}
              </span>
            </div>
            {canal && <SliderDaMesa canal={canal} vols={vols} className="pl-[80px]" />}
            {opcional && valor && !noAr && plano.combatTakeover && (
              <span className="pl-[80px] text-[10px] text-amber-300/80">em pausa pelo combate</span>
            )}
          </div>
        )
      })}
      <p className="text-[10px] leading-relaxed text-orange-400/50">
        Combate e chefe entram sozinhos quando a luta começa (o chefe usa o volume do combate). Os volumes daqui valem
        para a mesa toda.
      </p>
      {adicionando ? (
        <div className="flex flex-col gap-1.5 border-t border-[color:var(--line)] pt-2">
          <AdicionarFaixa
            tableId={table.id}
            kind={tipoNovo}
            onKind={setTipoNovo}
            compacto
            onGuardou={(t) => {
              setAdicionando(false)
              // Ambientação e clima recém-cadastrados já entram no ar: quem
              // cadastra no meio da sessão quer ouvir agora.
              if (t.kind === 'ambience' || t.kind === 'mood') escolher(t.kind, t.id)
            }}
          />
          <button
            className="self-start text-[11px] text-orange-400/60 hover:text-white"
            onClick={() => setAdicionando(false)}
          >
            cancelar
          </button>
        </div>
      ) : (
        <button
          className="self-start text-[11px] text-orange-300 hover:text-white"
          onClick={() => setAdicionando(true)}
          data-nova-faixa
        >
          + adicionar faixa
        </button>
      )}
    </div>
  )
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
  const doAba = tracks.filter((t) => t.kind === aba)
  const vols = useVolumesDaMesa(table.id, plano)

  function escolher(t: AudioTrack) {
    void updateSceneAudio(table.id, { [CAMPO_DA_ESCOLHA[t.kind]]: t.id })
  }

  function parar(kind: 'ambience' | 'mood') {
    void updateSceneAudio(table.id, { [CAMPO_DA_ESCOLHA[kind]]: null })
  }

  async function remover(t: AudioTrack) {
    if (!window.confirm(`Remover "${t.label}" da biblioteca?`)) return
    // Se era a escolhida, a escolha sai junto — o plano já ignoraria, mas o
    // cadastro fica limpo.
    const campo = CAMPO_DA_ESCOLHA[t.kind]
    if (audio[campo] === t.id) await updateSceneAudio(table.id, { [campo]: null })
    await deleteSoundTrack(table.id, t.id)
  }

  return (
    <div className="flex flex-col gap-3" data-mesa-de-som>
      <Card className="flex flex-col gap-3 p-4">
        <SectionTitle>No ar</SectionTitle>
        {plano.combatTakeover && (
          <p className="text-xs text-red-300" data-combate-assumiu>
            ⚔ Combate em andamento: a faixa de{' '}
            {plano.bossFallback
              ? 'combate (luta de chefe sem faixa de chefe)'
              : plano.combat?.kind === 'boss'
                ? 'chefe'
                : 'combate'}{' '}
            assumiu. Ambientação e clima continuam escolhidos e voltam sozinhos quando a luta acabar.
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
              <SliderDaMesa canal={c} vols={vols} className="basis-full sm:basis-auto" larguraDoSlider="w-28" />
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
          const escolhida = escolhidaDe(t.kind, audio, tracks) === t.id
          const noAr = CANAIS.some((c) => plano[c]?.id === t.id)
          const automatica = t.kind === 'combat' || t.kind === 'boss'
          return (
            <div
              key={t.id}
              className="plaque flex flex-wrap items-center gap-2 rounded-lg p-2.5 text-sm"
              data-faixa={t.label}
            >
              <span className={escolhida ? 'text-white' : 'text-orange-100'}>{t.label}</span>
              <span className="text-[10px] uppercase tracking-wide text-orange-400/50">
                {NOME_DO_PROVEDOR[t.provider ?? 'other']}
              </span>
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
        {doAba.length === 0 && (
          <p className="text-sm text-orange-300/50">Nenhuma faixa em {AUDIO_KIND_LABELS[aba]} ainda.</p>
        )}
      </div>

      <Card className="p-3">
        <AdicionarFaixa tableId={table.id} kind={aba} />
      </Card>
    </div>
  )
}
