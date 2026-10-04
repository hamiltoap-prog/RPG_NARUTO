import { CLASSES } from '../data/classes'
import { xpForLevel } from '../data/xpTable'
import { suggestedRank } from '../data/ranks'
import { averageStartingWealth, calculateDerivedStats, totalAttributes } from './characterMath'
import { applyStartingPicks, armorClassFor, bundleSize, categoryOptions, readStartingEquipment, unitName } from './equipment'
import type { StartingPick } from './equipment'
import {
  ELEMENTS,
  clanElements,
  effectiveElements,
  eligibleJutsus,
  jutsusKnownForLevel,
  maxRankForLevel,
  normalizeRank,
  rankIndex,
} from './jutsuAccess'
import { newId } from './id'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Attributes, Character, CharClass, Clan, Jutsu, JutsuCatalogEntry } from '../types'

/**
 * Criação rápida de NPC com ficha completa.
 *
 * O mestre escolhe o que importa para a cena — nome, nível e clã (e, se
 * quiser, a classe) — e o resto é sorteado, mas sorteado **com critério**: o
 * mesmo caminho que um jogador faria no assistente, só que decidido pelos
 * dados. A ficha sai pelas mesmas contas do assistente (PV, chakra, CA, PR,
 * equipamento inicial, posto), então não há "ficha de NPC" diferente da de um
 * jogador: é a mesma ficha, preenchida mais depressa.
 *
 * O que torna o sorteio "condizente":
 *  - **classe**: pesa a afinidade do clã (bônus de atributo nos atributos
 *    principais da classe) e se o manual sugere aquele clã para a classe;
 *  - **atributos**: o arranjo padrão (15, 14, 13, 12, 10, 8) distribuído na
 *    ordem que a classe pede, com os Aumentos de Atributo do nível aplicados;
 *  - **jutsus**: só os que a ficha pode aprender (rank, clã, afinidade),
 *    puxando para o estilo da classe e para os ranks mais altos permitidos,
 *    com uma parte vinda do próprio clã;
 *  - **equipamento**: uma alternativa sorteada em cada linha do equipamento
 *    inicial da classe, com as vagas abertas ("1 arma simples") preenchidas
 *    pelo catálogo.
 *
 * Função pura: o sorteio vem de `rng`, então dá para testar e para repetir.
 */

export type Rng = () => number

const ARRANJO_PADRAO = [15, 14, 13, 12, 10, 8]
const ARRANJO_POR_NOME: Record<string, AttributeKey> = Object.fromEntries(
  ATTRIBUTE_KEYS.map((k) => [semAcento(ATTRIBUTE_LABELS[k]), k]),
) as Record<string, AttributeKey>

