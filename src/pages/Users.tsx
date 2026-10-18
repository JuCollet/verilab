import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { ChevronLeft, ChevronRight, CirclePlus } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useDemo } from '../store/demoStore'
import type { AccessItem, SystemUser } from '../store/seed'
import { initials } from '../lib/initials'

/**
 * Plus › Compte et utilisateurs. Seul « Ajouter un utilisateur » est actif ; les autres lignes et chevrons sont inertes.
 * La liste vient du store : un utilisateur ajouté y reste le temps de la session.
 */
export function Users() {
  const { t } = useI18n()
  const { users, emergencyContacts } = useDemo()
  // Écran partagé entre Plus › Compte et utilisateurs et Support : le retour ramène à l'écran d'origine.
  const backTo = (useLocation().state as { from?: string } | null)?.from ?? '/plus/compte'
  return (
    <div className="pb-[10px]">
      <div className="pt-safe sticky top-0 z-20 bg-card">
        <header className="flex h-[40px] items-center border-b border-line">
          <Link to={backTo} aria-label={t.common.back} className="ml-[9px] p-1 text-brand">
            <ChevronLeft size={26} strokeWidth={1.8} />
          </Link>
        </header>
      </div>
      <div className="flex h-[48px] items-center justify-between px-[7px]">
        <h1 className="text-[20px] text-ink">{t.users.title}</h1>
        <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#222] text-[11px] font-semibold text-white">?</span>
      </div>

      <Link to="/plus/utilisateurs/ajouter" state={{ from: backTo }} className="block">
        <Row className="mx-[7px] h-[41px] rounded-[5px] bg-card pl-[14px] shadow-card">
          <CirclePlus size={18} strokeWidth={1.5} className="mr-[11px] text-ink" />
          <span className="flex-1 text-[16px] text-ink">{t.users.add}</span>
        </Row>
      </Link>

      <Row className="mx-[7px] mt-[13px] rounded-[5px] bg-card py-[10px] pl-[14px] shadow-card">
        <div className="flex-1">
          <p className="text-[16px] text-ink">{t.users.emergencyContacts}</p>
          <p className="mt-[4px] text-[14px] text-muted">{t.users.emergencyCount(emergencyContacts)}</p>
        </div>
      </Row>

      <ul className="mt-[13px]">
        {users.map((user, i) => (
          <UserCard key={i} user={user} />
        ))}
      </ul>
    </div>
  )
}

function UserCard({ user }: { user: SystemUser }) {
  const { t } = useI18n()
  const notifications = user.notifications.length
    ? user.notifications.map((channel) => t.users.channels[channel]).join(', ')
    : t.users.none
  return (
    <li className="mx-[7px] mb-[7px] rounded-[5px] bg-card shadow-card">
      <div className="pt-[7px] pb-[10px] pl-[14px]">
        <Row>
          <span className="mr-[13px] flex h-[20px] w-[20px] shrink-0 items-center justify-center self-start rounded-full bg-[#d4d4d4] text-[9px] text-brand">
            {initials(user.name)}
          </span>
          <div className="flex-1">
            <p className="text-[16px] leading-[19px] text-ink">{user.name}</p>
            <p className="text-[15px] leading-[18px] text-muted">{t.users.roles[user.role]}</p>
          </div>
        </Row>
        <p className="mt-[8px] text-[15px] text-ink">{t.users.contactTitle}</p>
        <p className="mt-[3px] pr-[14px] text-[15px] leading-[20px] text-muted">
          {user.contactRoles.length
            ? user.contactRoles.map((role) => t.users.contactRoles[role]).join(', ')
            : t.users.none}
        </p>
      </div>
      <Row className="h-[35px] border-t border-line pl-[14px]">
        <span className="flex-1 text-[15px] text-ink">{t.users.codes}</span>
        <span className="flex items-center gap-[10px]">
          {user.access.map((item) => (
            <AccessIcon key={item} item={item} />
          ))}
        </span>
      </Row>
      <Row className="h-[35px] border-t border-line pl-[14px]">
        <span className="flex-1 text-[15px] text-ink">{t.users.notifications}</span>
        <span className="text-[15px] text-muted">{notifications}</span>
      </Row>
    </li>
  )
}

/** Ligne avec chevron rouge à droite. */
function Row({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`flex items-center pr-[10px] ${className}`}>
      {children}
      <ChevronRight size={22} strokeWidth={1.8} className="ml-[8px] shrink-0 text-brand" />
    </div>
  )
}

function AccessIcon({ item }: { item: AccessItem }) {
  switch (item) {
    case 'code':
      return (
        <svg width={16} height={20} viewBox="0 0 16 20" fill="#222">
          <path d="M7 1h2l-.3 4.3 3.7-2.1 1 1.7-3.8 1.9 3.8 1.9-1 1.7-3.7-2.1L9 12.6H7l.3-4.3-3.7 2.1-1-1.7 3.8-1.9-3.8-1.9 1-1.7 3.7 2.1Z" />
          <circle cx={3} cy={17.5} r={1.4} />
          <circle cx={8} cy={17.5} r={1.4} />
          <circle cx={13} cy={17.5} r={1.4} />
        </svg>
      )
    case 'tagGreen':
    case 'tagPink': {
      const color = item === 'tagGreen' ? '#4ec69e' : '#f5abc8'
      return (
        <svg width={18} height={18} viewBox="0 0 24 24">
          <circle cx={12} cy={12} r={10.5} fill="none" stroke={color} strokeWidth={1.8} />
          <path d="M12.00 5.80 L14.29 9.24 L18.28 10.36 L15.71 13.61 L15.88 17.74 L12.00 16.30 L8.12 17.74 L8.29 13.61 L5.72 10.36 L9.71 9.24Z" fill={color} stroke={color} strokeWidth={2.2} strokeLinejoin="round" />
        </svg>
      )
    }
    case 'keyfob':
      return (
        <svg width={18} height={20} viewBox="0 0 24 26" fill="none" stroke="#222" strokeWidth={1.6}>
          <circle cx={12} cy={11} r={9.5} />
          <circle cx={12} cy={7} r={1.8} />
          <circle cx={8.6} cy={12.4} r={1.8} />
          <circle cx={15.4} cy={12.4} r={1.8} />
          <circle cx={12} cy={22.5} r={1.8} />
        </svg>
      )
    case 'starkey':
      return (
        <svg width={16} height={20} viewBox="0 0 20 26" fill="none" stroke="#7a5532" strokeWidth={1.5}>
          <path d="M6.5 4a5 5 0 0 1 7 0M4.5 2a8 8 0 0 1 11 0" strokeLinecap="round" />
          <circle cx={10} cy={6.5} r={1} fill="#7a5532" stroke="none" />
          <circle cx={10} cy={16.5} r={8} />
          <path d="M10 12.3c.6 0 1 1.3 1.5 1.7.5.4 2 .3 2.1.9.2.5-1 1.4-1.2 2-.2.6.4 2-.1 2.3-.5.3-1.6-.6-2.3-.6s-1.8.9-2.3.6c-.5-.3.1-1.7-.1-2.3-.2-.6-1.4-1.5-1.2-2 .1-.6 1.6-.5 2.1-.9.5-.4.9-1.7 1.5-1.7Z" />
        </svg>
      )
  }
}
