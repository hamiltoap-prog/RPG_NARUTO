import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select } from './ui'
import {
  addLogEntry,
  applyJutsuCast,
  createJutsuCast,
  denyJutsuCast,
  listenMyJutsuCasts,
  listenPendingJutsuCasts,
} from '../lib/store'
import { attackAlternatives, attackAttribute, findCatalogEntry, readJutsu, resolveCast } from '../lib/jutsuCast'
import { clanElements, elementAdvantage, jutsuElement } from '../lib/jutsuAccess'
import { ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Character, Clan, GameTable, JutsuCast, NPC } from '../types'

/** Acha o alvo pela referência "character:id" / "npc:id". */
function acharAlvo(ref: string | undefined, characters: Character[], npcs: NPC[]) {
  if (!ref) return undefined
  const [kind, id] = ref.split(':')
  return kind === 'character' ? characters.find((c) => c.id === id) : npcs.find((n) => n.id === id)
}

/** Afinidades de quem vai levar o golpe: as da ficha mais as do clã. */
function afinidadesDoAlvo(alvo: Character | NPC | undefined, clans: Clan[]): string[] {
  if (!alvo) return []
  const proprias = alvo.elements ?? []
  if (!('clanId' in alvo)) return proprias
  const clan = clans.find((c) => c.id === alvo.clanId)
  return [...proprias, ...clanElements(clan)]
}

/**
 * Lançar jutsu, com a conta feita pelo app.
 *
 * O que o app resolve sozinho: o atributo de ataque pela classificação, a
 * rolagem contra a CA do alvo (ou a resistência contra o PR dele), o crítico
 * pela regra do manual (dados × proficiência), o dano e o desconto do chakra.
 *
 * O que ele NÃO adivinha: o manual descreve cada jutsu em texto corrido, e só
 * parte dele é legível por máquina. Então tudo que foi lido da descrição fica
 * à vista e editável antes de lançar — é honesto, e evita que o app erre com
 * cara de certeza.
 */
