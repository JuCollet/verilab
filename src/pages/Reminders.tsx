import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { Bell, ChevronDown, ChevronRight, Clock3, LockKeyholeOpen, Pencil } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { SubPageHeader } from '../components/SubPageHeader'
import { ShieldHalf, ShieldOff } from '../components/icons/Shields'

type Kind = keyof Dictionary['reminders']['options']

const BASE = '/plus/fonctionnalites/routines/rappel'

/** Types de rappel, dans l'ordre de la liste ; `slug` = segment d'URL de l'écran de détail. */
const KINDS: { kind: Kind; slug: string; icon: ReactNode }[] = [
  { kind: 'off', slug: 'toujours-desactive', icon: <ShieldOff size={20} /> },
  { kind: 'on', slug: 'toujours-active', icon: <ShieldHalf size={20} /> },
  { kind: 'unlocked', slug: 'deverrouille', icon: <LockKeyholeOpen size={20} strokeWidth={1.6} /> },
]

/** Routines › « + » › Créer un rappel : choix du type. Chaque type ouvre son écran ; « Afficher plus d'info » est inerte. */
export function Reminders() {
  const { t } = useI18n()
  return (
    <div>
      <header className="pt-safe sticky top-0 z-20 bg-bg">
        <div className="relative flex h-[48px] items-end justify-center border-b border-line pb-[10px]">
          <Link to="/plus/fonctionnalites/routines" className="absolute bottom-[10px] left-[16px] text-[14px] font-medium text-vivid">
            {t.common.cancel}
          </Link>
          <h1 className="text-[16px] font-medium text-ink">{t.reminders.title}</h1>
        </div>
      </header>

      <ul className="bg-card">
        {KINDS.map(({ kind, slug, icon }) => {
          const [title, description] = t.reminders.options[kind]
          return (
            <li key={kind} className="border-b border-line">
              <Link to={`${BASE}/${slug}`} className="flex min-h-[104px] items-center gap-[13px] py-[16px] pr-[16px] pl-[12px] active:bg-bg">
                <span className="shrink-0 text-ink">{icon}</span>
                <div className="flex-1">
                  <h2 className="text-[16px] leading-[20px] text-ink">{title}</h2>
                  <p className="mt-[2px] text-[14px] leading-[21px] text-muted">{description}</p>
                </div>
                <ChevronRight size={22} strokeWidth={1.6} className="shrink-0 text-vivid" />
              </Link>
            </li>
          )
        })}
        <li className="flex h-[47px] items-center justify-between pr-[14px] pl-[12px]">
          <span className="text-[16px] font-medium text-ink">{t.videoGuides.moreInfo}</span>
          <ChevronDown size={22} strokeWidth={1.6} className="text-vivid" />
        </li>
      </ul>
    </div>
  )
}

/** Écran d'un type de rappel. Purement visuel : crayons et « Activer » (désactivé) sont inertes. */
export function ReminderDetail() {
  const { t } = useI18n()
  const r = t.reminders
  const entry = KINDS.find((k) => k.slug === useParams().kind)
  if (!entry) return <Navigate to={BASE} replace />
  return (
    <div className="flex min-h-full flex-col bg-card">
      <SubPageHeader title={r.title} backTo={BASE} tabs={false} />
      <h2 className="flex min-h-[38px] items-center justify-center border-b border-line px-[16px] text-center text-[17px] font-medium text-ink">
        {r.headings[entry.kind]}
      </h2>

      <section className="px-[16px]">
        <h3 className="mt-[13px] text-[15px] text-ink">{r.when}</h3>
        {entry.kind === 'unlocked' && (
          <>
            <Field icon={<DoorHandleIcon />} text={r.lockUnlocked} spaced />
            <p className="my-[5px] text-center text-[11px] tracking-[0.04em] text-muted">{r.and}</p>
          </>
        )}
        <Field icon={<Clock3 size={18} strokeWidth={1.5} />} text={r.time} spaced={entry.kind !== 'unlocked'} />
        <h3 className="mt-[24px] text-[15px] text-ink">{r.then}</h3>
        <Field icon={<Bell size={18} strokeWidth={1.5} />} text={r.send} spaced />
      </section>

      <div className="sticky bottom-0 mt-auto bg-card px-[16px] pt-[24px] pb-[12px]">
        <span className="flex h-[55px] items-center justify-center rounded-[4px] bg-[#f69bab] text-[14px] font-medium tracking-[0.1em] text-white">
          {r.activate}
        </span>
      </div>
    </div>
  )
}

/** Carte « champ à compléter » : icône, texte à trous, crayon rouge. `spaced` : marge sous le libellé (absente après « ET »). */
function Field({ icon, text, spaced = false }: { icon: ReactNode; text: string; spaced?: boolean }) {
  return (
    <div className={`${spaced ? 'mt-[12px]' : ''} flex h-[54px] items-center gap-[13px] rounded-[8px] bg-card pr-[20px] pl-[12px] shadow-[0_2px_6px_rgba(0,0,0,0.14)]`}>
      <span className="shrink-0 text-ink">{icon}</span>
      <span className="flex-1 text-[15px] text-ink">{text}</span>
      <Pencil size={20} strokeWidth={1.4} className="shrink-0 text-vivid" />
    </div>
  )
}

/** Poignée de porte (serrure connectée), d'après la capture. */
function DoorHandleIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round">
      <rect x={12} y={2.5} width={4} height={19} rx={2} />
      <path d="M12 9H5" />
    </svg>
  )
}
