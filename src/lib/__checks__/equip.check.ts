import { CLASSES } from '../../data/classes'
import { ARMORS, GEAR, WEAPONS } from '../../data/equipment'
import {
  applyStartingPicks,
  armorClassFor,
  armorFromCatalog,
  bundleSize,
  categoryOptions,
  dexCapFromText,
  isThrowable,
  parseRyoCost,
  readStartingEquipment,
  spendGear,
  spendWeapon,
  stackArmor,
  stackGear,
  stackWeapon,
  unitName,
  weaponFromCatalog,
} from '../equipment'
import type { Armor, InventoryItem, Modifiers, Weapon } from '../../types'

const ok = (c: boolean, m: string) => { if (!c) throw new Error('FALHOU: ' + m) }

// --- Custo, maço e nome
ok(parseRyoCost('1.500 Ryo') === 1500, 'preço com ponto de milhar')
ok(parseRyoCost('5 ryo') === 5, 'preço simples')
ok(bundleSize('Shuriken (5)') === 5, 'maço de 5')
ok(bundleSize('Kunai') === 1, 'item sem maço vale 1')
ok(unitName('Shuriken (5)') === 'Shuriken', 'nome sem o maço')
console.log('preço, maço e nome OK')

// --- Arma que acaba ao ser usada
ok(isThrowable('Leve, Acuidade, Arremesso (30/60)'), 'kunai arremessada é consumível')
ok(isThrowable('Arremesso (30/120), Multiataque'), 'shuriken é consumível')
ok(!isThrowable('Alcance (30/60), Leve, Arremesso, Retorno'), 'chakram volta, não consome')
ok(!isThrowable('Duas Mãos, Alcance (80/320)'), 'arco não é arremesso')
ok(!isThrowable(undefined), 'sem propriedades, não consome')
{
  const consumiveis = WEAPONS.filter((w) => isThrowable(w.properties))
  console.log(`armas consumíveis no catálogo: ${consumiveis.length} de ${WEAPONS.length} —`,
    consumiveis.slice(0, 4).map((w) => w.name).join(', '))
  ok(consumiveis.some((w) => /shuriken/i.test(w.name)), 'shuriken tinha que estar entre elas')
  ok(!consumiveis.some((w) => /chakram/i.test(w.name)), 'nenhum chakram devia entrar')
}

// --- Pilha: o mesmo item nunca abre duas linhas
{
  const shuriken = WEAPONS.find((w) => w.name === 'Shuriken (5)')!
  let lista: Weapon[] = []
  for (let i = 0; i < 4; i++) lista = stackWeapon(lista, weaponFromCatalog(shuriken), 5)
  ok(lista.length === 1, `4 compras de shuriken deviam dar 1 linha, deram ${lista.length}`)
  ok(lista[0].quantity === 20, `deviam ser 20 shurikens, são ${lista[0].quantity}`)
  ok(lista[0].name === 'Shuriken', 'a linha guarda o nome sem o maço')
  ok(lista[0].consumable === true, 'shuriken da ficha nasce consumível')
  console.log(`4 compras de "Shuriken (5)" -> ${lista[0].name} x${lista[0].quantity}, uma linha`)

  lista = spendWeapon(lista, lista[0].id, 1)
  ok(lista[0].quantity === 19, 'atacar gasta uma unidade')
  lista = spendWeapon(lista, lista[0].id, 19)
  ok(lista.length === 0, 'a última unidade usada tira a linha da ficha')
}
{
  let g: InventoryItem[] = []
  g = stackGear(g, 'Selo de Luz', 2)
  g = stackGear(g, 'selo de luz', 3)
  ok(g.length === 1 && g[0].quantity === 5, 'itens empilham ignorando caixa')
  g = spendGear(g, g[0].id, 5)
  ok(g.length === 0, 'item zerado sai da lista')
  console.log('pilha de itens e consumo OK')
}

