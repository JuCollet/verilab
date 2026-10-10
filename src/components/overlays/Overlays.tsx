import { useState, type ReactNode } from 'react'
import { LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import { useDemo, type PendingAction } from '../../store/demoStore'
import { DEMO_CODE, DOOR_NAME } from '../../store/seed'
import { StatusCircle } from '../StatusCircle'
import { ALARM_LABELS, alarmVisual } from '../alarmVisual'
import { ShieldCheck, ShieldHalf } from '../icons/Shields'

export function Overlays() {
  const { overlay, alarm } = useDemo()
  if (!overlay) return null

  if (overlay.kind === 'mode') {
    const { variant, icon } = alarmVisual(alarm.mode, 34)
    return (
      <ActionOverlay circle={<StatusCircle size={75} variant={variant}>{icon}</StatusCircle>} label={ALARM_LABELS[alarm.mode]}>
        <ModeSheet />
      </ActionOverlay>
    )
  }

  const { action } = overlay
  if (action.kind === 'door') {
    const Icon = action.lock ? LockKeyhole : LockKeyholeOpen
    return (
      <ActionOverlay circle={<StatusCircle size={75} variant="white"><Icon size={34} strokeWidth={1.8} /></StatusCircle>} label={DOOR_NAME}>
        <PinSheet action={action} />
      </ActionOverlay>
    )
  }

  const { variant, icon } = alarmVisual(alarm.mode, 34)
  return (
    <ActionOverlay circle={<StatusCircle size={75} variant={variant}>{icon}</StatusCircle>} label={ALARM_LABELS[alarm.mode]}>
      <PinSheet action={action} />
    </ActionOverlay>
  )
}

function ActionOverlay({ circle, label, children }: { circle: ReactNode; label: string; children: ReactNode }) {
  return (
    <div role="dialog" aria-modal="true" className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-[600px] flex-col bg-bg">
      <div className="pt-safe flex h-[calc(213px+env(safe-area-inset-top))] shrink-0 flex-col items-center justify-end pb-[14px]">
        {circle}
        <p className="mt-[9px] text-[16px] font-medium text-ink">{label}</p>
      </div>
      <div className="animate-sheet-in pb-safe flex flex-1 flex-col rounded-t-[18px] bg-card shadow-[0_-1px_3px_rgba(0,0,0,0.08)]">
        {children}
      </div>
    </div>
  )
}

function SheetTitle({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) {
  return (
    <div className="relative flex h-[44px] shrink-0 items-center justify-center border-b-2 border-line px-10">
      <h2 className="text-[16px] font-medium text-ink">{children}</h2>
      {trailing && <span className="absolute right-[14px]">{trailing}</span>}
    </div>
  )
}

function CancelButton() {
  const { closeOverlay } = useDemo()
  return (
    <button type="button" onClick={closeOverlay} className="h-[56px] shrink-0 text-[14px] font-medium tracking-[0.02em] text-ink">
      ANNULER
    </button>
  )
}

function ModeSheet() {
  const { openPin } = useDemo()
  const options = [
    { mode: 'partial' as const, label: 'Activer partiellement', variant: 'orange' as const, icon: <ShieldHalf size={30} /> },
    { mode: 'total' as const, label: 'Activer totalement', variant: 'red' as const, icon: <ShieldCheck size={30} /> },
  ]
  return (
    <>
      <SheetTitle
        trailing={
          <span aria-disabled="true" className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-white opacity-40">
            ?
          </span>
        }
      >
        Sélectionnez un mode d'activation
      </SheetTitle>
      <div className="flex flex-1 items-center">
        <div className="grid w-full grid-cols-2 px-4 pb-[70px]">
          {options.map(({ mode, label, variant, icon }) => (
            <button key={mode} type="button" onClick={() => openPin({ kind: 'arm', mode })} className="flex flex-col items-center gap-[12px]">
              <StatusCircle size={75} variant={variant}>
                {icon}
              </StatusCircle>
              <span className="text-[16px] font-medium text-ink">{label}</span>
            </button>
          ))}
        </div>
      </div>
      <CancelButton />
    </>
  )
}

function PinSheet({ action }: { action: PendingAction }) {
  const { confirm } = useDemo()
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)
  const [shakeKey, setShakeKey] = useState(0)

  const press = (digit: string) => {
    setError(false)
    setCode((c) => (c.length < 6 ? c + digit : c))
  }

  const submit = () => {
    if (!code) return
    if (code === DEMO_CODE) {
      confirm(action)
      return
    }
    setError(true)
    setShakeKey((k) => k + 1)
    setCode('')
  }

  const key = 'flex h-[62px] items-center justify-center'
  return (
    <>
      <SheetTitle>Entrez votre code</SheetTitle>
      <div className="flex flex-1 flex-col items-center justify-end pb-[34px]">
        <div key={shakeKey} className={`flex h-[14px] items-center gap-[14px] ${error ? 'animate-shake' : ''}`}>
          {code.split('').map((_, i) => (
            <span key={i} className="h-[12px] w-[12px] rounded-full bg-partial" />
          ))}
        </div>
        <p className={`mt-3 h-[18px] text-[14px] text-brand ${error ? 'visible' : 'invisible'}`}>Code incorrect</p>
      </div>
      <div className="grid grid-cols-3 text-ink">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <button key={d} type="button" onClick={() => press(d)} className={`${key} text-[29px]`}>
            {d}
          </button>
        ))}
        <button type="button" onClick={() => setCode((c) => c.slice(0, -1))} className={`${key} text-[14px] font-medium tracking-[0.02em] text-muted/70`}>
          EFFACER
        </button>
        <button type="button" onClick={() => press('0')} className={`${key} text-[29px]`}>
          0
        </button>
        <button type="button" onClick={submit} disabled={!code} className={`${key} text-[14px] font-medium tracking-[0.02em] ${code ? 'text-brand' : 'text-brand-soft'}`}>
          OK
        </button>
      </div>
      <button
        type="button"
        disabled
        className="mx-[14px] mt-[30px] h-[47px] shrink-0 rounded-[4px] border-2 border-line text-[14px] font-medium tracking-[0.08em] text-brand opacity-40"
      >
        ACTIVER L'IDENTIFICATION BIOMÉTRIQUE
      </button>
      <CancelButton />
    </>
  )
}
