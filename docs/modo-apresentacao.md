# Modo apresentação (modo história) — como funciona

Resumo técnico do modo apresentação da Mesa Ninja: um editor de slides no
estilo de um editor de apresentações, e a apresentação ao vivo que cobre a
tela de jogo de todos os jogadores, com só o mestre no controle. Serve de
referência para levar o mesmo sistema a outro projeto parecido.

Stack de referência: React + TypeScript, Firestore em tempo real
(`onSnapshot`), tudo em DOM/CSS — sem canvas e sem biblioteca de slides.
Arquivos principais:

- `src/lib/slides.ts` — regras puras (modelo, cliques, camadas, ímã, conversão);
- `src/components/historia/Palco.tsx` — o desenho do slide e das transições;
- `src/components/historia/EditorDeSlides.tsx` — o editor;
- `src/components/ModoHistoria.tsx` — a apresentação ao vivo;
- animações em `src/index.css` (procure "Modo história").

---

## 1. Modelo de dados

### 1.1 A história (na biblioteca do mestre)

A história é um item da biblioteca da tela de jogo (`kind: 'story'`), com
pasta como qualquer item (ver "organizacao-em-pastas.md"):

```ts
interface SceneLibraryItem { id; kind: 'story'; label; folder?; imageUrl? /* capa */; slides?: StorySlide[] }
```

### 1.2 O slide: um palco 16:9 com elementos em camadas

```ts
interface StorySlide {
  id: string
  fundoCor?: string                 // cor de fundo
  fundoUrl?: string                 // imagem de fundo
  fundoFit?: 'cover' | 'contain'
  kenBurns?: boolean                // zoom lento no fundo enquanto o slide está no ar
  elementos?: SlideElemento[]       // ORDEM DO ARRAY = CAMADAS: o primeiro fica embaixo
  transicao?: 'nenhuma' | 'fade' | 'deslizar' | 'empurrar-cima' | 'zoom' | 'cortina' | 'escurecer'
  transicaoMs?: number              // padrão 700
  notas?: string                    // só do mestre — nunca vai para os jogadores
}

// Comum a todo elemento
{ id; x; y; w; h;                   // frações do palco (0..1), canto superior esquerdo
  rotation?; opacity?;               // graus; 0..1
  entrada?: 'nenhuma' | 'aparecer' | 'subir' | 'descer' | 'esquerda' | 'direita' | 'zoom' | 'desfocar'
  atraso?; duracao?;                 // ms
  passo?: number                     // 0/ausente = junto com o slide; 1 = no 1º clique; 2 = no 2º…
  nome? }                            // nome da camada no editor

type SlideElemento =
  | { tipo: 'imagem'; url; fit?: 'cover'|'contain'; raio?; sombra?; espelhar? }
  | { tipo: 'texto'; texto; tamanho /* % da altura do palco */; cor; fonte?: 'titulo'|'texto'|'serifa';
      alinhamento?; vertical?: 'top'|'middle'|'bottom'; negrito?; italico?;
      sombra? /* contorno escuro */; fundo?; fundoOpacidade? }
  | { tipo: 'forma'; forma: 'retangulo'|'elipse'; cor;
      degrade?: 'nenhum'|'baixo'|'cima'|'esquerda'|'direita'; raio?; borda? }
```

**Por que frações e % da altura:** o slide tem que sair idêntico no monitor
do mestre e no celular do jogador. Posição e tamanho em 0..1 do palco, e o
texto medido em `cqh` (ver §3), fazem o slide inteiro escalar junto — nada
"quebra linha diferente" numa tela menor.

### 1.3 A apresentação no ar (lida por todos)

Mora num documento à parte, `tables/{mesa}/scene/story`, que todos leem:

```ts
interface StoryShow {
  open: boolean
  title: string
  slides: StorySlide[]   // COPIADOS da biblioteca, normalizados e SEM as notas
  index: number          // slide atual
  step?: number          // quantos cliques do slide atual já foram revelados
  libraryId?: string     // de qual item veio (edição ao vivo e notas do mestre)
  updatedAt: number
}
```

Duas decisões aqui:

- **Os slides são copiados**, não referenciados. A biblioteca é bastidor do
  mestre (as regras do banco não deixam o jogador lê-la); o jogador só recebe
  a história que está sendo contada.
