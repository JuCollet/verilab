import type { ReactNode } from 'react'

const variants = {
  white: 'bg-card text-ink shadow-round',
  black: 'bg-[#2b2b2b] text-white',
  orange: 'bg-partial text-white shadow-round',
  red: 'bg-brand text-white shadow-round',
  green: 'bg-success text-white',
  yellow: 'bg-warning text-white',
}

export type CircleVariant = keyof typeof variants

type Props = {
  size: number
  variant: CircleVariant
  children: ReactNode
  pending?: boolean
  onClick?: () => void
  label?: string
  className?: string
}

export function StatusCircle({ size, variant, children, pending, onClick, label, className = '' }: Props) {
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      aria-label={label}
      onClick={pending ? undefined : onClick}
      className={`relative flex shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${variants[variant]} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
      {pending && (
        <svg className="absolute -inset-[5px] animate-spin" viewBox="0 0 100 100" style={{ animationDuration: '0.9s' }}>
          <circle cx={50} cy={50} r={47} fill="none" stroke="#e4002b" strokeWidth={3} strokeLinecap="round" strokeDasharray="75 300" />
        </svg>
      )}
    </Tag>
  )
}
