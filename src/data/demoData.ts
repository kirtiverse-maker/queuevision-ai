import type { Location, TrendPoint } from '../types'

// DEMO DATA: invented numbers for the hackathon presentation. Not real measurements.
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

function build(actual: number[], predicted: number[]): TrendPoint[] {
  return HOURS.map((time, i) => ({ time, actual: actual[i] ?? null, predicted: predicted[i] }))
}

export const LOCATIONS: Location[] = [
  {
    id: 'canteen-a',
    name: 'Canteen A',
    counters: 3,
    serviceMinPerPerson: 1.2,
    nowIndex: 5,
    trend: build([9, 16, 14, 27, 52, 61], [10, 15, 15, 26, 50, 58, 44, 28, 19, 24, 15]),
  },
  {
    id: 'canteen-b',
    name: 'Canteen B',
    counters: 2,
    serviceMinPerPerson: 1.5,
    nowIndex: 5,
    trend: build([6, 11, 12, 19, 33, 38], [7, 10, 13, 20, 34, 40, 29, 17, 12, 18, 10]),
  },
  {
    id: 'admin-office',
    name: 'Admin Office',
    counters: 2,
    serviceMinPerPerson: 3.5,
    nowIndex: 5,
    trend: build([4, 12, 17, 15, 9, 8], [5, 11, 16, 16, 10, 9, 14, 12, 6, 3, 2]),
  },
]
