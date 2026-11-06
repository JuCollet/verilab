/** Modèle des routines créées dans la démo (Plus › Fonctionnalités › Routines › Créer une routine). */

export type Time = { hour: number; minute: number }

/** Déclencheur « à un moment précis » : heure et jours (0 = lundi … 6 = dimanche). */
export type Trigger = { time: Time; days: number[] }

export type AlarmTarget = 'disarm' | 'partial' | 'total'

/** Action « Alors » ; une routine en a au plus une de chaque type. */
export type RoutineAction = { kind: 'lock' } | { kind: 'alarm'; target: AlarmTarget }

/** `enabled` : interrupteur de la carte dans la liste des routines. */
export type Routine = { id: string; name: string; trigger: Trigger; actions: RoutineAction[]; enabled: boolean }
