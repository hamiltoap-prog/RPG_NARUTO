import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, Textarea } from '../components/ui'
import { ActionRoller } from '../components/ActionRoller'
import { LogFeed } from '../components/LogFeed'
import { MissionBoard } from '../components/MissionBoard'
import { PartyPanel } from '../components/PartyPanel'
import { CLANS } from '../data/clans'
import { CLASSES } from '../data/classes'
import { CONDITIONS } from '../data/conditions'
import { ARMORS, GEAR, WEAPONS } from '../data/equipment'
import { JUTSU_CATALOG } from '../data/jutsus'
import { calculateDerivedStats } from '../lib/characterMath'
import { submitCharacterChange, updateNotes } from '../lib/changeRequest'
import { listenCharacter, listenCharacters, listenMissions, listenNPCs, listenRequestsForCharacter } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, REQUESTABLE_FIELD_LABELS } from '../types'
import type {
  Armor,
  ArmorCatalogEntry,
  Attributes,
  Character,
  CharacterDescription,
  GameTable,
  GearItem,
  InventoryItem,
  Jutsu,
  Mission,
  NPC,
  RequestableField,
  Weapon,
  WeaponCatalogEntry,
} from '../types'
import { newId } from '../lib/id'
import { getLevelFromXp, getXpForNextLevel } from '../data/xpTable'

export function PlayerView({
  table,
  characterId,
  asGM = false,
}: {
  table: GameTable
  characterId: string
  asGM?: boolean
}) {
  const [character, setCharacter] = useState<Character | null | undefined>(undefined)
  const [allCharacters, setAllCharacters] = useState<Character[]>([])
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [pendingFields, setPendingFields] = useState<Set<RequestableField>>(new Set())
  const [noteDraft, setNoteDraft] = useState('')

  useEffect(() => {
    setCharacter(undefined)
    return listenCharacter(table.id, characterId, (c) => {
      setCharacter(c)
      setNoteDraft((prev) => (c && document.activeElement?.id !== 'notes-field' ? c.notes : prev))
    })
  }, [table.id, characterId])

  useEffect(() => listenCharacters(table.id, setAllCharacters), [table.id])
  useEffect(() => listenNPCs(table.id, setNpcs), [table.id])
  useEffect(() => listenMissions(table.id, setMissions), [table.id])

  useEffect(() => {
    if (asGM) return
    return listenRequestsForCharacter(table.id, characterId, (reqs) => {
      const active = new Set<RequestableField>()
      for (const r of reqs) {
        if (r.status === 'pending') r.fields.forEach((f) => active.add(f))
      }
      setPendingFields(active)
    })
  }, [table.id, characterId, asGM])

  if (character === undefined) {
    return <p className="p-6 text-center text-orange-300/60">Carregando personagem...</p>
  }
  if (character === null) {
    return <p className="p-6 text-center text-red-300">Personagem não encontrado.</p>
  }

  const clan = CLANS.find((c) => c.id === character.clanId)
  const charClass = CLASSES.find((c) => c.id === character.classId)

  const actorName = asGM ? table.gmName : character.name
  const actorUid = asGM ? table.gmUid : character.ownerUid

  async function submit(patch: Record<string, unknown>, summary: string) {
    if (!character) return
    await submitCharacterChange({ table, character, actorUid, actorName, actorIsGM: asGM, patch, summary })
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4 p-4 pb-16 lg:grid lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="flex flex-col gap-4">
        <HeaderCard character={character} clanName={clan?.name} className={charClass?.name} onSubmit={submit} pendingFields={pendingFields} />
        <VitalsCard character={character} onSubmit={submit} pendingFields={pendingFields} />
        <ActionRoller table={table} character={character} actorName={actorName} />
        <AttributesCard character={character} clan={clan} charClass={charClass} onSubmit={submit} pendingFields={pendingFields} />
        <InventoryCard character={character} onSubmit={submit} pendingFields={pendingFields} />
        <ShopCard character={character} onSubmit={submit} pendingFields={pendingFields} />
        <JutsusCard character={character} onSubmit={submit} pendingFields={pendingFields} asGM={asGM} />
        <XpCard character={character} charClass={charClass} onSubmit={submit} pendingFields={pendingFields} />
        <DescriptionCard character={character} onSubmit={submit} pendingFields={pendingFields} />
        <Card className="p-4">
          <SectionTitle className="mb-2">Anotações (livre, sem aprovação)</SectionTitle>
          <Textarea
            id="notes-field"
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            onBlur={() => updateNotes(table.id, character.id, noteDraft)}
            rows={4}
            placeholder="Segredos, objetivos, contatos..."
          />
        </Card>
      </div>

      <div className="flex flex-col gap-4 lg:sticky lg:top-4">
        <PartyPanel characters={allCharacters} currentCharacterId={asGM ? undefined : character.id} />
        {npcs.some((n) => n.visible) && <AdversariesPanel npcs={npcs.filter((n) => n.visible)} />}
        {missions.length > 0 && <MissionBoard tableId={table.id} missions={missions} asGM={false} />}
        <LogFeed tableId={table.id} />
      </div>
    </div>
  )
}

