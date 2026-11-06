import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type Ref } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import { Check, ChevronRight, CirclePlus, Clock3, Eye, EyeOff, LockKeyhole, Pencil, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { SubPageHeader } from '../components/SubPageHeader'
import { ShieldCheck, ShieldHalf, ShieldOff } from '../components/icons/Shields'
import { useDemo } from '../store/demoStore'
import { DEMO_CODE } from '../store/seed'
import type { AlarmTarget, RoutineAction, Time, Trigger } from '../store/routines'

const BASE = '/plus/fonctionnalites/routines/nouvelle'


/** Actions « Alors », au plus une de chaque type, dans l'ordre d'ajout. */
type Action = RoutineAction

type Draft = {
  name: string
  setName: (name: string) => void
  trigger: Trigger | null
  setTrigger: (trigger: Trigger) => void
  actions: Action[]
  /** Ajoute l'action, ou remplace celle du même type en gardant sa place. */
  saveAction: (action: Action) => void
}
const DraftCtx = createContext<Draft | null>(null)

/**
 * Parent des écrans de création : garde la routine en cours (nom, déclencheur, actions) pendant qu'on passe de
 * l'un à l'autre. En mémoire seulement : tout est perdu en quittant la création (Annuler, onglets…).
 */
export function RoutineDraft() {
  const [name, setName] = useState('')
  const [trigger, setTrigger] = useState<Trigger | null>(null)
  const [actions, setActions] = useState<Action[]>([])
  const saveAction = (action: Action) =>
    setActions((current) =>
      current.some((a) => a.kind === action.kind) ? current.map((a) => (a.kind === action.kind ? action : a)) : [...current, action],
    )
  return (
    <DraftCtx.Provider value={{ name, setName, trigger, setTrigger, actions, saveAction }}>
      <Outlet />
    </DraftCtx.Provider>
  )
}

function useDraft() {
  const ctx = useContext(DraftCtx)
  if (!ctx) throw new Error('useDraft must be used within RoutineDraft')
  return ctx
}

/**
 * Routines › « + » › Créer une routine. Le crayon ouvre la fenêtre « Nom de la routine » ; le nom saisi
 * remplace le libellé. « Ajouter » ouvre l'écran « Quand ».
 * Une fois le déclencheur défini (via « Terminé »), il s'affiche en carte (le crayon le modifie), « Ajouter » de
 * « Quand » est grisé (un seul déclencheur dans la démo) et la section « Alors » apparaît : son « Ajouter » ouvre
 * l'écran « Alors ». Les actions validées s'y empilent en cartes séparées par « ET » (crayon = modifier) ; « Ajouter »
 * se grise quand les deux types d'action sont présents. « Activer » devient actif avec un déclencheur et au moins
 * une action : il demande le mot de passe (2580 dans la démo), puis crée la routine et revient à la liste.
 */
export function CreateRoutine() {
  const { t } = useI18n()
  const r = t.createRoutine
  const { name, setName, trigger, actions } = useDraft()
  const { addRoutine } = useDemo()
  const navigate = useNavigate()
  const ready = trigger !== null && actions.length > 0
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="flex min-h-full flex-col bg-card">
      <header className="pt-safe sticky top-0 z-20 bg-card">
        <div className="relative flex h-[48px] items-end justify-center border-b border-line pb-[10px]">
          <Link to="/plus/fonctionnalites/routines" className="absolute bottom-[10px] left-[16px] text-[14px] font-medium text-vivid">
            {t.common.cancel}
          </Link>
          <h1 className="text-[16px] font-medium text-ink">{r.title}</h1>
        </div>
      </header>

      <div className="relative flex min-h-[40px] items-center justify-center border-b border-line px-[48px]">
        <h2 className="truncate text-[17px] font-medium text-ink">{name || r.unnamed}</h2>
        <button
          type="button"
          onClick={() => setEditing(true)}
          aria-label={r.editName}
          className="absolute right-[8px] p-[4px] text-vivid"
        >
          <Pencil size={20} strokeWidth={1.4} />
        </button>
      </div>

      <section className="px-[16px]">
        <h3 className="mt-[13px] text-[17px] font-medium text-ink">{r.when}</h3>
        {trigger ? (
          <>
            <SummaryCard
              className="mt-[18px]"
              icon={<Clock3 size={20} strokeWidth={1.5} />}
              text={triggerSummary(trigger, t)}
              to={`${BASE}/quand/moment/precis`}
              editLabel={r.editTrigger}
            />
            <div className="mt-[18px] flex justify-center">
              <AddButton disabled />
            </div>
          </>
        ) : (
          <>
            <p className="mt-[22px] text-[15px] leading-[22px] text-muted">{r.whenHelp}</p>
            <div className="mt-[22px] flex justify-center">
              <AddButton to={`${BASE}/quand`} />
            </div>
          </>
        )}
      </section>

      {trigger && (
        <section className="px-[16px]">
          <h3 className="mt-[24px] text-[17px] font-medium text-ink">{r.then}</h3>
          {actions.length === 0 ? (
            <p className="mt-[22px] text-[15px] leading-[22px] text-muted">{r.thenHelp}</p>
          ) : (
            <div className="mt-[18px]">
              {actions.map((action, i) => (
                <div key={action.kind}>
                  {i > 0 && <p className="py-[8px] text-center text-[12px] tracking-[0.04em] text-muted">{r.and}</p>}
                  <SummaryCard {...actionSummary(action, t)} editLabel={r.editAction} />
                </div>
              ))}
            </div>
          )}
          <div className={`${actions.length === 0 ? 'mt-[22px]' : 'mt-[18px]'} flex justify-center`}>
            {actions.length >= 2 ? <AddButton disabled /> : <AddButton to={`${BASE}/alors`} />}
          </div>
        </section>
      )}

      <div className="sticky bottom-0 mt-auto bg-card px-[16px] pt-[24px] pb-[12px]">
        <button
          type="button"
          disabled={!ready}
          onClick={() => setConfirming(true)}
          className="flex h-[55px] w-full items-center justify-center rounded-[4px] bg-vivid text-[14px] font-medium tracking-[0.1em] text-white active:brightness-90 disabled:bg-[#f69bab]"
        >
          {r.activate}
        </button>
      </div>

      {confirming && trigger && (
        <PasswordDialog
          onCancel={() => setConfirming(false)}
          onSuccess={() => {
            addRoutine({ id: `routine-${Date.now()}`, name: name || r.untitled, trigger, actions, enabled: true })
            navigate('/plus/fonctionnalites/routines')
          }}
        />
      )}

      {editing && (
        <NameDialog
          initial={name}
          onCancel={() => setEditing(false)}
          onDone={(value) => {
            setName(value)
            setEditing(false)
          }}
        />
      )}
    </div>
  )
}

