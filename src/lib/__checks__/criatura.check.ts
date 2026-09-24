import { npcActions } from '../npcActions'
import { setTableJutsus } from '../jutsuCatalog'
import { JUTSU_CATALOG } from '../../data/jutsus'
import type { JutsuCatalogEntry, NPC } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

function criatura(extra: Partial<NPC> = {}): NPC {
  return {
    id: 'n1',
    tableId: 't1',
    name: 'Lobo de Chakra',
    armorClass: 14,
    hp: { current: 30, max: 30 },
    resistancePoints: 13,
    attacksText: '',
    notes: '',
    visible: false,
    createdAt: 0,
    attacks: [{ id: 'a1', name: 'Mordida', bonus: 6, damage: '2d6', damageType: 'Perfurante' }],
    ...extra,
  } as NPC
}

// --- Golpe natural: o bônus da ficha é a conta inteira
{
  const a = npcActions(criatura())
  ok(a.length === 1 && a[0].source === 'attack', 'o golpe natural vira ação')
  ok(a[0].extraBonus === 6, `o bônus da ficha entra como bônus do golpe, veio ${a[0].extraBonus}`)
  ok(!a[0].proficient, 'e não soma proficiência por cima')
  ok(a[0].mode === 'attack' && a[0].damage === '2d6', 'com o dado que o mestre escreveu')
}

// --- A arma que ela carrega usa o bônus de ataque dela
{
  const a = npcActions(
    criatura({ weapons: [{ id: 'w1', name: 'Kunai', damage: '1d4', equipped: true, quantity: 3, consumable: true }] }),
  )
  const arma = a.find((x) => x.source === 'weapon')!
  ok(Boolean(arma), 'a arma vira ação')
  ok(arma.extraBonus === 6, `a arma rola com o bônus de ataque da criatura, veio ${arma.extraBonus}`)
  ok(arma.damage === '1d4', 'e com o dado da arma')
  ok(/arremesso/i.test(arma.note ?? ''), 'arma de arremesso fica marcada')
  ok(arma.label.includes('(3)'), 'a quantidade aparece no rótulo')

  // Arma sem unidade não entra na lista.
  const semUnidade = npcActions(criatura({ weapons: [{ id: 'w2', name: 'Shuriken', damage: '1d4', equipped: true, quantity: 0 }] }))
  ok(!semUnidade.some((x) => x.source === 'weapon'), 'arma zerada não vira ação')
}

// --- Jutsu do catálogo: modo, dano e condição vêm da leitura
{
  const comDano = JUTSU_CATALOG.find((j) => j.description.includes('de dano') && /ataque de ninjutsu/i.test(j.description))!
  const a = npcActions(criatura({ jutsus: [{ id: 'j1', name: comDano.name, details: '' }] }))
  const jutsu = a.find((x) => x.source === 'jutsu')!
  ok(Boolean(jutsu), 'o jutsu da criatura vira ação')
  ok(jutsu.mode === 'attack', `resolve pelo que o texto diz, veio ${jutsu.mode}`)
  ok(jutsu.proficient, 'jutsu rola com proficiência')
}

// --- Jutsu da casa também
{
  const daCasa: JutsuCatalogEntry = {
    name: 'SOPRO DO LOBO',
    classification: 'Ninjutsu',
    rank: 'Rank-C',
    castingTime: '1 Ação',
    range: '6 metros',
    duration: 'Instantâneo',
    components: 'HS',
    cost: '4 Chakras',
    keywords: '',
    description: 'Cada criatura em um raio de 6 metros faz um teste de resistência de Destreza ou sofre 3d8 de dano de vento e fica Caído.',
    category: 'Ninjutsu',
  }
  setTableJutsus([daCasa])
  const a = npcActions(criatura({ jutsus: [{ id: 'j1', name: 'SOPRO DO LOBO', details: '' }] }))
  const j = a.find((x) => x.source === 'jutsu')!
  ok(j.mode === 'save', `jutsu da casa lido como resistência, veio ${j.mode}`)
  ok(j.saveAttribute === 'dexterity', 'com o atributo que o texto diz')
  ok(j.damage === '3d8', `e o dado, veio ${j.damage}`)
  ok(j.chakraCost === 4, `e o custo, veio ${j.chakraCost}`)
  ok(j.conditions?.includes('Caído'), 'a condição é lida')
  ok(j.area === 'raio de 6 m', `a área é lida, veio ${j.area}`)
  setTableJutsus([])
}

// --- Jutsu escrito à mão na ficha, sem entrada no catálogo, não some
{
  const a = npcActions(criatura({ jutsus: [{ id: 'j9', name: 'GOLPE INVENTADO', details: 'efeito de mesa', chakraCost: '7 Chakras' }] }))
  const j = a.find((x) => x.source === 'jutsu')!
  ok(Boolean(j), 'jutsu fora do catálogo continua na lista de ações')
  ok(j.mode === 'none', 'e entra como efeito narrado')
  ok(j.chakraCost === 7, `com o custo que estava escrito, veio ${j.chakraCost}`)
}

// --- Criatura sem nada não oferece ação nenhuma
{
  ok(npcActions(criatura({ attacks: [] })).length === 0, 'sem golpe, arma nem jutsu não há o que fazer')
}

console.log('OK: checagens de ação da criatura passaram')
