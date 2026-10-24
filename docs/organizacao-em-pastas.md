# Organização em pastas — como funciona

Resumo técnico do sistema de pastas e subpastas da Mesa Ninja, para servir de
referência ao levar a mesma organização para outro projeto parecido. Cobre a
ideia central, o modelo de dados, as funções puras, a escrita no banco, a
tela e onde ele é usado: a **biblioteca da tela de jogo** (cenas/mapas, peças
prontas e histórias) e as **bibliotecas de personagens** (NPCs de ficha
simples, NPCs de ficha completa e criaturas do bestiário — monstros, animais,
chefes e invocações).

Stack de referência: React + TypeScript, Firestore em tempo real
(`onSnapshot`). Arquivos principais: `src/lib/pastas.ts` (regras),
`src/components/Pastas.tsx` (árvore e seletor), `src/lib/store.ts`
(`moverParaPasta`, `moverPasta`), `src/components/SceneLibraryPanel.tsx`,
`src/components/NpcManager.tsx`, `src/components/BestiaryPanel.tsx`.

---

## 1. A ideia central: pasta não é documento

Não existe coleção de pastas. Cada item guarda **o caminho** da pasta em que
está, num campo de texto:

```ts
folder?: string   // "Cena 01/Konoha"  → o item está em Cena 01 › Konoha
                  // ausente           → item solto, na raiz ("Sem pasta")
```

A árvore é **montada na hora**, a partir dos caminhos dos itens. Daí vêm,
de graça, as propriedades que um mestre espera de pasta:

- **pasta vazia some sozinha** — quando o último item sai, ninguém mais cita
  aquele caminho; não sobra pasta fantasma para limpar;
- **criar subpasta é só mover um item** para um caminho novo
  (`Cena 01 > Konoha`); a pasta passa a existir nesse instante;
- **renomear ou mover uma pasta** é trocar o começo do caminho em todos os
  itens dela, subpastas incluídas;
- **o mesmo código serve para qualquer coisa que tenha `folder`** — cenas,
  NPCs, criaturas, histórias;
- itens antigos, gravados quando a pasta era um nome só (`"Konoha"`), já são
  um caminho de um nível — **nada a migrar**.

O custo dessa escolha: não dá para ter pasta vazia "preparada" de antemão. Na
prática não faz falta — a pessoa cria a pasta no momento em que guarda a
primeira coisa nela.

## 2. Modelo de dados

O campo é o mesmo em todas as coleções que têm pasta:

| Coleção (`tables/{mesa}/…`) | O que guarda | Quem lê / escreve |
|---|---|---|
| `sceneLibrary` | cenas (mapa + enquadramento + névoa + peças + som), peças prontas e histórias (slides) | só o mestre |
| `npcs` | NPCs de ficha simples (e criaturas postas na mesa) | todos leem; mestre escreve |
| `characters` (com `isNPC: true`) | NPCs de ficha completa | todos leem; mestre escreve |
| `bestiary` | criaturas do mestre: NPC, animal, monstro, chefe, invocação | só o mestre |

```ts
interface SceneLibraryItem { id; kind: 'map' | 'token' | 'story'; label; folder?: string; … }
interface NPC              { id; name; folder?: string; … }
interface Character        { id; name; isNPC?: boolean; folder?: string; … }
interface BestiaryEntry    { id; name; kind: 'npc'|'animal'|'monster'|'boss'|'summon'; folder?: string; … }
```

Formato do caminho gravado:

- separador `/`, sem barra no começo nem no fim: `"Cena 01/Konoha"`;
- cada pedaço aparado e com espaços internos colapsados;
- caminho vazio **não é gravado** — o campo sai do documento
  (`deleteField()`), em vez de ficar `""`.

## 3. As regras (funções puras, `lib/pastas.ts`)

Tudo que decide alguma coisa é função pura e testada (`pastas.check.ts`). A
tela só desenha o resultado.

```ts
normalizarCaminho(bruto)      // aceita o que a pessoa digita: "Cena 01 > Konoha",
                              // "Cena 01 / Konoha", "Cena 01 › Konoha" → "Cena 01/Konoha"
partesDo(caminho)             // ["Cena 01", "Konoha"]
mostrarCaminho(caminho)       // "Cena 01 › Konoha"  (vazio → "Sem pasta")
nomeDaPasta(caminho)          // "Konoha"
pastaDeCima(caminho)          // "Cena 01"  (primeiro nível → "")
estaDentro(item, pasta)       // item está na pasta OU numa subpasta dela?
                              // ("Cena 010" NÃO está dentro de "Cena 01": compara por pedaço)
todasAsPastas(caminhos)       // todas as pastas, incluindo as de cima que não têm item
                              // direto, em ordem de árvore — é a lista do "mover para"
montarArvore(itens, pastaDe, rotulo)   // a árvore pronta para desenhar
caminhoDepoisDeMover(item, de, para)   // o caminho novo do item, ou null se ele não muda
destinoDaPasta(pasta, novaDeCima)      // "mover Konoha para dentro de Arco 1" → "Arco 1/Konoha"
paraGravar(caminho)           // caminho limpo, ou undefined (não grava)
```

