import { useCallback, useEffect, useState } from 'react'
import { estimateQueue } from '../lib/api'
import type { QueueEstimateRequest, QueueEstimateResponse } from '../lib/api'

interface State {
  data: QueueEstimateResponse | null
  loading: boolean
  error: string | null
}

/**
 * Calls POST /api/queue/estimate whenever the request values change.
 * Pass `null` to skip the call. `retry()` runs the request again.
 */
export function useQueueEstimate(req: QueueEstimateRequest | null) {
  const [state, setState] = useState<State>({ data: null, loading: req !== null, error: null })
  const [attempt, setAttempt] = useState(0)

  const location = req?.location
  const people = req?.people_count
  const rate = req?.service_rate

  useEffect(() => {
    if (location === undefined || people === undefined || rate === undefined) {
      setState({ data: null, loading: false, error: null })
      return
    }
    const controller = new AbortController()
    setState({ data: null, loading: true, error: null })

    estimateQueue({ location, people_count: people, service_rate: rate }, controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return // a newer request replaced this one
        setState({ data: null, loading: false, error: err instanceof Error ? err.message : 'Unknown error' })
      })

    return () => controller.abort()
  }, [location, people, rate, attempt])

  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, retry }
}
