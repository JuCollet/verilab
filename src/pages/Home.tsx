import { useEffect, useRef, useState, type Ref } from 'react'
import { Link } from 'react-router'
import { Bell, LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import { useDemo } from '../store/demoStore'
import { DOOR_NAME } from '../store/seed'
import { useNow } from '../hooks/useNow'
import { dayTimeLabel, relativeLabel } from '../lib/time'
import { Card } from '../components/Card'
import { StatusCircle } from '../components/StatusCircle'
import { ALARM_LABELS, alarmVisual } from '../components/alarmVisual'
import { Broadcast, DoorIcon } from '../components/icons/Shields'
import { FireDrillPhone, SmokeDetector } from '../components/icons/Illustrations'

export function Home() {
  const now = useNow()
  const headerRef = useRef<HTMLDivElement>(null)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setCompact(!entry.isIntersecting), { threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <>
      <CompactHeader visible={compact} />
      <AlarmHeader now={now} sentinelRef={headerRef} />
      <LocksCard now={now} />
      <FireCard />
      <GuardianCard />
      <DoorsWindowsCard now={now} />
      <ClimateCard now={now} />
      <div className="h-[1px]" />
    </>
  )
}

function CompactHeader({ visible }: { visible: boolean }) {
  const { alarm } = useDemo()
  return (
    <div
      className={`pt-safe fixed inset-x-0 top-0 z-20 mx-auto max-w-[600px] bg-card shadow-card transition-opacity duration-150 ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <p className="flex h-[32px] items-start justify-center text-[15px] text-ink">{ALARM_LABELS[alarm.mode]}</p>
    </div>
  )
}

function AlarmHeader({ now, sentinelRef }: { now: number; sentinelRef: Ref<HTMLDivElement> }) {
  const { alarm, pending, openModeSheet, openPin } = useDemo()
  const isPending = pending?.kind === 'arm' || pending?.kind === 'disarm'
  const { variant, icon } = alarmVisual(alarm.mode, 34)

  const onTap = () => (alarm.mode === 'off' ? openModeSheet() : openPin({ kind: 'disarm' }))

  return (
    <div className="pt-safe flex flex-col items-center pb-[12px]">
      <div className="h-[38px]" />
      <StatusCircle size={75} variant={variant} pending={isPending} onClick={onTap} label="Changer le mode de l'alarme">
        {icon}
      </StatusCircle>
      <div ref={sentinelRef} className="mt-[6px] flex flex-col items-center leading-[20px]">
        <p className="text-[16px] text-ink">{isPending ? (pending?.kind === 'disarm' ? 'Désactivation…' : 'Activation…') : ALARM_LABELS[alarm.mode]}</p>
        <p className="mt-[2px] flex items-center gap-[7px] text-[15px] tracking-[0.03em] text-ink">
          <span>{alarm.by}</span>
          <Broadcast className="text-ink" />
          <span>{relativeLabel(alarm.at, now)}</span>
        </p>
      </div>
    </div>
  )
}

function LocksCard({ now }: { now: number }) {
  const { door, pending, openPin } = useDemo()
  const isPending = pending?.kind === 'door'
  return (
    <Card
      title="Serrures intelligentes"
      chevron
      extra={
        <span aria-disabled="true" className="flex h-[21px] items-center gap-[5px] rounded-full bg-sos px-[8px] text-[13px] font-medium text-white opacity-40">
          <Bell size={13} strokeWidth={2} />
          En savoir plus
        </span>
      }
    >
      <div className="flex flex-col items-center pt-[3px] pb-[11px]">
        <StatusCircle
          size={54}
          variant={door.locked ? 'black' : 'white'}
          pending={isPending}
          onClick={() => openPin({ kind: 'door', lock: !door.locked })}
          label={door.locked ? 'Déverrouiller la porte' : 'Verrouiller la porte'}
        >
          {door.locked ? <LockKeyhole size={20} strokeWidth={2} /> : <LockKeyholeOpen size={20} strokeWidth={2} />}
        </StatusCircle>
        <p className="mt-[8px] text-[16px] text-ink">{DOOR_NAME}</p>
        <p className="mt-[2px] text-[15px] tracking-[0.03em] text-muted">{relativeLabel(door.at, now)}</p>
      </div>
    </Card>
  )
}

function FireCard() {
  return (
    <Card title="Sécurité incendie">
      <div className="grid grid-cols-2 px-2 pt-[34px] pb-[26px]">
        <div className="flex flex-col items-center">
          <SmokeDetector />
          <p className="mt-[4px] text-[15px] text-ink">Statut de l'appareil</p>
          <p className="text-[13px] tracking-[0.06em] text-ok">TOUS BONS</p>
        </div>
        <div className="flex flex-col items-center">
          <FireDrillPhone />
          <p className="mt-[4px] text-[15px] text-ink">Exercice d'incendie</p>
          <p aria-disabled="true" className="text-[13px] tracking-[0.06em] text-brand opacity-40">
            COMMENCER MAINTENANT
          </p>
        </div>
      </div>
    </Card>
  )
}

function GuardianCard() {
  return (
    <Card title="Verilab Guardian" chevron>
      <div className="flex flex-col items-center px-[13px] pt-[2px]">
        <Link
          to="/sos"
          aria-label="Déclencher un SOS"
          className="flex h-[64px] w-[64px] items-center justify-center rounded-full border-2 border-white bg-sos text-[25px] text-white shadow-round active:brightness-90"
        >
          SOS
        </Link>
        <p className="mt-[10px] text-[16px] text-ink">Déclencher un SOS</p>
        <div className="mt-[14px] h-px w-full bg-line" />
        <p className="mt-[11px] px-4 text-center text-[14px] leading-[18px] text-muted">
          Utilisez une carte ou un Timer pour envoyer automatiquement un SOS si nécessaire
        </p>
        <Link
          to="/sos-timer"
          className="mt-[11px] mb-[13px] flex h-[48px] w-full items-center justify-center rounded-[4px] border-2 border-line text-[14px] font-medium tracking-[0.09em] text-brand active:bg-bg"
        >
          SOS TIMER / DESTINATION
        </Link>
      </div>
    </Card>
  )
}

function DoorsWindowsCard({ now }: { now: number }) {
  const { doorsWindowsAt } = useDemo()
  return (
    <Card title="Portes & fenêtres" chevron to="/portes-fenetres">
      <div className="flex items-center gap-[20px] pr-4 pb-[16px] pl-[20px]">
        <DoorIcon className="text-ink" />
        <div>
          <p className="text-[16px] text-ink">Tout est fermé</p>
          <p className="mt-[2px] text-[15px] tracking-[0.02em] text-muted">{dayTimeLabel(doorsWindowsAt, now)}</p>
        </div>
      </div>
    </Card>
  )
}

function ClimateCard({ now }: { now: number }) {
  const { climate } = useDemo()
  const byTemperature = [...climate].sort((a, b) => b.temperature - a.temperature)
  const rows = [
    { ...byTemperature[0], label: 'LA PLUS HAUTE' },
    { ...byTemperature[byTemperature.length - 1], label: 'LA PLUS BASSE' },
  ]
  return (
    <Card title="Climat" chevron to="/climat">
      <div className="px-[20px]">
        {rows.map((c, i) => (
          <div key={c.label} className={`flex items-center pt-[4px] pb-[11px] ${i > 0 ? 'border-t border-line pt-[12px]' : ''}`}>
            <div className="flex-1">
              <p className="text-[16px] text-ink">{c.room}</p>
              <p className="mt-[5px] text-[14px] tracking-[0.02em] text-ink">
                {c.label}, <span className="text-muted">{relativeLabel(c.at, now)}</span>
              </p>
            </div>
            <span className="mr-[14px] text-[14px] text-ink">{c.humidity.toFixed(1)}%</span>
            <span className="text-[22px] text-ink">{c.temperature.toFixed(1)}°</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
