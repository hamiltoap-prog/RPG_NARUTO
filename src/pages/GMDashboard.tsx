import { useEffect, useState } from 'react'
import { CombatTracker } from '../components/CombatTracker'
import { LogFeed } from '../components/LogFeed'
import { MissionBoard } from '../components/MissionBoard'
import { NpcManager } from '../components/NpcManager'
import { PendingRequestsPanel } from '../components/PendingRequestsPanel'
import { Avatar, Badge, Button, Card, Input, SectionTitle } from '../components/ui'
import { deleteCharacter, listenCharacters, listenMissions, listenNPCs, listenPendingRequests, updateTable } from '../lib/store'
import { REQUESTABLE_FIELDS, REQUESTABLE_FIELD_LABELS } from '../types'
import type { Character, GameTable, Mission, NPC, RequestableField } from '../types'
import { PlayerView } from './PlayerView'

type Tab = 'personagens' | 'combate' | 'npcs' | 'missoes' | 'pedidos' | 'config'

export function GMDashboard({ table }: { table: GameTable }) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [tab, setTab] = useState<Tab>('personagens')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [nameDraft, setNameDraft] = useState(table.name)
  const [copied, setCopied] = useState(false)

  useEffect(() => listenCharacters(table.id, setCharacters), [table.id])
  useEffect(() => listenNPCs(table.id, setNpcs), [table.id])
  useEffect(() => listenMissions(table.id, setMissions), [table.id])
  useEffect(() => listenPendingRequests(table.id, (reqs) => setPendingCount(reqs.length)), [table.id])

  const selected = characters.find((c) => c.id === selectedId) ?? characters[0] ?? null

  function copyCode() {
    navigator.clipboard?.writeText(table.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  async function toggleAutoApprove(field: RequestableField) {
    const has = table.autoApproveFields.includes(field)
    const next = has ? table.autoApproveFields.filter((f) => f !== field) : [...table.autoApproveFields, field]
    await updateTable(table.id, { autoApproveFields: next })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 pb-16">
      <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h1 className="font-serif text-2xl text-orange-100">{table.name}</h1>
          <p className="text-sm text-orange-300/60">Mestre: {table.gmName}</p>
        </div>
        <button onClick={copyCode} className="rounded-lg border border-orange-700/50 bg-orange-950/40 px-3 py-1.5 text-sm text-orange-100">
          Código da mesa: <b className="tracking-widest">{table.code}</b> {copied ? '✓ copiado' : '⧉'}
        </button>
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            ['personagens', `Personagens (${characters.length})`],
            ['combate', 'Combate'],
            ['npcs', `NPCs (${npcs.length})`],
            ['missoes', `Missões (${missions.length})`],
            ['pedidos', `Pedidos Pendentes (${pendingCount})`],
            ['config', 'Configurações'],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1.5 text-sm ${tab === key ? 'bg-orange-700 text-white' : 'bg-[#241a0f] text-orange-300/70 hover:bg-[#312312]'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'personagens' && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {characters.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedId(c.id)}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm ${
                  selected?.id === c.id ? 'border-orange-500 bg-orange-900/30' : 'border-orange-900/30 bg-black/20 hover:border-orange-700'
                }`}
              >
                <Avatar url={c.imageUrl} name={c.name} size={28} />
                <div>
                  <p className="text-orange-100">{c.name}</p>
                  <p className="text-xs text-orange-300/50">
                    PV {c.hp.current}/{c.hp.max} · Chakra {c.chakra.current}/{c.chakra.max}
                    {!c.isAlive && (
                      <>
                        {' '}
                        <Badge tone="bad">caído</Badge>
                      </>
                    )}
                  </p>
                </div>
              </button>
            ))}
            {characters.length === 0 && <p className="text-sm text-orange-300/50">Nenhum jogador entrou ainda. Compartilhe o código da mesa!</p>}
          </div>
          {selected && (
            <div className="rounded-xl border border-orange-800/40">
              <div className="flex items-center justify-between px-4 pt-3">
                <p className="text-xs uppercase tracking-wide text-orange-400/60">
                  Controlando ficha como Mestre — todas as ações abaixo aplicam direto em {selected.name}, sem fila.
                </p>
                <button
                  className="text-xs text-red-400 hover:text-red-200"
                  onClick={() => {
                    if (confirm(`Remover ${selected.name} da mesa? Isso apaga o personagem.`)) {
                      deleteCharacter(table.id, selected.id)
                      setSelectedId(null)
                    }
                  }}
                >
                  remover personagem
                </button>
              </div>
              <PlayerView table={table} characterId={selected.id} asGM />
            </div>
          )}
        </div>
      )}

      {tab === 'combate' && <CombatTracker table={table} characters={characters} npcs={npcs} />}

      {tab === 'npcs' && <NpcManager tableId={table.id} npcs={npcs} />}

      {tab === 'missoes' && <MissionBoard tableId={table.id} missions={missions} asGM />}

      {tab === 'pedidos' && <PendingRequestsPanel tableId={table.id} gmName={table.gmName} />}

      {tab === 'config' && (
        <div className="flex flex-col gap-3">
          <Card className="flex flex-col gap-3 p-4">
            <SectionTitle>Configurações da Mesa</SectionTitle>
            <div className="flex items-center gap-2">
              <Input value={nameDraft} onChange={(e) => setNameDraft(e.target.value)} className="w-64" />
              <Button onClick={() => updateTable(table.id, { name: nameDraft })}>Salvar Nome</Button>
            </div>
            <p className="text-sm text-orange-300/60">
              Compartilhe o código <b className="tracking-widest text-orange-200">{table.code}</b> com seu grupo para que entrem na mesa.
            </p>
          </Card>

          <Card className="flex flex-col gap-2 p-4">
            <SectionTitle>Auto-aprovação</SectionTitle>
            <p className="text-sm text-orange-300/60">
              Marque os campos que os jogadores podem alterar direto na ficha, sem esperar sua aprovação. Tudo que não estiver
              marcado aqui vira um pedido pendente na aba "Pedidos Pendentes".
            </p>
            <div className="mt-1 grid gap-1.5 sm:grid-cols-2">
              {REQUESTABLE_FIELDS.map((field) => (
                <label key={field} className="flex items-center gap-2 rounded-lg border border-orange-900/30 bg-black/20 px-3 py-1.5 text-sm text-orange-100">
                  <input type="checkbox" checked={table.autoApproveFields.includes(field)} onChange={() => toggleAutoApprove(field)} />
                  {REQUESTABLE_FIELD_LABELS[field]}
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}

      <LogFeed tableId={table.id} compact />
    </div>
  )
}
