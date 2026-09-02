import { useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select } from './ui'
import { applyCriticalMultiplier, rollD20, rollDice } from '../lib/dice'
import { addLogEntry } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Character, GameTable } from '../types'

const ATTACK_PRESETS: { label: string; attribute: AttributeKey }[] = [
  { label: 'Ninjutsu', attribute: 'intelligence' },
  { label: 'Genjutsu', attribute: 'wisdom' },
  { label: 'Taijutsu (Força)', attribute: 'strength' },
  { label: 'Taijutsu (Destreza)', attribute: 'dexterity' },
  { label: 'Bukijutsu (Força)', attribute: 'strength' },
  { label: 'Bukijutsu (Destreza)', attribute: 'dexterity' },
  { label: 'Arma à Distância', attribute: 'dexterity' },
]

export function ActionRoller({ table, character, actorName }: { table: GameTable; character: Character; actorName: string }) {
  const [mode, setMode] = useState<'check' | 'attack' | 'damage'>('check')

  const [attr, setAttr] = useState<AttributeKey>('strength')
  const [skillLabel, setSkillLabel] = useState('')
  const [proficient, setProficient] = useState(false)

  const [attackPreset, setAttackPreset] = useState(0)
  const [attackProficient, setAttackProficient] = useState(true)

  const [damageNotation, setDamageNotation] = useState('1d6')
  const [critical, setCritical] = useState(false)

  const [lastResult, setLastResult] = useState('')

  async function postLog(summary: string) {
    await addLogEntry(table.id, { actorName, actorType: 'player', characterId: character.id, kind: 'roll', summary })
    setLastResult(summary)
  }

  async function rollCheck() {
    const result = rollD20(character.modifiers[attr], proficient, character.proficiencyBonus)
    const label = skillLabel.trim() || `Teste de ${ATTRIBUTE_LABELS[attr]}`
    const critNote = result.isCritical ? ' — 20 natural!' : result.isFumble ? ' — 1 natural (falha)' : ''
    await postLog(
      `${label}: d20(${result.roll}) + ${result.modifier}${proficient ? ` + ${result.proficiencyBonus} (prof.)` : ''} = ${result.total}${critNote}`,
    )
  }

  async function rollAttack() {
    const preset = ATTACK_PRESETS[attackPreset]
    const result = rollD20(character.modifiers[preset.attribute], attackProficient, character.proficiencyBonus)
    const critNote = result.isCritical ? ' — acerto crítico!' : result.isFumble ? ' — falha crítica!' : ''
    await postLog(
      `Ataque (${preset.label}): d20(${result.roll}) + ${result.modifier}${
        attackProficient ? ` + ${result.proficiencyBonus} (prof.)` : ''
      } = ${result.total}${critNote}`,
    )
  }

  async function rollDamageRoll() {
    try {
      let result = rollDice(damageNotation)
      let critNote = ''
      if (critical) {
        result = applyCriticalMultiplier(result, character.proficiencyBonus)
        critNote = ` × ${character.proficiencyBonus} (crítico)`
      }
      await postLog(`Dano (${damageNotation}): [${result.rolls.join(', ')}]${critNote} + ${result.modifier} = ${result.total}`)
    } catch (err) {
      setLastResult(err instanceof Error ? err.message : 'Notação inválida.')
    }
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <SectionTitle>Ações</SectionTitle>
      <div className="flex gap-1.5">
        {(
          [
            ['check', 'Teste'],
            ['attack', 'Ataque'],
            ['damage', 'Dano'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setMode(key)}
            className={`rounded-full px-3 py-1 text-xs ${mode === key ? 'bg-orange-700 text-white' : 'bg-[#241a0f] text-orange-300/70'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'check' && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <p className="mb-1 text-xs text-orange-400/60">Atributo</p>
            <Select value={attr} onChange={(e) => setAttr(e.target.value as AttributeKey)}>
              {ATTRIBUTE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {ATTRIBUTE_LABELS[k]}
                </option>
              ))}
            </Select>
          </div>
          <Input placeholder="Perícia/rótulo (opcional)" value={skillLabel} onChange={(e) => setSkillLabel(e.target.value)} className="w-40" />
          <label className="flex items-center gap-1.5 text-xs text-orange-200">
            <input type="checkbox" checked={proficient} onChange={(e) => setProficient(e.target.checked)} />
            Proficiente
          </label>
          <Button variant="primary" onClick={rollCheck}>
            Rolar
          </Button>
        </div>
      )}

      {mode === 'attack' && (
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <p className="mb-1 text-xs text-orange-400/60">Tipo</p>
            <Select value={attackPreset} onChange={(e) => setAttackPreset(Number(e.target.value))}>
              {ATTACK_PRESETS.map((p, i) => (
                <option key={p.label} value={i}>
                  {p.label}
                </option>
              ))}
            </Select>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-orange-200">
            <input type="checkbox" checked={attackProficient} onChange={(e) => setAttackProficient(e.target.checked)} />
            Proficiente
          </label>
          <Button variant="primary" onClick={rollAttack}>
            Rolar
          </Button>
        </div>
      )}

      {mode === 'damage' && (
        <div className="flex flex-wrap items-end gap-2">
          <Input placeholder="1d8+3" value={damageNotation} onChange={(e) => setDamageNotation(e.target.value)} className="w-24" />
          <label className="flex items-center gap-1.5 text-xs text-orange-200">
            <input type="checkbox" checked={critical} onChange={(e) => setCritical(e.target.checked)} />
            Crítico (×Prof.)
          </label>
          <Button variant="primary" onClick={rollDamageRoll}>
            Rolar
          </Button>
        </div>
      )}

      {lastResult && (
        <div className="rounded-lg border border-orange-900/30 bg-black/20 p-2 text-sm text-orange-100">
          <Badge tone="good">resultado</Badge> <span className="ml-1">{lastResult}</span>
        </div>
      )}
    </Card>
  )
}
