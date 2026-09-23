import { arteDaPeca, modoDaPeca, podeUsarPng } from '../tokenArt'
import { buildClones, buildPuppet, readClone } from '../companions'
import { JUTSU_CATALOG } from '../../data/jutsus'
import type { Character, PuppetSpec, SceneToken } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

const RETRATO = 'http://x/retrato.jpg'
const PNG = 'http://x/peca.png'

// --- Qual imagem a peça usa
{
  ok(arteDaPeca({ imageUrl: RETRATO }).url === RETRATO, 'sem PNG, vale o retrato da ficha')
  ok(arteDaPeca({ imageUrl: RETRATO }).recortado === false, 'retrato é redondo, não recortado')

  // Ter o link não basta: o mestre precisa ter ligado.
  ok(arteDaPeca({ imageUrl: RETRATO, tokenUrl: PNG }).url === RETRATO, 'PNG guardado mas desligado não entra')
  const ligado = arteDaPeca({ imageUrl: RETRATO, tokenUrl: PNG, tokenMode: 'png' })
  ok(ligado.url === PNG, 'PNG ligado vale mais que o retrato')
  ok(ligado.recortado, 'PNG desenha inteiro, sem recorte redondo')

  // Modo ligado sem link não pode apagar a peça.
  ok(arteDaPeca({ imageUrl: RETRATO, tokenMode: 'png' }).url === RETRATO, 'modo PNG sem link cai no retrato')
  ok(modoDaPeca({ imageUrl: RETRATO, tokenMode: 'png' }) === 'ficha', 'sem link, o modo que vale é o retrato')
  ok(!podeUsarPng({ imageUrl: RETRATO }), 'sem link não dá para ligar o PNG')
  ok(podeUsarPng({ tokenUrl: PNG }), 'com link dá')
  ok(!podeUsarPng({ tokenUrl: '   ' }), 'link só de espaços não conta')

  // Peça solta, sem ficha nenhuma (cenário, armadilha, capanga sem ficha).
  const solta = { imageUrl: 'http://x/pedra.jpg' } as SceneToken
  ok(arteDaPeca(undefined, solta).url === 'http://x/pedra.jpg', 'peça sem ficha usa a imagem dela mesma')
  ok(arteDaPeca(undefined, undefined).url === undefined, 'sem imagem nenhuma, a peça mostra as iniciais')
}

// --- O clone é a cara do original
{
  const dono = {
    id: 'c1', tableId: 't1', name: 'Naruto', armorClass: 15, resistancePoints: 14,
    attributes: { strength: 12, dexterity: 14, constitution: 16, intelligence: 13, wisdom: 10, charisma: 15 },
    modifiers: { strength: 1, dexterity: 2, constitution: 3, intelligence: 1, wisdom: 0, charisma: 2 },
    proficiencyBonus: 3,
    imageUrl: RETRATO,
    tokenUrl: PNG,
    tokenMode: 'png' as const,
    jutsus: [{ id: 'j1', name: 'RASENGAN', details: '' }],
    weapons: [],
  } as unknown as Character

  const leitura = readClone(JUTSU_CATALOG.find((j) => j.name === 'TÉCNICA DE CLONES DAS SOMBRAS')!)
  const clone = buildClones({ owner: dono, ownerUid: 'u', jutsuName: 'TÉCNICA DE CLONES DAS SOMBRAS', reading: leitura, count: 1, chakraDie: 'd8' })[0]
  ok(clone.imageUrl === RETRATO, 'o clone leva o retrato do dono')
  ok(clone.tokenUrl === PNG, 'o clone leva o PNG de peça do dono')
  ok(arteDaPeca(clone).url === PNG, 'a peça do clone no mapa sai igual à do dono')
  ok(arteDaPeca(clone).recortado, 'e recortada do mesmo jeito')
}

// --- A marionete tem cara própria, vinda da forja
{
  const dono = {
    id: 'c2', tableId: 't1', name: 'Kankuro', imageUrl: 'http://x/kankuro.jpg',
    modifiers: { strength: 0, dexterity: 3, constitution: 1, intelligence: 2, wisdom: 0, charisma: 0 },
    proficiencyBonus: 3,
  } as unknown as Character

  const spec: PuppetSpec = {
    hp: 20, armorClass: 13, resistancePoints: 13, activationCost: 3, attacks: [], jutsus: [],
    imageUrl: 'http://x/corvo.jpg', tokenUrl: 'http://x/corvo.png', tokenMode: 'png',
  }
  const corvo = buildPuppet({ owner: dono, ownerUid: 'u', puppetItemId: 'i1', name: 'Corvo', spec })!
  ok(corvo.imageUrl === 'http://x/corvo.jpg', 'a marionete usa o retrato da forja, não o do dono')
  ok(arteDaPeca(corvo).url === 'http://x/corvo.png', 'e o PNG da forja na peça do mapa')

  // Forja sem imagem: a peça cai nas iniciais, e não na cara do dono.
  const semArte = buildPuppet({ owner: dono, ownerUid: 'u', puppetItemId: 'i2', name: 'Vazia', spec: { ...spec, imageUrl: undefined, tokenUrl: undefined, tokenMode: undefined } })!
  ok(arteDaPeca(semArte).url === undefined, 'marionete sem imagem não empresta a cara do dono')
}

console.log('OK: checagens de arte das peças passaram')
