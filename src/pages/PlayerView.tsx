import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, TabChip, Textarea } from '../components/ui'
import { ActionRoller } from '../components/ActionRoller'
import { LogFeed } from '../components/LogFeed'
import { MissionBoard } from '../components/MissionBoard'
import { PartyPanel } from '../components/PartyPanel'
import { ChakraGiftCard } from '../components/ChakraGiftPanel'
import { JutsuCastCard, resolverCast } from '../components/JutsuCastPanel'
import { CompanionCard } from '../components/CompanionPanel'
import { SurvivalHud } from '../components/SurvivalPanel'
import { ThemeToggle } from '../components/ThemeToggle'
import { Help } from '../components/Help'
import { allClans } from '../lib/clans'
import { CLASSES } from '../data/classes'
import { CONDITIONS } from '../data/conditions'
import { ARMORS, GEAR, WEAPONS } from '../data/equipment'
import { JUTSU_CATALOG } from '../data/jutsus'
import { ELEMENTS, clanElements, effectiveElements, eligibleJutsus, jutsusKnownForLevel, maxRankForLevel } from '../lib/jutsuAccess'
import { calculateDerivedStats } from '../lib/characterMath'
import {
  addPuppetItem,
  armorClassBreakdown,
  armorClassFor,
  armorFromCatalog,
  armorFromShopItem,
  bundleSize,
  catalogEntries,
  parseRyoCost,
  stackArmor,
  stackGear,
  stackWeapon,
  weaponFromCatalog,
  weaponFromShopItem,
} from '../lib/equipment'
import { rollDice } from '../lib/dice'
import { submitCharacterChange, updateNotes } from '../lib/changeRequest'
import {
  listenCharacter,
  listenCharacters,
  listenCompanions,
  listenCustomClans,
  listenMissions,
  listenNPCs,
  listenRequestsForCharacter,
  listenShop,
} from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, CHAKRA_DONOR_CLASS_ID, REQUESTABLE_FIELD_LABELS } from '../types'
import type {
  Armor,
  Companion,
  ArmorCatalogEntry,
  Attributes,
  Character,
  CharacterDescription,
  Clan,
  GameTable,
  GearItem,
  InventoryItem,
  Jutsu,
  Mission,
  NPC,
  RequestableField,
  ShopItem,
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
  const [companions, setCompanions] = useState<Companion[]>([])
  const [missions, setMissions] = useState<Mission[]>([])
  const [pendingFields, setPendingFields] = useState<Set<RequestableField>>(new Set())
  const [noteDraft, setNoteDraft] = useState('')
  const [customClans, setCustomClans] = useState<Clan[]>([])
  const [shopItems, setShopItems] = useState<ShopItem[]>([])

  useEffect(() => {
    setCharacter(undefined)
    return listenCharacter(table.id, characterId, (c) => {
      setCharacter(c)
      setNoteDraft((prev) => (c && document.activeElement?.id !== 'notes-field' ? c.notes : prev))
    })
  }, [table.id, characterId])

  useEffect(() => listenCharacters(table.id, setAllCharacters), [table.id])
  useEffect(() => listenCustomClans(table.id, setCustomClans), [table.id])
  useEffect(() => listenShop(table.id, setShopItems), [table.id])
  useEffect(() => listenNPCs(table.id, setNpcs), [table.id])
  useEffect(() => listenCompanions(table.id, setCompanions), [table.id])
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

  const clans = allClans(customClans)
  // Tudo que está em campo: fichas, NPCs e as temporárias (clone, invocação,
  // marionete). Alvo e conjurador saem daqui.
  const mesa = { characters: allCharacters, npcs, companions }
  const clan = clans.find((c) => c.id === character.clanId)
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
        <HeaderCard character={character} clanName={clan?.name} className={charClass?.name} tableCode={table.code} onSubmit={submit} pendingFields={pendingFields} />
        <VitalsCard character={character} party={allCharacters} onSubmit={submit} pendingFields={pendingFields} />
        <SurvivalHud table={table} character={character} />
        <ActionRoller
          table={table}
          character={character}
          actorName={actorName}
          actorIsGM={asGM}
          requesterUid={actorUid}
        />
        <JutsuCastCard
          table={table}
          character={character}
          mesa={mesa}
          clans={clans}
          requesterUid={actorUid}
          asGM={asGM}
        />
        <CompanionCard
          table={table}
          character={character}
          mesa={mesa}
          shopItems={shopItems}
          requesterUid={actorUid}
          asGM={asGM}
          onResolveNow={(cast) => resolverCast(table, cast, mesa, table.gmName).then(() => undefined)}
        />
        <AttributesCard character={character} clan={clan} charClass={charClass} onSubmit={submit} pendingFields={pendingFields} />
        <InventoryCard character={character} onSubmit={submit} pendingFields={pendingFields} />
        <ShopCard character={character} table={table} shopItems={shopItems} onSubmit={submit} pendingFields={pendingFields} />
        {character.classId === CHAKRA_DONOR_CLASS_ID && (
          <ChakraGiftCard table={table} character={character} party={allCharacters} requesterUid={actorUid} />
        )}
        <ElementsCard character={character} clan={clan} onSubmit={submit} asGM={asGM} />
        <JutsusCard character={character} clan={clan} onSubmit={submit} pendingFields={pendingFields} asGM={asGM} />
        <XpCard character={character} charClass={charClass} onSubmit={submit} asGM={asGM} />
        <DescriptionCard character={character} onSubmit={submit} pendingFields={pendingFields} asGM={asGM} />
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
        <PartyPanel characters={allCharacters} currentCharacterId={asGM ? undefined : character.id} clans={customClans} />
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
  tableCode,
  onSubmit,
  pendingFields,
}: {
  character: Character
  clanName?: string
  className?: string
  tableCode: string
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [editingImage, setEditingImage] = useState(false)
  const [imageDraft, setImageDraft] = useState(character.imageUrl)
  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState(character.name)
  const blocked = pendingFields.has('imageUrl')
  const nameBlocked = pendingFields.has('name')

  async function saveName() {
    const novo = nameDraft.trim()
    if (!novo || novo === character.name) {
      setEditingName(false)
      return
    }
    await onSubmit({ name: novo }, `Renomear personagem: ${character.name} -> ${novo}`)
    setEditingName(false)
  }

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
            {!editingName ? (
              <h1 className="group flex items-center gap-2 font-serif text-2xl text-orange-100">
                {character.name}
                <button
                  className="text-[11px] font-sans text-orange-400 opacity-60 transition hover:text-orange-200 hover:opacity-100"
                  disabled={nameBlocked}
                  title="Mudar o nome do personagem"
                  onClick={() => {
                    setNameDraft(character.name)
                    setEditingName(true)
                  }}
                >
                  renomear
                </button>
              </h1>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void saveName()
                    if (e.key === 'Escape') setEditingName(false)
                  }}
                  placeholder="Nome do personagem"
                  className="w-48"
                />
                <Button onClick={saveName}>ok</Button>
                <Button variant="ghost" onClick={() => setEditingName(false)}>
                  x
                </Button>
              </div>
            )}
            <p className="text-sm text-orange-300/60">
              {clanName} · {className} · Nível {character.level}
            </p>
            <PendingNote fields={['name']} pending={pendingFields} />
            {character.description.rank && (
              <p className="text-xs text-orange-300/50">
                {character.description.rank} {character.description.title && `· ${character.description.title}`}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Link to={`/t/${tableCode}/mapa`}>
            <Button variant="secondary">🗺️ Tela de jogo</Button>
          </Link>
          <Link to="/regras" target="_blank">
            <Button variant="secondary">📖 Manual</Button>
          </Link>
          <ThemeToggle />
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
  party,
  onSubmit,
  pendingFields,
}: {
  character: Character
  party: Character[]
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [hpDelta, setHpDelta] = useState(1)
  const [chakraDelta, setChakraDelta] = useState(1)
  /** Quem cuidou das feridas no descanso longo — vazio = ninguém. */
  const [auxiliarId, setAuxiliarId] = useState('')
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

  /**
   * Descanso longo pelas regras do manual (05-combate.md, "Cura"):
   * Chakra volta ao máximo, mas o PV NÃO — cura só **1 PV por nível** do
   * personagem, ou **1d4+1 PV por nível do auxiliador** quando alguém cuida
   * das feridas. Antes o app enchia a barra de vida, o que tornava qualquer
   * ferimento irrelevante entre uma cena e outra.
   */
  async function longRest() {
    const auxiliar = party.find((c) => c.id === auxiliarId)
    const cura = auxiliar
      ? rollDice(`${auxiliar.level}d4+${auxiliar.level}`).total
      : character.level
    const novoPv = Math.min(character.hp.max, character.hp.current + cura)
    await onSubmit(
      { hp: { current: novoPv, max: character.hp.max }, chakra: { current: character.chakra.max, max: character.chakra.max } },
      auxiliar
        ? `Descanso longo assistido por ${auxiliar.name}: +${cura} PV (1d4+1 por nível do auxiliador) e Chakra cheio`
        : `Descanso longo: +${cura} PV (1 por nível) e Chakra cheio`,
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
          <div className="mt-1 flex flex-wrap items-center gap-1">
            <Button variant="secondary" disabled={restBlocked} onClick={shortRest} title="Recupera metade do Chakra máximo. O manual não dá cura de PV em descanso curto.">
              Curto
            </Button>
            <Button
              variant="secondary"
              disabled={restBlocked}
              onClick={longRest}
              title="Chakra cheio e cura de 1 PV por nível — ou 1d4+1 por nível de quem auxiliar."
            >
              Longo
            </Button>
            <Select value={auxiliarId} onChange={(e) => setAuxiliarId(e.target.value)} className="w-36" disabled={restBlocked}>
              <option value="">sem auxílio</option>
              {party
                .filter((c) => c.id !== character.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    tratado por {c.name}
                  </option>
                ))}
            </Select>
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
  clan?: Clan
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

/**
 * Inventário.
 *
 * Três coisas mudaram em relação à primeira versão, e todas vinham do mesmo
 * problema: o inventário era uma lista de nomes.
 *
 *  - **pilha**: o mesmo item nunca abre duas linhas, e 20 shurikens ficam em
 *    uma linha com quantidade 20, com − e + do lado;
 *  - **armadura conta**: vestir ou guardar uma peça recalcula a Classe de
 *    Armadura na mesma alteração, pela regra do manual;
 *  - **gasto**: o que é arremessado é marcado como consumível, e o ataque
 *    desconta a unidade sozinho (ver o cartão de ataque).
 *
 * As mexidas ficam num rascunho e vão juntas em uma alteração só — para o
 * jogador isso é um pedido único ao mestre em vez de um por clique.
 */
function InventoryCard({
  character,
  onSubmit,
  pendingFields,
}: {
  character: Character
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [rascunho, setRascunho] = useState<{ equipment: InventoryItem[]; weapons: Weapon[]; armor: Armor[] } | null>(null)
  const [novoItem, setNovoItem] = useState('')
  const [novaArma, setNovaArma] = useState('')
  const [novaArmadura, setNovaArmadura] = useState('')

  const blocked = pendingFields.has('equipment') || pendingFields.has('weapons') || pendingFields.has('armor')

  const equipment = rascunho?.equipment ?? character.equipment
  const weapons = rascunho?.weapons ?? character.weapons
  const armor = rascunho?.armor ?? character.armor
  const mexendo = rascunho !== null

  function mexer(patch: Partial<{ equipment: InventoryItem[]; weapons: Weapon[]; armor: Armor[] }>) {
    setRascunho({ equipment, weapons, armor, ...patch })
  }

  const caAtual = armorClassFor(character, armor)
  const caMuda = caAtual !== character.armorClass

  async function enviar() {
    if (!rascunho) return
    const patch: Record<string, unknown> = { ...rascunho }
    // Vestir armadura muda a CA: vai na mesma alteração, senão a ficha ficaria
    // com a defesa de antes.
    if (caMuda) patch.armorClass = caAtual
    await onSubmit(patch, `Alterou o inventário${caMuda ? ` (CA ${character.armorClass} -> ${caAtual})` : ''}`)
    setRascunho(null)
  }

  const armasDoCatalogo = catalogEntries('weapon')
  const armadurasDoCatalogo = catalogEntries('armor')
  const itensDoCatalogo = catalogEntries('gear')

  return (
    <Card className="p-4">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Inventário</SectionTitle>
        {mexendo ? (
          <div className="flex gap-1">
            <Button variant="good" onClick={enviar}>
              Enviar alterações
            </Button>
            <Button variant="ghost" onClick={() => setRascunho(null)}>
              Desfazer
            </Button>
          </div>
        ) : (
          <Badge>
            CA {character.armorClass}
            {armor.some((a) => a.equipped) ? ` · ${armor.filter((a) => a.equipped).map((a) => a.name).join(', ')}` : ' · sem armadura'}
          </Badge>
        )}
      </div>
      <PendingNote fields={['equipment', 'weapons', 'armor', 'armorClass']} pending={pendingFields} />
      {mexendo && caMuda && (
        <p className="mb-2 text-xs text-emerald-300">
          Classe de Armadura vai de {character.armorClass} para {caAtual} — {armorClassBreakdown(character, armor)}.
        </p>
      )}

      <div className="mt-2 grid min-w-0 gap-4 sm:grid-cols-2">
        {/* ---- Armas ---- */}
        <div className="min-w-0">
          <p className="mb-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Armas</p>
          {weapons.length === 0 && <p className="text-xs text-orange-300/50">Nenhuma.</p>}
          {weapons.map((w) => (
            <div key={w.id} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 py-0.5 text-sm">
              <span className={`min-w-0 flex-1 break-words ${w.equipped ? 'text-orange-100' : 'text-orange-400/50 line-through'}`}>
                {w.name}
                {w.damage && <span className="text-orange-400/60"> {w.damage}</span>}
                {w.consumable && (
                  <span className="ml-1 text-[10px] uppercase text-orange-400/50" title="Arremessada, sai da mão: o ataque desconta uma unidade.">
                    consumível
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  className="px-1 text-orange-400 hover:text-orange-200"
                  disabled={blocked}
                  onClick={() => mexer({ weapons: weapons.map((x) => (x.id === w.id ? { ...x, quantity: Math.max(1, (x.quantity ?? 1) - 1) } : x)) })}
                >
                  −
                </button>
                <span className="min-w-4 text-center text-xs text-orange-200">{w.quantity ?? 1}</span>
                <button
                  className="px-1 text-orange-400 hover:text-orange-200"
                  disabled={blocked}
                  onClick={() => mexer({ weapons: weapons.map((x) => (x.id === w.id ? { ...x, quantity: (x.quantity ?? 1) + 1 } : x)) })}
                >
                  +
                </button>
                <button
                  className="text-[11px] text-orange-400 hover:text-orange-200"
                  disabled={blocked}
                  onClick={() => mexer({ weapons: weapons.map((x) => (x.id === w.id ? { ...x, equipped: !x.equipped } : x)) })}
                >
                  {w.equipped ? 'guardar' : 'equipar'}
                </button>
                <button
                  className="text-[11px] text-red-400 hover:text-red-200"
                  disabled={blocked}
                  onClick={() => mexer({ weapons: weapons.filter((x) => x.id !== w.id) })}
                >
                  x
                </button>
              </span>
            </div>
          ))}
          <div className="mt-1 flex min-w-0 gap-1">
            <Select value={novaArma} onChange={(e) => setNovaArma(e.target.value)} className="min-w-0 flex-1 text-xs" disabled={blocked}>
              <option value="">Arma do catálogo...</option>
              {armasDoCatalogo.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} — {a.detail}
                </option>
              ))}
            </Select>
            <Button
              className="shrink-0"
              disabled={blocked || !novaArma}
              onClick={() => {
                const entry = WEAPONS.find((w) => w.name === novaArma)
                if (!entry) return
                mexer({ weapons: stackWeapon(weapons, weaponFromCatalog(entry), bundleSize(entry.name)) })
                setNovaArma('')
              }}
            >
              +
            </Button>
          </div>
        </div>

        {/* ---- Armaduras ---- */}
        <div className="min-w-0">
          <p className="mb-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Armaduras</p>
          {armor.length === 0 && <p className="text-xs text-orange-300/50">Nenhuma.</p>}
          {armor.map((a) => (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 py-0.5 text-sm">
              <span
                className={`min-w-0 flex-1 break-words ${a.equipped ? 'text-orange-100' : 'text-orange-400/50 line-through'}`}
                title={a.note}
              >
                {a.name} <span className="text-orange-400/60">+{a.defenseBonus} CA</span>
                {a.dexCap !== undefined && (
                  <span className="ml-1 text-[10px] uppercase text-orange-400/50">
                    {a.dexCap === 0 ? 'sem Destreza' : `Destreza máx. ${a.dexCap}`}
                  </span>
                )}
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <button
                  className="text-[11px] text-orange-400 hover:text-orange-200"
                  disabled={blocked}
                  onClick={() => mexer({ armor: armor.map((x) => (x.id === a.id ? { ...x, equipped: !x.equipped } : x)) })}
                >
                  {a.equipped ? 'guardar' : 'vestir'}
                </button>
                <button
                  className="text-[11px] text-red-400 hover:text-red-200"
                  disabled={blocked}
                  onClick={() => mexer({ armor: armor.filter((x) => x.id !== a.id) })}
                >
                  x
                </button>
              </span>
            </div>
          ))}
          <div className="mt-1 flex min-w-0 gap-1">
            <Select value={novaArmadura} onChange={(e) => setNovaArmadura(e.target.value)} className="min-w-0 flex-1 text-xs" disabled={blocked}>
              <option value="">Armadura do catálogo...</option>
              {armadurasDoCatalogo.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name} — {a.detail}
                </option>
              ))}
            </Select>
            <Button
              className="shrink-0"
              disabled={blocked || !novaArmadura}
              onClick={() => {
                const entry = ARMORS.find((a) => a.name === novaArmadura)
                if (!entry) return
                mexer({ armor: stackArmor(armor, armorFromCatalog(entry)) })
                setNovaArmadura('')
              }}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      {/* ---- Itens ---- */}
      <div className="mt-3 min-w-0">
        <p className="mb-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Itens</p>
        {equipment.length === 0 && <p className="text-xs text-orange-300/50">Nada na mochila.</p>}
        {equipment.map((i) => (
          <div key={i.id} className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 py-0.5 text-sm">
            <span className="min-w-0 flex-1 break-words text-orange-100" title={i.note}>
              {i.name}
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <button
                className="px-1 text-orange-400 hover:text-orange-200"
                disabled={blocked}
                onClick={() => mexer({ equipment: equipment.map((x) => (x.id === i.id ? { ...x, quantity: Math.max(1, x.quantity - 1) } : x)) })}
              >
                −
              </button>
              <span className="min-w-4 text-center text-xs text-orange-200">{i.quantity}</span>
              <button
                className="px-1 text-orange-400 hover:text-orange-200"
                disabled={blocked}
                onClick={() => mexer({ equipment: equipment.map((x) => (x.id === i.id ? { ...x, quantity: x.quantity + 1 } : x)) })}
              >
                +
              </button>
              <button
                className="text-[11px] text-red-400 hover:text-red-200"
                disabled={blocked}
                onClick={() => mexer({ equipment: equipment.filter((x) => x.id !== i.id) })}
              >
                x
              </button>
            </span>
          </div>
        ))}
        {/* No celular o seletor do catálogo fica na linha inteira: dividindo
            espaço com o campo livre e o botão, sobrava largura só para
            "Item do catálog." */}
        <div className="mt-1 flex min-w-0 flex-wrap gap-1">
          <Select
            value=""
            onChange={(e) => {
              if (!e.target.value) return
              const entry = GEAR.find((g) => g.name === e.target.value)
              mexer({ equipment: stackGear(equipment, e.target.value, 1, entry?.effect) })
            }}
            className="min-w-0 basis-full text-xs sm:basis-auto sm:flex-1"
            disabled={blocked}
          >
            <option value="">Item do catálogo...</option>
            {itensDoCatalogo.map((g) => (
              <option key={g.name} value={g.name}>
                {g.name} — {g.detail}
              </option>
            ))}
          </Select>
          <Input
            placeholder="Item da mesa"
            value={novoItem}
            onChange={(e) => setNovoItem(e.target.value)}
            className="min-w-0 flex-1 text-xs sm:w-36 sm:flex-none"
            disabled={blocked}
          />
          <Button
            className="shrink-0"
            disabled={blocked || !novoItem.trim()}
            onClick={() => {
              mexer({ equipment: stackGear(equipment, novoItem.trim(), 1) })
              setNovoItem('')
            }}
          >
            +
          </Button>
        </div>
      </div>
    </Card>
  )
}

