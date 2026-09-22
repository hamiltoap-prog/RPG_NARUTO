import { Button, Input, Select, Textarea } from './ui'
import { newId } from '../lib/id'
import { ATTRIBUTE_KEYS, ATTRIBUTE_LABELS } from '../types'
import type { AttributeKey, NpcAttack, PuppetJutsu, PuppetSpec } from '../types'

/**
 * A bancada da marionete.
 *
 * O manual não tem sistema de marionete — isto é regra da casa, e o desenho
 * segue o que a mesa combinou: quem manobra é o ninja, então os golpes rolam
 * com os modificadores e a proficiência do DONO e somam o bônus próprio que
 * você definir aqui. A marionete não tem chakra: o custo dos jutsus dela sai
 * da ficha de quem a maneja.
 *
 * O que a ficha precisa é só isto: quanto aguenta, quanto é difícil acertá-la,
 * o que ela faz, e o que está acoplado nela.
 */
export function PuppetForge({ spec, onChange }: { spec: PuppetSpec; onChange: (s: PuppetSpec) => void }) {
  function mexer(patch: Partial<PuppetSpec>) {
    onChange({ ...spec, ...patch })
  }

  function novoGolpe(): NpcAttack {
    return { id: newId(), name: '', bonus: 0, damage: '1d6' }
  }

  function novoJutsu(): PuppetJutsu {
    return {
      id: newId(),
      name: '',
      chakraCost: 0,
      mode: 'attack',
      attackAttribute: 'dexterity',
      bonus: 0,
      damage: '',
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-[color:var(--line)] p-3">
      <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Ficha da marionete</p>
      <p className="text-[11px] leading-relaxed text-orange-400/50">
        Ela entra em campo como ficha temporária de quem a tem na mochila: vira alvo, leva dano e age no turno do dono.
        A <b className="text-orange-300/70">0 PV ela quebra</b> e fica fora de jogo até você consertar — o item continua
        na mochila.
      </p>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {(
          [
            ['hp', 'PV'],
            ['armorClass', 'CA'],
            ['resistancePoints', 'PR'],
            ['activationCost', 'chakra p/ ativar'],
          ] as const
        ).map(([campo, rotulo]) => (
          <label key={campo} className="flex min-w-0 flex-col gap-1 text-xs text-orange-400/60">
            {rotulo}
            <Input
              type="number"
              min={0}
              value={spec[campo]}
              onChange={(e) => mexer({ [campo]: Math.max(0, Number(e.target.value) || 0) } as Partial<PuppetSpec>)}
            />
          </label>
        ))}
      </div>

      {/* ---- Golpes ---- */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Golpes</p>
          <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => mexer({ attacks: [...spec.attacks, novoGolpe()] })}>
            + golpe
          </Button>
        </div>
        <p className="text-[11px] text-orange-400/50">
          O bônus aqui soma à rolagem do dono, não substitui: d20 + modificador do ninja + proficiência + este bônus.
        </p>
        {spec.attacks.map((a) => (
          <div key={a.id} className="flex min-w-0 flex-wrap items-end gap-1.5">
            <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-orange-400/60">
              nome
              <Input
                value={a.name}
                placeholder="Ferrão envenenado"
                className="px-2 py-0.5 text-xs"
                onChange={(e) => mexer({ attacks: spec.attacks.map((x) => (x.id === a.id ? { ...x, name: e.target.value } : x)) })}
              />
            </label>
            <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
              bônus
              <Input
                type="number"
                value={a.bonus}
                className="w-20 px-2 py-0.5 text-xs"
                onChange={(e) => mexer({ attacks: spec.attacks.map((x) => (x.id === a.id ? { ...x, bonus: Number(e.target.value) || 0 } : x)) })}
              />
            </label>
            <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
              dano
              <Input
                value={a.damage}
                placeholder="1d8"
                className="w-24 px-2 py-0.5 text-xs"
                onChange={(e) => mexer({ attacks: spec.attacks.map((x) => (x.id === a.id ? { ...x, damage: e.target.value } : x)) })}
              />
            </label>
            <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
              tipo
              <Input
                value={a.damageType ?? ''}
                placeholder="Perfurante"
                className="w-28 px-2 py-0.5 text-xs"
                onChange={(e) => mexer({ attacks: spec.attacks.map((x) => (x.id === a.id ? { ...x, damageType: e.target.value } : x)) })}
              />
            </label>
            <button
              className="shrink-0 pb-1 text-[11px] text-red-400 hover:text-red-200"
              onClick={() => mexer({ attacks: spec.attacks.filter((x) => x.id !== a.id) })}
            >
              x
            </button>
          </div>
        ))}
        {spec.attacks.length === 0 && <p className="text-[11px] text-orange-300/50">Nenhum golpe ainda.</p>}
      </div>

      {/* ---- Jutsus próprios ---- */}
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-display text-[11px] uppercase tracking-[0.12em] text-orange-400/60">Jutsus da marionete</p>
          <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => mexer({ jutsus: [...spec.jutsus, novoJutsu()] })}>
            + jutsu
          </Button>
        </div>
        <p className="text-[11px] text-orange-400/50">
          Mecânica própria: você escolhe se resolve como ataque contra a CA, como resistência contra o PR do alvo, ou sem
          rolagem. O chakra sai da ficha do dono.
        </p>
        {spec.jutsus.map((j) => (
          <div key={j.id} className="flex min-w-0 flex-col gap-1.5 rounded-sm border border-[color:var(--line)] p-2">
            <div className="flex min-w-0 flex-wrap items-end gap-1.5">
              <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-orange-400/60">
                nome
                <Input
                  value={j.name}
                  placeholder="Lâminas de Vento"
                  className="px-2 py-0.5 text-xs"
                  onChange={(e) => mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, name: e.target.value } : x)) })}
                />
              </label>
              <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                chakra do dono
                <Input
                  type="number"
                  min={0}
                  value={j.chakraCost}
                  className="w-24 px-2 py-0.5 text-xs"
                  onChange={(e) =>
                    mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, chakraCost: Math.max(0, Number(e.target.value) || 0) } : x)) })
                  }
                />
              </label>
              <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                resolve como
                <Select
                  value={j.mode}
                  className="w-full px-2 py-0.5 text-xs sm:w-44"
                  onChange={(e) =>
                    mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, mode: e.target.value as PuppetJutsu['mode'] } : x)) })
                  }
                >
                  <option value="attack">Ataque contra a CA</option>
                  <option value="save">Resistência contra o PR</option>
                  <option value="none">Sem rolagem</option>
                </Select>
              </label>
              <button
                className="shrink-0 pb-1 text-[11px] text-red-400 hover:text-red-200"
                onClick={() => mexer({ jutsus: spec.jutsus.filter((x) => x.id !== j.id) })}
              >
                x
              </button>
            </div>

            <div className="flex min-w-0 flex-wrap items-end gap-1.5">
              {j.mode === 'attack' && (
                <>
                  <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                    atributo do dono
                    <Select
                      value={j.attackAttribute ?? 'dexterity'}
                      className="w-full px-2 py-0.5 text-xs sm:w-36"
                      onChange={(e) =>
                        mexer({
                          jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, attackAttribute: e.target.value as AttributeKey } : x)),
                        })
                      }
                    >
                      {ATTRIBUTE_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {ATTRIBUTE_LABELS[k]}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                    bônus
                    <Input
                      type="number"
                      value={j.bonus ?? 0}
                      className="w-20 px-2 py-0.5 text-xs"
                      onChange={(e) => mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, bonus: Number(e.target.value) || 0 } : x)) })}
                    />
                  </label>
                </>
              )}
              {j.mode === 'save' && (
                <>
                  <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                    alvo resiste com
                    <Select
                      value={j.saveAttribute ?? 'constitution'}
                      className="w-full px-2 py-0.5 text-xs sm:w-40"
                      onChange={(e) =>
                        mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, saveAttribute: e.target.value as AttributeKey } : x)) })
                      }
                    >
                      {ATTRIBUTE_KEYS.map((k) => (
                        <option key={k} value={k}>
                          {ATTRIBUTE_LABELS[k]}
                        </option>
                      ))}
                    </Select>
                  </label>
                  <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                    se resistir
                    <Select
                      value={j.onSaveSuccess ?? 'none'}
                      className="w-full px-2 py-0.5 text-xs sm:w-36"
                      onChange={(e) =>
                        mexer({
                          jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, onSaveSuccess: e.target.value as 'none' | 'half' } : x)),
                        })
                      }
                    >
                      <option value="none">sem dano</option>
                      <option value="half">metade do dano</option>
                    </Select>
                  </label>
                </>
              )}
              <label className="flex flex-col gap-0.5 text-[10px] text-orange-400/60">
                dano
                <Input
                  value={j.damage ?? ''}
                  placeholder="3d6"
                  className="w-24 px-2 py-0.5 text-xs"
                  onChange={(e) => mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, damage: e.target.value } : x)) })}
                />
              </label>
              <label className="flex min-w-0 flex-1 flex-col gap-0.5 text-[10px] text-orange-400/60">
                efeito (texto, para a mesa ler)
                <Input
                  value={j.description ?? ''}
                  placeholder="Nuvem de veneno: Envenenado por 1 rodada"
                  className="px-2 py-0.5 text-xs"
                  onChange={(e) => mexer({ jutsus: spec.jutsus.map((x) => (x.id === j.id ? { ...x, description: e.target.value } : x)) })}
                />
              </label>
            </div>
          </div>
        ))}
        {spec.jutsus.length === 0 && <p className="text-[11px] text-orange-300/50">Nenhum jutsu ainda.</p>}
      </div>

      <label className="flex flex-col gap-1 text-xs text-orange-400/60">
        itens acoplados e seus efeitos
        <Textarea
          rows={2}
          value={spec.gearText ?? ''}
          placeholder="Lança-chamas no braço esquerdo; compartimento de bombas de fumaça; lâmina retrátil banhada em veneno"
          onChange={(e) => mexer({ gearText: e.target.value })}
        />
      </label>
    </div>
  )
}

/** Uma marionete nova, com números de partida que o mestre ajusta. */
export function novaMarionete(): PuppetSpec {
  return { hp: 20, armorClass: 13, resistancePoints: 13, activationCost: 3, attacks: [], jutsus: [] }
}
