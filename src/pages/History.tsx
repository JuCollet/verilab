import type { ReactNode } from 'react'
import { LockKeyhole, LockKeyholeOpen, TriangleAlert, Wrench } from 'lucide-react'
import { useDemo } from '../store/demoStore'
import type { EventType, HistoryEvent } from '../store/seed'
import { useI18n } from '../i18n/I18nProvider'
import { useNow } from '../hooks/useNow'
import { clock, groupByDay } from '../lib/time'
import { PageTitle } from '../components/PageTitle'
import { DisabledChevron } from '../components/Card'
import { StatusCircle, type CircleVariant } from '../components/StatusCircle'
import { ShieldCheck, ShieldHalf, ShieldOff } from '../components/icons/Shields'

const EVENT_META: Record<EventType, { variant: CircleVariant; icon: ReactNode }> = {
  disarmed: { variant: 'white', icon: <ShieldOff size={18} /> },
  armed_total: { variant: 'red', icon: <ShieldCheck size={18} /> },
  armed_partial: { variant: 'orange', icon: <ShieldHalf size={18} /> },
  locked: { variant: 'green', icon: <LockKeyhole size={16} strokeWidth={2} /> },
  unlocked: { variant: 'green', icon: <LockKeyholeOpen size={16} strokeWidth={2} /> },
  battery: { variant: 'yellow', icon: <Wrench size={16} strokeWidth={2} /> },
  lock_failure: { variant: 'yellow', icon: <TriangleAlert size={16} strokeWidth={2} /> },
}

export function History() {
  const { events } = useDemo()
  const now = useNow()
  const { t } = useI18n()
  const groups = groupByDay(events, now, t.time)

  return (
    <div className="pb-4">
      <PageTitle
        title={t.history.title}
        action={
          <span aria-disabled="true" className="text-[14px] font-medium tracking-[0.03em] text-brand opacity-40">
            {t.history.filter}
          </span>
        }
      />
      {groups.map((group) => (
        <section key={group.label}>
          <h2 className="sticky top-[calc(59px+env(safe-area-inset-top))] z-10 flex h-[31px] items-center border-b border-line bg-bg px-[13px] text-[14px] font-medium tracking-[0.02em] text-ink">
            {group.label}
          </h2>
          <ol className="pt-[13px]">
            {group.items.map((event, i) => (
              <EventRow key={event.id} event={event} last={i === group.items.length - 1} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

function EventRow({ event, last }: { event: HistoryEvent; last: boolean }) {
  const { t } = useI18n()
  const meta = EVENT_META[event.type]
  const title = t.history.events[event.type](t.doorName)
  const subtitle = event.type === 'battery' ? t.history.batterySubtitle(t.doorName) : event.by
  return (
    <li className="relative flex pr-[14px] pb-[13px] pl-[13px]">
      {!last && <span className="absolute top-[30px] bottom-0 left-[59px] w-[1.5px] bg-[#b5b5b5]" />}
      <span className="w-[31px] shrink-0 pt-[7px] text-[13px] font-medium tracking-[-0.01em] text-ink">{clock(event.at)}</span>
      <StatusCircle size={31} variant={meta.variant} className="z-[1] mt-[1px] ml-[1px] border border-white">
        {meta.icon}
      </StatusCircle>
      <div className="ml-[7px] flex min-h-[62px] flex-1 items-center rounded-[5px] bg-card pr-[12px] pl-[13px]">
        <div className="min-w-0 flex-1 py-[8px]">
          <p className="text-[16px] leading-[20px] text-ink">{title}</p>
          <p className="mt-[3px] text-[14px] text-muted">{subtitle}</p>
        </div>
        <DisabledChevron />
      </div>
    </li>
  )
}
