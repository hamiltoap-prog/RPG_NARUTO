import type { Character, GameTable, RequestableField } from '../types'
import { REQUESTABLE_FIELDS } from '../types'
import { addLogEntry, createChangeRequest, updateCharacterDirect } from './store'

export interface SubmitChangeParams {
  table: GameTable
  character: Character
  actorUid: string
  actorName: string
  actorIsGM: boolean
  /** Patch com apenas campos presentes em REQUESTABLE_FIELDS. */
  patch: Record<string, unknown>
  summary: string
}

export interface SubmitChangeResult {
  applied: boolean
}

/** Ponto único de entrada para qualquer alteração de ficha que não seja
 * "notes". Decide, com base em quem está agindo e na configuração de
 * auto-aprovação da mesa, se a mudança é aplicada na hora ou vira uma
 * solicitação pendente para o mestre revisar. */
export async function submitCharacterChange(params: SubmitChangeParams): Promise<SubmitChangeResult> {
  const { table, character, actorUid, actorName, actorIsGM, patch, summary } = params

  const fields = Object.keys(patch).filter((k) => (REQUESTABLE_FIELDS as readonly string[]).includes(k)) as RequestableField[]
  if (fields.length === 0) return { applied: false }

  if (actorIsGM) {
    await updateCharacterDirect(table.id, character.id, patch)
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      characterId: character.id,
      kind: 'system',
      summary,
    })
    return { applied: true }
  }

  const allAutoApproved = fields.every((f) => table.autoApproveFields.includes(f))
  if (allAutoApproved) {
    await updateCharacterDirect(table.id, character.id, patch)
    await addLogEntry(table.id, {
      actorName,
      actorType: 'player',
      characterId: character.id,
      kind: 'system',
      summary: `${summary} (auto-aprovado)`,
    })
    return { applied: true }
  }

  const previous: Record<string, unknown> = {}
  for (const f of fields) previous[f] = (character as unknown as Record<string, unknown>)[f]

  await createChangeRequest(table.id, {
    characterId: character.id,
    characterName: character.name,
    ownerUid: actorUid,
    fields,
    summary,
    patch,
    previous,
  })
  await addLogEntry(table.id, {
    actorName,
    actorType: 'player',
    characterId: character.id,
    kind: 'request',
    summary: `Solicitou ao mestre: ${summary}`,
  })
  return { applied: false }
}

export async function updateNotes(tableId: string, characterId: string, notes: string) {
  await updateCharacterDirect(tableId, characterId, { notes })
}
