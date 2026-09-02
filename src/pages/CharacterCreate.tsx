import { useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Textarea } from '../components/ui'
import { CLANS } from '../data/clans'
import { CLASSES } from '../data/classes'
import { calculateDerivedStats, totalAttributes } from '../lib/characterMath'
import { createCharacter } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { Attributes, Character, CharacterDescription, GameTable, InventoryItem, Jutsu } from '../types'
import { newId } from '../lib/id'

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]
const STEPS = ['Clã', 'Classe', 'Atributos', 'Descrição', 'Equipamento', 'Jutsus', 'Imagem & Resumo'] as const

const emptyDescription: CharacterDescription = {
  rank: '',
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
}: {
  table: GameTable
  uid: string
  characterName: string
  onCreated: (c: Character) => void
}) {
  const [step, setStep] = useState(0)
  const [clanId, setClanId] = useState('')
  const [classId, setClassId] = useState('')
  const [assigned, setAssigned] = useState<Partial<Record<(typeof ATTRIBUTE_KEYS)[number], number>>>({})
  const [description, setDescription] = useState<CharacterDescription>(emptyDescription)
  const [equipment, setEquipment] = useState<InventoryItem[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [jutsus, setJutsus] = useState<Jutsu[]>([])
  const [newJutsuName, setNewJutsuName] = useState('')
  const [newJutsuDetails, setNewJutsuDetails] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const clan = CLANS.find((c) => c.id === clanId)
  const charClass = CLASSES.find((c) => c.id === classId)

  const baseAttributes: Attributes = useMemo(() => {
    const out = {} as Attributes
    for (const key of ATTRIBUTE_KEYS) out[key] = assigned[key] ?? 10
    return out
  }, [assigned])

  const finalAttributes = totalAttributes(baseAttributes, clan)
  const derived = charClass ? calculateDerivedStats(finalAttributes, charClass, 1) : null

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

  function addJutsu() {
    if (!newJutsuName.trim()) return
    setJutsus((prev) => [...prev, { id: newId(), name: newJutsuName.trim(), details: newJutsuDetails.trim() }])
    setNewJutsuName('')
    setNewJutsuDetails('')
  }

  function removeJutsu(id: string) {
    setJutsus((prev) => prev.filter((j) => j.id !== id))
  }

  const canNext = [
    Boolean(clanId),
    Boolean(classId),
    Object.keys(assigned).length === ATTRIBUTE_KEYS.length,
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
        level: 1,
        xp: 0,
        attributes: finalAttributes,
        modifiers: derived.modifiers,
        hp: { current: derived.hp, max: derived.hp },
        chakra: { current: derived.chakra, max: derived.chakra },
        armorClass: derived.armorClass,
        proficiencyBonus: derived.proficiencyBonus,
        description,
        equipment,
        weapons: [],
        armor: [],
        jutsus,
        proficiencies: [...new Set([...clan.proficiencies, ...charClass.skillProficiencies])],
        condition: 'Normal',
        imageUrl: imageUrl.trim(),
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
              className={`rounded-full px-2.5 py-1 text-xs ${
                i === step ? 'bg-orange-700 text-white' : i < step ? 'bg-emerald-900/50 text-emerald-200' : 'bg-[#241a0f] text-orange-300/50'
              }`}
            >
              {i + 1}. {label}
            </span>
          ))}
        </div>
      </Card>

      {step === 0 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Escolha o Clã</SectionTitle>
          <div className="grid gap-2 sm:grid-cols-2">
            {CLANS.map((c) => (
              <button
                key={c.id}
                onClick={() => setClanId(c.id)}
                className={`rounded-lg border p-3 text-left text-sm transition ${
                  clanId === c.id ? 'border-orange-500 bg-orange-900/20' : 'border-orange-900/30 bg-black/20 hover:border-orange-700'
                }`}
              >
                <p className="font-semibold text-orange-100">{c.name}</p>
                <p className="mt-0.5 text-xs text-orange-300/60">{c.description}</p>
                {c.specialAbilities.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {c.specialAbilities.map((a) => (
                      <Badge key={a}>{a}</Badge>
                    ))}
                  </div>
                )}
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
                  Vida {c.hitDie} · Chakra {c.chakraDie} · Atributo primário {ATTRIBUTE_LABELS[c.primaryAbility]}
                </p>
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
                    <span className="ml-1 text-xs text-emerald-400">
                      ({assigned[attr] ?? '-'}
                      {clan.bonuses[attr] > 0 ? '+' : ''}
                      {clan.bonuses[attr] !== 0 ? clan.bonuses[attr] : ''})
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
          <SectionTitle>Descrição do Personagem</SectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              placeholder="Rank (Genin, Chunin...)"
              value={description.rank}
              onChange={(e) => setDescription((d) => ({ ...d, rank: e.target.value }))}
            />
            <Input
              placeholder="Título/Apelido"
              value={description.title}
              onChange={(e) => setDescription((d) => ({ ...d, title: e.target.value }))}
            />
          </div>
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

      {step === 4 && (
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

      {step === 5 && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>Jutsus</SectionTitle>
          <p className="text-xs text-orange-300/60">
            Descreva os jutsus iniciais do personagem (combine com o mestre quais estão liberados no nível 1).
          </p>
          {jutsus.map((j) => (
            <div key={j.id} className="rounded-lg border border-orange-900/30 bg-black/20 p-3 text-sm">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-orange-100">{j.name}</p>
                <button className="text-xs text-red-400 hover:text-red-200" onClick={() => removeJutsu(j.id)}>
                  remover
                </button>
              </div>
              {j.details && <p className="mt-1 text-xs text-orange-300/60">{j.details}</p>}
            </div>
          ))}
          <div className="flex flex-col gap-2 rounded-lg border border-orange-900/30 bg-black/10 p-3">
            <Input placeholder="Nome do jutsu" value={newJutsuName} onChange={(e) => setNewJutsuName(e.target.value)} />
            <Textarea rows={2} placeholder="Efeito / custo de chakra" value={newJutsuDetails} onChange={(e) => setNewJutsuDetails(e.target.value)} />
            <Button onClick={addJutsu} className="self-start">
              Adicionar Jutsu
            </Button>
          </div>
        </Card>
      )}

      {step === 6 && (
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
                  <span className="text-orange-400/60">CA:</span> {derived.armorClass}
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
