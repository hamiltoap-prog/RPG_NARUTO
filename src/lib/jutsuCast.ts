import { CONDITIONS } from '../data/conditions'
import { allJutsus } from './jutsuCatalog'
import { applyCriticalMultiplier, rollD20, rollDice } from './dice'
import type { Edge } from './dice'
import type { AttributeKey, Character, Companion, JutsuCatalogEntry, Modifiers, NPC } from '../types'

/**
 * Lançar um jutsu sem fazer conta na mão.
 *
 * O manual traz cada jutsu como texto corrido, então nem tudo dá para ler
 * automaticamente — medindo o catálogo: 59% trazem um dado NdM, 18% pedem um
 * teste de ataque e 30% pedem uma resistência. O que este módulo faz é ler o
 * que der e deixar o resto à vista para a pessoa ajustar, em vez de fingir
 * que entende 631 descrições livres.
 */

/** Atributo de ataque por classificação (05-combate.md, "Mecânica de ataque"). */
export function attackAttribute(classification: string): AttributeKey {
  const c = classification.toLowerCase()
  if (c.includes('genjutsu')) return 'wisdom'
  if (c.includes('taijutsu') || c.includes('bukijutsu')) return 'dexterity'
  // Ninjutsu e Hijutsu (jutsu de clã, quase sempre ninjutsu) usam Inteligência.
  return 'intelligence'
}

/** Os outros atributos que o manual admite para a mesma classificação. */
export function attackAlternatives(classification: string): AttributeKey[] {
  const c = classification.toLowerCase()
  if (c.includes('genjutsu')) return ['wisdom']
  if (c.includes('taijutsu') || c.includes('bukijutsu')) return ['dexterity', 'strength']
  return ['intelligence', 'dexterity']
}

export type CastMode = 'attack' | 'save' | 'none'

export interface JutsuReading {
  mode: CastMode
  /** Atributo que o ALVO usa para resistir, quando o jutsu pede resistência. */
  saveAttribute?: AttributeKey
  /** Notação do primeiro dado de dano encontrado, ex: "4d6". */
  damage?: string
  damageType?: string
  /** Custo em chakra, já em número. */
  cost: number
  /** Dado de cura, quando o jutsu recupera PV em vez de causar dano. */
  healing?: string
  /**
   * Condições que a descrição diz impor. O manual escreve isso em texto
   * corrido, então a leitura é um palpite — quem lança confirma na tela antes
   * de a condição grudar em alguém.
   */
  conditions: string[]
  /** Prazo em rodadas, quando o texto dá um; ausente = até o mestre tirar. */
  conditionRounds?: number
  /** Como a descrição fala da área atingida, quando ela pega mais de um. */
  area?: string
}

const ATRIBUTO_POR_NOME: Record<string, AttributeKey> = {
  forca: 'strength',
  destreza: 'dexterity',
  constituicao: 'constitution',
  inteligencia: 'intelligence',
  sabedoria: 'wisdom',
  carisma: 'charisma',
}

/** Os tipos de dano que aparecem no texto dos jutsus do manual. */
const TIPOS_DE_DANO = [
  'cortante',
  'perfurante',
  'contundente',
  'concuss[ãa]o',
  'el[ée]trico',
  'ps[íi]quico',
  'necr[óo]tico',
  'radiante',
  'for[çc]a',
  'veneno',
  'fogo',
  'frio',
  'terra',
  'vento',
  '[áa]cido',
] as const

