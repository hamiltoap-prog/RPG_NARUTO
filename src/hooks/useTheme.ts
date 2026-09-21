import { useEffect, useState } from 'react'

export type Tema = 'escuro' | 'claro'

const CHAVE = 'mesa-ninja:tema'

/**
 * Tema da interface.
 *
 * Fica no navegador de cada um, não na mesa: é preferência de quem está
 * olhando a tela, e não uma decisão do grupo. O atributo no <html> é o que as
 * variáveis do CSS observam.
 */
export function useTheme() {
  const [tema, setTema] = useState<Tema>(() => (localStorage.getItem(CHAVE) as Tema) ?? 'escuro')

  useEffect(() => {
    document.documentElement.dataset.tema = tema
    localStorage.setItem(CHAVE, tema)
  }, [tema])

  return { tema, alternar: () => setTema((t) => (t === 'escuro' ? 'claro' : 'escuro')) }
}
