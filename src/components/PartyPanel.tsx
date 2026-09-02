import { CLANS } from '../data/clans'
import { CLASSES } from '../data/classes'
import { Avatar, Badge, Card, SectionTitle } from './ui'
import type { Character } from '../types'

export function PartyPanel({ characters, currentCharacterId }: { characters: Character[]; currentCharacterId?: string }) {
  const others = characters.filter((c) => c.id !== currentCharacterId)

  return (
    <Card className="flex flex-col gap-2 p-4">
      <SectionTitle>Grupo</SectionTitle>
      {others.length === 0 && <p className="text-xs text-orange-300/40">Nenhum outro jogador na mesa ainda.</p>}
      {others.map((c) => {
        const clan = CLANS.find((cl) => cl.id === c.clanId)
        const charClass = CLASSES.find((cl) => cl.id === c.classId)
        const hpPct = c.hp.max > 0 ? Math.max(0, (c.hp.current / c.hp.max) * 100) : 0
        return (
          <div key={c.id} className="flex items-center gap-2.5 rounded-lg border border-orange-900/30 bg-black/20 p-2">
            <Avatar url={c.imageUrl} name={c.name} size={38} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-semibold text-orange-100">{c.name}</p>
                {!c.isAlive && <Badge tone="bad">caído</Badge>}
                {c.condition !== 'Normal' && <Badge tone="warn">{c.condition}</Badge>}
              </div>
              <p className="truncate text-xs text-orange-300/50">
                {clan?.name} · {charClass?.name} · Nv. {c.level}
              </p>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
                <div
                  className={`h-full ${hpPct > 50 ? 'bg-emerald-600' : hpPct > 20 ? 'bg-amber-500' : 'bg-red-600'}`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </Card>
  )
}