- **As notas não são copiadas** (`slidesParaApresentar` remove o campo). Se
  fossem, qualquer jogador as leria pelo console do navegador. O mestre lê as
  notas da própria biblioteca, achando o slide por `libraryId` + `index`.

Regra do banco: o documento vive em `scene/*`, que todos leem e só o mestre
escreve — nada novo a configurar.

## 2. Regras puras (`lib/slides.ts`)

```ts
normalizarSlide(s)          // slide do formato antigo (imagem + título + texto) vira
                            // fundo + faixa escura + dois textos, com a mesma cara;
                            // slide novo passa direto (mesma referência)
passosDoSlide(s)            // quantos cliques o slide tem = maior `passo` dos elementos
visivelNoPasso(e, passo)    // (e.passo ?? 0) <= passo
avancar(slides, {index, step})   // revela o próximo clique; sem cliques sobrando, próximo slide;
                                 // no fim, null
voltar(slides, {index, step})    // desfaz um clique; no começo do slide, volta ao anterior JÁ COMPLETO
moverCamada(elementos, id, 'frente' | 'tras' | 'subir' | 'descer')
duplicarElemento(e) / duplicarSlide(s)   // ids novos; o elemento sai um pouco deslocado
prenderAoPalco(e)           // pode sangrar a borda, mas nunca some nem fica minúsculo
ima({x,y,w,h})              // encosta borda/centro do elemento no centro e nas bordas
                            // do palco (tolerância 1,2%); devolve as guias a desenhar
slidesParaApresentar(slides)    // normaliza e tira as notas
capaDaHistoria(slides)      // primeira imagem, para a miniatura da biblioteca
```

Tudo testado em `slides.check.ts`: o caminho do "próximo"
(`0.0 → 0.1 → 0.2 → 1.0`), voltar, camadas, ímã, conversão do formato antigo
e as notas não indo para a mesa.

## 3. O desenho (`historia/Palco.tsx`)

Um único desenho do slide, usado em **três lugares**: o palco do editor, as
miniaturas e a apresentação. O que o mestre vê editando é exatamente o que a
mesa vê.

- **`Palco`** — `aspect-ratio: 16/9` e `container-type: size`. É um
  container de CSS: dentro dele, `1cqh` = 1% da altura do palco. O texto usa
  `font-size: {tamanho}cqh`; cantos e sombras usam `cqmin`/`cqh`. Por isso o
  slide escala inteiro.
- **`ConteudoDoSlide({ slide, passo, animar, todos })`** — fundo (cor +
  imagem, com Ken Burns se `animar`) e os elementos na ordem do array.
  - na apresentação, elemento de um clique ainda não revelado **não é
    desenhado**; ao ser revelado ele *nasce* na tela, e a animação de entrada
    toca sozinha (é CSS de entrada). Quem já estava não repete a sua — sem
    nenhum controle de "já animou";
  - no editor (`todos`), tudo aparece, e os elementos de clique ficam
    esmaecidos, com a etiqueta "clique N".
- **`ElementoNoPalco`** — a caixa (`left/top/width/height` em %, `rotate`,
  `opacity`) e, dentro dela, a animação de entrada em outra `div` (para o
  `transform` da animação não brigar com o giro). Duração e atraso vêm do
  elemento por `style`, o movimento vem da classe `slide-entra-{efeito}`.
  - imagem: `object-fit`, `border-radius`, `drop-shadow` (sombra que segue o
    recorte do PNG), `scaleX(-1)` para espelhar;
  - texto: `white-space: pre-wrap`, alinhamentos por flex, contorno por
    `text-shadow`, fundo da caixa em `rgba`;
  - forma: cor sólida ou `linear-gradient(cor transparente → cor)`, elipse
    por `border-radius: 50%`.
- **`PalcoDaApresentacao({ slides, index, passo })`** — o palco com
  **transição**. Quando o `index` muda, o slide que sai continua desenhado
  (`data-slide-saindo`) com a animação de saída, o novo entra com a de
  entrada, e depois de `transicaoMs` o que saiu é removido. É isso que faz o
  "deslizar" mostrar os dois slides andando juntos.

### Transições (CSS, `index.css`)

