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
/**
 * Campos que o jogador pode PEDIR para mudar. Nível, XP e o rank ninja não
 * entram: quem dá XP é o mestre, e é ele quem promove o personagem — então
 * não há o que pedir, nem sequer uma fila.
 */
export const REQUESTABLE_FIELDS = [
  'attributes',
  'clanId',
  'classId',
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

  /** Afinidades elementais concedidas pelo mestre (classe, talento...). As do
   * clã são somadas na leitura, não ficam gravadas — ver lib/jutsuAccess. */
  elements?: string[]

  ryo: number

  /** Fonte de luz ativa até este horário (epoch ms): ilumina a área ao redor
   * da peça deste personagem na tela de jogo enquanto durar. */
  lightUntil?: number

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
  /** Preenchido quando o mestre criou a mesa com conta (e-mail/senha). */
  gmEmail?: string
  createdAt: number
  /** Campos que, quando um jogador tenta alterar, são aplicados direto sem
   * passar pela fila de aprovação do mestre. */
  autoApproveFields: RequestableField[]
  combatActive: boolean
  combatOrder: CombatParticipant[]
  combatTurnIndex: number
  /** Quando ligado, toda rolagem de jogador (teste, ataque, dano) precisa da
   * liberação do mestre antes do dado rolar. */
  requireRollApproval: boolean
  /** Quando ligado, cada jogador arrasta a peça do próprio personagem na tela
   * de jogo. As peças de NPCs, inimigos e chefes continuam só com o mestre. */
  playersMoveTokens?: boolean
}

// ---------- Pedidos de rolagem ----------

export type RollRequestKind = 'check' | 'attack' | 'damage' | 'free'

export const ROLL_REQUEST_KIND_LABELS: Record<RollRequestKind, string> = {
  check: 'Teste',
  attack: 'Ataque',
  damage: 'Dano',
  free: 'Dados livres',
}

/** Os dados que o rolador livre oferece. */
export const FREE_DICE = [4, 6, 8, 10, 12, 20, 100] as const

export type RollRequestStatus = 'pending' | 'approved' | 'denied'

/** Tudo que o mestre precisa para executar a rolagem quando liberar — o dado
 * só é sorteado no momento da aprovação, nunca antes. */
export interface RollRequest {
  id: string
  tableId: string
  characterId: string
  characterName: string
  requesterUid: string
  kind: RollRequestKind
  /** Frase pronta mostrada ao mestre, ex: "Teste de Percepção (Sabedoria, proficiente)". */
  description: string
  status: RollRequestStatus
  createdAt: number

  // Parâmetros da rolagem
  attribute?: AttributeKey
  modifier?: number
  proficient?: boolean
  proficiencyBonus?: number
  notation?: string
  critical?: boolean

  // Resultado, preenchido quando o mestre libera
  resolvedAt?: number
  resolvedBy?: string
  resultSummary?: string
  deniedReason?: string
}

// ---------- Tela de jogo (mapa tático) ----------

export type SceneTokenKind = 'pc' | 'npc' | 'monster' | 'boss'

export const SCENE_TOKEN_LABELS: Record<SceneTokenKind, string> = {
  pc: 'Personagem',
  npc: 'NPC',
  monster: 'Inimigo',
  boss: 'Chefe',
}

/**
 * Tamanho da criatura no mapa. `squares` é a medida de verdade — quantos
 * quadrados da grade a criatura ocupa —, e é o que mantém a proporção entre
 * as peças quando o mestre muda a escala do mapa.
 */
export const CREATURE_SIZES = [
  { key: 'normal', label: 'Normal', size: 0.07, squares: 1 },
  { key: 'grande', label: 'Grande', size: 0.11, squares: 2 },
  { key: 'enorme', label: 'Enorme', size: 0.17, squares: 3 },
  { key: 'colossal', label: 'Colossal', size: 0.26, squares: 4 },
] as const

export interface SceneToken {
  id: string
  label: string
  imageUrl?: string
  kind: SceneTokenKind
  /** Posição relativa ao palco (0..1), para bater em qualquer tela. */
  x: number
  y: number
  /** Diâmetro como fração da largura do palco — herança das peças antigas. */
  size: number
  /** Tamanho em quadrados da grade (1 = criatura média). Quando presente, manda. */
  squares?: number
  /** Ligada a uma ficha: mostra PV ao vivo e segue o dono. */
  refType?: 'character' | 'npc'
  refId?: string
  /** Falso = "preparada" na bandeja do mestre, ainda fora do mapa. */
  onBoard?: boolean
}

export type TimeOfDay = 'day' | 'night'

/**
 * Enquadramento do mapa, definido pelo mestre e igual para todo mundo. O
 * "palco" é o retângulo onde o mapa vive, com proporção fixa (`aspect`): é o
 * que faz as coordenadas 0..1 das peças caírem no mesmo ponto em qualquer
 * tela. Zoom, rotação e deslocamento movem a imagem dentro do palco.
 */
export interface SceneMap {
  rotation?: number
  zoom?: number
  offsetX?: number
  offsetY?: number
  aspect?: number
  fit?: 'contain' | 'cover'
}

/**
 * Névoa de guerra. A malha tem `cols` por `rows` e `cells` guarda um
 * caractere por célula ('1' = revelada). Guardar tudo como texto mantém o
 * documento pequeno; a borda suave é feita no desenho, não nos dados.
 */
export interface SceneFog {
  enabled: boolean
  cols: number
  rows: number
  cells: string
}

/** Marcação rápida no mapa ("olhem aqui"), some sozinha em alguns segundos. */
export interface ScenePing {
  id: string
  x: number
  y: number
  label: string
  at: number
}

