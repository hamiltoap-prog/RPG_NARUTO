import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from '../components/ui'
import { DiceOverlay } from '../components/DiceOverlay'
import { firebaseConfigured } from '../firebase'
import { useAuthUid } from '../hooks/useAuth'
import { drawFog, emptyFog, fogRows, isRevealed, paintFog, remapFog, resampleFog, setAll } from '../lib/fog'
import { newId } from '../lib/id'
import { condicoesDe, efeitoDaCondicao, selo } from '../lib/conditions'
import { arteDaPeca, modoDaPeca, podeUsarPng } from '../lib/tokenArt'
import { useTableJutsus } from '../hooks/useTableJutsus'
import { ehLinkDoDrive, normalizeImageUrl } from '../lib/imageUrl'
import { AvisoDoDrive } from '../components/AvisoDoDrive'
import { SceneLibraryPanel } from '../components/SceneLibraryPanel'
import { SEM_PASTA, pastasDa } from '../lib/sceneLibrary'
import type { Ficha } from '../lib/conditions'
import {
  EMPTY_MAP,
  MAX_GRID_COLUMNS,
  MAX_MAP_ZOOM,
  MIN_GRID_COLUMNS,
  MIN_MAP_ZOOM,
  clamp01,
  distanceInSquares,
  fitStage,
  gridColumns,
  clampMapOffsets,
  mapOffsetLimit,
  mapTransform,
  remapTokens,
  snapToGrid,
  stageAspect,
  tokenWidth,
} from '../lib/sceneGeometry'
import {
  addScenePing,
  addSceneLibraryItem,
  cleanupOldPings,
  updateSceneLibraryItem,
  listenCharacters,
  listenCompanions,
  listenNPCs,
  listenScene,
  listenSceneLibrary,
  listenScenePings,
  listenTable,
  saveScene,
  saveSceneTokens,
  updateCharacterDirect,
  updateCompanion,
  updateNPC,
  updateTable,
} from '../lib/store'
import { CREATURE_SIZES, DEFAULT_STAGE_ASPECT, PING_LIFETIME_MS, SCENE_TOKEN_LABELS } from '../types'
import type {
  Character,
  GameTable,
  Companion,
  TokenMode,
  NPC,
  Scene,
  SceneFog,
  SceneLibraryItem,
  SceneMap,
  ScenePing,
  SceneToken,
  SceneTokenKind,
} from '../types'

/** Escuridão do local sem luz, para os jogadores. */
const DARKNESS_ALPHA = 0.82
/** O mestre precisa enxergar a cena que está narrando: para ele a escuridão é
 * só uma sombra que mostra até onde a luz chega, como a névoa. */
const DARKNESS_ALPHA_GM = 0.45
/** Alcance da luz como fração da largura do palco — assim a poça de luz é a
 * mesma em qualquer tela. */
const LIGHT_RX = 0.13
/** Parte central da poça que fica totalmente limpa. */
const LIGHT_CLEAR = 0.45
/** Até onde a luz ainda revela uma criatura para os jogadores. */
const LIGHT_REVEAL = 1.15
/** Tamanho do brilho quente (efeito de tocha) sobre o alcance da luz. */
const GLOW_SCALE = 1.25
/** Quanto tempo uma tocha acesa dura, em milissegundos. */
const TORCH_DURATION = 60 * 60 * 1000

type Tool = 'mover' | 'revelar' | 'esconder' | 'marcar' | 'regua'

