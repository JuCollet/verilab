import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight } from 'lucide-react'

type CardProps = { title?: string; chevron?: boolean; extra?: ReactNode; children: ReactNode; className?: string; to?: string }

/** Carte de l'Accueil. Avec `to`, toute la carte est cliquable et le chevron est actif ; sinon le chevron est grisé. */
export function Card({ title, chevron, extra, children, className = '', to }: CardProps) {
  const classes = `mx-[7px] mb-[7px] block rounded-[7px] bg-card shadow-card ${className}`
  const content = (
    <>
      {title && (
        <header className="flex h-[44px] items-center gap-3 pr-3 pl-[20px]">
          <h2 className="flex-1 text-[14px] font-medium tracking-[0.01em] text-ink uppercase">{title}</h2>
          {extra}
          {chevron &&
            (to ? (
              <span className="text-brand">
                <ChevronRight size={22} strokeWidth={1.8} />
              </span>
            ) : (
              <DisabledChevron />
            ))}
        </header>
      )}
      {children}
    </>
  )
  return to ? (
    <Link to={to} className={`${classes} active:bg-[#fafafa]`}>
      {content}
    </Link>
  ) : (
    <section className={classes}>{content}</section>
  )
}

export function DisabledChevron({ className = '' }: { className?: string }) {
  return (
    <span aria-disabled="true" className={`text-brand opacity-40 ${className}`}>
      <ChevronRight size={22} strokeWidth={1.8} />
    </span>
  )
}
