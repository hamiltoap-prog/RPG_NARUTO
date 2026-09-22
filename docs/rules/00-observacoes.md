# Observações, Ambiguidades e Inconsistências

Pontos que pareceram incompletos, contraditórios ou ambíguos no documento
original. Todas as citações são fiéis ao texto-fonte (nada foi inventado).

Cada item abaixo traz o **estado atual**:

- ✅ **Fechado** — decidido, e o app já segue a decisão.
- ⏳ **Aberto** — depende de uma decisão de regra do dono da mesa; enquanto
  isso o app segue a leitura literal do manual, marcada em cada item.

Os **19 pontos estão fechados**.

---

## ✅ 1. Clãs citados mas sem ficha completa

No "Sumário da Pontuação de Habilidade" (Capítulo 1), a lista de bônus de
atributo por Clã cita **Hebi, Kaguya, Yuki, Ryu, Kuru, Hoshigaki e
Tsuchigumo**, além dos 13 clãs com seção própria no Capítulo 2. Nenhum dos 7
tem descrição, características, recursos ou lista de jutsus no restante do
documento.

**Decisão:** os 7 entram no app com os bônus de atributo da tabela do Capítulo
1 (que são do manual) e traços simples escritos para a mesa, marcados como
tais. São 20 clãs em `src/data/clans.ts`. O mestre pode reescrever qualquer um
deles, ou criar clãs novos, na criação de personagem.

## ✅ 2. Tabela de Modificadores de Atributo — valor 30

A linha da pontuação 30 mostra o modificador como **"10"**, sem o sinal, e
todas as outras linhas usam "+N".

**Decisão:** erro de digitação. O app calcula pela fórmula
`(pontuação − 10) ÷ 2` arredondada para baixo, que dá **+10** — coerente com o
resto da tabela. O valor literal continua anotado em `01-atributos.md`.

## ✅ 3. Fórmula de dano em acerto crítico é atípica

O texto diz: *"o jogador aplica o valor rolado em seu dado de dano
multiplicado pelo modificador do seu nível de Proficiência ao dano causado
(dados de dano x Proficiência)"* — e não "dobrar os dados", como é comum em
sistemas parecidos.

**Decisão: é intencional**, confirmado pelo dono da mesa. O app multiplica os
dados de dano pelo Bônus de Proficiência (`applyCriticalMultiplier`, em
`src/lib/dice.ts`); o modificador plano do dano não é multiplicado.

## ✅ 4. Mestre Estrategista — ordem de "Xeque-Mate" na tabela

A tabela de progressão lista **"Xeque-Mate (2)"** no 17º nível e
**"Xeque-Mate"** (sem número) no 20º. O texto descritivo da própria
característica diz o contrário: obtida no 17º com 1 uso antes de descanso
longo, passando a 2 usos no 20º.

**Decisão:** o texto descritivo do manual resolve a contradição sozinho — é
numeração invertida na tabela. O app e `03-classes.md` seguem o texto
descritivo (17º: Xeque-Mate; 20º: Xeque-Mate (2)), com a versão da tabela-fonte
anotada ao lado.

## ✅ 5. Especialista em Taijutsu — "Ataque Supremo Extra" (11º nível)

A tabela de progressão lista a característica **"Ataque Supremo Extra"** no
11º nível, mas ela **não é descrita em lugar nenhum** do texto da classe (só
"Ataque Extra", do 5º nível, é descrito).

**Decisão:** é um **terceiro ataque** na ação de Ataque — ou seja, "Ataque
Extra (2)", que é o que a progressão da classe faz esperar. Descrito assim em
`03-classes.md` e em `src/data/classes.ts`, marcado como leitura da mesa e não
do texto-fonte.

## ✅ 6. Vontade do Fogo — linha duplicada

A lista de benefícios repete **"Vantagem ou +5 em um teste de atributo"** duas
vezes seguidas, sem um segundo benefício distinto.