export function JutsuCastCard({
  table,
  character,
  characters,
  npcs,
  clans,
  requesterUid,
  asGM,
}: {
  table: GameTable
  character: Character
  characters: Character[]
  npcs: NPC[]
  clans: Clan[]
  requesterUid: string
  asGM: boolean
}) {
  const [jutsuName, setJutsuName] = useState('')
  const [alvoRef, setAlvoRef] = useState('')
  const [modo, setModo] = useState<'attack' | 'save' | 'none'>('attack')
  const [atributo, setAtributo] = useState<AttributeKey>('intelligence')
  const [proficiente, setProficiente] = useState(true)
  const [saveAttr, setSaveAttr] = useState<AttributeKey>('constitution')
  const [dano, setDano] = useState('')
  const [custo, setCusto] = useState(0)
  const [naResistencia, setNaResistencia] = useState<'none' | 'half'>('none')
  const [aviso, setAviso] = useState('')
  const [meus, setMeus] = useState<JutsuCast[]>([])
  /** Vantagem elemental: o app sugere, a mesa confirma. */
  const [comVantagem, setComVantagem] = useState(false)

  useEffect(() => listenMyJutsuCasts(table.id, character.id, setMeus), [table.id, character.id])

  const entrada = useMemo(() => (jutsuName ? findCatalogEntry(jutsuName) : undefined), [jutsuName])

  // Ao escolher o jutsu, o app lê a descrição e preenche o que conseguiu.
  useEffect(() => {
    if (!entrada) return
    const lido = readJutsu(entrada)
    setModo(lido.mode)
    setAtributo(attackAttribute(entrada.classification))
    setSaveAttr(lido.saveAttribute ?? 'constitution')
    setDano(lido.damage ?? '')
    setCusto(lido.cost)
  }, [entrada])

  const alvos = [
    ...characters.filter((c) => c.id !== character.id && (!c.isNPC || c.visible || asGM)).map((c) => ({ ref: `character:${c.id}`, name: c.name })),
    ...npcs.filter((n) => n.visible || asGM).map((n) => ({ ref: `npc:${n.id}`, name: n.name })),
  ]
  const alvo = acharAlvo(alvoRef, characters, npcs)

  // Vantagem Elemental (05-combate.md): ciclo Fogo > Vento > Raio > Terra >
  // Água > Fogo — quem usa o elemento superior ataca com Vantagem. O app só
  // consegue ver isso quando o alvo tem afinidade declarada na ficha; quando
  // vê, já marca a caixa, e quem lança pode desmarcar.
  const elementoDoJutsu = entrada ? jutsuElement(entrada) : null
  const superado = elementAdvantage(elementoDoJutsu, afinidadesDoAlvo(alvo, clans))
  const motivoVantagem = superado ? `${elementoDoJutsu} supera ${superado}` : ''
  useEffect(() => setComVantagem(Boolean(superado)), [superado])

  const semChakra = character.chakra.current < custo
  const pendente = meus.find((c) => c.status === 'pending')
  const ultimo = meus.find((c) => c.status !== 'pending')

  async function lancar() {
    if (!jutsuName) return
    const base = {
      casterId: character.id,
      casterName: character.name,
      requesterUid,
      jutsuName,
      classification: entrada?.classification ?? 'Ninjutsu',
      chakraCost: custo,
      mode: modo,
      attackAttribute: atributo,
      proficient: proficiente,
      saveAttribute: modo === 'save' ? saveAttr : undefined,
      damage: dano.trim() || undefined,
      damageType: entrada ? readJutsu(entrada).damageType : undefined,
      onSaveSuccess: naResistencia,
      targetRef: alvoRef || undefined,
      targetName: alvo?.name,
      edge: modo === 'attack' && comVantagem ? ('advantage' as const) : ('none' as const),
      edgeReason: modo === 'attack' && comVantagem ? motivoVantagem || 'vantagem da mesa' : undefined,
    }

    // O mestre resolve na hora; o jogador entra na fila.
    if (asGM) {
      const cast = await createJutsuCast(table.id, base)
      await resolverCast(table, cast, character, characters, npcs, table.gmName)
      setAviso('Lançado.')
      return
    }
    await createJutsuCast(table.id, base)
    setAviso('Pedido enviado — aguardando o mestre liberar.')
  }

  if (character.jutsus.length === 0) return null

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Lançar jutsu</SectionTitle>
        {custo > 0 && (
          <Badge tone={semChakra ? 'bad' : 'default'}>
            {custo} de chakra · você tem {character.chakra.current}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          jutsu
          <Select value={jutsuName} onChange={(e) => setJutsuName(e.target.value)}>
            <option value="">Escolha um dos seus jutsus...</option>
            {character.jutsus.map((j) => (
              <option key={j.id} value={j.name}>
                {j.name}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          alvo (opcional)
          <Select value={alvoRef} onChange={(e) => setAlvoRef(e.target.value)}>
            <option value="">Sem alvo — só narrar</option>
            {alvos.map((a) => (
              <option key={a.ref} value={a.ref}>
                {a.name}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {jutsuName && (
        <div className="well flex flex-col gap-2 rounded-sm p-3">
          <p className="font-display text-xs uppercase tracking-[0.12em] text-orange-400/60">
            O que o app leu da descrição — ajuste se o jutsu pedir outra coisa
          </p>

          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              resolve como
              <Select value={modo} onChange={(e) => setModo(e.target.value as typeof modo)} className="w-44">
                <option value="attack">Ataque contra a CA</option>
                <option value="save">Resistência contra o PR</option>
                <option value="none">Sem rolagem</option>
              </Select>
            </label>

            {modo === 'attack' && (
              <>
                <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                  atributo
                  <Select value={atributo} onChange={(e) => setAtributo(e.target.value as AttributeKey)} className="w-36">
                    {attackAlternatives(entrada?.classification ?? 'Ninjutsu').map((a) => (
                      <option key={a} value={a}>
                        {ATTRIBUTE_LABELS[a]} ({character.modifiers[a] >= 0 ? '+' : ''}
                        {character.modifiers[a]})
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="flex items-center gap-1.5 pb-1.5 text-xs text-orange-200">
                  <input type="checkbox" checked={proficiente} onChange={(e) => setProficiente(e.target.checked)} />
                  proficiente (+{character.proficiencyBonus})
                </label>
                <label className="flex items-center gap-1.5 pb-1.5 text-xs text-orange-200" title="Ciclo Fogo > Vento > Raio > Terra > Água > Fogo: quem usa o elemento superior rola com Vantagem (dois d20, vale o melhor).">
                  <input type="checkbox" checked={comVantagem} onChange={(e) => setComVantagem(e.target.checked)} />
                  vantagem {motivoVantagem ? `(${motivoVantagem})` : 'na rolagem'}
                </label>
              </>
            )}

            {modo === 'save' && (
              <>
                <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                  alvo resiste com
                  <Select value={saveAttr} onChange={(e) => setSaveAttr(e.target.value as AttributeKey)} className="w-40">
                    {(Object.keys(ATTRIBUTE_LABELS) as AttributeKey[]).map((a) => (
                      <option key={a} value={a}>
                        {ATTRIBUTE_LABELS[a]}
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                  se resistir
                  <Select
                    value={naResistencia}
                    onChange={(e) => setNaResistencia(e.target.value as 'none' | 'half')}
                    className="w-36"
                  >
                    <option value="none">sem dano</option>
                    <option value="half">metade do dano</option>
                  </Select>
                </label>
              </>
            )}

            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              dano
              <Input value={dano} onChange={(e) => setDano(e.target.value)} placeholder="4d6" className="w-24" />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              chakra
              <Input type="number" min={0} value={custo} onChange={(e) => setCusto(Number(e.target.value) || 0)} className="w-20" />
            </label>
          </div>

          {alvo && (
            <p className="text-xs text-orange-400/60">
              {alvo.name}: CA {alvo.armorClass} · PR {alvo.resistancePoints} · PV {alvo.hp.current}/{alvo.hp.max}
            </p>
          )}
          {entrada && <p className="line-clamp-3 text-xs leading-relaxed text-orange-300/50">{entrada.description}</p>}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" disabled={!jutsuName || semChakra || Boolean(pendente)} onClick={lancar}>
          {pendente ? 'Já há um jutsu na fila' : asGM ? 'Lançar agora' : 'Pedir para lançar'}
        </Button>
        {semChakra && custo > 0 && <span className="text-xs text-red-300">Chakra insuficiente.</span>}
      </div>

      {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}
      {ultimo?.resultSummary && <p className="text-xs text-orange-300/70">Último: {ultimo.resultSummary}</p>}
      {ultimo?.status === 'denied' && (
        <p className="text-xs text-red-300">
          Último negado{ultimo.deniedReason ? `: ${ultimo.deniedReason}` : ''}.
        </p>
      )}
    </Card>
  )
}

/** Rola, aplica e registra — usado tanto pelo mestre quanto na liberação. */
async function resolverCast(
  table: GameTable,
  cast: JutsuCast,
  caster: Character,
  characters: Character[],
  npcs: NPC[],
  gmName: string,
) {
  const alvo = acharAlvo(cast.targetRef, characters, npcs)
  const condicoesDoAlvo = cast.targetRef
    ? (table.combatOrder.find((p) => p.ref === cast.targetRef)?.conditions ?? []).map((c) => c.name)
    : []

  const fora = resolveCast({
    caster,
    jutsuName: cast.jutsuName,
    classification: cast.classification,
    mode: cast.mode,
    attackAttribute: cast.attackAttribute,
    proficient: cast.proficient,
    saveAttribute: cast.saveAttribute,
    damage: cast.damage,
    damageType: cast.damageType,
    onSaveSuccess: cast.onSaveSuccess,
    target: alvo,
    targetConditions: condicoesDoAlvo,
    edge: cast.edge ?? 'none',
    edgeReason: cast.edgeReason,
  })

  const [kind, id] = (cast.targetRef ?? ':').split(':')
  await applyJutsuCast(
    table.id,
    cast,
    caster,
    alvo && fora.targetHp !== undefined
      ? { kind: kind as 'character' | 'npc', id, hpAfter: fora.targetHp, hp: alvo.hp }
      : null,
    fora.summary,
  )

  await addLogEntry(table.id, {
    actorName: cast.casterName,
    actorType: 'player',
    characterId: cast.casterId,
    kind: 'combat',
    summary: `${fora.summary}${cast.chakraCost ? ` (−${cast.chakraCost} chakra)` : ''}`,
    dice: fora.dice,
    diceSides: fora.diceSides,
    diceLabel: cast.jutsuName,
  })
  return { fora, gmName }
}

/** Fila de jutsus esperando o mestre. */
export function JutsuCastQueue({
  table,
  characters,
  npcs,
}: {
  table: GameTable
  characters: Character[]
  npcs: NPC[]
}) {
  const [casts, setCasts] = useState<JutsuCast[]>([])
  const [reason, setReason] = useState<Record<string, string>>({})

  useEffect(() => listenPendingJutsuCasts(table.id, setCasts), [table.id])

  if (casts.length === 0) return null

  return (
    <Card className="flex flex-col gap-2 p-4">
      <SectionTitle>Jutsus a liberar ({casts.length})</SectionTitle>
      {casts.map((c) => {
        const caster = characters.find((x) => x.id === c.casterId)
        const alvo = acharAlvo(c.targetRef, characters, npcs)
        return (
          <div key={c.id} className="well flex flex-wrap items-center gap-2 rounded-sm p-2 text-sm">
            <span className="text-orange-100">
              <b className="text-white">{c.casterName}</b> lança <b className="text-[color:var(--orange)]">{c.jutsuName}</b>
              {alvo ? (
                <>
                  {' '}
                  em <b className="text-white">{alvo.name}</b>
                </>
              ) : (
                ' sem alvo'
              )}
            </span>
            <span className="text-xs text-orange-400/60">
              {c.mode === 'attack' ? `ataque por ${ATTRIBUTE_LABELS[c.attackAttribute]}` : c.mode === 'save' ? `resistência de ${ATTRIBUTE_LABELS[c.saveAttribute ?? 'constitution']}` : 'sem rolagem'}
              {c.damage && ` · ${c.damage}`}
              {c.chakraCost > 0 && ` · ${c.chakraCost} chakra`}
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <Input
                placeholder="motivo (se negar)"
                value={reason[c.id] ?? ''}
                onChange={(e) => setReason((p) => ({ ...p, [c.id]: e.target.value }))}
                className="w-40 px-2 py-0.5 text-xs"
              />
              <Button
                variant="good"
                className="px-2 py-0.5 text-[11px]"
                disabled={!caster}
                onClick={() => caster && resolverCast(table, c, caster, characters, npcs, table.gmName)}
              >
                liberar
              </Button>
              <Button
                variant="danger"
                className="px-2 py-0.5 text-[11px]"
                onClick={async () => {
                  await denyJutsuCast(table.id, c.id, table.gmName, reason[c.id] ?? '')
                  await addLogEntry(table.id, {
                    actorName: table.gmName,
                    actorType: 'gm',
                    kind: 'system',
                    summary: `Negou ${c.jutsuName} de ${c.casterName}${reason[c.id] ? `: ${reason[c.id]}` : ''}.`,
                  })
                }}
              >
                negar
              </Button>
            </span>
          </div>
        )
      })}
    </Card>
  )
}
