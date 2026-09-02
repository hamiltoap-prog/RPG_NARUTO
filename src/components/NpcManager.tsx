import { useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Textarea } from './ui'
import { createNPC, deleteNPC, updateNPC } from '../lib/store'
import type { NPC } from '../types'

const emptyDraft = { name: '', armorClass: '10', hp: '10', resistancePoints: '13', attacksText: '', notes: '' }

export function NpcManager({ tableId, npcs }: { tableId: string; npcs: NPC[] }) {
  const [draft, setDraft] = useState(emptyDraft)
  const [creating, setCreating] = useState(false)

  async function addNpc() {
    if (!draft.name.trim()) return
    setCreating(true)
    try {
      const hp = Math.max(1, Number(draft.hp) || 1)
      await createNPC(tableId, {
        tableId,
        name: draft.name.trim(),
        armorClass: Number(draft.armorClass) || 10,
        hp: { current: hp, max: hp },
        resistancePoints: Number(draft.resistancePoints) || 13,
        attacksText: draft.attacksText.trim(),
        notes: draft.notes.trim(),
        visible: true,
        createdAt: Date.now(),
      })
      setDraft(emptyDraft)
    } finally {
      setCreating(false)
    }
  }

  async function applyHp(npc: NPC, delta: number) {
    const newCurrent = Math.max(0, Math.min(npc.hp.max, npc.hp.current + delta))
    await updateNPC(tableId, npc.id, { hp: { current: newCurrent, max: npc.hp.max } })
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-2 p-4">
        <SectionTitle>Novo NPC / Adversário</SectionTitle>
        <div className="grid gap-2 sm:grid-cols-4">
          <Input placeholder="Nome" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          <Input
            placeholder="CA"
            type="number"
            value={draft.armorClass}
            onChange={(e) => setDraft((d) => ({ ...d, armorClass: e.target.value }))}
          />
          <Input placeholder="PV" type="number" value={draft.hp} onChange={(e) => setDraft((d) => ({ ...d, hp: e.target.value }))} />
          <Input
            placeholder="PR"
            type="number"
            value={draft.resistancePoints}
            onChange={(e) => setDraft((d) => ({ ...d, resistancePoints: e.target.value }))}
          />
        </div>
        <Textarea
          rows={2}
          placeholder="Ataques (ex: Mordida +5, 1d6+2 perfurante)"
          value={draft.attacksText}
          onChange={(e) => setDraft((d) => ({ ...d, attacksText: e.target.value }))}
        />
        <Textarea rows={2} placeholder="Notas" value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
        <Button variant="primary" disabled={!draft.name.trim() || creating} onClick={addNpc} className="self-start">
          Adicionar NPC
        </Button>
      </Card>

      {npcs.length === 0 && <p className="text-sm text-orange-300/50">Nenhum NPC criado ainda.</p>}

      <div className="grid gap-2 sm:grid-cols-2">
        {npcs.map((npc) => (
          <Card key={npc.id} className="flex flex-col gap-1.5 p-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-orange-100">{npc.name}</p>
              <div className="flex items-center gap-1.5">
                <Badge>{npc.visible ? 'visível' : 'oculto'}</Badge>
                <button className="text-xs text-red-400 hover:text-red-200" onClick={() => deleteNPC(tableId, npc.id)}>
                  remover
                </button>
              </div>
            </div>
            <p className="text-xs text-orange-300/60">
              CA {npc.armorClass} · PR {npc.resistancePoints}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-orange-200">
                PV {npc.hp.current}/{npc.hp.max}
              </span>
              <Button variant="danger" onClick={() => applyHp(npc, -5)}>
                −5
              </Button>
              <Button variant="danger" onClick={() => applyHp(npc, -1)}>
                −1
              </Button>
              <Button variant="good" onClick={() => applyHp(npc, 1)}>
                +1
              </Button>
              <Button variant="good" onClick={() => applyHp(npc, 5)}>
                +5
              </Button>
            </div>
            {npc.attacksText && <p className="text-xs text-orange-300/70">{npc.attacksText}</p>}
            {npc.notes && <p className="text-xs text-orange-400/50">{npc.notes}</p>}
            <button
              className="self-start text-xs text-orange-400 hover:text-orange-200"
              onClick={() => updateNPC(tableId, npc.id, { visible: !npc.visible })}
            >
              {npc.visible ? 'ocultar dos jogadores' : 'mostrar aos jogadores'}
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