| Transição | Sai | Entra |
|---|---|---|
| dissolver (`fade`) | opacidade 1→0 | opacidade 0→1, por cima |
| escurecer | apaga em ½ do tempo | acende na outra ½ (passa pelo preto) |
| deslizar | `translateX(0 → -100%)` | `translateX(100% → 0)` |
| empurrar para cima | `translateY(0 → -100%)` | `translateY(100% → 0)` |
| zoom | some encolhendo | aparece de `scale(1.18)` |
| cortina | fica por baixo | `clip-path: inset(0 100% 0 0 → 0)` |
| corte seco | — | — |

Entradas de elemento: aparecer, subir, descer, vir da direita/esquerda,
zoom (com leve passada), desfocar (`filter: blur`). Ken Burns: `scale(1 →
1.12)` em 24 s, ida e volta. Com `prefers-reduced-motion`, tudo vira 1 ms.

## 4. O editor (`historia/EditorDeSlides.tsx`)

Abre em tela cheia **em portal** (`createPortal(…, document.body)`): ele é
aberto de dentro do painel da biblioteca, e lá dentro ficava por baixo da
barra da tela de jogo.

Layout (no computador; no celular as colunas empilham):

- **esquerda** — miniaturas (o próprio `ConteudoDoSlide`), subir, descer,
  duplicar, apagar, "+ slide" (o novo herda a transição do atual);
- **centro** — barra de inserir (+ Título, + Texto, + Retângulo, + Círculo,
  + Faixa escura, link + Imagem) e o palco;
- **direita** — propriedades do selecionado, ou do slide quando nada está
  selecionado (fundo, Ken Burns, transição e duração, notas), e a lista de
  camadas de cima para baixo.

### Interação no palco

- Por cima do desenho vai uma camada de **caixas de seleção**, uma por
  elemento, na mesma posição. Clicar seleciona; arrastar move; 8 **alças**
  redimensionam.
- O arraste usa **eventos de ponteiro** (mouse e toque), com
  `setPointerCapture` no palco e `touch-action: none`. A posição vem de
  `(clientX − rect.left) / rect.width`, já em fração do palco.
- **Proporção:** imagem mantém a proporção pelos cantos (Shift solta);
  forma e texto, o contrário (Shift prende).
- **Ímã:** ao mover, encosta no centro e nas bordas e desenha guias; Alt
  solta.
- **Imagem nova** nasce na proporção dela: o editor carrega a imagem
  (`naturalWidth/naturalHeight`) e calcula a caixa — `h = w × (16/9) ×
  (altura/largura)`, limitada ao palco. "Proporção original" refaz a conta.
- **Teclado:** setas ajustam (Shift = passo maior), Delete apaga, Ctrl+D
  duplica, Esc tira a seleção, Ctrl+Z / Ctrl+Y desfazem e refazem. Com o
  foco num campo de texto, o teclado é do campo (Ctrl+Z desfaz a
  digitação, como em qualquer editor).
- Duplo clique num texto leva o foco para a caixa de texto do painel.
- Nome da camada: o que o mestre deu; senão o começo do texto, o nome do
  arquivo da imagem ("ninja", "kunai") ou o tipo da forma.

### Desfazer / refazer

Toda mudança passa por `mudar(fn, chave)`, que empilha o estado anterior.
Mudanças seguidas **com a mesma chave em menos de ~0,9 s** viram um passo só
— é o que impede um arraste ou um controle deslizante de encher o histórico
com dezenas de passos (o arraste usa uma chave por gesto). Limite de 100
passos.

### Testar e salvar

- **"▶ testar daqui"** toca a apresentação só na tela do mestre, a partir do
  slide atual, com transições e cliques — sem tocar no banco.
- **Salvar** grava os slides na biblioteca, com a capa (primeira imagem).
  Se aquela história **estiver no ar**, a apresentação é atualizada na hora
  (slides copiados de novo, sem notas): corrigir um erro de digitação no
  meio da sessão chega à tela de todos.
- Fechar com mudanças não salvas pede confirmação.

## 5. A apresentação ao vivo (`ModoHistoria.tsx`)

```ts
apresentarHistoria(mesa, item)       // grava scene/story: open, slides copiados sem notas,
                                     // index 0, step 0, libraryId
HistoriaNaTela({ mesa, isGM, library })   // a sobreposição, montada SÓ na tela de jogo
```

- **Onde aparece:** só na tela de jogo (decisão de projeto: nas fichas não
  aparece). É uma camada `fixed inset-0` acima de tudo, com o palco ocupando
  o máximo de 16:9 que cabe (`width: min(100%, (100dvh − barra) × 16/9)`) e
  tarja preta no que sobrar.
