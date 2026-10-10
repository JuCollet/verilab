import { Pencil } from 'lucide-react'
import { useDemo } from '../store/demoStore'
import type { Sensor } from '../store/seed'
import { useNow } from '../hooks/useNow'
import { shortDateLabel } from '../lib/time'
import { useI18n } from '../i18n/I18nProvider'
import { DoorIcon } from '../components/icons/Shields'
import { SubPageHeader } from '../components/SubPageHeader'

export function DoorsWindows() {
  const { sensors } = useDemo()
  const { t } = useI18n()
  const now = useNow()
  return (
    <div className="pb-[7px]">
      <SubPageHeader title={t.home.doorsWindows} />
      <ul className="pt-[10px]">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.serial} sensor={sensor} now={now} />
        ))}
      </ul>
    </div>
  )
}

function SensorCard({ sensor, now }: { sensor: Sensor; now: number }) {
  const { t } = useI18n()
  return (
    <li className="mx-[7px] mb-[7px] rounded-[7px] bg-card shadow-card">
      <div className="flex min-h-[58px] items-start border-b border-line pt-[13px] pr-[10px] pb-[9px] pl-[17px]">
        <div className="flex flex-1 items-center gap-[12px]">
          <h2 className="text-[16px] font-medium text-ink">{t.doorsWindows.sensors[sensor.id]}</h2>
          <span aria-disabled="true" className="text-ink opacity-40">
            <Pencil size={17} strokeWidth={1.5} />
          </span>
        </div>
        <p className="pt-[2px] text-right text-[14px] leading-[15px] text-muted">
          {t.doorsWindows.serial}
          <br />
          {sensor.serial}
        </p>
      </div>
      <div className="flex h-[41px] items-center pr-[10px] pl-[19px]">
        <DoorIcon className="h-[17px] w-[14px] text-ink" />
        <span className="ml-[13px] flex-1 text-[16px] text-ink">{t.doorsWindows.closed}</span>
        <span className="text-[14px] tracking-[0.01em] text-ink">{shortDateLabel(sensor.at, now, t.time)}</span>
      </div>
    </li>
  )
}