/** Bouton « Ajouter » : lien avec `to`, grisé avec `disabled`, sinon inerte (fonction à venir). */
function AddButton({ to, disabled = false }: { to?: string; disabled?: boolean }) {
  const { t } = useI18n()
  const content = (
    <>
      <CirclePlus size={20} strokeWidth={1.4} />
      {t.createRoutine.add}
    </>
  )
  const base = 'flex h-[40px] items-center gap-[10px] rounded-full pr-[22px] pl-[22px] text-[14px] font-semibold tracking-[0.02em]'
  if (disabled)
    return (
      <span aria-disabled="true" className={`${base} border border-line text-[#b5b5b5]`}>
        {content}
      </span>
    )
  const active = `${base} bg-vivid text-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] active:brightness-90`
  return to ? (
    <Link to={to} className={active}>
      {content}
    </Link>
  ) : (
    <span className={active}>{content}</span>
  )
}

/** Carte récapitulative (déclencheur ou action) : icône, texte, crayon rouge qui rouvre l'écran correspondant. */
function SummaryCard({ icon, text, to, editLabel, className = '' }: { icon: ReactNode; text: string; to: string; editLabel: string; className?: string }) {
  return (
    <div className={`flex min-h-[54px] items-center gap-[13px] rounded-[8px] bg-card py-[8px] pr-[12px] pl-[12px] shadow-[0_2px_6px_rgba(0,0,0,0.14)] ${className}`}>
      <span className="shrink-0 text-ink">{icon}</span>
      <span className="flex-1 text-[16px] leading-[21px] text-ink">{text}</span>
      <Link to={to} aria-label={editLabel} className="p-[4px] text-vivid">
        <Pencil size={20} strokeWidth={1.4} />
      </Link>
    </div>
  )
}

