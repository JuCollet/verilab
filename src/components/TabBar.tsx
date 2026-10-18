import { NavLink, useLocation } from 'react-router'
import { CircleHelp, Ellipsis, House } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

/** Routes affichées sous l'onglet Accueil. */
const HOME_PATHS = ['/', '/portes-fenetres', '/climat']

function HomeTabIcon({ active }: { active: boolean }) {
  if (!active) return <House size={22} strokeWidth={1.6} />
  return (
    <svg width={22} height={22} viewBox="0 0 24 24">
      <path d="M12 2.5 1.8 11h2.7v10.5h15V11h2.7L12 2.5Z" fill="currentColor" />
      <rect x={9.6} y={14} width={4.8} height={7.5} fill="#fff" />
    </svg>
  )
}

function CameraTabIcon({ active }: { active: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
      {active ? (
        <>
          <rect x={2.5} y={4} width={19} height={16} rx={1.5} fill="currentColor" />
          <circle cx={12} cy={12} r={3.2} fill="#fff" stroke="none" />
          <circle cx={18} cy={7} r={0.9} fill="#fff" stroke="none" />
        </>
      ) : (
        <>
          <rect x={3} y={4.5} width={18} height={15} rx={1.5} />
          <circle cx={12} cy={12} r={3.6} />
          <circle cx={17.6} cy={7.6} r={0.6} fill="currentColor" />
        </>
      )}
    </svg>
  )
}

function HistoryTabIcon({ active }: { active: boolean }) {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
      <circle cx={12} cy={12} r={9.5} fill={active ? 'currentColor' : 'none'} />
      <path d="M12 6.5V12l3.5 3" stroke={active ? '#fff' : 'currentColor'} strokeWidth={2} />
    </svg>
  )
}

function SupportTabIcon({ active }: { active: boolean }) {
  if (!active) return <CircleHelp size={22} strokeWidth={1.6} />
  return (
    <svg width={22} height={22} viewBox="0 0 24 24">
      <circle cx={12} cy={12} r={10.5} fill="currentColor" />
      <path d="M9.4 9.2a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.3-2.6 3.9" fill="none" stroke="#fff" strokeWidth={2.2} strokeLinecap="round" />
      <circle cx={12} cy={17.4} r={1.3} fill="#fff" />
    </svg>
  )
}

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex flex-1 flex-col items-center gap-[3px] pt-[9px] ${isActive ? 'text-brand' : 'text-ink'}`

export function TabBar() {
  const homeActive = HOME_PATHS.includes(useLocation().pathname)
  const { t } = useI18n()
  return (
    <nav className="pb-safe shrink-0 border-t border-line bg-card">
      <div className="flex h-[58px] text-[13px] tracking-[0.02em]">
        <NavLink to="/" className={linkClass({ isActive: homeActive })}>
          <HomeTabIcon active={homeActive} />
          {t.tabs.home}
        </NavLink>
        <NavLink to="/cameras" className={linkClass}>
          {({ isActive }) => (
            <>
              <CameraTabIcon active={isActive} />
              {t.tabs.cameras}
            </>
          )}
        </NavLink>
        <NavLink to="/historique" className={linkClass}>
          {({ isActive }) => (
            <>
              <HistoryTabIcon active={isActive} />
              {t.tabs.history}
            </>
          )}
        </NavLink>
        <NavLink to="/support" className={linkClass}>
          {({ isActive }) => (
            <>
              <SupportTabIcon active={isActive} />
              {t.tabs.support}
            </>
          )}
        </NavLink>
        <span aria-disabled="true" className="flex flex-1 flex-col items-center gap-[3px] pt-[9px] text-ink opacity-40">
          <Ellipsis size={22} strokeWidth={2.4} />
          {t.tabs.more}
        </span>
      </div>
    </nav>
  )
}
