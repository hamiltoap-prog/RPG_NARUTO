import type { CombatParticipant, GameTable } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

/**
 * A conta de entrar no meio da luta, sem Firestore.
 *
 * É a mesma da store.addCombatants: junta, reordena pela iniciativa e remenda
 * o índice do turno para continuar apontando para QUEM estava agindo. Copiada
 * aqui porque a de lá escreve no banco; o que interessa checar é a conta.
 */
function entrar(table: GameTable, novos: CombatParticipant[]) {
  const jaEstao = new Set(table.combatOrder.map((p) => p.ref))
  const entram = novos.filter((p) => !jaEstao.has(p.ref))
  if (entram.length === 0) return { order: table.combatOrder, turno: table.combatTurnIndex }
  const deQuemEraAVez = table.combatOrder[table.combatTurnIndex]?.ref
  const order = [...table.combatOrder, ...entram].sort(
    (a, b) => Number(a.surprised) - Number(b.surprised) || b.initiative - a.initiative,
  )
  const turno = deQuemEraAVez ? Math.max(0, order.findIndex((p) => p.ref === deQuemEraAVez)) : table.combatTurnIndex
  return { order, turno }
}

const p = (ref: string, ini: number, surpreso = false): CombatParticipant =>
  ({ ref, name: ref, initiative: ini, surprised: surpreso, boss: false, conditions: [] }) as CombatParticipant

const mesa = (order: CombatParticipant[], turno: number) =>
  ({ combatActive: true, combatOrder: order, combatTurnIndex: turno, combatRound: 2 }) as unknown as GameTable

// --- Quem chega entra no lugar certo e não atropela a vez de ninguém
{
  const base = [p('character:a', 18), p('npc:b', 12), p('character:c', 5)]
  const t = mesa(base, 1) // é a vez do npc:b

  const alto = entrar(t, [p('npc:novo', 20)])
  ok(alto.order.map((x) => x.ref).join(',') === 'npc:novo,character:a,npc:b,character:c', 'iniciativa 20 vai para o começo')
  ok(alto.order[alto.turno].ref === 'npc:b', 'a vez continua com quem estava agindo')

  const meio = entrar(t, [p('npc:novo', 15)])
  ok(meio.order[1].ref === 'npc:novo', 'iniciativa 15 entra entre 18 e 12')
  ok(meio.order[meio.turno].ref === 'npc:b', 'a vez continua com quem estava agindo, entrando no meio')

  const baixo = entrar(t, [p('npc:novo', 1)])
  ok(baixo.order[3].ref === 'npc:novo', 'iniciativa 1 vai para o fim')
  ok(baixo.order[baixo.turno].ref === 'npc:b', 'a vez continua com quem estava agindo, entrando no fim')
}

// --- Surpreso vai para o fim, como manda o manual, seja qual for a rolagem
{
  const t = mesa([p('character:a', 18), p('npc:b', 12)], 0)
  const r = entrar(t, [p('npc:emboscado', 20, true)])
  ok(r.order[r.order.length - 1].ref === 'npc:emboscado', 'surpreso vai para o fim mesmo tirando 20')
  ok(r.order[r.turno].ref === 'character:a', 'e a vez não se mexe')
}

// --- Entrar duas vezes não duplica
{
  const t = mesa([p('character:a', 18)], 0)
  const r = entrar(t, [p('character:a', 3)])
  ok(r.order.length === 1, 'quem já está na luta não entra de novo')
  ok(r.order[0].initiative === 18, 'e a iniciativa dele não é reescrita')
}

// --- Vários de uma vez (uma leva de clones, por exemplo)
{
  const t = mesa([p('character:a', 10)], 0)
  const r = entrar(t, [p('companion:1', 14), p('companion:2', 7)])
  ok(r.order.map((x) => x.ref).join(',') === 'companion:1,character:a,companion:2', 'a leva inteira entra ordenada')
  ok(r.order[r.turno].ref === 'character:a', 'a vez segue com quem estava agindo')
}

console.log('OK: checagens de entrada no combate passaram')