**Decisão:** duplicação de cópia do documento-fonte. A linha aparece uma vez só
em `09-outras-mecanicas.md`, com nota.

## ✅ 7. Tabela de Saque e Espólios — faixa "66-60"

Na tabela 1d100 de espólios especiais (Capítulo 14), "Ferramentas Explosivas"
mostra a faixa **"66-60"**, impossível (limite inferior maior que o superior).

**Decisão:** a linha anterior (Ferramenta Médica) termina em 55 e a seguinte
começa em 61, então **56–60** é a única faixa que fecha o 1d100 sem buraco nem
sobreposição. É o valor usado, com o literal anotado.

## ✅ 8. Perícia "Discernimento" fora da lista oficial

Hyūga e Kurama concedem proficiência em **"Discernimento"**, que não está na
lista de 18 perícias do Capítulo 6 — a mais próxima é **"Intuição"**
(Sabedoria).

**Decisão: são a mesma perícia.** O app mapeia Discernimento → Intuição e diz
isso no texto do clã. A lista segue com 18 perícias.

## ✅ 9. Nenhuma seção "Descansando", apesar de referenciada

O Capítulo 1 diz *"você pode gastar esses dados para recuperar os respectivos
pontos durante um descanso (veja a seção 'Descansando' para as regras
completas)"*, mas **não existe essa seção** no documento — não há duração em
horas, nem limite de descansos por dia, nem a mecânica de gastar Dados de
Vida/Chakra.

**Decisão: vale só o que o manual define de fato**, sem inventar um sistema de
dados gastáveis. Ou seja:

- Chakra: descanso curto recupera **metade do PC máximo**; descanso longo
  recupera **tudo**.
- PV: descanso longo cura **1 PV por nível do personagem**, ou **1d4+1 PV por
  nível do auxiliador** quando alguém trata as feridas. Descanso curto não
  cura PV.

O botão "Longo" da ficha aplica exatamente isso, com um seletor de quem
auxiliou. A frase do Capítulo 1 sobre gastar Dados de Vida/Chakra fica como
referência cruzada a uma seção que não veio no documento.

## ✅ 10. Ciclo de Vantagem Elemental

O ciclo definido é **Fogo > Vento > Raio > Terra > Água > Fogo**, e dá Vantagem
na jogada de ataque ou na Disputa a quem usa o elemento superior.

Uma versão anterior desta lista dizia que o ciclo divergia do Naruto original.
**Isso estava errado, e a nota foi corrigida:** o ciclo do manual é exatamente
o canônico. No anime, Fogo é fraco contra Água, Água contra Terra, Terra contra
Raio, Raio contra Vento e Vento contra Fogo — que lido no outro sentido é
Fogo > Vento > Raio > Terra > Água > Fogo, o mesmo ciclo, só escrito a partir
de outro elemento. Escrever "Vento > Raio > Terra > Água > Fogo > Vento" é
descrever as mesmas cinco relações começando em outro ponto da roda.

**Decisão: fica como está.** O app implementa o ciclo em `ELEMENT_CYCLE`
(`src/lib/jutsuAccess.ts`). Ao escolher um jutsu elemental contra um alvo com
afinidade declarada, a Vantagem é sugerida sozinha e fica visível como caixa
marcável — quem lança pode desmarcar, e o registro da mesa mostra os dois d20
e o motivo ("Fogo supera Vento"). A Vantagem só vale em **jogada de ataque**;
em jutsu de resistência quem rola é o alvo, e a caixa nem aparece.

## ✅ 11. Terminologia "Turno" vs "Rodada" invertida

O documento define **1 Turno = 6 segundos** (a vez de um personagem) e
**10 Turnos = 1 Rodada = 1 minuto** — o oposto do uso mais comum em sistemas
parecidos, mas consistente do começo ao fim do texto.

