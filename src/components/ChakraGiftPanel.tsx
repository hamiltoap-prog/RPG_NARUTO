import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select } from './ui'
import { addLogEntry, approveChakraGift, denyChakraGift, listenPendingChakraGifts } from '../lib/store'
import type { ChakraGift, Character, GameTable } from '../types'

/** Fila de doações de chakra esperando o mestre. */
export function ChakraGiftPanel({ table, characters }: { table: GameTable; characters: Character[] }) {
  const [gifts, setGifts] = useState<ChakraGift[]>([])
  const [reason, setReason] = useState<Record<string, string>>({})

  useEffect(() => listenPendingChakraGifts(table.id, setGifts), [table.id])

  async function liberar(g: ChakraGift) {
    const doador = characters.find((c) => c.id === g.fromCharacterId)
    const recebedor = characters.find((c) => c.id === g.toCharacterId)
    if (!doador || !recebedor) return
    const saiu = await approveChakraGift(table.id, g, doador, recebedor, table.gmName)
    await addLogEntry(table.id, {
      actorName: g.fromCharacterName,
      actorType: 'player',
      characterId: g.fromCharacterId,
      kind: 'system',
      summary:
        saiu === 0
          ? `Doação para ${g.toCharacterName} não transferiu nada — ${g.toCharacterName} já estava com o chakra cheio.`
          : `Doou ${saiu} de chakra para ${g.toCharacterName}${saiu < g.amount ? ` (pediu ${g.amount})` : ''} (liberado por ${table.gmName}).`,
    })
  }

  async function negar(g: ChakraGift) {
    await denyChakraGift(table.id, g.id, table.gmName, reason[g.id] ?? '')
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      kind: 'system',
      summary: `Negou a doação de chakra de ${g.fromCharacterName} para ${g.toCharacterName}${reason[g.id] ? `: ${reason[g.id]}` : ''}.`,
    })
  }

  if (gifts.length === 0) return null

  return (
    <Card className="flex flex-col gap-2 p-4">
      <SectionTitle>Doações de chakra ({gifts.length})</SectionTitle>
      {gifts.map((g) => {
        const doador = characters.find((c) => c.id === g.fromCharacterId)
        const recebedor = characters.find((c) => c.id === g.toCharacterId)
        const cabe = recebedor ? Math.max(0, recebedor.chakra.max - recebedor.chakra.current) : g.amount
        const vaiSair = Math.min(g.amount, doador?.chakra.current ?? g.amount, cabe)
        return (
          <div key={g.id} className="well flex flex-wrap items-center gap-2 rounded-sm p-2 text-sm">
            <span className="text-orange-100">
              <b className="text-white">{g.fromCharacterName}</b> quer doar{' '}
              <b className="text-[color:var(--orange)]">{g.amount}</b> de chakra para{' '}
              <b className="text-white">{g.toCharacterName}</b>
            </span>
            {doador && recebedor && (
              <span className="text-xs text-orange-400/60">
                {doador.name} tem {doador.chakra.current} · cabe {cabe} em {recebedor.name}
                {vaiSair < g.amount && (
                  <b className="ml-1 text-[color:var(--orange)]">
                    {vaiSair === 0 ? '— não transfere nada' : `— transfere ${vaiSair}`}
                  </b>
                )}
              </span>
            )}
            <span className="ml-auto flex items-center gap-1.5">
              <Input
                placeholder="motivo (se negar)"
                value={reason[g.id] ?? ''}
                onChange={(e) => setReason((p) => ({ ...p, [g.id]: e.target.value }))}
                className="w-44 px-2 py-0.5 text-xs"
              />
              <Button variant="good" className="px-2 py-0.5 text-[11px]" onClick={() => liberar(g)}>
                liberar
              </Button>
              <Button variant="danger" className="px-2 py-0.5 text-[11px]" onClick={() => negar(g)}>
                negar
              </Button>
            </span>
          </div>
        )
      })}
    </Card>
  )
}

/**
 * Doação de chakra na ficha — regra da casa, só para Ninja Médico.
 *
 * Mexe na ficha de outra pessoa, então sempre passa pelo mestre: nem as
 * regras do Firestore nem o bom senso deixariam um jogador escrever chakra
 * na ficha alheia sozinho.
 */
export function ChakraGiftCard({
  table,
  character,
  party,
  requesterUid,
}: {
  table: GameTable
  character: Character
  party: Character[]
  requesterUid: string
}) {
  const [alvo, setAlvo] = useState('')
  const [quanto, setQuanto] = useState(1)
  const [aviso, setAviso] = useState('')
  const [meus, setMeus] = useState<ChakraGift[]>([])

  useEffect(() => {
    import('../lib/store').then((m) => m.listenMyChakraGifts(table.id, character.id, setMeus))
  }, [table.id, character.id])

  const possiveis = party.filter((c) => c.id !== character.id && !c.isNPC)
  const pendente = meus.find((g) => g.status === 'pending')
  const ultimo = meus.find((g) => g.status !== 'pending')

  async function pedir() {
    const recebedor = possiveis.find((c) => c.id === alvo)
    if (!recebedor || quanto < 1) return
    const { createChakraGift } = await import('../lib/store')
    await createChakraGift(table.id, {
      fromCharacterId: character.id,
      fromCharacterName: character.name,
      toCharacterId: recebedor.id,
      toCharacterName: recebedor.name,
      amount: quanto,
      requesterUid,
    })
    setAviso('Pedido enviado — aguardando o mestre liberar.')
  }

  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Doar chakra</SectionTitle>
        <Badge tone="warn">regra da casa</Badge>
      </div>
      <p className="text-xs leading-relaxed text-orange-400/60">
        Ninja Médico pode passar chakra para um aliado. Como a transferência mexe na ficha do outro, o mestre libera
        antes de acontecer — e o que sai é o que você tiver na hora.
      </p>

      {possiveis.length === 0 ? (
        <p className="text-xs text-orange-300/50">Ninguém mais na mesa para receber ainda.</p>
      ) : (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
            para quem
            <Select value={alvo} onChange={(e) => setAlvo(e.target.value)}>
              <option value="">Escolha...</option>
              {possiveis.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.chakra.current}/{c.chakra.max})
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            quanto
            <Input
              type="number"
              min={1}
              max={character.chakra.current}
              value={quanto}
              onChange={(e) => setQuanto(Math.max(1, Number(e.target.value) || 1))}
              className="w-24"
            />
          </label>
          <Button
            variant="primary"
            disabled={!alvo || quanto < 1 || character.chakra.current < 1 || Boolean(pendente)}
            onClick={pedir}
          >
            {pendente ? 'Já há um pedido na fila' : 'Pedir para doar'}
          </Button>
        </div>
      )}

      {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}
      {ultimo && (
        <p className="text-xs text-orange-300/60">
          Última: {ultimo.amount} para {ultimo.toCharacterName} —{' '}
          {ultimo.status === 'approved' ? (
            <span className="text-emerald-300">liberada</span>
          ) : (
            <span className="text-red-300">negada{ultimo.deniedReason ? `: ${ultimo.deniedReason}` : ''}</span>
          )}
        </p>
      )}
    </Card>
  )
}
