import { CLANS } from '../data/clans'
import type { Clan } from '../types'

/**
 * Clãs em uso numa mesa: os 13 do manual mais os que o mestre inventou.
 *
 * Os do manual vivem no código; os da casa vivem na mesa
 * (tables/{id}/clans). Tudo que escolhe, mostra ou valida clã passa por aqui,
 * para um clã da casa valer exatamente como um do manual — inclusive na
 * elegibilidade de jutsu e na afinidade elemental.
 */
export function allClans(custom: Clan[] | undefined): Clan[] {
  if (!custom || custom.length === 0) return CLANS
  // Um clã da casa com o mesmo id substitui o do manual — é como o mestre
  // ajusta um clã oficial para a campanha dele sem perder os outros.
  const porId = new Map(CLANS.map((c) => [c.id, c]))
  for (const c of custom) porId.set(c.id, c)
  return [...porId.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
}

export function findClan(custom: Clan[] | undefined, id: string): Clan | undefined {
  return allClans(custom).find((c) => c.id === id)
}

/** Um esqueleto de clã para o mestre preencher. */
export function emptyClan(id: string): Clan {
  return {
    id,
    name: '',
    description: '',
    bonuses: { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 },
    bonusText: '',
    speed: '9 metros',
    skillProficiencies: [],
    featuresText: '',
    exclusiveJutsuCount: 0,
  }
}

/** Id estável a partir do nome, para o clã casar com os jutsus dele. */
export function clanIdFromName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
