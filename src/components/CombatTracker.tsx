import { useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select } from './ui'
import { CONDITIONS } from '../data/conditions'
import { rollInitiative } from '../lib/characterMath'
import {
  addLogEntry,
  advanceCombatTurn,
  endCombat,
  setCombatOrder,
  startCombat,
  updateCharacterDirect,
  updateNPC,
} from '../lib/store'
import type { ActiveCondition, Character, CombatParticipant, GameTable, NPC } from '../types'

/**
 * Rastreador de combate.
 *
 * O app não resolve ataques: quem decide o que acerta é a mesa. O que ele faz
 * é guardar o que dá trabalho lembrar — de quem é a vez, em que rodada está,
 * quanto cada um aguenta e quais condições ainda pegam em quem, com prazo.
 *
 * A rodada fecha quando a volta chega no primeiro da lista. É nessa hora que
 * as condições com prazo perdem uma rodada e as que zeram caem sozinhas (ver
 * store.advanceCombatTurn) — o mestre não precisa varrer a lista toda turno.
 */
export function CombatTracker({ table, characters, npcs }: { table: GameTable; characters: Character[]; npcs: NPC[] }) {
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const [initiatives, setInitiatives] = useState<Record<string, number>>({})
  const [surprised, setSurprised] = useState<Record<string, boolean>>({})
  const [bosses, setBosses] = useState<Record<string, boolean>>({})
  const [starting, setStarting] = useState(false)
  const [dano, setDano] = useState<Record<string, number>>({})
  const [condRef, setCondRef] = useState<string | null>(null)

  const participants = [
    ...characters.map((c) => ({ ref: `character:${c.id}`, name: c.name, entity: c as Character | NPC })),
    ...npcs.map((n) => ({ ref: `npc:${n.id}`, name: n.name, entity: n as Character | NPC })),
  ]

  function entidadeDe(ref: string) {
    const [kind, id] = ref.split(':')
    if (kind === 'character') return characters.find((c) => c.id === id)
    return npcs.find((n) => n.id === id)
  }

  /** O nome da ordem de combate foi gravado quando o combate começou; se a
   * ficha tiver sido renomeada depois, vale o nome de agora. */
  function nomeDe(p: { ref: string; name: string }) {
    return entidadeDe(p.ref)?.name ?? p.name
  }

  function rollFor(ref: string, entity: Character | NPC) {
    const value = 'classId' in entity ? rollInitiative(entity) : 1 + Math.floor(Math.random() * 20)
    setInitiatives((prev) => ({ ...prev, [ref]: value }))
    setSelected((prev) => ({ ...prev, [ref]: true }))
  }

  async function handleStart() {
    const escolhidos = participants.filter((p) => selected[p.ref])
    const order: CombatParticipant[] = escolhidos
      .map((p) => ({
        ref: p.ref,
        name: p.name,
        initiative: initiatives[p.ref] ?? 0,
        surprised: Boolean(surprised[p.ref]),
        boss: Boolean(bosses[p.ref]),
        conditions: [] as ActiveCondition[],
      }))
      // Maior iniciativa primeiro; surpreso vai para o fim da lista, como
      // manda o manual, seja qual for o valor que ele tirou.
      .sort((a, b) => Number(a.surprised) - Number(b.surprised) || b.initiative - a.initiative)
    if (order.length === 0) return
    setStarting(true)
    try {
      await startCombat(table.id, order)
      await addLogEntry(table.id, {
        actorName: table.gmName,
        actorType: 'gm',
        kind: 'combat',
        summary: `Combate iniciado — ordem: ${order.map((o) => `${o.name} (${o.initiative}${o.surprised ? ', surpreso' : ''})`).join(', ')}`,
      })
    } finally {
      setStarting(false)
    }
  }

  async function handleNext() {
    const atual = table.combatOrder[table.combatTurnIndex]
    const proximo = table.combatOrder[(table.combatTurnIndex + 1) % table.combatOrder.length]
    const fechaRodada = (table.combatTurnIndex + 1) % table.combatOrder.length === 0
    await advanceCombatTurn(table.id, table)
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      kind: 'combat',
      summary: fechaRodada
        ? `Fim da rodada ${table.combatRound ?? 1}. Começa a rodada ${(table.combatRound ?? 1) + 1} — vez de ${proximo?.name ?? '?'}.`
        : `Turno de ${atual?.name ?? '?'} encerrado. Agora é a vez de ${proximo?.name ?? '?'}.`,
    })
  }

  async function handleEnd() {
    await endCombat(table.id)
    await addLogEntry(table.id, { actorName: table.gmName, actorType: 'gm', kind: 'combat', summary: 'Combate encerrado.' })
  }

  /** Dano e cura direto da lista: em combate ninguém quer abrir ficha. */
  async function aplicar(ref: string, delta: number) {
    const alvo = entidadeDe(ref)
    if (!alvo || delta === 0) return
    const atual = alvo.hp.current
    const novo = Math.max(0, Math.min(alvo.hp.max, atual + delta))
    const [kind, id] = ref.split(':')
    if (kind === 'character') {
      await updateCharacterDirect(table.id, id, { hp: { ...alvo.hp, current: novo }, ...(novo === 0 ? { isAlive: false } : {}) })
    } else {
      await updateNPC(table.id, id, { hp: { ...alvo.hp, current: novo } })
    }
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      kind: 'combat',
      summary:
        delta < 0
          ? `${alvo.name} sofreu ${-delta} de dano (PV ${novo}/${alvo.hp.max})${novo === 0 ? ' — caiu!' : ''}`
          : `${alvo.name} recuperou ${delta} PV (PV ${novo}/${alvo.hp.max})`,
    })
    setDano((p) => ({ ...p, [ref]: 0 }))
  }

  async function mexerCondicao(ref: string, proximas: ActiveCondition[], aviso: string) {
    await setCombatOrder(
      table.id,
      table.combatOrder.map((p) => (p.ref === ref ? { ...p, conditions: proximas } : p)),
    )
    await addLogEntry(table.id, { actorName: table.gmName, actorType: 'gm', kind: 'combat', summary: aviso })
  }

  if (table.combatActive) {
    const rodada = table.combatRound ?? 1
    return (
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SectionTitle>Combate</SectionTitle>
            <Badge tone="warn">rodada {rodada}</Badge>
            <span className="text-xs text-orange-400/60">
              turno {table.combatTurnIndex + 1} de {table.combatOrder.length} · ~{rodada * table.combatOrder.length * 6}s de
              luta
            </span>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" onClick={handleNext}>
              Próximo turno →
            </Button>
            <Button variant="danger" onClick={handleEnd}>
              Encerrar
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {table.combatOrder.map((p, i) => {
            const atual = i === table.combatTurnIndex
            const alvo = entidadeDe(p.ref)
            const pct = alvo && alvo.hp.max > 0 ? Math.max(0, (alvo.hp.current / alvo.hp.max) * 100) : 0
            const caido = alvo?.hp.current === 0
            return (
              <div
                key={p.ref}
                className={`rounded-sm border p-2 text-sm transition ${
                  atual
                    ? 'border-[color:var(--orange)] bg-[color:var(--orange)]/10'
                    : p.boss
                      ? 'border-red-800/60 bg-black/20'
                      : 'border-[color:var(--line)] bg-black/20'
                } ${caido ? 'opacity-50' : ''}`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-xs text-orange-400/60">{p.initiative}</span>
                  <span className={atual ? 'font-semibold text-white' : 'text-orange-100'}>{nomeDe(p)}</span>
                  {p.boss && <Badge tone="bad">chefe</Badge>}
                  {p.surprised && <Badge tone="warn">surpreso</Badge>}
                  {atual && <Badge tone="good">é a vez</Badge>}
                  {caido && <Badge tone="bad">caído</Badge>}

                  {alvo && (
                    <span className="ml-auto flex items-center gap-2">
                      <span className="text-xs text-orange-300/60">
                        PV {alvo.hp.current}/{alvo.hp.max} · CA {alvo.armorClass}
                      </span>
                      <span className="h-1.5 w-20 overflow-hidden rounded-full bg-black/60">
                        <span
                          className={`block h-full ${pct > 50 ? 'bg-emerald-500' : pct > 20 ? 'bg-amber-500' : 'bg-red-600'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                    </span>
                  )}
                </div>

                {/* Dano e cura sem sair da lista. */}
                {alvo && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    <Input
                      type="number"
                      min={0}
                      value={dano[p.ref] ?? ''}
                      placeholder="0"
                      onChange={(e) => setDano((prev) => ({ ...prev, [p.ref]: Number(e.target.value) || 0 }))}
                      className="w-16 px-2 py-0.5 text-xs"
                    />
                    <Button
                      variant="danger"
                      className="px-2 py-0.5 text-[11px]"
                      disabled={!dano[p.ref]}
                      onClick={() => aplicar(p.ref, -(dano[p.ref] ?? 0))}
                    >
                      − dano
                    </Button>
                    <Button
                      variant="good"
                      className="px-2 py-0.5 text-[11px]"
                      disabled={!dano[p.ref]}
                      onClick={() => aplicar(p.ref, dano[p.ref] ?? 0)}
                    >
                      + cura
                    </Button>
                    <Button
                      variant="secondary"
                      className="px-2 py-0.5 text-[11px]"
                      onClick={() => setCondRef(condRef === p.ref ? null : p.ref)}
                    >
                      condição
                    </Button>
                    <button
                      className="text-[11px] text-orange-400/60 hover:text-[color:var(--orange)]"
                      onClick={() =>
                        setCombatOrder(
                          table.id,
                          table.combatOrder.map((x) => (x.ref === p.ref ? { ...x, boss: !x.boss } : x)),
                        )
                      }
                    >
                      {p.boss ? 'não é chefe' : 'marcar chefe'}
                    </button>
                  </div>
                )}

                {/* Condições pegando, com o prazo que falta. */}
                {(p.conditions ?? []).length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {(p.conditions ?? []).map((c) => (
                      <button
                        key={c.name}
                        title={CONDITIONS.find((x) => x.name === c.name)?.effect}
                        onClick={() =>
                          mexerCondicao(
                            p.ref,
                            (p.conditions ?? []).filter((x) => x.name !== c.name),
                            `${nomeDe(p)} não está mais ${c.name}.`,
                          )
                        }
                        className="rounded-sm border border-[color:var(--orange)] px-2 py-0.5 font-display text-[11px] uppercase tracking-[0.08em] text-[color:var(--orange)] hover:line-through"
                      >
                        {c.name}
                        {c.rounds !== undefined && <span className="ml-1 text-orange-300/60">{c.rounds}r</span>}
                      </button>
                    ))}
                  </div>
                )}

                {condRef === p.ref && (
                  <AdicionarCondicao
                    onAdd={(nome, rodadas) =>
                      mexerCondicao(
                        p.ref,
                        [...(p.conditions ?? []).filter((x) => x.name !== nome), { name: nome, ...(rodadas ? { rounds: rodadas } : {}) }],
                        `${nomeDe(p)} está ${nome}${rodadas ? ` por ${rodadas} rodada(s)` : ''}.`,
                      ).then(() => setCondRef(null))
                    }
                  />
                )}
              </div>
            )
          })}
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <SectionTitle>Iniciar combate</SectionTitle>
      <p className="text-xs leading-relaxed text-orange-300/60">
        Marque quem entra, role ou digite a iniciativa (1d20 + Destreza; Estrategista usa Inteligência e o Caçador soma
        a proficiência). Quem estiver <b className="text-orange-200">surpreso</b> vai para o fim da ordem e não age na
        primeira rodada, como manda o manual. O app não resolve ataques — ele guarda a vez, a rodada, os PV e as
        condições.
      </p>
      <div className="flex flex-col gap-1.5">
        {participants.map((p) => (
          <div key={p.ref} className="flex flex-wrap items-center gap-2 rounded-sm border border-[color:var(--line)] bg-black/20 p-2 text-sm">
            <input
              type="checkbox"
              checked={Boolean(selected[p.ref])}
              onChange={(e) => setSelected((prev) => ({ ...prev, [p.ref]: e.target.checked }))}
            />
            <span className="flex-1 text-orange-100">{p.name}</span>
            <label className="flex items-center gap-1 text-[11px] text-orange-400/60">
              <input
                type="checkbox"
                checked={Boolean(surprised[p.ref])}
                onChange={(e) => setSurprised((prev) => ({ ...prev, [p.ref]: e.target.checked }))}
              />
              surpreso
            </label>
            <label className="flex items-center gap-1 text-[11px] text-orange-400/60">
              <input
                type="checkbox"
                checked={Boolean(bosses[p.ref])}
                onChange={(e) => setBosses((prev) => ({ ...prev, [p.ref]: e.target.checked }))}
              />
              chefe
            </label>
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
      <div className="flex gap-2">
        <Button
          variant="secondary"
          onClick={() => {
            for (const p of participants) rollFor(p.ref, p.entity)
          }}
        >
          Rolar iniciativa de todos
        </Button>
        <Button variant="primary" disabled={starting || participants.every((p) => !selected[p.ref])} onClick={handleStart}>
          Iniciar combate
        </Button>
      </div>
    </Card>
  )
}

function AdicionarCondicao({ onAdd }: { onAdd: (nome: string, rodadas?: number) => void }) {
  const [nome, setNome] = useState(CONDITIONS[1]?.name ?? '')
  const [rodadas, setRodadas] = useState<string>('')

  return (
    <div className="mt-1.5 flex flex-wrap items-end gap-1.5 border-t border-[color:var(--line)] pt-1.5">
      <Select value={nome} onChange={(e) => setNome(e.target.value)} className="w-44 px-2 py-0.5 text-xs">
        {CONDITIONS.filter((c) => c.name !== 'Normal').map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </Select>
      <Input
        type="number"
        min={1}
        placeholder="rodadas"
        value={rodadas}
        onChange={(e) => setRodadas(e.target.value)}
        className="w-24 px-2 py-0.5 text-xs"
        title="Em branco = sem prazo, sai quando você tirar"
      />
      <Button variant="primary" className="px-2 py-0.5 text-[11px]" onClick={() => onAdd(nome, Number(rodadas) || undefined)}>
        aplicar
      </Button>
      <span className="text-[11px] text-orange-400/60">em branco = sem prazo</span>
    </div>
  )
}
