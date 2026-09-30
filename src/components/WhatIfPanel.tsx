import { Minus, Plus } from 'lucide-react'

interface Props {
  active: boolean
  baseWait: number
  newWait: number
  counters: number
  onToggle: () => void
}

export default function WhatIfPanel({ active, baseWait, newWait, counters, onToggle }: Props) {
  const saved = baseWait - newWait
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-base font-bold">What if simulation</h2>
      <p className="mt-1 text-sm text-slate-500">Test the effect of opening one more service counter.</p>
      <button
        onClick={onToggle}
        className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors ${
          active ? 'bg-slate-200 text-navy-900 hover:bg-slate-300' : 'bg-navy-900 text-white hover:bg-navy-800'
        }`}
      >
        {active ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {active ? 'Remove extra counter' : 'Add a service counter'}
      </button>
      <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm">
        <p className="text-slate-600">Counters open: <b className="text-navy-900">{counters}</b></p>
        <p className="mt-1 text-slate-600">
          Estimated wait: <b className="text-navy-900">{newWait} min</b>
          {active && saved > 0 && <span className="ml-2 font-bold text-emerald-600">{Math.round(saved * 10) / 10} min faster</span>}
        </p>
      </div>
    </section>
  )
}