function PendingNote({ fields, pending }: { fields: RequestableField[]; pending: Set<RequestableField> }) {
  const active = fields.filter((f) => pending.has(f))
  if (active.length === 0) return null
  return (
    <Badge tone="warn">
      Aguardando aprovação: {active.map((f) => REQUESTABLE_FIELD_LABELS[f]).join(', ')}
    </Badge>
  )
}

// ---------- Cabeçalho ----------

function HeaderCard({
  character,
  clanName,
  className,
  onSubmit,
  pendingFields,
}: {
  character: Character
  clanName?: string
  className?: string
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [editingImage, setEditingImage] = useState(false)
  const [imageDraft, setImageDraft] = useState(character.imageUrl)
  const blocked = pendingFields.has('imageUrl')

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center gap-1">
            <Avatar url={character.imageUrl} name={character.name} size={64} />
            {!editingImage ? (
              <button className="text-[11px] text-orange-400 hover:text-orange-200" disabled={blocked} onClick={() => setEditingImage(true)}>
                trocar imagem
              </button>
            ) : (
              <div className="flex w-40 flex-col gap-1">
                <Input value={imageDraft} onChange={(e) => setImageDraft(e.target.value)} placeholder="URL da imagem" className="text-xs" />
                <div className="flex gap-1">
                  <Button
                    className="flex-1"
                    onClick={async () => {
                      await onSubmit({ imageUrl: imageDraft.trim() }, 'Alterar imagem do personagem')
                      setEditingImage(false)
                    }}
                  >
                    ok
                  </Button>
                  <Button variant="ghost" onClick={() => setEditingImage(false)}>
                    x
                  </Button>
                </div>
              </div>
            )}
          </div>
          <div>
            <h1 className="font-serif text-2xl text-orange-100">{character.name}</h1>
            <p className="text-sm text-orange-300/60">
              {clanName} · {className} · Nível {character.level}
            </p>
            {character.description.rank && (
              <p className="text-xs text-orange-300/50">
                {character.description.rank} {character.description.title && `· ${character.description.title}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {!character.isAlive && <Badge tone="bad">Caído</Badge>}
          <PendingNote fields={['imageUrl']} pending={pendingFields} />
        </div>
      </div>
    </Card>
  )
}

// ---------- PV / Chakra / CA / Condição ----------

function VitalsCard({
  character,
  onSubmit,
  pendingFields,
}: {
  character: Character
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [hpDelta, setHpDelta] = useState(1)
  const [chakraDelta, setChakraDelta] = useState(1)
  const hpBlocked = pendingFields.has('hp')
  const chakraBlocked = pendingFields.has('chakra')
  const conditionBlocked = pendingFields.has('condition')

  async function applyHp(delta: number) {
    const newCurrent = Math.max(0, Math.min(character.hp.max, character.hp.current + delta))
    await onSubmit(
      { hp: { current: newCurrent, max: character.hp.max } },
      `${delta > 0 ? 'Recuperou' : 'Sofreu'} ${Math.abs(delta)} PV (${newCurrent}/${character.hp.max})`,
    )
  }

  async function applyChakra(delta: number) {
    const newCurrent = Math.max(0, Math.min(character.chakra.max, character.chakra.current + delta))
    await onSubmit(
      { chakra: { current: newCurrent, max: character.chakra.max } },
      `Chakra ${delta > 0 ? '+' : ''}${delta} (${newCurrent}/${character.chakra.max})`,
    )
  }

  async function shortRest() {
    const newChakra = Math.min(character.chakra.max, character.chakra.current + Math.floor(character.chakra.max / 2))
    await onSubmit({ chakra: { current: newChakra, max: character.chakra.max } }, 'Descanso curto: recuperou metade do Chakra máximo')
  }

  async function longRest() {
    await onSubmit(
      { hp: { current: character.hp.max, max: character.hp.max }, chakra: { current: character.chakra.max, max: character.chakra.max } },
      'Descanso longo: recuperou todo o PV e Chakra',
    )
  }

  const restBlocked = hpBlocked || chakraBlocked

  return (
    <Card className="p-4">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <p className="text-xs uppercase text-orange-400/60">Pontos de Vida</p>
          <Bar value={character.hp.current} max={character.hp.max} />
          <div className="mt-1 flex items-center gap-1">
            <Input type="number" value={hpDelta} onChange={(e) => setHpDelta(Number(e.target.value))} className="w-16" disabled={hpBlocked} />
            <Button variant="danger" disabled={hpBlocked} onClick={() => applyHp(-hpDelta)}>
              − Dano
            </Button>
            <Button variant="good" disabled={hpBlocked} onClick={() => applyHp(hpDelta)}>
              + Cura
            </Button>
          </div>
          <PendingNote fields={['hp']} pending={pendingFields} />
        </div>
        <div>
          <p className="text-xs uppercase text-orange-400/60">Chakra</p>
          <Bar value={character.chakra.current} max={character.chakra.max} tone="blue" />
          <div className="mt-1 flex items-center gap-1">
            <Input type="number" value={chakraDelta} onChange={(e) => setChakraDelta(Number(e.target.value))} className="w-16" disabled={chakraBlocked} />
            <Button variant="danger" disabled={chakraBlocked} onClick={() => applyChakra(-chakraDelta)}>
              − Gastar
            </Button>
            <Button variant="good" disabled={chakraBlocked} onClick={() => applyChakra(chakraDelta)}>
              + Recuperar
            </Button>
          </div>
          <PendingNote fields={['chakra']} pending={pendingFields} />
        </div>
        <div>
          <p className="text-xs uppercase text-orange-400/60">Classe de Armadura</p>
          <p className="text-xl text-orange-100">{character.armorClass}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-orange-400/60" title="CD que os outros precisam bater para vencer seus testes/resistências">
            Pontos de Resistência
          </p>
          <p className="text-xl text-orange-100">{character.resistancePoints}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-orange-400/60">Condição</p>
          <Select
            value={character.condition}
            disabled={conditionBlocked}
            onChange={(e) => onSubmit({ condition: e.target.value }, `Condição alterada para ${e.target.value}`)}
          >
            {CONDITIONS.map((c) => (
              <option key={c.name} value={c.name} title={c.effect}>
                {c.name}
              </option>
            ))}
          </Select>
          <PendingNote fields={['condition']} pending={pendingFields} />
        </div>
        <div>
          <p className="text-xs uppercase text-orange-400/60">Descanso</p>
          <div className="mt-1 flex gap-1">
            <Button variant="secondary" disabled={restBlocked} onClick={shortRest}>
              Curto
            </Button>
            <Button variant="secondary" disabled={restBlocked} onClick={longRest}>
              Longo
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

function Bar({ value, max, tone = 'green' }: { value: number; max: number; tone?: 'green' | 'blue' }) {
  const pct = max > 0 ? Math.max(0, (value / max) * 100) : 0
  const color = tone === 'blue' ? 'bg-sky-500' : pct > 50 ? 'bg-emerald-600' : pct > 20 ? 'bg-amber-500' : 'bg-red-600'
  return (
    <div className="flex items-center gap-2">
      <div className="h-3 w-40 overflow-hidden rounded-full bg-black/40">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm text-orange-100">
        {value} / {max}
      </span>
    </div>
  )
}

// ---------- Atributos ----------

function AttributesCard({
  character,
  clan,
  charClass,
  onSubmit,
  pendingFields,
}: {
  character: Character
  clan: ReturnType<typeof CLANS.find>
  charClass: ReturnType<typeof CLASSES.find>
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Attributes>(character.attributes)
  const blocked = pendingFields.has('attributes')

  function startEdit() {
    setDraft(character.attributes)
    setEditing(true)
  }

  async function save() {
    if (!charClass) return
    const derived = calculateDerivedStats(draft, charClass, character.level)
    await onSubmit(
      {
        attributes: draft,
        modifiers: derived.modifiers,
        armorClass: derived.armorClass,
        hp: { current: Math.min(character.hp.current, derived.hp), max: derived.hp },
        chakra: { current: Math.min(character.chakra.current, derived.chakra), max: derived.chakra },
      },
      'Alterou os atributos',
    )
    setEditing(false)
  }

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle>Atributos</SectionTitle>
        {!editing ? (
          <Button variant="secondary" disabled={blocked} onClick={startEdit}>
            Editar
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button variant="good" onClick={save}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
      <PendingNote fields={['attributes']} pending={pendingFields} />
      <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
        {ATTRIBUTE_KEYS.map((k) => (
          <div key={k} className="rounded-lg border border-orange-900/40 bg-black/20 p-2 text-center">
            <p className="text-[10px] uppercase text-orange-400/60">{ATTRIBUTE_LABELS[k]}</p>
            {editing ? (
              <input
                type="number"
                value={draft[k]}
                onChange={(e) => setDraft((d) => ({ ...d, [k]: Number(e.target.value) }))}
                className="w-full rounded bg-black/40 text-center text-lg text-orange-100"
              />
            ) : (
              <p className="text-lg text-orange-100">{character.attributes[k]}</p>
            )}
            <p className="text-xs text-orange-300/60">
              mod. {character.modifiers[k] >= 0 ? '+' : ''}
              {character.modifiers[k]}
            </p>
          </div>
        ))}
      </div>
      {(clan || character.proficiencies.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {character.proficiencies.map((p) => (
            <Badge key={p}>{p}</Badge>
          ))}
        </div>
      )}
    </Card>
  )
}

// ---------- Inventário / Armas / Armaduras ----------

function InventoryCard({
  character,
  onSubmit,
  pendingFields,
}: {
  character: Character
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [editing, setEditing] = useState(false)
  const [equipment, setEquipment] = useState<InventoryItem[]>(character.equipment)
  const [weapons, setWeapons] = useState<Weapon[]>(character.weapons)
  const [armor, setArmor] = useState<Armor[]>(character.armor)
  const [newItem, setNewItem] = useState('')
  const [newWeapon, setNewWeapon] = useState({ name: '', damage: '' })
  const [newArmor, setNewArmor] = useState({ name: '', defenseBonus: '' })

  const blocked = pendingFields.has('equipment') || pendingFields.has('weapons') || pendingFields.has('armor')

  function startEdit() {
    setEquipment(character.equipment)
    setWeapons(character.weapons)
    setArmor(character.armor)
    setEditing(true)
  }

  async function save() {
    await onSubmit({ equipment, weapons, armor }, 'Alterou inventário/armas/armaduras')
    setEditing(false)
  }

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle>Inventário</SectionTitle>
        {!editing ? (
          <Button variant="secondary" disabled={blocked} onClick={startEdit}>
            Editar
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button variant="good" onClick={save}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
      <PendingNote fields={['equipment', 'weapons', 'armor']} pending={pendingFields} />

      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs uppercase text-orange-400/60">Armas</p>
          {(editing ? weapons : character.weapons).map((w) => (
            <div key={w.id} className="flex items-center justify-between gap-2 py-0.5 text-sm">
              <span className={w.equipped ? 'text-orange-100' : 'text-orange-400/50 line-through'}>
                {w.name} {w.damage && `(${w.damage})`}
              </span>
              {editing && (
                <span className="flex gap-1">
                  <button
                    className="text-xs text-orange-400 hover:text-orange-200"
                    onClick={() => setWeapons((prev) => prev.map((x) => (x.id === w.id ? { ...x, equipped: !x.equipped } : x)))}
                  >
                    {w.equipped ? 'guardar' : 'equipar'}
                  </button>
                  <button className="text-xs text-red-400 hover:text-red-200" onClick={() => setWeapons((prev) => prev.filter((x) => x.id !== w.id))}>
                    remover
                  </button>
                </span>
              )}
            </div>
          ))}
          {editing && (
            <div className="mt-1 flex gap-1">
              <datalist id="weapon-catalog-list">
                {WEAPONS.map((w) => (
                  <option key={w.name} value={w.name} />
                ))}
              </datalist>
              <Input
                placeholder="Nome"
                list="weapon-catalog-list"
                value={newWeapon.name}
                onChange={(e) => {
                  const value = e.target.value
                  const match = WEAPONS.find((w) => w.name.toLowerCase() === value.toLowerCase())
                  setNewWeapon({ name: value, damage: match ? match.damage : newWeapon.damage })
                }}
                className="w-24 text-xs"
              />
              <Input placeholder="Dano (2d6)" value={newWeapon.damage} onChange={(e) => setNewWeapon((v) => ({ ...v, damage: e.target.value }))} className="w-20 text-xs" />
              <Button
                onClick={() => {
                  if (!newWeapon.name.trim()) return
                  setWeapons((prev) => [...prev, { id: newId(), name: newWeapon.name.trim(), damage: newWeapon.damage.trim(), equipped: true }])
                  setNewWeapon({ name: '', damage: '' })
                }}
              >
                +
              </Button>
            </div>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs uppercase text-orange-400/60">Armaduras</p>
          {(editing ? armor : character.armor).map((a) => (
            <div key={a.id} className="flex items-center justify-between gap-2 py-0.5 text-sm">
              <span className={a.equipped ? 'text-orange-100' : 'text-orange-400/50 line-through'}>
                {a.name} (+{a.defenseBonus})
              </span>
              {editing && (
                <span className="flex gap-1">
                  <button
                    className="text-xs text-orange-400 hover:text-orange-200"
                    onClick={() => setArmor((prev) => prev.map((x) => (x.id === a.id ? { ...x, equipped: !x.equipped } : x)))}
                  >
                    {a.equipped ? 'guardar' : 'equipar'}
                  </button>
                  <button className="text-xs text-red-400 hover:text-red-200" onClick={() => setArmor((prev) => prev.filter((x) => x.id !== a.id))}>
                    remover
                  </button>
                </span>
              )}
            </div>
          ))}
          {editing && (
            <div className="mt-1 flex gap-1">
              <datalist id="armor-catalog-list">
                {ARMORS.map((a) => (
                  <option key={a.name} value={a.name} />
                ))}
              </datalist>
              <Input
                placeholder="Nome"
                list="armor-catalog-list"
                value={newArmor.name}
                onChange={(e) => {
                  const value = e.target.value
                  const match = ARMORS.find((a) => a.name.toLowerCase() === value.toLowerCase())
                  setNewArmor({ name: value, defenseBonus: match ? String(match.armorBonus) : newArmor.defenseBonus })
                }}
                className="w-24 text-xs"
              />
              <Input
                placeholder="Bônus"
                type="number"
                value={newArmor.defenseBonus}
                onChange={(e) => setNewArmor((v) => ({ ...v, defenseBonus: e.target.value }))}
                className="w-16 text-xs"
              />
              <Button
                onClick={() => {
                  if (!newArmor.name.trim()) return
                  setArmor((prev) => [...prev, { id: newId(), name: newArmor.name.trim(), defenseBonus: Number(newArmor.defenseBonus) || 0, equipped: true }])
                  setNewArmor({ name: '', defenseBonus: '' })
                }}
              >
                +
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-1 text-xs uppercase text-orange-400/60">Equipamento</p>
        {(editing ? equipment : character.equipment).map((i) => (
          <div key={i.id} className="flex items-center justify-between gap-2 py-0.5 text-sm">
            <span className="text-orange-100">{i.name}</span>
            {editing ? (
              <span className="flex items-center gap-2">
                <button
                  className="text-orange-400 hover:text-orange-200"
                  onClick={() => setEquipment((prev) => prev.map((x) => (x.id === i.id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x)))}
                >
                  −
                </button>
                <span>{i.quantity}</span>
                <button
                  className="text-orange-400 hover:text-orange-200"
                  onClick={() => setEquipment((prev) => prev.map((x) => (x.id === i.id ? { ...x, quantity: x.quantity + 1 } : x)))}
                >
                  +
                </button>
                <button className="text-red-400 hover:text-red-200" onClick={() => setEquipment((prev) => prev.filter((x) => x.id !== i.id))}>
                  remover
                </button>
              </span>
            ) : (
              <span className="text-orange-300/60">x{i.quantity}</span>
            )}
          </div>
        ))}
        {editing && (
          <div className="mt-1 flex gap-2">
            <Input placeholder="Item personalizado" value={newItem} onChange={(e) => setNewItem(e.target.value)} className="w-40" />
            <Button
              onClick={() => {
                if (!newItem.trim()) return
                setEquipment((prev) => [...prev, { id: newId(), name: newItem.trim(), quantity: 1 }])
                setNewItem('')
              }}
            >
              Adicionar
            </Button>
          </div>
        )}
      </div>
    </Card>
  )
}

// ---------- Jutsus ----------

const RANK_ORDER = ['Rank-E', 'Rank-D', 'Rank-C', 'Rank-B', 'Rank-A', 'Rank-S']

function formatCatalogJutsuDetails(entry: (typeof JUTSU_CATALOG)[number]): string {
  return [
    `${entry.classification} · ${entry.rank}`,
    `Tempo: ${entry.castingTime} · Alcance: ${entry.range} · Duração: ${entry.duration}`,
    entry.description,
  ]
    .filter(Boolean)
    .join('\n')
}

function JutsusCard({
  character,
  onSubmit,
  pendingFields,
  asGM,
}: {
  character: Character
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
  asGM: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [jutsus, setJutsus] = useState<Jutsu[]>(character.jutsus)
  const [jutsuToAdd, setJutsuToAdd] = useState('')
  const [customName, setCustomName] = useState('')
  const [customDetails, setCustomDetails] = useState('')
  const blocked = pendingFields.has('jutsus')

  const charClass = CLASSES.find((c) => c.id === character.classId)
  const progressionEntry = charClass?.progression.find((p) => p.level === character.level)
  const maxRankIndex = progressionEntry?.maxRank ? RANK_ORDER.indexOf(progressionEntry.maxRank) : RANK_ORDER.length - 1
  // Jogador só pode escolher jutsus elegíveis pro rank atual do personagem
  // (ou exclusivos do clã); o mestre pode liberar qualquer jutsu do catálogo
  // completo, ou até um totalmente personalizado.
  const eligibleJutsus = JUTSU_CATALOG.filter(
    (j) => j.clanId === character.clanId || RANK_ORDER.indexOf(j.rank) <= maxRankIndex,
  )
  const selectableJutsus = asGM ? JUTSU_CATALOG : eligibleJutsus

  function startEdit() {
    setJutsus(character.jutsus)
    setEditing(true)
  }

  function addFromCatalog() {
    const catalogMatch = selectableJutsus.find((j) => j.name === jutsuToAdd)
    if (!catalogMatch || jutsus.some((j) => j.name === catalogMatch.name)) return
    setJutsus((prev) => [
      ...prev,
      { id: newId(), name: catalogMatch.name, details: formatCatalogJutsuDetails(catalogMatch), chakraCost: catalogMatch.cost },
    ])
    setJutsuToAdd('')
  }

  function addCustom() {
    if (!customName.trim()) return
    setJutsus((prev) => [...prev, { id: newId(), name: customName.trim(), details: customDetails.trim() }])
    setCustomName('')
    setCustomDetails('')
  }

  async function save() {
    await onSubmit({ jutsus }, 'Alterou a lista de jutsus')
    setEditing(false)
  }

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle>Jutsus</SectionTitle>
        {!editing ? (
          <Button variant="secondary" disabled={blocked} onClick={startEdit}>
            Editar
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button variant="good" onClick={save}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
      <PendingNote fields={['jutsus']} pending={pendingFields} />
      <div className="mt-2 flex flex-col gap-2">
        {(editing ? jutsus : character.jutsus).map((j) => (
          <div key={j.id} className="rounded-lg border border-orange-900/30 bg-black/20 p-2.5 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-orange-100">
                {j.name} {j.chakraCost && <span className="text-xs font-normal text-orange-400/60">({j.chakraCost})</span>}
              </p>
              {editing && (
                <button className="text-xs text-red-400 hover:text-red-200" onClick={() => setJutsus((prev) => prev.filter((x) => x.id !== j.id))}>
                  remover
                </button>
              )}
            </div>
            {j.details && <p className="mt-0.5 whitespace-pre-line text-xs text-orange-300/60">{j.details}</p>}
          </div>
        ))}
        {editing && (
          <div className="flex flex-col gap-2 rounded-lg border border-orange-900/30 bg-black/10 p-2.5">
            <p className="text-xs text-orange-300/60">
              {asGM
                ? 'Como mestre, você pode liberar qualquer jutsu do catálogo completo.'
                : 'Você só pode escolher entre os jutsus elegíveis pro rank e clã do seu personagem.'}
            </p>
            <div className="flex gap-1.5">
              <Select value={jutsuToAdd} onChange={(e) => setJutsuToAdd(e.target.value)}>
                <option value="">Selecione um jutsu{asGM ? ' (catálogo completo)' : ' elegível'}...</option>
                {selectableJutsus
                  .filter((j) => !jutsus.some((added) => added.name === j.name))
                  .map((j) => (
                    <option key={j.name} value={j.name}>
                      {j.name} ({j.category}
                      {j.cost ? ` · ${j.cost}` : ''})
                    </option>
                  ))}
              </Select>
              <Button onClick={addFromCatalog} disabled={!jutsuToAdd} className="shrink-0">
                Adicionar
              </Button>
            </div>
            {asGM && (
              <>
                <p className="text-xs text-orange-300/60">Ou crie um jutsu personalizado (homebrew):</p>
                <Input placeholder="Nome do jutsu" value={customName} onChange={(e) => setCustomName(e.target.value)} />
                <Textarea rows={2} placeholder="Efeito / custo de chakra" value={customDetails} onChange={(e) => setCustomDetails(e.target.value)} />
                <Button className="self-start" onClick={addCustom}>
                  Adicionar Personalizado
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

// ---------- XP / Nível ----------

function XpCard({
  character,
  charClass,
  onSubmit,
  pendingFields,
}: {
  character: Character
  charClass: ReturnType<typeof CLASSES.find>
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [xpDraft, setXpDraft] = useState(character.xp)
  const blocked = pendingFields.has('xp') || pendingFields.has('level')
  const nextLevelXp = useMemo(() => getXpForNextLevel(character.level), [character.level])

  async function apply() {
    if (!charClass) return
    const newLevel = getLevelFromXp(xpDraft)
    if (newLevel === character.level) {
      await onSubmit({ xp: xpDraft }, `XP alterado para ${xpDraft}`)
      return
    }
    const derived = calculateDerivedStats(character.attributes, charClass, newLevel)
    await onSubmit(
      {
        xp: xpDraft,
        level: newLevel,
        proficiencyBonus: derived.proficiencyBonus,
        armorClass: derived.armorClass,
        resistancePoints: derived.resistancePoints,
        hp: { current: Math.min(character.hp.current, derived.hp), max: derived.hp },
        chakra: { current: Math.min(character.chakra.current, derived.chakra), max: derived.chakra },
      },
      `Subiu para o nível ${newLevel} (XP ${xpDraft})`,
    )
  }

  return (
    <Card className="p-4">
      <SectionTitle className="mb-2">Experiência</SectionTitle>
      <PendingNote fields={['xp', 'level']} pending={pendingFields} />
      <div className="mt-2 flex items-center gap-2">
        <p className="text-sm text-orange-300/60">
          Nível {character.level} · próximo em {nextLevelXp} XP
        </p>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <Input type="number" value={xpDraft} onChange={(e) => setXpDraft(Number(e.target.value))} className="w-28" disabled={blocked} />
        <Button variant="primary" disabled={blocked || xpDraft === character.xp} onClick={apply}>
          Atualizar XP
        </Button>
      </div>
    </Card>
  )
}

// ---------- Descrição ----------

function DescriptionCard({
  character,
  onSubmit,
  pendingFields,
}: {
  character: Character
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<CharacterDescription>(character.description)
  const blocked = pendingFields.has('description')

  function startEdit() {
    setDraft(character.description)
    setEditing(true)
  }

  async function save() {
    await onSubmit({ description: draft }, 'Alterou a descrição do personagem')
    setEditing(false)
  }

  const fields: { key: keyof CharacterDescription; label: string }[] = [
    { key: 'rank', label: 'Rank' },
    { key: 'title', label: 'Título' },
    { key: 'appearance', label: 'Aparência' },
    { key: 'personalityTraits', label: 'Personalidade' },
    { key: 'ideals', label: 'Ideais' },
    { key: 'bonds', label: 'Vínculos' },
    { key: 'flaws', label: 'Defeitos' },
  ]

  return (
    <Card className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <SectionTitle>Descrição</SectionTitle>
        {!editing ? (
          <Button variant="secondary" disabled={blocked} onClick={startEdit}>
            Editar
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button variant="good" onClick={save}>
              Enviar
            </Button>
            <Button variant="ghost" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
      <PendingNote fields={['description']} pending={pendingFields} />
      <div className="mt-2 flex flex-col gap-2 text-sm">
        {fields.map(({ key, label }) => (
          <div key={key}>
            <p className="text-xs uppercase text-orange-400/60">{label}</p>
            {editing ? (
              <Textarea
                rows={key === 'rank' || key === 'title' ? 1 : 2}
                value={String(draft[key] ?? '')}
                onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
              />
            ) : (
              <p className="text-orange-200">{String(character.description[key] || '—')}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}

// ---------- Adversários visíveis ----------

function AdversariesPanel({ npcs }: { npcs: NPC[] }) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <SectionTitle>Adversários</SectionTitle>
      {npcs.map((npc) => {
        const hpPct = npc.hp.max > 0 ? Math.max(0, (npc.hp.current / npc.hp.max) * 100) : 0
        return (
          <div key={npc.id} className="rounded-lg border border-orange-900/30 bg-black/20 p-2 text-sm">
            <div className="flex items-center justify-between">
              <p className="font-semibold text-orange-100">{npc.name}</p>
              <span className="text-xs text-orange-400/60">CA {npc.armorClass}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-black/40">
              <div className={`h-full ${hpPct > 50 ? 'bg-emerald-600' : hpPct > 20 ? 'bg-amber-500' : 'bg-red-600'}`} style={{ width: `${hpPct}%` }} />
            </div>
          </div>
        )
      })}
    </Card>
  )
}

// ---------- Loja ----------

function parseRyoCost(cost: string): number {
  const cleaned = cost.replace(/\./g, '').match(/\d+/)
  return cleaned ? Number(cleaned[0]) : 0
}

function ShopCard({
  character,
  onSubmit,
  pendingFields,
}: {
  character: Character
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [tab, setTab] = useState<'weapons' | 'armor' | 'gear'>('weapons')
  const blocked = pendingFields.has('ryo') || pendingFields.has('weapons') || pendingFields.has('armor') || pendingFields.has('equipment')

  async function buyWeapon(item: WeaponCatalogEntry) {
    const cost = parseRyoCost(item.cost)
    if (character.ryo < cost) return
    const weapons: Weapon[] = [...character.weapons, { id: newId(), name: item.name, damage: item.damage, equipped: true }]
    await onSubmit({ weapons, ryo: character.ryo - cost }, `Comprou ${item.name} (${item.cost})`)
  }

  async function buyArmor(item: ArmorCatalogEntry) {
    const cost = parseRyoCost(item.cost)
    if (character.ryo < cost) return
    const armor: Armor[] = [...character.armor, { id: newId(), name: item.name, defenseBonus: item.armorBonus, equipped: true }]
    await onSubmit({ armor, ryo: character.ryo - cost }, `Comprou ${item.name} (${item.cost})`)
  }

  async function buyGear(item: GearItem) {
    const cost = parseRyoCost(item.cost)
    if (character.ryo < cost) return
    const equipment: InventoryItem[] = [...character.equipment, { id: newId(), name: item.name, quantity: 1 }]
    await onSubmit({ equipment, ryo: character.ryo - cost }, `Comprou ${item.name} (${item.cost})`)
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <SectionTitle>Loja</SectionTitle>
        <p className="text-sm text-orange-200">
          Saldo: <span className="font-semibold text-orange-100">{character.ryo} Ryo</span>
        </p>
      </div>
      <PendingNote fields={['ryo', 'weapons', 'armor', 'equipment']} pending={pendingFields} />
      <div className="flex gap-1.5">
        {(
          [
            ['weapons', 'Armas'],
            ['armor', 'Armaduras'],
            ['gear', 'Itens'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`rounded-full px-3 py-1 text-xs ${tab === key ? 'bg-orange-700 text-white' : 'bg-[#241a0f] text-orange-300/70'}`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
        {tab === 'weapons' &&
          WEAPONS.map((w) => (
            <div key={w.name} className="flex items-center justify-between gap-2 rounded-lg border border-orange-900/20 bg-black/20 px-2.5 py-1.5 text-sm">
              <span className="text-orange-100">
                {w.name} <span className="text-xs text-orange-400/60">({w.damage} {w.damageType})</span>
              </span>
              <Button disabled={blocked || character.ryo < parseRyoCost(w.cost)} onClick={() => buyWeapon(w)}>
                {w.cost}
              </Button>
            </div>
          ))}
        {tab === 'armor' &&
          ARMORS.map((a) => (
            <div key={a.name} className="flex items-center justify-between gap-2 rounded-lg border border-orange-900/20 bg-black/20 px-2.5 py-1.5 text-sm">
              <span className="text-orange-100">
                {a.name} <span className="text-xs text-orange-400/60">(+{a.armorBonus} CA)</span>
              </span>
              <Button disabled={blocked || character.ryo < parseRyoCost(a.cost)} onClick={() => buyArmor(a)}>
                {a.cost}
              </Button>
            </div>
          ))}
        {tab === 'gear' &&
          GEAR.map((g) => (
            <div key={g.name} className="flex items-center justify-between gap-2 rounded-lg border border-orange-900/20 bg-black/20 px-2.5 py-1.5 text-sm">
              <span className="text-orange-100">{g.name}</span>
              <Button disabled={blocked || character.ryo < parseRyoCost(g.cost)} onClick={() => buyGear(g)}>
                {g.cost}
              </Button>
            </div>
          ))}
      </div>
    </Card>
  )
}
