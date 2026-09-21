import { extractVideoId } from '../youtube'
const ok = (c: boolean, m: string) => { if (!c) throw new Error('FALHOU: ' + m) }
const casos: [string, string][] = [
  ['https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s', 'dQw4w9WgXcQ'],
  ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ['https://www.youtube.com/shorts/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ['https://www.youtube.com/live/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ['https://music.youtube.com/watch?v=dQw4w9WgXcQ&list=RDAMVM', 'dQw4w9WgXcQ'],
  ['  dQw4w9WgXcQ  ', 'dQw4w9WgXcQ'],
  ['https://exemplo.com/video', ''],
  ['', ''],
]
for (const [entrada, esperado] of casos) {
  const saiu = extractVideoId(entrada)
  ok(saiu === esperado, `"${entrada}" devia dar "${esperado}", deu "${saiu}"`)
}
console.log(`extração de id do YouTube: ${casos.length} formas de link, todas certas`)
console.log('OK: checagens da mesa de som passaram')
