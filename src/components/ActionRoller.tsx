import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { describeIntent, requestRoll } from '../lib/rollFlow'
import { listenMyRollRequests } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Character, GameTable, RollRequest } from '../types'

const ATTACK_PRESETS: { label: string; attribute: AttributeKey }[] = [
  { label: 'Ninjutsu', attribute: 'intelligence' },
  { label: 'Genjutsu', attribute: 'wisdom' },
  { label: 'Taijutsu (Força)', attribute: 'strength' },
  { label: 'Taijutsu (Destreza)', attribute: 'dexterity' },
  { label: 'Bukijutsu (Força)', attribute: 'strength' },
  { label: 'Bukijutsu (Destreza)', attribute: 'dexterity' },
  { label: 'Arma à Distância', attribute: 'dexterity' },
]

export function ActionRoller({
  table,
  character,
  actorName,
  actorIsGM,
  requesterUid,
}: {
  table: GameTable
  character: Character
  actorName: string
  actorIsGM: boolean
  requesterUid: string
}) {
  const [mode, setMode] = useState<'check' | 'attack' | 'damage'>('check')

  const [attr, setAttr] = useState<AttributeKey>('strength')
  const [skillLabel, setSkillLabel] = useState('')
  const [proficient, setProficient] = useState(false)

  const [attackPreset, setAttackPreset] = useState(0)
  const [attackProficient, setAttackProficient] = useState(true)

  const [damageNotation, setDamageNotation] = useState('1d6')
  const [critical, setCritical] = useState(false)

  const [feedback, setFeedback] = useState('')
  const [myRequests, setMyRequests] = useState<RollRequest[]>([])

  useEffect(() => {
    if (actorIsGM) return
    return listenMyRollRequests(table.id, character.id, setMyRequests)
  }, [table.id, character.id, actorIsGM])

  const pending = myRequests.filter((r) => r.status === 'pending')
  const lastResolved = myRequests.find((r) => r.status !== 'pending')

  async function send(intent: Parameters<typeof requestRoll>[0]['intent']) {
    try {
      const result = await requestRoll({ table, character, actorName, actorIsGM, requesterUid, intent })
      setFeedback(result.pending ? 'Pedido enviado — aguardando o mestre liberar.' : (result.summary ?? ''))
    } catch (err) {
      setFeedback(err instanceof Error ? err.message : 'Não foi possível rolar.')
    }
  }

  const needsApproval = !actorIsGM && table.requireRollApproval

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Ações</SectionTitle>
        {needsApproval && <Badge tone="warn">o mestre libera cada rolagem</Badge>}
      </div>

      <div className="flex gap-1.5">
        {(
          [
            ['check', 'Teste'],
            ['attack', 'Ataque'],
            ['damage', 'Dano'],
          ] as const
        ).map(([key, label]) => (
          <TabChip key={key} active={mode === key} className="px-3 py-1 text-xs" onClick={() => setMode(key)}>
            {label}
          </TabChip>
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
          <Button
            variant="primary"
            onClick={() =>
              send({
                kind: 'check',
                description: describeIntent(
                  skillLabel.trim() || `Teste de ${ATTRIBUTE_LABELS[attr]}`,
                  skillLabel.trim() ? ATTRIBUTE_LABELS[attr] : undefined,
                  proficient,
                ),
                attribute: attr,
                modifier: character.modifiers[attr],
                proficient,
                proficiencyBonus: character.proficiencyBonus,
              })
            }
          >
            {needsApproval ? 'Pedir Rolagem' : 'Rolar'}
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
          <Button
            variant="primary"
            onClick={() => {
              const preset = ATTACK_PRESETS[attackPreset]
              return send({
                kind: 'attack',
                description: `Ataque (${preset.label})`,
                attribute: preset.attribute,
                modifier: character.modifiers[preset.attribute],
                proficient: attackProficient,
                proficiencyBonus: character.proficiencyBonus,
              })
            }}
          >
            {needsApproval ? 'Pedir Rolagem' : 'Rolar'}
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
          <Button
            variant="primary"
            onClick={() =>
              send({
                kind: 'damage',
                description: `Dano (${damageNotation})`,
                notation: damageNotation,
                critical,
                proficiencyBonus: character.proficiencyBonus,
              })
            }
          >
            {needsApproval ? 'Pedir Rolagem' : 'Rolar'}
          </Button>
        </div>
      )}

      {feedback && (
        <div className="well rounded-lg p-2 text-sm text-orange-100">
          <Badge tone="good">resultado</Badge> <span className="ml-1">{feedback}</span>
        </div>
      )}

      {pending.length > 0 && (
        <div className="well flex flex-col gap-1 rounded-lg p-2 text-xs">
          <p className="font-semibold text-amber-200">Esperando o mestre liberar:</p>
          {pending.map((r) => (
            <p key={r.id} className="text-orange-200">
              • {r.description}
            </p>
          ))}
        </div>
      )}

      {lastResolved?.status === 'denied' && (
        <p className="text-xs text-red-300">
          O mestre negou: {lastResolved.description}
          {lastResolved.deniedReason ? ` — ${lastResolved.deniedReason}` : ''}
        </p>
      )}
    </Card>
  )
}
