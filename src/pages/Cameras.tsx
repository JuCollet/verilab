import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { Settings, X } from 'lucide-react'
import { CAMERAS, type CameraId } from '../store/seed'
import { useI18n } from '../i18n/I18nProvider'
import { PageTitle } from '../components/PageTitle'
// Image découpée telle quelle dans la capture de l'app d'origine (boutons Play et photo inclus).
import cameraCard from '../assets/camera-card.webp'
// Images plein écran fournies pour les caméras « salon », « cuisine » et « jardin ». Salon : extraite de la capture
// (sans les bandes noires), image infrarouge noir et blanc teintée artificiellement (gradient map) ; l'original est
// camera-living.jpg.
import livingImage from '../assets/camera-living-color.jpg'
import kitchenImage from '../assets/camera-kitchen.jpg'
import gardenImage from '../assets/camera-garden.jpg'

/** Image plein écran de chaque caméra ; une caméra sans image n'ouvre pas d'écran (images à venir). */
const CAMERA_IMAGES: Partial<Record<CameraId, string>> = { living: livingImage, kitchen: kitchenImage, garden: gardenImage }

/** Latence simulée de la connexion à la caméra avant d'afficher l'image. */
const CONNECT_MS = 1600

/**
 * Caméras : une tuile par caméra. Toucher une tuile qui a une image affiche un chargement autour de l'icône
 * caméra (latence simulée), puis ouvre la vue plein écran.
 */
export function Cameras() {
  const { t } = useI18n()
  return (
    <div className="pb-[64px]">
      <PageTitle title={t.cameras.title} />
      <div className="pt-[7px]">
        {CAMERAS.map((id) => (
          <CameraCard key={id} id={id} />
        ))}
      </div>
      <div className="fixed inset-x-0 bottom-[calc(59px+env(safe-area-inset-bottom)+10px)] z-10 mx-auto max-w-[600px] px-[7px]">
        <Link
          to="/cameras/galerie"
          className="flex h-[34px] items-center justify-center gap-[14px] rounded-full border border-[#c9c9c9] bg-card text-[15px] font-medium tracking-[0.1em] text-brand shadow-card active:bg-bg"
        >
          {t.cameras.gallery}
          <span className="flex h-[19px] w-[19px] items-center justify-center rounded-full bg-brand text-[11px] tracking-normal text-white">2</span>
        </Link>
      </div>
    </div>
  )
}

function CameraCard({ id }: { id: CameraId }) {
  const { t } = useI18n()
  const navigate = useNavigate()
  const name = t.cameras.names[id]
  const [loading, setLoading] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  const open = () => {
    if (loading) return
    setLoading(true)
    timer.current = setTimeout(() => navigate(`/cameras/${id}`), CONNECT_MS)
  }

  const preview = <img src={cameraCard} alt="" draggable={false} className="block aspect-[833/420] w-full" />
  return (
    <section className="mx-[7px] mb-[7px] overflow-hidden rounded-[7px] bg-card shadow-card">
      {CAMERA_IMAGES[id] ? (
        <button type="button" onClick={open} aria-label={t.cameras.open(name)} aria-busy={loading} className="relative block w-full">
          {preview}
          {/* Anneau de chargement centré sur l'icône appareil photo de l'image (≈ 50 % / 83 % de la tuile). */}
          {loading && (
            <span
              aria-hidden
              className="absolute top-[83%] left-1/2 aspect-square w-[15.5%] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-[3px] border-white/30 border-t-white"
            />
          )}
        </button>
      ) : (
        preview
      )}
      <div className="flex h-[54px] items-center gap-[9px] pr-[16px] pl-[7px]">
        <h2 className="flex-1 text-[16px] font-medium text-ink">{name}</h2>
        <span className="flex h-[19px] items-center rounded-full bg-black px-[7px] text-[13px] tracking-[0.03em] text-white">{t.cameras.noMedia}</span>
        <Link to={`/cameras/${id}/parametres`} aria-label={t.cameras.settingsLabel(name)} className="p-[2px] text-ink">
          <Settings size={20} strokeWidth={1.6} />
        </Link>
      </div>
    </section>
  )
}

/** Vue plein écran d'une caméra : fond noir, image centrée. La croix ou un toucher n'importe où ramène aux caméras. */
export function CameraView() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const id = useParams().id as CameraId
  const image = CAMERA_IMAGES[id]
  if (!image) return <Navigate to="/cameras" replace />
  const close = () => navigate('/cameras')
  return (
    <div onClick={close} className="fixed inset-0 z-40 mx-auto flex max-w-[600px] items-center justify-center bg-black">
      <img src={image} alt={t.cameras.names[id]} draggable={false} className="max-h-full max-w-full object-contain" />
      <button
        type="button"
        onClick={close}
        aria-label={t.cameras.close}
        className="absolute top-[calc(env(safe-area-inset-top)+12px)] left-[12px] p-[6px] text-white"
      >
        <X size={26} strokeWidth={1.8} />
      </button>
    </div>
  )
}
