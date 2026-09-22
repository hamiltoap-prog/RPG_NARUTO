import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { CLASSES } from '../data/classes'
import { SUMMON_BESTIARY } from '../data/summons'
import {
  biggestChakraDie,
  cloneArmorClass,
  companionActions,
  isCloneJutsu,
  isSummonJutsu,
  readClone,
  refundOnDismiss,
  summonCost,
} from '../lib/companions'
import { findCatalogEntry } from '../lib/jutsuCast'
import { summonSize } from '../lib/summon'
import { alvosDaMesa } from './JutsuCastPanel'
import type { MesaViva } from './JutsuCastPanel'
import {
  createChangeRequest,
  createJutsuCast,
  deleteCompanion,
  dismissCompanions,
  listenCompanions,
  removeCompanionTokens,
  updateCompanion,
} from '../lib/store'
import { ATTRIBUTE_LABELS, SUMMON_RANKS, SUMMON_SIZES } from '../types'
import type { Character, Companion, GameTable, JutsuCast, ShopItem, SummonSizeKey } from '../types'

/**
 * Clones, invocações e marionetes: fichas temporárias que se joga de verdade.
 *
 * A primeira versão só mostrava os números. Aqui elas **agem**: escolhem um
 * golpe ou jutsu, escolhem alvo entre tudo que está em campo, e a rolagem
 * passa pela mesma máquina do lançamento de jutsu — com aprovação do mestre
 * para o jogador, e na hora para o mestre.
 *
 * As três diferem no que importa:
 *  - **clone** rola com os modificadores do dono e o jutsu sai pela metade;
 *  - **invocação** rola com o bônus fechado da tribo e do tamanho;
 *  - **marionete** rola com o dono mais o bônus do golpe, e gasta o chakra
 *    dele, porque marionete não tem chakra.
 *
 * Fim de vida: a 0 PV clone e invocação somem sozinhos; a marionete quebra e
 * fica esperando o conserto do mestre. Desfazendo na mão, metade do chakra
 * que sobrou volta para quem invocou.
 */
