import { JUTSU_CATALOG } from '../../data/jutsus'
import { CONDITIONS } from '../../data/conditions'
import { readArea, readConditions, readJutsu } from '../jutsuCast'
import { condicoesDe, mesclarCondicoes, refDaFicha, selo, tirarCondicao } from '../conditions'
import type { ActiveCondition, Character, Companion, GameTable, NPC } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

// --- Leitura das condições no texto do manual
{
  const nomes = new Set(CONDITIONS.map((c) => c.name))
  let comCondicao = 0
  let comArea = 0
  for (const j of JUTSU_CATALOG) {
    const lido = readJutsu(j)
    ok(
      lido.conditions.every((n) => nomes.has(n)),
      `${j.name}: condição lida fora da tabela do manual (${lido.conditions.join(', ')})`,
    )
    if (lido.conditions.length) comCondicao++
    if (lido.area) comArea++
  }
  ok(comCondicao > 100, `poucos jutsus com condição lida: ${comCondicao}`)
  ok(comArea > 80, `poucos jutsus com área lida: ${comArea}`)
  console.log(`condições lidas em ${comCondicao} de ${JUTSU_CATALOG.length} jutsus; área em ${comArea}`)
}

// --- O texto que TIRA a condição não pode virar condição imposta
{
  ok(readConditions('O alvo fica Cego até o fim do próximo turno.').includes('Cego'), 'impor Cego é condição')
  ok(!readConditions('Remove a condição Cego do aliado.').includes('Cego'), 'remover Cego não impõe Cego')
  ok(!readConditions('O alvo fica imune a Paralisado por 1 minuto.').includes('Paralisado'), 'imunidade não impõe')
  ok(!readConditions('Ganha resistência a Envenenado.').includes('Envenenado'), 'resistência não impõe')
}

// --- Prazo em rodadas
{
  const porMinuto = readJutsu({ description: 'O alvo fica Atordoado por 1 minuto.', cost: '3 Chakras', classification: 'Ninjutsu' })
  ok(porMinuto.conditionRounds === 10, `1 minuto = 10 rodadas, veio ${porMinuto.conditionRounds}`)
  const porRodada = readJutsu({ description: 'O alvo fica Caído por 3 rodadas.', cost: '', classification: 'Taijutsu' })
  ok(porRodada.conditionRounds === 3, `3 rodadas, veio ${porRodada.conditionRounds}`)
  const ateOTurno = readJutsu({ description: 'O alvo fica Lento até o final do próximo turno.', cost: '', classification: 'Ninjutsu' })
  ok(ateOTurno.conditionRounds === 1, `até o próximo turno = 1 rodada, veio ${ateOTurno.conditionRounds}`)
  const semPrazo = readJutsu({ description: 'O alvo fica Petrificado até ser curado.', cost: '', classification: 'Ninjutsu' })
  ok(semPrazo.conditionRounds === undefined, 'sem prazo no texto, sem prazo na ficha')
}

// --- Área
{
  ok(readArea('Todas as criaturas em um raio de 6 metros...') === 'raio de 6 m', 'raio lido')
  ok(readArea('Cada criatura em um cone de 9 metros...') === 'cone de 9 m', 'cone lido')
  ok(readArea('Você toca o alvo e ele sofre 2d6.') === undefined, 'alvo único não é área')
}

// --- Mesclar: não empilha duplicata, e o prazo maior vence
{
  const atuais: ActiveCondition[] = [{ name: 'Cego', rounds: 2 }]
  const maisLongo = mesclarCondicoes(atuais, ['Cego'], 5)
  ok(maisLongo.length === 1, 'reaplicar não cria duas cópias')
  ok(maisLongo[0].rounds === 5, `o prazo maior vence, veio ${maisLongo[0].rounds}`)

  const maisCurto = mesclarCondicoes(atuais, ['Cego'], 1)
  ok(maisCurto[0].rounds === 2, 'reaplicar com prazo menor não encurta o que já pegava')

  const semPrazo = mesclarCondicoes(atuais, ['Cego'], undefined)
  ok(semPrazo[0].rounds === undefined, 'sem prazo vence qualquer contagem: dura até o mestre tirar')

  const nova = mesclarCondicoes(atuais, ['Caído'], 1)
  ok(nova.length === 2 && nova.some((c) => c.name === 'Caído'), 'condição nova entra')

  ok(tirarCondicao(nova, 'Cego').length === 1, 'tirar condição tira uma só')
  ok(mesclarCondicoes([], [], undefined).length === 0, 'sem condição, nada acontece')
}

// --- Onde a leitura busca: a ficha manda, o combate é o reserva
{
  const mesa = {
    combatOrder: [{ ref: 'character:c1', name: 'Naruto', initiative: 10, conditions: [{ name: 'Cego' }] }],
  } as unknown as GameTable

  const antiga = { id: 'c1', name: 'Naruto', classId: 'x' } as unknown as Character
  ok(condicoesDe(antiga, mesa).some((c) => c.name === 'Cego'), 'ficha antiga ainda lê da lista de combate')

  const nova = { id: 'c1', name: 'Naruto', classId: 'x', conditions: [{ name: 'Caído', rounds: 1 }] } as unknown as Character
  ok(condicoesDe(nova, mesa)[0].name === 'Caído', 'quando a ficha tem condição, é ela que vale')

  const limpa = { id: 'c1', name: 'Naruto', classId: 'x', conditions: [] } as unknown as Character
  ok(condicoesDe(limpa, mesa).length === 0, 'lista vazia é resposta: o mestre limpou')

  ok(refDaFicha(nova) === 'character:c1', 'referência de personagem')
  ok(refDaFicha({ id: 'n1', name: 'Bandido' } as unknown as NPC) === 'npc:n1', 'referência de NPC')
  ok(refDaFicha({ id: 'k1', ownerCharacterId: 'c1' } as unknown as Companion) === 'companion:k1', 'referência de ficha temporária')
  ok(selo('Envenenado') === 'ENV', `sigla de três letras, veio ${selo('Envenenado')}`)
}

console.log('OK: checagens de condição passaram')
