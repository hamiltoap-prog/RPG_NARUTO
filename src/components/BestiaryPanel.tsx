import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, TabChip, Textarea } from './ui'
import { SUMMON_BESTIARY } from '../data/summons'
import { newId } from '../lib/id'
import { ehLinkDoDrive, normalizeImageUrl } from '../lib/imageUrl'
import { AvisoDoDrive } from './AvisoDoDrive'
import { createNPC, deleteBestiaryEntry, listenBestiary, saveBestiaryEntry } from '../lib/store'
import { summonSize } from '../lib/summon'
import { allJutsus, ehDaCasa } from '../lib/jutsuCatalog'
import { ELEMENTS } from '../lib/jutsuAccess'
import { WEAPONS } from '../data/equipment'
import { weaponFromCatalog } from '../lib/equipment'
import { TokenArtEditor } from './TokenArtEditor'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS, CREATURE_KIND_LABELS, SUMMON_RANKS, SUMMON_SIZES } from '../types'
import type {
  AttributeKey,
  BestiaryEntry,
  CreatureKind,
  GameTable,
  NpcAttack,
  SummonCreature,
  SummonSizeKey,
} from '../types'

type Aba = 'minhas' | 'manual'

/** Média de um dado, para sugerir PV sem obrigar o mestre a rolar. */
function mediaDoDado(notacao: string): number {
  const lados = Number(notacao.replace(/\D/g, '')) || 6
  return (lados + 1) / 2
}

/**
 * Bestiário.
 *
 * Duas camadas: as 17 tribos de invocação do manual, iguais em toda mesa e
 * só de leitura, e as criaturas que o mestre inventa, que ficam na mesa dele.
 * A ficha é a mesma para NPC, animal, monstro, chefe e invocação — muda o
 * rótulo e o quanto o mestre resolve preencher.
 *
 * Nada disso é visível ao grupo: a criatura só aparece para os jogadores
 * quando o mestre a põe na mesa, e aí ela vira um NPC como outro qualquer.
 */
