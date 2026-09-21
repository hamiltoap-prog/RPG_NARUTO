import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, TabChip, Textarea } from './ui'
import { SUMMON_BESTIARY } from '../data/summons'
import { newId } from '../lib/id'
import { createNPC, deleteBestiaryEntry, listenBestiary, saveBestiaryEntry } from '../lib/store'
import { CREATURE_KIND_LABELS, SUMMON_RANKS } from '../types'
import type { BestiaryEntry, CreatureKind, GameTable, SummonCreature } from '../types'

type Aba = 'minhas' | 'manual'

/** Média de um dado, para sugerir PV sem obrigar o mestre a rolar. */
function mediaDoDado(notacao: string): number {
  const lados = Number(notacao.replace(/\D/g, '')) || 6
  return (lados + 1) / 2
}

/**
 * Bestiário.
 *
 * Duas camadas: as 17 tribos de invocação do manual, iguais em toda mesa e
 * só de leitura, e as criaturas que o mestre inventa, que ficam na mesa dele.
 * A ficha é a mesma para NPC, animal, monstro, chefe e invocação — muda o
 * rótulo e o quanto o mestre resolve preencher.
 *
 * Nada disso é visível ao grupo: a criatura só aparece para os jogadores
 * quando o mestre a põe na mesa, e aí ela vira um NPC como outro qualquer.
 */
