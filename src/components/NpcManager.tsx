import { useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, Textarea } from './ui'
import { JUTSU_CATALOG } from '../data/jutsus'
import { ELEMENTS } from '../lib/jutsuAccess'
import { newId } from '../lib/id'
import { createNPC, deleteNPC, updateNPC } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Character, Jutsu, NPC, NpcAttack } from '../types'

const emptyDraft = { name: '', armorClass: '12', hp: '10', resistancePoints: '13', attacksText: '', notes: '' }

/**
 * NPCs e criaturas da mesa.
 *
 * Duas fontes aparecem aqui, de propósito: a ficha rápida (CA, PV, golpes) e
 * as fichas completas que o mestre montou com o assistente. Elas vivem em
 * coleções diferentes por serem coisas diferentes, mas em jogo são tudo
 * "quem está do outro lado" — e procurar em dois lugares é o tipo de atrito
 * que atrapalha no meio da luta.
 */
export function NpcManager({
  tableId,
  npcs,
  npcCharacters = [],
  onOpenCharacter,
}: {
  tableId: string
  npcs: NPC[]
  npcCharacters?: Character[]
  onOpenCharacter?: (id: string) => void
}) {
  const [draft, setDraft] = useState(emptyDraft)
  const [creating, setCreating] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)

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
        <p className="text-xs text-orange-400/60">
          Ficha rápida. Para uma criatura com clã, classe e jutsus, use <b className="text-orange-200">+ NPC com ficha
          completa</b> na aba Personagens — ela aparece aqui embaixo também.
        </p>
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
          placeholder="Ataques em texto (o que não couber nos golpes prontos)"
          value={draft.attacksText}
          onChange={(e) => setDraft((d) => ({ ...d, attacksText: e.target.value }))}
        />
        <Textarea rows={2} placeholder="Notas" value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
        <Button variant="primary" disabled={!draft.name.trim() || creating} onClick={addNpc} className="self-start">
          Adicionar NPC
        </Button>
      </Card>

      {npcCharacters.length > 0 && (
        <Card className="flex flex-col gap-2 p-4">
          <SectionTitle>Com ficha completa ({npcCharacters.length})</SectionTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {npcCharacters.map((c) => (
              <div key={c.id} className="well flex items-center gap-2 rounded-sm p-2 text-sm">
                <Avatar url={c.imageUrl} name={c.name} size={34} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-orange-100">{c.name}</p>
                  <p className="text-xs text-orange-300/60">
                    Nível {c.level} · CA {c.armorClass} · PV {c.hp.current}/{c.hp.max} · Chakra {c.chakra.current}/
                    {c.chakra.max}
                  </p>
                </div>
                <Badge>{c.visible ? 'visível' : 'oculto'}</Badge>
                {onOpenCharacter && (
                  <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => onOpenCharacter(c.id)}>
                    abrir ficha
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {npcs.length === 0 && <p className="text-sm text-orange-300/50">Nenhum NPC de ficha rápida ainda.</p>}

      <div className="grid gap-2 sm:grid-cols-2">
        {npcs.map((npc) => (
          <Card key={npc.id} className="flex flex-col gap-1.5 p-3 text-sm">
            <div className="flex items-center justify-between gap-2">
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
              {npc.chakra && ` · Chakra ${npc.chakra.current}/${npc.chakra.max}`}
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-orange-200">
                PV {npc.hp.current}/{npc.hp.max}
              </span>
              <Button variant="danger" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, -5)}>
                −5
              </Button>
              <Button variant="danger" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, -1)}>
                −1
              </Button>
              <Button variant="good" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, 1)}>
                +1
              </Button>
              <Button variant="good" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, 5)}>
                +5
              </Button>
            </div>

            {(npc.attacks ?? []).length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(npc.attacks ?? []).map((a) => (
                  <span key={a.id} className="rounded-sm border border-[color:var(--line)] px-1.5 py-0.5 text-[11px] text-orange-200">
                    {a.name} {a.bonus >= 0 ? '+' : ''}
                    {a.bonus} · {a.damage}
                  </span>
                ))}
              </div>
            )}
            {(npc.jutsus ?? []).length > 0 && (
              <p className="text-[11px] text-orange-400/60">
                Jutsus: {(npc.jutsus ?? []).map((j) => j.name).join(', ')}
              </p>
            )}
            {npc.attacksText && <p className="text-xs text-orange-300/70">{npc.attacksText}</p>}
            {npc.notes && <p className="text-xs text-orange-400/50">{npc.notes}</p>}

            <div className="flex flex-wrap gap-2">
              <button
                className="text-xs text-orange-400 hover:text-orange-200"
                onClick={() => updateNPC(tableId, npc.id, { visible: !npc.visible })}
              >
                {npc.visible ? 'ocultar dos jogadores' : 'mostrar aos jogadores'}
              </button>
              <button
                className="text-xs text-orange-400 hover:text-orange-200"
                onClick={() => setEditando(editando === npc.id ? null : npc.id)}
              >
                {editando === npc.id ? 'fechar' : 'golpes e jutsus'}
              </button>
            </div>

            {editando === npc.id && <EditorDeGolpes tableId={tableId} npc={npc} />}
          </Card>
        ))}
      </div>
    </div>
  )
}

