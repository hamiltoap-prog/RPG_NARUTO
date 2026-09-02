import { useEffect, useState } from 'react'
import { Card, SectionTitle } from './ui'
import { listenLog } from '../lib/store'
import type { LogEntry } from '../types'

const kindColor: Record<LogEntry['kind'], string> = {
  action: 'text-orange-200',
  note: 'text-orange-300/70',
  system: 'text-emerald-300/80',
  request: 'text-amber-300/80',
}

export function LogFeed({ tableId, compact = false }: { tableId: string; compact?: boolean }) {
  const [entries, setEntries] = useState<LogEntry[]>([])

  useEffect(() => listenLog(tableId, setEntries), [tableId])

  return (
    <Card className={`flex flex-col gap-2 p-4 ${compact ? '' : 'max-h-[70vh]'}`}>
      <SectionTitle>Registro da Mesa</SectionTitle>
      <div className={`flex flex-col-reverse gap-1.5 overflow-y-auto ${compact ? 'max-h-56' : 'max-h-[60vh]'}`}>
        {entries.length === 0 && <p className="text-xs text-orange-300/40">Nada aconteceu ainda.</p>}
        {entries.map((e) => (
          <div key={e.id} className="animate-roll-in rounded-lg border border-orange-900/20 bg-black/20 px-2.5 py-1.5 text-xs">
            <span className="text-orange-400/60">{new Date(e.ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>{' '}
            <span className="font-semibold text-orange-100">{e.actorName}</span>{' '}
            <span className={kindColor[e.kind]}>{e.summary}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
