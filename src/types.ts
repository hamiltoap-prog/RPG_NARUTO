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
  quote?: string
  description: string
  /** Bônus numérico aplicado automaticamente ao total de atributos. Para
   * clãs com bônus alternativo/escolha (ex: Kurama, Sem Clã), representa a
   * opção padrão — a nuance completa está em bonusText. */
  bonuses: Attributes
  bonusText: string
  speed: string
  skillProficiencies: string[]
  /** Traços e recursos progressivos do clã (1º/3º/7º/11º/15º/18º nível),
   * como texto de referência fiel ao manual — não é automatizado pelo app. */
  featuresText: string
  exclusiveJutsuCount: number
}

export interface ClassLevelEntry {
  level: number
  resistancePoints: number
  proficiencyBonus: number
  features: string
  jutsusKnown?: number
  maxRank?: string
}

export interface CharClass {
  id: string
  name: string
  description: string
  suggestedClans: string
  primaryAbility: string
  hitDie: string
  chakraDie: string
  savingThrows: AttributeKey[]
  armorProficiencies: string[]
  weaponProficiencies: string
  toolProficiencies: string
  skillProficiencies: string
  startingEquipment: string[]
  startingWealth: string
  progression: ClassLevelEntry[]
  /** Arquétipos/caminhos/subclasses e suas características, como texto de
   * referência fiel ao manual — não é automatizado pelo app. */
  subclassesText: string
}

export interface WeaponCatalogEntry {
  name: string
  cost: string
  damage: string
  damageType: string
  properties: string
  category: string
}

export interface ArmorCatalogEntry {
  name: string
  cost: string
  armorBonus: number
  dexBonus: string
  effect?: string
  category: 'Leve' | 'Média' | 'Pesada'
}

export interface GearItem {
  name: string
  cost: string
  effect?: string
  category: string
}

export interface Skill {
  name: string
  attribute: AttributeKey
  description: string
}

export interface Condition {
  name: string
  effect: string
  resistancePointsModifier: string
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

/** Entrada do catálogo de referência (631 jutsus extraídos do manual) usado
 * para busca/seleção na hora de adicionar um jutsu à ficha — ver
 * src/data/jutsus.ts. Distinto de Jutsu (a versão simplificada gravada na
 * ficha do personagem). */
export interface JutsuCatalogEntry {
  name: string
  classification: string
  rank: string
  castingTime: string
  range: string
  duration: string
  components: string
  cost: string
  keywords: string
  description: string
  /** Categoria de origem: elemento, tipo geral (Genjutsu/Taijutsu/Bukijutsu) ou clã exclusivo. */
  category: string
  clanId?: string
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
  'resistancePoints',
  'condition',
  'equipment',
  'weapons',
  'armor',
  'jutsus',
  'proficiencies',
  'imageUrl',
  'description',
  'ryo',
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
  resistancePoints: 'Pontos de Resistência',
  condition: 'Condição',
  equipment: 'Inventário',
  weapons: 'Armas',
  armor: 'Armaduras',
  jutsus: 'Jutsus',
  proficiencies: 'Proficiências',
  imageUrl: 'Imagem do personagem',
  description: 'Descrição/História',
  ryo: 'Ryo (dinheiro)',
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
  /** Pontos de Resistência: a "CD" do personagem para os outros baterem em
   * testes/resistências contra ele, conforme a progressão da classe. */
  resistancePoints: number

  description: CharacterDescription
  equipment: InventoryItem[]
  weapons: Weapon[]
  armor: Armor[]
  jutsus: Jutsu[]
  proficiencies: string[]
  condition: string

  imageUrl: string

  ryo: number

  /** Livre para o jogador editar a qualquer momento, sem aprovação. */
  notes: string

  createdAt: number
  updatedAt: number
  isAlive: boolean
}

/** NPC/adversário controlado pelo mestre — ficha simplificada (o manual
 * detalha um sistema completo de construção de adversários no Cap. 15,
 * mas o app deixa isso como texto livre pro mestre preencher conforme
 * julgar, seguindo a filosofia do próprio manual de "foco no raciocínio,
 * não nos dados"). */
export interface NPC {
  id: string
  tableId: string
  name: string
  armorClass: number
  hp: { current: number; max: number }
  resistancePoints: number
  attacksText: string
  notes: string
  visible: boolean
  createdAt: number
}

export interface CombatParticipant {
  ref: string // "character:<id>" ou "npc:<id>"
  name: string
  initiative: number
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
  combatActive: boolean
  combatOrder: CombatParticipant[]
  combatTurnIndex: number
}

export interface Mission {
  id: string
  tableId: string
  title: string
  description: string
  reward: string
  status: 'open' | 'completed'
  createdAt: number
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

export type LogKind = 'action' | 'note' | 'system' | 'request' | 'combat' | 'roll'

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
