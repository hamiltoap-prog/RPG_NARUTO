import { enderecosDa, lerFaixa, mensagemDeErro, normalizeAudioLink } from '../audioLinks'
import { VOLUME_PADRAO, ehCombateDeChefe, resolveAudioPlan, somAoAbrir, somDaCena } from '../audioPlan'
import type { AudioKind, AudioTrack, CombatParticipant, GameTable } from '../../types'

const ok = (c: boolean, m: string) => {
  if (!c) throw new Error('FALHOU: ' + m)
}

function faixa(id: string, kind: AudioKind): AudioTrack {
  return { id, tableId: 't', kind, label: id, url: `https://x/${id}.mp3`, sourceUrl: `https://x/${id}.mp3`, source: 'direct', createdAt: 0 }
}

function mesa(combatActive: boolean, chefe = false): Pick<GameTable, 'combatActive' | 'combatOrder'> {
  const order: CombatParticipant[] = combatActive
    ? [{ ref: 'npc:1', name: 'x', initiative: 10, surprised: false, boss: chefe, conditions: [] } as CombatParticipant]
    : []
  return { combatActive, combatOrder: order }
}

const floresta = faixa('floresta', 'ambience')
const tenso = faixa('tenso', 'mood')
const luta = faixa('luta', 'combat')
const chefao = faixa('chefao', 'boss')
const todas = [floresta, tenso, luta, chefao]
const cena = { audio: { ambienceId: 'floresta', moodId: 'tenso' } }

// --- Fora de combate: toca o que o mestre escolheu, ambientação E clima juntos
{
  const p = resolveAudioPlan(mesa(false), cena, todas)
  ok(p.ambience?.id === 'floresta', 'a ambientação escolhida toca')
  ok(p.mood?.id === 'tenso', 'o clima toca JUNTO, não no lugar')
  ok(p.combat === null && !p.combatTakeover, 'sem combate, nada de música de luta')
}

// --- Combate assume sozinho
{
  const p = resolveAudioPlan(mesa(true), cena, todas)
  ok(p.combat?.id === 'luta', 'o combate toca a faixa de combate')
  ok(p.ambience === null && p.mood === null, 'ambientação e clima saem')
  ok(p.combatTakeover, 'e o plano diz que o combate assumiu')
}

// --- O coração da ideia: acabou a luta, volta sozinho — nada foi "lembrado"
{
  const durante = resolveAudioPlan(mesa(true), cena, todas)
  ok(durante.ambience === null, 'durante a luta a ambientação some do plano')
  const depois = resolveAudioPlan(mesa(false), cena, todas)
  ok(depois.ambience?.id === 'floresta' && depois.mood?.id === 'tenso', 'ao acabar, a escolha do mestre volta intacta')
  ok(cena.audio.ambienceId === 'floresta', 'e a cena nunca foi mexida para isso')
}

// --- Chefe: faixa própria, e cai para a de combate se não houver
{
  ok(ehCombateDeChefe(mesa(true, true)), 'luta com chefe na ordem é combate de chefe')
  ok(!ehCombateDeChefe(mesa(true, false)), 'luta sem chefe não é')
  ok(!ehCombateDeChefe(mesa(false, true)), 'sem combate ativo não é combate de chefe')

  const comChefe = resolveAudioPlan(mesa(true, true), cena, todas)
  ok(comChefe.combat?.id === 'chefao', 'combate de chefe toca a faixa de chefe')
  ok(!comChefe.bossFallback, 'e não precisou cair para a normal')

  const semFaixaDeChefe = resolveAudioPlan(mesa(true, true), cena, [floresta, tenso, luta])
  ok(semFaixaDeChefe.combat?.id === 'luta', 'sem faixa de chefe, cai para a de combate')
  ok(semFaixaDeChefe.bossFallback, 'e o plano avisa que caiu')

  const lutaNormal = resolveAudioPlan(mesa(true, false), cena, todas)
  ok(lutaNormal.combat?.id === 'luta', 'luta sem chefe não toca a faixa de chefe')
}

