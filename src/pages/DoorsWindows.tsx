import { useEffect, useRef, useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { useDemo } from '../store/demoStore'
import type { Sensor } from '../store/seed'
import { useNow } from '../hooks/useNow'
import { shortDateLabel } from '../lib/time'
import { useI18n } from '../i18n/I18nProvider'
import { DoorIcon } from '../components/icons/Shields'
import { SubPageHeader } from '../components/SubPageHeader'

/** Portes & fenêtres : un capteur par carte. Le crayon ouvre la fenêtre « Emplacement » pour renommer le capteur. */
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
  const { sensorNames, renameSensor } = useDemo()
  const [editing, setEditing] = useState(false)
  const name = sensorNames[sensor.id] ?? t.doorsWindows.sensors[sensor.id]
  return (
    <li className="mx-[7px] mb-[7px] rounded-[7px] bg-card shadow-card">
      <div className="flex min-h-[58px] items-start border-b border-line pt-[13px] pr-[10px] pb-[9px] pl-[17px]">
        <div className="flex min-w-0 flex-1 items-center gap-[12px]">
          <h2 className="truncate text-[16px] font-medium text-ink">{name}</h2>
          <button type="button" onClick={() => setEditing(true)} aria-label={t.doorsWindows.edit(name)} className="shrink-0 p-[2px] text-ink">
            <Pencil size={17} strokeWidth={1.5} />
          </button>
        </div>
        <p className="pt-[2px] pl-[8px] text-right text-[14px] leading-[15px] text-muted">
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
      {editing && (
        <RenameDialog
          initial={name}
          onCancel={() => setEditing(false)}
          onSave={(value) => {
            renameSensor(sensor.id, value)
            setEditing(false)
          }}
        />
      )}
    </li>
  )
}

/**
 * Fenêtre « Emplacement » : champ « Nom » pré-rempli avec le nom actuel, croix pour l'effacer.
 * « Enregistrer » reste grisé tant que le nom est vide ou inchangé ; Entrée enregistre aussi.
 */
function RenameDialog({ initial, onCancel, onSave }: { initial: string; onCancel: () => void; onSave: (name: string) => void }) {
  const { t } = useI18n()
  const d = t.doorsWindows.rename
  const [value, setValue] = useState(initial)
  const input = useRef<HTMLInputElement>(null)
  const trimmed = value.trim()
  const canSave = trimmed !== '' && trimmed !== initial

  useEffect(() => {
    input.current?.focus()
  }, [])

  return (
    <div className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-[600px] items-center justify-center bg-black/60 px-[24px]" onClick={onCancel}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="rename-sensor-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (canSave) onSave(trimmed)
        }}
        className="w-full overflow-hidden rounded-[8px] bg-card shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
      >
        <h2 id="rename-sensor-title" className="flex h-[45px] items-center justify-center border-b border-line text-[17px] font-medium text-ink">
          {d.title}
        </h2>
        <div className="px-[23px] py-[24px]">
          <label className="flex items-center rounded-t-[4px] border-b-2 border-[#9e9e9e] bg-[#efefef] pr-[6px] pl-[15px] focus-within:border-vivid">
            <span className="flex min-w-0 flex-1 flex-col pt-[8px] pb-[6px]">
              <span className="text-[13px] text-muted">{d.label}</span>
              <input
                ref={input}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={30}
                enterKeyHint="done"
                autoComplete="off"
                className="mt-[2px] w-full bg-transparent text-[16px] text-ink caret-vivid outline-none"
              />
            </span>
            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue('')
                  input.current?.focus()
                }}
                aria-label={d.clear}
                className="p-[8px] text-ink"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            )}
          </label>
        </div>
        <div className="grid grid-cols-2 border-t border-line text-[14px] font-medium tracking-[0.06em]">
          <button type="button" onClick={onCancel} className="h-[48px] text-ink active:bg-bg">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={!canSave} className="h-[48px] border-l border-line text-vivid active:bg-bg disabled:opacity-40">
            {d.save}
          </button>
        </div>
      </form>
    </div>
  )
}