function semAcento(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

function sortear<T>(rng: Rng, lista: readonly T[]): T {
  return lista[Math.min(lista.length - 1, Math.floor(rng() * lista.length))]
}

/** Sorteio com peso; peso zero nunca sai. */
function sortearComPeso<T>(rng: Rng, lista: readonly T[], peso: (x: T) => number): T | undefined {
  const pesos = lista.map((x) => Math.max(0, peso(x)))
  const total = pesos.reduce((a, b) => a + b, 0)
  if (total <= 0) return undefined
  let r = rng() * total
  for (let i = 0; i < lista.length; i++) {
    r -= pesos[i]
    if (r < 0) return lista[i]
  }
  return lista[lista.length - 1]
}

function embaralhar<T>(rng: Rng, lista: readonly T[]): T[] {
  const out = [...lista]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Os atributos citados num trecho de texto, na ordem em que aparecem. */
function atributosNoTexto(texto: string): AttributeKey[] {
  const t = semAcento(texto)
  return Object.entries(ARRANJO_POR_NOME)
    .map(([nome, k]) => ({ k, i: t.indexOf(nome) }))
    .filter((x) => x.i >= 0)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.k)
}

/**
 * O que a classe pede, lido do próprio "Atributo Principal" do manual:
 * "Força ou Destreza (depois Constituição)" → principais [FOR, DES],
 * secundários [CON].
 */
export function prioridadesDaClasse(c: Pick<CharClass, 'primaryAbility'>): {
  principais: AttributeKey[]
  secundarios: AttributeKey[]
} {
  const [antes, depois = ''] = c.primaryAbility.split(/\(\s*depois/i)
  const principais = atributosNoTexto(antes)
  const secundarios = atributosNoTexto(depois).filter((k) => !principais.includes(k))
  return { principais, secundarios }
}

/** O quanto um clã combina com uma classe. Nunca zero: qualquer combinação pode sair. */
export function afinidadeClaClasse(clan: Clan, c: CharClass): number {
  const { principais, secundarios } = prioridadesDaClasse(c)
  const bonusPrincipal = Math.max(0, ...principais.map((k) => clan.bonuses[k] ?? 0))
  const bonusSecundario = Math.max(0, ...secundarios.map((k) => clan.bonuses[k] ?? 0))
  const sugerido = c.suggestedClans && semAcento(c.suggestedClans).includes(semAcento(clan.name)) ? 4 : 0
  return 1 + bonusPrincipal * 2 + bonusSecundario + sugerido
}

/** A ordem em que o arranjo padrão é distribuído para esta classe. */
function ordemDosAtributos(rng: Rng, c: CharClass): AttributeKey[] {
  const { principais, secundarios } = prioridadesDaClasse(c)
  const ordem: AttributeKey[] = []
  const por = (k: AttributeKey | undefined) => {
    if (k && !ordem.includes(k)) ordem.push(k)
  }
  // "Força ou Destreza": um dos dois é o principal, sorteado.
  por(principais.length ? sortear(rng, principais) : undefined)
  por(secundarios.length ? sortear(rng, secundarios) : undefined)
  // Todo shinobi precisa aguentar pancada: Constituição vem logo depois.
  por('constitution')
  for (const k of embaralhar(rng, [...principais, ...secundarios])) por(k)
  for (const k of embaralhar(rng, ATTRIBUTE_KEYS)) por(k)
  return ordem
}

/** Quantos "Aumento de Atributo" a classe já deu até este nível. */
function aumentosDeAtributo(c: CharClass, nivel: number): number {
  return c.progression.filter((p) => p.level <= nivel && /aumento de atributo/i.test(p.features)).length
}

/** Peso de cada classificação de jutsu, pelo estilo da classe. */
const ESTILO_DA_CLASSE: Record<string, Record<string, number>> = {
  genjutsu_specialist: { Genjutsu: 5, Ninjutsu: 1, Taijutsu: 0.3, Bukijutsu: 0.3 },
  hunter_ninja: { Bukijutsu: 3, Ninjutsu: 2, Taijutsu: 1.5, Genjutsu: 0.5 },
  strategist: { Ninjutsu: 2.5, Genjutsu: 2.5, Bukijutsu: 1, Taijutsu: 0.5 },
  medical_ninja: { Ninjutsu: 3, Taijutsu: 1, Genjutsu: 0.5, Bukijutsu: 0.5 },
  ninjutsu_specialist: { Ninjutsu: 5, Genjutsu: 0.5, Taijutsu: 0.3, Bukijutsu: 0.3 },
  scout_ninja: { Ninjutsu: 2, Taijutsu: 2, Bukijutsu: 1.5, Genjutsu: 1 },
  taijutsu_specialist: { Taijutsu: 6, Ninjutsu: 0.5, Bukijutsu: 0.5, Genjutsu: 0.2 },
  weapon_specialist: { Bukijutsu: 6, Taijutsu: 1.5, Ninjutsu: 0.5, Genjutsu: 0.2 },
}

function pesoDoJutsu(j: JutsuCatalogEntry, c: CharClass, rankMax: number): number {
  const estilo = ESTILO_DA_CLASSE[c.id] ?? {}
  const tipos = j.classification.split(/,\s*/)
  let peso = Math.max(0.2, ...tipos.map((t) => estilo[t] ?? 1))
  // Ninja médico: o que cura e trata vale mais.
  if (c.id === 'medical_ninja' && /m[eé]dic|cura|curar/i.test(`${j.keywords} ${j.name}`)) peso *= 3
  // Ranks mais altos permitidos saem mais — um Jonin não vive de jutsu de Genin.
  peso *= 1 + rankIndex(normalizeRank(j.rank)) / Math.max(1, rankMax)
  return peso
}

function detalhesDoJutsu(entry: JutsuCatalogEntry): string {
  return [
    `${entry.classification} · ${entry.rank}`,
    `Tempo: ${entry.castingTime} · Alcance: ${entry.range} · Duração: ${entry.duration}`,
    entry.description,
  ]
    .filter(Boolean)
    .join('\n')
}

/** Os jutsus do NPC: um terço do clã (quando há), o resto no estilo da classe. */
export function sortearJutsus(
  rng: Rng,
  ctx: { clan: Clan; classe: CharClass; nivel: number; elementos: string[] },
): JutsuCatalogEntry[] {
  const rankMax = maxRankForLevel(ctx.classe, ctx.nivel)
  const elegiveis = eligibleJutsus({ clanId: ctx.clan.id, elements: ctx.elementos, maxRank: rankMax })
  // Sem número na tabela da classe, um punhado proporcional ao nível.
  const limite = jutsusKnownForLevel(ctx.classe, ctx.nivel) || Math.min(12, 3 + Math.ceil(ctx.nivel / 2))
  const doCla = elegiveis.filter((j) => j.clanId === ctx.clan.id)
  const outros = elegiveis.filter((j) => j.clanId !== ctx.clan.id)
  const escolhidos: JutsuCatalogEntry[] = []
  const pegar = (lista: JutsuCatalogEntry[], quantos: number) => {
    const resto = [...lista]
    while (quantos > 0 && resto.length > 0 && escolhidos.length < limite) {
      const j = sortearComPeso(rng, resto, (x) => pesoDoJutsu(x, ctx.classe, rankIndex(rankMax)))
      if (!j) break
      escolhidos.push(j)
      resto.splice(resto.indexOf(j), 1)
      quantos--
    }
  }
  pegar(doCla, Math.ceil(limite / 3))
  pegar(outros, limite - escolhidos.length)
  // Faltou do resto (lista curta): completa com o que sobrou do clã.
  pegar(
    doCla.filter((j) => !escolhidos.includes(j)),
    limite - escolhidos.length,
  )
  return escolhidos
}

/** Uma alternativa por linha do equipamento inicial, com as vagas abertas preenchidas. */
function sortearEquipamento(rng: Rng, c: CharClass) {
  const picks: StartingPick[] = []
  const avulsos: { name: string; quantity: number }[] = []
  for (const linha of readStartingEquipment(c.startingEquipment)) {
    const op = sortear(rng, linha.options)
    if (!op) continue
    if (op.type === 'items') picks.push(...op.picks)
    else if (op.type === 'choose') {
      const opcoes = categoryOptions(op.kind, op.category)
      for (let i = 0; i < op.count && opcoes.length > 0; i++) {
        const nome = sortear(rng, opcoes)
        picks.push({ kind: op.kind, name: nome, quantity: bundleSize(nome) })
      }
    } else avulsos.push({ name: unitName(op.label.replace(/^\d+\s*/, '')), quantity: op.count })
  }
  return applyStartingPicks(picks, avulsos)
}

export interface PedidoDeNPC {
  tableId: string
  ownerUid: string
  name: string
  level: number
  clan: Clan
  /** Classe escolhida pelo mestre; sem ela, sorteada pela afinidade com o clã. */
  classId?: string
  rng?: Rng
}

export function gerarNPC(p: PedidoDeNPC): Omit<Character, 'id'> {
  const rng = p.rng ?? Math.random
  const nivel = Math.min(20, Math.max(1, Math.round(p.level) || 1))
  const classe =
    CLASSES.find((c) => c.id === p.classId) ?? sortearComPeso(rng, CLASSES, (c) => afinidadeClaClasse(p.clan, c)) ?? CLASSES[0]

  // Atributos: arranjo padrão na ordem da classe, depois os aumentos do nível.
  const ordem = ordemDosAtributos(rng, classe)
  const base = {} as Attributes
  ordem.forEach((k, i) => (base[k] = ARRANJO_PADRAO[i] ?? 10))
  const atributos = totalAttributes(base, p.clan)
  for (let n = aumentosDeAtributo(classe, nivel); n > 0; n--) {
    const alvo = ordem.find((k) => atributos[k] < 20)
    if (!alvo) break
    atributos[alvo] = Math.min(20, atributos[alvo] + 2)
  }

  // Afinidade: a do clã vem de graça; sem nenhuma, uma sorteada (a "Liberação de Natureza").
  const elementos = clanElements(p.clan).length > 0 ? [] : [sortear(rng, ELEMENTS)]
  const efetivos = effectiveElements(p.clan, elementos)

  const derivados = calculateDerivedStats(atributos, classe, nivel)
  const equipamento = sortearEquipamento(rng, classe)
  const jutsus: Jutsu[] = sortearJutsus(rng, { clan: p.clan, classe, nivel, elementos: efetivos }).map((j) => ({
    id: newId(),
    name: j.name,
    details: detalhesDoJutsu(j),
    chakraCost: j.cost,
  }))

  const agora = Date.now()
  return {
    tableId: p.tableId,
    ownerUid: p.ownerUid,
    name: p.name.trim() || 'NPC sem nome',
    clanId: p.clan.id,
    classId: classe.id,
    level: nivel,
    xp: xpForLevel(nivel),
    elements: elementos,
    isNPC: true,
    visible: false,
    attributes: atributos,
    modifiers: derivados.modifiers,
    hp: { current: derivados.hp, max: derivados.hp },
    chakra: { current: derivados.chakra, max: derivados.chakra },
    armorClass: armorClassFor(
      { modifiers: derivados.modifiers, proficiencyBonus: derivados.proficiencyBonus },
      equipamento.armor,
    ),
    proficiencyBonus: derivados.proficiencyBonus,
    resistancePoints: derivados.resistancePoints,
    description: {
      rank: suggestedRank(nivel).label,
      title: '',
      appearance: '',
      personalityTraits: '',
      ideals: '',
      bonds: '',
      flaws: '',
    },
    equipment: equipamento.equipment,
    weapons: equipamento.weapons,
    armor: equipamento.armor,
    jutsus,
    proficiencies: [...p.clan.skillProficiencies],
    condition: 'Normal',
    imageUrl: '',
    ryo: averageStartingWealth(classe.startingWealth),
    notes: 'Ficha criada pela criação rápida de NPC.',
    createdAt: agora,
    updatedAt: agora,
    isAlive: true,
  }
}

/** Gerador com semente, para "sortear de novo" e para as checagens. */
export function rngComSemente(semente: number): Rng {
  let s = semente >>> 0 || 1
  return () => {
    // mulberry32
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
