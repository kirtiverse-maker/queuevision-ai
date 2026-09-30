import { BarChart3, LayoutDashboard, ScanEye, Settings, Video } from 'lucide-react'
import type { ComponentType } from 'react'
import type { ViewId } from '../types'

const ITEMS: { id: ViewId; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'live', label: 'Live Monitoring', icon: Video },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

interface Props {
  active: ViewId
  onChange: (id: ViewId) => void
}

export default function Sidebar({ active, onChange }: Props) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-navy-950 p-5 lg:flex">
        <div className="mb-10 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand text-navy-950">
            <ScanEye className="h-6 w-6" />
          </div>
          <span className="text-lg font-extrabold text-white">QueueVision AI</span>
        </div>
        <nav className="flex flex-col gap-1">
          {ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onChange(id)}
              aria-current={active === id ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active === id ? 'bg-navy-700 text-white' : 'text-slate-400 hover:bg-navy-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </button>
          ))}
        </nav>
        <p className="mt-auto text-xs text-slate-500">Hackathon prototype. Demo data only.</p>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-4 bg-navy-950 px-2 py-2 lg:hidden">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 rounded-lg py-1.5 text-[11px] font-semibold ${
              active === id ? 'text-brand' : 'text-slate-400'
            }`}
          >
            <Icon className="h-5 w-5" />
            {label.split(' ')[0]}
          </button>
        ))}
      </nav>
    </>
  )
}
