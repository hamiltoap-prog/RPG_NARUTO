import { useEffect, useMemo, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select } from './ui'
import {
  addCompanionTokens,
  addLogEntry,
  applyJutsuCast,
  createCompanions,
  createJutsuCast,
  denyJutsuCast,
  listenMyJutsuCasts,
  listenPendingJutsuCasts,
  removeCompanionTokens,
} from '../lib/store'
import type { CastChakraSource } from '../lib/store'
import { buildClones, buildPuppet, buildSummon, readClone } from '../lib/companions'
import { CLASSES } from '../data/classes'
import {
  attackAlternatives,
  attackAttribute,
  companionAsCaster,
  findCatalogEntry,
  readJutsu,
  resolveCast,
} from '../lib/jutsuCast'
import { clanElements, elementAdvantage, jutsuElement } from '../lib/jutsuAccess'
import { ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, Character, Clan, Companion, GameTable, JutsuCast, NPC } from '../types'

/** Tudo que pode ser alvo ou agir: ficha, NPC e ficha temporária. */
export interface MesaViva {
  characters: Character[]
  npcs: NPC[]
  companions: Companion[]
}

/** Acha o alvo pela referência "character:id" / "npc:id" / "companion:id". */
export function acharAlvo(ref: string | undefined, mesa: MesaViva) {
  if (!ref) return undefined
  const [kind, id] = ref.split(':')
  if (kind === 'character') return mesa.characters.find((c) => c.id === id)
  if (kind === 'npc') return mesa.npcs.find((n) => n.id === id)
  return mesa.companions.find((c) => c.id === id)
}

/**
 * A lista de alvos da mesa.
 *
 * Clone, invocação e marionete entram: eles estão em campo, ocupam espaço e
 * levam golpe como qualquer um. Marionete quebrada sai da lista — já está
 * fora de jogo. Um conjurador nunca aparece como alvo de si mesmo.
 */
export function alvosDaMesa(mesa: MesaViva, semRef: string | undefined, asGM: boolean) {
  return [
    ...mesa.characters
      .filter((c) => `character:${c.id}` !== semRef && (!c.isNPC || c.visible || asGM))
      .map((c) => ({ ref: `character:${c.id}`, name: c.name })),
    ...mesa.npcs
      .filter((n) => (n.visible || asGM) && `npc:${n.id}` !== semRef)
      .map((n) => ({ ref: `npc:${n.id}`, name: n.name })),
    ...mesa.companions
      .filter((c) => c.status !== 'broken' && `companion:${c.id}` !== semRef)
      .map((c) => ({ ref: `companion:${c.id}`, name: `${c.name} (de ${c.ownerName})` })),
  ]
}

