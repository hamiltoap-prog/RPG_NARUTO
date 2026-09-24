import { JUTSU_CATALOG } from '../../data/jutsus'
import { abrirCatalogo, allJutsus, ehDaCasa, fecharCatalogo, jutsuDocId, mergeJutsus, setTableJutsus, tableJutsus } from '../jutsuCatalog'
import { findCatalogEntry, readJutsu } from '../jutsuCast'
import type { JutsuCatalogEntry } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

function daCasa(name: string, extra: Partial<JutsuCatalogEntry> = {}): JutsuCatalogEntry {
  return {
    name,
    classification: 'Ninjutsu',
    rank: 'Rank-C',
    castingTime: '1 Ação',
    range: '9 metros',
    duration: 'Instantâneo',
    components: 'HS',
    cost: '5 Chakras',
    keywords: '',
    description: 'Faça um ataque de ninjutsu. Em um acerto, a criatura sofre 4d6 de dano de fogo.',
    category: 'Ninjutsu',
    ...extra,
  }
}

// --- A junção: o da casa entra, e com o mesmo nome SUBSTITUI o do manual
{
  const base = JUTSU_CATALOG.slice(0, 5)
  const novo = daCasa('PALMA DA FORNALHA')
  ok(mergeJutsus(base, [novo]).length === base.length + 1, 'jutsu novo entra na lista')

  const substituto = daCasa(base[0].name, { description: 'Texto corrigido pela mesa.' })
  const juntos = mergeJutsus(base, [substituto])
  ok(juntos.length === base.length, 'mesmo nome não cria uma segunda entrada')
  ok(juntos[0].description === 'Texto corrigido pela mesa.', 'o texto da casa prevalece sobre o do manual')

  // Acento e caixa não criam duas entradas.
  const semAcento = daCasa(base[0].name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase())
  ok(mergeJutsus(base, [semAcento]).length === base.length, 'nome igual a menos de acento/caixa é o mesmo jutsu')

  ok(mergeJutsus(base, []).length === base.length, 'sem jutsus da casa, a lista é a do manual')
}

// --- O registro da mesa: o que o resto do app enxerga
{
  setTableJutsus([])
  ok(allJutsus().length === JUTSU_CATALOG.length, 'sem mesa carregada, vale só o manual')
  ok(findCatalogEntry('PALMA DA FORNALHA') === undefined, 'jutsu da casa não existe antes de a mesa carregar')

  setTableJutsus([daCasa('PALMA DA FORNALHA')])
  ok(allJutsus().length === JUTSU_CATALOG.length + 1, 'o jutsu da casa entra no catálogo')
  ok(tableJutsus().length === 1, 'e fica listado como da casa')
  ok(ehDaCasa('PALMA DA FORNALHA'), 'a tela consegue marcar que ele é da casa')
  ok(!ehDaCasa(JUTSU_CATALOG[0].name), 'jutsu do manual não é da casa')

  // O caminho que importa: quem lança acha o jutsu e a leitura funciona nele.
  const achado = findCatalogEntry('palma da fornalha')
  ok(achado !== undefined, 'findCatalogEntry acha o jutsu da casa, sem ligar para a caixa')
  const lido = readJutsu(achado!)
  ok(lido.mode === 'attack', `o jutsu da casa resolve como ataque, veio ${lido.mode}`)
  ok(lido.damage === '4d6', `e com o dado que o mestre escreveu, veio ${lido.damage}`)
  ok(lido.cost === 5, `e o custo lido do campo, veio ${lido.cost}`)

  // Corrigir um jutsu do manual pela mesa vale para quem lança.
  const original = JUTSU_CATALOG.find((j) => readJutsu(j).damage)!
  setTableJutsus([daCasa(original.name, { description: 'O alvo sofre 9d9 de dano cortante.' })])
  ok(readJutsu(findCatalogEntry(original.name)!).damage === '9d9', 'a correção da mesa vale na hora de lançar')

  setTableJutsus([])
  ok(findCatalogEntry('PALMA DA FORNALHA') === undefined, 'ao sair da mesa, o catálogo dela sai junto')
}

// --- O id do documento vem do nome, e nomes parecidos não colidem
{
  ok(jutsuDocId('ESTILO FOGO: PALMA DA FORNALHA') === 'estilo-fogo-palma-da-fornalha', `veio ${jutsuDocId('ESTILO FOGO: PALMA DA FORNALHA')}`)
  ok(jutsuDocId('Técnica do Clone') === jutsuDocId('TECNICA DO CLONE'), 'acento e caixa dão o mesmo id')
  ok(jutsuDocId('  espaços  em  volta  ') === 'espacos-em-volta', 'espaços viram traço, sem sobrar nas pontas')
  ok(jutsuDocId('!!!') === 'jutsu', 'nome sem letra nenhuma ainda produz um id válido')
  ok(jutsuDocId('Fogo A') !== jutsuDocId('Fogo B'), 'nomes diferentes não colidem')
}

// --- Duas telas acompanhando: fechar uma não pode apagar o catálogo da outra
//
// O painel do mestre e a ficha que ele abre POR DENTRO dele assinam os dois.
// Sem contagem, fechar a ficha esvaziava o catálogo e os jutsus da casa
// sumiam da tela do painel — e o listen do Firestore, que só dispara quando o
// dado muda, nunca os repunha.
{
  abrirCatalogo()
  setTableJutsus([daCasa('PALMA DA FORNALHA')])
  abrirCatalogo() // a ficha abriu por dentro do painel
  ok(allJutsus().length === JUTSU_CATALOG.length + 1, 'com as duas telas abertas o catálogo está cheio')

  fecharCatalogo() // a ficha fechou; o painel continua aberto
  ok(findCatalogEntry('PALMA DA FORNALHA') !== undefined, 'fechar uma tela não apaga o catálogo da outra')

  fecharCatalogo() // saiu da mesa
  ok(findCatalogEntry('PALMA DA FORNALHA') === undefined, 'ao sair da última tela, o catálogo da mesa sai junto')

  // Fechar mais vezes do que abriu não deixa a contagem negativa.
  fecharCatalogo()
  fecharCatalogo()
  abrirCatalogo()
  setTableJutsus([daCasa('OUTRO JUTSU')])
  ok(findCatalogEntry('OUTRO JUTSU') !== undefined, 'a contagem não fica negativa e a mesa seguinte carrega')
  fecharCatalogo()
  ok(allJutsus().length === JUTSU_CATALOG.length, 'e sai limpo de novo')
}

console.log(`catálogo da mesa: ${JUTSU_CATALOG.length} do manual + os da casa, com substituição por nome`)
console.log('OK: checagens do catálogo de jutsus passaram')
