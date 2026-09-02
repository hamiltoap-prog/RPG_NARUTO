# Dados de regras

Clãs (`clans.ts`), classes (`classes.ts`), perícias (`skills.ts`), condições
(`conditions.ts`), tabela de XP/proficiência (`xpTable.ts`), catálogo de
jutsus (`jutsus.ts`, gerado programaticamente) e equipamentos
(`equipment.ts`) foram extraídos do manual de regras completo do usuário
(documento Google Docs, ~955 mil caracteres). O texto-fonte completo, fiel
ao original, está em `docs/rules/` na raiz do repositório.

## O que é modelado de forma automatizada

Atributos, bônus de clã, dado de vida/chakra por classe, Pontos de
Resistência (PR) por nível/classe, bônus de proficiência, CA, tabela de
XP, e o catálogo de 631 jutsus com stat-block completo (nome, rank, custo,
alcance, duração, descrição).

## O que fica como texto de referência (não automatizado)

Arquétipos/subclasses de cada classe (`subclassesText`), traços
progressivos de clã (`featuresText`), sistema de invocação, talentos,
históricos, itens aprimorados por chakra, regras de construção de NPC/
adversário do Mestre — tudo isso o app trata como bookkeeping e consulta,
não como automação de regras (o próprio jogo já é resolvido narrativamente
pela mesa, com o mestre liberando cada mudança de ficha).

## Pontos resolvidos com o usuário

- Os 7 clãs citados só na tabela-resumo de bônus de atributo (Hebi,
  Kaguya, Yuki, Ryu, Kuru, Hoshigaki, Tsuchigumo) foram incluídos em
  `clans.ts` com ficha simplificada (bônus de atributo + descrição
  genérica, sem traços progressivos nem jutsus exclusivos, já que o
  manual-fonte não traz esse material para eles) — confirmado pelo
  usuário.
- Fórmula de dano em crítico ("dados de dano × Bônus de Proficiência") é
  proposital, não erro de redação — confirmado pelo usuário. Mantida como
  está no texto-fonte; o app não automatiza cálculo de dano.

## Pontos ainda em aberto no manual-fonte (ver `docs/rules/00-observacoes.md`)

- A perícia "Discernimento" citada como proficiência de clã (Hyūga,
  Kurama) não existe na lista oficial de 18 perícias — foi mapeada para
  "Intuição" em `clans.ts` como aproximação.
- "Ataque Supremo Extra" (Especialista em Taijutsu, 11º nível) aparece na
  tabela de progressão mas nunca é descrito no texto-fonte.
