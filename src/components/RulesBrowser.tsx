import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import { Badge, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { JUTSU_CATALOG } from '../data/jutsus'
import { RANKS, jutsuElement, normalizeRank } from '../lib/jutsuAccess'
import type { JutsuCatalogEntry } from '../types'

/**
 * Referência das regras dentro do app.
 *
 * Os capítulos são carregados sob demanda, um arquivo por vez: juntos passam
 * de 180 KB, e ninguém deve baixar o manual inteiro para abrir uma ficha. O
 * `import.meta.glob` devolve carregadores preguiçosos, então cada capítulo
 * vira um pedaço próprio que só desce quando alguém o abre.
 *
 * Os 631 jutsus ficam de fora disso: eles já existem como dado estruturado
 * (src/data/jutsus.ts), e uma busca com filtro serve muito melhor que 470 KB
 * de texto corrido.
 */
const CAPITULOS = import.meta.glob(
  // A lista de jutsus fica FORA do glob, não só escondida da navegação: ela
  // sozinha tem 475 KB, e entrar no glob geraria esse arquivo no deploy
  // mesmo sem ninguém abrir. A busca de jutsus usa o dado estruturado.
  ['../../docs/rules/*.md', '!../../docs/rules/04-jutsus.md'],
  { query: '?raw', import: 'default' },
) as Record<string, () => Promise<string>>

/**
 * Título de cada capítulo. Vem de uma tabela, e não do nome do arquivo: os
 * arquivos são ASCII (`08-pericias.md`) e virariam "Pericias" sem acento na
 * tela.
 */
const TITULOS: Record<string, string> = {
  '00-observacoes': 'Observações',
  '01-atributos': 'Atributos',
  '02-clas': 'Clãs',
  '03-classes': 'Classes',
  '04b-invocacoes': 'Invocações',
  '05-combate': 'Combate',
  '06-progressao': 'Progressão',
  '07-equipamentos': 'Equipamentos',
  '08-pericias': 'Perícias',
  '09-outras-mecanicas': 'Outras mecânicas',
}

function tituloDoArquivo(caminho: string) {
  const base = caminho.split('/').pop()!.replace('.md', '')
  const semNumero = base.replace(/^\d+[a-z]?-/, '').replace(/-/g, ' ')
  return { id: base, titulo: TITULOS[base] ?? semNumero.charAt(0).toUpperCase() + semNumero.slice(1) }
}

const SECOES = Object.keys(CAPITULOS)
  .sort()
  .map((caminho) => ({ caminho, ...tituloDoArquivo(caminho) }))
  // "Observações" é nota de bastidor sobre a transcrição do manual, não
  // regra de jogo: vai para o fim da lista.
  .sort((a, b) => Number(a.id.startsWith('00')) - Number(b.id.startsWith('00')))

type Aba = 'capitulos' | 'jutsus'

export function RulesBrowser() {
  const [aba, setAba] = useState<Aba>('capitulos')

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-wrap items-center justify-between gap-2 p-4">
        <SectionTitle>Regras</SectionTitle>
        <div className="flex gap-1.5">
          <TabChip active={aba === 'capitulos'} className="px-2.5 py-1 text-xs" onClick={() => setAba('capitulos')}>
            Capítulos
          </TabChip>
          <TabChip active={aba === 'jutsus'} className="px-2.5 py-1 text-xs" onClick={() => setAba('jutsus')}>
            Jutsus ({JUTSU_CATALOG.length})
          </TabChip>
        </div>
      </Card>
      {aba === 'capitulos' ? <Capitulos /> : <BuscaJutsus />}
    </div>
  )
}

