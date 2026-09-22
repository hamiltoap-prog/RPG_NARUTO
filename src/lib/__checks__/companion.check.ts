import { CLASSES } from '../../data/classes'
import { JUTSU_CATALOG } from '../../data/jutsus'
import { SUMMON_BESTIARY } from '../../data/summons'
import {
  biggestChakraDie,
  buildClones,
  buildSummon,
  cloneArmorClass,
  cloneJutsus,
  isCloneJutsu,
  isSummonJutsu,
  readClone,
  summonCost,
} from '../companions'
import type { Character } from '../../types'

const ok = (c: boolean, m: string) => { if (!c) throw new Error('FALHOU: ' + m) }
const acha = (n: string) => JUTSU_CATALOG.find((j) => j.name === n)!

// --- Quais jutsus são de clone
{
  const lista = cloneJutsus()
  console.log(`jutsus de clone no catálogo: ${lista.length}`)
  ok(lista.length === 12, `esperava 12 jutsus de clone, achei ${lista.length}`)
  ok(isCloneJutsu('TÉCNICA DE CLONES DAS SOMBRAS'), 'reconhece clone pelo nome')
  ok(!isCloneJutsu('RASENGAN'), 'não confunde outro jutsu com clone')
  ok(isSummonJutsu('TÉCNICA DE INVOCAÇÃO'), 'reconhece a técnica de invocação')
}

// --- Leitura dos clones que o manual descreve com ficha
{
  const sombras = readClone(acha('TÉCNICA DE CLONES DAS SOMBRAS'))
  ok(sombras.maxClones === 4, `Clones das Sombras: 4 clones, leu ${sombras.maxClones}`)
  ok(sombras.hp === 1, `1 PV, leu ${sombras.hp}`)
  ok(sombras.armor.from === 'attribute' && sombras.armor.attribute === 'intelligence', 'CA vem do atributo de Inteligência')
  ok(sombras.chakra === 'chakraDie', 'chakra temporário igual ao maior dado de chakra')
  ok(sombras.costPerClone === 6, `6 de chakra cada, leu ${sombras.costPerClone}`)
  ok(sombras.halfDamage, 'jutsus do clone causam metade do dano')
  ok(sombras.sheetWorthy, 'tem ficha própria')
  console.log(`Clones das Sombras: ${sombras.maxClones} clones, ${sombras.hp} PV, CA do atributo de Inteligência, ${sombras.costPerClone} chakra cada, dano pela metade`)

  const multi = readClone(acha('TÉCNICA DE MULTICLONES DAS SOMBRAS'))
  ok(multi.maxClones === 10, `Multiclones: 10 clones, leu ${multi.maxClones}`)
  ok(multi.hp === 1 && multi.costPerClone === 8, 'Multiclones: 1 PV e 8 de chakra por clone')

  const agua = readClone(acha('ESTILO ÁGUA: CLONE DE ÁGUA'))
  ok(agua.maxClones === 2, `Clone de Água: 2 clones, leu ${agua.maxClones}`)
  ok(agua.hp === 5, `5 PV, leu ${agua.hp}`)
  ok(agua.chakra === 'none', 'Clone de Água não tem chakra')
  ok(agua.costPerClone === 8, `8 chakra cada, leu ${agua.costPerClone}`)

  const terra = readClone(acha('ESTILO TERRA: CLONE DE TERRA'))
  ok(terra.maxClones === 1, `Clone de Terra: 1 clone, leu ${terra.maxClones}`)
  ok(terra.hp === 15, `15 PV, leu ${terra.hp}`)
  ok(terra.chakra === 'none', 'Clone de Terra não tem chakra')

  const inseto = readClone(acha('CLONE DE INSETO'))
  ok(inseto.maxClones === 1 && inseto.hp === 5, 'Clone de Inseto: 1 clone de 5 PV')
  ok(inseto.armor.from === 'owner', '"CA igual à sua" usa a CA do dono')

  const explosivo = readClone(acha('ESTILO FOGO: CLONE EXPLOSIVO'))
  ok(explosivo.hp === 1, `Clone Explosivo: 1 PV, leu ${explosivo.hp}`)
  ok(explosivo.armor.from === 'fixed' && explosivo.armor.value === 10, `"Possui 10 de CA" é CA fixa 10, leu ${JSON.stringify(explosivo.armor)}`)

  const basico = readClone(acha('CLONE'))
  ok(basico.maxClones === 2, `Clone básico: 2 duplicatas, leu ${basico.maxClones}`)

  const relampago = readClone(acha('ESTILO RELÂMPAGO: CLONE RELÂMPAGO'))
  ok(relampago.maxClones === 2 && relampago.hp === 1, 'Clone Relâmpago: 2 clones de 1 PV')

  // Os que NÃO descrevem um corpo com ficha ficam marcados como tal.
  const nevoa = readClone(acha('CLONE DE NÉVOA'))
  ok(!nevoa.sheetWorthy, 'Clone de Névoa faz duplicatas estáticas, não ficha')
  const mental = readClone(acha('CLONE MENTAL'))
  ok(!mental.sheetWorthy, 'Clone Mental não é um corpo com PV')

  const comFicha = cloneJutsus().filter((j) => readClone(j).sheetWorthy)
  console.log(`clones com ficha própria: ${comFicha.length} de 12 —`, comFicha.map((j) => j.name.replace(/^(T[ÉE]CNICA DE |ESTILO \w+: )/, '')).join(', '))
  ok(comFicha.length === 7, `esperava 7 clones com ficha, achei ${comFicha.length}`)
}

