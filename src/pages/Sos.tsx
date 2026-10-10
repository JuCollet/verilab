import { Link } from 'react-router'
import { MapPin } from 'lucide-react'
import { HOME_ADDRESS } from '../store/seed'

function HomeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round">
      <path d="M7 3.5h3.5V6" />
      <path d="M3 10.5 6 6h12l3 4.5" />
      <path d="M2.5 10.5h19" />
      <path d="M4 10.5v10h16v-10" />
      <rect x={6.5} y={13.5} width={4} height={7} />
      <rect x={12.5} y={13.5} width={5} height={4} />
      <path d="M15 13.5v4" />
    </svg>
  )
}

/** Choix du lieu de l'urgence. Les deux options sont inertes : dans l'app réelle elles déclenchent une alerte. */
export function Sos() {
  const options = [
    { label: HOME_ADDRESS, icon: <HomeIcon /> },
    { label: 'Autre localisation', icon: <MapPin size={20} strokeWidth={1.5} /> },
  ]
  return (
    <div className="pt-safe pb-safe mx-auto flex h-dvh max-w-[600px] flex-col bg-card">
      <div className="flex h-[58px] shrink-0 items-end px-[14px] pb-[13px]">
        <Link to="/" replace className="text-[14px] font-medium tracking-[0.01em] text-brand">
          ANNULER
        </Link>
      </div>
      <div className="flex-1" />
      <div className="flex flex-col items-center px-[14px] text-center">
        <h1 className="text-[16px] font-medium text-muted">Deux étapes pour envoyer un SOS</h1>
        <p className="mt-[8px] text-[16px] leading-[21px] text-muted">Appuyez sur Annuler si vous n'essayez pas d'envoyer un SOS</p>
        <h2 className="mt-[16px] text-[24px] font-medium text-ink">Où est l'urgence ?</h2>
        <ul className="mt-[22px] flex w-full flex-col gap-[14px]">
          {options.map(({ label, icon }) => (
            <li key={label} className="flex h-[49px] items-center rounded-[4px] border-2 border-line text-ink">
              <span className="flex w-[66px] shrink-0 justify-center">{icon}</span>
              <span className="text-[16px]">{label}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1" />
    </div>
  )
}