export function BestiaryPanel({ table }: { table: GameTable }) {
  const [aba, setAba] = useState<Aba>('minhas')
  const [entries, setEntries] = useState<BestiaryEntry[]>([])
  const [editando, setEditando] = useState<BestiaryEntry | null>(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => listenBestiary(table.id, setEntries), [table.id])

  function nova(base?: Partial<BestiaryEntry>): BestiaryEntry {
    return {
      id: newId(),
      tableId: table.id,
      kind: 'monster',
      name: '',
      description: '',
      armorClass: 12,
      hp: { current: 10, max: 10 },
      resistancePoints: 12,
      attackModifier: 3,
      attacksText: '',
      skills: '',
      specialFeatures: '',
      notes: '',
      chakra: { current: 0, max: 0 },
      createdAt: Date.now(),
      ...base,
    }
  }

  /**
   * Puxa uma tribo do manual para uma ficha editável, com o rank e o tamanho
   * escolhidos.
   *
   * CA, PR, Bônus de Ataque e Dado de Dano saem da tabela de Modificadores de
   * Tamanho, como o manual manda — antes o app usava o Dado de Vida da tribo
   * como dado de dano e um PR genérico, o que não era o que está escrito.
   */
  function doManual(c: SummonCreature, rankIdx: number, size: SummonSizeKey): BestiaryEntry {
    const r = SUMMON_RANKS[rankIdx]
    const t = summonSize(size)
    const pv = Math.round(r.dice * mediaDoDado(c.hitDie))
    return nova({
      kind: 'summon',
      sourceId: c.id,
      size,
      name: `${c.name} (Rank ${r.rank} · ${r.title})`,
      description: c.description,
      hp: { current: pv, max: pv },
      armorClass: 10 + t.acBonus,
      resistancePoints: t.resistancePoints,
      attackModifier: Number(c.attackModifier.replace(/[^\d-]/g, '')) || 3,
      attacksText: c.naturalWeapons,
      skills: [c.skills, `Resistências: ${c.saves}`].filter(Boolean).join('\n'),
      specialFeatures: c.specialFeatures,
      notes:
        `Tribo ${c.summonType} · ${r.dice} DV (${c.hitDie}) / ${r.dice} DC (${c.chakraDie}) · custo ${r.cost} de chakra.\n` +
        `Tamanho ${t.name}: CA ${t.acBonus >= 0 ? '+' : ''}${t.acBonus}, PR ${t.resistancePoints}, ataque +${t.attackBonus}, dano ${t.damageDie}.\n` +
        'PV sugerido pela média dos dados — ajuste à vontade.',
    })
  }

  /**
   * Nomes das armas naturais, que no manual vêm como títulos soltos antes da
   * descrição ("Garras", "Mordida"). É o suficiente para montar um golpe
   * pronto e o mestre não precisar digitar tudo de novo.
   */
  function armasDe(texto: string): string[] {
    return texto
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && l.length < 28 && !/[.:]$/.test(l) && !/^(ataque|dano|alcance)/i.test(l))
      .slice(0, 3)
  }

  /**
   * Põe a criatura na mesa: vira NPC, e aí o grupo passa a vê-la.
   *
   * Leva os golpes prontos junto — sem isso o ataque do bicho ficava só como
   * texto e o mestre fazia a conta na mão toda vez. O dado de dano parte do
   * Dado de Vida da tribo, que é o que o manual usa como "Dado de Dano" das
   * armas naturais; o mestre ajusta se a mesa entender diferente.
   */
  async function porNaMesa(e: BestiaryEntry) {
    const t = summonSize(e.size)
    // O Dado de Dano da arma natural vem do tamanho (04b-invocacoes.md), e o
    // bônus de ataque soma o da tribo com o do tamanho.
    const dadoDeDano = e.kind === 'summon' ? t.damageDie : '1d6'
    const bonusDeAtaque = e.kind === 'summon' ? e.attackModifier + t.attackBonus : e.attackModifier
    const golpes: NpcAttack[] = armasDe(e.attacksText).map((nome) => ({
      id: newId(),
      name: nome,
      bonus: bonusDeAtaque,
      damage: dadoDeDano,
    }))
    await createNPC(table.id, {
      tableId: table.id,
      name: e.name,
      armorClass: e.armorClass,
      hp: { ...e.hp },
      resistancePoints: e.resistancePoints,
      attacksText: [e.attacksText, e.specialFeatures].filter(Boolean).join('\n\n'),
      notes: e.notes,
      visible: false,
      createdAt: Date.now(),
      imageUrl: e.imageUrl,
      attacks: golpes.length > 0 ? golpes : [{ id: newId(), name: 'Ataque', bonus: bonusDeAtaque, damage: dadoDeDano }],
      proficiencyBonus: 3,
      // Levam o tamanho e as pontuações brutas: é com elas que a invocação
      // faz os próprios testes ("1d4 + atributo bruto contra o próprio PR").
      summonSize: e.kind === 'summon' ? (e.size ?? 'M') : undefined,
      attributes: e.attributes,
      // A ficha inteira vai junto: jutsus, armas, tralha, chakra, afinidade e
      // a arte da peça. Antes disto a criatura chegava como um resumo e o
      // mestre remontava tudo à mão a cada encontro.
      jutsus: e.jutsus,
      weapons: e.weapons,
      gearText: e.gearText,
      chakra: e.chakra,
      modifiers: e.modifiers,
      elements: e.elements,
      level: e.level,
      tokenUrl: e.tokenUrl,
      tokenMode: e.tokenMode,
    })
    const levou = [
      `${golpes.length || 1} golpe(s)`,
      (e.jutsus ?? []).length > 0 ? `${e.jutsus!.length} jutsu(s)` : '',
      (e.weapons ?? []).length > 0 ? `${e.weapons!.length} arma(s)` : '',
    ].filter(Boolean)
    setAviso(
      `${e.name} entrou na mesa como NPC, oculto, com ${levou.join(', ')}. ` +
        'Marque "visível" na aba NPCs quando o grupo encontrar a criatura.',
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Bestiário</SectionTitle>
          <div className="flex gap-1.5">
            <TabChip active={aba === 'minhas'} className="px-2.5 py-1 text-xs" onClick={() => setAba('minhas')}>
              Minhas criaturas ({entries.length})
            </TabChip>
            <TabChip active={aba === 'manual'} className="px-2.5 py-1 text-xs" onClick={() => setAba('manual')}>
              Invocações do manual ({SUMMON_BESTIARY.length})
            </TabChip>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-orange-400/60">
          Só você vê esta aba. A criatura aparece para o grupo quando você a põe na mesa — ela vira um NPC, entra na
          lista de adversários e pode virar peça no mapa.
        </p>
        {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}
      </Card>

      {aba === 'minhas' && (
        <>
          <Button variant="primary" className="self-start" onClick={() => setEditando(nova())}>
            + Nova criatura
          </Button>
          {editando && (
            <FichaCriatura
              entry={editando}
              onCancel={() => setEditando(null)}
              onSave={async (e) => {
                await saveBestiaryEntry(table.id, e)
                setEditando(null)
              }}
            />
          )}
          <div className="grid gap-2 sm:grid-cols-2">
            {entries.map((e) => (
              <Card key={e.id} className="flex flex-col gap-2 p-3">
                <div className="flex items-start gap-2">
                  <Avatar url={e.imageUrl} name={e.name} size={44} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm uppercase tracking-[0.06em] text-white">{e.name}</p>
                    <p className="text-xs text-orange-400/60">
                      <Badge>{CREATURE_KIND_LABELS[e.kind]}</Badge>{' '}
                      <span className="ml-1">
                        CA {e.armorClass} · PV {e.hp.max} · PR {e.resistancePoints} · atq +{e.attackModifier}
                      </span>
                    </p>
                  </div>
                </div>
                {e.description && <p className="line-clamp-3 text-xs text-orange-300/60">{e.description}</p>}
                <div className="flex flex-wrap gap-1.5">
                  <Button variant="good" className="px-2 py-0.5 text-[11px]" onClick={() => porNaMesa(e)}>
                    pôr na mesa
                  </Button>
                  <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => setEditando(e)}>
                    editar
                  </Button>
                  <button
                    className="text-[11px] text-red-400 hover:text-red-200"
                    onClick={() => deleteBestiaryEntry(table.id, e.id)}
                  >
                    remover
                  </button>
                </div>
              </Card>
            ))}
            {entries.length === 0 && !editando && (
              <p className="text-sm text-orange-300/50">
                Nenhuma criatura sua ainda. Crie uma do zero ou puxe uma tribo do manual na outra aba.
              </p>
            )}
          </div>
        </>
      )}

      {aba === 'manual' && (
        <ManualList
          onUse={(c, r, t) => {
            // A ficha é editada na aba das criaturas do mestre — sem esta
            // troca, o botão abriria um formulário invisível na outra aba.
            setEditando(doManual(c, r, t))
            setAba('minhas')
          }}
        />
      )}
    </div>
  )
}

