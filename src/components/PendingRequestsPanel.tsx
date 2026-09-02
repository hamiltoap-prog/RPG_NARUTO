import { useEffect, useState } from 'react'
import { Badge, Button, Card, SectionTitle } from './ui'
import { approveRequests, listenPendingRequests, rejectRequests } from '../lib/store'
import { REQUESTABLE_FIELD_LABELS } from '../types'
import type { SheetChangeRequest } from '../types'

function formatValue(v: unknown): string {
  if (v === null || v === undefined) return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}

export function PendingRequestsPanel({ tableId, gmName }: { tableId: string; gmName: string }) {
  const [requests, setRequests] = useState<SheetChangeRequest[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState(false)

  useEffect(() => listenPendingRequests(tableId, setRequests), [tableId])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function approveOne(req: SheetChangeRequest) {
    setBusy(true)
    try {
      await approveRequests(tableId, [req], gmName)
    } finally {
      setBusy(false)
    }
  }

  async function rejectOne(req: SheetChangeRequest) {
    setBusy(true)
    try {
      await rejectRequests(tableId, [req.id], gmName)
    } finally {
      setBusy(false)
    }
  }

  async function approveSelected() {
    const toApprove = requests.filter((r) => selected.has(r.id))
    if (toApprove.length === 0) return
    setBusy(true)
    try {
      await approveRequests(tableId, toApprove, gmName)
      setSelected(new Set())
    } finally {
      setBusy(false)
    }
  }

  async function rejectSelected() {
    const ids = [...selected]
    if (ids.length === 0) return
    setBusy(true)
    try {
      await rejectRequests(tableId, ids, gmName)
      setSelected(new Set())
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Pedidos Pendentes ({requests.length})</SectionTitle>
        {requests.length > 0 && (
          <div className="flex gap-2">
            <Button variant="good" disabled={busy || selected.size === 0} onClick={approveSelected}>
              Aprovar selecionados ({selected.size})
            </Button>
            <Button variant="danger" disabled={busy || selected.size === 0} onClick={rejectSelected}>
              Rejeitar selecionados
            </Button>
          </div>
        )}
      </div>

      {requests.length === 0 && <p className="text-sm text-orange-300/50">Nenhum pedido aguardando aprovação.</p>}

      {requests.map((req) => (
        <div key={req.id} className="rounded-lg border border-orange-900/30 bg-black/20 p-3 text-sm">
          <div className="flex items-start gap-2">
            <input type="checkbox" className="mt-1" checked={selected.has(req.id)} onChange={() => toggle(req.id)} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <p className="font-semibold text-orange-100">{req.characterName}</p>
                {req.fields.map((f) => (
                  <Badge key={f}>{REQUESTABLE_FIELD_LABELS[f]}</Badge>
                ))}
              </div>
              <p className="mt-1 text-orange-200">{req.summary}</p>
              <div className="mt-1.5 grid gap-1 text-xs text-orange-300/60 sm:grid-cols-2">
                {req.fields.map((f) => (
                  <p key={f}>
                    <span className="text-orange-400/60">{REQUESTABLE_FIELD_LABELS[f]}:</span> {formatValue(req.previous[f])} →{' '}
                    <span className="text-orange-100">{formatValue(req.patch[f])}</span>
                  </p>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-orange-400/40">{new Date(req.createdAt).toLocaleString('pt-BR')}</p>
            </div>
            <div className="flex flex-col gap-1">
              <Button variant="good" disabled={busy} onClick={() => approveOne(req)}>
                Aprovar
              </Button>
              <Button variant="danger" disabled={busy} onClick={() => rejectOne(req)}>
                Rejeitar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </Card>
  )
}
