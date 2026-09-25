import { extractVideoId } from './youtube'
import type { AudioKind, AudioProvider, AudioTrack } from '../types'

/**
 * Link de som que o navegador consegue tocar.
 *
 * Nem todo link colado serve o arquivo de áudio cru. O `<audio>` precisa do
 * binário; a maioria dos "compartilhar" devolve uma página. Aqui cada link
 * conhecido vira o endereço que serve o arquivo — e o YouTube vai para a outra
 * saída do canal, porque `<audio>` não toca vídeo.
 *
 * O caso do **Google Drive** merece a exceção: para IMAGEM ele serve o
 * arquivo normalmente, mas para ÁUDIO, quando outro site tenta tocar, ele
 * responde com uma página de aviso em vez do binário — mesmo com o arquivo
 * público. O app tenta assim mesmo, por vários endereços de download em
 * sequência, e se todos falharem diz que é limitação do Drive (e não o link
 * mal configurado), recomendando YouTube ou outra hospedagem.
 */

export interface LinkDeAudio {
  source: 'youtube' | 'direct'
  provider: AudioProvider
  url: string
  altUrls: string[]
  youtubeId?: string
}

/** O id de um arquivo do Drive, em qualquer formato de link. */
function idDoDrive(url: string): string | undefined {
  return (
    url.match(/drive\.google\.com\/file\/d\/([\w-]{10,})/i)?.[1] ??
    url.match(/(?:drive|docs)\.google\.com\/(?:open|uc)\?[^\s]*?[?&]?id=([\w-]{10,})/i)?.[1] ??
    url.match(/drive\.usercontent\.google\.com\/[^\s]*?[?&]id=([\w-]{10,})/i)?.[1]
  )
}

export function normalizeAudioLink(bruto: string): LinkDeAudio | null {
  const url = bruto.trim()
  if (!url) return null

  // YouTube: qualquer formato (watch, youtu.be, shorts, embed, live).
  if (/youtu\.?be/i.test(url)) {
    const id = extractVideoId(url)
    if (!id) return null
    return { source: 'youtube', provider: 'youtube', url: `https://www.youtube.com/watch?v=${id}`, altUrls: [], youtubeId: id }
  }

  // Google Drive: vários endereços de download, do mais provável ao menos.
  const drive = idDoDrive(url)
  if (drive) {
    return {
      source: 'direct',
      provider: 'drive',
      url: `https://drive.usercontent.google.com/download?id=${drive}&export=download&confirm=t`,
      altUrls: [
        `https://drive.google.com/uc?export=download&id=${drive}&confirm=t`,
        `https://drive.google.com/uc?export=open&id=${drive}`,
        `https://docs.google.com/uc?export=download&id=${drive}`,
      ],
    }
  }

  // Dropbox: `dl=0` abre a página; `raw=1` serve o arquivo.
  if (/dropbox\.com/i.test(url)) {
    const u = url
      .replace(/^https?:\/\/(www\.)?dropbox\.com/i, 'https://dl.dropboxusercontent.com')
      .replace(/([?&])dl=0/, '$1raw=1')
    return { source: 'direct', provider: 'dropbox', url: u, altUrls: [url.replace(/dl=0/, 'raw=1')] }
  }

  // OneDrive: o link curto vira download pelo parâmetro `download=1`.
  if (/1drv\.ms|onedrive\.live\.com/i.test(url)) {
    const sep = url.includes('?') ? '&' : '?'
    return { source: 'direct', provider: 'onedrive', url: `${url}${sep}download=1`, altUrls: [] }
  }

  // GitHub: `blob/` é a página; `raw.githubusercontent.com` é o arquivo.
  const gh = url.match(/github\.com\/([^/]+)\/([^/]+)\/blob\/(.+)$/i)
  if (gh) {
    return {
      source: 'direct',
      provider: 'github',
      url: `https://raw.githubusercontent.com/${gh[1]}/${gh[2]}/${gh[3]}`,
      altUrls: [`${url}${url.includes('?') ? '&' : '?'}raw=true`],
    }
  }

  return { source: 'direct', provider: 'other', url, altUrls: [] }
}

/** Todos os endereços de uma faixa, na ordem em que o canal deve tentar. */
export function enderecosDa(t: Pick<AudioTrack, 'url' | 'altUrls'>): string[] {
  return [t.url, ...(t.altUrls ?? [])].filter((u, i, todos) => u && todos.indexOf(u) === i)
}

/**
 * Faixa gravada no formato antigo, de antes deste sistema: tinha `category`
 * (ambiente/clima/combate) e só link do YouTube. É lida aqui e convertida em
 * memória, para a biblioteca que a mesa já montou continuar valendo sem
 * migração nenhuma no banco.
 */
interface FaixaAntiga {
  id: string
  tableId: string
  category?: 'ambiente' | 'clima' | 'combate'
  label: string
  url: string
  createdAt: number
}

const DE_CATEGORIA: Record<string, AudioKind> = { ambiente: 'ambience', clima: 'mood', combate: 'combat' }

export function lerFaixa(bruta: Partial<AudioTrack> & Partial<FaixaAntiga>): AudioTrack | null {
  if (!bruta.id) return null
  // Já no formato novo.
  if (bruta.kind && bruta.source && bruta.url) return bruta as AudioTrack

  const link = normalizeAudioLink(bruta.sourceUrl ?? bruta.url ?? '')
  if (!link) return null
  return {
    id: bruta.id,
    tableId: bruta.tableId ?? '',
    kind: bruta.kind ?? DE_CATEGORIA[bruta.category ?? ''] ?? 'ambience',
    label: bruta.label ?? 'Faixa sem nome',
    url: link.url,
    sourceUrl: bruta.url ?? link.url,
    altUrls: link.altUrls,
    source: link.source,
    provider: link.provider,
    youtubeId: link.youtubeId,
    createdAt: bruta.createdAt ?? 0,
  }
}

/** A mensagem que a pessoa lê quando o arquivo não toca. */
export function mensagemDeErro(provider: AudioProvider | undefined, codigo?: number): string {
  if (provider === 'drive') {
    return (
      'O Google Drive não entrega áudio para outros sites: mesmo público, ele responde com uma página de aviso ' +
      'em vez do arquivo. Não é o link que está errado — é limitação do Drive. Use YouTube ou outra hospedagem ' +
      '(Dropbox, GitHub, um link direto para o .mp3).'
    )
  }
  switch (codigo) {
    case 1:
      return 'O carregamento foi interrompido.'
    case 2:
      return 'Falha de rede ao buscar o arquivo.'
    case 3:
      return 'O arquivo chegou, mas não deu para decodificar o áudio (formato estranho ou corrompido).'
    case 4:
      return 'O endereço não serve um arquivo de áudio — provavelmente uma página, não o arquivo em si.'
    default:
      return 'Não foi possível tocar esta faixa.'
  }
}
