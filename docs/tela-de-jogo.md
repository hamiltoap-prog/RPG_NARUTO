# Tela de jogo (mapa tático) — como funciona

Resumo técnico da tela de jogo da Mesa Ninja, para servir de referência ao
levar algo parecido para outro projeto (Shadowlords). Cobre o modelo de dados,
a geometria do palco, as camadas de desenho (mapa, grade, peças, luz, névoa),
a interação, quem escreve o quê no banco e as armadilhas que viraram bug de
verdade no caminho.

Stack de referência: React + TypeScript, Firestore em tempo real
(`onSnapshot`), tudo desenhado em DOM/CSS. O único `<canvas>` é o da névoa.
Arquivos principais: `src/pages/ScenePage.tsx`, `src/lib/sceneGeometry.ts`,
`src/lib/fog.ts`, `src/lib/tokenArt.ts`, `src/components/SceneLibraryPanel.tsx`.

---

## 1. Modelo de dados

Cada mesa tem **uma cena ativa**, num documento só:
`tables/{tableId}/scene/current`.

```ts
interface Scene {
  backgroundUrl: string        // imagem do mapa
  tokens: SceneToken[]         // as peças (no mapa e na bandeja)
  revealed: boolean            // falso = jogadores veem "Preparando a cena"
  updatedAt: number
  timeOfDay?: 'day' | 'night'  // tom do céu
  locationLit?: boolean        // local iluminado? (independe de dia/noite)
  map?: SceneMap               // enquadramento da imagem
  gridColumns?: number         // escala: quantos quadrados de largura
  showGrid?: boolean
  fog?: SceneFog               // névoa de guerra
  fromLibraryId?: string       // de qual item da biblioteca a cena veio
}

interface SceneMap {
  rotation?: number            // graus
  zoom?: number                // 0,2 a 6
  offsetX?: number             // deslocamento, em frações do palco
  offsetY?: number
  aspect?: number              // PROPORÇÃO DO PALCO (largura/altura)
  fit?: 'contain' | 'cover'
}

interface SceneToken {
  id: string
  label: string                // nome de quando foi criada (a ficha manda, ver §8)
  imageUrl?: string            // só para peça solta, sem ficha
  kind: 'pc' | 'npc' | 'monster' | 'boss' | 'companion'
  x: number; y: number         // CENTRO da peça, relativo ao palco (0..1)
  size: number                 // legado (fração da largura)
  squares?: number             // quadrados que ocupa (1, 2, 3, 4) — quando existe, manda
  refType?: 'character' | 'npc' | 'companion'
  refId?: string               // ficha por trás da peça
  temporary?: boolean          // clone/invocação: não vai para a biblioteca
  onBoard?: boolean            // false = na bandeja do mestre, fora do mapa
  rotation?: number            // 0/90/180/270 — da PEÇA, não da ficha
}

interface SceneFog {
  enabled: boolean
  cols: number                 // 56
  rows: number                 // derivado da proporção do palco
  cells: string                // um caractere por célula: '1' revelada, '0' coberta
}
```

Outros documentos ao lado:

| Onde | O quê | Quem lê / escreve |
|---|---|---|
| `scene/current` | a cena acima | todos leem; **mestre** escreve; **jogador** só pode mudar `tokens` (e `updatedAt`), e só quando a mesa libera o arraste |
| `scene/audio` | o som da cena (ver doc da mesa de som) | todos leem; mestre escreve |
| `pings/{id}` | marcações rápidas `{x, y, label, at}` | todos leem e criam; mestre apaga |
| `sceneLibrary/{id}` | cenas e peças guardadas | só o mestre |

A regra do jogador no Firestore é o que garante que ninguém mexe em névoa,
mapa ou luz pelo console do navegador:

```
match /scene/{sceneId} {
  allow read: if signedIn();
  allow write: if isGM(tableId);
  allow update: if signedIn() &&
    tableData(tableId).playersMoveTokens == true &&
    request.resource.data.diff(resource.data).affectedKeys().hasOnly(['tokens', 'updatedAt']);
}
```

## 2. O palco: coordenadas relativas e proporção fixa

**A ideia central de toda a tela.** O mapa não vive na janela do navegador,
e sim num **palco**, um retângulo de proporção fixa guardada na cena
(`map.aspect`, padrão 16:10). Tudo que tem posição (peças, névoa, marcações,
régua) guarda coordenadas **0..1 do palco**, nunca pixels.

Cada tela calcula o maior retângulo com essa proporção que cabe na janela dela:

```ts
function fitStage(vw, vh, aspect) {
  const width = Math.min(vw, vh * aspect)
  return { width, height: width / aspect }
}
```

