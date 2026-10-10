import { Pencil } from 'lucide-react'
import { useDemo } from '../store/demoStore'
import type { Sensor } from '../store/seed'
import { useNow } from '../hooks/useNow'
import { shortDateLabel } from '../lib/time'
import { DoorIcon } from '../components/icons/Shields'
import { SubPageHeader } from '../components/SubPageHeader'

export function DoorsWindows() {
  const { sensors } = useDemo()
  const now = useNow()
  return (
    <div className="pb-[7px]">
      <SubPageHeader title="Portes & fenêtres" />
      <ul className="pt-[10px]">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.serial} sensor={sensor} now={now} />
        ))}
      </ul>
    </div>
  )
}

function SensorCard({ sensor, now }: { sensor: Sensor; now: number }) {
  return (
    <li className="mx-[7px] mb-[7px] rounded-[7px] bg-card shadow-card">
      <div className="flex min-h-[58px] items-start border-b border-line pt-[13px] pr-[10px] pb-[9px] pl-[17px]">
        <div className="flex flex-1 items-center gap-[12px]">
          <h2 className="text-[16px] font-medium text-ink">{sensor.name}</h2>
          <span aria-disabled="true" className="text-ink opacity-40">
            <Pencil size={17} strokeWidth={1.5} />
          </span>
        </div>
        <p className="pt-[2px] text-right text-[14px] leading-[15px] text-muted">
          N° de série
          <br />
          {sensor.serial}
        </p>
      </div>
      <div className="flex h-[41px] items-center pr-[10px] pl-[19px]">
        <DoorIcon className="h-[17px] w-[14px] text-ink" />
        <span className="ml-[13px] flex-1 text-[16px] text-ink">Fermé</span>
        <span className="text-[14px] tracking-[0.01em] text-ink">{shortDateLabel(sensor.at, now)}</span>
      </div>
    </li>
  )
}
