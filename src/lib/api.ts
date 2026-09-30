import type { ApiStatus } from '../types'

// Shapes match backend/app/schemas.py
export interface QueueEstimateRequest {
  location: string
  people_count: number
  service_rate: number // people served per minute
}

export interface QueueEstimateResponse extends QueueEstimateRequest {
  estimated_wait_minutes: number
  status: ApiStatus
  low_max_minutes: number
  medium_max_minutes: number
}
export interface VisionCountResponse {
  location: string
  people_count: number
  source: string
}
/** Error with a readable message. `retryable` is false for problems a retry cannot fix (e.g. 422). */
export class ApiError extends Error {
  retryable: boolean
  constructor(message: string, retryable = true) {
    super(message)
    this.retryable = retryable
  }
}

const TIMEOUT_MS = 8000
const MAX_ATTEMPTS = 2 // one automatic retry
const RETRY_DELAY_MS = 600

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function fetchOnce<T>(path: string, init: RequestInit, outerSignal?: AbortSignal): Promise<T> {
  const controller = new AbortController()
  const abortFromOutside = () => controller.abort()
  outerSignal?.addEventListener('abort', abortFromOutside)
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, TIMEOUT_MS)

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, { ...init, signal: controller.signal })
    if (!res.ok) {
      const retryable = res.status >= 500
      throw new ApiError(`The backend returned an error (HTTP ${res.status}).`, retryable)
    }
    return (await res.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err
    if (outerSignal?.aborted) throw err // caller cancelled on purpose
    if (timedOut) throw new ApiError('The backend took too long to respond.')
    throw new ApiError(`Could not reach the backend at ${API_BASE_URL}.`)
  } finally {
    clearTimeout(timer)
    outerSignal?.removeEventListener('abort', abortFromOutside)
  }
}

async function request<T>(path: string, init: RequestInit, signal?: AbortSignal): Promise<T> {
  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_BASE_URL is not set. Copy .env.example to .env and restart npm run dev.', false)
  }
  for (let attempt = 1; ; attempt++) {
    try {
      return await fetchOnce<T>(path, init, signal)
    } catch (err) {
      const canRetry = err instanceof ApiError && err.retryable && attempt < MAX_ATTEMPTS
      if (!canRetry) throw err
      await sleep(RETRY_DELAY_MS)
    }
  }
}

export function estimateQueue(body: QueueEstimateRequest, signal?: AbortSignal): Promise<QueueEstimateResponse> {
  return request<QueueEstimateResponse>(
    '/api/queue/estimate',
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    signal,
  )
}
export function getLatestVisionCount(
  signal?: AbortSignal,
): Promise<VisionCountResponse> {
  return request<VisionCountResponse>(
    '/api/vision/latest',
    { method: 'GET' },
    signal,
  )
}