**Decisão:** não é erro, é a nomenclatura da casa. O contador de combate do app
usa esses significados: a rodada avança quando todo mundo já agiu, e as
condições contam as rodadas restantes.

## ✅ 12. Fórmula "1d4 + o valor bruto do Atributo" nas invocações

Na seção de Invocação (Kuchiyose), testes de atributo e de resistência de
criaturas invocadas usam **"1d4 + o valor bruto do Atributo Relevante da
criatura"** (a pontuação, não o modificador) contra o PR da própria criatura —
diferente do 1d20 + modificador usado em todo o resto do sistema.

**Decisão: é intencional, e agora está automatizado.** O Kuchiyose é um
subsistema separado, e o app o trata como tal (`src/lib/summon.ts`):

- **Teste de atributo ou resistência:** 1d4 + a pontuação bruta contra o PR da
  própria criatura, com Vantagem Natural rolando dois d4. Fica na aba
  "Teste de invocação" das rolagens do mestre, que mostra a conta e avisa
  quando o teste passa sempre ou não passa nunca.
- **Ataque de arma natural:** 1d20 + Modificador de Ataque da criatura +
  Bônus de Ataque do tamanho, contra a CA do alvo.
- **Tabela de Modificadores de Tamanho:** é dela que saem o bônus na CA, os
  Pontos de Resistência, o Bônus de Ataque e o Dado de Dano — o manual é
  explícito quanto a isso, e antes o app usava o Dado de Vida da tribo como
  dado de dano. O tamanho é escolhido junto com o rank ao puxar uma tribo do
  manual para o bestiário.

Como o PR sobe com o tamanho (10 no Minúsculo, 20 no Gigantesco), criatura
grande acerta mais e resiste pior — que é exatamente o que a "Nota 2" do
manual diz em palavras.

## ✅ 13. Escopo do que foi e não foi transcrito por extenso

- **Manobras** do Ninja Explorador, **Roteiros de Genjutsu**, **Dádivas
  Mentais** (Yamanaka) e **Armadilhas Táticas** (Mestre Estrategista): todas as
  entradas transcritas em `03-classes.md`.
- **631 jutsus/técnicas** com stat-block completo (nome, Classificação, Rank,
  Tempo, Alcance, Duração, Componentes, Custo, Palavras-chave e descrição
  integral) extraídos programaticamente para `04-jutsus.md`, com cópia
  estruturada em `jutsus_parsed.json`. Nenhum foi omitido — a contagem bate com
  os campos "Classificação:" do texto-fonte (631 = 631).
- Invocação (Kuchiyose) copiada literalmente e por completo em
  `04b-invocacoes.md`.

## ✅ 13b. Contradição nos Dados de Vida da invocação

A tabela de Rank e a nota de rodapé logo abaixo dela discordam:

- a **tabela** dá a coluna "Dados de Vida/Chakra" por Rank — D: Nível 2,
  **2 DV / 2 DC**; C: Nível 4, 4 DV / 4 DC; e assim por diante (1 DV por
  nível);
- a **nota de rodapé** diz "*Cada nível concede **2** Dados de Vida (DV) e 2
  Dados de Chakra (DC) à invocação*" — o que daria 4 DV no Rank D, não 2.

**Decisão: vale a coluna da tabela** — 2/4/6/8/10 DV por Rank D/C/B/A/S, que é
o dado concreto do manual e o que o app já usa (`SUMMON_RANKS`, em
`src/types.ts`). A nota de rodapé fecha com isso se "nível" ali for lido como
"degrau de Rank".

## ✅ 13c. "16 criaturas" vs 17 stat-blocks

O resumo no topo de `04b-invocacoes.md` fala em "16 criaturas", mas o
documento traz **17** stat-blocks: Urso, Javali, Cachorro/Lobo, Lebre/Coelho,
Falcão/Aves Predadoras, Enxame de Insetos, Lagarto, Macaco/Primata,
Boi/Carneiro, Rato, Tubarão, Lesma, Cobra, Aranha, Tigre/Leão, Sapo,
Tartaruga.

