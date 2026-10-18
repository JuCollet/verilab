import { useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useDemo } from '../store/demoStore'
import { ASSIGNABLE_ROLES } from '../store/seed'

type Role = (typeof ASSIGNABLE_ROLES)[number]

/** Indicatifs proposés ; le drapeau est dessiné en bandes CSS (sens + couleurs). */
const COUNTRIES = [
  { code: 'BE', dial: '+32', dir: 'to right', colors: ['#000', '#fdda24', '#ef3340'] },
  { code: 'NL', dial: '+31', dir: 'to bottom', colors: ['#ae1c28', '#fff', '#21468b'] },
  { code: 'LU', dial: '+352', dir: 'to bottom', colors: ['#ed2939', '#fff', '#00a1de'] },
  { code: 'FR', dial: '+33', dir: 'to right', colors: ['#002654', '#fff', '#ce1126'] },
  { code: 'DE', dial: '+49', dir: 'to bottom', colors: ['#000', '#dd0000', '#ffce00'] },
] as const

type Country = (typeof COUNTRIES)[number]['code']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const digits = (value: string) => value.replace(/\D/g, '')
/** Vide, ou entre 8 et 10 chiffres (format national, sans l'indicatif). */
const phoneValid = (value: string) => !value || (digits(value).length >= 8 && digits(value).length <= 10)
const dialOf = (country: Country) => COUNTRIES.find((c) => c.code === country)!.dial
/** Numéro complet tel que saisi (même invalide), ou null si le champ est vide. */
const fullNumber = (country: Country, value: string) => (value.trim() ? `${dialOf(country)} ${value.trim()}` : null)

/** Plus › Utilisateurs › Ajouter. Plein écran, sans barre d'onglets ; l'utilisateur est ajouté au store (mémoire seule). */
export function AddUser() {
  const { t } = useI18n()
  const f = t.users.form
  const { addUser } = useDemo()
  const navigate = useNavigate()
  const from = (useLocation().state as { from?: string } | null)?.from

  const [role, setRole] = useState<Role>('noAccess')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState({ country: 'BE' as Country, value: '' })
  const [alt, setAlt] = useState({ country: 'BE' as Country, value: '' })
  const [email, setEmail] = useState('')
  const [emergency, setEmergency] = useState(false)

  const errors = {
    name: !name.trim() ? f.nameError : undefined,
    // Numéros et e-mail facultatifs : l'erreur de format est affichée mais ne bloque pas la sauvegarde.
    mobile: !phoneValid(mobile.value) ? f.phoneError : undefined,
    alt: !phoneValid(alt.value) ? f.phoneError : undefined,
    email: email && !EMAIL.test(email.trim()) ? f.emailError : undefined,
  }
  const canSave = !errors.name

  // Retour vers la liste, en conservant l'écran d'origine (Plus ou Support).
  const close = () => navigate('/plus/utilisateurs', { replace: true, state: { from } })

  const save = () => {
    if (!canSave) return
    addUser({
      name: name.trim().replace(/\s+/g, ' '),
      role,
      contactRoles: emergency ? ['emergencyContact'] : [],
      access: [],
      notifications: [],
      phone: fullNumber(mobile.country, mobile.value),
      altPhone: fullNumber(alt.country, alt.value),
      email: email.trim() || null,
    })
    close()
  }

  return (
    <div className="mx-auto flex h-dvh max-w-[600px] flex-col bg-card">
      <div className="pt-safe shrink-0 bg-bg">
        <div className="h-[30px]" />
      </div>
      <h1 className="flex h-[40px] shrink-0 items-center justify-center border-b border-[#c8c8c8] text-[16px] text-ink">
        {f.title}
      </h1>

      <form
        id="add-user"
        noValidate
        className="flex-1 overflow-y-auto overscroll-contain"
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
      >
        <section className="border-b border-[#c8c8c8] px-[16px] pt-[17px] pb-[20px]">
          <SectionHeading title={f.roleTitle} />
          <p className="mt-[5px] text-[14px] text-muted">{f.roleHint}</p>
          <RoleSelect value={role} onChange={setRole} />
          <p className="mt-[10px] text-[12px] leading-[24px] text-muted">{f.roleDescriptions[role]}</p>
        </section>

        <section className="flex flex-col gap-[16px] border-b border-[#c8c8c8] px-[16px] pt-[24px] pb-[32px]">
          <TextField label={`${f.name} *`} value={name} onChange={setName} error={errors.name} autoComplete="name" autoCapitalize="words" />
          <PhoneField label={f.mobile} {...mobile} onChange={setMobile} error={errors.mobile} />
          <PhoneField label={f.altPhone} {...alt} onChange={setAlt} error={errors.alt} />
          <TextField label={f.email} value={email} onChange={setEmail} error={errors.email} type="email" autoComplete="email" inputMode="email" autoCapitalize="none" />
        </section>

        <section className="border-b border-[#c8c8c8] px-[16px] pt-[17px] pb-[20px]">
          <SectionHeading title={f.emergencyTitle} />
          <label className="mt-[2px] flex items-center justify-between">
            <span className="text-[16px] text-ink">{f.emergencyToggle}</span>
            <Switch checked={emergency} onChange={setEmergency} />
          </label>
          <p className="mt-[4px] text-[14px] text-muted">{f.emergencyHint}</p>
        </section>
      </form>

      <footer className="pb-safe shrink-0 border-t border-[#c8c8c8] bg-card">
        <div className="flex h-[42px] text-[14px] font-medium tracking-[0.02em]">
          <button type="button" onClick={close} className="flex-1 text-ink">
            {t.common.cancel}
          </button>
          <span className="w-px bg-[#c8c8c8]" />
          <button type="submit" form="add-user" disabled={!canSave} className="flex-1 text-brand disabled:cursor-default disabled:text-brand-soft">
            {f.save}
          </button>
        </div>
      </footer>
    </div>
  )
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[16px] text-ink">{title}</h2>
      <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#222] text-[11px] font-semibold text-white">?</span>
    </div>
  )
}

