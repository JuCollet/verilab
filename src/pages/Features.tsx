import { useRef, useState, type PointerEvent, type ReactNode } from 'react'
import { Link } from 'react-router'
import { Camera, LockKeyhole } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { SubPageHeader } from '../components/SubPageHeader'
// Illustrations découpées telles quelles dans les captures de l'app d'origine.
import routinesImage from '../assets/features-routines.jpg'
import smartImage from '../assets/features-smart.jpg'
import worksImage from '../assets/features-works.jpg'

type SlideId = keyof Dictionary['features']['slides']
type ItemId = keyof Dictionary['features']['items']
type TileId = keyof Dictionary['features']['activeTiles']

const ROUTINES_PATH = '/plus/fonctionnalites/routines'

/**
 * `imageRight` : l'illustration est à droite du texte (2e carte, comme dans l'app).
 * `cover` : l'image remplit la hauteur quitte à être rognée (bords colorés) ; sinon elle est affichée en entier,
 * son fond blanc se fondant dans la carte quand le texte rend la carte plus haute que l'image.
 */
const SLIDES: { id: SlideId; image: string; imageRight?: boolean; cover?: boolean; to?: string }[] = [
  { id: 'routines', image: routinesImage, to: ROUTINES_PATH },
  { id: 'smartButtons', image: smartImage, imageRight: true, cover: true },
  { id: 'worksWith', image: worksImage },
]

const ITEMS: { id: ItemId; icon: ReactNode; to?: string }[] = [
  { id: 'routines', icon: <RoutinesIcon />, to: ROUTINES_PATH },
  { id: 'smartButtons', icon: <SmartButtonIcon /> },
  { id: 'worksWith', icon: <WorksWithIcon /> },
]

const TILE_ICON = { size: 22, strokeWidth: 1.6 }

const TILES: { id: TileId; icon: ReactNode }[] = [
  { id: 'home', icon: <AtHomeIcon /> },
  { id: 'climate', icon: <ThermometerIcon /> },
  { id: 'doorsWindows', icon: <DoorDotIcon /> },
  { id: 'cameras', icon: <Camera {...TILE_ICON} /> },
  { id: 'smartlock', icon: <LockKeyhole {...TILE_ICON} /> },
  { id: 'smoke', icon: <SmokeIcon /> },
]

/**
 * Plus › Fonctionnalités. Carrousel défilant ; « Routines » (carte du carrousel et de la liste) ouvre son écran,
 * les autres cartes, les boutons « + » et les tuiles actives sont inertes dans la démo.
 */
