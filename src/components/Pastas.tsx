import { useState, type ReactNode } from 'react'
import { Button, Input, Select } from './ui'
import {
  SEM_PASTA,
  destinoDaPasta,
  estaDentro,
  montarArvore,
  mostrarCaminho,
  normalizarCaminho,
  pastaDeCima,
  type NoDaPasta,
} from '../lib/pastas'

/**
 * A árvore de pastas e o seletor "mover para", usados pela biblioteca de
 * cenas, pelos NPCs, pelo bestiário e pelas histórias.
 *
 * Pasta não é documento (ver `lib/pastas.ts`): criar uma subpasta é mover um
 * item para um caminho novo — "Cena 01 > Konoha" — e ela passa a existir.
 */

function lerAbertas(chave: string | undefined): Record<string, boolean> {
  if (!chave) return {}
  try {
    return JSON.parse(window.localStorage.getItem(chave) ?? '{}') as Record<string, boolean>
  } catch {
    return {}
  }
}

function gravarAbertas(chave: string | undefined, v: Record<string, boolean>) {
  if (!chave) return
  try {
    window.localStorage.setItem(chave, JSON.stringify(v))
  } catch {
    // Armazenamento bloqueado: a árvore só não lembra o que estava fechado.
  }
}

/** Pede o caminho de uma pasta nova, já começando pela pasta de agora. */
export function pedirPastaNova(atual?: string): string | null {
  const sugestao = atual ? `${mostrarCaminho(atual)} › ` : ''
  const resposta = window.prompt('Nome da pasta. Para subpasta, separe com ">" — ex.: Cena 01 > Konoha', sugestao)
  if (resposta === null) return null
  return normalizarCaminho(resposta)
}

/** "Mover para": todas as pastas pelo caminho inteiro, mais "nova pasta". */
export function SelectDePasta({
  valor,
  pastas,
  onMudar,
  className = 'w-36',
  title = 'Mover para outra pasta',
}: {
  valor: string | undefined
  pastas: readonly string[]
  onMudar: (caminho: string | undefined) => void
  className?: string
  title?: string
}) {
  const atual = normalizarCaminho(valor)
  return (
    <Select
      value={atual}
      className={`px-2 py-0.5 text-[11px] ${className}`}
      title={title}
      data-mover-pasta
      onChange={(e) => {
        const v = e.target.value
        if (v === '__nova__') {
          const nova = pedirPastaNova(atual)
          if (nova !== null) onMudar(nova || undefined)
          return
        }
        onMudar(v || undefined)
      }}
    >
      <option value="">{SEM_PASTA}</option>
      {pastas.map((p) => (
        <option key={p} value={p}>
          {mostrarCaminho(p)}
        </option>
      ))}
      <option value="__nova__">+ nova pasta...</option>
    </Select>
  )
}

