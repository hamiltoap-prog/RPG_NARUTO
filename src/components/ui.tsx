import { useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return <div className={`plaque rounded-lg ${className}`}>{children}</div>
}

export function SectionTitle({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <h2 className={`rule-gold font-display text-xs font-semibold uppercase tracking-[0.22em] text-white ${className}`}>
      {children}
    </h2>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'good'

/* Chapas de cor sólida. A hierarquia vem da cor de fundo, não de relevo:
 * laranja é a ação principal, o resto é preto com fio. */
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'btn-carved bg-[color:var(--orange)] text-[color:var(--orange-ink)] border-[color:var(--orange)] hover:bg-[color:var(--orange-hot)] hover:border-[color:var(--orange-hot)]',
  secondary:
    'btn-carved bg-[color:var(--surface-raised)] text-white hover:bg-[color:var(--surface-card-hover)] hover:border-[color:var(--line-strong)]',
  ghost: 'border border-transparent text-orange-300 transition hover:border-[color:var(--line)] hover:text-white',
  danger: 'btn-carved bg-[#2a0f0c] text-red-200 border-[#5c1b14] hover:bg-[#3a1511] hover:text-red-100',
  good: 'btn-carved bg-[#0c2117] text-emerald-200 border-[#1d4d36] hover:bg-[#123024] hover:text-emerald-100',
}

/* Desligado é uma chapa neutra, nunca um laranja lavado — que virava marrom
 * com texto escuro por cima. O `hover` também precisa ser desarmado: um botão
 * desabilitado continua casando com `:hover` no CSS. */
const disabledClasses =
  'disabled:cursor-not-allowed disabled:border-[color:var(--line)] disabled:bg-[color:var(--surface-well)] disabled:text-orange-400/35 disabled:hover:border-[color:var(--line)] disabled:hover:bg-[color:var(--surface-well)] disabled:hover:text-orange-400/35'

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-semibold ${variantClasses[variant]} ${disabledClasses} ${className}`}
      {...props}
    />
  )
}

/**
 * `min-w-0` é o que impede um campo de estourar a linha.
 *
 * Um item de flex não encolhe abaixo do tamanho natural do conteúdo, e o
 * tamanho natural de um `<select>` é a largura da opção mais longa. Com
 * opções como "Armadura Samurai — +10 CA · Destreza Nenhum · Desvantagem em
 * Furtividade...", o campo ficava com 1534px e empurrava o resto do cartão
 * para fora da tela no celular.
 */
const fieldBase =
  'min-w-0 rounded-sm border border-[color:var(--line)] bg-[color:var(--surface-well)] px-3 py-1.5 text-sm text-white outline-none transition placeholder:text-orange-400/35 focus:border-[color:var(--orange)]'

/**
 * Campos ocupam a linha toda por padrão, mas um `w-` vindo de fora manda.
 *
 * Empilhar "w-full w-16" deixa a largura na mão da ordem em que o Tailwind
 * gera o CSS, não na ordem das classes — e o campo estreito saía largo. Aqui
 * o `w-full` só entra quando ninguém pediu largura.
 */
function fieldClasses(className?: string): string {
  const pediuLargura = /(^|\s)(w-|min-w-|max-w-|flex-1|grow)/.test(className ?? '')
  return `${pediuLargura ? '' : 'w-full '}${fieldBase} ${className ?? ''}`
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={fieldClasses(props.className)} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={fieldClasses(props.className)} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={fieldClasses(props.className)} />
}

export function Badge({ children, tone = 'default' }: PropsWithChildren<{ tone?: 'default' | 'good' | 'bad' | 'warn' }>) {
  const toneClasses = {
    default: 'border-[color:var(--line-strong)] text-white',
    good: 'border-emerald-700/60 text-emerald-300',
    bad: 'border-red-800/70 text-red-300',
    warn: 'border-[color:var(--orange)] text-[color:var(--orange)]',
  }[tone]
  return (
    <span
      className={`inline-flex items-center rounded-sm border bg-transparent px-2 py-0.5 font-display text-[11px] font-medium uppercase tracking-[0.1em] ${toneClasses}`}
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
      className={`tab-chip rounded-sm px-3 py-1.5 font-display text-sm uppercase tracking-[0.08em] ${className}`}
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
      className="portrait-ring flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[color:var(--surface-raised)] font-display font-semibold text-white"
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
