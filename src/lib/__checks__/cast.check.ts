import { JUTSU_CATALOG } from '../../data/jutsus'
import { attackAttribute, effectiveResistance, findCatalogEntry, readJutsu, resolveCast } from '../jutsuCast'
import { beatsElement, elementAdvantage } from '../jutsuAccess'
import type { Character, NPC } from '../../types'

const ok = (c: boolean, m: string) => { if (!c) throw new Error('FALHOU: ' + m) }

// --- Atributo de ataque pela classificação (05-combate.md)
ok(attackAttribute('Ninjutsu') === 'intelligence', 'Ninjutsu usa Inteligência')
ok(attackAttribute('Genjutsu') === 'wisdom', 'Genjutsu usa Sabedoria')
ok(attackAttribute('Taijutsu') === 'dexterity', 'Taijutsu usa Destreza')
ok(attackAttribute('Hijutsu, Bukijutsu') === 'dexterity', 'Bukijutsu usa Destreza')
console.log('atributo por classificação OK')

// --- Leitura da descrição
const comAtaque = JUTSU_CATALOG.find((j) => /ataque de ninjutsu/i.test(j.description) && /\d+d\d+/.test(j.description))!
const r1 = readJutsu(comAtaque)
ok(r1.mode === 'attack', `devia ler ataque em ${comAtaque.name}`)
ok(Boolean(r1.damage), 'devia achar o dado de dano')
console.log('leitura de ataque:', comAtaque.name, '->', r1.mode, r1.damage, '| custo', r1.cost)

const comResist = JUTSU_CATALOG.find((j) => /resistência de Constituição/i.test(j.description))!
const r2 = readJutsu(comResist)
ok(r2.mode === 'save' || r2.mode === 'attack', 'devia ler algo')
if (r2.mode === 'save') ok(r2.saveAttribute === 'constitution', 'resistência de Constituição')
console.log('leitura de resistência:', comResist.name, '->', r2.mode, r2.saveAttribute ?? '')

ok(findCatalogEntry(comAtaque.name.toLowerCase())?.name === comAtaque.name, 'acha o jutsu pelo nome sem caixa')

// --- PR com condições (+5 por condição relevante)
ok(effectiveResistance(14, []) === 14, 'PR sem condição')
ok(effectiveResistance(14, ['Envenenado']) === 19, 'Envenenado soma +5 ao PR')
console.log('PR 14 com Envenenado ->', effectiveResistance(14, ['Envenenado']))

// --- Resolução
const caster = {
  name: 'Sakura', proficiencyBonus: 3, resistancePoints: 14, armorClass: 13,
  modifiers: { strength: 2, dexterity: 3, constitution: 1, intelligence: 4, wisdom: 0, charisma: -1 },
  hp: { current: 10, max: 10 },
} as unknown as Character
const alvo = { name: 'Zabuza', armorClass: 10, resistancePoints: 14, hp: { current: 30, max: 30 } } as unknown as NPC

let acertos = 0, criticos = 0, danoTotal = 0
for (let i = 0; i < 400; i++) {
  const o = resolveCast({
    caster, jutsuName: 'Teste', classification: 'Ninjutsu', mode: 'attack',
    attackAttribute: 'intelligence', proficient: true, damage: '2d6', target: alvo,
  })
  if (o.hit) { acertos++; danoTotal += o.damage }
  if (o.critical) criticos++
  ok(o.damage === 0 || o.hit, 'dano só sai quando acerta')
  if (o.hit && o.targetHp !== undefined) ok(o.targetHp === Math.max(0, 30 - o.damage), 'PV do alvo bate com o dano')
}
// d20 + 4 + 3 = 7..27 contra CA 10: erra só com 1 natural ou total < 10 (roll 1 ou 2)
console.log(`ataque vs CA 10 (mod+7): ${acertos}/400 acertos (~90% esperado), ${criticos} críticos (~5%)`)
ok(acertos > 330 && acertos < 395, `acertos fora do esperado: ${acertos}`)
ok(criticos > 5 && criticos < 45, `críticos fora do esperado: ${criticos}`)
ok(danoTotal > 0, 'saiu dano')

// Alvo com CA altíssima: só o 20 natural acerta
let so20 = 0
for (let i = 0; i < 300; i++) {
  const o = resolveCast({
    caster, jutsuName: 'T', classification: 'Ninjutsu', mode: 'attack',
    attackAttribute: 'intelligence', proficient: true, damage: '1d4',
    target: { ...alvo, armorClass: 99 } as unknown as NPC,
  })
  if (o.hit) { so20++; ok(o.critical, 'contra CA 99 só o 20 natural acerta') }
}
console.log(`contra CA 99: ${so20}/300 acertos, todos por 20 natural (~5%)`)

