import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { ARMORS, GEAR, WEAPONS } from '../data/equipment'
import {
  addPuppetItem,
  armorClassFor,
  armorFromCatalog,
  armorFromShopItem,
  bundleSize,
  catalogEntries,
  stackArmor,
  stackGear,
  stackWeapon,
  weaponFromCatalog,
  weaponFromShopItem,
} from '../lib/equipment'
import { addLogEntry, listenShop, updateCharacterDirect } from '../lib/store'
import type { Character, GameTable, ShopItem } from '../types'

/**
 * Entrega do mestre — o achado do baú, a recompensa da missão, o dinheiro do
 * contratante.
 *
 * A loja resolve o caso de comprar; isto resolve o de **receber**: uma espada
 * que o mestre forjou e o grupo encontrou não precisa passar pelo balcão. O
 * item entra na ficha pelo mesmo caminho da compra e do equipamento inicial
 * (`lib/equipment`), então chega com dano, propriedades, consumo e limite de
 * Destreza iguais — e vestir a armadura entregue recalcula a CA na hora.
 *
 * Não pede aprovação de ninguém: é o mestre agindo.
 */
export function GiftPanel({ table, characters }: { table: GameTable; characters: Character[] }) {
  const [aba, setAba] = useState<'item' | 'ryo'>('item')
  const [quemId, setQuemId] = useState('')
  const [fonte, setFonte] = useState<'manual' | 'forja'>('manual')
  const [tipo, setTipo] = useState<'weapon' | 'armor' | 'gear'>('weapon')
  const [nome, setNome] = useState('')
  const [quantidade, setQuantidade] = useState(1)
  const [ryo, setRyo] = useState(100)
  const [motivo, setMotivo] = useState('')
  const [feito, setFeito] = useState('')
  const [daForja, setDaForja] = useState<ShopItem[]>([])

  useEffect(() => listenShop(table.id, setDaForja), [table.id])

  const vivos = characters.filter((c) => !c.isNPC)
  const quem = vivos.find((c) => c.id === quemId)
  const doManual = catalogEntries(tipo)
  // "Item" na entrega inclui as marionetes: é o que o mestre entrega quando
  // o grupo encontra uma no baú.
  const forjados = daForja.filter((i) => (tipo === 'gear' ? i.kind === 'gear' || i.kind === 'puppet' : i.kind === tipo))
  const lista = fonte === 'manual' ? doManual.map((i) => i.name) : forjados.map((i) => i.name)

  async function entregarItem() {
    if (!quem || !nome) return
    const patch: Record<string, unknown> = {}
    let descricao = nome

    if (tipo === 'weapon') {
      const base =
        fonte === 'manual'
          ? (() => {
              const e = WEAPONS.find((w) => w.name === nome)
              return e ? { molde: weaponFromCatalog(e), unidades: bundleSize(e.name) } : null
            })()
          : (() => {
              const e = forjados.find((i) => i.name === nome)
              return e ? { molde: weaponFromShopItem(e), unidades: 1 } : null
            })()
      if (!base) return
      patch.weapons = stackWeapon(quem.weapons, base.molde, base.unidades * quantidade)
      descricao = `${nome} x${base.unidades * quantidade}`
    } else if (tipo === 'armor') {
      const molde =
        fonte === 'manual'
          ? (() => {
              const e = ARMORS.find((a) => a.name === nome)
              return e ? armorFromCatalog(e) : null
            })()
          : (() => {
              const e = forjados.find((i) => i.name === nome)
              return e ? armorFromShopItem(e) : null
            })()
      if (!molde) return
      let armadura = quem.armor
      for (let i = 0; i < quantidade; i++) armadura = stackArmor(armadura, molde)
      patch.armor = armadura
      // Armadura entregue já vestida muda a defesa: a CA vai na mesma escrita.
      patch.armorClass = armorClassFor(quem, armadura)
      descricao = `${nome} (+${molde.defenseBonus} CA)`
    } else {
      const forjado = forjados.find((i) => i.name === nome)
      const nota = fonte === 'manual' ? GEAR.find((g) => g.name === nome)?.effect : forjado?.description
      if (forjado?.kind === 'puppet') {
        // Marionete não empilha: cada uma é um objeto, e a linha guarda de
        // qual marionete forjada veio para o dono poder pô-la em campo.
        let mochila = quem.equipment
        for (let i = 0; i < quantidade; i++) mochila = addPuppetItem(mochila, nome, forjado.id, nota)
        patch.equipment = mochila
        descricao = `${nome} (marionete)`
      } else {
        patch.equipment = stackGear(quem.equipment, nome, quantidade, nota)
        descricao = `${nome} x${quantidade}`
      }
    }

    await updateCharacterDirect(table.id, quem.id, patch)
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      characterId: quem.id,
      kind: 'system',
      summary: `${quem.name} recebeu ${descricao}${motivo ? ` — ${motivo}` : ''}`,
    })
    setFeito(`${quem.name} recebeu ${descricao}.`)
    setMotivo('')
  }

  async function entregarRyo(sinal: 1 | -1) {
    if (!quem || ryo === 0) return
    const delta = sinal * Math.abs(ryo)
    const novo = Math.max(0, quem.ryo + delta)
    await updateCharacterDirect(table.id, quem.id, { ryo: novo })
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      characterId: quem.id,
      kind: 'system',
      summary:
        delta > 0
          ? `${quem.name} recebeu ${delta} ryo${motivo ? ` — ${motivo}` : ''} (saldo ${novo})`
          : `${quem.name} perdeu ${-delta} ryo${motivo ? ` — ${motivo}` : ''} (saldo ${novo})`,
    })
    setFeito(`Saldo de ${quem.name}: ${novo} ryo.`)
    setMotivo('')
  }

  if (vivos.length === 0) {
    return <p className="text-xs text-orange-300/50">Nenhum personagem na mesa ainda.</p>
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Entregar direto (sem loja)</SectionTitle>
        {quem && (
          <Badge>
            {quem.name} · {quem.ryo} ryo · CA {quem.armorClass}
          </Badge>
        )}
      </div>
      <p className="text-xs leading-relaxed text-orange-300/60">
        Para o que o grupo <b className="text-orange-200">acha</b> em vez de comprar: o espólio de um baú, a recompensa
        da missão, o pagamento do contratante. Vale para os itens do manual e para os que você forjou.
      </p>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          para quem
          <Select value={quemId} onChange={(e) => setQuemId(e.target.value)}>
            <option value="">Escolha o personagem...</option>
            {vivos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.ryo} ryo)
              </option>
            ))}
          </Select>
        </label>
        <div className="flex gap-1.5 pb-0.5">
          {(
            [
              ['item', 'Item'],
              ['ryo', 'Ryo'],
            ] as const
          ).map(([k, label]) => (
            <TabChip key={k} active={aba === k} className="px-3 py-1 text-xs" onClick={() => setAba(k)}>
              {label}
            </TabChip>
          ))}
        </div>
      </div>

      {aba === 'item' && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            de onde
            <Select
              value={fonte}
              onChange={(e) => {
                setFonte(e.target.value as 'manual' | 'forja')
                setNome('')
              }}
              className="w-32"
            >
              <option value="manual">Manual</option>
              <option value="forja">Minha forja</option>
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            tipo
            <Select
              value={tipo}
              onChange={(e) => {
                setTipo(e.target.value as 'weapon' | 'armor' | 'gear')
                setNome('')
              }}
              className="w-32"
            >
              <option value="weapon">Arma</option>
              <option value="armor">Armadura</option>
              <option value="gear">Item</option>
            </Select>
          </label>
          <label className="flex min-w-48 flex-1 flex-col gap-1 text-xs text-orange-400/60">
            o quê
            <Select value={nome} onChange={(e) => setNome(e.target.value)}>
              <option value="">{lista.length === 0 ? 'Nada desse tipo na forja' : 'Escolha...'}</option>
              {(fonte === 'manual' ? doManual : forjados.map((i) => ({ name: i.name, detail: i.description ?? '' }))).map((i) => (
                <option key={i.name} value={i.name}>
                  {i.name}
                  {i.detail ? ` — ${i.detail.slice(0, 60)}` : ''}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            quantas vezes
            <Input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value) || 1))}
              className="w-24"
            />
          </label>
        </div>
      )}

      {aba === 'ryo' && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            quanto
            <Input type="number" min={0} value={ryo} onChange={(e) => setRyo(Math.max(0, Number(e.target.value) || 0))} className="w-28" />
          </label>
          <Button variant="good" disabled={!quem || ryo === 0} onClick={() => entregarRyo(1)}>
            + dar ryo
          </Button>
          <Button variant="danger" disabled={!quem || ryo === 0} onClick={() => entregarRyo(-1)}>
            − cobrar ryo
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          motivo (aparece no registro da mesa)
          <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Espólio do baú do templo" />
        </label>
        {aba === 'item' && (
          <Button variant="primary" disabled={!quem || !nome} onClick={entregarItem}>
            Entregar
          </Button>
        )}
      </div>

      {feito && <p className="text-xs text-emerald-300">{feito}</p>}
    </Card>
  )
}
