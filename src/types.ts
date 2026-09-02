// Tipos centrais do sistema de Mesa Ninja (RPG de Naruto)
// Observação: os dados de clãs/classes/jutsus em src/data são um placeholder
// recuperado de uma versão antiga do projeto — serão substituídos pelas
// regras definitivas assim que forem revisadas (ver src/data/README.md).

export const ATTRIBUTE_KEYS = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const
export type AttributeKey = (typeof ATTRIBUTE_KEYS)[number]

export const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  strength: 'Força',
  dexterity: 'Destreza',
  constitution: 'Constituição',
  intelligence: 'Inteligência',
  wisdom: 'Sabedoria',
  charisma: 'Carisma',
}

export type Attributes = Record<AttributeKey, number>
export type Modifiers = Record<AttributeKey, number>

export interface Clan {
  id: string
  name: string
  description: string
  bonuses: Attributes
  specialAbilities: string[]
  proficiencies: string[]
}

export interface CharClass {
  id: string
  name: string
  description: string
  hitDie: string
  chakraDie: string
  primaryAbility: AttributeKey
  armorProficiencies: string[]
  weaponProficiencies: string[]
  skillProficiencies: string[]
  savingThrows: AttributeKey[]
  startingEquipment: string[]
  startingWealth: string
  specialFeatures: string[]
}

export interface InventoryItem {
  id: string
  name: string
  quantity: number
  note?: string
}

export interface Weapon {
  id: string
  name: string
  damage: string
  note?: string
  equipped: boolean
}

export interface Armor {
  id: string
  name: string
  defenseBonus: number
  note?: string
  equipped: boolean
}

export interface Jutsu {
  id: string
  name: string
  chakraCost?: string
  details: string
}

/** Campos da ficha que podem ser alterados por um jogador — sempre sujeitos
 * à fila de aprovação do mestre, a menos que o mestre marque como auto-aprovado.
 * "notes" nunca entra aqui: é sempre livre. */
export const REQUESTABLE_FIELDS = [
  'attributes',
  'clanId',
  'classId',
  'level',
  'xp',
  'hp',
  'chakra',
  'armorClass',
  'condition',
  'equipment',
  'weapons',
  'armor',
  'jutsus',
  'proficiencies',
  'imageUrl',
  'description',
] as const
export type RequestableField = (typeof REQUESTABLE_FIELDS)[number]

export const REQUESTABLE_FIELD_LABELS: Record<RequestableField, string> = {
  attributes: 'Atributos',
  clanId: 'Clã',
  classId: 'Classe',
  level: 'Nível',
  xp: 'XP',
  hp: 'Pontos de Vida',
  chakra: 'Chakra',
  armorClass: 'Classe de Armadura',
  condition: 'Condição',
  equipment: 'Inventário',
  weapons: 'Armas',
  armor: 'Armaduras',
  jutsus: 'Jutsus',
  proficiencies: 'Proficiências',
  imageUrl: 'Imagem do personagem',
  description: 'Descrição/História',
}

export interface CharacterDescription {
  age?: number
  rank: string
  title: string
  appearance: string
  personalityTraits: string
  ideals: string
  bonds: string
  flaws: string
}

export interface Character {
  id: string
  tableId: string
  ownerUid: string
  name: string
  clanId: string
  classId: string
  level: number
  xp: number

  attributes: Attributes
  modifiers: Modifiers

  hp: { current: number; max: number }
  chakra: { current: number; max: number }
  armorClass: number
  proficiencyBonus: number

  description: CharacterDescription
  equipment: InventoryItem[]
  weapons: Weapon[]
  armor: Armor[]
  jutsus: Jutsu[]
  proficiencies: string[]
  condition: string

  imageUrl: string

  /** Livre para o jogador editar a qualquer momento, sem aprovação. */
  notes: string

  createdAt: number
  updatedAt: number
  isAlive: boolean
}

export interface GameTable {
  id: string
  code: string
  name: string
  gmUid: string
  gmName: string
  createdAt: number
  /** Campos que, quando um jogador tenta alterar, são aplicados direto sem
   * passar pela fila de aprovação do mestre. */
  autoApproveFields: RequestableField[]
}

export type RequestStatus = 'pending' | 'approved' | 'rejected'

export interface SheetChangeRequest {
  id: string
  tableId: string
  characterId: string
  characterName: string
  ownerUid: string
  fields: RequestableField[]
  summary: string
  patch: Record<string, unknown>
  previous: Record<string, unknown>
  status: RequestStatus
  createdAt: number
  reviewedAt?: number
  reviewedBy?: string
  reviewNote?: string
}

export type LogKind = 'action' | 'note' | 'system' | 'request'

export interface LogEntry {
  id: string
  tableId: string
  ts: number
  actorName: string
  actorType: 'player' | 'gm' | 'system'
  characterId?: string
  kind: LogKind
  summary: string
}