export function ArvoreDePastas<T>({
  itens,
  pastaDe,
  rotulo,
  chave,
  renderItem,
  onMoverPasta,
  pastas,
  lembrarAbertasEm,
  classeDosItens = 'flex flex-wrap gap-2',
}: {
  itens: readonly T[]
  pastaDe: (item: T) => string | undefined
  rotulo: (item: T) => string
  chave: (item: T) => string
  renderItem: (item: T) => ReactNode
  /** Renomear e mover pasta são a mesma coisa: trocar o começo do caminho. */
  onMoverPasta: (de: string, para: string) => Promise<void> | void
  /** Todas as pastas (para o "mover para" das pastas). */
  pastas: readonly string[]
  /** Chave no navegador para lembrar quais pastas estavam fechadas. */
  lembrarAbertasEm?: string
  classeDosItens?: string
}) {
  const raiz = montarArvore(itens, pastaDe, rotulo)
  const [fechadas, setFechadas] = useState<Record<string, boolean>>(() => lerAbertas(lembrarAbertasEm))

  function alternar(caminho: string) {
    setFechadas((f) => {
      const v = { ...f, [caminho]: !f[caminho] }
      gravarAbertas(lembrarAbertasEm, v)
      return v
    })
  }

  return (
    <div className="flex flex-col gap-2" data-arvore-de-pastas>
      {raiz.subpastas.map((p) => (
        <Pasta
          key={p.caminho}
          no={p}
          nivel={0}
          fechadas={fechadas}
          alternar={alternar}
          renderItem={renderItem}
          chave={chave}
          onMoverPasta={onMoverPasta}
          pastas={pastas}
          classeDosItens={classeDosItens}
        />
      ))}
      {raiz.itens.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {raiz.subpastas.length > 0 && (
            <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/50">
              {SEM_PASTA} ({raiz.itens.length})
            </p>
          )}
          <div className={classeDosItens}>
            {raiz.itens.map((i) => (
              <div key={chave(i)} className="contents">
                {renderItem(i)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function Pasta<T>({
  no,
  nivel,
  fechadas,
  alternar,
  renderItem,
  chave,
  onMoverPasta,
  pastas,
  classeDosItens,
}: {
  no: NoDaPasta<T>
  nivel: number
  fechadas: Record<string, boolean>
  alternar: (caminho: string) => void
  renderItem: (item: T) => ReactNode
  chave: (item: T) => string
  onMoverPasta: (de: string, para: string) => Promise<void> | void
  pastas: readonly string[]
  classeDosItens: string
}) {
  const aberta = !fechadas[no.caminho]
  const [renomeando, setRenomeando] = useState(false)
  const [nome, setNome] = useState(no.nome)
  const [movendo, setMovendo] = useState(false)
  // Destinos possíveis: qualquer pasta que não seja ela mesma nem uma de dentro dela.
  const destinos = pastas.filter((p) => !estaDentro(p, no.caminho) && p !== pastaDeCima(no.caminho))

  return (
    <div className={`flex flex-col gap-1.5 ${nivel > 0 ? 'border-l border-[color:var(--line)] pl-3' : ''}`} data-pasta={no.caminho}>
      <div className="flex flex-wrap items-center gap-2 border-b border-[color:var(--line)] pb-1">
        <button
          className="flex items-center gap-1.5 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/80 hover:text-[color:var(--orange)]"
          onClick={() => alternar(no.caminho)}
        >
          {aberta ? '▾' : '▸'} 📁 {no.nome} ({no.total})
        </button>
        {renomeando ? (
          <span className="flex items-center gap-1">
            <Input value={nome} className="w-36 px-2 py-0.5 text-[11px]" onChange={(e) => setNome(e.target.value)} />
            <Button
              variant="primary"
              className="px-2 py-0.5 text-[11px]"
              onClick={async () => {
                const limpo = normalizarCaminho(nome).replace(/\//g, ' ')
                if (limpo && limpo !== no.nome) {
                  await onMoverPasta(no.caminho, [pastaDeCima(no.caminho), limpo].filter(Boolean).join('/'))
                }
                setRenomeando(false)
              }}
            >
              ok
            </Button>
            <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => setRenomeando(false)}>
              x
            </Button>
          </span>
        ) : movendo ? (
          <span className="flex items-center gap-1">
            <Select
              defaultValue="__"
              className="w-44 px-2 py-0.5 text-[11px]"
              onChange={async (e) => {
                const v = e.target.value
                if (v === '__') return
                await onMoverPasta(no.caminho, destinoDaPasta(no.caminho, v === '__raiz__' ? '' : v))
                setMovendo(false)
              }}
            >
              <option value="__">mover para dentro de...</option>
              {pastaDeCima(no.caminho) && <option value="__raiz__">(primeiro nível)</option>}
              {destinos.map((p) => (
                <option key={p} value={p}>
                  {mostrarCaminho(p)}
                </option>
              ))}
            </Select>
            <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => setMovendo(false)}>
              x
            </Button>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <button
              className="text-[11px] text-orange-400/50 hover:text-[color:var(--orange)]"
              onClick={() => {
                setNome(no.nome)
                setRenomeando(true)
              }}
            >
              renomear
            </button>
            <button className="text-[11px] text-orange-400/50 hover:text-[color:var(--orange)]" onClick={() => setMovendo(true)}>
              mover pasta
            </button>
          </span>
        )}
      </div>
      {aberta && (
        <>
          {no.subpastas.map((s) => (
            <Pasta
              key={s.caminho}
              no={s}
              nivel={nivel + 1}
              fechadas={fechadas}
              alternar={alternar}
              renderItem={renderItem}
              chave={chave}
              onMoverPasta={onMoverPasta}
              pastas={pastas}
              classeDosItens={classeDosItens}
            />
          ))}
          {no.itens.length > 0 && (
            <div className={classeDosItens}>
              {no.itens.map((i) => (
                <div key={chave(i)} className="contents">
                  {renderItem(i)}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