function ManualList({ onUse }: { onUse: (c: SummonCreature, rankIdx: number, size: SummonSizeKey) => void }) {
  const [busca, setBusca] = useState('')
  const [rankIdx, setRankIdx] = useState(0)
  /** O manual tira CA, PR, bônus de ataque e dado de dano do TAMANHO, não da
   * tribo — então o tamanho é escolhido junto com o rank. */
  const [size, setSize] = useState<SummonSizeKey>('M')
  const lista = useMemo(() => {
    const t = busca.trim().toLowerCase()
    return t ? SUMMON_BESTIARY.filter((c) => c.name.toLowerCase().includes(t) || c.summonType.toLowerCase().includes(t)) : SUMMON_BESTIARY
  }, [busca])

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-wrap items-end gap-2 p-3">
        <Input placeholder="Buscar tribo..." value={busca} onChange={(e) => setBusca(e.target.value)} className="w-56" />
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          rank da invocação
          <Select value={rankIdx} onChange={(e) => setRankIdx(Number(e.target.value))} className="w-56">
            {SUMMON_RANKS.map((r, i) => (
              <option key={r.rank} value={i}>
                Rank {r.rank} · {r.title} · {r.dice} DV · {r.cost} chakra
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          tamanho
          <Select value={size} onChange={(e) => setSize(e.target.value as SummonSizeKey)} className="w-72">
            {SUMMON_SIZES.map((t) => (
              <option key={t.key} value={t.key}>
                {t.name} · CA {t.acBonus >= 0 ? '+' : ''}{t.acBonus} · PR {t.resistancePoints} · atq +{t.attackBonus} · dano {t.damageDie}
              </option>
            ))}
          </Select>
        </label>
        <p className="basis-full text-[11px] text-orange-400/50">
          A tabela de Modificadores de Tamanho do manual é que define CA, Pontos de Resistência, Bônus de Ataque e Dado
          de Dano da invocação — por isso o tamanho vem antes da ficha.
        </p>
      </Card>
      <div className="grid gap-2 sm:grid-cols-2">
        {lista.map((c) => (
          <Card key={c.id} className="flex flex-col gap-2 p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="font-display text-sm uppercase tracking-[0.06em] text-white">{c.name}</p>
              <Badge>{c.summonType}</Badge>
            </div>
            <p className="text-xs text-orange-300/60">{c.description}</p>
            <p className="text-xs text-orange-400/60">
              DV {c.hitDie} · DC {c.chakraDie} · atq {c.attackModifier} · resist. {c.saves}
            </p>
            <details className="text-xs text-orange-300/60">
              <summary className="cursor-pointer text-orange-400/60">ficha completa</summary>
              <div className="mt-1 flex flex-col gap-1 whitespace-pre-line">
                {c.skills && <p><b className="text-orange-200">Perícias/sentidos:</b>{'\n'}{c.skills}</p>}
                {c.naturalWeapons && <p><b className="text-orange-200">Armas naturais:</b>{'\n'}{c.naturalWeapons}</p>}
                {c.specialFeatures && <p><b className="text-orange-200">Características:</b>{'\n'}{c.specialFeatures}</p>}
              </div>
            </details>
            <Button variant="secondary" className="self-start px-2 py-0.5 text-[11px]" onClick={() => onUse(c, rankIdx, size)}>
              criar ficha desta tribo
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function FichaCriatura({
  entry,
  onSave,
  onCancel,
}: {
  entry: BestiaryEntry
  onSave: (e: BestiaryEntry) => Promise<void>
  onCancel: () => void
}) {
  const [d, setD] = useState<BestiaryEntry>(entry)
  const set = <K extends keyof BestiaryEntry>(k: K, v: BestiaryEntry[K]) => setD((p) => ({ ...p, [k]: v }))

  return (
    <Card className="flex flex-col gap-3 p-4">
      <SectionTitle>{entry.name ? `Editando ${entry.name}` : 'Nova criatura'}</SectionTitle>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          nome
          <Input value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="Zabuza, Lobo de Konoha..." />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          tipo
          <Select value={d.kind} onChange={(e) => set('kind', e.target.value as CreatureKind)} className="w-36">
            {(Object.keys(CREATURE_KIND_LABELS) as CreatureKind[]).map((k) => (
              <option key={k} value={k}>
                {CREATURE_KIND_LABELS[k]}
              </option>
            ))}
          </Select>
        </label>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          URL da arte
          <Input
            value={d.imageUrl ?? ''}
            onChange={(e) => set('imageUrl', e.target.value)}
            onBlur={() => set('imageUrl', normalizeImageUrl(d.imageUrl) ?? '')}
            placeholder="https://... (link do Drive também serve)"
          />
          {ehLinkDoDrive(d.imageUrl) && <AvisoDoDrive />}
        </label>
        {d.imageUrl && <Avatar url={d.imageUrl} name={d.name || '?'} size={44} />}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ['armorClass', 'CA'],
            ['resistancePoints', 'PR'],
            ['attackModifier', 'bônus de ataque'],
          ] as const
        ).map(([k, label]) => (
          <label key={k} className="flex flex-col gap-1 text-xs text-orange-400/60">
            {label}
            <Input type="number" value={d[k]} onChange={(e) => set(k, Number(e.target.value) || 0)} />
          </label>
        ))}
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          PV máximo
          <Input
            type="number"
            value={d.hp.max}
            onChange={(e) => {
              const max = Number(e.target.value) || 0
              set('hp', { current: max, max })
            }}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          nível
          <Input
            type="number"
            min={0}
            value={d.level ?? ''}
            placeholder="—"
            onChange={(e) => set('level', e.target.value === '' ? undefined : Number(e.target.value) || 0)}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          chakra
          <Input
            type="number"
            min={0}
            value={d.chakra?.max ?? 0}
            onChange={(e) => {
              const max = Number(e.target.value) || 0
              set('chakra', { current: max, max })
            }}
          />
        </label>
      </div>

      <div className="well flex flex-col gap-2 rounded-sm p-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            tamanho (define CA, PR, ataque e dado de dano)
            <Select
              value={d.size ?? 'M'}
              onChange={(e) => {
                const chave = e.target.value as SummonSizeKey
                const t = summonSize(chave)
                setD({ ...d, size: chave, armorClass: 10 + t.acBonus, resistancePoints: t.resistancePoints })
              }}
              className="w-72"
            >
              {SUMMON_SIZES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name} · CA {t.acBonus >= 0 ? '+' : ''}
                  {t.acBonus} · PR {t.resistancePoints} · atq +{t.attackBonus} · dano {t.damageDie}
                </option>
              ))}
            </Select>
          </label>
        </div>
        <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
          Pontuações de atributo (valor bruto)
        </p>
        <p className="text-[11px] leading-relaxed text-orange-400/50">
          A invocação testa atributo e resistência com <b className="text-orange-300/70">1d4 + o valor bruto</b> (ex.:
          Força 15, e não o modificador +2) contra o <b className="text-orange-300/70">próprio PR</b> — é um subsistema
          separado do resto do manual. Preencha aqui e o app resolve o teste na aba Rolagens.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ATTRIBUTE_KEYS.map((k) => (
            <label key={k} className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
              {ATTRIBUTE_LABELS[k].slice(0, 3).toUpperCase()}
              <Input
                type="number"
                value={d.attributes?.[k] ?? 10}
                onChange={(e) => {
                  const base = d.attributes ?? (Object.fromEntries(ATTRIBUTE_KEYS.map((a) => [a, 10])) as Record<AttributeKey, number>)
                  setD({ ...d, attributes: { ...base, [k]: Number(e.target.value) || 0 } })
                }}
                className="px-2 py-0.5 text-xs"
              />
            </label>
          ))}
        </div>
      </div>

      <FichaDaCriatura ficha={d} onChange={setD} />

      {(
        [
          ['description', 'Descrição'],
          ['attacksText', 'Ataques'],
          ['skills', 'Perícias e sentidos'],
          ['specialFeatures', 'Características especiais'],
          ['notes', 'Anotações (só suas)'],
        ] as const
      ).map(([k, label]) => (
        <label key={k} className="flex flex-col gap-1 text-xs text-orange-400/60">
          {label}
          <Textarea rows={k === 'description' || k === 'notes' ? 2 : 3} value={d[k]} onChange={(e) => set(k, e.target.value)} />
        </label>
      ))}

      <div className="flex gap-2">
        <Button variant="primary" disabled={!d.name.trim()} onClick={() => onSave(d)}>
          Guardar no bestiário
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </Card>
  )
}

