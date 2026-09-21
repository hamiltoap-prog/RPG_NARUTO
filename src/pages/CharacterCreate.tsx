import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, Textarea } from '../components/ui'

import { CLASSES } from '../data/classes'
import { JUTSU_CATALOG } from '../data/jutsus'
import { effectiveElements, eligibleJutsus, jutsusKnownForLevel, maxRankForLevel } from '../lib/jutsuAccess'
import { averageStartingWealth, calculateDerivedStats, totalAttributes } from '../lib/characterMath'
import { createCharacter } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { Attributes, Character, CharacterDescription, Clan, GameTable, InventoryItem, Jutsu } from '../types'
import { newId } from '../lib/id'
import { allClans, clanIdFromName, emptyClan } from '../lib/clans'
import { listenCustomClans, saveCustomClan } from '../lib/store'
import { xpForLevel } from '../data/xpTable'
import { SHINOBI_RANKS, suggestedRank } from '../data/ranks'
import { ELEMENTS, clanElements } from '../lib/jutsuAccess'

function formatJutsuDetails(entry: (typeof JUTSU_CATALOG)[number]): string {
  return [
    `${entry.classification} · ${entry.rank}`,
    `Tempo: ${entry.castingTime} · Alcance: ${entry.range} · Duração: ${entry.duration}`,
    entry.description,
  ]
    .filter(Boolean)
    .join('\n')
}

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]
const STEPS = ['Clã', 'Classe', 'Atributos', 'Afinidade', 'Descrição', 'Equipamento', 'Jutsus', 'Imagem & Resumo'] as const

const emptyDescription: CharacterDescription = {
  // Todo mundo começa Genin; subir de rank é decisão do mestre.
  rank: 'Genin',
  title: '',
  appearance: '',
  personalityTraits: '',
  ideals: '',
  bonds: '',
  flaws: '',
}