**Decisão:** a contagem do resumo é que está errada. As **17** estão em
`src/data/summons.ts` e no bestiário do app.

## ✅ 13d. Equipamento inicial cita itens fora do capítulo de Equipamento

O equipamento inicial das classes nomeia itens que **não existem** no catálogo
do Capítulo 5: *bombas de fumaça*, *bomba de papel* / *Papéis Bomba*,
*Lâminas de Soco*, *Tecido de Contenção*, *Kit de Medicina*, *Pergaminhos em
Branco*, *Pergaminho de Ninjutsu (Rank-D)* e *Jaqueta de Combate*.

**Decisão: resolvidos, de duas formas.**

**Quatro eram o mesmo item com outro nome** — como "Discernimento" e
"Intuição". O texto do equipamento inicial passa por uma tabela de sinônimos
(`SINONIMOS`, em `src/lib/equipment.ts`) em vez de o catálogo ganhar
duplicatas:

| Nome citado pela classe | Item do catálogo |
|---|---|
| bomba de papel · Papéis Bomba | Selos Explosivos (100 ryo) |
| Lâminas de Soco | Lâminas de Punho (35 ryo) |
| Kit de Medicina | Kit Médico (75 ryo) |

**Os outros cinco viraram itens da casa**, com preço e efeito definidos para a
mesa e sempre ancorados em algo que o manual já precifica. Ficam marcados com
`houseRule` no catálogo e aparecem com a etiqueta *"item da casa"* nos
seletores de compra e de entrega, para não se passarem por regra do livro:

| Item da casa | Preço | Âncora usada |
|---|---|---|
| Bomba de Fumaça | 75 ryo | metade da Bomba de Pimenta (150), que faz névoa e ainda dá um bônus |
| Tecido de Contenção | 60 ryo | um pouco acima da Corda de 15m (20 ryo), por ser ferramenta de contenção |
| Pergaminho em Branco | 20 ryo | acima do Papel para Selos (15 ryo), por comportar mais que uma folha |
| Pergaminho de Ninjutsu (Rank-D a S) | 250 · 750 · 1500 · 3000 · 6000 ryo | acima de um Kit de Ferramentas (200 ryo), subindo com o rank |
| Jaqueta de Combate | 30 ryo | acima da Armadura de Couro (+2, 25 ryo), pelos bolsos de saque rápido |

Com isso, **as 60 alternativas de equipamento inicial das 8 classes** resolvem:
50 viram item do catálogo e 10 são escolhas abertas por categoria ("1 arma
simples"). Nenhuma sobra como nome solto.

## ✅ 14. Itens com o mesmo nome em lugares diferentes

Existe uma técnica **"FLORESCER VELOZ"** em duas categorias (uma Taijutsu
Rank-D, outra Bukijutsu Rank-C, com Braçadeiras/Garra de Ferro). Não é erro de
extração: são duas técnicas distintas de mesmo nome. Ambas foram preservadas
em `04-jutsus.md`.

## ✅ 15. Numeração de capítulo duplicada no original

Cada capítulo do documento original tem cabeçalho duplicado (ex.: "# CAPÍTULO
1**" seguido de "# **CAPÍTULO 1: Personagem..."), resultado da conversão do
Google Docs. Não afeta o conteúdo. A duplicação não foi reproduzida.

---

**Nenhum clã, classe ou jutsu foi omitido por brevidade.** Contagens finais:
**20 clãs** (13 do Capítulo 2, com 9 trazendo listas de jutsu exclusivas num
total de 86 jutsus de clã, mais os 7 citados só na tabela do Capítulo 1),
**8 classes**, **631 jutsus/técnicas** com stat-block completo,
**17 criaturas de invocação**, **18 perícias**, **10 históricos**.
