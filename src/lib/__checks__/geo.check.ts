import { applyMapTransform, invertMapTransform, remapPoint } from '../sceneGeometry'

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
