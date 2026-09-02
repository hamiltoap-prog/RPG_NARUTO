# Combate

Fonte: Capítulo 8 ("Combate"), mais referências ao Capítulo 9 (Jutsu) e Capítulo 6 (Testes de Atributo).

## Princípios do combate — unidades de tempo

- **1 Turno:** 6 segundos (a vez de um personagem agir).
- **10 Turnos:** 1 Rodada (ciclo completo de todos os participantes). *(Nota: nomenclatura invertida em relação ao D&D 5e padrão — aqui "turno" é a menor unidade e "rodada" agrupa 10 turnos; ver 00-observacoes.md.)*
- **1 Rodada:** 1 minuto.

## Sequência de Combate

1. **Surpresa** — determina quem foi pego desprevenido.
2. **Iniciativa** — define a ordem das ações.
3. **Declaração de Turno** — o jogador escolhe o que fazer.
4. **Resolução de Turno** — as ações ocorrem na ordem de iniciativa.

## Surpresa

**Teste:** 1d6 + Ajuste de Surpresa + Modificador de Destreza. Resultado **< 6** = surpreso (não age no primeiro turno).

**Anti-Surpresa:** habilidades sensoriais ou Byakugan ativo podem evitar.

**Tabela de Ajuste de Surpresa:**

| Situação | Modificador |
|---|---|
| Outro grupo em silêncio | −1 |
| Outro grupo camuflado | −1 |
| Outro grupo atento | +2 |
| Outro grupo furtivo | −2 |
| Baixa luminosidade / visibilidade | −1 |
| Grupo relaxado / concentrado | −1 |

## Iniciativa

Rolada **uma vez**, no início do combate: **1d20 + Modificador de Destreza**. Personagens surpresos vão para o final da lista.

**Exceções:** Mestre Estrategista usa **Inteligência** em vez de Destreza; Ninja Caçador soma seu **Bônus de Proficiência** ao teste.

## O turno shinobi

Cada turno = combinação de **um movimento + uma ação**, ou **dois movimentos**, mas nunca duas ações padrão (salvo característica específica).

- **Ação Padrão:** atacar (arma ou desarmado), conjurar Jutsu, usar item ninja (ex.: selo explosivo), primeiros socorros.
- **Movimentação:** caminhar até o deslocamento, ou Correr (dobro do deslocamento, abre mão da ação padrão).
- **Movimentação Especial:** gastando 1 PC, ativa Caminhar sobre a Água ou Correr pelas Paredes por até 1 hora.
- **Ação Livre:** ações instantâneas (largar item, recarregar arco).

## Mecânica de ataque e dano

**Ataque:** 1d20 + Modificador de Atributo + Bônus de Proficiência (se treinado) ≥ CA do alvo.

| Tipo de Ataque | Modificador |
|---|---|
| Ninjutsu | Inteligência |
| Ninjutsu à Distância (jutsu lançado) | Inteligência / Destreza |
| Ninjutsu Médico | Inteligência / Destreza |
| Taijutsu | Força / Destreza |
| Bukijutsu (Armas Corpo a Corpo) | Força / Destreza |
| Genjutsu | Sabedoria |
| Ataque à Distância (Armas) | Destreza |

**Dano:** subtrai-se o resultado dos dados de dano dos PV do alvo. Ataque desarmado = 1 + Modificador de Força (a menos que seja Especialista em Taijutsu, que usa dado próprio — ver 03-classes.md).

## Disputa de Jutsu

Quando dois jutsus com palavra-chave **Disputa** colidem, cada lado rola 1d20 + atributo relevante (+ Bônus de Proficiência se tiver a perícia relevante):

| Tipo | 1d20 + | Perícias que somam Proficiência |
|---|---|---|
| Ninjutsu | Inteligência | Ninjutsu ou Controle de Chakra |
| Taijutsu | Destreza | Taijutsu, Atletismo ou Acrobacia |
| Bukijutsu | Força | Bukijutsu, Atletismo ou Acrobacia |
| Genjutsu | Sabedoria | Genjutsu ou Controle de Chakra |

- **Resultado:** vencedor aplica dano/efeito total; perdedor falha e sofre **1 grau de Exaustão**.
- **Empate (Ninjutsu/Taijutsu/Bukijutsu):** ninguém sofre dano, ambos afastados até 3m do centro.
- **Empate (Genjutsu):** ninguém sofre dano.

## Vantagem Elemental

Ciclo: **Fogo > Vento > Raio > Terra > Água > Fogo**. Concede **Vantagem** na jogada de ataque ou no teste de Disputa para o usuário do elemento superior.

## Acertos e falhas críticas

- **20 natural:** sempre acerta, independente de CA/modificadores. Dano: dados de dano × modificador do nível de Proficiência ("dados de dano x Proficiência" — texto original; ver 00-observacoes.md quanto à interpretação exata dessa fórmula, que difere do "dobro dos dados" padrão de D&D).
- **1 natural:** sempre falha (falha crítica — o Mestre determina uma consequência ruim: escorregar, arremessar a arma, atingir aliado etc.).

## Dano e outros perigos

- Dano mínimo de um ataque bem-sucedido: **1**, mesmo com reduções.
- PV chega a 0: personagem fica **inconsciente**, indefeso, caído, sem ações.
- **Dano Massivo:** dano > metade do PV máximo em um único golpe → Teste de Resistência de Constituição vs. PR, ou morte instantânea.
- **Estabilização em combate:** aliado com teste de Medicina (Sabedoria) bem-sucedido estabiliza com 0 PV; falha dá ao ferido +4 na próxima jogada de proteção contra a morte.

### Outros perigos

| Perigo | Regra |
|---|---|
| Fogo Ambiental (não-Jutsu) | Pequenas 1d4 / Médias 1d6 / Grandes 1d10 de dano por turno; apagar exige 2 ações consecutivas (podem ser de 2 shinobi cooperando ou 1 em turnos diferentes); dano contínuo enquanto no fogo. Jutsus Katon têm valores próprios. |
| Quedas | >3m: 1d6 por 3m adicionais. Água/vegetação densa/solo macio: −1d6. Chakra nos pés pode amenizar. |
| Sufocamento/Afogamento | Prende a respiração por turnos = Constituição; depois, teste de Constituição por turno — falha leva a 0 PV imediatamente. |
| Ácido/Corrosivos | Frasco padrão (500ml): 1d4 inicial, reduz −1/turno (3→2→1→0). Quantidades maiores escalam. |

## Morte Inevitável

Cenários onde a sobrevivência é fisicamente impossível, sem teste possível (ex.: consumido por uma Bijūdama, submerso em lava, esmagado por colapso de montanha, chakra drenado irreversivelmente, preso em colapso dimensional). Reservado para situações narrativamente significativas.

## O Caminho da Morte

| Estado | Regra |
|---|---|
| **0 PV** | Inconsciente — desacordado e inerte por até 24h ou até ser curado. |
| **−1 PV** | Morrendo — Teste de Resistência de Constituição vs. PR no próximo turno; sucesso estabiliza; falha e sem ajuda até o fim do próximo turno = morte. |
| **Morto** | Fim. |

## Cura

- **Descanso Longo:** 1 PV por nível do personagem (sem executar nenhuma ação).
- **Assistido:** 1d4 + 1 PV por nível do auxiliador.
- **Primeiros-socorros:** enquanto "morrendo", auxílio bem-sucedido em Sabedoria estabiliza com 0 PV.

*(Nota: não há uma seção separada "Descansando" com durações formais de descanso curto/longo em horas — ver 00-observacoes.md.)*
