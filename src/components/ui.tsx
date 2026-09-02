import { useState } from 'react'
import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

export function Card({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-xl border border-orange-900/40 bg-[#1a140d]/80 shadow-[0_0_0_1px_rgba(255,140,30,0.03)] ${className}`}>
      {children}
    </div>
  )
}

export function SectionTitle({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
  return (
    <h2 className={`font-serif text-sm font-semibold uppercase tracking-widest text-orange-300/80 ${className}`}>
      {children}
    </h2>
  )
}

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'good'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-orange-700 hover:bg-orange-600 text-white shadow-orange-900/40 shadow-md',
  secondary: 'bg-[#2a2013] hover:bg-[#382b19] text-orange-100 border border-orange-800/50',
  ghost: 'bg-transparent hover:bg-white/5 text-orange-200',
  danger: 'bg-red-900/70 hover:bg-red-800 text-red-100',
  good: 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-50',
}

export function Button({
  variant = 'secondary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-orange-900/50 bg-[#150f09] px-3 py-1.5 text-sm text-orange-50 outline-none placeholder:text-orange-400/40 focus:border-orange-500 ${props.className ?? ''}`}
    />
  )
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-orange-900/50 bg-[#150f09] px-3 py-1.5 text-sm text-orange-50 outline-none placeholder:text-orange-400/40 focus:border-orange-500 ${props.className ?? ''}`}
    />
  )
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-lg border border-orange-900/50 bg-[#150f09] px-3 py-1.5 text-sm text-orange-50 outline-none focus:border-orange-500 ${props.className ?? ''}`}
    />
  )
}

export function Badge({ children, tone = 'default' }: PropsWithChildren<{ tone?: 'default' | 'good' | 'bad' | 'warn' }>) {
  const toneClasses = {
    default: 'bg-orange-900/40 text-orange-200 border-orange-700/50',
    good: 'bg-emerald-900/40 text-emerald-200 border-emerald-700/50',
    bad: 'bg-red-900/40 text-red-200 border-red-700/50',
    warn: 'bg-amber-900/40 text-amber-200 border-amber-700/50',
  }[tone]
  return <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${toneClasses}`}>{children}</span>
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
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-orange-800/50 bg-[#241a0f] text-orange-200"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {showImage ? (
        <img src={url} alt={name} className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  )
}
