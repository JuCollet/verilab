const MINUTE = 60_000

export const minutesAgo = (minutes: number, from = Date.now()) => from - minutes * MINUTE

export function relativeLabel(at: number, now: number) {
  const minutes = Math.max(0, Math.floor((now - at) / MINUTE))
  if (minutes < 60) return `IL Y A ${minutes} MIN`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `IL Y A ${hours} H`
  const days = Math.floor(hours / 24)
  return `IL Y A ${days} J`
}

export const clock = (at: number) =>
  new Date(at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })

const startOfDay = (t: number) => {
  const d = new Date(t)
  d.setHours(0, 0, 0, 0)
  return d.getTime()
}

export function dayLabel(at: number, now: number) {
  const diffDays = Math.round((startOfDay(now) - startOfDay(at)) / (24 * 60 * MINUTE))
  if (diffDays === 0) return "AUJOURD'HUI"
  if (diffDays === 1) return 'HIER'
  return new Date(at)
    .toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    .toUpperCase()
}

export const dayTimeLabel = (at: number, now: number) => `${dayLabel(at, now)} ${clock(at)}`

export function groupByDay<T extends { at: number }>(items: T[], now: number) {
  const groups: { label: string; items: T[] }[] = []
  for (const item of items) {
    const label = dayLabel(item.at, now)
    const last = groups[groups.length - 1]
    if (last?.label === label) last.items.push(item)
    else groups.push({ label, items: [item] })
  }
  return groups
}

const MONTHS = ['JANV', 'FÉVR', 'MAR', 'AVR', 'MAI', 'JUIN', 'JUIL', 'AOÛT', 'SEPT', 'OCT', 'NOV', 'DÉC']

/** « AUJOURD'HUI 14:34 », « HIER 09:12 », « 4 AOÛT 17:59 » (cette année) ou « 19 OCT 2024 ». */
export function shortDateLabel(at: number, now: number) {
  const day = dayLabel(at, now)
  if (day === "AUJOURD'HUI" || day === 'HIER') return `${day} ${clock(at)}`
  const d = new Date(at)
  const base = `${d.getDate()} ${MONTHS[d.getMonth()]}`
  return d.getFullYear() === new Date(now).getFullYear() ? `${base} ${clock(at)}` : `${base} ${d.getFullYear()}`
}
