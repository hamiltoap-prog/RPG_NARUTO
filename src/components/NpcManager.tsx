import { useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, Textarea } from './ui'
import { EscolherJutsu } from './EscolherJutsu'
import { WEAPONS } from '../data/equipment'
import { weaponFromCatalog } from '../lib/equipment'
import { TokenArtEditor } from './TokenArtEditor'
import { ELEMENTS } from '../lib/jutsuAccess'
import { newId } from '../lib/id'
import { ArvoreDePastas, SelectDePasta } from './Pastas'
import { createNPC, deleteCharacter, deleteNPC, moverParaPasta, moverPasta, updateCharacterDirect, updateNPC } from '../lib/store'
import { mostrarCaminho, paraGravar, todasAsPastas } from '../lib/pastas'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Character, NPC, NpcAttack } from '../types'

const emptyDraft = { name: '', armorClass: '12', hp: '10', resistancePoints: '13', attacksText: '', notes: '' }

/** Ficha rápida: CA, PV, PR e golpes em texto. */
export function NovoNpcSimples({ tableId, pastas }: { tableId: string; pastas: readonly string[] }) {
  const [draft, setDraft] = useState(emptyDraft)
  const [pasta, setPasta] = useState('')
  const [creating, setCreating] = useState(false)

  async function addNpc() {
    if (!draft.name.trim()) return
    setCreating(true)
    try {
      const hp = Math.max(1, Number(draft.hp) || 1)
      await createNPC(tableId, {
        tableId,
        name: draft.name.trim(),
        armorClass: Number(draft.armorClass) || 10,
        hp: { current: hp, max: hp },
        resistancePoints: Number(draft.resistancePoints) || 13,
        attacksText: draft.attacksText.trim(),
        notes: draft.notes.trim(),
        visible: true,
        createdAt: Date.now(),
        folder: paraGravar(pasta),
      })
      setDraft(emptyDraft)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-2 sm:grid-cols-4">
        <Input placeholder="Nome" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
        {/* Com rótulo: o valor padrão já preenche o campo, e sem rótulo o
            celular mostrava só "12, 10, 13" sem dizer o que era cada um. */}
        {(
          [
            ['armorClass', 'CA'],
            ['hp', 'PV'],
            ['resistancePoints', 'PR'],
          ] as const
        ).map(([k, r]) => (
          <label key={k} className="flex items-center gap-2 text-xs text-orange-400/70">
            <span className="w-6">{r}</span>
            <Input type="number" value={draft[k]} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} />
          </label>
        ))}
      </div>
      <Textarea
        rows={2}
        placeholder="Ataques em texto (o que não couber nos golpes prontos)"
        value={draft.attacksText}
        onChange={(e) => setDraft((d) => ({ ...d, attacksText: e.target.value }))}
      />
      <Textarea rows={2} placeholder="Notas" value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
      <div className="flex flex-wrap items-center gap-2">
        <Input
          placeholder="pasta (ex.: Cena 01 > Konoha)"
          value={pasta}
          list="pastas-de-npc-simples"
          onChange={(e) => setPasta(e.target.value)}
          className="w-56"
        />
        <datalist id="pastas-de-npc-simples">
          {pastas.map((p) => (
            <option key={p} value={mostrarCaminho(p).replace(/ › /g, ' > ')} />
          ))}
        </datalist>
        <Button variant="primary" disabled={!draft.name.trim() || creating} onClick={addNpc}>
          Adicionar NPC
        </Button>
      </div>
    </div>
  )
}

/** Uma entrada da biblioteca de NPCs: ficha rápida ou ficha completa. */
type Entrada = { tipo: 'npc'; npc: NPC } | { tipo: 'ficha'; c: Character }

const pastaDaEntrada = (e: Entrada) => (e.tipo === 'npc' ? e.npc.folder : e.c.folder)
const nomeDaEntrada = (e: Entrada) => (e.tipo === 'npc' ? e.npc.name : e.c.name)

