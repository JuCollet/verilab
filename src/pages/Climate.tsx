import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronRight, CircleHelp, Settings, Thermometer } from 'lucide-react'
import { useDemo } from '../store/demoStore'
import type { ClimateRoom } from '../store/climate'
import { SubPageHeader } from '../components/SubPageHeader'

const TEMP_COLOR = '#e4002b'
const HUMIDITY_COLOR = '#1ab4ee'

export function Climate() {
  const { climate } = useDemo()
  return (
    <div className="pb-[10px]">
      <SubPageHeader
        title="Climat"
        trailing={
          <span aria-disabled="true" className="block p-1 text-brand opacity-40">
            <CircleHelp size={24} strokeWidth={1.8} />
          </span>
        }
      />
      <div className="pt-[10px]">
        {climate.map((room) => (
          <RoomCard key={room.room} room={room} />
        ))}
      </div>
    </div>
  )
}

function RoomCard({ room }: { room: ClimateRoom }) {
  return (
    <section className="mx-[7px] mb-[27px] overflow-hidden rounded-[7px] bg-card shadow-card">
      <header className="flex h-[48px] items-center justify-between border-b border-line pr-[14px] pl-[14px]">
        <h2 className="text-[16px] font-medium text-ink">{room.room}</h2>
        <span aria-disabled="true" className="text-ink opacity-40">
          <Settings size={20} strokeWidth={1.6} />
        </span>
      </header>
      <div className="flex h-[48px] items-center border-b border-line pr-[14px] pl-[16px] text-[16px] text-ink">
        <span className="flex flex-1 items-center gap-[12px]">
          <Thermometer size={20} strokeWidth={1.6} />
          {room.temperature.toFixed(1)}°
        </span>
        <span className="flex flex-1 items-center gap-[12px]">
          <HumidityIcon />
          {room.humidity.toFixed(1)}%
        </span>
        <span aria-disabled="true" className="flex items-center gap-[18px] opacity-40">
          <ChartIcon />
          <ChevronRight size={22} strokeWidth={1.8} className="text-brand" />
        </span>
      </div>
      <ClimateChart room={room} />
    </section>
  )
}

/** Graphique 7 jours : température (rouge, axe gauche) et humidité (bleu, axe droit 0-100 %). */
function ClimateChart({ room }: { room: ClimateRoom }) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(360)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const height = 128
  const left = 25
  const right = width - 42
  const top = 6
  const bottom = 105
  const [tMin, tMax] = room.axis
  const start = room.series[0].at
  const dayMs = 86_400_000
  const pxPerDay = (right - left) / 8.85
  const x = (at: number) => left + ((at - start) / dayMs) * pxPerDay
  const yT = (t: number) => bottom - ((t - tMin) / (tMax - tMin)) * (bottom - top)
  const yH = (h: number) => bottom - (h / 100) * (bottom - top)
  const path = (y: (p: ClimateRoom['series'][number]) => number) =>
    room.series.map((p, i) => `${i ? 'L' : 'M'}${x(p.at).toFixed(1)} ${y(p).toFixed(1)}`).join('')

  const majors = [0, 1, 2, 3, 4, 5]
  const halfSteps = Array.from({ length: 11 }, (_, i) => i / 10)
  const days = Array.from({ length: 7 }, (_, i) => start + i * dayMs)

  return (
    <div ref={ref} className="bg-[#f6f6f6]">
      <svg width={width} height={height} className="block" fontFamily="Fira Sans, sans-serif">
        {halfSteps.map((f) => (
          <line key={f} x1={left} x2={right} y1={bottom - f * (bottom - top)} y2={bottom - f * (bottom - top)} stroke="#e2e2e2" strokeWidth={0.8} />
        ))}
        {days.slice(1).map((d) => (
          <line key={d} x1={x(d)} x2={x(d)} y1={top} y2={bottom} stroke="#cfcfcf" strokeWidth={1.2} />
        ))}
        {halfSteps.map((f, i) => {
          const y = bottom - f * (bottom - top)
          const major = i % 2 === 0
          return (
            <g key={f} strokeWidth={0.9}>
              <line x1={left - 1} x2={left + (major ? 10 : 6)} y1={y} y2={y} stroke={TEMP_COLOR} />
              <line x1={right - (major ? 10 : 6)} x2={right + 1} y1={y} y2={y} stroke={HUMIDITY_COLOR} />
            </g>
          )
        })}
        {majors.map((m) => {
          const y = bottom - (m / 5) * (bottom - top)
          return (
            <g key={m} fontSize={10}>
              <text x={left - 2} y={y + 3.5} textAnchor="end" fill={TEMP_COLOR}>
                {(tMin + ((tMax - tMin) * m) / 5).toFixed(1)}
              </text>
              <text x={right + 2} y={y + 3.5} fill={HUMIDITY_COLOR}>
                {(m * 20).toFixed(1)}
              </text>
            </g>
          )
        })}
        <path d={path((p) => yH(p.humidity))} fill="none" stroke={HUMIDITY_COLOR} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={path((p) => yT(p.temperature))} fill="none" stroke={TEMP_COLOR} strokeWidth={1.5} strokeLinejoin="round" />
        {days.map((d) => (
          <text key={d} x={x(d)} y={118} textAnchor="middle" fontSize={12} fill="#2b2b2b">
            {new Date(d).toLocaleDateString('fr-FR', { weekday: 'short' })}
          </text>
        ))}
      </svg>
    </div>
  )
}

function HumidityIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5C9 7 5.5 10.5 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10.5 15 7 12 2.5Z" />
      <path d="M8.5 13.5c1.2-.8 2.3-.8 3.5 0s2.3.8 3.5 0M8.5 16.5c1.2-.8 2.3-.8 3.5 0s2.3.8 3.5 0" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width={22} height={20} viewBox="0 0 22 20" fill="none" stroke="currentColor" strokeWidth={1.3} strokeLinejoin="round" className="text-ink">
      <rect x={1} y={1} width={20} height={18} rx={1.5} />
      <path d="m4 13 3-4 3 3 2.5-5L15 11l3-3" />
    </svg>
  )
}