function semAcento(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

/**
 * Como cada condição do manual aparece escrita dentro da descrição de um
 * jutsu. O texto nunca usa o nome da ficha ("Caído"); usa o verbo ("derruba",
 * "cai ao chão"), então cada condição tem as formas que de fato aparecem.
 */
const MARCAS_DE_CONDICAO: [string, RegExp][] = [
  ['Sangramento', /\bsangrament\w*|\bsangrando\b|\bsangra\b/],
  ['Queimado', /\bqueimad\w+/],
  ['Cego', /\bceg[oa]s?\b|\bcegad\w+|\bcegueira\b/],
  ['Atordoado', /\batordoad\w+|\batordoament\w+/],
  ['Surdo', /\bsurd[oa]s?\b|\bsurdez\b/],
  ['Envenenado', /\benvenenad\w+|\benvenenament\w+/],
  ['Exausto', /\bexaust[oa]s?\b|\bexaustao\b/],
  ['Amedrontado', /\bamedrontad\w+/],
  ['Agarrado', /\bagarrad\w+/],
  ['Incapacitado', /\bincapacitad\w+/],
  ['Invisível', /\binvisiv\w+|\binvisibilidade\b/],
  ['Paralisado', /\bparalisad\w+|\bparalisia\b/],
  ['Petrificado', /\bpetrificad\w+/],
  ['Caído', /\bcaid[oa]s?\b|\bderrubad\w+|\bderruba\b|\bao chao\b/],
  ['Restrito', /\brestrit[oa]s?\b|\brestringid\w+/],
  ['Choque', /\bem choque\b|\bchocad\w+/],
  ['Lento', /\blent[oa]s?\b/],
  ['Estupefato', /\bestupefat\w+/],
  ['Inconsciente', /\binconscient\w+/],
  ['Enfraquecido', /\benfraquecid\w+/],
  ['Frenesi', /\bfrenesi\b/],
  ['Enfeitiçado', /\benfeiticad\w+/],
]

/**
 * O texto cita condições por dois motivos opostos: para impor ("o alvo fica
 * Cego") e para tirar ou ignorar ("remove Cego", "imune a Cego", "resistência
 * a essa condição"). Só o primeiro caso vira condição em cima de alguém, e o
 * que separa os dois é a palavra logo antes.
 */
const NEGA_CONDICAO =
  /\b(imune|imunes|imunidade|remove|removida?|remover|cura|curad[oa]|curar|encerra|termina|deixa de estar|nao (?:fica|esta|pode ficar)|resistencia a|contra a condicao|ignora)\b/

/** Prazos que o manual escreve por extenso, em rodadas. */
function leRodadas(plano: string): number | undefined {
  const rodadas = plano.match(/por\s+(\d+)\s+rodadas?/)
  if (rodadas) return Number(rodadas[1])
  const minutos = plano.match(/por\s+(\d+)\s+minutos?/)
  // Uma rodada do manual são 6 segundos: 1 minuto = 10 rodadas.
  if (minutos) return Number(minutos[1]) * 10
  if (/ate o (?:final|fim) do (?:seu )?proximo turno/.test(plano)) return 1
  if (/ate o (?:final|fim) do (?:seu )?turno/.test(plano)) return 1
  return undefined
}

/** Palavras com que o manual descreve a área de um jutsu. */
const MARCAS_DE_AREA: [RegExp, string][] = [
  [/raio de (\d+[,.]?\d*)\s*metros?/, 'raio de $1 m'],
  [/cone de (\d+[,.]?\d*)\s*metros?/, 'cone de $1 m'],
  [/esfera de (\d+[,.]?\d*)\s*metros?/, 'esfera de $1 m'],
  [/cubo de (\d+[,.]?\d*)\s*metros?/, 'cubo de $1 m'],
  [/linha de (\d+[,.]?\d*)\s*metros?/, 'linha de $1 m'],
  [/em um cone/, 'cone'],
  [/todas as criaturas/, 'todas as criaturas na área'],
  [/cada criatura/, 'cada criatura na área'],
  [/todos os alvos|todos os inimigos/, 'todos os alvos na área'],
]

/**
 * Lê da descrição a área atingida. Serve para a tela avisar que o jutsu não
 * é de alvo único — a geometria da mesa continua sendo do mestre, o app só
 * deixa marcar quem mais está dentro.
 */
export function readArea(description: string): string | undefined {
  const plano = semAcento(description)
  for (const [re, rotulo] of MARCAS_DE_AREA) {
    const m = plano.match(re)
    if (m) return rotulo.replace('$1', m[1] ?? '')
  }
  return undefined
}

/**
 * Lê da descrição as condições que o jutsu impõe.
 *
 * É leitura de texto livre, então erra nos dois sentidos: pode trazer uma
 * condição que o jutsu só cita de passagem, e pode não ver uma escrita de um
 * jeito que não está aqui. Por isso o resultado chega na tela como sugestão
 * marcável, nunca como efeito automático.
 */
export function readConditions(description: string): string[] {
  const plano = semAcento(description)
  const achadas: string[] = []
  for (const [nome, re] of MARCAS_DE_CONDICAO) {
    const m = plano.match(re)
    if (!m || m.index === undefined) continue
    // A janela antes da palavra diz se o jutsu impõe ou tira a condição.
    const antes = plano.slice(Math.max(0, m.index - 60), m.index)
    if (NEGA_CONDICAO.test(antes)) continue
    achadas.push(nome)
  }
  return achadas
}

/**
 * O dado de dano — e só ele.
 *
 * O texto do manual é cheio de NdM que não são dano: cura ("recupera 2d4
 * pontos de vida"), duração ("por 1d4 rodadas"), bônus de rolagem ("role 1d6
 * e some ao ataque"), dreno de chakra, PV de uma muralha invocada, PV/CA
 * temporários. Pegar o primeiro NdM da descrição, como era antes, enchia 51
 * jutsus de efeito com dano que eles não causam.
 *
 * Então o dado só conta como dano quando a palavra "dano" está colada nele, e
 * nenhum dos sinais de que ele é outra coisa aparece por perto.
 *
 * O que fica de fora de propósito: jutsu em que o dado é de outra coisa e só
 * uma PARTE dele vira dano ("reduz o chakra em 6d6 e causa metade disso como
 * dano"). Preencher 6d6 ali seria o dobro do certo — melhor deixar em branco
 * e o mestre escrever o que a mesa combinou.
 */
const NAO_E_DANO_ANTES = /\b(recupera|recuperar|recuperando|cura|curando|curar|regenera|regenerando|restaura)\b/
const NAO_E_DANO_PERTO = /\b(pontos? de vida|pv|ca) tempor/

export function readDamageDie(description: string): string | undefined {
  const plano = semAcento(description)
  for (const m of plano.matchAll(/(\d+d\d+)/g)) {
    const i = m.index ?? 0
    const fim = i + m[1].length
    const antes = plano.slice(Math.max(0, i - 30), i)
    const depois = plano.slice(fim, fim + 45)
    if (!/\bdanos?\b/.test(antes + ' ' + depois)) continue
    if (NAO_E_DANO_ANTES.test(antes)) continue
    if (NAO_E_DANO_PERTO.test(antes + ' ' + depois)) continue
    return description.slice(i, fim)
  }
  return undefined
}

/**
 * O dado de CURA, quando o texto fala em recuperar pontos de vida.
 *
 * O app não cura ninguém sozinho — quem mexe em PV de ficha alheia é o
 * mestre. Isto existe para a tela poder dizer "este jutsu cura 2d8" em vez de
 * ficar muda, agora que o dado de cura deixou de ser confundido com dano.
 */
export function readHealingDie(description: string): string | undefined {
  const plano = semAcento(description)
  for (const m of plano.matchAll(/(\d+d\d+)/g)) {
    const i = m.index ?? 0
    const antes = plano.slice(Math.max(0, i - 40), i)
    const depois = plano.slice(i + m[1].length, i + m[1].length + 40)
    if (NAO_E_DANO_ANTES.test(antes) || /\bcurando\b/.test(depois)) return description.slice(i, i + m[1].length)
  }
  return undefined
}

/** Lê da descrição o que der: ataque ou resistência, dado de dano e custo. */
export function readJutsu(entry: Pick<JutsuCatalogEntry, 'description' | 'cost' | 'classification'>): JutsuReading {
  const d = entry.description ?? ''
  const plano = semAcento(d)

  // Ataque: o CONJURADOR rola contra a CA ("faça um ataque de ninjutsu").
  const pedeAtaque = /(ataque|teste|jogada)\s+(de\s+)?(ninjutsu|taijutsu|bukijutsu|genjutsu)/.test(plano)

  // Resistência: quem rola é o ALVO. O manual escreve isso de duas formas —
  // "resistência de Constituição" e "o alvo deve ser bem-sucedido em um teste
  // de Destreza". Aceitar só a primeira deixava 134 jutsus de fora.
  const resist = d.match(
    /(?:resist[êe]ncia|teste|jogada)\s+de\s+(For[çc]a|Destreza|Constitui[çc][ãa]o|Intelig[êe]ncia|Sabedoria|Carisma)/i,
  )
  const dano = readDamageDie(d)
  // O tipo do dano vem logo depois de "dano", mas nem sempre: o texto do
  // manual escreve "3d6 de dano", "3d6 de dano cortante" e "3d6 de dano de
  // fogo". Pegar a primeira palavra depois de "dano" trazia preposição
  // ("de", "ao", "do") em quase metade do catálogo, então só valem os tipos
  // que o manual de fato usa.
  const tipo = d.match(new RegExp(`dano\\s+(?:de\\s+)?(${TIPOS_DE_DANO.join('|')})`, 'i'))

  return {
    // Quando a descrição traz os dois, o ataque é o que começa a ação — a
    // resistência costuma ser um efeito secundário ("no acerto, o alvo ainda
    // faz um teste de Constituição ou fica Sangrando").
    mode: pedeAtaque ? 'attack' : resist ? 'save' : 'none',
    saveAttribute: resist ? ATRIBUTO_POR_NOME[semAcento(resist[1])] : undefined,
    damage: dano,
    damageType: tipo?.[1]?.toLowerCase(),
    cost: Number((entry.cost ?? '').match(/\d+/)?.[0] ?? 0),
    healing: dano ? undefined : readHealingDie(d),
    conditions: readConditions(d),
    conditionRounds: leRodadas(plano),
    area: readArea(d),
  }
}

/** Acha no catálogo o jutsu que está na ficha, pelo nome. */
export function findCatalogEntry(name: string): JutsuCatalogEntry | undefined {
  const alvo = semAcento(name).trim()
  return allJutsus().find((j) => semAcento(j.name).trim() === alvo)
}

/**
 * PR efetivo de quem resiste: o do personagem mais os Pontos de Resistência
 * Temporários das condições em cima dele.
 *
 * Vale lembrar que, neste sistema, o número a bater é o PR do PRÓPRIO
 * resistente ("≥ PR do próprio personagem = sucesso", 09-outras-mecanicas.md)
 * — e ele CAI conforme o nível sobe, então resistir fica mais fácil com o
 * tempo. Condições somam +5 e empurram para o outro lado.
 */
export function effectiveResistance(base: number, conditions: string[] = []): number {
  const extra = conditions.reduce((soma, nome) => {
    const c = CONDITIONS.find((x) => x.name === nome)
    const n = Number(c?.resistancePointsModifier.match(/\d+/)?.[0] ?? 0)
    return soma + n
  }, 0)
  return base + extra
}

/**
 * Quem pode levar o golpe: ficha, NPC ou ficha temporária.
 *
 * As condições em cima do alvo não vêm daqui: chegam em `targetConditions`,
 * já reduzidas a nomes, porque quem monta a lista é quem sabe se a luta está
 * rolando.
 */
export type CastTarget = Character | NPC | Companion

/**
 * Quem conjura pode ser um personagem ou uma criatura. O que a conta precisa
 * é sempre o mesmo: modificadores, bônus de proficiência e chakra.
 */
export interface Caster {
  id: string
  name: string
  modifiers: Modifiers
  proficiencyBonus: number
  chakra: { current: number; max: number }
}

/**
 * Empresta a uma ficha temporária a forma da conta.
 *
 * A marionete é o caso especial: quem manobra é o ninja, então a rolagem
 * usa os modificadores e a proficiência do DONO. O clone e a invocação usam
 * os próprios.
 */
export function companionAsCaster(c: Companion, owner?: { modifiers: Modifiers; proficiencyBonus: number }): Caster {
  const doDono = c.kind === 'puppet' && owner
  return {
    id: c.id,
    name: c.name,
    modifiers: doDono ? owner.modifiers : c.modifiers,
    proficiencyBonus: doDono ? owner.proficiencyBonus : c.proficiencyBonus,
    chakra: c.chakra,
  }
}

/** Empresta a um NPC a forma que a conta de lançamento espera. */
export function npcAsCaster(npc: NPC): Caster {
  const zero: Modifiers = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 }
  return {
    id: npc.id,
    name: npc.name,
    modifiers: npc.modifiers ?? zero,
    proficiencyBonus: npc.proficiencyBonus ?? 3,
    chakra: npc.chakra ?? { current: 0, max: 0 },
  }
}