export function BestiaryPanel({ table }: { table: GameTable }) {
  const [aba, setAba] = useState<Aba>('minhas')
  const [entries, setEntries] = useState<BestiaryEntry[]>([])
  const [editando, setEditando] = useState<BestiaryEntry | null>(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => listenBestiary(table.id, setEntries), [table.id])

  function nova(base?: Partial<BestiaryEntry>): BestiaryEntry {
    return {
      id: newId(),
      tableId: table.id,
      kind: 'monster',
      name: '',
      description: '',
      armorClass: 12,
      hp: { current: 10, max: 10 },
      resistancePoints: 12,
      attackModifier: 3,
      attacksText: '',
      skills: '',
      specialFeatures: '',
      notes: '',
      createdAt: Date.now(),
      ...base,
    }
  }

  /** Puxa uma tribo do manual para uma ficha editável, já com o rank escolhido. */
  function doManual(c: SummonCreature, rankIdx: number): BestiaryEntry {
    const r = SUMMON_RANKS[rankIdx]
    const pv = Math.round(r.dice * mediaDoDado(c.hitDie))
    return nova({
      kind: 'summon',
      sourceId: c.id,
      name: `${c.name} (Rank ${r.rank} · ${r.title})`,
      description: c.description,
      hp: { current: pv, max: pv },
      attackModifier: Number(c.attackModifier.replace(/[^\d-]/g, '')) || 3,
      attacksText: c.naturalWeapons,
      skills: [c.skills, `Resistências: ${c.saves}`].filter(Boolean).join('\n'),
      specialFeatures: c.specialFeatures,
      notes: `Tribo ${c.summonType} · ${r.dice} DV (${c.hitDie}) / ${r.dice} DC (${c.chakraDie}) · custo ${r.cost} de chakra.\nPV sugerido pela média dos dados — ajuste à vontade.`,
    })
  }

  /** Põe a criatura na mesa: vira NPC, e aí o grupo passa a vê-la. */
  async function porNaMesa(e: BestiaryEntry) {
    await createNPC(table.id, {
      tableId: table.id,
      name: e.name,
      armorClass: e.armorClass,
      hp: { ...e.hp },
      resistancePoints: e.resistancePoints,
      attacksText: [e.attacksText, e.specialFeatures].filter(Boolean).join('\n\n'),
      notes: e.notes,
      visible: false,
      createdAt: Date.now(),
    })
    setAviso(`${e.name} entrou na mesa como NPC (oculto — marque "visível" na aba NPCs).`)
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Bestiário</SectionTitle>
          <div className="flex gap-1.5">
            <TabChip active={aba === 'minhas'} className="px-2.5 py-1 text-xs" onClick={() => setAba('minhas')}>
              Minhas criaturas ({entries.length})
            </TabChip>
            <TabChip active={aba === 'manual'} className="px-2.5 py-1 text-xs" onClick={() => setAba('manual')}>
              Invocações do manual ({SUMMON_BESTIARY.length})
            </TabChip>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-orange-400/60">
          Só você vê esta aba. A criatura aparece para o grupo quando você a põe na mesa — ela vira um NPC, entra na
          lista de adversários e pode virar peça no mapa.
        </p>
        {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}
      </Card>

      {aba === 'minhas' && (
        <>
          <Button variant="primary" className="self-start" onClick={() => setEditando(nova())}>
            + Nova criatura
          </Button>
          {editando && (
            <FichaCriatura
              entry={editando}
              onCancel={() => setEditando(null)}
              onSave={async (e) => {
                await saveBestiaryEntry(table.id, e)
                setEditando(null)
              }}
            />
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {entries.map((e) => (
              <Card key={e.id} className="flex flex-col gap-2 p-3">
                <div className="flex items-start gap-2">
                  <Avatar url={e.imageUrl} name={e.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm uppercase tracking-[0.06em] text-white">{e.name}</p>
                    <p className="text-xs text-orange-400/60">
                      <Badge>{CREATURE_KIND_LABELS[e.kind]}</Badge>{' '}
                      <span className="ml-1">
                        CA {e.armorClass} · PV {e.hp.max} · PR {e.resistancePoints} · atq +{e.attackModifier}
                      </span>
                    </p>
                  </div>
                </div>
                {e.description && <p className="line-clamp-3 text-xs text-orange-300/60">{e.description}</p>}
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="good" className="px-2 py-0.5 text-[11px]" onClick={() => porNaMesa(e)}>
                    pôr na mesa
                  </Button>
                  <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => setEditando(e)}>
                    editar
                  </Button>
                  <button
                    className="text-[11px] text-red-400 hover:text-red-200"
                    onClick={() => deleteBestiaryEntry(table.id, e.id)}
                  >
                    remover
                  </button>
                </div>
              </Card>
            ))}
            {entries.length === 0 && !editando && (
              <p className="text-sm text-orange-300/50">
                Nenhuma criatura sua ainda. Crie uma do zero ou puxe uma tribo do manual na outra aba.
              </p>
            )}
          </div>
        </>
      )}

      {aba === 'manual' && (
        <ManualList
          onUse={(c, r) => {
            // A ficha é editada na aba das criaturas do mestre — sem esta
            // troca, o botão abriria um formulário invisível na outra aba.
            setEditando(doManual(c, r))
            setAba('minhas')
          }}
        />
      )}
    </div>
  )
}

function ManualList({ onUse }: { onUse: (c: SummonCreature, rankIdx: number) => void }) {
  const [busca, setBusca] = useState('')
  const [rankIdx, setRankIdx] = useState(0)
  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return t ? SUMMON_BESTIARY.filter((c) => c.name.toLowerCase().includes(t) || c.summonType.toLowerCase().includes(t)) : SUMMON_BESTIARY
  }, [busca])

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-wrap items-end gap-2 p-3">
        <Input placeholder="Buscar tribo..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-56" />
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          rank da invocação
          <Select value={rankIdx} onChange={(e) => setRankIdx(Number(e.target.value))} className="w-56">
            {SUMMON_RANKS.map((r, i) => (
              <option key={r.rank} value={i}>
                Rank {r.rank} · {r.title} · {r.dice} DV · {r.cost} chakra
              </option>
            ))}
          </Select>
        </label>
      </Card>
      <div className="grid gap-2 sm:grid-cols-2">
        {lista.map((c) => (
          <Card key={c.id} className="flex flex-col gap-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-sm uppercase tracking-[0.06em] text-white">{c.name}</p>
              <Badge>{c.summonType}</Badge>
            </div>
            <p className="text-xs text-orange-300/60">{c.description}</p>
            <p className="text-xs text-orange-400/60">
              DV {c.hitDie} · DC {c.chakraDie} · atq {c.attackModifier} · resist. {c.saves}
            </p>
            <details className="text-xs text-orange-300/60">
              <summary className="cursor-pointer text-orange-400/60">ficha completa</summary>
              <div className="mt-1 flex flex-col gap-1 whitespace-pre-line">
                {c.skills && <p><b className="text-orange-200">Perícias/sentidos:</b>{'\n'}{c.skills}</p>}
                {c.naturalWeapons && <p><b className="text-orange-200">Armas naturais:</b>{'\n'}{c.naturalWeapons}</p>}
                {c.specialFeatures && <p><b className="text-orange-200">Características:</b>{'\n'}{c.specialFeatures}</p>}
              </div>
            </details>
            <Button variant="secondary" className="self-start px-2 py-0.5 text-[11px]" onClick={() => onUse(c, rankIdx)}>
              criar ficha desta tribo
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function FichaCriatura({
  entry,
  onSave,
  onCancel,
}: {
  entry: BestiaryEntry
  onSave: (e: BestiaryEntry) => Promise<void>
  onCancel: () => void
}) {
  const [d, setD] = useState<BestiaryEntry>(entry)
  const set = <K extends keyof BestiaryEntry>(k: K, v: BestiaryEntry[K]) => setD((p) => ({ ...p, [k]: v }))

  return (
    <Card className="flex flex-col gap-3 p-4">
      <SectionTitle>{entry.name ? `Editando ${entry.name}` : 'Nova criatura'}</SectionTitle>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          nome
          <Input value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="Zabuza, Lobo de Konoha..." />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          tipo
          <Select value={d.kind} onChange={(e) => set('kind', e.target.value as CreatureKind)} className="w-36">
            {(Object.keys(CREATURE_KIND_LABELS) as CreatureKind[]).map((k) => (
              <option key={k} value={k}>
                {CREATURE_KIND_LABELS[k]}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          URL da arte
          <Input value={d.imageUrl ?? ''} onChange={(e) => set('imageUrl', e.target.value)} placeholder="https://..." />
        </label>
        {d.imageUrl && <Avatar url={d.imageUrl} name={d.name || '?'} size={44} />}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ['armorClass', 'CA'],
            ['resistancePoints', 'PR'],
            ['attackModifier', 'bônus de ataque'],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="flex flex-col gap-1 text-xs text-orange-400/60">
            {label}
            <Input type="number" value={d[k]} onChange={(e) => set(k, Number(e.target.value) || 0)} />
          </label>
        ))}
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          PV máximo
          <Input
            type="number"
            value={d.hp.max}
            onChange={(e) => {
              const max = Number(e.target.value) || 0
              set('hp', { current: max, max })
            }}
          />
        </label>
      </div>

      {(
        [
          ['description', 'Descrição'],
          ['attacksText', 'Ataques'],
          ['skills', 'Perícias e sentidos'],
          ['specialFeatures', 'Características especiais'],
          ['notes', 'Anotações (só suas)'],
        ] as const
      ).map(([k, label]) => (
        <label key={k} className="flex flex-col gap-1 text-xs text-orange-400/60">
          {label}
          <Textarea rows={k === 'description' || k === 'notes' ? 2 : 3} value={d[k]} onChange={(e) => set(k, e.target.value)} />
        </label>
      ))}

      <div className="flex gap-2">
        <Button variant="primary" disabled={!d.name.trim()} onClick={() => onSave(d)}>
          Guardar no bestiário
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </Card>
  )
}
