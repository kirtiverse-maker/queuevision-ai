import { Camera } from 'lucide-react'

// Static boxes to hint at future person detection. No computer vision yet.
const BOXES = [
  { top: '38%', left: '12%', w: '10%', h: '34%' },
  { top: '30%', left: '30%', w: '9%', h: '40%' },
  { top: '42%', left: '52%', w: '10%', h: '32%' },
  { top: '34%', left: '72%', w: '9%', h: '38%' },
]

export default function CameraPanel({ location }: { location: string }) {
  return (
    <section className="overflow-hidden rounded-2xl bg-navy-900 ring-1 ring-navy-700">
      <header className="flex items-center justify-between px-5 py-3 text-white">
        <h2 className="flex items-center gap-2 text-sm font-bold">
          <Camera className="h-4 w-4 text-brand" />
          Camera 01, {location}
        </h2>
        <span className="rounded-full bg-navy-700 px-3 py-1 text-xs font-semibold text-slate-300">Placeholder feed</span>
      </header>
      <div
        className="relative aspect-video w-full bg-navy-950"
        style={{
          backgroundImage:
            'linear-gradient(rgba(76,141,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(76,141,255,.08) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {BOXES.map((b, i) => (
          <div
            key={i}
            className="absolute rounded border-2 border-brand/70"
            style={{ top: b.top, left: b.left, width: b.w, height: b.h }}
          >
            <span className="absolute -top-5 left-0 rounded bg-brand px-1.5 text-[10px] font-bold text-navy-950">Person</span>
          </div>
        ))}
        <p className="absolute inset-x-0 bottom-4 text-center text-sm font-medium text-slate-400">
          Video feed goes here. Detection boxes are illustrative.
        </p>
      </div>
    </section>
  )
}
