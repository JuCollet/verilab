import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { Crosshair, Minus, Plus } from 'lucide-react'
import { FakeMap } from '../components/icons/FakeMap'

const STEP = 5 * 60_000
const MIN = STEP
const MAX = 23 * 3_600_000 + 55 * 60_000
const DEFAULT = STEP
const MAX_ACTIVITY = 80

type Phase = { kind: 'setup' } | { kind: 'running'; endAt: number } | { kind: 'done' }

/**
 * SOS Timer : réglage de la durée, puis compte à rebours.
 * Quitter l'écran (FERMER / ANNULER) abandonne le timer.
 */
export function SosTimer() {
  const navigate = useNavigate()
  const close = () => navigate('/', { replace: true })
  const [duration, setDuration] = useState(DEFAULT)
  const [activity, setActivity] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'setup' })
  const remaining = useRemaining(phase, () => setPhase({ kind: 'done' }))

  return (
    <div className="pt-safe relative mx-auto flex h-dvh max-w-[600px] flex-col overflow-hidden bg-bg">
      <header className="relative flex h-[40px] shrink-0 items-center justify-center border-b border-line bg-bg">
        <button type="button" onClick={close} className="absolute left-[18px] text-[14px] font-medium text-brand">
          FERMER
        </button>
        <h1 className="text-[16px] font-medium text-ink">Protection personnelle</h1>
      </header>
      <div className="relative flex-1">
        <div className="absolute inset-0">
          <FakeMap />
        </div>
        <span aria-disabled="true" className="absolute top-[14px] right-[13px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-card text-ink shadow-round">
          <Crosshair size={22} strokeWidth={1.6} />
        </span>
      </div>
      {/* Voile sombre sous le sheet, comme sur l'app d'origine */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      <div className="animate-sheet-in pb-safe relative z-10 shrink-0 rounded-t-[18px] bg-card">
        {phase.kind === 'setup' && (
          <SetupSheet
            duration={duration}
            setDuration={setDuration}
            activity={activity}
            setActivity={setActivity}
            onCancel={close}
            onStart={() => setPhase({ kind: 'running', endAt: Date.now() + duration })}
          />
        )}
        {phase.kind === 'running' && (
          <Sheet
            title="Timer en cours"
            footer={
              <>
                <FooterButton onClick={() => setPhase({ kind: 'running', endAt: phase.endAt + STEP })}>+5 MIN</FooterButton>
                <FooterButton red onClick={() => setPhase({ kind: 'setup' })}>
                  ARRÊTER LE TIMER
                </FooterButton>
              </>
            }
          >
            <div className="flex h-[141px] flex-col items-center justify-center">
              <Digits ms={remaining} />
              {activity && <p className="mt-[10px] max-w-full truncate px-6 text-[15px] text-muted">{activity}</p>}
            </div>
            <div className="h-[70px]" />
          </Sheet>
        )}
        {phase.kind === 'done' && (
          <Sheet title="Temps écoulé" footer={<FooterButton red onClick={close}>FERMER</FooterButton>}>
            <div className="flex h-[211px] flex-col items-center justify-center px-8 text-center">
              <span className="flex h-[54px] w-[54px] items-center justify-center rounded-full bg-sos text-[20px] text-white shadow-round">SOS</span>
              <p className="mt-[14px] text-[16px] leading-[22px] text-ink">Un SOS aurait été envoyé à la centrale.</p>
              <p className="mt-[4px] text-[13px] text-muted">Démo : aucune alerte réelle n'a été déclenchée.</p>
            </div>
          </Sheet>
        )}
      </div>
    </div>
  )
}

function useRemaining(phase: Phase, onDone: () => void) {
  const [now, setNow] = useState(Date.now)
  const running = phase.kind === 'running'
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [running])
  const remaining = running ? Math.max(0, phase.endAt - now) : 0
  useEffect(() => {
    if (running && remaining === 0) onDone()
  }, [running, remaining, onDone])
  return remaining
}

