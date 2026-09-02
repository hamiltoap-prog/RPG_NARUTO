// Fonte: manual de regras, Capítulo 6/9 — ver docs/rules/09-outras-mecanicas.md
import type { Condition } from '../types'

export const CONDITIONS: Condition[] = [
  { name: 'Normal', effect: 'Nenhum efeito.', resistancePointsModifier: '—' },
  { name: 'Frenesi', effect: 'Ataca a criatura mais próxima toda rodada; desvantagem em Sabedoria; falha automática em habilidade/resistência de Inteligência; imune a Enfeitiçado/Amedrontado.', resistancePointsModifier: '+5 (Sabedoria)' },
  { name: 'Sangramento', effect: '1d4 dano necrótico no fim do turno; Medicina com desvantagem para estancar; cresce +1d4 por reaplicação.', resistancePointsModifier: '+5 (testes medicinais)' },
  { name: 'Cego', effect: 'Falha automática em testes que exigem visão; ataques contra você têm vantagem; seus ataques têm desvantagem.', resistancePointsModifier: '—' },
  { name: 'Queimado', effect: '1d10 dano de fogo no início do turno por 1 min; uma ação apaga.', resistancePointsModifier: '+5 (testes com fogo)' },
  { name: 'Enfeitiçado', effect: 'Não pode atacar/prejudicar quem o enfeitiçou; o feiticeiro tem vantagem em interação social.', resistancePointsModifier: '+5 (Sabedoria)' },
  { name: 'Atordoado', effect: 'Só 1 Ação de Movimento OU 1 Ação Padrão; sem ação bônus/reação; dura até início do próximo turno.', resistancePointsModifier: '+5 (movimentação)' },
  { name: 'Surdo', effect: 'Falha automática em testes que exigem audição.', resistancePointsModifier: '—' },
  { name: 'Envenenado', effect: '1d6 dano de veneno no início do turno; até 5 aplicações (+1d6 cada, máx. 5d6).', resistancePointsModifier: '+5 (todos)' },
  { name: 'Exausto', effect: 'Níveis de Exaustão (1 a 6): desvantagens crescentes até a morte no nível 6. Descanso longo com comida/água reduz 1 nível.', resistancePointsModifier: '+5 (nível 3+)' },
  { name: 'Amedrontado', effect: 'Desvantagem em testes/ataques enquanto vê a fonte do medo; não pode se aproximar voluntariamente dela.', resistancePointsModifier: '+5 (todos)' },
  { name: 'Agarrado', effect: 'Velocidade 0, sem bônus de velocidade; termina se agarrador incapacitado ou removido do alcance.', resistancePointsModifier: '+5 (Destreza)' },
  { name: 'Incapacitado', effect: 'Não pode realizar ações nem reações.', resistancePointsModifier: 'N/A' },
  { name: 'Invisível', effect: 'Impossível de ver sem sentido especial; ataques contra você desvantagem, seus ataques vantagem.', resistancePointsModifier: '—' },
  { name: 'Paralisado', effect: 'Incapacitado, não se move/fala; falha automática em FOR/DES; ataques contra você têm vantagem; acerto a <2m é crítico automático.', resistancePointsModifier: 'N/A (falha automática FOR/DES)' },
  { name: 'Petrificado', effect: 'Vira substância sólida; incapacitado, inconsciente do entorno; resistência a todo dano; imune a veneno/doença.', resistancePointsModifier: 'N/A' },
  { name: 'Caído', effect: 'Só rasteja (a menos que se levante); desvantagem em corpo a corpo e à distância >9m.', resistancePointsModifier: '—' },
  { name: 'Restrito', effect: 'Velocidade 0; ataques contra você vantagem, seus ataques desvantagem.', resistancePointsModifier: '+5 (Destreza)' },
  { name: 'Choque', effect: 'Velocidade ½; sem reações; resistência/imunidade a Raio = mesma para esta condição.', resistancePointsModifier: '+5 (todos)' },
  { name: 'Lento', effect: 'Velocidade ½, CA −2; sem reações; só 1 ação OU ação bônus (nunca ambas).', resistancePointsModifier: '+5 (Destreza)' },
  { name: 'Estupefato', effect: 'Incapacitado, não se move, fala com dificuldade; falha automática FOR/DES; ataques contra você vantagem.', resistancePointsModifier: 'N/A' },
  { name: 'Inconsciente', effect: 'Incapacitado, não se move/fala, sem ciência do entorno; larga itens e cai; acerto a <2m é crítico automático.', resistancePointsModifier: 'N/A' },
  { name: 'Enfraquecido', effect: 'Metade do dano corpo a corpo; desvantagem em teste/resistência FOR e DES; velocidade −3m.', resistancePointsModifier: '+5 (Força e Destreza)' },
]
