import { useTheme } from '../hooks/useTheme'

/** Troca entre o preto da casa e o papel claro. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { tema, alternar } = useTheme()
  return (
    <button
      onClick={alternar}
      title={tema === 'escuro' ? 'Mudar para o tema claro' : 'Mudar para o tema escuro'}
      className={`rounded-sm border border-[color:var(--line)] px-2 py-1 text-sm transition hover:border-[color:var(--orange)] ${className}`}
    >
      {tema === 'escuro' ? '☀' : '☾'}
    </button>
  )
}
