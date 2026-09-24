import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select } from './ui'
import { CondicoesDoGolpe } from './CondicoesDoGolpe'
import { alvosDaMesa, motivoDaListaDeAlvos } from './JutsuCastPanel'
import type { MesaViva } from './JutsuCastPanel'
import { npcActions } from '../lib/npcActions'
import { condicoesDe, efeitoDaCondicao, tirarCondicao } from '../lib/conditions'
import { createJutsuCast, updateNPC } from '../lib/store'
import { rollAsGM } from '../lib/rollFlow'
import { arteDaPeca } from '../lib/tokenArt'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, GameTable, JutsuCast, NPC, Scene } from '../types'

/**
 * Jogar com a criatura, como se joga com um personagem.
 *
 * O mestre tinha números da criatura e um rolador separado; o que faltava era
 * **jogar** com ela: escolher o golpe, mirar em alguém, rolar e ver o dano
 * cair na ficha do alvo. Este painel faz isso pelo MESMO caminho do jogador
 * (a fila de lançamentos), e não por um atalho — é o que dá à criatura os
 * dados animados na tela de todo mundo, a linha no registro da mesa, o dano
 * aplicado no alvo e a condição grudando.
 *
 * Para rolar **em segredo** (uma emboscada, um teste que o grupo não pode
 * ver), o caminho continua sendo a aba Rolagens: o que sai daqui é público
 * por definição, porque é o que a mesa inteira está vendo acontecer.
 */
