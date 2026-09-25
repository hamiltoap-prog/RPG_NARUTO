import type { AudioTrack, GameTable, SceneAudio } from '../types'

/**
 * O que deveria estar tocando agora.
 *
 * Função PURA: sem memória, sem efeito colateral. Recebe o estado da mesa e
 * devolve o plano, e é recalculada a cada mudança — por isso o som nunca
 * "esquece" nem "se perde".
 *
 * A ideia que resolve o problema do combate: ele NUNCA guarda o que estava
 * tocando para devolver depois. Ele só tem prioridade maior nesta função.
 * Quando a luta acaba, a função volta a olhar para `scene.audio.ambienceId` e
 * `moodId` — que nunca foram apagados, só ficaram fora do resultado enquanto a
 * luta durou. Isso elimina uma família inteira de bugs: memória perdida,
 * corrida ao "restaurar", faixa errada voltando.
 */

export interface AudioPlan {
  ambience: AudioTrack | null
  mood: AudioTrack | null
  combat: AudioTrack | null
  /** O combate tomou o lugar da ambientação e do clima. */
  combatTakeover: boolean
  /** Era combate de chefe, mas não havia faixa de chefe — tocou a de combate. */
  bossFallback: boolean
  volumes: { ambience: number; mood: number; combat: number }
}

/** Volume padrão de cada categoria, quando o mestre nunca mexeu. */
export const VOLUME_PADRAO = { ambience: 0.5, mood: 0.4, combat: 0.6 } as const

const porId = (tracks: readonly AudioTrack[], id?: string) => (id ? (tracks.find((t) => t.id === id) ?? null) : null)

/**
 * Combate de chefe é derivado da própria ordem de combate — basta haver um
 * chefe na luta. Não há flag separada na mesa para manter em sincronia.
 */
export function ehCombateDeChefe(table: Pick<GameTable, 'combatActive' | 'combatOrder'>): boolean {
  return Boolean(table.combatActive && (table.combatOrder ?? []).some((p) => p.boss))
}

export function resolveAudioPlan(
  table: Pick<GameTable, 'combatActive' | 'combatOrder'>,
  scene: { audio?: SceneAudio | null } | null | undefined,
  tracks: readonly AudioTrack[],
): AudioPlan {
  const a = scene?.audio ?? {}
  const volumes = {
    ambience: a.ambienceVolume ?? VOLUME_PADRAO.ambience,
    mood: a.moodVolume ?? VOLUME_PADRAO.mood,
    combat: a.combatVolume ?? VOLUME_PADRAO.combat,
  }

  // A faixa escolhida pelo mestre; sem escolha (ou se ela foi apagada), a
  // primeira cadastrada daquele tipo.
  const doTipo = (kind: 'combat' | 'boss', id?: string) =>
    tracks.find((t) => t.kind === kind && t.id === id) ?? tracks.find((t) => t.kind === kind) ?? null
  const chefe = doTipo('boss', a.bossId)
  const normal = doTipo('combat', a.combatId)
  const deChefe = ehCombateDeChefe(table)
  const combate = deChefe ? (chefe ?? normal) : normal

  if (table.combatActive && combate) {
    // Combate manda: ambientação e clima saem, só a música de combate toca.
    return {
      ambience: null,
      mood: null,
      combat: combate,
      combatTakeover: true,
      bossFallback: deChefe && !chefe,
      volumes,
    }
  }

  // Fora de combate — ou combate sem faixa cadastrada, que não tem o que
  // assumir: toca o que o mestre escolheu na cena.
  return {
    ambience: porId(tracks, a.ambienceId),
    mood: porId(tracks, a.moodId),
    combat: null,
    combatTakeover: false,
    bossFallback: false,
    volumes,
  }
}

const CAMPOS_DO_SOM = ['ambienceId', 'moodId', 'combatId', 'bossId', 'ambienceVolume', 'moodVolume', 'combatVolume'] as const

/** O som da cena como ele vai para a biblioteca: só os campos do som, sem carimbo. */
export function somDaCena(a: SceneAudio | null | undefined): SceneAudio | undefined {
  if (!a) return undefined
  const out: SceneAudio = {}
  for (const k of CAMPOS_DO_SOM) if (a[k] !== undefined) (out as Record<string, unknown>)[k] = a[k]
  return Object.keys(out).length ? out : undefined
}

/**
 * O que abrir uma cena guardada faz com o som. A cena volta com o som que
 * tinha — inclusive o SILÊNCIO: se ela foi guardada sem ambientação, a que
 * estiver tocando para. Cena antiga, guardada antes do som existir, não mexe
 * em nada (`null`).
 */
export function somAoAbrir(guardado: SceneAudio | undefined): { [K in keyof SceneAudio]?: SceneAudio[K] | null } | null {
  if (!guardado) return null
  const patch: { [K in keyof SceneAudio]?: SceneAudio[K] | null } = {}
  for (const k of CAMPOS_DO_SOM) (patch as Record<string, unknown>)[k] = guardado[k] ?? null
  // Volume ausente não é "zero": fica o que a mesa já usa.
  for (const k of ['ambienceVolume', 'moodVolume', 'combatVolume'] as const) if (guardado[k] === undefined) delete patch[k]
  return patch
}