/** Icône, texte et écran d'édition d'une action ajoutée. */
export function actionSummary(action: RoutineAction, t: Dictionary) {
  const r = t.createRoutine
  if (action.kind === 'lock') {
    return { icon: <LockKeyhole size={20} strokeWidth={1.5} />, text: r.lockSummary, to: `${BASE}/alors/verrouillage` }
  }
  const mode = { disarm: t.alarm.off, partial: t.alarm.partial, total: t.alarm.total }[action.target]
  const icon = ALARM_TARGETS.find((a) => a.id === action.target)?.icon
  return { icon, text: r.alarmSummary(mode), to: `${BASE}/alors/alarme` }
}

/** Résumé du déclencheur : « à 23:00 le Semaine », « à 23:00 Tous les jours », ou les jours cochés (« le Lun, Mer »). */
export function triggerSummary({ time, days }: Trigger, t: Dictionary) {
  const clock = formatTime(time)
  if (days.length === 7) return t.createRoutine.dailySummary(clock)
  return t.createRoutine.triggerSummary(clock, daysLabel(days, t))
}

export const formatTime = (time: Time) => `${pad(time.hour)}:${pad(time.minute)}`

/** Jours en clair : nom du raccourci (« Semaine », « Quotidien »…) ou jours cochés (« Lun, Mer »). */
export function daysLabel(days: number[], t: Dictionary) {
  const e = t.createRoutine.exactTime
  const label = (text: string) => text.charAt(0) + text.slice(1).toLowerCase()
  const preset = PRESET_DAYS.findIndex((p) => sameDays(days, p))
  if (preset >= 0) return label(e.presets[preset])
  return [...days]
    .sort((a, b) => a - b)
    .map((d) => label(e.days[d]))
    .join(', ')
}

/**
 * Fenêtre « Mot de passe » avant d'activer la routine. Le mot de passe de la démo est le code 2580.
 * Mauvais mot de passe : la fenêtre reste ouverte avec un message sous le champ (effacé dès qu'on retape).
 */
function PasswordDialog({ onCancel, onSuccess }: { onCancel: () => void; onSuccess: () => void }) {
  const { t } = useI18n()
  const d = t.createRoutine.passwordDialog
  const [value, setValue] = useState('')
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    input.current?.focus()
  }, [])

  return (
    <div className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-[600px] items-center justify-center bg-black/60 px-[24px]" onClick={onCancel}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="routine-password-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (!value) return
          if (value === DEMO_CODE) onSuccess()
          else {
            setError(true)
            input.current?.select()
          }
        }}
        className="w-full overflow-hidden rounded-[8px] bg-card shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
      >
        <h2 id="routine-password-title" className="flex h-[45px] items-center justify-center border-b border-line text-[17px] font-medium text-ink">
          {d.title}
        </h2>
        <div className="px-[23px] pt-[18px] pb-[24px]">
          <p className="text-center text-[14px] leading-[20px] text-ink">{d.prompt}</p>
          <div
            className={`mt-[18px] flex items-center rounded-t-[4px] border-b-2 bg-[#efefef] pr-[6px] pl-[15px] focus-within:border-vivid ${error ? 'border-vivid' : 'border-[#9e9e9e]'}`}
          >
            <input
              ref={input}
              type={visible ? 'text' : 'password'}
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError(false)
              }}
              aria-label={d.label}
              aria-invalid={error}
              autoComplete="current-password"
              enterKeyHint="go"
              className="h-[52px] min-w-0 flex-1 bg-transparent text-[16px] text-ink caret-vivid outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={() => {
                  setValue('')
                  setError(false)
                  input.current?.focus()
                }}
                aria-label={d.clear}
                className="p-[8px] text-muted"
              >
                <X size={20} strokeWidth={1.8} />
              </button>
            )}
            <button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? d.hide : d.show} className="p-[8px] text-muted">
              {visible ? <EyeOff size={20} strokeWidth={1.8} /> : <Eye size={20} strokeWidth={1.8} />}
            </button>
          </div>
          {error && (
            <p role="alert" className="mt-[6px] text-[13px] text-vivid">
              {d.error}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 border-t border-line text-[14px] font-medium tracking-[0.06em]">
          <button type="button" onClick={onCancel} className="h-[48px] text-ink active:bg-bg">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={!value} className="h-[48px] border-l border-line text-vivid active:bg-bg disabled:opacity-40">
            {d.continue}
          </button>
        </div>
      </form>
    </div>
  )
}