export function CriaturaEmJogo({
  table,
  npc,
  mesa,
  scene,
  onResolveNow,
}: {
  table: GameTable
  npc: NPC
  mesa: MesaViva
  scene: Scene | null
  onResolveNow: (cast: JutsuCast) => Promise<void>
}) {
  const [acaoId, setAcaoId] = useState('')
  const [alvoRef, setAlvoRef] = useState('')
  const [condicoes, setCondicoes] = useState<string[]>([])
  const [rodadas, setRodadas] = useState<number | undefined>(undefined)
  const [extras, setExtras] = useState<string[]>([])
  const [aviso, setAviso] = useState('')
  const [dano, setDano] = useState(0)
  const [atributo, setAtributo] = useState<AttributeKey>('dexterity')

  const acoes = useMemo(() => npcActions(npc), [npc])
  const acao = acoes.find((a) => a.id === acaoId)

  // Trocar de golpe recarrega o que ele impõe. Depende só do golpe escolhido:
  // `acao` é objeto novo a cada snapshot da ficha (o PV muda o tempo todo).
  useEffect(() => {
    const escolhido = npcActions(npc).find((a) => a.id === acaoId)
    setCondicoes(escolhido?.conditions ?? [])
    setRodadas(escolhido?.conditionRounds)
    setExtras([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acaoId, npc.id])

  // O mestre alcança todo mundo; a cena entra só para a tela poder explicar.
  const alvos = alvosDaMesa(mesa, `npc:${npc.id}`, true, { table, scene })
  const motivoAlvos = motivoDaListaDeAlvos(true, table, scene)
  const condicoesDela = condicoesDe(npc, table)
  const chakra = npc.chakra ?? { current: 0, max: 0 }
  const semChakra = (acao?.chakraCost ?? 0) > chakra.current
  const arte = arteDaPeca(npc)

  async function agir() {
    if (!acao) return
    const cast = await createJutsuCast(table.id, {
      casterId: npc.id,
      casterName: npc.name,
      casterKind: 'npc',
      requesterUid: table.gmUid,
      jutsuName: acao.label.split(' · ')[0].replace(/\s*\(.*\)$/, ''),
      classification: acao.source === 'jutsu' ? 'Ninjutsu' : 'Bukijutsu',
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
      weaponId: acao.source === 'weapon' ? acao.id.replace('weapon:', '') : undefined,
      consumesWeapon: acao.source === 'weapon' && /arremesso/i.test(acao.note ?? ''),
      conditions: condicoes.length ? condicoes : undefined,
      conditionRounds: condicoes.length ? rodadas : undefined,
      extraTargetRefs: extras.length ? extras : undefined,
      extraTargetNames: extras.length ? extras.map((r) => alvos.find((a) => a.ref === r)?.name ?? r) : undefined,
    })
    await onResolveNow(cast)
    setAviso('Feito — está no registro da mesa.')
    window.setTimeout(() => setAviso(''), 4000)
  }

  /** Teste de atributo da criatura, com o mesmo d20 da mesa. */
  async function testar() {
    const mod = npc.modifiers?.[atributo] ?? 0
    await rollAsGM({
      table,
      gmName: npc.name,
      intent: { kind: 'check', description: `Teste de ${ATTRIBUTE_LABELS[atributo]}`, modifier: mod },
      secret: false,
    })
    setAviso(`Teste de ${ATTRIBUTE_LABELS[atributo]} rolado.`)
    window.setTimeout(() => setAviso(''), 4000)
  }

  async function mexerPv(delta: number) {
    const novo = Math.max(0, Math.min(npc.hp.max, npc.hp.current + delta))
    await updateNPC(table.id, npc.id, { hp: { ...npc.hp, current: novo } })
  }

  return (
    <Card className="flex min-w-0 flex-col gap-2.5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          {arte.url && <Avatar url={arte.url} name={npc.name} size={34} />}
          <div className="min-w-0">
            <SectionTitle>{npc.name}</SectionTitle>
            <p className="text-[11px] text-orange-400/60">
              {npc.visible ? 'visível ao grupo' : 'oculto do grupo'}
              {npc.level ? ` · nível ${npc.level}` : ''}
            </p>
          </div>
        </div>
        <Badge tone={npc.hp.current === 0 ? 'bad' : 'default'}>
          {npc.hp.current === 0 ? 'fora de combate' : 'em jogo'}
        </Badge>
      </div>

      {/* Os números, e o que dá para mexer neles sem sair daqui. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-orange-200">
        <span className="flex items-center gap-1">
          PV
          <button className="px-1 text-orange-400 hover:text-orange-200" onClick={() => mexerPv(-Math.max(1, dano))}>
            −
          </button>
          <b className={npc.hp.current <= npc.hp.max * 0.2 ? 'text-red-300' : 'text-white'}>
            {npc.hp.current}/{npc.hp.max}
          </b>
          <button className="px-1 text-orange-400 hover:text-orange-200" onClick={() => mexerPv(Math.max(1, dano))}>
            +
          </button>
        </span>
        <Input
          type="number"
          min={0}
          value={dano || ''}
          placeholder="1"
          className="w-14 px-2 py-0.5 text-[11px]"
          onChange={(e) => setDano(Number(e.target.value) || 0)}
        />
        <span>CA {npc.armorClass}</span>
        <span>PR {npc.resistancePoints}</span>
        <span>
          {chakra.max > 0 ? `Chakra ${chakra.current}/${chakra.max}` : 'sem chakra'}
        </span>
        {condicoesDela.map((c) => (
          <button
            key={c.name}
            title={`${efeitoDaCondicao(c.name)}\n(clique para tirar)`}
            className="rounded-sm border border-[color:var(--orange)] px-1.5 py-0.5 font-display text-[10px] uppercase tracking-[0.08em] text-[color:var(--orange)] hover:border-red-500 hover:text-red-300"
            onClick={() => updateNPC(table.id, npc.id, { conditions: tirarCondicao(condicoesDela, c.name) })}
          >
            {c.name}
            {c.rounds !== undefined ? ` ${c.rounds}r` : ''}
          </button>
        ))}
      </div>

      {/* O que ela faz, em quem, e o que isso impõe. */}
      {acoes.length > 0 ? (
        <>
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
              Agir
            </Button>
          </div>
          {motivoAlvos && <p className="text-[11px] text-orange-400/50">{motivoAlvos}</p>}

          {acao && (
            <CondicoesDoGolpe
              condicoes={condicoes}
              onCondicoes={setCondicoes}
              rodadas={rodadas}
              onRodadas={setRodadas}
              area={acao.area}
              alvos={alvos}
              extras={extras}
              onExtras={setExtras}
              alvoPrincipal={alvoRef}
            />
          )}

          {acao && (
            <p className="text-[11px] text-orange-400/60">
              {acao.mode === 'attack'
                ? `ataque${acao.extraBonus ? ` +${acao.extraBonus}` : ''} contra a CA`
                : acao.mode === 'save'
                  ? `o alvo resiste com ${ATTRIBUTE_LABELS[acao.saveAttribute ?? 'constitution']}`
                  : 'sem rolagem'}
              {acao.damage ? ` · ${acao.damage}` : ''}
              {acao.chakraCost ? ` · ${acao.chakraCost} de chakra` : ''}
              {acao.note ? ` · ${acao.note}` : ''}
              {semChakra ? ' · chakra insuficiente' : ''}
            </p>
          )}
        </>
      ) : (
        <p className="text-[11px] text-orange-400/50">
          Esta criatura não tem golpe, arma nem jutsu. Dê algum na aba NPCs para poder jogar com ela.
        </p>
      )}

      {/* Teste de atributo: o resto do que um personagem faz fora do ataque. */}
      <div className="flex flex-wrap items-end gap-2 border-t border-[color:var(--line)] pt-2">
        <label className="flex flex-col gap-1 text-[11px] text-orange-400/60">
          teste de atributo
          <Select value={atributo} onChange={(e) => setAtributo(e.target.value as AttributeKey)} className="w-40 text-xs">
            {ATTRIBUTE_KEYS.map((k) => (
              <option key={k} value={k}>
                {ATTRIBUTE_LABELS[k]} ({(npc.modifiers?.[k] ?? 0) >= 0 ? '+' : ''}
                {npc.modifiers?.[k] ?? 0})
              </option>
            ))}
          </Select>
        </label>
        <Button variant="secondary" onClick={testar}>
          Rolar teste
        </Button>
        <span className="text-[11px] text-orange-400/50">
          Para rolar escondido do grupo, use a aba Rolagens — o que sai daqui é público.
        </span>
      </div>

      {aviso && <p className="text-[11px] text-emerald-300">{aviso}</p>}
    </Card>
  )
}