// ---------- Afinidades elementais ----------

/**
 * Afinidade de natureza. Vem do clã de graça (Uchiha com Fogo, Hatake com
 * Relâmpago) ou é concedida pelo mestre — por subclasse, pelo talento
 * "Liberação de Natureza" ou por escolha da mesa. É ela que destranca os
 * jutsus de Liberação, então fica visível na ficha.
 */
function ElementsCard({
  character,
  clan,
  onSubmit,
  asGM,
}: {
  character: Character
  clan?: Clan
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  asGM: boolean
}) {
  const doClan = clanElements(clan)
  const concedidas = character.elements ?? []

  async function alternar(el: string) {
    const tem = concedidas.some((x) => x.toLowerCase() === el.toLowerCase())
    const proximas = tem ? concedidas.filter((x) => x.toLowerCase() !== el.toLowerCase()) : [...concedidas, el]
    await onSubmit({ elements: proximas }, tem ? `Retirou a afinidade com ${el}` : `Concedeu afinidade com ${el}`)
  }

  return (
    <Card className="p-4">
      <span className="mb-2 flex items-center gap-2">
        <SectionTitle>Afinidades elementais</SectionTitle>
        <Help title="Afinidade elemental">
          É o que destrava os jutsus de Liberação (Terra, Vento, Fogo, Água, Relâmpago). Vem do clã, da classe ou do
          talento "Liberação de Natureza". Sem ela, esses jutsus não aparecem na sua lista.
        </Help>
      </span>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {ELEMENTS.map((el) => {
          const doCla = doClan.includes(el)
          const ativa = doCla || concedidas.some((x) => x.toLowerCase() === el.toLowerCase())
          return asGM && !doCla ? (
            <TabChip key={el} active={ativa} onClick={() => alternar(el)} className="px-2.5 py-1 text-xs">
              {el}
            </TabChip>
          ) : (
            <span
              key={el}
              className={`rounded-sm border px-2.5 py-1 font-display text-xs uppercase tracking-[0.08em] ${
                ativa
                  ? 'border-[color:var(--orange)] bg-[color:var(--orange)] text-[color:var(--orange-ink)]'
                  : 'border-[color:var(--line)] text-orange-300/40'
              }`}
              title={doCla ? `Afinidade passiva do clã` : undefined}
            >
              {el}
              {doCla && ' ·clã'}
            </span>
          )
        })}
      </div>
      <p className="mt-2 text-xs text-orange-400/60">
        {asGM
          ? 'Clique para conceder ou retirar. As marcadas com "clã" vêm do clã e não saem.'
          : 'Destravam os jutsus de Liberação. Quem concede é o mestre.'}
      </p>
    </Card>
  )
}

