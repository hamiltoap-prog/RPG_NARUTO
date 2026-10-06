import { useState } from 'react'
import type { ButtonHTMLAttributes, ChangeEvent, FocusEvent, InputHTMLAttributes, Ref, PropsWithChildren, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { normalizeImageUrl } from '../lib/imageUrl'

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
  if (props.type === 'number') return <CampoNumerico {...props} />
  return <input {...props} className={fieldClasses(props.className)} />
}

/** O texto de um campo numérico que ainda não é um número: vazio, só o sinal, ponto no fim. */
const AINDA_DIGITANDO = /^(|-|\+|-?\d*[.,])$/

/**
 * Campo de número que deixa a pessoa apagar.
 *
 * O problema, que no celular era gritante: quase todo campo de número da mesa
 * faz `Number(valor) || 1` (ou `|| 0`) e devolve o resultado para o próprio
 * campo. Ao apagar o "1" para digitar "15", o campo fica vazio por um
 * instante, vira 1 de novo na hora, e nunca deixa trocar o número — no
 * computador dava para selecionar e digitar por cima, no toque não.
 *
 * Aqui o campo guarda o que está sendo digitado enquanto tem o foco, e só
 * entrega para fora o que já é número. Vazio (ou "-") fica na tela até a
 * pessoa sair do campo: aí sim o valor vazio é entregue — quem trata vazio
 * como "sem valor" recebe vazio, quem força 1 força nessa hora — e o campo
 * volta a mostrar o valor de verdade. Ao tocar, o número todo fica
 * selecionado, para digitar por cima sem ter que apagar.
 */
function CampoNumerico({ onChange, onFocus, onBlur, value, className, ...resto }: InputHTMLAttributes<HTMLInputElement>) {
  const [rascunho, setRascunho] = useState<string | null>(null)
  const mostrado = rascunho ?? (value === undefined || value === null ? '' : String(value))
  return (
    <input
      {...resto}
      type="number"
      value={mostrado}
      className={fieldClasses(className)}
      onFocus={(e: FocusEvent<HTMLInputElement>) => {
        setRascunho(e.target.value)
        try {
          e.target.select()
        } catch {
          // Alguns navegadores não deixam selecionar campo de número; tudo bem.
        }
        onFocus?.(e)
      }}
      onChange={(e: ChangeEvent<HTMLInputElement>) => {
        const texto = e.target.value
        setRascunho(texto)
        if (AINDA_DIGITANDO.test(texto) || !Number.isFinite(Number(texto))) return
        onChange?.(e)
      }}
      onBlur={(e: FocusEvent<HTMLInputElement>) => {
        const texto = rascunho ?? e.target.value
        setRascunho(null)
        // Saiu com o campo vazio: agora sim entrega o vazio, e quem chama
        // decide (volta para o mínimo, ou limpa o valor).
        if (AINDA_DIGITANDO.test(texto)) onChange?.(e as unknown as ChangeEvent<HTMLInputElement>)
        onBlur?.(e)
      }}
    />
  )
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement> & { ref?: Ref<HTMLTextAreaElement> }) {
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
  // Link do Drive também é traduzido AQUI, e não só na hora de digitar: pega
  // o que já estava gravado de antes e o que for colado por fora do app.
  const src = normalizeImageUrl(url)
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  const showImage = Boolean(src) && !broken
  return (
    <div
      className="portrait-ring flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-[color:var(--surface-raised)] font-display font-semibold text-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {showImage ? (
        <img src={src} alt={name} className="h-full w-full object-cover" onError={() => setBroken(true)} />
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  )
}
