import { ARMORS, GEAR, WEAPONS } from '../data/equipment'
import { newId } from './id'
import type {
  Armor,
  ArmorCatalogEntry,
  InventoryItem,
  Modifiers,
  ShopItem,
  Weapon,
  WeaponCatalogEntry,
} from '../types'

/**
 * Equipamento: uma coisa só, do catálogo à ficha.
 *
 * Antes havia três mundos que não conversavam: o equipamento inicial da
 * classe (texto solto, "10 kunais ou 20 shurikens"), o catálogo da loja e as
 * listas da ficha. Comprar o mesmo item duas vezes criava duas linhas, e
 * armadura equipada não mexia na Classe de Armadura.
 *
 * Aqui mora o que os três precisam saber em comum: quanto custa, quantas
 * unidades vêm em cada compra, o que gasta ao ser usado, e quanto de CA a
 * armadura vestida dá.
 */
/** "1.500 Ryo" -> 1500. */
export function parseRyoCost(cost: string): number {
  const limpo = cost.replace(/\./g, '').match(/\d+/)
  return limpo ? Number(limpo[0]) : 0
}
/**
 * Quantas unidades vêm em uma compra. O catálogo do manual vende alguns
 * itens em maço — "Shuriken (5)", "Senbon (5)" —, então comprar uma vez põe
 * 5 na ficha, e quatro compras fecham as 20 shurikens em uma linha só.
 */
export function bundleSize(name: string): number {
  const m = name.match(/\((\d+)\)\s*$/)
  return m ? Number(m[1]) : 1
}
/** Nome sem o maço: "Shuriken (5)" -> "Shuriken". */
export function unitName(name: string): string {
  return name.replace(/\s*\(\d+\)\s*$/, '').trim()
}
/**
 * Arma que acaba quando usada. O manual não tem uma palavra-chave
 * "consumível", mas tem o que importa: o que é arremessado sai da mão. Só
 * "Retorno" (o Chakram) volta sozinho.
 */
export function isThrowable(properties: string | undefined): boolean {
  const p = properties ?? ''
  return /Arremesso/i.test(p) && !/Retorno/i.test(p)
}
/**
 * Teto de Destreza que a armadura deixa somar na CA: "Total" (sem teto),
 * "Máx. 2", "Nenhum" (nada de Destreza).
 */
export function dexCapFromText(dexBonus: string | undefined): number | undefined {
  const t = dexBonus ?? 'Total'
  if (/nenhum/i.test(t)) return 0
  const m = t.match(/(\d+)/)
  return m ? Number(m[1]) : undefined
}
/**
 * Classe de Armadura: **10 + bônus da armadura vestida + Mod. Destreza
 * (dentro do teto da armadura) + metade do Bônus de Proficiência**
 * (05-combate.md e a nota de `calculateDerivedStats`).
 *
 * Com mais de uma peça vestida — armadura e um escudo da forja do mestre, por
 * exemplo — os bônus somam e vale o teto de Destreza mais apertado, que é o
 * que faz sentido: a peça mais pesada é que atrapalha.
 */
