import type { TimeStrings } from '../i18n/dictionaries'

const MINUTE = 60_000

export const minutesAgo = (minutes: number, from = Date.now()) => from - minutes * MINUTE

/** « IL Y A 4 MIN » / « 4 MIN GELEDEN ». */
export function relativeLabel(at: number, now: number, tt: TimeStrings) {
  const minutes = Math.max(0, Math.floor((now - at) / MINUTE))
  if (minutes < 60) return tt.ago(minutes, 'min')
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return tt.ago(hours, 'h')
  return tt.ago(Math.floor(hours / 24), 'd')
}

export const clock = (at: number) =>
  new Date(at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const startOfDay = (t: number) => {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

const daysBetween = (at: number, now: number) => Math.round((startOfDay(now) - startOfDay(at)) / (24 * 60 * MINUTE))

export function dayLabel(at: number, now: number, tt: TimeStrings) {
  const diffDays = daysBetween(at, now)
  if (diffDays === 0) return tt.today
  if (diffDays === 1) return tt.yesterday
  return new Date(at).toLocaleDateString(tt.locale, { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()
}

export const dayTimeLabel = (at: number, now: number, tt: TimeStrings) => `${dayLabel(at, now, tt)} ${clock(at)}`

export function groupByDay<T extends { at: number }>(items: T[], now: number, tt: TimeStrings) {
  const groups: { label: string; items: T[] }[] = []
  for (const item of items) {
    const label = dayLabel(item.at, now, tt)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

/** « AUJOURD'HUI 14:34 », « HIER 09:12 », « 4 AOÛT 17:59 » (cette année) ou « 19 OCT 2024 ». */
export function shortDateLabel(at: number, now: number, tt: TimeStrings) {
  if (daysBetween(at, now) <= 1) return dayTimeLabel(at, now, tt)
  const d = new Date(at)
  const base = `${d.getDate()} ${tt.months[d.getMonth()]}`
  return d.getFullYear() === new Date(now).getFullYear() ? `${base} ${clock(at)}` : `${base} ${d.getFullYear()}`
}

/** Abréviation du jour pour les graphiques : « sam. » / « za ». */
export const weekdayShort = (at: number, tt: TimeStrings) => new Date(at).toLocaleDateString(tt.locale, { weekday: 'short' })
