import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { registerSW } from 'virtual:pwa-register'
import '@fontsource/fira-sans/400.css'
import '@fontsource/fira-sans/500.css'
import '@fontsource/fira-sans/600.css'
import './index.css'
import { router } from './router'
import { DesktopGate } from './components/DesktopGate'
import { DemoWatermark, DemoWelcome } from './components/DemoMarks'
import { DemoProvider } from './store/demoStore'
import { I18nProvider } from './i18n/I18nProvider'

registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <DemoProvider>
        <DesktopGate>
          <RouterProvider router={router} />
          <DemoWelcome />
        </DesktopGate>
        <DemoWatermark />
      </DemoProvider>
    </I18nProvider>
  </StrictMode>,
)
