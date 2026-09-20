import { useEffect, useRef, useState } from 'react'
import { listenLog } from '../lib/store'
import type { LogEntry } from '../types'
import { DieFace } from './DieFace'

interface ShownRoll {
  id: string
  dice: number[]
  sides: number
  label: string
  summary: string
  actorName: string
}

/**
 * Mostra a animação de dados para todo mundo na mesa sempre que uma rolagem
 * nova chega pelo Firestore. Rolagens que já estavam no registro antes de
 * abrir a tela são ignoradas — ninguém quer ver o passado rolando de novo.
 */
export function DiceOverlay({ tableId }: { tableId: string }) {
  const [current, setCurrent] = useState<ShownRoll | null>(null)
  const [rolling, setRolling] = useState(true)
  const [tick, setTick] = useState(0)
  const seen = useRef<Set<string>>(new Set())
  const mountedAt = useRef(Date.now())
  const queue = useRef<ShownRoll[]>([])

  useEffect(() => {
    function handleEntries(entries: LogEntry[]) {
      for (const e of [...entries].reverse()) {
        if (!e.dice || e.dice.length === 0) continue
        if (seen.current.has(e.id)) continue
        seen.current.add(e.id)
        if (e.ts < mountedAt.current - 3000) continue
        queue.current.push({
          id: e.id,
          dice: e.dice,
          sides: e.diceSides ?? 6,
          label: e.diceLabel || 'Rolagem',
          summary: e.summary,
          actorName: e.actorName,
        })
      }
      setCurrent((c) => c ?? queue.current.shift() ?? null)
    }

    return listenLog(tableId, handleEntries, 20)
  }, [tableId])

  // Enquanto "rola", troca as faces depressa para dar sensação de movimento.
  useEffect(() => {
    if (!rolling || !current) return
    const interval = setInterval(() => setTick((t) => t + 1), 80)
    return () => clearInterval(interval)
  }, [rolling, current])

  useEffect(() => {
    if (!current) return
    setRolling(true)
    const stopRolling = setTimeout(() => setRolling(false), 1100)
    const dismiss = setTimeout(() => setCurrent(queue.current.shift() ?? null), 4600)
    return () => {
      clearTimeout(stopRolling)
      clearTimeout(dismiss)
    }
  }, [current])

  if (!current) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="plaque animate-roll-in pointer-events-auto flex max-w-md flex-col items-center gap-2 rounded-2xl px-5 py-4 backdrop-blur">
        <p className="text-xs uppercase tracking-[0.18em] text-[color:var(--gold)]">
          {current.actorName} · {current.label}
        </p>
        <div className="flex max-w-[22rem] flex-wrap justify-center gap-2">
          {current.dice.map((d, i) => (
            <DieFace
              key={i}
              sides={current.sides}
              // Enquanto rola, as faces trocam dentro do intervalo do próprio
              // dado — um d20 não pode piscar valores de d6.
              value={rolling ? 1 + ((tick * 3 + i * 5 + d) % current.sides) : d}
              rolling={rolling}
              delay={i * 90}
              size={current.dice.length > 5 ? 42 : 56}
            />
          ))}
        </div>
        {!rolling && <p className="text-center text-sm text-orange-100">{current.summary}</p>}
        <button
          onClick={() => setCurrent(queue.current.shift() ?? null)}
          className="text-[10px] uppercase tracking-wide text-orange-400/60 transition hover:text-orange-200"
        >
          fechar
        </button>
      </div>
    </div>
  )
}
