import { Activity, Clock, TrendingUp, Users } from 'lucide-react'
import type { Tone } from '../lib/queue'

interface Props {
  people: number
  waitMin: number
  status: { label: string; tone: Tone }
  predictedPeople: number
  loading?: boolean
}

const TONES: Record<Tone, string> = {
  green: 'bg-emerald-100 text-emerald-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
}

function Card({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between text-slate-500">
        <span className="text-sm font-semibold">{label}</span>
        {icon}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  )
}

export default function SummaryCards({ people, waitMin, status, predictedPeople, loading = false }: Props) {
  const trend = predictedPeople - people
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card label="People in queue" icon={<Users className="h-5 w-5" />}>
        <p className="text-4xl font-extrabold">{people}</p>
      </Card>
      <Card label="Estimated wait" icon={<Clock className="h-5 w-5" />}>
        <p className={`text-4xl font-extrabold ${loading ? 'animate-pulse text-slate-300' : ''}`}>
          {loading ? '--' : waitMin}
          <span className="ml-1 text-lg font-semibold text-slate-500">min</span>
        </p>
      </Card>
      <Card label="Queue status" icon={<Activity className="h-5 w-5" />}>
        <span
          className={`inline-block rounded-full px-4 py-1.5 text-lg font-bold ${
            loading ? 'animate-pulse bg-slate-100 text-slate-300' : TONES[status.tone]
          }`}
        >
          {loading ? 'Loading' : status.label}
        </span>
      </Card>
      <Card label="Predicted crowd (next hour)" icon={<TrendingUp className="h-5 w-5" />}>
        <p className="text-4xl font-extrabold">{predictedPeople}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">
          {trend === 0 ? 'No change' : `${trend > 0 ? '+' : ''}${trend} vs now`}
        </p>
      </Card>
    </div>
  )
}
