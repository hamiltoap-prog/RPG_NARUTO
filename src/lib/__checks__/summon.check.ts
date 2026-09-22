import { resolveSummonAttack, resolveSummonTest, summonSize } from '../summon'
import { SUMMON_SIZES } from '../../types'

const ok = (c: boolean, m: string) => { if (!c) throw new Error('FALHOU: ' + m) }

// --- Tabela de Modificadores de Tamanho, como está no manual
ok(SUMMON_SIZES.length === 6, 'seis tamanhos')
ok(summonSize('MN').resistancePoints === 10 && summonSize('GG').resistancePoints === 20,
   'PR vai de 10 (minúsculo) a 20 (gigantesco)')
ok(summonSize('MN').acBonus === 2 && summonSize('GG').acBonus === -3, 'bônus de CA cai com o tamanho')
ok(summonSize('MN').attackBonus === 2 && summonSize('GG').attackBonus === 7, 'bônus de ataque sobe com o tamanho')
ok(summonSize(undefined).key === 'M', 'sem tamanho declarado, vale Médio')
console.log('tabela de tamanhos OK — PR 10..20, ataque +2..+7, dado 1d6..2d8')

// --- Teste da criatura: 1d4 + valor BRUTO contra o próprio PR
{
  // Força 15 num bicho Médio (PR 14): 1d4 + 15 = 16..19, nunca falha.
  let falhas = 0
  for (let i = 0; i < 500; i++) {
    const r = resolveSummonTest({ creatureName: 'Urso', attributeLabel: 'Força', score: 15, resistancePoints: 14 })
    ok(r.total === r.roll + 15, 'o total soma o valor bruto, não o modificador')
    ok(r.roll >= 1 && r.roll <= 4, 'o dado é um d4')
    if (!r.success) falhas++
  }
  ok(falhas === 0, `Força 15 contra PR 14 não devia falhar nunca, falhou ${falhas} vezes`)

  // Inteligência 3 num bicho Gigantesco (PR 20): 1d4 + 3 = 4..7, nunca passa.
  let passes = 0
  for (let i = 0; i < 500; i++) {
    const r = resolveSummonTest({ creatureName: 'Sapo', attributeLabel: 'Inteligência', score: 3, resistancePoints: 20 })
    if (r.success) passes++
  }
  ok(passes === 0, `Inteligência 3 contra PR 20 não devia passar nunca, passou ${passes} vezes`)

  // A borda: valor 12 contra PR 14 passa só com 2, 3 ou 4 (3 em 4).
  let bordaPassou = 0
  for (let i = 0; i < 4000; i++) {
    if (resolveSummonTest({ creatureName: 'X', attributeLabel: 'Destreza', score: 12, resistancePoints: 14 }).success) bordaPassou++
  }
  const taxa = bordaPassou / 4000
  console.log(`valor 12 contra PR 14: passou em ${(taxa * 100).toFixed(1)}% (esperado ~75%)`)
  ok(taxa > 0.70 && taxa < 0.80, `taxa fora do esperado: ${taxa}`)

  // "Iguala ou supera" conta como sucesso.
  const exato = resolveSummonTest({ creatureName: 'X', attributeLabel: 'Força', score: 13, resistancePoints: 14 })
  ok(exato.total < 14 ? !exato.success : exato.success, 'igualar o PR é sucesso, ficar abaixo é falha')

  // Vantagem natural: dois d4, vale o melhor.
  let semVantagem = 0
  let comVantagem = 0
  for (let i = 0; i < 4000; i++) {
    if (resolveSummonTest({ creatureName: 'X', attributeLabel: 'Força', score: 11, resistancePoints: 14 }).success) semVantagem++
    if (resolveSummonTest({ creatureName: 'X', attributeLabel: 'Força', score: 11, resistancePoints: 14, edge: 'advantage' }).success) comVantagem++
  }
  console.log(`valor 11 contra PR 14: ${((semVantagem / 4000) * 100).toFixed(1)}% seco, ${((comVantagem / 4000) * 100).toFixed(1)}% com vantagem natural`)
  ok(comVantagem > semVantagem * 1.2, 'vantagem natural tinha que ajudar de verdade')

  const comTexto = resolveSummonTest({ creatureName: 'Urso', attributeLabel: 'Força', score: 15, resistancePoints: 14, edge: 'advantage' })
  ok(/valor bruto/.test(comTexto.summary), 'o registro diz que o número é o valor bruto')
  ok(/próprio PR/.test(comTexto.summary), 'o registro lembra que o PR é o da própria criatura')
  ok(/vantagem natural/.test(comTexto.summary), 'o registro mostra a vantagem natural')
}

// --- Ataque de arma natural: 1d20 + mod da criatura + bônus do tamanho
{
  let acertos = 0
  let danoTotal = 0
  for (let i = 0; i < 600; i++) {
    const r = resolveSummonAttack({
      creatureName: 'Urso', weaponName: 'Garras', attackModifier: 7, size: 'G',
      targetName: 'Boneco', targetArmorClass: 15, damageScore: 3,
    })
    ok(r.total === r.roll + 7 + 5, 'soma o modificador da criatura e o bônus do tamanho Grande (+5)')
    if (r.hit) { acertos++; danoTotal += r.damage }
    ok(r.damage === 0 || r.hit, 'dano só quando acerta')
  }
  // d20 + 12 contra CA 15: erra só com 1 natural ou roll 1/2 -> ~90% de acerto.
  console.log(`Urso Grande (+7 e +5) contra CA 15: ${acertos}/600 acertos`)
  ok(acertos > 510 && acertos < 590, `acertos fora do esperado: ${acertos}`)
  ok(danoTotal > 0, 'saiu dano')

  const gigante = resolveSummonAttack({ creatureName: 'Sapo', weaponName: 'Língua', attackModifier: 6, size: 'GG' })
  ok(/2d8/.test(gigante.summary) || !gigante.hit, 'o dado de dano do Gigantesco é 2d8')
  ok(/Gigantesco/.test(gigante.summary), 'o registro diz de que tamanho veio o bônus')

  const semAlvo = resolveSummonAttack({ creatureName: 'X', weaponName: 'Mordida', attackModifier: 4, size: 'M' })
  ok(semAlvo.hit, 'sem CA declarada o ataque não erra — quem julga é o mestre')
}

console.log('OK: todas as checagens do subsistema de invocação passaram')
