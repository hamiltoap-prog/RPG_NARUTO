import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select, Textarea } from './ui'
import { newId } from '../lib/id'
import { deleteShopItem, listenShop, saveShopItem, updateTable } from '../lib/store'
import { SHOP_ITEM_KIND_LABELS } from '../types'
import type { GameTable, ShopItem, ShopItemKind } from '../types'

/**
 * Forja e vitrine.
 *
 * A loja do manual é uma lista fixa de equipamento, sempre aberta. Aqui o
 * mestre manda: abre e fecha a loja, decide se o catálogo do manual está à
 * venda, e forja itens da campanha com preço e estoque próprios.
 *
 * Comprar continua passando pela fila de aprovação como qualquer mudança de
 * ficha — a loja decide o que existe, não quem leva.
 */
export function ItemForge({ table }: { table: GameTable }) {
  const [itens, setItens] = useState<ShopItem[]>([])
  const [d, setD] = useState<ShopItem | null>(null)

  useEffect(() => listenShop(table.id, setItens), [table.id])

  function novo(): ShopItem {
    return {
      id: newId(),
      tableId: table.id,
      kind: 'gear',
      name: '',
      cost: 10,
      description: '',
      available: true,
      createdAt: Date.now(),
    }
  }

  async function mexerEstoque(item: ShopItem, delta: number) {
    const atual = item.stock ?? 0
    await saveShopItem(table.id, { ...item, stock: Math.max(0, atual + delta) })
  }

  const aberta = table.shopOpen ?? true
  const usaManual = table.shopUsesManual ?? true

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Loja da mesa</SectionTitle>
          <Button variant="primary" onClick={() => setD(novo())}>
            + Forjar item
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          <label className="flex items-start gap-2 text-sm text-orange-100">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={aberta}
              onChange={(e) => updateTable(table.id, { shopOpen: e.target.checked })}
            />
            <span>
              Loja aberta ao grupo
              <span className="block text-xs text-orange-400/60">Fechada, a loja some da ficha dos jogadores.</span>
            </span>
          </label>
          <label className="flex items-start gap-2 text-sm text-orange-100">
            <input
              type="checkbox"
              className="mt-0.5"
              checked={usaManual}
              onChange={(e) => updateTable(table.id, { shopUsesManual: e.target.checked })}
            />
            <span>
              Vender também o equipamento do manual
              <span className="block text-xs text-orange-400/60">
                Desligado, só os itens que você forjar ficam à venda — útil para uma vila isolada ou um mercado negro.
              </span>
            </span>
          </label>
        </div>
      </Card>

      {d && (
        <Card className="flex flex-col gap-3 p-4">
          <SectionTitle>{d.name ? `Editando ${d.name}` : 'Novo item'}</SectionTitle>
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
              nome
              <Input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Kunai do Raio" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              tipo
              <Select value={d.kind} onChange={(e) => setD({ ...d, kind: e.target.value as ShopItemKind })} className="w-32">
                {(Object.keys(SHOP_ITEM_KIND_LABELS) as ShopItemKind[]).map((k) => (
                  <option key={k} value={k}>
                    {SHOP_ITEM_KIND_LABELS[k]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              preço (ryo)
              <Input type="number" min={0} value={d.cost} onChange={(e) => setD({ ...d, cost: Number(e.target.value) || 0 })} className="w-28" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              estoque
              <Input
                type="number"
                min={0}
                value={d.stock ?? ''}
                placeholder="sem limite"
                onChange={(e) => setD({ ...d, stock: e.target.value === '' ? undefined : Math.max(0, Number(e.target.value) || 0) })}
                className="w-28"
              />
            </label>
          </div>

          {d.kind === 'weapon' && (
            <div className="flex flex-wrap items-end gap-2">
              <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                dano
                <Input value={d.damage ?? ''} onChange={(e) => setD({ ...d, damage: e.target.value })} placeholder="1d6" className="w-24" />
              </label>
              <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                tipo de dano
                <Input value={d.damageType ?? ''} onChange={(e) => setD({ ...d, damageType: e.target.value })} placeholder="Cortante" className="w-36" />
              </label>
              <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
                propriedades
                <Input value={d.properties ?? ''} onChange={(e) => setD({ ...d, properties: e.target.value })} placeholder="Leve, arremesso (6m)" />
              </label>
            </div>
          )}

          {d.kind === 'armor' && (
            <label className="flex w-40 flex-col gap-1 text-xs text-orange-400/60">
              bônus de CA
              <Input type="number" value={d.armorBonus ?? 0} onChange={(e) => setD({ ...d, armorBonus: Number(e.target.value) || 0 })} />
            </label>
          )}

          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            descrição
            <Textarea rows={2} value={d.description ?? ''} onChange={(e) => setD({ ...d, description: e.target.value })} />
          </label>

          <div className="flex gap-2">
            <Button
              variant="primary"
              disabled={!d.name.trim()}
              onClick={async () => {
                await saveShopItem(table.id, d)
                setD(null)
              }}
            >
              Pôr à venda
            </Button>
            <Button variant="ghost" onClick={() => setD(null)}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        {itens.map((i) => {
          const esgotado = i.stock === 0
          return (
            <Card key={i.id} className="flex flex-col gap-1.5 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-display text-sm uppercase tracking-[0.06em] text-white">{i.name}</p>
                <Badge>{SHOP_ITEM_KIND_LABELS[i.kind]}</Badge>
                {esgotado && <Badge tone="bad">esgotado</Badge>}
                {!i.available && <Badge tone="warn">fora do ar</Badge>}
                <span className="ml-auto font-display text-sm text-[color:var(--orange)]">{i.cost} ryo</span>
              </div>
              <p className="text-xs text-orange-300/60">
                {i.kind === 'weapon' && `${i.damage ?? '—'} ${i.damageType ?? ''} ${i.properties ?? ''}`}
                {i.kind === 'armor' && `+${i.armorBonus ?? 0} de CA`}
                {i.description && <span className="block">{i.description}</span>}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-orange-400/60">
                  estoque: <b className="text-orange-200">{i.stock ?? '∞'}</b>
                </span>
                {i.stock !== undefined && (
                  <>
                    <button className="text-orange-400/60 hover:text-white" onClick={() => mexerEstoque(i, -1)}>
                      −1
                    </button>
                    <button className="text-orange-400/60 hover:text-white" onClick={() => mexerEstoque(i, 1)}>
                      +1
                    </button>
                  </>
                )}
                <Button
                  variant="secondary"
                  className="ml-auto px-2 py-0.5 text-[11px]"
                  onClick={() => saveShopItem(table.id, { ...i, available: !i.available })}
                >
                  {i.available ? 'tirar do ar' : 'pôr no ar'}
                </Button>
                <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => setD(i)}>
                  editar
                </Button>
                <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => deleteShopItem(table.id, i.id)}>
                  remover
                </button>
              </div>
            </Card>
          )
        })}
        {itens.length === 0 && !d && (
          <p className="text-sm text-orange-300/50">
            Nenhum item forjado ainda. A loja mostra {usaManual ? 'o equipamento do manual' : 'nada — o catálogo do manual está desligado'}.
          </p>
        )}
      </div>
    </div>
  )
}
