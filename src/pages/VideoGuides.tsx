import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { SubPageHeader } from '../components/SubPageHeader'
import { ShieldCheck, ShieldHalf } from '../components/icons/Shields'
// Photos d'appareils découpées telles quelles dans la capture de l'app d'origine.
import keypad from '../assets/keypad.webp'
import outdoorKeypad from '../assets/outdoor-keypad.webp'
import keyfob from '../assets/keyfob.webp'

type CardId = keyof Dictionary['videoGuides']['cards']
type SectionId = keyof Dictionary['videoGuides']['sections']

const keypadImage = <img src={keypad} alt="" draggable={false} className="h-[83px] w-auto" />
const outdoorImage = <img src={outdoorKeypad} alt="" draggable={false} className="h-[83px] w-auto" />
const keyfobImage = <img src={keyfob} alt="" draggable={false} className="h-[83px] w-auto" />

const SECTIONS: { id: SectionId; moreInfo: boolean; cards: { id: CardId; visual: ReactNode }[] }[] = [
  {
    id: 'modes',
    moreInfo: false,
    cards: [
      { id: 'partial', visual: <ShieldHalf size={34} className="text-partial" /> },
      { id: 'total', visual: <ShieldCheck size={34} checkColor="#fff" className="text-vivid" /> },
    ],
  },
  {
    id: 'keypad',
    moreInfo: true,
    cards: [
      { id: 'keypadUnlock', visual: keypadImage },
      { id: 'keypadArm', visual: keypadImage },
    ],
  },
  {
    id: 'outdoor',
    moreInfo: true,
    cards: [
      { id: 'outdoorUnlock', visual: outdoorImage },
      { id: 'outdoorLock', visual: outdoorImage },
    ],
  },
  {
    id: 'keyfob',
    moreInfo: true,
    cards: [
      { id: 'keyfobDisarm', visual: keyfobImage },
      { id: 'keyfobPartial', visual: keyfobImage },
    ],
  },
]

/** Guides vidéo (depuis Support). Pas de vidéos dans la démo : cartes et « Afficher plus d'info » sont inertes. */
export function VideoGuides() {
  const { t } = useI18n()
  return (
    <div className="pb-[14px]">
      <SubPageHeader title={t.videoGuides.title} overline={t.support.title} backTo="/support" tabs={false} />
      {SECTIONS.map((section) => (
        <section key={section.id} className={`mt-[10px] ${section.moreInfo ? '' : 'mb-[18px]'}`}>
          <h2 className="px-[14px] text-[19px] font-medium text-ink">{t.videoGuides.sections[section.id]}</h2>
          <ul className="mt-[8px] grid grid-cols-2 items-start gap-[13px] px-[14px]">
            {section.cards.map((card) => {
              const [bold, rest] = t.videoGuides.cards[card.id]
              return (
                <li key={card.id} className="rounded-[5px] bg-card px-[7px] pt-[14px] pb-[7px] shadow-card">
                  <div className="flex h-[83px] items-center justify-center">{card.visual}</div>
                  <p className="mt-[10px] text-[15px] leading-[19px] text-ink">
                    <strong className="font-semibold">{bold}</strong> {rest}
                  </p>
                </li>
              )
            })}
          </ul>
          {section.moreInfo && (
            <p className="mt-[16px] mb-[26px] flex items-center gap-[10px] px-[10px] text-[16px] font-medium text-ink">
              {t.videoGuides.moreInfo}
              <ChevronRight size={22} strokeWidth={1.8} className="text-brand" />
            </p>
          )}
        </section>
      ))}
    </div>
  )
}