/**
 * Golpes prontos e jutsus da criatura.
 *
 * Sem isso o ataque de um bicho ficava só como texto: o mestre lia "Mordida
 * +5, 1d6" e ia fazer a conta na mão. Com nome, bônus e dano guardados, o
 * painel de rolagens resolve em um clique, igual ao jutsu de um personagem.
 */
function EditorDeGolpes({ tableId, npc }: { tableId: string; npc: NPC }) {
  const [nome, setNome] = useState('')
  const [bonus, setBonus] = useState(4)
  const [dano, setDano] = useState('1d6')
  const [tipo, setTipo] = useState('')
  const [jutsuNome, setJutsuNome] = useState('')
  const [busca, setBusca] = useState('')

  const ataques = npc.attacks ?? []
  const jutsus = npc.jutsus ?? []
  const achados = busca.trim()
    ? JUTSU_CATALOG.filter((j) => j.name.toLowerCase().includes(busca.trim().toLowerCase())).slice(0, 30)
    : []

  async function addAtaque() {
    if (!nome.trim()) return
    const novo: NpcAttack = { id: newId(), name: nome.trim(), bonus, damage: dano.trim() || '1d4', damageType: tipo.trim() || undefined }
    await updateNPC(tableId, npc.id, { attacks: [...ataques, novo] })
    setNome('')
  }

  async function addJutsu() {
    const cat = JUTSU_CATALOG.find((j) => j.name === jutsuNome)
    if (!cat || jutsus.some((j) => j.name === cat.name)) return
    const novo: Jutsu = {
      id: newId(),
      name: cat.name,
      chakraCost: cat.cost,
      details: `${cat.classification} · ${cat.rank} · ${cat.description}`,
    }
    await updateNPC(tableId, npc.id, { jutsus: [...jutsus, novo] })
    setJutsuNome('')
    setBusca('')
  }

  return (
    <div className="well flex flex-col gap-2 rounded-sm p-2.5">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Golpes prontos</p>
      {ataques.map((a) => (
        <div key={a.id} className="flex items-center gap-2 text-xs text-orange-200">
          <span className="flex-1">
            {a.name} {a.bonus >= 0 ? '+' : ''}
            {a.bonus} · {a.damage} {a.damageType}
          </span>
          <button
            className="text-red-400 hover:text-red-200"
            onClick={() => updateNPC(tableId, npc.id, { attacks: ataques.filter((x) => x.id !== a.id) })}
          >
            remover
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-1.5">
        <Input placeholder="Mordida" value={nome} onChange={(e) => setNome(e.target.value)} className="w-28 px-2 py-0.5 text-xs" />
        <Input
          type="number"
          value={bonus}
          onChange={(e) => setBonus(Number(e.target.value) || 0)}
          className="w-16 px-2 py-0.5 text-xs"
          title="bônus de ataque"
        />
        <Input placeholder="1d6+2" value={dano} onChange={(e) => setDano(e.target.value)} className="w-24 px-2 py-0.5 text-xs" />
        <Input placeholder="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-24 px-2 py-0.5 text-xs" />
        <Button variant="secondary" className="px-2 py-0.5 text-[11px]" disabled={!nome.trim()} onClick={addAtaque}>
          + golpe
        </Button>
      </div>

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
        Jutsus da criatura
        <span className="ml-1 normal-case tracking-normal text-orange-400/40">— invocações de Rank C ou mais conjuram</span>
      </p>
      {jutsus.map((j) => (
        <div key={j.id} className="flex items-center gap-2 text-xs text-orange-200">
          <span className="flex-1">
            {j.name} {j.chakraCost && <span className="text-orange-400/60">({j.chakraCost})</span>}
          </span>
          <button
            className="text-red-400 hover:text-red-200"
            onClick={() => updateNPC(tableId, npc.id, { jutsus: jutsus.filter((x) => x.id !== j.id) })}
          >
            remover
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-1.5">
        <Input placeholder="buscar jutsu..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-40 px-2 py-0.5 text-xs" />
        {achados.length > 0 && (
          <Select value={jutsuNome} onChange={(e) => setJutsuNome(e.target.value)} className="w-56 px-2 py-0.5 text-xs">
            <option value="">escolha...</option>
            {achados.map((j) => (
              <option key={j.name + j.rank} value={j.name}>
                {j.name} ({j.rank})
              </option>
            ))}
          </Select>
        )}
        <Button variant="secondary" className="px-2 py-0.5 text-[11px]" disabled={!jutsuNome} onClick={addJutsu}>
          + jutsu
        </Button>
      </div>

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Para conjurar e resistir</p>
      <div className="flex flex-wrap items-end gap-1.5">
        {(['intelligence', 'wisdom', 'dexterity', 'constitution'] as AttributeKey[]).map((k) => (
          <label key={k} className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
            {ATTRIBUTE_LABELS[k]}
            <Input
              type="number"
              value={npc.modifiers?.[k] ?? 0}
              onChange={(e) => {
                const zero = Object.fromEntries(ATTRIBUTE_KEYS.map((a) => [a, 0])) as Record<AttributeKey, number>
                updateNPC(tableId, npc.id, { modifiers: { ...zero, ...npc.modifiers, [k]: Number(e.target.value) || 0 } })
              }}
              className="w-16 px-2 py-0.5 text-xs"
            />
          </label>
        ))}
        <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
          Chakra máx.
          <Input
            type="number"
            value={npc.chakra?.max ?? 0}
            onChange={(e) => {
              const max = Math.max(0, Number(e.target.value) || 0)
              updateNPC(tableId, npc.id, { chakra: { current: max, max } })
            }}
            className="w-20 px-2 py-0.5 text-xs"
          />
        </label>
      </div>

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
        Afinidade elemental
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {ELEMENTS.map((el) => {
          const tem = (npc.elements ?? []).includes(el)
          return (
            <label key={el} className="flex items-center gap-1 text-[11px] text-orange-200">
              <input
                type="checkbox"
                checked={tem}
                onChange={() => {
                  const atuais = npc.elements ?? []
                  updateNPC(tableId, npc.id, {
                    elements: tem ? atuais.filter((x) => x !== el) : [...atuais, el],
                  })
                }}
              />
              {el}
            </label>
          )
        })}
        <span className="text-[10px] text-orange-400/50">
          usada na Vantagem Elemental (Fogo &gt; Vento &gt; Raio &gt; Terra &gt; Água &gt; Fogo)
        </span>
      </div>
    </div>
  )
}
