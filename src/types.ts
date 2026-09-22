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
  /** Item da casa: citado pelo manual em outro lugar (equipamento inicial,
   * pacotes) mas sem ficha no capítulo de Equipamento. Preço e efeito foram
   * definidos para a mesa — ver docs/rules/00-observacoes.md, item 13d. */
  houseRule?: boolean
}

export interface GearItem {
  name: string
  cost: string
  effect?: string
  category: string
  /** Item da casa — ver ArmorCatalogEntry.houseRule. */
  houseRule?: boolean
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
  /** Marionete: o item forjado que esta linha representa. */
  puppetId?: string
}

export interface Weapon {
  id: string
  name: string
  damage: string
  note?: string
  equipped: boolean
  /** Quantas unidades da mesma arma (20 shurikens = uma linha, quantity 20).
   * Ausente = 1, para as fichas criadas antes disso existir. */
  quantity?: number
  /** Gasta uma unidade ao atacar — arma de arremesso que não volta. */
  consumable?: boolean
  damageType?: string
  properties?: string
  /** Nome exato no catálogo do manual, quando veio de lá. */
  catalogName?: string
}

export interface Armor {
  id: string
  name: string
  defenseBonus: number
  note?: string
  equipped: boolean
  quantity?: number
  /** Teto de Destreza que esta armadura deixa somar à CA. Ausente = sem teto
   * ("Destreza Total" no catálogo); 0 = nenhuma Destreza. */
  dexCap?: number
  catalogName?: string
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
  'name',
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
  name: 'Nome do personagem',
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
  /** Condição única, como a ficha sempre teve. Continua valendo para o
   * seletor da ficha; as várias com prazo vivem em `conditions`. */
  condition: string
  /**
   * Condições pegando na criatura, com o prazo de cada uma.
   *
   * Passaram a morar na ficha, e não na linha da ordem de combate: uma
   * condição é da criatura, não da luta — e assim o selo aparece no mapa
   * mesmo fora de combate, que é quando o jutsu de enredo pega alguém.
   */
  conditions?: ActiveCondition[]

  imageUrl: string

  /** Afinidades elementais do personagem. As do clã são somadas na leitura,
   * não ficam gravadas aqui — ver lib/jutsuAccess. */
  elements?: string[]

  /** Último dia em que comeu e bebeu — ver TableSurvival. */
  survival?: CharacterSurvival

  /** Ficha conduzida pelo mestre, e não por um jogador. Some da lista do
   * grupo; aparece na mesa quando o mestre a torna visível. */
  isNPC?: boolean
  /** Só vale para ficha de NPC: se o grupo já a conhece. */
  visible?: boolean

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
/** Um golpe pronto da criatura, para o mestre rolar em um clique. */
export interface NpcAttack {
  id: string
  name: string
  /** Bônus somado ao d20. */
  bonus: number
  damage: string
  damageType?: string
  note?: string
}

export interface NPC {
  id: string
  tableId: string
  name: string
  armorClass: number
  hp: { current: number; max: number }
  resistancePoints: number
  /** Descrição livre dos ataques — continua valendo para o que não couber
   * nos ataques estruturados. */
  attacksText: string
  notes: string
  visible: boolean
  createdAt: number

