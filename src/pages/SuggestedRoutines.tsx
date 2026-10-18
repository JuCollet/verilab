import { useI18n } from '../i18n/I18nProvider'
import { SubPageHeader } from '../components/SubPageHeader'
import { SUGGESTED_ROUTINES } from '../store/seed'
// Bandeaux découpés tels quels dans la capture de l'app d'origine (la pastille « Nouveau » y est incrustée :
// on la recouvre par la nôtre, traduite, à la même position).
import nightImage from '../assets/routine-night.jpg'
import morningImage from '../assets/routine-morning.jpg'

const IMAGES: Record<(typeof SUGGESTED_ROUTINES)[number], string> = {
  goodNight: nightImage,
  goodMorning: morningImage,
}

/** Plus › Fonctionnalités › Routines › Routines suggérées. « Utiliser la routine suggérée » est inerte dans la démo. */
export function SuggestedRoutines() {
  const { t } = useI18n()
  return (
    <div className="pb-[16px]">
      <SubPageHeader title={t.routines.suggestedTitle} backTo="/plus/fonctionnalites/routines" tabs={false} />
      <ul className="mt-[9px] flex flex-col gap-[8px] px-[8px]">
        {SUGGESTED_ROUTINES.map((id) => {
          const [title, description] = t.routines.suggestions[id]
          return (
            <li key={id} className="overflow-hidden rounded-[8px] bg-card shadow-card">
              <div className="relative">
                <img src={IMAGES[id]} alt="" draggable={false} className="block aspect-[832/164] w-full object-cover" />
                {/* Même emprise que la pastille incrustée (x 16-147, y 17-59 sur 832 × 164 px), quelle que soit la largeur. */}
                <span className="absolute top-[9%] left-[1.6%] flex h-[27%] min-w-[16.3%] items-center justify-center rounded-full bg-vivid px-[8px] text-[11px] text-white">
                  {t.routines.new}
                </span>
              </div>
              <h2 className="mt-[12px] px-[16px] text-center text-[16px] text-ink">{title}</h2>
              <p className="mt-[8px] px-[24px] pb-[11px] text-center text-[15px] leading-[23px] text-muted">{description}</p>
              <span className="flex h-[41px] items-center justify-center border-t border-line text-[15px] tracking-[0.02em] text-vivid">
                {t.routines.use}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
