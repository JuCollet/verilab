/** Détecteur de fumée générique avec badge « OK » vert. */
export function SmokeDetector() {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <defs>
        <radialGradient id="sd-body" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#fafafa" />
          <stop offset="1" stopColor="#dcdcdc" />
        </radialGradient>
      </defs>
      <circle cx={27} cy={27} r={26} fill="url(#sd-body)" />
      <circle cx={27} cy={27} r={19.5} fill="#f7f7f7" stroke="#cfcfcf" strokeWidth={0.8} />
      <g fill="none" stroke="#c4c4c4" strokeWidth={0.8}>
        <circle cx={27} cy={22} r={1.4} />
        <circle cx={25} cy={20.6} r={1.2} />
        <circle cx={29} cy={20.6} r={1.2} />
        <circle cx={25.6} cy={23.6} r={1.2} />
        <circle cx={28.4} cy={23.6} r={1.2} />
      </g>
      <circle cx={27} cy={39} r={2.2} fill="#d6d6d6" />
      <circle cx={45} cy={43} r={9} fill="#2e8b3e" stroke="#fff" strokeWidth={1.5} />
      <path d="m41 43.2 2.8 2.8 5-5.6" fill="none" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Téléphone avec écran « sortie de secours » et ondes rouges. */
export function FireDrillPhone() {
  return (
    <svg width={60} height={56} viewBox="0 0 60 56" fill="none">
      <g stroke="#e4002b" strokeWidth={2.2} strokeLinecap="round">
        <path d="M14 20a14 14 0 0 0 0 16" />
        <path d="M10 17a19 19 0 0 0 0 22" />
        <path d="M46 20a14 14 0 0 1 0 16" />
        <path d="M50 17a19 19 0 0 1 0 22" />
      </g>
      <rect x={19.5} y={1.5} width={21} height={53} rx={3.5} fill="#fff" stroke="#222" strokeWidth={1.8} />
      <path d="M26 50.5h8" stroke="#222" strokeWidth={1.4} strokeLinecap="round" />
      <rect x={23.5} y={20} width={13} height={13} rx={1.6} fill="#e4002b" />
      <g stroke="#fff" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
        <rect x={31} y={22.5} width={3.4} height={8} />
        <circle cx={28.2} cy={23.3} r={0.9} fill="#fff" />
        <path d="M28 24.8l-1.2 3 2 1.4-.6 2.3M26.8 27.8l-1.4 1.2M28 25.5l1.6 1" />
      </g>
    </svg>
  )
}

export function VerilabLogo({ size = 72 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" className="rounded-[22%]">
      <rect width={512} height={512} fill="#E4002B" />
      <path d="M256 92 132 140v104c0 84 52 148 124 176 72-28 124-92 124-176V140L256 92Z" fill="#fff" />
      <path d="M196 196h34l26 92 26-92h34l-44 128h-32L196 196Z" fill="#E4002B" />
    </svg>
  )
}
