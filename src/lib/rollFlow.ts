import type { AttributeKey, Character, GameTable, RollRequest, RollRequestKind } from '../types'
import { applyCriticalMultiplier, rollD20, rollDice } from './dice'
import { addGMRoll, addLogEntry, createRollRequest, resolveRollRequest } from './store'

/** O que o jogador quer rolar — sem nenhum dado sorteado ainda. */
export interface RollIntent {
  kind: RollRequestKind
  /** Frase pronta pro mestre ler antes de liberar. */
  description: string
  attribute?: AttributeKey
  modifier?: number
  proficient?: boolean
  proficiencyBonus?: number
  notation?: string
  critical?: boolean
}

export interface RollOutcome {
  summary: string
  dice: number[]
  diceSides: number
  total: number
}

/** Sorteia os dados e monta a frase do resultado. Usado tanto na rolagem
 * direta quanto no momento em que o mestre libera um pedido. */
export function executeRollIntent(intent: RollIntent): RollOutcome {
  if (intent.kind === 'free') {
    const result = rollDice(intent.notation ?? '1d20')
    const sides = Number((intent.notation ?? '1d20').split('d')[1]?.match(/\d+/)?.[0] ?? 20)
    const modNote = result.modifier ? ` ${result.modifier > 0 ? '+' : '−'} ${Math.abs(result.modifier)}` : ''
    return {
      summary: `${intent.description}: [${result.rolls.join(', ')}]${modNote} = ${result.total}`,
      dice: result.rolls,
      diceSides: sides,
      total: result.total,
    }
  }

  if (intent.kind === 'damage') {
    let result = rollDice(intent.notation ?? '1d6')
    let critNote = ''
    if (intent.critical) {
      result = applyCriticalMultiplier(result, intent.proficiencyBonus ?? 1)
      critNote = ` × ${intent.proficiencyBonus} (crítico)`
    }
    const sides = Number((intent.notation ?? '1d6').split('d')[1]?.match(/\d+/)?.[0] ?? 6)
    return {
      summary: `${intent.description}: [${result.rolls.join(', ')}]${critNote}${
        result.modifier ? ` ${result.modifier > 0 ? '+' : '−'} ${Math.abs(result.modifier)}` : ''
      } = ${result.total}`,
      dice: result.rolls,
      diceSides: sides,
      total: result.total,
    }
  }

  const result = rollD20(intent.modifier ?? 0, Boolean(intent.proficient), intent.proficiencyBonus ?? 0)
  const critNote =
    result.isCritical && intent.kind === 'attack'
      ? ' — acerto crítico!'
      : result.isCritical
        ? ' — 20 natural!'
        : result.isFumble
          ? ' — 1 natural (falha crítica)'
          : ''
  return {
    summary: `${intent.description}: d20(${result.roll}) + ${result.modifier}${
      intent.proficient ? ` + ${result.proficiencyBonus} (prof.)` : ''
    } = ${result.total}${critNote}`,
    dice: [result.roll],
    diceSides: 20,
    total: result.total,
  }
}

/** Descrição legível usada tanto no pedido quanto no log. */
export function describeIntent(label: string, attributeLabel?: string, proficient?: boolean): string {
  const extra = [attributeLabel, proficient ? 'proficiente' : null].filter(Boolean).join(', ')
  return extra ? `${label} (${extra})` : label
}

export interface RequestRollParams {
  table: GameTable
  character: Character
  actorName: string
  actorIsGM: boolean
  requesterUid: string
  intent: RollIntent
}

/** O mestre rola na hora; o jogador rola na hora só se a mesa não exigir
 * liberação — caso contrário vira um pedido esperando o mestre. */
export async function requestRoll({
  table,
  character,
  actorName,
  actorIsGM,
  requesterUid,
  intent,
}: RequestRollParams): Promise<{ pending: boolean; summary?: string }> {
  if (actorIsGM || !table.requireRollApproval) {
    const outcome = executeRollIntent(intent)
    await addLogEntry(table.id, {
      actorName,
      actorType: actorIsGM ? 'gm' : 'player',
      characterId: character.id,
      kind: 'roll',
      summary: outcome.summary,
      dice: outcome.dice,
      diceSides: outcome.diceSides,
      diceLabel: intent.description,
    })
    return { pending: false, summary: outcome.summary }
  }

  await createRollRequest(table.id, {
    characterId: character.id,
    characterName: character.name,
    requesterUid,
    kind: intent.kind,
    description: intent.description,
    attribute: intent.attribute,
    modifier: intent.modifier,
    proficient: intent.proficient,
    proficiencyBonus: intent.proficiencyBonus,
    notation: intent.notation,
    critical: intent.critical,
  })
  await addLogEntry(table.id, {
    actorName,
    actorType: 'player',
    characterId: character.id,
    kind: 'request',
    summary: `Pediu para rolar: ${intent.description}`,
  })
  return { pending: true }
}

/** O mestre liberou: agora sim o dado rola, e o resultado vai pro registro. */
export async function approveRollRequest(table: GameTable, request: RollRequest, gmName: string) {
  const outcome = executeRollIntent({
    kind: request.kind,
    description: request.description,
    modifier: request.modifier,
    proficient: request.proficient,
    proficiencyBonus: request.proficiencyBonus,
    notation: request.notation,
    critical: request.critical,
  })
  await addLogEntry(table.id, {
    actorName: request.characterName,
    actorType: 'player',
    characterId: request.characterId,
    kind: 'roll',
    summary: `${outcome.summary} (liberado por ${gmName})`,
    dice: outcome.dice,
    diceSides: outcome.diceSides,
    diceLabel: request.description,
  })
  await resolveRollRequest(table.id, request.id, {
    status: 'approved',
    resolvedBy: gmName,
    resultSummary: outcome.summary,
  })
}

export async function denyRollRequest(table: GameTable, request: RollRequest, gmName: string, reason: string) {
  await resolveRollRequest(table.id, request.id, {
    status: 'denied',
    resolvedBy: gmName,
    deniedReason: reason,
  })
  await addLogEntry(table.id, {
    actorName: gmName,
    actorType: 'gm',
    characterId: request.characterId,
    kind: 'system',
    summary: `Negou a rolagem de ${request.characterName} (${request.description})${reason ? `: ${reason}` : ''}`,
  })
}

export interface GMRollParams {
  table: GameTable
  gmName: string
  intent: RollIntent
  /** Secreta não passa pelo registro da mesa — ver store.addGMRoll. */
  secret: boolean
}

/**
 * Rolagem do próprio mestre. Aberta vai para o registro e anima os dados na
 * tela de todo mundo; secreta fica só com ele.
 */
export async function rollAsGM({ table, gmName, intent, secret }: GMRollParams): Promise<RollOutcome> {
  const outcome = executeRollIntent(intent)
  if (secret) {
    await addGMRoll(table.id, {
      label: intent.description,
      summary: outcome.summary,
      dice: outcome.dice,
      diceSides: outcome.diceSides,
      total: outcome.total,
    })
    return outcome
  }
  await addLogEntry(table.id, {
    actorName: gmName,
    actorType: 'gm',
    kind: 'roll',
    summary: outcome.summary,
    dice: outcome.dice,
    diceSides: outcome.diceSides,
    diceLabel: intent.description,
  })
  return outcome
}