Resultado: o mestre num monitor ultrawide e o jogador num notebook veem **o
mesmo enquadramento e as peças no mesmo lugar do terreno**. Sem isso, cada
tela recorta o mapa de um jeito e "estou atrás da árvore" deixa de ser verdade
na tela do outro.

De onde vem a proporção:
- **Ao usar um mapa**, o app carrega a imagem (`new Image()`), lê
  `naturalWidth / naturalHeight` e adota essa proporção, já com `fit: 'cover'`.
  Assim não sobra tarja preta em volta de mapa de formato diferente.
- Presets (16:10, 16:9, 4:3, 3:2, quadrado) e **"Ajustar palco à minha tela"**
  (usa a proporção da área visível do mestre).

O tamanho da janela é medido com `ResizeObserver` no contêiner do palco.

## 3. Grade, tamanho de peça e medidas

- **Escala:** `gridColumns` = quantos quadrados de largura o palco tem (4 a 100,
  padrão 20). Célula em X = `1/colunas`; em Y = `aspect/colunas`. O Y entra com
  a proporção porque 0..1 em Y cobre menos pixels que em X, e é isso que deixa
  a célula **quadrada de verdade**.
- **A grade** é só CSS, sem canvas: duas `linear-gradient` de 1px com
  `background-size: (100/colunas)% (100·aspect/colunas)%`.
- **Tamanho da peça** em quadrados (`squares`: Normal 1, Grande 2, Enorme 3,
  Colossal 4). A largura desenhada é `squares / colunas` do palco. Quando o
  mestre muda a escala, **as peças mantêm a proporção entre si e com o
  terreno**.
- **Encaixe na grade** ao arrastar: alinha a *caixa* da peça aos quadrados,
  não o centro. É o que faz uma criatura de 2×2 ocupar dois quadrados
  inteiros em vez de ficar meio fora:
  ```ts
  function snapToGrid(x, y, squares, cols, aspect) {
    const cx = 1 / cols, cy = aspect / cols
    const hx = squares * cx / 2, hy = squares * cy / 2
    return { x: clamp01(Math.round((x - hx) / cx) * cx + hx),
             y: clamp01(Math.round((y - hy) / cy) * cy + hy) }
  }
  ```
- **Régua:** distância em quadrados, com o Y corrigido pela proporção:
  `dx = Δx·cols`, `dy = Δy·cols/aspect`, `√(dx²+dy²)`.
- **Peça nova nasce em casa livre**, varrendo do canto superior esquerdo. Sem
  isso toda peça nascia no centro, uma em cima da outra.
- **Clones e invocações nascem em anel em volta do dono** (`spotsAround`): o
  anel 1 primeiro, depois o 2 etc., pulando casas ocupadas. Sem o dono no mapa,
  a peça vai para a bandeja do mestre em vez de sumir.

## 4. Enquadramento do mapa (zoom, giro, X/Y)

A imagem é um `<img>` absoluto ocupando o palco, com
`object-fit: contain|cover` e um `transform` CSS:

```ts
`translate(${offsetX*100}%, ${offsetY*100}%) rotate(${rotation}deg) scale(${zoom})`
```

**Dois problemas resolvidos aqui:**

**4.1 O deslocamento precisa alcançar a borda em qualquer zoom.** Nessa ordem,
o `translate` é o de fora: a porcentagem vale sobre o tamanho da imagem
*antes* do zoom. Com zoom 3, a imagem tem 3× a largura do palco, e um slider
fixo de ±50% nunca chegava ao fim do mapa. O alcance do slider é calculado:

```ts
function mapOffsetLimit({ zoom = 1, rotation = 0 }) {
  const r = rotation * Math.PI / 180
  const caixa = Math.abs(Math.cos(r)) + Math.abs(Math.sin(r)) // girado ocupa mais
  return Math.max(0.5, (zoom * caixa - 1) / 2 + 0.15)         // + folga, piso 0,5
}
```

Ao **diminuir** o zoom, o deslocamento é preso ao novo limite
(`clampMapOffsets`). Senão ficaria gravado um valor fora do curso, com a imagem
fora do palco e o slider já no fim, sem jeito de trazer de volta. Há também um
botão "centralizar", que zera X/Y sem mexer em zoom e giro.

**4.2 Mexer no mapa leva junto a névoa e as peças.** O `transform` move só a
imagem: a névoa pintada e as peças ficariam paradas, com o terreno escorregando
por baixo. Então a mesma transformação é aplicada a elas. Um ponto que estava
em `p` com o mapa em `from` passa a estar em `to(from⁻¹(p))`. As contas
acontecem num espaço quadrado (Y ÷ aspect), senão o giro sai oval. A ordem do
CSS chega no ponto de trás para a frente: escala, gira, desloca.