export function armorClassFor(
  who: { modifiers: Modifiers; proficiencyBonus: number },
  armor: readonly Armor[],
): number {
  const vestidas = armor.filter((a) => a.equipped)
  const bonusArmadura = vestidas.reduce((soma, a) => soma + (a.defenseBonus || 0), 0)
  const tetos = vestidas.map((a) => a.dexCap).filter((t): t is number => typeof t === 'number')
  const teto = tetos.length > 0 ? Math.min(...tetos) : undefined
  const destreza = teto === undefined ? who.modifiers.dexterity : Math.min(who.modifiers.dexterity, teto)
  return 10 + bonusArmadura + destreza + Math.floor(who.proficiencyBonus / 2)
}
/** Frase curta explicando a conta da CA, para a ficha mostrar. */
export function armorClassBreakdown(
  who: { modifiers: Modifiers; proficiencyBonus: number },
  armor: readonly Armor[],
): string {
  const vestidas = armor.filter((a) => a.equipped)
  const bonusArmadura = vestidas.reduce((soma, a) => soma + (a.defenseBonus || 0), 0)
  const tetos = vestidas.map((a) => a.dexCap).filter((t): t is number => typeof t === 'number')
  const teto = tetos.length > 0 ? Math.min(...tetos) : undefined
  const destrezaCheia = who.modifiers.dexterity
  const destreza = teto === undefined ? destrezaCheia : Math.min(destrezaCheia, teto)
  const partes = [
    '10 base',
    vestidas.length > 0 ? `+${bonusArmadura} de ${vestidas.map((a) => a.name).join(' e ')}` : 'sem armadura',
    `${destreza >= 0 ? '+' : ''}${destreza} de Destreza${teto !== undefined && destreza < destrezaCheia ? ` (teto ${teto})` : ''}`,
    `+${Math.floor(who.proficiencyBonus / 2)} de metade da proficiência`,
  ]
  return partes.join(' · ')
}
/* ---------------------------------------------------------------------------
 * Pilhas: o mesmo item nunca abre duas linhas.
 * ------------------------------------------------------------------------- */
/** Junta no que já existe (pelo nome) ou abre uma linha nova. */
export function stackGear(lista: readonly InventoryItem[], nome: string, quantidade: number, note?: string): InventoryItem[] {
  const alvo = unitName(nome)
  const existe = lista.find((i) => unitName(i.name).toLowerCase() === alvo.toLowerCase())
  if (existe) {
    return lista.map((i) => (i.id === existe.id ? { ...i, quantity: i.quantity + quantidade } : i))
  }
  return [...lista, { id: newId(), name: alvo, quantity: quantidade, ...(note ? { note } : {}) }]
}
/** Mesma ideia para armas: 20 shurikens ficam em uma linha com quantity 20. */
export function stackWeapon(lista: readonly Weapon[], nova: Omit<Weapon, 'id'>, quantidade: number): Weapon[] {
  const alvo = unitName(nova.name)
  const existe = lista.find((w) => unitName(w.name).toLowerCase() === alvo.toLowerCase())
  if (existe) {
    return lista.map((w) => (w.id === existe.id ? { ...w, quantity: (w.quantity ?? 1) + quantidade } : w))
  }
  return [...lista, { ...nova, name: alvo, id: newId(), quantity: quantidade }]
}
export function stackArmor(lista: readonly Armor[], nova: Omit<Armor, 'id'>): Armor[] {
  const existe = lista.find((a) => a.name.toLowerCase() === nova.name.toLowerCase())
  if (existe) return lista.map((a) => (a.id === existe.id ? { ...a, quantity: (a.quantity ?? 1) + 1 } : a))
  return [...lista, { ...nova, id: newId(), quantity: 1 }]
}
/** Gasta uma unidade da arma; a última usada sai da lista. */
export function spendWeapon(lista: readonly Weapon[], weaponId: string, quantidade = 1): Weapon[] {
  return lista.flatMap((w) => {
    if (w.id !== weaponId) return [w]
    const resta = (w.quantity ?? 1) - quantidade
    return resta > 0 ? [{ ...w, quantity: resta }] : []
  })
}
/** Gasta uma unidade de um item de inventário (bomba de fumaça, selo...). */
export function spendGear(lista: readonly InventoryItem[], itemId: string, quantidade = 1): InventoryItem[] {
  return lista.flatMap((i) => {
    if (i.id !== itemId) return [i]
    const resta = i.quantity - quantidade
    return resta > 0 ? [{ ...i, quantity: resta }] : []
  })
}
/* ---------------------------------------------------------------------------
 * Do catálogo para a ficha — um lugar só, usado pela criação, pela loja e
 * pela entrega do mestre, para os três nunca divergirem.
 * ------------------------------------------------------------------------- */