// --- Mais de uma faixa de combate: vale a que o mestre escolheu
{
  const outra = faixa('luta2', 'combat')
  const outroChefe = faixa('chefao2', 'boss')
  const lista = [...todas, outra, outroChefe]
  ok(resolveAudioPlan(mesa(true), cena, lista).combat?.id === 'luta', 'sem escolha, a primeira cadastrada')
  const escolhida = { audio: { ...cena.audio, combatId: 'luta2', bossId: 'chefao2' } }
  ok(resolveAudioPlan(mesa(true), escolhida, lista).combat?.id === 'luta2', 'com escolha, a escolhida')
  ok(resolveAudioPlan(mesa(true, true), escolhida, lista).combat?.id === 'chefao2', 'o mesmo para a de chefe')
  const apagada = { audio: { combatId: 'nao-existe' } }
  ok(resolveAudioPlan(mesa(true), apagada, lista).combat?.id === 'luta', 'escolhida apagada cai para a primeira')
  ok(resolveAudioPlan(mesa(false), escolhida, lista).combat === null, 'fora de combate, a escolha não toca')
}

// --- Cena guardada leva o som junto, e abrir traz de volta (inclusive o silêncio)
{
  const vivo = { ambienceId: 'floresta', ambienceVolume: 0.3, updatedAt: 123 } as Record<string, unknown>
  const guardado = somDaCena(vivo)
  ok(guardado?.ambienceId === 'floresta' && guardado.ambienceVolume === 0.3, 'guarda a escolha e o volume')
  ok(!('updatedAt' in (guardado ?? {})), 'sem o carimbo do documento')
  ok(somDaCena(null) === undefined && somDaCena({}) === undefined, 'sem som, nada a guardar')

  const patch = somAoAbrir(guardado)
  ok(patch?.ambienceId === 'floresta', 'abrir põe a ambientação guardada')
  ok(patch?.moodId === null, 'e cala o clima que a cena não tinha')
  ok(patch?.combatId === null, 'e volta a escolha de combate ao padrão')
  ok(!('moodVolume' in (patch ?? {})), 'volume não guardado fica como a mesa usa')
  ok(somAoAbrir(undefined) === null, 'cena antiga, de antes do som, não mexe em nada')
}

// --- Combate sem faixa nenhuma cadastrada: não há o que assumir, segue o som da cena
{
  const p = resolveAudioPlan(mesa(true), cena, [floresta, tenso])
  ok(!p.combatTakeover, 'sem faixa de combate, o combate não assume')
  ok(p.ambience?.id === 'floresta', 'e a ambientação continua tocando em vez de a mesa ficar muda')
}

// --- Escolha que aponta para faixa apagada não quebra nada
{
  const p = resolveAudioPlan(mesa(false), { audio: { ambienceId: 'sumiu' } }, todas)
  ok(p.ambience === null, 'faixa removida da biblioteca simplesmente não toca')
  ok(resolveAudioPlan(mesa(false), null, todas).ambience === null, 'mesa sem cena não toca nada')
}

// --- Volumes por categoria, com padrão
{
  const p = resolveAudioPlan(mesa(false), { audio: { ambienceVolume: 0.2 } }, todas)
  ok(p.volumes.ambience === 0.2, 'o volume da cena vale')
  ok(p.volumes.mood === VOLUME_PADRAO.mood, 'o que não foi mexido fica no padrão')
  ok(resolveAudioPlan(mesa(false), { audio: { moodVolume: 0 } }, todas).volumes.mood === 0, 'volume zero é zero, não o padrão')
}

// --- A função é pura: mesma entrada, mesma saída, e não mexe em nada
{
  const antes = JSON.stringify({ cena, todas })
  const a = resolveAudioPlan(mesa(true, true), cena, todas)
  const b = resolveAudioPlan(mesa(true, true), cena, todas)
  ok(JSON.stringify(a) === JSON.stringify(b), 'mesma entrada, mesmo plano')
  ok(JSON.stringify({ cena, todas }) === antes, 'e nada da entrada foi alterado')
}

console.log('prioridade: combate > escolha do mestre; chefe > combate; nada é lembrado, tudo é recalculado')

// ===========================================================================
// Links
// ===========================================================================

// --- YouTube em qualquer formato vai para a saída do YouTube
{
  const id = 'dQw4w9WgXcQ'
  for (const u of [
    `https://www.youtube.com/watch?v=${id}`,
    `https://youtu.be/${id}`,
    `https://www.youtube.com/shorts/${id}`,
    `https://www.youtube.com/embed/${id}`,
    `https://www.youtube.com/watch?v=${id}&list=PL123&t=42s`,
    `https://m.youtube.com/watch?v=${id}`,
  ]) {
    const l = normalizeAudioLink(u)!
    ok(l.source === 'youtube' && l.youtubeId === id, `YouTube reconhecido em ${u}`)
  }
  ok(normalizeAudioLink('https://www.youtube.com/channel/abc') === null, 'link do YouTube sem vídeo é recusado')
}

