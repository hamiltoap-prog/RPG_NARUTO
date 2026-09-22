import { rollD20, rollDice } from './dice'
import type { Edge } from './dice'
import { SUMMON_SIZES } from '../types'
import type { AttributeKey, Attributes, SummonSizeKey } from '../types'

/**
 * Kuchiyose: o subsistema próprio das invocações.
 *
 * A seção de Invocação do manual não usa as contas do resto do livro, e essa
 * diferença estava só documentada, nunca automatizada — o mestre fazia na
 * mão. São duas regras, e as duas são estranhas de propósito:
 *
 *  - **ataque**: 1d20 + Modificador de Ataque da criatura + Bônus de Ataque
 *    do tamanho, contra a CA do alvo;
 *  - **teste de atributo ou resistência**: **1d4 + o valor BRUTO do atributo**
 *    (a pontuação, "Força 15", e não o modificador), e o sucesso é igualar ou
 *    superar **o PR da própria criatura** — que vem do tamanho, não do nível.
 *
 * Como o PR sobe com o tamanho (10 no Minúsculo, 20 no Gigantesco), bicho
 * grande resiste pior a efeito e acerta melhor, que é o que a nota do manual
 * diz em palavras. E como o dado é um d4, a pontuação bruta é que carrega o
 * teste — trocar por modificador aqui mudaria o jogo inteiro.
 */

export function summonSize(key: SummonSizeKey | undefined) {
  return SUMMON_SIZES.find((s) => s.key === key) ?? SUMMON_SIZES.find((s) => s.key === 'M')!
}

export interface SummonTestResult {
  roll: number
  /** Os dois d4 quando houve vantagem natural; `roll` é o que valeu. */
  bothRolls?: [number, number]
  score: number
  total: number
  resistancePoints: number
  success: boolean
  summary: string
}

/**
 * Teste de atributo ou resistência da criatura invocada.
 *
 * `score` é a pontuação bruta (ex.: Força 15). `resistancePoints` é o PR da
 * própria criatura. Vantagem natural rola dois d4 e fica com o melhor, como
 * manda a nota "Testes de Atributo ou Resistência podem ser feitos com
 * Vantagem caso a criatura tenha alguma Vantagem Natural para aquele teste".
 */
export function resolveSummonTest(input: {
  creatureName: string
  attributeLabel: string
  score: number
  resistancePoints: number
  edge?: Edge
}): SummonTestResult {
  const d4 = () => rollDice('1d4').total
  const a = d4()
  const edge = input.edge ?? 'none'
  const b = edge === 'none' ? a : d4()
  const roll = edge === 'advantage' ? Math.max(a, b) : edge === 'disadvantage' ? Math.min(a, b) : a
  const total = roll + input.score
  const success = total >= input.resistancePoints
  const doisDados = edge === 'none' ? '' : ` [${a} e ${b}, ${edge === 'advantage' ? 'vantagem natural' : 'desvantagem'}]`
  return {
    roll,
    bothRolls: edge === 'none' ? undefined : [a, b],
    score: input.score,
    total,
    resistancePoints: input.resistancePoints,
    success,
    summary:
      `${input.creatureName} — teste de ${input.attributeLabel}: 1d4(${roll})${doisDados} + ${input.score} (valor bruto) = ${total} ` +
      `contra o próprio PR ${input.resistancePoints} — ${success ? 'passou' : 'falhou'}`,
  }
}

export interface SummonAttackResult {
  roll: number
  total: number
  hit: boolean
  critical: boolean
  fumble: boolean
  damage: number
  damageRolls: number[]
  summary: string
}

/**
 * Ataque de arma natural: 1d20 + Modificador de Ataque da criatura + Bônus de
 * Ataque do tamanho contra a CA do alvo. O dado de dano também vem do
 * tamanho, e o manual soma a ele o **valor bruto** do atributo da arma
 * ("Dano cortante = Dado de Dano + Atributo de Força"), na mesma lógica
 * crua do teste acima.
 */
export function resolveSummonAttack(input: {
  creatureName: string
  weaponName: string
  attackModifier: number
  size: SummonSizeKey | undefined
  targetName?: string
  targetArmorClass?: number
  /** Pontuação bruta somada ao dano, quando a arma natural pede. */
  damageScore?: number
  edge?: Edge
}): SummonAttackResult {
  const tamanho = summonSize(input.size)
  const bonus = input.attackModifier + tamanho.attackBonus
  const d20 = rollD20(bonus, false, 0, input.edge ?? 'none')
  const ca = input.targetArmorClass
  const hit = d20.isCritical || (!d20.isFumble && (ca === undefined || d20.total >= ca))
  const dano = hit ? rollDice(tamanho.damageDie) : null
  const damage = dano ? dano.total + (input.damageScore ?? 0) : 0
  const doisDados = d20.bothRolls ? ` [${d20.bothRolls.join(' e ')}, ${d20.edge === 'advantage' ? 'vantagem' : 'desvantagem'}]` : ''
  return {
    roll: d20.roll,
    total: d20.total,
    hit,
    critical: d20.isCritical,
    fumble: d20.isFumble,
    damage,
    damageRolls: dano?.rolls ?? [],
    summary:
      `${input.creatureName}: ${input.weaponName} — d20(${d20.roll})${doisDados} + ${input.attackModifier} + ${tamanho.attackBonus} (${tamanho.name}) = ${d20.total}` +
      (ca !== undefined ? ` contra CA ${ca}` : '') +
      (d20.isFumble
        ? ' — 1 natural, falha crítica'
        : hit
          ? `${d20.isCritical ? ' — 20 natural!' : ' — acertou'}, ${damage} de dano (${tamanho.damageDie}${input.damageScore ? ` + ${input.damageScore} bruto` : ''})`
          : ' — errou'),
  }
}

/** Atributos, com rótulo, para os seletores do teste da criatura. */
export function rawScore(attributes: Attributes | undefined, key: AttributeKey): number {
  return attributes?.[key] ?? 10
}
