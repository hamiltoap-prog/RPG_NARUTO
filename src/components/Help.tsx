import { useState } from 'react'

/**
 * Ajuda contextual.
 *
 * Um ponto de interrogação ao lado do que não é óbvio. O texto some quando
 * não é pedido — explicação que fica sempre à vista vira ruído, e a tela já
 * tem muita coisa.
 */
export function Help({ children, title }: { children: React.ReactNode; title?: string }) {
  const [aberto, setAberto] = useState(false)
  return (
    <span className="relative inline-flex">
      <button
        onClick={() => setAberto(!aberto)}
        aria-label={title ?? 'Ajuda'}
        className={`flex h-4 w-4 items-center justify-center rounded-full border text-[10px] leading-none transition ${
          aberto
            ? 'border-[color:var(--orange)] bg-[color:var(--orange)] text-[color:var(--orange-ink)]'
            : 'border-[color:var(--line-strong)] text-orange-300/60 hover:border-[color:var(--orange)] hover:text-[color:var(--orange)]'
        }`}
      >
        ?
      </button>
      {aberto && (
        <span
          className="plaque absolute left-1/2 top-6 z-30 w-64 -translate-x-1/2 rounded-sm p-2.5 text-xs font-normal leading-relaxed text-orange-200 shadow-lg"
          onClick={() => setAberto(false)}
        >
          {title && <b className="mb-1 block text-white">{title}</b>}
          {children}
        </span>
      )}
    </span>
  )
}