export interface CastInput {
  caster: Caster
  jutsuName: string
  classification: string
  mode: CastMode
  attackAttribute: AttributeKey
  proficient: boolean
  saveAttribute?: AttributeKey
  /** Atributo com que o ALVO resiste; o PR usado é o do próprio alvo. */
  damage?: string
  damageType?: string
  /** O que acontece quando o alvo resiste com sucesso. */
  onSaveSuccess?: 'none' | 'half'
  target?: CastTarget
  targetConditions?: string[]
  /**
   * Vantagem/desvantagem na jogada de ataque. Quem chama decide: a fonte mais
   * comum é a Vantagem Elemental (ciclo Fogo > Vento > Raio > Terra > Água),
   * mas o mestre pode ligar por qualquer outro motivo de mesa.
   */
  edge?: Edge
  /** Só para o registro: "Fogo supera Vento". */
  edgeReason?: string
  /**
   * Bônus plano somado à jogada de ataque, além do atributo e da
   * proficiência. É o bônus próprio do golpe da marionete, que se soma ao
   * ninja que a manobra.
   */
  extraBonus?: number
  /**
   * Dano pela metade. O manual manda isso para os jutsus lançados por clone
   * ("causam metade do dano"), e o corte vale depois do crítico.
   */
  damageHalved?: boolean
}