/** Fenêtre « Nom de la routine » : champ à libellé intégré ; « Terminé » reste grisé tant que le champ est vide. */
function NameDialog({ initial, onCancel, onDone }: { initial: string; onCancel: () => void; onDone: (name: string) => void }) {
  const { t } = useI18n()
  const d = t.createRoutine.nameDialog
  const [value, setValue] = useState(initial)
  const input = useRef<HTMLInputElement>(null)
  const trimmed = value.trim()

  useEffect(() => {
    input.current?.focus()
  }, [])

  return (
    <div className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-[600px] items-center justify-center bg-black/60 px-[24px]" onClick={onCancel}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="routine-name-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (trimmed) onDone(trimmed)
        }}
        className="w-full overflow-hidden rounded-[8px] bg-card shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
      >
        <h2 id="routine-name-title" className="flex h-[45px] items-center justify-center border-b border-line text-[17px] font-medium text-ink">
          {d.title}
        </h2>
        <div className="px-[23px] pt-[24px] pb-[24px]">
          <p className="text-[14px] text-muted">{d.prompt}</p>
          <label className="mt-[14px] block rounded-t-[4px] border-b-2 border-[#9e9e9e] bg-[#efefef] px-[15px] pt-[8px] pb-[6px] focus-within:border-vivid">
            <span className="block text-[13px] text-muted">{d.label}</span>
            <input
              ref={input}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={40}
              enterKeyHint="done"
              autoComplete="off"
              className="mt-[2px] w-full bg-transparent text-[16px] text-ink outline-none"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 border-t border-line text-[14px] font-medium tracking-[0.06em]">
          <button type="button" onClick={onCancel} className="h-[48px] text-ink active:bg-bg">
            {t.common.cancel}
          </button>
          <button type="submit" disabled={!trimmed} className="h-[48px] border-l border-line text-vivid active:bg-bg disabled:opacity-40">
            {d.done}
          </button>
        </div>
      </form>
    </div>
  )
}

/** Créer une routine › Ajouter : choix du déclencheur. Une seule option pour l'instant. */
export function RoutineTriggers() {
  const { t } = useI18n()
  const tr = t.createRoutine.triggers
  return (
    <div className="min-h-full">
      <SubPageHeader title={tr.title} backTo={BASE} tabs={false} />
      <ul className="bg-card">
        <OptionRow text={tr.atTime} to={`${BASE}/quand/moment`} />
      </ul>
    </div>
  )
}

/** Quand › À un certain moment : type de moment. */
export function RoutineTimeTriggers() {
  const { t } = useI18n()
  const tt = t.createRoutine.timeTriggers
  return (
    <div className="min-h-full">
      <SubPageHeader title={t.createRoutine.triggers.atTime} backTo={`${BASE}/quand`} tabs={false} />
      <h2 className="border-b border-line px-[12px] pt-[13px] pb-[10px] text-[16px] font-medium text-ink">{tt.when}</h2>
      <ul className="bg-card">
        <OptionRow text={tt.exact} to={`${BASE}/quand/moment/precis`} />
      </ul>
    </div>
  )
}

/** Heure proposée par défaut dans le champ : l'heure actuelle à l'ouverture de l'écran. */
const currentTime = (): Time => {
  const now = new Date()
  return { hour: now.getHours(), minute: now.getMinutes() }
}
const pad = (n: number) => String(n).padStart(2, '0')
/** Jours (0 = lundi … 6 = dimanche) sélectionnés par chaque raccourci, dans l'ordre Semaine, Week-end, Quotidien. */
const PRESET_DAYS = [
  [0, 1, 2, 3, 4],
  [5, 6],
  [0, 1, 2, 3, 4, 5, 6],
]

const sameDays = (a: number[], b: number[]) => a.length === b.length && a.every((d) => b.includes(d))

/**
 * À un certain moment › Un moment précis : heure et jours de déclenchement.
 * Les jours se sélectionnent (passage en négatif). Un raccourci remplace la sélection par ses jours et apparaît
 * en négatif quand la sélection correspond exactement ; le toucher à nouveau vide la sélection.
 * Le champ d'heure ouvre la fenêtre « Sélectionner l'heure » ; OK met à jour l'heure sans quitter l'écran.
 * « Terminé » (grisé tant qu'aucun jour n'est choisi) enregistre le déclencheur et revient à « Créer une routine ».
 * Rouvert depuis le crayon, l'écran reprend le déclencheur enregistré.
 */
