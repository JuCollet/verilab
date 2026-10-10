import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

/** En-tête des écrans de détail : retour, titre, action optionnelle, onglets Aperçu / Personnalisation (grisé). */
export function SubPageHeader({ title, trailing }: { title: string; trailing?: ReactNode }) {
  const { t } = useI18n()
  return (
    <div className="pt-safe sticky top-0 z-20 bg-bg">
      <header className="relative flex h-[50px] items-center justify-center border-b border-line">
        <Link to="/" aria-label={t.common.back} className="absolute left-[9px] p-1 text-brand">
          <ChevronLeft size={26} strokeWidth={1.8} />
        </Link>
        <h1 className="text-[16px] font-medium text-ink">{title}</h1>
        {trailing && <span className="absolute right-[9px]">{trailing}</span>}
      </header>
      <nav className="flex h-[41px] border-b border-line text-[16px] font-medium text-ink">
        <span className="relative flex flex-1 items-center justify-center">
          {t.detail.overview}
          <span className="absolute inset-x-0 -bottom-px h-[3px] bg-brand" />
        </span>
        <span aria-disabled="true" className="flex flex-1 items-center justify-center opacity-40">
          {t.detail.personalisation}
        </span>
      </nav>
    </div>
  )
}
