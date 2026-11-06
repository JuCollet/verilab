import { useId, useState } from 'react'
import { BellOff, Database, House, MonitorSmartphone } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { VerilabLogo } from './icons/Illustrations'
import { LanguageToggle } from './LanguageToggle'

/*
 * Filigrane « démo » imposé par la relecture : une capture d'écran de la démo ne doit pas pouvoir
 * passer pour une capture de l'application réelle. Répété sur tout l'écran, il ne disparaît pas en
 * recadrant. Monté à la racine (hors routeur) pour couvrir aussi les écrans plein écran, les fenêtres
 * modales et la page ordinateur ; il ne capte aucun clic.
 */
export function DemoWatermark() {
  const { t } = useI18n()
  const id = useId()
  return (
    <svg aria-hidden className="pointer-events-none fixed inset-0 z-[90] h-full w-full" fontFamily="Fira Sans, sans-serif">
      <defs>
        {/* Motif en quinconce : deux mots décalés par tuile, le tout incliné. */}
        <pattern id={id} width={180} height={120} patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
          <g fill="#808080" fillOpacity={0.1} fontSize={20} fontWeight={600} letterSpacing={3}>
            <text x={10} y={40}>{t.demo.watermark}</text>
            <text x={100} y={100}>{t.demo.watermark}</text>
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}

/**
 * Écran « mode démo » affiché à chaque nouvelle session : ouverture de l'app, nouvel onglet ou rechargement.
 * Volontairement rien n'est stocké (ni localStorage ni sessionStorage) : l'état « fermé » ne vit qu'en mémoire.
 */
export function DemoWelcome() {
  const { t } = useI18n()
  const [open, setOpen] = useState(true)
  if (!open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="demo-welcome-title"
      className="fixed inset-0 z-[80] flex flex-col bg-bg"
    >
      {/* Zone défilante : sur petit écran, seul le contenu défile, le bouton reste visible en pied. */}
      <div className="flex-1 overflow-y-auto">
        <div className="pt-safe relative mx-auto flex min-h-full max-w-[600px] flex-col px-[20px]">
          {/* Hors du flux : n'entre pas dans la répartition de l'espace. */}
          <LanguageToggle className="absolute top-[calc(env(safe-area-inset-top)+16px)] right-[20px]" />
          {/* En-tête (logo + titres) et contenu, l'espace libre réparti également (space-evenly). */}
          <div className="flex flex-1 flex-col justify-evenly gap-[24px] pt-[56px] pb-[24px]">
            <div className="flex flex-col items-center text-center">
              <VerilabLogo size={128} />
              <p className="mt-[24px] text-[13px] font-medium tracking-[0.08em] text-brand uppercase">{t.demo.overline}</p>
              <h1 id="demo-welcome-title" className="mt-[6px] text-[24px] leading-[29px] font-semibold text-ink">
                {t.demo.title}
              </h1>
            </div>
            <div className="flex flex-col">
              <DemoPoints />
              <section className="mt-[24px] rounded-[5px] bg-card px-[14px] py-[12px] text-[12px] leading-[17px] text-muted shadow-card">
                {t.demo.company}
              </section>
            </div>
          </div>
        </div>
      </div>
      <footer className="pb-safe shrink-0 bg-bg">
        <div className="mx-auto max-w-[600px] px-[20px] py-[14px]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="h-[48px] w-full rounded-[4px] bg-brand text-[14px] font-medium tracking-[0.09em] text-white active:opacity-80"
          >
            {t.demo.enter}
          </button>
        </div>
      </footer>
    </div>
  )
}

const POINT_ICONS = [MonitorSmartphone, House, Database, BellOff]

/** Les quatre points du disclaimer (écran d'accueil et mentions légales). */
export function DemoPoints({ className = '' }: { className?: string }) {
  const { t } = useI18n()
  return (
    <ul className={`flex flex-col gap-[14px] ${className}`}>
      {t.demo.points.map((point, i) => {
        const Icon = POINT_ICONS[i] ?? Database
        return (
          <li key={point} className="flex gap-[12px] text-[15px] leading-[20px] text-ink">
            <Icon size={20} strokeWidth={1.6} className="mt-[1px] shrink-0 text-brand" />
            {point}
          </li>
        )
      })}
    </ul>
  )
}
