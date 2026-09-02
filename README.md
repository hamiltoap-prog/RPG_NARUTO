# Mesa Ninja

Companheiro digital para uma mesa de RPG de Naruto: o mestre cria uma mesa e
recebe um código; cada jogador entra com o **nome do personagem** e esse
código. Toda alteração de ficha feita por um jogador (PV, atributos,
inventário, jutsus, XP, imagem, descrição — tudo exceto anotações) vira um
pedido pendente que só é aplicado depois que o mestre aprova, individualmente
ou em lote. O mestre pode marcar campos específicos (ex: PV) para
auto-aprovação, e sempre pode editar qualquer ficha diretamente, sem fila.

> **Dados de regras**: os clãs, classes e condições em `src/data/` são um
> placeholder recuperado de uma versão antiga do projeto. Veja
> `src/data/README.md` — serão substituídos pelas regras definitivas.

## Stack

React + Vite + TypeScript, Firebase (Auth anônima + Firestore com listeners
em tempo real). Mesma arquitetura usada no Shadowlords Mesa.

## Configurar o Firebase

1. Crie um projeto **novo** em https://console.firebase.google.com (não
   reaproveite o projeto de outra mesa).
2. Ative **Authentication → Sign-in method → Anônimo**.
3. Ative **Firestore Database** (modo produção).
4. Em **Configurações do Projeto → Geral → Seus apps**, crie um app Web e
   copie as chaves do SDK.
5. Copie `.env.example` para `.env` e preencha os valores.
6. Publique as regras de segurança: `firebase deploy --only firestore:rules`
   (requer `npm i -g firebase-tools` e `firebase login` / `firebase use
   --add` apontando pro projeto criado).

## Rodar localmente

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

Gera a pasta `dist/`, publicável em qualquer hosting estático (Firebase
Hosting, Vercel, Netlify...). Para Firebase Hosting: `firebase deploy
--only hosting` depois do build.