// Resistência: alvo com PR baixíssimo sempre resiste; com PR altíssimo nunca
const sempreResiste = resolveCast({
  caster, jutsuName: 'T', classification: 'Ninjutsu', mode: 'save', attackAttribute: 'intelligence',
  proficient: false, saveAttribute: 'constitution', damage: '2d6',
  target: { ...alvo, resistancePoints: 1 } as unknown as NPC,
})
ok(sempreResiste.damage === 0, 'resistiu com PR 1 -> sem dano')
const nuncaResiste = resolveCast({
  caster, jutsuName: 'T', classification: 'Ninjutsu', mode: 'save', attackAttribute: 'intelligence',
  proficient: false, saveAttribute: 'constitution', damage: '2d6',
  target: { ...alvo, resistancePoints: 99 } as unknown as NPC,
})
ok(nuncaResiste.damage > 0, 'falhou com PR 99 -> tomou dano')
// "Metade" com 4d6 (4 a 24): quem resiste toma de 2 a 12, nunca zero e nunca
// o dano cheio.
for (let i = 0; i < 200; i++) {
  const meio = resolveCast({
    caster, jutsuName: 'T', classification: 'Ninjutsu', mode: 'save', attackAttribute: 'intelligence',
    proficient: false, saveAttribute: 'constitution', damage: '4d6', onSaveSuccess: 'half',
    target: { ...alvo, resistancePoints: 1 } as unknown as NPC,
  })
  ok(meio.damage >= 2 && meio.damage <= 12, `metade de 4d6 fora de 2..12: ${meio.damage}`)
}
console.log('resistência: PR 1 resiste sem dano, PR 99 falha e toma, "metade" divide certo')

console.log('OK: todas as checagens de lançamento de jutsu passaram')

// --- Cobertura da leitura sobre o catálogo inteiro
{
  let ataque = 0, resistencia = 0, semRolagem = 0, comDano = 0
  for (const j of JUTSU_CATALOG) {
    const r = readJutsu(j)
    if (r.mode === 'attack') ataque++
    else if (r.mode === 'save') resistencia++
    else semRolagem++
    if (r.damage) comDano++
  }
  const t = JUTSU_CATALOG.length
  console.log(`cobertura da leitura: ${ataque} ataque, ${resistencia} resistência, ${semRolagem} sem rolagem; ${comDano} com dano (de ${t})`)
  ok(ataque + resistencia > t * 0.55, 'devia ler a mecânica de mais da metade do catálogo')
  ok(comDano > t * 0.5, 'devia achar dano em mais da metade')
}

// --- Vantagem Elemental (ciclo Fogo > Vento > Raio > Terra > Água > Fogo)
ok(beatsElement('Fogo', 'Vento'), 'Fogo vence Vento')
ok(beatsElement('Vento', 'Relâmpago'), 'Vento vence Raio')
ok(beatsElement('Relâmpago', 'Terra'), 'Raio vence Terra')
ok(beatsElement('Terra', 'Água'), 'Terra vence Água')
ok(beatsElement('Água', 'Fogo'), 'Água fecha o ciclo vencendo Fogo')
ok(!beatsElement('Vento', 'Fogo'), 'o ciclo não vale ao contrário')
ok(!beatsElement('Fogo', 'Terra'), 'cada elemento vence só o seguinte, não o de dois à frente')
ok(!beatsElement('Fogo', 'Fogo'), 'elemento não vence a si mesmo')
ok(!beatsElement(null, 'Fogo') && !beatsElement('Fogo', null), 'sem elemento, sem vantagem')

ok(elementAdvantage('Fogo', ['Vento']) === 'Vento', 'aponta qual afinidade do alvo foi superada')
ok(elementAdvantage('Fogo', ['Raio']) === null, 'Fogo não supera Raio')
ok(elementAdvantage('Vento', ['Raio']) === 'Relâmpago', '"Raio" na ficha é o mesmo que Relâmpago')
ok(elementAdvantage('Terra', ['fogo', 'água']) === 'Água', 'acha a afinidade superada mesmo em caixa baixa')
ok(elementAdvantage('Fogo', undefined) === null, 'alvo sem afinidade declarada não dá vantagem')

// Com vantagem, a mesma conta devia acertar mais vezes.
function mede(edge: 'none' | 'advantage') {
  let n = 0
  for (let i = 0; i < 2000; i++) {
    const o = resolveCast({
      caster, jutsuName: 'T', classification: 'Ninjutsu', mode: 'attack',
      attackAttribute: 'intelligence', proficient: false, damage: '1d4',
      target: { ...alvo, armorClass: 20 } as unknown as NPC, edge,
    })
    if (o.hit) n++
  }
  return n
}
const semVantagem = mede('none')
const comVantagem = mede('advantage')
console.log(`contra CA 20 (mod +4): ${semVantagem}/2000 sem vantagem, ${comVantagem}/2000 com vantagem`)
ok(comVantagem > semVantagem * 1.2, 'a vantagem precisa acertar bem mais que a rolagem seca')

