import { Badge, Button, Card, Input, SectionTitle } from './ui'
import { addLogEntry, updateCharacterDirect, updateTable } from '../lib/store'
import { DEFAULT_SURVIVAL } from '../types'
import type { Character, GameTable } from '../types'

/**
 * Quantos dias fazem que comeu e bebeu, e se isso já pesa.
 *
 * Quem não tem registro fica como "sem registro", e não como "comeu hoje":
 * usar o dia corrente de padrão fazia a referência andar junto com o
 * calendário, e ninguém nunca ficava com fome.
 */
export function survivalStatus(character: Character, table: GameTable) {
  const s = table.survival ?? DEFAULT_SURVIVAL
  const c = character.survival
  if (!c) return { semRegistro: true as const, semComer: 0, semBeber: 0, comFome: false, comSede: false, limites: s }
  const semComer = Math.max(0, s.day - c.lastMeal)
  const semBeber = Math.max(0, s.day - c.lastDrink)
  return {
    semRegistro: false as const,
    semComer,
    semBeber,
    comFome: semComer >= s.foodDays,
    comSede: semBeber >= s.waterDays,
    limites: s,
  }
}

/**
 * Fome e sede — regra da casa.
 *
 * O manual não tem regra de alimentação; tem o gancho, na Exaustão: um
 * descanso longo *com comida e água* reduz um nível. Então o painel conta os
 * dias e, quando alguém passa do limite, oferece aplicar a Exaustão que o
 * manual já descreve — em vez de inventar uma condição nova.
 *
 * Aplicar é decisão do mestre, não automática: ele pode ter dado um jantar na
 * ficção sem clicar em nada.
 */
