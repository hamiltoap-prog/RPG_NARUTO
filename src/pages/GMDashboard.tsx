import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CombatTracker } from '../components/CombatTracker'
import { LogFeed } from '../components/LogFeed'
import { MissionBoard } from '../components/MissionBoard'
import { NpcManager } from '../components/NpcManager'
import { PendingRequestsPanel } from '../components/PendingRequestsPanel'
import { CharacterCreate } from './CharacterCreate'
import { BestiaryPanel } from '../components/BestiaryPanel'
import { ClanManager } from '../components/ClanManager'
import { ItemForge } from '../components/ItemForge'
import { ChakraGiftPanel } from '../components/ChakraGiftPanel'
import { GMRoller } from '../components/GMRoller'
import { RollRequestsPanel } from '../components/RollRequestsPanel'
import { Avatar, Badge, Button, Card, Input, SectionTitle, TabChip } from '../components/ui'
import {
  deleteCharacter,
  listenCharacters,
  listenMissions,
  listenNPCs,
  listenPendingRequests,
  listenPendingChakraGifts,
  listenPendingRollRequests,
  rememberGMTable,
  updateTable,
} from '../lib/store'
import { REQUESTABLE_FIELDS, REQUESTABLE_FIELD_LABELS } from '../types'
import type { Character, GameTable, Mission, NPC, RequestableField } from '../types'
import { PlayerView } from './PlayerView'

type Tab = 'personagens' | 'combate' | 'npcs' | 'bestiario' | 'clas' | 'loja' | 'missoes' | 'rolagens' | 'pedidos' | 'config'

export function GMDashboard({ table }: { table: GameTable }) {
  const [characters, setCharacters] = useState<Character[]>([])
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [pendingRolls, setPendingRolls] = useState(0)
  const [pendingGifts, setPendingGifts] = useState(0)
  const [tab, setTab] = useState<Tab>('personagens')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [criandoNPC, setCriandoNPC] = useState(false)
  const [npcNome, setNpcNome] = useState('')
  const [nameDraft, setNameDraft] = useState(table.name)
  const [copied, setCopied] = useState(false)

  // Mesas criadas antes da conta existir (ou em outro navegador) não estão no
  // índice do mestre. Abrir a mesa como mestre repõe a entrada — assim a lista
  // "Suas mesas" se completa sozinha, sem migração manual.
  useEffect(() => {
    rememberGMTable(table.gmUid, table).catch(() => {
      /* índice é conveniência: falhar aqui não pode atrapalhar a mesa */
    })
  }, [table])

  useEffect(() => listenCharacters(table.id, setCharacters), [table.id])
  useEffect(() => listenNPCs(table.id, setNpcs), [table.id])
  useEffect(() => listenMissions(table.id, setMissions), [table.id])
  useEffect(() => listenPendingRequests(table.id, (reqs) => setPendingCount(reqs.length)), [table.id])
  useEffect(() => listenPendingRollRequests(table.id, (reqs) => setPendingRolls(reqs.length)), [table.id])
  useEffect(() => listenPendingChakraGifts(table.id, (gifts) => setPendingGifts(gifts.length)), [table.id])

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
        <div className="flex flex-wrap items-center gap-2">
          <Link to={`/t/${table.code}/mapa`}>
            <Button variant="secondary">🗺️ Tela de jogo</Button>
          </Link>
          <button onClick={copyCode} className="rounded-lg border border-orange-700/50 bg-orange-950/40 px-3 py-1.5 text-sm text-orange-100">
            Código da mesa: <b className="tracking-widest">{table.code}</b> {copied ? '✓ copiado' : '⧉'}
          </button>
        </div>
      </Card>

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            ['personagens', `Personagens (${characters.length})`],
            ['combate', 'Combate'],
            ['npcs', `NPCs (${npcs.length})`],
            ['bestiario', 'Bestiário'],
            ['clas', 'Clãs'],
            ['loja', 'Loja'],
            ['missoes', `Missões (${missions.length})`],
            ['rolagens', 'Rolagens'],
            ['pedidos', `Pedidos Pendentes (${pendingCount + pendingRolls + pendingGifts})`],
            ['config', 'Configurações'],
          ] as [Tab, string][]
        ).map(([key, label]) => (
          <TabChip key={key} active={tab === key} onClick={() => setTab(key)}>
            {label}
          </TabChip>
        ))}
      </div>

      {tab === 'personagens' && (
        <div className="flex flex-col gap-3">
          {/* Ficha completa de NPC: o mesmo assistente do jogador, sem as
              travas de nível e posto. */}
          {criandoNPC ? (
            <Card className="flex flex-col gap-2 p-3">
              <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
                  nome do NPC
                  <Input value={npcNome} onChange={(e) => setNpcNome(e.target.value)} placeholder="Zabuza Momochi" />
                </label>
                <Button variant="ghost" onClick={() => setCriandoNPC(false)}>
                  cancelar
                </Button>
              </div>
              {npcNome.trim() && (
                <CharacterCreate
                  key={npcNome.trim()}
                  table={table}
                  uid={table.gmUid}
                  characterName={npcNome.trim()}
                  asGM
                  asNPC
                  onCreated={(c) => {
                    setCriandoNPC(false)
                    setNpcNome('')
                    setSelectedId(c.id)
                  }}
                />
              )}
            </Card>
          ) : (
            <Button variant="primary" className="self-start" onClick={() => setCriandoNPC(true)}>
              + NPC com ficha completa
            </Button>
          )}

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
                  <p className="text-orange-100">
                    {c.name} {c.isNPC && <Badge>NPC</Badge>}
                  </p>
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
            <div className="rounded-sm border border-[color:var(--line)]">
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

      {tab === 'bestiario' && <BestiaryPanel table={table} />}

      {tab === 'clas' && <ClanManager table={table} />}

      {tab === 'loja' && <ItemForge table={table} />}

      {tab === 'rolagens' && <GMRoller table={table} gmName={table.gmName} npcs={npcs} />}

      {tab === 'pedidos' && (
        <div className="flex flex-col gap-3">
          <RollRequestsPanel table={table} />
          <ChakraGiftPanel table={table} characters={characters} />
          <PendingRequestsPanel tableId={table.id} gmName={table.gmName} />
        </div>
      )}

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
            <label className="mt-2 flex flex-wrap items-center gap-2 text-sm text-orange-100">
              Nível inicial dos personagens
              <Input
                type="number"
                min={1}
                max={20}
                value={table.startingLevel ?? 1}
                onChange={(e) => updateTable(table.id, { startingLevel: Math.min(20, Math.max(1, Number(e.target.value) || 1)) })}
                className="w-20"
              />
            </label>
            <p className="text-xs text-orange-400/60">
              O manual permite começar acima do 1º nível. Quem entra na mesa é criado neste nível, já com o XP mínimo
              correspondente e o posto shinobi da faixa.
            </p>
          </Card>

          <Card className="flex flex-col gap-2 p-4">
            <SectionTitle>Liberação de rolagens</SectionTitle>
            <label className="flex items-start gap-2 text-sm text-orange-100">
              <input
                type="checkbox"
                className="mt-1"
                checked={table.requireRollApproval}
                onChange={(e) => updateTable(table.id, { requireRollApproval: e.target.checked })}
              />
              <span>
                Toda rolagem de jogador (teste, ataque, dano) espera a sua liberação.
                <span className="block text-xs text-orange-300/60">
                  Desligado, os jogadores rolam na hora. Suas próprias rolagens nunca esperam.
                </span>
              </span>
            </label>
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
