import { createContext, useContext, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { createSeed, CURRENT_USER, type AlarmMode, type EventType, type HistoryEvent } from './seed'

export type PendingAction = { kind: 'arm'; mode: Exclude<AlarmMode, 'off'> } | { kind: 'disarm' } | { kind: 'door'; lock: boolean }

export type Overlay = { kind: 'mode' } | { kind: 'pin'; action: PendingAction } | null

type State = ReturnType<typeof createSeed> & {
  overlay: Overlay
  pending: PendingAction | null
}

type Action =
  | { type: 'OPEN_OVERLAY'; overlay: Overlay }
  | { type: 'CLOSE_OVERLAY' }
  | { type: 'START'; action: PendingAction }
  | { type: 'COMMIT'; action: PendingAction; at: number }

const PENDING_MS = 1500

function eventTypeFor(action: PendingAction): EventType {
  if (action.kind === 'arm') return action.mode === 'total' ? 'armed_total' : 'armed_partial'
  if (action.kind === 'disarm') return 'disarmed'
  return action.lock ? 'locked' : 'unlocked'
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'OPEN_OVERLAY':
      return { ...state, overlay: action.overlay }
    case 'CLOSE_OVERLAY':
      return { ...state, overlay: null }
    case 'START':
      return { ...state, overlay: null, pending: action.action }
    case 'COMMIT': {
      const { action: done, at } = action
      const event: HistoryEvent = { id: `evt-${at}`, type: eventTypeFor(done), at, by: CURRENT_USER }
      const next: State = { ...state, pending: null, events: [event, ...state.events] }
      if (done.kind === 'door') next.door = { locked: done.lock, at }
      else next.alarm = { mode: done.kind === 'arm' ? done.mode : 'off', at, by: CURRENT_USER }
      return next
    }
  }
}

type DemoContext = State & {
  openModeSheet: () => void
  openPin: (action: PendingAction) => void
  closeOverlay: () => void
  confirm: (action: PendingAction) => void
}

const Ctx = createContext<DemoContext | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({ ...createSeed(), overlay: null, pending: null }))
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const actions = useMemo(
    () => ({
      openModeSheet: () => dispatch({ type: 'OPEN_OVERLAY', overlay: { kind: 'mode' } }),
      openPin: (action: PendingAction) => dispatch({ type: 'OPEN_OVERLAY', overlay: { kind: 'pin', action } }),
      closeOverlay: () => dispatch({ type: 'CLOSE_OVERLAY' }),
      confirm: (action: PendingAction) => {
        dispatch({ type: 'START', action })
        clearTimeout(timer.current)
        timer.current = setTimeout(() => dispatch({ type: 'COMMIT', action, at: Date.now() }), PENDING_MS)
      },
    }),
    [],
  )

  return <Ctx.Provider value={{ ...state, ...actions }}>{children}</Ctx.Provider>
}

export function useDemo() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useDemo must be used within DemoProvider')
  return ctx
}
