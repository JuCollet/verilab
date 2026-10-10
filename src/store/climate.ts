import { minutesAgo } from '../lib/time'

const HOUR = 3_600_000
const STEP = HOUR / 2

export type ClimatePoint = { at: number; temperature: number; humidity: number }

export type ClimateRoom = {
  /** Identifiant ; le nom affiché est dans les dictionnaires (climate.rooms). */
  room: 'garage' | 'attic'
  at: number
  temperature: number
  humidity: number
  /** Bornes de l'axe température, reprises de la capture. */
  axis: [number, number]
  series: ClimatePoint[]
}

/** PRNG déterministe : mêmes courbes à chaque ouverture de la démo. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Bruit lissé : marche aléatoire filtrée, pour des courbes « capteur » réalistes. */
function smoothNoise(length: number, seed: number, amplitude: number) {
  const rand = mulberry32(seed)
  const out: number[] = []
  let value = 0
  let velocity = 0
  for (let i = 0; i < length; i++) {
    velocity = velocity * 0.85 + (rand() - 0.5) * amplitude * 0.3
    value = value * 0.97 + velocity
    out.push(value)
  }
  return out
}

/** Pic en cloche centré sur `center` (en heures depuis le début), largeur `width` heures. */
const bump = (hours: number, center: number, width: number, height: number) =>
  height * Math.exp(-(((hours - center) / width) ** 2))

/** Plateau d'humidité saturée (100 %) comme sur la capture. */
const plateau = (hours: number, from: number, to: number) => (hours >= from && hours <= to ? 100 : null)

type Model = (hours: number, noise: number) => { temperature: number; humidity: number }

function buildSeries(start: number, now: number, model: Model, seed: number, target: { temperature: number; humidity: number }) {
  const length = Math.floor((now - start) / STEP) + 1
  const tNoise = smoothNoise(length, seed, 0.4)
  const raw = Array.from({ length }, (_, i) => ({ at: start + i * STEP, ...model((i * STEP) / HOUR, tNoise[i]) }))
  // Recale la fin de courbe sur la valeur courante affichée.
  const last = raw[raw.length - 1]
  const dT = target.temperature - last.temperature
  const dH = target.humidity - last.humidity
  return raw.map((p, i) => {
    const fade = Math.max(0, (i - (length - 1) * 0.85) / ((length - 1) * 0.15))
    return {
      at: p.at,
      temperature: p.temperature + dT * fade,
      humidity: Math.min(100, Math.max(0, p.humidity + dH * fade)),
    }
  })
}

// Garage : assez stable, quelques pics (porte ouverte), humidité ~75-85 % avec saturations ponctuelles.
const garageModel: Model = (h, n) => ({
  temperature:
    18.2 - h * 0.012 + n +
    bump(h, 36, 4, 2.6) + bump(h, 39, 1.5, 0.8) +
    bump(h, 102, 4, 2.2) + bump(h, 148, 2, 1.2) + bump(h, 160, 2, 1.0) -
    bump(h, 136, 6, 1.4),
  humidity: plateau(h, 98, 102) ?? plateau(h, 145, 151) ?? 74 + h * 0.04 + n * 3 + bump(h, 140, 10, -6),
})

// Grenier : fortes oscillations jour/nuit les premiers jours, puis temps plus frais et humide.
const grenierModel: Model = (h, n) => {
  const daily = Math.cos(((h - 15) / 24) * 2 * Math.PI)
  const cooling = h < 96 ? 0 : Math.min(1, (h - 96) / 30)
  return {
    temperature: 19.3 + daily * 4.5 * (1 - cooling * 0.7) - cooling * 3.6 + n * 0.6 + bump(h, 152, 6, 2.4) * cooling,
    humidity: plateau(h, 140, 146) ?? 68 + (1 - daily) * 2 + cooling * 12 + n * 2,
  }
}

/** Les 7 derniers jours (depuis minuit il y a 6 jours) jusqu'à maintenant. */
export function createClimate(now = Date.now()): ClimateRoom[] {
  const start = new Date(now)
  start.setDate(start.getDate() - 6)
  start.setHours(0, 0, 0, 0)
  const from = start.getTime()

  const garage = { temperature: 16.9, humidity: 84 }
  const grenier = { temperature: 17.7, humidity: 86 }
  return [
    { room: 'garage', at: minutesAgo(43, now), ...garage, axis: [15, 22], series: buildSeries(from, now, garageModel, 7, garage) },
    { room: 'attic', at: minutesAgo(40, now), ...grenier, axis: [13, 24], series: buildSeries(from, now, grenierModel, 11, grenier) },
  ]
}
