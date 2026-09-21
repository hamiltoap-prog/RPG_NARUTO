import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { rollAsGM } from '../lib/rollFlow'
import { attackAttribute, findCatalogEntry, npcAsCaster, readJutsu, resolveCast } from '../lib/jutsuCast'
import { clanElements, elementAdvantage, jutsuElement } from '../lib/jutsuAccess'
import { allClans } from '../lib/clans'
import { addGMRoll, addLogEntry, listenCustomClans, listenGMRolls, updateCharacterDirect, updateNPC } from '../lib/store'
import { FREE_DICE } from '../types'
import type { Character, Clan, GMRoll, GameTable, NPC } from '../types'

type Aba = 'livre' | 'teste' | 'npc'

/**
 * Rolagens do mestre.
 *
 * Duas decisões importantes:
 *  - ABERTA vai para o registro da mesa e anima os dados na tela de todo
 *    mundo; SECRETA fica só aqui. O segredo é garantido pelas regras do
 *    Firestore (coleção gmRolls, fechada), não por esconder na interface.
 *  - o mestre nunca precisa pedir licença: aqui o dado rola na hora.
 */
export function GMRoller({
  table,
  gmName,
  npcs,
  characters,
}: {
  table: GameTable
  gmName: string
  npcs: NPC[]
  characters: Character[]
}) {
  const [aba, setAba] = useState<Aba>('livre')
  const [secreta, setSecreta] = useState(false)
  const [ultima, setUltima] = useState<string>('')
  const [historico, setHistorico] = useState<GMRoll[]>([])

  // Dados livres
  const [lados, setLados] = useState(20)
  const [quantos, setQuantos] = useState(1)
  const [modificador, setModificador] = useState(0)

  // Teste avulso
  const [rotulo, setRotulo] = useState('')
  const [bonus, setBonus] = useState(0)

  useEffect(() => listenGMRolls(table.id, setHistorico), [table.id])

  async function rolar(intent: Parameters<typeof rollAsGM>[0]['intent']) {
    const outcome = await rollAsGM({ table, gmName, intent, secret: secreta })
    setUltima(outcome.summary)
  }

  return (
    <Card className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle>Rolagens do mestre</SectionTitle>
        <label className="flex cursor-pointer items-center gap-2 text-xs text-orange-200">
          <input type="checkbox" checked={secreta} onChange={(e) => setSecreta(e.target.checked)} />
          rolagem secreta
        </label>
      </div>

      <p className="text-xs leading-relaxed text-orange-400/60">
        {secreta
          ? 'Secreta: o resultado fica só nesta tela — não entra no registro da mesa nem anima os dados para os jogadores.'
          : 'Aberta: vai para o registro e a mesa inteira vê os dados rolarem.'}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {(
          [
            ['livre', 'Dados livres'],
            ['teste', 'Teste avulso'],
            ['npc', 'Ataque de NPC'],
          ] as [Aba, string][]
        ).map(([k, label]) => (
          <TabChip key={k} active={aba === k} className="px-2.5 py-1 text-xs" onClick={() => setAba(k)}>
            {label}
          </TabChip>
        ))}
      </div>

      {aba === 'livre' && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            quantos
            <Input
              type="number"
              min={1}
              max={20}
              value={quantos}
              onChange={(e) => setQuantos(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
              className="w-20"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            dado
            <Select value={lados} onChange={(e) => setLados(Number(e.target.value))} className="w-24">
              {FREE_DICE.map((d) => (
                <option key={d} value={d}>
                  d{d}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            modificador
            <Input type="number" value={modificador} onChange={(e) => setModificador(Number(e.target.value) || 0)} className="w-24" />
          </label>
          <Button
            variant="primary"
            onClick={() =>
              rolar({
                kind: 'free',
                description: `${quantos}d${lados}${modificador ? (modificador > 0 ? `+${modificador}` : modificador) : ''}`,
                notation: `${quantos}d${lados}${modificador ? (modificador > 0 ? `+${modificador}` : modificador) : ''}`,
              })
            }
          >
            Rolar
          </Button>
        </div>
      )}

      {aba === 'teste' && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
            o que está sendo testado
            <Input placeholder="Percepção do guarda, Iniciativa do chefe..." value={rotulo} onChange={(e) => setRotulo(e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            bônus
            <Input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value) || 0)} className="w-24" />
          </label>
          <Button
            variant="primary"
            onClick={() => rolar({ kind: 'check', description: rotulo.trim() || 'Teste do mestre', modifier: bonus })}
          >
            Rolar d20
          </Button>
        </div>
      )}

      {aba === 'npc' && <CriaturaAge table={table} npcs={npcs} characters={characters} secreta={secreta} onFeito={setUltima} />}

      {ultima && (
        <div className="well rounded-sm p-2 text-sm text-white">
          {ultima}
          {secreta && (
            <span className="ml-2">
              <Badge tone="warn">secreta</Badge>
            </span>
          )}
        </div>
      )}

      {historico.length > 0 && (
        <div>
          <p className="mb-1 font-display text-xs uppercase tracking-[0.12em] text-orange-400/60">
            Suas rolagens secretas ({historico.length})
          </p>
          <div className="flex max-h-40 flex-col gap-1 overflow-y-auto">
            {historico.map((r) => (
              <p key={r.id} className="well rounded-sm px-2 py-1 text-xs text-orange-200">
                {r.summary}
              </p>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}


/**
 * A criatura age: escolhe um golpe pronto ou um jutsu dela, escolhe o alvo, e
 * a conta sai inteira — rolagem, acerto, dano aplicado e chakra descontado.
 *
 * Antes o ataque de um bicho era só texto na ficha ("Mordida +5, 1d6") e o
 * mestre fazia a conta na mão. Agora usa a mesma máquina do jutsu de um
 * personagem, com o NPC no lugar do conjurador.
 */
function CriaturaAge({
  table,
  npcs,
  characters,
  secreta,
  onFeito,
}: {
  table: GameTable
  npcs: NPC[]
  characters: Character[]
  secreta: boolean
  onFeito: (s: string) => void
}) {
  const [npcId, setNpcId] = useState('')
  const [acaoId, setAcaoId] = useState('')
  const [alvoRef, setAlvoRef] = useState('')
  const [danoAvulso, setDanoAvulso] = useState('1d6')
  const [bonusAvulso, setBonusAvulso] = useState(4)
  const [comVantagem, setComVantagem] = useState(false)
  const [customClans, setCustomClans] = useState<Clan[]>([])

  useEffect(() => listenCustomClans(table.id, setCustomClans), [table.id])

  const npc = npcs.find((n) => n.id === npcId)
  const ataques = npc?.attacks ?? []
  const jutsus = npc?.jutsus ?? []
  const alvos = [
    ...characters.filter((c) => !c.isNPC).map((c) => ({ ref: `character:${c.id}`, name: c.name })),
    ...npcs.filter((n) => n.id !== npcId).map((n) => ({ ref: `npc:${n.id}`, name: n.name })),
  ]
  const alvo = alvoRef ? acharAlvo(alvoRef, characters, npcs) : undefined

  const ataqueEscolhido = ataques.find((a) => a.id === acaoId)
  const jutsuEscolhido = jutsus.find((j) => j.id === acaoId)

  // Vantagem Elemental do manual, do lado da criatura: o app confere o
  // elemento do jutsu contra as afinidades do alvo (ficha + clã) e sugere.
  const catalogo = jutsuEscolhido ? findCatalogEntry(jutsuEscolhido.name) : undefined
  const afinidadesDoAlvo = alvo
    ? [
        ...(alvo.elements ?? []),
        ...('clanId' in alvo ? clanElements(allClans(customClans).find((c) => c.id === alvo.clanId)) : []),
      ]
    : []
  const elementoDoJutsu = catalogo ? jutsuElement(catalogo) : null
  // A Vantagem Elemental do manual vale "na jogada de ataque ou na Disputa" —
  // não em resistência, onde quem rola é o alvo. Então a caixa só aparece
  // quando esta ação de fato resolve com uma jogada de ataque.
  const resolveComAtaque = jutsuEscolhido ? (catalogo ? readJutsu(catalogo).mode === 'attack' : true) : true
  const superado = resolveComAtaque ? elementAdvantage(elementoDoJutsu, afinidadesDoAlvo) : null
  const motivoVantagem = superado ? `${elementoDoJutsu} supera ${superado}` : ''
  useEffect(() => setComVantagem(Boolean(superado)), [superado])

  async function agir() {
    if (!npc) return
    const caster = npcAsCaster(npc)
    const cat = catalogo
    const lido = cat ? readJutsu(cat) : undefined

    const entrada = jutsuEscolhido
      ? {
          caster,
          jutsuName: jutsuEscolhido.name,
          classification: cat?.classification ?? 'Ninjutsu',
          mode: lido?.mode ?? ('attack' as const),
          attackAttribute: attackAttribute(cat?.classification ?? 'Ninjutsu'),
          proficient: true,
          saveAttribute: lido?.saveAttribute,
          damage: lido?.damage,
          damageType: lido?.damageType,
          target: alvo,
        }
      : {
          caster,
          jutsuName: ataqueEscolhido?.name ?? 'Ataque',
          classification: 'Taijutsu',
          mode: 'attack' as const,
          attackAttribute: 'strength' as const,
          proficient: false,
          damage: ataqueEscolhido?.damage ?? danoAvulso,
          damageType: ataqueEscolhido?.damageType,
          target: alvo,
        }

    // Golpe pronto tem bônus próprio; a conta soma esse número e mais nada.
    const bonus = ataqueEscolhido ? ataqueEscolhido.bonus : jutsuEscolhido ? undefined : bonusAvulso
    const casterAjustado =
      bonus === undefined
        ? caster
        : { ...caster, proficiencyBonus: 0, modifiers: { ...caster.modifiers, strength: bonus } }

    const fora = resolveCast({
      ...entrada,
      caster: casterAjustado,
      edge: resolveComAtaque && comVantagem ? 'advantage' : 'none',
      edgeReason: resolveComAtaque && comVantagem ? motivoVantagem || 'vantagem da mesa' : undefined,
    })
    const custo = Number((jutsuEscolhido?.chakraCost ?? '').match(/\d+/)?.[0] ?? 0)

    // Aplica o dano no alvo e o chakra na criatura.
    if (alvo && fora.targetHp !== undefined) {
      const [kind, id] = alvoRef.split(':')
      if (kind === 'character') {
        await updateCharacterDirect(table.id, id, {
          hp: { ...alvo.hp, current: fora.targetHp },
          ...(fora.targetHp === 0 ? { isAlive: false } : {}),
        })
      } else {
        await updateNPC(table.id, id, { hp: { ...alvo.hp, current: fora.targetHp } })
      }
    }
    if (custo > 0 && npc.chakra) {
      await updateNPC(table.id, npc.id, { chakra: { ...npc.chakra, current: Math.max(0, npc.chakra.current - custo) } })
    }

    const frase = `${npc.name}: ${fora.summary}${custo ? ` (−${custo} chakra)` : ''}`
    onFeito(frase)
    if (secreta) {
      await addGMRoll(table.id, { label: npc.name, summary: frase, dice: fora.dice, diceSides: fora.diceSides, total: fora.damage })
      return
    }
    await addLogEntry(table.id, {
      actorName: npc.name,
      actorType: 'gm',
      kind: 'combat',
      summary: frase,
      dice: fora.dice,
      diceSides: fora.diceSides,
      diceLabel: npc.name,
    })
  }

  if (npcs.length === 0) return <p className="text-xs text-orange-300/50">Nenhum NPC criado ainda — use a aba NPCs.</p>

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          criatura
          <Select
            value={npcId}
            onChange={(e) => {
              setNpcId(e.target.value)
              setAcaoId('')
            }}
          >
            <option value="">Escolha...</option>
            {npcs.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} (CA {n.armorClass} · PV {n.hp.current}/{n.hp.max})
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
          alvo
          <Select value={alvoRef} onChange={(e) => setAlvoRef(e.target.value)}>
            <option value="">Sem alvo — só rolar</option>
            {alvos.map((a) => (
              <option key={a.ref} value={a.ref}>
                {a.name}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {npc && (
        <label className="flex flex-col gap-1 text-xs text-orange-400/60">
          o que ela faz
          <Select value={acaoId} onChange={(e) => setAcaoId(e.target.value)}>
            <option value="">Ataque avulso (digite abaixo)</option>
            {ataques.length > 0 && (
              <optgroup label="Golpes">
                {ataques.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} {a.bonus >= 0 ? '+' : ''}
                    {a.bonus} · {a.damage}
                  </option>
                ))}
              </optgroup>
            )}
            {jutsus.length > 0 && (
              <optgroup label="Jutsus">
                {jutsus.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.name} {j.chakraCost ? `(${j.chakraCost})` : ''}
                  </option>
                ))}
              </optgroup>
            )}
          </Select>
        </label>
      )}

      {npc && !ataqueEscolhido && !jutsuEscolhido && (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            bônus
            <Input type="number" value={bonusAvulso} onChange={(e) => setBonusAvulso(Number(e.target.value) || 0)} className="w-20" />
          </label>
          <label className="flex flex-col gap-1 text-xs text-orange-400/60">
            dano
            <Input value={danoAvulso} onChange={(e) => setDanoAvulso(e.target.value)} className="w-24" />
          </label>
          <p className="basis-full text-[11px] text-orange-400/50">
            Dica: guarde os golpes na aba NPCs e eles aparecem aqui prontos, sem digitar de novo.
          </p>
        </div>
      )}

      {alvo && (
        <p className="text-xs text-orange-400/60">
          {alvo.name}: CA {alvo.armorClass} · PR {alvo.resistancePoints} · PV {alvo.hp.current}/{alvo.hp.max}
        </p>
      )}

      {npc && (
        <label
          className="flex items-center gap-1.5 text-xs text-orange-200"
          title="Ciclo Fogo > Vento > Raio > Terra > Água > Fogo: quem usa o elemento superior rola com Vantagem (dois d20, vale o melhor)."
        >
          <input type="checkbox" checked={comVantagem} onChange={(e) => setComVantagem(e.target.checked)} />
          vantagem {motivoVantagem ? `(${motivoVantagem})` : 'na rolagem'}
        </label>
      )}

      <Button variant="primary" className="self-start" disabled={!npc} onClick={agir}>
        {jutsuEscolhido ? 'Conjurar' : 'Atacar'}
      </Button>
      {npc?.attacksText && <p className="whitespace-pre-line text-xs text-orange-300/60">{npc.attacksText}</p>}
    </div>
  )
}

function acharAlvo(ref: string, characters: Character[], npcs: NPC[]) {
  const [kind, id] = ref.split(':')
  return kind === 'character' ? characters.find((c) => c.id === id) : npcs.find((n) => n.id === id)
}
