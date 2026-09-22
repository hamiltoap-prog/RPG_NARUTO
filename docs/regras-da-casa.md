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

**Mesa que nunca abriu a tela de jogo** não tem restrição: sem cena, não há
tabuleiro para dizer quem está onde, e travar tudo deixaria o jogo parado. A
regra 3 passa a valer assim que o mestre monta a primeira cena.

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