export function weaponFromCatalog(entry: WeaponCatalogEntry): Omit<Weapon, 'id'> {
  return {
    name: unitName(entry.name),
    damage: entry.damage,
    damageType: entry.damageType,
    properties: entry.properties,
    consumable: isThrowable(entry.properties),
    catalogName: entry.name,
    equipped: true,
  }
}
export function armorFromCatalog(entry: ArmorCatalogEntry): Omit<Armor, 'id'> {
  return {
    name: entry.name,
    defenseBonus: entry.armorBonus,
    dexCap: dexCapFromText(entry.dexBonus),
    note: entry.effect,
    catalogName: entry.name,
    equipped: true,
  }
}
/** Item da forja do mestre: mesmo caminho, catálogo diferente. */
export function weaponFromShopItem(item: ShopItem): Omit<Weapon, 'id'> {
  return {
    name: unitName(item.name),
    damage: item.damage ?? '1d4',
    properties: item.properties,
    consumable: isThrowable(item.properties),
    note: item.description,
    equipped: true,
  }
}
export function armorFromShopItem(item: ShopItem): Omit<Armor, 'id'> {
  return {
    name: item.name,
    defenseBonus: item.armorBonus ?? 0,
    note: item.description,
    equipped: true,
  }
}
/* ---------------------------------------------------------------------------
 * Equipamento inicial da classe: de texto solto para itens de verdade.
 * ------------------------------------------------------------------------- */

export interface StartingPick {
  kind: 'weapon' | 'armor' | 'gear'
  /** Nome exato no catálogo. */
  name: string
  /** Unidades que o texto pede (já em unidades, não em maços). */
  quantity: number
}

/**
 * Uma alternativa de uma linha do equipamento inicial:
 *
 *  - `items` — o texto cita itens que existem no catálogo, então já vêm
 *    prontos ("10 kunais");
 *  - `choose` — o texto deixa a escolha em aberto por categoria ("1 arma
 *    simples"), e quem está criando escolhe no catálogo daquela categoria;
 *  - `free` — o texto cita algo que o capítulo de Equipamento não lista
 *    ("2 bombas de fumaça", "Kit de Medicina"). Entra como item avulso, com o
 *    nome que o manual usa. Não inventamos preço nem efeito para eles.
 */
export type StartingOption =
  | { label: string; type: 'items'; picks: StartingPick[] }
  | { label: string; type: 'choose'; kind: 'weapon' | 'gear'; category: string; count: number }
  | { label: string; type: 'free'; count: number }

export interface StartingChoice {
  /** O texto como o manual escreve, ex.: "10 kunais ou 20 shurikens". */
  label: string
  /** Cada alternativa; uma só quando a linha não oferece escolha. */
  options: StartingOption[]
}

const CONECTORES = new Set(['de', 'da', 'do', 'das', 'dos', 'em', 'para', 'com', 'e', 'a', 'o', 'as', 'os', 'ou'])

/**
 * Nomes diferentes para o mesmo item.
 *
 * O manual chama a mesma coisa de dois jeitos em capítulos diferentes — do
 * mesmo modo que "Discernimento" e "Intuição" são a mesma perícia. Em vez de
 * criar itens duplicados no catálogo, o texto do equipamento inicial é
 * traduzido para o nome que o capítulo de Equipamento usa.
 */
const SINONIMOS: { de: RegExp; para: string }[] = [
  // "papel bomba" é o selo explosivo, que o catálogo já precifica em 100 ryo.
  { de: /pap[eé](l|is)\s+bomba|bomba\s+de\s+papel/i, para: 'Selos Explosivos' },
  // "Lâminas de Soco" e "Lâminas de Punho" são a mesma arma marcial.
  { de: /l[âa]minas?\s+de\s+soco/i, para: 'Lâminas de Punho' },
  // O Ninja Médico começa com "Kit de Medicina"; o catálogo diz "Kit Médico".
  { de: /kit\s+de\s+medicina/i, para: 'Kit Médico' },
]

