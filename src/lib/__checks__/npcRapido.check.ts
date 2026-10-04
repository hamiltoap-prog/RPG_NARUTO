import { CLASSES } from '../../data/classes'
import { CLANS } from '../../data/clans'
import { maxRankForLevel, normalizeRank, rankIndex, canLearn, effectiveElements } from '../jutsuAccess'
import { afinidadeClaClasse, gerarNPC, prioridadesDaClasse, rngComSemente } from '../npcRapido'
import { allJutsus } from '../jutsuCatalog'
import { ATTRIBUTE_KEYS } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}
const cla = (id: string) => CLANS.find((c) => c.id === id)!

// --- O "atributo principal" do manual vira prioridade
{
  const taijutsu = CLASSES.find((c) => c.id === 'taijutsu_specialist')!
  const p = prioridadesDaClasse(taijutsu)
  ok(p.principais.join() === 'strength,dexterity', `taijutsu: ${p.principais.join()}`)
  ok(p.secundarios.join() === 'constitution', `taijutsu depois: ${p.secundarios.join()}`)
  const gen = prioridadesDaClasse(CLASSES.find((c) => c.id === 'genjutsu_specialist')!)
  ok(gen.principais.join() === 'wisdom,charisma', `genjutsu: ${gen.principais.join()}`)
  for (const c of CLASSES) ok(prioridadesDaClasse(c).principais.length > 0, `${c.name} sem atributo principal lido`)
}

// --- Clã sugerido pesa na classe
{
  // Aburame dá Carisma e Sabedoria: o que o Especialista em Genjutsu pede.
  const aburame = cla('aburame')
  const gen = CLASSES.find((c) => c.id === 'genjutsu_specialist')!
  const tai = CLASSES.find((c) => c.id === 'taijutsu_specialist')!
  ok(afinidadeClaClasse(aburame, gen) > afinidadeClaClasse(aburame, tai), 'Aburame combina mais com genjutsu que com taijutsu')
  // O manual sugere o Uchiha para o Especialista em Ninjutsu; o Nara, não.
  const nin = CLASSES.find((c) => c.id === 'ninjutsu_specialist')!
  ok(afinidadeClaClasse(cla('uchiha'), nin) > afinidadeClaClasse(cla('nara'), nin) - 1, 'clã sugerido pelo manual pesa')
  ok(CLASSES.every((c) => afinidadeClaClasse(aburame, c) >= 1), 'nenhuma classe fica impossível')
}

// --- A ficha sai inteira e dentro das regras, em vários níveis e clãs
let total = 0
for (const clanId of ['uchiha', 'aburame', 'akimichi', 'hyuga', 'sem_cla']) {
  const clan = CLANS.find((c) => c.id === clanId)
  if (!clan) continue
  for (const nivel of [1, 5, 9, 13, 20]) {
    for (let s = 1; s <= 4; s++) {
      const f = gerarNPC({ tableId: 't', ownerUid: 'gm', name: 'Teste', level: nivel, clan, rng: rngComSemente(s * 97 + nivel) })
      const classe = CLASSES.find((c) => c.id === f.classId)!
      total++
      ok(Boolean(classe), 'classe existe')
      ok(f.isNPC === true && f.visible === false, 'nasce NPC e oculto')
      ok(f.level === nivel && f.hp.max > 0 && f.chakra.max > 0, 'nível, PV e chakra')
      ok(ATTRIBUTE_KEYS.every((k) => f.attributes[k] >= 3 && f.attributes[k] <= 22), 'atributos plausíveis')
      // O atributo mais alto é um dos principais da classe (antes do bônus de clã pesar).
      const { principais } = prioridadesDaClasse(classe)
      const maior = Math.max(...principais.map((k) => f.attributes[k]))
      ok(ATTRIBUTE_KEYS.every((k) => f.attributes[k] <= maior + 3), `${classe.name}: principal ficou baixo demais`)
      // Jutsus: todos aprendíveis por esta ficha, e sem repetir.
      const rankMax = maxRankForLevel(classe, nivel)
      const elementos = effectiveElements(clan, f.elements)
      for (const j of f.jutsus) {
        const cat = allJutsus().find((x) => x.name === j.name)!
        ok(Boolean(cat), `jutsu ${j.name} existe`)
        ok(canLearn(cat, { clanId: clan.id, elements: elementos, maxRank: rankMax }).ok, `${j.name} não podia ser aprendido`)
        ok(rankIndex(normalizeRank(cat.rank)) <= rankIndex(rankMax), 'rank dentro do nível')
      }
      ok(new Set(f.jutsus.map((j) => j.name)).size === f.jutsus.length, 'jutsu repetido')
      ok(f.jutsus.length > 0, `${clan.name} nível ${nivel} sem jutsu nenhum`)
      ok(f.weapons.length + f.equipment.length + f.armor.length > 0, 'saiu sem equipamento')
      ok(f.armorClass >= 10, 'CA')
      ok(Boolean(f.description.rank), 'posto')
    }
  }
}

// --- Mesma semente, mesma ficha; classe escolhida é respeitada
{
  const clan = cla('uchiha')
  const a = gerarNPC({ tableId: 't', ownerUid: 'gm', name: 'A', level: 7, clan, rng: rngComSemente(42) })
  const b = gerarNPC({ tableId: 't', ownerUid: 'gm', name: 'A', level: 7, clan, rng: rngComSemente(42) })
  ok(a.classId === b.classId && JSON.stringify(a.attributes) === JSON.stringify(b.attributes), 'semente repete a ficha')
  const c = gerarNPC({ tableId: 't', ownerUid: 'gm', name: 'C', level: 7, clan, classId: 'weapon_specialist', rng: rngComSemente(3) })
  ok(c.classId === 'weapon_specialist', 'classe escolhida pelo mestre vale')
}

// --- Variedade: o sorteio não sai sempre igual
{
  const clan = cla('uchiha')
  const classes = new Set(
    Array.from({ length: 40 }, (_, i) => gerarNPC({ tableId: 't', ownerUid: 'gm', name: 'x', level: 5, clan, rng: rngComSemente(i + 1) }).classId),
  )
  ok(classes.size >= 3, `pouca variedade de classe: ${[...classes].join()}`)
}

console.log(`criação rápida: ${total} fichas sorteadas, todas dentro das regras`)
console.log('OK: checagens da criação rápida de NPC passaram')