export function SurvivalPanel({ table, characters }: { table: GameTable; characters: Character[] }) {
  const s = table.survival ?? DEFAULT_SURVIVAL
  const vivos = characters.filter((c) => !c.isNPC)

  function mexer(patch: Partial<typeof s>) {
    return updateTable(table.id, { survival: { ...s, ...patch } })
  }

  /**
   * Ligar a regra marca todo mundo como alimentado hoje — é o ponto de
   * partida justo. Sem isso o grupo inteiro começaria faminto por não ter
   * registro nenhum.
   */
  async function ligar(ativo: boolean) {
    await mexer({ enabled: ativo })
    if (!ativo) return
    await Promise.all(
      vivos
        .filter((c) => !c.survival)
        .map((c) => updateCharacterDirect(table.id, c.id, { survival: { lastMeal: s.day, lastDrink: s.day } })),
    )
  }

  async function novoDia() {
    const dia = s.day + 1
    await mexer({ day: dia })
    await addLogEntry(table.id, {
      actorName: table.gmName,
      actorType: 'gm',
      kind: 'system',
      summary: `Amanheceu — dia ${dia} da jornada.`,
    })
  }

  async function alimentar(c: Character, o: 'comeu' | 'bebeu' | 'ambos') {
    const atual = c.survival ?? { lastMeal: s.day, lastDrink: s.day }
    const proximo = {
      lastMeal: o === 'bebeu' ? atual.lastMeal : s.day,
      lastDrink: o === 'comeu' ? atual.lastDrink : s.day,
    }
    await updateCharacterDirect(table.id, c.id, { survival: proximo })
    await addLogEntry(table.id, {
      actorName: c.name,
      actorType: 'player',
      characterId: c.id,
      kind: 'system',
      summary: o === 'ambos' ? `${c.name} comeu e bebeu.` : `${c.name} ${o}.`,
    })
  }

  /** A Exaustão é a condição do manual; aqui só a aplicamos na ficha. */
  async function exaurir(c: Character, motivo: string) {
    await updateCharacterDirect(table.id, c.id, { condition: 'Exausto' })
    await addLogEntry(table.id, {
      actorName: c.name,
      actorType: 'player',
      characterId: c.id,
      kind: 'system',
      summary: `${c.name} ganhou Exaustão — ${motivo}.`,
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SectionTitle>Fome e sede</SectionTitle>
            <Badge tone="warn">regra da casa</Badge>
          </div>
          <label className="flex items-center gap-2 text-sm text-orange-100">
            <input type="checkbox" checked={s.enabled} onChange={(e) => ligar(e.target.checked)} />
            usar nesta mesa
          </label>
        </div>
        <p className="text-xs leading-relaxed text-orange-400/60">
          O manual não traz regra de alimentação — traz o gancho, na Exaustão: um descanso longo <i>com comida e água</i>{' '}
          reduz um nível. Aqui a contagem é dos dias; quando alguém passa do limite, o painel oferece aplicar a Exaustão
          que o manual já descreve. Quem aplica é você: pode ter havido um jantar na ficção sem ninguém clicar em nada.
        </p>

        {s.enabled && (
          <div className="flex flex-wrap items-end gap-3">
            <div className="well rounded-sm px-3 py-2">
              <p className="font-display text-xs uppercase tracking-[0.12em] text-orange-400/60">dia</p>
              <p className="font-display text-2xl leading-none text-white">{s.day}</p>
            </div>
            <Button variant="primary" onClick={novoDia}>
              Amanheceu →
            </Button>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              dias sem comer até pesar
              <Input
                type="number"
                min={1}
                value={s.foodDays}
                onChange={(e) => mexer({ foodDays: Math.max(1, Number(e.target.value) || 1) })}
                className="w-24"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-orange-400/60">
              dias sem beber até pesar
              <Input
                type="number"
                min={1}
                value={s.waterDays}
                onChange={(e) => mexer({ waterDays: Math.max(1, Number(e.target.value) || 1) })}
                className="w-24"
              />
            </label>
          </div>
        )}
      </Card>

      {s.enabled && (
        <div className="flex flex-col gap-1.5">
          {vivos.map((c) => {
            const st = survivalStatus(c, table)
            const aperta = st.comFome || st.comSede
            return (
              <Card key={c.id} className={`flex flex-wrap items-center gap-2 p-2.5 text-sm ${aperta ? 'border-[color:var(--orange)]' : ''}`}>
                <span className="text-orange-100">{c.name}</span>
                <span className="text-xs text-orange-400/60">
                  {st.semRegistro ? (
                    'sem registro — marque a primeira refeição'
                  ) : (
                    <>
                      {st.semComer === 0 ? 'comeu hoje' : `${st.semComer}d sem comer`} ·{' '}
                      {st.semBeber === 0 ? 'bebeu hoje' : `${st.semBeber}d sem beber`}
                    </>
                  )}
                </span>
                {st.comFome && <Badge tone="bad">com fome</Badge>}
                {st.comSede && <Badge tone="bad">com sede</Badge>}
                {c.condition === 'Exausto' && <Badge tone="warn">exausto</Badge>}
                <span className="ml-auto flex flex-wrap items-center gap-1.5">
                  <Button variant="good" className="px-2 py-0.5 text-[11px]" onClick={() => alimentar(c, 'ambos')}>
                    comeu e bebeu
                  </Button>
                  <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => alimentar(c, 'comeu')}>
                    só comeu
                  </Button>
                  <Button variant="secondary" className="px-2 py-0.5 text-[11px]" onClick={() => alimentar(c, 'bebeu')}>
                    só bebeu
                  </Button>
                  {aperta && c.condition !== 'Exausto' && (
                    <Button
                      variant="danger"
                      className="px-2 py-0.5 text-[11px]"
                      onClick={() => exaurir(c, st.comSede ? `${st.semBeber} dias sem beber` : `${st.semComer} dias sem comer`)}
                    >
                      aplicar exaustão
                    </Button>
                  )}
                </span>
              </Card>
            )
          })}
          {vivos.length === 0 && <p className="text-sm text-orange-300/50">Nenhum personagem de jogador na mesa ainda.</p>}
        </div>
      )}
    </div>
  )
}

/** O que o jogador vê na própria ficha, quando a mesa usa a regra. */
export function SurvivalHud({ table, character }: { table: GameTable; character: Character }) {
  if (!table.survival?.enabled) return null
  const st = survivalStatus(character, table)
  return (
    <Card className="flex flex-wrap items-center gap-2 p-3 text-sm">
      <SectionTitle className="mr-2">Dia {st.limites.day}</SectionTitle>
      {st.semRegistro ? (
        <span className="text-orange-300/60">Sem registro de refeição ainda.</span>
      ) : (
        <>
          <span className={st.comFome ? 'text-red-300' : 'text-orange-300/60'}>
            {st.semComer === 0 ? 'Comeu hoje' : `${st.semComer} dia(s) sem comer`}
          </span>
          <span className="text-orange-400/30">·</span>
          <span className={st.comSede ? 'text-red-300' : 'text-orange-300/60'}>
            {st.semBeber === 0 ? 'Bebeu hoje' : `${st.semBeber} dia(s) sem beber`}
          </span>
        </>
      )}
      {(st.comFome || st.comSede) && <Badge tone="bad">o corpo está cobrando</Badge>}
    </Card>
  )
}
