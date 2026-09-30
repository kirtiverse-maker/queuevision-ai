import { Lightbulb } from 'lucide-react'
import type { TrendPoint } from '../types'

export default function Recommendation({ best, location }: { best: TrendPoint; location: string }) {
  return (
    <section className="rounded-2xl bg-navy-900 p-5 text-white">
      <h2 className="flex items-center gap-2 text-base font-bold">
        <Lightbulb className="h-5 w-5 text-brand" />
        Best time to visit
      </h2>
      <p className="mt-3 text-4xl font-extrabold">{best.time}</p>
      <p className="mt-2 text-sm text-slate-300">
        {location} is forecast to be quietest then, with about {best.predicted} people in the queue.
      </p>
    </section>
  )
}
