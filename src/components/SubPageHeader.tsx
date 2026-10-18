import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronLeft } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

type Props = {
  title: string
  /** Petite ligne au-dessus du titre (ex. « Support » au-dessus de « Guides vidéo »). */
  overline?: string
  trailing?: ReactNode
  backTo?: string
  /** Onglets Aperçu / Personnalisation (grisé). */
  tabs?: boolean
}

/** En-tête des écrans de détail : retour, titre, action optionnelle, onglets optionnels. */
export function SubPageHeader({ title, overline, trailing, backTo = '/', tabs = true }: Props) {
  const { t } = useI18n()
  return (
    <div className="pt-safe sticky top-0 z-20 bg-bg">
      <header className="relative flex h-[50px] flex-col items-center justify-center border-b border-line">
        <Link to={backTo} aria-label={t.common.back} className="absolute left-[9px] p-1 text-brand">
          <ChevronLeft size={26} strokeWidth={1.8} />
        </Link>
        {overline && <p className="text-[14px] leading-[16px] text-ink">{overline}</p>}
        <h1 className={`font-medium text-ink ${overline ? 'text-[16px] leading-[19px]' : 'text-[16px]'}`}>{title}</h1>
        {trailing && <span className="absolute right-[9px]">{trailing}</span>}
      </header>
      {tabs && (
        <nav className="flex h-[41px] border-b border-line text-[16px] font-medium text-ink">
          <span className="relative flex flex-1 items-center justify-center">
            {t.detail.overview}
            <span className="absolute inset-x-0 -bottom-px h-[3px] bg-brand" />
          </span>
          <span aria-disabled="true" className="flex flex-1 items-center justify-center opacity-40">
            {t.detail.personalisation}
          </span>
        </nav>
      )}
    </div>
  )
}
