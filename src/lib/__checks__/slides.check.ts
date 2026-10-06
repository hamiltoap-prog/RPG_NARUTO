import {
  avancar,
  duplicarElemento,
  ima,
  moverCamada,
  normalizarSlide,
  novaForma,
  novaImagem,
  novoTexto,
  passosDoSlide,
  prenderAoPalco,
  slidesParaApresentar,
  visivelNoPasso,
  voltar,
} from '../slides'
import type { StorySlide } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

// --- Slide antigo vira slide de camadas com a mesma cara
{
  const antigo: StorySlide = { id: 'a', title: 'Os portões', text: 'O sol nasce.', imageUrl: 'https://x/p.png' }
  const n = normalizarSlide(antigo)
  ok(n.fundoUrl === 'https://x/p.png', 'a imagem vira fundo')
  const tipos = (n.elementos ?? []).map((e) => e.tipo).join()
  ok(tipos === 'forma,texto,texto', `faixa embaixo, título e texto por cima (${tipos})`)
  ok((n.elementos ?? []).every((e) => e.entrada === 'nenhuma'), 'sem animação: abre como abria')
  ok(normalizarSlide(n) === n, 'slide novo passa direto')
  const soTexto = normalizarSlide({ id: 'b', text: 'Uma carta.' })
  ok(soTexto.elementos?.length === 1 && !soTexto.fundoUrl, 'slide só de texto vira um texto, sem faixa')
}

// --- Cliques: o "próximo" revela antes de passar de slide
{
  const s1: StorySlide = {
    id: 's1',
    elementos: [novoTexto(), novaImagem('u', { passo: 1 }), novoTexto({ passo: 2 })],
  }
  const s2: StorySlide = { id: 's2', elementos: [novoTexto()] }
  const slides = [s1, s2]
  ok(passosDoSlide(s1) === 2 && passosDoSlide(s2) === 0, 'conta os cliques do slide')
  let p = { index: 0, step: 0 }
  const caminho: string[] = []
  for (let n = 0; n < 6; n++) {
    caminho.push(`${p.index}.${p.step}`)
    const prox = avancar(slides, p)
    if (!prox) break
    p = prox
  }
  ok(caminho.join(' ') === '0.0 0.1 0.2 1.0', `próximo: ${caminho.join(' ')}`)
  ok(avancar(slides, { index: 1, step: 0 }) === null, 'no fim, fica')
  const v = voltar(slides, { index: 1, step: 0 })
  ok(v?.index === 0 && v.step === 2, 'voltar de um slide cai no anterior completo')
  ok(voltar(slides, { index: 0, step: 1 })?.step === 0, 'voltar desfaz um clique')
  ok(voltar(slides, { index: 0, step: 0 }) === null, 'no começo, fica')
  ok(!visivelNoPasso(s1.elementos![1], 0) && visivelNoPasso(s1.elementos![1], 1), 'elemento do clique 1 só aparece no clique 1')
}

// --- Camadas
{
  const a = novoTexto({ id: 'a' })
  const b = novaImagem('u', { id: 'b' })
  const c = novaForma({ id: 'c' })
  const ids = (l: { id: string }[]) => l.map((e) => e.id).join('')
  ok(ids(moverCamada([a, b, c], 'a', 'frente')) === 'bca', 'trazer para a frente')
  ok(ids(moverCamada([a, b, c], 'c', 'tras')) === 'cab', 'enviar para trás')
  ok(ids(moverCamada([a, b, c], 'a', 'subir')) === 'bac', 'subir um nível')
  ok(ids(moverCamada([a, b, c], 'a', 'descer')) === 'abc', 'descer no fundo não sai do lugar')
  ok(ids(moverCamada([a, b, c], 'c', 'subir')) === 'abc', 'subir no topo não sai do lugar')
  const d = duplicarElemento(b)
  ok(d.id !== b.id && d.tipo === 'imagem' && d.x > b.x, 'duplicar: id novo, deslocado')
}

// --- Prender ao palco e ímã
{
  const fora = prenderAoPalco(novoTexto({ x: 5, y: -5, w: 0.001, h: 0.2 }))
  ok(fora.x <= 0.98 && fora.y >= -fora.h && fora.w >= 0.02, 'nunca some do palco nem fica minúsculo')
  const centro = ima({ x: 0.296, y: 0.1, w: 0.4, h: 0.2 })
  ok(Math.abs(centro.x - 0.3) < 1e-9 && centro.guiasX.includes(0.5), 'ímã centraliza na horizontal')
  const borda = ima({ x: 0.005, y: 0.4, w: 0.2, h: 0.2 })
  ok(borda.x === 0 && borda.guiasX.includes(0), 'ímã encosta na borda')
  const solto = ima({ x: 0.2, y: 0.2, w: 0.1, h: 0.1 })
  ok(solto.x === 0.2 && solto.guiasX.length === 0, 'longe das guias, não mexe')
}

// --- O que vai para os jogadores
{
  const s: StorySlide = { id: 'n', notas: 'o vilão é o irmão', elementos: [novoTexto()] }
  const [ap] = slidesParaApresentar([s, { id: 'v', title: 'velho' }])
  ok(!('notas' in ap), 'as notas do mestre não vão para a mesa')
  ok(s.notas === 'o vilão é o irmão', 'e o original não é mexido')
  ok(Boolean(slidesParaApresentar([{ id: 'v', title: 'velho' }])[0].elementos), 'slide antigo vai convertido')
}

console.log('OK: checagens dos slides passaram')