/** Troca o nome citado pelo nome do catálogo, quando são a mesma coisa. */
function aplicarSinonimos(texto: string): string {
  for (const s of SINONIMOS) if (s.de.test(texto)) return s.para
  return texto
}

function semAcento(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Palavras que valem para comparar nomes. Números saem (são quantidade), os
 * conectores saem, e o "s" final sai para "kunais" casar com "Kunai".
 *
 * A comparação é palavra por palavra de propósito: por substring, o item "Pá"
 * do catálogo casava dentro de "bomba de papel".
 */
function palavras(texto: string): string[] {
  return semAcento(texto)
    .replace(/[()\-–/,.]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !/^\d+$/.test(w) && !CONECTORES.has(w))
    .map((w) => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
}

interface Candidato {
  kind: 'weapon' | 'armor' | 'gear'
  name: string
  tokens: string[]
}

let candidatosCache: Candidato[] | null = null

function candidatos(): Candidato[] {
  if (candidatosCache) return candidatosCache
  candidatosCache = [
    ...ARMORS.map((a) => ({ kind: 'armor' as const, name: a.name, tokens: palavras(a.name) })),
    ...WEAPONS.map((w) => ({ kind: 'weapon' as const, name: w.name, tokens: palavras(unitName(w.name)) })),
    ...GEAR.map((g) => ({ kind: 'gear' as const, name: g.name, tokens: palavras(g.name) })),
  ].filter((c) => c.tokens.length > 0)
  return candidatosCache
}

/**
 * Acha no catálogo o item que o texto cita: todas as palavras do nome do
 * catálogo precisam aparecer no texto, e ganha quem casar com mais palavras
 * ("Colete de Combate Blindado" na frente de "Colete de Combate").
 */
function acharNoCatalogo(texto: string): Candidato | null {
  const ditas = new Set(palavras(texto))
  if (ditas.size === 0) return null
  let melhor: Candidato | null = null
  for (const c of candidatos()) {
    if (!c.tokens.every((t) => ditas.has(t))) continue
    if (!melhor || c.tokens.length > melhor.tokens.length) melhor = c
  }
  return melhor
}

/** Categorias abertas que o texto da classe usa em vez de nomear o item. */
function lerCategoria(texto: string): { kind: 'weapon' | 'gear'; category: string } | null {
  const t = semAcento(texto)
  if (/\bmarcia(l|is)\b/.test(t)) return { kind: 'weapon', category: 'Marcial' }
  if (/\bsimple(s)?\b/.test(t)) return { kind: 'weapon', category: 'Simples' }
  if (/\bkit\b/.test(t) && /escolha/.test(t)) return { kind: 'gear', category: 'Kit' }
  return null
}

/** Itens do catálogo que servem para uma categoria aberta. */
export function categoryOptions(kind: 'weapon' | 'gear', category: string): string[] {
  if (kind === 'weapon') return WEAPONS.filter((w) => w.category.startsWith(category)).map((w) => w.name)
  return GEAR.filter((g) => semAcento(g.name).startsWith(semAcento(category))).map((g) => g.name)
}

function lerOpcao(texto: string): StartingOption {
  const limpo = texto.trim().replace(/\s+/g, ' ')
  const pedido = Number(limpo.match(/^(\d+)/)?.[1] ?? 0)
  const count = pedido > 0 ? pedido : 1

  const achado = acharNoCatalogo(aplicarSinonimos(limpo))
  if (achado) {
    // "20 shurikens" pede 20 unidades, mesmo o catálogo vendendo de 5 em 5.
    const quantidade = pedido > 0 ? pedido : bundleSize(achado.name)
    return { label: limpo, type: 'items', picks: [{ kind: achado.kind, name: achado.name, quantity: quantidade }] }
  }

  const categoria = lerCategoria(limpo)
  if (categoria) return { label: limpo, type: 'choose', ...categoria, count }

  return { label: limpo, type: 'free', count }
}

/**
 * Lê a lista de equipamento inicial da classe e devolve escolhas de verdade,
 * ligadas ao mesmo catálogo da loja.
 *
 * O manual separa alternativas com "ou" e com vírgula ("Tonfa, Nunchaku ou
 * Braçadeiras de Combate"), então cada linha vira uma escolha entre as
 * alternativas que ela oferece.
 */
export function readStartingEquipment(linhas: readonly string[]): StartingChoice[] {
  return linhas.map((linha) => {
    const partes = linha
      .split(/\s+ou\s+|,\s*/i)
      .map((p) => p.trim())
      .filter(Boolean)
    return { label: linha, options: partes.map(lerOpcao) }
  })
}

/** Aplica escolhas às três listas da ficha, já empilhando as repetidas. */
export function applyStartingPicks(
  picks: readonly StartingPick[],
  avulsos: readonly { name: string; quantity: number }[] = [],
): { weapons: Weapon[]; armor: Armor[]; equipment: InventoryItem[] } {
  let weapons: Weapon[] = []
  let armor: Armor[] = []
  let equipment: InventoryItem[] = []
  for (const p of picks) {
    if (p.kind === 'weapon') {
      const entry = WEAPONS.find((w) => w.name === p.name)
      if (entry) weapons = stackWeapon(weapons, weaponFromCatalog(entry), p.quantity)
      continue
    }
    if (p.kind === 'armor') {
      const entry = ARMORS.find((a) => a.name === p.name)
      if (entry) armor = stackArmor(armor, armorFromCatalog(entry))
      continue
    }
    const entry = GEAR.find((g) => g.name === p.name)
    equipment = stackGear(equipment, p.name, p.quantity, entry?.effect)
  }
  for (const a of avulsos) {
    equipment = stackGear(equipment, a.name, a.quantity, 'Citado no equipamento inicial da classe; não consta no capítulo de Equipamento do manual.')
  }
  return { weapons, armor, equipment }
}

/**
 * Itens do catálogo por tipo, para os seletores de compra e de entrega.
 *
 * Item da casa vai marcado: o preço e o efeito dele foram definidos para a
 * mesa, não estão no capítulo de Equipamento, e quem está escolhendo merece
 * saber disso na hora de escolher.
 */
export function catalogEntries(kind: 'weapon' | 'armor' | 'gear'): { name: string; cost: number; detail: string }[] {
  const daCasa = (marcado: boolean | undefined) => (marcado ? ' · item da casa' : '')
  if (kind === 'weapon') {
    return WEAPONS.map((w) => ({
      name: w.name,
      cost: parseRyoCost(w.cost),
      detail: resumo(`${w.damage} ${w.damageType} · ${w.properties}`),
    }))
  }
  if (kind === 'armor') {
    return ARMORS.map((a) => ({
      name: a.name,
      cost: parseRyoCost(a.cost),
      detail: resumo(`+${a.armorBonus} CA · Destreza ${a.dexBonus}${a.effect ? ` · ${a.effect}` : ''}`) + daCasa(a.houseRule),
    }))
  }
  return GEAR.map((g) => ({
    name: g.name,
    cost: parseRyoCost(g.cost),
    detail: resumo(g.effect ?? g.category) + daCasa(g.houseRule),
  }))
}

/**
 * Corta a descrição no fim de uma palavra.
 *
 * O efeito de um item vai a 150 caracteres no manual, e um `<option>` com
 * esse tamanho estica o `<select>` para a largura da opção mais longa — era
 * isso que empurrava o inventário para fora da tela no celular. O texto
 * inteiro continua na ficha, na anotação do item.
 */
function resumo(texto: string, maximo = 52): string {
  const limpo = texto.trim()
  if (limpo.length <= maximo) return limpo
  const corte = limpo.slice(0, maximo)
  const espaco = corte.lastIndexOf(' ')
  return `${(espaco > maximo * 0.6 ? corte.slice(0, espaco) : corte).replace(/[,;·]$/, '')}…`
}