export function Features() {
  const { t } = useI18n()
  return (
    <div className="pb-[24px]">
      <SubPageHeader title={t.features.title} backTo="/plus" tabs={false} />
      <Carousel />

      <section className="mt-[30px] px-[16px]">
        <h2 className="px-[8px] text-[19px] text-ink">{t.features.ready}</h2>
        <p className="mt-[14px] px-[8px] text-[15px] leading-[22px] text-ink">{t.features.readyHint}</p>
        <ul className="mt-[16px] flex flex-col gap-[8px]">
          {ITEMS.map(({ id, icon, to }) => {
            const [title, description] = t.features.items[id]
            const className = 'flex min-h-[78px] items-start gap-[14px] rounded-[5px] bg-card py-[12px] pr-[16px] pl-[18px] shadow-card'
            const content = (
              <>
                <span className="mt-[3px] shrink-0 text-ink">{icon}</span>
                <div className="flex-1">
                  <h3 className="text-[15px] leading-[19px] font-medium text-ink">{title}</h3>
                  <p className="mt-[1px] text-[13px] leading-[16px] tracking-[0.02em] text-ink">{description}</p>
                </div>
                <PlusBadge />
              </>
            )
            return (
              <li key={id}>
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
      </section>

      <section className="mt-[26px] px-[16px]">
        <h2 className="px-[8px] text-[19px] text-ink">{t.features.active}</h2>
        <ul className="mt-[14px] grid grid-cols-3 gap-[8px]">
          {TILES.map(({ id, icon }) => (
            <li key={id} className="flex min-h-[110px] flex-col items-center gap-[10px] rounded-[5px] bg-card px-[6px] pt-[20px] pb-[14px] shadow-card">
              <span className="flex h-[24px] items-center text-ink">{icon}</span>
              <span className="text-center text-[15px] leading-[17px] text-ink">{t.features.activeTiles[id]}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

/** Seuil (px) au-delà duquel un glisser passe à la carte suivante / précédente, et annule le clic. */
const SWIPE_THRESHOLD = 40
const CLICK_TOLERANCE = 5

/**
 * Cartes défilantes, une à la fois : chaque carte est un point d'arrêt (scroll-snap). Au doigt, défilement natif ;
 * à la souris, on peut aussi faire glisser le carrousel, qui s'aimante sur la carte suivante ou précédente au relâcher.
 */
function Carousel() {
  const { t } = useI18n()
  const scroller = useRef<HTMLUListElement>(null)
  const [active, setActive] = useState(0)
  const drag = useRef<{ x: number; scrollLeft: number; from: number; moved: boolean } | null>(null)

  /** Position de défilement qui aligne chaque carte sur la marge gauche (bornée à la fin du carrousel). */
  const stops = () => {
    const el = scroller.current!
    const cards = [...el.children] as HTMLElement[]
    const max = el.scrollWidth - el.clientWidth
    return cards.map((card) => Math.min(max, card.offsetLeft - cards[0].offsetLeft))
  }

  const nearest = (left: number) => {
    const positions = stops()
    return positions.reduce((best, pos, i) => (Math.abs(pos - left) < Math.abs(positions[best] - left) ? i : best), 0)
  }

  const onScroll = () => {
    if (scroller.current) setActive(nearest(scroller.current.scrollLeft))
  }

  const goTo = (index: number) => {
    const el = scroller.current
    if (el) el.scrollTo({ left: stops()[index], behavior: 'smooth' })
  }

  const onPointerDown = (e: PointerEvent) => {
    const el = scroller.current
    if (e.pointerType !== 'mouse' || e.button !== 0 || !el) return
    drag.current = { x: e.clientX, scrollLeft: el.scrollLeft, from: nearest(el.scrollLeft), moved: false }
    // L'aimantation est coupée pendant le glisser, sinon le navigateur ramène la carte à chaque mouvement.
    el.style.scrollSnapType = 'none'
  }

  const onPointerMove = (e: PointerEvent) => {
    const el = scroller.current
    if (!drag.current || !el) return
    const dx = e.clientX - drag.current.x
    // Capture seulement une fois le glisser engagé : capturer dès l'appui détournerait le clic vers la liste.
    if (!drag.current.moved && Math.abs(dx) > CLICK_TOLERANCE) {
      drag.current.moved = true
      el.setPointerCapture(e.pointerId)
    }
    el.scrollLeft = drag.current.scrollLeft - dx
  }

  const endDrag = (e: PointerEvent) => {
    const el = scroller.current
    const state = drag.current
    if (!state || !el) return
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId)
    const dx = e.clientX - state.x
    const step = dx < -SWIPE_THRESHOLD ? 1 : dx > SWIPE_THRESHOLD ? -1 : 0
    const target = stops()[Math.max(0, Math.min(SLIDES.length - 1, state.from + step))]
    el.scrollTo({ left: target, behavior: 'smooth' })
    // Réactive l'aimantation une fois la carte atteinte (pas sur `scrollend` : les défilements du glisser
    // en émettent aussi, ce qui la réactivait trop tôt et ramenait la carte en arrière).
    const startedAt = performance.now()
    const waitForTarget = () => {
      if (drag.current && drag.current !== state) return // un nouveau glisser a commencé
      if (Math.abs(el.scrollLeft - target) < 1 || performance.now() - startedAt > 800) el.style.scrollSnapType = ''
      else requestAnimationFrame(waitForTarget)
    }
    requestAnimationFrame(waitForTarget)
    // Le clic qui suit un glisser ne doit pas ouvrir la carte.
    if (!state.moved) drag.current = null
    else setTimeout(() => (drag.current = null))
  }

  return (
    <>
      <ul
        ref={scroller}
        onScroll={onScroll}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (drag.current?.moved) e.preventDefault()
        }}
        className="mt-[32px] flex cursor-grab snap-x snap-mandatory gap-[16px] overflow-x-auto scroll-px-[31px] px-[31px] pb-[6px] select-none active:cursor-grabbing [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map(({ id, image, imageRight, cover, to }) => {
          const [title, text] = t.features.slides[id]
          const content = (
            <>
              <img
                src={image}
                alt=""
                draggable={false}
                className={`w-[47%] shrink-0 self-stretch ${cover ? 'object-cover' : 'object-contain'} ${imageRight ? 'order-last' : ''}`}
              />
              <div className={`flex-1 pt-[18px] pb-[14px] ${imageRight ? 'pr-[8px] pl-[16px]' : 'pr-[12px] pl-[8px]'}`}>
                <h3 className="text-[14px] font-medium text-ink">{title}</h3>
                <p className="mt-[6px] text-[12px] leading-[17px] text-ink">{text}</p>
              </div>
            </>
          )
          return (
            <li key={id} className="flex min-h-[172px] w-[calc(100%-62px)] max-w-[420px] shrink-0 snap-start snap-always overflow-hidden rounded-[5px] bg-card shadow-card">
              {to ? (
                <Link to={to} draggable={false} className="flex w-full">
                  {content}
                </Link>
              ) : (
                content
              )}
            </li>
          )
        })}
      </ul>
      <div className="mt-[8px] flex justify-center">
        {SLIDES.map(({ id }, i) => (
          <button
            key={id}
            type="button"
            aria-label={t.features.slides[id][0]}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className="p-[10px]"
          >
            <span className={`block h-[8px] w-[8px] rounded-full transition-colors ${i === active ? 'bg-vivid' : 'bg-[#6e6e6e]'}`} />
          </button>
        ))}
      </div>
    </>
  )
}

function PlusBadge() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" className="mt-[1px] shrink-0">
      <circle cx={10} cy={10} r={10} className="fill-vivid" />
      <path d="M10 5v10M5 10h10" stroke="#fff" strokeWidth={1.8} />
    </svg>
  )
}

/* Icônes de la liste « Prêt pour l'activation » (trait noir, dessinées d'après la capture). */

function RoutinesIcon() {
  return (
    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round">
      <path d="M6 13.5A15 15 0 1 1 4 19" />
      <path d="M5.5 6.5v7h7" strokeLinejoin="round" />
      <g fill="currentColor" stroke="none">
        <circle cx={19} cy={19} r={5.6} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <rect key={angle} x={17.4} y={10.6} width={3.2} height={3.6} rx={0.6} transform={`rotate(${angle} 19 19)`} />
        ))}
      </g>
      <circle cx={19} cy={19} r={2.2} fill="#fff" stroke="none" />
    </svg>
  )
}

