import { useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`plaque rounded-xl ${className}`}>{children}</div>
}

export function SectionTitle({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <h2 className={`rule-gold font-serif text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--gold)] ${className}`}>
      {children}
    </h2>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'good'

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'btn-carved bg-[linear-gradient(180deg,var(--ember-bright)_0%,var(--ember)_45%,var(--ember-deep)_100%)] text-[#fff6e9] border-[color:var(--gold-deep)]',
  secondary:
    'btn-carved bg-[linear-gradient(180deg,var(--surface-raised)_0%,var(--surface-tab)_100%)] text-orange-100',
  ghost: 'bg-transparent text-orange-200 hover:bg-white/5 transition',
  danger: 'btn-carved bg-[linear-gradient(180deg,#a3321f_0%,#7a2114_55%,#4d130b_100%)] text-red-50',
  good: 'btn-carved bg-[linear-gradient(180deg,#3f8f5a_0%,#2c6b42_55%,#194728_100%)] text-emerald-50',
}

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold tracking-wide disabled:cursor-not-allowed disabled:opacity-40 disabled:saturate-50 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}

const fieldClasses =
  'w-full rounded-lg border border-[color:var(--gold-dark)] bg-[color:var(--surface-well)] px-3 py-1.5 text-sm text-orange-100 shadow-[inset_0_2px_5px_rgba(0,0,0,0.55)] outline-none transition placeholder:text-orange-400/40 focus:border-[color:var(--gold)] focus:shadow-[inset_0_2px_5px_rgba(0,0,0,0.55),0_0_0_2px_rgba(217,164,65,0.18)]'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${fieldClasses} ${props.className ?? ''}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${fieldClasses} ${props.className ?? ''}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${fieldClasses} ${props.className ?? ''}`} />
}

export function Badge({ children, tone = 'default' }: PropsWithChildren<{ tone?: 'default' | 'good' | 'bad' | 'warn' }>) {
  const toneClasses = {
    default: 'border-[color:var(--gold-deep)] bg-[#2a1a0c] text-[color:var(--gold-bright)]',
    good: 'border-emerald-800/70 bg-emerald-950/60 text-emerald-200',
    bad: 'border-red-900/70 bg-red-950/60 text-red-200',
    warn: 'border-amber-800/70 bg-amber-950/60 text-amber-200',
  }[tone]
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] ${toneClasses}`}
    >
      {children}
    </span>
  )
}

/** Pastilha de aba — a mesma peça no painel do mestre, na ficha e na loja. */
export function TabChip({
  active,
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { active: boolean }) {
  return (
    <button
      data-active={active}
      className={`tab-chip rounded-full px-3 py-1.5 text-sm font-semibold ${className}`}
      {...props}
    />
  )
}

export function Avatar({ url, name, size = 40 }: { url?: string; name: string; size?: number }) {
  const [broken, setBroken] = useState(false)
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  const showImage = Boolean(url) && !broken
  return (
    <div
      className="portrait-ring flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--surface-raised)] font-serif font-bold text-[color:var(--gold-bright)]"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {showImage ? (
        <img src={url} alt={name} className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  )
}
