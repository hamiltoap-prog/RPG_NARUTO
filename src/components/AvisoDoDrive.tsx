/**
 * O lembrete que o app não consegue resolver sozinho.
 *
 * O link do Drive é traduzido na hora para o endereço que serve a imagem crua,
 * mas tradução nenhuma vence permissão: se o arquivo estiver restrito, o
 * navegador de quem joga recebe uma negativa e a imagem some. Como é o erro
 * mais comum e o mais invisível (o link está certo, a imagem é que não vem),
 * a tela avisa antes de a pessoa ficar procurando defeito no endereço.
 */
export function AvisoDoDrive() {
  return (
    <p className="text-[11px] leading-relaxed text-amber-300/80">
      Link do Google Drive convertido. Para a mesa enxergar a imagem, o arquivo
      precisa estar compartilhado como <b className="text-amber-200">"qualquer pessoa com o link"</b> — se estiver
      restrito, só você vai ver.
    </p>
  )
}
