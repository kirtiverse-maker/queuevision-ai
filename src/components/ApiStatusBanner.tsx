import { AlertTriangle, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'

interface Props {
  loading: boolean
  error: string | null
  onRetry: () => void
}

export default function ApiStatusBanner({ loading, error, onRetry }: Props) {
  if (error) {
    return (
      <div role="alert" className="flex flex-col gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-800 ring-1 ring-red-200 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-bold">Backend unavailable. Showing local demo estimates instead.</p>
            <p className="mt-0.5 text-red-700">{error} Start it from the backend folder with: uvicorn app.main:app --reload --port 8000</p>
          </div>
        </div>
        <button onClick={onRetry} className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2 font-bold text-white hover:bg-red-800">
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    )
  }
  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-white p-3 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
        <Loader2 className="h-4 w-4 animate-spin" />
        Contacting the queue backend...
      </div>
    )
  }
  return (
    <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-800 ring-1 ring-emerald-200">
      <CheckCircle2 className="h-4 w-4" />
      Wait time and status are calculated by the FastAPI backend. People counts are still demo data.
    </div>
  )
}