/** As pastas que os NPCs (das duas coleções) usam hoje. */
export function pastasDosNpcs(npcs: readonly NPC[], fichas: readonly Character[]): string[] {
  return todasAsPastas([...npcs.map((n) => n.folder), ...fichas.map((c) => c.folder)])
}

/**
 * Biblioteca de NPCs do mestre.
 *
 * As duas fontes moram juntas, de propósito: a ficha rápida (CA, PV, golpes)
 * e as fichas completas — criadas pelo assistente ou pela criação rápida.
 * Vivem em coleções diferentes por serem coisas diferentes, mas em jogo são
 * tudo "quem está do outro lado", e procurar em dois lugares atrapalha no meio
 * da luta. As pastas também são uma árvore só: "Cena 01 › Konoha" junta o
 * guarda de ficha rápida e o jonin de ficha completa da mesma cena.
 */
export function NpcManager({
  tableId,
  npcs,
  npcCharacters = [],
  onOpenCharacter,
  abertaId,
}: {
  tableId: string
  npcs: NPC[]
  npcCharacters?: Character[]
  onOpenCharacter?: (id: string) => void
  /** A ficha completa aberta agora, para marcar na lista. */
  abertaId?: string | null
}) {
  const [editando, setEditando] = useState<string | null>(null)
  const [busca, setBusca] = useState('')

  const pastas = pastasDosNpcs(npcs, npcCharacters)
  const todas: Entrada[] = [
    ...npcCharacters.map((c) => ({ tipo: 'ficha' as const, c })),
    ...npcs.map((npc) => ({ tipo: 'npc' as const, npc })),
  ]
  const termo = busca.trim().toLowerCase()
  const visiveis = termo ? todas.filter((e) => nomeDaEntrada(e).toLowerCase().includes(termo)) : todas

  async function applyHp(npc: NPC, delta: number) {
    const newCurrent = Math.max(0, Math.min(npc.hp.max, npc.hp.current + delta))
    await updateNPC(tableId, npc.id, { hp: { current: newCurrent, max: npc.hp.max } })
  }

  async function moverPastaDosDois(de: string, para: string) {
    await Promise.all([
      moverPasta(tableId, 'npcs', npcs, de, para),
      moverPasta(tableId, 'characters', npcCharacters, de, para),
    ])
  }

  function renderFicha(c: Character) {
    return (
      <div
        className={`well flex flex-wrap items-center gap-2 rounded-sm p-2 text-sm ${abertaId === c.id ? 'ring-1 ring-[color:var(--orange)]' : ''}`}
        data-npc-ficha={c.name}
      >
        <Avatar url={c.imageUrl} name={c.name} size={34} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-orange-100">
            {c.name} <span className="text-[10px] uppercase tracking-wide text-orange-400/50">ficha completa</span>
          </p>
          <p className="text-xs text-orange-300/60">
            Nível {c.level} · CA {c.armorClass} · PV {c.hp.current}/{c.hp.max} · Chakra {c.chakra.current}/{c.chakra.max}
            {!c.isAlive && ' · caído'}
          </p>
        </div>
        <button
          className="text-[11px] text-orange-400 hover:text-orange-200"
          onClick={() => updateCharacterDirect(tableId, c.id, { visible: !c.visible })}
        >
          {c.visible ? 'visível · ocultar' : 'oculto · mostrar'}
        </button>
        {onOpenCharacter && (
          <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => onOpenCharacter(c.id)}>
            {abertaId === c.id ? 'ficha aberta' : 'abrir ficha'}
          </Button>
        )}
        <SelectDePasta valor={c.folder} pastas={pastas} onMudar={(p) => void moverParaPasta(tableId, 'characters', c.id, p)} />
        <button
          className="text-[11px] text-red-400 hover:text-red-200"
          onClick={() => {
            if (window.confirm(`Apagar a ficha de ${c.name}?`)) void deleteCharacter(tableId, c.id)
          }}
        >
          remover
        </button>
      </div>
    )
  }

  function renderNpc(npc: NPC) {
    return (
      <Card className="flex flex-col gap-1.5 p-3 text-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-orange-100">{npc.name}</p>
          <div className="flex items-center gap-1.5">
            <Badge>{npc.visible ? 'visível' : 'oculto'}</Badge>
            <button
              className="text-xs text-red-400 hover:text-red-200"
              onClick={() => {
                if (window.confirm(`Remover ${npc.name}?`)) void deleteNPC(tableId, npc.id)
              }}
            >
              remover
            </button>
          </div>
        </div>
        <p className="text-xs text-orange-300/60">
          CA {npc.armorClass} · PR {npc.resistancePoints}
          {npc.chakra && ` · Chakra ${npc.chakra.current}/${npc.chakra.max}`}
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-orange-200">
            PV {npc.hp.current}/{npc.hp.max}
          </span>
          <Button variant="danger" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, -5)}>
            −5
          </Button>
          <Button variant="danger" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, -1)}>
            −1
          </Button>
          <Button variant="good" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, 1)}>
            +1
          </Button>
          <Button variant="good" className="px-2 py-0.5 text-xs" onClick={() => applyHp(npc, 5)}>
            +5
          </Button>
        </div>

        {(npc.attacks ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {(npc.attacks ?? []).map((a) => (
              <span key={a.id} className="rounded-sm border border-[color:var(--line)] px-1.5 py-0.5 text-[11px] text-orange-200">
                {a.name} {a.bonus >= 0 ? '+' : ''}
                {a.bonus} · {a.damage}
              </span>
            ))}
          </div>
        )}
        {(npc.jutsus ?? []).length > 0 && (
          <p className="text-[11px] text-orange-400/60">Jutsus: {(npc.jutsus ?? []).map((j) => j.name).join(', ')}</p>
        )}
        {npc.attacksText && <p className="text-xs text-orange-300/70">{npc.attacksText}</p>}
        {npc.notes && <p className="text-xs text-orange-400/50">{npc.notes}</p>}

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="text-xs text-orange-400 hover:text-orange-200"
            onClick={() => updateNPC(tableId, npc.id, { visible: !npc.visible })}
          >
            {npc.visible ? 'ocultar dos jogadores' : 'mostrar aos jogadores'}
          </button>
          <button className="text-xs text-orange-400 hover:text-orange-200" onClick={() => setEditando(editando === npc.id ? null : npc.id)}>
            {editando === npc.id ? 'fechar' : 'golpes e jutsus'}
          </button>
          <SelectDePasta valor={npc.folder} pastas={pastas} onMudar={(p) => void moverParaPasta(tableId, 'npcs', npc.id, p)} />
        </div>

        {editando === npc.id && <EditorDeGolpes tableId={tableId} npc={npc} />}
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-2" data-biblioteca-npcs>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>
          Biblioteca de NPCs ({todas.length})
        </SectionTitle>
        <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="buscar pelo nome..." className="w-48 px-2 py-0.5 text-xs" />
      </div>
      <p className="text-[11px] text-orange-400/50">
        Ficha rápida e ficha completa juntas, em pastas. Para criar uma subpasta, use "mover para → + nova pasta" e escreva
        Cena 01 &gt; Konoha.
      </p>
      {todas.length === 0 ? (
        <p className="text-sm text-orange-300/50">Nenhum NPC ainda.</p>
      ) : (
        <ArvoreDePastas
          itens={visiveis}
          pastas={pastas}
          pastaDe={pastaDaEntrada}
          rotulo={nomeDaEntrada}
          chave={(e) => (e.tipo === 'npc' ? `n:${e.npc.id}` : `c:${e.c.id}`)}
          renderItem={(e) => (e.tipo === 'npc' ? renderNpc(e.npc) : renderFicha(e.c))}
          onMoverPasta={moverPastaDosDois}
          lembrarAbertasEm={`mesa-ninja:pastas-npcs:${tableId}`}
          classeDosItens="grid gap-2 sm:grid-cols-2"
        />
      )}
    </div>
  )
}

