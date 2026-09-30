import { MapPin } from 'lucide-react'
import type { Location } from '../types'

interface Props {
  locations: Location[]
  selectedId: string
  onSelect: (id: string) => void
}

export default function LocationSelector({ locations, selectedId, onSelect }: Props) {
  return (
    <div role="tablist" aria-label="Location" className="inline-flex flex-wrap gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-slate-200">
      {locations.map((l) => (
        <button
          key={l.id}
          role="tab"
          aria-selected={selectedId === l.id}
          onClick={() => onSelect(l.id)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
            selectedId === l.id ? 'bg-navy-900 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MapPin className="h-4 w-4" />
          {l.name}
        </button>
      ))}
    </div>
  )
}