export const FOG_COLS = 56
export const PING_LIFETIME_MS = 4000
export const DEFAULT_STAGE_ASPECT = 16 / 10
export const DEFAULT_GRID_COLUMNS = 20

export interface Scene {
  backgroundUrl: string
  tokens: SceneToken[]
  /** Falso: os jogadores veem uma tela de espera enquanto o mestre prepara. */
  revealed: boolean
  updatedAt: number
  /** Dia ou noite — muda o tom ambiente do palco. */
  timeOfDay?: TimeOfDay
  /** O mestre decide se o local está iluminado; independe do dia/noite (um
   * porão é escuro ao meio-dia, um salão com tochas é claro à meia-noite). */
  locationLit?: boolean
  map?: SceneMap
  /** Escala: quantos quadrados de largura o mapa tem. */
  gridColumns?: number
  showGrid?: boolean
  fog?: SceneFog
}

/**
 * Item guardado na biblioteca da mesa: uma peça pronta ou uma CENA inteira.
 *
 * Guardar só a imagem do mapa não servia: o mestre monta o encontro — enquadra
 * o mapa, posiciona as peças, revela parte da névoa — e ao voltar naquele
 * mapa na semana seguinte encontrava tudo em branco. Agora o item leva a cena
 * junto, e reabrir devolve o encontro como ele estava.
 */
export interface SceneLibraryItem {
  id: string
  kind: 'map' | 'token'
  label: string
  imageUrl?: string
  tokenKind?: SceneTokenKind
  folder?: string
  createdAt: number
  /** Retrato da cena no momento de guardar (só em itens de mapa). */
  snapshot?: SceneSnapshot
}

/** O que é preciso para remontar um encontro: enquadramento, grade, luz,
 * névoa e as peças que estavam em jogo. */
export interface SceneSnapshot {
  backgroundUrl: string
  map?: SceneMap
  gridColumns?: number
  showGrid?: boolean
  timeOfDay?: TimeOfDay
  locationLit?: boolean
  fog?: SceneFog
  tokens: SceneToken[]
}

/**
 * Rolagem secreta do mestre.
 *
 * Mora fora do registro da mesa de propósito: o log é legível por qualquer
 * um na mesa, então uma rolagem "secreta" gravada lá seria secreta só na
 * tela — bastaria abrir o console do navegador para ler. Aqui as regras do
 * Firestore fecham a coleção inteira para quem não é o mestre.
 */
export interface GMRoll {
  id: string
  tableId: string
  ts: number
  label: string
  summary: string
  dice: number[]
  diceSides: number
  total: number
}

/* ---------------------------------------------------------------------------
 * Bestiário
 *
 * Duas camadas, de propósito:
 *  - SummonCreature: as 17 tribos de invocação do manual. São referência,
 *    iguais em qualquer mesa, e vivem no código (src/data/summons.ts).
 *  - BestiaryEntry: a criatura que o mestre inventa. Vive na mesa dele.
 *
 * A ficha é uma só para NPC, animal, monstro, chefe e invocação — o que muda
 * é o rótulo e o quanto de cada campo o mestre resolve preencher.
 * ------------------------------------------------------------------------- */

/** Ficha de uma tribo de invocação, como o manual a descreve. */
export interface SummonCreature {
  id: string
  name: string
  description: string
  /** Temperamento: Bestial, Leal, Soberano, Astuto, Incessante. */
  summonType: string
  hitDie: string
  chakraDie: string
  saves: string
  skills: string
  naturalWeapons: string
  attackModifier: string
  specialFeatures: string
}

export type CreatureKind = 'npc' | 'animal' | 'monster' | 'boss' | 'summon'

export const CREATURE_KIND_LABELS: Record<CreatureKind, string> = {
  npc: 'NPC',
  animal: 'Animal',
  monster: 'Monstro',
  boss: 'Chefe',
  summon: 'Invocação',
}

/**
 * Ranks de invocação (04b-invocacoes.md). O manual se contradiz sobre os
 * dados de vida: a tabela diz "Nível 2 → 2 DV" (um por nível) e a nota de
 * rodapé diz "cada nível concede 2 DV". Seguimos a COLUNA DA TABELA, que é o
 * dado concreto — ver docs/rules/00-observacoes.md.
 */
export const SUMMON_RANKS = [
  { rank: 'D', title: 'Soldado', level: 2, dice: 2, cost: 5 },
  { rank: 'C', title: 'Protetor', level: 4, dice: 4, cost: 10 },
  { rank: 'B', title: 'Guardião', level: 6, dice: 6, cost: 15 },
  { rank: 'A', title: 'Nobre', level: 8, dice: 8, cost: 20 },
  { rank: 'S', title: 'Campeão', level: 10, dice: 10, cost: 30 },
] as const

/** Criatura criada pelo mestre, guardada na mesa dele. */
export interface BestiaryEntry {
  id: string
  tableId: string
  kind: CreatureKind
  name: string
  imageUrl?: string
  description: string
  armorClass: number
  hp: { current: number; max: number }
  resistancePoints: number
  attackModifier: number
  attacksText: string
  skills: string
  specialFeatures: string
  notes: string
  /** Quando nasceu de uma tribo do manual, qual foi. */
  sourceId?: string
  createdAt: number
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
  /** Valor de cada dado rolado — alimenta a animação vista por toda a mesa. */
  dice?: number[]
  /** Quantos lados tinha cada dado da animação. */
  diceSides?: number
  /** Rótulo curto mostrado na animação, ex: "Ataque (Ninjutsu)". */
  diceLabel?: string
}
