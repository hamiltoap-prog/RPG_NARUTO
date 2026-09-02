# Sistema de Jutsus / Magias

Fonte: Capítulo 9 ("Conjuração de Jutsu"), Capítulo 10 ("Ninjutsu"), Capítulo 11 ("Genjutsu"), Capítulo 12 ("Taijutsu"), Capítulo 13 ("Bukijutsu"), mais listas de Jutsus exclusivos de cada Clã (Capítulo 2) e a seção de Invocação (fim do Capítulo 10).

**Total de 631 jutsus/técnicas com stat-block completo extraídos e listados abaixo**, mais o sistema de Invocação (Kuchiyose) com 16 criaturas detalhadas (arquivo `04b-invocacoes.md`).

Um arquivo `jutsus_parsed.json` (todos os 631 registros já estruturados: nome, capítulo, seção, campos e descrição) acompanha esta pasta para facilitar a conversão direta para código.

## O que é um Jutsu

Técnica que canaliza chakra para criar um efeito. Existem cinco **Classificações**:

| Classificação | Descrição |
|---|---|
| **Hijutsu** | Jutsu de clã. Não pode ser aprendido fora da linhagem/clã específico. |
| **Ninjutsu** | Afeta o mundo físico. Base das cinco liberações de natureza (Terra, Vento, Fogo, Água, Relâmpago), Energia Espiritual (Yin) e Energia Física (Yang). |
| **Genjutsu** | Ilusões que afetam mente/percepção; usa Energia Espiritual (Yin); geralmente não afeta o mundo físico diretamente. |
| **Taijutsu** | Atividade física/marcial; usa Energia Física (Yang). |
| **Bukijutsu** | Subcategoria de Taijutsu focada em ferramentas/armas (espadas, fios, kunais, shurikens). |

## Jutsus Conhecidos

- Deve ser aprendido (ou acessado via item aprimorado) antes de ser usado; uma vez aprendido, está sempre "preparado".
- Jutsus concedidos por característica de classe/clã **não contam** no limite de Jutsus Conhecidos.
- O nº de Jutsus conhecidos por nível está na tabela de progressão de cada Classe (ver 03-classes.md).

## Pontos de Chakra (PC)

- Cada classe tem um **Dado de Chakra** (como o Dado de Vida).
- Conjurar um jutsu gasta PC = custo da técnica.
- **Descanso Curto:** restaura até metade do PC máximo.
- **Descanso Longo:** restaura todo o PC.

## Selos de Mão e limitações

**Selos de Mão (HS)** são gestos rápidos em ordem específica; exigem ao menos uma mão livre. Mãos ocupadas, agarramento, ou restrição de movimento/concentração podem impedir a conjuração, a critério do Mestre. A necessidade de selos diminui conforme o ninja ganha experiência.

## Rank (6 ranks: E, D, C, B, A, S)

| Rank | Descrição |
|---|---|
| **E** | Técnicas mais básicas/fracas; conhecimento comum. |
| **D** | Técnicas de Genin, aprendidas logo após a Academia; usadas em Missões Rank-D. |
| **C** | Técnicas de Chunin, exigem treinamento; Missões Rank-C. |
| **B** | Técnicas de Jonin/Chunin; Missões Rank-B (espionagem, assassinatos). |
| **A** | Técnicas de Kage/Jonin; algumas são Kinjutsu (proibidas, risco ao usuário); Missões Rank-A. |
| **S** | Rank mais alto; quase sempre técnicas de assinatura únicas; Missões Rank-S. |

**Correspondência com nível do personagem (não é 1:1):** por exemplo, um jutsu Rank-S normalmente exige nível 17 do personagem, não nível 6 (ver tabelas de progressão de classe: "Maior Rank de Jutsu" atinge D no 1º, C no 5º, B no 9º, A no 13º, S no 17º — padrão comum a todas as 8 classes).

## Tempo de Execução (Conjuração)

- **Ação Bônus:** rápido; só se não usou outra ação bônus no turno.
- **Ação de Turno Completo:** ocupa todo o turno.
- **Reação:** conjurado instantaneamente em resposta a um gatilho específico.
- **Tempos Longos (minutos/horas):** exige gastar a ação a cada turno e manter Concentração; se a concentração quebra, o jutsu falha mas o chakra não é gasto.

## Alcance

- **Metros** (maioria); **Toque** (criatura/objeto tocado); **Pessoal** (afeta só você ou origina-se de você).
- Uma vez conjurado, o efeito não é limitado pelo alcance a menos que dito o contrário.

## Componentes

| Sigla | Componente |
|---|---|
| **HS** | Selos de Mão — gestos rápidos, exige mão livre. |
| **CM** | Moldagem de Chakra — técnica avançada; rede de chakra selada/interrompida ou condição mental impede. |
| **CS** | Selos de Chakra — etiquetas de papel com tinta+chakra; exige mão livre para imprimir; quase obrigatório em Fuinjutsu. |
| **M** | Mobilidade — corpo inteiro livre, deslocamento >0. |
| **W** | Armas — item específico listado; corpo a corpo não é consumida; à distância consome munição salvo indicado. |
| **NT** | Ferramentas Ninja — pergaminhos, flores, kits; sempre consumidas pelo uso. |

## Duração

- **Instantâneo:** efeito ocorre em um instante, não pode ser dissipado.
- **Concentração:** mantém o efeito ativo; pode manter até **2 jutsus de concentração simultâneos**.
  - **Custo de Manutenção:** metade (arred. p/ baixo, mín. 1) do custo original, pago no início de cada turno, senão o jutsu termina.
  - **Perda de Concentração:** ao conjurar um 3º jutsu de concentração; ao sofrer dano (teste de atributo de Inteligência); ao ficar incapacitado ou morrer.

## Palavras-chave

Ninjutsu/Genjutsu/Taijutsu/Bukijutsu (definem o bônus de ataque com proficiência); **Hijutsu** (jutsu de clã); **Médico** (Ninjutsu Médico, exige característica/talento); **Liberação de Terra/Vento/Fogo/Água/Relâmpago** (exige afinidade de natureza — via Clã ou Classe, ou o Talento "Liberação de Natureza"); **Fuinjutsu** (selamento/invocação, geralmente exige CS); **Sensorial** (rastrear via chakra); **Confronto** (pode iniciar Disputa de Jutsu); **Finalizador** (técnicas poderosas de Taijutsu/Bukijutsu usadas ao fim de combos).

## Alvos e Áreas de Efeito

Precisa de caminho livre até o alvo (sem cobertura total); pode escolher a si mesmo como alvo salvo restrição contrária. Formas de área: **Cone, Cubo, Cilindro, Linha, Esfera** (regras de ponto de origem detalhadas no manual).

## Testes de Resistência

Mesmo cálculo do Teste de Atributo: **1d20 + Modificador vs. Pontos de Resistência (PR)**, somando Bônus de Proficiência se proficiente naquele teste.

## Jogadas de Ataque com Jutsu

**1d20 + Modificador de Atributo + Bônus de Proficiência**, comparado à CA do alvo.

| Tipo de Ataque | Modificador |
|---|---|
| Ninjutsu | Inteligência |
| Ninjutsu à Distância (jutsu lançado) | Inteligência / Destreza |
| Ninjutsu Médico | Inteligência / Destreza |
| Taijutsu | Força / Destreza |
| Bukijutsu (Armas Corpo a Corpo) | Força / Destreza |
| Genjutsu | Sabedoria |
| Ataque à Distância (Armas) | Destreza |

## Combinando Efeitos

Efeitos de jutsus **diferentes** se somam enquanto as durações se sobrepuserem. Efeitos do **mesmo** jutsu conjurado múltiplas vezes **não acumulam** — vale o mais potente enquanto coincidirem.

## Liberação Elemental

Palavras-chave de Liberação (Terra/Vento/Fogo/Água/Relâmpago) exigem afinidade de natureza correspondente, obtida via Clã (ex.: Uchiha tem Afinidade Passiva com Fogo), Classe (ex.: subclasses do Especialista em Ninjutsu) ou o Talento "Liberação de Natureza".

## Disputa de Jutsu (ver também 05-combate.md)

Quando dois jutsus com a palavra-chave "Disputa" colidem:

| Tipo | Atributo | Perícias que somam Proficiência |
|---|---|---|
| Ninjutsu | Inteligência | Ninjutsu ou Controle de Chakra |
| Taijutsu | Destreza | Taijutsu, Atletismo ou Acrobacia |
| Bukijutsu | Força | Bukijutsu, Atletismo ou Acrobacia |
| Genjutsu | Sabedoria | Genjutsu ou Controle de Chakra |

Vencedor aplica dano/efeito total; perdedor falha e sofre 1 grau de Exaustão. Empate: ninguém sofre dano (Ninjutsu/Taijutsu empurram ambos 3m do centro).

**Vantagem Elemental:** ciclo Fogo > Vento > Raio > Terra > Água > Fogo — dá Vantagem na jogada de ataque ou na Disputa ao usuário do elemento superior.

---

# Lista completa de Jutsus (631 entradas)

## Ninjutsu Não-Elemental

### RANK-E

#### CAPA DE INVISIBILIDADE

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** NT | **Palavras-chave:** Ninjutsu

Descrição: Você rapidamente puxa uma capa camaleônica sobre si enquanto está contra uma parede ou superfície. Você realiza um teste de Furtividade ao usar este jutsu para se misturar ao cenário. Você pode rolar um 1d4 adicional e adicionar o resultado ao teste. Este jutsu dura até você encerrá-lo ou realizar qualquer outra ação. Você deve fazer novos testes de Furtividade se desejar manter este jutsu no turno seguinte.

#### CLARÃO DE BOMBINHA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** NT | **Palavras-chave:** Ninjutsu, Bukijutsu

Descrição: Você pega um feixe de bombinhas de luz e usa seu chakra para acender os pavios antes de lançá-los em um arco à sua frente. Criaturas à sua frente em um espaço de 5 metros de largura devem ser bem-sucedidas em um teste de resistência de Sabedoria. Em uma falha, você tem vantagem no seu próximo ataque contra elas e elas têm desvantagem no próximo ataque delas.

#### CONSERTAR

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Ninjutsu

Descrição: Este jutsu repara uma única quebra ou rasgo em um objeto (não vivo) que você toca, como um elo de corrente quebrado, duas metades de uma chave, um manto rasgado ou um odre vazando. Desde que o dano não seja maior que 30 centímetros, você o conserta sem deixar vestígios do dano anterior.

#### DEFESA APRIMORADA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você foca chakra na camada superficial da sua pele, garantindo resistência a danos de Concussão, Perfuração e Cortante até o início do seu próximo turno.

#### FORMAÇÃO DO SELO CORDA DE LUZ

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você usa seu chakra para criar uma formação de selamento que se estende de você até uma criatura alvo que você possa ver, em linha reta. O alvo deve ser bem-sucedido em um teste de resistência de Força ou terá seu deslocamento reduzido a 0. Isso pode ser usado em conjunto com outros usuários no mesmo alvo; se o fizer, os Pontos de Resistência diminuem em -1 para cada usuário adicional.

#### GOLPE DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 2 metros | **Duração:** 1 rodada
**Componentes:** HS, CM, W (qualquer) | **Palavras-chave:** Ninjutsu

Descrição: Como parte da ação usada para conjurar este ninjutsu, você deve realizar um ataque corpo a corpo com uma arma contra uma criatura dentro do alcance, caso contrário o jutsu falha. Em um acerto, o alvo sofre os efeitos normais do ataque e recebe 1d6 de dano adicional. Em Ranks Superiores: O dano aumenta em 1d6 no 5º nível (2d6), 11º nível (3d6) e 17º nível (4d6).

#### LUZ

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** 1 Hora
**Componentes:** CM | **Palavras-chave:** Ninjutsu

Descrição: Você toca em um objeto que não seja maior que 3 metros em qualquer dimensão. Até o jutsu acabar, o objeto emite luz plena em um raio de 3 metros e luz penumbra por mais 3 metros adicionais. Cobrir o objeto completamente com algo opaco bloqueia a luz. O jutsu termina se você conjurá-lo novamente ou dispensá-lo com uma ação. Se o alvo for um objeto segurado ou vestido por uma criatura hostil, ela deve passar em um teste de resistência de Destreza para evitar o jutsu.

#### MÃOS DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** 1 minuto (10 turnos)
**Componentes:** CM | **Palavras-chave:** Ninjutsu

Descrição: O Jutsu da Mãos de Chakra permite invocar uma mão translúcida de chakra puro que obedece à sua vontade, pairando em um ponto que você determinar. Você a controla com sua ação, podendo usá-la para manipular objetos leves, abrir portas destrancadas, pegar ou guardar itens em até 9 metros de distância. A mão é frágil: não pode atacar, ativar artefatos selados, carregar mais que 5 kg, e desaparece instantaneamente se você se afastar além de 9 metros, terminar a concentração ou voluntariamente dissipar o jutsu.

#### MOVIMENTAÇÃO DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você transfere chakra para a sola dos seus pés, criando uma forte força repulsiva ao liberar este jutsu, aumentando momentaneamente sua velocidade. Aumente seu deslocamento em 3 metros até o final do seu próximo turno. Em Ranks Superiores: O bônus de deslocamento deste Jutsu aumenta em 3m por nível, no 5º nível (6m), 11º nível (9m) e 17º nível (12m).

#### PERÍCIA APRIMORADA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você foca chakra em diferentes partes do corpo para aumentar sua habilidade em tarefas. Você pode rolar um 1d4 adicional e adicionar o valor a um teste de perícia de sua escolha. Você pode rolar o dado antes ou depois de realizar o teste. Este jutsu dura até o início do seu próximo turno. Em Ranks Superiores: Role um 1d4 adicional no 5º nível (2d4), 11º nível (3d4) e 17º nível (4d4).

#### PULSO DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 1,5 metro | **Duração:** Instantânea
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você cria um pulso vigoroso de chakra que irrompe do seu corpo. Cada criatura a até 2 metros de você, exceto você, deve ser bem-sucedida em um teste de resistência de Destreza ou sofrerá 2d4 de dano de força. Em Ranks Superiores: A eficácia deste Jutsu aumenta em 2d4 no 5º nível (4d4), 11º nível (6d4) e 17º nível (8d4).

#### RESISTÊNCIA APRIMORADA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você foca chakra por todo o corpo, reforçando-o contra ataques. Você pode rolar um 1d4 adicional e adicionar o valor a um teste de resistência de sua escolha. Você pode rolar o dado antes ou depois de realizar o teste. Este jutsu dura até o início do seu próximo turno. Em Ranks Superiores: Role um 1d4 adicional no 5º nível (2d4), 11º nível (3d4) e 17º nível (4d4).

#### TÉCNICA DE ESCAPADA

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** — | **Palavras-chave:** Ninjutsu

Descrição: Você usa o chakra para sentir os nós de cordas, correntes e outras ferramentas usadas para prendê-lo ou imobilizá-lo. Isso ajuda a encontrar a melhor rota de fuga. Você realiza Testes de Atributo com vantagem quando estiver impedido, amarrado ou preso de qualquer forma física. O teste que apresenta vantagem deve ser aplicado somente se for com intenção de escapar.

#### VIRTUDE

**Classificação:** Ninjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** 1 Rodada
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você toca uma criatura, imbuindo-a de vitalidade. Se o alvo tiver pelo menos 1 ponto de vida, ele ganha uma quantidade de pontos de vida temporários igual a 1d4 + o valor da sua proficiência (caso tenha perícia em Ninjutsu ou Médico). Os pontos de vida temporários são perdidos quando o jutsu termina.

### RANK-D

#### AURA OPRESSORA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 3 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Você exerce uma aura intensa visível a olho nu. Criaturas a até 3 metros devem passar em uma resistência de Constituição ou serão forçadas a ficar de joelhos e ficarão Incapacitadas pela duração. Alvos incapacitados podem repetir o teste em seus turnos.

#### BRAÇOS DE BUDA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Você foca seu chakra por todo o corpo, culminando em um Buda dourado que se forma ao seu redor e realiza múltiplos ataques com seus 100 braços. Realize uma Jogada de Ataque de Ninjutsu; em um acerto, o alvo sofre 4d6 de dano de concussão. O alvo precisa fazer teste em Constituição para saber se ficará Atordoado até o próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d6.

#### CAMUFLAGEM CORPORAL

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você reveste seu corpo com chakra e imita a cor e a textura da área ao seu redor, misturando-se como um camaleão. Pela duração, role um 1d10 adicional e adicione o resultado aos seus testes de Furtividade. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3. Você pode selecionar uma criatura adicional por rank, que também ganhará os benefícios.

#### CINTILAÇÃO CORPORAL

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** 1 rodada
**Componentes:** HM, M | **Palavras-chave:** Ninjutsu

Descrição: Você ganha maestria de movimento, permitindo cobrir distâncias muito maiores em menos tempo. Até o início do seu próximo turno, dobre seu deslocamento.

#### DETECTAR VENENO E DOENÇA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você sente a presença e localização de venenos, criaturas venenosas e doenças a até 9 metros. Você também identifica o tipo em cada caso.

#### ELIXIR DE CURA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** 1 Hora
**Componentes:** HS, CM, NT (Kit Médico) | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você cria um elixir em um frasco simples, misturando itens do Kit Médico e infundindo seu chakra na bebida. Como uma ação, uma criatura pode bebê-lo ou administrá-lo em outra. Quem beber recupera 2d4+2 pontos de vida.

#### FRUTA DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, M | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você infunde até 10 frutas ou nozes com chakra médico. Uma criatura pode usar uma ação para comer um item, recuperando 1 ponto de vida e recebendo nutrição para um dia inteiro. A fruta perde a potência após 24 horas.

#### GOLPE ENREDANTE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** 1 rodada
**Componentes:** CM, M | **Palavras-chave:** Ninjutsu, Médico

Descrição: No próximo ataque com arma que atingir, você injeta chakra nos músculos do inimigo. O alvo deve passar em uma resistência de Constituição ou ficará Incapacitado. Criaturas Grandes ou maiores têm vantagem. Enquanto Incapacitado, o alvo sofre 1d6 de dano de força no início de cada turno dele. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d6.

#### GRITO TROVEJANTE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Cone de 6 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Cria um grito agudo focado. Criaturas na área devem passar em uma resistência de Constituição ou ficarão Surdas e Atordoadas. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o alcance em 3 metros.

#### LIBERAR / SELAR

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Até ser dissipado
**Componentes:** HS, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Sela uma porta ou recipiente por meio de um selo. Você e pessoas designadas podem abrir normalmente. Também permite tentar arrombar fechaduras usando apenas chakra.

#### MÃOS CURATIVAS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Suas mãos brilham em verde, acelerando a reprodução celular. O alvo recupera 1d10 + modificador de atributo de Inteligência / destreza de pontos de vida. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e a cura em 1d10 adicional.

#### MARCA DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 2 metros | **Duração:** 8 Horas
**Componentes:** HS, CS | **Palavras-chave:** Ninjutsu

Descrição: Você cria um selo de chakra e tenta colocá-lo em uma criatura. Realize um teste de ataque de ninjutsu. Em um acerto, o alvo fica marcado. Criaturas marcadas têm desvantagem em testes de Furtividade contra você. Adicione 1d8 a ataques corpo a corpo contra alvos marcados. Se você puder se teletransportar, pode escolher a criatura marcada como destino (respeitando o alcance do teletransporte).

#### PELE DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** 8 Horas
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Só pode ser usado se você não estiver vestindo armadura. Você se envolve em uma aura protetora que aumenta sua CA em +3. Termina se você vestir armadura ou dispensar o jutsu. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o bônus de CA em +1.

#### PICADA DA COBRA DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 5 metros | **Duração:** Instantânea
**Componentes:** HS, CS | **Palavras-chave:** Ninjutsu

Descrição: Você invoca uma cobra de chakra de uma parte do seu corpo. Faça um ataque de Ninjutsu. Causa 2d8 de dano de Veneno e exige uma resistência de Força. Se falhar, o alvo fica Envenenado. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o número de alvos em +1.

#### REAÇÕES APRIMORADAS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** 8 Horas
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você armazena chakra atrás dos olhos e articulações. Na primeira vez que rolar iniciativa durante a duração, adicione 1d4+1 ao resultado. O jutsu então encerra. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o bônus de iniciativa em 1d4+1.

#### SALTO DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, M | **Palavras-chave:** Ninjutsu

Descrição: Você foca chakra nas pernas, aumentando astronomicamente sua força de salto. Até o fim deste turno, dobre sua altura de salto.

#### TÉCNICA DE ALARME

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Cubo de 9 metros | **Duração:** 8 Horas
**Componentes:** HS, CS | **Palavras-chave:** Ninjutsu

Descrição: Você define um selo de chakra que se expande por 9 metros sobre a superfície onde é colocado e libera uma aura de chakra quase indetectável em um cubo de 9 metros. Até o fim do jutsu, um alarme alerta você sempre que uma criatura tocar ou entrar na área do selo. Ao colocar o selo, você pode designar criaturas que não ativam o alarme. Você também pode escolher se o alarme será mental ou sonoro.

#### TÉCNICA DE CATAPULTA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 45 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Escolha um objeto pesando de 0,5 a 3 kg que não esteja sendo usado ou carregado. O objeto voa em linha reta por até 30 metros. Se atingir uma criatura, ela deve fazer uma resistência de Destreza. Em uma falha, tanto o objeto quanto a criatura sofrem 3d8 de dano de concussão, e terão que fazer teste de constituição para saber se ficam Atordoadas. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3, o peso máximo em 2,5 kg e o dano em 1d8.

#### TÉCNICA DE INVOCAÇÃO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra (Veja a seção de Invocação)
**Tempo de Execução:** Ação de Turno Completo | **Alcance:** 3 metros | **Duração:** Instantânea
**Componentes:** HS, CS, CM | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Invoca uma criatura sábia com a qual você tenha um contrato de sangue. A criatura age na sua ordem de iniciativa como uma ação bônus. Ela permanece até ficar sem vida ou chakra, ou até 8 horas se passarem. Nota: Conferir mais informações sobre este jutsu no final desta seção em Jutsus de Invocação.

#### TÉCNICA DE SENSORIAMENTO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS | **Palavras-chave:** Ninjutsu

Descrição: Você cria um campo de chakra em um raio de 20 metros. Você sabe se há criaturas na área e a localização delas, além de detectar objetos ou locais afetados por chakra. Bloqueado por 2 metros de qualquer material.

#### TÉCNICA DE SUBSTITUIÇÃO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Reação (quando for alvo de ataque) | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, M | **Palavras-chave:** Ninjutsu

Descrição: Permite uma fuga rápida. Aumenta sua CA em +5 até o início do seu próximo turno contra o ataque gatilho. Testes de resistência de Destreza contra efeitos de área recebem +2 de bônus.

### RANK-C

#### AGULHAS DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, W | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você cria agulhas formadas de chakra e as lança contra uma criatura visível. Realize um teste de Ninjutsu à distância. Em um acerto, o alvo sofre 6d6 de dano Perfurante e deve ser bem-sucedido em uma resistência de Constituição; se falhar, perde 3 metros de deslocamento até o fim do próximo turno e fica com a condição de Sangramento. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3, o dano em 2d6 e reduza o deslocamento do alvo em mais 1 metro.

#### AGULHAS DE JIZO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 1 Reação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Seu cabelo cresce e endurece instantaneamente, envolvendo seu corpo com espinhos. Seu deslocamento torna-se 0, mas você ganha +3 na CA. Criaturas que realizarem ataques corpo a corpo contra você sofrem 3d8 de dano Perfurante e precisam fazer um teste de Constituição, se falharem estarão sobre a condição Sangramento. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3, a CA em +1 e o dano em 1d8.

#### AJUDA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros (10 metros) | **Duração:** 8 Horas
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você infunde um selo de chakra com chakra médico antes de colocá-lo em até três criaturas no alcance. Os pontos de vida máximos e os pontos de vida atuais de cada alvo aumentam em 10 pela duração do jutsu. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o bônus de pontos de vida em 5.

#### ARMA VIVA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Toque (18 metros) | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** CM | **Palavras-chave:** Ninjutsu

Descrição: Você toca uma arma imbuindo-a com chakra, fazendo-a flutuar. Ao conjurar, você pode mover a arma 9 metros e fazer um ataque de ninjutsu corpo a corpo contra uma criatura a 2 metros da arma. Dano: 2d8 + modificador de atributo de ninjutsu. Como ação bônus em turnos seguintes, pode movê-la 6 metros e atacar novamente. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 1d8.

#### ARMA VENENOSA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM, W | **Palavras-chave:** Ninjutsu, Médico

Descrição: Um veneno sai das glândulas sudoríparas de suas mãos e então você reveste uma arma com este veneno. Um alvo atingido sofre 2d4 de dano de Veneno adicional e deve passar em uma resistência de Constituição ou ficará Envenenado. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 1d4.

#### BISTURI DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Suas mãos são envoltas em chakra que garante a eficiência de corte de uma faca cirúrgica. Sempre que realizar um ataque desarmado, você pode usar sua perícia de Medicina para usar o atributo de Inteligência / Destreza em vez de Força em um ataque. Você ganha Vantagem em testes de Medicina.

#### BORRIFO ÁCIDO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Linha de 9 metros | **Duração:** Instantânea
**Componentes:** HS, NT | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você ingere um frasco de veneno e, usando seu controle refinado de chakra, mistura-o com o ácido estomacal para borrifá-lo como um jato em linha reta. Criaturas no alcance devem realizar um teste de resistência de Destreza. Em uma falha, é considerado Envenenado, sofrem 6d4 de dano de Veneno e recebem outros 2d4 de dano de Veneno no início de seus próximos 3 turnos. Em um sucesso, o alvo sofre metade do dano inicial e nenhum dano adicional. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o danos inicial em 1d4.

#### ESCURIDÃO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu

Descrição: Você infunde seu selo de chakra para conjurar um campo de escuridão mágica em uma esfera de 5 metros de raio. Criaturas com Visão no Escuro não podem ver através desta escuridão, e luzes não a iluminam. Se o selo for colocado em um objeto, a escuridão se move com ele. O efeito é dissipado se sobreposto por luz de um jutsu de Rank-B ou superior.

#### ESTILHAÇAR

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Suas mãos vibram e liberam uma onda massiva de chakra. Criaturas em uma esfera de 5 metros devem passar em uma resistência de Constituição. Em uma falha, sofrem 4d6 de dano de força e são empurradas 5 metros. Criaturas de material inorgânico têm desvantagem e sofrem dano dobrado. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 1d6.

#### NÉVOA VENENOSA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros — Nuvem de 9 metros | **Duração:** Até 1 minuto (10 turnos)
**Componentes:** HS, NT | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você exala uma nuvem roxa espessa que obscurece a visão e preenche uma esfera de 9 metros de raio. Uma criatura que entrar na área ou começar o turno nela deve fazer uma resistência de Constituição. Sofre 3d10 de dano de veneno e fica Envenenada se falhar (metade do dano se passar). Afeta criaturas mesmo que prendam a respiração.

#### NUVEM FÉTIDA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 27 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM, W | **Palavras-chave:** Ninjutsu, Médico

Descrição: Cria uma esfera de 6 metros de raio de gás amarelado. Criaturas que começarem o turno dentro devem passar em uma resistência de Constituição contra Veneno ou perderão a ação do turno seguinte. Vento moderado dispersa a nuvem em 4 rodadas; vento forte em 1 rodada.

#### RAIO DE ENFERMIDADE

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você dispara um raio de energia esverdeada. Faça um ataque de ninjutsu à distância. No acerto, o alvo sofre 3d8 de dano de veneno e deve fazer uma resistência de Constituição; se falhar, fica Envenenado até o fim do seu próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 1d8.

#### RASENGAN

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração até 1 minuto (10 turnos)
**Componentes:** CM | **Palavras-chave:** Ninjutsu, Disputa

Descrição: Você concentra chakra na palma da mão gerando uma esfera espiral poderosa. No início do seu próximo turno, você pode usar sua ação de ataque para realizar um Ataque de Ninjutsu Corpo a Corpo. No acerto, o alvo sofre 5d6 de dano e deve fazer uma resistência de Força ou será empurrado 6 metros. Em Ranks Superiores: Se conjurado em Rank-B ou superior, o tempo de execução cai para Ação Bônus. Para cada rank acima de Rank-C, o custo aumenta em 3 e você pode mudar o tipo de dano para qualquer afinidade elemental que conheça, aumentando o dano em 3d6 e o empurrão em 3 metros.

#### RESTAURADOR

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Suas mãos brilham em azul enquanto você filtra impurezas de uma criatura. Cura uma das seguintes condições causadas por jutsus: Fúria, Sangramento, Cegueira, Queimadura, Atordoado, Surdez, Paralisia, Envenenamento, Choque ou Enfraquecido. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o número de condições removidas em +1.

#### SENTIDOS DE BESTA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu

Descrição: Você toca uma besta amigável. Pela duração de até 1 hora, você pode usar sua ação para ganhar temporariamente os sentidos especiais ou características sensoriais da besta, após esse tempo o jutsu termina. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e a duração em 1 hora.

#### TÉCNICA DE CLONES DAS SOMBRAS

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Cria clones sólidos que compartilham um elo mental com o usuário. Você pode criar até 4 clones (6 de chakra cada). Clones agem no seu turno via ação bônus de comando (podem fazer 1 Ação e 1 Movimento). Clones têm 1 ponto de vida e pontos de chakra temporários iguais ao seu maior dado de chakra. A CA deles é igual à seu atributo de Inteligência. Eles podem usar seus jutsus (exceto outros Clones ou Fuinjutsu), mas causam metade do dano.

#### TÉCNICA DA SHURIKEN DE SOMBRA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, W | **Palavras-chave:** Ninjutsu, Bukijutsu

Descrição: Ao arremessar uma arma, você a multiplica quatro vezes em pleno ar. Criaturas devem passar em uma resistência de Destreza ou sofrerão 4dX + seu modificador de Destreza, onde X é o dado de dano da arma original. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 2dX.

#### TOQUE VAMPÍRICO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Suas mãos brilham com uma aura sombria. Faça um ataque de ninjutsu corpo a corpo. No acerto, causa 4d10 de dano necrótico e você recupera pontos de vida iguais à metade do dano causado. Pode repetir o ataque em cada turno como uma ação. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 1d10.

#### TRANSFERÊNCIA DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** X Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você toca uma criatura e compartilha seu chakra. Transfira até 6 pontos de chakra para uma criatura amigável; você perde essa quantidade e o alvo a recebe. Se a criatura estiver sob efeito de Genjutsu, ela ganha vantagem em seu próximo teste de resistência.

### RANK-B

#### ARMADILHA DO SELO DE DESLOCAMENTO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Minuto | **Alcance:** 3 metros | **Duração:** Instantânea
**Componentes:** HS, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você desenha um círculo de até 3 metros de diâmetro no chão inscrito com símbolos shinobi que ligam sua localização a outro local onde você já esteve ou conhece as coordenadas exatas. Apenas você ou um gatilho definido por você pode ativar este círculo de selamento. Uma vez ativado, todas as criaturas no círculo são imediatamente teletransportadas para o local exato dentro de um raio de 3 metros de suas coordenadas.

#### DÁDIVA DA FERA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Você ganha qualidades de uma única criatura bestial através de projeções de chakra que aprimoram seus traços físicos. Selecione um dos seguintes: Resistência do Urso: +4 de bônus no valor de Constituição e vantagem em testes de resistência de Constituição. Você também ganha +4 Pontos de Vida temporários que desaparecem ao fim do jutsu. Força do Touro: +4 de bônus no valor de Força e vantagem em testes de resistência de Força. Você cria chifres de chakra e pode usar uma ação para chifrar um inimigo (Ataque corpo a corpo, 2d12 de dano perfurante, causa sangramento e derruba o alvo). Agilidade do Gato: +4 de bônus no valor de Destreza e vantagem em testes de resistência de Destreza. Você ganha garras e pode usar Destreza para ataques e dano. O ataque de garra causa 2d8 de dano cortante e causa sangramento (pode atacar duas vezes). Esplendor da Águia: +4 de bônus no valor de Sabedoria e vantagem em testes de resistência de Sabedoria. Dobre o alcance de todos os ataques à distância. Astúcia da Raposa: +4 de bônus no valor de Inteligência e vantagem em testes de resistência de Inteligência. Você pode lançar 3 ninjutsus ao mesmo tempo, se concentrar em até 3 Jutsus ao mesmo tempo, e ganha vantagem em testes de concentração.

#### DESARRANJO DAS VIAS CORPORAIS

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Até 1 minuto (10 turnos)
**Componentes:** HS, CM, M | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você reveste as pontas dos dedos com chakra e tenta atingir um oponente na nuca, enviando uma descarga de chakra pelo sistema nervoso central. Isso mistura os sinais que vão do cérebro para o resto do corpo. Faça um teste de ataque de Ninjutsu. Em um acerto, a criatura alvo deve fazer um teste de resistência de Constituição. Se falhar, a velocidade do alvo é reduzida pela metade, ele sofre uma penalidade de -2 na CA, falha automaticamente em testes de Destreza e não pode usar reações. Em seu turno, ele pode usar uma ação ou uma ação bônus, mas não ambas. Independentemente de habilidades ou descrições de jutsu, ele não pode fazer mais de um ataque por turno. Se a criatura quiser usar uma ação para fazer um teste e encerrar o efeito, ela deve rolar um teste de Inteligência.

#### ESFERA VITRIÓLICA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 45 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Uma esfera de ácido explode em um raio de 12 metros. Criaturas na área devem fazer um teste de Destreza: sofrem 10d4 de dano de veneno e mais 5d4 no final do próximo turno. Em um sucesso, sofrem metade do dano inicial e nada no turno seguinte. Em Ranks Superiores: Aumente o custo em 3 e o dano inicial em 2d4 por rank.

#### INVOCAÇÃO: RASHOMON

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Execução:** 1 Reação | **Alcance:** 9 metros | **Duração:** Até 1 Minuto
**Componentes:** HS, CS, M | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você invoca um portão de ferro e chakra com 18m de altura e 9m de largura. O portão tem CA igual à seu atributo de Inteligência e 45 Pontos de Vida. Se os PV do portão chegarem a 0, ele não poderá ser invocado por 1 semana enquanto se regenera. Em Ranks Superiores: Aumente o custo em 3, a CA em +1 e os PV em 1d10 por rank.

#### NÃO-DETECÇÃO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 8 horas
**Componentes:** CM | **Palavras-chave:** Ninjutsu

Descrição: Pela duração, você oculta seu chakra, baixando sua presença e escondendo-se de jutsus sensoriais. O alvo pode ser você, uma criatura voluntária ou um objeto de até 3 metros. O alvo não pode ser sentido ou visto por jutsus com a palavra-chave Sensorial de Rank-B ou inferior.

#### OLHO DA MENTE DE KAGURA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 1,6 km | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Sensorial

Descrição: Você força a abertura do "terceiro olho" de sua mente, aumentando sua percepção em quase 10 vezes. Você pode ver chakra a até 1,6 km e identificar criaturas por seus padrões de chakra se já as tiver visto antes. Você pode sentir flutuações no chakra quando alguém mente ou realiza um jutsu. Ganha Vantagem em testes de Intuição para detectar mentiras e Vantagem em Percepção para rastrear alguém apenas pelo chakra. Em Ranks Superiores: Para cada rank acima do Rank-B, aumente o custo em 3 e multiplique o alcance por 10.

#### POLIMORFIA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu

Descrição: Transforma você em uma nova forma. A transformação dura até o fim do tempo ou até você cair a 0 PV ou Chakra. A nova forma pode ser qualquer besta de nível igual ou inferior ao seu. Suas estatísticas mentais e físicas são substituídas pelas da besta. Você assume os PV da nova forma. Ao reverter, volta aos PV que tinha antes. Dano excedente na forma de besta passa para sua forma normal. Você não pode falar, usar jutsus ou realizar ações que exijam mãos se a forma não permitir. Seu equipamento funde-se à nova forma e perde o efeito.

#### PROTEÇÃO CONTRA A MORTE

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você desenha seu selo de chakra em um pergaminho ou selo e o coloca em uma criatura, concedendo-lhe uma medida de proteção contra a morte. A primeira vez que o alvo cairia a 0 pontos de vida como resultado de dano, ele para em 1 ponto de vida e o jutsu termina. Se o jutsu ainda estiver ativo quando o alvo for submetido a um efeito que o mataria instantaneamente sem causar dano, esse efeito é negado e o jutsu termina.

#### REVIVER

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Envia chakra curativo para uma criatura morta há no máximo 1 minuto (não pode ser morte por velhice). O alvo retorna à vida com metade de seus pontos de vida. Órgãos internos são regenerados, mas membros perdidos não retornam. O jutsu neutraliza venenos e doenças comuns presentes no momento da morte, mas não afeta selos, maldições ou venenos especiais. O esforço para realização deste jutsu causa em você 2d4 de dano.

#### SELO DE BANIMENTO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você cria um selo ou pergaminho de selamento e aplica seu selo de chakra nele, lançando-o em direção a uma criatura que possa ver dentro do alcance. O selo para antes de tocá-la e abre um portal que tenta enviar a criatura para uma dimensão de bolso. O alvo deve ser bem-sucedido em um teste de resistência de Carisma ou será banido para esta dimensão de bolso. Em Ranks Superiores: Para cada rank que você conjurar este jutsu acima do Rank-B, aumente o custo em 3 e você pode alvejar uma criatura adicional.

#### SELO DE PROTEÇÃO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você inscreve um selo invisível em uma superfície ou objeto. O selo pode ser encontrado com um teste de Investigação ou Ninjutsu. Você define o gatilho (tocar, passar por cima, senha, etc). Ao criar o selo, você armazena um Ninjutsu ou Genjutsu de Rank-B ou inferior nele. Quando o selo é ativado, o jutsu armazenado é conjurado imediatamente no alvo. Em Ranks Superiores: Aumente o custo em 3 e o rank do jutsu que pode ser selado em 1 por nível (B \> A \> S).

#### TÉCNICA DA FORÇA DE 100 / BYAKUGOU

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Execução:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração
**Componentes:** CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Controle refinado de chakra que concede força sobre-humana. Sua Força torna-se 20 pela duração. Sua altura e distância de salto dobram. Ganha Vantagem em testes e resistências de Força e Constituição. Seus ataques desarmados causam 3d10 de dano por esmagamento adicional. Ao encerrar o jutsu, seu corpo sofre consequências: a velocidade cai pela metade e ganha desvantagem em testes de Força e Constituição até um descanso curto. Em Ranks Superiores: Aumente o custo em 3 e o dano em 1d10 por rank acima do B.

#### TÉCNICA DE MULTICLONES DAS SOMBRAS

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 8 Chakra (por clone)
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Versão avançada do Clone das Sombras que cria clones sólidos. O usuário pode criar até 10 clones de uma vez, custando 8 de Chakra por clone. Clones agem como parte do seu turno; você usa uma Ação Bônus para comandá-los. Todos realizam a mesma ordem. Clones possuem 1 PV e Chakra temporário igual ao seu maior dado de Chakra. A CA deles é igual à seu atributo de Inteligência. Eles podem usar todos os seus Jutsus (exceto os que tenham "Clone" no nome), mas Jutsus de dano lançados por eles causam metade do dano. A cada 2 clones invocados, sua CA aumenta em +1 pela duração, pois vocês se movem constantemente entre si.

#### TÉCNICA DO ASSASSINATO DE MIL BRAÇOS

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Versão avançada dos "Braços de Buda". Um Buda dourado materializa-se atrás do usuário. Como Ação Bônus, faça um ataque de Ninjutsu contra uma criatura a até 3 metros: causa 8d8 de dano de Força. Como Reação, ao ser atingido, role 2d12 + seu Modificador de Inteligência e subtraia o resultado do dano que você sofreria. Em Ranks Superiores: Aumente o custo em 3, o dano em 2d8 e a rolagem de reação em 1d12 por rank.

#### TRANSFERÊNCIA DE VIDA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você sacrifica sua saúde para curar as feridas de outra criatura. Você sofre 4d8 de dano necrótico (que não pode ser curado por jutsus, apenas após um descanso longo) e uma criatura que você tocar recupera PV igual ao dobro do dano que você sofreu. Em Ranks Superiores: Para cada rank acima do Rank-B, aumente o custo em 3 e o dano necrótico sofrido em 2d8.

### RANK-A

#### ANIMAR OBJETOS

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Objetos ganham vida ao seu comando. Escolha até dez objetos dentro do alcance que não estejam sendo usados ou carregados. Alvos Pequenos contam como dois objetos, alvos Médios como quatro e alvos Grandes como oito. Você não pode animar nada maior que Grande. Cada alvo se anima e se torna uma criatura sob seu controle até o fim do jutsu ou até ser reduzido a 0 Pontos de Vida. Como uma ação bônus, você pode comandar mentalmente qualquer criatura criada por este jutsu se ela estiver a até 150 metros de você. Se comandar várias, pode ordenar a todas ao mesmo tempo. Você decide a ação e o movimento da criatura em seu próximo turno, ou pode dar uma ordem geral, como "guardar esta sala". Sem ordens, a criatura apenas se defende. Uma vez dada, a ordem é seguida até ser completada. Um objeto animado tem CA, PV, Ataque, Dano, Força e Destreza determinados por seu tamanho (veja informações na tabela a seguir). Atributos padronizados independente do tamanho: Constituição 10, Inteligência 3, Sabedoria 3 e Carisma 1. Deslocamento 9m; se não tiver pernas, possui voo de 9m e pode pairar. Se estiver preso a uma superfície (ex: uma corrente na parede), seu deslocamento é 0. Possui visão no escuro de até 9m e é cego para além disso. Ao chegar a 0 PV, reverte à sua forma original, com dano residual aplicado a ela. Se ordenado a atacar, o objeto faz um ataque corpo a corpo único contra uma criatura a até 2m. É um ataque de Esmagamento, funciona da seguinte forma 1d20 + um bônus de ataque terminado pelo tamanho contra a CA do alvo. O Mestre pode decidir que um objeto específico causa dano cortante ou perfurante com base em sua forma (ex: uma espada animada causa dano cortante). |  |  |  |  |  |  | | :-: | :-: | :-: | :-: | :-: | :-: | | \\Tamanho\\ | \\Pontos de Vida (PV)\\ | \\Classe de Armadura (CA)\\ | \\Ataque\\ | \\Dano\\ | \\Atributos (Força/Destreza)\\ | | \\Minúsculo\\ | 20 | 18 | 1d20 + 11 vs CA | 1d4+4 | For: 4, Des: 18 | | \\Pequeno\\ | 25 | 16 | 1d20 + 12 vs CA | 1d8+2 | For: 6, Des: 14 | | \\Médio\\ | 40 | 13 | 1d20 + 13 vs CA | 2d6+1 | For: 10, Des: 12 | | \\Grande\\ | 50 | 10 | 1d20 + 14 vs CA | 2d10+2 | For: 14, Des: 10 |

#### AURA DE PODER

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Um chakra intenso emana de você em um raio de 9 metros com uma luz suave na cor de seu chakra. Criaturas de sua escolha no raio emitem luz e possuem vantagem em todos os testes de resistência, enquanto inimigos têm desvantagem em jogadas de ataque contra elas. Além disso, quando uma criatura atinge um aliado protegido com um ataque corpo a corpo, o chakra brilha com pressão extrema; o atacante deve passar em um teste de resistência de Constituição ou ficará Incapacitado até o fim do seu próximo turno.

#### DEUS VOADOR DO TROVÃO (HIRAISHIN)

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Execução:** 1 Ação de Movimento | **Alcance:** 2 km | **Duração:** Instantânea
**Componentes:** HS, CM, CS, NT, W | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você imprime um selo pessoal em qualquer arma, superfície ou objeto (processo de 1 hora por selo, limite de 5 selos ativos). Você pode usar uma Ação de Movimento para se teletransportar a até 2 km de distância para um de seus selos, aparecendo a 1 metro dele. Cada selo pode ser usado 5 vezes antes de desaparecer por sobrecarga de chakra. Outros que possuam este jutsu podem usar seu selo para se teletransportar, desde que conheçam a localização do destino. Em Ranks Superiores: Para cada rank acima do A, aumente o custo em 3, adicione mais 5 selos ao limite (os selos agora podem ser objetos imbuídos com seu chakra) e multiplique a distância de teletransporte por 10.

#### ESPADA DE TOBIRAMA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você conjura uma distorção espacial em formato de espada que flutua no alcance. Quando ela aparece, faça um ataque de Ninjutsu contra um alvo a até 2 metros da espada; causa 4d10 de dano de Força. No turno subsequente, você pode usar uma ação bônus para mover a espada até 6 metros e repetir o ataque. Em Ranks Superiores: Para cada rank acima do A, aumente o custo em 3 e o número de ataques que a espada pode fazer por rodada em +1.

#### GAIOLA DE FORÇA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 30 metros | **Duração:** 1 hora
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu

Descrição: Você usa um pergaminho para conjurar uma prisão cúbica imobilizada de chakra azul. Pode ser uma “Gaiola” (com barras espaçadas por 20 cm de distância entre elas, o tamanho da Gaiola é de um cubo de até 6 metros por lado) ou uma “Caixa Sólida” (um cubo de até 3 metros por lado). A caixa sólida bloqueia qualquer matéria ou jutsu de entrar ou sair. Criaturas presas não podem sair por meios físicos. Para sair via teletransporte, a criatura deve passar em um teste de Inteligência; se falhar, o teletransporte falha e o uso do recurso é desperdiçado.

#### INFERNO DE AGULHAS: JUBA DE LEÃO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 15 Chakra
**Tempo de Execução:** 1 Reação (quando for alvo de ataque corpo a corpo) | **Alcance:** Pessoal | **Duração:** 1 Rodada
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Versão avançada do “Agulhas de Jizo”. Você cria um escudo de cabelo muito mais espesso e denso que cobre seu corpo e dispara agulhas em 360 graus. Você ganha +5 de CA pela duração. Todas as criaturas em um raio de 9 metros devem fazer um teste de Destreza; sofrem 5d8 de dano perfurante se falharem, ou metade se passarem. Em Ranks Superiores: Para cada rank acima do A, aumente o custo em 3, o bônus de CA em +1 e o dano em 1d8.

#### INVOCAÇÃO DE SELO REVERSO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você marca até 6 criaturas voluntárias com seu selo pessoal. Com este selo, você pode teletransportar as criaturas marcadas até você se estiverem a até 2 km. Inversamente, você pode se teletransportar até elas se estiverem a até 90 metros, aparecendo em um espaço próximo. Criaturas marcadas podem resistir à invocação tendo sucesso em um teste de Constituição. Em Ranks Superiores: Para cada rank acima do A, aumente o custo em 3 e multiplique o alcance por 10.

#### ONDA DE CURA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Esfera de 18 metros de raio | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você une as mãos e libera uma onda de energia curativa centrada em você. Você cura até 8 criaturas, distribuindo um total de 80 pontos de vida entre elas. Além disso, os alvos ganham vantagem em testes de resistência de Constituição e têm todas as dores físicas e mentais aliviadas. Até o fim do seu próximo turno, as criaturas curadas ganham resistência a todos os danos.

#### REGENERAR

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Execução:** Toque | **Alcance:** Toque | **Duração:** 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Você estimula a habilidade de cura natural de uma criatura. O alvo recupera 4d8 + 15 pontos de vida instantaneamente. Também, pela duração, o alvo recupera 1 PV no início de cada um de seus turnos (10 PV por minuto). Membros decepados são restaurados após 2 minutos. Se você segurar o membro decepado contra o corpo, o jutsu o une instantaneamente.

#### SELO DA DISCÓRDIA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Até ser dissipado ou ativado
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você inscreve um selo invisível em uma superfície ou objeto. Quando ativado, o selo brilha em uma esfera de 20 metros de raio por 10 minutos. Escolha um efeito ao criar o selo: • Morte: Teste de Constituição; 10d10 de dano necrótico (metade se passar). • Desesperança: Teste de Carisma; o alvo não pode atacar ou usar habilidades prejudiciais por 1 minuto (10 turnos). • Dor: Teste de Constituição; fica Incapacitado por 1 minuto (10 turnos). • Atordoamento: Teste de Sabedoria; fica Atordoado por 1 minuto (10 turnos).

#### SENSORIAMENTO DE EMOÇÕES NEGATIVAS

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 16 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 2 km | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Sensorial, Médico

Descrição: Ninjutsu sensorial aperfeiçoado baseado no “Olho da Mente de Kagura”. Este jutsu detecta as emoções de uma criatura para rastreá-la. Você pode identificar o estado emocional ou intenções de qualquer criatura no alcance. Se uma criatura tentar esconder as emoções, deve fazer um teste de Sabedoria. Você sente desconforto, prazer, raiva e até intenção assassina. Em Ranks Superiores: Para cada rank acima do A, aumente o custo em 3 e multiplique o alcance por 10.

#### TÉCNICA DA COROA DE ESTRELAS

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Você cria 8 globos de luz que orbitam seus pulsos ou tornozelos. Você pode usar uma ação bônus para disparar um dos globos em uma criatura ou objeto a até 20 metros. Faça um ataque de Ninjutsu à distância; se acertar, o alvo sofre 3d12 de dano de Força. O globo desaparece após o uso. O jutsu termina se você gastar o último globo ou cair inconsciente. Enquanto tiver 4 ou mais globos, eles emitem luz brilhante em um raio de 9 metros. Em Ranks Superiores: Para cada rank acima do A, aumente o custo em 3 e o número de globos criados em 2.

### RANK-S

#### CAMPO DE DISTORÇÃO DE CHAKRA

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal (Esfera de 3 metros de raio) | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu

Descrição: Uma esfera invisível de 3 metros de raio de distorção de chakra. Esta área é divorciada do chakra que compõe o mundo. Dentro da esfera, Ninjutsu ou Genjutsu não podem ser conjurados, e itens de chakra tornam-se mundanos. Até o fim do jutsu, a esfera se move com você. Efeitos baseados em chakra (exceto os criados por Artefatos de Rank-S ou Sábios) são suprimidos e não podem penetrar na esfera. O chakra gasto para conjurar um jutsu suprimido é perdido. Efeitos direcionados a criaturas ou objetos na esfera não têm efeito. Áreas de efeito de outros jutsus não podem se estender para dentro da esfera. As propriedades de armas de chakra são suprimidas se usadas contra alvos na esfera ou por um atacante dentro dela.

#### DEUS VOADOR DO TROVÃO: TROVÃO GUIA

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 22 Chakra
**Tempo de Execução:** 1 Reação (em resposta ao movimento ou ação de ataque de outra criatura) | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Como parte dos requisitos deste jutsu você precisa ter o Deus Voador do Trovão (base). Como uma variação do jutsu original, você consegue dobrar o espaço-tempo criando uma formação de selamento no ar a até 9 metros de você. Criaturas, objetos ou jutsus que cruzarem este espaço são imediatamente teletransportados para um local marcado anteriormente por qualquer um de seus Selos de Chakra em um raio de 16 km. Isso destrói o Selo de Chakra após a ativação.

#### FORMAÇÃO DOS QUATRO YANG

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Até 18 metros | **Duração:** Concentração
**Componentes:** HS, CM, CS, 3 outros usuários da Formação dos Quatro Yang | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você e 3 outros usuários tomam posição em 4 pontos cercando a área a ser selada, a no máximo 18 metros de distância uns dos outros. Ao ativarem juntos, vocês dobram o tempo e o espaço, selando o espaço fechado em uma dimensão de bolso. Criaturas presas são incapazes de escapar, a menos que realizem o mesmo jutsu ou possam se teletransportar usando Trovão Guia, Armadilha de Deslocamento, Deus Voador do Trovão ou esta mesma técnica.

#### RENASCIMENTO DA CRIAÇÃO: FORÇA DE 1000

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Médico

Descrição: Como pré-requisito, você deve conhecer a Técnica da Força de 100. Você aperfeiçoou o controle de chakra para aumentar sua força física em mais de 1000 vezes. Pela duração, seus valores de Força e Constituição dobram. Sua distância de salto é multiplicada por 4, sua velocidade de movimento é triplicada e você ganha vantagem em testes de resistência de Força, Destreza e Constituição. Você regenera pontos de vida iguais a 2d12 + seu modificador de Constituição no início de cada um de seus turnos. Ataques desarmados causam 3d10 de dano de esmagamento adicional. Quando o jutsu termina, seu corpo envelhece 1d12 anos e você perde o acesso a este jutsu por 1d4 anos enquanto seu corpo se recupera.

#### RUPTURA DA REALIDADE

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 22 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você despedaça as barreiras entre as dimensões. O alvo dentro do alcance deve realizar um teste de resistência de Constituição. Se falhar, a ruptura o envolve por 1d8 rodadas (role este dado imediatamente após a falha no teste). Durante este período, o alvo não pode usar reações. Além disso, no início de cada um de seus turnos, o alvo deve rolar 1d10 se ainda estiver dentro do alcance original do jutsu (18 metros); o resultado determina o efeito bizarro que se manifesta, conforme a Tabela de Ruptura da Realidade. Se este jutsu for utilizado dentro de uma dimensão de bolso criada por outra técnica, essa dimensão entrará em colapso, sendo destruída para sempre e tornando-se inacessível. |  |  | | :-: | :-: | | D10 | Efeito | | \\1-2\\ | Mundo em Colapso: O alvo sofre 12d8 de dano de força e fica atordoado até o final do turno. Se o alvo estiver em uma dimensão de bolso, ele retorna ao plano padrão de existência. | | \\3-5\\ | Fenda Dilacerante: O alvo deve realizar um teste de resistência de Destreza, sofrendo 8d12 de dano de força se falhar, ou metade desse dano se for bem-sucedido. | | \\6-8\\ | Buraco de Minhoca: O alvo é teletransportado, junto com tudo o que estiver vestindo e carregando, para um espaço desocupado a até 160 km de distância em uma direção aleatória. O alvo também sofre 12d10 de dano de força e fica caído. | | \\9-10\\ | Frio do Vazio Sombrio: O alvo sofre 12d10 de dano necrótico e fica permanentemente cego. Este efeito pode ser removido com um jutsu Restaurador de Rank-A ou superior. |

#### SELO CEIFEIRO DA MORTE  (SHIKI FUJIN)

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você invoca o Ceifeiro de Almas. Ao conjurar este jutsu, você alveja uma criatura dentro do alcance. O Ceifeiro alcança o alvo através de você, usando sua alma como uma luva para chegar na criatura agarrada e puxar sua alma, matando-a imediatamente. O usuário deste jutsu também morre após a conclusão da técnica, e ambas as almas são seladas no estômago do Ceifeiro, sem nenhuma possibilidade de ressuscitação enquanto as almas estiverem seladas.

#### SEMIPLANO

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 35 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** 1 hora
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você inscreve um selo de transporte em uma superfície ou objeto. O selo brilha enquanto um buraco sombrio se forma em uma superfície sólida plana ligada ao selo. O buraco permite que criaturas médias passem sem impedimentos. Ele leva a um Semiplano que parece uma sala vazia de 9 metros em cada dimensão, feita de madeira ou pedra. Quando o jutsu termina, o buraco desaparece e qualquer criatura ou objeto no Semiplano permanece preso lá. A cada conjuração, você pode criar um novo Semiplano ou conectar a um criado anteriormente. Se você conhecer a natureza e o conteúdo de um Semiplano criado por outra criatura, pode se conectar ao dele.

#### VIAGEM PLANAR

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 24 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Fuinjutsu

Descrição: Você e até oito criaturas voluntárias que estejam se tocando são transportados para um local onde você colocou um Selo de Chakra previamente. Este local pode ser no plano padrão de existência ou em uma dimensão de bolso que ainda não colapsou.

## Ninjutsu Elemental: ESTILO TERRA (Doton)

### RANK-D

#### ESTILO TERRA: CAIXÃO DE ROCHA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você manipula e molda a terra sob seus inimigos, envolvendo-os em um caixão de pedra. A criatura alvo deve realizar um teste de resistência de Destreza. Em caso de falha, ela fica Capturada dentro do caixão e é considerada Restrito. Em caso de sucesso, a criatura evita o fechamento do caixão. Em cada um de seus turnos seguintes, a criatura pode realizar um teste de resistência de Força para tentar escapar. O caixão pode ser atacado; ele possui CA 10 e 10 pontos de vida. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e os pontos de vida do caixão em 10.

#### ESTILO TERRA: EMARANHAMENTO TERRESTRE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Arcos de pedra surgem do solo em uma área quadrada de 6 metros a partir de um ponto dentro do alcance. O terreno se torna terreno difícil. Criaturas na área ao conjurar o jutsu devem ser bem-sucedidas em um teste de resistência de Força ou ficarão Restritas até o fim do jutsu. Uma criatura restrita pode usar sua ação para realizar um teste de Força para se libertar.

#### ESTILO TERRA: ESPINHO AGONIZANTE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você gera estilhaços de terra e os arremessa contra uma criatura ou objeto dentro do alcance. Faça um ataque de Ninjutsu à distância contra o alvo. Em caso de acerto, o alvo sofre 4d6 de dano perfurante. Em Ranks Superiores: Para cada rank acima de Rank-D em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d6.

#### ESTILO TERRA: GARRA DE TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você escolhe um espaço desocupado de 1 metro no solo visível dentro do alcance. Uma mão média feita de terra, solo e poeira surge e tenta agarrar uma criatura a até 1 metro dela. O alvo deve realizar um teste de resistência de Força. Em caso de falha, sofre 2d6 de dano de terra e fica restrito. Como ação bônus, você pode ordenar que a mão esmague o alvo restrito, causando 2d6 de dano de terra em falha no teste de resistência de Força, ou metade em sucesso. O alvo pode tentar escapar com um teste de Força. A mão pode ser movida ou redirecionada como ação. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e o dano em 1d6.

#### ESTILO TERRA: GEOLOCALIZAÇÃO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você estende seu chakra pela terra ao seu redor até 9 metros. Durante a duração, você adquire sentido sísmico. Criaturas que se movam sobre a mesma superfície são percebidas por esse sentido. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra. A duração passa a ser 10 minutos no Rank-C, 1 hora no Rank-B e 24 horas no Rank-A.

#### ESTILO TERRA: MOVIMENTO DA TOUPEIRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você afunda no solo após transformá-lo em uma substância semelhante à areia. Você ganha deslocamento de escavação de 9 metros, podendo atravessar terra e areia. Se ficar sem chakra enquanto estiver subterrâneo, você emerge diretamente para a superfície. Você deixa um túnel largo o suficiente para uma pessoa passar. Você percebe quantas criaturas estão na superfície diretamente acima de você em um cubo de 3 metros.

#### ESTILO TERRA: ONDA DE LAMA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você revolve a terra à sua frente e a lança em uma linha de 9 metros por 2 metros. Criaturas na linha devem realizar um teste de resistência de Destreza, sofrendo 3d6 de dano de terra e ficando caídas em caso de falha. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e o dano em 1d6.

#### ESTILO TERRA: PELE DE ROCHA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Reação, ao ser atingido por um ataque | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Este jutsu endurece sua pele em resposta ao dano recebido. Reduza o dano do tipo que ativou o jutsu em 5 (exceto dano psíquico ou elétrico) até o início do seu próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e a redução de dano em 2.

#### ESTILO TERRA: PUNHO DE PEDRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Disputa

Descrição: Você reveste um de seus braços com pedra, permitindo golpes extremamente poderosos e protegendo-o de contato direto. Enquanto o jutsu estiver ativo, ataques desarmados com esse braço causam 2d6 de dano contundente adicional. Você não pode realizar selos de mão com o braço revestido, e seus golpes não contam como contato direto com o alvo. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e o dano adicional em 1d6.

#### ESTILO TERRA: RANCOR DE DETRITOS TERRESTRES

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal (3 metros) | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você gera fragmentos de terra que flutuam ao seu redor, criando um campo de detritos rochosos defensivos. Durante a duração do jutsu, ataques à distância contra você são realizados com desvantagem, pois você fica fortemente obscurecido pelos fragmentos.

#### ESTILO TERRA: RIO DE FLUXO TERRESTRE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros (linha de 5 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você escolhe um ponto inicial e transforma o solo em um rio de lama que arrasta criaturas pelo caminho. Criaturas na área devem realizar um teste de resistência de Destreza. Em caso de falha, são carregadas até o final do fluxo e ficam caídas. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e o alcance em 2 metros.

#### ESTILO TERRA: SHURIKEN DE ROCHA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Shurikenjutsu

Descrição: Você molda pequenas pedras no formato de shurikens. Elas substituem shurikens normais e não exigem equipamento físico. Você cria 3 Shurikens de Rocha. Ao serem arremessadas, utilizam bônus de ataque à distância dobrando o valor da proficiência e causam 1d6 + modificador de Destreza de dano cortante. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e crie 2 shurikens adicionais.

#### ESTILO TERRA: TÉCNICA DA ROCHA ASCENDENTE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Disputa

Descrição: Você arranca dois grandes blocos de pedra do solo usando apenas chakra e os arremessa contra um único alvo. Faça um ataque de Ninjutsu à distância. Em caso de acerto, o alvo sofre 1d12 de dano de terra e 1d12 de dano de concussão. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e cada tipo de dano em 1d12.

#### ESTILO TERRA: TÉCNICA DO CAÇADOR DE CABEÇAS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Enquanto se move sob a terra, você tenta puxar uma criatura para baixo, deixando-a submersa no solo com apenas a cabeça exposta. O alvo deve realizar um teste de resistência de Destreza para evitar ser agarrado e restrito. Se você estiver escondido e o alvo não estiver ciente de sua presença, o teste é feito com desvantagem. A criatura restrita pode tentar um teste de resistência de Força como ação por turno para encerrar o efeito.

#### ESTILO TERRA: TREMOR TERRESTRE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal (raio de 3 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você provoca um tremor no solo em um raio de 3 metros. Criaturas na área devem realizar um teste de resistência de Destreza. Em caso de falha, sofrem 1d8 de dano de terra e ficam caídas. Se o terreno for terra ou pedra solta, torna-se terreno difícil até ser limpo. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e o dano em 2d6.

### RANK-C

#### ESTILO TERRA: ARMADILHA DO LOBO DE LAMA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 10 minutos | **Alcance:** 1,6 km | **Duração:** 1 minuto (10 turnos)
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Liberação de Terra, Selo de Chakra, Armadilha

Descrição: Você cria um grande selo ocupando um cubo de 5 metros. O selo é ativado quando uma criatura entra na área. Ao ser acionado, 4 lobos feitos de lama emergem e agem de acordo com comandos pré determinados por você. O selo permanece ativo até ser desativado ou até você se afastar mais de 1,6 km. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e invoque 1 lobo adicional. |  | | :-: | | \#\#\#\# \\LOBO DE LAMA\\\Construto Médio, sem alinhamento\  - \\Classe de Armadura:\\ 11 + seu modificador de Inteligência  &#10;      &#10;  - \\Pontos de Vida:\\ 11 (5d4+1)  &#10;      &#10;  - \\Velocidade:\\ 12 metros\|  \|  \|  \|  \|  \|  \|&#10;\| :-: \| :-: \| :-: \| :-: \| :-: \| :-: \|&#10;\| FOR \| \\\\\\DES\\\\\\ \| \\\\\\CON\\\\\\ \| \\\\\\INT\\\\\\ \| \\\\\\SAB\\\\\\ \| \\\\\\CAR\\\\\\ \|&#10;\| 12 (+1) \| 12 (+1) \| 12 (+1) \| 1 (-5) \| 10 (+0) \| 1 (-5) \|&#10;   - \\Imunidades a Dano:\\ Ácido, Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não aprimoradas por Chakra.&#10;  - \\Imunidades a Condição:\\ Enfeitiçado, Exaustão, Amedrontado, Paralisado, Petrificado, Envenenado.&#10;  - \\Sentidos:\\ Visão no Escuro 18 metros, Percepção passiva 10.  - \\Forma Imutável:\\ O Lobo de Lama é imune a qualquer Jutsu ou efeito que altere sua forma.&#10;  - \\Ataques Elementais:\\ Os ataques do Lobo de Lama são aprimorados por chakra.\#\#\#\# \\AÇÕES\\   - \\Mordida:\\ Ataque natural: (1d20 + Modificador de Força vs CA do alvo), alcance de 2m, atinge um alvo. Acerto: 1d4+1 de dano perfurante.&#10;  - \\Agarrar:\\ Se a criatura alvo for atingida pelo seu ataque de mordida, ela deve ser bem-sucedida em um teste de resistência de Força. Em uma falha, o alvo é derrubado.  |

#### ESTILO TERRA: ARMADURA DE TERRA OU AREIA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Liberação de Magnetismo

Descrição: Uma densa e protetora camada de terra ou areia (caso tenha Liberação de Magnetismo) envolve seu corpo, assumindo a mesma textura e cor de suas roupas e pele. Durante a duração, você recebe 10 pontos de vida temporários (15 se for de areia). Esta armadura não protege contra dano psíquico, necrótico ou elétrico. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e os pontos de vida temporários em 5.

#### ESTILO TERRA: ATAÚDE DE TERRA OU CAIXÃO DE AREIA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 4,5 metros | **Duração:** Concentração, até 3 minutos
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Liberação de Magnetismo

Descrição: Você convoca rochas e terra compactada para envolver uma criatura visível no alcance. O alvo deve realizar um teste de resistência de Destreza. Em caso de falha, fica paralisado em uma espécie de esfinge de terra. Como ação em turnos subsequentes, você pode comprimir o alvo capturado, causando 3d12 de dano de terra. A criatura pode tentar escapar com um teste de Força. Caso tenha Liberação de Magnetismo, você pode utilizar uma versão mais poderosa desse jutsu, o Caixão de Areia. Nesta versão você convoca areia, poeira e cascalho para envolver e capturar uma criatura visível no alcance. O alvo deve realizar um teste de resistência de Destreza. Em caso de falha, fica paralisado e suspenso a 2 metros do chão. Se o teste for bem-sucedido por uma margem de 1 ou menos, apenas um dos membros do alvo é capturado. Como ação em turnos subsequentes, você pode comprimir o alvo capturado, causando 5d12 de dano de terra. Se apenas um membro estiver capturado, o dano é reduzido para 5d8. A criatura pode tentar escapar com um teste de Destreza; se apenas um membro estiver preso, o teste é feito com vantagem. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em 2d12.

#### ESTILO TERRA: CLONE DE TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Uma versão modificada da Técnica do Clone das Sombras que permite ao usuário criar um poderoso construto feito de terra, rocha e lama à sua própria imagem. O clone pesa 6 vezes mais que o usuário e não pode nadar (nem se afogar). Você só pode criar um único clone, que não possui pensamento consciente, mas pode ser comandado mentalmente pelo usuário enquanto ambos estiverem na mesma superfície e a até 36 metros de distância um do outro. Caso essa distância seja ultrapassada, o clone se desfaz, retornando aos materiais que o compõem. O Clone de Terra possui CA igual à seu atributo de Inteligência, 15 pontos de vida e não possui chakra próprio. Ele é imune a Genjutsu, dano psíquico e veneno; possui resistência a dano contundente, de terra e de gelo; e vulnerabilidade a dano elétrico. Sempre que o clone precisar realizar um teste de resistência, ele utiliza seu modificador de Inteligência somado à seu bônus de proficiência, independentemente do tipo de teste. O clone possui réplicas das armas que você estiver carregando no momento da criação, feitas do mesmo material que o corpo do clone. Quando realiza um ataque com essas armas ou ataques desarmados, ele causa 1d8 de dano de terra, independentemente do tipo de ataque. O clone pode realizar até 2 ataques em sua ação. Ele não possui ação bônus nem reação. Você pode conjurar jutsus com a palavra-chave Liberação de Terra através do clone, como se ele fosse o conjurador. O clone não pode usar habilidades de Classe ou Clã. Criaturas com visão de chakra distinguem imediatamente o clone do original. Enquanto este jutsu estiver ativo, você não pode controlar nenhum outro tipo de clone. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e os pontos de vida do clone em 5.

#### ESTILO TERRA: LANÇAS DO FLUXO TERRESTRE

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 18 metros (cubo de 3 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Escolha um ponto visível no solo dentro do alcance. Uma fonte de terra pontiaguda irrompe do chão em um cubo de 3 metros. Cada criatura na área deve realizar um teste de resistência de Destreza. Em caso de falha, sofre 3d12 de dano perfurante; em sucesso, sofre metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em 1d12.

#### ESTILO TERRA: NÚCLEO TERRESTRE MÓVEL

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você manipula o solo sob seus pés, podendo elevá-lo ou abaixá-lo em até 3 metros. Isso permite alcançar locais elevados ou revelar áreas enterradas abaixo de você.

#### ESTILO TERRA: PALMA REVERSA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Execução:** Ação Bônus | **Alcance:** Esfera de 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você coloca a palma da mão sobre uma superfície de terra, fazendo o solo se partir, rachar e se deslocar. A área afetada passa a ser terreno difícil e não pode ser restaurada, exceto com este mesmo jutsu revertendo o efeito. Se o solo afetado tiver menos de 3 metros de espessura, ele pode colapsar para o espaço abaixo, fazendo com que criaturas sobre ele caiam junto com o desmoronamento.

#### ESTILO TERRA: PRESA PERFURANTE GIRATÓRIA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Ninjutsu, Liberação de Terra, Disputa

Descrição: Você reveste seu antebraço com uma broca giratória de pedra. Faça um ataque de Ninjutsu. Em caso de acerto, o alvo sofre 3d6 de dano perfurante e mais 3d6 de dano de terra. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e ambos os tipos de dano em 1d6.

#### ESTILO TERRA: PROJÉTIL DO DRAGÃO DE TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Disputa

Descrição: Você expele lama do estômago após moldar chakra e a manipula, formando a cabeça de um dragão que dispara esferas comprimidas de lama para causar dano concussivo. Faça um ataque de Ninjutsu à distância. Em caso de acerto, o alvo sofre 8d4 de dano. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em 2d4.

#### ESTILO TERRA: TANQUE DE ROCHA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Reação, ao ser alvo de um ataque | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Disputa

Descrição: Você cobre seu corpo com terra e pedra, moldando-se em uma esfera rolante e se lança contra uma criatura no alcance. Faça um ataque de Ninjutsu. Em caso de acerto, o alvo sofre 5d8 de dano de terra e deve realizar um teste de resistência de Força, ficando caído em caso de falha. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em 1d8.

#### ESTILO TERRA: TEMPESTADE DE AREIA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Execução:** 1 Ação | **Alcance:** Pessoal (9 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra, Liberação de Magnetismo

Descrição: Para este jutsu é necessário ter a Liberação de Magnetismo. Você cria um vórtice espiralado de areia, poeira e terra, com 3 metros de largura e 5 metros de altura. O vórtice avança em linha reta até 9 metros. Criaturas em seu caminho devem realizar um teste de resistência de Destreza, sofrendo 4d6 de dano de terra e ficando caídas em caso de falha. Criaturas a até 2 metros do trajeto devem realizar um teste de resistência de Força ou são arremessadas 3 metros para trás. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em 1d6.

#### ESTILO TERRA: TERRA ESCUDO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Execução:** 1 Reação, ao ser alvo de um ataque | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você golpeia o solo com a palma da mão, criando uma parede de pedra de aproximadamente 2 metros de altura, 3 de largura e 30 cm de espessura à sua frente, concedendo cobertura total. A parede absorve todo o dano que você sofreria de ataques vindos diretamente da frente. Ela possui 4d8 pontos de vida e vulnerabilidade a dano elétrico. Caso o dano exceda seus pontos de vida, o excedente é aplicado a você normalmente. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 Chakra e os pontos de vida da parede em 1d8.

### RANK-B

#### ESTILO TERRA: COLAPSO DO FORMIGUEIRO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros (Esfera de 5 metros) | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você seleciona um espaço que possa ver dentro do alcance e faz o solo colapsar e começar a girar, sugando tudo dentro de uma esfera de 5 metros em direção ao centro para ser esmagado. Criaturas dentro da área devem realizar um teste de resistência de Destreza. Uma criatura sofre 2d10 de Dano de Impacto e 2d10 de Dano de Terra em uma falha, ou metade do dano em um sucesso. Enquanto estiver dentro da área do jutsu, o terreno é considerado terreno difícil. Em Ranks Superiores: Para cada rank acima de Rank-B em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d10 de cada tipo de dano.

#### ESTILO TERRA: DISPARO DE BAMBU DE PEDRA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você conjura 4 lanças reforçadas de terra que convergem de quatro direções diferentes sobre uma única criatura que possa ver dentro do alcance, cercando-a completamente. Faça uma jogada de ataque de Ninjutsu contra o alvo, causando 6d10 de dano de Terra ao tentar empalá-lo. Um cubo de 6 metros de raio centrado no alvo se torna terreno difícil. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 Chakra e o dano em 1d10.

#### ESTILO TERRA: DOMO DA PRISÃO DE TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 3 metros (Esfera de 6 metros) | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM, CS | **Palavras-chave:** Ninjutsu, Liberação de Terra

Descrição: Você cria uma cúpula de terra ao redor de um ou mais alvos em uma esfera de 3 metros à sua frente. Criaturas dentro da área podem realizar um teste de resistência de Destreza. Em um sucesso, podem se mover até metade do seu deslocamento. Em uma falha, não podem se mover. Criaturas presas dentro da cúpula começam a ter seu chakra drenado no início de cada um de seus turnos, perdendo 2d6 de Chakra, que é transferido para o usuário deste jutsu. A cúpula possui CA 12 e 8d10 Pontos de Vida. O dano causado à cúpula é curado em 6d8 Pontos de Vida no início de cada um dos seus turnos. A cúpula é vulnerável a dano de Relâmpago. Se a cúpula for danificada por um Ninjutsu com a palavra-chave Liberação de Relâmpago, ela não regenera Pontos de Vida no início do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 Chakra e os Pontos de Vida iniciais da cúpula em 1d10.

#### ESTILO TERRA: LANÇA DE PELE DE FERRO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu, Disputa

Descrição: Você concentra chakra de Liberação de Terra por um de seus braços ou pernas, fazendo com que o membro escureça para um tom marrom-escuro e adquira a textura de pedra sólida. Em seguida, você ataca uma criatura com força suficiente para perfurar quase qualquer coisa. Faça um ataque de Ninjutsu. Em um acerto, o alvo sofre 10d6 de dano de Terra e deve realizar um teste de resistência de Constituição. Em uma falha, a pele do alvo começa a endurecer no ponto de impacto, iniciando um processo de petrificação. No início de cada um de seus turnos, o alvo deve realizar um novo teste de Constituição. Ao falhar três vezes, o corpo do alvo endurece completamente, tornando-se petrificado. Se o alvo obtiver três sucessos, ele expulsa o chakra de terra de seu corpo, encerrando os efeitos deste jutsu. Se este jutsu for usado novamente no mesmo alvo dentro de 24 horas, todos os testes de resistência contra ele são feitos com vantagem.

#### ESTILO TERRA: MAUSOLÉU DE TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 20 metros (Cubo de 5 metros) | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você usa chakra para aumentar sua força física e reduzir o peso da terra ao seu redor, ergue um cubo massivo e gigantesco de terra, grande o suficiente para lançar uma sombra sobre vários inimigos. Você arremessa o enorme bloco de pedra em um ponto que possa ver dentro de 20 metros. O bloco então recupera seu peso original, caindo em alta velocidade e causando um impacto devastador. Criaturas dentro do cubo de 5 metros devem realizar um teste de resistência de Destreza, sofrendo 4d10 de dano de Impacto em uma falha, ou metade do dano em um sucesso. Em caso de falha o alvo fica atordoado até o fim do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 Chakra e o dano em 2d10.

#### ESTILO TERRA: MURALHA DO ESTILO TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você converte chakra em terra e a cospe pela boca, ou utiliza a terra já presente para gerar rapidamente uma grande muralha. A muralha tem 30 centímetros de espessura, 10 metros de comprimento e 8 metros de altura. Se a muralha for criada no espaço de uma criatura, ela é empurrada para um dos lados da muralha (à sua escolha). A muralha pode ter qualquer formato ou design que você desejar. A muralha possui CA igual à seu atributo de Inteligência e 8d12 Pontos de Vida. Esta muralha é vulnerável a dano de Relâmpago. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 Chakra e os Pontos de Vida da muralha em 1d12.

#### ESTILO TERRA: PÂNTANO SEM FUNDO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 40 metros (Cubo de 20 metros) | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você seleciona um espaço que possa ver dentro do alcance. A partir desse ponto, um enorme pântano de lama se forma e se expande, preenchendo um cubo de 20 metros com o espaço escolhido sendo o centro. Esse pântano conta como terreno difícil e não pode ser atravessado por técnicas de caminhar sobre a água. Criaturas dentro da área ou que entrem nela devem realizar um teste de resistência de Força para evitar serem sugadas pelo pântano sem fundo. Uma criatura que falhar três vezes consecutivas é puxada para o fundo do pântano, onde não há ar respirável. Cada falha consecutiva impõe penalidades adicionais: - Primeira falha: O deslocamento da criatura é reduzido a 0, pois seus pés são sugados abaixo da superfície, deixando os joelhos e acima expostos. Criaturas com deslocamento reduzido a 0 por este jutsu falham automaticamente em testes de Destreza. - Segunda falha: Metade do corpo da criatura fica submersa, e ela fica Imobilizada. - Terceira falha: A criatura é puxada completamente para baixo da superfície e deve prender a respiração ou começar a sufocar. Em um sucesso, a criatura remove uma das condições de falha, na ordem inversa em que foram recebidas

#### ESTILO TERRA: TÉCNICA DO SANDUÍCHE DE TERRA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 30 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você conjura duas construções massivas de terra, de tamanho Grande, uma de cada lado de uma criatura que possa ver dentro do alcance, e as faz colapsar uma contra a outra, esmagando o alvo entre elas. A criatura alvo e todas as criaturas a até 2 metros dela devem realizar um teste de resistência de Força, sofrendo 12d4 de dano de Terra em uma falha, ou metade do dano em um sucesso. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 Chakra e o dano em 2d4.

### RANK-A

#### ESTILO TERRA: AGULHA DE PEDRA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 28 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você concentra uma grande quantidade de chakra em uma única lança de terra, fina, extremamente rápida, com 28 metros de comprimento e 2 metros de largura. Criaturas na linha devem ser bem-sucedidas em um teste de resistência de Destreza, sofrendo 9d10 de dano de Terra em uma falha.

#### ESTILO TERRA: DRAGÃO DE PEDRA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você conjura uma construção gigante de pedra feita de terra, poeira, solo e areia, formando um Dragão Grande. Você pode comandá-lo usando uma ação bônus. Ele rola iniciativa e possui seus próprios turnos. |  | | :-: | | \#\#\#\# \\DRAGÃO ELEMENTAL DE TERRA\\\Construto Grande, sem alinhamento\  - \\Classe de Armadura:\\ 13 + Seu Modificador de Inteligência  &#10;      &#10;  - \\Pontos de Vida:\\ (14d10 + 80)  &#10;      &#10;  - \\Velocidade:\\ 12 metros \|  \|  \|  \|  \|  \|  \|&#10;\| :-: \| :-: \| :-: \| :-: \| :-: \| :-: \|&#10;\| \\\\\\FOR\\\\\\ \| \\\\\\DES\\\\\\ \| \\\\\\CON\\\\\\ \| \\\\\\INT\\\\\\ \| \\\\\\SAB\\\\\\ \| \\\\\\CAR\\\\\\ \|&#10;\| 21 (+5) \| 10 (+0) \| 26 (+8) \| 1 (-5) \| 10 (+0) \| 1 (-5) \|&#10;  - \\Imunidades a Dano:\\ Ácido, Veneno, Psíquico; Concussão, Cortante e Perfurante de armas não aprimoradas por Chakra.&#10;  - \\Imunidades a Condição:\\ Enfeitiçado, Exaustão, Amedrontado, Paralisado, Petrificado, Envenenado.&#10;  - \\Sentidos:\\ Visão no Escuro 18 metros, Percepção passiva 10 metros.  - \\Forma Imutável:\\ O Dragão de Terra é imune a qualquer Jutsu ou efeito que altere sua forma.&#10;  - \\Ataques Elementais:\\ Os ataques do Dragão são aprimorados por chakra.\#\#\#\# \\ATAQUES\\   - \\Ataque Múltiplo:\\ O Dragão Elemental de Terra pode atacar 3 vezes com sua Mordida.&#10;  - \\Mordida:\\ Ataque: (1d20 + Modificador de Força vs CA do alvo), alcance de 3 metros, uma criatura por mordida. Acerto: 2d10 + 5 de dano de Terra.&#10;  - \\Sopro de Poeira:\\ O dragão exala poeira em um cone de 9 metros. Cada criatura naquele cone deve realizar um teste de resistência de Destreza, sofrendo 10d10 de dano de Terra em uma falha, ou metade desse dano em um sucesso. |

#### ESTILO TERRA: ENDURECIMENTO DE PEDRA DE FERRO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 15 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você envolve seu corpo em uma armadura de pedra tão dura quanto ferro. Isso aumenta sua durabilidade e resistência a danos. Reduza todo o dano recebido por você em 5 (exceto dano Psíquico e de Relâmpago), aumente sua CA em +2 e reduza seu deslocamento em 3 metros. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em 3 Chakra. Aumente a redução de dano em 2 e o bônus de CA em +1.

#### ESTILO TERRA: FLORESTA DE PEDRA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** Instantânea | **Alcance:** Esfera de 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você concentra uma enorme quantidade de chakra nas palmas das mãos e as pressiona contra o chão. Você cria um campo de terra pontiaguda em uma esfera de 19 metros centrada em você. Criaturas dentro da área devem realizar um teste de resistência de Destreza, sofrendo 4d8 de dano Perfurante e 4d8 de dano de Terra em uma falha, ou metade do dano em um sucesso. A área afetada passa a ser tomada por enormes estacas de pedra que alcançam até 4 metros de altura, cruzando-se e formando uma verdadeira floresta de espinhos, tornando o terreno difícil. Criaturas dentro da área afetada realizam testes de Percepção com desvantagem. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em 3 Chakra e o dano em 1d8 de cada tipo de dano.

#### ESTILO TERRA: PESO ADICIONAL

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** Instantânea | **Alcance:** 2 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você usa seu chakra para manipular temporariamente o peso de algo que toca. Objetos e estruturas tocados têm seu peso drasticamente aumentado, tornando-se 10 vezes mais pesados. Objetos ou estruturas que não conseguem suportar o próprio peso se estilhaçam e se quebram, e então seus fragmentos retornam ao peso normal. Se usado em uma criatura, faça um ataque de Ninjutsu. Em um acerto, o peso da criatura é dobrado. Criaturas que não conseguem sustentar o próprio peso corporal caem no chão caídas e paralisadas, incapazes de se mover. Como uma ação, em cada um dos turnos da criatura afetada, ela pode realizar um teste de resistência de Força para encerrar os efeitos deste jutsu.

#### ESTILO TERRA: QUEBRA DA GRAVIDADE

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 31 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você concentra uma grande quantidade de chakra em um cilindro com 16 metros de largura e 31 metros de altura, centrado em um ponto dentro do alcance. Todas as criaturas e objetos que não estejam de alguma forma ancorados ao chão na área começam a cair para cima, atingindo o topo da área no momento em que este ninjutsu é conjurado. Uma criatura pode realizar um teste de resistência de Destreza para se agarrar a um objeto fixo ao seu alcance, evitando a queda. Se um objeto sólido (como um teto) for encontrado durante essa queda, criaturas e objetos colidem com ele como se estivessem caindo normalmente para baixo. Se uma criatura ou objeto atingir o topo da área sem colidir com nada, permanece ali, oscilando levemente, pela duração do jutsu. Ao final da duração, todas as criaturas e objetos afetados caem de volta ao solo. .

### RANK-S

#### ESTILO TERRA: ENDURECIMENTO ÓSSEO DE DIAMANTE

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu

Descrição: Você usa seu domínio absoluto sobre o chakra e a Liberação de Terra para transformar seus ossos em um material que simula diamantes em resistência e peso, além de obter certo controle sobre seu movimento e a velocidade com que se regeneram. Pela duração do jutsu, você regenera 5 pontos de vida no início de cada um de seus turnos, seus ataques desarmados causam 2d8 de dano de esmagamento adicional e sua Classe de Armadura aumenta em +2.

#### ESTILO TERRA: QUEDA DE METEOROS

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 1.5 km | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Terra, Ninjutsu, Proibido

Descrição: Ao concluir este jutsu, você seleciona 4 pontos diferentes que possa ver dentro do alcance. Cada criatura em uma esfera de 13 metros de raio centrada em cada ponto escolhido deve realizar um teste de resistência de Destreza com desvantagem. Enormes blocos de pedra, terra e lama despencam do céu sobre as áreas selecionadas. Uma criatura sofre 10d6 de dano de esmagamento e 10d6 de dano de Terra em uma falha no teste, ou metade desse dano em um sucesso.

## Ninjutsu Elemental: ESTILO VENTO (Fūton)

### RANK-D

#### ESTILO VENTO: ATAQUE DE ZÉFIRO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você se move como o vento. Uma vez antes do jutsu terminar, você pode conceder a si mesmo vantagem em uma jogada de ataque com arma durante seu turno. Esse ataque causa 1d8 de dano de Vento adicional em um acerto. Independentemente de acertar ou errar, seu deslocamento de caminhada aumenta em 10 metros até o final desse turno.

#### ESTILO VENTO: BRISA DE CONTRA-ATAQUE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** Reação, acionada quando você sofreria dano | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria uma bolha condensada de ar extremamente denso ao seu redor para desviar ataques recebidos. Role 4d10. O resultado indica a quantidade de dano que a bolha pode absorver antes de se romper. Dano de Fogo causa o dobro de dano à bolha. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e role +1d10 adicional.

#### ESTILO VENTO: DANÇA DA CORRENTE DE AR

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** Ação Bônus | **Alcance:** Esfera de 4 metros | **Duração:** 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você envolve suas mãos com correntes de ar e gera uma nuvem de poeira que envolve você e todas as criaturas dentro do raio do jutsu. Todas as criaturas são tratadas como se estivessem sob cobertura total enquanto estiverem dentro da nuvem. Criaturas diferentes de você têm desvantagem em testes de Sabedoria para enxergar através da nuvem. Enquanto estiver dentro dela, sua visão é tratada como se estivesse em luz baixa.

#### ESTILO VENTO: ONDAS DE AR CORTANTES

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria correntes de vento extremamente finas e afiadas, golpeando o ar em direção ao alvo. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 3d8 de dano de Vento. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d8.

#### ESTILO VENTO: ONDAS DE AR REPULSIVO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 5 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria correntes de ar extremamente comprimidas e poderosas, fortes o suficiente para rachar pedra e desviar cachoeiras. Faça um ataque de Ninjutsu à distância. Em um acerto, a criatura sofre 4d4 de dano de Vento e deve realizar um teste de resistência de Força. Em uma falha, é derrubada no chão. Em um sucesso, resiste a ser empurrada. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 2d4.

#### ESTILO VENTO: PALMA DA VENDAVAL

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você une as mãos, cobrindo as palmas abertas com uma rajada poderosa. Faça um ataque corpo a corpo de Ninjutsu contra uma criatura ou objeto. Em um acerto, o alvo sofre 3d6 de dano de Vento e deve realizar um teste de resistência de Força para evitar ser empurrado 3 metros. Em um sucesso, nenhum efeito adicional ocorre. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d6.

#### ESTILO VENTO: PROJÉTIL DE AR

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria uma pequena esfera de ar comprimido na palma da mão antes de lançá-la contra uma criatura alvo que possa ver dentro do alcance. Você dispara duas balas de ar, podendo direcioná-las ao mesmo alvo ou a alvos diferentes. Faça um ataque de Ninjutsu à distância, causando 1d10 de dano de Vento por acerto. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo deste jutsu em 3 e o número de ataques em +1.

#### ESTILO VENTO: QUEDA SUAVE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** Reação, acionada quando você começa a cair | **Alcance:** Pessoal | **Duração:** 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um jato de ar de alta pressão a partir das mãos ou pés, reduzindo sua velocidade de queda em 19 metros por rodada enquanto o jutsu durar. Se tocar o solo antes do término do jutsu, você não sofre dano de queda, aterrissa de pé e o jutsu se encerra. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e selecione 1 alvo adicional para receber os benefícios do jutsu.

#### ESTILO VENTO: REDOMOINHO DO PAVÃO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você gera uma rajada violenta ao golpear o ar com um de seus membros. Um vento cortante se forma em uma linha reta de 10 metros de comprimento por 2 metros de largura a partir de você. Criaturas na linha devem realizar um teste de resistência de Força, sofrendo 2d6 de dano de Vento e ficando caídas em uma falha. Em um sucesso, sofrem metade do dano e nenhum efeito adicional. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d6.

#### ESTILO VENTO: REDOMOINHO VIOLENTO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você exala um poderoso fluxo de vento pela boca. Criaturas na área devem realizar um teste de resistência de Força. Em uma falha, sofrem 2d8 de dano de Vento e são empurradas 7 metros para trás. Em um sucesso, sofrem metade do dano e não são empurradas. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d10.

#### ESTILO VENTO: SEGUNDO FÔLEGO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você inspira profundamente, preenchendo seus pulmões e sangue com oxigênio filtrado por chakra, acelerando a circulação e revitalizando seu corpo. Você recupera pontos de vida iguais a 1d10 + seu modificador de Inteligência. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e role +1d10 adicional.

#### ESTILO VENTO: TUFÃO DE PASSAGEM

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 10 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria uma corrente de ventos extremamente fortes em um raio de 10 metros centrado em você. O campo de ventos se move junto com você. Pela duração, você e outras criaturas na área ficam ensurdecidas, chamas desprotegidas do tamanho de tochas ou menores são apagadas, e a área se torna terreno difícil para criaturas diferentes de você. Ataques à distância com armas têm desvantagem se atravessarem o campo de vento. Vapores, gases e névoas dispersáveis por vento forte são dissipados.

#### ESTILO VENTO: VENDAVAL DE SUPORTE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Reação, ao realizar um teste de Força, Destreza ou Constituição | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você lança as mãos à frente, criando uma explosão de ar comprimido que auxilia em tarefas físicas, como escapar, repelir ataques ou dispersar gases perigosos. Como reação, quando for obrigado a realizar um teste de resistência de Força, Destreza ou Constituição contra um Ninjutsu ou Taijutsu, você realiza o teste com vantagem. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e escolha 1 criatura adicional para receber o benefício do jutsu.

#### ESTILO VENTO: VENTO DE POEIRA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 5 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você gera um vento poderoso a partir dos pulmões com uma única expiração. Ao exalar, levanta uma nuvem de poeira, terra e detritos soltos. Criaturas na área devem realizar um teste de resistência de Sabedoria. Em uma falha, ficam cegas até o final de seus respectivos turnos. Em um sucesso, nenhum efeito adicional ocorre. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o tamanho do cone em 2 metros.

#### ESTILO VENTO: VENTO DESFOCADO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Reação, acionada quando você é alvo de um ataque | **Alcance:** Pessoal | **Duração:** 1 rodada
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Seu corpo se torna borrado e instável aos olhos de quem o observa. Pela duração do jutsu, qualquer criatura tem desvantagem em jogadas de ataque contra você. Um atacante é imune a esse efeito se não depender da visão, como no caso de percepção às cegas, ou se puder enxergar através de ilusões, como com Sharingan ou Byakugan.

### RANK-C

#### ESTILO VENTO: 1.000 LÂMINAS DO VENTO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 7 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria uma esfera espiralada de chakra de vento contendo inúmeras lâminas cortantes. Criaturas na área devem ser bem-sucedidas em um teste de resistência de Força ou são puxadas 3 metros em sua direção, sofrendo 2d6 de dano cortante e 2d6 de dano de Vento. Criaturas que falharem no teste e terminarem seu movimento a até 2 metros de você são atingidas por uma explosão violenta do vento cortante, sendo arremessadas 5 metros para trás e sofrendo 2d6 de dano cortante adicional. Criaturas que obtêm sucesso sofrem metade do dano inicial e nenhum outro efeito. Em Ranks Superiores: Para cada rank acima de C, aumente o custo em 3 e o dano inicial em 1d6 para cada tipo de dano.

#### ESTILO VENTO: DONINHA DA FOICE (KAMAITACHI)

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** Reação (ao ser atingido por ataque corpo a corpo) | **Alcance:** 28 metros | **Duração:** Instantânea
**Componentes:** HS, CM, W (Leque) | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Ao ser atingido, você colapsa o vento ao redor de você e do atacante com um rápido movimento de Leque, criando uma lâmina extremamente afiada de vento. Faça um ataque de Ninjutsu como reação. Em um acerto, você dispersa o dano do ataque que sofreria e causa 5d8 de dano cortante. Em Ranks Superiores: Aumente o custo em 3 e o dano em +1d8.

#### ESTILO VENTO: ESCUDO DE VÁCUO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** Reação (ao ser atingido) | **Alcance:** Pessoal (esfera de 4 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria um vórtice de ar comprimido que implode, gerando uma onda de choque defensiva. Você recebe 4d8 de CA temporários até o início do seu próximo turno. Em Ranks Superiores: Aumente o custo em 3 e os CA temporários em +4.

#### ESTILO VENTO: ESTILHAÇO POR FRICÇÃO DO VENTO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, 1 minuto (10 turnos)
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você envolve seu corpo em ar giratório que reduz drasticamente o atrito. Enquanto ativo: - Seu deslocamento é dobrado - Você tem vantagem em testes de Destreza - Sua CA aumenta em +1 - Você ganha uma ação adicional por turno, que pode ser usada para Atacar, Correr, Desengajar, Esconder-se ou Usar um Objeto

#### ESTILO VENTO: EXPLOSÃO DE AR COMPRIMIDO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, até 3 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você conjura um vórtice espiralado de chakra de vento ao redor da arma de uma criatura alvo. O alvo faz um teste de resistência de Destreza para evitar que o vento colapse sobre seu braço armado. Em uma falha, sofre 2d6 de dano cortante. Se continuar segurando a arma, deve repetir o teste no início de cada turno. Em um sucesso, sofre metade do dano. Após 3 falhas, a arma não suporta mais a pressão e se estilhaça, espalhando estilhaços. Criaturas a até 4 metros devem passar em um teste de Destreza ou sofrer 2d6 de dano cortante.

#### ESTILO VENTO: GRANDE RUPTURA

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (linha de 19 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria um vórtice de ar à sua frente e o comprime até explodir como um canhão. Criaturas em uma linha de até 19 metros devem realizar um teste de Força. Falha: sofrem 4d10 de dano de Vento e são arremessadas 10 metros para trás. Sucesso: sofrem metade do dano e mantêm o equilíbrio. Em Ranks Superiores: Aumente o custo em 3, o dano em +1d10 e a distância de empurrão em +4 metros.

#### ESTILO VENTO: MOVIMENTO DO REDEMOINHO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 6 Chakra
**Tempo de Conjuração:** Ação Bônus | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você envolve seus pés com uma enorme quantidade de chakra de vento e se move tão rápido que parece se teletransportar para um espaço a até 19 metros.

#### ESTILO VENTO: ONDA DE CHOQUE DE PRESSÃO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (esfera de 10 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria uma massa semelhante a um tornado, altamente comprimida, que é liberada violentamente. Criaturas na área devem passar em um teste de Destreza ou são puxadas 5 metros em sua direção, sofrendo 5d6 de dano cortante. Este jutsu amplifica fogo e Ninjutsu de Liberação de Fogo. Se fogo do tamanho de uma fogueira ou um jutsu de fogo Rank C ou inferior estiver na área, o dano se torna dano de Fogo e aumenta em 2d6, anulando o efeito do fogo original. Você não sofre esse dano adicional. Jutsus de Fogo Rank B ou superior iniciam uma disputa. Em Ranks Superiores: Aumente o custo em 3 e o dano em +1d6.

#### ESTILO VENTO: PAREDE DE VENTO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Concentração, 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um muro de vento com até 16 metros de comprimento, 5 metros de altura e 1 metro de espessura. Ao surgir, criaturas que tentarem atravessar a área devem passar em um teste de Força ou sofrer 3d8 de dano cortante, ou metade em sucesso. O muro bloqueia gases, projéteis comuns e criaturas voadoras pequenas. Fogo transforma o muro em uma parede de chamas, encerrando imediatamente o jutsu.

#### ESTILO VENTO: PUNHOS DA TEMPESTADE DE VENTO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 7 Chakra
**Tempo de Conjuração:** Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você reveste mãos e pés com chakra de vento altamente comprimido e reativo. Enquanto este jutsu estiver ativo, seus ataques desarmados causam dano cortante e causam 2d8 de dano de Vento, em vez do dano normal. Em Ranks Superiores: Aumente o custo em 3 e o dano em +1d8.

#### ESTILO VENTO: PUNHOS DA TEMPESTADE DE VENTO DILACERANTE

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você cria uma grande garra feita de chakra de vento semi-sólido. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 3d12 de dano cortante e o alvo é considerado Sangrando. Em Ranks Superiores: Aumente o custo em 3 e o dano em +1d12.

### RANK-B

#### ESTILO VENTO: 10.000 LÂMINAS CORTANTES

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 19 metros | **Duração:** Concentração, 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria uma cúpula de vento giratório com 19 metros de diâmetro, centrada em você. O vento gira, chicoteia e sopra a cerca de 190 km/h, gerando inúmeras lâminas feitas de chakra de vento que se movem livremente dentro da cúpula. Qualquer coisa que não esteja firmemente ancorada é levantada, arremessada e repetidamente cortada dentro da cúpula. Criaturas afetadas devem realizar um teste de resistência de Destreza. - Falha: sofrem 3d10 de dano cortante e 3d10 de dano de Vento - Sucesso: sofrem metade do dano Além disso, as criaturas devem realizar um teste de resistência de Força. Em falha: são erguidas pelos ventos, arremessadas 7 metros em uma direção aleatória e ficam caídas A área dentro da cúpula é considerada terreno difícil, inclusive para criaturas voadoras. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e o dano em +1d10 para cada tipo de dano.

#### ESTILO VENTO: CORTADOR DE VENTO

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria uma única lâmina de vento extremamente afiada e a lança contra um alvo dentro do alcance. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 5d12 de dano cortante. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e o dano em +1d12.

#### ESTILO VENTO: GRANDE DONINHA DA FOICE

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** 1 Ação
**Componentes:** HS, CM, NT (Leque) | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Ao balançar seu leque, uma rajada massiva de vento cortante é liberada. Cada criatura em uma linha de 14 metros de comprimento e 5 metros de largura deve realizar um teste de Destreza. Em uma falha sofre 4d6 de dano de Vento e 4d6 de dano cortante As criaturas também devem realizar um teste de Força ou são arremessadas 8 metros para trás e ficam caídas Este jutsu causa o dobro de dano a objetos e estruturas. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e o dano em +1d6 para cada tipo de dano.

#### ESTILO VENTO: GRANDE ESFERA DE VÁCUO

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros (esferas de 8 metros) | **Duração:** Concentração, 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria 3 grandes esferas de chakra de vento e escolhe três pontos dentro do alcance. Cada esfera se expande a partir do ponto escolhido, formando uma área de 8 metros de diâmetro. Criaturas dentro das esferas têm seu deslocamento reduzido a 0 e não conseguem respirar devido à pressão extrema. Criaturas podem fazer um teste de Força para tentar recuperar metade do deslocamento. Também devem fazer um teste de Constituição, em uma falha começam a sufocar e ganham 2 níveis de exaustão. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e afete +1 área adicional.

#### ESTILO VENTO: LÂMINA DE VÁCUO

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você exala chakra de vento sobre uma arma, aumentando drasticamente sua afiação, alcance e letalidade. Também pode ser aplicado à própria mão, criando uma lâmina de vento. Armas empunhadas: passam a causar 2d12 de dano cortante Armas arremessáveis: passam a causar 2d10 de dano cortante. Pode afetar até 10 armas arremessáveis ao mesmo tempo O alcance de armas empunhadas aumenta em 4 metros. Armas arremessáveis ficam muito mais rápidas e acertam todas as criaturas em um raio de 2 metros sem necessidade de teste. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e o dano em +2d12 ou +2d10, respectivamente.

#### ESTILO VENTO: REAÇÃO NEGATIVA

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 10 Chakra
**Tempo de Conjuração:** 1 Reação (ao ser atingido por um Ninjutsu) | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um vórtice girando no sentido anti-horário no instante antes do ataque atingi-lo. Faça um teste de ataque de Ninjutsu. Se tiver um sucesso: o oponente sofre o dano do próprio ataque + 5d6 de dano de Vento Se falhar: você sofre o dano normalmente, pois o ataque rompe seu jutsu Se o jutsu do inimigo for de Liberação de Fogo você rola em desvantagem. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e o dano adicional em +2d6.

#### ESTILO VENTO: VENDAVAL DE MÚLTIPLAS CAMADAS

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você executa uma série de selos rápidos, comprimindo e tecendo o ar ao seu redor em múltiplas camadas concêntricas de vento rotativo. Essas camadas se sobrepõem, criando uma barreira, densa e quase translúcida, que ocupa seu espaço e o protege de ataques vindos de todas as direções. Ao ser ativado, a barreira possui 35 Pontos de Vida (PV). Entretanto, a complexidade de manter a mesma intensidade é grande. Mecânica de Duração e Recuperação da barreira: - No início de cada um de seus turnos após o primeiro, a barreira passa a ter apenas 1 PV, mantendo sua forma básica, mas com a resistência drasticamente reduzida. - Como uma Ação Bônus, você pode focar sua concentração para reforçar as camadas de vento, rolando 2d6 para recuperar PV para a barreira. Você pode fazer isso repetidamente em turnos diferentes, mas em todo começo de turno a barreira volta a ter 1 PV. A natureza do vento torna a barreira vulnerável a ataques de Fogo, que a atravessam sem resistência. Ela possui resistência a dano Elétrico, que rola com desvantagem contra você. O jutsu termina imediatamente se: 1\) Você perder a concentração; 2\) Você decidir desativá-lo voluntariamente; 3\) Os PV da barreira forem reduzidos a 0. Uma vez dissipada, a barreira não pode ser recuperada novamente na mesma conjuração. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e os PV iniciais da barreira em +5.

#### ESTILO VENTO: VENTO DIVINO DA MONTANHA

**Classificação:** Ninjutsu | **Rank:** Rank B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um vórtice de vento cuja intensidade pode ser controlada. Faça um ataque de Ninjutsu contra uma criatura que você possa ver dentro do alcance. Em um acerto, o alvo sofre 14d4 de dano de Vento, sendo atingido com força suficiente para devastar o solo no impacto. Se houver qualquer fonte de fogo entre você e o alvo, o jutsu se inflama, tornando-se uma corrente de fogo e causando +3d4 de dano de Fogo. Em Ranks Superiores: Para cada rank acima de B, aumente o custo em 3 e o dano em +3d4.

### RANK-A

#### ESTILO VENTO: ONDAS SUCESSIVAS DE VÁCUO

**Classificação:** Ninjutsu | **Rank:** Rank A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você inspira profundamente e exala várias lâminas de vento extremamente intensas, disparadas em ângulos diferentes contra um único alvo. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 8d6 de dano cortante e 8d6 de dano de Vento e é considerado Sangrando. Em Ranks Superiores: Para cada rank acima de A, aumente o custo em 3 e o dano em +1d6 para cada tipo de dano.

#### ESTILO VENTO: PAREDE DE VÁCUO

**Classificação:** Ninjutsu | **Rank:** Rank A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 Rodada
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um vácuo de ar extremamente denso ao seu redor que anula quase todos os ataques direcionados a você. Até o início do seu próximo turno, todos os ataques de Ninjutsu, Taijutsu, armas corpo a corpo e armas à distância devem rolar 1d20 ao declarar o ataque. Com um resultado de 8 ou mais, o ataque é desviado ou repelido pelo vento extremamente denso.

#### ESTILO VENTO: QUEDA INTERMINÁVEL

**Classificação:** Ninjutsu | **Rank:** Rank A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, 10 minutos
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um vácuo de ar sob si mesmo, permitindo subir, descer e se mover livremente em qualquer direção. Você ganha deslocamento de voo de 10 metros. Manobras complexas exigem perícia em Acrobacia. Enquanto estiver voando, você pode carregar no máximo 45 kg.

#### ESTILO VENTO: REDE DE ARREMESSO

**Classificação:** Ninjutsu | **Rank:** Rank A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 19 metros | **Duração:** 1 Ação
**Componentes:** HS, CM, W (Leque) | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Uma explosão de vento cortante irrompe de seu leque quando você o balança uma única vez. Cada criatura em um cone de 19 metros deve realizar um teste de resistência de Destreza. Falha: a criatura sofre 6d8 de dano de Vento, incapaz de evitar a rede de lâminas de vento As criaturas também devem realizar um teste de resistência de Força para resistir a serem arremessadas até o final do cone e ficarem caídas. Criaturas que ficarem caídas devem ainda realizar um teste de resistência de Constituição ou ficam Atordoadas até o final de seu próximo turno. Em Ranks Superiores: Para cada rank acima de A, aumente o custo em 3 e o dano em +1d8.

#### ESTILO VENTO: RESPIRAÇÃO INFINITA

**Classificação:** Ninjutsu | **Rank:** Rank A | **Custo:** 15 Chakra
**Tempo de Conjuração:** 1 Minuto | **Alcance:** Pessoal | **Duração:** 10 Horas
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você inspira profundamente e, usando chakra, revitaliza continuamente essa única porção de ar como se fosse sempre uma nova respiração. Você não precisa respirar por até 10 horas e não pode ser sufocado ou afogado durante esse período.

#### ESTILO VENTO: VENTO DE PROJÉTIL PERFURANTE

**Classificação:** Ninjutsu | **Rank:** Rank A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você inspira profundamente e, ao expirar, utiliza chakra para criar um projétil giratório de vento em forma de broca que rasga tudo em seu caminho. Faça um ataque de Ninjutsu contra até 3 alvos dentro do alcance. Em um acerto, a criatura sofre 8d12 de dano de Vento e é arremessada 8 metros para trás. Em Ranks Superiores: Para cada rank acima de A, aumente o custo em 3 e o dano em +1d12.

### RANK-S

#### ESTILO VENTO: COLISÃO DE 1 MILHÃO DE LÂMINAS

**Classificação:** Ninjutsu | **Rank:** Rank S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu, Disputa

Descrição: Você concentra uma quantidade massiva de chakra de vento em uma esfera acima do alvo dentro do alcance e a faz despencar violentamente sobre ele como uma única lâmina colossal. O alvo deve realizar um teste de resistência de Destreza. Falha: sofre 15d12 de dano de Vento Sucesso: sofre metade do dano

#### ESTILO VENTO: ONDA DE REPULSÃO

**Classificação:** Ninjutsu | **Rank:** Rank S | **Custo:** 28 Chakra
**Tempo de Conjuração:** 1 Reação, que você realiza ao ver um Ninjutsu sendo conjurado | **Alcance:** 28 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Ao perceber um ataque vindo em sua direção, você cria um campo de força de vento impenetrável projetado para repelir tudo. Faça um teste de Disputa contra o adversário. Sucesso (resultado maior): o oponente sofre o dano do próprio ataque mais 10d8 de dano de Vento adicional Falha: o jutsu é desviado e se dissipa imediatamente, sem causar dano adicional

#### ESTILO VENTO: RAJADA EM LEQUE

**Classificação:** Ninjutsu | **Rank:** Rank S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 31 metros | **Duração:** 1 Ação
**Componentes:** HS, CM, NT (Leque) | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Uma torrente de vento concussivo explode de suas mãos, devastando tudo à sua frente em um cone de 31 metros. Este jutsu arremessa tudo que não esteja firmemente preso ao solo, chegando a arrancar árvores e destruir estruturas e construções menores. Criaturas em seu caminho devem realizar um teste de resistência de Força. Falha: são arremessadas 37 metros para trás Se uma criatura colidir com uma estrutura, seu movimento termina imediatamente e ela sofre o triplo do dano de queda, como se tivesse caído a mesma distância percorrida.

#### ESTILO VENTO: TORNADO

**Classificação:** Ninjutsu | **Rank:** Rank S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cilindro com 28 metros de raio | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação de Vento, Ninjutsu

Descrição: Você cria um cilindro espiral de vento centrado em si mesmo, com 28 metros de raio e 37 metros de altura. A área se torna terreno difícil durante toda a duração, inclusive para criaturas voadoras. Objetos desassistidos de tamanho Grande ou menor dentro do cilindro são puxados para cima e passam a girar ao redor do centro a 320 km/h. Uma criatura que inicie seu turno dentro do cilindro deve realizar um teste de resistência de Força ou será puxada para cima em direção ao centro, ficando Imobilizada enquanto estiver em movimento. No início de cada um de seus turnos, todas as criaturas e objetos dentro do cilindro sofrem 8d10 de dano de Vento. Criaturas podem, como uma ação em seus turnos, realizar um teste de resistência de Força para não ficarem Imobilizadas naquele turno.

## Ninjutsu Elemental: ESTILO FOGO (Katon)

### RANK-D

#### ESTILO FOGO: ABSORVER CALOR

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 4 Chakra
**Tempo de Conjuração:** Reação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você gera um vácuo de chakra que absorve o calor da área ao redor e cria uma fina camada de chakra de fogo para se proteger. Você ganha resistência ao dano do ataque que acionou este jutsu até o início do seu próximo turno. Dano de Gelo ignora essa resistência.

#### ESTILO FOGO: NUVEM DE CINZAS

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros (nuvem de 9 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você inala e molda chakra de fogo nos pulmões, criando uma nuvem de cinzas que é expelida em uma área visível dentro do alcance. A nuvem permanece até ser dissipada, o que pode levar até 10 minutos. Criaturas dentro da nuvem têm desvantagem em jogadas de ataque. Criaturas que realizem ataques à distância dentro da nuvem também sofrem desvantagem.

#### ESTILO FOGO: MÃOS FLAMEJANTES

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (cone de 5 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você estende as mãos e dispara uma onda de chamas. Cada criatura em um cone de 5 metros deve realizar um teste de resistência de Destreza. Falha: 4d4 de dano de Fogo Sucesso: metade do dano Objetos inflamáveis na área que não estejam sendo usados ou carregados pegam fogo. Em Ranks Superiores: Para cada rank acima de D, aumente o custo em 3 Chakra e o dano em +1d4.

#### ESTILO FOGO: ARANHA CARMESIM

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros (esfera de 9 metros) | **Duração:** Concentração,
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você expele fogo que envolve uma criatura visível dentro do alcance em um raio de 9 metros do alvo. As chamas então se concentram em um ponto dentro do raio, formando uma Aranha de Chamas Média, que pode ser comandada como uma Ação Bônus em seus turnos. |  | | :-: | | \#\#\#\# \\ARANHA FLAMEJANTE\\ \Construto Médio, sem alinhamento\  - \\Classe de Armadura:\\ 10 + Seu Modificador de Inteligência  &#10;      &#10;  - \\Pontos de Vida:\\ 4d1+4  &#10;      &#10;  - \\Velocidade:\\ 12 metros\|  \|  \|  \|  \|  \|  \|&#10;\| :-: \| :-: \| :-: \| :-: \| :-: \| :-: \|&#10;\| \\\\\\FOR\\\\\\ \| \\\\\\DES\\\\\\ \| \\\\\\CON\\\\\\ \| \\\\\\INT\\\\\\ \| \\\\\\SAB\\\\\\ \| \\\\\\CAR\\\\\\ \|&#10;\| 13 (+3) \| 13 (+6) \| 12 (+1) \| 1 (-5) \| 10 (+0) \| 1 (-5) \|&#10;  - \\Vulnerabilidade a Dano:\\ A aranha flamejante sofre o dobro de dano por ataques de frio.&#10;  - \\Imunidades a Dano:\\ Ácido, Fogo, Psíquico, Concussão, Cortante e Perfurante.&#10;  - \\Imunidades a Condição:\\ Enfeitiçado, Exaustão, Amedrontado, Paralisado, Petrificado, Envenenado.&#10;  - \\Sentidos:\\ Percepção passiva 10.  - \\Corpo Elemental:\\ Os ataques da Aranha Flamejante são aprimorados por chakra.\#\#\#\# \\ATAQUES\\   - \\Ataque Múltiplo:\\ A Aranha Flamejante pode atacar 2 vezes com sua Mordida.&#10;  - \\Mordida:\\ Ataque (1d20 + Modificador de Destreza vs CA do alvo), alcance de 2 metros, ataca uma criatura. Acerto: 1d8+3 de dano de Fogo.&#10;  - \\Teia de Chamas:\\ Ataque (1d20 + Modificador de Destreza vs CA do alvo), alcance de 18 metros, ataca uma criatura. O alvo é coberto por teias de fogo sólido e fica \\Restrito\\, sofrendo 2d6 de dano de fogo. Como uma ação, o alvo restrito pode fazer um teste de Força para se libertar em cada turno que estiver preso. A teia também pode ser atacada e destruída (CA 10, PV 5; Vulnerabilidade a dano de frio). |

#### ESTILO FOGO: LANTERNA DE DEMÔNIO

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (raio de 2 metros) | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você conjura múltiplas chamas de chakra que o cercam, assumindo formas de rostos demoníacos. Você emite luz plena por 6 metros e luz baixa por mais 3 metros. Como reação, quando uma criatura entra a até 2 metros de você, ela deve realizar um teste de resistência de Destreza. Falha: a criatura pega fogo e recebe a Condição Queimando.

#### ESTILO FOGO: CHAMA ERUPTIVA

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você concentra chakra em um ponto sob uma criatura visível. O alvo deve realizar um teste de resistência de Destreza. Falha: sofre 2d8 de dano de Fogo Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d8 por rank.

#### ESTILO FOGO: BOLA DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros (esfera de 5 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você expele fogo que se expande em uma explosão ardente. Criaturas na área devem realizar um teste de resistência de Destreza ou sofrer 3d6 de dano de Fogo. Objetos inflamáveis no caminho pegam fogo. Em Ranks Superiores: Aumente o custo em 3 Chakra, o dano em +1d6 e o raio em +2 m.

#### ESTILO FOGO: RAJADA DE CHAMAS

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você dispara uma rajada de fogo contra uma criatura ou objeto. Faça um ataque de Ninjutsu à distância. Acerto: 2d10 de dano de Fogo Objetos inflamáveis atingidos pegam fogo. Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d10.

#### ESTILO FOGO: REVESTIMENTO DE CHAMAS

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você envolve uma arma com chakra de fogo. Em um acerto, a arma causa +1d6 de dano de Fogo. Se a arma for largada ou tomada, o jutsu termina, mas você pode aplicá-lo novamente como ação bônus. A chama ilumina 3 metros de luz plena e mais 3 metros de luz baixa. Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d6.

#### ESTILO FOGO: GOLPE DE CHAMA

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Uma coluna vertical de fogo irrompe do solo em um ponto escolhido. Criaturas em um cilindro de 3 metros de raio e 6 metros de altura devem realizar um teste de resistência de Destreza. Falha: 2d8 de dano de Fogo Sucesso: metade do dano Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d8.

#### ESTILO FOGO: CHICOTE DE CHAMAS

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (6 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você cria um chicote de fogo e ataca uma criatura. Faça um ataque de Ninjutsu. Em acerto o dano é 2d8 de Fogo. O alvo deve realizar um teste de resistência de Destreza ou será puxado 3 metros em sua direção. É considerado Caído e recebe a Condição Queimando.

#### ESTILO FOGO: RAPOSA DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Uma chama tremeluzente surge em sua mão. Ela não causa dano a você nem a seus equipamentos. Ilumina 6 metros de luz plena e 3 metros de luz baixa. Você pode atacar com esta chama, o acaba encerrando o jutsu. Para isso faça um ataque de Ninjutsu à distância contra um alvo a até 9 metros, um sucesso resulta em 1d10 de dano de Fogo

#### ESTILO FOGO: REJEIÇÃO DO FOGO INFERNAL

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 4 Chakra
**Tempo de Conjuração:** Reação | **Alcance:** Esfera de 5 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Quando você é atingido por uma criatura visível, libera uma explosão de fogo ao seu redor. Criaturas na área devem realizar um teste de resistência de Destreza. Falha: 2d10 de dano de Fogo Sucesso: metade do dano

#### ESTILO FOGO: FLOR FÊNIX (HOUSENKA)

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você dispara 3 projéteis de fogo. Faça 3 ataques de Ninjutsu à distância. Acerto: 1d8 de dano de Fogo por projétil Em Ranks Superiores: Aumente o custo em 3 Chakra e o número de ataques em +1.

#### ESTILO FOGO: CÍRCULO ESCALDANTE

**Classificação:** Ninjutsu | **Rank:** Rank D | **Custo:** 4 Chakra
**Tempo de Conjuração:** Reação | **Alcance:** 9 metros (raio de 5 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você cria 5 círculos de fogo, podendo direcioná-los a um ou vários alvos dentro do alcance. Cada círculo tem o raio de 5 metros centrados no alvo. Faça um ataque de Ninjutsu à distância para cada círculo. Acerto: 2d4 de dano de Fogo. Toda criatura dentro do círculo é atingida pelo jutsu. Em Ranks Superiores: Aumente o custo em 3 Chakra e cria +1 raio adicional.

### RANK-C

#### ESTILO FOGO: PILHA DE CINZAS FLAMEJANTES

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros (nuvem de 9 metros) | **Duração:** 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você sopra uma nuvem de cinzas superaquecidas em uma área visível dentro do alcance. A nuvem preenche uma área em forma de nuvem com 9 metros de raio. Criaturas dentro da nuvem são tratadas como se estivessem em escuridão total. Em qualquer momento durante a duração, como Ação Bônus, você pode incendiar a nuvem de cinzas. Todas as criaturas dentro da área devem realizar um teste de resistência de Destreza, sofrendo 3d10 de dano de Fogo em caso de falha, ou metade do dano em caso de sucesso. Qualquer ação de fogo de qualquer personagem dentro desta área pode desencadear o incêndio da nuvem. Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d10 por rank.

#### ESTILO FOGO: OLHAR ARDENTE

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você fixa o olhar em um objeto ou criatura dentro do alcance. Seus olhos brilham com um vermelho intenso e o alvo entra em chamas durante a duração. Objetos começam a queimar normalmente. Criaturas devem realizar um teste de resistência de Destreza ou ganham a Condição Queimando, que não pode ser extinta enquanto o jutsu durar.

#### ESTILO FOGO: BOMBAS DE CHAMA DO DRAGÃO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você molda chakra no estômago, superaquece-o e o expele a velocidades aterradoras, sem controle total da trajetória. Um fluxo de fogo superaquecido avança em linha reta à sua frente. Criaturas no caminho devem realizar um teste de resistência de Destreza: Falha: 4d10 de dano de Fogo Sucesso: metade do dano Objetos inflamáveis a até 2 metros da linha de fogo pegam fogo se não estiverem sendo usados ou carregados. A trilha de fogo permanece no solo por 1 minuto (10 turnos). Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d10.

#### ESTILO FOGO: CLONE EXPLOSIVO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você conjura um clone feito de fogo com aparência idêntica à sua. Embora sólido, ele é menos ágil por ser composto de energia elemental, com isso tem desvantagem em testes de Destreza. O clone surge em um espaço a até 9 metros de você. O clone: Não pode realizar ações de ataque nem conjurar jutsus. Possui 10 de CA e 1 PV. Quando o clone sofre dano ou quando você encerra o jutsu, ele explode violentamente. Criaturas em um raio de 5 metros devem realizar um teste de resistência de Destreza: Falha: 5d6 de dano de Fogo e são arremessadas 3 metros Sucesso: metade do dano Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d6.

#### ESTILO FOGO: PROJÉTIL DO DRAGÃO DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você cospe 5 esferas de fogo contra uma criatura dentro do alcance. Faça um ataque de Ninjutsu à distância. Acerto: 5d6 de dano de Fogo Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +2d6.

#### ESTILO FOGO: ARMADURA DE CHAMA

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você cria uma camada de chakra superaquecido sobre a pele, parecendo estar em chamas. Você recebe +2 na CA. Sempre que um ataque corpo a corpo o atinge, o atacante sofre 4d6 de dano de Fogo. Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano refletido em +2d6.

#### ESTILO FOGO: SELOS FLAMEJANTES

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** 1 hora
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Fuinjutsu

Descrição: Você aplica um selo flamejante em uma criatura voluntária tocada, criando uma conexão de chakra entre vocês. Enquanto o alvo estiver a até 18 metros de você, ele recebe: 1.  \+2 na CA e em testes de resistência 2.  Imunidade a dano de Fogo 3.  Você sempre sabe quais condições o afetam 4.  Além disso, sempre que o alvo sofre dano de um ataque corpo a corpo, o atacante sofre 3 de dano de Fogo. Em Ranks Superiores: Aumente o custo em 3 Chakra e os bônus de CA e danos em +1.

#### ESTILO FOGO: ARMADILHA FLAMEJANTE

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 hora | **Alcance:** Toque | **Duração:** Até ser ativada ou dissipada
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Fuinjutsu

Descrição: Você inscreve um selo de chakra explosivo em uma superfície ou objeto fechado e define um gatilho para ser ativado (se estiver em seu campo de visão você pode ativar em seu turno). Superfície: cobre até 3 metros de diâmetro Objeto: se movido mais de 3 metros, o selo se desfaz O selo é quase invisível e requer um teste de Inteligência para ser detectado. Quando ativado, o selo explode em uma esfera de 9 metros de raio, destruindo a superfície. Criaturas na área devem realizar um teste de resistência de Destreza: Falha: 10d6 de dano de Fogo Sucesso: metade do dano Após a explosão, o jutsu termina.

#### ESTILO FOGO: GRANDE BOLA DE FOGO (GOUKAKYUU)

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros (esfera de 18 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você cospe fogo que se expande em uma enorme explosão flamejante, incinerando tudo na área. Criaturas devem realizar um teste de resistência de Destreza ou sofrer 3d12 de dano de Fogo. Objetos inflamáveis não carregados pegam fogo. Em Ranks Superiores: Aumente o custo em 3 Chakra e o dano em +1d12.

#### ESTILO FOGO: CORPO AQUECIDO

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você aquece seu corpo com chakra de fogo, passando a irradiar calor. Durante a duração: - Você é imune a condições ambientais de frio - Criaturas a até 3 metros de você têm vantagem em testes de Sabedoria ou Constituição (situações de sobrevivência) em ambientes frios - Gelo e chuva evaporam ao entrar em contato com você, criando vapor quente.

#### ESTILO FOGO: VISÃO AQUECIDA

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você aprimora sua visão para enxergar calor, como uma serpente com visão infravermelha. Criaturas e objetos que emitem calor são delineados em cores variadas, com tons mais brilhantes indicando maior temperatura.

#### ESTILO FOGO: PRISÃO CELESTIAL

**Classificação:** Ninjutsu | **Rank:** Rank C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você aplica um selo de chakra de fogo em uma criatura com um ataque de Ninjutsu. Em um acerto, o alvo fica marcado. Enquanto estiver marcado: A criatura não pode moldar chakra Sempre que usar Ninjutsu, Taijutsu ou Genjutsu que exija moldagem de chakra, deve realizar um teste de resistência de Constituição Falha: seu próprio chakra inflama e ela recebe 4d8 de dano de Fogo Sucesso: metade do dano Como ação, a criatura pode realizar um teste de Inteligência para quebrar o selo e encerrar o jutsu.

### RANK-B

#### ESTILO FOGO: MURO DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 35 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você cria um muro de fogo permanente, com 30 cm de espessura, até 20 metros de comprimento e 5 metros de altura. Quando o muro surge, cada criatura em sua área deve realizar um teste de resistência de Destreza. Em uma falha, a criatura sofre 5d8 de dano de fogo, ou metade do dano em um sucesso. Um dos lados do muro, escolhido por você ao conjurar o jutsu, causa 5d8 de dano de fogo a qualquer criatura que termine o turno a até 3 metros desse lado ou dentro do muro. A criatura também sofre esse dano ao entrar no muro pela primeira vez em um turno ou ao terminar seu turno nele. O outro lado do muro não causa dano.

#### ESTILO FOGO: GRANDE JAULA DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Turno Completo | **Alcance:** 35 metros (cubo de 10 metros) | **Duração:** Concentração, até 2 minutos
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você passa todo o turno focando e realizando selos de mão para alcançar um estado de concentração absoluta. Quando o jutsu é conjurado, você não precisa manter a técnica gastando chakra, pois o selo de chakra sustenta o efeito por 2 minutos ou até que você o dissipe. Você cria uma enorme jaula de fogo que aprisiona todos dentro da área do jutsu. Criaturas que tentarem sair da área devem realizar testes de resistência de Destreza, Constituição e Força. Falha em Destreza: sofre 4d10 de dano de fogo. Falha em Constituição: ganha 2 níveis de exaustão. Falha em Força: é arremessada 10 metros para trás. A criatura deve obter sucesso em pelo menos 2 dos 3 testes para escapar. Falhar em mais de um teste a empurra de volta para dentro da jaula.

#### ESTILO FOGO: GRANDE BOMBA DE CHAMA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 35 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Você molda chakra em seu estômago e o superaquece até expeli-lo em velocidades e força absurdas. Criaturas a até 2 metros de você devem realizar um teste de resistência de Força, sendo empurradas 3 metros em uma falha. Você dispara um fluxo de fogo azul extremamente quente em linha reta à sua frente, incendiando objetos e o ambiente a até 2 metros de você. Criaturas no caminho do fogo devem realizar um teste de resistência de Destreza, sofrendo 8d6 de dano de fogo em uma falha, ou metade do dano em um sucesso. Objetos a até 3 metros do fluxo pegam fogo se não estiverem sendo usados ou carregados. O fluxo deixa uma linha de fogo azul desde você até o final do alcance de 35 metros. O fogo permanece por 1 minuto (10 turnos) e se espalha até ser apagado. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 e o dano em 2d6.

#### ESTILO FOGO: SOL AQUECIDO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Minuto | **Alcance:** 35 metros (esfera de 30 metros) | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você cria um globo de fogo branco incandescente a até 15 metros de altura acima de um ponto que possa ver dentro do alcance. Criaturas a até 5 metros do globo devem realizar um teste de resistência de Constituição, recebendo a condição Queimado em uma falha. Objetos inflamáveis pegam fogo, e metais começam a aquecer, fazendo com que criaturas vestindo metal dentro da área sofram 8d4 de dano de fogo no início de cada turno enquanto estiverem em contato com ele. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 e o dano em 2d4.

#### ESTILO FOGO: CHAMA CELESTIAL

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você comprime todo o seu chakra de Liberação de Fogo na superfície da pele e o libera ao atingir uma criatura com um ataque desarmado, criando uma explosão concentrada de chamas brancas incandescentes. Como parte da ação para conjurar este ninjutsu, você deve realizar um ataque corpo a corpo desarmado contra uma criatura dentro do alcance do jutsu; caso contrário, o jutsu falha. Em um acerto, o alvo sofre 4d12 de dano de fogo além do dano do golpe corpo a corpo. A criatura deve ser bem-sucedida em um teste de resistência de Constituição ou recebe a condição Queimando. Ela também deve ser bem-sucedida em um teste de resistência de Destreza ou é arremessada para trás e cai. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 e o dano em 1d12.

#### ESTILO FOGO: INVESTIDURA DAS CHAMAS

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 35 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu, Disputa

Descrição: Chamas percorrem seu corpo, emitindo luz intensa em um raio de 10 metros e luz fraca por mais 10 metros durante a duração do jutsu. As chamas não causam dano a você nem a criaturas aliadas. Enquanto o jutsu durar, você recebe os seguintes benefícios: - Você é imune a dano de fogo. - Qualquer criatura hostil que se aproxime a até 2 metros de você pela primeira vez em um turno, ou termine o turno nessa distância, sofre 1d10 de dano de fogo. - Você pode usar sua ação para criar uma linha de fogo de 5 metros de comprimento e 1 metro de largura, partindo de você na direção escolhida. Cada criatura na linha deve realizar um teste de resistência de Destreza, sofrendo 4d8 de dano de fogo e recebendo a condição Queimando em uma falha, ou metade do dano em um sucesso.

#### ESTILO FOGO: RAIO SOLAR

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (linha de 20 metros) | **Duração:** Concentração, até 2 minutos
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você cria um feixe de luz branca incandescente que dispara de você em uma linha de 2 metros de largura e 20 metros de comprimento. Cada criatura na linha deve realizar um teste de resistência de Constituição. Em uma falha, a criatura sofre 6d8 de dano de fogo e fica cega até o início do seu próximo turno. Em um sucesso, sofre metade do dano e não fica cega. Você pode criar um novo feixe de luz como sua ação em qualquer turno enquanto o jutsu durar. Durante a duração, você emite luz intensa em um raio de 10 metros e luz fraca por mais 10 metros. Essa luz é equivalente à luz do sol. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em 3 e o dano em 1d8.

### RANK-A

#### ESTILO FOGO: MÍSSIL DE FOGO ATRASADO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 28 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Um feixe de luz amarela dispara de suas mãos e então se condensa, permanecendo em sua mão como uma esfera brilhante durante a duração do jutsu. Quando este jutsu termina, seja porque sua concentração foi quebrada ou porque você decidiu encerrá-lo, a esfera explode com um rugido baixo em uma explosão de chamas que se espalha ao redor de cantos. Cada criatura em uma esfera de 7 metros de raio, centrada nesse ponto, deve realizar um teste de resistência de Destreza. Em uma falha, a criatura sofre dano de fogo igual ao dano total acumulado; em um sucesso, sofre metade desse dano. O dano base do jutsu é 12d6. Se, ao final do seu turno, a esfera ainda não tiver detonado, o dano aumenta em 1d6. Como uma ação, você pode realizar um ataque de Ninjutsu à distância arremessando a esfera contra uma criatura ou objeto, fazendo-a detonar em caso de acerto. Em caso de erro, a criatura-alvo recebe vantagem no teste de resistência de Destreza. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em 3 e o dano base em 2d6.

#### ESTILO FOGO: DEVASTAÇÃO DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros (esfera de 28 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você expele uma corrente de fogo na área-alvo, que então se expande em uma bola de fogo massiva, incinerando tudo dentro do seu raio. Criaturas dentro do alcance devem ser bem-sucedidas em um teste de resistência de Destreza ou sofrer 10d8 de dano de fogo. Objetos inflamáveis e criaturas atingidas pela explosão são reduzidos a cinzas caso seus pontos de vida cheguem a 0. A área afetada permanece em chamas após a conclusão do jutsu. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em 3 e o dano em 2d8.

#### ESTILO FOGO: TEMPESTADE DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Uma tempestade composta por lâminas de chamas surge em um local que você escolher dentro do alcance. A área da tempestade consiste em até dez cubos de 4 metros, que você pode organizar como desejar. Cada cubo deve ter ao menos uma face adjacente à face de outro cubo. Cada criatura na área deve realizar um teste de resistência de Destreza. Em uma falha, sofre 7d10 de dano de fogo; em um sucesso, sofre metade do dano. O fogo danifica objetos na área e incendeia objetos inflamáveis que não estejam sendo usados ou carregados.

#### ESTILO FOGO: GRANDE ABSORÇÃO DE FOGO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você cria um vácuo de chakra que absorve o fogo persistente da área ao redor, puxando-o para si, convertendo-o em chakra e usando essa energia para curar ferimentos. Todo fogo ativo ou objetos em chamas são extintos e absorvidos por você. Você recupera 5 pontos de vida para cada fonte de fogo absorvida dessa forma. Nenhum fogo pode ser gerado ou mantido dentro da área deste jutsu até o início do seu próximo turno.

#### ESTILO FOGO: IGNIÇÃO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você libera seu chakra em uma área com 19 metros de raio, centrada em você. Todos os objetos inflamáveis, tecidos, metais ou quaisquer materiais que possam aquecer ou entrar em combustão, são instantaneamente incendiados. Metais brilham em vermelho incandescente, roupas entram em chamas e objetos inflamáveis começam a queimar. Criaturas devem realizar um teste de resistência de Destreza ou sofrer 2d6 de dano de fogo para cada tipo de objeto inflamável que estejam segurando, vestindo ou carregando no momento da ignição. Em um sucesso, sofrem metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em 3 e o dano em 2d6.

#### ESTILO FOGO: EXPLOSÃO SOLAR

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 46 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Uma luz solar brilhante explode em uma área de 19 metros de raio, centrada em um ponto que você possa ver dentro do alcance. Cada criatura na área iluminada deve realizar um teste de resistência de Constituição. Em uma falha, a criatura sofre 12d6 de dano de fogo e fica cega por 1 minuto (10 turnos). Em um sucesso, sofre metade do dano e não fica cega por este jutsu. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em 3 e o dano em 2d6.

### RANK-S

#### ESTILO FOGO: CORPO ÍGNEO

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você transforma temporariamente seu corpo em chamas vivas. Você e seus equipamentos tornam-se imunes a dano de fogo. Sempre que você sofrer dano de fogo ou ser afetado por um efeito causado por fogo, ao invés do dano, você recupera pontos de vida iguais à metade do dano que seria causado. Você ganha imunidade a cegueira, surdez, veneno e a dano cortante, perfurante e contundente. Você ganha vulnerabilidade a dano de frio proveniente de jutsus de Água ou Liberação de Água. Seus ataques desarmados corpo a corpo causam 4d8 de dano de fogo. Seu corpo queima com tamanho brilho que criaturas que não desviem o olhar ou fechem os olhos ficam cegas até o final do turno delas. Jutsus que você conjura com a palavra-chave Liberação de Fogo têm bônus de +2 para um acerto. Se você entrar na água, fica envolto por um raio de 2 metros de vapor e bolhas, concedendo camuflagem parcial, porém você sofre 2d6 de dano de frio a cada rodada que permanecer na água.

#### ESTILO FOGO: ESTALO DE CALOR

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 35 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você estala os dedos, incendiando o ar ao redor de uma criatura, incinerando-a instantaneamente. Se a criatura escolhida como alvo deste jutsu possuir 100 pontos de vida ou menos, ela morre, sendo reduzida a cinzas. Caso contrário, ela deve ser bem-sucedida em um teste de resistência de Destreza, sofrendo 8d8 + 30 de dano de fogo em uma falha, ou metade desse dano em um sucesso.

#### ESTILO FOGO: FOGO INCINERANTE DO DRAGÃO

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 28 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Você inspira profundamente, expandindo o peito, e então expele uma chama branco-incandescente que transforma quase tudo em seu caminho em cinzas. Criaturas dentro do cone devem realizar um teste de resistência de Destreza, sofrendo 30d4 de dano de fogo em uma falha, ou metade do dano em um sucesso.

#### ESTILO FOGO: CHUVA DO INFERNO

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 1,5 km | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Fogo, Ninjutsu

Descrição: Orbes flamejantes despencam do céu em quatro pontos diferentes que você possa ver dentro do alcance. Cada criatura em uma esfera de 13 metros de raio, centrada em cada ponto escolhido, deve realizar um teste de resistência de Destreza. A esfera se espalha ao redor de cantos. Uma criatura sofre 25d6 de dano de fogo em uma falha, ou metade desse dano em um sucesso.

## Ninjutsu Elemental: ESTILO ÁGUA (Suiton)

### RANK-D

#### ESTILO ÁGUA: ÁGUAS CURATIVAS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Médico, Ninjutsu

Descrição: Você reúne uma massa de água e infunde chakra nela, começando a curar uma criatura que você possa tocar. A água se dissolve durante o processo de cura da criatura. Role 2d8, curando a criatura alvo pelo total obtido. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada rank acima de Rank-D em que este jutsu for conjurado, aumente o custo em 3 e a cura em 1d8.

#### ESTILO ÁGUA: NÉVOA OCULTA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Nuvem de 19 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você conjura uma nuvem de partículas de água que se condensam em uma grande névoa. Criaturas dentro da névoa não podem enxergar além de 2 metros, sofrendo desvantagem em testes de Percepção e jogadas de ataque feitas enquanto estiverem dentro dela. Criaturas fora da névoa também sofrem desvantagem ao atacar criaturas dentro da névoa. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2.

#### ESTILO ÁGUA: ESFERA DE ÁGUA SENSORIAL

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Minuto | **Alcance:** 2 metros | **Duração:** Concentração, até 1 dia
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você reúne água da área ao redor formando uma esfera de 2 metros de diâmetro. Durante a duração do jutsu, você consegue perceber movimento e atividade em um raio de 77 metros a partir da esfera. Isso exige que a criatura em movimento perturbe alguma fonte de água (poças, corpos d’água ou chuva). Esse movimento cria bolhas dentro da esfera indicando a direção relativa da movimentação. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2.

#### ESTILO ÁGUA: CUSPE AMILÁCEO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você mistura chakra com sua saliva, criando uma substância viscosa semelhante a xarope. Você a cospe em uma criatura, reduzindo seus movimentos devido à natureza pegajosa do líquido. Faça um ataque de Ninjutsu à distância contra uma criatura que você possa ver dentro do alcance. Em caso de acerto, a criatura alvo recebe a condição Lento até o final do próximo turno dela.

#### ESTILO ÁGUA: MASSA DE ÁGUA VISCOSA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** 1 rodada
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você extrai água próxima a uma criatura visível dentro do alcance, criando um escudo médio de água para protegê-la. O alvo aumenta sua CA em +3 até o início do seu próximo turno. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o bônus de CA em +1.

#### ESTILO ÁGUA: CAMUFLAGEM AQUÁTICA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Uma criatura que você tocar torna-se invisível até o jutsu terminar. A água dobra a luz ao redor do alvo, ocultando sua presença. Tudo o que o alvo estiver vestindo ou carregando também se torna invisível. O jutsu termina se o alvo atacar ou conjurar um jutsu. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e você pode escolher uma criatura adicional.

#### ESTILO ÁGUA: FORMAÇÃO DE ÁGUA: POÇA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você gera uma grande poça de água a partir do seu estômago e a expele no chão à sua frente. A poça contém até 10 galões de água. Ela pode ser usada como fonte de água potável, para armadilhas ou como base para jutsus de Liberação de Água mais complexos. A água produzida pode ser usada como fonte para até 2 jutsus de Liberação de Água de Rank-C ou inferior.

#### ESTILO ÁGUA: PALMA DE LÂMINA DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você gera duas lâminas de água reforçadas com chakra sobre as mãos. Como parte da ação usada para conjurar este jutsu, você deve realizar 2 ataques desarmados contra criaturas dentro do alcance do jutsu, caso contrário o jutsu falha. Em um acerto, o alvo sofre 2d6 de dano de frio. Se você acertar a mesma criatura com ambos os ataques, ela fica envolta em água vibrante até o início do seu próximo turno. Se o alvo se mover antes disso, ele sofre imediatamente 1d6 de dano de frio adicional e o jutsu termina. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d6.

#### ESTILO ÁGUA: INVESTIDA DO PILAR DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria uma explosão de água que irrompe para cima a partir do solo sob uma criatura que você possa ver dentro do alcance. Este jutsu ignora cobertura. O alvo deve ser bem-sucedido em um teste de resistência de Destreza, sofrendo 3d8 de dano de frio e ficando caído em uma falha, ou metade do dano em um sucesso e não fica caído. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d8.

#### ESTILO ÁGUA: PURIFICAÇÃO / PUTREFAÇÃO DA ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você manipula e molda o chakra para reverberar através de uma fonte líquida, seja lama, água envenenada ou qualquer coisa intermediária. Até 10 galões de fluido por onde seu chakra flua tornam-se água potável pura, livre de todas as impurezas, ou tornam-se pútridos e impróprios para consumo, à sua escolha. Se o fluido for artificial ou especial de alguma forma, faça um teste de Inteligência para determinar se a purificação ou putrefação é possível.

#### ESTILO ÁGUA: ESCUDO DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Reação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você cria uma parede flutuante de água em espiral, capaz de repelir criaturas e bloquear ataques. Aumente sua CA em +3 contra ataques à distância até o início do seu próximo turno. Se houver uma fonte suficiente de água próxima, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o bônus de CA em +1.

#### ESTILO ÁGUA: SHURIKEN DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você gera múltiplas shuriken feitas de água. Faça um ataque de Ninjutsu à distância contra uma criatura que você possa ver dentro do alcance, causando 3d4 de dano cortante e 3d4 de dano de frio. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 e o dano em 1d4 para cada tipo de dano.

#### ESTILO ÁGUA: ONDA DE BOLHAS SELVAGENS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 5 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria uma massa viscosa de bolhas e a projeta em um cone de 5 metros à sua frente, tornando o chão escorregadio. Cada criatura na área deve realizar um teste de resistência de Destreza, ficando caída em uma falha. Criaturas que entrem ou terminem o turno na área também devem realizar o teste ou cair.

#### ESTILO ÁGUA: ONDA DE ÁGUA SELVAGEM

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você gera uma forte corrente de água e a expele como um jato. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 2d6 de dano de frio e é empurrado 4 metros para trás. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3, o dano em 1d6 e a distância empurrada em 2 metros.

### RANK-C

#### ESTILO ÁGUA: BOLHA DE AFOGAMENTO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você conjura uma bolha cheia de água e a envia em direção à cabeça de uma criatura, aprisionando-a e removendo sua capacidade de respirar, a menos que consiga respirar debaixo d’água. Uma criatura visível dentro do alcance deve ser bem-sucedida em um teste de resistência de Destreza ou ter a cabeça capturada pela bolha. Em uma falha, a criatura começa a se sufocar: seu deslocamento é reduzido pela metade e ela pode sobreviver por um número de rodadas igual ao seu modificador de Constituição (mínimo de 1). No início do primeiro turno após esse tempo, a criatura cai a 0 pontos de vida e começa a morrer; o jutsu então termina. Durante esse período, a criatura não pode falar. Como ação em seus turnos, ela pode realizar um teste de resistência de Constituição para escapar da bolha, encerrando o jutsu. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2.

#### ESTILO ÁGUA: ESCONDER-SE NA NÉVOA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 5 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você começa a transformar seu corpo em uma coleção de vapor de água com consistência semelhante à névoa, juntamente com tudo o que estiver vestindo ou carregando, pela duração do jutsu. Este jutsu termina se você cair a 0 pontos de vida ou de chakra. Enquanto estiver nessa forma, seu único método de movimento é um deslocamento de voo de 7 metros. Você pode entrar e ocupar o espaço de outras criaturas. Você possui resistência a todo dano que não seja de Chakra e tem vantagem em testes de resistência de Força, Destreza e Constituição. Você pode atravessar pequenos buracos, aberturas estreitas e até simples rachaduras, tratando líquidos como se fossem superfícies sólidas. Você não pode cair e permanece flutuando no ar, mesmo se estiver atordoado ou incapacitado. Ao realizar testes de Furtividade para se passar por uma nuvem comum de gás, névoa ou neblina, você rola com vantagem. Enquanto estiver nessa forma, você não pode falar nem manipular objetos, e qualquer item que esteja carregando não pode ser solto, usado ou manipulado de qualquer forma. Você não pode atacar nem conjurar jutsus enquanto estiver nesta forma.

#### ESTILO ÁGUA: ÁGUA-VIVA MÉDICA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Médico

Descrição: Você conjura água no formato de uma água-viva e a fixa a uma criatura que você tocar. Pela duração do jutsu, a água-viva injeta continuamente chakra no corpo do alvo para curá-lo sempre que ele sofrer dano. No início de cada turno do alvo, ele recupera 4 pontos de vida. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e a cura em +1.

#### ESTILO ÁGUA: ESCORPIÃO MÉDICO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Médico

Descrição: Você reúne a água ao redor para criar garras semelhantes às de insetos em cada uma de suas mãos, estendendo seu alcance de ataque com os mesmos princípios do bisturi de chakra. Durante a duração deste jutsu, você pode usar sua ação para realizar dois ataques de Ninjutsu com essas garras de água, podendo atingir criaturas a até 4 metros de distância. Em um acerto, o alvo sofre 2d6 de dano de frio. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em 3 e o dano em 1d6.

#### ESTILO ÁGUA: CLONE DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você conjura um clone feito de água, semelhante à técnica do Clone das Sombras, porém com risco muito menor ao espaço ao seu redor. O clone surge em um espaço desocupado a até 2 metros de você. Você pode criar até dois clones, cada um custando 8 Chakra adicionais. Você pode comandar um clone como uma ação bônus. O clone pode realizar apenas uma ação padrão e uma ação de movimento por turno. Os clones possuem 5 pontos de vida, nenhum chakra e uma CA igual à seu atributo de Inteligência. Cada clone pode conjurar no máximo 2 jutsus de Rank-C ou inferior com a palavra-chave Liberação de Água antes do término deste jutsu. Eles só podem manter concentração em um único jutsu e apenas por um número de rodadas igual ao seu modificador de Inteligência. Os clones não podem usar características de Clã ou Classe que você possua. Eles podem se mover sobre a água sem gastar chakra, mas não podem se mover verticalmente por superfícies. Eles não recebem bônus externos de ataque ou CA. Se forçar um teste de resistência, os pontos de resistência dele são iguais aos seus. Em ataques corpo a corpo, independentemente da arma usada, o clone causa 1d8 de dano de frio.

#### ESTILO ÁGUA: PAREDE DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você conjura uma parede de água no solo em um ponto que possa ver dentro do alcance. A parede pode ter até 10 metros de comprimento, 4 metros de altura e 1 metro de espessura. Quando o jutsu termina, a parede se deforma e retorna a uma massa de água. O espaço da parede é considerado terreno difícil para criaturas que tentarem atravessá-la. Qualquer ataque à distância que atravesse a parede é realizado com desvantagem. Danos de fogo que atravessem a parede têm seu dano reduzido pela metade. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2.

#### ESTILO ÁGUA: RESPIRAÇÃO NA ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você filtra a água à medida que ela entra em seus pulmões, permitindo que você respire como se fosse um peixe. Você pode respirar debaixo d’água como se estivesse respirando ar.

#### ESTILO ÁGUA: PROJÉTIL DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você concentra chakra em seu estômago e o expele em uma grande quantidade de água contra uma criatura alvo. Faça um ataque de Ninjutsu à distância. Em um acerto, a criatura alvo sofre 4d6 de dano de frio e é empurrada 8 metros para trás. Em Ranks Superiores: Para cada Rank acima de Rank-C em que este jutsu for conjurado, aumente o custo em 3 Chakra, o dano em 2d6 e a distância do empurrão em 2 metros.

#### ESTILO ÁGUA: ESPADA DE CORTE DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você conjura água na forma de uma construção semelhante a uma espada em sua mão livre. A lâmina possui 2 metros de comprimento e o cabo 1 metro, e o design da lâmina pode ser o que você desejar. Se você soltar a espada, ela se dispersa novamente em água. Você pode usar sua ação para realizar um ataque corpo a corpo de Ninjutsu com a Espada de Água. Em um acerto, o alvo sofre 4d8 de dano de frio. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada Rank acima de Rank-C em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d8.

#### ESTILO ÁGUA: FORMAÇÃO DE ÁGUA – LAGO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 4 metros | **Duração:** Instantânea
**Componentes:** — | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você gera uma grande poça de água a partir de seu estômago e a expele no chão à sua frente. Essa poça comporta até 100 galões de água. Você pode usar essa poça como fonte de água potável, para preparar armadilhas ou como fonte para Ninjutsus de Água mais complexos. A água produzida por este jutsu pode ser usada como fonte de água para até 5 Ninjutsus de Liberação de Água de Rank-B ou inferior.

#### ESTILO ÁGUA: PRISÃO DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria uma bolha densa de água ao redor de uma criatura, capturando-a em seu interior, restringindo seus movimentos e impedindo a execução de Jutsus. A criatura alvo realiza um teste de resistência de Destreza. Em uma falha, ela fica Contida, capturada em posição fetal. O usuário deve manter contato com a esfera; perder o contato encerra o jutsu imediatamente. Criaturas presas na esfera não podem realizar Selos de Mão e têm dificuldade para respirar. Ao final de cada um de seus turnos, a criatura pode realizar um teste de resistência de Força com Desvantagem; em caso de sucesso, ela rompe a prisão à força. A bolha não pode se mover nem ser reposicionada. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2.

#### ESTILO ÁGUA: TROMBETA DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você une as mãos e cria um jato de água altamente pressurizado, capaz de perfurar aço e até o solo. Faça um ataque de Ninjutsu à distância, causando 2d10 de dano perfurante e 2d10 de dano de frio. Em Ranks Superiores: Para cada Rank acima de Rank-C em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d10 para cada tipo de dano.

### RANK-B

#### ESTILO ÁGUA: ABSORÇÃO DA NÉVOA SANGRENTA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra, 5 Pontos de Vida
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (cubo de 28 metros) | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Uma variação avançada da Técnica da Névoa Oculta. Esta variação exige que o usuário retire sangue de si mesmo, cortando a palma da mão e reduzindo seus Pontos de Vida atuais em 5. Você libera uma névoa carmesim que preenche um cubo de 28 metros centrado em você. Todas as criaturas dentro dessa névoa ficam fortemente obscurecidas e não conseguem enxergar claramente além de 2 metros. Você conhece a localização de todas as criaturas dentro da névoa vermelha e todas as criaturas, exceto você, sofrem os seguintes efeitos: - Criaturas que iniciam o turno dentro da névoa vermelha e que não estejam com seus Pontos de Vida máximos perdem 4 Chakra. - Criaturas que sofram dano Necrótico, Cortante ou Perfurante recebem o dobro do dano normal. - Criaturas não podem recuperar Pontos de Vida enquanto estiverem dentro da névoa vermelha.

#### ESTILO ÁGUA: COLISÃO DA ONDA DE CHOQUE EXPLOSIVA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você expele uma quantidade colossal de água diretamente ao seu redor, criando uma esfera com 37 metros de raio centrada em você. Você permanece sobre a superfície da água criada. Criaturas que estejam a até 19 metros de você devem realizar um teste de resistência de Força. Falha: a criatura sofre 6d6 de dano de frio e é empurrada 10 metros para longe, ficando submersa sob a água criada. Sucesso: a criatura permanece flutuando sobre a superfície, não sofre dano, mas ainda é empurrada 5 metros para longe de sua posição atual. A água conjurada mantém uma profundidade de 37 metros. Essa água pode ser usada como fonte de água, permite afogamento, pode ser bebida como água potável e pode servir como suprimento para até 15 Ninjutsus de Liberação de Água de Rank-A ou inferior.

#### ESTILO ÁGUA: HIDRATAÇÃO (SUIKA NO JUTSU)

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você transforma seu corpo em uma mistura líquida de água e óleo, liquefazendo-se completamente e tornando-se uma poça consciente de fluido sob seu controle. Durante a duração deste jutsu, você pode transformar qualquer parte do seu corpo nessa mistura líquida, permitindo atravessar fendas e espaços grandes o suficiente para a passagem de água. Enquanto estiver sob este efeito: - Você ganha Imunidade a dano Cortante, Perfurante e Contundente. - Você ganha Vulnerabilidade a Ninjutsus com a palavra-chave Liberação de Relâmpago. Reação: ao ser atingido por um ataque, você pode se liquefazer, ganhando Resistência ao ataque que o acionou. Ação Bônus: você pode concentrar mais da sua forma líquida em seus músculos, aumentando sua força. Até o início do seu próximo turno, seu valor de Força se torna 18.

#### ESTILO ÁGUA: REDEMOINHO (MAELSTROM)

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Uma massa de água com 4 metros de profundidade é expelida por você ou começa a girar a partir de uma fonte de água pré-existente, centrada em um ponto que você possa ver dentro do alcance. A água gira em um raio de 10 metros. Até o jutsu terminar, a área é considerada terreno difícil. Qualquer criatura que inicie seu turno nessa área deve realizar um teste de resistência de Força. Em uma falha, sofre 5d8 de dano de frio e é puxada 4 metros em direção ao centro do redemoinho.

#### ESTILO ÁGUA: BOMBA DE TUBARÃO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 37 metros | **Duração:** Concentração, até 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Este jutsu não pode ser usado sem uma fonte de água próxima, profunda o suficiente para comportar uma criatura Média. Como ação bônus, você cria um tubarão feito de água solidificada. O Tubarão possui: CA igual à seu atributo de Inteligência 10d9 de Pontos de Vida Deslocamento de natação de 13 metros Você controla o tubarão e pode ordená-lo a realizar uma das seguintes ações: Ataque: como ação bônus, o tubarão tenta morder uma criatura submersa, próxima ou sobre a superfície da água que ele ocupa. Faça um teste de ataque de Ninjutsu. Em um acerto, o alvo sofre 7d6 de dano perfurante e deve passar em um teste de resistência de Força ou fica Agarrado pelo tubarão. Impedir: como reação, o tubarão pode impor Desvantagem no próximo ataque de uma criatura alvo ao se mover agressivamente em seu caminho. Explodir: como ação padrão, o tubarão explode, criando uma poderosa onda de choque em um cubo de 5 metros. Criaturas na área devem realizar um teste de resistência de Destreza, sofrendo 4d10 de dano de frio em caso de falha, ou metade do dano em caso de sucesso.

#### ESTILO ÁGUA: ARCO DO TSUNAMI

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria um arco longo modificado feito de água solidificada, juntamente com flechas da mesma fonte. Durante a duração, você pode usar sua ação para realizar até 2 ataques de Ninjutsu à distância com o Arco do Tsunami. Em um acerto, o ataque causa 4d12 de dano de frio. O alvo atingido deve realizar um teste de resistência de Constituição ou ficará Lento até o final do próximo turno, devido ao resfriamento extremo causado pela flecha explosiva. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Se você soltar a arma, ela se dissipa ao final do turno. Enquanto o jutsu durar, você pode usar uma ação bônus para fazer o arco reaparecer em sua mão.

#### ESTILO ÁGUA: PRESA DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, SM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria duas brocas espiraladas de água ao redor de uma criatura que possa ver dentro do alcance. A criatura alvo deve realizar um teste de resistência de Destreza, sofrendo 4d12 de dano de frio e ficando Caída em caso de falha. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada Rank acima de Rank-B em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d12.

#### ESTILO ÁGUA: AGULHAS DE ÁGUA DA MORTE

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Reação (ao ser alvo de um ataque corpo a corpo) | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Quando uma criatura realiza um ataque corpo a corpo contra você, você pisa com força no chão, coletando gotas de água do ambiente e afiando-as em forma de agulhas. A criatura que acionou o jutsu deve realizar um teste de resistência de Destreza. Em uma falha, sofre 4d10 de dano perfurante e 4d10 de dano de frio, além de ter seu deslocamento reduzido em 5 metros. Em um sucesso, sofre metade do dano e não tem o deslocamento reduzido. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada Rank acima de Rank-B em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d10 para cada tipo de dano.

### RANK-A

#### ESTILO ÁGUA: PERMEAÇÃO ÁCIDA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (raio de 5 metros) | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você coleta água do ar, das plantas e de todas as fontes que a contenham, formando bolhas que passam a orbitar você em um raio de 5 metros, com você no centro. Ao conjurar este jutsu, você pode designar qualquer número de criaturas que possa ver para não serem afetadas por ele. A velocidade das criaturas afetadas é reduzida à metade enquanto estiverem na área. Quando uma criatura entra na área pela primeira vez em um turno ou inicia seu turno nela, deve realizar um teste de resistência de Destreza, pois as bolhas explodem como minas, espalhando ácido congelante sobre o alvo. Em uma falha, a criatura sofre 8d8 de dano de frio. Em Ranks Superiores: Para cada Rank acima de Rank-A em que este jutsu for conjurado, aumente o custo em 3 Chakra e o dano em 1d8.

#### ESTILO ÁGUA: QUEDA DAS AGULHAS DE CHUVA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros (cubo de 28 metros) | **Duração:** Instantânea, 1 minuto (10 turnos)
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você coleta toda a água em um raio de 37 metros ao seu redor, fazendo-a subir aos céus e formar nuvens de tempestade que preenchem um cubo de 28 metros, centrado em um ponto que você possa ver dentro do alcance. Este jutsu falha se não houver espaço suficiente para a nuvem se formar (por exemplo, em ambientes fechados). Ao conjurar o jutsu, escolha um ponto visível dentro do alcance. Uma chuva de gotas de água afiadas despenca, pulverizando tudo em um raio de 2 metros ao redor do ponto escolhido. Cada criatura nessa área deve realizar um teste de resistência de Destreza. Falha: sofre 5d6 de dano de frio e 5d6 de dano perfurante. Sucesso: sofre metade do dano. Em cada um dos seus turnos, até o jutsu terminar, você pode usar sua ação e gastar 6 Chakra para invocar novamente as agulhas de chuva, escolhendo o mesmo ponto ou um ponto diferente. Se você estiver ao ar livre sob condições de tempestade ao conjurar este jutsu, você passa a controlar a tempestade existente em vez de criar uma nova. Nessas condições, o dano do jutsu aumenta em 1d6 para cada tipo de dano, e o custo de manutenção do jutsu é reduzido em 2 Chakra. Em Ranks Superiores: Para cada Rank acima de Rank-A, aumente o custo em 3 Chakra e o dano em 1d6 para cada tipo de dano.

#### ESTILO ÁGUA: CHUVA DA VONTADE DO TIGRE

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Hora | **Alcance:** 16 quilômetros | **Duração:** 24 Horas
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria nuvens de chuva centradas em um ponto de sua escolha, a 30 metros acima do solo, que se espalham cobrindo um raio de até 16 quilômetros. As nuvens passam a despejar uma chuva pesada e constante. Cada gota de chuva está conectada aos sentidos do conjurador, informando-o sobre quaisquer criaturas, movimentos, atividades e ações com as quais as gotas entrem em contato. Para a maioria das criaturas, essa chuva parece completamente natural. Criaturas com visão de chakra conseguem enxergar o chakra presente em cada gota d’água. Embora o conjurador tenha ciência dos eventos ocorrendo sob a chuva, ele não recebe a localização exata dentro da área total de efeito do jutsu.

#### ESTILO ÁGUA: DRAGÃO DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Você expele uma quantidade massiva de água ou a puxa de uma fonte próxima, conjurando um grande dragão de água com a forma que desejar. O dragão avança contra o alvo em um poderoso impacto. Faça um ataque de Ninjutsu à distância. Em um acerto, a criatura alvo sofre 7d6 de dano contundente e 7d6 de dano de frio. O alvo deve então realizar um teste de resistência de Constituição; em uma falha, fica Atordoado e Caído. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada Rank acima de Rank-A, aumente o custo em 3 Chakra e o dano em 1d6 para cada tipo de dano.

#### ESTILO ÁGUA: PAREDE DE FORMAÇÃO DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Reação (ao ser alvo de um ataque) | **Alcance:** Esfera de 2 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu, Disputa

Descrição: Quando você é alvo de um ataque, você expele uma enorme quantidade de água que passa a girar ao seu redor como um pião. A água giratória possui 20d6 Pontos de Vida até o início do seu próximo turno. Ataques direcionados a você param a 2 metros de distância. Criaturas que estejam dentro desse mesmo raio também são protegidas pela Parede de Formação de Água. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2.

#### ESTILO ÁGUA: ONDA DE ÁGUA DECAPITADORA

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 31 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você leva as mãos à boca e libera uma torrente de água extremamente pressurizada, utilizando seu chakra como um bocal direcionador. Você varre a cabeça de um lado para o outro, atingindo uma área em forma de cone com alcance de 31 metros. Criaturas atingidas devem realizar um teste de resistência de Destreza. Em uma falha, sofrem 4d10 de dano de frio e 4d10 de dano cortante. Se usado próximo a uma fonte suficiente de água, reduza o custo de chakra deste jutsu em 2. Em Ranks Superiores: Para cada Rank acima de Rank-A, aumente o custo em 3 Chakra e o dano em 1d10 para cada tipo de dano.

### RANK-S

#### ESTILO ÁGUA: TSUNAMI DO VÓRTICE GIGANTE

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você coleta água de todas as fontes de umidade em até 31 metros de distância, incluindo até mesmo o suor de outras criaturas. Toda essa água é reunida em um vórtice massivo com aproximadamente 6 metros de altura e 5 metros de largura. Você dispara este ciclone altamente destrutivo de água, que avança em linha reta por até 37 metros, coletando, levantando e arremessando tudo em seu caminho. Criaturas atingidas pela área do jutsu devem realizar dois testes de resistência: - Força: para resistir a serem erguidas e arrastadas pelo ciclone. - Destreza: para reduzir o dano sofrido. Em uma falha no teste de Destreza, a criatura sofre 10d10 de dano de frio. Em uma falha no teste de Força, a criatura é arrastada até o final do percurso do vórtice, ficando Caída e Atordoada.

#### ESTILO ÁGUA: DANÇA DA GRANDE PRISÃO DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 19 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você molda uma quantidade colossal de água em seu corpo e a libera, criando um volume equivalente a um pequeno oceano. Em seguida, controla essa água para formar uma gigantesca esfera aquática centrada em você, com raio de até 19 metros. Todas as criaturas dentro do raio são erguidas pela onda de água e puxadas para dentro da esfera. Criaturas dentro da Esfera de Água devem realizar um teste de resistência de Força. Em uma falha, ficam aprisionadas, incapazes de escapar. Criaturas capturadas dessa forma são consideradas submersas enquanto permanecerem dentro da Prisão de Água. Sempre que o usuário deste jutsu se mover, a esfera de água se move junto com ele. Criaturas que obtiverem sucesso no teste de Força conseguem escapar da prisão caso alcancem a borda da esfera.

#### ESTILO ÁGUA: CHUVA DE RANCOR

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (raio de 76 metros) | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você cria nuvens de chuva centradas em um ponto de sua escolha, a 30 metros acima do solo, que se espalham cobrindo uma área de até 16 quilômetros de raio. As nuvens passam a despejar uma chuva intensa e constante. Durante a duração do jutsu, todas as criaturas, exceto você, que utilizarem Ninjutsu ou Genjutsu aumentam o custo de chakra de suas técnicas em +5.

#### ESTILO ÁGUA: CONVERGÊNCIA DOS CÉUS DE ÁGUA

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 22 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 37 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação de Água, Ninjutsu

Descrição: Você passa a sentir a presença de todas as partículas de água em livre movimento dentro de um raio de 37 metros. Durante a duração, você pode controlar toda a água como se fosse uma extensão do seu próprio corpo. Todos os Ninjutsu com a palavra-chave Liberação de Água de Rank-A ou inferior têm seu custo de chakra reduzido à metade. Você ganha ações adicionais que podem ser usadas em seus turnos: - Perfuração de Água: Como uma ação, você pode realizar um ataque de Ninjutsu contra uma criatura que possa ver dentro do alcance, causando 10d12 de dano de frio, à medida que a água envolve e colapsa violentamente sobre o alvo. - Armadura de Água: Como reação ao ser atingido por um ataque, você reveste seu corpo com uma espessa camada de água solidificada, reduzindo o impacto. Você recebe 25 pontos de vida temporários até o início do seu próximo turno. - Correntes Aquáticas: Como uma ação, você pode fazer com que a água ao redor forme correntes que tentam capturar uma criatura dentro do alcance. O alvo deve realizar um teste de resistência de Destreza; em uma falha, fica Paralisado. Em seus turnos, a criatura pode usar uma ação para realizar um teste de resistência de Força, encerrando o efeito em caso de sucesso.

## Ninjutsu Elemental: ESTILO RELÂMPAGO (Raiton)

### RANK-D

#### ESTILO RELÂMPAGO: BANQUETE DE RELÂMPAGOS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você coloca a palma da mão no chão e conduz uma descarga elétrica que se propaga pelo solo em direção a uma criatura alvo dentro do alcance. Este jutsu ignora linha de visão e pode contornar cantos. A criatura alvo deve realizar um teste de resistência de Constituição. Em uma falha, sofre 3d6 de dano elétrico e fica Atordoada até o final do próximo turno. Em um sucesso, sofre apenas metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e o dano em +1d6.

#### ESTILO RELÂMPAGO: HABILIDADE APRIMORADA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você toca uma criatura voluntária imbuindo ela de um chakra elétrico que concede um aumento drástico em uma de suas capacidades físicas. Escolha um dos efeitos abaixo; o alvo recebe o benefício enquanto o jutsu durar: - Agilidade: O alvo tem vantagem em testes de Destreza. Além disso, não sofre dano por quedas de até 6 metros, desde que não esteja incapacitado. - Resistência: O alvo tem vantagem em testes de Constituição e recebe 10 pontos de vida temporários, perdidos ao final do jutsu. - Força: O alvo tem vantagem em testes de Força e aumenta em +3 o dano de ataques baseados em Força. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em 3 Chakra e você pode afetar uma criatura adicional.

#### ESTILO RELÂMPAGO: FLECHA GUIA

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Um clarão de relâmpago irrompe de suas mãos em direção a uma criatura à sua escolha dentro do alcance. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 3d8 de dano elétrico, e a próxima jogada de ataque contra ele antes do final do seu próximo turno tem vantagem, guiada pelo rastro elétrico. Em Ranks Superiores: \+3 Chakra e +1d8 de dano por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: SOCO ELÉTRICO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 1,5 metro | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você envolve seu punho com eletricidade pulsante. Como parte deste jutsu, você realiza um ataque corpo a corpo desarmado contra uma criatura no alcance. Em um acerto, o ataque causa +2d8 de dano elétrico além do dano normal e o alvo não pode realizar reações até o início do próximo turno dele. Em Ranks Superiores: \+3 Chakra e +1d8 de dano por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: REPELIR

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Reação, ao ser alvo de um ataque | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você cria um campo magnético ao seu redor, desviando ataques. Ataques não baseados em chakra têm desvantagem contra você até o início do seu próximo turno.

#### ESTILO RELÂMPAGO: VELOCIDADE DO RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você reveste seu corpo com eletricidade e se teleporta até sua velocidade de movimento para um espaço desocupado que possa ver, parecendo um clarão de relâmpago ao reaparecer.

#### ESTILO RELÂMPAGO: ESFERA RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você cria várias pequenas esferas flutuantes de chakra elétrico e as dispara rapidamente contra um único alvo. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 6d4 de dano elétrico. Em Ranks Superiores: \+3 Chakra e +2d4 de dano por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: REFLEXOS ELÉTRICOS

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Reação, ao realizar um teste de Destreza | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Seu corpo é energizado por chakra elétrico, elevando seus reflexos ao extremo. Ao realizar um teste de resistência de Destreza, você pode rolar com vantagem.

#### ESTILO RELÂMPAGO: RAIO FRAGMENTADOR

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Um feixe contínuo de relâmpago azul crepitante conecta você a uma criatura no alcance. Faça um ataque de Ninjutsu à distância. Em um acerto, o alvo sofre 2d12 de dano elétrico. Em cada um dos seus turnos enquanto o jutsu durar, você pode usar sua ação para causar automaticamente 2d12 de dano elétrico ao alvo. O jutsu termina se você usar sua ação para outra coisa, se o alvo sair do alcance ou obtiver cobertura total. Em Ranks Superiores: \+3 Chakra e +1d12 de dano por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: CHICOTE DE CHOQUE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você cria um chicote de eletricidade e o lança contra uma criatura no alcance. O alvo deve realizar um teste de Constituição. Em uma falha, sofre 3d10 de dano elétrico e é derrubado, considerado caído. Em um sucesso, sofre metade do dano e não é derrubado. Em Ranks Superiores: \+3 Chakra, +1d10 de dano e +1,5 metro de alcance por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: SENTIDO ESTÁTICO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você passa a enxergar sinais elétricos em criaturas ou objetos a até 91 metros de distância, atravessando até 2 metros de superfícies não metálicas. Você consegue identificar dispositivos tecnológicos em funcionamento, movimentação elétrica e criaturas capazes de gerar eletricidade naturalmente ou via chakra.

#### ESTILO RELÂMPAGO: SELO DO RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 27 metros | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você marca uma criatura com uma centelha de chakra elétrico formando um selo carregada negativamente no alvo. Enquanto o jutsu durar, você causa +1 dado de dano adicional sempre que acertar o alvo com Ninjutsu de Liberação do Raio. Além disso, você tem vantagem em testes de Sabedoria para rastrear o alvo. Em Ranks Superiores: \+3 Chakra e +1 hora de concentração por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: TEMPESTADE TROVEJANTE

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 8 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Uma onda de força elétrica se espalha a partir de você. Criaturas no cone devem realizar um teste de Constituição. Falha: 4d4 de dano elétrico e empurradas 3 metros. Sucesso: metade do dano e não são empurradas. Em Ranks Superiores: \+3 Chakra, +2d4 de dano e +2 metros de empurrão por rank acima de Rank-D.

#### ESTILO RELÂMPAGO: RAIO DO TROVÃO

**Classificação:** Ninjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você gera duas esferas de eletricidade em suas mãos e as descarrega em uma explosão elétrica ao seu redor. Todas as criaturas na área devem realizar um teste de Destreza. Falha: 2d10 de dano elétrico. Sucesso: metade do dano. Em Ranks Superiores: \+3 Chakra e +1d10 de dano por rank acima de Rank-D.

### RANK-C

#### ESTILO RELÂMPAGO: ABSORVER RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Reação, ao ser atingido por dano elétrico | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você gera dentro de si uma carga de chakra de Liberação do Raio semelhante à energia recebida, tornando-se imune a dano elétrico até o início do seu próximo turno. O dano elétrico que seria causado, em vez disso, restaura seu chakra atual em um valor igual à metade do dano que seria sofrido.

#### ESTILO RELÂMPAGO: CHIDORI (MIL PÁSSAROS)

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Você concentra uma massa violenta de chakra do Raio na palma da mão, gerando uma esfera luminosa de energia elétrica que emite um som agudo semelhante ao canto de mil pássaros. Sua mão carregada fica canalizando o jutsu e não pode segurar objetos, mas pode realizar Selos de Mão ou meios-selos para outras técnicas. No início do seu próximo turno, você deve realizar um ataque corpo a corpo de Ninjutsu contra uma criatura. Em um acerto, você descarrega toda a energia acumulada, causando 5d10 de dano elétrico. Após o ataque (acertando ou errando), o jutsu termina. Efeitos Especiais: - Foco Letal: Este jutsu possui um acerto crítico em um resultado de 19-20 no dado. - Túnel Perceptivo: A técnica exige um avanço em linha reta em velocidade máxima, sobrecarregando os sentidos comuns. Usuários que não possuem um dōjutsu ativo (como o Sharingan, Byakugan ou equivalente) ou uma técnica de percepção aprimorada sofrem desvantagem em testes no turno seguinte ao uso do Chidori. Em Ranks Superiores: Conjurado como Rank-B ou superior: O Tempo de Conjuração reduz para 1 Ação Bônus. Por cada rank acima de C: Aumente o custo em +3 Chakra, o dano em +2d10 e a margem de acerto crítico em +1 (ex.: em Rank-B, crítico em 18-20).

#### ESTILO RELÂMPAGO: CORRENTE DE RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (cubo de 9 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você golpeia o chão com a mão e libera eletricidade que se espalha até 9 metros em todas as direções. Criaturas na área que não estejam sob cobertura total devem realizar um teste de Constituição. Falha: 4d6 de dano elétrico e ficam eletrificados com a condição Choque. Sucesso: metade do dano. No início de cada turno, criaturas eletrificadas realizam um novo teste de Constituição para encerrar a condição. Em Ranks Superiores: \+3 Chakra e +1d6 de dano por rank acima de Rank-C.

#### ESTILO RELÂMPAGO: PRESA DE RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** Instantâneo | **Alcance:** 30 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você ergue as mãos ao céu, liberando uma massa de chakra elétrico que forma nuvens de tempestade. Como uma ação padrão em seu turno, você escolhe um espaço visível dentro do alcance. Um relâmpago atinge a área. Criaturas a até 2 metros do ponto devem realizar um teste de Destreza. Falha: 4d10 de dano elétrico. Sucesso: metade do dano. Em Ranks Superiores: +3 Chakra, +1d10 de dano e você pode selecionar um espaço adicional.

#### ESTILO RELÂMPAGO: FLASH ELÉTRICO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM, W | **Palavras-chave:** Liberação do Raio, Ninjutsu, Shurikenjutsu

Descrição: Você reveste armas arremessáveis com chakra elétrico e as lança em rápida sucessão. Você pode arremessar simultaneamente um número de armas igual ao seu Modificador de Inteligência. Faça um ataque à distância para cada arma. Em um acerto, cada arma causa 1d10 de dano elétrico e 1d10 de dano perfurante. Em Ranks Superiores: \+3 Chakra e +1d10 de dano para cada tipo de dano.

#### ESTILO RELÂMPAGO: MANTO DO REI DO TROVÃO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (9 metros de raio) | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você emana uma poderosa aura elétrica que acompanha seus movimentos. Criaturas aliadas (incluindo você) dentro da aura causam +1d6 de dano elétrico sempre que acertam um ataque com arma. Em Ranks Superiores: +3 Chakra e +1d6 de dano adicional.

#### ESTILO RELÂMPAGO: PASSO DO RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você se teleporta para um espaço desocupado visível. Ao desaparecer e reaparecer, ocorre um estrondo elétrico. Criaturas a até 3 metros do ponto de origem e destino devem realizar um teste de Constituição. Falha: 3d10 de dano elétrico. Sucesso: metade do dano. O som pode ser ouvido a até 90 metros. Você pode levar objetos ou uma criatura voluntária do seu tamanho ou menor, respeitando limites de carga. Em Ranks Superiores: +3 Chakra e +1d10 de dano.

#### ESTILO RELÂMPAGO: SOBRECARGA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você acelera seu sistema nervoso com chakra elétrico fazendo sua velocidade de movimento aumentar em +6 metros. Você também passa a ter vantagem em testes de Destreza; Testes de Sabedoria recebem +1d4. Em Ranks Superiores: +3 Chakra e +3 metros de movimento por rank acima.

#### ESTILO RELÂMPAGO: TEIA DE ARANHA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros, cubo de 9 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você cria uma teia de chakra elétrico no chão. Criaturas que entrem ou comecem o turno na área devem realizar um teste de Constituição ou ficam Atordoadas enquanto permanecerem na área. Criaturas atordoadas podem repetir o teste no início de cada turno.

#### ESTILO RELÂMPAGO: FALCÃO ESTÁTICO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros (cubo de 4,5 metros) | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você cria uma ave de eletricidade que voa até o alvo e explode. Criaturas na área devem realizar um teste de Constituição. Falha: 6d6 de dano elétrico. Sucesso: metade do dano. A explosão pode ser ouvida a até 90 metros. Em Ranks Superiores: +3 Chakra e +1d6 de dano.

#### ESTILO RELÂMPAGO: ARMA ESTÁTICA

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** Instantâneo | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Uma arma tocada torna-se uma arma de chakra elétrico. Ela recebe +1 em ataques e dano e causa +1 dado de dano elétrico adicional. Em Ranks Superiores: +3 Chakra e o bônus aumenta em +1.

#### ESTILO RELÂMPAGO: SURTO

**Classificação:** Ninjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você altera as propriedades do seu chakra elétrico, inclusive sua cor. Enquanto ativo: - Jutsus de Liberação do Raio Rank-C ou inferior custam –2 Chakra (mínimo 1) - Esses jutsus forçam o alvo a um teste de Constituição: Falha: CA –2. Sucesso: CA –1

### RANK-B

#### ESTILO RELÂMPAGO: BANQUETE DO RELÂMPAGO NÍVEL 2

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM, CS | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você descarrega 3 rajadas de relâmpago que rasgam o chão em linha reta, formando um caminho de 3 metros de largura por 18 metros de comprimento. O terreno por onde o relâmpago passa se torna terreno difícil. Criaturas no caminho devem realizar um teste de resistência de Destreza. Falha: 8d6 de dano elétrico. Sucesso: metade do dano. Além disso, as criaturas devem realizar: Um teste de Constituição, ficando Atordoadas até o final do próximo turno em caso de falha; Um teste de Sabedoria, ficando Enfraquecidas em caso de falha. Uma criatura Enfraquecida desta forma pode repetir o teste de Sabedoria no final de cada um de seus turnos para encerrar a condição.

#### ESTILO RELÂMPAGO: BESTA DE RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você molda seu chakra elétrico na forma de um animal terrestre à sua escolha, como um urso, pantera ou lobo. Como uma Ação Bônus em seu turno, você pode comandar a besta a se mover pelo campo de batalha ou realizar tarefas diversas. A Besta possui: CA 11 5d12 Pontos de Vida Deslocamento de 11 metros Ações da Besta: Mordida. Ataque (1d20 + Modificador de Destreza vs CA do alvo), alcance 2 metros, um alvo. Dano: 5d8 de dano elétrico Interruptor de Morte: Quando a besta chega a 0 Pontos de Vida, ela explode liberando eletricidade em todas as direções. Criaturas a até 3 metros devem realizar um teste de Destreza. Falha: 4d10 de dano elétrico. Sucesso: metade do dano

#### ESTILO RELÂMPAGO: RELÂMPAGO EM CADEIA

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 46 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você cria um raio elétrico que salta em direção a um alvo visível dentro do alcance. Em seguida, três relâmpagos adicionais saltam desse alvo para até três outros alvos diferentes, cada um a no máximo 9 metros do alvo inicial. Cada alvo pode ser uma criatura ou objeto e só pode ser atingido por um dos relâmpagos. Cada alvo deve realizar um teste de Destreza. Falha: 8d10 de dano elétrico. Sucesso: metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d10.

#### ESTILO RELÂMPAGO: FALSA ESCURIDÃO (GIDAI)

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você libera uma onda massiva de eletricidade capaz de desintegrar pedra e criaturas. Criaturas em um cone de 18 metros a partir de você devem realizar um teste de Constituição. Falha: 6d10 de dano elétrico e ficam Paralisadas. Sucesso: metade do dano e não ficam paralisadas. Após conjurar este jutsu, você não pode conjurar outros jutsus até o final do seu próximo turno. Em Ranks Superiores: +3 Chakra e +1d10 de dano por rank acima de Rank-B.

#### ESTILO RELÂMPAGO: VINCULAÇÃO DE RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Minuto | **Alcance:** 1,6 quilômetros | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM, CS (3) | **Palavras-chave:** Liberação do Raio, Ninjutsu, Selo

Descrição: Você posiciona 3 selos de chakra a até 5 metros uns dos outros, formando um triângulo, e os carrega com chakra de Liberação do Raio. Você define uma condição de ativação, como uma criatura entrar no triângulo, dizer uma palavra específica ou realizar um selo de mão. Quando ativado, os selos criam uma barreira triangular de chakra elétrico, aprisionando tudo dentro dela. A Barreira possui: 60 Pontos de Vida CA: 13 Criaturas dentro da barreira não podem moldar chakra. Se uma criatura tentar atravessar a barreira à força, deve realizar um teste de Constituição com desvantagem. Falha: 5d8 de dano elétrico; Sucesso: metade do dano. Nota: Criaturas fora da barreira não sofrem efeitos negativos, mas não podem atravessá-la sem tentar destruí-la.

#### ESTILO RELÂMPAGO: LANÇA RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Você cria uma esfera concentrada de chakra elétrico em sua mão e a dispara em linha reta em velocidade extrema, perfurando tudo em seu caminho. Criaturas em uma linha reta de até 9 metros a partir de você devem realizar um teste de Destreza. Falha: 5d6 de dano perfurante + 5d6 de dano elétrico; Sucesso: metade do dano Em Ranks Superiores: +3 Chakra e +1d6 de dano para cada tipo de dano por rank acima de Rank-B.

#### ESTILO RELÂMPAGO: ARMADURA DE ATAQUE

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você envolve seu corpo em uma armadura densa de chakra elétrico. Enquanto ativa você adquire as seguintes características: Deslocamento +8 metros; CA +2; Sempre que realizar ataques corpo a corpo, role 1d8 adicional e adicione o resultado à jogada de ataque. Em Ranks Superiores: \+3 Chakra, +1d8 adicional nas jogadas de ataque e +1 de CA por rank acima de Rank-B.

#### ESTILO RELÂMPAGO: TEMPESTADE DE RAIOS

**Classificação:** Ninjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Nuvem de 77 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você canaliza uma quantidade colossal de chakra elétrico para os céus, forçando a formação de uma nuvem de tempestade, carregada e rugindo com energia. A nuvem se forma sobre um ponto que você possa ver e se expande para cobrir uma área de 77 metros de raio. Dentro dessa área, relâmpagos caem incessantemente, atingindo o solo e as criaturas em padrões caóticos e furiosos. Ao final de cada um de seus turnos, todas as criaturas sob a nuvem (inimigas ou aliadas exceto você) devem realizar um teste de resistência de Destreza para tentar se esquivar dos raios mais diretos. - Falha: A criatura sofre 8d6 de dano elétrico. - Sucesso: A criatura sofre apenas metade desse dano. Além disso, aquelas que falharem no teste de Destreza são atingidas com força total por uma descarga. Elas devem então realizar imediatamente um teste de resistência de Constituição contra a fúria do raio. - Falha na Constituição: A descarga violenta sobrecarrega o sistema nervoso da criatura, deixando-a Atordoada até o início do seu próximo turno. - Sucesso na Constituição: A criatura aguenta o choque e não fica atordoada. Condição Ambiental: Esta técnica requer acesso direto aos céus e não pode ser executada em ambientes completamente fechados por um teto ou abóboda que bloqueie a formação da nuvem (como dentro de uma caverna ou de um edifício com teto sólido).

### RANK-A

#### ESTILO RELÂMPAGO: ESTRONDO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** Instantâneo | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Você concentra chakra de Liberação do Raio em um ponto extremamente comprimido na ponta do seu dedo, apontando-o para uma criatura que possa ver dentro do alcance e liberando a energia em um único movimento rápido. O relâmpago explode ao sair do seu dedo com um estrondo audível, capaz de estilhaçar vidro e outros materiais rígidos e frágeis em um raio de 153 metros. Faça um ataque de Ninjutsu à distância, em um acerto o alvo sofre 24d4 de dano elétrico. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +2d4.

#### ESTILO RELÂMPAGO: CLONE RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 16 Chakra
**Tempo de Conjuração:** Instantâneo | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Uma versão modificada da Técnica do Clone das Sombras que cria um clone feito de relâmpago sólido, à sua própria imagem. O clone não possui peso mensurável e não pode nadar. Se entrar em contato com água, ele se dispersa, retornando à sua forma natural de eletricidade e sobrecarrega o corpo d’água onde se dispersou. Você pode criar até 2 clones, que não possuem pensamento consciente, mas podem ser comandados mentalmente pelo usuário, desde que permaneçam a até 37 metros um do outro. Se o clone e o usuário ficarem fora desse alcance, o clone explode em uma bomba violenta de energia elétrica. Estatísticas do Clone: CA igual à seu atributo de Inteligência; 1 Ponto de Vida; Não possui chakra próprio; Pode conjurar até 2 Ninjutsus de Rank-B ou inferior com a palavra-chave Liberação do Raio. Resistências e Imunidades: Imunidade a Genjutsu, dano psíquico e veneno; Resistência a dano contundente e dano de terra; Vulnerabilidade a dano de vento. Se o Clone de Relâmpago precisar realizar um teste de resistência, os pontos de resistência dele são iguais aos seus. O clone não possui Ação Bônus nem Reação, não pode usar habilidades de Classe ou Clã. Criaturas com visão de chakra identificam imediatamente que o clone é feito de relâmpago e conseguem distingui-lo do original. Enquanto este jutsu estiver ativo, você não pode controlar outros tipos de clones, incluindo Clones das Sombras. Quando o clone chega a 0 Pontos de Vida, conjura 2 Ninjutsus de Liberação do Raio ou é dissipado como uma Ação Bônus, ele pulsa por um breve instante e então explode. Criaturas a até 7 metros do clone devem realizar um teste de Constituição. Falha: 10d6 de dano elétrico e ficam Atordoadas. Sucesso: metade do dano Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o número máximo de clones em +1.

#### ESTILO RELÂMPAGO: DRAGÃO DE RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Seu chakra se distorce e se molda em um longo dragão feito de pura eletricidade, que voa em linha reta na direção que você escolher. O dragão ocupa um espaço de 3 metros de largura e se estende por até 37 metros. Criaturas em seu caminho devem realizar um teste de Destreza. Falha: 8d10 de dano elétrico. Sucesso: metade do dano. Além disso, as criaturas devem realizar um teste de Constituição. Falha: ficam Cegas e Surdas. Em Ranks Superiores: +3 Chakra e +2d10 de dano elétrico por rank acima de Rank-A.

#### ESTILO RELÂMPAGO: RATO RELÂMPAGO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Seu chakra se molda em inúmeras esferas de eletricidade que flutuam à sua frente antes de serem disparadas contra uma criatura visível dentro do alcance, afetando também criaturas próximas ao alvo. Faça um ataque de Ninjutsu à distância. Acerto: o alvo sofre 11d8 de dano elétrico. Além disso, todas as criaturas em uma linha de 37 metros entre você e o alvo devem realizar um teste de Destreza. Falha: 13d6 de dano elétrico. Sucesso: metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano do alvo principal em +1d8.

#### ESTILO RELÂMPAGO: ESCUDO DE RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** Reação, ao ser atingido por um ataque | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Uma poderosa barreira de eletricidade se forma ao seu redor. Até o início do seu próximo turno: Você recebe +10 de CA e Ganha imunidade a dano elétrico.

### RANK-S

#### ESTILO RELÂMPAGO: KIRIN

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação de Turno Completo | **Alcance:** 92 metros | **Duração:** Instantânea
**Componentes:** HS, CM, Nuvens de Tempestade | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Este jutsu exige uma tempestade ativa, e tanto você quanto o alvo devem estar sob as nuvens da tempestade. Você cria uma força magnética oposta a partir das nuvens, atraindo todo o relâmpago acumulado para um único ponto que você possa ver dentro do alcance. O ataque afeta uma área em forma de cilindro com 7 metros de largura e até 92 metros de altura. Criaturas na área devem realizar um teste de resistência de Destreza. Falha: sofrem 14d10 de dano elétrico; Sucesso: metade do dano. Criaturas que falharem no teste de Destreza ficam Atordoadas por 1d4 turnos.

#### ESTILO RELÂMPAGO: MODO DE CHAKRA DE LIBERAÇÃO DE RAIO

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu

Descrição: Você envolve seu corpo em uma camada perfeitamente equilibrada de chakra de Liberação do Raio, aprimorando sua resistência, velocidade e poder ofensivo. Enquanto este jutsu estiver ativo: Sua CA aumenta em +5; Seu deslocamento é triplicado; Seus ataques corpo a corpo com armas causam 5d10 de dano elétrico adicional em um acerto.

#### ESTILO RELÂMPAGO: FLECHA DE PALMA DE TROVÃO

**Classificação:** Ninjutsu | **Rank:** Rank-S | **Custo:** 28 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 46 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Liberação do Raio, Ninjutsu, Disputa

Descrição: Você conjura uma enorme massa de eletricidade em forma de flecha, lançando-a ao ar antes de comandá-la a colidir com o solo. Escolha um ponto dentro do alcance onde a flecha cairá, criando uma explosão vertical em forma de cilindro com 19 metros de largura e 31 metros de altura. Todas as criaturas dentro da área devem realizar um teste de resistência de Destreza. Falha: sofrem 12d8 de dano elétrico Além disso, devem realizar um teste de resistência de Constituição. Falha: ficam Eletrificadas (condição choque) Este jutsu ignora resistência a dano elétrico.

## Genjutsu

### RANK-E

#### AFEIÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Durante a duração, você possui vantagem em todos os testes de Persuasão direcionados a uma criatura que você tocar, desde que ela não seja hostil a você. Quando o jutsu termina, a criatura pode perceber que você utilizou um jutsu para influenciar seu humor caso isso não condiga com o relacionamento anterior entre vocês. Criaturas propensas à violência podem atacá-lo ao perceber isso. Outras podem buscar retaliação de outras formas, a critério do Mestre, dependendo da natureza da interação.

#### CLONE

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS

Descrição: A técnica de clone mais básica ensinada na maioria das academias ninja. Ao ativar este jutsu, você cria 2 duplicatas de si mesmo. Os clones surgem ao seu lado, permanecem próximos e desaparecem quando atingidos. Eles não podem se afastar mais do que 2 metros do original. As duplicatas são cópias perfeitas da aparência do usuário, porém não podem falar nem realizar ações que exijam um corpo físico, como levantar objetos ou atacar criaturas. Ao serem tocadas por outra criatura ou objeto, ou ao serem violentamente sacudidas, desaparecem em uma nuvem de fumaça. Após a ativação, como reação, quando uma criatura realiza um ataque contra você, ela deve rolar 1d10 adicional e subtrair o resultado da jogada de ataque. Ao fazer isso, um dos seus clones é atingido independentemente do ataque acertar ou errar você. Quando a duração termina ou ambos os clones são atingidos, este jutsu se encerra imediatamente. Criaturas que utilizem jutsus sensoriais ou que consigam enxergar através de Genjutsu não são afetadas por este jutsu. Em Ranks Superiores: Ao atingir o 5º nível, você cria 3 duplicatas; no 11º nível, 4 duplicatas; no 17º nível, 5 duplicatas.

#### ECO DISTANTE

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Até 1 minuto
**Componentes:** HS, CM

Descrição: Você cria um som em um ponto dentro do alcance que persiste pela duração. O som também termina caso você o dissipe como uma ação ou conjure este jutsu novamente. O som pode variar de um sussurro a um grito, podendo ser sua própria voz ou qualquer outro som que você já tenha ouvido antes, como a voz de outra pessoa, o rugido de um leão ou o som de um vaso se quebrando. O som pode permanecer contínuo ou ser emitido em intervalos distintos antes do término do jutsu. Em Ranks Superiores: No 5º nível, escolha 1 local adicional para o som se originar. No 11º nível, 2 locais adicionais. No 17º nível, 3 locais adicionais.

#### DÚVIDA

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** 1 minuto
**Componentes:** HS

Descrição: Durante a duração, você possui vantagem em todos os testes de Intimidação direcionados a uma criatura que você tocar e com a qual esteja interagindo. Quando o jutsu termina, a criatura pode perceber que você utilizou um jutsu para influenciar seu estado emocional caso isso não condiga com o relacionamento anterior. Criaturas violentas podem atacá-lo, enquanto outras podem buscar retaliação de diferentes formas, a critério do Mestre.

#### CODIFICAR PENSAMENTOS

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 8 horas
**Componentes:** HS, CM

Descrição: Você extrai uma memória, ideia ou mensagem de sua mente e a sela em uma sequência tangível de selos luminosos chamada fio de pensamento, que persiste pela duração ou até que você conjure este jutsu novamente. O fio de pensamento surge em um espaço desocupado sobre uma superfície à sua escolha, como uma parede, pergaminho em branco, livro ou pele, na forma de texto ou imagens baseadas em suas memórias. Caso conjure este Genjutsu enquanto mantém concentração em outro Genjutsu ou habilidade que permita manipular os pensamentos de outras criaturas, você pode converter os pensamentos ou memórias lidas, em vez das suas, em um fio de pensamento.

#### EXPLOSÃO DE PENAS

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Reação, ao ser atingido | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Uma simples ilusão visual. Ao ser atingido por um ataque, o oponente vê você se desfazer em penas (a sua escolha, como penas negras de corvo, ou brancas de cisne), reformando-se em sua posição atual. Quando for atingido por um ataque corpo a corpo, role 1d8 e reduza a jogada de ataque do oponente pelo valor obtido. Em Ranks Superiores: No 5º nível: 2d8. No 11º nível: 3d8. No 17º nível: 4d8

#### CLARÃO

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, NT (Bombinhas)

Descrição: Uma mistura de bombinhas e chakra intensifica o clarão produzido em até dez vezes. Escolha um ponto dentro do alcance. Criaturas em um raio de 2 metros desse ponto devem realizar um teste de resistência de Sabedoria. Em caso de falha, o próximo ataque realizado contra a criatura terá vantagem.

#### MENSAGEM

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** 1 rodada
**Componentes:** HS

Descrição: Você aponta para uma criatura dentro do alcance que possa ver e sussurra uma mensagem. Apenas o alvo escuta a mensagem e pode responder com um sussurro que somente você consegue ouvir. Você pode conjurar este Genjutsu através de objetos sólidos se estiver familiarizado com o alvo e souber que ele está além da barreira. O jutsu não precisa seguir uma linha reta e pode contornar obstáculos ou passar por aberturas livremente.

#### FRAGMENTO MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** 1 rodada
**Componentes:** HS, CM

Descrição: Você lança uma estocada desorientadora de chakra na mente de uma criatura que possa ver dentro do alcance. Faça um ataque de Genjutsu à distância, causando 1d6 de dano psíquico. O alvo também deve realizar um teste de resistência de Inteligência. Em caso de falha, até o final do próximo turno, ele deve rolar 1d4 e subtrair o resultado do primeiro teste de resistência que realizar nesse período. Em Ranks Superiores: 5º nível: 2d6. 11º nível: 3d6. 17º nível: 4d6

#### ILUSÃO MENOR

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** 1 minuto
**Componentes:** HS

Descrição: Você cria um som ou a imagem de um objeto dentro do alcance que persiste pela duração. O efeito termina se você o dissipar como uma ação ou conjurar este jutsu novamente. Se criar um som, ele pode variar de um sussurro a um grito e ser qualquer som que você já tenha ouvido. Se criar uma imagem, ela não pode ser maior que um cubo de 2 metros. A imagem não emite som, luz, cheiro ou qualquer outro efeito sensorial. Interação física revela a ilusão. Uma criatura pode usar sua ação para examinar o efeito, realizando um teste de Inteligência ou Sabedoria. Em caso de sucesso, a ilusão torna-se clara para ela.

#### DOR

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS

Descrição: Você aponta para uma criatura dentro do alcance, e o som de um sino doloroso ecoa ao seu redor por um instante. O alvo deve realizar um teste de resistência de Sabedoria ou sofrer 1d8 de dano psíquico. Se o alvo estiver com pontos de vida abaixo do máximo, o dano passa a ser 1d12 de dano psíquico. Em Ranks Superiores: 5º nível: 2d8 ou 2d12. 11º nível: 3d8 ou 3d12. 17º nível: 4d8 ou 4d12

#### LIBERAÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Esta técnica permite ao usuário isolar e remover à força o efeito de um único Genjutsu, desde que ele possa ser dissipado. Você deve estar ciente de que você ou o alvo está sob efeito de um Genjutsu. Como parte da ativação, realize um Teste de Sabedoria com vantagem. Em caso de sucesso, você remove o efeito do Genjutsu de si mesmo ou do alvo tocado.

#### TRANSFORMAÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** HS

Descrição: Técnica ensinada à maioria dos estudantes da academia. Você assume a forma de uma criatura do mesmo tamanho ou menor que o seu. Pode definir livremente os detalhes da aparência. Esta transformação é puramente ilusória e cosmética, não alterando suas habilidades, características ou jutsus. Enquanto estiver sob este efeito, ao realizar um teste de Atuação (Teste de Atributo de Carisma), role 1d10 adicional e some ao resultado. Em Ranks Superiores: 5º nível: 2d10. 11º nível: 3d10. 17º nível: 4d10

#### GOLPE VERDADEIRO

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 2 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, até 1 rodada
**Componentes:** HS, CM

Descrição: Você foca seu Genjutsu em uma criatura dentro do alcance, obtendo uma breve percepção sobre suas defesas. No seu próximo turno, você possui vantagem na primeira jogada de ataque contra o alvo, desde que este jutsu ainda esteja ativo.

#### ALTERAÇÃO DE VOZ

**Classificação:** Genjutsu | **Rank:** Rank-E | **Custo:** 1 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você reveste seu aparelho fonador (todos órgãos responsáveis pelo som da fala) com chakra, manipulando as vibrações do som. É capaz de imitar com extrema precisão a voz de qualquer criatura que já tenha ouvido. Ao realizar testes de Enganação ou Atuação enquanto este jutsu estiver ativo, role 2d6 adicionais e some ao resultado. Em Ranks Superiores: 5º nível: 3d6. 11º nível: 4d6. 17º nível: 5d6

### RANK-D

#### ANIMAL COMPANHEIRO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Você seleciona um animal que possa ver dentro do alcance e altera sua disposição em relação a você. O animal passa a vê-lo como um membro de sua matilha, seu filhote, seu progenitor ou seu mestre (à sua escolha). Ele entende seus comandos e age de acordo durante a duração. O alvo deve realizar um teste de resistência de Carisma, ficando enfeitiçado por você enquanto o jutsu durar. O animal pode lutar ao seu lado, porém quando atingir metade dos seus pontos de vida, o jutsu se encerra. A partir disso, ele pode continuar lutando para sobreviver ou fugir, conforme sua natureza (descrição do Mestre). Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e selecione 1 animal adicional visível.

#### PERDIÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (10 metros) | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você libera uma pulsação de chakra que afeta criaturas hostis dentro de 10 metros, fazendo-as sentir arrependimento profundo ou temor intenso. As criaturas escolhidas devem realizar um teste de resistência de Carisma. Em caso de falha, sempre que realizarem uma jogada de ataque ou teste de resistência antes do fim do jutsu, devem rolar 1d4 adicional e subtrair o resultado da rolagem. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o raio em 3 metros.

#### BENÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (10 metros) | **Duração:** 1 rodada
**Componentes:** HS, CM

Descrição: Você libera uma pulsação de chakra que afeta criaturas aliadas dentro de 10 metros, preenchendo-as com orgulho ou ambição. Até o fim do seu próximo turno, sempre que uma criatura aliada realizar uma jogada de ataque ou teste de resistência, ela pode rolar 1d4 adicional e somar o resultado. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o dado em um passo (d4\>d6\>d8\>d10\>d12).

#### BRAVURA

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você seleciona até 3 criaturas à sua escolha dentro do alcance, reforçando sua coragem a níveis extremos e instilando uma arrogância que intensifica sua determinação. Enquanto o jutsu durar, sempre que um alvo realizar uma jogada de ataque ou teste de resistência, ele pode rolar 1d4 adicional e somar ao resultado. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o bônus em +1d4.

#### CAUSAR MEDO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você desperta a noção de mortalidade em uma criatura que possa ver dentro do alcance. Construtos e mortos-vivos são imunes. O alvo deve realizar um teste de resistência de Sabedoria ou ficará amedrontado por você até o fim do jutsu. O alvo pode repetir o teste ao final de cada turno, encerrando o efeito em caso de sucesso. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e selecione 1 criatura adicional, todas devendo estar a até 10 metros umas das outras.

#### DISSONÂNCIA ENCANTADORA

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você tenta suprimir emoções intensas em até 3 criaturas que possam vê-lo e ouvi-lo dentro do alcance. Os alvos devem realizar um teste de resistência de Carisma (podendo escolher falhar). Em caso de falha, você pode suprimir efeitos de encantamento ou medo, ou tornar o alvo indiferente a criaturas hostis à sua escolha; o efeito termina se houver agressão. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e selecione 2 criaturas adicionais.

#### DUELO COMPELIDO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 10 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você força uma criatura a enxergá-lo como o único oponente digno. O alvo deve realizar um teste de resistência de Sabedoria. Em caso de falha, ele tem desvantagem em ataques contra outros alvos e deve testar Sabedoria sempre que tentar se afastar mais de 10 metros de você. O efeito termina se você atacar outra criatura ou se um aliado curá-lo.

#### CONFIANÇA

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Até 1 minuto
**Componentes:** HS, CM

Descrição: Você seleciona até 3 criaturas voluntárias visíveis dentro do alcance, reforçando sua autoconfiança. Durante a duração, sempre que realizarem testes de perícia baseados em Força, Destreza ou Carisma, rolam 1d8 adicional e somam ao resultado. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o bônus em +1d8.

#### DETECTAR O MAL

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Durante a duração, você sabe se existe alguém dentro do alcance com intenções hostis, mas não sua localização exata.

#### DETECTAR INTENÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você seleciona uma criatura visível. Se ela não perceber sua presença, role um teste de Sabedoria. Em sucesso, você descobre sua intenção imediata daquele alvo. Se estiver ciente de você, o alvo realiza um teste de Sabedoria; em falha, o efeito ocorre normalmente.

#### DISTORCER VALOR

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** 10 minutos
**Componentes:** HS, CM

Descrição: Você altera a percepção de valor de um objeto de até 30 cm, dobrando ou reduzindo pela metade seu valor aparente através de ilusões. Qualquer criatura que examine o objeto deve realizar um teste de Sabedoria. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o tamanho do objeto em 1,5 metro.

#### DOR REDOBRADA

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você amplifica o sistema nervoso de uma criatura visível. Sempre que causar dano ao alvo durante a duração, role 1d8 adicional causando dano psíquico. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e selecione 1 criatura adicional.

#### HEROÍSMO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Uma criatura voluntária tocada torna-se imune à condição amedrontado e recebe pontos de vida temporários iguais ao seu modificador de Sabedoria no início de cada turno. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o número de alvos em +1.

#### SILÊNCIO IMPERFEITO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros (esfera de 19 metros) | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Criaturas dentro da área devem realizar um teste de Inteligência ou ficam surdas e incapazes de ouvir outras criaturas na área enquanto permanecerem nela.

#### INEPTIDÃO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Uma criatura visível deve realizar um teste de Carisma. Em falha, sempre que fizer uma jogada de ataque ou teste de Sabedoria, rola 1d6 adicional e subtrai do resultado. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o dado em +1d6.

#### INSINUAÇÃO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você inunda a mente do alvo com desejos conflitantes. Ele deve realizar um teste de Sabedoria ou ficará incapacitado, sofrendo 1d12 de dano psíquico ao final de cada turno até obter sucesso no teste. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o dano em +1d12.

#### MENTIRAS PERDIDAS

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cubo de 19 metros | **Duração:** 10 minutos
**Componentes:** HS, CM, CS

Descrição: Criaturas na área devem realizar um teste de Carisma. Em falha, não conseguem proferir mentiras deliberadas, ficando incapazes de falar ao tentar fazê-lo.

#### ECO CEGANTE E SILENCIOSO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Criaturas no cone devem realizar um teste de Sabedoria ou ficam cegas, podendo repetir o teste ao final de cada turno.

#### RISO DESENFREADO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Até 1 minuto
**Componentes:** HS, CM, NT (Pó do Riso)

Descrição: O alvo deve realizar um teste de Sabedoria ou cai no chão rindo incontrolavelmente. Criaturas com Inteligência 4 ou menor são imunes. Sofrer dano encerra o efeito.

#### ARMAS DA ESCURIDÃO

**Classificação:** Genjutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você conjura adagas ilusórias de medo e escuridão, semelhantes a kunais. Faça um ataque de Genjutsu; em acerto, o alvo sofre 5d4 de dano psíquico. Em Ranks Superiores: Para cada Rank acima de Rank-D, aumente o custo em 3 Chakra e o dano em +1d4.

### RANK-C

#### DESFOCAR

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Seu corpo torna-se borrado e instável aos olhos de quem o observa. Durante a duração, todas as criaturas têm desvantagem em jogadas de ataque contra você. Criaturas que não dependem da visão, como aquelas com visão às cegas, ou que enxergam através de ilusões, como visão verdadeira, são imunes a este efeito.

#### LÁBIA GLAMOUROSA

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Um poderoso Genjutsu que utiliza apenas palavras e discurso para envolver a mente do alvo. Uma criatura visível deve realizar um teste de resistência de Carisma. Em falha, ela sofre desvantagem em testes de Intuição e torna-se mais propensa a acreditar em cenários pessimistas e agir contra seu próprio bom senso e objetivos.

#### COCHILO

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** 10 minutos
**Componentes:** HS, CM

Descrição: Você faz um gesto calmante e até 3 criaturas voluntárias visíveis dentro do alcance caem inconscientes durante a duração. O efeito termina se o alvo sofrer dano ou se alguém gastar uma ação para despertá-lo. Se permanecer inconsciente por toda a duração, o alvo recebe os benefícios de um descanso curto e não pode ser afetado novamente por este jutsu até concluir um descanso longo.

#### ESTILHAÇAR CHAKRA

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Reação, ao ver uma criatura conjurando um Ninjutsu ou Genjutsu | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Você tenta interromper a conjuração de um jutsu ao criar um surto de chakra desbalanceador. Se o jutsu for Rank-C ou inferior, ele falha automaticamente. Se for Rank-B ou superior, façam um teste de Disputa em Genjutsu. Em sucesso, o jutsu falha sem efeito.

#### CATIVAR

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** 1 minuto
**Componentes:** HS, CM

Descrição: Você tece palavras envolventes que distraem criaturas à sua escolha que possam vê-lo e ouvi-lo. Os alvos devem realizar um teste de Sabedoria; criaturas imunes a encantamento passam automaticamente. Em falha, o alvo sofre desvantagem em testes de Percepção para notar criaturas que não sejam você, enquanto puder ouvi-lo. O jutsu termina se você ficar incapacitado ou não puder falar.

#### FUGA DE PÉTALAS DE FLORES

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Reação, ao sofrer dano | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Uma versão avançada do Genjutsu “Explosão de Penas”. Ao ser atingido, seu corpo se desfaz em pétalas ilusórias enquanto você se reposiciona furtivamente. Role 2d8 e reduza o dano sofrido pelo resultado; como parte da ativação, faça imediatamente um teste de Destreza, em sucesso mova-se até seu um local dentro do seu deslocamento. Em Ranks Superiores: Para cada Rank acima de Rank-C, aumente o custo em 3 Chakra e reduza o dano adicionalmente em +1d8.

#### QUEBRA DE GENJUTSU

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, CS

Descrição: Você escolhe uma criatura ou objeto que esta sob efeito de Genjutsu. Genjutsus Rank-C ou inferiores são selados automaticamente em um selo de chakra, encerrando o efeito. Se for Rank-B ou superior, faça um teste de Sabedoria. Em sucesso, o jutsu é selado.

#### TERRENO ALUCINÓGENO

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 10 minutos | **Alcance:** 91 metros | **Duração:** 24 horas
**Componentes:** HS, CM, CS (15 Selos de Chakra)

Descrição: Você aplica selos de chakra em uma área igual a um cubo de até 45 metros, com isso altera a aparência, sons e odores de um terreno natural, fazendo-o parecer outro tipo de ambiente natural. A textura real não muda. Criaturas podem tentar desacreditar a ilusão com um teste de Sabedoria.

#### CLONE DE NÉVOA

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Uma névoa ilusória se espalha em um raio de 36 metros ao seu redor, criando duplicatas estáticas de você. Dentro da névoa, você recebe +10 em testes de furtividade. Criaturas fora da área não percebem a névoa nem as duplicatas.

#### PADRÕES HIPNÓTICOS

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Um padrão hipnótico surge brevemente em um cubo de 10 metros. Criaturas que o veem devem realizar um teste de Sabedoria ou ficam encantadas, incapacitadas e com deslocamento 0 enquanto durar o efeito. Sofrer dano encerra o jutsu para aquele alvo.

#### BARREIRA MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Reação | **Alcance:** Pessoal | **Duração:** 1 rodada
**Componentes:** HS, CM

Descrição: Você envolve sua mente em pensamentos repetitivos. Até o início do seu próximo turno, você tem vantagem em testes de resistência de Inteligência, Sabedoria e Carisma, além de resistência a dano psíquico.

#### ESPINHO MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 hora
**Componentes:** HS, CM

Descrição: Você lança uma lança psíquica na mente de uma criatura visível. Faça um ataque de Genjutsu; em acerto, o alvo sofre 5d8 de dano psíquico e deve falhar em um teste de Sabedoria para que você sempre saiba sua localização e ele não possa se esconder de você. Em Ranks Superiores: Para cada Rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em +1d8.

#### IMPULSO MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 27 metros | **Duração:** 1 rodada
**Componentes:** HS, CM

Descrição: Uma lança psíquica atinge a mente do alvo. Ele deve realizar testes de Inteligência e Sabedoria. Em falha, sofre 4d6 de dano psíquico, perde a reação e no próximo turno só pode escolher entre mover-se, agir ou usar ação bônus. Em Ranks Superiores: Para cada Rank acima de Rank-C, aumente o custo em 3 Chakra e o dano em +1d6.

#### RECUPERAÇÃO MENTE-CORPO

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Até 10 minutos
**Componentes:** HS, CM

Descrição: Até 3 criaturas dentro do alcance recebem 2d6+3 pontos de vida temporários, anestesiando a dor mentalmente. Ao fim do jutsu, os PV temporários restantes são perdidos. Em Ranks Superiores: Para cada Rank acima de Rank-C, aumente o custo em 3 Chakra e os PV temporários em +5.

#### CALMA PODEROSA

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Você suprime completamente a agressividade de criaturas na área por 4d8 minutos. Alvos devem realizar um teste de Carisma; em falha, perdem toda vontade de lutar. Ao sofrerem dano ou ao fim do tempo, a hostilidade retorna de forma intensa. Criaturas que passam no teste ficam imunes por 24 horas.

#### DISTORÇÃO DO ECO DO SINO

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM, NT (Sinos), W (3 armas de arremesso)

Descrição: Você arremessa armas com sinos presos, criando áreas de alucinação em um raio de 6 metros. Criaturas afetadas devem falhar em um teste de Sabedoria ou sofrem desvantagem em ataques e concedem vantagem contra si.

#### SUGESTÃO

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, até 8 horas
**Componentes:** HS, CM

Descrição: Você sugere uma ação plausível a uma criatura que possa ouvi-lo e entendê-lo. O alvo deve realizar um teste de Sabedoria; em falha, segue a sugestão da melhor forma possível. Sofrer dano encerra o efeito.

#### ESCUDO DE PENSAMENTO

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** 8 horas
**Componentes:** HS, CM

Descrição: A mente do alvo não pode ser lida, detectada ou alvo de comunicação telepática sem consentimento, além de receber vantagem em testes contra efeitos que determinem se está mentindo.

#### ZONA DA VERDADE

**Classificação:** Genjutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Você cria uma zona que impede mentiras deliberadas em um raio de 5 metros. Criaturas que entram ou iniciam o turno na área devem realizar um teste de Carisma; em falha, não conseguem mentir. Você sabe quem resistiu ou não ao efeito.

### RANK-B

#### COMPULSÃO

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Criaturas à sua escolha que possam vê-lo e ouvi-lo devem realizar um teste de Sabedoria; criaturas imunes a encantamento passam automaticamente. Em falha, no início de cada um dos seus turnos você pode usar uma ação bônus para indicar uma direção possível. Cada alvo afetado deve gastar todo o deslocamento possível movendo-se nessa direção em seu próximo turno, podendo realizar sua ação antes de se mover. Após se mover, o alvo pode repetir o teste para encerrar o efeito. O alvo não se moverá para perigos obviamente letais, mas pode cair em armadilhas caso essas estejam ocultas.

#### CONFUSÃO

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Um Genjutsu que distorce violentamente a mente. Criaturas em uma esfera de 3 metros devem realizar um teste de Sabedoria ou ficam confusas. Alvos afetados não podem usar reações e, no início de cada turno, rolam 1d10 para determinar seu comportamento: 1 – move-se aleatoriamente e não age; 2–6 – não se move nem age; 7–8 – realiza um ataque corpo a corpo contra uma criatura aleatória ao alcance; 9–10 – age normalmente.

#### ATORDOAMENTO SEM ESFORÇO

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você cria uma imagem ilusória aterradora que paralisa um alvo visível. O alvo deve realizar um teste de Sabedoria ou fica paralisado enquanto durar o efeito. Criaturas mortas-vivas são imunes. Ao final de cada turno, o alvo pode repetir o teste para encerrar o jutsu.

#### INIMIGOS ABUNDANTES

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você invade a mente de uma criatura visível, que deve realizar um teste de Inteligência; criaturas imunes a medo passam automaticamente. Em falha, o alvo passa a enxergar todas as criaturas como inimigas. Sempre que escolher um alvo para ataques ou jutsus, ele o faz aleatoriamente entre criaturas visíveis. Sempre que sofrer dano, pode repetir o teste para encerrar o efeito.

#### OLHOS DA VERDADE

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** 1 minuto
**Componentes:** HS, CM, NT (Vidro ou Cristal Translúcido)

Descrição: Você canaliza chakra através de um cristal ou vidro, permitindo que você veja exatamente o que criaturas aliadas enxergam em um raio de 19 metros a partir de você, como se compartilhassem sua percepção visual.

#### MEDO

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 9 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você manifesta os piores medos das criaturas. Alvos na área devem realizar um teste de Sabedoria ou largam o que estiverem segurando e ficam amedrontados. Enquanto afetados, devem usar a ação Correr para se afastar de você pela rota mais segura. Se terminarem o turno fora da sua linha de visão, podem repetir o teste para encerrar o efeito.

#### INVISIBILIDADE

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal ou Toque | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você ou uma criatura tocada torna-se invisível enquanto durar o jutsu. Tudo o que estiver vestindo ou carregando também se torna invisível.

#### IMAGEM MAIOR

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Até ser Dissipada
**Componentes:** HS, CM, CS

Descrição: Você cria uma ilusão complexa de até um cubo de 6 metros, incluindo sons, cheiros e temperatura. A ilusão pode se mover e mudar naturalmente enquanto você estiver dentro do alcance, mas não causa dano direto. Interação física revela a ilusão. Criaturas podem desacreditá-la com um teste de Inteligência ou Sabedoria.

#### DOMINAÇÃO DE MEMÓRIA

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Até ser Restaurado
**Componentes:** HS, CM, CS

Descrição: Você altera as memórias de uma criatura tocada. O alvo realiza um teste de Inteligência (com vantagem se estiver em combate). Em falha, fica encantado e incapacitado por 1 minuto enquanto você reescreve um evento ocorrido nos últimos 12 meses e que tenha durado até 24 horas. Memórias alteradas tornam-se permanentes ao fim do jutsu, mas podem ser restauradas por Quebra de Genjutsu ou jutsus restaurativos superiores.

#### DUPLICATA ENGANOSA

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você fica invisível enquanto cria um clone ilusório no local. O clone pode se mover, falar e agir livremente. Você pode alternar entre seus sentidos e os do clone como ação bônus. A invisibilidade termina se você atacar ou conjurar outro jutsu.

#### ASSASSINO FANTASMAGÓRICO

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Um pesadelo vivo ataca a mente do alvo. Ele deve realizar um teste de Sabedoria ou fica amedrontado. Ao final de cada turno, deve repetir o teste ou sofrer 4d10 de dano psíquico. Em sucesso, o efeito termina. Em Ranks Superiores: Para cada Rank acima de Rank-B, aumente o custo em 3 Chakra e o dano em +1d10.

#### ILUSÕES PROGRAMADAS

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 36 metros | **Duração:** Até ser Dissipada
**Componentes:** HS, CM, CS

Descrição: Você sela um Genjutsu invisível que ativa uma ilusão complexa quando uma condição pré-determinada ocorre. A ilusão pode durar até 5 minutos e se repete enquanto a condição for válida. Pode ser desacreditada por interação física ou teste de Sabedoria.

#### EXPLOSÃO PSÍQUICA

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Uma onda devastadora de energia mental explode à sua frente. Criaturas na área realizam um teste de Sabedoria. Em falha, sofrem 5d10 de dano psíquico, ficam caídas e incapacitadas até o fim do próximo turno. Em sucesso, sofrem metade do dano. Em Ranks Superiores: Para cada Rank acima de Rank-B, aumente o custo em 3 Chakra e o dano em +1d10.

#### LENTIDÃO

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Você distorce a percepção temporal de até 6 criaturas em um cubo de 12 metros. Alvos devem realizar um teste de Sabedoria ou ficam Lentos enquanto durar o efeito. Em Ranks Superiores: Para cada Rank acima de Rank-B, aumente o custo em 3 Chakra e afete +2 criaturas.

#### MORTE PELO APRISIONAMENTO DA ÁRVORE

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Até 3 criaturas devem realizar um teste de Sabedoria ou ficam incapacitadas, cegas e surdas a você e entre si, acreditando estarem presas por uma árvore gigantesca. O efeito termina se sofrerem dano ou resistirem ao jutsu.

#### TERROR INCONFUNDÍVEL

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cubo de 27 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM

Descrição: Criaturas na área devem realizar um teste de Carisma ou largam tudo, interrompem ações e ficam amedrontadas. Enquanto afetadas, sempre que você as atingir, sofrem +5d4 de dano psíquico. Em Ranks Superiores: Para cada Rank acima de Rank-B, aumente o custo em 3 Chakra e o dano adicional em +2d4.

#### DOR IMPLACÁVEL

**Classificação:** Genjutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: O alvo deve realizar um teste de Sabedoria. Em falha, sofre 10d6 de dano psíquico e fica atordoado até o fim do próximo turno. Em sucesso, sofre metade do dano e nenhum efeito adicional. Em Ranks Superiores: Para cada Rank acima de Rank-B, aumente o custo em 3 Chakra e o dano em +2d6.

### RANK-A

#### PORTADOR DA ESCURIDÃO

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 19 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Você libera uma poderosa onda de chakra que suprime visão, audição e tato. Criaturas na área devem realizar um teste de Sabedoria ou ficam cegas, surdas e incapazes de sentir contato físico. Criaturas que entrem ou terminem o turno na área também devem realizar o teste. Uma criatura afetada continua sob efeito mesmo fora da área até ser bem-sucedida no teste. Ao final de cada turno, pode repetir o teste para encerrar o efeito.

#### DANÇA MACABRA

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Fios de chakra sombrio emergem de seus dedos, invocando 5 fantasmas médios sob seu controle. Cada fantasma assume a forma que você desejar. Seus ataques e dano recebem bônus igual ao seu modificador de Sabedoria. Como ação bônus, você pode comandá-los simultaneamente. Eles obedecem ordens simples até completá-las. |  | | :-: | | \#\#\#\# \\Fantasma Sombrio\\\Criatura Média (Ilusão), sem alinhamento\  - \\Classe de Armadura:\\ 10 + Seu Modificador de Sabedoria  &#10;      &#10;  - \\Pontos de Vida:\\ (8d8 + 8)  &#10;      &#10;  - \\Velocidade:\\ 9 metros \|  \|  \|  \|  \|  \|  \|&#10;\| :-: \| :-: \| :-: \| :-: \| :-: \| :-: \|&#10;\| FOR \| DES \| CON \| INT \| SAB \| CAR \|&#10;\| 1 (-5) \| 18 (+4) \| 12 (+1) \| 1 (-5) \| 10 (+0) \| 1 (-5) \|&#10;  - Imunidades a Dano: Ácido; contundente, perfurante e cortante de armas não aprimoradas por chakra  &#10;      &#10;  - Imunidades a Condição: Encantado, exausto, amedrontado, paralisado, petrificado, envenenado  &#10;      &#10;  - Sentidos: Visão no escuro 18 m, Percepção passiva 10  - Movimento Incorpóreo: Pode atravessar criaturas e objetos como terreno difícil; sofre 5 de dano se terminar o turno dentro de um objeto.  &#10;      &#10;  - Armas Fantasmagóricas: Ataques são aprimorados por chakra.\#\#\#\# \\ATAQUES\\Garras: Ataque (1d20 + 4 vs CA do alvo), alcance 2 metros; dano 2d6 + 4 psíquico. |

#### MORTE

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: Você profere uma ordem absoluta. Criaturas que possam vê-lo e ouvi-lo devem realizar um teste de Carisma ou, em seu próximo turno, atacar a si mesmas com o ataque mais poderoso disponível. Se não puderem realizar o ataque ordenado, utilizam o último ataque ofensivo usado em combate contra si mesmas. Caso nunca tenham atacado, sofrem 8d12 de dano psíquico.

#### DOMINAR PESSOA

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 10 minutos
**Componentes:** HS, CM

Descrição: Você tenta dominar um humanoide visível. O alvo deve realizar um teste de Sabedoria ou fica encantado. Enquanto encantado, você mantém um vínculo telepático a até 1,6 km. Pode emitir ordens mentais sem ação. Usando sua ação, você pode assumir controle total do alvo até o fim do seu próximo turno. Sempre que o alvo sofrer dano, pode repetir o teste para encerrar o efeito.

#### GEAS (COAÇÃO MENTAL)

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** 30 dias
**Componentes:** HS, CM

Descrição: Você impõe uma ordem mental a uma criatura que compreenda sua linguagem. Em falha no teste de Sabedoria, o alvo fica encantado e sofre 9d10 de dano psíquico sempre que agir contra a ordem, no máximo uma vez por dia. Ordens suicidas encerram o jutsu imediatamente. Você pode encerrar o efeito antecipadamente como ação.

#### LÁBIA

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 hora
**Componentes:** HS, CM

Descrição: Sempre que realizar um teste de Carisma, você pode substituir o resultado por 15. Jutsus ou habilidades que detectem mentiras sempre indicam que você está dizendo a verdade.

#### CLONE MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 20 Chakra por semana durante 52 semanas
**Tempo de Conjuração:** 1 Ano | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, CS (100+), Corpo Substituto

Descrição: Você cultiva uma cópia inerte da consciência de uma criatura viva em um corpo substituto. O processo exige manutenção semanal durante um ano. Se concluído com sucesso, caso o original morra, sua consciência é transferida para o clone. O clone mantém apenas Inteligência, Sabedoria, Carisma e conhecimento do original no início do ritual.

#### QUEBRA DA MENTE

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** HS, CM

Descrição: O alvo sofre o equivalente a um ano de tortura mental em segundos. Deve realizar um teste de Inteligência; em falha sofre 10d10 de dano psíquico, ou metade em sucesso. Em Ranks Superiores: +3 Chakra e +2d10 de dano por Rank acima de Rank-A.

#### MIRAGEM

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 10 minutos | **Alcance:** 1,6 km | **Duração:** 10 dias
**Componentes:** HS, CM, CS

Descrição: Você altera completamente a aparência sensorial de até 2,6 km² de terreno. A forma geral permanece, mas o ambiente pode parecer outro. Criaturas com visão verdadeira percebem a ilusão, mas ainda interagem fisicamente com ela.

#### GENJUTSU DA FLORESTA VENENOSA

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cubo de 19 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM, NT (Pó Venenoso)

Descrição: Criaturas na área devem realizar um teste de Constituição ou ficam presas em uma floresta ilusória venenosa, incapazes de sair. Ao fim de cada turno, sofrem 5d8 de dano de veneno e podem repetir o teste para encerrar o efeito. Em Ranks Superiores: +3 Chakra e +2d8 de dano por Rank acima de Rank-A.

#### ESMAGAMENTO PSÍQUICO

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** 1 minuto
**Componentes:** HS, CM

Descrição: O alvo deve realizar um teste de Inteligência. Em falha, sofre 12d6 de dano psíquico e fica atordoado. Em sucesso, sofre metade do dano. O alvo pode repetir o teste ao final de cada turno para encerrar o efeito.

#### APARÊNCIA

**Classificação:** Genjutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** 8 horas
**Componentes:** HS, CM

Descrição: Você altera a aparência de qualquer número de criaturas no alcance. Alvos relutantes podem resistir com um teste de Carisma. A ilusão inclui roupas e equipamentos, mas não resiste a inspeção física direta. Criaturas podem investigar com um teste de Inteligência ou Sabedoria.

### RANK-S

#### ANTIPATIA / SIMPATIA

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 28 Chakra
**Tempo de Conjuração:** 1 Hora | **Alcance:** 19 metros | **Duração:** 10 Dias
**Componentes:** HS, CM, CS | **Palavras-chave:** Genjutsu

Descrição: Você investe um objeto, criatura Enorme ou menor, ou uma área de até 61 metros cúbicos com uma aura de chakra que atrai ou repele um tipo específico de criatura inteligente à sua escolha; criaturas afetadas devem realizar testes de resistência de Sabedoria conforme o efeito escolhido. Antipatia: Criaturas afetadas ficam Amedrontadas ao ver o alvo ou entrar no alcance e devem se afastar do alvo enquanto o perceberem. Simpatia: Criaturas afetadas sentem compulsão de se aproximar do alvo e não podem se afastar voluntariamente. Encerrando o efeito: Criaturas podem repetir o teste ao final do turno se perderem visão ou alcance do alvo, além de um teste adicional a cada 24 horas.

#### DEBILIDADE MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 46 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Genjutsu

Descrição: Você destrói o intelecto do alvo, causando 8d6 de dano psíquico e exigindo um teste de resistência de Inteligência; em falha, Inteligência e Carisma tornam-se 1 e o alvo perde a capacidade de conjurar jutsus, usar itens de chakra ou se comunicar de forma inteligível, podendo repetir o teste a cada 30 dias ou ter o efeito removido por meios apropriados.

#### PRISÃO MENTAL

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 22 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Genjutsu

Descrição: Você aprisiona a mente do alvo em uma cela ilusória perceptível apenas por ele; em falha no teste de Inteligência o alvo sofre 5d10 de dano psíquico, fica Restrito e isolado sensorialmente, sofrendo 10d10 de dano psíquico se tentar atravessar a ilusão, encerrando o efeito.

#### SONHO INFINITO

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 28 Chakra
**Tempo de Conjuração:** 1 Hora | **Alcance:** Toque | **Duração:** Até ser Dissipado
**Componentes:** HS, CM, CS | **Palavras-chave:** Genjutsu

Descrição: Após um ataque corpo a corpo bem-sucedido, o alvo entra em um Genjutsu de sonho em loop e cai em sono profundo, realizando testes diários de Sabedoria com desvantagem, sendo necessário obter 5 sucessos consecutivos para despertar.

#### DANÇA DA LESMA

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 Mês
**Componentes:** HS, CM, CS | **Palavras-chave:** Genjutsu

Descrição: Enquanto este Genjutsu estiver ativo, sempre que for alvo de um Genjutsu, você realiza o teste de resistência rolando 3d20 e escolhendo o melhor resultado, ou 4d20 se possuir vantagem.

#### JOGO DA SERPENTE

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 22 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Genjutsu

Descrição: Até 7 criaturas devem realizar um teste de resistência de Sabedoria ou ficam Paralisadas e ganham 1 nível de exaustão por turno sob a ilusão de asfixia, como se uma serpente enorme estivesse a esmagando, acumulando exaustão a cada falha subsequente.

#### CANTO DO SAPO

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 37 metros | **Duração:** Permanente
**Componentes:** HS, CM, Óleo de Sapo | **Palavras-chave:** Genjutsu, Fuinjutsu

Descrição: Criaturas que ouvirem a canção entram em sono profundo se seus Pontos de Vida forem inferiores ao total de 20d10 + modificador de Sabedoria + bônus de proficiência, permanecendo inconscientes até serem libertadas ou mortas.

#### PIOR MEDO

**Classificação:** Genjutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Genjutsu, Fuinjutsu

Descrição: Criaturas em uma esfera de 9 metros devem realizar um teste de resistência de Sabedoria ou ficam Amedrontadas, sofrendo 8d10 de dano psíquico, a criatura afetada pode tentar resistir novamente cada turno enquanto a duração do jutsu, caso falhem nos testes sofrem mais dano psíquico.

## Taijutsu

### RANK-D

#### DANÇA DA AVALANCHE

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça um ataque de Taijutsu causando seu dano desarmado + 1d4; o alvo deve ser bem-sucedido em um teste de resistência de Constituição ou fica Incapacitado até o início do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d4.

#### CHUTE DA FÚRIA BESTIAL

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 4 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Criaturas em um cone de 4 metros devem realizar um teste de resistência de Destreza, sofrendo seu dano desarmado + 2d8 e sendo empurradas 3 metros em falha, ou metade do dano sem empurrão em sucesso. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d8.

#### FLORESCER VELOZ

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça dois ataques de Taijutsu causando seu dano desarmado + 1d4 cada; se ambos acertarem, faça um terceiro ataque causando 2d10 de dano contundente. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano final em +1d10.

#### PREPARAR

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Reação ao realizar um teste de Força ou Constituição | **Alcance:** Pessoal | **Duração:** 1 Rodada
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Ao realizar um teste de resistência de Força ou Constituição, role 1d6 adicional e some ao resultado. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o bônus em +1d6.

#### CHUTE BORBOLETA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cubo de 4 metros a até 10 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Criaturas na área realizam um teste de Destreza, sofrendo seu dano desarmado + 2d6 e ficando Caídas em falha, ou metade do dano sem cair em sucesso; após isso você pode se mover até metade do deslocamento. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d6.

#### PRESA VELOZ GARRA DE ÁGUIA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 5 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça um ataque corpo a corpo causando seu dano desarmado + 1d10; em um acerto crítico, você pode usar este Taijutsu novamente sem custo, uma vez por ativação. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d10.

#### FORMAÇÃO ASA DE GARÇA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça um ataque de Taijutsu que deixa o alvo Caído e Agarrado; o alvo pode tentar escapar com um teste de Força e, se falhar, você pode usar sua reação para realizar um ataque desarmado com vantagem causando dano dobrado.

#### ENTRADA DINÂMICA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Disputa

Descrição: Faça um ataque de Taijutsu contra um alvo visível causando 2d12 de dano contundente. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d12.

#### EXORCISMO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça três ataques de Taijutsu, cada um causando seu dano desarmado + 1d4; este Taijutsu não pode causar acertos críticos. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e avance o dado de dano em um passo.

#### PRIMEIRA RESPIRAÇÃO CELESTIAL: INALAR

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Sua capacidade pulmonar é dobrada, aumentando seu desempenho físico; seu valor de Força aumenta em +2 e seu deslocamento aumenta em 3 metros.

#### TOURO VIGOROSO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** CS, M | **Palavras-chave:** Taijutsu

Descrição: Enquanto durar, seus valores de Força e Constituição tornam-se 16 se forem menores; você recebe pontos de vida temporários iguais ao aumento que teria no modificador de Constituição, perdidos ao fim do efeito.

#### GATO GRACIOSO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Enquanto durar, seus valores de Destreza e Sabedoria tornam-se 16 se forem menores; você ignora dano de queda até 9 metros, seu deslocamento aumenta em 6 metros e você recebe +5 em Percepção passiva.

#### MONGE SUPERIOR

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça dois ataques de Taijutsu, cada um causando seu dano desarmado + 1d6. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e receba +1 nas jogadas de ataque deste Taijutsu.

#### GOLPE DE FERRO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Faça um ataque de Taijutsu causando seu dano desarmado + 1d10; o alvo não pode usar reações contra este ataque. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d10.

#### VENDAVAL DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você executa um chute giratório baixo, desequilibrando seu alvo e fazendo-o cair no chão. O alvo deve realizar um teste de resistência de Destreza ou recebe 1d6 de dano e fica Caído; se usado imediatamente após outro Taijutsu, o teste é feito com desvantagem, e até o fim do seu turno o alvo pode ser atingido por Taijutsus com a palavra-chave Finalizar ignorando alcance.

#### CHUTE DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você desfere um único chute voador, forte o suficiente para fazer o ambiente ao seu redor desmoronar. Faça um ataque de Taijutsu causando seu dano desarmado + 1d12; o alvo deve ser bem-sucedido em um teste de Força ou tem seu deslocamento reduzido à metade até o fim do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d12.

#### LUAR ALTO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Após mover ao menos 5 metros em direção ao alvo, você desfere um chute duplo giratório com salto, seguido de um chute descendente simples que arremessa o alvo contra o chão. Faça dois testes de ataques de Taijutsu causando seu dano desarmado + 1d6; o alvo deve realizar um teste de Força ou fica Caído.

#### GOLPE NO PESCOÇO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você tenta atingir um ponto de pressão vital na nuca de um alvo humanoide. Faça um ataque de Taijutsu; em um acerto, o alvo deve passar em um teste de Constituição ou fica Incapacitado, podendo repetir o teste no início de cada turno por 1 minuto para encerrar o efeito.

#### REDEMOINHO DO AVESTRUZ

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Só pode ser usado contra um alvo Caído. Você realiza uma demonstração de habilidade bastante acrobática. Ao chutar uma criatura caída para o alto, você se impulsiona para trás enquanto executa um segundo chute amplo, também se movendo para trás. Faça um ataque de Taijutsu causando seu dano desarmado + 2d4 e mova-se 3 metros para trás sem provocar ataques de oportunidade.

#### GOLPE DE ORAÇÃO

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você desfere um golpe poderoso no âmago do seu oponente, enviando ondas de choque através do corpo dele que quebrariam um inimigo mais fraco e atordoariam os mais fortes. Faça um ataque de Taijutsu causando 1d12 de dano contundente; o alvo deve realizar um teste de Constituição ou fica Atordoado até o fim do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d12.

#### DRAGÃO ASCENDENTE

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Após mover ao menos 6 metros, faça um ataque de Taijutsu causando seu dano desarmado + 1d6. Em um sucesso, você acerta o alvo com um soco ascendente no queixo da criatura, que é lançada 9 metros no ar e fica Incapacitado até o fim do seu turno, podendo ser alvo de Finalizar ignorando alcance.

#### LEÃO VELOZ

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Enquanto durar, seus valores de Força e Destreza tornam-se 16 se forem menores, seus saltos são dobrados e testes de Força e Destreza são feitos com vantagem.

#### SEGUNDA RESPIRAÇÃO CELESTIAL: RESPIRAR

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Requer Primeira Respiração Celestial: Inalar ativo; você encerra aquele efeito, mantém seus benefícios e adiciona +2 em Força e Constituição.

#### APERTO CONSTRITOR DA COBRA

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Até 1 minuto
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Requer ter acertado o alvo neste turno; Você agarra o alvo enquanto tenta restringir seus movimentos, ele deve passar em um teste de Força ou fica Restrito, podendo tentar escapar como ação, enquanto você não pode usar selos de mão nem Taijutsus que exijam as mãos enquanto o segura.

#### DANÇA SELVAGEM

**Classificação:** Taijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Primeiro, você ataca seu oponente com um chute, seguido imediatamente por um soco e outro chute. Faça três ataques de Taijutsu, cada um causando seu dano desarmado + 1d6. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e avance o dado de dano em um passo.

### RANK-C

#### ÁCALA ADAMANTINA

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: Você desfere um chute extremamente poderoso no centro do corpo do alvo, esmagando seu centro de gravidade, quebrando sua postura e arremessando-o para trás. Faça um ataque de Taijutsu causando seu dano desarmado + 3d10; o alvo deve ser bem-sucedido em um teste de Constituição ou é arremessado 9 metros para trás. Em um sucesso, o alvo sofre apenas metade do dano e não é arremessado. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d10.

#### CHUTE CAUDA DE DRAGÃO

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você executa um chute giratório amplo, seguido por um chute vertical descendente que esmaga o alvo contra o solo. Criaturas a até 2 metros de você devem ser bem-sucedidas em um teste de Destreza ou ficam Incapacitadas até o início do próprio turno. Se uma criatura for Incapacitada por este jutsu, escolha um alvo e faça um ataque de Taijutsu causando seu dano desarmado + 4d8. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d8.

#### SACRIFÍCIO PRECOCE

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Reação, quando um ataque corpo a corpo errar você | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Após desviar de um ataque corpo a corpo, você salta sobre o ombro do inimigo e tenta arremessá-lo com violência. O alvo deve ser bem-sucedido em um teste de Força ou é arremessado 9 metros em linha reta, na direção que você escolher. O alvo arremessado deve então realizar um teste de Destreza, ficando Caído em caso de falha. Se colidir com uma superfície sólida ou objeto Grande ou maior, sofre dano como se tivesse caído.

#### PISADA DE QUEDA ERUPTIVA

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 5 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você canaliza chakra em suas pernas e golpeia o solo com força devastadora, liberando uma onda de choque puramente física. Criaturas em um cubo de 5 metros centrado em você devem realizar um teste de Força, sofrendo 4d8 de dano contundente em caso de falha. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d8.

#### ESMAGAMENTO CELESTIAL DO ENTARDECER

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Reação, quando um alvo for movido à força mais de 2 metros para longe de você | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você avança instantaneamente para acompanhar um inimigo arremessado ou repelido. Como parte da reação, você realiza corre em disparada, devendo encerrar o movimento a até 2 metros do alvo, e em seguida realiza um ataque desarmado contra o alvo.

#### QUEDA DO FALCÃO

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Finalizar

Descrição: O alvo deve estar no ar ou em queda. Você despenca junto dele e o crava violentamente no chão. Faça um ataque de Taijutsu; em um acerto, o alvo sofre 4d10 de dano contundente e fica Caído. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +2d10.

#### COBRA FEROZ

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você ataca com velocidade tão extrema que deixa imagens residuais no ar. Role 2d4; até o fim do turno, você pode usar sua Ação de Ataque para realizar um número de ataques desarmados igual ao resultado. Ataques feitos com este jutsu não podem causar acertos críticos.

#### PANCADA DE PUNHO

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: O alvo deve estar Caído. Você ergue o punho e o desce com força brutal. Faça um ataque de Taijutsu causando seu dano desarmado + 6d6; este ataque causa acerto crítico com resultados 19 ou 20 no dado. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d6.

#### POSTURA DA ÁGUA FLUENTE

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você relaxa o corpo e adota uma postura fluida, absorvendo impactos ao dobrar-se com o golpe. Sempre que sofrer dano contundente ou cortante, você pode usar sua Reação para rolar um Dado de Vida e reduzir o dano pelo resultado. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e role um dado de vida adicional.

#### TERCEIRA RESPIRAÇÃO CELESTIAL: ARFAR

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Requer Segunda Respiração Celestial ativa; você encerra aquela concentração e assume esta forma. Sua capacidade pulmonar é ampliada oito vezes, sua pele avermelha e seus músculos se expandem com o fluxo intenso de oxigênio. Aumente Força e Constituição em +2. Ao encerrar este jutsu, você sofre 1 nível de Exaustão.

#### QUARTA RESPIRAÇÃO CELESTIAL: OFEGAR

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Requer Terceira Respiração Celestial ativa; você encerra aquela concentração e assume esta forma. Sua capacidade pulmonar é ampliada dezesseis vezes, seu sangue acelera e um brilho amarelo envolve seu corpo, tornando músculos e órgãos extremamente resistentes. Aumente Força e Constituição em +2. Ao encerrar este jutsu, você fica Enfraquecido.

#### PALMA DE GRAMA

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você desfere uma sequência de golpes circulares visando desarmar e incapacitar inimigos próximos. Faça um ataque de Taijutsu contra cada criatura a até 2 metros, causando seu dano desarmado. Alvos atingidos devem passar em testes de Destreza ou ficam Desarmados, e em testes de Constituição ou ficam Enfraquecidos até o fim do próximo turno.

#### CONTRA-ATAQUE DE INTERSEÇÃO

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Reação, quando você for atingido por um ataque corpo a corpo | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você ergue o joelho e fecha o cotovelo ao mesmo tempo, aprisionando o ataque inimigo entre seus membros antes de revidar. Como parte da reação, faça um ataque de Taijutsu; em um acerto, o dano que você sofreria é reduzido em um valor igual ao seu dano desarmado + 2d6. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano reduzido em +1d6.

#### GRANDE CLARÃO DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você avança contra o alvo e desfere um chute lateral extremamente poderoso na altura da cabeça, causando um impacto suficiente para provocar uma forte concussão. Faça um ataque de Taijutsu causando seu dano desarmado + 7d4; o alvo deve ser bem-sucedido em um teste de Constituição ou fica Paralisado até o fim do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d4.

#### FURACÃO DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (esfera de 3 metros) | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você executa um chute giratório para trás com velocidade invisível a olho nu, criando um poderoso redemoinho ao seu redor. Criaturas em um raio de 3 metros devem realizar um teste de Destreza, sofrendo seu dano desarmado + 4d6 de dano contundente e ficando Caídas em caso de falha. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d6.

#### RAJADA DE LEÕES

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Finalizar

Descrição: O alvo deve estar no ar ou em queda. Você surge acima dele e desfere uma sequência brutal de ataques descendentes. Faça três ataques de Taijutsu causando seu dano desarmado + 2d8 cada; se todos os ataques atingirem, o alvo fica Incapacitado até o fim do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o número de ataques de Taijutsu em +1.

#### GOLPE DE PONTO DE PRESSÃO

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você desfere uma enxurrada de golpes precisos nos pontos vitais do alvo, desestruturando completamente seu corpo. Faça um ataque de Taijutsu causando seu dano desarmado + 5d4; o alvo deve ser bem-sucedido em um teste de Constituição ou fica Enfraquecido e Lento por 1 minuto. Ao final de cada turno, o alvo pode repetir o teste para encerrar um dos efeitos.

#### SOMBRA DA FOLHA DANÇANTE

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Reação, após conjurar um Taijutsu | **Alcance:** Deslocamento total | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Após executar um Taijutsu como Ação ou Ação Bônus, você se move em um borrão de sombras, teleportando-se instantaneamente para trás de um alvo dentro do seu deslocamento. Até o fim do turno, esse alvo pode ser atingido por Taijutsus com a palavra-chave Finalizar independentemente do alcance.

#### FORMA SILENCIOSA

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você assume uma forma furtiva ao liberar chakra pelos poros, abafando completamente os sons de seus movimentos. Todo deslocamento que você realiza se torna silencioso, incluindo objetos carregados e superfícies tocadas. Durante a duração, ataques não removem automaticamente sua furtividade, a menos que uma criatura consiga vê-lo no início do próprio turno, e ataques desarmados não podem ser reagidos.

#### QUEDA MORTAL DO REDEMOINHO

**Classificação:** Taijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Finalizar

Descrição: Você executa um chute giratório para trás, seguido por um poderoso chute descendente em machado e finaliza com um terceiro chute ascendente com a perna oposta. Faça três ataques de Taijutsu; em um acerto, cada ataque causa seu dano desarmado + 2d6. Se o alvo for atingido por ao menos dois ataques, deve ser bem-sucedido em um teste de Constituição ou fica Atordoado até o início do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e receba +1 nas jogadas de ataque deste jutsu.

### RANK-B

#### TÉCNICA DE PÓS-IMAGEM

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Reação, quando você é alvo de um ataque que possa ver | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você se move em velocidade extrema, deixando para trás uma pós-imagem criada apenas pela rapidez do seu deslocamento. Imediatamente antes do ataque atingir você, você se teleporta até seu deslocamento total para um espaço desocupado à sua escolha, deixando uma cópia ilusória no local original que se dissipa ao ser atingida pelo ataque inicial.

#### IMPACTO DA FLOR DE CEREJEIRA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: Você concentra uma quantidade absurda de chakra nas juntas dos dedos, liberando força suficiente para obliterar completamente uma área do tamanho de uma arena de 18 metros. Este Taijutsu possui duas variações: ao golpear um único alvo, faça um ataque de Taijutsu causando 5d12 de dano de concussão; o alvo deve ser bem-sucedido em um teste de Constituição ou fica Atordoado por 1d4 turnos. Alternativamente, ao socar o chão, todas as criaturas no solo em um raio de 18 metros devem realizar um teste de Destreza, sofrendo 6d6 de dano contundente e ficando Caídas em caso de falha, ou metade do dano em sucesso; a área afetada passa a ser considerada terreno extremamente difícil. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d12 (alvo único) ou +2d6 (área).

#### QUINTA RESPIRAÇÃO CELESTIAL: RESPIRAR PROFUNDO

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Requer a Quarta Respiração Celestial ativa; você encerra aquela concentração e assume esta forma. Suas veias e artérias se expandem drasticamente, o fluxo sanguíneo aumenta vinte vezes e sua aura gira e brilha intensamente. Aumente Força e Constituição em +2. Ao encerrar este jutsu, você fica Enfraquecido e Lento até concluir um descanso longo.

#### PÉ CELESTIAL DA DOR

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: Utilizando a mesma filosofia destrutiva do Impacto da Flor de Cerejeira, você concentra chakra no calcanhar, salta sobre o alvo e desce com força esmagadora. Faça um ataque de Taijutsu causando 6d10 de dano de concussão; criaturas ao redor em até 9 metros devem realizar um teste de Destreza, sofrendo 3d8 de dano de concussão devido ao colapso do ambiente, ou metade do dano em sucesso. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +2d10.

#### INCURSÃO DE CLAREZA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você libera uma onda purificadora de chakra pelo corpo, expulsando impurezas e restaurando o controle físico. Remova uma condição entre Cego, Enfeitiçado, Atordoado, Surdo, Amedrontado, Chocado, Lento ou Enfraquecido e ganha resistência à mesma condição por 1 minuto.

#### RAJADA DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal (cone de 9 metros) | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você varre o ar com a perna, criando uma poderosa onda de choque que esmaga e arremessa tudo à frente. Criaturas e objetos no cone devem realizar um teste de Força, sendo lançados 9 metros para cima em caso de falha, além de um teste de Constituição sofrendo 4d8 de dano contundente ou metade em sucesso; até o fim do turno, esses alvos podem ser atingidos por Taijutsus com a palavra-chave Finalizar independentemente do alcance.

#### VENTO QUENTE DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Deslocamento total | **Duração:** Instantânea
**Componentes:** M, CM | **Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: Você avança executando uma sequência de chutes giratórios tão violentos que incendeiam o ar ao redor de suas pernas. Escolha um espaço visível dentro do alcance e mova-se até ele atravessando criaturas; alvos escolhidos no caminho devem realizar um teste de Destreza, sofrendo seu dano desarmado + 8d6 de dano de fogo e ficando Queimados, ou metade do dano sem efeitos adicionais em sucesso. Se terminar o movimento a até 2 metros de um inimigo, faça um ataque de Taijutsu causando seu dano desarmado + 4d10 de dano de fogo; o alvo deve ser bem-sucedido em um teste de Constituição ou é empurrado 5 metros. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano do ataque final em +1d10.

#### BALA DO FURACÃO DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você desfere golpes tão intensos que comprimem o ar em projéteis de pressão concentrada. Faça dois ataques de Taijutsu causando 3d10 de dano contundente cada. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o número de ataques em +1.

#### SOCO METRALHADORA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você desfere uma sequência de socos tão rápida que o olho humano mal consegue acompanhar. Role 1d6 + seu modificador de Taijutsu; você realiza esse número de ataques desarmados, causando seu dano desarmado em cada acerto. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dado em um passo (1d6 → 1d8 → 1d10).

#### ENTRADA MÁXIMA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você se move como o vento, desaparecendo e reaparecendo entre os inimigos. Escolha até 5 criaturas visíveis no alcance e faça um ataque de Taijutsu corpo a corpo contra cada uma, causando seu dano desarmado + 5d8; ao final, você se teleporta para um espaço desocupado a até 2 metros de um dos alvos. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d8.

#### LÓTUS FRONTAL INDIVIDUAL

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Finalizar

Descrição: Requer Força 18 ou superior. Você salta alto e começa a girar como uma broca viva, criando redemoinhos de vento e poeira antes de despencar sobre o alvo. Faça um ataque de Taijutsu causando seu dano desarmado + 8d6; criaturas a até 3 metros do impacto devem realizar um teste de Destreza ou são empurradas 3 metros. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d8.

#### QUEDA DA CORUJA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Requer que você esteja oculto do alvo. Você despenca silenciosamente, envolvendo o pescoço do inimigo com as pernas e torcendo com força brutal. Faça um ataque de Taijutsu para agarrar; em sucesso, o alvo deve ser bem-sucedido em um teste de Constituição ou fica Inconsciente.

#### PUNHO DE PISTÃO

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: Você desfere um golpe direto enquanto libera uma explosão de chakra da articulação, forçando o impacto ainda mais fundo no alvo. Faça um ataque de Taijutsu causando seu dano desarmado + 12d4. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +2d4.

#### PERNA ESTREMECEDORA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você golpeia o alvo com uma vibração intensa de chakra, fazendo seus músculos falharem. Faça um ataque de Taijutsu; em um acerto, o alvo deve ser bem-sucedido em um teste de Constituição ou fica Enfraquecido e incapaz de realizar Reações até o fim do próximo turno.

#### GUARDA REVERSA

**Classificação:** Taijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Reação, ao sofrer dano de um ataque corpo a corpo | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você absorve o impacto do ataque inimigo e devolve a força acumulada em um contra-ataque devastador. Role 2d10 + seu bônus de ataque de Taijutsu; reduza o dano sofrido por esse valor e o agressor sofre a mesma quantidade como dano de concussão. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o valor rolado em +1d10.

### RANK-A

#### EXTENSOR DE COMBO

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Como requisito, você deve ter ativa pelo menos a Primeira Respiração Celestial ou qualquer Respiração Celestial posterior; enquanto suas Respirações Celestiais estiverem ativas, você ganha uma ação adicional e uma ação bônus adicional por turno, sendo que a ação extra só pode ser usada para a ação Atacar ou conjurar um Taijutsu com tempo de conjuração de 1 ação, e a ação bônus extra só pode ser usada para Correr, Desengajar ou conjurar Taijutsu com tempo de conjuração de ação bônus.

#### GOLPE INCAPACITANTE

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Você ataca diretamente as articulações dos inimigos visando incapacitação prolongada; faça um ataque de Taijutsu contra cada criatura à sua escolha dentro do alcance, cada alvo sofre seu dano desarmado, tem seu deslocamento reduzido à metade e não pode realizar Reações, além de realizar um teste de Constituição ficando Enfraquecido em caso de falha; ao final de cada turno, o alvo pode repetir o teste de Constituição para encerrar todos esses efeitos em caso de sucesso.

#### LÓTUS FINAL

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M, NT (Fio Ninja ou Fita de Contenção) | **Palavras-chave:** Taijutsu, Finalizar

Descrição: O alvo deve estar no ar ou em queda; faça cinco ataques de Taijutsu contra o alvo, e a cada acerto ele sofre seu dano desarmado + 2d8, aumentando o dado de dano em +1d8 a cada acerto consecutivo; se todos os cinco ataques acertarem, você ganha um sexto ataque que, em caso de acerto, causa 5d10 de dano de concução e derruba o alvo, e após a execução deste jutsu você ganha 3 níveis de Exaustão e reduz seus atributos de Força e Destreza para 8 por 10 minutos.

#### GUARDA DE FERRO

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 16 Chakra
**Tempo de Conjuração:** 1 Reação, ao ser atingido por um ataque | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Taijutsu

Descrição: Requer possuir um dos estilos de combate Punho de Ferro, Punho do Leão, Punho Silencioso ou Palma do Dragão; como reação ao ser atingido por um ataque, você adiciona seu bônus de proficiência a sua CA até o início do seu próximo turno.

#### MAGNUM DE PUNHO

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** CM, M | **Palavras-chave:** Taijutsu

Descrição: Você fortalece braços e pernas com chakra, elevando drasticamente seu poder de combate; durante a duração, você tem vantagem em ataques, todo dano de ataques desarmados aumenta em +1d8, e sempre que acertar um ataque desarmado o alvo deve ser bem-sucedido em um teste de Constituição ou sofre 1 nível de Exaustão por 1 minuto.

#### SEXTA RESPIRAÇÃO CELESTIAL: ARFAR

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Requer que a Quinta Respiração Celestial esteja ativa; você encerra aquela concentração e assume esta forma, mantendo todos os efeitos anteriores e adicionando os novos, duplicando o tamanho do coração e pulmões, você intensifica sua aura em uma formação semelhante a uma tempestade, aumentando Força e Constituição em +2 e concedendo imunidade a Veneno; ao encerrar este jutsu, você fica Enfraquecido, Lento e ganha 3 níveis de Exaustão até concluir um descanso longo.

#### VIOLÊNCIA SUPREMA

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** CM, M | **Palavras-chave:** Taijutsu

Descrição: Você impulsiona chakra pelo corpo a ponto de manipulá-lo apenas com o pensamento, mas não pode manter concentração em Ninjutsu ou Genjutsu durante a duração; enquanto ativo, sua CA aumenta em um valor igual aos modificadores de Sabedoria e Força somados, você ganha uma Reação adicional que só pode ser usada ao ser alvo de um ataque, e ao usar essa reação você recebe os benefícios da ação Esquivar contra esse ataque específico.

#### LÍRIO DE TIGRE

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 9 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** CM, M | **Palavras-chave:** Taijutsu

Descrição: Você entra em um estado absoluto de serenidade e clareza, percebendo o mundo sem falhas; durante a duração, você ganha Sentido Sísmico e Visão às Cegas em um alcance de 18 metros e se torna imune a Genjutsus Visuais.

#### ESTRANGULAMENTO VIOLENTO

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 15 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Taijutsu

Descrição: Com um movimento brutalmente rápido, você agarra a garganta do alvo antes que ele possa reagir; faça um ataque de Taijutsu e, em um acerto, o alvo fica Agarrado e Restrito, não pode realizar selos de mão enquanto você controla um de seus braços, ganha 1 nível de Exaustão imediatamente e mais 1 nível de Exaustão no início de cada um de seus turnos, podendo usar sua ação para realizar um teste de Força para escapar.

#### QUEBRADOR DE MUNDOS

**Classificação:** Taijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Taijutsu

Descrição: Você golpeia o solo com força catastrófica, devastando completamente a área ao redor; todas as criaturas em um cubo de 27 metros centrado em você devem realizar um teste de Destreza, sofrendo 10d10 de dano contundente em caso de falha, enquanto o terreno se fragmenta violentamente, tornando a área terreno difícil e fazendo com que criaturas a mais de 3 metros umas das outras fiquem Pesadamente Obscurecidas entre si.

### RANK-S

#### ELEFANTE DO ANOITECER (SEKIZO)

**Classificação:** Taijutsu | **Rank:** Rank-S | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Linha de 18 metros | **Duração:** Instantânea
**Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: A culminação suprema do taijutsu ofensivo, onde você desfere uma sequência devastadora de golpes. Faça 5 ataques de Taijutsu contra a criatura alvo; cada ataque gera uma poderosa onda de choque que se estende em uma linha de 18 metros por 5 metros de largura atrás do alvo inicial. Em caso de acerto, o alvo principal sofre 10d12 de dano contundente, enquanto todas as criaturas na área atrás dele devem realizar um teste de Destreza, sofrendo 10d8 de dano de força em falha ou metade do dano em sucesso.

#### DEUS DRAGÃO DA FOLHA

**Classificação:** Taijutsu | **Rank:** Rank-S | **Custo:** 28 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Instantânea
**Palavras-chave:** Taijutsu, Finalizar, Disputa

Descrição: Um taijutsu supremo criado por um mestre lendário, no qual você executa um chute giratório ascendente que rapidamente se transforma em um tornado hiper pressurizado, moldado na forma de um dragão com longos bigodes. Você se move até 37 metros em qualquer direção, inclusive por paredes e curvas, e todas as criaturas pelas quais você passar devem realizar um teste de Destreza, sendo puxadas para dentro do tornado e arremessadas ao final do movimento, aterrissando a 2 metros de você e sofrendo 12d8 de dano contundente em falha ou metade do dano em sucesso. Criaturas que falharem também devem realizar um teste de Constituição, sofrendo 6d8 de dano cortante adicional causado pelos detritos capturados pelo tornado em falha, ou metade do dano em sucesso.

#### LÓTUS VERMELHO

**Classificação:** Taijutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** 1 minuto
**Palavras-chave:** Taijutsu

Descrição: Você entra em um estado de instinto absoluto e foco total, sacrificando qualquer pensamento consciente. Como parte da ativação deste jutsu, você não pode manter concentração em Ninjutsu ou Genjutsu durante sua duração, e passa a poder realizar um número de Ações Bônus por rodada igual ao seu bônus de proficiência.

#### SÉTIMA RESPIRAÇÃO CELESTIAL: EXALAR

**Classificação:** Taijutsu | **Rank:** Rank-S | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 10 minutos
**Componentes:** CM | **Palavras-chave:** Taijutsu

Descrição: Para ativar este jutsu, você deve estar sob efeito da Sexta Respiração Celestial: Arfar, encerrando sua concentração nela e substituindo-a por esta, mantendo todos os efeitos anteriores. Você remove completamente os limitadores do coração, permitindo que ele bombeie uma quantidade incalculável de oxigênio pelo corpo, fazendo sua aura assumir uma forma escolhida como caveiras, olhos ou demônios e aumentando seus valores de Força e Constituição em +2. Ao encerrar este jutsu, você fica Enfraquecido e Lento, adquire 5 níveis de Exaustão até concluir um descanso longo, e não pode usar este jutsu novamente por 1d4 anos, a menos que receba Regeneração diariamente por duas semanas consecutivas.

## Bukijutsu

### RANK-D

#### GOLPE ESMAGADOR DE 1 TIRO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** W (Contusão), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você executa um golpe ascendente com sua arma, atingindo o alvo de baixo para cima com força esmagadora. Faça um ataque de Taijutsu com sua arma causando 2d10 de dano de contusão; o alvo deve ser bem-sucedido em um teste de resistência de Constituição ou tem sua CA reduzida em 1d4 até o início do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d10.

#### CORTE CRUZADO DUPLO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** W (Corte), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você realiza dois cortes em ângulos opostos formando um “X”. Faça dois ataques de Taijutsu com sua arma, cada um causando 3d4 de dano cortante; o alvo deve realizar um teste de resistência de Constituição ou sofre a condição Sangramento. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d4.

#### PERFURAÇÃO DE 3 PONTOS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** W (Perfuração), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você executa três estocadas rápidas visando pontos vitais. Faça três ataques de Taijutsu com sua arma, cada um causando 1d8 de dano perfurante; o alvo deve ser bem-sucedido em um teste de Constituição ou perde sua Reação. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o número de ataques em +1.

#### PUXÃO DE CORRENTE

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Alcance da Arma | **Duração:** Instantânea
**Componentes:** W (Alcance, Agarrar), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você arremessa sua arma envolvendo o alvo e o puxa em sua direção. O alvo deve ser bem-sucedido em um teste de resistência de Força ou é movido 4 metros em sua direção; se terminar a até 2 metros de você, você pode realizar um novo ataque como parte da mesma ação.

#### ABRAÇO ACORRENTADO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Alcance da Arma | **Duração:** 1 Rodada
**Componentes:** W (Alcance, Agarrar), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você lança sua arma que se enrola no alvo, restringindo seus movimentos. O alvo deve ser bem-sucedido em um teste de Destreza ou fica Contido; no início de cada turno, pode repetir um teste de Força para escapar.

#### CHICOTE DOS TOLOS DANÇANTES

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (Cone de 5 metros) | **Duração:** 1 Rodada
**Componentes:** W (Fio de Batalha, Chicote, Foice Acorrentada), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você chicoteia sua arma com força devastadora. Criaturas no cone devem realizar um teste de Destreza; falha: 4d4 de dano cortante e Sangramento, sucesso: metade do dano.

#### AGULHAS DEBILITANTES

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** 1 Rodada
**Componentes:** W (Senbon), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você arremessa agulhas mirando pontos de pressão. Faça um ataque de Taijutsu à distância causando 3d6 de dano perfurante; o alvo deve ser bem-sucedido em um teste de Constituição ou fica Paralisado até o final do próximo turno; em sucesso, sofre metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d6.

#### ANDORINHA VOADORA: CORTE CRUZADO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** 1 Rodada
**Componentes:** W (Corte), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Empunhando duas armas, você realiza dois cortes simultâneos. Faça uma Disputa de Bukijutsu contra até dois inimigos adjacentes causando dano da arma +1d10; se atingir ambos, cause dano da arma +2d8. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o número de alvos em +1.

#### DEFLEXÃO DA TEIA DE FERRO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Reação ao sofrer dano | **Alcance:** Pessoal | **Duração:** 1 Rodada
**Componentes:** W (Fio de Batalha, Lança Acorrentada) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você se envolve com correntes para amortecer o impacto, recebendo 2d8 Pontos de Vida Temporários até o início do seu próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e os PV Temporários em +2d8.

#### BARRAGEM DE KUNAIS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra, 10 Kunai ou Shuriken
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (Esfera de 10 metros) | **Duração:** Instantânea
**Componentes:** W (Kunai, Shuriken), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você salta e gira lançando armas contra até 10 criaturas visíveis, realizando um ataque de Taijutsu à distância contra cada uma causando 2d6 do tipo da arma. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d6.

#### ARMAS MANIPULADAS: METEORO APRISIONADOR

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 8 metros | **Duração:** Instantânea
**Componentes:** W (Pergaminho de Armas), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você invoca correntes pesadas que agarram o alvo. Faça um ataque de Taijutsu; em caso de acerto, o alvo fica Agarrado e deve passar em um teste de Destreza ou fica Totalmente Contido e incapaz de fazer selos. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o alcance em +2 metros.

#### ARMAS MANIPULADAS: CHUTE DE LÂMINAS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** Instantânea
**Componentes:** W (Pergaminho de Armas), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você invoca armas e as lança com um chute preciso. Faça um ataque de Taijutsu à distância causando 2d10 de dano perfurante. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d10.

#### ARMAS MANIPULADAS: MURO DE LÂMINAS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (Raio de 4 metros) | **Duração:** Instantânea
**Componentes:** W (Pergaminho de Armas), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você cria um círculo de lâminas ao seu redor. Criaturas na área devem realizar um teste de Destreza; falha: 2d8 de dano perfurante e Sangramento, sucesso: metade do dano. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +2d8.

#### PRESA DO REI MACACO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** W (Contusão), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você gira sua arma acima da cabeça e desfere um golpe descendente seguido por um impacto com a extremidade oposta. Faça dois ataques de Taijutsu causando dano da arma +1d8 cada; se ambos acertarem, o alvo deve ser bem-sucedido em um teste de Constituição ou fica Atordoado por 2 minutos, podendo repetir o teste ao final de cada turno para encerrar o efeito. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o número de ataques em +1.

#### TÉCNICA DE DISPARO MÚLTIPLO COM ARCO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 19 metros | **Duração:** 1 Rodada
**Componentes:** W (Qualquer Arco) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você prepara rapidamente cinco disparos, ficando atento a movimentos hostis. Criaturas dentro do alcance provocam um ataque ao se moverem pela primeira vez; você ganha 5 Reações adicionais que só podem ser usadas para ataques de Taijutsu à distância. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o número de Reações adicionais em +1.

#### CHUVA DE AGULHAS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra, 10 Senbon
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros (Círculo de 7 metros) | **Duração:** Instantânea
**Componentes:** W (Senbon), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você espalha Senbon pelo chão na área escolhida. A área se torna terreno difícil e criaturas que se movem dentro dela sofrem 1d4 de dano perfurante a cada 2 metros percorridos; espaços já atravessados deixam de ser terreno difícil. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o raio da área em +2 metros.

#### BARRAGEM DE SELOS EXPLOSIVOS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** NT (Bomba de Papel) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você lança um conjunto de cinco Bombas de Papel contra um alvo visível. O alvo deve realizar um teste de Destreza, sofrendo 10d4 de dano de fogo em falha ou metade em sucesso; criaturas a até 3 metros do alvo também realizam o teste, sofrendo 7d4 de dano de fogo em falha ou metade em sucesso. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d4.

#### TÉCNICA DO DISPARO PREPARADO DE AGULHAS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Reação ao ser alvo de um ataque corpo a corpo | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Senbon), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você reage a um ataque próximo lançando Senbon contra o agressor. Faça um ataque de Taijutsu causando 3d8 de dano perfurante; o alvo deve ser bem-sucedido em um teste de Constituição ou fica Atordoado até o início do próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d8.

#### DANÇA DAS SHURIKENS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 10 metros | **Duração:** Instantânea
**Componentes:** W (Kunai, Shuriken, Dardos), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você lança armas arremessáveis em todas as direções. Criaturas na área devem realizar um teste de Destreza, sofrendo 3d6 de dano do tipo da arma em falha ou metade em sucesso. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d6.

#### CAÇA DE ALMA

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 37 metros | **Duração:** 1 Rodada
**Componentes:** W (Qualquer Arco), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você dispara uma flecha imbuída de chakra; o próximo ataque à distância com arco acerta um crítico com resultados 19 ou 20 no d20. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e a margem de crítico em +1.

#### LÍNGUA CHICOTEANTE DO SAPO

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 10 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** W (Chicote), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você imbuí seu chicote com chakra, controlando sua trajetória; enquanto durar, ataques com chicote recebem +1 nas jogadas de ataque e dano, além de quaisquer bônus do chakra da arma.

#### QUEBRA DE ARMA

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Reação ao sofrer dano corpo a corpo | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** W (Braçadeiras de Combate, Garra de Ferro, Jitte), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você prende a arma inimiga em um golpe de contenção. O atacante deve ser bem-sucedido em um teste de Destreza ou sua arma mundana é destruída; armas de chakra só podem ser quebradas por armas de chakra de força igual ou superior.

#### DEFLETIR ARMA

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Reação ao ser alvo de um ataque corpo a corpo visível | **Alcance:** Pessoal | **Duração:** 1 Rodada
**Componentes:** W (Qualquer Arma), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você entra em postura defensiva e faz uma Disputa de Bukijutsu contra o oponente; se vencer, ganha +3 de CA e +1d6 de dano no próximo ataque, se perder, ganha +1 de CA. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano adicional em +1d6.

#### ARMADILHA DE FIOS

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 10 Minutos (1 Minuto com Kit de Armadilhas) | **Alcance:** Cubo de 3 metros | **Duração:** Instantânea
**Componentes:** NT (Fio de Batalha, Corda) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você prepara uma armadilha que ativa quando criaturas entram na área. O alvo deve ser bem-sucedido em um teste de Destreza ou fica Contido, podendo tentar escapar com um teste de Força.

#### CORTE DE YOSAKU

**Classificação:** Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal (Cone de 5 metros) | **Duração:** Instantânea
**Componentes:** W (Machado, Machado Grande, Naginata), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você desfere um golpe lateral criando uma onda cortante; criaturas no cone fazem um teste de Destreza, sofrendo 4d4 de dano cortante em falha ou metade em sucesso, e criaturas a até 2 metros de você fazem o teste com desvantagem sofrendo 4d6 em falha; até o fim do turno, o alvo pode ser atingido por Bukijutsu com a palavra-chave Finalizar ignorando alcance. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o alcance em +2 metros.

### RANK-C

#### BRILHO RESIDUAL

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** W (Cortante, Perfurante), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você empunha sua arma em pegada reversa e avança a velocidades cegantes até um ponto escolhido no alcance; todas as criaturas pelas quais você passar são alvos de ataques, realizando um teste de ataque de Taijutsu contra cada uma e causando dano da arma +4d6, encerrando o movimento no espaço escolhido; até o fim do turno, o alvo pode ser atingido por Bukijutsu com a palavra-chave Finalizar ignorando alcance. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d6.

#### CONEXÃO DE FORÇA BRUTA

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros (Esfera de 3 metros) | **Duração:** Instantânea
**Componentes:** W (Contusão) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você concentra todo o peso em um golpe devastador contra um alvo visível, causando dano da arma +3d8 e derrubando-o no chão; criaturas em um raio de 3 metros do alvo devem ser bem-sucedidas em um teste de Constituição ou também ficam Caídas. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d8.

#### FLORESCER VELOZ

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** W (Braçadeiras de Combate, Garra de Ferro) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você assume uma postura defensiva protegendo o corpo com suas armas; enquanto mantiver a postura, sua CA aumenta em metade do seu bônus de proficiência.

#### SABRE DE CHAKRA

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração
**Componentes:** W (Arma Improvisada), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você quebra parte de uma arma improvisada e solidifica chakra ao redor dela, formando uma arma de sua escolha com a qual seja proficiente; enquanto durar, o dado de dano da arma improvisada se torna o da arma escolhida.

#### DECAPITAÇÃO DA LUA CRESCENTE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Cortante) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Empunhando a arma com ambas as mãos, você desfere um golpe brutal; em um acerto, causa dano da arma +4d10 e, se 4 ou mais resultados 10 forem obtidos nos dados, o alvo é decapitado imediatamente. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d10.

#### INCAPACITAÇÃO DA LUA CRESCENTE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Contusão) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você gira com força extrema e atinge o alvo causando dano da arma +5d8; se 5 ou mais resultados 8 forem obtidos, o alvo fica permanentemente Atordoado e Enfraquecido até ser curado por Restauração de Rank-B ou superior. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d8.

#### PENETRAÇÃO DA LUA CRESCENTE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Perfurante) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você ataca visando o coração do inimigo, causando dano da arma +7d6; se 7 ou mais resultados 6 forem obtidos, o alvo morre instantaneamente. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d6.

#### IMPACTO DO CIPRESTE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 28 metros (Esfera de 10 metros) | **Duração:** Instantânea
**Componentes:** W (Qualquer Arco), CS | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você dispara uma chuva de projéteis ancorados por chakra; criaturas na área devem realizar um teste de Destreza, sofrendo dano da arma +3d8 e ficando Contidas em falha, ou metade do dano em sucesso. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d8.

#### PERFORMANCE DA DANÇA: SEGUNDO PASSO

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** W (Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você gira violentamente a arma atingindo todas as criaturas adjacentes, que devem realizar um teste de Destreza ou sofrer dano da arma +5d4. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +2d4.

#### RISCO DA LÂMINA DANÇANTE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** W (Cortante) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Se você se mover ao menos 6 metros antes de atacar, sua margem de crítico aumenta em +1 e o dano da arma aumenta em +1d8. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e a margem de crítico em +1.

#### QUEBRADOR DE TERRA

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal (Raio de 8 metros) | **Duração:** Instantânea
**Componentes:** W (Contusão) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você golpeia o solo com força sísmica; criaturas na área sofrem 2d12 de dano contundente e ficam Caídas em falha, e se houver uma criatura Caída a até 2 metros de você, pode realizar um ataque adicional causando 4d12. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d12.

#### LÂMINA CADENTE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Cortante) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você executa um golpe descendente previsível, realizando o ataque com desvantagem; em um acerto, causa 6d10 de dano cortante e aplica Sangramento por 1 minuto. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +2d10.

#### ANDORINHA VOADORA: PERFURAR

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Perfurante) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você impulsiona o corpo com chakra e perfura o alvo, causando dano da arma +5d6 e reduzindo a CA do alvo em 1d4 até o fim do seu próximo turno em falha no teste de Constituição. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +2d6.

#### DECAPITAÇÃO FRONTAL

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** X Chakra
**Tempo de Conjuração:** Ação Bônus (após uma utilização de ataque de Bukijutsu) | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** W (Corte, Perfuração), M | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você inverte o cabo da sua arma para realizar outro ataque, mas de forma oposta. Você executa seu ataque Bukijutsu anterior novamente, como se o tivesse conjurado outra vez. O custo de Chakra é 3 vezes o custo do jutsu usado anteriormente. Até o final do seu turno, o alvo pode ser alvo de bukijutsu com a palavra-chave Finalizar, independentemente do alcance do bukijutsu com a palavra-chave Finalizar usado.

#### CONTRA-ATAQUE MIKIRI

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Reação ao ser atingido por ataque corpo a corpo | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M, W (Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você anula o ataque inimigo com um contra-movimento; faça uma Disputa de Bukijutsu, em uma vitória, o inimigo erra o ataque, você realiza um ataque corpo a corpo e reduz a CA do alvo em 1d4 até o início do próximo turno.

#### ELO DE ESFAQUEAMENTO ASSASSINO

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 5 metros | **Duração:** Instantânea
**Componentes:** W (Perfurante) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você desfere estocadas em linha reta até o alvo mais próximo ao seu alcance, causando 4d10 de dano perfurante e aplicando Sangramento. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d10.

#### CORTE DE ONDA DE CHOQUE

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Linha de 10 metros por 2 metros | **Duração:** Instantânea
**Componentes:** W (Cortante), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Uma lâmina de chakra corta tudo à frente; criaturas na área sofrem 8d4 de dano cortante em falha no teste de Destreza ou metade em sucesso. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +2d4.

#### LÂMINAS TRIPLAS DE MOINHO DE VENTO

**Classificação:** Bukijutsu | **Rank:** Rank-C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Instantânea
**Componentes:** W (Arremesso, Fio de Batalha) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Armas presas por fios envolvem o alvo; em falha no teste de Destreza, o alvo fica Contido e testes de Força para escapar são feitos com desvantagem, sendo liberado se sofrer dano.

### RANK-B

#### GOLPE PERFURANTE DE 1 ATAQUE

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M, W (Perfuração) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você concentra todo o seu foco em um único ataque perfurante, destinado a encerrar o combate naquele instante. Faça um teste de ataque de Taijutsu, causando 9d8 de dano perfurante e forçando a criatura alvo a realizar um teste de resistência de Constituição; em caso de falha, ela fica Paralisada. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d8.

#### PUNIÇÃO DA AMPUTAÇÃO

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 3 metros | **Duração:** Instantânea
**Componentes:** M, W (Foice de Mão com Corrente, Foice de Mão, Foice) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você salta sobre o oponente, enganchando sua lâmina em um dos membros e puxando com violência para decepá-lo. Faça um ataque de Taijutsu causando 6d10 de dano cortante; o alvo deve ser bem-sucedido em um teste de resistência de Destreza ou começa a sangrar e fica incapaz de usar um de seus braços até concluir um descanso curto ou longo.

#### SALTO COMBO

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Alcance da Arma | **Duração:** Instantânea
**Componentes:** M, W (Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu, Combo

Descrição: Você salta por cima do inimigo, aterrissa atrás dele e avança de volta à sua posição original, golpeando-o ao passar. Faça três ataques de Taijutsu com arma, causando o dano da arma em cada acerto; até o final do seu turno, o alvo pode ser afetado por bukijutsu com a palavra-chave Finalizar independentemente do alcance.

#### CONTRA-ATAQUE

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Reação, ao ser alvo de um ataque | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M, W | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Ao ser atacado, você aceita o golpe de frente para travar o oponente, impedindo sua evasão. Você sofre o dano completo do ataque e, imediatamente após, pode realizar um bukijutsu com tempo de conjuração de 1 Ação ou 1 Ação Bônus; até o final do turno, o alvo pode ser afetado por bukijutsu com a palavra-chave Finalizar independentemente do alcance.

#### COSTURA DA ARANHA TERRESTRE

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 13 Chakra
**Tempo de Conjuração:** 10 Minutos | **Alcance:** Cubo de 18 metros | **Duração:** 1 Hora
**Componentes:** M, W (Fio de Batalha) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você espalha fios extremamente cortantes próximos ao solo, criando uma armadilha mortal. Escolha um cubo de 18 metros; criaturas escolhidas por você não são afetadas. A área conta como terreno difícil; criaturas que conjuram jutsus com componente de Mobilidade devem passar em um teste de Destreza ou ficam Restritas, e ataques com arma exigem teste de Força ou a arma fica presa.

#### ECLIPSE

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M, W (Impacto) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você assume uma postura defensiva implacável, segurando sua arma com firmeza. Durante a duração, ataques com bukijutsu ou armas de impacto aumentam o nível de exaustão do alvo em 1 por 1 minuto.

#### NOITE NEBULOSA

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M, W (Corte) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Seus movimentos são tão precisos que criam pós-imagens constantes. Durante a duração, bukijutsu com armas cortantes que forçam testes de resistência são sempre realizados com desvantagem para os alvos.

#### ICHIMONJI

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M, W (Corte) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você executa dois cortes devastadores, um descendente e outro ascendente. Faça dois ataques de Taijutsu contra um único alvo, causando 5d6 de dano cortante em cada acerto. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d6.

#### LUAR

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M, W (Perfuração) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você prepara sua arma para perfurar qualquer obstáculo. Durante a duração, todo dano perfurante causado por bukijutsu ou ataques com arma causa dano máximo.

#### SAQUE RÁPIDO

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Rodada Completa | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M, W (Corte) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você assume uma postura contida e prepara um ataque devastador. No início do seu próximo turno, todas as criaturas à sua frente em alcance corpo a corpo devem passar em um teste de Destreza com desvantagem ou sofrem 8d12 de dano. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e +1d12.

#### EXECUÇÃO SILENCIOSA

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 10 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M, W (Corte, Perfuração) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Estando escondido do alvo, você ataca seus pontos vitais. Faça um teste de Taijutsu contra o alvo; em sucesso, cause 15d4 de dano do tipo da arma escolhida. Se reduzir os PV do alvo a 0, ele é morto imediatamente. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +2d4.

#### BOMBARDEIO SUICIDA

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Reação | **Alcance:** Esfera de 9 metros | **Duração:** Instantânea
**Componentes:** M, NT (Bombas de Papel) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você detona bombas presas ao seu corpo. Todas as criaturas na área devem passar em um teste de Destreza com desvantagem ou sofrem 15d6 de dano de fogo; você sofre o dano completo.

#### DRAGÕES GÊMEOS ASCENDENTES

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Esfera de 18 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** M, NT (Pergaminhos de Armas) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você libera armas seladas em espiral, mantendo-se suspenso por fios. Durante a duração, você pode realizar até 3 ataques de Taijutsu à distância por rodada, cada um causando 5d6 de dano perfurante.

#### GOLPE DO REDEMOINHO

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 10 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M, W (Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você gira violentamente, atingindo todos ao redor. Criaturas a até 2 metros devem passar em um teste de Destreza ou sofrem o dano da arma + 5d10. Em Ranks Superiores: Para cada rank acima de Rank-B, aumente o custo em +3 Chakra e o dano em +1d10.

#### CRUCIFICAÇÃO POR FIOS

**Classificação:** Bukijutsu | **Rank:** Rank-B | **Custo:** 10 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Instantânea
**Componentes:** M, W (Fio de Batalha) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você ativa fios já posicionados ao redor do alvo. Ele deve passar em um teste de Destreza ou fica Restrito, Paralisado e Sangrando; no turno dele, pode tentar um teste de Força para se libertar.

### RANK-A

#### GOLPE NECRÓTICO

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 2 minutos
**Componentes:** M, W (Corte, Perfuração), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você concentra seu chakra e o injeta em sua arma; como parte da ativação, faça um ataque com arma e, em caso de acerto, cause o dano da arma e cubra-a com o sangue do alvo, fazendo com que, durante a duração, o tipo de dano da arma se torne necrótico e ela passe a causar 8d6 de dano necrótico em vez de seu dano normal. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +1d6.

#### PRESA PERSEGUIDORA

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Até seu deslocamento total | **Duração:** Instantânea
**Componentes:** M, W (Arremesso e Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você lança um punhado de armas de arremesso para quebrar a concentração do alvo; faça um ataque de Taijutsu à distância causando 3d4 de dano perfurante e, em seguida, realize um ataque poderoso corpo a corpo com vantagem, tratando-o como crítico com rolagens de 18–20 e causando o dano da arma + 9d10. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +1d10.

#### DANÇA DA LUA CRESCENTE

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Até seu deslocamento total | **Duração:** Instantânea
**Componentes:** M, W (Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você se move em velocidade extrema criando duas pós-imagens independentes; faça três ataques de Taijutsu contra um único alvo causando o dano da arma, e se todos acertarem, cause dano adicional de 10d10 do mesmo tipo da arma e o alvo não pode realizar reações por 1 minuto. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +1d10.

#### IMPACTOS DO SOL ECLIPSADO

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Até seu deslocamento total | **Duração:** Instantânea
**Componentes:** M, W (Impacto) | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você avança com sua arma seguindo um caminho predestinado, golpeando com força suficiente para incendiar o impacto; faça um ataque de Taijutsu causando o dano da arma + 12d8, e o alvo fica em chamas até extinguir o fogo. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +1d8.

#### INSTINTOS FATAIS

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M, CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você injeta chakra em cada músculo e assume controle absoluto do corpo; durante a duração, sua iniciativa aumenta em +10, testes de resistência de Destreza são feitos rolando 3d20 e mantendo o maior resultado, você ganha 2 Reações adicionais e 2 Ações Bônus adicionais, e ao final do efeito você fica Atordoado por 1 minuto.

#### TIRO PERFURANTE DA LUA

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 19 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 92 metros | **Duração:** Instantânea
**Componentes:** M, W (Qualquer Arco), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você envolve sua flecha ou virote em chakra visível antes de disparar; faça um ataque de Taijutsu à distância que acerta crítico com 19–20 e, em caso de acerto, cause o dano da arma + 14d6, além de aplicar Sangramento, Atordoamento por 1 minuto e Derrubar o alvo. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +1d6.

#### FORÇA PROJETADA

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** M, W (Qualquer), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você libera uma enorme quantidade de chakra em sua arma, disparando uma onda de força em linha reta até o primeiro inimigo atingido; faça um ataque de Taijutsu à distância causando 8d12 de dano de força. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +2d12.

#### REVERSÃO

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 17 Chakra
**Tempo de Conjuração:** 1 Reação, quando uma criatura se move a até 2 metros de você | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M, W | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você executa um salto mortal defensivo enquanto ataca, movendo-se até o restante do seu deslocamento sem provocar ataques de oportunidade e realizando um ataque de Taijutsu causando o dano da arma. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +2d4.

#### INVESTIDA DAS SOMBRAS

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 27 metros | **Duração:** Instantânea
**Componentes:** M, W (Corte, Perfuração), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você se envolve em uma aura sombria e avança contra o alvo, realizando um ataque de Taijutsu que causa o dano da arma + 8d4; o alvo deve passar em um teste de Constituição ou você salta metade do seu deslocamento no ar, podendo usar um bukijutsu com a palavra-chave Finalizar como parte da ação, e até o final do turno o alvo pode ser afetado por Finalizar independentemente do alcance. Em Ranks Superiores: Para cada rank acima de Rank-A, aumente o custo em +3 Chakra e o dano em +2d4.

#### CRUZ SHINOBI

**Classificação:** Bukijutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M, W (Qualquer) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você assume uma postura impecável sem aberturas; durante a duração, sempre que for alvo de um ataque, você pode conjurar um bukijutsu com tempo de conjuração de 1 Ação como uma Reação.

### RANK-S

#### FORÇA VIVA

**Classificação:** Bukijutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Instantânea
**Componentes:** M, W, CM | **Palavras-chave:** Taijutsu, Bukijutsu, Finalizar

Descrição: Você libera emoções negativas fundidas ao chakra em um único golpe devastador; faça um ataque de Taijutsu causando o dano da arma + 25d6, e criaturas em uma esfera de 5 metros ao redor do alvo devem passar em um teste de Destreza ou sofrem 8d8 de dano de força, ou metade em sucesso.

#### SAQUE MORTAL

**Classificação:** Bukijutsu | **Rank:** Rank-S | **Custo:** 25 Chakra + metade dos seus PV máximos
**Tempo de Conjuração:** 1 Ação | **Alcance:** Pessoal | **Duração:** Concentração, até 1 minuto
**Componentes:** M, W (Corte, Perfuração), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você atravessa o próprio corpo com sua arma, perdendo metade dos seus PV máximos de forma irredutível; durante a duração, o alcance da arma dobra, seu dano se torna necrótico, ignora resistência e imunidade, causa +4d12 de dano adicional e causa dano dobrado contra estruturas.

#### QUEDA DAS SOMBRAS

**Classificação:** Bukijutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** 1 Rodada
**Componentes:** CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você libera um surto extremo de chakra, ganhando 3 Ações adicionais até o final do turno, que podem ser usadas para conjurar múltiplos bukijutsu em sequência; ao final do turno, você ganha 3 níveis de Fadiga.

#### DIVISOR DOS CÉUS

**Classificação:** Bukijutsu | **Rank:** Rank-S | **Custo:** 30 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 31 metros | **Duração:** Instantânea
**Componentes:** M, W (Qualquer), CM | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você desfere um golpe capaz de rasgar o céu e a terra; criaturas em uma linha de 31 metros por 5 metros devem passar em um teste de Destreza ou sofrem 25d10 de dano de força, ou metade em sucesso, criando uma fenda de 15 metros de profundidade, e criaturas a mais de 2 metros da borda devem passar em um teste de Destreza ou cair.

#### PASSAGEM DA NUVEM ESPIRAL

**Classificação:** Bukijutsu | **Rank:** Rank-S | **Custo:** 25 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M, W (Corte) | **Palavras-chave:** Taijutsu, Bukijutsu

Descrição: Você salta no ar desferindo cortes contínuos; faça 3 ataques de Taijutsu e todas as criaturas escolhidas a até 8 metros são alvos, sofrendo o dano da arma + 8d8 de dano cortante por acerto, e se qualquer ataque for crítico, todas as criaturas sofrem os efeitos do acerto crítico.

## Jutsus Exclusivos de Clã (Hijutsu)

### ABURAME

#### CASULO HUMANO

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 3 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** 12 horas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Usando os insetos que habitam seu corpo, você cria um casulo grande o suficiente para segurá-lo e pendurá-lo em qualquer superfície que possa prendê-lo. Este casulo é à prova d’água e pode ser usado como um saco de dormir, permitindo que você flutue acima do solo, longe de criaturas terrestres que não podem alcançá-lo. Enquanto estiver dentro do seu casulo, você parece um grande inseto passando por metamorfose sem atrair a atenção de outras criaturas. Ao rolar furtividade enquanto estiver suspenso dentro de seu casulo, role com vantagem. Se usado como parte de um descanso curto ou longo, você recupera o máximo possível de pontos de vida ou chakra de dados de vida e dados de chakra rolados.

#### ESFERA DE INSETOS

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Concentração, 3 rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você envia um enxame de insetos para prender uma criatura alvo. O alvo deve fazer um teste de resistência de Destreza, falhando recebe 4d4 de dano Perfurante no final de cada um de seus turnos. As criaturas/alvo fazem um teste de resistência de Destreza no começo de cada um de seus turnos para encerrar o jutsu. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d4.

#### DESTRUIÇÃO PARASITÁRIA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 20 metros | **Duração:** Instantânea
**Componentes:** HS | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você envia seu enxame de insetos para atingir uma criatura alvo no alcance. Este jutsu ignora cobertura. Faça um ataque de ninjutsu à distância, causando 4d6 de dano perfurante em um acerto. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e Dano por 2d6

#### FORMAÇÃO REDEMOINHO DE INSETOS

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, 5 rodadas
**Componentes:** HS | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você cria um anel de insetos que gira violentamente ao seu redor. Qualquer um em uma esfera de 2 metros de raio centrada em você devem ser bem-sucedidas em um teste de resistência de Constituição, caso contrário, sofrem 3d8 de dano ao iniciarem seus turnos no raio ou tentarem entrar no raio. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 1d8 Rank - C:

#### CLONE DE INSETO

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 7 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, 6 rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Sua variação do jutsu do clone das sombras. Você cria um único clone de si mesmo formado por insetos. Este clone não possui armas ou ferramentas e não pode falar. Como uma ação de bônus, você pode comandar o clone para realizar uma ação padrão e de movimento. O clone tem 5 pontos de vida e nenhum Chakra, sendo capaz de executar apenas até 2 jutsus do clã Aburame de Rank-D que você já conheça. Depois que o clone atingir 0 pontos de vida, realizar 2 jutsus do clã, ou for dispensado, o jutsu termina. O Clone tem CA igual à sua. O Clone não pode se mover a mais de 36 metros de você ou o jutsu termina imediatamente.

#### BLOQUEIO DE INSETOS

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 6 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 100 metros | **Duração:** Concentração, Até 1 hora
**Componentes:** HS | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você espalha insetos em um raio de 100 metros e eles emitem chakra semelhante ao seu. Criaturas com chakra têm desvantagem em testes de Percepção para encontrar outras criaturas através de sua visão de chakra.

#### TÉCNICA DO JARRO DE INSETO

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 7 Chakras
**Tempo de Conjuração:** 1 Ação/ 1 Reação | **Alcance:** Raio de 3 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Seus insetos enxameiam ao seu redor criando uma barreira de 3 metros de diâmetro centrada em você. A barreira erguida tem uma CA igual a sua e tem 30 PV. As criaturas dentro desse raio também se beneficiam desse jutsu. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e pontos de vida em 2d10. Rank - B:

#### BOMBA DE CHAKRA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, 6 rodadas
**Componentes:** HS | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você preenche seus insetos com uma intensa onda de chakra, aumentando seu potencial e habilidades gerais. Ao usar outro jutsu de Aburame, reduza o custo de chakra deles pela metade (arredondado para baixo) pela duração deste jutsu. Ao causar dano, role um dado de dano adicional para cada jutsu.

#### NUVEM DE INSETOS PARASITAS

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 12 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Raio de 20 metros | **Duração:** Concentração, 6 rodadas
**Componentes:** HS | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Seus insetos criam um gás nocivo que é expelido pelo corpo deles. Você seleciona uma área dentro do seu alcance de visão e o gás é movido para esta área. Criaturas no caminho do gás até o local escolhido, e criaturas que começam seu turno no gás, devem ter sucesso em um teste de Constituição, tornando-se envenenadas e recebendo 8d4 de Dano de Veneno no final de cada turno enquanto dentro do gás. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-B, aumente o custo deste jutsu em 3 e o dano em 2d4. Rank - A: INSETO GIGANTE PARASITÁRIO Classificação: Hijutsu Rank: Rank-A Tempo de Conjuração: 1 Ação Alcance: Toque Duração: Instantânea Componentes: HS Custo: 15 Chakras Palavras-chave: Hijutsu, Ninjutsu Descrição: Como parte da ativação deste jutsu, você faz um ataque desarmado contra uma criatura alvo dentro do seu alcance. Com um acerto, a criatura alvo é infectada por um besouro parasita. A criatura infectada faz um teste de resistência de Constituição, recebendo 5d10 de dano de Veneno e reduzindo o chakra do oponente em 5d10 em caso de falha e causando apenas metade em caso de sucesso.

### AKIMICHI

#### ALMOFADA DE GORDURA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras ou 2 Calorias
**Tempo de Conjuração:** 1 reação | **Alcance:** Próprio | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você expande seu corpo como um balão, reduzindo danos ao amortecer impactos. Você ganha imunidade a dano de concussão e corte. Você ganha resistência a Danos de Terra, Água e Vento reduzindo o dano em metade caso acertado, válido até o início do seu próximo turno.

#### BATIDA DO AMANHECER

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras ou 2 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você quebra o chão levantando pedaços de pedra e os arremessa em direção a uma criatura/alvo dentro do alcance. É um ataque à distância de Taijutsu. Em um acerto, você causa 3d6 de dano de Concussão. Se o jutsu “Expansão Parcial” do Clã estiver ativo quando você usar este jutsu, você causa 5d6 de dano de Concussão. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d6.

#### BALA HUMANA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras ou 3 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você expande seu corpo como um balão retraindo seus braços e pernas dentro de sua gordura. Você usa seu chakra para girar seu corpo como uma bola de boliche, ao mesmo tempo em que evita ficar tonto. Você se arremessa em linha reta em direção a uma criatura alvo e esmaga todos os outros em seu caminho. As criaturas em seu caminho devem fazer um teste de resistência de Destreza, recebendo 3d6 de dano de concussão em caso de falha e metade em caso de sucesso. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 1d6.

#### EXPANSÃO PARCIAL

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras ou 3 Calorias
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Próprio | **Duração:** Concentração, 3 Rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você expande temporariamente uma parte do seu corpo aumentando o potencial de impacto de cada ataque desarmado. Seu alcance de ataque desarmado é de 3 metros pela duração do jutsu. Quando você faz um ataque desarmado, em um acerto, você causa 1d8 de dano de concussão. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 1d8. Rank - C:

#### EXPANSÃO COMPLETA

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 8 Chakras ou 4 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, 3 rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você expande temporariamente todo o seu corpo crescendo, ganhando Vantagem em todos os testes de Força e Constituição.

#### MASSA HUMANA ESPINHOSA

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakras ou 5 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** 10 metros | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você ativa as raízes do seu cabelo, fazendo com que ele desça pelas costas e depois endureça, criando pontas que percorrem o comprimento do seu corpo antes de se expandir como um balão e usar o Jutsu BALA HUMANA. Você se lança em linha reta em direção a uma criatura/alvo e esmaga e perfura todos os outros em seu caminho. As criaturas em seu caminho devem fazer um teste de resistência de Destreza, recebendo 3d6 de dano de concussão e 3d6 de dano perfurante em uma falha na resistência ou metade em um teste bem-sucedido. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e 1d6 para cada tipo de dano.

#### SUPER BOFETADA

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakras ou 5 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos deste jutsu, você já deve ter o jutsu “EXPANSÃO COMPLETA” ativo. O chakra irrompe da palma da sua mão a ponto de se tornar visível. Este chakra aumenta o peso, a densidade muscular e o impacto das palmas das mãos. Como parte da ativação deste jutsu, faça um Ataque de Taijutsu. Em um Acerto, você causa 4d10 de dano de Concussão. Criaturas em um raio de 3 metros centrado na área alvo devem fazer um teste de resistência de Destreza, recebendo 3d6 de dano de concussão em caso de falha ou metade em caso de sucesso. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e o dano em 1d10. Rank - B:

#### MODO BORBOLETA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras ou 7 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, 4 rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você libera chakra de suas costas que se transforma em asas de borboleta e se torna visível a olho nu. Durante este jutsu, você não pode usar o jutsu “EXPANSÃO COMPLETA” e ganha imunidade à condição Envenenado. Você aumenta sua força pelo dobro de seu bônus de proficiência e ganha Vantagem em testes de resistência de Constituição e Força. Quando este jutsu termina, você perde todas as calorias restantes e não pode ganhar calorias por 1d4 dias.

#### SUPER BALA HUMANA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras ou 7 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** 30 metros | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos para este jutsu, você deve ter o “Modo Borboleta” Ativo. Você executa o auge da técnica “Nikudan Sensha/Bala humana”. Seu corpo é aprimorado pelo modo Borboleta e você se torna uma bola de demolição e de destruição absoluta. Você pode se mover até 30 metros em qualquer direção e fazer curvas. Você pode se mover através de criaturas e paredes com espessura não superior a 1,5 metro. Criaturas pegas no caminho de seu ataque devem ter sucesso em um teste de resistência de Destreza, recebendo 8d6 de dano de Concussão em caso de falha na resistência e metade em caso de sucesso. Em níveis mais altos: para cada nível que você acrecentar a esse jutsu além do Rank-B, aumente o custo deste jutsu em 3 e o dano em 2d6. Rank - A:

#### BOMBA BORBOLETA

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 20 Chakras ou 10 Calorias
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM, M | **Palavras-chave:** Hijutsu, Ninjutsu, Taijutsu

Descrição: Como parte dos requisitos para este jutsu, você deve ter o jutsu “Modo Borboleta” ativo. Você converte à força todas as suas calorias restantes em chakra e o canaliza em seu punho enquanto tenta fazer um único ataque devastador. Reduza suas calorias restantes para 0. Faça um ataque de Taijutsu contra uma criatura ao alcance. Em um acerto, você causa 10d10 de dano de concussão e todas as criaturas em um cone de 10 metros atrás da criatura alvo devem fazer um teste de resistência de Destreza, recebendo 6d6 de dano de concussão e sendo empurrados para trás 5 metros, ficando caídos, em uma falha na resistência. Após a conclusão deste jutsu, o Modo Borboleta termina imediatamente.

### FŪMA

#### QUEDA DIVINA: CÉU

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 20 metros | **Duração:** Instantânea
**Componentes:** M, W (Fūma-Shuriken ou Shuriken Monstruoso) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Ao revestir sua arma com chakra e criar um giro extremamente poderoso, você afia o fio apenas o suficiente para dividir o ar e até mesmo o som. Faça um ataque de Taijutsu à distância, causando 3d10 de dano cortante em um acerto. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 1d10

#### QUEDA DIVINA: DIVISÃO

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio (cone de 9 metros) | **Duração:** Instantânea
**Componentes:** M, W (propriedade de arremesso) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você libera uma coleção de armas de arremesso que cobrem um amplo alcance perfurando tudo e todos em seu caminho. A criatura ao alcance deve fazer um teste de resistência de Destreza, recebendo 3d8 de dano cortante em uma falha na resistência ou metade em caso de sucesso. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d8

#### QUEDA DIVINA: CHUVA

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros / raio de 6 metros | **Duração:** Instantânea
**Componentes:** M, W (propriedade de arremesso) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você lança armas para o céu e antes que suas armas caiam, ricocheteiam umas nas outras e chovem perfurando tudo ao alcance. Criaturas ao alcance devem ser bem-sucedidas em um teste de resistência de Destreza, recebendo 4d6 de dano Perfurante ou metade em caso de sucesso. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d6

#### QUEDA DIVINA: TEMPESTADE

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 12 metros | **Duração:** Concentração, 3 Rodadas
**Componentes:** M, W (Shuriken e Fio de Batalha) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você lança suas armas que estão presas com seus fios de batalha em torno de uma criatura alvo, puxa para trás, quebrando o fio e restringindo-os. A criatura alvo deve ter sucesso em um teste de força, Paralisado em uma falha no teste. A criatura alvo pode, como uma ação, refazer o teste em cada rodada. Rank - C:

#### QUEDA DIVINA: CRUZ

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-C | **Custo:** 9 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 20 metros | **Duração:** Instantânea
**Componentes:** M, W (2x Fūma Shuriken) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você lança 2 Fūma-Shuriken com ambas as mãos formando uma cruz enquanto corta qualquer coisa para alcançar seu objetivo. Faça 2 ataques à distância, causando 3d8 de dano cortante em cada acerto. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e o dano em 1d8 para cada acerto.

#### QUEDA DIVINA: PENETRAÇÃO

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-C | **Custo:** 8 Chakras
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Próprio | **Duração:** Concentração, até 3 Rodadas
**Componentes:** CM | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você concentra o chakra na borda de sua próxima arma arremessada. O próximo ataque à distância feito com uma Arma de Arremesso aumenta seu dado de dano em 1 passo (d4\>d6\>d8\>d10\>d12). Obtém um acerto crítico em uma rolagem de 19-20. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e o alcance da ameaça crítica em 1.

#### QUEDA DIVINA: PROTEÇÃO

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-C | **Custo:** 7 Chakras
**Tempo de Conjuração:** 1 Reação, que você toma quando é atingido | **Alcance:** Próprio | **Duração:** Instantânea
**Componentes:** M, W (Shuriken Monstruoso) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você gira o Shuriken Monstruoso à sua frente enquanto está coberto por seu chakra, criando um escudo giratório. Ao receber dano, role 2d12 mais seu modificador de Destreza, reduzindo o dano pelo resultado. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e reduza o dano em 1d12 adicionais. Rank - B:

#### QUEDA DIVINA: FOCO

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-B | **Custo:** 11 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, até 3 rodadas
**Componentes:** M, CM | **Palavras-chave:** Hijutsu

Descrição: Você imbuí chakra em sua retina aumentando seu foco e precisão geral com armas de longo alcance. Pela duração, quando você faz um ataque à distância, você pode rolar 2d6 adicionais adicionando o resultado à sua jogada. Em uma rolagem de dois 6, você trata a rolagem como um acerto crítico.

#### QUEDA DIVINA: CALAMIDADE

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-B | **Custo:** 13 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, até 3 rodadas
**Componentes:** M, W (propriedade de arremesso) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: Você começa a girar, lançando armas em todas as direções, perfurando e cortando os inimigos conforme eles caem dentro do alcance. Criaturas em um raio de 15 metros centrado em você devem ter sucesso em um teste de resistência de Destreza, recebendo 6d6 de dano cortante em uma falha no teste de resistência. Rank - A:

#### QUEDA DIVINA: EXECUÇÃO

**Classificação:** Hijutsu, Bukijutsu | **Rank:** Rank-A | **Custo:** 20 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 30 metros | **Duração:** Instantâneo
**Componentes:** M, W (Fūma-Shuriken) | **Palavras-chave:** Hijutsu, Bukijutsu

Descrição: A arte perfeita e secreta do Clã Fūma. O mais letal de sua série de Jutsu Queda Divina. O usuário pega seu Fūma-Shuriken icônico e o alinha com Chakra fino o suficiente para separar as moléculas de água, e reveste as lâminas de sua arma com uma aura antes de lançá-la com força suficiente para cortar momentaneamente a própria gravidade, tornando a arma imune às forças de gravidade por um curto período de tempo. Criaturas em uma linha de 30 metros originadas de você devem ter sucesso em um teste de resistência de Destreza, recebendo 10d10 de dano cortante que ignora resistências e imunidades em falha. Se uma criatura falhar no teste de resistência por 5 ou mais, ela sofrerá o dobro do dado de dano como se tivesse sido atingida por um golpe crítico. Em um sucesso, eles sofrem metade do dano.

### HYŪGA

#### DESARME SUAVE

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras
**Tempo de Conjuração:** 1 Reação, que você toma quando atingido com um ataque corpo a corpo. | **Alcance:** Próprio | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você reage instantaneamente a um ataque. Quando você é atingido por um ataque corpo a corpo, você pode rolar 1d8 + seu modificador de destreza. Reduza o dano recebido pelo resultado. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e reduza o dano em 1d8

#### OITO TRIGRAMAS: PALMAS GIRATÓRIAS DO CÉU

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Reação, que você toma quando atingido com um ataque. | **Alcance:** Próprio | **Duração:** 1 Rodada
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você gira a uma velocidade violenta, enquanto libera chakra de cada ponto de chakra em seu corpo. Criando uma cúpula de chakra azul repelindo a maioria dos ataques. Até o início do seu próximo turno, você tem um bônus de +5 na CA. Se você está sujeito a um jutsu que exige que você faça um teste de resistência de Força ou Destreza, você faz o teste com vantagem. As criaturas que estiverem a até 2 metros de você quando você lançar este jutsu devem ser bem-sucedidas em um teste de resistência de Força, recebendo 2d6 de dano de Força e sendo empurradas 2 metros para trás em caso de falha.

#### PALMA INFERIOR

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos deste jutsu você deve ter o Byakugan ativo. Você faz um único golpe decisivo contra a rede de chakra de seu oponente, criando um pulso de chakra que interrompe seu fluxo de chakra. Faça um teste de ataque de Taijutsu. Em um acerto, você reduz os pontos de chakra da criatura alvo em 2d8. A criatura alvo deve fazer um teste de resistência de Constituição, tornando-se incapaz de Moldar chakra até o início de seu próximo turno em caso de falha no teste de resistência. Se a criatura alvo tiver 0 Chakra, você causa o dobro de dano aos seus pontos de vida. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d8

#### AGULHA DE TENKETSU

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 3 Chakras
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos deste jutsu você deve ter o Byakugan ativo. Como uma ação bônus, quando você atingir uma criatura com um ataque desarmado ou Taijutsu, a criatura deve ter sucesso em um teste de resistência de Constituição, aumentando o custo de todos os seus jutsus em 3 até o final de seu próximo turno em uma falha. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o custo do jutsu alvo em 2

#### PALMA DE VÁCUO

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você empurra sua palma para frente em uma criatura que você pode ver ao alcance, criando uma explosão invisível de chakra. Faça um ataque à distância de Taijutsu. Em um acerto, você causa 5d4 de dano de concussão. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d4 Rank - C:

#### 8-TRIGRAMAS 32 PALMAS

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos deste jutsu você deve ter o Byakugan ativo. Você executa a manobra final imperfeita do Punho Gentil. Faça um ataque de Taijutsu para cada criatura a até 2 metros de você. Em um acerto, você reduz o chakra do alvo em 6d6 enquanto causa metade do resultado da rolagem como dano. Além disso, caso o ataque tenha sido um sucesso, os alvos também devem fazer um teste de resistência de Constituição, perdendo a habilidade de moldar chakra por 1d4 rodadas em falha. Se a criatura alvo tiver 0 Chakra, você causa o dobro de dano aos seus pontos de vida. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-D, aumente o custo deste jutsu em 3 e o dano em 2d6

#### PALMAS GIRATÓRIAS DO CÉU PERFEITO

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakras
**Tempo de Conjuração:** 1 Reação, quando você ou uma criatura aliada são atingidos por um ataque | **Alcance:** Raio de 5 metros | **Duração:** 1 Rodada
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Ramo Principal, Taijutsu

Descrição: A forma aperfeiçoada da “Palmas Giratórias do Céu” ensinada apenas para aqueles do ramo principal do clã Hyūga. Isso cria uma cúpula de chakra azul visível e repele todos os ataques que tentam atingi-lo e repele criaturas que você escolher a até 5 metros de distância em um raio centrado em você. Até o início do seu próximo turno, você e todas as criaturas que você selecionou para não serem afetadas por este jutsu a até 3 metros de você se beneficiam dos efeitos deste jutsu. Você e aliados afetados ganham +5 de bônus na CA. Se algum de vocês estiver sujeito a um jutsu que exija que você faça um teste de resistência de Força, Destreza ou Constituição, faça o teste de resistência em vantagem. Criaturas hostis que estiverem a até 3 metros de você quando você lança este jutsu deve ter sucesso em um teste de de Força recebendo 4d6 de dano de Força e sendo jogado para trás 3 metros em uma falha.

#### GOLPE DE CORPO ÚNICO

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 7 Chakras
**Tempo de Conjuração:** 1 Reação que você pode realizar quando uma criatura realiza uma ação de qualquer tipo | **Alcance:** Próprio | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Ramo Secundário, Taijutsu

Descrição: Você libera chakra de cada ponto de chakra no corpo, criando uma onda de choque originada de você, afastando de você as criaturas ao seu redor. Todas as criaturas dentro de 3 metros de você devem fazer um teste de resistência de Força, sendo derrubada em uma falha no teste de resistência e um teste de resistência de Constituição, tornando-se incapaz de moldar chakra por 1d4 rodadas caso falhe.

#### PALMA DA PAREDE DE VÁCUO

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 8 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 20 metros | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você empurra ambas as palmas para a frente, criando um vendaval de chakra extremamente poderoso com o objetivo de interromper o fluxo de chakra de seu oponente à distância. Você faz um teste de ataque corpo a corpo em uma criatura que você pode ver no alcance. Em um acerto, você causa 10d4 de dano de concussão e a criatura alvo deve fazer um teste de resistência de Constituição, tornando-se incapaz de moldar Chakra por 1d4 rodadas em caso de falha. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-C, aumente o custo deste jutsu em 3 e o dano em 2d4 Rank - B:

#### 8-TRIGRAMAS 64 PALMAS

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Você aperfeiçoou a técnica mais poderosa do clã Hyūga. Como parte dos requisitos deste jutsu, você deve ter o Byakugan ativo e ter usado sua ação de Ataque para usar o Taijutsu “8-TRIGRAMAS 32 PALMAS”. Como uma ação de bônus imediatamente após a ativação do “8-TRIGRAMAS 32 PALMAS”, você o utiliza uma segunda vez atingindo todas as criaturas que você atingiu originalmente com a ativação inicial. Você reduz o chakra deles em 6d6 adicionais enquanto causa metade do resultado da rolagem como dano à criatura. Os alvos também devem fazer um teste de resistência de Constituição em desvantagem, perdendo a habilidade de moldar chakra e reduzindo sua velocidade de movimento em -15 por uma rodada adicional de 2d4. Se a criatura alvo tiver 0 Chakra, você causa o dobro de dano aos seus pontos de vida.

#### 8-TRIGRAMAS 64 PALMAS DE DEFESA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras
**Tempo de Conjuração:** 1 Ação / 1 reação ao ser atingido. | **Alcance:** Próprio | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Ramo Principal, Taijutsu

Descrição: Criado por um Hyūga do Ramo Principal anos atrás, esta é uma variação dos “8-Trigramas 64 Palmas” que também leva conceitos da “Palmas Giratórias do Céu”. Como parte dos requisitos deste jutsu você deve ter o Byakugan ativo. • Como uma ação padrão, ao usar este jutsu, todas as criaturas em um raio de 2 metros centrado em você devem ter sucesso em um teste de resistência de Destreza, recebendo 6d10 de dano cortante e sendo repelidos 2 metros para trás. Até o início do seu próximo turno, você ganha +3 de bônus na CA. • Como uma reação ao ser atingido. Até o início do seu próximo turno, você ganha +8 de Bônus de CA. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-B, aumente o custo deste jutsu em 3 e o dano em 1d10 ou o bônus da CA em +1

#### BRITADOR DE MONTANHAS

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 12 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Cone de 12 metros | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Ramo Secundário, Taijutsu

Descrição: Como parte dos requisitos deste jutsu você deve ter o Byakugan ativo. Uma versão avançada e amplificada da “Palma da Parede de Vácuo”. Todas as criaturas em um cone de 12 metros à sua frente devem ser bem-sucedidas em um teste de resistência de Constituição, recebendo 8d8 de dano de concussão em uma falha na resistência, sendo empurrado para trás 5 metros e caindo no chão em uma falha na resistência e recebendo metade do dano em um sucesso sem efeitos adicionais. Em níveis mais altos: para cada nível que você acrescentar a esse jutsu além do Rank-B, aumente o custo deste jutsu em 3 e o dano em 2d4 Rank - A:

#### 8-TRIGRAMAS 128 PALMAS

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 20 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Raio de 3 metros | **Duração:** Instantânea
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Ramo Secundário, Taijutsu

Descrição: Este é o resultado de anos de treinamento e tentativas de alcançar técnicas maiores do que o ramo principal costuma permitir. Este é o pico absoluto da técnica Hyūga dentro do ramo secundário. Como parte dos requisitos deste jutsu você deve ter o Byakugan ativo e ter o “8-Trigramas 64 palmas” aprendido. Faça um ataque de corpo a corpo para cada criatura a até 3 metros de você enquanto você corre entre cada uma atacando mais rápido do que os olhos podem ver. Em um acerto, você reduz o chakra de cada criatura em 15d6 enquanto causa metade do resultado da rolagem como dano de ponto de vida a cada criatura. Além disso, os alvos afetados também devem fazer um teste de resistência de Constituição, perdendo a habilidade de moldar chakra e reduzindo sua velocidade de movimento pela metade por 5d4 rodadas. Se a criatura alvo tiver 0 Chakra, você causa o dobro de dano aos seus pontos de vida.

#### PASSO GENTIL DOS PUNHOS DE LEÕES GÊMEOS

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 15 Chakras
**Tempo de Conjuração:** 1 Ação. | **Alcance:** Próprio | **Duração:** Concentração, 3 turnos
**Componentes:** CM | **Palavras-chave:** Hijutsu, Ramo Principal, Taijutsu

Descrição: A culminação final da pesquisa e treinamento do Ramo Principal. Você libera o chakra de suas mãos cobrindo-o e moldando-o em dois leões guardiões com uma presença visível e intimidadora. Pela duração deste jutsu, ataques desarmados usando a postura do punho gentil causam 1d10 de dano adicional, o jutsu do clã Hyūga custa 3 chakra a menos para lançar e o jutsu do clã Hyūga causa um dado de dano extra em um acerto. Como uma ação bônus em seu turno, você pode fazer um ataque de corpo a corpo à distância em uma criatura que você pode ver até 10 metros de distância, disparando um dos Leões em sua mão como um míssil. Em um acerto, você causa 3d10 de dano.

### Inuzuka

#### CLONE DO HOMEM-BESTA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 3 Chakras
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Próprio | **Duração:** Concentração, 3 Rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Seu Cachorro Ninja usa a técnica de transformação, transformando-se para se parecer exatamente com você, com diferenças notáveis. Eles ainda precisam ficar de quatro e não podem falar, então são substitutos ruins para a infiltração. Enquanto estiver nesta forma, quando seu Cachorro Ninja estiver a 3 metros de você e qualquer um de vocês for o alvo de um ataque, como uma reação, a criatura não-alvo pode Interpor pulando na frente do outro, trocando o alvo para si. Se esta reação for tomada, aplique o total da jogada de ataque da criatura hostil à CA da criatura interposta como se ela fosse o alvo do ataque.

#### MARCAÇÃO DINÂMICA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 5 Metros | **Duração:** 3 Rodadas
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Seu Cachorro Ninja pula no ar e gira enquanto libera urina carregada de chakra sobre a área. Criaturas em um raio de 3 metros centradas no Cachorro Ninja são cobertas pela Urina. As criaturas afetadas exalam um cheiro fraco, mas óbvio, que pode ser rastreado por você ou seu Cachorro Ninja. Quando você faz um teste de Percepção para cheirar uma criatura afetada, você ganha vantagem no teste. Além disso, quando você ou seu Cachorro Ninja fizer um ataque usando um jutsu do clã Inuzuka contra uma criatura afetada, role 1d6, adicionando o resultado à sua jogada de ataque. Esse jutsu não pode ser utilizado caso o seu Cachorro Ninja esteja transformado em “Clone do Homem-Besta”, mas você pode cancelar o jutsu citado para utilizar este.

#### TÉCNICA DAS QUATRO PATAS

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 3 Chakras
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Próprio | **Duração:** Concentração, 3 Rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você ganha a habilidade de se mover como um cachorro. Pela duração deste jutsu, você pode usar seu modificador de Destreza ou Sabedoria ao invés de Força, para suas jogadas de ataque e Dano nos Jutsus do Clã Inuzuka.

#### TSŪGA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantâneo
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu, Impacto

Descrição: Como parte dos requisitos deste jutsu, você deve ter a “Técnica das Quatro Patas” ativa ou seu Cachorro Ninja deve ter o “Clone Humano-Besta” ativo. Você ou seu Cachorro Ninja começam a girar em um ritmo acelerado tentando acertar um alvo com uma batida de corpo em espiral. Faça um ataque de corpo a corpo contra um único alvo que você possa ver ou cheirar dentro do alcance. Em um acerto, você causa 2d6 de dano de corte e 2d6 de dano de concussão. Em níveis mais altos: para cada nível que você lançar este jutsu acima do nível D, aumente o custo deste jutsu em 3 e o dano em 1d6 para cada tipo de dano. Rank - C:

#### PRESA SOBRE PRESA

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 7 Chakras
**Tempo de Conjuração:** 1 Ação, 1 Ação Bônus | **Alcance:** 9 metros | **Duração:** Instantâneo
**Componentes:** CM, M | **Palavras-chave:** Hijutsu, Taijutsu, Impacto

Descrição: Como parte dos requisitos deste jutsu, você deve ter a “Técnica das Quatro Patas” ativa e seu Cachorro Ninja deve ter o “Clone Humano-Besta” ativo. Você ou seu Cachorro Ninja começam a girar em um ritmo acelerado perseguindo os inimigos e realizando uma batida de corpo em espiral em rápida sucessão. Como uma ação padrão, faça um ataque de corpo a corpo contra uma criatura alvo no alcance. Em um acerto, causa 3d6 de dano cortante e 3d6 de dano de concussão. Como uma ação bônus, você pode comandar seu Cachorro Ninja para atacar usando este jutsu. Em um acerto, eles causam 3d4 de dano cortante e 3d4 de dano de concussão. Se ambos os ataques acertarem a mesma criatura, a criatura alvo deve fazer um teste de resistência de Constituição, caindo no chão em caso de falha. Em níveis mais altos: Para cada nível que você lançar este jutsu acima do Rank-C, aumente o custo deste jutsu em 3 e o dano em 1d6 apenas para seu ataque usando o jutsu.

#### PRESAS QUE RASGAM

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 6 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantâneo
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu, Impacto

Descrição: Como parte dos requisitos deste jutsu você deve ter a “Técnica das Quatro Patas” ativa. Como parte da ativação deste jutsu, faça dois testes de ataque corpo a corpo em uma criatura alvo no alcance. Em um acerto, você causa 2d6 de Dano Desarmado. Se você acertar com ambos os ataques, a criatura alvo deve ter sucesso em um teste de resistência de Constituição, sendo derrubada e você ganha uma ação de bônus adicional até o final deste turno. Em níveis mais altos: Para cada nível que você lançar este jutsu acima do Rank-C, aumente o custo deste jutsu em 3 e aumente o dano em 1d6.

#### PRESAS DE FERRO

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 6 Chakras
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Próprio | **Duração:** Concentração, 3 turnos
**Componentes:** HS | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Você ou seu Cachorro Ninja focam o chakra em suas unhas, aumentando sua nitidez e dureza, tornando seus ataques desarmados e Taijutsu muito mais eficazes. Pela duração, sempre que você usar um Taijutsu ou fizer um ataque desarmado, você causa 4d4 de dano cortante. Em Níveis Superiores: Para cada nível que você lançar este jutsu acima do Rank-C, aumente o custo deste jutsu em 3 e o dano em 1d4.

#### LOBO DE DUAS CABEÇAS

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** Próprio | **Duração:** Concentração, 3 Rodadas
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu

Descrição: Como parte dos requisitos deste jutsu, você deve estar em contato direto com seu Cachorro Ninja. Você executa a Técnica de Transformação Secreta do Clã Inuzuka, fundindo você e seu cachorro, e transformando vocês dois em uma Grande Criatura com 2 Cabeças e combinando seus sentidos e forças. Pela Duração Aumente seus valores de Força, Destreza, Constituição e Habilidade de Sabedoria pela metade de seu bônus de proficiência. Agora você é uma criatura grande. Você não pode mais realizar selos de mão, mas pode realizar qualquer jutsu do Clã Inuzuka, ignorando a necessidade de selos de mão, se houver. Reduza o custo do Jutsu do clã Inuzuka pela metade durante a duração. Aumente sua velocidade em 9 metros. Você ganha resistência a danos cortantes, perfurantes e de concussão sem chakra. Você também ganha suas ações Cachorro Ninjas dobrando todos os dados rolados ao usá-los. (Caso existam.)

#### PRESA DE LOBO

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 40 metros | **Duração:** Instantâneo
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos deste jutsu, você deve ter o Jutsu do Clã Inuzuka do Lobo de Duas Cabeças ativo. Você executa uma variação muito mais devastadora do “Tsūga” como um lobo de duas cabeças, rasgando seu alvo e destruindo-o. Faça um ataque de corpo a corpo, causando 5d6 de dano cortante e 5d6 de dano perfurante. Em níveis mais altos: para cada nível que você lançar este jutsu acima do nível B, aumente o custo deste jutsu em 3 e o dano em 2d6 para cada tipo de dano. Rank - A:

#### PRESA DE CALDA

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 15 Chakras
**Tempo de Conjuração:** 1 Ação | **Alcance:** 40 metros | **Duração:** Instantâneo
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Como parte dos requisitos deste jutsu, você deve ter o Inuzuka Jutsu “Lobo de Duas Cabeças” ativo. Uma variação ultravioleta da técnica “Presa de Lobo”, onde você se enrola em uma bola e rola em uma velocidade feroz em direção a um inimigo como se estivesse perseguindo seu próprio rabo. Mova-se até 40 metros em qualquer direção, podendo virar ou mudar de direção. No final do seu movimento, todas as criaturas no caminho do seu movimento devem ter sucesso em um teste de resistência de Destreza, recebendo 8d6 de dano de corte e 8d6 de perfuração em uma falha na resistência, ou metade em um sucesso.

### Nara

#### IMITAÇÃO DAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** Reação, quando um aliado se torna alvo de um ataque que você possa ver.
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Você manipula sua própria sombra, estendendo-a para fora e tentando fundi-la com a sombra de uma criatura voluntária. Como uma reação, você concede à criatura alvo, à qual sua sombra está conectada, um bônus de +2 na Classe de Armadura (CA) e vantagem em testes de resistência de Destreza até o final do turno atual. Em Ranks Superiores: Para cada rank acima do Rank D em que este jutsu for conjurado, aumente o custo deste jutsu em 3 Chakra e o bônus de CA concedido em +1.

#### ESTRANGULAMENTO DAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 14 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte do requisito de ativação deste jutsu, você deve ter uma criatura já restrita por um dos seguintes jutsus: Possessão das Sombras, Campo de Imitação das Sombras, Agulhas de Costura das Sombras ou Lírio-Aranha Negro. Como uma ação bônus, todas as criaturas restringidas por qualquer um dos jutsus mencionados sofrem 4d6 de dano necrótico. Em Ranks Superiores: Para cada rank acima do Rank D, aumente o custo em 3 Chakra e o dano em 2d6.

#### DISTRAÇÃO DA SILHUETA SOMBRIA

**Classificação:** Hijutsu | **Rank:** Rank D | **Custo:** 3 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Ao moldar chakra em sua sombra, você lhe dá forma, fazendo-a erguer-se do chão com uma largura extremamente fina. A sombra tem a mesma altura que você e segue fielmente seus comandos. Ela não pode agarrar, carregar, tocar ou interagir fisicamente com objetos ou criaturas. Este jutsu é extremamente útil para distrações e despistes. Ele pode ser usado a partir de furtividade sem revelar sua posição e também pode ser utilizado em conjunto com um teste de furtividade.

#### POSSESSÃO DAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, 3 turnos
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: A famosa técnica de Possessão das Sombras do Clã Nara permite ao usuário moldar chakra em sua própria sombra e controlá-la. Escolha uma criatura que você possa ver dentro do alcance. A criatura alvo deve realizar um teste, caso o nível da criatura alvo for igual ou maior que o seu, ela irá fazer o teste d20 com falha em número abaixo de 10, se for menor o teste é falha em um número abaixo de 15. Em uma falha, ela fica restrita pela duração do jutsu e passa a imitar exatamente os mesmos movimentos que você realiza. Como uma ação no turno da criatura afetada, ela pode realizar um teste de resistência de Força para encerrar os efeitos deste jutsu. Este jutsu é altamente influenciado pela quantidade de luz ambiente: Em Luz Baixa, o alcance do jutsu é reduzido pela metade. Em Escuridão Total, este jutsu não pode ser usado. Em Ranks Superiores: Para cada rank acima do Rank D, aumente o custo em 3 Chakra e o alcance em 5 metros. Rank - C:

#### REUNIÃO DAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank C | **Custo:** 6 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 14 metros | **Duração:** Concentração
**Componentes:** CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Você materializa finos tentáculos de sombra capazes de interagir com objetos. Essas sombras podem deslizar sob portas, atravessar pequenos buracos e outras aberturas que seriam impossíveis para um corpo físico. Para manipular objetos complexos (como fechaduras, maçanetas ou teclados), faça um teste de Inteligência. Este jutsu também pode ser usado para recuperar objetos e puxá-los até você, desde que não pesem mais que 11 kg.

#### CAMPO DE IMITAÇÃO DAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank C | **Custo:** 7 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Raio de 6 metros no chão | **Duração:** Concentração, 2 turnos
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Você expande sua sombra em um círculo com raio de 6 metros, centrado em você, capturando todas as criaturas na mesma superfície. Todas as criaturas dentro da área, no momento da ativação, devem realizar um teste de resistência de Força normal caso o nível da criatura alvo for igual ou maior que o seu. Se for menor o teste é feito em desvantagem. Em caso de falha, ficam restritas pela duração do jutsu. Como uma ação no turno da criatura afetada, ela pode realizar um teste de resistência de Força para se libertar, encerrando o efeito sobre si. Em Ranks Superiores: Para cada rank acima do Rank C, aumente o custo em 3 Chakra e o raio em 2 metros.

#### AGULHAS DE COSTURA DAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, 2 turnos
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Você materializa sua sombra e a fragmenta em espinhos afiados semelhantes a agulhas. Você cria 5 fios de sombra em forma de agulha. Faça um ataque de Ninjutsu contra até 5 criaturas dentro do alcance. Se múltiplos fios forem direcionados à mesma criatura, faça um ataque separado para cada fio. Em um acerto, o alvo sofre 2d6 de dano perfurante por fio. Cada criatura atingida deve realizar um teste de resistência de Força normal, caso o nível da criatura alvo for igual ou maior que o seu, se for menor o teste é feito em desvantagem. Esse teste se repete para cada fio adicional após o primeiro. Se falhar, a criatura fica restrita, imitando seus movimentos. Como uma ação em seu turno, ela pode repetir o teste de Força para encerrar o efeito. Em Ranks Superiores: Para cada rank acima do Rank C, aumente o custo em 3 Chakra e o dano em 1d6. Rank - B:

#### LÍRIO-ARANHA NEGRO

**Classificação:** Hijutsu | **Rank:** Rank B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 27 metros | **Duração:** Concentração, 2 turnos
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Esta é uma versão avançada dessa técnica. Escolha até 8 criaturas dentro do alcance. Cada criatura deve realizar um teste de resistência de Destreza normal caso o nível da criatura alvo for igual ou maior que o seu. Se for menor o teste é feito em desvantagem. Em caso de falha, fica restrita. No início do turno de uma criatura afetada, ela pode realizar um teste de resistência de Força para escapar. Em Ranks Superiores: Para cada rank acima do Rank B, aumente o custo em 3 Chakra e selecione 1 criatura adicional dentro do alcance.

#### TÉCNICA DE TRANSPORTE PELAS SOMBRAS

**Classificação:** Hijutsu | **Rank:** Rank B | **Custo:** 12 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve conhecer o Jutsu de Possessão das Sombras. Escolha uma criatura atualmente restrita por Possessão das Sombras, Campo de Imitação das Sombras, Agulhas de Costura das Sombras ou Lírio-Aranha Negro. Você mergulha em sua própria sombra, desloca-se por ela e emerge a até 2 metros da criatura restrita escolhida. Você deve permanecer dentro do alcance das demais criaturas restringidas; caso contrário, os jutsus aplicados a elas terminam imediatamente. Rank - A:

#### EXECUÇÃO DA TEIA SOMBRIA

**Classificação:** Hijutsu | **Rank:** Rank A | **Custo:** 18 Chakra
**Tempo de Conjuração:** 1 Ação Bônus | **Alcance:** 27 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve ter o Lírio-Aranha Negro ativo e ao menos 1 criatura restrita por ele. Como uma ação bônus, todas as criaturas atualmente capturadas devem realizar um teste de resistência de Constituição normal, caso o nível da criatura alvo for igual ou maior que o seu, se for menor o teste é feito em desvantagem. Em caso de falha, as criaturas sofrem 12d8 de dano necrótico e recebem 1 nível de Exaustão.

### UCHIHA

#### GENJUTSU: SHARINGAN!

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve ter o Sharingan ativo. Ao fazer contato visual com uma criatura enquanto seu Sharingan está ativo, você pode conjurar qualquer Genjutsu de Rank-D ou inferior que esteja nos seus jutsus conhecidos. Não exige custo adicional de Chakra, desde que o jutsu não exija Mobilidade (M), Selo de Chakra (CS), arma (W) ou ferramentas ninja (NT). O Genjutsu conjurado deve ter tempo de conjuração de 1 ação ou ação bônus. O alcance do Genjutsu passa a ser o alcance deste jutsu e só pode afetar a criatura alvo que você estiver observando. Isso pode ser feito sem quebrar furtividade. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o rank máximo do jutsu que pode ser conjurado em +1 (D \> C \> B \> A \> S).

#### POSTURA DE ESPERA UCHIHA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** Reação, quando você é alvo de um ataque corpo a corpo | **Alcance:** Pessoal | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu, Único

Descrição: Como reação ao ser alvo de um ataque corpo a corpo, você pode realizar a ação Esquivar. Quando uma criatura erra um ataque corpo a corpo contra você, você imediatamente realiza um ataque corpo a corpo ou conjura um Taijutsu de Rank-D que não seja Combo ou Finalizador. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o rank máximo do jutsu conjurado em +1 (D \> C \> B \> A \> S).

#### GRANDE ASSALTO UCHIHA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** M | **Palavras-chave:** Hijutsu, Taijutsu

Descrição: Faça um ataque de Taijutsu contra uma criatura ao alcance. Em um acerto, ela sofre 3d8 de dano contundente. Além disso, você ganha vantagem no próximo ataque corpo a corpo ou ataque de Taijutsu contra esse alvo no seu próximo turno. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d8.

#### CHUVA DE SHURIKENS UCHIHA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros (esfera de raio 3 metros) | **Duração:** Instantânea
**Componentes:** W (Shuriken ou Kunai), NT (10), M | **Palavras-chave:** Shurikenjutsu, Taijutsu

Descrição: Você lança 10 shurikens ou kunais simultaneamente para o alto. Criaturas na área alvo devem ser bem-sucedidas em um teste de resistência de Destreza. Em uma falha, as criaturas sofrem 1d4 de dano cortante um número de vezes igual à seu bônus de Proficiência. RANK-C

#### GENJUTSU: DESVIAR!

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Reação | **Alcance:** 9 metros | **Duração:** Instantânea
**Componentes:** CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve ter o Sharingan ativo. Ao ativar este jutsu, faça um teste de Sabedoria para identificar se você ou outra criatura está sob efeito de um Genjutsu. Em um sucesso, você pode tentar um novo teste de Sabedoria para anular o Genjutsu e direcioná-lo para outra criatura visível ao alcance com a qual possa fazer contato visual. O novo alvo deve ser bem-sucedido em um teste de resistência de Sabedoria ou sofrer os efeitos do Genjutsu redirecionado; em um sucesso, o Genjutsu termina.

#### GENJUTSU: ESTRELA VERMELHA

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Como parte dos requisitos deste jutsu, você deve ter o Sharingan ativo. Ao fazer contato visual com uma criatura, você a prende em um Genjutsu onde o sol torna-se vermelho e se aproxima lentamente. O alvo deve ser bem-sucedido em um teste de resistência de Sabedoria ou ficará Amedrontado de forma inconsciente pelo sol, tentando evitar qualquer luz e buscando se mover para escuridão total.

#### BOLA DE CHAMAS UCHIHA

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Liberação de Fogo, Único

Descrição: Uma variação única do jutsu “Liberação de Fogo: Bola de Fogo”. Faça um ataque de Ninjutsu à distância contra uma criatura ao alcance. Em um acerto, o alvo sofre 4d10 de dano de fogo e deve ser bem-sucedido em um teste de resistência de Constituição ou ficará Queimando. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +2d10. RANK-B

#### FLOR DE CHAMAS UCHIHA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 11 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 36 metros | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Liberação de Fogo, Único

Descrição: Você cria 8 pequenas esferas rubras de fogo que flutuam no ar até 9 metros de altura e a até 36 metros de você. Como ação bônus em cada um de seus turnos, você pode ordenar que cada esfera ataque uma criatura. Faça um ataque de Ninjutsu; em um acerto, o alvo sofre 3d8 de dano de fogo e a esfera é destruída. Em uma falha, a esfera também é perdida.

#### TORRE DE CHAMAS UCHIHA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 18 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Liberação de Fogo, Único

Descrição: Você cria um cilindro concentrado de fogo centrado em você, com 18 metros de altura e raio de 18 metros. Criaturas, exceto você, que iniciem o turno dentro da área ou tentem atravessar as chamas devem ser bem-sucedidas em um teste de resistência de Destreza, sofrendo 8d8 de dano de fogo e sendo empurradas 2 metros em uma falha, ou metade do dano em um sucesso. A muralha possui CA igual à sua e 30 pontos de vida (6d10), recuperando pontos de vida iguais ao dano sofrido quando atingida por jutsus de Liberação de Vento e sendo vulnerável a jutsus de Liberação de Água (CA cai para metade). RANK-A

#### SHARINGAN: GENJUTSU INFINITO

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 20 Chakra, perda da característica de Clã Sharingan
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Até 100 anos
**Componentes:** CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: O Genjutsu supremo do Clã Uchiha. Como requisito, você deve ter o Sharingan ativo. Ao fazer contato visual com uma criatura, você a aprisiona em um Genjutsu infinito de sua criação. Faça um teste de Sabedoria. Em um sucesso, você compreende a personalidade do alvo (em uma falha, o jutsu termina imediatamente). Em seguida, o alvo deve ser bem-sucedido em um teste de resistência de Carisma ou ficará preso no Genjutsu para sempre, fazendo com que você perca permanentemente o acesso ao Sharingan e todas as suas habilidades. Em um sucesso, o alvo quebra o Genjutsu; você não perde o Sharingan, mas ainda gasta o custo de Chakra.

### UZUMAKI

#### RESERVAS DE CHAKRA

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** —
**Tempo de Conjuração:** 1 Dia | **Alcance:** Pessoal | **Duração:** —
**Componentes:** HS | **Palavras-chave:** Hijutsu

Descrição: Você cria um reservatório de chakra dentro do seu corpo, armazenando até metade do seu chakra máximo. O processo exige um dia inteiro sem uso extenuante de chakra. Após concluído, você pode gastar chakra da reserva em vez do seu normal para conjurar jutsus. O chakra armazenado na reserva não pode ser recuperado por nenhum tipo de descanso (Curto, Longo ou Completo); para reabastecer a reserva, este jutsu deve ser conjurado novamente.

#### SELO BÁSICO DOS OITO TRIGRAMAS

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** 1 Minuto
**Componentes:** HS, CM, CS | **Palavras-chave:** Hijutsu, Fuinjutsu, Ninjutsu, Único

Descrição: Você inscreve um selo de chakra na palma da mão e cria uma formação de bloqueio de quatro pontos usando quatro dedos à sua escolha, tentando selar uma grande porção do chakra de uma criatura ao pressionar o selo contra ela. Faça um ataque de Ninjutsu. Em um acerto, sempre que o alvo tentar usar Ninjutsu ou Genjutsu, ele deve realizar um teste de resistência de Constituição; em uma falha, o custo do jutsu utilizado é aumentado em +5 Chakra. Em um sucesso, um dos bloqueios é quebrado. Após 1 minuto ou quando os 4 bloqueios forem quebrados, o jutsu termina e o selo desaparece do alvo. RANK-C

#### ARTE UZUMAKI: SELO DE CINCO PONTAS

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Até 1 Semana
**Componentes:** HS, CM, CS (2 Selos de Chakra) | **Palavras-chave:** Hijutsu, Fuinjutsu, Ninjutsu, Único

Descrição: Uma versão avançada do “Selo Básico dos Oito Trigramas”, exigindo dois selos de chakra sobrepostos e reforçados por um bloqueio de cinco pontos de sua criação. Faça um ataque de Ninjutsu contra uma criatura ao alcance; em um acerto, o alvo é marcado com o selo. Sempre que o alvo tentar usar Ninjutsu ou Genjutsu, ele deve realizar um teste de resistência de Constituição; em uma falha, o custo do jutsu utilizado é dobrado durante a duração. Em um sucesso, um dos cinco bloqueios é removido. Após 1 semana ou quando todos os 5 bloqueios forem quebrados, o jutsu termina imediatamente e o selo desaparece do alvo.

#### CORRENTES DE SELAMENTO ADAMANTINAS

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 9 metros | **Duração:** Concentração, até 1 minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Seu corpo produz 4 grandes correntes de chakra a partir das costas, que você controla como extensões do próprio corpo. Como ação bônus no seu turno, você pode ordenar que as correntes usem uma das seguintes opções: Açoitar: Faça um ataque de Ninjutsu contra um alvo, causando 4d10 de dano cortante em um acerto. Conter: Faça um ataque de Ninjutsu; em um acerto, o alvo deve ser bem-sucedido em um teste de resistência de Força e em um teste de resistência de Constituição. Em uma falha no teste de Força, o alvo fica Contido. Em uma falha no teste de Constituição, o alvo não pode mais Moldar chakra até escapar das correntes. Em Ranks Superiores: Para cada rank acima de Rank-C, aumente o custo em +3 Chakra e o dano em +1d10. RANK-B

#### RUPTURA DE SELOS UZUMAKI

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** Toque | **Duração:** Instantânea
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Fuinjutsu, Ninjutsu, Único

Descrição: Usando seu profundo conhecimento em selos e Fuinjutsu, você tenta desmontar cirurgicamente qualquer jutsu de selamento que esteja tocando. Ao ativar este jutsu, faça um teste de Inteligência. Em um sucesso, você compreende a estrutura interna do selo e o destrói, finalizando seus efeitos. RANK-A

#### SELO AVANÇADO DOS OITO TRIGRAMAS

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 30 Chakra
**Tempo de Conjuração:** 10 Minutos | **Alcance:** Toque | **Duração:** Permanente
**Componentes:** HS, CM, CS (100) | **Palavras-chave:** Hijutsu, Ninjutsu, Fuinjutsu, Único

Descrição: Para ativar este jutsu, você deve posicionar 100 selos de chakra em uma formação circular, cada um a no máximo 9 metros de distância do outro. Cada selo deve ser marcado com seu sangue, chakra e uma transformação elemental diferente, em um padrão repetitivo que não pode ser quebrado ou o jutsu falha. Após preparar a formação, você define um gatilho de ativação. Quando uma criatura entra no círculo, ela deve realizar um teste de resistência de Constituição; em uma falha, o corpo do alvo é destruído e convertido em chakra, sendo selado dentro do usuário deste jutsu. A consciência do alvo passa a existir dentro de você; se o alvo tentar resistir, você deve ser bem-sucedido em um teste de resistência de Carisma. Em um sucesso, você resiste à tentativa de possessão por 1 mês; em uma falha, o alvo assume o controle do corpo até que você seja bem-sucedido nesse teste.

### YAMANAKA

#### TRANSFERÊNCIA DE MENTE

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Você executa o jutsu mais emblemático do Clã Yamanaka, invadindo a mente e o corpo de uma criatura e sobrescrevendo sua consciência com a sua. Escolha uma criatura que você possa ver dentro do alcance; ela deve realizar um teste de resistência de Carisma. Em uma falha, você transfere sua consciência para o corpo do alvo por 1 minuto, controlando-o como se fosse seu próprio corpo. Em um sucesso, você fica inconsciente até o fim do jutsu, momento em que sua consciência retorna ao seu corpo. Seu corpo permanece onde estava antes da conjuração e fica funcionalmente inconsciente enquanto você ocupa outro corpo; se seu corpo sofrer qualquer dano durante esse período, você retorna imediatamente a ele.

#### DOMINAÇÃO MENTAL BESTIAL

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 4 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Você executa uma versão menos intensa da Transferência Mente em um animal ou criatura com menor força mental que um humano. Escolha uma criatura que você possa ver dentro do alcance; ela deve realizar um teste de resistência de Inteligência. Em uma falha, a criatura se torna amigável a você e mais propensa a realizar tarefas simples durante a duração, embora não lute por você em situações de vida ou morte. Enquanto estiver afetada, você compreende comunicações instintivas básicas, como medo, excitação, fome, busca ou descoberta de alimento.

#### PERTURBAÇÃO DA MENTE

**Classificação:** Hijutsu | **Rank:** Rank-D | **Custo:** 5 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Até 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Você executa uma versão modificada da Transferência de Mente em um humanoide, dissociando as funções mentais e corporais, causando dano psíquico significativo. O alvo deve realizar um teste de resistência de Carisma; em uma falha, sofre 3d8 de dano psíquico, ou metade desse dano em um sucesso. Em Ranks Superiores: Para cada rank acima de Rank-D, aumente o custo em +3 Chakra e o dano em +1d8. RANK-C

#### TÉCNICA DE CONEXÃO MENTAL

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 8 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 153 metros | **Duração:** Até 10 Minutos
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Ninjutsu, Único

Descrição: Você cria um elo telepático temporário entre você e uma criatura voluntária, conhecida por você, dentro do alcance. Enquanto o jutsu durar, ambos podem compartilhar instantaneamente palavras, imagens, sons e outras informações sensoriais, e o alvo reconhece você como a fonte da comunicação. O alvo deve ser capaz de compreender as mensagens e imagens transmitidas para entender suas intenções.

#### TÉCNICA DO CLONE MENTAL

**Classificação:** Hijutsu | **Rank:** Rank-C | **Custo:** 9 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 37 metros | **Duração:** Concentração, até 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Você divide sua consciência em duas cópias idênticas e executa a Transferência de Mente em até dois alvos que você possa ver dentro do alcance. Cada alvo deve realizar um teste de resistência de Carisma. Em uma falha, você transfere uma consciência para o corpo do alvo por 1 minuto. Em um sucesso, você fica caído até o início do seu próximo turno, incapaz de agir, até sua consciência retornar ao corpo original. Cada corpo é controlado por uma consciência separada e não compartilham pensamentos, mas agem conforme sua personalidade. RANK-B

#### DANÇA MENTAL EM MASSA

**Classificação:** Hijutsu | **Rank:** Rank-B | **Custo:** 14 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 19 metros | **Duração:** Concentração, até 1 Minuto
**Componentes:** HS, CM | **Palavras-chave:** Hijutsu, Genjutsu, Único

Descrição: Você emite uma ordem simples (limitada a uma ou duas frases) e influencia até 6 criaturas à sua escolha que possam vê-lo e ouvi-lo dentro do alcance. Cada alvo deve realizar um teste de resistência de Carisma. Em uma falha, o alvo segue a ordem da melhor forma possível durante a duração. Se a ação for concluída antes do tempo, o jutsu termina imediatamente. As criaturas permanecem conscientes de seus atos, mas são incapazes de interrompê-los enquanto o jutsu durar. RANK-A

#### TROCA MENTAL DE MARIONETE: SELO AMALDIÇOADO

**Classificação:** Hijutsu | **Rank:** Rank-A | **Custo:** 20 Chakra
**Tempo de Conjuração:** 1 Ação | **Alcance:** 2 metros | **Duração:** Permanente
**Componentes:** HS, CM, NT, CS | **Palavras-chave:** Hijutsu, Ninjutsu, Fuinjutsu, Único

Descrição: Você utiliza um boneco, marionete ou objeto de forma humanoide, com tamanho não inferior a uma categoria abaixo do alvo, e inscreve nele um selo secreto do Clã Yamanaka. As condições e gatilhos do selo são definidos previamente. Quando uma criatura ativa o selo, ela deve realizar imediatamente um teste de resistência de Carisma em desvantagem. Em uma falha, a consciência do alvo é selada dentro do objeto; seu corpo torna-se imediatamente incapacitado e não pode realizar novos testes de resistência. Se o objeto for destruído, o jutsu termina e a consciência tenta retornar ao corpo; se o corpo estiver morto, a consciência permanece errante, incapaz de se vincular a qualquer coisa, sendo efetivamente considerada morta e irrecuperável.
