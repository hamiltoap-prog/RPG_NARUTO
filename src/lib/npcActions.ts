import { attackAttribute, findCatalogEntry, readArea, readJutsu } from './jutsuCast'
import type { CompanionAction } from './companions'
import type { NPC } from '../types'

/**
 * Tudo que a criatura pode fazer neste turno, já com a conta montada.
 *
 * Mesma forma das ações de uma ficha temporária (`CompanionAction`), de
 * propósito: quem desenha a tela e quem resolve a rolagem não precisam saber
 * se quem age é um clone, uma marionete ou o urso que o mestre trouxe do
 * bestiário. Um modelo de ação, um caminho de resolução.
 *
 * A criatura rola com o **bônus fechado** dos golpes dela — o número que o
 * mestre escreveu na ficha já é a conta inteira, sem somar atributo nem
 * proficiência por cima. As armas que ela carrega usam esse mesmo bônus: a
 * arma dá o dado, a criatura dá a mão que a segura.
 */
export function npcActions(npc: NPC): CompanionAction[] {
  const acoes: CompanionAction[] = []
  /** O bônus do primeiro golpe é o "bônus de ataque" da criatura. */
  const bonusNatural = npc.attacks?.[0]?.bonus ?? 0

  for (const a of npc.attacks ?? []) {
    acoes.push({
      id: `attack:${a.id}`,
      label: `${a.name} ${a.bonus >= 0 ? '+' : ''}${a.bonus} · ${a.damage}`,
      source: 'attack',
      mode: 'attack',
      attackAttribute: 'strength',
      proficient: false,
      extraBonus: a.bonus,
      damage: a.damage,
      damageType: a.damageType,
      chakraCost: 0,
      note: 'golpe natural: o bônus da ficha já é a conta inteira',
    })
  }

  for (const w of (npc.weapons ?? []).filter((x) => (x.quantity ?? 1) > 0)) {
    acoes.push({
      id: `weapon:${w.id}`,
      label: `${w.name} · ${w.damage}${(w.quantity ?? 1) > 1 ? ` (${w.quantity})` : ''}`,
      source: 'weapon',
      mode: 'attack',
      attackAttribute: 'strength',
      proficient: false,
      extraBonus: bonusNatural,
      damage: w.damage,
      damageType: w.damageType,
      chakraCost: 0,
      note: w.consumable ? 'de arremesso: gasta uma unidade' : undefined,
    })
  }

  for (const j of npc.jutsus ?? []) {
    const entrada = findCatalogEntry(j.name)
    if (!entrada) {
      // Jutsu que a mesa escreveu direto na ficha, sem entrada no catálogo:
      // entra como efeito narrado, para não sumir da lista de ações.
      acoes.push({
        id: `jutsu:${j.id}`,
        label: j.name,
        source: 'jutsu',
        mode: 'none',
        attackAttribute: 'intelligence',
        proficient: true,
        chakraCost: Number((j.chakraCost ?? '').match(/\d+/)?.[0] ?? 0),
        note: j.details,
      })
      continue
    }
    const lido = readJutsu(entrada)
    acoes.push({
      id: `jutsu:${j.id}`,
      label: `${j.name}${lido.cost ? ` (${lido.cost} chakra)` : ''}`,
      source: 'jutsu',
      mode: lido.mode,
      attackAttribute: attackAttribute(entrada.classification),
      saveAttribute: lido.saveAttribute,
      proficient: true,
      damage: lido.damage,
      damageType: lido.damageType,
      chakraCost: lido.cost,
      conditions: lido.conditions,
      conditionRounds: lido.conditionRounds,
      area: lido.area ?? readArea(entrada.description),
      note: lido.healing ? `cura ${lido.healing} — o app não mexe em PV por isso` : undefined,
    })
  }

  return acoes
}
