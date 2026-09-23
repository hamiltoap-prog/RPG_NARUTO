import { driveFileId, ehLinkDoDrive, normalizeImageUrl } from '../imageUrl'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

const ID = '1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv'
const SERVIDO = `https://drive.google.com/thumbnail?id=${ID}&sz=w1600`

// --- As formas em que o link do Drive chega colado
{
  const formas = [
    `https://drive.google.com/file/d/${ID}/view?usp=sharing`,
    `https://drive.google.com/file/d/${ID}/view?usp=drive_link`,
    `https://drive.google.com/file/d/${ID}/preview`,
    `https://drive.google.com/file/d/${ID}`,
    `https://drive.google.com/open?id=${ID}`,
    `https://drive.google.com/uc?export=download&id=${ID}`,
    `https://drive.google.com/uc?id=${ID}&export=view`,
    `https://docs.google.com/uc?id=${ID}`,
    `https://lh3.googleusercontent.com/d/${ID}`,
    `  https://drive.google.com/file/d/${ID}/view  `,
  ]
  for (const f of formas) {
    ok(driveFileId(f) === ID, `devia achar o id em "${f.trim()}", veio ${driveFileId(f)}`)
    ok(normalizeImageUrl(f) === SERVIDO, `devia traduzir "${f.trim()}"`)
    ok(ehLinkDoDrive(f), 'e reconhecer como link do Drive')
  }
  console.log(`link do Drive traduzido em ${formas.length} formatos -> thumbnail?id=...&sz=w1600`)
}

// --- Link que já é imagem passa intacto
{
  const diretos = [
    'https://i.imgur.com/abc123.png',
    'https://cdn.discordapp.com/attachments/1/2/token.png',
    'https://exemplo.com/pasta/arte.jpg?v=2',
    'data:image/png;base64,iVBORw0KGgo=',
  ]
  for (const d of diretos) {
    ok(normalizeImageUrl(d) === d, `link direto não pode ser mexido: ${d}`)
    ok(!ehLinkDoDrive(d), 'e não é do Drive')
  }
}

// --- Traduzir de novo não estraga (a pessoa cola o que o app já converteu)
{
  ok(normalizeImageUrl(SERVIDO) === SERVIDO, 'link já traduzido continua igual')
}

// --- Vazio, espaços e ausente
{
  ok(normalizeImageUrl(undefined) === undefined, 'sem link, sem link')
  ok(normalizeImageUrl('') === undefined, 'vazio vira ausente')
  ok(normalizeImageUrl('    ') === undefined, 'só espaços vira ausente')
  ok(normalizeImageUrl('  https://x/y.png  ') === 'https://x/y.png', 'apara os espaços em volta')
}

// --- Pasta do Drive não é arquivo: não dá para traduzir, e não se inventa
{
  const pasta = 'https://drive.google.com/drive/folders/1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUv'
  ok(driveFileId(pasta) === undefined, 'pasta não tem id de arquivo de imagem')
  ok(normalizeImageUrl(pasta) === pasta, 'e o link fica como veio, para a pessoa ver que está errado')
}

console.log('OK: checagens de link de imagem passaram')
