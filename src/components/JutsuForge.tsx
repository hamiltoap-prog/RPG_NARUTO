import { useMemo, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select, Textarea } from './ui'
import { deleteCustomJutsu, saveCustomJutsu } from '../lib/store'
import { allJutsus, jutsuDocId } from '../lib/jutsuCatalog'
import { attackAttribute, readJutsu } from '../lib/jutsuCast'
import { ELEMENTS } from '../lib/jutsuAccess'
import { CONDITIONS } from '../data/conditions'
import { ATTRIBUTE_LABELS } from '../types'
import type { Clan, JutsuCatalogEntry } from '../types'

/**
 * A forja de jutsus.
 *
 * O manual traz 631 jutsus, e nenhuma mesa para aí: inventa-se técnica de clã,
 * variação de estilo, golpe de vilão. Escrever um jutsu aqui é escrever regra,
 * então é coisa do mestre — e o que sai daqui entra no catálogo da mesa pela
 * porta da frente: dá para conceder na ficha, lançar pelo cartão de ataque,
 * ensinar a um clone e ler no manual, como qualquer jutsu do livro.
 *
 * **O texto é a regra.** O app lê da descrição o modo (ataque, resistência ou
 * nada), o dado de dano, a condição e a área — a mesma leitura que usa nos
 * jutsus do manual. Por isso a tela mostra o que ENTENDEU enquanto o mestre
 * escreve: é a forma honesta de dizer "é isto que vai acontecer na mesa", e
 * evita descobrir na hora do combate que o app leu outra coisa.
 */

/** As categorias que o manual usa, que são também as que a leitura reconhece. */
const CATEGORIAS = [
  'Ninjutsu',
  'Ninjutsu - Estilo Fogo',
  'Ninjutsu - Estilo Água',
  'Ninjutsu - Estilo Terra',
  'Ninjutsu - Estilo Vento',
  'Ninjutsu - Estilo Relâmpago',
  'Genjutsu',
  'Taijutsu',
  'Bukijutsu',
  'Jutsu de Clã',
] as const

const CLASSIFICACOES = ['Ninjutsu', 'Genjutsu', 'Taijutsu', 'Bukijutsu', 'Hijutsu', 'Hijutsu, Bukijutsu'] as const
const RANKS = ['Rank-E', 'Rank-D', 'Rank-C', 'Rank-B', 'Rank-A', 'Rank-S'] as const

export function jutsuEmBranco(): JutsuCatalogEntry {
  return {
    name: '',
    classification: 'Ninjutsu',
    rank: 'Rank-D',
    castingTime: '1 Ação',
    range: '9 metros',
    duration: 'Instantâneo',
    components: 'HS',
    cost: '3 Chakras',
    keywords: '',
    description: '',
    category: 'Ninjutsu',
  }
}

