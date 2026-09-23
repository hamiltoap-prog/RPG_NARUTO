# Regras da casa

O manual (`docs/rules/`) é o texto-fonte. Este arquivo guarda o que a mesa
decidiu **além** dele — sistemas que o manual não tem, ou pontos em que ele
não diz como resolver e o app precisou de uma regra para funcionar.

---

## Fichas temporárias: clone, invocação e marionete

Clone e invocação não são efeito de texto: viram **ficha própria** em campo,
controlada por quem os criou, com peça ao lado da peça do dono no mapa.

| | Clone | Invocação | Marionete |
|---|---|---|---|
| Quem cria | jogador ou mestre, lançando o jutsu | jogador ou mestre | **mestre**, na forja |
| Rola com | os modificadores do dono (é cópia) | o bônus fechado da tribo + tamanho | os modificadores do **dono** + o bônus próprio do golpe |
| Chakra | próprio (o maior dado de chakra da classe) | próprio | **nenhum**: o custo sai da ficha do dono |
| A 0 PV | some de jogo | some de jogo | **quebra**: sai de campo e volta para a mochila, esperando o conserto do mestre |
| Desfazendo na mão | devolve **metade do chakra que sobrou** ao dono | idem | não devolve nada |

**O que a ficha temporária faz.** Tudo que o corpo dela permite, não só jutsu:

- **ataque desarmado** — `1 + Modificador de Força` (05-combate.md), porque um
  clone é cópia de uma pessoa e pessoa soca;
- **ferramentas ninja** — o clone nasce com as armas **equipadas** do dono.
  São cópias: gastar uma kunai do clone não tira kunai da mochila do dono;
- **jutsus** — o clone leva os do dono (menos os de clone, para não criar
  clone de clone) e o dano sai **pela metade**, como o manual manda.

O clone que o manual descreve como incapaz de agir (`noActions`) entra em
campo sem nenhuma dessas ações — ele ocupa espaço no mapa e nada mais.

---

## Quem pode ser alvo

Três regras, nesta ordem:

1. **O mestre alcança todo mundo.** Ele conduz a cena; se decidiu que alguém
   está no alcance, está.
2. **Com combate em andamento, só quem está na luta.** Quem não entrou na
   ordem de iniciativa não está lá para ser acertado.
3. **Sem combate, só quem tem peça na tela de jogo.** A peça no tabuleiro é o
   que diz onde cada um está; quem não tem peça não é alvo para o jogador.

Marionete quebrada nunca entra na lista, e ninguém é alvo de si mesmo.

**Sem peça no tabuleiro não há alvo nenhum** — nem quando a mesa ainda não
montou cena. A tela de jogo é o que diz quem está no alcance de quem, e "a
cena ainda não foi montada" não vira licença para mirar em todo mundo. Quando
a lista sai vazia, a tela explica por quê em vez de só ficar curta.

---

## Entrar no combate já começado

Briga não começa com todo mundo na sala: chega reforço, o NPC escondido se
revela, o clone nasce no turno de alguém. Quem entra **rola a iniciativa como
qualquer um** e cai no lugar dele na ordem; quem chega pego de surpresa vai
para o fim, como quem começou surpreso.

A chegada nunca atropela a vez de quem está jogando: a ordem é refeita e o
ponteiro do turno é remendado para continuar apontando para a **mesma
pessoa** que estava agindo. Sair da luta segue a mesma regra — quando quem sai
era quem estava agindo, a vez passa para quem ficou naquele lugar, e esvaziar
a ordem encerra o combate.

---

## As duas imagens de cada ficha

Toda ficha que vira peça carrega duas imagens:

- o **retrato**, redondo, que o dono escolhe e serve para reconhecer a pessoa
  nas listas do app;
- a **peça**, um PNG sem fundo, que é o que fica bom em cima de um mapa.

**Quem põe o PNG e quem decide qual está valendo é só o mestre**, em qualquer
ficha da mesa — personagem, NPC, criatura ou marionete. O controle fica num só
lugar, a aba *Peças* da tela de jogo, porque é ali que se pensa em peça.
Por isso `tokenUrl` e `tokenMode` não entram nos campos que um jogador pode
pedir para mudar.

A escolha é lida **na hora de desenhar**, a partir da ficha, e não gravada na
peça: trocar o PNG de um NPC muda todas as peças dele, em todas as cenas, de
uma vez. Um PNG ligado é desenhado inteiro, sem moldura nem recorte redondo —
recortar um PNG recortado jogaria fora justamente o que o torna bom no mapa.

Colar um link vazio desliga o PNG junto, e o botão só liga com link colado:
modo ligado sem imagem só produziria uma peça invisível.