  imageUrl?: string
  /** Modificadores, para a criatura resistir a jutsu como qualquer um. */
  modifiers?: Modifiers
  /** Bicho também gasta chakra quando usa jutsu. */
  chakra?: { current: number; max: number }
  proficiencyBonus?: number
  /** Golpes prontos: nome, bônus e dano, para rolar sem digitar nada. */
  attacks?: NpcAttack[]
  /** Sim, alguns bichos usam jutsu — invocações de Rank C ou mais, sobretudo. */
  jutsus?: Jutsu[]
  /** Afinidades elementais da criatura, para a Vantagem Elemental valer nos
   * dois sentidos (o bicho atacando e o bicho sendo atacado). */
  elements?: string[]
  /** Invocação: tamanho e pontuações brutas de atributo, para o subsistema de
   * testes do Kuchiyose ("1d4 + atributo bruto contra o próprio PR"). */
  summonSize?: SummonSizeKey
  attributes?: Attributes
  /** Condições pegando na criatura — ver Character.conditions. */
  conditions?: ActiveCondition[]
}

/* ---------------------------------------------------------------------------
 * Fichas temporárias: clones e invocações
 *
 * Um clone das sombras e uma criatura invocada não são efeitos de texto — são
 * corpos que agem no turno de quem os criou. Cada um vira uma ficha própria,
 * controlada por quem lançou o jutsu (o jogador na ficha dele, o mestre na
 * dele), e uma peça ao lado da peça do dono no mapa.
 *
 * Ficam em coleção separada (`companions`) de propósito: o jogador precisa
 * poder mexer nelas sem pedir licença — é o próprio clone dele —, e as fichas
 * de NPC são escrita exclusiva do mestre.
 * ------------------------------------------------------------------------- */

/** O que o jutsu pediu para criar; as fichas são montadas na liberação. */
export interface CompanionRequest {
  kind: CompanionKind
  count: number
  /** Clone: o jutsu que criou. */
  cloneJutsu?: string
  /** Invocação: tribo, rank e tamanho escolhidos. */
  tribeId?: string
  rankIndex?: number
  size?: SummonSizeKey
  /** Marionete: o item forjado que está sendo posto em campo. */
  puppetItemId?: string
  puppetName?: string
  /**
   * A ficha da marionete no momento da ativação. Vai junto no pedido de
   * propósito: se o mestre reforjar a marionete depois, a que já está em
   * campo continua sendo a que foi posta em campo.
   */
  puppetSpec?: PuppetSpec
}

/**
 * Golpe ou jutsu que a marionete traz de fábrica.
 *
 * O manual não tem sistema de marionete — isto é regra da casa. Quem manobra
 * é o ninja: a rolagem usa o modificador e a proficiência do DONO, e cada
 * golpe soma o bônus próprio que o mestre definiu na forja. O chakra dos
 * jutsus também sai da ficha do dono, porque a marionete não tem chakra.
 */
export interface PuppetJutsu {
  id: string
  name: string
  /** Chakra que sai da ficha do dono. */
  chakraCost: number
  mode: 'attack' | 'save' | 'none'
  /** Atributo do DONO usado na jogada de ataque. */
  attackAttribute?: AttributeKey
  /** Atributo com que o alvo resiste. */
  saveAttribute?: AttributeKey
  /** Bônus próprio da marionete, somado à rolagem. */
  bonus?: number
  damage?: string
  damageType?: string
  onSaveSuccess?: 'none' | 'half'
  /** Condições que o golpe impõe a quem ele pega. */
  conditions?: string[]
  /** Prazo em rodadas; ausente = até o mestre tirar. */
  conditionRounds?: number
  description?: string
}

/** A ficha da marionete, como o mestre a forja. */
export interface PuppetSpec {
  hp: number
  armorClass: number
  resistancePoints: number
  /** Chakra do dono para pôr a marionete em campo. Zero = de graça. */
  activationCost: number
  attacks: NpcAttack[]
  jutsus: PuppetJutsu[]
  /** Itens acoplados e seus efeitos, em texto livre. */
  gearText?: string
}

export type CompanionKind = 'clone' | 'summon' | 'puppet'

export interface Companion {
  id: string
  tableId: string
  kind: CompanionKind
  /** Ficha que criou. */
  ownerCharacterId: string
  ownerName: string
  /** Quem controla: o uid do dono da ficha, ou o do mestre. */
  ownerUid: string
  name: string
  sourceJutsu: string

  hp: { current: number; max: number }
  chakra: { current: number; max: number }
  armorClass: number
  resistancePoints: number
  modifiers: Modifiers
  proficiencyBonus: number

  /** Golpes prontos (invocação). */
  attacks?: NpcAttack[]
  /** Jutsus que o clone pode usar — os do dono, menos outros clones. */
  jutsus?: Jutsu[]
  /** O manual manda o dano dos jutsus do clone sair pela metade. */
  halfDamage: boolean
  /** Duração literal do jutsu, para a mesa saber quando acaba. */
  duration: string

  /** Invocação: tamanho e bônus de ataque da tribo. */
  summonSize?: SummonSizeKey
  attackModifier?: number
  attributes?: Attributes

  imageUrl?: string
  notes: string
  createdAt: number