export interface CastOutcome {
  /** Frase pronta para o registro da mesa. */
  summary: string
  /** Dados que a animação mostra. */
  dice: number[]
  diceSides: number
  hit: boolean
  critical: boolean
  fumble: boolean
  damage: number
  /** PV do alvo depois do golpe, quando houve alvo e dano. */
  targetHp?: number
}

/**
 * Dano que pode ser dado fixo ou em dados.
 *
 * O ataque desarmado do manual é "1 + Modificador de Força" — um número, sem
 * dado nenhum. O resto do sistema usa NdM. Esta função aceita os dois para o
 * resto da conta não precisar saber a diferença.
 */
export function rollDamage(notation: string | undefined): { total: number; rolls: number[]; sides: number } {
  if (!notation) return { total: 0, rolls: [], sides: 20 }
  const fixo = notation.trim().match(/^(\d+)$/)
  if (fixo) return { total: Number(fixo[1]), rolls: [], sides: 20 }
  const r = rollDice(notation)
  return { total: r.total, rolls: r.rolls, sides: Number(notation.split('d')[1]?.match(/\d+/)?.[0] ?? 6) }
}

/** Rola, compara e calcula o dano — a conta inteira de uma vez. */
export function resolveCast(input: CastInput): CastOutcome {
  const { caster, target } = input
  const mod = caster.modifiers[input.attackAttribute]
  const prof = input.proficient ? caster.proficiencyBonus : 0
  const extra = input.extraBonus ?? 0
  /** Corte do dano pela metade (jutsu de clone), aplicado por último. */
  const metade = (n: number) => (input.damageHalved ? Math.floor(n / 2) : n)

  // ---- Jutsu sem ataque nem resistência: só acontece.
  if (input.mode === 'none') {
    const dano = input.damage ? rollDamage(input.damage) : null
    const total = metade(dano?.total ?? 0)
    return {
      summary: `${input.jutsuName}${target ? ` em ${target.name}` : ''}${dano ? `: ${total} de dano ${input.damageType ?? ''}`.trimEnd() : ' — efeito aplicado'}`,
      dice: dano?.rolls ?? [],
      diceSides: dano?.sides ?? 20,
      hit: true,
      critical: false,
      fumble: false,
      damage: total,
      targetHp: target && total ? Math.max(0, target.hp.current - total) : undefined,
    }
  }

  // ---- Resistência: quem rola é o ALVO, contra o PR dele mesmo.
  if (input.mode === 'save') {
    // NPC pode ou não ter modificadores; sem eles, resiste no d20 seco.
    const alvoMod = target?.modifiers && input.saveAttribute ? target.modifiers[input.saveAttribute] : 0
    const pr = effectiveResistance(target?.resistancePoints ?? 0, input.targetConditions)
    const rolagem = rollD20(alvoMod, false, 0)
    const resistiu = rolagem.total >= pr
    const dadoDano = input.damage ? rollDamage(input.damage) : null
    const cheio = metade(dadoDano?.total ?? 0)
    const dano = resistiu ? (input.onSaveSuccess === 'half' ? Math.floor(cheio / 2) : 0) : cheio
    return {
      summary:
        `${input.jutsuName} em ${target?.name ?? 'alvo'}: resistência d20(${rolagem.roll})${alvoMod ? ` + ${alvoMod}` : ''} = ${rolagem.total} contra PR ${pr} — ` +
        (resistiu ? `resistiu${dano ? `, ${dano} de dano (metade)` : ', sem dano'}` : `falhou, ${dano} de dano`),
      dice: [rolagem.roll],
      diceSides: 20,
      hit: !resistiu,
      critical: false,
      fumble: false,
      damage: dano,
      targetHp: target ? Math.max(0, target.hp.current - dano) : undefined,
    }
  }

  // ---- Ataque: quem rola é o conjurador, contra a CA do alvo.
  const rolagem = rollD20(mod + extra, input.proficient, caster.proficiencyBonus, input.edge ?? 'none')
  const ca = target?.armorClass ?? 0
  // 20 natural sempre acerta e 1 natural sempre erra, seja qual for a conta
  // (05-combate.md, "Acertos e falhas críticas").
  const acertou = rolagem.isCritical || (!rolagem.isFumble && (!target || rolagem.total >= ca))
  let dano = 0
  let dadosDano: number[] = []
  if (acertou && input.damage) {
    const fixo = input.damage.trim().match(/^(\d+)$/)
    if (fixo) {
      // Dano fixo (soco: 1 + Mod. Força). Não há dados para multiplicar no
      // crítico, então o número é o número.
      dano = metade(Number(fixo[1]))
    } else {
      let r = rollDice(input.damage)
      dadosDano = r.rolls
      if (rolagem.isCritical) {
        // Crítico do manual: dados de dano × Bônus de Proficiência. Só os
        // dados: o modificador plano do dano não entra na multiplicação.
        r = applyCriticalMultiplier(r, caster.proficiencyBonus)
      }
      dano = metade(r.total)
    }
  }
  const doisDados = rolagem.bothRolls
    ? ` [${rolagem.bothRolls.join(' e ')}, ${rolagem.edge === 'advantage' ? 'vantagem' : 'desvantagem'}${input.edgeReason ? `: ${input.edgeReason}` : ''}]`
    : ''
  const conta =
    `d20(${rolagem.roll})${doisDados}${mod ? ` + ${mod}` : ''}${extra ? ` + ${extra} (golpe)` : ''}` +
    `${prof ? ` + ${prof} (prof.)` : ''} = ${rolagem.total}`
  return {
    summary:
      `${input.jutsuName}${target ? ` em ${target.name}` : ''}: ${conta}` +
      (target ? ` contra CA ${ca}` : '') +
      (rolagem.isFumble
        ? ' — 1 natural, falha crítica'
        : acertou
          ? `${rolagem.isCritical ? ' — acerto crítico!' : ' — acertou'}${dano ? `, ${dano} de dano${input.damageType ? ` ${input.damageType}` : ''}${input.damageHalved ? ' (metade, clone)' : ''}` : ''}`
          : ' — errou'),
    dice: [rolagem.roll, ...dadosDano],
    diceSides: 20,
    hit: acertou,
    critical: rolagem.isCritical,
    fumble: rolagem.isFumble,
    damage: dano,
    targetHp: target && dano ? Math.max(0, target.hp.current - dano) : undefined,
  }
}
