import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle } from './ui'
import { approveRollRequest, denyRollRequest } from '../lib/rollFlow'
import { listenPendingRollRequests } from '../lib/store'
import { ROLL_REQUEST_KIND_LABELS } from '../types'
import type { GameTable, RollRequest } from '../types'

export function RollRequestsPanel({ table }: { table: GameTable }) {
  const [requests, setRequests] = useState<RollRequest[]>([])
  const [denying, setDenying] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => listenPendingRollRequests(table.id, setRequests), [table.id])

  async function approve(req: RollRequest) {
    setBusy(true)
    try {
      await approveRollRequest(table, req, table.gmName)
    } finally {
      setBusy(false)
    }
  }

  async function deny(req: RollRequest) {
    setBusy(true)
    try {
      await denyRollRequest(table, req, table.gmName, reason.trim())
      setDenying(null)
      setReason('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <SectionTitle>Rolagens aguardando liberação ({requests.length})</SectionTitle>
      {requests.length === 0 && (
        <p className="text-sm text-orange-300/50">
          Nenhuma rolagem pedida agora. {table.requireRollApproval ? '' : 'A exigência de liberação está desligada nas configurações.'}
        </p>
      )}

      {requests.map((req) => (
        <div key={req.id} className="well flex flex-col gap-2 rounded-lg p-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-orange-100">{req.characterName}</p>
            <Badge>{ROLL_REQUEST_KIND_LABELS[req.kind]}</Badge>
            <span className="text-orange-200">{req.description}</span>
          </div>
          <p className="text-xs text-orange-400/60">
            {req.kind === 'damage'
              ? `Dados: ${req.notation}${req.critical ? ` (crítico ×${req.proficiencyBonus})` : ''}`
              : `d20 ${(req.modifier ?? 0) >= 0 ? '+' : '−'} ${Math.abs(req.modifier ?? 0)}${
                  req.proficient ? ` + ${req.proficiencyBonus} (prof.)` : ''
                }`}{' '}
            · {new Date(req.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>

          {denying === req.id ? (
            <div className="flex flex-wrap items-center gap-2">
              <Input
                placeholder="Motivo (opcional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-56"
              />
              <Button variant="danger" disabled={busy} onClick={() => deny(req)}>
                Confirmar recusa
              </Button>
              <Button variant="ghost" onClick={() => setDenying(null)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="good" disabled={busy} onClick={() => approve(req)}>
                Liberar e rolar
              </Button>
              <Button variant="danger" disabled={busy} onClick={() => setDenying(req.id)}>
                Negar
              </Button>
            </div>
          )}
        </div>
      ))}
    </Card>
  )
}
