import { useMemo, useState } from 'react'
import { Badge, Button, Input, SectionTitle, Select } from './ui'
import { CLASSES } from '../data/classes'
import { gerarNPC, rngComSemente } from '../lib/npcRapido'
import { mostrarCaminho, paraGravar } from '../lib/pastas'
import { createCharacter } from '../lib/store'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { Character, Clan, GameTable } from '../types'

const ABREV: Record<string, string> = {
  strength: 'FOR',
  dexterity: 'DES',
  constitution: 'CON',
  intelligence: 'INT',
  wisdom: 'SAB',
  charisma: 'CAR',
}

/**
 * Criação rápida de NPC com ficha completa: nome, nível e clã — o resto o
 * sorteio decide, com critério (ver `lib/npcRapido.ts`). O mestre vê a ficha
 * antes de criar e pode sortear de novo quantas vezes quiser.
 *
 * Dá para criar vários de uma vez ("Guarda da Névoa" ×4): cada um sai com
 * sorteio próprio e um número no nome.
 */
export function CriacaoRapidaNPC({
  table,
  clans,
  pastas,
  onCriados,
}: {
  table: GameTable
  clans: Clan[]
  pastas: readonly string[]
  onCriados: (criados: Character[]) => void
}) {
  const [nome, setNome] = useState('')
  const [nivel, setNivel] = useState(Math.max(1, table.startingLevel ?? 1))
  const [clanId, setClanId] = useState('')
  const [classId, setClassId] = useState('')
  const [quantos, setQuantos] = useState(1)
  const [pasta, setPasta] = useState('')
  const [semente, setSemente] = useState(() => Math.floor(Math.random() * 1e9))
  const [criando, setCriando] = useState(false)

  const clan = clans.find((c) => c.id === clanId)
  // Clã "sorteado": a semente escolhe, e "sortear de novo" troca junto.
  const clanDaVez = (i: number) => clan ?? clans[Math.floor(rngComSemente(semente + 7919 * (i + 1))() * clans.length)]

  const fichas = useMemo(() => {
    if (!nome.trim() || clans.length === 0) return []
    return Array.from({ length: quantos }, (_, i) =>
      gerarNPC({
        tableId: table.id,
        ownerUid: table.gmUid,
        name: quantos > 1 ? `${nome.trim()} ${i + 1}` : nome.trim(),
        level: nivel,
        clan: clanDaVez(i),
        classId: classId || undefined,
        rng: rngComSemente(semente + i * 104729),
      }),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nome, nivel, clanId, classId, quantos, semente, clans, table.id, table.gmUid])

  async function criar() {
    if (fichas.length === 0) return
    setCriando(true)
    try {
      const criados: Character[] = []
      for (const f of fichas) criados.push(await createCharacter(table.id, { ...f, folder: paraGravar(pasta) }))
      setNome('')
      setSemente(Math.floor(Math.random() * 1e9))
      onCriados(criados)
    } finally {
      setCriando(false)
    }
  }

  return (
    <div className="flex flex-col gap-3" data-criacao-rapida>
      <p className="text-xs leading-relaxed text-orange-400/60">
        Escolha nome, nível e clã. Classe, atributos, afinidade, jutsus e equipamento são sorteados de acordo: a classe
        puxa para o que o clã favorece, os atributos seguem o que a classe pede, e os jutsus respeitam o rank do nível,
        o clã e a afinidade. A ficha nasce oculta para os jogadores.
      </p>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex min-w-40 flex-1 flex-col gap-1 text-xs text-orange-400/60">
          nome
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Guarda da Névoa" data-nome-rapido />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          nível
          <Input
            type="number"
            min={1}
            max={20}
            value={nivel}
            onChange={(e) => setNivel(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
            className="w-20"
            data-nivel-rapido
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          clã
          <Select value={clanId} onChange={(e) => setClanId(e.target.value)} className="w-44" data-cla-rapido>
            <option value="">🎲 sortear clã</option>
            {clans.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          classe
          <Select value={classId} onChange={(e) => setClassId(e.target.value)} className="w-52" data-classe-rapida>
            <option value="">🎲 sortear (combina com o clã)</option>
            {CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          quantos
          <Input
            type="number"
            min={1}
            max={10}
            value={quantos}
            onChange={(e) => setQuantos(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
            className="w-16"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          pasta (opcional)
          <Input value={pasta} onChange={(e) => setPasta(e.target.value)} placeholder="Cena 01 > Konoha" list="pastas-de-npc" className="w-44" />
          <datalist id="pastas-de-npc">
            {pastas.map((p) => (
              <option key={p} value={mostrarCaminho(p).replace(/ › /g, ' > ')} />
            ))}
          </datalist>
        </label>
      </div>

      {fichas.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {fichas.map((f, i) => (
            <PreviaDaFicha key={i} ficha={f} clan={clans.find((c) => c.id === f.clanId)} />
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" disabled={fichas.length === 0} onClick={() => setSemente(Math.floor(Math.random() * 1e9))} data-sortear-de-novo>
          🎲 sortear de novo
        </Button>
        <Button variant="primary" disabled={fichas.length === 0 || criando} onClick={criar} data-criar-rapido>
          {criando ? 'criando...' : fichas.length > 1 ? `Criar ${fichas.length} NPCs` : 'Criar NPC'}
        </Button>
        {!nome.trim() && <span className="text-[11px] text-orange-400/50">Dê um nome para ver a ficha sorteada.</span>}
      </div>
    </div>
  )
}

function PreviaDaFicha({ ficha, clan }: { ficha: Omit<Character, 'id'>; clan?: Clan }) {
  const classe = CLASSES.find((c) => c.id === ficha.classId)
  return (
    <div className="plaque flex flex-col gap-1.5 rounded-lg p-3 text-xs" data-previa-npc>
      <div className="flex flex-wrap items-center gap-1.5">
        <SectionTitle>{ficha.name}</SectionTitle>
        <Badge>{ficha.description.rank}</Badge>
      </div>
      <p className="text-orange-200" data-previa-classe>
        Nível {ficha.level} · {clan?.name ?? ficha.clanId} · {classe?.name ?? ficha.classId}
        {ficha.elements?.length ? ` · afinidade ${ficha.elements.join(', ')}` : ''}
      </p>
      <p className="text-orange-300/80">
        PV {ficha.hp.max} · Chakra {ficha.chakra.max} · CA {ficha.armorClass} · PR {ficha.resistancePoints} · Prof. +
        {ficha.proficiencyBonus}
      </p>
      <p className="font-mono text-[11px] text-orange-300/70" title={ATTRIBUTE_KEYS.map((k) => ATTRIBUTE_LABELS[k]).join(', ')}>
        {ATTRIBUTE_KEYS.map((k) => `${ABREV[k]} ${ficha.attributes[k]}`).join(' · ')}
      </p>
      <p className="text-orange-300/70">
        <b className="text-orange-200">Jutsus ({ficha.jutsus.length}):</b> {ficha.jutsus.map((j) => j.name).join(', ') || '—'}
      </p>
      <p className="text-orange-300/70">
        <b className="text-orange-200">Equipamento:</b>{' '}
        {[
          ...ficha.weapons.map((w) => `${w.name}${w.quantity && w.quantity > 1 ? ` ×${w.quantity}` : ''}`),
          ...ficha.armor.map((a) => a.name),
          ...ficha.equipment.map((e) => `${e.name}${e.quantity > 1 ? ` ×${e.quantity}` : ''}`),
        ].join(', ') || '—'}
      </p>
    </div>
  )
}
