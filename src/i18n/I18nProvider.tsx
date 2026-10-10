import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { dictionaries, type Dictionary, type Lang } from './dictionaries'

const STORAGE_KEY = 'verilab.lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'fr' || saved === 'nl') return saved
  } catch {
    // Stockage indisponible (navigation privée…) : on reste en français.
  }
  return 'fr'
}

type I18n = { lang: Lang; setLang: (lang: Lang) => void; t: Dictionary }

const Ctx = createContext<I18n | null>(null)

/** Langue de la démo (FR par défaut), mémorisée sur l'appareil. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignoré : le choix reste valable pour la session.
    }
  }

  return <Ctx.Provider value={{ lang, setLang, t: dictionaries[lang] }}>{children}</Ctx.Provider>
}

export function useI18n() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
