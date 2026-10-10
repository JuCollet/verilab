import { Outlet, useLocation } from 'react-router'
import { useEffect, useRef } from 'react'
import { TabBar } from './TabBar'
import { Overlays } from './overlays/Overlays'

export function AppShell() {
  const scroller = useRef<HTMLElement>(null)
  const { pathname } = useLocation()

  useEffect(() => {
    scroller.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="mx-auto flex h-dvh max-w-[600px] flex-col overflow-hidden bg-bg">
      <main ref={scroller} id="scroller" className="relative flex-1 overflow-y-auto overscroll-contain">
        <Outlet />
      </main>
      <TabBar />
      <Overlays />
    </div>
  )
}
