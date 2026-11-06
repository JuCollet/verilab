import { useI18n } from '../i18n/I18nProvider'
import type { Lang } from '../i18n/dictionaries'

const OPTIONS: Lang[] = ['fr', 'nl']

/** Bascule discrète FR / NL (Accueil, écran d'accueil de la démo). Le positionnement vient du parent. */
export function LanguageToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()
  return (
    <div className={`flex rounded-full border border-line bg-card/60 p-[2px] text-[11px] font-medium tracking-[0.04em] ${className}`}>
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={lang === option}
          onClick={() => setLang(option)}
          className={`rounded-full px-[7px] py-[2px] uppercase ${lang === option ? 'bg-ink text-white' : 'text-muted'}`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
