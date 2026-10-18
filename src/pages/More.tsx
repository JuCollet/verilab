import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { ChevronRight, Newspaper, ShoppingCart, SlidersVertical, Trophy, Users } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { CURRENT_USER } from '../store/seed'
import { initials } from '../lib/initials'

type TileId = keyof Dictionary['more']['tiles']

const ICON = { size: 26, strokeWidth: 1.8 }

const TILES: { id: TileId; icon: ReactNode }[] = [
  { id: 'webshop', icon: <ShoppingCart {...ICON} /> },
  { id: 'news', icon: <Newspaper {...ICON} /> },
  { id: 'referral', icon: <Trophy {...ICON} /> },
  { id: 'appSettings', icon: <PhoneSettingsIcon /> },
  { id: 'features', icon: <UserFeatureIcon /> },
  { id: 'devices', icon: <DevicesFolderIcon /> },
]

/** Écran « Plus ». Seule « Compte et utilisateurs » ouvre un écran ; le reste est affiché normalement mais inerte. */
export function More() {
  const { t } = useI18n()
  const rows = [
    { content: t.more.account, icon: <Users size={24} strokeWidth={1.5} />, to: '/plus/utilisateurs' },
    { content: t.more.system, icon: <SlidersVertical size={24} strokeWidth={1.5} /> },
  ]
  return (
    <div className="flex min-h-full flex-col px-[7px] pb-[14px]">
      <header className="pt-safe flex h-[calc(78px+env(safe-area-inset-top))] items-end justify-between pb-[9px] pl-[0px]">
        <h1 className="text-[16px] font-semibold text-ink">{t.sos.address}</h1>
        <div className="flex items-center gap-[8px]">
          <span className="text-[16px] text-ink">{CURRENT_USER}</span>
          <span className="flex h-[25px] w-[25px] items-center justify-center rounded-full bg-[#168031] text-[13px] text-white">
            {initials(CURRENT_USER)}
          </span>
        </div>
      </header>

      <ul className="grid grid-cols-3 gap-[7px]">
        {TILES.map((tile) => (
          <li key={tile.id} className="flex min-h-[66px] flex-col items-center justify-center gap-[6px] rounded-[5px] bg-card px-[4px] py-[8px] shadow-card">
            <span className="text-vivid">{tile.icon}</span>
            <span className="text-center text-[13px] leading-[15px] tracking-[-0.01em] text-ink">{t.more.tiles[tile.id]}</span>
          </li>
        ))}
      </ul>

      <ul className="mt-[14px] rounded-[5px] bg-card shadow-card">
        {rows.map(({ content: [title, description], icon, to }, i) => {
          const content = (
            <>
              <span className="pt-[1px] text-ink">{icon}</span>
              <div className="flex-1">
                <h2 className="text-[17px] leading-[22px] font-medium text-ink">{title}</h2>
                <p className="mt-[6px] text-[14px] leading-[19px] text-muted">{description}</p>
              </div>
              <ChevronRight size={22} strokeWidth={1.8} className="mt-[1px] shrink-0 text-brand" />
            </>
          )
          const className = 'flex gap-[22px] py-[17px] pr-[16px] pl-[18px]'
          return (
            <li key={title} className={i > 0 ? 'border-t border-line' : ''}>
              {to ? (
                <Link to={to} className={`${className} active:bg-bg`}>
                  {content}
                </Link>
              ) : (
                <div className={className}>{content}</div>
              )}
            </li>
          )
        })}
      </ul>

      <div className="flex-1" />
      <span className="mt-[20px] flex h-[47px] items-center justify-center rounded-[4px] border-2 border-line bg-card text-[14px] font-medium tracking-[0.09em] text-brand">
        {t.more.logout}
      </span>
    </div>
  )
}

function PhoneSettingsIcon() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24">
      <rect x={6.5} y={1.8} width={11} height={20.4} rx={1.6} fill="currentColor" />
      <rect x={8} y={3.6} width={8} height={14.2} fill="#fff" />
      <circle cx={12} cy={20} r={0.9} fill="#fff" />
      <g fill="currentColor">
        <circle cx={12} cy={10.6} r={2.6} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect key={angle} x={11.3} y={6.9} width={1.4} height={1.6} transform={`rotate(${angle} 12 10.6)`} />
        ))}
      </g>
      <circle cx={12} cy={10.6} r={1.1} fill="#fff" />
    </svg>
  )
}

function UserFeatureIcon() {
  return (
    <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round">
      <circle cx={9} cy={5.5} r={3.2} />
      <path d="M2.5 18v-2.5a3.5 3.5 0 0 1 3.5-3.5h4.5" />
      <path d="M2.5 18h7" />
      <circle cx={16.5} cy={16} r={5.5} />
      <path d="m16.5 13.2 1.1 1.6 1.8.3-1.3 1.3.3 1.8-1.9-.9-1.9.9.3-1.8-1.3-1.3 1.8-.3Z" />
    </svg>
  )
}

function DevicesFolderIcon() {
  return (
    <svg width={28} height={26} viewBox="0 0 26 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round">
      <path d="M2.5 5.5a1.5 1.5 0 0 1 1.5-1.5h5.5l2 2.5h10.5a1.5 1.5 0 0 1 1.5 1.5v10.5a1.5 1.5 0 0 1-1.5 1.5H4a1.5 1.5 0 0 1-1.5-1.5Z" />
      <path d="M13 9.6 10 12v3.2h6V12Z" strokeWidth={1.4} />
    </svg>
  )
}