function Capitulos() {
  const [aberto, setAberto] = useState(SECOES[0]?.caminho ?? '')
  const [texto, setTexto] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    const carregar = CAPITULOS[aberto]
    if (!carregar) return
    setCarregando(true)
    let vivo = true
    carregar()
      .then((md) => {
        if (vivo) setTexto(md)
      })
      .finally(() => {
        if (vivo) setCarregando(false)
      })
    return () => {
      vivo = false
    }
  }, [aberto])

  // O conteúdo é nosso, vem dos arquivos do próprio projeto — não há entrada
  // de usuário aqui, então renderizar o HTML do markdown é seguro.
  const html = useMemo(() => (texto ? (marked.parse(texto, { async: false }) as string) : ''), [texto])

  return (
    <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[220px_1fr] lg:items-start">
      <Card className="flex flex-col gap-1 p-2">
        {SECOES.map((s) => (
          <button
            key={s.caminho}
            onClick={() => setAberto(s.caminho)}
            className={`rounded-sm px-2.5 py-1.5 text-left font-display text-xs uppercase tracking-[0.08em] transition ${
              aberto === s.caminho
                ? 'bg-[color:var(--orange)] text-[color:var(--orange-ink)]'
                : 'text-orange-300/60 hover:bg-[color:var(--surface-card-hover)] hover:text-white'
            }`}
          >
            {s.titulo}
          </button>
        ))}
      </Card>
      <Card className="p-4">
        {carregando ? (
          <p className="text-sm text-orange-300/60">Abrindo o capítulo...</p>
        ) : (
          <div className="regras" dangerouslySetInnerHTML={{ __html: html }} />
        )}
      </Card>
    </div>
  )
}

function BuscaJutsus() {
  const [busca, setBusca] = useState('')
  const [rank, setRank] = useState('')
  const [categoria, setCategoria] = useState('')
  const [aberto, setAberto] = useState<string | null>(null)

  const categorias = useMemo(() => [...new Set(JUTSU_CATALOG.map((j) => j.category))].sort(), [])

  const achados = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return JUTSU_CATALOG.filter((j) => {
      if (rank && normalizeRank(j.rank) !== rank) return false
      if (categoria && j.category !== categoria) return false
      if (!t) return true
      return j.name.toLowerCase().includes(t) || j.description.toLowerCase().includes(t) || j.keywords.toLowerCase().includes(t)
    }).slice(0, 120)
  }, [busca, rank, categoria])

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-wrap items-end gap-2 p-3">
        <Input
          placeholder="Buscar por nome, descrição ou palavra-chave..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="min-w-56 flex-1"
        />
        <Select value={rank} onChange={(e) => setRank(e.target.value)} className="w-32">
          <option value="">Todo rank</option>
          {RANKS.map((r) => (
            <option key={r} value={r}>
              Rank {r}
            </option>
          ))}
        </Select>
        <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-56">
          <option value="">Toda categoria</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Card>

      <p className="text-xs text-orange-400/60">
        {achados.length === 120 ? 'Mostrando os 120 primeiros — refine a busca.' : `${achados.length} jutsu(s).`}
      </p>

      <div className="flex flex-col gap-1.5">
        {achados.map((j) => (
          <JutsuLinha key={j.name + j.rank} j={j} aberto={aberto === j.name} onToggle={() => setAberto(aberto === j.name ? null : j.name)} />
        ))}
      </div>
    </div>
  )
}

function JutsuLinha({ j, aberto, onToggle }: { j: JutsuCatalogEntry; aberto: boolean; onToggle: () => void }) {
  const el = jutsuElement(j)
  return (
    <Card className="p-3">
      <button onClick={onToggle} className="flex w-full flex-wrap items-center gap-2 text-left">
        <span className="font-display text-sm uppercase tracking-[0.06em] text-white">{j.name}</span>
        <Badge>Rank {normalizeRank(j.rank)}</Badge>
        {el && <Badge tone="warn">{el}</Badge>}
        {j.clanId && <Badge tone="bad">clã {j.clanId}</Badge>}
        <span className="ml-auto text-xs text-orange-400/60">
          {j.cost} · {j.castingTime}
        </span>
      </button>
      {aberto && (
        <div className="mt-2 flex flex-col gap-1 border-t border-[color:var(--line)] pt-2 text-xs text-orange-300/70">
          <p>
            <b className="text-orange-200">{j.classification}</b> · alcance {j.range} · duração {j.duration} · componentes{' '}
            {j.components}
          </p>
          {j.keywords && <p className="text-orange-400/60">{j.keywords}</p>}
          <p className="whitespace-pre-line leading-relaxed">{j.description}</p>
        </div>
      )}
    </Card>
  )
}