### Link do Google Drive

O caminho natural de quem joga é subir a arte no Drive, clicar em
*Compartilhar* e colar o link. **Esse link não é a imagem** — é a página do
visualizador, em HTML; num `<img>` dá quadro quebrado, e a pessoa fica
achando que errou o endereço.

O app traduz na entrada, em todo campo de imagem (retrato, peça, mapa,
criatura, marionete, peça solta): tira o ID do arquivo de qualquer formato de
link do Drive e monta `drive.google.com/thumbnail?id=...&sz=w1600`, que é o
que continua servindo a imagem crua hoje. O campo passa a mostrar o endereço
convertido, para não restar dúvida do que foi gravado. Link que já é imagem
direta (Imgur, Discord, um `.png` qualquer) passa intacto.

O que o app **não** resolve: o arquivo precisa estar compartilhado como
*"qualquer pessoa com o link"*. Restrito, ele devolve imagem quebrada por mais
certo que o endereço esteja — e é por isso que a tela avisa disso na hora da
conversão, em vez de deixar a mesa procurando defeito no link.

**Clone** nasce com as duas imagens do dono — é a cara do original, e a peça
dele não destoa da de quem o criou. **Marionete** tem cara própria, escolhida
na forja pelo mestre; sem imagem, a peça cai nas iniciais do nome em vez de
emprestar o rosto do titereiro.

---

## Condições impostas por golpe

O manual descreve o efeito de cada jutsu em texto corrido, então o app **lê o
que dá e mostra o palpite** — nunca aplica condição sozinho:

- a condição lida aparece marcada na tela de quem lança, que pode tirar,
  trocar ou acrescentar da tabela do Capítulo 9;
- o prazo vem do texto quando ele dá um (`por 1 minuto` = 10 rodadas,
  `até o final do próximo turno` = 1 rodada); sem prazo, a condição dura até o
  mestre tirar;
- texto que **remove** ou dá **imunidade** a uma condição não vira condição
  imposta (`remove Cego` não deixa ninguém Cego).

**Quando gruda:** no jutsu de ataque, em quem foi acertado; no de resistência,
em quem falhou; no jutsu sem rolagem, em todo mundo que o golpe pegou.

**Reaplicar não empilha:** fica uma cópia só, com o prazo mais longo entre os
dois. Condição sem prazo vence qualquer contagem.

**Área.** O app lê da descrição que o jutsu pega mais de um (`raio de 6 m`,
`cone`, `todas as criaturas`), mas a geometria da mesa é da mesa: quem lança
**marca quem está dentro**, e a resolução roda uma rolagem para cada alvo.

**Onde as condições moram.** Na ficha, não na lista de combate — é o que faz o
selo aparecer no mapa fora de combate e a condição sobreviver ao fim da luta.
A lista de combate fica como espelho; mesas que já estavam no ar antes disto
continuam lendo de lá até alguém mexer.

**Selo no mapa.** A peça de quem está sob condição mostra a sigla de três
letras acima do retrato (`INC 2` = Incapacitado, faltam 2 rodadas), com o
efeito do manual no título. Passada cada rodada de combate, o prazo cai de um
e a condição que zera sai sozinha.

---

## Forja de marionetes

A marionete é item forjado pelo mestre: PV, CA, PR, custo de ativação, golpes
com bônus próprio, jutsus próprios (com condição e prazo escolhidos na
bancada) e os itens acoplados em texto. Ela vai para a loja como qualquer
outro item; quem a tem na mochila é quem a controla.

---

## Dado de dano é só dado de dano

O manual escreve tudo em texto corrido, e um `NdM` ali pode ser qualquer
coisa: cura (*"recupera 2d4 pontos de vida"*), duração (*"por 1d4 rodadas"*),
bônus de rolagem (*"role 1d6 e some ao ataque"*), dreno de chakra, PV de uma
muralha invocada, CA temporária. Pegar o primeiro `NdM` da descrição enchia
**51 jutsus de efeito** com dano que eles não causam.

Agora o dado só conta como dano quando a palavra *dano* está colada nele e
nenhum sinal de que ele é outra coisa aparece por perto. São 322 jutsus com
dano, contra 373 da leitura antiga.

Fica de fora de propósito o jutsu em que o dado é de outra coisa e só uma
**parte** dele vira dano (*"reduz o chakra em 6d6 e causa metade disso como
dano"*, as 8-Trigramas do Hyūga): preencher `6d6` ali seria o dobro do certo,
e em branco o mestre escreve o que a mesa combinou.

Quando o jutsu **cura**, a tela diz o dado de cura em vez de ficar muda — mas
o app não mexe em PV de ninguém por isso: quem aplica cura é o mestre.
