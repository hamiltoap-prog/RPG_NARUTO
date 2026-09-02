# Observações, Ambiguidades e Inconsistências

Lista de pontos que pareceram incompletos, contraditórios ou ambíguos no documento original, para confirmar com o usuário antes de finalizar dados de código. Todas as citações abaixo são fiéis ao texto-fonte (não foram inventadas).

## 1. Clãs citados mas sem ficha completa
No "Sumário da Pontuação de Habilidade" (Capítulo 1), a lista de bônus de atributo por Clã cita os clãs **Hebi, Kaguya, Yuki, Ryu, Kuru, Hoshigaki e Tsuchigumo**, além dos 13 clãs que têm seção própria no Capítulo 2. Nenhum desses 7 clãs adicionais tem descrição, características, recursos ou lista de jutsus no restante do documento — só aparecem como fonte de bônus de atributo nessa tabela-resumo inicial. Pode ser conteúdo cortado/incompleto do livro original, ou clãs que o Mestre deveria criar por conta própria. **Recomendo perguntar ao usuário se esses 7 clãs devem ser ignorados, ou se há material adicional (outra aba da planilha, outro documento) que os complete.**

## 2. Tabela de Modificadores de Atributo — valor 30
Na tabela de modificadores (Capítulo 1), a linha para pontuação 30 mostra o modificador como **"10"** (sem o sinal "+"), enquanto todas as outras linhas usam o formato "+N". Muito provavelmente é um erro de digitação e deveria ser "+10", mas mantive o valor literal na tabela em 01-atributos.md com uma nota.

## 3. Fórmula de dano em acerto crítico é atípica
O texto diz: *"o jogador aplica o valor rolado em seu dado de dano multiplicado pelo modificador do seu nível de Proficiência ao dano causado (dados de dano x Proficiência)"*. Isso é diferente do padrão comum em D&D-like (dobrar os dados de dano). Ou seja, literalmente: dano rolado × Bônus de Proficiência. Isso pode gerar números muito altos em níveis avançados (ex.: Bônus de Proficiência +9 no nível 20 multiplicaria o dano por 9). **Vale confirmar com o usuário se é essa mesma a intenção, ou se é um erro de redação e o correto seria "dobrar" como usual.**

## 4. Mestre Estrategista — ordem de "Xeque-Mate" na tabela parece invertida
A tabela de progressão lista **"Xeque-Mate (2)"** no nível 17 e **"Xeque-Mate"** (sem número) no nível 20. O texto descritivo da característica, porém, diz que "Xeque-Mate" é obtida no 17º nível (1 uso antes de descanso longo) e melhora no 20º nível (2 usos). Ou seja, a ordem/numeração da tabela parece trocada — deveria ser "Xeque-Mate" no 17º e "Xeque-Mate (2)" no 20º. Mantive a tabela literal em 03-classes.md com uma nota.

## 5. Especialista em Taijutsu — "Ataque Supremo Extra" (nível 11) nunca é descrito
A tabela de progressão do Especialista em Taijutsu lista a característica **"Ataque Supremo Extra"** no 11º nível, mas essa característica **não aparece em nenhum lugar do texto descritivo** da classe (só "Ataque Extra" no 5º nível é descrito). Pode ser uma característica cortada do documento original, um nome alternativo para outra coisa (ex.: seria de se esperar "Ataque Extra (2)", permitindo um 3º ataque), ou conteúdo faltante. **Vale perguntar ao usuário/fonte original o que essa característica deveria fazer.**

## 6. Vontade do Fogo — possível duplicação
A lista de benefícios possíveis da "Vontade do Fogo" (Capítulo 3) repete a linha **"Vantagem ou +5 em um teste de atributo"** duas vezes seguidas. Provável erro de cópia/formatação no documento original — não há um segundo benefício distinto ali.

## 7. Tabela de Saque e Espólios — faixa "66-60" inválida
Na tabela 1d100 de espólios especiais (Capítulo 14), a linha para "Ferramentas Explosivas" mostra a faixa **"66-60"**, que é matematicamente inválida (limite inferior maior que o superior). Pelo contexto (a linha anterior termina em 50 e a seguinte começa em 61), o valor correto provavelmente deveria ser **"51-55"** ou **"56-60"** — mas a linha anterior (Ferramenta Médica) já usa "51-55", então o mais provável é que devesse ser "56-60". Mantive o valor literal com nota em 09-outras-mecanicas.md.

## 8. Perícia "Discernimento" não está na lista oficial de perícias
Vários clãs (Hyūga, Kurama) concedem proficiência em uma perícia chamada **"Discernimento"**, mas a lista oficial de 18 perícias do Capítulo 6 ("Os Seis Atributos e Perícias") não inclui uma perícia com esse nome — ela lista "Intuição" (Sabedoria) como a perícia mais próxima semanticamente. É possível que "Discernimento" seja um sinônimo de "Intuição" usado de forma inconsistente pelo autor, ou uma perícia adicional não documentada na lista central. **Vale confirmar se são a mesma coisa.**

