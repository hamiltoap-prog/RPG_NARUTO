import { useMemo, useState } from 'react'
import { Badge, Button, Input, SectionTitle, TabChip } from './ui'
import { ArvoreDePastas, SelectDePasta } from './Pastas'
import { EditorDeHistoria, apresentarHistoria } from './ModoHistoria'
import { deleteSceneLibraryItem, moverParaPasta, moverPasta, updateSceneAudio, updateSceneLibraryItem } from '../lib/store'
import { somAoAbrir } from '../lib/audioPlan'
import { normalizeImageUrl } from '../lib/imageUrl'
import { todasAsPastas } from '../lib/pastas'
import type { Scene, SceneLibraryItem, SceneToken, SceneTokenKind, StoryShow } from '../types'

type Filtro = 'tudo' | 'map' | 'story' | 'token'
const ROTULO_DO_TIPO: Record<SceneLibraryItem['kind'], string> = { map: 'cena', token: 'peça', story: 'história' }

/**
 * A biblioteca da mesa: mapas, cenas inteiras e peças prontas.
 *
 * Duas coisas que uma mesa com muitas cenas precisa e que a lista corrida não
 * dava: **pasta**, para o mapa da vila não ficar embolado com o covil do
 * chefe, e **gravar por cima**, para mexer numa cena guardada sem acumular
 * cópias do mesmo mapa.
 *
 * Pastas têm subpastas ("Cena 01 › Konoha › Sala do Hokage"), e moram na
 * mesma árvore as cenas, as peças prontas e as histórias do modo história —
 * a pasta de um arco junta tudo o que o mestre vai usar nele. Pasta não é
 * documento: ver `lib/pastas.ts`.
 */