function SmartButtonIcon() {
  return (
    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round">
      <path d="M14 30H5.5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h27a2 2 0 0 1 2 2v14" />
      <path d="M19.5 16a5.5 5.5 0 0 1 9.4 3.9" strokeLinecap="round" />
      <path d="M23 19.5a1.8 1.8 0 0 1 3.6 0v6l4.2.8a2.4 2.4 0 0 1 1.9 2.7l-.9 5H21.5l-4.4-5.4a1.8 1.8 0 0 1 2.7-2.4l3.2 2.8Z" />
    </svg>
  )
}

function WorksWithIcon() {
  return (
    <svg width={38} height={38} viewBox="0 0 38 38" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round">
      <circle cx={19} cy={7} r={3.4} />
      <circle cx={6.5} cy={28} r={3.4} />
      <circle cx={31.5} cy={28} r={3.4} />
      <path d="M12 9.5A13 13 0 0 0 5.6 21M26 9.5a13 13 0 0 1 6.4 11.5M11.5 33.4a13 13 0 0 0 15 0" strokeLinecap="round" />
      <path d="M19 14.5 25 17v4.4c0 3.6-2.6 6.2-6 7.6-3.4-1.4-6-4-6-7.6V17Z" />
      <path d="m16.4 21.3 2 2 4-4" strokeLinecap="round" />
    </svg>
  )
}

/* Icônes des tuiles « Actuellement actif ». */

function AtHomeIcon() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <path d="M3.5 10.5 12 3l8.5 7.5V21h-17Z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
      <circle cx={12} cy={12.4} r={2.4} className="fill-vivid" />
      <path d="M7.5 21v-1.6a3.4 3.4 0 0 1 3.4-3.4h2.2a3.4 3.4 0 0 1 3.4 3.4V21Z" className="fill-vivid" />
    </svg>
  )
}

function ThermometerIcon() {
  return (
    <svg width={22} height={24} viewBox="0 0 22 24" fill="none">
      <path d="M8.5 14.5V4a2.5 2.5 0 0 1 5 0v10.5a4.5 4.5 0 1 1-5 0Z" stroke="currentColor" strokeWidth={1.6} />
      <circle cx={11} cy={18} r={2.4} className="fill-vivid" />
      <path d="M11 8.5v9" strokeWidth={2} className="stroke-vivid" strokeLinecap="round" />
    </svg>
  )
}

function DoorDotIcon() {
  return (
    <svg width={20} height={24} viewBox="0 0 20 24" fill="none">
      <rect x={3.5} y={2} width={13} height={20} rx={0.8} stroke="currentColor" strokeWidth={1.6} />
      <circle cx={7} cy={12.5} r={1.1} className="fill-vivid" />
    </svg>
  )
}

function SmokeIcon() {
  return (
    <svg width={24} height={22} viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
      <path d="M3 3.5h18" />
      <path d="M5 3.5v1.5a7 3 0 0 0 14 0V3.5" />
      <path d="M9 12.5c-1.2 1.5 1.2 2.5 0 4s1.2 2.5 0 4" className="stroke-vivid" />
      <path d="M15 12.5c-1.2 1.5 1.2 2.5 0 4s1.2 2.5 0 4" className="stroke-vivid" />
    </svg>
  )
}