Detalhes que importam:

- **Ordenação** com `localeCompare('pt', { sensitivity: 'base', numeric: true })`:
  sem diferença de maiúscula/acento e com número em ordem de número —
  "Cena 2" vem antes de "Cena 10".
- **A árvore** (`montarArvore`) devolve nós `{ caminho, nome, subpastas,
  itens, total }`. A raiz guarda os itens soltos e as pastas de primeiro
  nível; `total` conta o item **em todas as pastas do caminho** — "Cena 01
  (3)" quando há 1 item direto e 2 numa subpasta.
- **Renomear e mover são a mesma operação**: trocar o prefixo `de` por
  `para`. `caminhoDepoisDeMover` devolve `null` para quem não está na pasta
  (nada a gravar) e **recusa mover uma pasta para dentro dela mesma** — isso
  sumiria com a árvore.
- `para` vazio sobe o conteúdo para a raiz ("desfazer a pasta").

## 4. Escrita no banco

Duas operações, iguais para todas as coleções (`ColecaoComPasta =
'sceneLibrary' | 'npcs' | 'characters' | 'bestiary'`):

```ts
// Um item para uma pasta (vazio = solto).
moverParaPasta(mesa, colecao, id, caminho)
  → updateDoc(doc, { folder: paraGravar(caminho) ?? deleteField() })

// Renomear ou mover uma pasta inteira: um writeBatch com todos os itens dela.
moverPasta(mesa, colecao, itens, de, para)
  → para cada item: caminhoDepoisDeMover(item.folder, de, para)
    null → pula;  "" → deleteField();  senão → o caminho novo
```

O `writeBatch` faz a mudança da pasta inteira **numa escrita só**: ninguém vê
metade da pasta renomeada. Quando uma árvore mistura duas coleções (NPC de
ficha simples + ficha completa), o mover roda nas duas
(`Promise.all([moverPasta(…'npcs'…), moverPasta(…'characters'…)])`).

As regras do Firestore não precisam de nada novo: `folder` é um campo do
item, e quem pode escrever o item (o mestre) pode mudar a pasta dele.

## 5. A tela (`components/Pastas.tsx`)

Dois componentes genéricos, usados por todas as bibliotecas:

**`ArvoreDePastas<T>`** — desenha a árvore de qualquer coisa:

```tsx
<ArvoreDePastas
  itens={…}                     // já filtrados (busca, tipo)
  pastas={todasAsPastas(…)}     // para o "mover pasta"
  pastaDe={(i) => i.folder}
  rotulo={(i) => i.name}        // ordena os itens
  chave={(i) => i.id}
  renderItem={(i) => <Cartao … />}          // cada tela desenha o seu item
  onMoverPasta={(de, para) => moverPasta(…)}
  lembrarAbertasEm="mesa-ninja:pastas-npcs:{mesa}"  // localStorage
  classeDosItens="grid gap-2 sm:grid-cols-2"
/>
```

- cada pasta mostra `▾ 📁 Nome (total)`, abre/fecha, e tem **renomear** e
  **mover pasta** (um select com as pastas possíveis — nunca ela mesma nem
  uma de dentro dela — e "(primeiro nível)");
- subpastas aparecem recuadas, com uma linha à esquerda;
- os soltos aparecem por último, em "Sem pasta" (rótulo de tela, não um
  valor gravado);
- **o que está aberto/fechado é lembrado por navegador** (`localStorage`,
  sempre em `try/catch` — aba anônima não pode quebrar a tela);
- cada item é envolvido num `<div class="contents">`, para o `grid` da
  página continuar funcionando com os cartões.

**`SelectDePasta`** — o "mover para" de cada item:

- opções: "Sem pasta", todas as pastas pelo **caminho inteiro**
  ("Cena 01 › Konoha" — só "› Konoha" confundia quando havia duas Konohas) e
  **"+ nova pasta…"**;
- "+ nova pasta" abre um `prompt` já preenchido com a pasta atual +
  " › ", e aceita `>`, `/` ou `›` como separador — é assim que a pessoa cria
  uma subpasta.

Nos formulários de criação (guardar cena, criar NPC, nova história) o campo
de pasta é um `<input>` livre com `<datalist>` das pastas que já existem
(mostradas com `>`), passado por `paraGravar` antes de gravar.