  /**
   * Marionete quebrada continua listada, fora de jogo, até o mestre
   * consertar. Clone e invocação não têm esse estado: a 0 PV eles somem.
   */
  status?: 'active' | 'broken'
  /** Marionete: os jutsus gastam o chakra da ficha do dono. */
  usesOwnerChakra?: boolean
  /** Marionete: o item do inventário que a colocou em campo. */
  puppetItemId?: string
  /** Marionete: golpes e jutsus definidos na forja. */
  ownJutsus?: PuppetJutsu[]
  gearText?: string
  /**
   * Armas que a ficha carrega. O clone é cópia de quem o criou, então leva as
   * ferramentas ninja equipadas do dono — mas o que ele arremessa não sai da
   * mochila do original: some junto com o clone.
   */
  weapons?: Weapon[]
  /** O clone pode atacar desarmado, como qualquer pessoa. */
  unarmedDamage?: number
  /** Condições pegando na ficha — ver Character.conditions. */
  conditions?: ActiveCondition[]
}

/** Condição pegando em alguém durante o combate. */
export interface ActiveCondition {
  name: string
  /**
   * Rodadas restantes. Ausente = sem prazo: dura até o mestre tirar — que é
   * o caso de boa parte das condições do manual ("até ser curado", "enquanto
   * vê a fonte do medo").
   */
  rounds?: number
}

export interface CombatParticipant {
  ref: string // "character:<id>" ou "npc:<id>"
  name: string
  initiative: number
  /** Surpreso não age no primeiro turno e vai para o fim da ordem
   * (05-combate.md, "Surpresa"). */
  surprised?: boolean
  /** Chefe do encontro: destaque na lista e no mapa. */
  boss?: boolean
  conditions?: ActiveCondition[]
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
  /**
   * Rodada atual — uma volta completa na ordem de iniciativa.
   *
   * O manual chama de "turno" a vez de cada um (6 segundos) e de "rodada" o
   * ciclo de todos, dizendo "10 turnos = 1 rodada = 1 minuto" (isto é, uma
   * mesa nominal de 10 participantes). Contamos a rodada como o ciclo de
   * fato, que é o que serve para marcar duração de condição.
   */
  combatRound?: number
  /** Quando ligado, toda rolagem de jogador (teste, ataque, dano) precisa da
   * liberação do mestre antes do dado rolar. */
  requireRollApproval: boolean
  /** Quando ligado, cada jogador arrasta a peça do próprio personagem na tela
   * de jogo. As peças de NPCs, inimigos e chefes continuam só com o mestre. */
  playersMoveTokens?: boolean
  /** Fome e sede do grupo — regra da casa, desligada por padrão. */
  survival?: TableSurvival
  /** Faixa no ar para a mesa inteira. */
  audio?: TableAudio
  /** Loja aberta ao grupo. Fechada, some da ficha. */
  shopOpen?: boolean
  /** Se o catálogo de equipamento do manual está à venda junto com os itens
   * forjados pelo mestre. */
  shopUsesManual?: boolean
  /** Nível com que um personagem novo entra na mesa. O manual permite começar
   * acima do 1º ("Mestre pode permitir começar em nível superior",
   * 06-progressao.md), e quem decide isso é o mestre — não o jogador. */
  startingLevel?: number
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

export type SceneTokenKind = 'pc' | 'npc' | 'monster' | 'boss' | 'companion'

export const SCENE_TOKEN_LABELS: Record<SceneTokenKind, string> = {
  pc: 'Personagem',
  npc: 'NPC',
  monster: 'Inimigo',
  boss: 'Chefe',
  companion: 'Clone / invocação',
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
  refType?: 'character' | 'npc' | 'companion'
  refId?: string
  /**
   * Peça de clone/invocação: vive só na cena atual. Não entra no retrato que
   * a biblioteca guarda — carregar uma cena salva não traz clones de volta.
   */
  temporary?: boolean
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
/**
 * Modificadores de Tamanho da invocação (04b-invocacoes.md).
 *
 * É desta tabela — e não da tribo — que saem o bônus na CA, os Pontos de
 * Resistência, o Bônus de Ataque e o Dado de Dano da criatura. O manual é
 * explícito: *"Os Pontos de Resistência da criatura invocada é encontrada da
 * tabela Modificadores de Tamanho a seguir, assim como o Bônus na CA, Bônus
 * de Ataque e Dado de Dano."*
 *
 * Criatura maior acerta mais e resiste menos: o PR sobe com o tamanho, e o
 * teste da criatura é bem-sucedido ao **igualar ou superar o próprio PR**.
 */
export const SUMMON_SIZES = [
  { key: 'MN', name: 'Minúsculo', acBonus: 2, resistancePoints: 10, attackBonus: 2, damageDie: '1d6' },
  { key: 'P', name: 'Pequeno', acBonus: 1, resistancePoints: 12, attackBonus: 3, damageDie: '1d8' },
  { key: 'M', name: 'Médio', acBonus: 0, resistancePoints: 14, attackBonus: 4, damageDie: '1d10' },
  { key: 'G', name: 'Grande', acBonus: -1, resistancePoints: 16, attackBonus: 5, damageDie: '1d12' },
  { key: 'E', name: 'Enorme', acBonus: -2, resistancePoints: 18, attackBonus: 6, damageDie: '2d6' },
  { key: 'GG', name: 'Gigantesco', acBonus: -3, resistancePoints: 20, attackBonus: 7, damageDie: '2d8' },
] as const

export type SummonSizeKey = (typeof SUMMON_SIZES)[number]['key']

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
  /** Tamanho da invocação: define CA, PR, bônus de ataque e dado de dano. */
  size?: SummonSizeKey
  /**
   * Pontuações brutas de atributo. A invocação as usa cruas (não o
   * modificador) nos próprios testes — "1d4 + o valor bruto do Atributo
   * Relevante" (04b-invocacoes.md).
   */
  attributes?: Attributes
  createdAt: number
}

/* ---------------------------------------------------------------------------
 * Loja da mesa e forja do mestre
 *
 * A loja do manual é uma lista fixa de equipamento. Aqui o mestre decide o
 * que está à venda: liga ou desliga o catálogo do manual, forja itens da
 * campanha e escolhe preço e estoque de cada um.
 * ------------------------------------------------------------------------- */

export type ShopItemKind = 'weapon' | 'armor' | 'gear' | 'puppet'

export const SHOP_ITEM_KIND_LABELS: Record<ShopItemKind, string> = {
  weapon: 'Arma',
  armor: 'Armadura',
  gear: 'Item',
  puppet: 'Marionete',
}

export interface ShopItem {
  id: string
  tableId: string
  kind: ShopItemKind
  name: string
  /** Preço em ryo. */
  cost: number
  description?: string
  /** Arma: dano e tipo. */
  damage?: string
  damageType?: string
  properties?: string
  /** Armadura: bônus de CA. */
  armorBonus?: number
  /** Marionete: a ficha que o dono põe em campo. */
  puppet?: PuppetSpec
  /** Unidades restantes. Ausente = sem limite. Zero esgota o item. */
  stock?: number
  /** Fora do ar sem precisar apagar — útil para item sazonal ou de enredo. */
  available: boolean
  createdAt: number
}

/* ---------------------------------------------------------------------------
 * Doação de chakra (regra da casa)
 *
 * Não vem do manual: é uma regra da mesa, restrita ao Ninja Médico.
 *
 * Precisa de fila própria porque mexe em DUAS fichas ao mesmo tempo, e as
 * regras do Firestore não deixam um jogador escrever na ficha alheia — nem
 * deveriam. O médico pede, o mestre libera, e a transferência acontece nas
 * duas pontas de uma vez.
 * ------------------------------------------------------------------------- */

/** Classe que pode doar chakra, conforme a mesa decidiu. */
export const CHAKRA_DONOR_CLASS_ID = 'medical_ninja'

export interface ChakraGift {
  id: string
  tableId: string
  fromCharacterId: string
  fromCharacterName: string
  toCharacterId: string
  toCharacterName: string
  amount: number
  requesterUid: string
  status: 'pending' | 'approved' | 'denied'
  createdAt: number
  resolvedBy?: string
  deniedReason?: string
}

/* ---------------------------------------------------------------------------
 * Lançamento de jutsu
 *
 * Mesma razão da doação de chakra para ter fila própria: aplicar dano mexe na
 * ficha do alvo, e um jogador não escreve na ficha alheia. O conjurador manda
 * a intenção; o mestre libera, e o cliente dele rola, compara e aplica.
 * ------------------------------------------------------------------------- */

export interface JutsuCast {
  id: string
  tableId: string
  casterId: string
  casterName: string
  requesterUid: string
  /**
   * Quem age. Ausente = ficha de personagem, como era antes das fichas
   * temporárias existirem; 'companion' quer dizer que `casterId` é o id de um
   * clone, invocação ou marionete.
   */
  casterKind?: 'character' | 'companion'

