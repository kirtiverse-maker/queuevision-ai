# QueueVision AI (frontend prototype)

React + TypeScript + Vite + Tailwind CSS. All numbers are demo data in `src/data/demoData.ts`.

    npm install
    npm run dev

## Connecting to the backend

1. Start the backend (see `backend/README.md`), port 8000.
2. Copy `.env.example` to `.env` (it sets `VITE_API_BASE_URL`), then run `npm run dev`.
3. If the backend is off, the dashboard shows a banner with a Retry button and falls back to local demo estimates.