const comEdge = resolveCast({
  caster, jutsuName: 'Bola de Fogo', classification: 'Ninjutsu', mode: 'attack',
  attackAttribute: 'intelligence', proficient: true, damage: '2d6',
  target: alvo, edge: 'advantage', edgeReason: 'Fogo supera Vento',
})
ok(comEdge.summary.includes('Fogo supera Vento'), 'o registro explica de onde veio a vantagem')
ok(/\[\d+ e \d+, vantagem/.test(comEdge.summary), 'o registro mostra os dois d20')

console.log('OK: checagens de vantagem elemental passaram')

// --- Tipo de dano: só tipos de verdade, nunca preposição
{
  const conectores = ['de', 'do', 'da', 'ao', 'aos', 'e', 'em', 'por', 'que', 'se', 'ou', 'como', 'adicional', 'normal', 'inicial']
  let comTipo = 0
  for (const j of JUTSU_CATALOG) {
    const t = readJutsu(j).damageType
    if (!t) continue
    comTipo++
    ok(!conectores.includes(t), `"${t}" não é tipo de dano (em ${j.name})`)
  }
  console.log(`tipo de dano lido em ${comTipo} jutsus, nenhum conector`)
  ok(comTipo > 200, 'devia reconhecer o tipo em boa parte do catálogo')
  ok(readJutsu({ description: 'causa 2d10 de dano de fogo', cost: '4', classification: 'Ninjutsu' }).damageType === 'fogo',
     '"dano de fogo" lê fogo, não a preposição')
  ok(readJutsu({ description: 'causa 3d6 de dano cortante', cost: '4', classification: 'Bukijutsu' }).damageType === 'cortante',
     '"dano cortante" lê cortante')
  ok(readJutsu({ description: 'causa 3d6 de dano', cost: '4', classification: 'Ninjutsu' }).damageType === undefined,
     'sem tipo escrito, não inventa um')
}

// --- Bônus de golpe (marionete) e dano pela metade (clone)
{
  const alvoFraco = { ...alvo, armorClass: 1 } as unknown as NPC
  // Sem atributo nem proficiência, o bônus do golpe é tudo o que soma.
  const semNada = { ...caster, proficiencyBonus: 0, modifiers: { ...caster.modifiers, strength: 0 } } as unknown as Character
  let comBonus = 0
  for (let i = 0; i < 400; i++) {
    const o = resolveCast({
      caster: semNada, jutsuName: 'Ferrão', classification: 'Bukijutsu', mode: 'attack',
      attackAttribute: 'strength', proficient: false, damage: '1d8',
      target: { ...alvo, armorClass: 14 } as unknown as NPC, extraBonus: 7,
    })
    if (o.hit) comBonus++
  }
  let semBonus = 0
  for (let i = 0; i < 400; i++) {
    const o = resolveCast({
      caster: semNada, jutsuName: 'Ferrão', classification: 'Bukijutsu', mode: 'attack',
      attackAttribute: 'strength', proficient: false, damage: '1d8',
      target: { ...alvo, armorClass: 14 } as unknown as NPC,
    })
    if (o.hit) semBonus++
  }
  console.log(`golpe +7 contra CA 14: ${comBonus}/400 acertos, contra ${semBonus}/400 sem o bônus`)
  ok(comBonus > semBonus + 80, 'o bônus do golpe tinha que ajudar de verdade')
  const comTexto = resolveCast({
    caster: semNada, jutsuName: 'Ferrão', classification: 'Bukijutsu', mode: 'attack',
    attackAttribute: 'strength', proficient: false, damage: '1d8', target: alvoFraco, extraBonus: 7,
  })
  ok(/\+ 7 \(golpe\)/.test(comTexto.summary), 'o registro mostra o bônus do golpe separado')

  // Dano pela metade: mesma rolagem, metade do resultado.
  let cheio = 0
  let meio = 0
  for (let i = 0; i < 600; i++) {
    cheio += resolveCast({
      caster, jutsuName: 'J', classification: 'Ninjutsu', mode: 'attack',
      attackAttribute: 'intelligence', proficient: false, damage: '4d6', target: alvoFraco,
    }).damage
    meio += resolveCast({
      caster, jutsuName: 'J', classification: 'Ninjutsu', mode: 'attack',
      attackAttribute: 'intelligence', proficient: false, damage: '4d6', target: alvoFraco, damageHalved: true,
    }).damage
  }
  const razao = meio / cheio
  console.log(`dano do clone: ${meio} contra ${cheio} do original (razão ${razao.toFixed(2)}, esperado ~0,5)`)
  ok(razao > 0.42 && razao < 0.55, `a metade não bateu: ${razao}`)

  const semAlvo = resolveCast({
    caster, jutsuName: 'J', classification: 'Ninjutsu', mode: 'none', damage: '4d6',
    attackAttribute: 'intelligence', proficient: false, damageHalved: true,
  })
  ok(semAlvo.damage <= 24 / 2 + 1, 'jutsu sem rolagem também sai pela metade')

  // Resistência com metade: o corte do clone vem antes da metade do sucesso.
  const resistindo = resolveCast({
    caster, jutsuName: 'J', classification: 'Ninjutsu', mode: 'save', saveAttribute: 'dexterity',
    attackAttribute: 'intelligence', proficient: false, damage: '10d6', onSaveSuccess: 'half',
    target: { ...alvo, resistancePoints: 1 } as unknown as NPC, damageHalved: true,
  })
  ok(resistindo.damage <= 60 / 4 + 1, 'clone + resistiu com metade = um quarto do dano cheio')
}

console.log('OK: checagens de bônus de golpe e dano de clone passaram')
