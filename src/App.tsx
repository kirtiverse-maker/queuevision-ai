import { useEffect, useState } from 'react'
import ApiStatusBanner from './components/ApiStatusBanner'
import CameraPanel from './components/CameraPanel'
import LocationSelector from './components/LocationSelector'
import Recommendation from './components/Recommendation'
import Sidebar from './components/Sidebar'
import SummaryCards from './components/SummaryCards'
import TrendChart from './components/TrendChart'
import WhatIfPanel from './components/WhatIfPanel'
import { LOCATIONS } from './data/demoData'
import { getLatestVisionCount } from './lib/api'
import { useQueueEstimate } from './hooks/useQueueEstimate'
import { bestTimeToVisit, estimateWait, getStatus, statusFromApi } from './lib/queue'
import type { ViewId } from './types'

const TITLES: Record<ViewId, string> = {
  overview: 'Overview',
  live: 'Live Monitoring',
  analytics: 'Analytics',
  settings: 'Settings',
}

export default function App() {
  const [view, setView] = useState<ViewId>('overview')
  const [locationId, setLocationId] = useState(LOCATIONS[0].id)
  const [extraCounter, setExtraCounter] = useState(false)
const [visionPeople, setVisionPeople] = useState<number | null>(null)

useEffect(() => {
  const controller = new AbortController()

  const fetchVisionCount = async () => {
    try {
      const data = await getLatestVisionCount(controller.signal)
      setVisionPeople(data.people_count)
    } catch (err) {
      if (!controller.signal.aborted) {
        console.log('Vision count unavailable, using demo data.')
      }
    }
  }

  fetchVisionCount()

  const interval = setInterval(fetchVisionCount, 2000)

  return () => {
    controller.abort()
    clearInterval(interval)
  }
}, [])
  const loc = LOCATIONS.find((l) => l.id === locationId)!
  const now = loc.trend[loc.nowIndex]
 const people = visionPeople ?? now.actual ?? 0
  const predicted = loc.trend[loc.nowIndex + 1].predicted
  const counters = loc.counters + (extraCounter ? 1 : 0)

  // Service rate sent to the API = people served per minute across all open counters.
  const rateFor = (n: number) => Math.round((n / loc.serviceMinPerPerson) * 100) / 100
  const baseEst = useQueueEstimate({ location: loc.name, people_count: people, service_rate: rateFor(loc.counters) })
  const whatIfEst = useQueueEstimate(
    extraCounter ? { location: loc.name, people_count: people, service_rate: rateFor(loc.counters + 1) } : null,
  )
  const current = extraCounter ? whatIfEst : baseEst

  const loading = baseEst.loading || (extraCounter && whatIfEst.loading)
  const error = baseEst.error ?? (extraCounter ? whatIfEst.error : null)
  const retry = () => {
    if (baseEst.error) baseEst.retry()
    if (extraCounter && whatIfEst.error) whatIfEst.retry()
  }

  // API values when available; otherwise the local demo calculation as a fallback.
  const baseWait = baseEst.data?.estimated_wait_minutes ?? estimateWait(people, loc.counters, loc.serviceMinPerPerson)
  const wait = current.data?.estimated_wait_minutes ?? estimateWait(people, counters, loc.serviceMinPerPerson)
  const status = current.data ? statusFromApi(current.data.status) : getStatus(wait)
  const best = bestTimeToVisit(loc.trend, loc.nowIndex)

  const selectLocation = (id: string) => {
    setLocationId(id)
    setExtraCounter(false)
  }

  const cards = <SummaryCards people={people} waitMin={wait} status={status} predictedPeople={predicted} loading={loading} />
  const chart = <TrendChart data={loc.trend} nowLabel={now.time} />
  const camera = <CameraPanel location={loc.name} />
  const whatIf = (
    <WhatIfPanel active={extraCounter} baseWait={baseWait} newWait={wait} counters={counters} onToggle={() => setExtraCounter((v) => !v)} />
  )
  const reco = <Recommendation best={best} location={loc.name} />

  return (
    <div className="min-h-screen">
      <Sidebar active={view} onChange={setView} />
      <main className="px-4 pb-24 pt-6 lg:ml-64 lg:px-8 lg:pb-10">
        <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold">{TITLES[view]}</h1>
            <span className="mt-1 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              Live measurements powered by YOLO
            </span>
          </div>
          {view !== 'settings' && <LocationSelector locations={LOCATIONS} selectedId={locationId} onSelect={selectLocation} />}
        </header>

        <div className="space-y-6">
          {(view === 'overview' || view === 'live') && <ApiStatusBanner loading={loading} error={error} onRetry={retry} />}
          {view === 'overview' && (
            <>
              {cards}
              <div className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                  {camera}
                  {chart}
                </div>
                <div className="space-y-6">
                  {reco}
                  {whatIf}
                </div>
              </div>
            </>
          )}
          {view === 'live' && (
            <>
              {cards}
              <div className="grid gap-6 xl:grid-cols-3">
                <div className="xl:col-span-2">{camera}</div>
                {whatIf}
              </div>
            </>
          )}
          {view === 'analytics' && (
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">{chart}</div>
              {reco}
            </div>
          )}
          {view === 'settings' && (
            <div className="rounded-2xl bg-white p-8 text-slate-600 shadow-sm ring-1 ring-slate-200">
              Settings will hold camera sources and alert thresholds once the backend is added.
            </div>
          )}
        </div>
      </main>
    </div>
  )
}