```ts
remapPoint(p, from, to, aspect) = applyMapTransform(to, invertMapTransform(from, p, aspect), aspect)
```

- As peças: cada uma é remapeada.
- A névoa: cada célula da malha nova pergunta "o terreno que está aqui agora,
  onde estava antes?" e copia o que a névoa dizia lá. O que vem de fora do mapa
  antigo entra **coberto**, porque o grupo nunca esteve lá.

**Detalhe importante:** o remapeamento parte sempre do estado de quando o
mestre **pegou o slider** (`onPointerDown` guarda `{map, fog, tokens}` como
base), e não do passo anterior. Arrastar um slider gera dezenas de mudanças, e
remapear a névoa em cima de si mesma a cada passo borrava as bordas até virar
mingau.

## 5. As camadas (de baixo para cima)

Tudo é empilhado com `position: absolute` dentro do palco, com `z-index` fixo:

1. **Mapa**: `<img>` com o `transform` acima.
2. **Grade**: gradiente CSS.
3. **Peças**: `<div>` posicionadas em `%` (`left: x·100%`, `top: y·100%`,
   `translate(-50%,-50%)`, `width: squares/cols·100%`).
4. **Tom do céu**: um véu de cor (noite `rgba(6,10,28,.42)`, dia um laranja
   leve de .10), com transição de 2s.
5. **Escuridão do local + brilho das tochas**: gradientes CSS (ver §6).
6. **Névoa de guerra**: `<canvas>` do tamanho do palco.
7. **Marcações e régua**: `animate-ping` e um `<svg>` com a linha tracejada.

Todas as camadas acima das peças têm `pointer-events: none`: o clique sempre
chega nas peças e no palco.

## 6. Luz e escuridão

Dois controles independentes, porque um porão é escuro ao meio-dia e um
salão com tochas é claro à meia-noite:

- **Dia/noite** (`timeOfDay`) muda só o **tom** (camada 4). Anoitecer também
  apaga a luz do local; amanhecer acende.
- **Local iluminado** (`locationLit`). Quando falso, a camada 5 cobre o palco
  de escuridão (opacidade .82 para jogador, **.45 para o mestre**, que precisa
  enxergar a cena que narra).

**Tochas:** o mestre acende a luz de um personagem, e a ficha ganha
`lightUntil = agora + 1h`. Cada peça com luz acesa abre um buraco na escuridão
e ganha um brilho quente por cima. Tudo em CSS, sem canvas:

```ts
// um radial-gradient transparente por tocha, empilhado sobre um fundo escuro chapado
`radial-gradient(ellipse ${rx}% ${ry}% at ${x}% ${y}%,
   transparent 0%, transparent 45%, rgba(6,4,2,.3) 74%, rgba(6,4,2,${alpha}) 100%)`
// brilho: outro radial-gradient laranja com mix-blend-mode: screen
```

O raio é uma fração **da largura do palco** (`rx = 0.13`, `ry = rx·aspect`), o
que dá a mesma poça de luz em qualquer tela. Um relógio grosso (`setInterval`
de 1s) faz a tocha apagar sozinha quando o prazo vence.

**O que o jogador enxerga no escuro** (`hiddenInTheDark`):
- inimigos e chefes fora do alcance de qualquer luz (1,15× o raio) **somem**;
- personagens e NPCs continuam visíveis, porque o grupo sabe onde os seus
  estão;
- o mestre vê tudo.

## 7. Névoa de guerra

- **Dados:** malha grossa de 56 colunas × `round(56/aspect)` linhas, gravada
  como **texto** (`'0'`/`'1'`). O documento fica pequeno e cabe inteiro na
  cena.
- **Pintura:** ferramentas *Revelar* / *Esconder* com pincel de 1 a 12
  células; o pincel pinta um círculo de células. Há ainda *Revelar tudo*,
  *Cobrir tudo* e *desligar*.
- **Desenho com borda macia** (o truque): a malha é desenhada minúscula, uma
  célula por pixel, num canvas auxiliar. Depois é ampliada para o tamanho do
  palco **com suavização** e com `filter: blur(...)` por cima. As áreas
  reveladas são recortadas da escuridão com
  `globalCompositeOperation = 'destination-out'`. O resultado é um degradê, e
  não um recorte de tesoura, **sem precisar de malha fina nos dados**.