const PRESET_ASPECTS = [
  { label: '16:10', value: 16 / 10 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:2', value: 3 / 2 },
  { label: 'quadrado', value: 1 },
]

const EMPTY_SCENE: Scene = {
  backgroundUrl: '',
  tokens: [],
  revealed: false,
  updatedAt: 0,
  timeOfDay: 'day',
  locationLit: true,
  map: EMPTY_MAP,
  gridColumns: 20,
  showGrid: true,
}

export function ScenePage() {
  const { code = '' } = useParams()
  const tableId = code.toUpperCase()
  const uid = useAuthUid()

  const [table, setTable] = useState<GameTable | null | undefined>(undefined)
  const [sceneState, setSceneState] = useState<Scene | null | undefined>(undefined)
  const [characters, setCharacters] = useState<Character[]>([])
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [companions, setCompanions] = useState<Companion[]>([])
  const [pings, setPings] = useState<ScenePing[]>([])
  const [library, setLibrary] = useState<SceneLibraryItem[]>([])

  const [tool, setTool] = useState<Tool>('mover')
  const [brush, setBrush] = useState(4)
  const [panel, setPanel] = useState<'mapa' | 'pecas' | 'biblioteca' | null>(null)
  const [ruler, setRuler] = useState<{ from: { x: number; y: number }; to: { x: number; y: number } } | null>(null)
  const [now, setNow] = useState(Date.now())

  const stageRef = useRef<HTMLDivElement | null>(null)
  /** Estado, e não ref: o elemento só nasce depois que a mesa carrega, e um
   * `useRef` não avisa o efeito de que ele apareceu — era por isso que o palco
   * ficava preso na faixa de 300px. */
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null)
  const fogCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const [viewport, setViewport] = useState({ width: 0, height: 0 })
  const draggingToken = useRef<string | null>(null)
  const paintingFog = useRef(false)
  const drawingRuler = useRef(false)
  /** Espelho da cena para os manipuladores de ponteiro: o `pointerup` pode
   * chegar antes do React repintar, e aí o estado do fecho ainda seria o
   * anterior ao último arraste. O ref é sempre o valor mais recente. */
  const sceneRef = useRef<Scene>(EMPTY_SCENE)

  useEffect(() => {
    if (!firebaseConfigured) return
    return listenTable(tableId, setTable)
  }, [tableId])

  useEffect(() => {
    if (!firebaseConfigured) return
    return listenScene(tableId, setSceneState)
  }, [tableId])

  useTableJutsus(tableId)
  useEffect(() => listenCharacters(tableId, setCharacters), [tableId])
  useEffect(() => listenNPCs(tableId, setNpcs), [tableId])
  useEffect(() => listenCompanions(tableId, setCompanions), [tableId])
  useEffect(() => listenScenePings(tableId, setPings), [tableId])

  const isGM = Boolean(uid && table && table.gmUid === uid)

  useEffect(() => {
    if (!isGM) return
    return listenSceneLibrary(tableId, setLibrary)
  }, [tableId, isGM])

  // Trocar de ferramenta apaga a medição na tela — senão a linha da régua fica
  // pendurada no mapa depois que já serviu.
  useEffect(() => {
    if (tool !== 'regua') setRuler(null)
  }, [tool])

  // Relógio grosso: só precisa reagir a tempo para as tochas apagarem e as
  // marcações sumirem, não precisa de precisão de segundo.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // Faxina das marcações velhas fica com o mestre, que já tem permissão.
  useEffect(() => {
    if (!isGM) return
    const t = setInterval(() => cleanupOldPings(tableId, 60_000).catch(() => {}), 60_000)
    return () => clearInterval(t)
  }, [tableId, isGM])

  useEffect(() => {
    if (!wrapEl) return
    const measure = () => setViewport({ width: wrapEl.clientWidth, height: wrapEl.clientHeight })
    const observer = new ResizeObserver(measure)
    observer.observe(wrapEl)
    measure()
    return () => observer.disconnect()
  }, [wrapEl])

  const scene = sceneState ?? EMPTY_SCENE
  sceneRef.current = scene
  const aspect = stageAspect(scene)
  const columns = gridColumns(scene)
  const stage = fitStage(viewport.width, viewport.height, aspect)
  const fog = scene.fog
  const locationLit = scene.locationLit ?? true
  const timeOfDay = scene.timeOfDay ?? 'day'

  const myCharacter = useMemo(() => characters.find((c) => c.ownerUid === uid), [characters, uid])

  const persist = useCallback(
    (next: Scene) => {
      setSceneState(next)
      saveScene(tableId, next).catch((err) => console.error('[Mesa Ninja] Não foi possível salvar a cena:', err))
    },
    [tableId],
  )

  /** Movimento de peça: o mestre salva a cena toda; o jogador só as peças. */
  const persistTokens = useCallback(
    (tokens: SceneToken[]) => {
      setSceneState((prev) => ({ ...(prev ?? EMPTY_SCENE), tokens }))
      const write = isGM ? saveScene(tableId, { ...sceneRef.current, tokens }) : saveSceneTokens(tableId, tokens)
      write.catch((err) => console.error('[Mesa Ninja] Não foi possível mover a peça:', err))
    },
    [tableId, isGM],
  )

  // ---------- Desenho da névoa ----------
  useEffect(() => {
    const canvas = fogCanvasRef.current
    if (!canvas || !fog?.enabled || stage.width === 0) return
    canvas.width = Math.round(stage.width)
    canvas.height = Math.round(stage.height)
    // O mestre enxerga através da névoa (só o bastante para saber onde está);
    // para o jogador, ela é opaca de verdade.
    drawFog(canvas, fog, { alpha: isGM ? 0.55 : 0.97, softness: 0.9 })
  }, [fog, stage.width, stage.height, isGM])

  // ---------- Coordenadas ----------
  function pointToStage(e: { clientX: number; clientY: number }): { x: number; y: number } | null {
    const el = stageRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return null
    return { x: clamp01((e.clientX - rect.left) / rect.width), y: clamp01((e.clientY - rect.top) / rect.height) }
  }

  // ---------- Peças ----------
  function canDrag(t: SceneToken) {
    if (tool !== 'mover') return false
    if (isGM) return true
    if (!table?.playersMoveTokens) return false
    return ehMinha(t)
  }

  /** A peça é do jogador que está olhando? Vale para a ficha dele e para os
   * clones e invocações que ele criou — o clone age no turno dele. */
  function ehMinha(t: SceneToken) {
    if (!myCharacter) return false
    if (t.refType === 'character') return t.refId === myCharacter.id
    if (t.refType === 'companion') {
      return companions.some((c) => c.id === t.refId && c.ownerCharacterId === myCharacter.id)
    }
    return false
  }

  function onTokenPointerDown(e: React.PointerEvent, token: SceneToken) {
    if (!canDrag(token)) return
    e.stopPropagation()
    draggingToken.current = token.id
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
  }

  function onStagePointerMove(e: React.PointerEvent) {
    const point = pointToStage(e)
    if (!point) return

    if (draggingToken.current) {
      const id = draggingToken.current
      const token = scene.tokens.find((t) => t.id === id)
      if (!token) return
      const squares = token.squares ?? 1
      const snapped = snapToGrid(point.x, point.y, squares, columns, aspect)
      setSceneState((prev) => {
        const base = prev ?? EMPTY_SCENE
        return { ...base, tokens: base.tokens.map((t) => (t.id === id ? { ...t, ...snapped } : t)) }
      })
      return
    }

    if (paintingFog.current && fog && isGM) {
      const next = paintFog(fog, point.x, point.y, brush, tool === 'revelar')
      setSceneState((prev) => ({ ...(prev ?? EMPTY_SCENE), fog: next }))
      return
    }

    if (drawingRuler.current) setRuler((prev) => (prev ? { ...prev, to: point } : prev))
  }

  function onStagePointerDown(e: React.PointerEvent) {
    const point = pointToStage(e)
    if (!point) return

    if (tool === 'marcar') {
      addScenePing(tableId, { x: point.x, y: point.y, label: myCharacter?.name ?? table?.gmName ?? '!' }).catch(() => {})
      return
    }
    if (tool === 'regua') {
      drawingRuler.current = true
      setRuler({ from: point, to: point })
      return
    }
    if ((tool === 'revelar' || tool === 'esconder') && isGM) {
      if (!fog) return
      paintingFog.current = true
      const next = paintFog(fog, point.x, point.y, brush, tool === 'revelar')
      setSceneState((prev) => ({ ...(prev ?? EMPTY_SCENE), fog: next }))
    }
  }

  function onStagePointerUp() {
    // A escrita no Firestore acontece ao soltar: durante o arraste/pintura o
    // estado local já dá o retorno imediato, sem martelar o banco.
    if (draggingToken.current) {
      draggingToken.current = null
      persistTokens(sceneRef.current.tokens)
    }
    if (paintingFog.current) {
      paintingFog.current = false
      if (isGM) persist({ ...sceneRef.current })
    }
    drawingRuler.current = false
  }

  // ---------- Ações do mestre ----------
  /**
   * Procura um quadrado vazio começando pelo canto de cima à esquerda. Sem
   * isso toda peça nova nasce no meio do palco, em cima da anterior, e o
   * mestre precisa separar as peças na mão antes de usar.
   */
  function freeSpot(squares: number): { x: number; y: number } {
    const cellX = 1 / columns
    const cellY = aspect / columns
    const taken = scene.tokens.filter((t) => t.onBoard !== false)
    for (let row = 0; row * cellY < 1; row++) {
      for (let col = 0; col * cellX < 1; col++) {
        const spot = snapToGrid(col * cellX + (squares * cellX) / 2, row * cellY + (squares * cellY) / 2, squares, columns, aspect)
        const livre = taken.every((t) => Math.abs(t.x - spot.x) > cellX / 2 || Math.abs(t.y - spot.y) > cellY / 2)
        if (livre) return spot
      }
    }
    return snapToGrid(0.5, 0.5, squares, columns, aspect)
  }

  function addToken(partial: Partial<SceneToken> & { label: string; kind: SceneTokenKind }) {
    const squares = partial.squares ?? 1
    const spot = freeSpot(squares)
    const token: SceneToken = {
      id: newId(),
      label: partial.label,
      kind: partial.kind,
      imageUrl: partial.imageUrl,
      x: spot.x,
      y: spot.y,
      size: 0.07,
      squares,
      refType: partial.refType,
      refId: partial.refId,
      onBoard: false,
    }
    persist({ ...scene, tokens: [...scene.tokens, token] })
  }

  function updateToken(id: string, patch: Partial<SceneToken>) {
    persist({ ...scene, tokens: scene.tokens.map((t) => (t.id === id ? { ...t, ...patch } : t)) })
  }

  /** Pôr no mapa é também achar onde: mesma regra da peça nova. */
  function putOnBoard(id: string) {
    const token = scene.tokens.find((t) => t.id === id)
    if (!token) return
    const spot = freeSpot(token.squares ?? 1)
    updateToken(id, { onBoard: true, x: spot.x, y: spot.y })
  }

  function removeToken(id: string) {
    persist({ ...scene, tokens: scene.tokens.filter((t) => t.id !== id) })
  }

  function toggleTorch(character: Character) {
    const lit = Boolean(character.lightUntil && character.lightUntil > now)
    updateCharacterDirect(tableId, character.id, { lightUntil: lit ? 0 : Date.now() + TORCH_DURATION }).catch(() => {})
  }

  function setTimeOfDay(next: 'day' | 'night') {
    persist({ ...scene, timeOfDay: next, locationLit: next === 'day' })
  }

  function ensureFog(): void {
    const rows = fogRows(aspect)
    persist({ ...scene, fog: scene.fog ? resampleFog({ ...scene.fog, enabled: true }, scene.fog.cols, rows) : emptyFog(aspect) })
  }

  // ---------- Visibilidade ----------
  const boardTokens = scene.tokens.filter((t) => t.onBoard !== false)
  const stagedTokens = scene.tokens.filter((t) => t.onBoard === false)

  /** A ficha por trás da peça: personagem, NPC ou ficha temporária. */
  function fichaDaPeca(t: SceneToken): Ficha | undefined {
    if (t.refType === 'character') return characters.find((c) => c.id === t.refId)
    if (t.refType === 'npc') return npcs.find((n) => n.id === t.refId)
    if (t.refType === 'companion') return companions.find((c) => c.id === t.refId)
    return undefined
  }

  /** A peça guarda o nome de quando foi criada; se a ficha foi renomeada
   * depois, quem manda é o nome de agora. */
  function rotuloDe(t: SceneToken) {
    return fichaDaPeca(t)?.name ?? t.label
  }

  /**
   * Faxina das peças temporárias: clone desfeito (ou que chegou a 0 PV) some
   * do mapa. Só o mestre escreve a cena, então só ele faz a limpeza — os
   * outros clientes recebem pelo snapshot.
   */
  useEffect(() => {
    if (!isGM || !sceneState) return
    const vivas = new Set(companions.map((c) => c.id))
    const sobrando = (sceneState.tokens ?? []).filter(
      (t) => t.refType === 'companion' && t.refId && !vivas.has(t.refId),
    )
    if (sobrando.length === 0) return
    void saveSceneTokens(tableId, (sceneState.tokens ?? []).filter((t) => !sobrando.includes(t)))
  }, [isGM, companions, sceneState, tableId])

  const litTokens = boardTokens.filter((t) => {
    if (t.refType !== 'character') return false
    const c = characters.find((x) => x.id === t.refId)
    return Boolean(c?.lightUntil && c.lightUntil > now)
  })
  const lightRy = LIGHT_RX * aspect

  /** No escuro, inimigos e chefes fora do alcance de qualquer luz somem da
   * tela dos jogadores. Personagens e NPCs seguem visíveis: o grupo sabe onde
   * os seus estão. O terreno não explorado esconde qualquer peça — menos a
   * sua própria, que é como o jogador se localiza. */
  function hiddenInTheDark(t: SceneToken) {
    const isMine = ehMinha(t)
    if (fog?.enabled && !isMine && !isRevealed(fog, t.x, t.y)) return true
    if (t.kind !== 'monster' && t.kind !== 'boss') return false
    if (locationLit) return false
    return !litTokens.some((l) => {
      const dx = (t.x - l.x) / (LIGHT_RX * LIGHT_REVEAL)
      const dy = (t.y - l.y) / (lightRy * LIGHT_REVEAL)
      return dx * dx + dy * dy <= 1
    })
  }

  const visibleTokens = isGM ? scene.tokens.filter((t) => t.onBoard !== false) : boardTokens.filter((t) => !hiddenInTheDark(t))

  const darkAlpha = isGM ? DARKNESS_ALPHA_GM : DARKNESS_ALPHA
  const darkEllipse = `${(LIGHT_RX * 100).toFixed(2)}% ${(lightRy * 100).toFixed(2)}%`
  const glowEllipse = `${(LIGHT_RX * GLOW_SCALE * 100).toFixed(2)}% ${(lightRy * GLOW_SCALE * 100).toFixed(2)}%`
  const darknessBackground = [
    ...litTokens.map(
      (t) =>
        `radial-gradient(ellipse ${darkEllipse} at ${t.x * 100}% ${t.y * 100}%, rgba(6,4,2,0) 0%, rgba(6,4,2,0) ${LIGHT_CLEAR * 100}%, rgba(6,4,2,0.3) 74%, rgba(6,4,2,${darkAlpha}) 100%)`,
    ),
    `linear-gradient(rgba(6,4,2,${darkAlpha}), rgba(6,4,2,${darkAlpha}))`,
  ].join(', ')
  const lightGlowBackground = litTokens
    .map(
      (t) =>
        `radial-gradient(ellipse ${glowEllipse} at ${t.x * 100}% ${t.y * 100}%, rgba(255,205,135,0.6) 0%, rgba(255,182,96,0.38) 35%, rgba(120,70,20,0.12) 70%, rgba(0,0,0,0) 100%)`,
    )
    .join(', ')

  const activeCombatant = table?.combatActive ? table.combatOrder[table.combatTurnIndex]?.ref : undefined
  /** O que o combate sabe sobre cada peça — condições pegando e quem é chefe.
   * Sem isso o mestre teria que olhar a lista de combate e o mapa ao mesmo
   * tempo para lembrar quem está envenenado. */
  const combatePorRef = new Map((table?.combatOrder ?? []).map((p) => [p.ref, p]))
  const livePings = pings.filter((p) => now - p.at < PING_LIFETIME_MS)

  if (!firebaseConfigured) return <p className="p-8 text-center text-amber-200">Firebase não configurado.</p>
  if (table === undefined || sceneState === undefined) {
    return <p className="p-8 text-center text-orange-300/60">Abrindo a cena...</p>
  }
  if (table === null) return <p className="p-8 text-center text-red-300">Mesa "{tableId}" não encontrada.</p>

  const waiting = !isGM && !scene.revealed

  return (
    <div className="flex h-screen flex-col">
      <DiceOverlay tableId={tableId} />

      {/* Barra de comando */}
      <div className="plaque z-20 flex flex-wrap items-center gap-2 rounded-none border-x-0 border-t-0 px-3 py-2">
        <Link to={`/t/${tableId}`} className="text-sm text-orange-400 transition hover:text-orange-200">
          ← ficha
        </Link>
        <span className="font-serif text-orange-100">{table.name}</span>
        <Badge>{timeOfDay === 'day' ? '☀ Dia' : '🌙 Noite'}</Badge>
        <Badge tone={locationLit ? 'good' : 'bad'}>{locationLit ? 'Local iluminado' : 'Sem luz'}</Badge>
        {table.combatActive && <Badge tone="warn">combate</Badge>}

        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          {(
            [
              ['mover', 'Mover'],
              ['marcar', 'Marcar'],
              ['regua', 'Régua'],
              ...(isGM ? ([['revelar', 'Revelar'], ['esconder', 'Esconder']] as [Tool, string][]) : []),
            ] as [Tool, string][]
          ).map(([key, label]) => (
            <TabChip key={key} active={tool === key} className="px-2.5 py-1 text-xs" onClick={() => setTool(key)}>
              {label}
            </TabChip>
          ))}
          {isGM && (tool === 'revelar' || tool === 'esconder') && (
            <label className="flex items-center gap-1 text-xs text-orange-300/70">
              pincel
              <input type="range" min={1} max={12} value={brush} onChange={(e) => setBrush(Number(e.target.value))} className="w-20" />
            </label>
          )}
        </div>

        {isGM && (
          <div className="flex w-full flex-wrap items-center gap-1.5 border-t border-[color:var(--line)] pt-2">
            <Button variant={scene.revealed ? 'good' : 'secondary'} onClick={() => persist({ ...scene, revealed: !scene.revealed })}>
              {scene.revealed ? 'Cena no ar' : 'Revelar cena'}
            </Button>
            <Button variant="secondary" onClick={() => setTimeOfDay(timeOfDay === 'day' ? 'night' : 'day')}>
              {timeOfDay === 'day' ? 'Anoitecer' : 'Amanhecer'}
            </Button>
            <Button variant="secondary" onClick={() => persist({ ...scene, locationLit: !locationLit })}>
              {locationLit ? 'Escurecer local' : 'Iluminar local'}
            </Button>
            <Button variant="secondary" onClick={() => persist({ ...scene, showGrid: !scene.showGrid })}>
              {scene.showGrid ? 'Esconder grade' : 'Mostrar grade'}
            </Button>
            {!fog?.enabled ? (
              <Button variant="secondary" onClick={ensureFog}>
                Ligar névoa
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => persist({ ...scene, fog: setAll(fog, true) })}>
                  Revelar tudo
                </Button>
                <Button variant="secondary" onClick={() => persist({ ...scene, fog: setAll(fog, false) })}>
                  Cobrir tudo
                </Button>
                <Button variant="ghost" onClick={() => persist({ ...scene, fog: { ...fog, enabled: false } })}>
                  desligar névoa
                </Button>
              </>
            )}
            <label className="flex items-center gap-1 text-xs text-orange-200">
              <input
                type="checkbox"
                checked={Boolean(table.playersMoveTokens)}
                onChange={(e) => updateTable(tableId, { playersMoveTokens: e.target.checked })}
              />
              jogadores movem a própria peça
            </label>
            <div className="ml-auto flex gap-1.5">
              {(['mapa', 'pecas', 'biblioteca'] as const).map((p) => (
                <TabChip key={p} active={panel === p} className="px-2.5 py-1 text-xs" onClick={() => setPanel(panel === p ? null : p)}>
                  {p === 'mapa' ? 'Mapa' : p === 'pecas' ? 'Peças' : 'Biblioteca'}
                </TabChip>
              ))}
            </div>
          </div>
        )}
      </div>

      {isGM && panel && (
        <GMPanel
          panel={panel}
          scene={scene}
          persist={persist}
          characters={characters}
          npcs={npcs}
          companions={companions}
          library={library}
          tableId={tableId}
          viewportAspect={viewport.width > 0 && viewport.height > 0 ? viewport.width / viewport.height : DEFAULT_STAGE_ASPECT}
          stagedTokens={stagedTokens}
          addToken={addToken}
          updateToken={updateToken}
          putOnBoard={putOnBoard}
          removeToken={removeToken}
          toggleTorch={toggleTorch}
          now={now}
        />
      )}

      {/* Palco */}
      <div ref={setWrapEl} className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-[color:var(--surface-board)] p-2">
        {waiting ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="hero-title font-serif text-3xl font-extrabold">Preparando a cena</p>
            <p className="text-sm text-orange-300/60">O mestre ainda está montando o cenário. Aguarde.</p>
          </div>
        ) : (
          <div
            ref={stageRef}
            onPointerDown={onStagePointerDown}
            onPointerMove={onStagePointerMove}
            onPointerUp={onStagePointerUp}
            onPointerLeave={onStagePointerUp}
            className="relative overflow-hidden rounded-sm border border-[color:var(--line-strong)]"
            style={{ width: stage.width || '100%', height: stage.height || 300, touchAction: 'none' }}
          >
            {/* 1. Mapa */}
            {scene.backgroundUrl && (
              <img
                src={normalizeImageUrl(scene.backgroundUrl)}
                alt=""
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
                style={{ objectFit: scene.map?.fit ?? 'contain', transform: mapTransform(scene.map) }}
              />
            )}

            {/* 2. Grade */}
            {scene.showGrid && (
              <div
                className="pointer-events-none absolute inset-0 z-[2]"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(255,255,255,0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.16) 1px, transparent 1px)',
                  backgroundSize: `${100 / columns}% ${(100 * aspect) / columns}%`,
                }}
              />
            )}

            {/* 3. Peças */}
            {visibleTokens.map((t) => {
              const width = tokenWidth(t, columns)
              const ref = fichaDaPeca(t)
              const hp = ref?.hp
              const combatRef = t.refType && t.refId ? `${t.refType}:${t.refId}` : undefined
              const isActive = Boolean(activeCombatant && combatRef && activeCombatant === combatRef)
              const naLuta = combatRef ? combatePorRef.get(combatRef) : undefined
              // As condições moram na ficha, então o selo aparece em combate e
              // fora dele — um jutsu que cega alguém no meio da conversa marca
              // a peça do mesmo jeito.
              const condicoes = condicoesDe(ref, table)
              // A arte vem da FICHA, não da peça: trocar o PNG de um NPC muda
              // todas as peças dele de uma vez, e o clone acompanha o dono.
              const arte = arteDaPeca(ref, t)
              return (
                <div
                  key={t.id}
                  onPointerDown={(e) => onTokenPointerDown(e, t)}
                  className={`absolute z-[3] -translate-x-1/2 -translate-y-1/2 select-none ${canDrag(t) ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%`, width: `${width * 100}%` }}
                  title={rotuloDe(t)}
                >
                  {arte.recortado ? (
                    // PNG sem fundo: desenha inteiro, sem moldura nem recorte
                    // redondo — recortar um PNG recortado joga fora justamente
                    // o que faz ele ficar bom em cima do mapa. Quem está na
                    // vez e quem é chefe continuam marcados, por baixo.
                    <div
                      className={`relative aspect-square ${
                        isActive ? 'animate-ember rounded-full ring-2 ring-[color:var(--orange)]' : ''
                      } ${t.kind === 'boss' || naLuta?.boss ? 'rounded-full ring-2 ring-red-500/80' : ''}`}
                    >
                      <img
                        src={arte.url}
                        alt={rotuloDe(t)}
                        draggable={false}
                        className={`h-full w-full object-contain ${t.temporary ? 'opacity-80' : ''}`}
                        style={{
                          filter: 'drop-shadow(0 3px 5px rgba(0,0,0,0.85))',
                          transform: t.rotation ? `rotate(${t.rotation}deg)` : undefined,
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={`relative aspect-square overflow-hidden rounded-full ${
                        // Clone e invocação usam borda tracejada: no meio de uma
                        // luta com quatro clones iguais, é o que diz de longe
                        // qual peça é o original.
                        t.temporary ? 'border-2 border-dashed' : 'border-2'
                      } ${isActive ? 'animate-ember border-[color:var(--orange)]' : 'border-[#ffffff]/70'} ${
                        t.kind === 'boss' || naLuta?.boss ? 'ring-2 ring-red-500/80' : ''
                      }`}
                      style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
                    >
                      {arte.url ? (
                        <img
                          src={arte.url}
                          alt={rotuloDe(t)}
                          draggable={false}
                          className="h-full w-full object-cover"
                          style={{ transform: t.rotation ? `rotate(${t.rotation}deg)` : undefined }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[color:var(--surface-raised)] font-display text-white">
                          <span style={{ fontSize: `${Math.max(10, width * stage.width * 0.35)}px` }}>{rotuloDe(t).slice(0, 2).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {condicoes.length > 0 && (
                    <div className="pointer-events-none absolute -top-1 left-1/2 flex -translate-x-1/2 -translate-y-full gap-0.5">
                      {condicoes.slice(0, 4).map((c) => (
                        <span
                          key={c.name}
                          title={`${c.name}${c.rounds !== undefined ? ` (${c.rounds} rodada(s))` : ' (sem prazo)'}${
                            efeitoDaCondicao(c.name) ? `\n${efeitoDaCondicao(c.name)}` : ''
                          }`}
                          className="rounded-sm border border-[color:var(--orange)] bg-black/85 px-1 font-display text-[9px] uppercase leading-tight text-[color:var(--orange)] shadow-[0_0_6px_rgba(0,0,0,0.9)]"
                        >
                          {selo(c.name)}
                          {c.rounds !== undefined && c.rounds}
                        </span>
                      ))}
                    </div>
                  )}
                  {hp && hp.max > 0 && (
                    <div className="mx-auto mt-0.5 h-1 w-4/5 overflow-hidden rounded-full bg-black/60">
                      <div
                        className={hp.current / hp.max > 0.5 ? 'h-full bg-emerald-500' : hp.current / hp.max > 0.2 ? 'h-full bg-amber-500' : 'h-full bg-red-600'}
                        style={{ width: `${Math.max(0, (hp.current / hp.max) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}

            {/* 4. Tom do céu (dia/noite) */}
            <div
              className="pointer-events-none absolute inset-0 z-[4] transition-colors duration-[2000ms]"
              style={{ backgroundColor: timeOfDay === 'night' ? 'rgba(6,10,28,0.42)' : 'rgba(255,170,90,0.10)' }}
            />

            {/* 5. Escuridão do local + brilho das tochas */}
            <div
              className="pointer-events-none absolute inset-0 z-[5] transition-opacity duration-[1200ms]"
              style={{ backgroundImage: darknessBackground, opacity: locationLit ? 0 : 1 }}
            />
            {lightGlowBackground && (
              <div
                className="pointer-events-none absolute inset-0 z-[5] mix-blend-screen transition-opacity duration-[1200ms]"
                style={{ backgroundImage: lightGlowBackground, opacity: locationLit ? 0 : 1 }}
              />
            )}

            {/* 6. Névoa de guerra */}
            {fog?.enabled && <canvas ref={fogCanvasRef} className="pointer-events-none absolute inset-0 z-[6] h-full w-full" />}

            {/* 7. Marcações e régua */}
            {livePings.map((p) => (
              <div
                key={p.id}
                className="pointer-events-none absolute z-[7] -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.x * 100}%`, top: `${p.y * 100}%` }}
              >
                <div className="h-8 w-8 animate-ping rounded-full border-2 border-[color:var(--orange)]" />
                <p className="mt-0.5 text-center font-display text-[10px] uppercase tracking-wide text-white">{p.label}</p>
              </div>
            ))}
            {ruler && (
              <svg className="pointer-events-none absolute inset-0 z-[7] h-full w-full">
                <line
                  x1={`${ruler.from.x * 100}%`}
                  y1={`${ruler.from.y * 100}%`}
                  x2={`${ruler.to.x * 100}%`}
                  y2={`${ruler.to.y * 100}%`}
                  stroke="var(--orange)"
                  strokeWidth={2}
                  strokeDasharray="6 4"
                />
                <text x={`${ruler.to.x * 100}%`} y={`${ruler.to.y * 100 - 2}%`} fill="#ffffff" fontSize="14" fontWeight="700">
                  {distanceInSquares(ruler.from, ruler.to, columns, aspect).toFixed(1)} quadrados
                </text>
              </svg>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ---------- Painéis do mestre ----------

function GMPanel({
  panel,
  scene,
  persist,
  characters,
  npcs,
  companions,
  library,
  tableId,
  viewportAspect,
  stagedTokens,
  addToken,
  updateToken,
  putOnBoard,
  removeToken,
  toggleTorch,
  now,
}: {
  panel: 'mapa' | 'pecas' | 'biblioteca'
  scene: Scene
  persist: (s: Scene) => void
  characters: Character[]
  npcs: NPC[]
  companions: Companion[]
  library: SceneLibraryItem[]
  tableId: string
  viewportAspect: number
  stagedTokens: SceneToken[]
  addToken: (t: Partial<SceneToken> & { label: string; kind: SceneTokenKind }) => void
  updateToken: (id: string, patch: Partial<SceneToken>) => void
  putOnBoard: (id: string) => void
  removeToken: (id: string) => void
  toggleTorch: (c: Character) => void
  now: number
}) {
  const [mapUrl, setMapUrl] = useState(scene.backgroundUrl)
  const [customLabel, setCustomLabel] = useState('')
  const [customUrl, setCustomUrl] = useState('')
  const [customKind, setCustomKind] = useState<SceneTokenKind>('monster')
  const [customSquares, setCustomSquares] = useState(1)
  const [libLabel, setLibLabel] = useState('')
  const [libFolder, setLibFolder] = useState('')
  const [avisoBiblioteca, setAvisoBiblioteca] = useState('')
  /** O aviso de "guardada"/"atualizada" some sozinho: é recado, não estado. */
  function avisar(texto: string) {
    setAvisoBiblioteca(texto)
    window.setTimeout(() => setAvisoBiblioteca(''), 4000)
  }

  /** O item da biblioteca que está aberto em jogo, quando há um. */
  const cenaAberta = library.find((i) => i.id === scene.fromLibraryId)

  /**
   * O retrato da cena de agora: enquadramento, grade, luz, névoa e peças.
   *
   * Clone e invocação valem para a cena de agora, então o retrato sai sem
   * eles — carregar esta cena depois não ressuscita ninguém.
   */
  function retratoDaCena() {
    return {
      backgroundUrl: scene.backgroundUrl,
      map: scene.map,
      gridColumns: scene.gridColumns,
      showGrid: scene.showGrid,
      timeOfDay: scene.timeOfDay,
      locationLit: scene.locationLit,
      fog: scene.fog,
      tokens: scene.tokens.filter((t) => !t.temporary),
    }
  }

  const map = scene.map ?? EMPTY_MAP
  const limiteDoMapa = mapOffsetLimit(map)
  const aspect = stageAspect(scene)

  /** Mesma regra do palco: ficha renomeada manda no rótulo da peça. */
  function rotuloDe(t: SceneToken) {
    const ficha = t.refType === 'character' ? characters.find((c) => c.id === t.refId) : npcs.find((n) => n.id === t.refId)
    return ficha?.name ?? t.label
  }

  // O input acompanha o que a cena tem de fato (ex: mapa escolhido na
  // biblioteca), desde que o mestre não esteja no meio de uma digitação.
  const [touchedUrl, setTouchedUrl] = useState(false)
  useEffect(() => {
    if (!touchedUrl) setMapUrl(scene.backgroundUrl)
  }, [scene.backgroundUrl, touchedUrl])

  /**
   * Enquadrar o mapa move o terreno — então a névoa pintada e as peças
   * precisam ir junto, senão o que foi revelado deixa de bater com o que está
   * embaixo.
   *
   * O remapeamento parte sempre do estado de quando o mestre PEGOU o controle,
   * não do passo anterior: arrastando um slider seriam dezenas de mudanças
   * seguidas, e refazer a malha da névoa em cima de si mesma a cada passo
   * borraria as bordas até virar mingau.
   */
  const baseAjuste = useRef<{ map: SceneMap | undefined; fog?: SceneFog; tokens: SceneToken[] } | null>(null)

  function comecarAjuste() {
    baseAjuste.current = { map: scene.map, fog: scene.fog, tokens: scene.tokens }
  }

  function ajustarMapa(patch: Partial<SceneMap>) {
    const base = baseAjuste.current ?? { map: scene.map, fog: scene.fog, tokens: scene.tokens }
    // Diminuir o zoom encolhe o quanto o mapa pode escorregar: sem prender
    // aqui, um deslocamento grande ficaria gravado e a imagem sairia do palco
    // com o controle já no fim do curso, sem jeito de trazer de volta.
    const proximo = clampMapOffsets({ ...(base.map ?? EMPTY_MAP), ...patch })
    persist({
      ...scene,
      map: proximo,
      tokens: remapTokens(base.tokens, base.map, proximo, aspect),
      fog: base.fog ? remapFog(base.fog, base.map, proximo, aspect) : scene.fog,
    })
  }

  function terminarAjuste() {
    baseAjuste.current = null
  }

  /**
   * Usar um mapa é também decidir o formato do palco: lemos o tamanho natural
   * da imagem e adotamos a proporção dela. Sem isso o palco ficava sempre em
   * 16:10 e sobrava tarja preta em volta de qualquer mapa de outro formato.
   */
  function useMap(url: string) {
    const clean = url.trim()
    // Trocar a imagem de fundo é começar outra cena: o vínculo com o item da
    // biblioteca cai, senão "Atualizar" gravaria um mapa por cima de outro.
    if (!clean) {
      persist({ ...scene, backgroundUrl: '', fromLibraryId: undefined })
      return
    }
    const img = new Image()
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight
      persist({
        ...scene,
        backgroundUrl: clean,
        fromLibraryId: undefined,
        map: { ...map, fit: 'cover', aspect: Number.isFinite(aspect) && aspect > 0.1 && aspect < 10 ? aspect : map.aspect },
      })
    }
    img.onerror = () => persist({ ...scene, backgroundUrl: clean, fromLibraryId: undefined })
    img.src = clean
  }

  return (
    <Card className="z-10 flex max-h-[38vh] shrink-0 flex-col gap-3 overflow-y-auto rounded-none border-x-0 p-3">
      {panel === 'mapa' && (
        <div className="flex flex-col gap-2">
          <SectionTitle>Mapa</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="URL da imagem do mapa (link do Drive também serve)"
              value={mapUrl}
              onChange={(e) => {
                setTouchedUrl(true)
                setMapUrl(e.target.value)
              }}
              onBlur={() => setMapUrl(normalizeImageUrl(mapUrl) ?? '')}
              className="w-80"
            />
            <Button
              variant="primary"
              onClick={() => {
                useMap(normalizeImageUrl(mapUrl) ?? '')
                setTouchedUrl(false)
              }}
            >
              Usar mapa
            </Button>
            {scene.backgroundUrl && (
              <>
                {/* Cena aberta da biblioteca grava por cima: mexer no
                    enquadramento de um mapa guardado não pode obrigar a
                    acumular cópias dele. */}
                {cenaAberta && (
                  <Button
                    variant="primary"
                    title={`Grava por cima de "${cenaAberta.label}", sem criar outra entrada`}
                    onClick={async () => {
                      await updateSceneLibraryItem(tableId, cenaAberta.id, {
                        ...(libLabel.trim() ? { label: libLabel.trim() } : {}),
                        imageUrl: scene.backgroundUrl,
                        snapshot: retratoDaCena(),
                      })
                      setLibLabel('')
                      avisar(`"${libLabel.trim() || cenaAberta.label}" foi atualizada.`)
                    }}
                  >
                    Atualizar "{cenaAberta.label}"
                  </Button>
                )}
                <Button
                  variant={cenaAberta ? 'secondary' : 'primary'}
                  onClick={async () => {
                    const item = await addSceneLibraryItem(tableId, {
                      kind: 'map',
                      label: libLabel.trim() || 'Cena sem nome',
                      imageUrl: scene.backgroundUrl,
                      folder: libFolder.trim() || undefined,
                      createdAt: Date.now(),
                      snapshot: retratoDaCena(),
                    })
                    // Guardou: a cena em jogo passa a ser ESTA entrada, para o
                    // próximo ajuste já poder gravar por cima.
                    persist({ ...scene, fromLibraryId: item.id })
                    setLibLabel('')
                    avisar(`"${item.label}" guardada${item.folder ? ` em ${item.folder}` : ''}.`)
                  }}
                >
                  {cenaAberta ? 'Guardar como nova' : 'Guardar cena na biblioteca'}
                </Button>
              </>
            )}
            <Input
              placeholder={cenaAberta ? 'renomear (opcional)' : 'nome da cena guardada'}
              value={libLabel}
              onChange={(e) => setLibLabel(e.target.value)}
              className="w-44"
            />
            <Input
              placeholder="pasta (opcional)"
              value={libFolder}
              list="pastas-da-biblioteca"
              onChange={(e) => setLibFolder(e.target.value)}
              className="w-36"
            />
            <datalist id="pastas-da-biblioteca">
              {pastasDa(library)
                .filter((p) => p !== SEM_PASTA)
                .map((p) => (
                  <option key={p} value={p} />
                ))}
            </datalist>
            {avisoBiblioteca && <span className="text-[11px] text-emerald-300">{avisoBiblioteca}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-orange-200">
            <label className="flex items-center gap-1">
              zoom
              <input
                type="range"
                min={MIN_MAP_ZOOM}
                max={MAX_MAP_ZOOM}
                step={0.05}
                value={map.zoom ?? 1}
                onPointerDown={comecarAjuste}
                onPointerUp={terminarAjuste}
                onKeyDown={comecarAjuste}
                onKeyUp={terminarAjuste}
                onChange={(e) => ajustarMapa({ zoom: Number(e.target.value) })}
              />
            </label>
            <label className="flex items-center gap-1">
              giro
              <input
                type="range"
                min={0}
                max={360}
                value={map.rotation ?? 0}
                onPointerDown={comecarAjuste}
                onPointerUp={terminarAjuste}
                onKeyDown={comecarAjuste}
                onKeyUp={terminarAjuste}
                onChange={(e) => ajustarMapa({ rotation: Number(e.target.value) })}
              />
            </label>
            {/* O alcance de X e Y acompanha o zoom: com a imagem 3× maior que
                o palco, sobra uma largura inteira de cada lado, e um curso
                fixo de ±50% nunca chegaria à borda. */}
            <label className="flex items-center gap-1" title={`alcance atual: ±${limiteDoMapa.toFixed(2)} de palco`}>
              X
              <input
                type="range"
                min={-limiteDoMapa}
                max={limiteDoMapa}
                step={0.01}
                value={map.offsetX ?? 0}
                onPointerDown={comecarAjuste}
                onPointerUp={terminarAjuste}
                onKeyDown={comecarAjuste}
                onKeyUp={terminarAjuste}
                onChange={(e) => ajustarMapa({ offsetX: Number(e.target.value) })}
              />
              <span className="w-10 text-right font-mono text-[10px] text-orange-400/60">
                {((map.offsetX ?? 0) * 100).toFixed(0)}%
              </span>
            </label>
            <label className="flex items-center gap-1" title={`alcance atual: ±${limiteDoMapa.toFixed(2)} de palco`}>
              Y
              <input
                type="range"
                min={-limiteDoMapa}
                max={limiteDoMapa}
                step={0.01}
                value={map.offsetY ?? 0}
                onPointerDown={comecarAjuste}
                onPointerUp={terminarAjuste}
                onKeyDown={comecarAjuste}
                onKeyUp={terminarAjuste}
                onChange={(e) => ajustarMapa({ offsetY: Number(e.target.value) })}
              />
              <span className="w-10 text-right font-mono text-[10px] text-orange-400/60">
                {((map.offsetY ?? 0) * 100).toFixed(0)}%
              </span>
            </label>
            <Button
              variant="ghost"
              className="px-2 py-0.5 text-[11px]"
              title="Volta o mapa para o centro, sem mexer no zoom nem no giro"
              onClick={() => ajustarMapa({ offsetX: 0, offsetY: 0 })}
            >
              centralizar
            </Button>
            <label className="flex items-center gap-1">
              quadrados de largura
              <Input
                type="number"
                min={MIN_GRID_COLUMNS}
                max={MAX_GRID_COLUMNS}
                value={scene.gridColumns ?? 20}
                onChange={(e) => {
                  const n = Number(e.target.value)
                  if (!Number.isFinite(n) || n < MIN_GRID_COLUMNS) return
                  persist({ ...scene, gridColumns: Math.min(MAX_GRID_COLUMNS, Math.round(n)) })
                }}
                className="w-20"
              />
            </label>
            <Select
              value={scene.map?.fit ?? 'contain'}
              onChange={(e) => persist({ ...scene, map: { ...map, fit: e.target.value as 'contain' | 'cover' } })}
              className="w-32"
            >
              <option value="contain">mapa inteiro</option>
              <option value="cover">preencher</option>
            </Select>
            <Button variant="secondary" onClick={() => persist({ ...scene, map: { ...map, aspect: viewportAspect } })}>
              Ajustar palco à minha tela
            </Button>
            <Select
              value={PRESET_ASPECTS.some((a) => Math.abs(a.value - (scene.map?.aspect ?? DEFAULT_STAGE_ASPECT)) < 0.005)
                ? String(scene.map?.aspect ?? DEFAULT_STAGE_ASPECT)
                : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') return
                persist({ ...scene, map: { ...map, aspect: Number(e.target.value) } })
              }}
              className="w-36"
            >
              {PRESET_ASPECTS.map((a) => (
                <option key={a.label} value={String(a.value)}>
                  {a.label}
                </option>
              ))}
              <option value="custom">sob medida</option>
            </Select>
            <Button
              variant="ghost"
              onClick={() => {
                comecarAjuste()
                ajustarMapa(EMPTY_MAP)
                terminarAjuste()
              }}
            >
              reiniciar enquadramento
            </Button>
          </div>
        </div>
      )}

      {panel === 'pecas' && (
        <div className="flex flex-col gap-3">
          <SectionTitle>Peças</SectionTitle>

          <div className="flex flex-wrap gap-2">
            {characters.map((c) => {
              const lit = Boolean(c.lightUntil && c.lightUntil > now)
              return (
                <div key={c.id} className="well flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs">
                  <span className="text-orange-100">{c.name}</span>
                  <Button
                    variant="secondary"
                    className="px-2 py-0.5 text-[11px]"
                    onClick={() => addToken({ label: c.name, kind: 'pc', imageUrl: c.imageUrl, refType: 'character', refId: c.id })}
                  >
                    + peça
                  </Button>
                  <Button variant={lit ? 'good' : 'ghost'} className="px-2 py-0.5 text-[11px]" onClick={() => toggleTorch(c)}>
                    {lit ? 'luz acesa' : 'acender luz'}
                  </Button>
                </div>
              )
            })}
            {npcs.map((n) => (
              <div key={n.id} className="well flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs">
                <span className="text-orange-100">{n.name}</span>
                <Button
                  variant="secondary"
                  className="px-2 py-0.5 text-[11px]"
                  onClick={() => addToken({ label: n.name, kind: 'monster', refType: 'npc', refId: n.id })}
                >
                  + peça
                </Button>
              </div>
            ))}
          </div>

          <ArteDasPecas tableId={tableId} characters={characters} npcs={npcs} companions={companions} />

          <div className="flex flex-wrap items-end gap-2">
            <Input placeholder="Nome da peça" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} className="w-40" />
            <Input
              placeholder="URL da imagem"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onBlur={() => setCustomUrl(normalizeImageUrl(customUrl) ?? '')}
              className="w-56"
            />
            <Select value={customKind} onChange={(e) => setCustomKind(e.target.value as SceneTokenKind)} className="w-32">
              {/* "companion" não entra aqui: clone e invocação nascem do
                  jutsu, na ficha de quem lançou, não à mão. */}
              {(Object.keys(SCENE_TOKEN_LABELS) as SceneTokenKind[]).filter((k) => k !== 'companion').map((k) => (
                <option key={k} value={k}>
                  {SCENE_TOKEN_LABELS[k]}
                </option>
              ))}
            </Select>
            <Select value={customSquares} onChange={(e) => setCustomSquares(Number(e.target.value))} className="w-32">
              {CREATURE_SIZES.map((s) => (
                <option key={s.key} value={s.squares}>
                  {s.label}
                </option>
              ))}
            </Select>
            <Button
              variant="primary"
              disabled={!customLabel.trim()}
              onClick={() => {
                addToken({ label: customLabel.trim(), kind: customKind, imageUrl: normalizeImageUrl(customUrl), squares: customSquares })
                setCustomLabel('')
                setCustomUrl('')
              }}
            >
              Criar peça
            </Button>
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-orange-400/60">
              Bandeja ({stagedTokens.length}) — peças prontas, ainda fora do mapa
            </p>
            <div className="flex flex-wrap gap-2">
              {stagedTokens.map((t) => (
                <div key={t.id} className="well flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs">
                  <span className="text-orange-100">{rotuloDe(t)}</span>
                  <Button variant="good" className="px-2 py-0.5 text-[11px]" onClick={() => putOnBoard(t.id)}>
                    pôr no mapa
                  </Button>
                  <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => removeToken(t.id)}>
                    remover
                  </button>
                </div>
              ))}
              {stagedTokens.length === 0 && <p className="text-xs text-orange-300/50">Nada na bandeja.</p>}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs uppercase tracking-wide text-orange-400/60">No mapa</p>
            <div className="flex flex-wrap gap-2">
              {scene.tokens
                .filter((t) => t.onBoard !== false)
                .map((t) => (
                  <div key={t.id} className="well flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs">
                    <span className="text-orange-100">{rotuloDe(t)}</span>
                    <Select
                      value={t.squares ?? 1}
                      onChange={(e) => updateToken(t.id, { squares: Number(e.target.value) })}
                      className="w-24 px-1 py-0.5 text-[11px]"
                    >
                      {CREATURE_SIZES.map((s) => (
                        <option key={s.key} value={s.squares}>
                          {s.label}
                        </option>
                      ))}
                    </Select>
                    {/* Girar é da peça, não da ficha: a mesma criatura pode
                        estar deitada numa cena e de pé em outra. */}
                    <Button
                      variant="ghost"
                      className="px-2 py-0.5 text-[11px]"
                      title={`Gira a peça 90° (agora em ${t.rotation ?? 0}°)`}
                      onClick={() => updateToken(t.id, { rotation: ((t.rotation ?? 0) + 90) % 360 })}
                    >
                      girar {t.rotation ? `${t.rotation}°` : '90°'}
                    </Button>
                    <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => updateToken(t.id, { onBoard: false })}>
                      recolher
                    </Button>
                    <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => removeToken(t.id)}>
                      remover
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {panel === 'biblioteca' && (
        <SceneLibraryPanel tableId={tableId} library={library} scene={scene} persist={persist} addToken={addToken} />
      )}
    </Card>
  )
}

/**
 * A arte das peças — só do mestre.
 *
 * Uma ficha carrega duas imagens: o retrato redondo, que o dono escolhe e
 * serve para reconhecer a pessoa nas listas, e o PNG sem fundo, que é o que
 * fica bom em cima do mapa. Quem põe o PNG e quem decide qual está valendo é
 * o mestre, em qualquer ficha da mesa — inclusive nas dos jogadores.
 *
 * Fica aqui, na aba de Peças, porque é aqui que se pensa em peça. Espalhar
 * este controle por quatro editores diferentes (ficha, NPC rápido, criatura,
 * forja) daria quatro lugares para procurar e quatro para esquecer.
 */
function ArteDasPecas({
  tableId,
  characters,
  npcs,
  companions,
}: {
  tableId: string
  characters: Character[]
  npcs: NPC[]
  companions: Companion[]
}) {
  const [aberto, setAberto] = useState(false)
  const [rascunho, setRascunho] = useState<Record<string, string>>({})

  type Linha = { ref: string; nome: string; ficha: { imageUrl?: string; tokenUrl?: string; tokenMode?: TokenMode } }
  const linhas: Linha[] = [
    ...characters.map((c) => ({ ref: `character:${c.id}`, nome: c.name + (c.isNPC ? ' (NPC)' : ''), ficha: c })),
    ...npcs.map((n) => ({ ref: `npc:${n.id}`, nome: n.name, ficha: n })),
    ...companions.map((c) => ({ ref: `companion:${c.id}`, nome: `${c.name} (de ${c.ownerName})`, ficha: c })),
  ]

  async function gravar(ref: string, patch: { tokenUrl?: string; tokenMode?: TokenMode }) {
    const [kind, id] = ref.split(':')
    if (kind === 'character') await updateCharacterDirect(tableId, id, patch)
    else if (kind === 'npc') await updateNPC(tableId, id, patch)
    else await updateCompanion(tableId, id, patch)
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        className="flex items-center gap-2 text-left text-xs uppercase tracking-wide text-orange-400/60 hover:text-[color:var(--orange)]"
        onClick={() => setAberto(!aberto)}
      >
        {aberto ? '▾' : '▸'} Arte das peças ({linhas.length}) — PNG sem fundo para o mapa
      </button>

      {aberto && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] leading-relaxed text-orange-300/50">
            Cole o link de um PNG sem fundo e ligue o <b className="text-orange-200">PNG</b> para a peça daquela ficha
            usar ele no mapa, inteiro, sem o recorte redondo. O retrato da ficha continua onde está — dá para voltar
            para ele a qualquer hora. Só você vê e mexe neste quadro.
          </p>
          {linhas.map((l) => {
            const modo = modoDaPeca(l.ficha)
            const temPng = podeUsarPng(l.ficha)
            const valor = rascunho[l.ref] ?? l.ficha.tokenUrl ?? ''
            return (
              <div key={l.ref} className="well flex min-w-0 flex-wrap items-center gap-2 rounded-sm p-2 text-xs">
                <span className="min-w-0 flex-1 break-words text-orange-100">{l.nome}</span>
                <Input
                  placeholder="link do PNG sem fundo"
                  value={valor}
                  className="min-w-0 flex-[2] px-2 py-0.5 text-[11px]"
                  onChange={(e) => setRascunho((p) => ({ ...p, [l.ref]: e.target.value }))}
                  onBlur={() => {
                    // Link do Drive vira endereço servível aqui, antes de gravar.
                    const limpo = normalizeImageUrl(valor) ?? ''
                    if (limpo !== valor) setRascunho((p) => ({ ...p, [l.ref]: limpo }))
                    if (limpo === (l.ficha.tokenUrl ?? '')) return
                    // Apagar o link desliga o PNG junto: deixar o modo ligado
                    // sem imagem só produziria uma peça invisível.
                    void gravar(l.ref, { tokenUrl: limpo || undefined, ...(limpo ? {} : { tokenMode: 'ficha' as TokenMode }) })
                  }}
                />
                <span className="flex shrink-0 gap-1">
                  <Button
                    variant={modo === 'ficha' ? 'primary' : 'ghost'}
                    className="px-2 py-0.5 text-[11px]"
                    onClick={() => gravar(l.ref, { tokenMode: 'ficha' })}
                  >
                    retrato
                  </Button>
                  <Button
                    variant={modo === 'png' ? 'primary' : 'ghost'}
                    className="px-2 py-0.5 text-[11px]"
                    disabled={!temPng}
                    title={temPng ? 'Usar o PNG sem fundo no mapa' : 'Cole um link primeiro'}
                    onClick={() => gravar(l.ref, { tokenMode: 'png' })}
                  >
                    PNG
                  </Button>
                </span>
              </div>
            )
          })}
          {linhas.some((l) => ehLinkDoDrive(l.ficha.tokenUrl)) && <AvisoDoDrive />}
          {linhas.length === 0 && <p className="text-xs text-orange-300/50">Nenhuma ficha na mesa ainda.</p>}
        </div>
      )}
    </div>
  )
}
