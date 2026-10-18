import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from './components/AppShell'
import { Home } from './pages/Home'
import { Cameras } from './pages/Cameras'
import { History } from './pages/History'
import { Sos } from './pages/Sos'
import { SosTimer } from './pages/SosTimer'
import { DoorsWindows } from './pages/DoorsWindows'
import { Climate } from './pages/Climate'
import { Support } from './pages/Support'
import { VideoGuides } from './pages/VideoGuides'

export const router = createBrowserRouter([
  { path: '/sos', element: <Sos /> },
  { path: '/sos-timer', element: <SosTimer /> },
  {
    element: <AppShell />,
    children: [
      { index: true, element: <Home /> },
      { path: 'cameras', element: <Cameras /> },
      { path: 'historique', element: <History /> },
      { path: 'portes-fenetres', element: <DoorsWindows /> },
      { path: 'climat', element: <Climate /> },
      { path: 'support', element: <Support /> },
      { path: 'support/guides-video', element: <VideoGuides /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })
