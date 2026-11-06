import { useState } from 'react'
import { Link } from 'react-router'
import { ArrowRight, Clock3, LockKeyhole, Plus, Settings, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { SubPageHeader } from '../components/SubPageHeader'
import { useDemo } from '../store/demoStore'
import type { Routine } from '../store/routines'
import { ALARM_TARGETS, daysLabel, formatTime } from './CreateRoutine'
// Illustration découpée telle quelle dans la capture de l'app d'origine (fond identique à celui de la page).
import heroImage from '../assets/routines-hero.jpg'
import { SUGGESTED_ROUTINES } from '../store/seed'

/**
 * Plus › Fonctionnalités › Routines. Sans routine : illustration et texte d'intro ; sinon, une carte par routine créée.
 * « Routines suggérées » ouvre la liste ; « + » ouvre un menu : « Créer une routine » et « Créer un rappel » ouvrent
 * leur écran.
 */
export function Routines() {
  const { t } = useI18n()
  const { routines } = useDemo()
  const [menuOpen, setMenuOpen] = useState(false)
  const close = () => setMenuOpen(false)
  return (
    <div className="flex min-h-full flex-col">
      <SubPageHeader title={t.routines.title} backTo="/plus/fonctionnalites" tabs={false} />
      {routines.length === 0 ? (
        <>
          <img src={heroImage} alt="" draggable={false} className="mx-auto mt-[15px] w-[87%] max-w-[376px]" />
          <p className="mt-[18px] px-[16px] text-center text-[16px] leading-[24px] text-muted">{t.routines.intro}</p>
        </>
      ) : (
        <ul className="flex flex-col gap-[8px] px-[8px] pt-[8px]">
          {routines.map((routine) => (
            <RoutineCard key={routine.id} routine={routine} />
          ))}
        </ul>
      )}

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
              <li>
                <Link to="/plus/fonctionnalites/routines/nouvelle" className="flex h-[48px] items-center justify-center">
                  {t.routines.menu.createRoutine}
                </Link>
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

/**
 * Carte d'une routine créée : bandeau bleu (déclencheur → actions, réglages inertes), puis l'action d'alarme,
 * celle de verrouillage et l'horaire, avec l'interrupteur qui active ou suspend la routine.
 */
function RoutineCard({ routine }: { routine: Routine }) {
  const { t } = useI18n()
  const { toggleRoutine } = useDemo()
  const alarm = routine.actions.find((a) => a.kind === 'alarm')
  const lock = routine.actions.some((a) => a.kind === 'lock')
  const mode = alarm?.kind === 'alarm' ? { disarm: t.alarm.off, partial: t.alarm.partial, total: t.alarm.total }[alarm.target] : null
  const alarmIcon = alarm?.kind === 'alarm' ? ALARM_TARGETS.find((a) => a.id === alarm.target)?.icon : null
  return (
    <li className="overflow-hidden rounded-[8px] bg-card shadow-card">
      <div className="relative flex h-[62px] items-center justify-center bg-[#007dc5] text-ink">
        <RoutineWaves />
        <div className="relative flex items-center gap-[12px]">
          <Clock3 size={20} strokeWidth={1.6} />
          <ArrowRight size={18} strokeWidth={2} />
          {alarmIcon}
          {lock && <LockKeyhole size={20} strokeWidth={1.6} />}
        </div>
        <span aria-label={t.routines.settings} role="img" className="absolute right-[12px] text-ink">
          <Settings size={20} strokeWidth={1.5} />
        </span>
      </div>
      <div className="relative px-[72px] pt-[12px] pb-[18px] text-center">
        {mode && <p className="text-[16px] leading-[27px] font-medium text-ink">{mode}</p>}
        {lock && <p className="text-[16px] leading-[27px] font-medium text-ink">{t.createRoutine.lockSummary}</p>}
        <p className="text-[16px] leading-[27px] text-ink">
          {formatTime(routine.trigger.time)} {daysLabel(routine.trigger.days, t)}
        </p>
        <button
          type="button"
          role="switch"
          aria-checked={routine.enabled}
          aria-label={t.routines.toggle(routine.name)}
          onClick={() => toggleRoutine(routine.id)}
          className={`absolute top-[12px] right-[18px] flex h-[29px] w-[47px] items-center rounded-full p-[3px] transition-colors ${
            routine.enabled ? 'bg-[#1e8a3c]' : 'bg-[#c8c8c8]'
          }`}
        >
          <span className={`h-[23px] w-[23px] rounded-full bg-white shadow transition-transform ${routine.enabled ? 'translate-x-[18px]' : ''}`} />
        </button>
      </div>
    </li>
  )
}

/** Formes plus sombres du bandeau bleu (d'après la capture). */
function RoutineWaves() {
  return (
    <svg aria-hidden className="absolute inset-0 h-full w-full" viewBox="0 0 400 62" preserveAspectRatio="none">
      <path d="M0 22c18-6 32 2 42 16s30 22 60 24H0Z" fill="#2a6aa6" />
      <path d="M270 0c22 6 50 6 70 2s32 12 40 30 14 26 20 30V0Z" fill="#2a6aa6" />
    </svg>
  )
}