// ---------- Jutsus ----------

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
  clan,
  onSubmit,
  pendingFields,
  asGM,
}: {
  character: Character
  clan?: Clan
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
  // As três portas do manual: rank do nível, Hijutsu do próprio clã e
  // afinidade elemental. O mestre passa por cima de todas — pode conceder
  // qualquer jutsu do catálogo, ou um totalmente personalizado.
  const afinidades = effectiveElements(clan, character.elements)
  const maxRank = maxRankForLevel(charClass, character.level)
  const limiteJutsus = jutsusKnownForLevel(charClass, character.level)
  const listaElegivel = eligibleJutsus({ clanId: character.clanId, elements: afinidades, maxRank })
  const selectableJutsus = asGM ? JUTSU_CATALOG : listaElegivel
  const noLimite = !asGM && limiteJutsus > 0 && jutsus.length >= limiteJutsus

  function startEdit() {
    setJutsus(character.jutsus)
    setEditing(true)
  }

  function addFromCatalog() {
    const catalogMatch = selectableJutsus.find((j) => j.name === jutsuToAdd)
    if (!catalogMatch || jutsus.some((j) => j.name === catalogMatch.name)) return
    if (noLimite) return
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
      {/* O jogador precisa saber por que a lista é curta — senão parece falha. */}
      <p className="mt-1 text-xs leading-relaxed text-orange-400/60">
        Acesso: até <b className="text-orange-200">Rank {maxRank}</b> (nível {character.level})
        {limiteJutsus > 0 && <> · {jutsus.length}/{limiteJutsus} jutsus</>} · afinidade{' '}
        {afinidades.length > 0 ? (
          <b className="text-orange-200">{afinidades.join(', ')}</b>
        ) : (
          <span className="text-orange-400/50">nenhuma</span>
        )}
        {asGM && <> — como mestre você vê o catálogo inteiro.</>}
      </p>
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
              <Select value={jutsuToAdd} onChange={(e) => setJutsuToAdd(e.target.value)} disabled={noLimite}>
                <option value="">
                  {noLimite
                    ? `Você já conhece os ${limiteJutsus} jutsus do nível ${character.level}`
                    : `Selecione um jutsu${asGM ? ' (catálogo completo)' : ' elegível'}...`}
                </option>
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

/** XP é recompensa, não requerimento: só o mestre mexe. O jogador acompanha. */
function XpCard({
  character,
  charClass,
  onSubmit,
  asGM,
}: {
  character: Character
  charClass: ReturnType<typeof CLASSES.find>
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  asGM: boolean
}) {
  const [xpDraft, setXpDraft] = useState(character.xp)
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
      <span className="mb-2 flex items-center gap-2">
        <SectionTitle>Experiência</SectionTitle>
        <Help title="Pontos de Resistência">
          O PR é o número que você precisa alcançar nos seus próprios testes e resistências — e ele CAI conforme o nível
          sobe, então resistir fica mais fácil com o tempo. Condições somam +5 e empurram para o outro lado.
        </Help>
      </span>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="font-display text-2xl text-white">Nível {character.level}</p>
        <p className="text-sm text-orange-300/60">
          {character.xp} XP · próximo em {nextLevelXp}
        </p>
      </div>
      {asGM ? (
        <div className="mt-3 flex items-center gap-2">
          <Input type="number" value={xpDraft} onChange={(e) => setXpDraft(Number(e.target.value))} className="w-28" />
          <Button variant="primary" disabled={xpDraft === character.xp} onClick={apply}>
            Dar XP
          </Button>
        </div>
      ) : (
        <p className="mt-2 text-xs text-orange-400/60">Quem concede XP é o mestre.</p>
      )}
    </Card>
  )
}

// ---------- Descrição ----------

function DescriptionCard({
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
  const [draft, setDraft] = useState<CharacterDescription>(character.description)
  const blocked = pendingFields.has('description')

  function startEdit() {
    setDraft(character.description)
    setEditing(true)
  }

  async function save() {
    // O rank é promoção, não autodescrição: o que o jogador manda volta com o
    // rank que já estava na ficha, mesmo que o campo tenha sido burlado.
    const description = asGM ? draft : { ...draft, rank: character.description.rank }
    await onSubmit({ description }, 'Alterou a descrição do personagem')
    setEditing(false)
  }

  // O rank aparece para todo mundo; só o mestre consegue mexer nele.
  const fields: { key: keyof CharacterDescription; label: string; gmOnly?: boolean }[] = [
    { key: 'rank', label: 'Rank', gmOnly: true },
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
        {fields.map(({ key, label, gmOnly }) => {
          const travado = Boolean(gmOnly) && !asGM
          return (
            <div key={key}>
              <p className="text-xs uppercase text-orange-400/60">
                {label}
                {travado && <span className="ml-1 normal-case text-orange-400/40">· só o mestre altera</span>}
              </p>
              {editing && !travado ? (
                <Textarea
                  rows={key === 'rank' || key === 'title' ? 1 : 2}
                  value={String(draft[key] ?? '')}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                />
              ) : (
                <p className="text-orange-200">{String(character.description[key] || '—')}</p>
              )}
            </div>
          )
        })}
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

function ShopCard({
  character,
  table,
  shopItems,
  onSubmit,
  pendingFields,
}: {
  character: Character
  table: GameTable
  shopItems: ShopItem[]
  onSubmit: (patch: Record<string, unknown>, summary: string) => Promise<void>
  pendingFields: Set<RequestableField>
}) {
  const [tab, setTab] = useState<'weapons' | 'armor' | 'gear'>('weapons')
  const blocked = pendingFields.has('ryo') || pendingFields.has('weapons') || pendingFields.has('armor') || pendingFields.has('equipment')

  /**
   * Compra: o item entra na ficha pelo mesmo caminho do equipamento inicial e
   * da entrega do mestre (`lib/equipment`), então dano, propriedades, consumo
   * e limite de Destreza chegam iguais nos três. Repetido empilha — comprar
   * "Shuriken (5)" quatro vezes dá uma linha com 20, não quatro linhas.
   */
  async function buyWeapon(item: WeaponCatalogEntry) {
    const cost = parseRyoCost(item.cost)
    if (character.ryo < cost) return
    const weapons = stackWeapon(character.weapons, weaponFromCatalog(item), bundleSize(item.name))
    await onSubmit({ weapons, ryo: character.ryo - cost }, `Comprou ${item.name} (${item.cost})`)
  }

  async function buyArmor(item: ArmorCatalogEntry) {
    const cost = parseRyoCost(item.cost)
    if (character.ryo < cost) return
    const armor = stackArmor(character.armor, armorFromCatalog(item))
    await onSubmit({ armor, ryo: character.ryo - cost }, `Comprou ${item.name} (${item.cost})`)
  }

  async function buyGear(item: GearItem) {
    const cost = parseRyoCost(item.cost)
    if (character.ryo < cost) return
    const equipment = stackGear(character.equipment, item.name, 1, item.effect)
    await onSubmit({ equipment, ryo: character.ryo - cost }, `Comprou ${item.name} (${item.cost})`)
  }

  /** Item da forja do mestre: mesma compra, catálogo diferente. */
  async function comprarDaMesa(item: ShopItem) {
    if (character.ryo < item.cost) return
    if (item.kind === 'weapon') {
      const weapons = stackWeapon(character.weapons, weaponFromShopItem(item), bundleSize(item.name))
      await onSubmit({ weapons, ryo: character.ryo - item.cost }, `Comprou ${item.name} (${item.cost} ryo)`)
      return
    }
    if (item.kind === 'armor') {
      const armor = stackArmor(character.armor, armorFromShopItem(item))
      await onSubmit({ armor, ryo: character.ryo - item.cost }, `Comprou ${item.name} (${item.cost} ryo)`)
      return
    }
    if (item.kind === 'puppet') {
      const equipment = addPuppetItem(character.equipment, item.name, item.id, item.description)
      await onSubmit({ equipment, ryo: character.ryo - item.cost }, `Comprou a marionete ${item.name} (${item.cost} ryo)`)
      return
    }
    const equipment = stackGear(character.equipment, item.name, 1, item.description)
    await onSubmit({ equipment, ryo: character.ryo - item.cost }, `Comprou ${item.name} (${item.cost} ryo)`)
  }

  const aberta = table.shopOpen ?? true
  const usaManual = table.shopUsesManual ?? true
  const daMesa = shopItems.filter((i) => i.available && i.stock !== 0)
  const daMesaNaAba = daMesa.filter((i) =>
    // A aba "Itens" leva junto as marionetes forjadas: para quem compra, é
    // mais um item da vitrine.
    tab === 'weapons' ? i.kind === 'weapon' : tab === 'armor' ? i.kind === 'armor' : i.kind === 'gear' || i.kind === 'puppet',
  )

  // Loja fechada pelo mestre não aparece para o grupo.
  if (!aberta) return null

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
          <TabChip key={key} active={tab === key} className="px-3 py-1 text-xs" onClick={() => setTab(key)}>
            {label}
          </TabChip>
        ))}
      </div>
      <div className="flex max-h-64 flex-col gap-1 overflow-y-auto">
        {/* O que o mestre forjou vem primeiro: é o que a campanha tem de próprio. */}
        {daMesaNaAba.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between gap-2 rounded-sm border border-[color:var(--orange)]/40 bg-black/20 px-2.5 py-1.5 text-sm"
          >
            <span className="min-w-0 text-orange-100">
              {i.name}{' '}
              <span className="text-xs text-orange-400/60">
                {i.kind === 'weapon' && `(${i.damage ?? '—'} ${i.damageType ?? ''})`}
                {i.kind === 'armor' && `(+${i.armorBonus ?? 0} CA)`}
                {i.stock !== undefined && ` · ${i.stock} em estoque`}
              </span>
              {i.description && <span className="block text-xs text-orange-300/50">{i.description}</span>}
            </span>
            <Button variant="primary" disabled={blocked || character.ryo < i.cost} onClick={() => comprarDaMesa(i)}>
              {i.cost} ryo
            </Button>
          </div>
        ))}
        {!usaManual && daMesaNaAba.length === 0 && (
          <p className="text-xs text-orange-300/50">Nada desta categoria à venda nesta mesa.</p>
        )}
        {usaManual && tab === 'weapons' &&
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
        {usaManual && tab === 'armor' &&
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
        {usaManual && tab === 'gear' &&
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
