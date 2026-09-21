import { CLASSES } from '../../data/classes'
import { JUTSU_CATALOG } from '../../data/jutsus'
import { canLearn, clanElements, effectiveElements, eligibleJutsus, jutsuElement, maxRankForLevel, normalizeRank } from '../jutsuAccess'
import { CLANS } from '../../data/clans'

const cla = (id: string) => CLANS.find((c) => c.id === id)

const ok = (cond: boolean, msg: string) => { if (!cond) throw new Error('FALHOU: ' + msg); }

// Normalização das duas grafias do manual
ok(normalizeRank('Rank-D') === 'D' && normalizeRank('Rank D') === 'D', 'grafias de rank')
ok(normalizeRank('Rank-S') === 'S' && normalizeRank(undefined) === 'D', 'rank ausente cai em D')

// Rank por nível, lendo a tabela da classe
const genjutsu = CLASSES.find((c) => c.progression?.length)!
console.log('classe de referência:', genjutsu.name)
for (const [nivel, esperado] of [[1,'D'],[4,'D'],[5,'C'],[8,'C'],[9,'B'],[13,'A'],[17,'S']] as const) {
  const r = maxRankForLevel(genjutsu, nivel)
  ok(r === esperado, `nível ${nivel} devia liberar ${esperado}, veio ${r}`)
}
console.log('rank por nível: 1->D, 5->C, 9->B, 13->A, 17->S  OK')

// Elemento detectado a partir da categoria
const fogo = JUTSU_CATALOG.find((j) => j.category === 'Ninjutsu - Estilo Fogo')!
ok(jutsuElement(fogo) === 'Fogo', 'estilo fogo')
const gen = JUTSU_CATALOG.find((j) => j.category === 'Genjutsu')!
ok(jutsuElement(gen) === null, 'genjutsu não exige elemento')

// Afinidade de clã vem de graça
ok(effectiveElements(cla('uchiha'), []).includes('Fogo'), 'Uchiha tem Fogo')
ok(effectiveElements(cla('hatake'), []).includes('Relâmpago'), 'Hatake tem Relâmpago')
ok(effectiveElements(cla('nara'), []).length === 0, 'Nara não tem afinidade passiva')
ok(clanElements(cla('uchiha')).includes('Fogo'), 'afinidade lida do texto do clã')
// Um clã inventado pelo mestre concede afinidade do mesmo jeito
ok(clanElements({ featuresText: 'Afinidade Passiva: Liberação de Água. Outro traço.' }).includes('Água'),
   'clã da casa concede afinidade pelo texto')
ok(effectiveElements(cla('nara'), ['Água']).includes('Água'), 'mestre concede afinidade')

// As três portas
const nara1 = { clanId: 'nara', elements: effectiveElements(cla('nara'), []), maxRank: maxRankForLevel(genjutsu, 1) }
ok(!canLearn(fogo, nara1).ok, 'Nara sem afinidade não aprende jutsu de Fogo')
const hijutsuUchiha = JUTSU_CATALOG.find((j) => j.clanId === 'uchiha')!
ok(!canLearn(hijutsuUchiha, nara1).ok, 'Nara não aprende Hijutsu Uchiha')
const rankS = JUTSU_CATALOG.find((j) => normalizeRank(j.rank) === 'S')!
ok(!canLearn(rankS, nara1).ok, 'nível 1 não aprende Rank-S')

const uchiha1 = { clanId: 'uchiha', elements: effectiveElements(cla('uchiha'), []), maxRank: maxRankForLevel(genjutsu, 1) }
const fogoD = JUTSU_CATALOG.find((j) => j.category === 'Ninjutsu - Estilo Fogo' && normalizeRank(j.rank) === 'D')!
ok(canLearn(fogoD, uchiha1).ok, 'Uchiha nível 1 aprende Fogo Rank-D')
ok(canLearn(JUTSU_CATALOG.find(j=>j.clanId==='uchiha' && normalizeRank(j.rank)==='D')!, uchiha1).ok, 'Uchiha aprende o próprio Hijutsu Rank-D')

// Quantos aparecem na prática
const listaNara1 = eligibleJutsus(nara1)
const listaUchiha1 = eligibleJutsus(uchiha1)
const listaUchiha17 = eligibleJutsus({ clanId: 'uchiha', elements: effectiveElements(cla('uchiha'), ['Água','Vento']), maxRank: maxRankForLevel(genjutsu, 17) })
console.log('elegíveis -> Nara nv1:', listaNara1.length, '| Uchiha nv1:', listaUchiha1.length, '| Uchiha nv17 com 3 elementos:', listaUchiha17.length, '| catálogo inteiro:', JUTSU_CATALOG.length)
ok(listaNara1.length < listaUchiha1.length, 'Uchiha devia ter mais opções que Nara no nível 1')
ok(listaUchiha17.length > listaUchiha1.length, 'nível 17 devia abrir mais que nível 1')
ok(listaUchiha17.length < JUTSU_CATALOG.length, 'nem no nível 17 tudo é elegível')
ok(listaNara1.every((j) => !j.clanId || j.clanId === 'nara'), 'nenhum Hijutsu de OUTRO clã passou para o Nara')
ok(listaNara1.some((j) => j.clanId === 'nara'), 'o Hijutsu do próprio clã devia aparecer')
ok(listaNara1.every((j) => jutsuElement(j) === null), 'nenhum jutsu elemental passou sem afinidade')

console.log('OK: todas as checagens de elegibilidade passaram')