- **Jogador:** só vê; barra discreta com título e "o mestre está contando a
  história". Não fecha, não passa.
- **Mestre:**
  - "revelar ▶" / "próximo ▶", "◀ anterior", seletor "slide N/M" para pular,
    contador "clique 1/2" quando o slide tem cliques;
  - setas, espaço e PageUp/PageDown; clicar no slide também avança;
  - **notas** do slide numa faixa só dele (vindas da biblioteca), com
    esconder/mostrar;
  - **minimizar**: some só da tela dele, vira um aviso no topo ("slide 2/5
    na tela dos jogadores" · abrir · fechar para todos); os jogadores
    continuam vendo. Apresentar outra história reabre grande;
  - **fechar para todos**: `open: false` — some da tela de todo mundo.
- **Sincronia:** cada clique do mestre grava `{ index, step }`. Todos reagem
  ao `onSnapshot`; quem entra no meio cai no slide **e no clique** em que a
  mesa está.
- **Pré-carregamento:** as imagens do próximo slide são carregadas antes,
  para a transição não piscar.

## 6. Compatibilidade com o formato antigo

O primeiro modo história tinha slides `{ title, text, imageUrl, imageFit }`.
Esses campos continuam no tipo, e `normalizarSlide` converte na leitura:
imagem → fundo; título e texto → elementos de texto; com imagem e texto,
uma faixa escura em degradê por baixo. Abre igual na apresentação e no
editor (já como camadas editáveis). Nada a migrar no banco.

## 7. Como portar para outro sistema

1. Copie os tipos (§1) e `lib/slides.ts` com as checagens — é puro.
2. Copie `Palco.tsx` e o bloco de animações do `index.css`. A única
   exigência do navegador são as unidades `cq*` (container queries),
   suportadas pelos navegadores atuais.
3. Monte o documento "no ar" (`StoryShow`) num lugar que **todos leem e só o
   mestre escreve**, e copie para ele os slides **sem as notas**.
4. Copie `ModoHistoria.tsx` e monte `HistoriaNaTela` na tela onde a mesa
   acompanha a cena, passando `isGM` e a biblioteca do mestre (para as
   notas).
5. Copie o editor; ele só precisa de "salvar na biblioteca" e "atualizar o
   que está no ar".

## 8. Armadilhas que viraram bug de verdade

1. **Editor por baixo da barra da tela de jogo.** Aberto de dentro de um
   painel com `z-index`, o `fixed` ficava preso no contexto de empilhamento
   do pai. Correção: **portal** no `body`.
2. **Notas vazando para os jogadores.** Copiar os slides inteiros para o
   documento "no ar" mandaria as notas para o navegador de todos. Correção:
   `slidesParaApresentar` tira as notas; o mestre lê da biblioteca.
3. **Animação repetindo a cada clique.** Controlar "quem já animou" à mão é
   frágil (no modo estrito do React, o desenho roda duas vezes). Correção:
   elemento escondido não é desenhado; ao aparecer ele monta, e a animação
   de entrada do CSS toca uma vez, sozinha.
4. **Giro e animação brigando pelo `transform`.** A caixa gira; a animação
   fica numa `div` de dentro.
5. **Histórico de desfazer entupido** por arraste e controles deslizantes.
   Correção: juntar mudanças da mesma chave dentro de ~0,9 s.
6. **Texto com tamanho diferente em cada tela.** `px` ou `rem` quebram
   linha diferente no celular. Correção: `cqh` dentro de um palco que é
   container.
7. **Ctrl+Z "não funcionando".** Com o foco na caixa de texto, o atalho é do
   campo (desfaz a digitação). O editor só trata os atalhos quando o foco
   não está num campo — igual aos editores de verdade.

## 9. Resumo em uma frase

Um **palco 16:9 que é container de CSS** (tudo em frações e `cqh`, idêntico
em qualquer tela) + **elementos em camadas pela ordem do array**, com
entrada animada e "aparece no clique" + **transições de slide em CSS** com
o slide que sai ainda desenhado + **um documento "no ar" com os slides
copiados sem as notas**, que só o mestre escreve — é o que dá um editor de
slides e uma apresentação sincronizada para a mesa inteira, sem biblioteca
de slides nenhuma.
