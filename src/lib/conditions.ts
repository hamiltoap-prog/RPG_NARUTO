import { CONDITIONS } from '../data/conditions'
import type { ActiveCondition, Character, Companion, GameTable, NPC } from '../types'

/**
 * Onde moram as condições.
 *
 * Antes elas viviam só na lista de combate (`table.combatOrder`), o que
 * bastava enquanto condição só existia dentro de luta. Agora um jutsu impõe
 * condição a qualquer hora — fora de combate, em alvo que nem está na
 * iniciativa — então o lugar delas é a própria ficha (`conditions`), e a
 * lista de combate virou espelho.
 *
 * A leitura aceita as duas: mesas que já estavam no ar guardaram condição na
 * lista de combate, e essas continuam aparecendo até o mestre mexer nelas.
 */

export type Ficha = Character | NPC | Companion

/** A referência com que mesa, mapa e combate chamam a mesma ficha. */
export function refDaFicha(f: Ficha): string {
  if ('ownerCharacterId' in f) return `companion:${f.id}`
  if ('classId' in f) return `character:${f.id}`
  return `npc:${f.id}`
}

/** As condições em cima de alguém: a ficha manda, o combate é o reserva. */
export function condicoesDe(f: Ficha | undefined, table?: GameTable | null): ActiveCondition[] {
  if (!f) return []
  // Lista vazia também é resposta: quer dizer que o mestre limpou tudo. Só a
  // ficha que nunca teve o campo (mesa que já estava no ar antes disto) é que
  // cai na lista de combate.
  if (f.conditions) return f.conditions
  const naLuta = table?.combatOrder?.find((p) => p.ref === refDaFicha(f))
  return naLuta?.conditions ?? []
}

/**
 * Junta o que já estava em cima do alvo com o que o golpe acabou de impor.
 *
 * Reaplicar uma condição não empilha duas cópias: fica uma só, com o prazo
 * mais longo entre os dois — condição sem prazo ("até ser curado") vence
 * qualquer contagem, porque é a que dura mais.
 */
export function mesclarCondicoes(
  atuais: ActiveCondition[],
  novas: string[],
  rodadas?: number,
): ActiveCondition[] {
  const saida = atuais.map((c) => ({ ...c }))
  for (const nome of novas) {
    const ja = saida.find((c) => c.name === nome)
    if (!ja) {
      saida.push(rodadas === undefined ? { name: nome } : { name: nome, rounds: rodadas })
      continue
    }
    if (rodadas === undefined || ja.rounds === undefined) {
      delete ja.rounds
      continue
    }
    ja.rounds = Math.max(ja.rounds, rodadas)
  }
  return saida
}

/** Tira uma condição de cima de alguém. */
export function tirarCondicao(atuais: ActiveCondition[], nome: string): ActiveCondition[] {
  return atuais.filter((c) => c.name !== nome)
}

/** O texto do manual para a condição, para a tela poder explicar o selo. */
export function efeitoDaCondicao(nome: string): string {
  return CONDITIONS.find((c) => c.name === nome)?.effect ?? ''
}

/** Sigla de três letras para o selo caber em cima da peça no mapa. */
export function selo(nome: string): string {
  return nome.slice(0, 3).toUpperCase()
}