/**
 * O que faz a criatura ter ficha, e não só números: jutsus, armas, tralha,
 * afinidade e a peça do mapa.
 *
 * Tudo aqui vai junto quando o mestre põe a criatura na mesa. O app **não
 * barra** por nível: quem decide se um bicho sabe jutsu é o mestre, não uma
 * regra de tela. O que ele faz é avisar quando o nível e o chakra contam
 * histórias diferentes — um bicho com jutsu e zero de chakra não lança nada.
 */
function FichaDaCriatura({ ficha, onChange }: { ficha: BestiaryEntry; onChange: (e: BestiaryEntry) => void }) {
  const [jutsuBusca, setJutsuBusca] = useState('')
  const [jutsuNome, setJutsuNome] = useState('')
  const [armaNome, setArmaNome] = useState('')

  const jutsus = ficha.jutsus ?? []
  const armas = ficha.weapons ?? []
  // Sem memo de propósito: um `useMemo` preso à busca não reagiria ao catálogo
  // da mesa chegar depois (ele vem por listen), e o mestre veria a lista sem os
  // jutsus que ele mesmo escreveu. Filtrar 631 itens por render não custa nada.
  const catalogo = (() => {
    const t = jutsuBusca.trim().toLowerCase()
    const todos = allJutsus()
    const achados = t ? todos.filter((j) => j.name.toLowerCase().includes(t)) : todos
    // Os da casa primeiro: são os que a mesa escreveu e os que ela procura.
    const daCasa = achados.filter((j) => ehDaCasa(j.name))
    const doManual = achados.filter((j) => !ehDaCasa(j.name))
    return [...daCasa, ...doManual].slice(0, 40)
  })()

  const semChakra = jutsus.length > 0 && (ficha.chakra?.max ?? 0) === 0

  function addJutsu() {
    const cat = allJutsus().find((j) => j.name === jutsuNome)
    if (!cat || jutsus.some((j) => j.name === cat.name)) return
    onChange({
      ...ficha,
      jutsus: [...jutsus, { id: newId(), name: cat.name, details: `${cat.classification} · ${cat.rank}`, chakraCost: cat.cost }],
    })
    setJutsuNome('')
  }

  function addArma() {
    const cat = WEAPONS.find((w) => w.name === armaNome)
    if (!cat) return
    onChange({ ...ficha, weapons: [...armas, { ...weaponFromCatalog(cat), id: newId(), equipped: true }] })
    setArmaNome('')
  }

  return (
    <div className="well flex flex-col gap-3 rounded-sm p-3">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
        Ficha da criatura — vai junto quando ela entrar na mesa
      </p>

      {/* Jutsus */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-orange-400/60">
          Jutsus {ficha.level ? `(nível ${ficha.level})` : ''}
        </p>
        {jutsus.map((j) => (
          <div key={j.id} className="flex flex-wrap items-center gap-2 rounded-sm border border-[color:var(--line)] px-2 py-1 text-xs">
            <span className="min-w-0 flex-1 break-words text-orange-100">{j.name}</span>
            {j.chakraCost && <span className="shrink-0 text-[11px] text-orange-400/60">{j.chakraCost}</span>}
            <button
              className="shrink-0 text-[11px] text-red-400 hover:text-red-200"
              onClick={() => onChange({ ...ficha, jutsus: jutsus.filter((x) => x.id !== j.id) })}
            >
              tirar
            </button>
          </div>
        ))}
        <div className="flex flex-wrap items-end gap-1.5">
          <Input
            placeholder="procurar jutsu"
            value={jutsuBusca}
            onChange={(e) => setJutsuBusca(e.target.value)}
            className="w-40 px-2 py-0.5 text-xs"
          />
          <Select value={jutsuNome} onChange={(e) => setJutsuNome(e.target.value)} className="min-w-0 flex-1 px-2 py-0.5 text-xs">
            <option value="">Escolha um jutsu do catálogo...</option>
            {catalogo
              .filter((j) => !jutsus.some((x) => x.name === j.name))
              .map((j) => (
                <option key={j.name} value={j.name}>
                  {ehDaCasa(j.name) ? '★ ' : ''}
                  {j.name} · {j.rank}
                  {j.cost ? ` · ${j.cost}` : ''}
                </option>
              ))}
          </Select>
          <Button variant="secondary" className="px-2 py-0.5 text-[11px]" disabled={!jutsuNome} onClick={addJutsu}>
            dar jutsu
          </Button>
        </div>
        {semChakra && (
          <p className="text-[11px] text-amber-300/80">
            Esta criatura tem jutsu mas zero de chakra — na mesa ela não vai conseguir lançar nenhum. Ponha chakra
            acima, ou deixe assim de propósito se a mesa quiser que ela lance uma vez só.
          </p>
        )}
      </div>

      {/* Armas e tralha */}
      <div className="flex flex-col gap-1.5">
        <p className="text-xs text-orange-400/60">Armas e ferramentas — viram golpe na hora de agir</p>
        {armas.map((w) => (
          <div key={w.id} className="flex flex-wrap items-center gap-2 rounded-sm border border-[color:var(--line)] px-2 py-1 text-xs">
            <span className="min-w-0 flex-1 break-words text-orange-100">
              {w.name} <span className="text-orange-400/60">· {w.damage}</span>
            </span>
            <button
              className="shrink-0 text-[11px] text-red-400 hover:text-red-200"
              onClick={() => onChange({ ...ficha, weapons: armas.filter((x) => x.id !== w.id) })}
            >
              tirar
            </button>
          </div>
        ))}
        <div className="flex flex-wrap items-end gap-1.5">
          <Select value={armaNome} onChange={(e) => setArmaNome(e.target.value)} className="min-w-0 flex-1 px-2 py-0.5 text-xs">
            <option value="">Escolha uma arma do catálogo...</option>
            {WEAPONS.map((w) => (
              <option key={w.name} value={w.name}>
                {w.name} · {w.damage} {w.damageType}
              </option>
            ))}
          </Select>
          <Button variant="secondary" className="px-2 py-0.5 text-[11px]" disabled={!armaNome} onClick={addArma}>
            dar arma
          </Button>
        </div>
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          o que mais ela carrega (espólio, tralha)
          <Textarea
            rows={2}
            value={ficha.gearText ?? ''}
            placeholder="Pergaminho selado, 200 ryo, um frasco de veneno"
            onChange={(e) => onChange({ ...ficha, gearText: e.target.value })}
          />
        </label>
      </div>

      {/* Afinidade e peça */}
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="text-xs text-orange-400/60">Afinidade elemental (Vantagem Elemental vale nos dois sentidos)</p>
          <div className="flex flex-wrap gap-1">
            {ELEMENTS.map((el) => {
              const tem = (ficha.elements ?? []).includes(el)
              return (
                <button
                  key={el}
                  className={`rounded-sm border px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.08em] ${
                    tem
                      ? 'border-[color:var(--orange)] text-[color:var(--orange)]'
                      : 'border-[color:var(--line)] text-orange-400/50 hover:text-orange-200'
                  }`}
                  onClick={() =>
                    onChange({
                      ...ficha,
                      elements: tem ? (ficha.elements ?? []).filter((x) => x !== el) : [...(ficha.elements ?? []), el],
                    })
                  }
                >
                  {el}
                </button>
              )
            })}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-1">
          <p className="text-xs text-orange-400/60">Peça no mapa</p>
          <TokenArtEditor ficha={ficha} compacto onGravar={(patch) => onChange({ ...ficha, ...patch })} />
        </div>
      </div>
    </div>
  )
}
