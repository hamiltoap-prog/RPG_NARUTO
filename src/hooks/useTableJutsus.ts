import { useEffect, useState } from 'react'
import { listenCustomJutsus } from '../lib/store'
import { abrirCatalogo, fecharCatalogo, setTableJutsus } from '../lib/jutsuCatalog'
import type { JutsuCatalogEntry } from '../types'

/**
 * Mantém o catálogo da mesa carregado enquanto a tela estiver aberta.
 *
 * Toda tela que abre uma mesa chama este hook: é ele que enche o registro de
 * `lib/jutsuCatalog`, de onde saem o `findCatalogEntry`, a lista do que dá
 * para aprender e o texto que o manual mostra. Sem ele, um jutsu da casa
 * existiria no banco e em lugar nenhum da tela.
 *
 * Ao sair da mesa o registro é esvaziado — o app abre uma mesa por aba, e
 * deixar o catálogo de uma mesa para trás faria a seguinte enxergar jutsus
 * que não são dela. Mas só quando a ÚLTIMA tela sai: o painel do mestre e a
 * ficha que ele abre por dentro dele assinam os dois, e fechar a ficha não
 * pode apagar o catálogo de quem continua aberto.
 */
export function useTableJutsus(tableId: string | undefined): JutsuCatalogEntry[] {
  const [custom, setCustom] = useState<JutsuCatalogEntry[]>([])

  useEffect(() => {
    if (!tableId) return
    abrirCatalogo()
    const parar = listenCustomJutsus(tableId, (js) => {
      setTableJutsus(js)
      setCustom(js)
    })
    return () => {
      parar()
      fecharCatalogo()
    }
  }, [tableId])

  return custom
}