export function JutsuForge({
  tableId,
  custom,
  clans,
}: {
  tableId: string
  custom: JutsuCatalogEntry[]
  clans: Clan[]
}) {
  const [rascunho, setRascunho] = useState<JutsuCatalogEntry | null>(null)
  /** O id do documento de onde o rascunho veio — para renomear sem duplicar. */
  const [idOriginal, setIdOriginal] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  const [busca, setBusca] = useState('')

  const set = <K extends keyof JutsuCatalogEntry>(k: K, v: JutsuCatalogEntry[K]) =>
    setRascunho((p) => (p ? { ...p, [k]: v } : p))

  /** O que o app entendeu do texto — a mesma leitura que vale no combate. */
  const lido = useMemo(() => (rascunho ? readJutsu(rascunho) : null), [rascunho])

  const nomeJaExiste = useMemo(() => {
    if (!rascunho?.name.trim()) return false
    const novoId = jutsuDocId(rascunho.name)
    if (idOriginal && novoId === idOriginal) return false
    const chave = (n: string) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase()
    return allJutsus().some((j) => chave(j.name) === chave(rascunho.name))
  }, [rascunho, idOriginal])

  const listados = useMemo(() => {
    const t = busca.trim().toLowerCase()
    const ordenados = [...custom].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    return t ? ordenados.filter((j) => j.name.toLowerCase().includes(t)) : ordenados
  }, [custom, busca])

  async function gravar() {
    if (!rascunho?.name.trim()) return
    const limpo: JutsuCatalogEntry = {
      ...rascunho,
      name: rascunho.name.trim().toUpperCase(),
      clanId: rascunho.category === 'Jutsu de Clã' ? rascunho.clanId : undefined,
    }
    await saveCustomJutsu(tableId, limpo, idOriginal ?? undefined)
    setAviso(`"${limpo.name}" está no catálogo da mesa.`)
    window.setTimeout(() => setAviso(''), 4000)
    setRascunho(null)
    setIdOriginal(null)
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Jutsus da casa ({custom.length})</SectionTitle>
        <div className="flex items-center gap-2">
          {custom.length > 3 && (
            <Input placeholder="procurar" value={busca} onChange={(e) => setBusca(e.target.value)} className="w-36 text-xs" />
          )}
          <Button
            variant="primary"
            onClick={() => {
              setRascunho(jutsuEmBranco())
              setIdOriginal(null)
            }}
          >
            + Escrever jutsu
          </Button>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-orange-300/60">
        O que você escreve aqui entra no catálogo da mesa: dá para conceder na ficha, lançar pelo cartão de ataque e ler
        no manual, como qualquer jutsu do livro. Um jutsu da casa com o mesmo nome de um do manual{' '}
        <b className="text-orange-200">substitui</b> o do manual — é assim que se corrige um texto sem mexer no livro.
      </p>
      {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}

      {/* Os que a mesa já tem */}
      <div className="flex flex-col gap-1.5">
        {listados.map((j) => {
          const l = readJutsu(j)
          return (
            <div key={j.name} className="well flex min-w-0 flex-wrap items-center gap-2 rounded-sm p-2 text-xs">
              <span className="min-w-0 flex-1 break-words">
                <b className="text-orange-100">{j.name}</b>
                <span className="text-orange-400/60">
                  {' '}
                  · {j.rank} · {j.category}
                  {j.cost ? ` · ${j.cost}` : ''}
                </span>
              </span>
              <span className="shrink-0 text-[11px] text-orange-400/50">
                {l.mode === 'attack' ? 'ataque' : l.mode === 'save' ? 'resistência' : 'sem rolagem'}
                {l.damage ? ` · ${l.damage}` : ''}
                {l.conditions.length ? ` · ${l.conditions.join(', ')}` : ''}
              </span>
              <span className="flex shrink-0 gap-1">
                <Button
                  variant="secondary"
                  className="px-2 py-0.5 text-[11px]"
                  onClick={() => {
                    setRascunho({ ...j })
                    setIdOriginal(jutsuDocId(j.name))
                  }}
                >
                  editar
                </Button>
                <Button
                  variant="ghost"
                  className="px-2 py-0.5 text-[11px]"
                  onClick={() => {
                    // Copiar para variar sem reescrever: o nome sai marcado
                    // para não colidir com o original.
                    setRascunho({ ...j, name: `${j.name} (CÓPIA)` })
                    setIdOriginal(null)
                  }}
                >
                  copiar
                </Button>
                <button
                  className="text-[11px] text-red-400 hover:text-red-200"
                  title="Tira do catálogo da mesa. Quem já tem o jutsu na ficha fica com o nome, mas sem o texto."
                  onClick={() => deleteCustomJutsu(tableId, jutsuDocId(j.name))}
                >
                  remover
                </button>
              </span>
            </div>
          )
        })}
        {custom.length === 0 && (
          <p className="text-xs text-orange-300/50">
            Nenhum jutsu da casa ainda. O catálogo do manual continua inteiro à disposição.
          </p>
        )}
      </div>

      {/* A bancada */}
      {rascunho && (
        <div className="flex flex-col gap-3 border-t border-[color:var(--line)] pt-3">
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex min-w-0 flex-[2] flex-col gap-1 text-xs text-orange-400/60">
              nome
              <Input
                value={rascunho.name}
                placeholder="ESTILO FOGO: PALMA DA FORNALHA"
                onChange={(e) => set('name', e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              rank
              <Select value={rascunho.rank} onChange={(e) => set('rank', e.target.value)} className="w-32">
                {RANKS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              custo
              <Input value={rascunho.cost} placeholder="3 Chakras" onChange={(e) => set('cost', e.target.value)} className="w-28" />
            </label>
          </div>

          {nomeJaExiste && (
            <p className="text-[11px] text-amber-300">
              Já existe um jutsu com este nome no catálogo. Gravar assim vai <b>substituir</b> o que está lá — é o nome
              que liga o jutsu às fichas, então dois com o mesmo nome não podem conviver.
            </p>
          )}

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-orange-400/60">
              categoria (decide a afinidade exigida)
              <Select value={rascunho.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              classificação (decide o atributo)
              <Select value={rascunho.classification} onChange={(e) => set('classification', e.target.value)} className="w-44">
                {CLASSIFICACOES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </label>
            {rascunho.category === 'Jutsu de Clã' && (
              <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                clã dono
                <Select value={rascunho.clanId ?? ''} onChange={(e) => set('clanId', e.target.value || undefined)} className="w-40">
                  <option value="">qualquer um</option>
                  {clans.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </label>
            )}
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              execução
              <Input value={rascunho.castingTime} placeholder="1 Ação" onChange={(e) => set('castingTime', e.target.value)} className="w-32" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              alcance
              <Input value={rascunho.range} placeholder="9 metros" onChange={(e) => set('range', e.target.value)} className="w-32" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              duração
              <Input value={rascunho.duration} placeholder="Instantâneo" onChange={(e) => set('duration', e.target.value)} className="w-36" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              componentes
              <Input value={rascunho.components} placeholder="HS, CM" onChange={(e) => set('components', e.target.value)} className="w-28" />
            </label>
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-orange-400/60">
              palavras-chave
              <Input value={rascunho.keywords} placeholder="Ninjutsu, Fogo" onChange={(e) => set('keywords', e.target.value)} />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            descrição — é ela que vira regra
            <Textarea
              rows={6}
              value={rascunho.description}
              placeholder="Faça um ataque de ninjutsu contra uma criatura a até 9 metros. Em um acerto, ela sofre 3d6 de dano de fogo e fica Queimado por 2 rodadas."
              onChange={(e) => set('description', e.target.value)}
            />
          </label>

          {lido && <LeituraDoApp lido={lido} classification={rascunho.classification} />}

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="primary" disabled={!rascunho.name.trim() || !rascunho.description.trim()} onClick={gravar}>
              Gravar no catálogo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setRascunho(null)
                setIdOriginal(null)
              }}
            >
              cancelar
            </Button>
            {!rascunho.description.trim() && (
              <span className="text-[11px] text-orange-400/50">Sem descrição não há regra: o app não teria o que ler.</span>
            )}
          </div>
        </div>
      )}
    </Card>
  )
}

/**
 * O que o app entendeu da descrição.
 *
 * Mostrar isto enquanto o mestre escreve é o que separa "escrevi um jutsu" de
 * "escrevi um jutsu que a mesa vai resolver do jeito que eu quis". A leitura
 * aqui é a MESMA que roda no combate — não é uma prévia aproximada.
 */
function LeituraDoApp({ lido, classification }: { lido: ReturnType<typeof readJutsu>; classification: string }) {
  const nada = lido.mode === 'none' && !lido.damage && lido.conditions.length === 0 && !lido.healing
  return (
    <div className="well flex flex-col gap-1.5 rounded-sm p-3">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">O que o app leu do texto</p>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <Badge tone={lido.mode === 'none' ? 'default' : 'warn'}>
          {lido.mode === 'attack'
            ? `ataque por ${ATTRIBUTE_LABELS[attackAttribute(classification)]}`
            : lido.mode === 'save'
              ? `resistência de ${ATTRIBUTE_LABELS[lido.saveAttribute ?? 'constitution']}`
              : 'sem rolagem'}
        </Badge>
        {lido.damage && (
          <Badge tone="bad">
            {lido.damage} de dano{lido.damageType ? ` ${lido.damageType}` : ''}
          </Badge>
        )}
        {lido.healing && <Badge tone="good">cura {lido.healing}</Badge>}
        {lido.conditions.map((c) => (
          <Badge key={c} tone="warn">
            {c}
            {lido.conditionRounds ? ` ${lido.conditionRounds}r` : ''}
          </Badge>
        ))}
        {lido.area && <Badge>área: {lido.area}</Badge>}
        {lido.cost > 0 && <Badge>{lido.cost} chakra</Badge>}
      </div>
      {nada && (
        <p className="text-[11px] leading-relaxed text-amber-300/80">
          O app não achou dano, condição nem rolagem neste texto — o jutsu vai funcionar como efeito narrado, e a mesa
          resolve na mão. Para ele resolver sozinho, escreva como o manual escreve: "faça um{' '}
          <i>ataque de ninjutsu</i>", "<i>teste de resistência de Constituição</i>", "<i>3d6 de dano de fogo</i>", "fica{' '}
          <i>{CONDITIONS[3]?.name ?? 'Cego'}</i> por 2 rodadas", "em um <i>raio de 6 metros</i>".
        </p>
      )}
      {!nada && (
        <p className="text-[11px] text-orange-400/50">
          É esta leitura que vai valer no combate. Quem lança ainda pode ajustar antes de rolar.
        </p>
      )}
      {lido.conditions.length === 0 && !nada && (
        <p className="text-[11px] text-orange-400/40">
          Nenhuma condição lida. Se o jutsu impõe uma, quem lança pode marcar na hora — ou escreva "fica {ELEMENTS[0] ? 'Cego' : 'Cego'} por N rodadas".
        </p>
      )}
    </div>
  )
}