## 6. Onde é usado

### 6.1 Biblioteca da tela de jogo (mapas, peças e histórias)

Uma árvore só para os três tipos (`sceneLibrary`), porque a pasta de um arco
junta tudo o que o mestre vai usar nele:

- **Cena** (`kind: 'map'`): guarda a cena inteira num retrato — imagem,
  enquadramento (zoom/giro/deslocamento), grade, dia/noite, luz, névoa e
  peças (sem clones/invocações temporárias) — e o som que tocava. "Abrir
  cena" remonta tudo e lembra de onde veio (`fromLibraryId`), para o mestre
  poder **gravar por cima** ("Atualizar") em vez de acumular cópias.
- **Peça pronta** (`kind: 'token'`): "criar peça" põe na bandeja.
- **História** (`kind: 'story'`): os slides do modo apresentação (ver o
  documento próprio); "apresentar" e "editar".

Em cima da árvore, filtros por tipo (Tudo / Cenas / Histórias / Peças, com
contagem). Cada item: miniatura, nome (clica para renomear), tipo, botões do
tipo, "mover para" e remover.

### 6.2 Biblioteca de NPCs (aba NPCs do mestre)

- **Uma árvore só para as duas fontes**: NPCs de ficha simples (`npcs`) e de
  ficha completa (`characters` com `isNPC`). Em jogo são todos "quem está do
  outro lado", e o guarda de ficha simples e o jonin de ficha completa da
  mesma cena ficam juntos na mesma pasta.
- O item é uma união: `{ tipo: 'npc', npc } | { tipo: 'ficha', c }`, com
  `pastaDe` e `rotulo` sabendo ler os dois.
- Busca por nome em cima da árvore (filtra os itens antes de montar).
- A ficha completa **abre dentro da aba NPCs**; a aba Personagens fica só com
  os jogadores.
- A criação (rápida, simples ou passo a passo) já tem campo de pasta.

### 6.3 Bestiário (monstros, animais, chefes, invocações)

- Árvore própria, separada da dos NPCs (decisão de projeto: o bestiário é o
  "molde", os NPCs são o que está na mesa).
- **"Pôr na mesa" leva a pasta junto**: a criatura vira NPC já na mesma pasta
  em que estava no bestiário.

## 7. Como portar para outro sistema

1. Acrescente `folder?: string` a cada tipo que vai ter pasta. Nada mais no
   modelo.
2. Copie `lib/pastas.ts` inteiro — é puro, sem dependência de banco nem de
   tela — e as checagens dele.
3. Implemente as duas escritas (`moverParaPasta`, `moverPasta`) no seu banco.
   A única exigência é que mover a pasta inteira seja atômico (batch /
   transação).
4. Copie `ArvoreDePastas` e `SelectDePasta`; cada tela só fornece
   `renderItem`, `pastaDe`, `rotulo`, `chave` e `onMoverPasta`.
5. Nos formulários de criação, um campo de pasta livre com sugestões
   (`datalist`) e `paraGravar` antes de gravar.
6. Decida quais coleções dividem a mesma árvore (aqui: NPC simples + NPC
   completo juntos; bestiário separado; cenas + peças + histórias juntas).

## 8. Armadilhas que viraram bug (ou quase)

1. **"Cena 010" dentro de "Cena 01".** Comparar por `startsWith` de texto
   puro casa as duas. `estaDentro` compara `c === p || c.startsWith(p + '/')`.
2. **Mover uma pasta para dentro dela mesma** apaga a árvore do mapa (os
   itens vão para um caminho que nunca aparece). Recusado na função pura e
   escondido no select.
3. **Seletor mostrando só o último nome** ("› Konoha"): com duas Konohas em
   arcos diferentes, ninguém sabia qual era. Mostra o caminho inteiro.
4. **Gravar `""`** deixa itens "soltos" com campo vazio, e a contagem de
   "Sem pasta" passa a depender de dois casos. Vazio sempre sai do documento.
5. **Espaços e separadores digitados à mão** criavam pastas gêmeas
   ("Konoha" e " Konoha "). Tudo passa por `normalizarCaminho`.
6. **`localStorage` bloqueado** (aba anônima, preview) quebrava a árvore
   inteira. Toda leitura e escrita dele fica em `try/catch`; sem ele, a
   árvore só não lembra o que estava fechado.

## 9. Resumo em uma frase

Pasta é **um caminho de texto no próprio item** (`"Cena 01/Konoha"`), a
árvore é **montada na hora** por uma função pura, **renomear e mover são a
mesma troca de prefixo** feita num batch, e **um componente genérico**
desenha a árvore de cenas, NPCs, criaturas e histórias — sem coleção de
pastas, sem migração e sem pasta vazia para limpar.
