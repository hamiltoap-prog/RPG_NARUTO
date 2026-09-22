import { applyMapTransform, invertMapTransform, remapPoint, snapToGrid, spotsAround } from '../sceneGeometry'

const aspect = 16 / 9
const pontos = [
  { x: 0.5, y: 0.5 }, { x: 0.1, y: 0.2 }, { x: 0.9, y: 0.75 }, { x: 0, y: 1 }, { x: 1, y: 0 },
]
const mapas = [
  {}, { zoom: 2 }, { rotation: 90 }, { rotation: 37, zoom: 1.4 },
  { offsetX: 0.2, offsetY: -0.1 }, { rotation: 215, zoom: 0.6, offsetX: -0.3, offsetY: 0.25 },
]

let pior = 0
for (const m of mapas) {
  for (const p of pontos) {
    const volta = invertMapTransform(m, applyMapTransform(m, p, aspect), aspect)
    pior = Math.max(pior, Math.abs(volta.x - p.x), Math.abs(volta.y - p.y))
  }
}
console.log('ida e volta, maior erro:', pior.toExponential(2))
if (pior > 1e-9) throw new Error('FALHOU: inversa não fecha')

// Um ponto do terreno deve acompanhar o mapa: com o mapa indo de A para B,
// o ponto que estava colado ao terreno vai para onde o terreno foi.
const A = { zoom: 1, rotation: 0, offsetX: 0, offsetY: 0 }
const B = { zoom: 2, rotation: 0, offsetX: 0, offsetY: 0 }
const meio = remapPoint({ x: 0.5, y: 0.5 }, A, B, aspect)
console.log('centro com zoom 2x fica em', meio, '(deve continuar no centro)')
if (Math.abs(meio.x - 0.5) > 1e-9 || Math.abs(meio.y - 0.5) > 1e-9) throw new Error('FALHOU: centro moveu')

const q = remapPoint({ x: 0.75, y: 0.5 }, A, B, aspect)
console.log('ponto a 0.25 do centro, com zoom 2x:', q.x.toFixed(4), '(deve ser 1.0 — dobro da distância)')
if (Math.abs(q.x - 1) > 1e-9) throw new Error('FALHOU: zoom não dobrou a distância')

// Giro de 90°: um ponto à direita do centro deve ir para baixo do centro,
// com a mesma distância medida em espaço quadrado.
const R = { rotation: 90 }
const g = applyMapTransform(R, { x: 0.75, y: 0.5 }, aspect)
const distOrig = 0.25
const distNova = Math.hypot(g.x - 0.5, (g.y - 0.5) / aspect)
console.log('giro 90°: (0.75,0.5) ->', { x: +g.x.toFixed(4), y: +g.y.toFixed(4) }, 'distância', distNova.toFixed(4))
if (Math.abs(distNova - distOrig) > 1e-9) throw new Error('FALHOU: giro distorceu a distância')
if (Math.abs(g.x - 0.5) > 1e-9) throw new Error('FALHOU: giro de 90° devia zerar o deslocamento em X')

console.log('OK: todas as checagens de geometria passaram')

// --- Névoa acompanhando o mapa -------------------------------------------
import { emptyFog, isRevealed, paintFog, remapFog } from '../fog'

let fog = emptyFog(aspect)
// revela um círculo à esquerda do centro
fog = paintFog(fog, 0.3, 0.5, 5, true)
if (!isRevealed(fog, 0.3, 0.5)) throw new Error('FALHOU: pintura não revelou')
if (isRevealed(fog, 0.7, 0.5)) throw new Error('FALHOU: revelou onde não devia')

// o mapa desloca 0.2 para a direita: o que foi revelado deve ir junto
const de = { zoom: 1, rotation: 0, offsetX: 0, offsetY: 0 }
const para = { zoom: 1, rotation: 0, offsetX: 0.2, offsetY: 0 }
const movida = remapFog(fog, de, para, aspect)
console.log('névoa: revelado em 0.3 antes ->', isRevealed(fog, 0.3, 0.5), '| depois do mapa andar 0.2:', isRevealed(movida, 0.5, 0.5))
if (!isRevealed(movida, 0.5, 0.5)) throw new Error('FALHOU: a névoa não acompanhou o mapa')
if (isRevealed(movida, 0.3, 0.5)) throw new Error('FALHOU: a névoa ficou para trás no lugar antigo')

