export type ViewId = 'overview' | 'live' | 'analytics' | 'settings'

export type ApiStatus = 'Low' | 'Medium' | 'High'

export interface TrendPoint {
  time: string
  actual: number | null // people counted so far today (null = future)
  predicted: number // model forecast (demo values)
}

export interface Location {
  id: string
  name: string
  counters: number
  serviceMinPerPerson: number
  nowIndex: number // index in `trend` that represents "now"
  trend: TrendPoint[]
}