export function CompanionCard({
  table,
  character,
  mesa,
  shopItems,
  requesterUid,
  asGM,
  onResolveNow,
}: {
  table: GameTable
  character: Character
  mesa: MesaViva
  shopItems: ShopItem[]
  requesterUid: string
  asGM: boolean
  /** O mestre resolve na hora; o jogador entra na fila. */
  onResolveNow: (cast: JutsuCast) => Promise<void>
}) {
  const [aba, setAba] = useState<'clone' | 'invocacao' | 'marionete'>('clone')
  const [jutsuClone, setJutsuClone] = useState('')
  const [quantos, setQuantos] = useState(1)
  const [triboId, setTriboId] = useState('')
  const [rankIdx, setRankIdx] = useState(0)
  const [tamanho, setTamanho] = useState<SummonSizeKey>('M')
  const [marioneteItemId, setMarioneteItemId] = useState('')
  const [aviso, setAviso] = useState('')
  const [todas, setTodas] = useState<Companion[]>([])

  useEffect(() => listenCompanions(table.id, setTodas), [table.id])

  const minhas = todas.filter((c) => c.ownerCharacterId === character.id)
  const emCampo = minhas.filter((c) => c.status !== 'broken')
  const quebradas = minhas.filter((c) => c.status === 'broken')
  const clonesQueSei = character.jutsus.filter((j) => isCloneJutsu(j.name))
  const seiInvocar = character.jutsus.some((j) => isSummonJutsu(j.name))
  const classe = CLASSES.find((c) => c.id === character.classId)

  /** Marionetes que estão na mochila e ainda não foram postas em campo. */
  const marionetesNaMochila = character.equipment
    .filter((i) => i.puppetId)
    .map((i) => ({ item: i, forjada: shopItems.find((s) => s.id === i.puppetId) }))
    .filter((m): m is { item: (typeof character.equipment)[number]; forjada: ShopItem } => Boolean(m.forjada?.puppet))
  const jaEmCampo = new Set(minhas.map((c) => c.puppetItemId))

  const entrada = useMemo(() => (jutsuClone ? findCatalogEntry(jutsuClone) : undefined), [jutsuClone])
  const leitura = useMemo(() => (entrada ? readClone(entrada) : null), [entrada])
  useEffect(() => {
    if (leitura) setQuantos(Math.max(1, leitura.maxClones))
  }, [leitura])

  const custoClone = leitura
    ? (leitura.costPerClone ?? Number((entrada?.cost ?? '').match(/\d+/)?.[0] ?? 0)) * (leitura.costPerClone ? quantos : 1)
    : 0
  const marioneteEscolhida = marionetesNaMochila.find((m) => m.item.id === marioneteItemId)
  const custoMarionete = marioneteEscolhida?.forjada.puppet?.activationCost ?? 0
  const custo = aba === 'clone' ? custoClone : aba === 'invocacao' ? summonCost(rankIdx) : custoMarionete
  const semChakra = character.chakra.current < custo

  const caDoClone = leitura ? cloneArmorClass(leitura.armor, character) : 0
  const chakraDoClone = leitura?.chakra === 'chakraDie' ? biggestChakraDie(classe?.chakraDie) : 0
  const t = summonSize(tamanho)

  async function pedir() {
    const base = {
      casterId: character.id,
      casterName: character.name,
      requesterUid,
      jutsuName:
        aba === 'clone' ? jutsuClone : aba === 'invocacao' ? 'Técnica de Invocação' : `Manobrar ${marioneteEscolhida?.forjada.name ?? 'marionete'}`,
      classification: 'Ninjutsu',
      chakraCost: custo,
      mode: 'none' as const,
      attackAttribute: 'intelligence' as const,
      proficient: false,
      companion:
        aba === 'clone'
          ? { kind: 'clone' as const, count: quantos, cloneJutsu: jutsuClone }
          : aba === 'invocacao'
            ? { kind: 'summon' as const, count: 1, tribeId: triboId, rankIndex: rankIdx, size: tamanho }
            : {
                kind: 'puppet' as const,
                count: 1,
                puppetItemId: marioneteEscolhida?.forjada.id,
                puppetName: marioneteEscolhida?.forjada.name,
                puppetSpec: marioneteEscolhida?.forjada.puppet,
              },
    }
    const cast = await createJutsuCast(table.id, base)
    if (asGM) {
      await onResolveNow(cast)
      setAviso('Feito — a ficha está aqui embaixo.')
      return
    }
    setAviso('Pedido enviado — o mestre libera e as fichas aparecem aqui.')
  }

  /**
   * Desfazer: a ficha sai de jogo na hora, e o retorno de metade do chakra
   * entra na fila do mestre, porque um jogador não escreve o próprio chakra
   * sem passar por ele — é assim com qualquer mudança de ficha.
   */
  async function desfazer(c: Companion) {
    const volta = refundOnDismiss(c)
    await deleteCompanion(table.id, c.id)
    await removeCompanionTokens(table.id, [c.id]).catch(() => undefined)
    if (volta <= 0) {
      setAviso(`${c.name} saiu de jogo.`)
      return
    }
    const novo = Math.min(character.chakra.max, character.chakra.current + volta)
    if (asGM) {
      await onResolveNowChakra(novo, c, volta)
      return
    }
    await createChangeRequest(table.id, {
      characterId: character.id,
      characterName: character.name,
      ownerUid: requesterUid,
      fields: ['chakra'],
      summary: `Desfez ${c.name}: metade do chakra que sobrou volta (+${volta})`,
      patch: { chakra: { current: novo, max: character.chakra.max } },
      previous: { chakra: character.chakra },
    })
    setAviso(`${c.name} saiu de jogo. O retorno de ${volta} de chakra está na fila do mestre.`)
  }

  /** O mestre não precisa de fila: o retorno cai na hora. */
  async function onResolveNowChakra(novo: number, c: Companion, volta: number) {
    const { updateCharacterDirect, addLogEntry } = await import('../lib/store')
    await updateCharacterDirect(table.id, character.id, { chakra: { current: novo, max: character.chakra.max } })
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      characterId: character.id,
      kind: 'system',
      summary: `${c.name} foi desfeita: ${character.name} recuperou ${volta} de chakra`,
    })
    setAviso(`${c.name} saiu de jogo e ${volta} de chakra voltou.`)
  }

  async function desfazerTodas() {
    const ids = emCampo.map((c) => c.id)
    await dismissCompanions(table.id, ids)
    await removeCompanionTokens(table.id, ids).catch(() => undefined)
    setAviso('Todas saíram de jogo. O retorno de chakra só vale ao desfazer uma de cada vez.')
  }

  async function mexerPv(c: Companion, delta: number) {
    const { applyCompanionHp } = await import('../lib/store')
    await applyCompanionHp(table.id, c, c.hp.current + delta)
    if (c.hp.current + delta <= 0) await removeCompanionTokens(table.id, [c.id]).catch(() => undefined)
  }

  const semNada = clonesQueSei.length === 0 && !seiInvocar && marionetesNaMochila.length === 0 && minhas.length === 0
  if (semNada) return null

  type Aba = 'clone' | 'invocacao' | 'marionete'
  const abasDisponiveis: [Aba, string][] = [
    ...(clonesQueSei.length > 0 ? ([['clone', 'Clone']] as [Aba, string][]) : []),
    ...(seiInvocar ? ([['invocacao', 'Invocação']] as [Aba, string][]) : []),
    ...(marionetesNaMochila.length > 0 ? ([['marionete', 'Marionete']] as [Aba, string][]) : []),
  ]

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Clones, invocações e marionetes</SectionTitle>
        {emCampo.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge>{emCampo.length} em campo</Badge>
            <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={desfazerTodas}>
              guardar todas
            </Button>
          </div>
        )}
      </div>

      {abasDisponiveis.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {abasDisponiveis.map(([k, label]) => (
            <TabChip key={k} active={aba === k} className="px-3 py-1 text-xs" onClick={() => setAba(k)}>
              {label}
            </TabChip>
          ))}
        </div>
      )}

      {aba === 'clone' && clonesQueSei.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 flex-wrap items-end gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-orange-400/60">
              jutsu de clone
              <Select value={jutsuClone} onChange={(e) => setJutsuClone(e.target.value)}>
                <option value="">Escolha...</option>
                {clonesQueSei.map((j) => (
                  <option key={j.id} value={j.name}>
                    {j.name}
                  </option>
                ))}
              </Select>
            </label>
            {leitura?.sheetWorthy && (
              <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                quantos (máx. {leitura.maxClones})
                <Input
                  type="number"
                  min={1}
                  max={leitura.maxClones}
                  value={quantos}
                  onChange={(e) => setQuantos(Math.max(1, Math.min(leitura.maxClones, Number(e.target.value) || 1)))}
                  className="w-24"
                />
              </label>
            )}
          </div>

          {leitura && !leitura.sheetWorthy && (
            <p className="text-xs text-amber-300">
              Este jutsu não descreve um clone com PV e CA próprios — é efeito, não corpo. Use o cartão de lançar jutsu.
            </p>
          )}

          {leitura?.sheetWorthy && (
            <div className="well flex flex-col gap-1 rounded-sm p-3 text-xs">
              <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">
                O que o app leu da descrição
              </p>
              <p className="text-orange-200">
                {quantos} clone(s) · {leitura.hp} PV cada · CA {caDoClone}
                {leitura.armor.from === 'attribute' && ' (sua pontuação de Inteligência, não o modificador)'}
                {' · '}
                {chakraDoClone > 0 ? `${chakraDoClone} de chakra temporário` : 'sem chakra'} · PR {character.resistancePoints}
              </p>
              {leitura.halfDamage && <p className="text-orange-300/60">Jutsus lançados pelo clone causam metade do dano.</p>}
              {leitura.duration && <p className="text-orange-300/60">Duração: {leitura.duration}.</p>}
            </div>
          )}
        </div>
      )}

      {aba === 'invocacao' && seiInvocar && (
        <div className="flex flex-col gap-2">
          <div className="flex min-w-0 flex-wrap items-end gap-2">
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-xs text-orange-400/60">
              tribo
              <Select value={triboId} onChange={(e) => setTriboId(e.target.value)}>
                <option value="">Escolha...</option>
                {SUMMON_BESTIARY.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.summonType})
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              rank
              <Select value={rankIdx} onChange={(e) => setRankIdx(Number(e.target.value))} className="w-full sm:w-56">
                {SUMMON_RANKS.map((r, i) => (
                  <option key={r.rank} value={i}>
                    Rank {r.rank} · {r.title} · {r.cost} chakra
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              tamanho
              <Select value={tamanho} onChange={(e) => setTamanho(e.target.value as SummonSizeKey)} className="w-full sm:w-56">
                {SUMMON_SIZES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name} · CA {10 + s.acBonus} · PR {s.resistancePoints} · dano {s.damageDie}
                  </option>
                ))}
              </Select>
            </label>
          </div>
          <p className="text-xs text-orange-300/60">
            O tamanho define CA {10 + t.acBonus}, PR {t.resistancePoints}, ataque +{t.attackBonus} e dano {t.damageDie}.
          </p>
        </div>
      )}

      {aba === 'marionete' && marionetesNaMochila.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="flex min-w-0 flex-col gap-1 text-xs text-orange-400/60">
            marionete na mochila
            <Select value={marioneteItemId} onChange={(e) => setMarioneteItemId(e.target.value)}>
              <option value="">Escolha...</option>
              {marionetesNaMochila.map((m) => (
                <option key={m.item.id} value={m.item.id} disabled={jaEmCampo.has(m.forjada.id)}>
                  {m.forjada.name}
                  {jaEmCampo.has(m.forjada.id) ? ' — já está em campo' : ''}
                </option>
              ))}
            </Select>
          </label>
          {marioneteEscolhida?.forjada.puppet && (
            <div className="well flex flex-col gap-1 rounded-sm p-3 text-xs">
              <p className="text-orange-200">
                {marioneteEscolhida.forjada.puppet.hp} PV · CA {marioneteEscolhida.forjada.puppet.armorClass} · PR{' '}
                {marioneteEscolhida.forjada.puppet.resistancePoints} · sem chakra próprio
              </p>
              <p className="text-orange-300/60">
                Os golpes dela rolam com os seus modificadores e a sua proficiência; os jutsus dela gastam o seu chakra.
              </p>
              {marioneteEscolhida.forjada.puppet.gearText && (
                <p className="text-orange-300/60">Acoplado: {marioneteEscolhida.forjada.puppet.gearText}</p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          disabled={
            semChakra ||
            (aba === 'clone'
              ? !jutsuClone || !leitura?.sheetWorthy
              : aba === 'invocacao'
                ? !triboId
                : !marioneteEscolhida || jaEmCampo.has(marioneteEscolhida.forjada.id))
          }
          onClick={pedir}
        >
          {asGM ? 'Pôr em campo' : 'Pedir ao mestre'}
          {custo > 0 ? ` (${custo} de chakra)` : ''}
        </Button>
        {custo > 0 && <Badge tone={semChakra ? 'bad' : 'default'}>você tem {character.chakra.current} de chakra</Badge>}
      </div>
      {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}

      {emCampo.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Em campo agora</p>
          {emCampo.map((c) => (
            <FichaEmCampo
              key={c.id}
              companion={c}
              table={table}
              mesa={mesa}
              dono={character}
              requesterUid={requesterUid}
              asGM={asGM}
              onResolveNow={onResolveNow}
              onDesfazer={() => desfazer(c)}
              onMexerPv={(d) => mexerPv(c, d)}
            />
          ))}
        </div>
      )}

      {quebradas.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Quebradas</p>
          {quebradas.map((c) => (
            <div key={c.id} className="well flex flex-wrap items-center justify-between gap-2 rounded-sm p-2 text-xs">
              <span className="min-w-0 flex-1 break-words text-orange-300/70">
                {c.name} — fora de jogo. O item continua na sua mochila; o conserto é com o mestre.
              </span>
              {asGM && (
                <span className="flex shrink-0 gap-1">
                  <Button
                    variant="good"
                    className="px-2 py-0.5 text-[11px]"
                    onClick={() => updateCompanion(table.id, c.id, { hp: { ...c.hp, current: c.hp.max }, status: 'active' })}
                  >
                    consertar
                  </Button>
                  <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => deleteCompanion(table.id, c.id)}>
                    remover
                  </Button>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

/** Uma ficha temporária em campo: os números, os golpes e o alvo. */
function FichaEmCampo({
  companion,
  table,
  mesa,
  dono,
  requesterUid,
  asGM,
  onResolveNow,
  onDesfazer,
  onMexerPv,
}: {
  companion: Companion
  table: GameTable
  mesa: MesaViva
  dono: Character
  requesterUid: string
  asGM: boolean
  onResolveNow: (cast: JutsuCast) => Promise<void>
  onDesfazer: () => void
  onMexerPv: (delta: number) => void
}) {
  const [acaoId, setAcaoId] = useState('')
  const [alvoRef, setAlvoRef] = useState('')
  const [aviso, setAviso] = useState('')

  const acoes = useMemo(() => companionActions(companion), [companion])
  const acao = acoes.find((a) => a.id === acaoId)
  const alvos = alvosDaMesa(mesa, `companion:${companion.id}`, asGM)
  const volta = refundOnDismiss(companion)

  // A marionete gasta o chakra do dono; clone e invocação, o próprio.
  const bolso = companion.usesOwnerChakra ? dono.chakra : companion.chakra
  const semChakra = (acao?.chakraCost ?? 0) > bolso.current

  async function agir() {
    if (!acao) return
    const cast = await createJutsuCast(table.id, {
      casterId: companion.id,
      casterName: companion.name,
      casterKind: 'companion',
      requesterUid,
      jutsuName: acao.label.split(' · ')[0].replace(/\s*\(.*\)$/, ''),
      classification: acao.source === 'attack' ? 'Bukijutsu' : 'Ninjutsu',
      chakraCost: acao.chakraCost,
      mode: acao.mode,
      attackAttribute: acao.attackAttribute,
      proficient: acao.proficient,
      saveAttribute: acao.mode === 'save' ? acao.saveAttribute : undefined,
      damage: acao.damage,
      damageType: acao.damageType,
      onSaveSuccess: acao.onSaveSuccess,
      targetRef: alvoRef || undefined,
      targetName: alvos.find((a) => a.ref === alvoRef)?.name,
      extraBonus: acao.extraBonus,
      damageHalved: acao.damageHalved,
    })
    if (asGM) {
      await onResolveNow(cast)
      setAviso('Feito.')
      return
    }
    setAviso('Pedido enviado — aguardando o mestre liberar.')
  }

  return (
    <div className="well flex min-w-0 flex-col gap-1.5 rounded-sm p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {companion.imageUrl && <Avatar url={companion.imageUrl} name={companion.name} size={28} />}
          <div className="min-w-0">
            <p className="break-words text-sm text-orange-100">{companion.name}</p>
            <p className="text-[11px] text-orange-400/60">
              {companion.kind === 'clone' ? 'Clone' : companion.kind === 'summon' ? 'Invocação' : 'Marionete'} ·{' '}
              {companion.sourceJutsu}
              {companion.summonSize ? ` · ${summonSize(companion.summonSize).name}` : ''}
            </p>
          </div>
        </div>
        <button
          className="shrink-0 text-[11px] text-red-400 hover:text-red-200"
          title={volta > 0 ? `Devolve ${volta} de chakra (metade do que sobrou)` : 'Sai de jogo'}
          onClick={onDesfazer}
        >
          {companion.kind === 'puppet' ? 'guardar' : 'desfazer'}
          {volta > 0 ? ` (+${volta} chakra)` : ''}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-orange-200">
        <span className="flex items-center gap-1">
          PV
          <button className="px-1 text-orange-400 hover:text-orange-200" onClick={() => onMexerPv(-1)}>
            −
          </button>
          <b className={companion.hp.current <= 1 ? 'text-red-300' : 'text-white'}>
            {companion.hp.current}/{companion.hp.max}
          </b>
          <button className="px-1 text-orange-400 hover:text-orange-200" onClick={() => onMexerPv(1)}>
            +
          </button>
        </span>
        <span>CA {companion.armorClass}</span>
        <span>PR {companion.resistancePoints}</span>
        {companion.chakra.max > 0 && (
          <span>
            Chakra {companion.chakra.current}/{companion.chakra.max}
          </span>
        )}
        {companion.usesOwnerChakra && <Badge>usa o seu chakra</Badge>}
        {companion.halfDamage && <Badge tone="warn">jutsu pela metade</Badge>}
      </div>

      {companion.gearText && <p className="text-[11px] text-orange-300/60">Acoplado: {companion.gearText}</p>}

      {acoes.length > 0 ? (
        <div className="flex min-w-0 flex-wrap items-end gap-2">
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-[11px] text-orange-400/60">
            o que ela faz
            <Select value={acaoId} onChange={(e) => setAcaoId(e.target.value)} className="text-xs">
              <option value="">Escolha um golpe ou jutsu...</option>
              {acoes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-[11px] text-orange-400/60">
            alvo
            <Select value={alvoRef} onChange={(e) => setAlvoRef(e.target.value)} className="text-xs">
              <option value="">Sem alvo — só rolar</option>
              {alvos.map((a) => (
                <option key={a.ref} value={a.ref}>
                  {a.name}
                </option>
              ))}
            </Select>
          </label>
          <Button variant="primary" className="shrink-0" disabled={!acao || semChakra} onClick={agir}>
            {asGM ? 'Agir' : 'Pedir'}
          </Button>
        </div>
      ) : (
        <p className="text-[11px] text-orange-400/50">Sem golpes nem jutsus — esta ficha só ocupa espaço no mapa.</p>
      )}

      {acao && (
        <p className="text-[11px] text-orange-400/60">
          {acao.mode === 'attack'
            ? `ataque por ${ATTRIBUTE_LABELS[acao.attackAttribute]}`
            : acao.mode === 'save'
              ? `o alvo resiste com ${ATTRIBUTE_LABELS[acao.saveAttribute ?? 'constitution']}`
              : 'sem rolagem'}
          {acao.damage ? ` · ${acao.damage}` : ''}
          {acao.chakraCost ? ` · ${acao.chakraCost} de chakra${companion.usesOwnerChakra ? ' seu' : ''}` : ''}
          {acao.note ? ` · ${acao.note}` : ''}
          {semChakra ? ' · chakra insuficiente' : ''}
        </p>
      )}
      {aviso && <p className="text-[11px] text-emerald-300">{aviso}</p>}
    </div>
  )
}
