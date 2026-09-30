import type { ApiStatus, TrendPoint } from '../types'

export function estimateWait(people: number, counters: number, minPerPerson: number): number {
  return Math.max(1, Math.round((people * minPerPerson) / counters))
}

export type Tone = 'green' | 'amber' | 'red'

// Local fallback used only when the backend is unreachable.
// Thresholds and labels match the backend defaults (5 and 12 minutes).
export function getStatus(waitMin: number): { label: string; tone: Tone } {
  if (waitMin < 5) return { label: 'Low', tone: 'green' }
  if (waitMin < 12) return { label: 'Medium', tone: 'amber' }
  return { label: 'High', tone: 'red' }
}

// Maps the status string returned by the API to the card colour.
const API_TONES: Record<ApiStatus, Tone> = { Low: 'green', Medium: 'amber', High: 'red' }
export function statusFromApi(status: ApiStatus): { label: string; tone: Tone } {
  return { label: status, tone: API_TONES[status] }
}

// Quietest forecast hour after "now".
export function bestTimeToVisit(trend: TrendPoint[], nowIndex: number): TrendPoint {
  return trend.slice(nowIndex + 1).reduce((best, p) => (p.predicted < best.predicted ? p : best))
}
