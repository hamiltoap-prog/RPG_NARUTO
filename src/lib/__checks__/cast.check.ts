import { JUTSU_CATALOG } from '../../data/jutsus'
import { attackAttribute, effectiveResistance, findCatalogEntry, readJutsu, resolveCast } from '../jutsuCast'
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