// --- CA do clone contra a ficha do dono
{
  const dono = { armorClass: 17, attributes: { strength: 10, dexterity: 14, constitution: 12, intelligence: 16, wisdom: 11, charisma: 8 } }
  ok(cloneArmorClass({ from: 'attribute', attribute: 'intelligence' }, dono) === 16,
     'CA do clone é a PONTUAÇÃO de Inteligência (16), não o modificador (+3)')
  ok(cloneArmorClass({ from: 'owner' }, dono) === 17, '"CA igual à sua" copia a CA do dono')
  ok(cloneArmorClass({ from: 'fixed', value: 10 }, dono) === 10, 'CA fixa é fixa')
  ok(biggestChakraDie('d8') === 8 && biggestChakraDie(undefined) === 6, 'maior dado de chakra')
}

// --- Fichas montadas
{
  const naruto = {
    id: 'c1', tableId: 't1', name: 'Naruto', armorClass: 15, resistancePoints: 14,
    attributes: { strength: 12, dexterity: 14, constitution: 16, intelligence: 13, wisdom: 10, charisma: 15 },
    modifiers: { strength: 1, dexterity: 2, constitution: 3, intelligence: 1, wisdom: 0, charisma: 2 },
    proficiencyBonus: 3, imageUrl: 'http://x/y.png',
    jutsus: [
      { id: 'j1', name: 'RASENGAN', details: '' },
      { id: 'j2', name: 'TÉCNICA DE MULTICLONES DAS SOMBRAS', details: '' },
    ],
  } as unknown as Character

  const leitura = readClone(acha('TÉCNICA DE MULTICLONES DAS SOMBRAS'))
  const clones = buildClones({ owner: naruto, ownerUid: 'uid-naruto', jutsuName: 'TÉCNICA DE MULTICLONES DAS SOMBRAS', reading: leitura, count: 3, chakraDie: 'd8' })
  ok(clones.length === 3, '3 clones pedidos, 3 fichas')
  ok(clones.every((c) => c.hp.max === 1), 'cada clone com 1 PV')
  ok(clones.every((c) => c.armorClass === 13), `CA 13 (pontuação de Inteligência), deu ${clones[0].armorClass}`)
  ok(clones.every((c) => c.chakra.max === 8), 'chakra igual ao maior dado de chakra (d8)')
  ok(clones.every((c) => c.resistancePoints === 14), 'o clone resiste com o PR do original')
  ok(clones.every((c) => c.halfDamage), 'o dano do clone sai pela metade')
  ok(clones.every((c) => c.ownerUid === 'uid-naruto' && c.ownerCharacterId === 'c1'), 'a ficha sabe de quem é')
  ok(clones.every((c) => (c.jutsus ?? []).some((j) => j.name === 'RASENGAN')), 'o clone leva os jutsus do dono')
  ok(clones.every((c) => !(c.jutsus ?? []).some((j) => /clone/i.test(j.name))), 'o clone NÃO pode criar outros clones')
  ok(new Set(clones.map((c) => c.id)).size === 3, 'ids diferentes')
  ok(clones.map((c) => c.name).join('|') === 'Clone de Naruto 1|Clone de Naruto 2|Clone de Naruto 3', 'nomes numerados')
  console.log(`3 clones de Naruto: ${clones[0].hp.max} PV, CA ${clones[0].armorClass}, ${clones[0].chakra.max} chakra, PR ${clones[0].resistancePoints}, ${(clones[0].jutsus ?? []).length} jutsu(s) sem clone`)

  // Invocação feita pelo jogador
  const urso = SUMMON_BESTIARY.find((c) => c.id === 'urso')!
  const invocado = buildSummon({ owner: naruto, ownerUid: 'uid-naruto', tribeId: 'urso', rankIndex: 1, size: 'G' })!
  ok(invocado !== null, 'a invocação foi montada')
  ok(invocado.kind === 'summon' && invocado.ownerUid === 'uid-naruto', 'é invocação e tem dono')
  ok(invocado.armorClass === 9, `Grande: CA 10 − 1 = 9, deu ${invocado.armorClass}`)
  ok(invocado.resistancePoints === 16, `Grande: PR 16, deu ${invocado.resistancePoints}`)
  ok((invocado.attacks ?? []).every((a) => a.damage === '1d12'), 'Grande: dado de dano 1d12')
  const modUrso = Number(urso.attackModifier.replace(/[^\d-]/g, ''))
  ok((invocado.attacks ?? []).every((a) => a.bonus === modUrso + 5), `bônus soma o da tribo (${modUrso}) com o do tamanho (+5)`)
  ok((invocado.attacks ?? []).length >= 2, 'as armas naturais do Urso viraram golpes prontos')
  ok(invocado.hp.max > 0 && invocado.chakra.max > 0, 'PV e chakra pela média dos dados do rank')
  ok(summonCost(1) === 10, `Rank C custa 10 de chakra, deu ${summonCost(1)}`)
  console.log(`Urso Rank C Grande: CA ${invocado.armorClass}, PR ${invocado.resistancePoints}, PV ${invocado.hp.max}, golpes ${(invocado.attacks ?? []).map((a) => `${a.name} +${a.bonus} ${a.damage}`).join(' / ')}`)

  ok(buildSummon({ owner: naruto, ownerUid: 'u', tribeId: 'nao-existe', rankIndex: 0, size: 'M' }) === null,
     'tribo inexistente não monta ficha')
}

// --- Custo de chakra: o painel precisa cobrar por clone
{
  const sombras = readClone(acha('TÉCNICA DE CLONES DAS SOMBRAS'))
  ok((sombras.costPerClone ?? 0) * 4 === 24, '4 clones das sombras custam 24 de chakra')
  const classe = CLASSES.find((c) => /Ninjutsu/.test(c.name))!
  ok(biggestChakraDie(classe.chakraDie) > 0, 'a classe tem dado de chakra legível')
}

console.log('OK: todas as checagens de clones e invocações passaram')