- **Mestre vs. jogador:** para o mestre a névoa é translúcida (.55), só o
  bastante para ele ver o que está coberto; para o jogador é opaca (.97).
- **Esconde peças:** peça em terreno não revelado some para o jogador, menos a
  dele mesmo, que é como ele se localiza.
- Ao religar a névoa, a malha é reamostrada para o número de linhas da
  proporção atual do palco, mantendo o que já foi explorado
  (`resampleFog`).

## 8. Peças

**A arte é decidida na hora de desenhar, a partir da ficha**, e não gravada na
peça:

```ts
function arteDaPeca(ficha, token) {
  if (ficha?.tokenMode === 'png' && ficha.tokenUrl) return { url: ficha.tokenUrl, recortado: true }
  return { url: ficha?.imageUrl || token?.imageUrl, recortado: false }
}
```

Por isso trocar o PNG de um NPC muda todas as peças dele de uma vez, e o
clone acompanha a arte do dono sem ninguém copiar link.

- **Duas imagens por ficha:**
  - o *retrato*, desenhado em círculo com borda;
  - o *PNG sem fundo*, desenhado inteiro, sem recorte nem moldura, com
    `drop-shadow`.

  Só o mestre coloca o PNG e troca de uma imagem para a outra.
- **Giro de 90 em 90** por peça, e não por ficha: a mesma criatura pode estar
  deitada numa cena e de pé em outra.
- **O nome vem da ficha**: ficha renomeada muda o rótulo da peça.
- **Sinais sobre a peça:**
  - barra de PV ao vivo, verde, âmbar ou vermelha, lida da ficha;
  - selos das condições em cima (ex.: `ENV2` = envenenado, 2 rodadas);
  - brilho laranja em quem está na vez do combate;
  - anel vermelho no chefe;
  - borda tracejada e opacidade menor em clone e invocação, para diferenciar
    o original numa luta com quatro clones iguais.
- **Bandeja do mestre** (`onBoard: false`): o mestre prepara as peças fora do
  mapa e as põe no mapa na hora certa, cada uma numa casa livre. "Recolher"
  devolve a peça à bandeja.
- **Faxina:** quando um clone é desfeito ou a ficha temporária some, o cliente
  do mestre tira a peça do mapa. Só ele tem permissão de escrever a cena
  inteira; os outros recebem pelo snapshot.
- **Links do Google Drive** são convertidos para
  `https://lh3.googleusercontent.com/d/<ID>` na entrada **e na hora de
  desenhar**. Isso vale para o que já estava gravado e para o que entrou por
  fora do app.

## 9. Interação e escrita no banco

- Eventos de **ponteiro** (`pointerdown/move/up/leave`, `touch-action: none`),
  então o mesmo código serve para mouse e toque. A posição vem de
  `(clientX − rect.left) / rect.width`, já em 0..1 do palco.
- **Durante** o arraste ou a pintura de névoa, só o estado local muda
  (resposta imediata). **Ao soltar**, grava no Firestore **uma vez**. Não
  martela o banco a cada pixel.
- **Mestre grava a cena inteira** (`setDoc`). **O jogador grava só `tokens`**
  (`updateDoc`), o único campo que a regra deixa ele mudar.
- **Quem pode arrastar:**
  - o mestre, qualquer peça;
  - o jogador, só se a mesa marcou *"jogadores movem a própria peça"*
    (`table.playersMoveTokens`), e só a peça dele e as dos clones e
    invocações que ele criou.

## 10. Ferramentas e controles

**Barra de todo mundo:**

| Ferramenta | O que faz |
|---|---|
| *Mover* | arrasta peças (com as permissões acima) |
| *Marcar* | cria um ping `{x, y, label, at}` que pulsa na tela de todos e some em 4s; o cliente do mestre apaga os velhos a cada minuto |
| *Régua* | arrasta e mostra "N quadrados"; some ao trocar de ferramenta |
| *Revelar / Esconder* | pincel da névoa (só o mestre), com o tamanho do pincel ao lado |

**Barra do mestre:**
- *Revelar cena*: até lá, os jogadores veem "Preparando a cena";
- *Anoitecer / Amanhecer*;
- *Escurecer / Iluminar local*;
- *Mostrar / Esconder grade*;
- *Ligar névoa / Revelar tudo / Cobrir tudo / desligar névoa*;
- *Jogadores movem a própria peça*.

**Painéis do mestre**, em abas que abrem acima do palco:
- **Mapa**: link da imagem; zoom, giro, X e Y com alcance dinâmico;
  *centralizar*; quadrados de largura; mapa inteiro ou preencher; proporção do
  palco; *reiniciar enquadramento*; guardar na biblioteca.
