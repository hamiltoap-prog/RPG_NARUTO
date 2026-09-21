import { Link } from 'react-router-dom'
import { RulesBrowser } from '../components/RulesBrowser'

/** As regras da casa, abertas a qualquer um da mesa — e fora dela também. */
export function RulesPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4 pb-16">
      <div className="flex items-center gap-3">
        <Link to="/" className="font-display text-xs uppercase tracking-[0.16em] text-orange-300/60 transition hover:text-[color:var(--orange)]">
          ← início
        </Link>
        <h1 className="hero-title font-display text-2xl font-bold uppercase">Manual</h1>
      </div>
      <RulesBrowser />
    </div>
  )
}