export function SceneLibraryPanel({
  tableId,
  library,
  scene,
  persist,
  addToken,
  show = null,
}: {
  show?: StoryShow | null
  tableId: string
  library: SceneLibraryItem[]
  scene: Scene
  persist: (s: Scene) => void
  addToken: (t: Partial<SceneToken> & { label: string; kind: SceneTokenKind }) => void
}) {
  const [editando, setEditando] = useState<string | null>(null)
  const [rotuloNovo, setRotuloNovo] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('tudo')
  /** História aberta no editor: `null` fechado, `'nova'` nova, ou o item. */
  const [historia, setHistoria] = useState<SceneLibraryItem | 'nova' | null>(null)

  const pastas = useMemo(() => todasAsPastas(library.map((i) => i.folder)), [library])
  const visiveis = filtro === 'tudo' ? library : library.filter((i) => i.kind === filtro)
  const contar = (k: Filtro) => (k === 'tudo' ? library.length : library.filter((i) => i.kind === k).length)

  /** Abre a cena guardada e lembra de onde ela veio, para poder gravar por cima. */
  function abrir(item: SceneLibraryItem) {
    // A cena volta com o som que tinha quando foi guardada.
    const som = somAoAbrir(item.audio)
    if (som) void updateSceneAudio(tableId, som)
    const s = item.snapshot
    if (!s) {
      // Item antigo, de quando a biblioteca só guardava a imagem: troca o mapa
      // e deixa o resto da cena como está.
      persist({ ...scene, backgroundUrl: item.imageUrl ?? '', fromLibraryId: item.id })
      return
    }
    persist({
      ...scene,
      backgroundUrl: s.backgroundUrl,
      map: s.map,
      gridColumns: s.gridColumns,
      showGrid: s.showGrid,
      timeOfDay: s.timeOfDay,
      locationLit: s.locationLit,
      fog: s.fog,
      tokens: s.tokens,
      fromLibraryId: item.id,
    })
  }

  const editor = historia && (
    <EditorDeHistoria
      tableId={tableId}
      item={historia === 'nova' ? undefined : historia}
      show={show}
      onFechar={() => setHistoria(null)}
    />
  )

  function renderItem(item: SceneLibraryItem) {
    const aberto = scene.fromLibraryId === item.id
    const noAr = item.kind === 'story' && show?.open && show.libraryId === item.id
    return (
      <div
        className={`well flex min-w-0 flex-wrap items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
          aberto || noAr ? 'ring-1 ring-[color:var(--orange)]' : ''
        }`}
        data-item-biblioteca={item.label}
      >
        {item.imageUrl && <img src={normalizeImageUrl(item.imageUrl)} alt="" className="h-8 w-12 shrink-0 rounded object-cover" />}

        {editando === item.id ? (
          <span className="flex items-center gap-1">
            <Input value={rotuloNovo} className="w-40 px-2 py-0.5 text-[11px]" onChange={(e) => setRotuloNovo(e.target.value)} />
            <Button
              variant="primary"
              className="px-2 py-0.5 text-[11px]"
              onClick={async () => {
                const n = rotuloNovo.trim()
                if (n) await updateSceneLibraryItem(tableId, item.id, { label: n })
                setEditando(null)
              }}
            >
              ok
            </Button>
            <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => setEditando(null)}>
              x
            </Button>
          </span>
        ) : (
          <button
            className="min-w-0 break-words text-left text-orange-100 hover:text-white"
            title="Renomear"
            onClick={() => {
              setEditando(item.id)
              setRotuloNovo(item.label)
            }}
          >
            {item.label}
          </button>
        )}

        <span className="text-[10px] uppercase tracking-wide text-orange-400/50">
          {ROTULO_DO_TIPO[item.kind]}
          {item.kind === 'story' ? ` · ${item.slides?.length ?? 0} slide(s)` : ''}
        </span>
        {aberto && <Badge tone="warn">aberta</Badge>}
        {noAr && <Badge tone="good">no ar</Badge>}

        {item.kind === 'map' && (
          <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => abrir(item)}>
            {item.snapshot ? 'abrir cena' : 'usar mapa'}
          </Button>
        )}
        {item.kind === 'token' && (
          <Button
            variant="secondary"
            className="px-2 py-0.5 text-[11px]"
            onClick={() => addToken({ label: item.label, kind: item.tokenKind ?? 'monster', imageUrl: item.imageUrl })}
          >
            criar peça
          </Button>
        )}
        {item.kind === 'story' && (
          <>
            <Button
              variant="primary"
              className="px-2 py-0.5 text-[11px]"
              disabled={!item.slides?.length}
              title="Abre a história na tela de todos"
              onClick={() => apresentarHistoria(tableId, item)}
            >
              ▶ apresentar
            </Button>
            <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => setHistoria(item)}>
              editar
            </Button>
          </>
        )}

        <SelectDePasta
          valor={item.folder}
          pastas={pastas}
          className="w-32"
          onMudar={(c) => void moverParaPasta(tableId, 'sceneLibrary', item.id, c)}
        />

        <button
          className="shrink-0 text-[11px] text-red-400 hover:text-red-200"
          onClick={async () => {
            if (!window.confirm(`Remover "${item.label}" da biblioteca?`)) return
            await deleteSceneLibraryItem(tableId, item.id)
            // A cena em jogo continua onde está; só deixa de ter
            // para onde gravar por cima.
            if (aberto) persist({ ...scene, fromLibraryId: undefined })
          }}
        >
          remover
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {editor}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Biblioteca ({library.length})</SectionTitle>
        <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => setHistoria('nova')} data-nova-historia>
          + nova história
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        {(
          [
            ['tudo', 'Tudo'],
            ['map', 'Cenas'],
            ['story', 'Histórias'],
            ['token', 'Peças'],
          ] as [Filtro, string][]
        ).map(([k, r]) => (
          <TabChip key={k} active={filtro === k} className="px-2 py-0.5 text-[11px]" onClick={() => setFiltro(k)}>
            {r} ({contar(k)})
          </TabChip>
        ))}
        <span className="text-[11px] text-orange-400/50">
          {pastas.length} pasta(s) · para subpasta, use "+ nova pasta" e escreva Cena 01 &gt; Konoha
        </span>
      </div>

      {library.length === 0 ? (
        <p className="text-xs text-orange-300/50">
          A biblioteca está vazia. Monte um encontro e guarde pela aba "Mapa" — volta inteiro depois — ou prepare uma
          história em slides em "+ nova história".
        </p>
      ) : (
        <ArvoreDePastas
          itens={visiveis}
          pastas={pastas}
          pastaDe={(i) => i.folder}
          rotulo={(i) => i.label}
          chave={(i) => i.id}
          renderItem={renderItem}
          lembrarAbertasEm={`mesa-ninja:pastas-biblioteca:${tableId}`}
          onMoverPasta={(de, para) => moverPasta(tableId, 'sceneLibrary', library, de, para)}
        />
      )}
    </div>
  )
}
