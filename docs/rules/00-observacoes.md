# Observações, Ambiguidades e Inconsistências

Pontos que pareceram incompletos, contraditórios ou ambíguos no documento
original. Todas as citações são fiéis ao texto-fonte (nada foi inventado).

Cada item abaixo traz o **estado atual**:

- ✅ **Fechado** — decidido, e o app já segue a decisão.
- ⏳ **Aberto** — depende de uma decisão de regra do dono da mesa; enquanto
  isso o app segue a leitura literal do manual, marcada em cada item.

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

## ⏳ 5. Especialista em Taijutsu — "Ataque Supremo Extra" (11º nível)

A tabela de progressão lista a característica **"Ataque Supremo Extra"** no
11º nível, mas ela **não é descrita em lugar nenhum** do texto da classe (só
"Ataque Extra", do 5º nível, é descrito).

**Enquanto não houver decisão:** o app mostra a linha da tabela como está, com
a observação de que a característica não tem efeito descrito. A leitura mais
provável é que seja "Ataque Extra (2)" — um terceiro ataque —, mas isso muda o
poder da classe e não é uma escolha do app.

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

## ⏳ 8. Perícia "Discernimento" fora da lista oficial

Hyūga e Kurama concedem proficiência em **"Discernimento"**, que não está na
lista de 18 perícias do Capítulo 6 — a mais próxima é **"Intuição"**
(Sabedoria).

**Enquanto não houver decisão:** o app mapeia Discernimento → Intuição (é a
leitura que mantém as 18 perícias fechadas), e diz isso no texto do clã. Se
forem perícias diferentes, a lista do Capítulo 6 passa a ter 19 entradas e é
só acrescentar.

## ⏳ 9. Nenhuma seção "Descansando", apesar de referenciada

O Capítulo 1 diz *"você pode gastar esses dados para recuperar os respectivos
pontos durante um descanso (veja a seção 'Descansando' para as regras
completas)"*, mas **não existe essa seção** no documento — não há duração em
horas, nem limite de descansos por dia, nem a mecânica de gastar Dados de
Vida/Chakra.

**O que o manual traz de fato, e que o app já segue:**

- Chakra: descanso curto recupera **metade do PC máximo**; descanso longo
  recupera **tudo**.
- PV: descanso longo cura **1 PV por nível do personagem**, ou **1d4+1 PV por
  nível do auxiliador** quando alguém trata as feridas. Descanso curto não
  cura PV.

O botão "Longo" da ficha aplica exatamente isso, com um seletor de quem
auxiliou. **Continua aberto** só o "gastar Dados de Vida/Chakra" do Capítulo 1,
que nunca recebe uma regra numérica.

## ⏳ 10. Ciclo de Vantagem Elemental diverge do canônico de Naruto

O ciclo definido é **Fogo > Vento > Raio > Terra > Água > Fogo**, que dá
Vantagem na jogada de ataque ou na Disputa a quem usa o elemento superior.
Diverge da relação mais comum no Naruto original (onde Vento *fortalece* Fogo
em vez de vencê-lo).

**Enquanto não houver decisão:** o app implementa o ciclo **como está escrito
no manual** (`ELEMENT_CYCLE` em `src/lib/jutsuAccess.ts`). Ao escolher um
jutsu elemental contra um alvo com afinidade declarada, a vantagem é sugerida
sozinha e fica visível como caixa marcável — quem lança pode desmarcar, e o
registro da mesa mostra os dois d20 e o motivo ("Fogo supera Vento"). Trocar o
ciclo depois é mexer em uma linha só.

## ✅ 11. Terminologia "Turno" vs "Rodada" invertida

O documento define **1 Turno = 6 segundos** (a vez de um personagem) e
**10 Turnos = 1 Rodada = 1 minuto** — o oposto do uso mais comum em sistemas
parecidos, mas consistente do começo ao fim do texto.

**Decisão:** não é erro, é a nomenclatura da casa. O contador de combate do app
usa esses significados: a rodada avança quando todo mundo já agiu, e as
condições contam as rodadas restantes.

## ⏳ 12. Fórmula "1d4 + o valor bruto do Atributo" nas invocações

Na seção de Invocação (Kuchiyose), testes de atributo e de resistência de
criaturas invocadas usam **"1d4 + o valor bruto do Atributo Relevante da
criatura"** (a pontuação, não o modificador) contra o PR da própria criatura —
diferente do 1d20 + modificador usado em todo o resto do sistema.

**Enquanto não houver decisão:** documentado fielmente em `04b-invocacoes.md`.
O app não automatiza esse subsistema; as criaturas na mesa rolam pelo sistema
normal, que é o que o mestre usa no combate.

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

## ⏳ 13b. Contradição nos Dados de Vida da invocação

A tabela de Rank e a nota de rodapé logo abaixo dela discordam:

- a **tabela** dá a coluna "Dados de Vida/Chakra" por Rank — D: Nível 2,
  **2 DV / 2 DC**; C: Nível 4, 4 DV / 4 DC; e assim por diante (1 DV por
  nível);
- a **nota de rodapé** diz "*Cada nível concede **2** Dados de Vida (DV) e 2
  Dados de Chakra (DC) à invocação*" — o que daria 4 DV no Rank D, não 2.

**Enquanto não houver decisão:** o app segue a **coluna da tabela**
(2/4/6/8/10 DV por Rank D/C/B/A/S), por ser o dado concreto, e porque a nota
fecha se "nível" ali for lido como "degrau de Rank". Se a intenção for a nota,
basta dobrar os valores em `SUMMON_RANKS` (`src/types.ts`).

## ✅ 13c. "16 criaturas" vs 17 stat-blocks

O resumo no topo de `04b-invocacoes.md` fala em "16 criaturas", mas o
documento traz **17** stat-blocks: Urso, Javali, Cachorro/Lobo, Lebre/Coelho,
Falcão/Aves Predadoras, Enxame de Insetos, Lagarto, Macaco/Primata,
Boi/Carneiro, Rato, Tubarão, Lesma, Cobra, Aranha, Tigre/Leão, Sapo,
Tartaruga.

**Decisão:** a contagem do resumo é que está errada. As **17** estão em
`src/data/summons.ts` e no bestiário do app.

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
