import { useState } from 'react'
import { Button, Input } from './ui'
import { AvisoDoDrive } from './AvisoDoDrive'
import { ehLinkDoDrive, normalizeImageUrl } from '../lib/imageUrl'
import { modoDaPeca, podeUsarPng } from '../lib/tokenArt'
import type { TokenArt, TokenMode } from '../types'

/**
 * O PNG de peça de uma ficha — só para o mestre.
 *
 * Existe em dois lugares de propósito: no quadro da aba *Peças*, para o mestre
 * resolver a mesa inteira de uma vez, e aqui na ficha, que é onde quem está
 * olhando um NPC de ficha completa procura a imagem dele. Um controle só, no
 * lugar "certo", vira um controle que ninguém acha.
 */
export function TokenArtEditor({
  ficha,
  onGravar,
  compacto = false,
}: {
  ficha: TokenArt & { imageUrl?: string }
  onGravar: (patch: { tokenUrl?: string; tokenMode?: TokenMode }) => Promise<void> | void
  /** Na ficha o espaço é curto; no painel do mestre cabe a explicação. */
  compacto?: boolean
}) {
  const [aberto, setAberto] = useState(false)
  const [rascunho, setRascunho] = useState<string | null>(null)

  const valor = rascunho ?? ficha.tokenUrl ?? ''
  const modo = modoDaPeca(ficha)
  const temPng = podeUsarPng(ficha)

  function gravarLink() {
    // Link do Drive vira endereço servível antes de gravar; apagar o link
    // desliga o PNG junto, senão sobraria modo ligado sem imagem.
    const limpo = normalizeImageUrl(valor) ?? ''
    setRascunho(limpo || null)
    if (limpo === (ficha.tokenUrl ?? '')) return
    void onGravar({ tokenUrl: limpo || undefined, ...(limpo ? {} : { tokenMode: 'ficha' as TokenMode }) })
  }

  if (!aberto) {
    return (
      <button className="text-[11px] text-orange-400 hover:text-orange-200" onClick={() => setAberto(true)}>
        peça no mapa{modo === 'png' ? ' · PNG' : ''}
      </button>
    )
  }

  return (
    <div className={`flex flex-col gap-1 ${compacto ? 'w-44' : 'w-full'}`}>
      {!compacto && (
        <p className="text-[11px] leading-relaxed text-orange-300/50">
          PNG sem fundo para a peça no mapa. O retrato da ficha continua onde está.
        </p>
      )}
      <Input
        value={valor}
        placeholder="link do PNG sem fundo"
        className="text-[11px]"
        onChange={(e) => setRascunho(e.target.value)}
        onBlur={gravarLink}
      />
      <div className="flex flex-wrap gap-1">
        <Button
          variant={modo === 'ficha' ? 'primary' : 'ghost'}
          className="px-2 py-0.5 text-[11px]"
          onClick={() => onGravar({ tokenMode: 'ficha' })}
        >
          retrato
        </Button>
        <Button
          variant={modo === 'png' ? 'primary' : 'ghost'}
          className="px-2 py-0.5 text-[11px]"
          disabled={!temPng}
          title={temPng ? 'Usar o PNG sem fundo no mapa' : 'Cole um link primeiro'}
          onClick={() => onGravar({ tokenMode: 'png' })}
        >
          PNG
        </Button>
        <Button variant="ghost" className="px-2 py-0.5 text-[11px]" onClick={() => setAberto(false)}>
          fechar
        </Button>
      </div>
      {ehLinkDoDrive(ficha.tokenUrl) && <AvisoDoDrive />}
    </div>
  )
}
