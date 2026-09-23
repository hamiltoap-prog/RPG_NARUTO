import { SEM_PASTA, agruparPorPasta, pastaDe, pastasDa } from '../sceneLibrary'
import type { SceneLibraryItem } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

const item = (label: string, folder?: string): SceneLibraryItem =>
  ({ id: label, kind: 'map', label, folder, createdAt: 0 }) as SceneLibraryItem

// --- As pastas saem dos próprios itens, em ordem, com a solta por último
{
  const lib = [
    item('Covil', 'Vilões'),
    item('Ponte', 'Konoha'),
    item('Mapa solto'),
    item('Academia', 'Konoha'),
    item('Ártico', 'Ártico'),
  ]
  const p = pastasDa(lib)
  ok(p.join(' | ') === 'Ártico | Konoha | Vilões | Sem pasta', `ordem errada: ${p.join(' | ')}`)
  ok(p[p.length - 1] === SEM_PASTA, 'os soltos ficam por último')
  ok(new Set(p).size === p.length, 'pasta repetida aparece uma vez só')
  console.log('pastas lidas da biblioteca:', p.join(' | '))
}

// --- Biblioteca toda em pasta não inventa a "Sem pasta"
{
  const p = pastasDa([item('A', 'X'), item('B', 'X')])
  ok(p.join() === 'X', `devia ter só a pasta X, veio ${p.join()}`)
  ok(!p.includes(SEM_PASTA), 'sem itens soltos, não existe "Sem pasta"')
}

// --- Nome de pasta só com espaços é o mesmo que estar solto
{
  const p = pastasDa([item('A', '   '), item('B', undefined)])
  ok(p.join() === SEM_PASTA, `espaço em branco não vira pasta, veio ${p.join()}`)
}

// --- Espaços em volta não criam duas pastas com o mesmo nome
{
  const p = pastasDa([item('A', 'Konoha'), item('B', ' Konoha '), item('C', 'Konoha')])
  ok(p.join() === 'Konoha', `"Konoha" e " Konoha " são a mesma pasta, veio ${p.join()}`)
}

// --- Biblioteca vazia não tem pasta nenhuma
{
  ok(pastasDa([]).length === 0, 'biblioteca vazia não tem pasta')
}

// --- O agrupamento que a tela desenha
{
  const lib = [
    item('Zabuza', 'Vilões'),
    item('Ponte', 'Konoha'),
    item('Academia', 'Konoha'),
    item('Mapa solto'),
  ]
  const g = agruparPorPasta(lib)
  ok(g.get('Konoha')!.map((i) => i.label).join() === 'Academia,Ponte', 'dentro da pasta, ordem alfabética')
  ok(g.get(SEM_PASTA)!.length === 1, 'o solto cai em "Sem pasta"')
  ok(g.get('Vilões')!.length === 1, 'cada item numa pasta só')
  const total = [...g.values()].reduce((n, l) => n + l.length, 0)
  ok(total === lib.length, `nenhum item se perde nem se duplica: ${total} de ${lib.length}`)

  // Espaços em volta agrupam junto, como na leitura das pastas.
  const g2 = agruparPorPasta([item('A', 'Konoha'), item('B', ' Konoha ')])
  ok(g2.size === 1 && g2.get('Konoha')!.length === 2, 'o mesmo nome com espaços cai na mesma pasta')
}

// --- pastaDe: o nome aparado, e vazio quando está solto
{
  ok(pastaDe({ folder: ' Konoha ' }) === 'Konoha', 'apara os espaços')
  ok(pastaDe({ folder: '   ' }) === '', 'só espaços é o mesmo que solto')
  ok(pastaDe({ folder: undefined }) === '', 'sem pasta é vazio')
}

console.log('OK: checagens de pastas da biblioteca passaram')
