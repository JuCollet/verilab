import { Link } from 'react-router'
import { Plus } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { SubPageHeader } from '../components/SubPageHeader'
// Illustration découpée telle quelle dans la capture de l'app d'origine (fond identique à celui de la page).
import heroImage from '../assets/routines-hero.jpg'
import { SUGGESTED_ROUTINES } from '../store/seed'

/** Plus › Fonctionnalités › Routines. État vide : « Routines suggérées » ouvre la liste, « + » est inerte dans la démo. */
export function Routines() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-full flex-col">
      <SubPageHeader title={t.routines.title} backTo="/plus/fonctionnalites" tabs={false} />
      <img src={heroImage} alt="" draggable={false} className="mx-auto mt-[15px] w-[87%] max-w-[376px]" />
      <p className="mt-[18px] px-[16px] text-center text-[16px] leading-[24px] text-muted">{t.routines.intro}</p>

      <div className="sticky bottom-0 mt-auto flex items-center gap-[16px] px-[16px] pt-[24px] pb-[16px]">
        <Link
          to="/plus/fonctionnalites/routines/suggerees"
          className="flex h-[39px] flex-1 items-center justify-center gap-[17px] rounded-full border border-[#c8c8c8] bg-card shadow-[0_3px_8px_rgba(0,0,0,0.12)] active:bg-bg"
        >
          <span className="text-[14px] font-medium tracking-[0.08em] text-vivid">{t.routines.suggested}</span>
          <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full bg-vivid text-[11px] font-semibold text-white">
            {SUGGESTED_ROUTINES.length}
          </span>
        </Link>
        <span
          role="img"
          aria-label={t.routines.create}
          className="flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-full bg-vivid text-white shadow-[0_3px_8px_rgba(0,0,0,0.2)]"
        >
          <Plus size={28} strokeWidth={2.2} />
        </span>
      </div>
    </div>
  )
}
