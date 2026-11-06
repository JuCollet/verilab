import { useState, type ReactNode } from 'react'
import { Navigate, useParams } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { SubPageHeader } from '../components/SubPageHeader'
import { useI18n } from '../i18n/I18nProvider'
import { CAMERAS, CAMERA_SERIALS, type CameraId } from '../store/seed'

type Access = 'always' | 'armed' | 'never'

/**
 * Caméras › roue crantée : paramètres d'une caméra. Le choix d'accès et les interrupteurs fonctionnent
 * (en mémoire, remis à zéro en quittant l'écran) ; « Emplacement » est inerte.
 */
export function CameraSettings() {
  const { t } = useI18n()
  const s = t.cameras.settings
  const id = useParams().id as CameraId
  const [access, setAccess] = useState<Access>('always')
  const [autoSave, setAutoSave] = useState(true)
  const [sound, setSound] = useState(true)
  const [led, setLed] = useState(false)
  if (!CAMERAS.includes(id)) return <Navigate to="/cameras" replace />
  const name = t.cameras.names[id]

  return (
    <div className="min-h-full pb-[24px]">
      <SubPageHeader title={s.title} backTo="/cameras" tabs={false} />
      <div className="mx-[8px] mt-[8px] bg-card shadow-card">
        <Row>
          <div className="flex items-center justify-between">
            <span className="text-[16px] text-ink">{s.location}</span>
            <span className="text-[16px] text-vivid">{name.charAt(0).toUpperCase() + name.slice(1)}</span>
          </div>
        </Row>
        <Row>
          <h2 className="text-[16px] text-ink">{s.access}</h2>
          <p className="mt-[4px] text-[14px] leading-[21px] text-muted">{s.accessHelp}</p>
          <label className="relative mt-[10px] block">
            <select
              value={access}
              onChange={(e) => setAccess(e.target.value as Access)}
              aria-label={s.access}
              className="h-[40px] w-full appearance-none rounded-[2px] border border-[#9e9e9e] bg-card pr-[40px] pl-[11px] text-[16px] text-ink outline-none focus:border-ink"
            >
              {(Object.keys(s.accessOptions) as Access[]).map((option) => (
                <option key={option} value={option}>
                  {s.accessOptions[option]}
                </option>
              ))}
            </select>
            <ChevronDown size={18} strokeWidth={1.6} className="pointer-events-none absolute top-1/2 right-[12px] -translate-y-1/2 text-ink" />
          </label>
          <ul className="mt-[12px] flex flex-col gap-[10px] pl-[2px]">
            {s.notes.map((note) => (
              <li key={note} className="flex gap-[12px] text-[14px] leading-[21px] text-muted">
                <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-muted" />
                {note}
              </li>
            ))}
          </ul>
        </Row>
        <SwitchRow title={s.autoSave} checked={autoSave} onChange={setAutoSave} />
        <SwitchRow title={s.sound} help={s.soundHelp} checked={sound} onChange={setSound} />
        <SwitchRow title={s.led} help={s.ledHelp} checked={led} onChange={setLed} last />
      </div>

      <div className="mx-[8px] mt-[20px] flex h-[48px] items-center justify-between bg-card px-[16px] shadow-card">
        <span className="text-[16px] text-ink">{s.serial}</span>
        <span className="text-[15px] text-muted">{CAMERA_SERIALS[id]}</span>
      </div>
    </div>
  )
}

function Row({ children, last = false }: { children: ReactNode; last?: boolean }) {
  return <div className={`px-[16px] py-[14px] ${last ? '' : 'border-b border-line'}`}>{children}</div>
}

/** Ligne titre (+ aide) avec interrupteur vert à droite. */
function SwitchRow({ title, help, checked, onChange, last = false }: { title: string; help?: string; checked: boolean; onChange: (value: boolean) => void; last?: boolean }) {
  return (
    <Row last={last}>
      <div className="flex items-center gap-[16px]">
        <div className="flex-1">
          <h2 className="text-[16px] leading-[22px] text-ink">{title}</h2>
          {help && <p className="mt-[4px] text-[14px] leading-[21px] text-muted">{help}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          onClick={() => onChange(!checked)}
          className={`flex h-[29px] w-[47px] shrink-0 items-center rounded-full p-[3px] transition-colors ${checked ? 'bg-[#1e8a3c]' : 'bg-[#c8c8c8]'}`}
        >
          <span className={`h-[23px] w-[23px] rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-[18px]' : ''}`} />
        </button>
      </div>
    </Row>
  )
}
