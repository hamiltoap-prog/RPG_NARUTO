/**
 * Link de imagem que o navegador consegue mostrar.
 *
 * O caminho natural de quem joga é: sobe a arte no Google Drive, clica em
 * "Compartilhar", copia o link e cola aqui. Esse link **não é a imagem** — é a
 * página do visualizador do Drive, HTML. Colado num `<img>`, dá quadro
 * quebrado, e a pessoa fica achando que errou o link.
 *
 * Então o app traduz na entrada: de qualquer forma de link do Drive ele tira o
 * ID do arquivo e monta o endereço que serve a imagem crua. O que já é link
 * direto (Imgur, Discord, um `.png` qualquer) passa intacto.
 *
 * Vale lembrar o que o app NÃO pode resolver: o arquivo precisa estar
 * compartilhado como "qualquer pessoa com o link". Arquivo restrito devolve
 * imagem quebrada por mais certo que o endereço esteja.
 */

/** As formas em que um link do Drive aparece por aí. */
const FORMATOS_DRIVE: RegExp[] = [
  // .../file/d/<id>/view, .../file/d/<id>/preview, .../file/d/<id>
  /drive\.google\.com\/file\/d\/([\w-]{10,})/i,
  // .../open?id=<id>, .../uc?id=<id>, .../uc?export=download&id=<id>
  /drive\.google\.com\/(?:open|uc|thumbnail)\?[^\s]*[?&]?id=([\w-]{10,})/i,
  // .../drive/folders não é imagem, mas .../d/<id> em docs.google também vem
  /docs\.google\.com\/(?:uc|open)\?[^\s]*[?&]?id=([\w-]{10,})/i,
  // Endereço já servido pelo googleusercontent: .../d/<id>
  /lh\d\.googleusercontent\.com\/d\/([\w-]{10,})/i,
]

/** O ID do arquivo, quando o link é do Drive. */
export function driveFileId(url: string): string | undefined {
  const limpo = url.trim()
  if (!/drive\.google\.com|docs\.google\.com|googleusercontent\.com/i.test(limpo)) return undefined
  for (const re of FORMATOS_DRIVE) {
    const m = limpo.match(re)
    if (m) return m[1]
  }
  return undefined
}

/**
 * Traduz o link para um que o `<img>` carrega.
 *
 * O endereço é o `lh3.googleusercontent.com/d/<id>`: é o que serve a imagem
 * crua, na resolução do arquivo, sem página de aviso no meio. Os outros
 * endereços do Drive (`uc?export=view`, `thumbnail?id=`) ou já caíram ou
 * servem uma redução — este é o que a mesa testou e viu funcionar.
 */
export function normalizeImageUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  const limpo = url.trim()
  if (!limpo) return undefined
  const id = driveFileId(limpo)
  if (!id) return limpo
  return `https://lh3.googleusercontent.com/d/${id}`
}

/** O link é do Drive e foi (ou seria) traduzido? Para a tela poder avisar. */
export function ehLinkDoDrive(url: string | undefined): boolean {
  return Boolean(url && driveFileId(url))
}
