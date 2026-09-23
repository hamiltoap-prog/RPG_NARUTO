import { useMemo, useState } from 'react'
import { Badge, Button, Input, SectionTitle, Select } from './ui'
import { deleteSceneLibraryItem, renameSceneLibraryFolder, updateSceneLibraryItem } from '../lib/store'
import { normalizeImageUrl } from '../lib/imageUrl'
import { SEM_PASTA, agruparPorPasta, pastasDa } from '../lib/sceneLibrary'
import type { Scene, SceneLibraryItem, SceneToken, SceneTokenKind } from '../types'

/**
 * A biblioteca da mesa: mapas, cenas inteiras e peças prontas.
 *
 * Duas coisas que uma mesa com muitas cenas precisa e que a lista corrida não
 * dava: **pasta**, para o mapa da vila não ficar embolado com o covil do
 * chefe, e **gravar por cima**, para mexer numa cena guardada sem acumular
 * cópias do mesmo mapa.
 *
 * Pasta aqui não é documento: é um nome repetido nos itens. Some sozinha
 * quando o último item sai, e renomear é reescrever o nome em todos — a mesa
 * ganha o que espera de pasta sem ter nada a administrar.
 */
export function SceneLibraryPanel({
  tableId,
  library,
  scene,
  persist,
  addToken,
}: {
  tableId: string
  library: SceneLibraryItem[]
  scene: Scene
  persist: (s: Scene) => void
  addToken: (t: Partial<SceneToken> & { label: string; kind: SceneTokenKind }) => void
}) {
  const [fechadas, setFechadas] = useState<Record<string, boolean>>({})
  const [renomeando, setRenomeando] = useState<string | null>(null)
  const [nomeNovo, setNomeNovo] = useState('')
  const [editando, setEditando] = useState<string | null>(null)
  const [rotuloNovo, setRotuloNovo] = useState('')

  const pastas = useMemo(() => pastasDa(library), [library])
  const porPasta = useMemo(() => agruparPorPasta(library), [library])

  /** Abre a cena guardada e lembra de onde ela veio, para poder gravar por cima. */
  function abrir(item: SceneLibraryItem) {
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

  if (library.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <SectionTitle>Biblioteca</SectionTitle>
        <p className="text-xs text-orange-300/50">
          A biblioteca está vazia. Monte um encontro e guarde pela aba "Mapa" — volta inteiro depois.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Biblioteca ({library.length})</SectionTitle>
        <span className="text-[11px] text-orange-400/50">
          {pastas.length} pasta(s) · a cena aberta pode ser gravada por cima na aba Mapa
        </span>
      </div>

      {pastas.map((pasta) => {
        const itens = porPasta.get(pasta) ?? []
        const aberta = !fechadas[pasta]
        return (
          <div key={pasta} className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--line)] pb-1">
              <button
                className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/70 hover:text-[color:var(--orange)]"
                onClick={() => setFechadas((f) => ({ ...f, [pasta]: aberta }))}
              >
                {aberta ? '▾' : '▸'} {pasta} ({itens.length})
              </button>
              {pasta !== SEM_PASTA &&
                (renomeando === pasta ? (
                  <span className="flex items-center gap-1">
                    <Input
                      value={nomeNovo}
                      className="w-36 px-2 py-0.5 text-[11px]"
                      placeholder="novo nome"
                      onChange={(e) => setNomeNovo(e.target.value)}
                    />
                    <Button
                      variant="primary"
                      className="px-2 py-0.5 text-[11px]"
                      onClick={async () => {
                        await renameSceneLibraryFolder(tableId, library, pasta, nomeNovo.trim() || undefined)
                        setRenomeando(null)
                      }}
                    >
                      ok
                    </Button>
                    <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => setRenomeando(null)}>
                      x
                    </Button>
                  </span>
                ) : (
                  <button
                    className="text-[11px] text-orange-400/50 hover:text-[color:var(--orange)]"
                    onClick={() => {
                      setRenomeando(pasta)
                      setNomeNovo(pasta)
                    }}
                  >
                    renomear pasta
                  </button>
                ))}
            </div>

            {aberta && (
              <div className="flex flex-wrap gap-2">
                {itens.map((item) => {
                  const aberto = scene.fromLibraryId === item.id
                  return (
                    <div
                      key={item.id}
                      className={`well flex min-w-0 flex-wrap items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                        aberto ? 'ring-1 ring-[color:var(--orange)]' : ''
                      }`}
                    >
                      {item.imageUrl && (
                        <img src={normalizeImageUrl(item.imageUrl)} alt="" className="h-8 w-12 shrink-0 rounded object-cover" />
                      )}

                      {editando === item.id ? (
                        <span className="flex items-center gap-1">
                          <Input
                            value={rotuloNovo}
                            className="w-40 px-2 py-0.5 text-[11px]"
                            onChange={(e) => setRotuloNovo(e.target.value)}
                          />
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

                      {aberto && <Badge tone="warn">aberta</Badge>}

                      {item.kind === 'map' ? (
                        <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => abrir(item)}>
                          {item.snapshot ? 'abrir cena' : 'usar mapa'}
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

                      {/* Mover de pasta sem sair da lista. */}
                      <Select
                        value={item.folder?.trim() || ''}
                        className="w-28 px-2 py-0.5 text-[11px]"
                        title="Mover para outra pasta"
                        onChange={(e) => {
                          const v = e.target.value
                          if (v === '__nova__') {
                            const nome = window.prompt('Nome da nova pasta')
                            if (nome?.trim()) void updateSceneLibraryItem(tableId, item.id, { folder: nome.trim() })
                            return
                          }
                          void updateSceneLibraryItem(tableId, item.id, { folder: v || undefined })
                        }}
                      >
                        <option value="">{SEM_PASTA}</option>
                        {pastas
                          .filter((p) => p !== SEM_PASTA)
                          .map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        <option value="__nova__">+ nova pasta...</option>
                      </Select>

                      <button
                        className="shrink-0 text-[11px] text-red-400 hover:text-red-200"
                        onClick={async () => {
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
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