## 9. Nenhuma seção "Descansando" dedicada, apesar de referenciada
O Capítulo 1 diz explicitamente *"você pode gastar esses dados para recuperar os respectivos pontos durante um descanso (veja a seção 'Descansando' para as regras completas)"*, e o Capítulo 9 também menciona duração de Descanso Curto/Longo. Porém, **não existe no documento uma seção autônoma chamada "Descansando"** com regras completas (duração em horas de um descanso curto/longo, quantos descansos por dia, mecânica exata de "gastar Dados de Vida/Chakra" para recuperar pontos fora do que já foi extraído). As únicas regras de descanso encontradas e já documentadas (em 05-combate.md e no corpo do texto de PC) são: Chakra — Descanso Curto recupera metade do PC máximo, Descanso Longo recupera tudo; Cura de PV — Descanso Longo cura 1 PV/nível, ou 1d4+1 PV/nível se assistido. **A mecânica de "gastar Dados de Vida/Chakra" durante o descanso (citada no Cap. 1) nunca é detalhada com uma regra numérica própria — parece ser uma referência cruzada a uma seção que não está presente neste documento (pode ter sido cortada, ou estar em outra aba/documento).**

## 10. Ciclo de Vantagem Elemental diverge do canônico de Naruto
O ciclo definido é **Fogo > Vento > Raio > Terra > Água > Fogo**. É provavelmente uma escolha proposital de balanceamento do sistema (não precisa espelhar o anime/mangá), mas diverge da relação mais comumente associada ao Naruto original (onde Vento fortalece Fogo, não o "vence"). Não é necessariamente um erro — é homebrew — mas vale confirmar com o usuário se é essa mesma a intenção de design.

## 11. Terminologia "Turno" vs "Rodada" invertida em relação ao uso comum
O documento define: **1 Turno = 6 segundos** (a vez de agir de um personagem) e **10 Turnos = 1 Rodada = 1 minuto**. Isso é o oposto da nomenclatura mais comum em jogos como D&D 5e (onde "rodada" = 6 segundos = todos agem uma vez, e não existe usualmente um "turno" de 6s que seja menor que a rodada). Aqui, "turno" é a unidade menor (ação de 1 personagem) e "rodada" é o ciclo maior (todos os ~10 participantes agem). Isso é consistente ao longo de todo o texto (várias características de classe usam "1 turno" e "1 rodada" com este significado), mas é importante ter isso claro na hora de programar o sistema de turnos, para não inverter a lógica.

## 12. Fórmula "1d4 + o valor bruto do Atributo" nas invocações
Na seção de Invocação (Kuchiyose), testes de atributo/resistência de criaturas invocadas usam **"1d4 + o valor bruto do Atributo Relevante da criatura"** (não o modificador, o valor bruto da pontuação, ex.: Força 15) comparado ao PR da própria criatura. Isso é uma mecânica claramente diferente do restante do sistema (que usa 1d20 + modificador vs. PR do personagem). Documentei fielmente em 04b-invocacoes.md, mas é importante não confundir esse subsistema com o sistema de testes de atributo "normal" do resto do livro.

## 13. Escopo do que foi e não foi transcrito por extenso
- As descrições de **Manobras** do Ninja Explorador, **Roteiros de Genjutsu**, **Dádivas Mentais** (Yamanaka) e **Armadilhas Táticas** (Mestre Estrategista) foram transcritas de forma completa (todas as entradas, com efeito resumido fiel ao texto original) em 03-classes.md.
- As descrições completas (nome + Classificação + Rank + Tempo + Alcance + Duração + Componentes + Custo + Palavras-chave + Descrição integral) de **todos os 631 jutsus/técnicas** do documento (Ninjutsu não-elemental, 5 estilos elementais, Genjutsu, Taijutsu, Bukijutsu, e todos os jutsus exclusivos de clã) foram extraídas **programaticamente e de forma fiel** (sem resumir texto) para `04-jutsus.md`, com uma cópia estruturada em JSON (`jutsus_parsed.json`) para facilitar conversão a código. Nenhum jutsu foi omitido — a extração automática foi verificada contra a contagem de campos "Classificação:" no texto-fonte (631 = 631, sem sobras nem faltas).
- A seção de Invocação (Kuchiyose) foi copiada **literalmente e por completo** (doutrina + as 16 criaturas com stat-blocks e tabelas de progressão) em `04b-invocacoes.md`, por ser extensa e autocontida.

## 14. Itens que aparecem em mais de um lugar com o mesmo nome
Existe uma técnica chamada **"FLORESCER VELOZ"** em duas categorias diferentes (uma classificada como Taijutsu Rank-D, outra como Bukijutsu Rank-C usando Braçadeiras/Garra de Ferro) — não é um erro de extração, são duas técnicas distintas com o mesmo nome em categorias diferentes; ambas foram preservadas em `04-jutsus.md`.

## 15. Chapter numbering duplicado no início de cada capítulo
Cada capítulo no documento original tem um cabeçalho duplicado (ex.: "# CAPÍTULO 1**" seguido logo depois por "# **CAPÍTULO 1: Personagem..."), provavelmente resultado da conversão do Google Docs para texto. Não afeta o conteúdo, apenas a formatação — não reproduzi essa duplicação nos arquivos gerados.

---

**Nenhum clã, classe ou jutsu foi omitido por brevidade.** Contagens finais: **13 clãs** (9 com listas de jutsu exclusivas, totalizando 86 jutsus de clã), **8 classes**, **631 jutsus/técnicas** com stat-block completo (todas as categorias), **16 criaturas de invocação**, **18 perícias**, **10 históricos**.
