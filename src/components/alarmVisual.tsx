import type { ReactNode } from 'react'
import type { AlarmMode } from '../store/seed'
import type { CircleVariant } from './StatusCircle'
import { ShieldCheck, ShieldHalf, ShieldOff } from './icons/Shields'

export function alarmVisual(mode: AlarmMode, iconSize: number): { variant: CircleVariant; icon: ReactNode } {
  if (mode === 'partial') return { variant: 'orange', icon: <ShieldHalf size={iconSize} /> }
  if (mode === 'total') return { variant: 'red', icon: <ShieldCheck size={iconSize} /> }
  return { variant: 'white', icon: <ShieldOff size={iconSize} /> }
}
