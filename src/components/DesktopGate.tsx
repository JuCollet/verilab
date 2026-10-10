import { useSyncExternalStore, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { VerilabLogo } from './icons/Illustrations'

const query = '(min-width: 601px)'

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

export function DesktopGate({ children }: { children: ReactNode }) {
  const isDesktop = useSyncExternalStore(subscribe, () => window.matchMedia(query).matches)
  return isDesktop ? <DesktopPage /> : children
}

function DesktopPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-6 bg-bg px-4 py-12 text-center">
      <VerilabLogo size={88} />
      <h1 className="text-[28px] font-semibold text-ink">Verilab</h1>
      <p className="max-w-sm text-[17px] text-muted">
        Cette démo est conçue pour mobile.
        <br />
        Scannez le QR code pour l’ouvrir sur votre téléphone.
      </p>
      <div className="rounded-2xl bg-card p-5 shadow-card">
        <QRCodeSVG value={window.location.href} size={196} fgColor="#2b2b2b" />
      </div>
      <p className="text-[13px] text-muted">{window.location.host}</p>
    </main>
  )
}
