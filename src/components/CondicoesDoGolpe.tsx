import { Badge, Input, Select } from './ui'
import { CONDITIONS } from '../data/conditions'
import { efeitoDaCondicao } from '../lib/conditions'

/**
 * As condições que o golpe impõe, e quem mais está na área.
 *
 * O manual escreve o efeito de cada jutsu em texto corrido, então o app lê o
 * que dá e mostra o palpite marcado — quem lança confirma, tira e acrescenta.
 * Nada gruda em ninguém sem alguém ter olhado.
 *
 * A área é o mesmo acordo: o app avisa que o jutsu pega mais de um, mas quem
 * diz quem está dentro é quem está vendo o mapa.
 */
export function CondicoesDoGolpe({
  condicoes,
  onCondicoes,
  rodadas,
  onRodadas,
  area,
  alvos,
  extras,
  onExtras,
  alvoPrincipal,
}: {
  condicoes: string[]
  onCondicoes: (c: string[]) => void
  /** Prazo em rodadas; vazio = dura até o mestre tirar. */
  rodadas: number | undefined
  onRodadas: (r: number | undefined) => void
  /** Como a descrição fala da área, quando fala. */
  area?: string
  alvos: { ref: string; name: string }[]
  extras: string[]
  onExtras: (refs: string[]) => void
  alvoPrincipal: string
}) {
  const disponiveis = CONDITIONS.filter((c) => c.name !== 'Normal' && !condicoes.includes(c.name))
  const naArea = alvos.filter((a) => a.ref !== alvoPrincipal)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-orange-400/60">
          condição que o golpe impõe
          <Select
            value=""
            className="text-xs"
            onChange={(e) => {
              if (e.target.value) onCondicoes([...condicoes, e.target.value])
            }}
          >
            <option value="">{condicoes.length ? 'Acrescentar outra...' : 'Nenhuma'}</option>
            {disponiveis.map((c) => (
              <option key={c.name} value={c.name}>
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        {condicoes.length > 0 && (
          <label className="flex shrink-0 flex-col gap-1 text-xs text-orange-400/60">
            rodadas
            <Input
              type="number"
              min={0}
              placeholder="—"
              value={rodadas ?? ''}
              onChange={(e) => onRodadas(e.target.value === '' ? undefined : Math.max(0, Number(e.target.value) || 0))}
              className="w-20"
            />
          </label>
        )}
      </div>

      {condicoes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {condicoes.map((nome) => (
            <button
              key={nome}
              type="button"
              title={`${efeitoDaCondicao(nome)}\n(clique para tirar)`}
              onClick={() => onCondicoes(condicoes.filter((c) => c !== nome))}
              className="rounded-sm border border-[color:var(--orange)]/60 bg-black/50 px-1.5 py-0.5 font-display text-[10px] uppercase tracking-[0.08em] text-[color:var(--orange)] hover:border-red-500 hover:text-red-300"
            >
              {nome} ✕
            </button>
          ))}
          <span className="self-center text-[11px] text-orange-400/50">
            {rodadas === undefined ? 'sem prazo — dura até o mestre tirar' : `por ${rodadas} rodada(s)`}
          </span>
        </div>
      )}

      {area && (
        <div className="flex flex-col gap-1.5">
          <p className="text-[11px] text-orange-400/60">
            <Badge tone="warn">área</Badge> a descrição fala em {area}. Marque quem mais está dentro — o app resolve uma
            rolagem para cada um.
          </p>
          {naArea.length === 0 ? (
            <p className="text-[11px] text-orange-400/40">Não há mais ninguém que você possa marcar.</p>
          ) : (
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {naArea.map((a) => (
                <label key={a.ref} className="flex items-center gap-1.5 text-[11px] text-orange-200">
                  <input
                    type="checkbox"
                    checked={extras.includes(a.ref)}
                    onChange={(e) => onExtras(e.target.checked ? [...extras, a.ref] : extras.filter((r) => r !== a.ref))}
                  />
                  {a.name}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
