import type { ReactNode } from 'react'

export function PageTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-line bg-bg">
      <div className="flex h-[58px] items-end justify-between px-[7px] pb-[10px]">
        <h1 className="text-[20px] leading-none text-ink">{title}</h1>
        {action}
      </div>
    </header>
  )
}
