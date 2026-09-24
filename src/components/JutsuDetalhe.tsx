import { useState } from 'react'
import { Badge } from './ui'
import { findCatalogEntry, readJutsu } from '../lib/jutsuCast'
import { ehDaCasa } from '../lib/jutsuCatalog'
import type { Jutsu } from '../types'

/**
 * O texto completo de um jutsu da ficha.
 *
 * A ficha guarda do jutsu só o **nome** e um resumo gravado no dia em que ele
 * foi concedido. Isso bastava enquanto o catálogo era fixo; agora que o mestre
 * escreve e corrige jutsus, aquele resumo envelhece — a mesa jogaria com um
 * texto e o app resolveria por outro.
 *
 * Então aqui o texto vem do catálogo AO VIVO, pelo nome, e o resumo gravado
 * fica como reserva para o jutsu de mesa que não está no catálogo (o
 * "personalizado" que o mestre digitou direto na ficha).
 */
export function JutsuDetalhe({ jutsu }: { jutsu: Jutsu }) {
  const [aberto, setAberto] = useState(false)
  const entrada = findCatalogEntry(jutsu.name)

  // Sem entrada no catálogo, o que existe é o resumo gravado na ficha.
  if (!entrada) {
    return jutsu.details ? (
      <p className="mt-0.5 whitespace-pre-line text-xs text-orange-300/60">{jutsu.details}</p>
    ) : null
  }

  const lido = readJutsu(entrada)

  return (
    <div className="mt-1 flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-orange-400/60">
        <span>
          {entrada.classification} · {entrada.rank}
        </span>
        {entrada.cost && <span>· {entrada.cost}</span>}
        {ehDaCasa(entrada.name) && <Badge tone="warn">da casa</Badge>}
        <button
          className="ml-auto text-[11px] text-orange-400 hover:text-orange-200"
          onClick={() => setAberto(!aberto)}
        >
          {aberto ? 'esconder descrição' : 'ver descrição completa'}
        </button>
      </div>

      {aberto && (
        <div className="flex flex-col gap-1.5 rounded-sm border border-[color:var(--line)] bg-black/25 p-2">
          <div className="grid gap-x-3 gap-y-0.5 text-[11px] text-orange-300/70 sm:grid-cols-2">
            <span>
              <b className="text-orange-400/60">Execução:</b> {entrada.castingTime || '—'}
            </span>
            <span>
              <b className="text-orange-400/60">Alcance:</b> {entrada.range || '—'}
            </span>
            <span>
              <b className="text-orange-400/60">Duração:</b> {entrada.duration || '—'}
            </span>
            <span>
              <b className="text-orange-400/60">Componentes:</b> {entrada.components || '—'}
            </span>
            {entrada.keywords && (
              <span className="sm:col-span-2">
                <b className="text-orange-400/60">Palavras-chave:</b> {entrada.keywords}
              </span>
            )}
          </div>

          <p className="whitespace-pre-line text-xs leading-relaxed text-orange-100/90">{entrada.description}</p>

          {/* O que o app vai fazer com este texto na hora de lançar. */}
          <div className="flex flex-wrap items-center gap-1.5 border-t border-[color:var(--line)] pt-1.5">
            <span className="text-[10px] uppercase tracking-[0.1em] text-orange-400/50">o app resolve como</span>
            <Badge>
              {lido.mode === 'attack' ? 'ataque contra a CA' : lido.mode === 'save' ? 'resistência contra o PR' : 'sem rolagem'}
            </Badge>
            {lido.damage && <Badge tone="bad">{lido.damage} de dano</Badge>}
            {lido.healing && <Badge tone="good">cura {lido.healing}</Badge>}
            {lido.conditions.map((c) => (
              <Badge key={c} tone="warn">
                {c}
              </Badge>
            ))}
            {lido.area && <Badge>{lido.area}</Badge>}
          </div>
        </div>
      )}
    </div>
  )
}
