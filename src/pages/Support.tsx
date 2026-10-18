import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Bell, MessageCircleMore, PaintbrushVertical, Smartphone } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { PageTitle } from '../components/PageTitle'
import { ShieldHalf } from '../components/icons/Shields'

type CardId = keyof Dictionary['support']['cards']
type SectionId = keyof Dictionary['support']['sections']

const ICON = { size: 24, strokeWidth: 1.7 }

const SECTIONS: { id: SectionId; cards: { id: CardId; icon: ReactNode; highlight?: boolean; to?: string }[] }[] = [
  {
    id: 'diy',
    cards: [
      { id: 'batteries', icon: <BatteryCycleIcon /> },
      { id: 'renovate', icon: <PaintbrushVertical {...ICON} /> },
    ],
  },
  {
    id: 'data',
    cards: [
      { id: 'account', icon: <Smartphone {...ICON} /> },
      { id: 'passwords', icon: <MessageCircleMore {...ICON} /> },
    ],
  },
  {
    id: 'alarm',
    cards: [
      { id: 'users', icon: <Bell {...ICON} />, to: '/plus/utilisateurs' },
      { id: 'partial', icon: <ShieldHalf size={24} /> },
    ],
  },
  {
    id: 'help',
    cards: [
      { id: 'chat', icon: <ChatIcon />, highlight: true },
      { id: 'videos', icon: <VideoIcon />, to: '/support/guides-video' },
    ],
  },
]

/**
 * Écran Support : rangées de cartes défilant horizontalement. « Utilisateurs » et « Guides vidéo » ouvrent un écran ;
 * les autres sont inertes.
 * Contrairement à l'original, les textes ne sont jamais tronqués : les cartes d'une rangée s'agrandissent ensemble.
 */
export function Support() {
  const { t } = useI18n()
  return (
    <div className="pb-[16px]">
      <PageTitle title={t.support.title} />
      {SECTIONS.map((section) => (
        <section key={section.id} className="mt-[13px]">
          <h2 className="px-[14px] text-[16px] font-medium text-ink">{t.support.sections[section.id]}</h2>
          <ul className="mt-[7px] flex snap-x snap-mandatory gap-[7px] overflow-x-auto scroll-px-[14px] px-[14px] pb-[6px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {section.cards.map((card) => {
              const [title, description] = t.support.cards[card.id]
              const className = `flex h-full flex-col rounded-[5px] px-[7px] pt-[8px] pb-[10px] shadow-card ${
                card.highlight ? 'bg-vivid text-white' : 'bg-card text-ink'
              }`
              const content = (
                <>
                  <span className={card.highlight ? 'text-white' : 'text-vivid'}>{card.icon}</span>
                  <h3 className="mt-[6px] text-[16px] leading-[20px] font-medium">{title}</h3>
                  <p className="mt-[3px] text-[15px] leading-[17px]">{description}</p>
                </>
              )
              return (
                <li key={card.id} className="min-h-[114px] w-[206px] shrink-0 snap-start">
                  {card.to ? (
                    <Link to={card.to} state={{ from: '/support' }} className={`${className} active:bg-bg`}>
                      {content}
                    </Link>
                  ) : (
                    <div className={className}>{content}</div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

function BatteryCycleIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 9.5A8 8 0 0 0 5.4 6.6" />
      <path d="M18.8 4.5v4.9h-4.9" />
      <path d="M4.5 14.5a8 8 0 0 0 14.1 2.9" />
      <path d="M5.2 19.5v-4.9h4.9" />
      <rect x={9.6} y={7.8} width={4.8} height={8.4} rx={0.6} strokeWidth={1.4} />
      <path d="M11 7.8V6.8h2v1" strokeWidth={1.4} />
      <path d="M12 10.2v2.6" strokeWidth={1.5} />
      <circle cx={12} cy={14.4} r={0.5} fill="currentColor" stroke="none" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <path d="M7.9 20.5A9 9 0 1 0 3.6 16.2L2.5 21.5Z" />
      <path d="M8 9.5h8M8 12h8M8 14.5h8" />
    </svg>
  )
}

function VideoIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
      <rect x={2.5} y={5} width={19} height={14} rx={1} />
      <path d="M10 9v6l5-3z" fill="currentColor" />
    </svg>
  )
}
