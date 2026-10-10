import { Camera, Play, Settings } from 'lucide-react'
import { CAMERAS } from '../store/seed'
import { PageTitle } from '../components/PageTitle'
import { CameraIllustration } from '../components/icons/Illustrations'

export function Cameras() {
  return (
    <div className="pb-[64px]">
      <PageTitle title="Caméras" />
      <div className="pt-[7px]">
        {CAMERAS.map((name) => (
          <CameraCard key={name} name={name} />
        ))}
      </div>
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(59px+env(safe-area-inset-bottom)+10px)] z-10 mx-auto max-w-[600px] px-[7px]">
        <span
          aria-disabled="true"
          className="flex h-[34px] items-center justify-center gap-[14px] rounded-full border border-[#c9c9c9] bg-card text-[15px] font-medium tracking-[0.1em] text-brand opacity-40 shadow-card"
        >
          GALERIE
          <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-brand text-[11px] tracking-normal text-white">2</span>
        </span>
      </div>
    </div>
  )
}

function CameraCard({ name }: { name: string }) {
  return (
    <section className="mx-[7px] mb-[7px] overflow-hidden rounded-[7px] bg-card shadow-card">
      <div className="relative flex h-[183px] justify-center bg-linear-to-tr from-camera-from to-camera-to">
        <div className="h-full w-[123px] overflow-hidden">
          <CameraIllustration />
        </div>
        <span aria-disabled="true" className="absolute bottom-[7px] left-[7px] flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#14304f]/90 text-white opacity-40">
          <Play size={22} fill="currentColor" strokeWidth={0} className="ml-[3px]" />
        </span>
        <span aria-disabled="true" className="absolute bottom-[5px] left-1/2 flex h-[48px] w-[48px] -translate-x-1/2 items-center justify-center rounded-full bg-[#3a3a3a]/80 text-white opacity-40">
          <Camera size={20} strokeWidth={1.8} />
        </span>
      </div>
      <div className="flex h-[54px] items-center gap-[9px] pr-[16px] pl-[7px]">
        <h2 className="flex-1 text-[16px] font-medium text-ink">{name}</h2>
        <span className="flex h-[19px] items-center rounded-full bg-black px-[7px] text-[13px] tracking-[0.03em] text-white">Aucunes photos ou vidéos</span>
        <span aria-disabled="true" className="text-ink opacity-40">
          <Settings size={20} strokeWidth={1.6} />
        </span>
      </div>
    </section>
  )
}
