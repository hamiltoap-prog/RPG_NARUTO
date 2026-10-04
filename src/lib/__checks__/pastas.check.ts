import {
  SEM_PASTA,
  caminhoDepoisDeMover,
  destinoDaPasta,
  estaDentro,
  montarArvore,
  mostrarCaminho,
  normalizarCaminho,
  paraGravar,
  todasAsPastas,
} from '../pastas'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

// --- O que a pessoa digita vira um caminho só
{
  for (const bruto of ['Cena 01 > Konoha', 'Cena 01/Konoha', ' Cena 01 › Konoha ', 'Cena 01 //  Konoha/', 'Cena  01 > Konoha']) {
    ok(normalizarCaminho(bruto) === 'Cena 01/Konoha', `"${bruto}" virou "${normalizarCaminho(bruto)}"`)
  }
  ok(normalizarCaminho('   ') === '' && normalizarCaminho(undefined) === '', 'vazio é solto')
  ok(mostrarCaminho('Cena 01/Konoha') === 'Cena 01 › Konoha', 'mostra com ›')
  ok(mostrarCaminho('') === SEM_PASTA, 'solto aparece como Sem pasta')
  ok(paraGravar('  ') === undefined && paraGravar('A > B') === 'A/B', 'grava limpo ou não grava')
}

// --- Itens antigos, com um nome só, são caminhos de um nível
{
  ok(normalizarCaminho('Konoha') === 'Konoha', 'pasta antiga continua valendo')
  ok(normalizarCaminho(' Konoha ') === 'Konoha', 'espaço em volta não cria outra pasta')
}

// --- A árvore: Cena 01 > Konoha > Sala do Hokage
interface I {
  label: string
  folder?: string
}
const it = (label: string, folder?: string): I => ({ label, folder })
const lib = [
  it('Sala do Hokage', 'Cena 01/Konoha'),
  it('Portão', 'Cena 01/Konoha'),
  it('Floresta', 'Cena 01'),
  it('Covil', 'Vilões'),
  it('Mapa solto'),
  it('Academia', 'Konoha'),
]
{
  const raiz = montarArvore(lib, (i) => i.folder, (i) => i.label)
  ok(raiz.total === lib.length, 'a raiz conta tudo')
  ok(raiz.itens.map((i) => i.label).join() === 'Mapa solto', 'soltos ficam na raiz')
  ok(raiz.subpastas.map((p) => p.nome).join() === 'Cena 01,Konoha,Vilões', `primeiro nível: ${raiz.subpastas.map((p) => p.nome)}`)
  const cena = raiz.subpastas[0]
  ok(cena.total === 3 && cena.itens.length === 1, 'Cena 01 tem 1 item direto e 3 no total')
  const konoha = cena.subpastas[0]
  ok(konoha.caminho === 'Cena 01/Konoha' && konoha.nome === 'Konoha', 'subpasta com caminho completo')
  ok(konoha.itens.map((i) => i.label).join() === 'Portão,Sala do Hokage', 'itens em ordem')
  ok(raiz.subpastas[1].caminho === 'Konoha', 'Konoha de primeiro nível é outra pasta')
  console.log('árvore:', todasAsPastas(lib.map((i) => i.folder)).map(mostrarCaminho).join(' | '))
}

// --- Lista de pastas para o "mover para": as de cima entram mesmo sem item direto
{
  const p = todasAsPastas(['A/B/C', 'A', undefined, 'Z'])
  ok(p.join(' | ') === 'A | A/B | A/B/C | Z', `ordem de árvore: ${p.join(' | ')}`)
  ok(todasAsPastas(['Cena 2', 'Cena 10', 'Cena 1']).join() === 'Cena 1,Cena 2,Cena 10', 'número em ordem de número')
}

// --- Renomear e mover pasta: troca o começo do caminho, subpastas junto
{
  ok(estaDentro('Cena 01/Konoha', 'Cena 01') && !estaDentro('Cena 010', 'Cena 01'), '"Cena 010" não está dentro de "Cena 01"')
  ok(caminhoDepoisDeMover('Cena 01/Konoha', 'Cena 01', 'Arco 1') === 'Arco 1/Konoha', 'renomear a de cima leva a subpasta')
  ok(caminhoDepoisDeMover('Cena 01', 'Cena 01', 'Arco 1') === 'Arco 1', 'e o item direto')
  ok(caminhoDepoisDeMover('Vilões', 'Cena 01', 'Arco 1') === null, 'quem está fora não muda')
  ok(caminhoDepoisDeMover('Cena 01/Konoha', 'Cena 01/Konoha', destinoDaPasta('Cena 01/Konoha', 'Arco 2')) === 'Arco 2/Konoha', 'mover pasta para dentro de outra')
  ok(caminhoDepoisDeMover('Cena 01/Konoha', 'Cena 01/Konoha', destinoDaPasta('Cena 01/Konoha', '')) === 'Konoha', 'mover para a raiz')
  ok(caminhoDepoisDeMover('Cena 01/Konoha', 'Cena 01', 'Cena 01/Konoha/Cena 01') === null, 'pasta não entra nela mesma')
  ok(caminhoDepoisDeMover('Cena 01/Konoha', 'Cena 01', '') === 'Konoha', 'desfazer a pasta sobe o conteúdo')
}

console.log('OK: checagens de pastas e subpastas passaram')
