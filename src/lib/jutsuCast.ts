import { CONDITIONS } from '../data/conditions'
import { JUTSU_CATALOG } from '../data/jutsus'
import { applyCriticalMultiplier, rollD20, rollDice } from './dice'
import type { AttributeKey, Character, JutsuCatalogEntry, NPC } from '../types'

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
}

const ATRIBUTO_POR_NOME: Record<string, AttributeKey> = {
  forca: 'strength',
  destreza: 'dexterity',
  constituicao: 'constitution',
  inteligencia: 'intelligence',
  sabedoria: 'wisdom',
  carisma: 'charisma',
}

function semAcento(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
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
  const dano = d.match(/(\d+d\d+)\s*(?:de\s*)?dano\s*([A-Za-zÀ-ú]+)?/i) ?? d.match(/(\d+d\d+)/)

  return {
    // Quando a descrição traz os dois, o ataque é o que começa a ação — a
    // resistência costuma ser um efeito secundário ("no acerto, o alvo ainda
    // faz um teste de Constituição ou fica Sangrando").
    mode: pedeAtaque ? 'attack' : resist ? 'save' : 'none',
    saveAttribute: resist ? ATRIBUTO_POR_NOME[semAcento(resist[1])] : undefined,
    damage: dano?.[1],
    damageType: dano?.[2],
    cost: Number((entry.cost ?? '').match(/\d+/)?.[0] ?? 0),
  }
}

/** Acha no catálogo o jutsu que está na ficha, pelo nome. */
export function findCatalogEntry(name: string): JutsuCatalogEntry | undefined {
  const alvo = semAcento(name).trim()
  return JUTSU_CATALOG.find((j) => semAcento(j.name).trim() === alvo)
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

export type CastTarget = (Character | NPC) & { conditions?: string[] }

export interface CastInput {
  caster: Character
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

/** Rola, compara e calcula o dano — a conta inteira de uma vez. */
export function resolveCast(input: CastInput): CastOutcome {
  const { caster, target } = input
  const mod = caster.modifiers[input.attackAttribute]
  const prof = input.proficient ? caster.proficiencyBonus : 0

  // ---- Jutsu sem ataque nem resistência: só acontece.
  if (input.mode === 'none') {
    const dano = input.damage ? rollDice(input.damage) : null
    const total = dano?.total ?? 0
    return {
      summary: `${input.jutsuName}${target ? ` em ${target.name}` : ''}${dano ? `: ${total} de dano ${input.damageType ?? ''}`.trimEnd() : ' — efeito aplicado'}`,
      dice: dano?.rolls ?? [],
      diceSides: dano ? Number(input.damage!.split('d')[1]) : 20,
      hit: true,
      critical: false,
      fumble: false,
      damage: total,
      targetHp: target && total ? Math.max(0, target.hp.current - total) : undefined,
    }
  }

  // ---- Resistência: quem rola é o ALVO, contra o PR dele mesmo.
  if (input.mode === 'save') {
    const alvoMod = target && 'modifiers' in target && input.saveAttribute ? target.modifiers[input.saveAttribute] : 0
    const pr = effectiveResistance(target?.resistancePoints ?? 0, input.targetConditions)
    const rolagem = rollD20(alvoMod, false, 0)
    const resistiu = rolagem.total >= pr
    const dadoDano = input.damage ? rollDice(input.damage) : null
    const cheio = dadoDano?.total ?? 0
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
  const rolagem = rollD20(mod, input.proficient, caster.proficiencyBonus)
  const ca = target?.armorClass ?? 0
  // 20 natural sempre acerta e 1 natural sempre erra, seja qual for a conta
  // (05-combate.md, "Acertos e falhas críticas").
  const acertou = rolagem.isCritical || (!rolagem.isFumble && (!target || rolagem.total >= ca))
  let dano = 0
  let dadosDano: number[] = []
  if (acertou && input.damage) {
    let r = rollDice(input.damage)
    dadosDano = r.rolls
    if (rolagem.isCritical) {
      // Crítico do manual: dados de dano × Bônus de Proficiência.
      r = applyCriticalMultiplier(r, caster.proficiencyBonus)
    }
    dano = r.total
  }
  const conta = `d20(${rolagem.roll})${mod ? ` + ${mod}` : ''}${prof ? ` + ${prof} (prof.)` : ''} = ${rolagem.total}`
  return {
    summary:
      `${input.jutsuName}${target ? ` em ${target.name}` : ''}: ${conta}` +
      (target ? ` contra CA ${ca}` : '') +
      (rolagem.isFumble
        ? ' — 1 natural, falha crítica'
        : acertou
          ? `${rolagem.isCritical ? ' — acerto crítico!' : ' — acertou'}${dano ? `, ${dano} de dano${input.damageType ? ` ${input.damageType}` : ''}` : ''}`
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
