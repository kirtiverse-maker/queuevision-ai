import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TrendPoint } from '../types'

interface Props {
  data: TrendPoint[]
  nowLabel: string
}

export default function TrendChart({ data, nowLabel }: Props) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="text-base font-bold">Queue trend today</h2>
      <p className="mb-4 text-sm text-slate-500">People in queue per hour (demo data)</p>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 8, right: 12, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis dataKey="time" tick={{ fontSize: 12, fill: '#64748B' }} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
            <Tooltip />
            <Legend />
            <ReferenceLine x={nowLabel} stroke="#94A3B8" strokeDasharray="4 4" label={{ value: 'Now', fontSize: 12, fill: '#64748B' }} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#0B1533" strokeWidth={3} dot={{ r: 3 }} connectNulls={false} />
            <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#4C8DFF" strokeWidth={2} strokeDasharray="6 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
