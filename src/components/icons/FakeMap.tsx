/** Carte de quartier fictive (style plan routier clair), sans aucun lieu réel. */
export function FakeMap() {
  const buildings = [
    [200, 60, 32, 24, 30], [130, 80, 30, 22, 40], [92, 112, 34, 26, 40], [118, 140, 22, 18, 40],
    [270, 110, 30, 22, 30], [252, 145, 26, 20, 30], [168, 180, 40, 26, 35], [150, 230, 34, 20, 40],
    [118, 300, 40, 30, 35], [66, 250, 26, 20, 40], [70, 325, 26, 18, 35], [20, 360, 34, 26, 35],
    [30, 410, 30, 22, 35], [304, 70, 30, 22, 30], [6, 155, 18, 14, 40], [-6, 340, 34, 26, 30],
  ]
  return (
    <svg viewBox="0 0 375 440" preserveAspectRatio="xMidYMid slice" className="h-full w-full" fontFamily="Fira Sans, sans-serif">
      <rect width={375} height={440} fill="#ececec" />
      <path d="M0 0h96L0 62z" fill="#c9e4cc" />
      <path d="M375 330 300 440h12l63-92z" fill="#aadaf0" />
      <g fill="#dedede" stroke="#d0d0d0" strokeWidth={1}>
        {buildings.map(([x, y, w, h, r], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} transform={`rotate(-${r} ${x + w / 2} ${y + h / 2})`} />
        ))}
      </g>
      <g fill="none" strokeLinecap="round">
        <path id="road-main" d="M330 0C250 60 170 110 110 200S20 360 10 440" stroke="#b7c0cb" strokeWidth={13} />
        <path d="M330 0C250 60 170 110 110 200S20 360 10 440" stroke="#fff" strokeWidth={9} />
        <path id="road-side" d="M375 300c-40-20-60-30-80-20S240 380 210 440" stroke="#b7c0cb" strokeWidth={11} />
        <path d="M375 300c-40-20-60-30-80-20S240 380 210 440" stroke="#fff" strokeWidth={7} />
        <path d="M0 455c40-15 70-10 100 10" stroke="#b7c0cb" strokeWidth={11} />
        <path d="M335 375 290 440" stroke="#7cc6dc" strokeWidth={2} />
      </g>
      <g fontSize={11} fill="#5f6368" stroke="#fff" strokeWidth={3} paintOrder="stroke" letterSpacing={0.2}>
        <text dy={4}>
          <textPath href="#road-main" startOffset="38%">Rue des Tilleuls</textPath>
        </text>
        <text dy={4}>
          <textPath href="#road-side" startOffset="45%">Chemin des Saules</textPath>
        </text>
      </g>
      <Poi x={267} y={34} label="Boulangerie du Parc" anchor="end" />
      <Poi x={302} y={262} label="Clos des Lilas 1" anchor="end" />
      <Poi x={338} y={238} label="Clos des Lilas 6" anchor="start" />
      <g transform="translate(196 186)">
        <circle r={9} fill="#1e8e5a" stroke="#fff" strokeWidth={2} />
        <path d="M-4 3 0-4l4 7z" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
        <text x={14} y={-2} fontSize={12} fill="#1e8e5a" stroke="#fff" strokeWidth={3} paintOrder="stroke">
          Aire de jeux
          <tspan x={14} dy={14}>des Saules</tspan>
        </text>
      </g>
      <circle cx={188} cy={378} r={32} fill="#4a7fd4" fillOpacity={0.15} stroke="#4a7fd4" strokeOpacity={0.5} />
      <circle cx={188} cy={378} r={5.5} fill="#3b6fd0" stroke="#fff" strokeWidth={1.5} />
    </svg>
  )
}

function Poi({ x, y, label, anchor }: { x: number; y: number; label: string; anchor: 'start' | 'end' }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={9} fill="#7b7f86" stroke="#fff" strokeWidth={2} />
      <circle r={3.5} fill="#fff" />
      <text x={anchor === 'end' ? -14 : 14} y={4} textAnchor={anchor} fontSize={12} fill="#5f6368" stroke="#fff" strokeWidth={3} paintOrder="stroke">
        {label}
      </text>
    </g>
  )
}