// --- Classe de Armadura pela armadura vestida
{
  const mods: Modifiers = { strength: 1, dexterity: 4, constitution: 2, intelligence: 0, wisdom: 0, charisma: 0 }
  const quem = { modifiers: mods, proficiencyBonus: 3 }
  ok(armorClassFor(quem, []) === 15, `sem armadura: 10 + 4 (DES) + 1 (metade de 3) = 15, deu ${armorClassFor(quem, [])}`)

  const acolchoada = { ...armorFromCatalog(ARMORS.find((a) => a.name === 'Armadura Acolchoada')!), id: 'a1' }
  ok(acolchoada.dexCap === undefined, 'Destreza Total não tem teto')
  ok(armorClassFor(quem, [acolchoada]) === 16, 'acolchoada (+1) sobe a CA para 16')

  const colete = { ...armorFromCatalog(ARMORS.find((a) => a.name === 'Colete de Combate')!), id: 'a2' }
  ok(colete.dexCap === 2, `"Máx. 2" devia virar teto 2, virou ${colete.dexCap}`)
  ok(armorClassFor(quem, [colete]) === 16, `colete (+3) com Destreza limitada a 2: 10+3+2+1 = 16, deu ${armorClassFor(quem, [colete])}`)

  const samurai = { ...armorFromCatalog(ARMORS.find((a) => a.name === 'Armadura Samurai')!), id: 'a3' }
  ok(samurai.dexCap === 0, 'Destreza "Nenhum" vira teto 0')
  ok(armorClassFor(quem, [samurai]) === 21, `samurai (+10) sem Destreza: 10+10+0+1 = 21, deu ${armorClassFor(quem, [samurai])}`)

  // Guardada na mochila não protege ninguém.
  ok(armorClassFor(quem, [{ ...samurai, equipped: false }]) === 15, 'armadura guardada não conta')
  // Duas peças: bônus soma, vale o teto mais apertado.
  ok(armorClassFor(quem, [acolchoada, samurai]) === 22, 'duas peças somam o bônus e usam o teto mais apertado')
  console.log('CA: sem armadura 15 · acolchoada 16 · colete 16 (teto 2) · samurai 21 (sem Destreza)')

  ok(dexCapFromText('Total') === undefined && dexCapFromText('Máx. 2') === 2 && dexCapFromText('Nenhum') === 0,
     'leitura dos três limites de Destreza do catálogo')

  let ar: Armor[] = []
  ar = stackArmor(ar, armorFromCatalog(ARMORS[0]))
  ar = stackArmor(ar, armorFromCatalog(ARMORS[0]))
  ok(ar.length === 1 && ar[0].quantity === 2, 'armadura repetida também empilha')
}

// --- Equipamento inicial: tudo que casa com o catálogo casa de verdade
{
  let comItens = 0
  let comEscolha = 0
  let avulsos: string[] = []
  for (const classe of CLASSES) {
    for (const escolha of readStartingEquipment(classe.startingEquipment)) {
      ok(escolha.options.length > 0, `linha sem alternativa em ${classe.name}: ${escolha.label}`)
      for (const op of escolha.options) {
        if (op.type === 'items') {
          comItens++
          for (const p of op.picks) {
            const existe =
              p.kind === 'weapon' ? WEAPONS.some((w) => w.name === p.name)
              : p.kind === 'armor' ? ARMORS.some((a) => a.name === p.name)
              : GEAR.some((g) => g.name === p.name)
            ok(existe, `"${p.name}" não existe no catálogo (${classe.name})`)
            ok(p.quantity > 0, `quantidade inválida para ${p.name}`)
          }
        } else if (op.type === 'choose') {
          comEscolha++
          ok(categoryOptions(op.kind, op.category).length > 0, `categoria "${op.category}" sem opções`)
        } else {
          avulsos.push(op.label)
        }
      }
    }
  }
  console.log(`equipamento inicial: ${comItens} alternativas viraram itens do catálogo, ${comEscolha} viraram escolha por categoria, ${avulsos.length} ficaram avulsas`)
  if (avulsos.length > 0) console.log('avulsas:', [...new Set(avulsos.map((a) => a.replace(/^\d+\s*/, '')))].join(' | '))
  ok(comItens > 25, 'a maior parte do equipamento inicial devia sair do catálogo')
  ok(avulsos.length === 0, `todo o equipamento inicial devia achar item ou categoria; sobraram ${avulsos.length}`)

  // O caso que o usuário citou: 20 shurikens em uma linha só.
  const genjutsu = readStartingEquipment(CLASSES[0].startingEquipment)
  const linhaShuriken = genjutsu.find((e) => /shuriken/i.test(e.label))!
  const picksShuriken = linhaShuriken.options.flatMap((o) =>
    o.type === 'items' ? o.picks.filter((p) => /shuriken/i.test(p.name)) : [],
  )
  ok(picksShuriken.length === 1, 'a alternativa da shuriken devia virar item do catálogo')
  ok(picksShuriken[0].quantity === 20, '"20 shurikens" tem que virar 20 unidades')
  const aplicado = applyStartingPicks(picksShuriken)
  ok(aplicado.weapons.length === 1 && aplicado.weapons[0].quantity === 20, 'as 20 entram como uma linha só na ficha')

  // "bomba de papel" é o selo explosivo, não o item "Pá" (que casava por
  // substring antes da comparação passar a ser palavra por palavra).
  const cacador = readStartingEquipment(CLASSES.find((c) => /Ca[çc]ador/.test(c.name))!.startingEquipment)
  const linhaPapel = cacador.find((e) => /papel/i.test(e.label))!
  const opPapel = linhaPapel.options.find((o) => /papel/i.test(o.label))!
  ok(opPapel.type === 'items' && opPapel.picks[0].name === 'Selos Explosivos',
     '"bomba de papel" devia virar Selos Explosivos, não Pá')
  const opSelo = linhaPapel.options.find((o) => /luz/i.test(o.label))!
  ok(opSelo.type === 'items' && opSelo.picks[0].name === 'Selo de Luz' && opSelo.picks[0].quantity === 2,
     '"2 selos de luz" tem que achar o Selo de Luz do catálogo')

  // "Fuma Shuriken" é outra arma, não a shuriken comum.
  const estrategista = readStartingEquipment(CLASSES.find((c) => /Estrategista/.test(c.name))!.startingEquipment)
  const linhaFuma = estrategista.find((e) => /Fuma/i.test(e.label))!
  const opFuma = linhaFuma.options.find((o) => /Fuma/i.test(o.label))!
  ok(opFuma.type === 'items' && opFuma.picks[0].name === 'Fuma-Shuriken', 'Fuma Shuriken devia achar a Fuma-Shuriken')

  // Vírgula também separa alternativas.
  const taijutsu = readStartingEquipment(CLASSES.find((c) => /Taijutsu/.test(c.name))!.startingEquipment)
  const linhaTonfa = taijutsu.find((e) => /Tonfa/.test(e.label))!
  ok(linhaTonfa.options.length === 3, `"Tonfa, Nunchaku ou Braçadeiras" devia dar 3 alternativas, deu ${linhaTonfa.options.length}`)
}

