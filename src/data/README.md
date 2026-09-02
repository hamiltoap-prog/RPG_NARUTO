# Dados de regras — PLACEHOLDER

Os arquivos `clans.ts`, `classes.ts`, `conditions.ts` e `xpTable.ts` neste
diretório foram recuperados do histórico deletado de um protótipo anterior
deste mesmo projeto (FastAPI + MongoDB). Servem como base funcional para
destravar o desenvolvimento do sistema (mestre, mesa, aprovação, imagens),
mas **não são a versão final das regras**.

O usuário está enviando o manual de regras definitivo (documento Google Docs
extenso). Assim que a extração/revisão desse manual estiver pronta, estes
arquivos devem ser substituídos pelos dados corretos — clãs, classes, lista
de jutsus, equipamentos, perícias e fórmulas de combate — sem precisar
alterar a estrutura do app (tipos em `src/types.ts` e a UI já são genéricos
o suficiente para consumir dados diferentes).
