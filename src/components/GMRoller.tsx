import { useEffect, useState } from 'react'
import { Badge, Button, Card, Input, SectionTitle, Select, TabChip } from './ui'
import { rollAsGM } from '../lib/rollFlow'
import { listenGMRolls } from '../lib/store'
import { FREE_DICE } from '../types'
import type { GMRoll, GameTable, NPC } from '../types'

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
export function GMRoller({ table, gmName, npcs }: { table: GameTable; gmName: string; npcs: NPC[] }) {
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

  // NPC
  const [npcId, setNpcId] = useState('')
  const [notacaoDano, setNotacaoDano] = useState('1d6')

  useEffect(() => listenGMRolls(table.id, setHistorico), [table.id])

  async function rolar(intent: Parameters<typeof rollAsGM>[0]['intent']) {
    const outcome = await rollAsGM({ table, gmName, intent, secret: secreta })
    setUltima(outcome.summary)
  }

  const npcEscolhido = npcs.find((n) => n.id === npcId)

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

      {aba === 'npc' && (
        <div className="flex flex-col gap-2">
          {npcs.length === 0 ? (
            <p className="text-xs text-orange-300/50">Nenhum NPC criado ainda — use a aba NPCs.</p>
          ) : (
            <>
              <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-1 flex-col gap-1 text-xs text-orange-400/60">
                  NPC
                  <Select value={npcId} onChange={(e) => setNpcId(e.target.value)}>
                    <option value="">Escolha...</option>
                    {npcs.map((n) => (
                      <option key={n.id} value={n.id}>
                        {n.name} (CA {n.armorClass} · PV {n.hp.current}/{n.hp.max})
                      </option>
                    ))}
                  </Select>
                </label>
                <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                  bônus de ataque
                  <Input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value) || 0)} className="w-28" />
                </label>
                <Button
                  variant="primary"
                  disabled={!npcEscolhido}
                  onClick={() =>
                    rolar({ kind: 'attack', description: `Ataque de ${npcEscolhido?.name}`, modifier: bonus })
                  }
                >
                  Atacar
                </Button>
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-col gap-1 text-xs text-orange-400/60">
                  dano
                  <Input value={notacaoDano} onChange={(e) => setNotacaoDano(e.target.value)} className="w-32" placeholder="2d6+3" />
                </label>
                <Button
                  variant="secondary"
                  disabled={!npcEscolhido}
                  onClick={() =>
                    rolar({ kind: 'damage', description: `Dano de ${npcEscolhido?.name}`, notation: notacaoDano.trim() || '1d6' })
                  }
                >
                  Rolar dano
                </Button>
              </div>
              {npcEscolhido?.attacksText && (
                <p className="whitespace-pre-line text-xs text-orange-300/60">{npcEscolhido.attacksText}</p>
              )}
            </>
          )}
        </div>
      )}

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
