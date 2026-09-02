import { useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle } from './ui'
import { rollInitiative } from '../lib/characterMath'
import { addLogEntry, advanceCombatTurn, endCombat, startCombat } from '../lib/store'
import type { Character, CombatParticipant, GameTable, NPC } from '../types'

export function CombatTracker({ table, characters, npcs }: { table: GameTable; characters: Character[]; npcs: NPC[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [initiatives, setInitiatives] = useState<Record<string, number>>({})
  const [starting, setStarting] = useState(false)

  const participants = [
    ...characters.map((c) => ({ ref: `character:${c.id}`, name: c.name, entity: c as Character | NPC })),
    ...npcs.map((n) => ({ ref: `npc:${n.id}`, name: n.name, entity: n as Character | NPC })),
  ]

  function rollFor(ref: string, entity: Character | NPC) {
    const value = 'classId' in entity ? rollInitiative(entity) : 1 + Math.floor(Math.random() * 20)
    setInitiatives((prev) => ({ ...prev, [ref]: value }))
    setSelected((prev) => ({ ...prev, [ref]: true }))
  }

  async function handleStart() {
    const order: CombatParticipant[] = participants
      .filter((p) => selected[p.ref])
      .map((p) => ({ ref: p.ref, name: p.name, initiative: initiatives[p.ref] ?? 0 }))
      .sort((a, b) => b.initiative - a.initiative)
    if (order.length === 0) return
    setStarting(true)
    try {
      await startCombat(table.id, order)
      await addLogEntry(table.id, {
        actorName: table.gmName,
        actorType: 'gm',
        kind: 'combat',
        summary: `Combate iniciado — ordem: ${order.map((o) => `${o.name} (${o.initiative})`).join(', ')}`,
      })
    } finally {
      setStarting(false)
    }
  }

  async function handleNext() {
    const current = table.combatOrder[table.combatTurnIndex]
    await advanceCombatTurn(table.id, table.combatTurnIndex, table.combatOrder.length)
    const next = table.combatOrder[(table.combatTurnIndex + 1) % table.combatOrder.length]
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      kind: 'combat',
      summary: `Turno de ${current?.name ?? '?'} encerrado. Agora é a vez de ${next?.name ?? '?'}.`,
    })
  }

  async function handleEnd() {
    await endCombat(table.id)
    await addLogEntry(table.id, { actorName: table.gmName, actorType: 'gm', kind: 'combat', summary: 'Combate encerrado.' })
  }

  if (table.combatActive) {
    return (
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-between">
          <SectionTitle>Combate em Andamento</SectionTitle>
          <Button variant="danger" onClick={handleEnd}>
            Encerrar Combate
          </Button>
        </div>
        <div className="flex flex-col gap-1.5">
          {table.combatOrder.map((p, i) => {
            const isCurrent = i === table.combatTurnIndex
            const [kind, id] = p.ref.split(':')
            const char = kind === 'character' ? characters.find((c) => c.id === id) : undefined
            const npc = kind === 'npc' ? npcs.find((n) => n.id === id) : undefined
            return (
              <div
                key={p.ref}
                className={`flex items-center justify-between rounded-lg border p-2 text-sm ${
                  isCurrent ? 'border-orange-500 bg-orange-900/30' : 'border-orange-900/30 bg-black/20'
                }`}
              >
                <span className="flex items-center gap-2">
                  {isCurrent && <Badge tone="good">turno atual</Badge>}
                  <span className="text-orange-100">{p.name}</span>
                  <span className="text-xs text-orange-400/60">iniciativa {p.initiative}</span>
                </span>
                {char && (
                  <span className="text-xs text-orange-300/60">
                    PV {char.hp.current}/{char.hp.max} · CA {char.armorClass}
                  </span>
                )}
                {npc && (
                  <span className="text-xs text-orange-300/60">
                    PV {npc.hp.current}/{npc.hp.max} · CA {npc.armorClass}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <Button variant="primary" onClick={handleNext} className="self-start">
          Próximo Turno
        </Button>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <SectionTitle>Iniciar Combate</SectionTitle>
      <p className="text-xs text-orange-300/60">
        Marque os participantes, role ou digite a iniciativa de cada um, e inicie o combate. A ordem é decidida por
        você (o app não resolve ataques/dano automaticamente).
      </p>
      <div className="flex flex-col gap-1.5">
        {participants.map((p) => (
          <div key={p.ref} className="flex items-center gap-2 rounded-lg border border-orange-900/30 bg-black/20 p-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(selected[p.ref])}
              onChange={(e) => setSelected((prev) => ({ ...prev, [p.ref]: e.target.checked }))}
            />
            <span className="flex-1 text-orange-100">{p.name}</span>
            <Input
              type="number"
              className="w-20"
              value={initiatives[p.ref] ?? ''}
              onChange={(e) => setInitiatives((prev) => ({ ...prev, [p.ref]: Number(e.target.value) }))}
            />
            <Button variant="secondary" onClick={() => rollFor(p.ref, p.entity)}>
              rolar
            </Button>
          </div>
        ))}
        {participants.length === 0 && <p className="text-sm text-orange-300/50">Nenhum personagem ou NPC na mesa ainda.</p>}
      </div>
      <Button variant="primary" disabled={starting || participants.every((p) => !selected[p.ref])} onClick={handleStart} className="self-start">
        Iniciar Combate
      </Button>
    </Card>
  )
}