/**
 * Golpes prontos e jutsus da criatura.
 *
 * Sem isso o ataque de um bicho ficava só como texto: o mestre lia "Mordida
 * +5, 1d6" e ia fazer a conta na mão. Com nome, bônus e dano guardados, o
 * painel de rolagens resolve em um clique, igual ao jutsu de um personagem.
 */
function EditorDeGolpes({ tableId, npc }: { tableId: string; npc: NPC }) {
  const [nome, setNome] = useState('')
  const [bonus, setBonus] = useState(4)
  const [dano, setDano] = useState('1d6')
  const [tipo, setTipo] = useState('')

  const ataques = npc.attacks ?? []
  const jutsus = npc.jutsus ?? []
  const armas = npc.weapons ?? []
  const [armaNome, setArmaNome] = useState('')
  const [tralha, setTralha] = useState(npc.gearText ?? '')

  async function addAtaque() {
    if (!nome.trim()) return
    const novo: NpcAttack = { id: newId(), name: nome.trim(), bonus, damage: dano.trim() || '1d4', damageType: tipo.trim() || undefined }
    await updateNPC(tableId, npc.id, { attacks: [...ataques, novo] })
    setNome('')
  }


  return (
    <div className="well flex flex-col gap-2 rounded-sm p-2.5">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Golpes prontos</p>
      {ataques.map((a) => (
        <div key={a.id} className="flex items-center gap-2 text-xs text-orange-200">
          <span className="flex-1">
            {a.name} {a.bonus >= 0 ? '+' : ''}
            {a.bonus} · {a.damage} {a.damageType}
          </span>
          <button
            className="text-red-400 hover:text-red-200"
            onClick={() => updateNPC(tableId, npc.id, { attacks: ataques.filter((x) => x.id !== a.id) })}
          >
            remover
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-1.5">
        <Input placeholder="Mordida" value={nome} onChange={(e) => setNome(e.target.value)} className="w-28 px-2 py-0.5 text-xs" />
        <Input
          type="number"
          value={bonus}
          onChange={(e) => setBonus(Number(e.target.value) || 0)}
          className="w-16 px-2 py-0.5 text-xs"
          title="bônus de ataque"
        />
        <Input placeholder="1d6+2" value={dano} onChange={(e) => setDano(e.target.value)} className="w-24 px-2 py-0.5 text-xs" />
        <Input placeholder="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-24 px-2 py-0.5 text-xs" />
        <Button variant="secondary" className="px-2 py-0.5 text-[11px]" disabled={!nome.trim()} onClick={addAtaque}>
          + golpe
        </Button>
      </div>

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
        Jutsus da criatura
        <span className="ml-1 normal-case tracking-normal text-orange-400/40">— invocações de Rank C ou mais conjuram</span>
      </p>
      {jutsus.map((j) => (
        <div key={j.id} className="flex items-center gap-2 text-xs text-orange-200">
          <span className="flex-1">
            {j.name} {j.chakraCost && <span className="text-orange-400/60">({j.chakraCost})</span>}
          </span>
          <button
            className="text-red-400 hover:text-red-200"
            onClick={() => updateNPC(tableId, npc.id, { jutsus: jutsus.filter((x) => x.id !== j.id) })}
          >
            remover
          </button>
        </div>
      ))}
      <EscolherJutsu
        jaTem={jutsus.map((j) => j.name)}
        rotuloBotao="+ jutsu"
        onEscolher={(cat) =>
          updateNPC(tableId, npc.id, {
            jutsus: [
              ...jutsus,
              { id: newId(), name: cat.name, details: `${cat.classification} · ${cat.rank}`, chakraCost: cat.cost },
            ],
          })
        }
      />

      {/* Armas e tralha: a criatura usa o que carrega, e o grupo saqueia o
          resto. Editável aqui também para o mestre ajustar no meio da cena,
          sem ter que voltar ao bestiário. */}
      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
        Armas e ferramentas
        <span className="ml-1 normal-case tracking-normal text-orange-400/40">— viram golpe nas Rolagens do mestre</span>
      </p>
      {armas.map((w) => (
        <div key={w.id} className="flex items-center gap-2 text-xs text-orange-200">
          <span className="flex-1">
            {w.name} <span className="text-orange-400/60">· {w.damage}</span>
          </span>
          <button
            className="text-red-400 hover:text-red-200"
            onClick={() => updateNPC(tableId, npc.id, { weapons: armas.filter((x) => x.id !== w.id) })}
          >
            remover
          </button>
        </div>
      ))}
      <div className="flex flex-wrap items-end gap-1.5">
        <Select value={armaNome} onChange={(e) => setArmaNome(e.target.value)} className="w-56 px-2 py-0.5 text-xs">
          <option value="">escolha uma arma...</option>
          {WEAPONS.map((w) => (
            <option key={w.name} value={w.name}>
              {w.name} · {w.damage} {w.damageType}
            </option>
          ))}
        </Select>
        <Button
          variant="secondary"
          className="px-2 py-0.5 text-[11px]"
          disabled={!armaNome}
          onClick={async () => {
            const cat = WEAPONS.find((w) => w.name === armaNome)
            if (!cat) return
            await updateNPC(tableId, npc.id, {
              weapons: [...armas, { ...weaponFromCatalog(cat), id: newId(), equipped: true }],
            })
            setArmaNome('')
          }}
        >
          + arma
        </Button>
      </div>
      <label className="flex flex-col gap-1 text-[11px] text-orange-400/60">
        o que mais ela carrega
        <Input
          value={tralha}
          placeholder="Pergaminho selado, 200 ryo, um frasco de veneno"
          className="px-2 py-0.5 text-xs"
          onChange={(e) => setTralha(e.target.value)}
          onBlur={() => updateNPC(tableId, npc.id, { gearText: tralha })}
        />
      </label>

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Peça no mapa</p>
      <TokenArtEditor ficha={npc} onGravar={(patch) => updateNPC(tableId, npc.id, patch)} />

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Para conjurar e resistir</p>
      <div className="flex flex-wrap items-end gap-1.5">
        {(['intelligence', 'wisdom', 'dexterity', 'constitution'] as AttributeKey[]).map((k) => (
          <label key={k} className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
            {ATTRIBUTE_LABELS[k]}
            <Input
              type="number"
              value={npc.modifiers?.[k] ?? 0}
              onChange={(e) => {
                const zero = Object.fromEntries(ATTRIBUTE_KEYS.map((a) => [a, 0])) as Record<AttributeKey, number>
                updateNPC(tableId, npc.id, { modifiers: { ...zero, ...npc.modifiers, [k]: Number(e.target.value) || 0 } })
              }}
              className="w-16 px-2 py-0.5 text-xs"
            />
          </label>
        ))}
        <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
          Chakra máx.
          <Input
            type="number"
            value={npc.chakra?.max ?? 0}
            onChange={(e) => {
              const max = Math.max(0, Number(e.target.value) || 0)
              updateNPC(tableId, npc.id, { chakra: { current: max, max } })
            }}
            className="w-20 px-2 py-0.5 text-xs"
          />
        </label>
      </div>

      <p className="mt-1 font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
        Afinidade elemental
      </p>
      <div className="flex flex-wrap items-center gap-2">
        {ELEMENTS.map((el) => {
          const tem = (npc.elements ?? []).includes(el)
          return (
            <label key={el} className="flex items-center gap-1 text-[11px] text-orange-200">
              <input
                type="checkbox"
                checked={tem}
                onChange={() => {
                  const atuais = npc.elements ?? []
                  updateNPC(tableId, npc.id, {
                    elements: tem ? atuais.filter((x) => x !== el) : [...atuais, el],
                  })
                }}
              />
              {el}
            </label>
          )
        })}
        <span className="text-[10px] text-orange-400/50">
          usada na Vantagem Elemental (Fogo &gt; Vento &gt; Raio &gt; Terra &gt; Água &gt; Fogo)
        </span>
      </div>
    </div>
  )
}