export function CharacterCreate({
  table,
  uid,
  characterName,
  onCreated,
  /** Mestre montando uma ficha (dele ou de um NPC): escolhe o nível e o posto
   * livremente, sem o teto que vale para o jogador. */
  asGM = false,
  /** A ficha nasce como NPC conduzido pelo mestre. */
  asNPC = false,
}: {
  table: GameTable
  uid: string
  characterName: string
  onCreated: (c: Character) => void
  asGM?: boolean
  asNPC?: boolean
}) {
  const [step, setStep] = useState(0)
  const [clanId, setClanId] = useState('')
  const [customClans, setCustomClans] = useState<Clan[]>([])
  const [level, setLevel] = useState(Math.max(1, table.startingLevel ?? 1))
  const [chosenElements, setChosenElements] = useState<string[]>([])

  useEffect(() => listenCustomClans(table.id, setCustomClans), [table.id])
  const [classId, setClassId] = useState('')
  const [assigned, setAssigned] = useState<Partial<Record<(typeof ATTRIBUTE_KEYS)[number], number>>>({})
  const [description, setDescription] = useState<CharacterDescription>(emptyDescription)
  const [equipment, setEquipment] = useState<InventoryItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [jutsus, setJutsus] = useState<Jutsu[]>([])
  const [jutsuToAdd, setJutsuToAdd] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [criandoCla, setCriandoCla] = useState<Clan | null>(null)
  const [clanElementsDraft, setClanElementsDraft] = useState<string[]>([])
  const [salvandoCla, setSalvandoCla] = useState(false)

  /** Guarda o clã na mesa e já o escolhe para este personagem. */
  async function salvarCla() {
    if (!criandoCla?.name.trim()) return
    setSalvandoCla(true)
    try {
      const id = clanIdFromName(criandoCla.name)
      const bonusText = ATTRIBUTE_KEYS.filter((k) => criandoCla.bonuses[k] !== 0)
        .map((k) => `${criandoCla.bonuses[k] > 0 ? '+' : ''}${criandoCla.bonuses[k]} ${ATTRIBUTE_LABELS[k]}`)
        .join(', ')
      const featuresText = clanElementsDraft.length ? `Afinidade Passiva: ${clanElementsDraft.join(', ')}.` : ''
      await saveCustomClan(table.id, { ...criandoCla, id, bonusText, featuresText })
      setClanId(id)
      setCriandoCla(null)
      setClanElementsDraft([])
    } finally {
      setSalvandoCla(false)
    }
  }

  const sugestao = suggestedRank(level)
  // O posto acompanha o nível até o mestre escolher um à mão.
  const [rankTocado, setRankTocado] = useState(false)
  useEffect(() => {
    if (!rankTocado) setDescription((d) => ({ ...d, rank: suggestedRank(level).label }))
  }, [level, rankTocado])

  const clansDaMesa = allClans(customClans)
  const clan = clansDaMesa.find((c) => c.id === clanId)
  const charClass = CLASSES.find((c) => c.id === classId)

  const baseAttributes: Attributes = useMemo(() => {
    const out = {} as Attributes
    for (const key of ATTRIBUTE_KEYS) out[key] = assigned[key] ?? 10
    return out
  }, [assigned])

  const finalAttributes = totalAttributes(baseAttributes, clan)
  const derived = charClass ? calculateDerivedStats(finalAttributes, charClass, level) : null

  function assignValue(attr: (typeof ATTRIBUTE_KEYS)[number], value: number) {
    setAssigned((prev) => {
      const next = { ...prev }
      for (const k of Object.keys(next) as (typeof ATTRIBUTE_KEYS)[number][]) {
        if (next[k] === value) delete next[k]
      }
      if (next[attr] === value) delete next[attr]
      else next[attr] = value
      return next
    })
  }

  function usedValues() {
    return new Set(Object.values(assigned))
  }

  function loadClassEquipment() {
    if (!charClass) return
    setEquipment(charClass.startingEquipment.map((name) => ({ id: newId(), name, quantity: 1 })))
  }

  function addEquipmentItem() {
    if (!newItemName.trim()) return
    setEquipment((prev) => [...prev, { id: newId(), name: newItemName.trim(), quantity: 1 }])
    setNewItemName('')
  }

  function removeEquipmentItem(id: string) {
    setEquipment((prev) => prev.filter((i) => i.id !== id))
  }

  function changeQty(id: string, delta: number) {
    setEquipment((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i)))
  }

  // As do clã vêm de graça; as escolhidas somam por cima.
  const doClan = clanElements(clan)
  /** Quantas afinidades o jogador escolhe na criação. Uma, se o clã não deu
   * nenhuma — é o que a "Liberação de Natureza" concede. Clã com afinidade
   * passiva já entrega a dele, então não sobra escolha. */
  const livresParaEscolher = doClan.length > 0 ? 0 : 1
  const afinidades = effectiveElements(clan, chosenElements)
  const maxRank = maxRankForLevel(charClass, level)
  const listaElegivel = eligibleJutsus({ clanId, elements: afinidades, maxRank })
  const limiteJutsus = jutsusKnownForLevel(charClass, level)

  function addJutsu() {
    const catalogMatch = listaElegivel.find((j) => j.name === jutsuToAdd)
    if (!catalogMatch || jutsus.some((j) => j.name === catalogMatch.name)) return
    if (limiteJutsus > 0 && jutsus.length >= limiteJutsus) return
    setJutsus((prev) => [...prev, { id: newId(), name: catalogMatch.name, details: formatJutsuDetails(catalogMatch), chakraCost: catalogMatch.cost }])
    setJutsuToAdd('')
  }

  function removeJutsu(id: string) {
    setJutsus((prev) => prev.filter((j) => j.id !== id))
  }

  // Um item por passo, na ordem de STEPS. Afinidade em diante não travam:
  // dá para seguir sem escolher elemento, equipamento ou jutsu.
  const canNext = [
    Boolean(clanId),
    Boolean(classId),
    Object.keys(assigned).length === ATTRIBUTE_KEYS.length,
    true,
    true,
    true,
    true,
    true,
  ]

  async function handleSubmit() {
    if (!clan || !charClass || !derived) return
    setSaving(true)
    setError('')
    try {
      const now = Date.now()
      const character: Omit<Character, 'id'> = {
        tableId: table.id,
        ownerUid: uid,
        name: characterName,
        clanId: clan.id,
        classId: charClass.id,
        level,
        xp: xpForLevel(level),
        elements: chosenElements,
        ...(asNPC ? { isNPC: true, visible: false } : {}),
        attributes: finalAttributes,
        modifiers: derived.modifiers,
        hp: { current: derived.hp, max: derived.hp },
        chakra: { current: derived.chakra, max: derived.chakra },
        armorClass: derived.armorClass,
        proficiencyBonus: derived.proficiencyBonus,
        resistancePoints: derived.resistancePoints,
        description,
        equipment,
        weapons: [],
        armor: [],
        jutsus,
        proficiencies: [...clan.skillProficiencies],
        condition: 'Normal',
        imageUrl: imageUrl.trim(),
        ryo: averageStartingWealth(charClass.startingWealth),
        notes: '',
        createdAt: now,
        updatedAt: now,
        isAlive: true,
      }
      const created = await createCharacter(table.id, character)
      onCreated(created)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar personagem.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 p-4 pb-16">
      <Card className="p-4">
        <h1 className="font-serif text-2xl text-orange-100">Criando {characterName}</h1>
        <p className="text-sm text-orange-300/60">Mesa: {table.name}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`rounded-sm border px-2.5 py-1 font-display text-xs uppercase tracking-[0.08em] ${
                i === step
                  ? 'border-[color:var(--orange)] bg-[color:var(--orange)] font-semibold text-[color:var(--orange-ink)]'
                  : i < step
                    ? 'border-emerald-700/60 text-emerald-300'
                    : 'border-[color:var(--line)] text-orange-300/50'
              }`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
      </Card>

      {step === 0 && (
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle>Escolha o Clã</SectionTitle>
            {/* O mestre inventa um clã sem sair do assistente: fechar a ficha
                no meio para ir até a aba Clãs perderia tudo que já escolheu. */}
            {asGM && (
              <Button variant="secondary" onClick={() => setCriandoCla(criandoCla ? null : emptyClan(''))}>
                {criandoCla ? 'cancelar' : '+ Criar clã novo'}
              </Button>
            )}
          </div>

          {criandoCla && (
            <div className="well flex flex-col gap-2 rounded-sm p-3">
              <div className="flex flex-wrap gap-2">
                <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
                  nome do clã
                  <Input
                    value={criandoCla.name}
                    onChange={(e) => setCriandoCla({ ...criandoCla, name: e.target.value })}
                    placeholder="Kazehana"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                  deslocamento
                  <Input value={criandoCla.speed} onChange={(e) => setCriandoCla({ ...criandoCla, speed: e.target.value })} className="w-28" />
                </label>
              </div>
              <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                descrição
                <Textarea rows={2} value={criandoCla.description} onChange={(e) => setCriandoCla({ ...criandoCla, description: e.target.value })} />
              </label>
              <div>
                <p className="mb-1 text-xs text-orange-400/60">Bônus de atributo</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {ATTRIBUTE_KEYS.map((k) => (
                    <label key={k} className="flex flex-col gap-1 text-[11px] text-orange-400/60">
                      {ATTRIBUTE_LABELS[k]}
                      <Input
                        type="number"
                        value={criandoCla.bonuses[k]}
                        onChange={(e) => setCriandoCla({ ...criandoCla, bonuses: { ...criandoCla.bonuses, [k]: Number(e.target.value) || 0 } })}
                      />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs text-orange-400/60">Afinidade passiva (opcional)</p>
                <div className="flex flex-wrap gap-1.5">
                  {ELEMENTS.map((el) => {
                    const ativo = clanElementsDraft.includes(el)
                    return (
                      <button
                        key={el}
                        onClick={() => setClanElementsDraft((p) => (ativo ? p.filter((x) => x !== el) : [...p, el]))}
                        className={`rounded-sm border px-2.5 py-1 font-display text-xs uppercase tracking-[0.08em] transition ${
                          ativo
                            ? 'border-[color:var(--orange)] bg-[color:var(--orange)] text-[color:var(--orange-ink)]'
                            : 'border-[color:var(--line)] text-orange-300/50 hover:border-[color:var(--line-strong)]'
                        }`}
                      >
                        {el}
                      </button>
                    )
                  })}
                </div>
              </div>
              <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                perícias do clã (separadas por vírgula)
                <Input
                  value={criandoCla.skillProficiencies.join(', ')}
                  onChange={(e) =>
                    setCriandoCla({ ...criandoCla, skillProficiencies: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })
                  }
                  placeholder="Percepção, Furtividade"
                />
              </label>
              <Button variant="primary" disabled={!criandoCla.name.trim() || salvandoCla} onClick={salvarCla}>
                {salvandoCla ? 'Guardando...' : 'Guardar clã e usar neste personagem'}
              </Button>
            </div>
          )}

          <div className="grid gap-2 sm:grid-cols-2">
            {clansDaMesa.map((c) => (
              <button
                key={c.id}
                onClick={() => setClanId(c.id)}
                className={`rounded-lg border p-3 text-left text-sm transition ${
                  clanId === c.id ? 'border-orange-500 bg-orange-900/20' : 'border-orange-900/30 bg-black/20 hover:border-orange-700'
                }`}
              >
                <p className="font-semibold text-orange-100">{c.name}</p>
                {c.quote && <p className="mt-0.5 text-xs italic text-orange-400/50">"{c.quote}"</p>}
                <p className="mt-0.5 text-xs text-orange-300/60">{c.description}</p>
                <p className="mt-1 text-xs text-emerald-400/80">{c.bonusText}</p>
                {c.skillProficiencies.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.skillProficiencies.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                )}
                {clanId === c.id && <p className="mt-2 text-xs text-orange-300/70">{c.featuresText}</p>}
              </button>
            ))}
          </div>
        </Card>
      )}

      {step === 1 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Escolha a Classe</SectionTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => setClassId(c.id)}
                className={`rounded-lg border p-3 text-left text-sm transition ${
                  classId === c.id ? 'border-orange-500 bg-orange-900/20' : 'border-orange-900/30 bg-black/20 hover:border-orange-700'
                }`}
              >
                <p className="font-semibold text-orange-100">{c.name}</p>
                <p className="mt-0.5 text-xs text-orange-300/60">{c.description}</p>
                <p className="mt-1 text-xs text-orange-400/60">
                  Vida {c.hitDie} · Chakra {c.chakraDie} · Atributo primário {c.primaryAbility}
                </p>
                <p className="mt-1 text-xs text-orange-400/50">Perícias: {c.skillProficiencies}</p>
                {classId === c.id && (
                  <p className="mt-2 whitespace-pre-line text-xs text-orange-300/70">{c.subclassesText}</p>
                )}
              </button>
            ))}
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Distribua os Atributos</SectionTitle>
          <p className="text-xs text-orange-300/60">
            Atribua cada valor da matriz padrão ({STANDARD_ARRAY.join(', ')}) a um atributo diferente. O bônus do clã{' '}
            {clan?.name} é somado automaticamente.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {ATTRIBUTE_KEYS.map((attr) => (
              <div key={attr} className="rounded-lg border border-orange-900/40 bg-black/20 p-3">
                <p className="text-xs uppercase text-orange-400/60">{ATTRIBUTE_LABELS[attr]}</p>
                <p className="text-2xl text-orange-100">
                  {finalAttributes[attr]}
                  {clan && clan.bonuses[attr] !== 0 && (
                    /* Antes de escolher o valor não há conta a mostrar — só o
                     * bônus do clã. Depois, a conta inteira: 10+1. */
                    <span className="ml-1 text-xs text-emerald-400">
                      {assigned[attr] === undefined
                        ? `(${clan.bonuses[attr] > 0 ? '+' : ''}${clan.bonuses[attr]} do clã)`
                        : `(${assigned[attr]}${clan.bonuses[attr] > 0 ? '+' : ''}${clan.bonuses[attr]})`}
                    </span>
                  )}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {STANDARD_ARRAY.map((value) => {
                    const usedElsewhere = usedValues().has(value) && assigned[attr] !== value
                    return (
                      <button
                        key={value}
                        disabled={usedElsewhere}
                        onClick={() => assignValue(attr, value)}
                        className={`rounded-md border px-2 py-0.5 text-xs ${
                          assigned[attr] === value
                            ? 'border-orange-500 bg-orange-700 text-white'
                            : usedElsewhere
                              ? 'cursor-not-allowed border-orange-900/20 text-orange-400/20'
                              : 'border-orange-900/40 text-orange-200 hover:border-orange-600'
                        }`}
                      >
                        {value}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
          {derived && (
            <div className="mt-2 flex flex-wrap gap-4 rounded-lg border border-orange-900/30 bg-black/20 p-3 text-sm text-orange-200">
              <span>PV: {derived.hp}</span>
              <span>Chakra: {derived.chakra}</span>
              <span>CA: {derived.armorClass}</span>
              <span>Bônus de Proficiência: +{derived.proficiencyBonus}</span>
            </div>
          )}
        </Card>
      )}

      {step === 3 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Afinidade Elemental</SectionTitle>
          <p className="text-xs leading-relaxed text-orange-300/60">
            A afinidade é o que destrava os jutsus de Liberação (Terra, Vento, Fogo, Água e Relâmpago). Pelo manual ela
            vem do clã, da classe ou do talento "Liberação de Natureza" — sem ela, esses jutsus ficam fora da sua lista.
          </p>

          {doClan.length > 0 && (
            <div className="well rounded-sm p-3">
              <p className="font-display text-xs uppercase tracking-[0.12em] text-orange-400/60">Do clã {clan?.name}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {doClan.map((el) => (
                  <span
                    key={el}
                    className="rounded-sm border border-[color:var(--orange)] bg-[color:var(--orange)] px-2.5 py-1 font-display text-xs uppercase tracking-[0.08em] text-[color:var(--orange-ink)]"
                  >
                    {el}
                  </span>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-orange-400/60">Afinidade passiva — já é sua, sem gastar escolha.</p>
            </div>
          )}

          <div>
            <p className="mb-1.5 text-xs text-orange-400/60">
              {asGM
                ? 'Como mestre, marque quantas afinidades esta ficha tiver.'
                : `Escolha ${livresParaEscolher > 1 ? `até ${livresParaEscolher} afinidades` : 'uma afinidade'} — ou nenhuma, se preferir um shinobi sem Liberação.`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ELEMENTS.filter((el) => !doClan.includes(el)).map((el) => {
                const ativo = chosenElements.includes(el)
                const cheio = !asGM && !ativo && chosenElements.length >= livresParaEscolher
                return (
                  <button
                    key={el}
                    disabled={cheio}
                    onClick={() => setChosenElements((p) => (ativo ? p.filter((x) => x !== el) : [...p, el]))}
                    className={`rounded-sm border px-3 py-1.5 font-display text-sm uppercase tracking-[0.08em] transition ${
                      ativo
                        ? 'border-[color:var(--orange)] bg-[color:var(--orange)] text-[color:var(--orange-ink)]'
                        : cheio
                          ? 'cursor-not-allowed border-[color:var(--line)] text-orange-400/25'
                          : 'border-[color:var(--line)] text-orange-300/60 hover:border-[color:var(--line-strong)] hover:text-white'
                    }`}
                  >
                    {el}
                  </button>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-orange-400/60">
            Jutsus elegíveis com esta escolha: <b className="text-white">{listaElegivel.length}</b> de{' '}
            {JUTSU_CATALOG.length}. O mestre pode conceder mais afinidades depois.
          </p>
        </Card>
      )}

      {step === 4 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Descrição do Personagem</SectionTitle>
          {/* Nível e posto: o jogador vê, o mestre decide. */}
          <div className="well flex flex-wrap items-end gap-3 rounded-sm p-3">
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              nível
              {asGM ? (
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={level}
                  onChange={(e) => setLevel(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
                  className="w-24"
                />
              ) : (
                <span className="font-display text-2xl leading-none text-white">{level}</span>
              )}
            </label>
            <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
              posto shinobi
              {asGM ? (
                <div className="flex gap-2">
                  <Select
                    value={SHINOBI_RANKS.some((r) => r.label === description.rank) ? description.rank : 'outro'}
                    onChange={(e) => {
                      if (e.target.value === 'outro') return
                      setRankTocado(true)
                      setDescription((d) => ({ ...d, rank: e.target.value }))
                    }}
                    className="w-56"
                  >
                    {SHINOBI_RANKS.map((r) => (
                      <option key={r.id} value={r.label}>
                        {r.label}
                        {r.max > 0 ? ` (níveis ${r.min}–${r.max})` : ''}
                      </option>
                    ))}
                    <option value="outro">outro (escreva ao lado)</option>
                  </Select>
                  <Input
                    value={description.rank}
                    onChange={(e) => {
                      setRankTocado(true)
                      setDescription((d) => ({ ...d, rank: e.target.value }))
                    }}
                    placeholder="Tokubetsu Jonin, ANBU..."
                  />
                </div>
              ) : (
                <span className="font-display uppercase tracking-[0.1em] text-white">{description.rank}</span>
              )}
            </label>
            {!asGM && (
              <p className="basis-full text-xs text-orange-400/60">
                Nível e posto são do mestre — ele promove e concede XP durante a campanha.
              </p>
            )}
            {asGM && sugestao.label !== description.rank && (
              <button
                className="basis-full text-left text-xs text-[color:var(--orange)] hover:underline"
                onClick={() => setDescription((d) => ({ ...d, rank: sugestao.label }))}
              >
                O manual põe o nível {level} na faixa de {sugestao.label} — usar esse posto?
              </button>
            )}
          </div>
          <Input
            placeholder="Título/Apelido"
            value={description.title}
            onChange={(e) => setDescription((d) => ({ ...d, title: e.target.value }))}
          />
          <Textarea
            rows={2}
            placeholder="Aparência"
            value={description.appearance}
            onChange={(e) => setDescription((d) => ({ ...d, appearance: e.target.value }))}
          />
          <Textarea
            rows={2}
            placeholder="Traços de personalidade"
            value={description.personalityTraits}
            onChange={(e) => setDescription((d) => ({ ...d, personalityTraits: e.target.value }))}
          />
          <Textarea
            rows={2}
            placeholder="Ideais"
            value={description.ideals}
            onChange={(e) => setDescription((d) => ({ ...d, ideals: e.target.value }))}
          />
          <Textarea
            rows={2}
            placeholder="Vínculos"
            value={description.bonds}
            onChange={(e) => setDescription((d) => ({ ...d, bonds: e.target.value }))}
          />
          <Textarea
            rows={2}
            placeholder="Defeitos"
            value={description.flaws}
            onChange={(e) => setDescription((d) => ({ ...d, flaws: e.target.value }))}
          />
        </Card>
      )}

      {step === 5 && (
        <Card className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <SectionTitle>Equipamento Inicial</SectionTitle>
            {charClass && equipment.length === 0 && (
              <Button variant="secondary" onClick={loadClassEquipment}>
                Carregar equipamento da classe
              </Button>
            )}
          </div>
          <p className="text-xs text-orange-300/60">
            {charClass ? `Sugestão da classe (${charClass.name}): ${charClass.startingEquipment.join(', ')} · ${charClass.startingWealth}` : ''}
          </p>
          {equipment.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-orange-900/30 bg-black/20 px-3 py-1.5 text-sm">
              <span className="text-orange-100">{item.name}</span>
              <span className="flex items-center gap-2">
                <button className="text-orange-400 hover:text-orange-200" onClick={() => changeQty(item.id, -1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button className="text-orange-400 hover:text-orange-200" onClick={() => changeQty(item.id, 1)}>
                  +
                </button>
                <button className="text-red-400 hover:text-red-200" onClick={() => removeEquipmentItem(item.id)}>
                  remover
                </button>
              </span>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Item personalizado" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} />
            <Button onClick={addEquipmentItem}>Adicionar</Button>
          </div>
        </Card>
      )}

      {step === 6 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Jutsus</SectionTitle>
          <p className="text-xs leading-relaxed text-orange-300/60">
            A lista traz só o que {characterName || 'seu personagem'} pode aprender no 1º nível: até{' '}
            <b className="text-white">Rank {maxRank}</b>, Hijutsu do clã <b className="text-white">{clan?.name}</b> e
            jutsus elementais das afinidades que você tem
            {afinidades.length > 0 ? (
              <> — <b className="text-white">{afinidades.join(', ')}</b>, do clã</>
            ) : (
              <> — <b className="text-white">nenhuma por enquanto</b>, então Liberações de Terra, Vento, Fogo, Água e
                Relâmpago ficam de fora</>
            )}
            . Afinidade nova e jutsu fora da lista são liberação do mestre.
          </p>
          {limiteJutsus > 0 && (
            <p className="font-display text-xs uppercase tracking-[0.1em] text-orange-400/60">
              Jutsus conhecidos: {jutsus.length} de {limiteJutsus}
            </p>
          )}
          {jutsus.map((j) => (
            <div key={j.id} className="rounded-lg border border-orange-900/30 bg-black/20 p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-orange-100">
                  {j.name} {j.chakraCost && <span className="text-xs font-normal text-orange-400/60">({j.chakraCost})</span>}
                </p>
                <button className="text-xs text-red-400 hover:text-red-200" onClick={() => removeJutsu(j.id)}>
                  remover
                </button>
              </div>
              {j.details && <p className="mt-1 whitespace-pre-line text-xs text-orange-300/60">{j.details}</p>}
            </div>
          ))}
          <div className="flex gap-2 rounded-lg border border-orange-900/30 bg-black/10 p-3">
            <Select
              value={jutsuToAdd}
              onChange={(e) => setJutsuToAdd(e.target.value)}
              disabled={limiteJutsus > 0 && jutsus.length >= limiteJutsus}
            >
              <option value="">
                {limiteJutsus > 0 && jutsus.length >= limiteJutsus
                  ? `Você já conhece os ${limiteJutsus} jutsus do 1º nível`
                  : 'Selecione um jutsu elegível...'}
              </option>
              {listaElegivel
                .filter((j) => !jutsus.some((added) => added.name === j.name))
                .map((j) => (
                  <option key={j.name} value={j.name}>
                    {j.name} ({j.category}
                    {j.cost ? ` · ${j.cost}` : ''})
                  </option>
                ))}
            </Select>
            <Button onClick={addJutsu} disabled={!jutsuToAdd || (limiteJutsus > 0 && jutsus.length >= limiteJutsus)} className="shrink-0">
              Adicionar
            </Button>
          </div>
        </Card>
      )}

      {step === 7 && (
        <Card className="flex flex-col gap-4 p-4">
          <SectionTitle>Imagem e Resumo</SectionTitle>
          <div className="flex items-center gap-3">
            <Avatar url={imageUrl} name={characterName} size={64} />
            <Input placeholder="Cole a URL de uma imagem (opcional)" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
          </div>
          <div className="grid gap-2 text-sm text-orange-200 sm:grid-cols-2">
            <p>
              <span className="text-orange-400/60">Nome:</span> {characterName}
            </p>
            <p>
              <span className="text-orange-400/60">Clã:</span> {clan?.name}
            </p>
            <p>
              <span className="text-orange-400/60">Classe:</span> {charClass?.name}
            </p>
            <p>
              <span className="text-orange-400/60">Rank:</span> {description.rank || '—'}
            </p>
            {derived && (
              <>
                <p>
                  <span className="text-orange-400/60">PV:</span> {derived.hp} · <span className="text-orange-400/60">Chakra:</span> {derived.chakra} ·{' '}
                  <span className="text-orange-400/60">CA:</span> {derived.armorClass} · <span className="text-orange-400/60">PR:</span>{' '}
                  {derived.resistancePoints}
                </p>
              </>
            )}
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Voltar
        </Button>
        {step < STEPS.length - 1 ? (
          <Button variant="primary" disabled={!canNext[step]} onClick={() => setStep((s) => s + 1)}>
            Próximo
          </Button>
        ) : (
          <Button variant="primary" disabled={saving} onClick={handleSubmit}>
            {saving ? 'Criando...' : 'Criar Personagem'}
          </Button>
        )}
      </div>
    </div>
  )
}