// ida e volta do mapa devolve a névoa ao lugar
const volta = remapFog(movida, para, de, aspect)
if (!isRevealed(volta, 0.3, 0.5)) throw new Error('FALHOU: voltar o mapa não devolveu a névoa')
console.log('OK: a névoa acompanha o mapa e volta com ele')

// --- Onde os clones e as invocações nascem: ao lado da peça do dono
{
  const ok = (c: boolean, m: string) => { if (!c) throw new Error('FALHOU: ' + m) }
  const colunas = 20
  const aspecto = 1
  const cell = 1 / colunas
  const dono = { x: 0.5, y: 0.5 }

  const tres = spotsAround(dono, 3, [dono], colunas, aspecto)
  ok(tres.length === 3, `pediu 3 casas, veio ${tres.length}`)
  ok(tres.every((p) => Math.max(Math.abs(p.x - dono.x), Math.abs(p.y - dono.y)) <= cell * 1.6),
     'as três primeiras nascem coladas no dono (primeiro anel)')
  ok(new Set(tres.map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`)).size === 3, 'sem duas peças na mesma casa')
  ok(tres.every((p) => Math.abs(p.x - dono.x) > 1e-9 || Math.abs(p.y - dono.y) > 1e-9), 'nenhuma nasce em cima do dono')
  console.log('3 clones em volta do dono:', tres.map((p) => `(${p.x.toFixed(3)},${p.y.toFixed(3)})`).join(' '))

  // Casa ocupada por outra peça é pulada.
  const vizinho = { x: dono.x + cell, y: dono.y }
  const comVizinho = spotsAround(dono, 2, [dono, vizinho], colunas, aspecto)
  ok(comVizinho.every((p) => Math.abs(p.x - vizinho.x) > 1e-9 || Math.abs(p.y - vizinho.y) > 1e-9),
     'não põe clone na casa de quem já está lá')

  // Dez clones cabem: o anel cresce quando o primeiro (8 casas) lota.
  const dez = spotsAround(dono, 10, [dono], colunas, aspecto)
  ok(dez.length === 10, `10 clones precisam de 10 casas, veio ${dez.length}`)
  ok(new Set(dez.map((p) => `${p.x.toFixed(4)},${p.y.toFixed(4)}`)).size === 10, '10 casas distintas')
  // O primeiro anel tem 8 casas, então o 9º e o 10º caem no segundo — e
  // nunca mais longe que isso.
  const base = snapToGrid(dono.x, dono.y, 1, colunas, aspecto)
  const aneis = dez.map((p) => Math.round(Math.max(Math.abs(p.x - base.x), Math.abs(p.y - base.y)) / cell))
  ok(aneis.filter((a) => a === 1).length === 8, `o primeiro anel devia levar 8 clones, levou ${aneis.filter((a) => a === 1).length}`)
  ok(aneis.filter((a) => a === 2).length === 2, 'os dois últimos vão para o segundo anel')
  ok(Math.max(...aneis) === 2, `nenhum clone devia passar do segundo anel, o mais longe foi no ${Math.max(...aneis)}º`)
  console.log(`10 clones: 8 no primeiro anel, 2 no segundo — nenhum mais longe que isso`)

  // Dono na beirada: nada sai do tabuleiro.
  const naBorda = spotsAround({ x: 0.02, y: 0.02 }, 5, [], colunas, aspecto)
  ok(naBorda.every((p) => p.x > 0 && p.x < 1 && p.y > 0 && p.y < 1), 'nenhuma peça nasce fora do palco')
  console.log('dono na beirada: todas as 5 casas continuam dentro do palco')
}

console.log('OK: checagens de posicionamento de clones passaram')
