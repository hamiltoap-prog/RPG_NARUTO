import { useEffect, useMemo, useState } from 'react'
import { Avatar, Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { CLASSES } from '../data/classes'
import { SUMMON_BESTIARY } from '../data/summons'
import {
  biggestChakraDie,
  cloneArmorClass,
  isCloneJutsu,
  isSummonJutsu,
  readClone,
  summonCost,
} from '../lib/companions'
import { findCatalogEntry } from '../lib/jutsuCast'
import { summonSize } from '../lib/summon'
import {
  createJutsuCast,
  deleteCompanion,
  dismissCompanions,
  listenCompanions,
  updateCompanion,
} from '../lib/store'
import { SUMMON_RANKS, SUMMON_SIZES } from '../types'
import type { Character, Companion, GameTable, JutsuCast, SummonSizeKey } from '../types'

/**
 * Clones e invocações: fichas temporárias de quem lançou o jutsu.
 *
 * Um clone das sombras não é uma anotação — é um corpo que age no turno do
 * dono, com PV, CA e chakra próprios. O mesmo vale para a criatura que o
 * jogador invoca. Aqui os dois nascem como ficha de verdade, controlada por
 * quem lançou (o jogador na ficha dele; o mestre, na que ele estiver
 * conduzindo), e ganham peça ao lado da peça do dono no mapa.
 *
 * O caminho é o mesmo de qualquer coisa que mexe em ficha: o pedido vai para
 * a fila, o mestre libera, e aí o chakra sai e as fichas nascem na mesma
 * escrita. Quando o mestre é quem está usando, sai na hora.
 */
export function CompanionCard({
  table,
  character,
  requesterUid,
  asGM,
  onResolveNow,
}: {
  table: GameTable
  character: Character
  requesterUid: string
  asGM: boolean
  /** O mestre resolve na hora; o jogador entra na fila. */
  onResolveNow: (cast: JutsuCast) => Promise<void>
}) {
  const [aba, setAba] = useState<'clone' | 'invocacao'>('clone')
  const [jutsuClone, setJutsuClone] = useState('')
  const [quantos, setQuantos] = useState(1)
  const [triboId, setTriboId] = useState('')
  const [rankIdx, setRankIdx] = useState(0)
  const [tamanho, setTamanho] = useState<SummonSizeKey>('M')
  const [aviso, setAviso] = useState('')
  const [todas, setTodas] = useState<Companion[]>([])

  useEffect(() => listenCompanions(table.id, setTodas), [table.id])

  const minhas = todas.filter((c) => c.ownerCharacterId === character.id)
  const clonesQueSei = character.jutsus.filter((j) => isCloneJutsu(j.name))
  const seiInvocar = character.jutsus.some((j) => isSummonJutsu(j.name))
  const classe = CLASSES.find((c) => c.id === character.classId)

  const entrada = useMemo(() => (jutsuClone ? findCatalogEntry(jutsuClone) : undefined), [jutsuClone])
  const leitura = useMemo(() => (entrada ? readClone(entrada) : null), [entrada])

  // Ao trocar de jutsu, volta para o máximo que ele permite.
  useEffect(() => {
    if (leitura) setQuantos(Math.min(leitura.maxClones, Math.max(1, leitura.maxClones)))
  }, [leitura])

  const custoClone = leitura
    ? (leitura.costPerClone ?? Number((entrada?.cost ?? '').match(/\d+/)?.[0] ?? 0)) * (leitura.costPerClone ? quantos : 1)
    : 0
  const custoInvocacao = summonCost(rankIdx)
  const custo = aba === 'clone' ? custoClone : custoInvocacao
  const semChakra = character.chakra.current < custo

  const caDoClone = leitura ? cloneArmorClass(leitura.armor, character) : 0
  const chakraDoClone = leitura?.chakra === 'chakraDie' ? biggestChakraDie(classe?.chakraDie) : 0
  const t = summonSize(tamanho)

  async function pedir() {
    const base = {
      casterId: character.id,
      casterName: character.name,
      requesterUid,
      jutsuName: aba === 'clone' ? jutsuClone : 'Técnica de Invocação',
      classification: 'Ninjutsu',
      chakraCost: custo,
      mode: 'none' as const,
      attackAttribute: 'intelligence' as const,
      proficient: false,
      companion:
        aba === 'clone'
          ? { kind: 'clone' as const, count: quantos, cloneJutsu: jutsuClone }
          : { kind: 'summon' as const, count: 1, tribeId: triboId, rankIndex: rankIdx, size: tamanho },
    }
    const cast = await createJutsuCast(table.id, base)
    if (asGM) {
      await onResolveNow(cast)
      setAviso('Feito — a ficha está aqui embaixo.')
      return
    }
    setAviso('Pedido enviado — o mestre libera e as fichas aparecem aqui.')
  }

  async function desfazer(c: Companion) {
    await deleteCompanion(table.id, c.id)
  }

  async function desfazerTodas() {
    await dismissCompanions(table.id, minhas.map((c) => c.id))
  }

  async function mexerPv(c: Companion, delta: number) {
    const novo = Math.max(0, Math.min(c.hp.max, c.hp.current + delta))
    await updateCompanion(table.id, c.id, { hp: { ...c.hp, current: novo } })
  }

  // Sem jutsu de clone nem de invocação, o cartão nem aparece.
  if (clonesQueSei.length === 0 && !seiInvocar && minhas.length === 0) return null

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Clones e invocações</SectionTitle>
        {minhas.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge>{minhas.length} em jogo</Badge>
            <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={desfazerTodas}>
              desfazer todas
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-1.5">
        {clonesQueSei.length > 0 && (
          <TabChip active={aba === 'clone'} className="px-3 py-1 text-xs" onClick={() => setAba('clone')}>
            Clone
          </TabChip>
        )}
        {seiInvocar && (
          <TabChip active={aba === 'invocacao'} className="px-3 py-1 text-xs" onClick={() => setAba('invocacao')}>
            Invocação
          </TabChip>
        )}
      </div>

      {aba === 'clone' && clonesQueSei.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
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
              Este jutsu não descreve um clone com PV e CA próprios — é efeito, não corpo. Então o app não cria ficha
              para ele; use o cartão de lançar jutsu normalmente.
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
                {leitura.armor.from === 'owner' && ' (igual à sua)'}
                {' · '}
                {chakraDoClone > 0 ? `${chakraDoClone} de chakra temporário` : 'sem chakra'} · PR{' '}
                {character.resistancePoints}
              </p>
              {leitura.halfDamage && (
                <p className="text-orange-300/60">Jutsus lançados pelo clone causam metade do dano.</p>
              )}
              {leitura.duration && <p className="text-orange-300/60">Duração: {leitura.duration}.</p>}
            </div>
          )}
        </div>
      )}

      {aba === 'invocacao' && seiInvocar && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-end gap-2">
            <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
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
              <Select value={rankIdx} onChange={(e) => setRankIdx(Number(e.target.value))} className="w-56">
                {SUMMON_RANKS.map((r, i) => (
                  <option key={r.rank} value={i}>
                    Rank {r.rank} · {r.title} · {r.cost} chakra
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              tamanho
              <Select value={tamanho} onChange={(e) => setTamanho(e.target.value as SummonSizeKey)} className="w-56">
                {SUMMON_SIZES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.name} · CA {10 + s.acBonus} · PR {s.resistancePoints} · dano {s.damageDie}
                  </option>
                ))}
              </Select>
            </label>
          </div>
          <p className="text-xs text-orange-300/60">
            O tamanho é que define CA, Pontos de Resistência, bônus de ataque e dado de dano da criatura — CA{' '}
            {10 + t.acBonus}, PR {t.resistancePoints}, ataque +{t.attackBonus}, dano {t.damageDie}.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="primary"
          disabled={
            semChakra ||
            (aba === 'clone' ? !jutsuClone || !leitura?.sheetWorthy : !triboId)
          }
          onClick={pedir}
        >
          {asGM ? 'Criar agora' : 'Pedir ao mestre'}
          {custo > 0 ? ` (${custo} de chakra)` : ''}
        </Button>
        {custo > 0 && (
          <Badge tone={semChakra ? 'bad' : 'default'}>
            você tem {character.chakra.current} de chakra
          </Badge>
        )}
      </div>
      {aviso && <p className="text-xs text-emerald-300">{aviso}</p>}

      {minhas.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Em jogo agora</p>
          {minhas.map((c) => (
            <div key={c.id} className="well flex flex-col gap-1.5 rounded-sm p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {c.imageUrl && <Avatar url={c.imageUrl} name={c.name} size={28} />}
                  <div>
                    <p className="text-sm text-orange-100">{c.name}</p>
                    <p className="text-[11px] text-orange-400/60">
                      {c.kind === 'clone' ? 'Clone' : 'Invocação'} · {c.sourceJutsu}
                      {c.summonSize ? ` · ${summonSize(c.summonSize).name}` : ''}
                    </p>
                  </div>
                </div>
                <button className="text-[11px] text-red-400 hover:text-red-200" onClick={() => desfazer(c)}>
                  desfazer
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-orange-200">
                <span className="flex items-center gap-1">
                  PV
                  <button className="px-1 text-orange-400 hover:text-orange-200" onClick={() => mexerPv(c, -1)}>
                    −
                  </button>
                  <b className={c.hp.current === 0 ? 'text-red-300' : 'text-white'}>
                    {c.hp.current}/{c.hp.max}
                  </b>
                  <button className="px-1 text-orange-400 hover:text-orange-200" onClick={() => mexerPv(c, 1)}>
                    +
                  </button>
                </span>
                <span>CA {c.armorClass}</span>
                <span>PR {c.resistancePoints}</span>
                {c.chakra.max > 0 && (
                  <span>
                    Chakra {c.chakra.current}/{c.chakra.max}
                  </span>
                )}
                {c.halfDamage && <Badge tone="warn">dano pela metade</Badge>}
                {c.hp.current === 0 && <Badge tone="bad">desfeito ao chegar a 0 PV</Badge>}
              </div>

              {(c.attacks ?? []).length > 0 && (
                <p className="text-[11px] text-orange-300/60">
                  Golpes: {(c.attacks ?? []).map((a) => `${a.name} ${a.bonus >= 0 ? '+' : ''}${a.bonus} · ${a.damage}`).join(' / ')}
                </p>
              )}
              {(c.jutsus ?? []).length > 0 && (
                <p className="text-[11px] text-orange-300/60">
                  Pode usar {(c.jutsus ?? []).length} jutsu(s) seus (nenhum de clone)
                </p>
              )}
              {c.duration && <p className="text-[11px] text-orange-400/50">{c.duration}</p>}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