// --- Sinônimos e itens da casa
{
  const nomes = (linhas: readonly string[]) =>
    readStartingEquipment(linhas).flatMap((e) => e.options.flatMap((o) => (o.type === 'items' ? o.picks.map((p) => p.name) : [])))

  const medico = nomes(CLASSES.find((c) => /M[ée]dico/.test(c.name))!.startingEquipment)
  ok(medico.includes('Kit Médico'), '"Kit de Medicina" devia virar o Kit Médico do catálogo')
  ok(medico.includes('Tecido de Contenção'), 'o Tecido de Contenção (item da casa) devia estar no catálogo agora')

  const estrategista = nomes(CLASSES.find((c) => /Estrategista/.test(c.name))!.startingEquipment)
  ok(estrategista.includes('Lâminas de Punho'), '"Lâminas de Soco" devia virar Lâminas de Punho')

  const armas = nomes(CLASSES.find((c) => /Especialista em Armas/.test(c.name))!.startingEquipment)
  ok(armas.includes('Jaqueta de Combate'), 'a Jaqueta de Combate (item da casa) devia estar no catálogo')
  const jaqueta = ARMORS.find((a) => a.name === 'Jaqueta de Combate')!
  ok(jaqueta.houseRule === true, 'a Jaqueta tem que ficar marcada como item da casa')
  ok(jaqueta.armorBonus === 2 && jaqueta.dexBonus === 'Total', 'Jaqueta: +2 de CA, Destreza total')

  const genjutsu = nomes(CLASSES[0].startingEquipment)
  ok(genjutsu.includes('Bomba de Fumaça'), 'a Bomba de Fumaça (item da casa) devia estar no catálogo')

  const daCasa = [...GEAR, ...ARMORS].filter((i) => i.houseRule)
  console.log(`itens da casa: ${daCasa.length} —`, daCasa.map((i) => `${i.name} (${i.cost})`).join(', '))
  ok(daCasa.length === 9, `esperava 9 itens da casa, achei ${daCasa.length}`)
  for (const i of daCasa) ok(parseRyoCost(i.cost) > 0, `${i.name} precisa de preço`)
  // Nenhum item da casa pode passar por item do manual sem marca.
  ok(GEAR.filter((g) => /Bomba de Fumaça|Tecido de Contenção|Pergaminho em Branco|Pergaminho de Ninjutsu/.test(g.name)).every((g) => g.houseRule),
     'todo item da casa fica marcado')
}

console.log('OK: todas as checagens de equipamento passaram')