// --- Provedores de arquivo viram o endereço cru
{
  const dbx = normalizeAudioLink('https://www.dropbox.com/s/abc123/chuva.mp3?dl=0')!
  ok(dbx.provider === 'dropbox' && dbx.source === 'direct', 'Dropbox reconhecido')
  ok(dbx.url.startsWith('https://dl.dropboxusercontent.com/') && dbx.url.includes('raw=1'), `Dropbox vira o arquivo cru, veio ${dbx.url}`)

  const gh = normalizeAudioLink('https://github.com/fulano/sons/blob/main/trilhas/vila.mp3')!
  ok(gh.provider === 'github', 'GitHub reconhecido')
  ok(gh.url === 'https://raw.githubusercontent.com/fulano/sons/main/trilhas/vila.mp3', `blob/ vira raw, veio ${gh.url}`)

  const od = normalizeAudioLink('https://1drv.ms/u/s!Abc123')!
  ok(od.provider === 'onedrive' && od.url.endsWith('download=1'), 'OneDrive pede o download')

  const direto = normalizeAudioLink('https://exemplo.com/sons/taverna.ogg')!
  ok(direto.provider === 'other' && direto.url === 'https://exemplo.com/sons/taverna.ogg', 'link direto passa intacto')
}

// --- Drive: tenta por vários endereços, e o erro explica que é o Drive
{
  const dr = normalizeAudioLink('https://drive.google.com/file/d/1TtnE0xmmyIZC8Ua9Iw1L-pNJy_8WnhUQ/view?usp=drive_link')!
  ok(dr.provider === 'drive' && dr.source === 'direct', 'Drive reconhecido como arquivo')
  ok(dr.altUrls.length >= 2, `o Drive leva endereços alternativos (${dr.altUrls.length})`)
  const todos = enderecosDa(dr)
  ok(new Set(todos).size === todos.length, 'nenhum endereço repetido na fila de tentativas')
  ok(todos.every((u) => u.includes('1TtnE0xmmyIZC8Ua9Iw1L-pNJy_8WnhUQ')), 'todos os endereços apontam para o mesmo arquivo')
  ok(/limitação do Drive/i.test(mensagemDeErro('drive', 4)), 'o erro do Drive diz que a limitação é dele, não do link')
  ok(!/Drive/i.test(mensagemDeErro('other', 4)), 'arquivo comum não fala em Drive')
  ok(/não serve um arquivo de áudio/i.test(mensagemDeErro('other', 4)), 'MediaError 4 vira uma frase legível')
}

// --- Faixa antiga (categoria em português, só YouTube) é lida sem migração
{
  const antiga = lerFaixa({ id: 'v1', tableId: 't', category: 'clima', label: 'Tensão', url: 'https://youtu.be/dQw4w9WgXcQ', createdAt: 5 })!
  ok(antiga.kind === 'mood', `"clima" antigo vira mood, veio ${antiga.kind}`)
  ok(antiga.source === 'youtube' && antiga.youtubeId === 'dQw4w9WgXcQ', 'e continua tocando pelo YouTube')
  ok(lerFaixa({ id: 'v2', tableId: 't', category: 'ambiente', label: 'A', url: 'https://youtu.be/dQw4w9WgXcQ', createdAt: 0 })!.kind === 'ambience', 'ambiente vira ambience')
  ok(lerFaixa({ id: 'v3', tableId: 't', category: 'combate', label: 'C', url: 'https://youtu.be/dQw4w9WgXcQ', createdAt: 0 })!.kind === 'combat', 'combate vira combat')
  const nova = faixa('n', 'boss')
  ok(lerFaixa(nova) === nova, 'faixa já no formato novo passa como está')
  ok(lerFaixa({ id: 'x', tableId: 't', label: 'quebrada', url: '', createdAt: 0 }) === null, 'faixa sem link nenhum é descartada')
}

console.log('links: YouTube, Dropbox, GitHub, OneDrive, direto e Drive (com alternativos e aviso próprio)')
console.log('OK: checagens do som passaram')
