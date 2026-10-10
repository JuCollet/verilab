import { minutesAgo } from '../lib/time'
import { createClimate } from './climate'

export const CURRENT_USER = 'Thomas Peeters'
export const DEMO_CODE = '2580'

export type AlarmMode = 'off' | 'partial' | 'total'

export type EventType =
  | 'disarmed'
  | 'armed_partial'
  | 'armed_total'
  | 'locked'
  | 'unlocked'
  | 'battery'
  | 'lock_failure'

export type HistoryEvent = { id: string; type: EventType; at: number; by: string }

const TEST_USER = 'Thomas test'
const SECOND_USER = 'Sophie Janssens'
const DAY = 24 * 60

// Décalages en minutes avant l'ouverture de la démo, d'après la capture « Historique »
// (capture prise à 15:46 : 15:42 = 4 min, 14:47 = 59 min, etc.).
const seedEvents: [EventType, number, string][] = [
  ['disarmed', 4, CURRENT_USER],
  ['locked', 59, TEST_USER],
  ['armed_total', 59.5, TEST_USER],
  ['unlocked', 232, CURRENT_USER],
  ['locked', 233, CURRENT_USER],
  ['battery', 258, ''],
  ['lock_failure', 267, TEST_USER],
  ['unlocked', 297, SECOND_USER],
  ['disarmed', 297.5, SECOND_USER],
  ['armed_total', DAY + 0, SECOND_USER],
  ['locked', DAY + 1, SECOND_USER],
  ['unlocked', DAY + 210, CURRENT_USER],
  ['armed_partial', DAY + 480, CURRENT_USER],
  ['disarmed', DAY + 545, CURRENT_USER],
  ['unlocked', DAY + 547, CURRENT_USER],
]

export function createSeed(now = Date.now()) {
  return {
    alarm: { mode: 'off' as AlarmMode, at: minutesAgo(4, now), by: CURRENT_USER },
    door: { locked: true, at: minutesAgo(59, now) },
    doorsWindowsAt: minutesAgo(59, now),
    sensors: createSensors(minutesAgo(59, now), now),
    climate: createClimate(now),
    events: seedEvents.map(([type, offset, by], i): HistoryEvent => ({
      id: `seed-${i}`,
      type,
      at: minutesAgo(offset, now),
      by,
    })),
  }
}

/** Identifiants des caméras ; les noms affichés sont dans les dictionnaires (cameras.names). */
export const CAMERAS = ['living', 'nightHall'] as const

export type SensorId = 'bathroom' | 'living' | 'livingLeft' | 'slidingDoor' | 'hall' | 'toilet'
export type Sensor = { id: SensorId; serial: string; at: number }

/**
 * Capteurs d'ouverture (noms traduits via doorsWindows.sensors, numéros de série fictifs).
 * `daysAgo` + heure fixe ; la baie vitrée porte le dernier changement, affiché sur la carte de l'Accueil.
 */
export function createSensors(doorsWindowsAt: number, now = Date.now()): Sensor[] {
  const at = (daysAgo: number, hh: number, mm: number) => {
    const d = new Date(now)
    d.setDate(d.getDate() - daysAgo)
    d.setHours(hh, mm, 0, 0)
    return d.getTime()
  }
  return [
    { id: 'bathroom', serial: '3SX9 KQ2M', at: at(67, 17, 59) },
    { id: 'living', serial: '2DWJ RT7P', at: at(356, 9, 12) },
    { id: 'livingLeft', serial: '3SXA LM4D', at: at(105, 8, 59) },
    { id: 'slidingDoor', serial: '2DWJ B8VN', at: doorsWindowsAt },
    { id: 'hall', serial: '2DWJ GH3K', at: at(103, 6, 51) },
    { id: 'toilet', serial: '2KG3 PW5T', at: at(203, 14, 41) },
  ]
}