- **Peças**:
  - "+ peça" para cada personagem e NPC, e acender luz dos personagens;
  - a arte das peças (PNG e troca de modo);
  - criar peça solta (nome, imagem, tipo, tamanho);
  - a bandeja;
  - a lista "no mapa", com tamanho, girar, recolher e remover.
- **Biblioteca**: ver §11.
- **Som**: a mesa de som (ver o documento do som).

## 11. Biblioteca de cenas

- Guardar uma cena guarda a **cena inteira** num `snapshot`: imagem,
  enquadramento, grade, luz, névoa e peças. **Clones e invocações ficam de
  fora** (`temporary`): carregar a cena depois não ressuscita ninguém. O som
  que tocava vai junto.
- **Gravar por cima:** a cena em jogo lembra de onde veio (`fromLibraryId`, no
  documento da cena, para sobreviver a um recarregar de página). Com uma cena
  aberta aparecem *Atualizar "nome"* e *Guardar como nova*. Trocar a imagem de
  fundo desfaz o vínculo, senão "Atualizar" gravaria um mapa por cima de
  outro.
- **Pastas** não são documentos: são um nome repetido nos itens. Somem sozinhas
  quando esvaziam, e renomear é reescrever o nome em todos os itens.
- Itens antigos, de quando a biblioteca guardava só a imagem, trocam só o mapa
  e deixam o resto como está.

## 12. Como a tela conversa com o resto do sistema

- **Alvos só existem com peça no mapa.** Fora de combate, o jogador só pode
  mirar em quem tem peça no tabuleiro (`onBoard !== false` com `refType:refId`).
  Em combate, só em quem está na ordem de iniciativa. O mestre mira em
  qualquer um. A tela de jogo é o que diz "quem está no alcance".
- **Combate:** a vez atual e os chefes vêm de `table.combatOrder` e
  `combatTurnIndex`, cruzados pela chave `refType:refId` da peça.
- **Condições** moram na **ficha**, não no combate. Por isso o selo aparece na
  peça em combate e fora dele.
- **Dados animados e som** também ficam montados nesta tela; o som toca **só**
  aqui.

## 13. Armadilhas que viraram bug de verdade

1. **Palco preso em 300px.** O contêiner era medido com `useRef`, mas ele só
   nasce depois que a mesa carrega, e `useRef` não avisa o efeito de que o
   elemento apareceu. **Correção:** guardar o elemento em **estado**
   (`ref={setWrapEl}`), para o efeito do `ResizeObserver` rodar quando ele
   existir.
2. **Arraste gravando a posição anterior.** O `pointerup` pode chegar antes de
   o React repintar, e aí o fecho ainda tinha a cena antiga. **Correção:**
   um `sceneRef` sempre com o valor mais recente, lido ao soltar.
3. **Névoa borrando ao arrastar slider:** ver §4.2 (remapear a partir da base).
4. **Slider de X/Y não alcançava a borda com zoom:** ver §4.1.
5. **Clones nascendo longe do dono.** Encaixar cada casa do anel na grade de
   novo fazia duas casas vizinhas caírem na mesma (o arredondamento de meio
   quadrado oscila com o erro de ponto flutuante). **Correção:** encaixar o
   dono uma vez e andar em múltiplos exatos da célula.
6. **Salvamento do mapa desfazendo outra mudança.** A cena é regravada inteira
   a cada arraste e pincelada. Tudo que muda por outro caminho (o som, por
   exemplo) mora em **documento separado** (`scene/audio`); se vivesse dentro
   da cena, um salvamento atrasado do mapa desfaria a troca.
7. **Documento parcial.** Se a cena pode nascer incompleta (ex.: só com
   campos novos), leia sempre por cima de um padrão:
   `{ ...EMPTY_SCENE, ...doc, tokens: doc.tokens ?? [] }`.
8. **Link do Drive quebrando a imagem:** converter na entrada e na hora de
   desenhar (§8). O arquivo ainda precisa estar compartilhado como "qualquer
   pessoa com o link".

## 14. Resumo em uma frase

Um **palco de proporção fixa com coordenadas 0..1** (igual em todas as telas)
+ **camadas empilhadas em CSS** (mapa com transform, grade, peças, céu,
escuridão com tochas em gradiente) + **névoa em malha grossa de texto,
desenhada com ampliação e borrão** + **peças que leem arte, PV e condições da
ficha na hora de desenhar** + **escrita só ao soltar, com o jogador limitado a
`tokens` pela regra do banco**. Essa combinação é o que dá uma mesa tática
sincronizada, leve no banco e bonita, sem motor gráfico nenhum.
