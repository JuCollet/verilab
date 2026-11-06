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
import { More } from './pages/More'
import { Users } from './pages/Users'
import { Account } from './pages/Account'
import { AddUser } from './pages/AddUser'
import { Features } from './pages/Features'
import { Routines } from './pages/Routines'
import { SuggestedRoutines } from './pages/SuggestedRoutines'
import { ReminderDetail, Reminders } from './pages/Reminders'
import { CreateRoutine, RoutineActions, RoutineAlarmAction, RoutineDraft, RoutineLockAction, RoutineExactTime, RoutineTimeTriggers, RoutineTriggers } from './pages/CreateRoutine'
import { Legal } from './pages/Legal'

export const router = createBrowserRouter([
  { path: '/sos', element: <Sos /> },
  { path: '/sos-timer', element: <SosTimer /> },
  { path: '/plus/utilisateurs/ajouter', element: <AddUser /> },
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
      { path: 'plus', element: <More /> },
      { path: 'plus/compte', element: <Account /> },
      { path: 'plus/mentions-legales', element: <Legal /> },
      { path: 'plus/utilisateurs', element: <Users /> },
      { path: 'plus/fonctionnalites', element: <Features /> },
      { path: 'plus/fonctionnalites/routines', element: <Routines /> },
      { path: 'plus/fonctionnalites/routines/suggerees', element: <SuggestedRoutines /> },
      {
        path: 'plus/fonctionnalites/routines/nouvelle',
        element: <RoutineDraft />,
        children: [
          { index: true, element: <CreateRoutine /> },
          { path: 'quand', element: <RoutineTriggers /> },
          { path: 'quand/moment', element: <RoutineTimeTriggers /> },
          { path: 'quand/moment/precis', element: <RoutineExactTime /> },
          { path: 'alors', element: <RoutineActions /> },
          { path: 'alors/alarme', element: <RoutineAlarmAction /> },
          { path: 'alors/verrouillage', element: <RoutineLockAction /> },
        ],
      },
      { path: 'plus/fonctionnalites/routines/rappel', element: <Reminders /> },
      { path: 'plus/fonctionnalites/routines/rappel/:kind', element: <ReminderDetail /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
], { basename: import.meta.env.BASE_URL })