/** Afinidades de quem vai levar o golpe: as da ficha mais as do clã. */
function afinidadesDoAlvo(alvo: Character | NPC | Companion | undefined, clans: Clan[]): string[] {
  if (!alvo) return []
  const proprias = 'elements' in alvo ? (alvo.elements ?? []) : []
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
  mesa,
  clans,
  requesterUid,
  asGM,
}: {
  table: GameTable
  character: Character
  mesa: MesaViva
  clans: Clan[]
  requesterUid: string
  asGM: boolean
}) {
  /** O que vai ser usado: "arma:<id>" de uma arma da ficha, ou o nome do jutsu. */
  const [acao, setAcao] = useState('')
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

  /** Armas que dão para usar: equipadas e com unidade sobrando. */
  const armasProntas = character.weapons.filter((w) => w.equipped && (w.quantity ?? 1) > 0)
  const arma = acao.startsWith('arma:') ? armasProntas.find((w) => `arma:${w.id}` === acao) : undefined
  const jutsuName = arma ? '' : acao

  const entrada = useMemo(() => (jutsuName ? findCatalogEntry(jutsuName) : undefined), [jutsuName])

  // Ao escolher, o app preenche o que consegue ler. Arma é direto — o manual
  // diz "1d20 + atributo + proficiência contra a CA" e o dano é o dado da
  // arma, sem somar modificador (05-combate.md). Jutsu vem do texto.
  useEffect(() => {
    if (arma) {
      setModo('attack')
      // "Acuidade" é o que libera Destreza em arma corpo a corpo; arma de
      // arremesso/alcance é Destreza direto (tabela de Mecânica de ataque).
      const distancia = /Arremesso|Alcance/i.test(arma.properties ?? '')
      const acuidade = /Acuidade/i.test(arma.properties ?? '')
      setAtributo(distancia || acuidade ? 'dexterity' : 'strength')
      setDano(arma.damage || '1d4')
      setCusto(0)
      return
    }
    if (!entrada) return
    const lido = readJutsu(entrada)
    setModo(lido.mode)
    setAtributo(attackAttribute(entrada.classification))
    setSaveAttr(lido.saveAttribute ?? 'constitution')
    setDano(lido.damage ?? '')
    setCusto(lido.cost)
  }, [arma, entrada])

  const alvos = alvosDaMesa(mesa, `character:${character.id}`, asGM)
  const alvo = acharAlvo(alvoRef, mesa)

  // Vantagem Elemental (05-combate.md): ciclo Fogo > Vento > Raio > Terra >
  // Água > Fogo — quem usa o elemento superior ataca com Vantagem. O app só
  // consegue ver isso quando o alvo tem afinidade declarada na ficha; quando
  // vê, já marca a caixa, e quem lança pode desmarcar.
  const elementoDoJutsu = entrada && !arma ? jutsuElement(entrada) : null
  const superado = elementAdvantage(elementoDoJutsu, afinidadesDoAlvo(alvo, clans))
  const motivoVantagem = superado ? `${elementoDoJutsu} supera ${superado}` : ''
  useEffect(() => setComVantagem(Boolean(superado)), [superado])

  const semChakra = character.chakra.current < custo
  const pendente = meus.find((c) => c.status === 'pending')
  const ultimo = meus.find((c) => c.status !== 'pending')

  async function lancar() {
    if (!acao) return
    const base = {
      casterId: character.id,
      casterName: character.name,
      requesterUid,
      jutsuName: arma ? arma.name : jutsuName,
      classification: arma ? 'Bukijutsu' : (entrada?.classification ?? 'Ninjutsu'),
      chakraCost: custo,
      // Arma de arremesso sai da mão: a resolução desconta a unidade da ficha.
      weaponId: arma?.id,
      consumesWeapon: arma?.consumable === true,
      mode: modo,
      attackAttribute: atributo,
      proficient: proficiente,
      saveAttribute: modo === 'save' ? saveAttr : undefined,
      damage: dano.trim() || undefined,
      damageType: arma ? arma.damageType : entrada ? readJutsu(entrada).damageType : undefined,
      onSaveSuccess: naResistencia,
      targetRef: alvoRef || undefined,
      targetName: alvo?.name,
      edge: modo === 'attack' && comVantagem ? ('advantage' as const) : ('none' as const),
      edgeReason: modo === 'attack' && comVantagem ? motivoVantagem || 'vantagem da mesa' : undefined,
    }

    // O mestre resolve na hora; o jogador entra na fila.
    if (asGM) {
      const cast = await createJutsuCast(table.id, base)
      await resolverCast(table, cast, mesa, table.gmName)
      setAviso('Lançado.')
      return
    }
    await createJutsuCast(table.id, base)
    setAviso('Pedido enviado — aguardando o mestre liberar.')
  }

  if (character.jutsus.length === 0 && armasProntas.length === 0) return null

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Atacar ou lançar jutsu</SectionTitle>
        {custo > 0 && (
          <Badge tone={semChakra ? 'bad' : 'default'}>
            {custo} de chakra · você tem {character.chakra.current}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          o que você faz
          <Select value={acao} onChange={(e) => setAcao(e.target.value)}>
            <option value="">Escolha uma arma ou um jutsu...</option>
            {armasProntas.length > 0 && (
              <optgroup label="Armas equipadas">
                {armasProntas.map((w) => (
                  <option key={w.id} value={`arma:${w.id}`}>
                    {w.name} · {w.damage}
                    {(w.quantity ?? 1) > 1 ? ` (${w.quantity})` : ''}
                    {w.consumable ? ' · gasta 1' : ''}
                  </option>
                ))}
              </optgroup>
            )}
            {character.jutsus.length > 0 && (
              <optgroup label="Jutsus">
                {character.jutsus.map((j) => (
                  <option key={j.id} value={j.name}>
                    {j.name}
                  </option>
                ))}
              </optgroup>
            )}
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

      {acao && (
        <div className="well flex flex-col gap-2 rounded-sm p-3">
          <p className="font-display text-xs uppercase tracking-[0.12em] text-orange-400/60">
            {arma
              ? `Ataque com ${arma.name}${arma.properties ? ` — ${arma.properties}` : ''}`
              : 'O que o app leu da descrição — ajuste se o jutsu pedir outra coisa'}
          </p>
          {arma?.consumable && (
            <p className="text-xs text-orange-300/60">
              Arremessada: o ataque desconta 1 das {arma.quantity ?? 1} unidades da ficha.
            </p>
          )}

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
                    {attackAlternatives(arma ? 'Bukijutsu' : (entrada?.classification ?? 'Ninjutsu')).map((a) => (
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
        <Button variant="primary" disabled={!acao || semChakra || Boolean(pendente)} onClick={lancar}>
          {pendente
            ? 'Já há uma ação na fila'
            : asGM
              ? arma
                ? 'Atacar agora'
                : 'Lançar agora'
              : arma
                ? 'Pedir para atacar'
                : 'Pedir para lançar'}
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

/** Monta as fichas que o pedido pediu, a partir da ficha viva de quem lançou. */
function montarCompanions(cast: JutsuCast, caster: Character): Companion[] {
  const pedido = cast.companion
  if (!pedido) return []
  const uid = caster.ownerUid
  if (pedido.kind === 'clone') {
    const entrada = pedido.cloneJutsu ? findCatalogEntry(pedido.cloneJutsu) : undefined
    if (!entrada) return []
    const classe = CLASSES.find((c) => c.id === caster.classId)
    return buildClones({
      owner: caster,
      ownerUid: uid,
      jutsuName: pedido.cloneJutsu!,
      reading: readClone(entrada),
      count: pedido.count,
      chakraDie: classe?.chakraDie,
    })
  }
  if (pedido.kind === 'puppet') {
    if (!pedido.puppetSpec || !pedido.puppetItemId) return []
    const marionete = buildPuppet({
      owner: caster,
      ownerUid: uid,
      puppetItemId: pedido.puppetItemId,
      name: pedido.puppetName ?? 'Marionete',
      spec: pedido.puppetSpec,
    })
    return marionete ? [marionete] : []
  }
  const invocada = buildSummon({
    owner: caster,
    ownerUid: uid,
    tribeId: pedido.tribeId ?? '',
    rankIndex: pedido.rankIndex ?? 0,
    size: pedido.size ?? 'M',
  })
  return invocada ? [invocada] : []
}

/**
 * Rola, aplica e registra — usado tanto pelo mestre quanto na liberação.
 *
 * Quem age pode ser uma ficha de personagem ou uma ficha temporária. Os três
 * casos das temporárias:
 *  - **clone**: rola com os próprios modificadores, e o jutsu dele sai pela
 *    metade do dano, como o manual manda;
 *  - **invocação**: rola com os próprios;
 *  - **marionete**: rola com os modificadores do DONO (quem manobra é o
 *    ninja) mais o bônus do golpe, e o chakra sai da ficha do dono.
 */
export async function resolverCast(table: GameTable, cast: JutsuCast, mesa: MesaViva, gmName: string) {
  const alvo = acharAlvo(cast.targetRef, mesa)
  const condicoesDoAlvo = cast.targetRef
    ? (table.combatOrder.find((p) => p.ref === cast.targetRef)?.conditions ?? []).map((c) => c.name)
    : []

  const ficha = mesa.characters.find((c) => c.id === cast.casterId)
  const temporaria = cast.casterKind === 'companion' ? mesa.companions.find((c) => c.id === cast.casterId) : undefined
  const dono = temporaria ? mesa.characters.find((c) => c.id === temporaria.ownerCharacterId) : undefined
  const quemAge = temporaria ? companionAsCaster(temporaria, dono) : ficha
  if (!quemAge) throw new Error('Quem lançou não está mais na mesa.')

  const fora = resolveCast({
    caster: quemAge,
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
    extraBonus: cast.extraBonus,
    damageHalved: cast.damageHalved,
  })

  // De quem sai o chakra: a marionete não tem, então cobra do dono.
  const pagador: CastChakraSource = temporaria
    ? temporaria.usesOwnerChakra && dono
      ? { kind: 'character', id: dono.id, chakra: dono.chakra }
      : { kind: 'companion', id: temporaria.id, chakra: temporaria.chakra }
    : { kind: 'character', id: ficha!.id, chakra: ficha!.chakra, weapons: ficha!.weapons }

  const [kind, id] = (cast.targetRef ?? ':').split(':')
  const alvoTemporario = kind === 'companion' ? mesa.companions.find((c) => c.id === id) : undefined
  await applyJutsuCast(
    table.id,
    cast,
    pagador,
    alvo && fora.targetHp !== undefined
      ? {
          kind: kind as 'character' | 'npc' | 'companion',
          id,
          hpAfter: fora.targetHp,
          hp: alvo.hp,
          companionKind: alvoTemporario?.kind,
        }
      : null,
    fora.summary,
  )

  // Ficha temporária que chegou a 0 sai do jogo — e a peça dela some do mapa
  // junto, para o mestre não precisar limpar na mão.
  let avisoDoFim = ''
  if (alvoTemporario && fora.targetHp === 0) {
    await removeCompanionTokens(table.id, [alvoTemporario.id])
    avisoDoFim =
      alvoTemporario.kind === 'puppet'
        ? ` — ${alvoTemporario.name} quebrou e saiu de jogo; o item continua na mochila, esperando conserto`
        : ` — ${alvoTemporario.name} se desfez`
  }

  // Jutsu de clone ou invocação: as fichas temporárias nascem aqui, junto com
  // o desconto do chakra, e as peças aparecem ao lado da do dono na cena
  // atual (se ele estiver no tabuleiro).
  let avisoDasFichas = ''
  if (cast.companion && ficha) {
    const fichas = montarCompanions(cast, ficha)
    if (fichas.length > 0) {
      await createCompanions(table.id, fichas)
      const pecas = await addCompanionTokens(table.id, ficha.id, fichas)
      avisoDasFichas =
        ` — ${fichas.length} ficha(s) temporária(s) criada(s)` +
        (pecas > 0 ? ` e ${pecas} peça(s) no mapa` : ' (o personagem não está na tela de jogo, então nenhuma peça entrou)')
    }
  }

  await addLogEntry(table.id, {
    actorName: cast.casterName,
    actorType: 'player',
    characterId: temporaria ? temporaria.ownerCharacterId : cast.casterId,
    kind: 'combat',
    summary: `${fora.summary}${cast.chakraCost ? ` (−${cast.chakraCost} chakra)` : ''}${avisoDasFichas}${avisoDoFim}`,
    dice: fora.dice,
    diceSides: fora.diceSides,
    diceLabel: cast.jutsuName,
  })
  return { fora, gmName }
}

/** Fila de jutsus esperando o mestre. */
export function JutsuCastQueue({ table, mesa }: { table: GameTable; mesa: MesaViva }) {
  const [casts, setCasts] = useState<JutsuCast[]>([])
  const [reason, setReason] = useState<Record<string, string>>({})

  useEffect(() => listenPendingJutsuCasts(table.id, setCasts), [table.id])

  if (casts.length === 0) return null

  return (
    <Card className="flex flex-col gap-2 p-4">
      <SectionTitle>Jutsus a liberar ({casts.length})</SectionTitle>
      {casts.map((c) => {
        const quemAge =
          c.casterKind === 'companion'
            ? mesa.companions.find((x) => x.id === c.casterId)
            : mesa.characters.find((x) => x.id === c.casterId)
        const alvo = acharAlvo(c.targetRef, mesa)
        return (
          <div key={c.id} className="well flex flex-wrap items-center gap-2 rounded-sm p-2 text-sm">
            <span className="text-orange-100">
              <b className="text-white">{c.casterName}</b> {c.weaponId ? 'ataca com' : 'lança'}{' '}
              <b className="text-[color:var(--orange)]">{c.jutsuName}</b>
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
                disabled={!quemAge}
                onClick={() => quemAge && resolverCast(table, c, mesa, table.gmName)}
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
