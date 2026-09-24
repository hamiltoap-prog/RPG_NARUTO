import { useState } from 'react'
import { Badge, Button, Input, Select } from './ui'
import { allJutsus, ehDaCasa } from '../lib/jutsuCatalog'
import type { JutsuCatalogEntry } from '../types'

/**
 * Escolher um jutsu do catálogo — 631 entradas, sem garimpo.
 *
 * O que não funciona: jogar os 631 num `<select>` e cortar os primeiros N. O
 * arquivo do manual começa por 86 jutsus de CLÃ, então um corte alfabético
 * pela ordem do arquivo entregava exatamente a lista que menos interessa a
 * quem está montando uma criatura — bicho não é Aburame.
 *
 * O que funciona: busca por nome, filtro por categoria e por rank, e **jutsu
 * de clã escondido por padrão**, com uma chave para quem realmente quer (o
 * NPC herdeiro de um clã existe, é só não ser o caso comum).
 */
export function EscolherJutsu({
  jaTem,
  onEscolher,
  rotuloBotao = 'adicionar',
}: {
  /** Nomes que já estão na ficha, para não aparecerem de novo. */
  jaTem: readonly string[]
  onEscolher: (entrada: JutsuCatalogEntry) => void
  rotuloBotao?: string
}) {
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [rank, setRank] = useState('')
  const [comCla, setComCla] = useState(false)
  const [escolhido, setEscolhido] = useState('')

  const todos = allJutsus()
  const categorias = [...new Set(todos.map((j) => j.category))].sort((a, b) => a.localeCompare(b, 'pt'))
  const ranks = [...new Set(todos.map((j) => j.rank.replace('Rank ', 'Rank-')))].sort()

  const t = busca.trim().toLowerCase()
  const achados = todos
    .filter((j) => !jaTem.includes(j.name))
    // Criatura não tem clã: o jutsu de clã só entra se alguém pedir.
    .filter((j) => comCla || j.category !== 'Jutsu de Clã')
    .filter((j) => !categoria || j.category === categoria)
    .filter((j) => !rank || j.rank.replace('Rank ', 'Rank-') === rank)
    .filter((j) => !t || j.name.toLowerCase().includes(t) || j.description.toLowerCase().includes(t))

  // Os da casa primeiro: são os que a mesa escreveu e os que ela procura.
  const ordenados = [
    ...achados.filter((j) => ehDaCasa(j.name)),
    ...achados.filter((j) => !ehDaCasa(j.name)).sort((a, b) => a.name.localeCompare(b.name, 'pt')),
  ]
  const mostrados = ordenados.slice(0, 60)

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-end gap-1.5">
        <Input
          placeholder="procurar por nome ou efeito"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="min-w-0 flex-1 px-2 py-0.5 text-xs"
        />
        <Select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-44 px-2 py-0.5 text-xs">
          <option value="">toda categoria</option>
          {categorias
            .filter((c) => comCla || c !== 'Jutsu de Clã')
            .map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
        </Select>
        <Select value={rank} onChange={(e) => setRank(e.target.value)} className="w-28 px-2 py-0.5 text-xs">
          <option value="">todo rank</option>
          {ranks.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
        <label
          className="flex items-center gap-1.5 pb-1 text-[11px] text-orange-200"
          title="Jutsu de clã é de quem nasceu no clã. Uma criatura não tem clã, então eles ficam de fora até alguém pedir."
        >
          <input type="checkbox" checked={comCla} onChange={(e) => setComCla(e.target.checked)} />
          incluir jutsu de clã
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-1.5">
        <Select value={escolhido} onChange={(e) => setEscolhido(e.target.value)} className="min-w-0 flex-1 px-2 py-0.5 text-xs">
          <option value="">
            {achados.length === 0 ? 'Nada com esses filtros' : `Escolha entre ${achados.length} jutsu(s)...`}
          </option>
          {mostrados.map((j) => (
            <option key={j.name} value={j.name}>
              {ehDaCasa(j.name) ? '★ ' : ''}
              {j.name} · {j.rank} · {j.category}
              {j.cost ? ` · ${j.cost}` : ''}
            </option>
          ))}
        </Select>
        <Button
          variant="secondary"
          className="px-2 py-0.5 text-[11px]"
          disabled={!escolhido}
          onClick={() => {
            const j = todos.find((x) => x.name === escolhido)
            if (!j) return
            onEscolher(j)
            setEscolhido('')
          }}
        >
          {rotuloBotao}
        </Button>
        {achados.length > mostrados.length && (
          <Badge tone="warn">
            mostrando {mostrados.length} de {achados.length} — refine a busca
          </Badge>
        )}
      </div>
    </div>
  )
}
