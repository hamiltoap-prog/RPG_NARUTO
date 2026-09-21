import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from '../components/ui'
import { DiceOverlay } from '../components/DiceOverlay'
import { firebaseConfigured } from '../firebase'
import { useAuthUid } from '../hooks/useAuth'
import { drawFog, emptyFog, fogRows, isRevealed, paintFog, resampleFog, setAll } from '../lib/fog'
import { newId } from '../lib/id'
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
  mapTransform,
  snapToGrid,
  stageAspect,
  tokenWidth,
} from '../lib/sceneGeometry'
import {
  addScenePing,
  addSceneLibraryItem,
  cleanupOldPings,
  deleteSceneLibraryItem,
  listenCharacters,
  listenNPCs,
  listenScene,
  listenSceneLibrary,
  listenScenePings,
  listenTable,
  saveScene,
  saveSceneTokens,
  updateCharacterDirect,
  updateTable,
} from '../lib/store'
import { CREATURE_SIZES, DEFAULT_STAGE_ASPECT, PING_LIFETIME_MS, SCENE_TOKEN_LABELS } from '../types'
import type { Character, GameTable, NPC, Scene, SceneLibraryItem, ScenePing, SceneToken, SceneTokenKind } from '../types'

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

  useEffect(() => listenCharacters(tableId, setCharacters), [tableId])
  useEffect(() => listenNPCs(tableId, setNpcs), [tableId])
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
    return t.refType === 'character' && Boolean(myCharacter) && t.refId === myCharacter?.id
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
    const isMine = t.refType === 'character' && Boolean(myCharacter) && t.refId === myCharacter?.id
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
                src={scene.backgroundUrl}
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
              const ref = t.refType === 'character' ? characters.find((c) => c.id === t.refId) : npcs.find((n) => n.id === t.refId)
              const hp = ref?.hp
              const isActive =
                activeCombatant && t.refType && t.refId
                  ? activeCombatant === `${t.refType}:${t.refId}`
                  : false
              return (
                <div
                  key={t.id}
                  onPointerDown={(e) => onTokenPointerDown(e, t)}
                  className={`absolute z-[3] -translate-x-1/2 -translate-y-1/2 select-none ${canDrag(t) ? 'cursor-grab active:cursor-grabbing' : ''}`}
                  style={{ left: `${t.x * 100}%`, top: `${t.y * 100}%`, width: `${width * 100}%` }}
                  title={t.label}
                >
                  <div
                    className={`relative aspect-square overflow-hidden rounded-full border-2 ${
                      isActive ? 'animate-ember border-[color:var(--orange)]' : 'border-white/70'
                    } ${t.kind === 'boss' ? 'ring-2 ring-red-500/80' : ''}`}
                    style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.6)' }}
                  >
                    {t.imageUrl ? (
                      <img src={t.imageUrl} alt={t.label} draggable={false} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[color:var(--surface-raised)] font-display text-white">
                        <span style={{ fontSize: `${Math.max(10, width * stage.width * 0.35)}px` }}>{t.label.slice(0, 2).toUpperCase()}</span>
                      </div>
                    )}
                  </div>
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

  const map = scene.map ?? EMPTY_MAP

  // O input acompanha o que a cena tem de fato (ex: mapa escolhido na
  // biblioteca), desde que o mestre não esteja no meio de uma digitação.
  const [touchedUrl, setTouchedUrl] = useState(false)
  useEffect(() => {
    if (!touchedUrl) setMapUrl(scene.backgroundUrl)
  }, [scene.backgroundUrl, touchedUrl])

  /**
   * Usar um mapa é também decidir o formato do palco: lemos o tamanho natural
   * da imagem e adotamos a proporção dela. Sem isso o palco ficava sempre em
   * 16:10 e sobrava tarja preta em volta de qualquer mapa de outro formato.
   */
  function useMap(url: string) {
    const clean = url.trim()
    if (!clean) {
      persist({ ...scene, backgroundUrl: '' })
      return
    }
    const img = new Image()
    img.onload = () => {
      const aspect = img.naturalWidth / img.naturalHeight
      persist({
        ...scene,
        backgroundUrl: clean,
        map: { ...map, fit: 'cover', aspect: Number.isFinite(aspect) && aspect > 0.1 && aspect < 10 ? aspect : map.aspect },
      })
    }
    img.onerror = () => persist({ ...scene, backgroundUrl: clean })
    img.src = clean
  }

  return (
    <Card className="z-10 flex max-h-[38vh] shrink-0 flex-col gap-3 overflow-y-auto rounded-none border-x-0 p-3">
      {panel === 'mapa' && (
        <div className="flex flex-col gap-2">
          <SectionTitle>Mapa</SectionTitle>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="URL da imagem do mapa"
              value={mapUrl}
              onChange={(e) => {
                setTouchedUrl(true)
                setMapUrl(e.target.value)
              }}
              className="w-80"
            />
            <Button
              variant="primary"
              onClick={() => {
                useMap(mapUrl)
                setTouchedUrl(false)
              }}
            >
              Usar mapa
            </Button>
            {scene.backgroundUrl && (
              <Button
                variant="secondary"
                onClick={() =>
                  addSceneLibraryItem(tableId, {
                    kind: 'map',
                    label: libLabel.trim() || 'Mapa sem nome',
                    imageUrl: scene.backgroundUrl,
                    createdAt: Date.now(),
                  })
                }
              >
                Guardar na biblioteca
              </Button>
            )}
            <Input placeholder="nome na biblioteca" value={libLabel} onChange={(e) => setLibLabel(e.target.value)} className="w-48" />
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
                onChange={(e) => persist({ ...scene, map: { ...map, zoom: Number(e.target.value) } })}
              />
            </label>
            <label className="flex items-center gap-1">
              giro
              <input
                type="range"
                min={0}
                max={360}
                value={map.rotation ?? 0}
                onChange={(e) => persist({ ...scene, map: { ...map, rotation: Number(e.target.value) } })}
              />
            </label>
            <label className="flex items-center gap-1">
              X
              <input
                type="range"
                min={-0.5}
                max={0.5}
                step={0.01}
                value={map.offsetX ?? 0}
                onChange={(e) => persist({ ...scene, map: { ...map, offsetX: Number(e.target.value) } })}
              />
            </label>
            <label className="flex items-center gap-1">
              Y
              <input
                type="range"
                min={-0.5}
                max={0.5}
                step={0.01}
                value={map.offsetY ?? 0}
                onChange={(e) => persist({ ...scene, map: { ...map, offsetY: Number(e.target.value) } })}
              />
            </label>
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
            <Button variant="ghost" onClick={() => persist({ ...scene, map: EMPTY_MAP })}>
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

          <div className="flex flex-wrap items-end gap-2">
            <Input placeholder="Nome da peça" value={customLabel} onChange={(e) => setCustomLabel(e.target.value)} className="w-40" />
            <Input placeholder="URL da imagem" value={customUrl} onChange={(e) => setCustomUrl(e.target.value)} className="w-56" />
            <Select value={customKind} onChange={(e) => setCustomKind(e.target.value as SceneTokenKind)} className="w-32">
              {(Object.keys(SCENE_TOKEN_LABELS) as SceneTokenKind[]).map((k) => (
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
                addToken({ label: customLabel.trim(), kind: customKind, imageUrl: customUrl.trim() || undefined, squares: customSquares })
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
                  <span className="text-orange-100">{t.label}</span>
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
                    <span className="text-orange-100">{t.label}</span>
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
        <div className="flex flex-col gap-2">
          <SectionTitle>Biblioteca</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {library.map((item) => (
              <div key={item.id} className="well flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="h-8 w-12 rounded object-cover" />}
                <span className="text-orange-100">{item.label}</span>
                {item.kind === 'map' ? (
                  <Button
                    variant="secondary"
                    className="px-2 py-0.5 text-[11px]"
                    onClick={() => persist({ ...scene, backgroundUrl: item.imageUrl ?? '' })}
                  >
                    usar
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="px-2 py-0.5 text-[11px]"
                    onClick={() => addToken({ label: item.label, kind: item.tokenKind ?? 'monster', imageUrl: item.imageUrl })}
                  >
                    criar peça
                  </Button>
                )}
                <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => deleteSceneLibraryItem(tableId, item.id)}>
                  remover
                </button>
              </div>
            ))}
            {library.length === 0 && <p className="text-xs text-orange-300/50">A biblioteca está vazia. Guarde mapas pela aba "Mapa".</p>}
          </div>
        </div>
      )}
    </Card>
  )
}