  jutsuName: string
  classification: string
  chakraCost: number

  /** Como o jutsu resolve: ataque contra CA, resistência contra PR, ou nada. */
  mode: 'attack' | 'save' | 'none'
  attackAttribute: AttributeKey
  proficient: boolean
  saveAttribute?: AttributeKey
  damage?: string
  damageType?: string
  onSaveSuccess?: 'none' | 'half'

  /** "character:<id>" ou "npc:<id>". Sem alvo, o jutsu só é narrado. */
  targetRef?: string
  targetName?: string

  /** Vantagem elemental (ou outra combinada na mesa) na jogada de ataque. */
  edge?: 'none' | 'advantage' | 'disadvantage'
  edgeReason?: string

  /**
   * Jutsu que cria fichas temporárias (clone ou invocação). Vai no pedido, e
   * não direto na coleção, para o chakra e as fichas nascerem na mesma
   * liberação do mestre — como todo o resto que mexe em ficha.
   */
  companion?: CompanionRequest

  /** Ataque com arma da ficha, em vez de jutsu. */
  weaponId?: string
  /** Arma de arremesso: a resolução desconta uma unidade da ficha. */
  consumesWeapon?: boolean
  /** Jutsu lançado por clone: o manual manda o dano sair pela metade. */
  damageHalved?: boolean
  /** Bônus próprio do golpe da marionete, somado à rolagem do dono. */
  extraBonus?: number
  /**
   * Condições que o jutsu impõe a quem for atingido, lidas da descrição e
   * confirmadas por quem lança.
   */
  conditions?: string[]
  /** Prazo em rodadas; ausente = dura até o mestre tirar. */
  conditionRounds?: number
  /**
   * Alvos adicionais, para o jutsu de área. O app não sabe a geometria da
   * mesa, então quem lança marca quem está na área e a resolução roda para
   * cada um.
   */
  extraTargetRefs?: string[]
  extraTargetNames?: string[]