function SetupSheet(props: {
  duration: number
  setDuration: (ms: number) => void
  activity: string
  setActivity: (text: string) => void
  onCancel: () => void
  onStart: () => void
}) {
  const { duration, setDuration, activity, setActivity, onCancel, onStart } = props
  const canDecrease = duration > MIN
  const isDefault = duration === DEFAULT
  return (
    <Sheet
      title="Définir le Timer"
      footer={
        <>
          <FooterButton onClick={onCancel}>ANNULER</FooterButton>
          <FooterButton red onClick={onStart}>
            DÉMARRER LE TIMER
          </FooterButton>
        </>
      }
    >
      <div className="flex flex-col items-center pt-[30px]">
        <div className="flex items-center gap-[24px]">
          <RoundButton label="Retirer 5 minutes" disabled={!canDecrease} onClick={() => setDuration(Math.max(MIN, duration - STEP))}>
            <Minus size={16} strokeWidth={3} />
          </RoundButton>
          <Digits ms={duration} />
          <RoundButton label="Ajouter 5 minutes" disabled={duration >= MAX} onClick={() => setDuration(Math.min(MAX, duration + STEP))}>
            <Plus size={16} strokeWidth={3} />
          </RoundButton>
        </div>
        <button
          type="button"
          disabled={isDefault}
          onClick={() => setDuration(DEFAULT)}
          className={`mt-[6px] h-[24px] text-[14px] font-medium tracking-[0.02em] ${isDefault ? 'text-brand-soft' : 'text-brand'}`}
        >
          EFFACER
        </button>
      </div>
      <label className="mx-[14px] mt-[28px] block">
        <input
          value={activity}
          onChange={(e) => setActivity(e.target.value.slice(0, MAX_ACTIVITY))}
          maxLength={MAX_ACTIVITY}
          placeholder="Dites-nous en plus sur votre activité"
          className="h-[44px] w-full border-b-[1.5px] border-[#6e6e6e] bg-transparent px-[13px] text-[16px] text-ink outline-none placeholder:text-muted focus:border-brand"
        />
        <span className="mt-[6px] flex justify-between px-[4px] text-[13px] text-muted">
          <span>Max {MAX_ACTIVITY} caractères</span>
          {activity && (
            <span>
              {activity.length}/{MAX_ACTIVITY}
            </span>
          )}
        </span>
      </label>
      <div className="h-[24px]" />
    </Sheet>
  )
}

function Sheet({ title, children, footer }: { title: string; children: ReactNode; footer: ReactNode }) {
  return (
    <>
      <div className="flex h-[44px] items-center justify-center border-b-2 border-line">
        <h2 className="text-[16px] font-medium text-ink">{title}</h2>
      </div>
      {children}
      <div className="flex h-[42px] border-t-2 border-line">{footer}</div>
    </>
  )
}

function FooterButton({ children, red, onClick }: { children: ReactNode; red?: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`flex-1 text-[15px] font-medium tracking-[0.1em] ${red ? 'text-brand' : 'text-ink'}`}>
      {children}
    </button>
  )
}

function RoundButton({ children, label, disabled, onClick }: { children: ReactNode; label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[24px] w-[24px] items-center justify-center rounded-full text-white ${disabled ? 'bg-[#a8a8a8]' : 'bg-ink'}`}
    >
      {children}
    </button>
  )
}

/** HH:MM:SS — chaque groupe est gris tant qu'il vaut 00, noir sinon. */
function Digits({ ms }: { ms: number }) {
  const total = Math.ceil(ms / 1000)
  const parts = [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60]
  return (
    <span className="flex items-center text-[37px] leading-none font-semibold tabular-nums">
      {parts.map((value, i) => (
        <span key={i} className="flex items-center">
          {i > 0 && <span className="mx-[3px] -translate-y-[2px] text-[30px] text-[#c4c4c4]">:</span>}
          <span className={value > 0 ? 'text-ink' : 'text-[#c4c4c4]'}>{String(value).padStart(2, '0')}</span>
        </span>
      ))}
    </span>
  )
}
