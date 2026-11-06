import { useState } from 'react'
import { SubPageHeader } from '../components/SubPageHeader'
import { useI18n } from '../i18n/I18nProvider'
import type { TimeStrings } from '../i18n/dictionaries'
import { clock, minutesAgo } from '../lib/time'
import livingImage from '../assets/camera-living-color.jpg'
import kitchenImage from '../assets/camera-kitchen.jpg'
import gardenImage from '../assets/camera-garden.jpg'
// Vidéo du 27 oct. découpée telle quelle dans la capture de l'app d'origine (icône vidéo et heure incluses).
import livingVideoImage from '../assets/gallery-living-video.jpg'

/** `baked` : l'icône vidéo et l'heure sont déjà dans l'image, on ne les superpose pas. */
type Media = { id: string; image: string; at: number; baked?: boolean }

/** Médias de la démo, datés à l'ouverture : trois photos il y a quelques minutes, une vidéo il y a 10 jours à 07:19. */
function createMedia(now: number): Media[] {
  const older = new Date(now)
  older.setDate(older.getDate() - 10)
  older.setHours(7, 19, 0, 0)
  return [
    { id: 'living', image: livingImage, at: minutesAgo(4, now) },
    { id: 'garden', image: gardenImage, at: minutesAgo(5, now) },
    { id: 'kitchen', image: kitchenImage, at: minutesAgo(8, now) },
    { id: 'living-video', image: livingVideoImage, at: older.getTime(), baked: true },
  ]
}

/** « AUJOURD'HUI », sinon « 27 OCT ». */
function sectionLabel(at: number, now: number, tt: TimeStrings) {
  const d = new Date(at)
  if (d.toDateString() === new Date(now).toDateString()) return tt.today
  return `${d.getDate()} ${tt.months[d.getMonth()]}`
}

/**
 * Caméras › Galerie : médias groupés par jour. Dans chaque jour, le premier média occupe toute la largeur,
 * les suivants vont par deux. Les vignettes sont inertes.
 */
export function Gallery() {
  const { t } = useI18n()
  const [now] = useState(Date.now)
  const groups: { label: string; items: Media[] }[] = []
  for (const item of createMedia(now)) {
    const label = sectionLabel(item.at, now, t.time)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }

  return (
    <div className="min-h-full pb-[16px]">
      <SubPageHeader title={t.cameras.galleryTitle} backTo="/cameras" tabs={false} />
      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="flex h-[36px] items-center border-b border-line bg-[#e6e6e6] px-[13px] text-[14px] font-medium tracking-[0.08em] text-ink uppercase">
            {group.label}
          </h2>
          <ul className="grid grid-cols-2 gap-[7px] p-[7px]">
            {group.items.map((item, i) => (
              <li key={item.id} className={i === 0 ? 'col-span-2' : ''}>
                <Thumbnail item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Thumbnail({ item }: { item: Media }) {
  return (
    <div className="relative overflow-hidden rounded-[8px] bg-black">
      <img src={item.image} alt="" draggable={false} className="block aspect-[832/571] w-full object-cover" />
      {!item.baked && (
        <span className="absolute top-[7px] right-[7px] rounded-[4px] bg-black px-[6px] py-[1px] text-[12px] text-white">{clock(item.at)}</span>
      )}
    </div>
  )
}
