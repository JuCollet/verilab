type IconProps = { size?: number; className?: string }

const SHIELD_CURVED = 'M12 3.2c-2 1.3-4.4 1.9-7.2 2v6.2c0 4.6 3 8.4 7.2 10.1 4.2-1.7 7.2-5.5 7.2-10.1V5.2c-2.8-.1-5.2-.7-7.2-2Z'

/** Bouclier barré : alarme désactivée. */
export function ShieldOff({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round">
      <mask id="shield-off-gap">
        <rect width={24} height={24} fill="#fff" />
        <path d="M20.4 3.6 7 18.2" stroke="#000" strokeWidth={4.2} />
      </mask>
      <path d={SHIELD_CURVED} mask="url(#shield-off-gap)" />
      <path d="M20.4 3.6 7 18.2" strokeLinecap="butt" />
    </svg>
  )
}

/** Bouclier à moitié plein : alarme activée partiellement. */
export function ShieldHalf({ size = 32, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d={SHIELD_CURVED} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M12 3.2c-2 1.3-4.4 1.9-7.2 2v6.2c0 4.6 3 8.4 7.2 10.1V3.2Z" fill="currentColor" />
    </svg>
  )
}

/** Bouclier plein coché : alarme activée totalement. `checkColor` = couleur du fond. */
export function ShieldCheck({ size = 32, className, checkColor = '#e4002b' }: IconProps & { checkColor?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d={SHIELD_CURVED} fill="currentColor" />
      <path d="m8.4 11.8 2.6 2.6 4.8-5" fill="none" stroke={checkColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Petite icône « émission » affichée après le nom de l'utilisateur. */
export function Broadcast({ className }: { className?: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" className={className} fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinecap="round">
      <circle cx={3} cy={7} r={1.3} fill="currentColor" stroke="none" />
      <path d="M6.2 4.6a3.4 3.4 0 0 1 0 4.8" />
      <path d="M8.6 2.8a6 6 0 0 1 0 8.4" />
    </svg>
  )
}

export function DoorIcon({ className }: { className?: string }) {
  return (
    <svg width={24} height={30} viewBox="0 0 24 30" className={className} fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x={3} y={2} width={18} height={26} rx={2.5} />
      <circle cx={8} cy={15.5} r={1.1} fill="currentColor" stroke="none" />
    </svg>
  )
}
