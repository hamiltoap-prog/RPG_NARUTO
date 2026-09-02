import { useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Textarea } from './ui'
import { createMission, deleteMission, updateMission } from '../lib/store'
import type { Mission } from '../types'

export function MissionBoard({ tableId, missions, asGM }: { tableId: string; missions: Mission[]; asGM: boolean }) {
  const [draft, setDraft] = useState({ title: '', description: '', reward: '' })
  const [creating, setCreating] = useState(false)

  async function addMission() {
    if (!draft.title.trim()) return
    setCreating(true)
    try {
      await createMission(tableId, {
        tableId,
        title: draft.title.trim(),
        description: draft.description.trim(),
        reward: draft.reward.trim(),
        status: 'open',
        createdAt: Date.now(),
      })
      setDraft({ title: '', description: '', reward: '' })
    } finally {
      setCreating(false)
    }
  }

  const open = missions.filter((m) => m.status === 'open')
  const completed = missions.filter((m) => m.status === 'completed')

  return (
    <div className="flex flex-col gap-3">
      {asGM && (
        <Card className="flex flex-col gap-2 p-4">
          <SectionTitle>Nova Missão</SectionTitle>
          <Input placeholder="Título" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
          <Textarea rows={2} placeholder="Descrição" value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />
          <Input placeholder="Recompensa (ex: 500 Ryo)" value={draft.reward} onChange={(e) => setDraft((d) => ({ ...d, reward: e.target.value }))} />
          <Button variant="primary" disabled={!draft.title.trim() || creating} onClick={addMission} className="self-start">
            Adicionar Missão
          </Button>
        </Card>
      )}

      <Card className="flex flex-col gap-2 p-4">
        <SectionTitle>Missões Abertas ({open.length})</SectionTitle>
        {open.length === 0 && <p className="text-sm text-orange-300/50">Nenhuma missão aberta.</p>}
        {open.map((m) => (
          <div key={m.id} className="rounded-lg border border-orange-900/30 bg-black/20 p-3 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-orange-100">{m.title}</p>
              {asGM && (
                <div className="flex gap-2">
                  <button className="text-xs text-emerald-400 hover:text-emerald-200" onClick={() => updateMission(tableId, m.id, { status: 'completed' })}>
                    concluir
                  </button>
                  <button className="text-xs text-red-400 hover:text-red-200" onClick={() => deleteMission(tableId, m.id)}>
                    remover
                  </button>
                </div>
              )}
            </div>
            {m.description && <p className="mt-1 text-xs text-orange-300/60">{m.description}</p>}
            {m.reward && (
              <p className="mt-1 text-xs text-emerald-400/80">
                <Badge tone="good">recompensa</Badge> {m.reward}
              </p>
            )}
          </div>
        ))}
      </Card>

      {completed.length > 0 && (
        <Card className="flex flex-col gap-2 p-4">
          <SectionTitle>Concluídas ({completed.length})</SectionTitle>
          {completed.map((m) => (
            <div key={m.id} className="flex items-center justify-between rounded-lg border border-orange-900/20 bg-black/10 p-2 text-sm">
              <span className="text-orange-300/50 line-through">{m.title}</span>
              {asGM && (
                <button className="text-xs text-red-400 hover:text-red-200" onClick={() => deleteMission(tableId, m.id)}>
                  remover
                </button>
              )}
            </div>
          ))}
        </Card>
      )}
    </div>
  )
}
