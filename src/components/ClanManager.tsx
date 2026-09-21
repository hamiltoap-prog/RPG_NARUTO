import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Textarea } from './ui'
import { CLANS } from '../data/clans'
import { clanIdFromName, emptyClan } from '../lib/clans'
import { deleteCustomClan, listenCustomClans, saveCustomClan } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import { ELEMENTS } from '../lib/jutsuAccess'
import type { AttributeKey, Clan, GameTable } from '../types'

/**
 * Clãs da casa.
 *
 * Um clã cadastrado aqui vale exatamente como um do manual: aparece na
 * criação de personagem, soma bônus de atributo e pode dar afinidade
 * elemental. Cadastrar um com o mesmo id de um clã oficial substitui o
 * oficial nesta mesa — é assim que o mestre ajusta um clã do manual para a
 * campanha dele sem perder os outros.
 */
export function ClanManager({ table }: { table: GameTable }) {
  const [custom, setCustom] = useState<Clan[]>([])
  const [d, setD] = useState<Clan | null>(null)
  const [elementos, setElementos] = useState<string[]>([])

  useEffect(() => listenCustomClans(table.id, setCustom), [table.id])

  function novo() {
    setD(emptyClan(''))
    setElementos([])
  }

  function editar(c: Clan) {
    setD(c)
    // A afinidade do clã fica guardada como uma linha no texto de traços.
    const m = c.featuresText.match(/Afinidade Passiva:\s*([^.\n]+)/i)
    setElementos(m ? m[1].split(/[,/]/).map((x) => x.trim()).filter(Boolean) : [])
  }

  async function salvar() {
    if (!d || !d.name.trim()) return
    const id = d.id || clanIdFromName(d.name)
    const semAfinidade = d.featuresText.replace(/Afinidade Passiva:[^.\n]*\.?\s*/i, '').trim()
    const featuresText = elementos.length
      ? `Afinidade Passiva: ${elementos.join(', ')}.${semAfinidade ? ' ' + semAfinidade : ''}`
      : semAfinidade
    const bonusText =
      d.bonusText.trim() ||
      ATTRIBUTE_KEYS.filter((k) => d.bonuses[k] !== 0)
        .map((k) => `${d.bonuses[k] > 0 ? '+' : ''}${d.bonuses[k]} ${ATTRIBUTE_LABELS[k]}`)
        .join(', ')
    await saveCustomClan(table.id, { ...d, id, featuresText, bonusText })
    setD(null)
  }

  const oficialSubstituido = d && CLANS.some((c) => c.id === (d.id || clanIdFromName(d.name)))

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Clãs da casa</SectionTitle>
          <Button variant="primary" onClick={novo}>
            + Novo clã
          </Button>
        </div>
        <p className="text-xs leading-relaxed text-orange-400/60">
          Vale como um clã do manual: entra na criação de personagem, soma os bônus de atributo e pode dar afinidade
          elemental. Os {CLANS.length} clãs do manual continuam disponíveis — usar o mesmo nome de um deles substitui o
          oficial só nesta mesa.
        </p>
      </Card>

      {d && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>{d.name ? `Editando ${d.name}` : 'Novo clã'}</SectionTitle>
          {oficialSubstituido && (
            <p className="text-xs text-[color:var(--orange)]">
              Atenção: este nome bate com um clã do manual — ele será substituído por este nesta mesa.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
              nome
              <Input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Kazehana" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              deslocamento
              <Input value={d.speed} onChange={(e) => setD({ ...d, speed: e.target.value })} className="w-32" />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            frase do clã (opcional)
            <Input value={d.quote ?? ''} onChange={(e) => setD({ ...d, quote: e.target.value })} />
          </label>

          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            descrição
            <Textarea rows={3} value={d.description} onChange={(e) => setD({ ...d, description: e.target.value })} />
          </label>

          <div>
            <p className="mb-1 text-xs text-orange-400/60">Bônus de atributo</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {ATTRIBUTE_KEYS.map((k) => (
                <label key={k} className="flex flex-col gap-1 text-[11px] text-orange-400/60">
                  {ATTRIBUTE_LABELS[k]}
                  <Input
                    type="number"
                    value={d.bonuses[k]}
                    onChange={(e) => setD({ ...d, bonuses: { ...d.bonuses, [k as AttributeKey]: Number(e.target.value) || 0 } })}
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-orange-400/60">
              Afinidade passiva — destrava os jutsus de Liberação para quem é deste clã
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ELEMENTS.map((el) => {
                const ativo = elementos.includes(el)
                return (
                  <button
                    key={el}
                    onClick={() => setElementos((p) => (ativo ? p.filter((x) => x !== el) : [...p, el]))}
                    className={`rounded-sm border px-2.5 py-1 font-display text-xs uppercase tracking-[0.08em] transition ${
                      ativo
                        ? 'border-[color:var(--orange)] bg-[color:var(--orange)] text-[color:var(--orange-ink)]'
                        : 'border-[color:var(--line)] text-orange-300/50 hover:border-[color:var(--line-strong)]'
                    }`}
                  >
                    {el}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            perícias do clã (separadas por vírgula)
            <Input
              value={d.skillProficiencies.join(', ')}
              onChange={(e) => setD({ ...d, skillProficiencies: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
              placeholder="Percepção, Furtividade"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            traços e recursos do clã
            <Textarea rows={4} value={d.featuresText} onChange={(e) => setD({ ...d, featuresText: e.target.value })} />
          </label>

          <div className="flex gap-2">
            <Button variant="primary" disabled={!d.name.trim()} onClick={salvar}>
              Guardar clã
            </Button>
            <Button variant="ghost" onClick={() => setD(null)}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {custom.map((c) => (
          <Card key={c.id} className="flex flex-col gap-1.5 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-sm uppercase tracking-[0.06em] text-white">{c.name}</p>
              {CLANS.some((o) => o.id === c.id) && <Badge tone="warn">substitui o oficial</Badge>}
            </div>
            {c.bonusText && <p className="text-xs text-emerald-400">{c.bonusText}</p>}
            {c.description && <p className="line-clamp-2 text-xs text-orange-300/60">{c.description}</p>}
            <div className="flex gap-2">
              <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => editar(c)}>
                editar
              </Button>
              <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => deleteCustomClan(table.id, c.id)}>
                remover
              </button>
            </div>
          </Card>
        ))}
        {custom.length === 0 && !d && (
          <p className="text-sm text-orange-300/50">Nenhum clã da casa ainda — a mesa usa os {CLANS.length} do manual.</p>
        )}
      </div>
    </div>
  )
}
