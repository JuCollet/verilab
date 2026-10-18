import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight, FileClock, Info, UserRoundCog, UsersRound } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { SubPageHeader } from '../components/SubPageHeader'

type RowId = keyof Dictionary['account']['rows']

const ICON = { size: 24, strokeWidth: 1.4 }

const ROWS: { id: RowId; icon: ReactNode; to?: string }[] = [
  { id: 'users', icon: <UsersRound {...ICON} />, to: '/plus/utilisateurs' },
  { id: 'profile', icon: <UserRoundCog {...ICON} /> },
  { id: 'invoices', icon: <FileClock {...ICON} /> },
  { id: 'privacy', icon: <Info {...ICON} /> },
]

/**
 * Plus › Compte et utilisateurs. Seule « Utilisateurs » ouvre un écran (la liste, dont le retour ramène ici) ;
 * les autres lignes sont affichées normalement mais inertes.
 */
export function Account() {
  const { t } = useI18n()
  return (
    <div className="pb-[16px]">
      <SubPageHeader title={t.more.account[0]} overline={t.tabs.more} backTo="/plus" tabs={false} />
      <ul className="mx-[8px] mt-[9px] overflow-hidden rounded-[6px] bg-card shadow-card">
        {ROWS.map(({ id, icon, to }, i) => {
          const [title, description] = t.account.rows[id]
          const className = 'flex gap-[24px] pt-[20px] pr-[24px] pb-[16px] pl-[20px]'
          const content = (
            <>
              <span className="shrink-0 text-ink">{icon}</span>
              <div className="flex-1">
                <h2 className="text-[16px] leading-[22px] text-ink">{title}</h2>
                <p className="mt-[8px] text-[15px] leading-[23px] text-muted">{description}</p>
              </div>
              <ChevronRight size={22} strokeWidth={1.6} className="shrink-0 text-vivid" />
            </>
          )
          return (
            <li key={id} className={i > 0 ? 'border-t border-line' : ''}>
              {to ? (
                <Link to={to} state={{ from: '/plus/compte' }} className={`${className} active:bg-bg`}>
                  {content}
                </Link>
              ) : (
                <div className={className}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