  status: 'pending' | 'resolved' | 'denied'
  createdAt: number
  resolvedBy?: string
  resultSummary?: string
  deniedReason?: string
}

/* ---------------------------------------------------------------------------
 * Mesa de som
 *
 * A faixa toca do YouTube, no navegador de cada um. O documento da mesa
 * guarda só o que está no ar e desde quando — assim quem chega no meio entra
 * no ponto certo em vez de começar do zero.
 * ------------------------------------------------------------------------- */

export type SoundCategory = 'ambiente' | 'clima' | 'combate'

export const SOUND_CATEGORY_LABELS: Record<SoundCategory, string> = {
  ambiente: 'Ambientação',
  clima: 'Clima',
  combate: 'Combate',
}

export interface SoundTrack {
  id: string
  tableId: string
  category: SoundCategory
  label: string
  /** Link do YouTube como o mestre colou; o id é extraído na hora de tocar. */
  url: string
  createdAt: number
}

/** O que está tocando agora, para todo mundo. */
export interface TableAudio {
  /** Id do vídeo no YouTube. Vazio = silêncio. */
  videoId: string
  label: string
  /** Quando começou (epoch ms) — é o que deixa a mesa em sincronia. */
  startedAt: number
  playing: boolean
  loop: boolean
  /** 0 a 100. */
  volume: number
}

/* ---------------------------------------------------------------------------
 * Fome e sede (regra da casa)
 *
 * O manual não traz regra de alimentação. O que ele traz é o gancho: um
 * descanso longo COM COMIDA E ÁGUA reduz um nível de Exaustão. Então este
 * sistema não inventa uma condição nova — ele conta os dias e, quando passa
 * do limite, sugere a Exaustão que o manual já tem.
 *
 * Os limites são da mesa, não do manual, e ficam configuráveis por isso.
 * ------------------------------------------------------------------------- */

export interface TableSurvival {
  enabled: boolean
  /** Dia corrente da campanha; o mestre avança quando a ficção avança. */
  day: number
  /** Quantos dias sem comer até a fome pesar. */
  foodDays: number
  /** Quantos dias sem beber até a sede pesar. */
  waterDays: number
}

export const DEFAULT_SURVIVAL: TableSurvival = { enabled: false, day: 1, foodDays: 3, waterDays: 1 }

/** Último dia em que o personagem comeu e bebeu. */
export interface CharacterSurvival {
  lastMeal: number
  lastDrink: number
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
