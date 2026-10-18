import { useState } from 'react'
import { Link } from 'react-router'
import { Plus, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { SubPageHeader } from '../components/SubPageHeader'
// Illustration découpée telle quelle dans la capture de l'app d'origine (fond identique à celui de la page).
import heroImage from '../assets/routines-hero.jpg'
import { SUGGESTED_ROUTINES } from '../store/seed'

/**
 * Plus › Fonctionnalités › Routines. État vide : « Routines suggérées » ouvre la liste ; « + » ouvre un menu :
 * « Créer un rappel » ouvre son écran, « Créer une routine » est inerte dans la démo.
 */
export function Routines() {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  return (
    <div className="flex min-h-full flex-col">
      <SubPageHeader title={t.routines.title} backTo="/plus/fonctionnalites" tabs={false} />
      <img src={heroImage} alt="" draggable={false} className="mx-auto mt-[15px] w-[87%] max-w-[376px]" />
      <p className="mt-[18px] px-[16px] text-center text-[16px] leading-[24px] text-muted">{t.routines.intro}</p>

      {/* Menu ouvert : la barre passe au-dessus de l'en-tête (z-40). Le voile, positionné, recouvre la page et le bouton
          « Routines suggérées » (non positionné) ; le menu et le bouton fermer restent au-dessus du voile. */}
      <div className={`sticky bottom-0 mt-auto flex items-center gap-[16px] px-[16px] pt-[24px] pb-[16px] ${menuOpen ? 'z-40' : ''}`}>
        <Link
          to="/plus/fonctionnalites/routines/suggerees"
          className="flex h-[39px] flex-1 items-center justify-center gap-[17px] rounded-full border border-[#c8c8c8] bg-card shadow-[0_3px_8px_rgba(0,0,0,0.12)] active:bg-bg"
        >
          <span className="text-[14px] font-medium tracking-[0.08em] text-vivid">{t.routines.suggested}</span>
          <span className="flex h-[21px] w-[21px] items-center justify-center rounded-full bg-vivid text-[11px] font-semibold text-white">
            {SUGGESTED_ROUTINES.length}
          </span>
        </Link>
        {menuOpen && (
          <>
            {/* S'arrête au-dessus de la barre d'onglets (58 px + bordure + zone sûre), qui reste non voilée. */}
            <div
              onClick={close}
              className="animate-fade-in fixed inset-x-0 top-0 bottom-[calc(59px+env(safe-area-inset-bottom))] mx-auto max-w-[600px] bg-black/60"
            />
            <ul className="animate-fade-in absolute inset-x-[16px] bottom-[87px] overflow-hidden rounded-[8px] bg-card text-center text-[15px] font-medium tracking-[0.02em] text-vivid">
              <li onClick={close} className="flex h-[48px] cursor-pointer items-center justify-center">
                {t.routines.menu.createRoutine}
              </li>
              <li className="border-t border-line">
                <Link to="/plus/fonctionnalites/routines/rappel" className="flex h-[48px] items-center justify-center">
                  {t.routines.menu.createReminder}
                </Link>
              </li>
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? t.routines.closeMenu : t.routines.create}
          aria-expanded={menuOpen}
          className={`relative flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-full shadow-[0_3px_8px_rgba(0,0,0,0.2)] ${
            menuOpen ? 'bg-card text-vivid' : 'bg-vivid text-white active:brightness-90'
          }`}
        >
          {menuOpen ? <X size={28} strokeWidth={2.2} /> : <Plus size={28} strokeWidth={2.2} />}
        </button>
      </div>
    </div>
  )
}