/** Menu déroulant du rôle : la liste s'ouvre par-dessus la description, comme sur la capture. */
function RoleSelect({ value, onChange }: { value: Role; onChange: (role: Role) => void }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const listId = useId()
  return (
    <div className="relative mt-[6px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen(!open)}
        className={`flex h-[38px] w-full items-center justify-between rounded-[3px] border px-[15px] text-[13px] font-medium tracking-[0.08em] text-ink uppercase ${
          open ? 'border-transparent bg-[#e8e8e8]' : 'border-[#c8c8c8] bg-card'
        }`}
      >
        {t.users.roles[value]}
        <svg width={10} height={5} viewBox="0 0 10 5" className="mr-[8px]">
          <path d="M0 0h10L5 5Z" fill="currentColor" />
        </svg>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <ul id={listId} role="listbox" className="animate-fade-in absolute inset-x-0 top-[46px] z-40 rounded-[3px] bg-card py-[3px] shadow-[0_3px_10px_rgba(0,0,0,0.2)]">
            {ASSIGNABLE_ROLES.map((role) => (
              <li
                key={role}
                role="option"
                aria-selected={role === value}
                onClick={() => {
                  onChange(role)
                  setOpen(false)
                }}
                className={`flex h-[39px] cursor-pointer items-center px-[16px] text-[16px] text-ink ${role === value ? 'bg-[#f2f2f2]' : ''}`}
              >
                {t.users.roles[role]}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

type FieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>

/** Champ « filled » : fond gris, libellé flottant, trait du bas rouge en cas d'erreur. */
function TextField({ label, value, onChange, error, ...rest }: FieldProps) {
  return (
    <FieldShell error={error}>
      <FloatingInput label={label} value={value} onChange={onChange} error={error} className="px-[9px]" {...rest} />
    </FieldShell>
  )
}

function PhoneField({
  label,
  country,
  value,
  onChange,
  error,
}: {
  label: string
  country: Country
  value: string
  onChange: (next: { country: Country; value: string }) => void
  error?: string
}) {
  const current = COUNTRIES.find((c) => c.code === country)!
  return (
    <FieldShell error={error}>
      <div className="flex">
        {/* Le <select> natif, invisible, couvre le drapeau : sélecteur système sur mobile. */}
        <label className="relative flex shrink-0 items-center gap-[4px] self-stretch bg-card pt-[14px] pr-[13px] pl-[8px]">
          <Flag {...current} />
          <span className="text-[13px] text-ink">{current.dial}</span>
          <ChevronDown size={14} strokeWidth={1.5} className="text-brand" />
          <select
            value={country}
            aria-label={label}
            onChange={(e) => onChange({ country: e.target.value as Country, value })}
            className="absolute inset-0 cursor-pointer opacity-0"
          >
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} {c.dial}
              </option>
            ))}
          </select>
        </label>
        <FloatingInput
          label={label}
          value={value}
          onChange={(next) => onChange({ country, value: next.replace(/[^\d ]/g, '') })}
          error={error}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className="px-[8px]"
        />
      </div>
    </FieldShell>
  )
}

function FieldShell({ error, children }: { error?: string; children: ReactNode }) {
  return (
    <div>
      <div className={`overflow-hidden rounded-t-[3px] border-b bg-[#e8e8e8] ${error ? 'border-brand' : 'border-[#b8b8b8]'}`}>{children}</div>
      {error && <p className="mt-[5px] text-[12px] text-brand">{error}</p>}
    </div>
  )
}

function FloatingInput({ label, value, onChange, error, className = '', ...rest }: FieldProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const raised = focused || value.length > 0
  return (
    // Libellé en absolu sans `left` : il garde sa position statique, donc le padding du conteneur.
    <div className={`relative flex h-[38px] flex-1 flex-col justify-end pb-[4px] ${className}`}>
      <label
        htmlFor={id}
        className={`pointer-events-none absolute transition-all duration-150 ${raised ? 'top-[3px] text-[10px]' : 'top-[10px] text-[14px]'} ${
          error ? 'text-brand' : 'text-muted'
        }`}
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-invalid={!!error}
        className="h-[20px] w-full min-w-0 bg-transparent text-[14px] text-ink outline-none select-text"
        {...rest}
      />
    </div>
  )
}

function Flag({ dir, colors }: { dir: string; colors: readonly string[] }) {
  const [a, b, c] = colors
  return (
    <span
      className="h-[14px] w-[18px] shrink-0"
      style={{ background: `linear-gradient(${dir}, ${a} 0 33.3%, ${b} 33.3% 66.6%, ${c} 66.6%)` }}
    />
  )
}

function Switch({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors ${checked ? 'bg-brand-soft' : 'bg-[#dcdcdc]'}`}
    >
      <span
        className={`absolute top-[1px] h-[20px] w-[20px] rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.3)] transition-all ${
          checked ? 'left-[17px] bg-brand' : 'left-[1px] bg-white'
        }`}
      />
    </button>
  )
}
