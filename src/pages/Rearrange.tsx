import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useI18n } from '../i18n/I18nProvider'
import type { Dictionary } from '../i18n/dictionaries'
import { useDemo } from '../store/demoStore'
import type { HomeLayout, HomeTile } from '../store/seed'

/** Hauteur d'une ligne + espace entre deux lignes : pas utilisé pour le glisser. */
const ROW_HEIGHT = 48
const ROW_GAP = 7
const PITCH = ROW_HEIGHT + ROW_GAP

const tileName = (tile: HomeTile, t: Dictionary) => t.home[tile]

/**
 * Accueil › Réarranger : ordre et visibilité des tuiles de l'Accueil, sur une copie de travail.
 * - Poignée à droite : glisser (doigt ou souris) pour déplacer ; au clavier, flèches haut / bas.
 * - [-] cache la tuile (elle passe dans « Articles cachés ») ; [+] la remet en fin de liste.
 * « Enregistrer » (grisé tant que rien n'a changé) applique la disposition et revient à l'Accueil ;
 * « Retour » revient sans rien changer.
 */
export function Rearrange() {
  const { t } = useI18n()
  const r = t.rearrange
  const navigate = useNavigate()
  const { homeLayout, setHomeLayout } = useDemo()
  const initialShown = homeLayout.order.filter((tile) => !homeLayout.hidden.includes(tile))
  const [shown, setShown] = useState<HomeTile[]>(initialShown)
  const [hidden, setHidden] = useState<HomeTile[]>(homeLayout.hidden)
  const changed = shown.join() !== initialShown.join() || hidden.join() !== homeLayout.hidden.join()

  const save = () => {
    const layout: HomeLayout = { order: [...shown, ...hidden], hidden }
    setHomeLayout(layout)
    navigate('/')
  }

  const move = (from: number, to: number) => {
    if (from === to) return
    setShown((list) => {
      const next = [...list]
      const [tile] = next.splice(from, 1)
      next.splice(to, 0, tile)
      return next
    })
  }

  // Glisser : index de la ligne déplacée, décalage vertical courant, position d'arrivée calculée.
  const [drag, setDrag] = useState<{ index: number; dy: number } | null>(null)
  const start = useRef(0)
  const target = drag ? Math.max(0, Math.min(shown.length - 1, drag.index + Math.round(drag.dy / PITCH))) : -1

  const onPointerDown = (index: number) => (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    start.current = e.clientY
    setDrag({ index, dy: 0 })
  }
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (drag) setDrag({ index: drag.index, dy: e.clientY - start.current })
  }
  const endDrag = (e: PointerEvent<HTMLButtonElement>) => {
    if (!drag) return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    move(drag.index, target)
    setDrag(null)
  }
  const onKeyDown = (index: number) => (e: KeyboardEvent<HTMLButtonElement>) => {
    const to = e.key === 'ArrowUp' ? index - 1 : e.key === 'ArrowDown' ? index + 1 : null
    if (to === null || to < 0 || to >= shown.length) return
    e.preventDefault()
    move(index, to)
    // Garde le focus sur la poignée de la tuile déplacée.
    requestAnimationFrame(() => document.getElementById(`handle-${shown[index]}`)?.focus())
  }

  /** Décalage visuel d'une ligne pendant le glisser : la ligne tenue suit le doigt, les autres font de la place. */
  const offset = (i: number) => {
    if (!drag) return 0
    if (i === drag.index) return drag.dy
    if (drag.index < i && i <= target) return -PITCH
    if (target <= i && i < drag.index) return PITCH
    return 0
  }

  return (
    <div className="min-h-full pb-[24px]">
      <header className="pt-safe sticky top-0 z-20 bg-bg">
        <div className="relative flex h-[48px] items-end justify-center border-b border-line pb-[10px]">
          <Link to="/" className="absolute bottom-[10px] left-[16px] text-[14px] font-medium text-vivid">
            {r.back}
          </Link>
          <h1 className="text-[16px] font-medium text-ink">{r.title}</h1>
          <button
            type="button"
            disabled={!changed}
            onClick={save}
            className="absolute right-[16px] bottom-[10px] text-[14px] font-medium text-vivid disabled:opacity-40"
          >
            {r.save}
          </button>
        </div>
      </header>

      <p className="px-[8px] pt-[10px] text-[16px] leading-[24px] text-ink">{r.intro}</p>

      <h2 className="mt-[12px] border-b border-line px-[8px] pb-[8px] text-[14px] text-ink">{r.shown(shown.length)}</h2>
      <ul className="flex flex-col gap-[7px] px-[8px] pt-[7px]">
        {shown.map((tile, i) => {
          const name = tileName(tile, t)
          const dragging = drag?.index === i
          return (
            <li
              key={tile}
              style={{ transform: `translateY(${offset(i)}px)`, height: ROW_HEIGHT }}
              className={`relative flex items-center gap-[16px] rounded-[7px] bg-card pr-[8px] pl-[14px] shadow-card ${
                dragging ? 'z-10 shadow-[0_6px_16px_rgba(0,0,0,0.2)]' : drag ? 'transition-transform duration-150' : ''
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setShown((list) => list.filter((x) => x !== tile))
                  setHidden((list) => [...list, tile])
                }}
                aria-label={r.hide(name)}
                className="shrink-0"
              >
                <CircleSign sign="minus" />
              </button>
              <span className="flex-1 text-[16px] text-ink">{name}</span>
              <button
                type="button"
                id={`handle-${tile}`}
                aria-label={r.move(name)}
                onPointerDown={onPointerDown(i)}
                onPointerMove={onPointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                onKeyDown={onKeyDown(i)}
                className={`flex h-full w-[44px] touch-none items-center justify-center text-ink ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
              >
                <HandleIcon />
              </button>
            </li>
          )
        })}
      </ul>

      <h2 className="mt-[16px] border-b border-line px-[8px] pb-[8px] text-[14px] text-ink">{r.hidden(hidden.length)}</h2>
      <ul className="flex flex-col gap-[7px] px-[8px] pt-[7px]">
        {hidden.map((tile) => {
          const name = tileName(tile, t)
          return (
            <li key={tile} className="flex items-center gap-[16px] rounded-[7px] bg-card pr-[8px] pl-[14px] shadow-card" style={{ height: ROW_HEIGHT }}>
              <button
                type="button"
                onClick={() => {
                  setHidden((list) => list.filter((x) => x !== tile))
                  setShown((list) => [...list, tile])
                }}
                aria-label={r.show(name)}
                className="shrink-0"
              >
                <CircleSign sign="plus" />
              </button>
              <span className="flex-1 text-[16px] text-ink">{name}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/** Rond plein avec un signe blanc : [-] pour cacher, [+] pour ajouter. */
function CircleSign({ sign }: { sign: 'minus' | 'plus' }) {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" className="block">
      <circle cx={10} cy={10} r={10} className={sign === 'plus' ? 'fill-vivid' : 'fill-ink'} />
      <path d={sign === 'plus' ? 'M10 5v10M5 10h10' : 'M5 10h10'} stroke="#fff" strokeWidth={2} />
    </svg>
  )
}

/** Poignée de glisser : traits horizontaux encadrés de deux flèches (d'après la capture). */
function HandleIcon() {
  return (
    <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.4}>
      <path d="M7 4.5 10 1.8l3 2.7Z" fill="currentColor" stroke="none" />
      <path d="M3 7.5h14M3 10h14M3 12.5h14" />
      <path d="M7 15.5 10 18.2l3-2.7Z" fill="currentColor" stroke="none" />
    </svg>
  )
}