export function RoutineExactTime() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { trigger, setTrigger } = useDraft()
  const [days, setDays] = useState<number[]>(() => trigger?.days ?? [])
  const [time, setTime] = useState<Time>(() => trigger?.time ?? currentTime())
  const [picking, setPicking] = useState(false)
  const toggleDay = (i: number) => setDays((current) => (current.includes(i) ? current.filter((d) => d !== i) : [...current, i]))
  const e = t.createRoutine.exactTime
  const when = t.createRoutine.timeTriggers.when
  return (
    <div className="flex min-h-full flex-col">
      <SubPageHeader title={t.createRoutine.triggers.atTime} backTo={`${BASE}/quand/moment`} tabs={false} />
      <h2 className="border-b border-line px-[12px] pt-[13px] pb-[10px] text-[16px] font-medium text-ink">{when}</h2>

      <section className="border-b border-line bg-card px-[12px] pt-[14px] pb-[8px]">
        <div className="flex items-center gap-[13px]">
          <Clock3 size={20} strokeWidth={1.5} className="shrink-0 text-ink" />
          <span className="text-[16px] text-ink">{t.createRoutine.timeTriggers.exact}</span>
        </div>
        <button
          type="button"
          onClick={() => setPicking(true)}
          aria-label={`${e.editTime} : ${pad(time.hour)}:${pad(time.minute)}`}
          className="mt-[16px] flex h-[34px] w-full items-center rounded-[4px] border border-[#c8c8c8] bg-card px-[8px] text-[15px] font-semibold text-ink active:bg-bg"
        >
          {pad(time.hour)}:{pad(time.minute)}
        </button>
      </section>

      <h3 className="border-b border-line px-[12px] pt-[12px] pb-[10px] text-[16px] text-ink">{when}</h3>

      <section className="bg-card px-[17px] pt-[12px] pb-[12px]">
        <ul className="flex justify-between">
          {e.days.map((day, i) => {
            const selected = days.includes(i)
            return (
              <li key={day}>
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleDay(i)}
                  className={`flex h-[40px] w-[40px] items-center justify-center rounded-full border text-[12px] font-medium ${
                    selected ? 'border-ink bg-ink text-white' : 'border-[#c8c8c8] bg-card text-ink'
                  }`}
                >
                  {day}
                </button>
              </li>
            )
          })}
        </ul>
        <ul className="mt-[12px] grid grid-cols-3 gap-[5px]">
          {e.presets.map((preset, i) => {
            const active = sameDays(days, PRESET_DAYS[i])
            return (
              <li key={preset}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setDays(active ? [] : PRESET_DAYS[i])}
                  className={`flex h-[38px] w-full items-center justify-center rounded-full border text-[12px] font-medium tracking-[0.04em] ${
                    active ? 'border-ink bg-ink text-white' : 'border-[#c8c8c8] bg-card text-ink'
                  }`}
                >
                  {preset}
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <div className="sticky bottom-0 mt-auto px-[16px] pt-[24px] pb-[12px]">
        <button
          type="button"
          disabled={days.length === 0}
          onClick={() => {
            setTrigger({ time, days })
            navigate(BASE)
          }}
          className="flex h-[55px] w-full items-center justify-center rounded-[4px] border border-[#c8c8c8] bg-card text-[14px] font-medium tracking-[0.1em] text-vivid active:bg-bg disabled:opacity-40"
        >
          {e.done}
        </button>
      </div>

      {picking && (
        <TimePickerDialog
          initial={time}
          onCancel={() => setPicking(false)}
          onDone={(value) => {
            setTime(value)
            setPicking(false)
          }}
        />
      )}
    </div>
  )
}

/** Créer une routine › Alors › Ajouter : choix de l'action. */
export function RoutineActions() {
  const { t } = useI18n()
  const a = t.createRoutine.actions
  return (
    <div className="min-h-full">
      <header className="pt-safe sticky top-0 z-20 bg-bg">
        <div className="relative flex h-[48px] items-end justify-center border-b border-line pb-[10px]">
          <Link to={BASE} className="absolute bottom-[10px] left-[16px] text-[14px] font-medium text-vivid">
            {t.common.cancel}
          </Link>
          <h1 className="text-[16px] font-medium text-ink">{a.title}</h1>
        </div>
      </header>
      <ul className="bg-card">
        <OptionRow icon={<AlarmStatusIcon />} text={a.alarm} to={`${BASE}/alors/alarme`} />
        <OptionRow icon={<LockKeyhole size={20} strokeWidth={1.5} />} text={a.lock} to={`${BASE}/alors/verrouillage`} />
      </ul>
    </div>
  )
}

export const ALARM_TARGETS: { id: AlarmTarget; icon: ReactNode }[] = [
  { id: 'disarm', icon: <ShieldOff size={20} /> },
  { id: 'partial', icon: <ShieldHalf size={20} /> },
  { id: 'total', icon: <ShieldCheck size={20} checkColor="#fff" /> },
]

/**
 * Alors › Changer le statut d'alarme : choix du mode cible (un seul, boutons radio).
 * « Terminé » (grisé tant que rien n'est choisi) enregistre l'action et revient à « Créer une routine ».
 * Rouvert depuis le crayon, l'écran reprend le mode enregistré.
 */
export function RoutineAlarmAction() {
  const { t } = useI18n()
  const a = t.createRoutine.alarmAction
  const navigate = useNavigate()
  const { actions, saveAction } = useDraft()
  const [target, setTarget] = useState<AlarmTarget | null>(() => {
    const saved = actions.find((x) => x.kind === 'alarm')
    return saved?.kind === 'alarm' ? saved.target : null
  })
  return (
    <div className="flex min-h-full flex-col">
      <SubPageHeader title={a.title} backTo={`${BASE}/alors`} tabs={false} />
      <h2 className="border-b border-line px-[12px] pt-[13px] pb-[10px] text-[16px] text-ink">{a.to}</h2>
      <ul role="radiogroup" aria-label={a.to} className="bg-card">
        {ALARM_TARGETS.map(({ id, icon }) => {
          const checked = target === id
          return (
            <li key={id} className="border-b border-line">
              <button
                type="button"
                role="radio"
                aria-checked={checked}
                onClick={() => setTarget(id)}
                className="flex h-[48px] w-full items-center gap-[13px] pr-[20px] pl-[12px] text-left active:bg-bg"
              >
                <span className="shrink-0 text-ink">{icon}</span>
                <span className="flex-1 text-[16px] text-ink">{a.options[id]}</span>
                <RadioMark checked={checked} />
              </button>
            </li>
          )
        })}
      </ul>
      <p className="px-[12px] pt-[14px] text-[14px] leading-[21px] text-muted">{a.note}</p>

      <DoneBar
        disabled={!target}
        onDone={() => {
          if (!target) return
          saveAction({ kind: 'alarm', target })
          navigate(BASE)
        }}
      />
    </div>
  )
}

/**
 * Alors › Changer le statut de verrouillage : serrure concernée (case à cocher) et état cible.
 * « Verrouillé » est la seule cible, donc toujours sélectionnée. « Terminé » (grisé tant qu'aucune serrure n'est
 * cochée) enregistre l'action et revient à « Créer une routine ». Rouvert depuis le crayon, la porte est cochée.
 */
export function RoutineLockAction() {
  const { t } = useI18n()
  const l = t.createRoutine.lockAction
  const navigate = useNavigate()
  const { actions, saveAction } = useDraft()
  const [door, setDoor] = useState(() => actions.some((x) => x.kind === 'lock'))
  const lock = <LockKeyhole size={20} strokeWidth={1.5} className="shrink-0 text-ink" />
  return (
    <div className="flex min-h-full flex-col">
      <SubPageHeader title={t.createRoutine.actions.lock} backTo={`${BASE}/alors`} tabs={false} />
      <h2 className="border-b border-line px-[12px] pt-[13px] pb-[10px] text-[16px] text-ink">{l.where}</h2>
      <button
        type="button"
        role="checkbox"
        aria-checked={door}
        onClick={() => setDoor(!door)}
        className="flex h-[48px] w-full items-center gap-[13px] border-b border-line bg-card pr-[20px] pl-[12px] text-left active:bg-bg"
      >
        {lock}
        <span className="flex-1 text-[16px] text-ink">{t.doorName}</span>
        <span
          className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-[3px] border-2 ${door ? 'border-vivid bg-vivid' : 'border-ink'}`}
        >
          {door && <Check size={14} strokeWidth={3} className="text-white" />}
        </span>
      </button>
      <h2 className="border-b border-line px-[12px] pt-[13px] pb-[10px] text-[16px] text-ink">{l.to}</h2>
      <div role="radiogroup" aria-label={l.to} className="flex h-[48px] items-center gap-[13px] border-b border-line bg-card pr-[20px] pl-[12px]">
        {lock}
        <span className="flex-1 text-[16px] text-ink">{l.locked}</span>
        <span role="radio" aria-checked="true" aria-label={l.locked}>
          <RadioMark checked />
        </span>
      </div>

      <DoneBar
        disabled={!door}
        onDone={() => {
          saveAction({ kind: 'lock' })
          navigate(BASE)
        }}
      />
    </div>
  )
}

/** Rond de bouton radio : contour, point rouge quand sélectionné. */
function RadioMark({ checked }: { checked: boolean }) {
  return (
    <span className={`flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-2 ${checked ? 'border-vivid' : 'border-ink'}`}>
      {checked && <span className="h-[10px] w-[10px] rounded-full bg-vivid" />}
    </span>
  )
}

/** Barre « Terminé » en pied des écrans d'action. */
function DoneBar({ disabled, onDone }: { disabled: boolean; onDone: () => void }) {
  const { t } = useI18n()
  return (
    <div className="sticky bottom-0 mt-auto px-[16px] pt-[24px] pb-[12px]">
      <button
        type="button"
        disabled={disabled}
        onClick={onDone}
        className="flex h-[55px] w-full items-center justify-center rounded-[4px] border border-[#c8c8c8] bg-card text-[14px] font-medium tracking-[0.1em] text-vivid active:bg-bg disabled:opacity-40"
      >
        {t.createRoutine.alarmAction.done}
      </button>
    </div>
  )
}

/** Statut d'alarme : bouclier au centre d'un cycle de trois points (d'après la capture). */
function AlarmStatusIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round">
      <path d="M7.2 5.2A8.5 8.5 0 0 1 16.8 5.2" />
      <path d="M20.3 11.2a8.5 8.5 0 0 1-4.6 8.4" />
      <path d="M8.3 19.6a8.5 8.5 0 0 1-4.6-8.4" />
      <circle cx={5.4} cy={6.6} r={1.6} />
      <circle cx={18.6} cy={6.6} r={1.6} />
      <circle cx={12} cy={20.6} r={1.6} />
      <path d="M12 8.2 8.8 9.4v2.6c0 2 1.4 3.5 3.2 4.1 1.8-.6 3.2-2.1 3.2-4.1V9.4Z" strokeLinejoin="round" />
    </svg>
  )
}

/** Ligne d'option : icône (horloge par défaut), libellé, chevron rouge. Avec `to`, la ligne est un lien. */
function OptionRow({ text, to, icon = <Clock3 size={20} strokeWidth={1.5} /> }: { text: string; to?: string; icon?: ReactNode }) {
  const content = (
    <>
      <span className="shrink-0 text-ink">{icon}</span>
      <span className="flex-1 text-[16px] text-ink">{text}</span>
      <ChevronRight size={22} strokeWidth={1.6} className="shrink-0 text-vivid" />
    </>
  )
  const className = 'flex h-[55px] items-center gap-[13px] pr-[14px] pl-[12px]'
  return (
    <li className="border-b border-line">
      {to ? (
        <Link to={to} className={`${className} active:bg-bg`}>
          {content}
        </Link>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  )
}

/**
 * Fenêtre « Sélectionner l'heure » (saisie au clavier) : deux cases heure / minute.
 * La case heure est active à l'ouverture ; une fois l'heure complète, on passe aux minutes.
 * Seule une heure existante peut être saisie : un chiffre qui donnerait plus de 23 h ou 59 min est refusé,
 * et un premier chiffre qui ne peut pas commencer un nombre à deux chiffres est complété (« 7 » → « 07 »).
 * OK reste grisé tant qu'une case est vide. L'icône cadran est inerte.
 */
function TimePickerDialog({ initial, onCancel, onDone }: { initial: Time; onCancel: () => void; onDone: (time: Time) => void }) {
  const { t } = useI18n()
  const p = t.createRoutine.timePicker
  const [hour, setHour] = useState(pad(initial.hour))
  const [minute, setMinute] = useState(pad(initial.minute))
  const hourInput = useRef<HTMLInputElement>(null)
  const minuteInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    hourInput.current?.focus()
    hourInput.current?.select()
  }, [])

  const valid = hour !== '' && minute !== ''

  /** Complète une case laissée à un chiffre (mise à jour fonctionnelle : la valeur peut avoir changé juste avant). */
  const padOne = (v: string) => (v.length === 1 ? `0${v}` : v)

  /** Nouvelle valeur d'une case bornée à `max`, ou null si la saisie donnerait une heure impossible. */
  const constrain = (value: string, max: number): string | null => {
    const next = value.replace(/\D/g, '').slice(0, 2)
    if (Number(next) > max) return null
    // Un seul chiffre qui ne peut plus être suivi d'un autre (ex. « 7 » pour l'heure) : on complète.
    if (next.length === 1 && Number(next) * 10 > max) return `0${next}`
    return next
  }

  return (
    <div className="animate-fade-in fixed inset-0 z-50 mx-auto flex max-w-[600px] items-center justify-center bg-black/60 px-[24px]" onClick={onCancel}>
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="time-picker-title"
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) onDone({ hour: Number(hour), minute: Number(minute) })
        }}
        className="w-full max-w-[260px] rounded-[4px] bg-card px-[24px] pt-[20px] pb-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.25)]"
      >
        <h2 id="time-picker-title" className="text-[10px] font-medium tracking-[0.12em] text-muted">
          {p.title}
        </h2>
        <div className="mt-[22px] flex items-start gap-[8px]">
          <TimeBox
            ref={hourInput}
            label={p.hour}
            value={hour}
            onChange={(value) => {
              const next = constrain(value, 23)
              if (next === null) return
              setHour(next)
              if (next.length === 2) {
                minuteInput.current?.focus()
                minuteInput.current?.select()
              }
            }}
            onBlur={() => setHour(padOne)}
          />
          <span className="pt-[6px] text-[44px] leading-[60px] text-ink">:</span>
          <TimeBox
            ref={minuteInput}
            label={p.minute}
            value={minute}
            onChange={(value) => {
              const next = constrain(value, 59)
              if (next !== null) setMinute(next)
            }}
            onBlur={() => setMinute(padOne)}
          />
        </div>
        <div className="mt-[24px] flex items-center">
          <span aria-label={p.dial} role="img" className="p-[4px] text-ink">
            <Clock3 size={20} strokeWidth={2} />
          </span>
          <div className="flex-1" />
          <button type="button" onClick={onCancel} className="px-[12px] py-[10px] text-[14px] font-medium tracking-[0.06em] text-ink">
            {p.cancel}
          </button>
          <button type="submit" disabled={!valid} className="px-[12px] py-[10px] text-[14px] font-medium tracking-[0.06em] text-ink disabled:opacity-40">
            {p.ok}
          </button>
        </div>
      </form>
    </div>
  )
}

/** Case de saisie heure ou minute : grands chiffres, fond gris, contour foncé quand elle a le focus. */
function TimeBox({
  ref,
  label,
  value,
  onChange,
  onBlur,
}: {
  ref: Ref<HTMLInputElement>
  label: string
  value: string
  onChange: (value: string) => void
  onBlur: () => void
}) {
  return (
    <label className="flex flex-1 flex-col">
      <input
        ref={ref}
        value={value}
        onChange={(e) => {
          // Saisie façon cadran numérique : un chiffre tapé s'ajoute à la fin, quelle que soit la position du curseur ;
          // si la case était pleine, il recommence la saisie. Effacement et collage gardent la valeur du champ.
          const typed = (e.nativeEvent as InputEvent).data
          if (typed && /^\d$/.test(typed)) onChange(value.length >= 2 ? typed : `${value}${typed}`)
          else onChange(e.target.value)
        }}
        onFocus={(e) => e.target.select()}
        onBlur={onBlur}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        className="no-spinner h-[72px] w-full rounded-[4px] border-2 border-transparent bg-[#e8e8e8] text-center text-[48px] text-ink outline-none focus:border-ink focus:bg-[#c8c8c8]"
      />
      <span className="mt-[4px] text-[11px] text-ink">{label}</span>
    </label>
  )
}
