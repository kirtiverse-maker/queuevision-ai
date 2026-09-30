# QueueVision AI: Backend (FastAPI)

All queue history here is **demo data** (invented numbers). No computer vision yet.

## Files

| File | What it does |
|---|---|
| `requirements.txt` | Python packages to install (FastAPI and Uvicorn, the server). |
| `app/main.py` | Creates the app, enables CORS, defines the 3 endpoints. |
| `app/config.py` | Allowed React addresses (CORS) and the Low/Medium/High thresholds. |
| `app/schemas.py` | Describes the JSON going in and out; FastAPI validates it for you. |
| `app/queue_logic.py` | The maths: wait = people / service rate, and the status rule. |
| `app/sample_data.py` | The demo history numbers for each location. |
| `app/__init__.py` | Empty file that makes `app` a Python package. |

## Setup on Windows

Install Python 3.10 or newer from python.org (tick "Add Python to PATH"). Then open PowerShell:

    cd path\to\queuevision-ai\backend
    python -m venv venv
    venv\Scripts\Activate.ps1
    pip install -r requirements.txt

If PowerShell says scripts are disabled, run this once, then activate again:

    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned

(Command Prompt users: activate with `venv\Scripts\activate.bat`.)

## Start the server

    uvicorn app.main:app --reload --port 8000

Leave it running. Stop it with Ctrl+C. Run this command from the `backend` folder.

## Test each endpoint

Easiest way: open **http://localhost:8000/docs**. Click an endpoint, press "Try it out", then "Execute".

**1. Health check.** Open http://localhost:8000/health. Expected:

    {"status":"ok","service":"QueueVision AI API"}

**2. Estimate waiting time** (PowerShell):

    Invoke-RestMethod -Method Post -Uri http://localhost:8000/api/queue/estimate -ContentType "application/json" -Body '{"location":"Canteen A","people_count":45,"service_rate":6}'

Expected: `estimated_wait_minutes` 7.5 and `status` Medium. Try `people_count` 10 (Low) and 90 (High).
A `service_rate` of 0 or a negative people count returns a 422 validation error, which is correct.

**3. History for charts.** Open in a browser:

- http://localhost:8000/api/queue/history?location=Canteen%20A
- http://localhost:8000/api/queue/history?location=Canteen%20B
- http://localhost:8000/api/queue/history?location=Admin%20Office

The response has `"is_demo_data": true` and a list of `{time, people}` points. An unknown location returns 404.

## Change the thresholds

Defaults: Low under 5 minutes, Medium under 12, High from 12. Edit `app/config.py`, or set variables before starting (PowerShell):

    $env:QUEUE_LOW_MAX_MINUTES = "4"
    $env:QUEUE_MEDIUM_MAX_MINUTES = "10"
    uvicorn app.main:app --reload --port 8000

## CORS

The React dev server (http://localhost:5173) is allowed to call this API. If your Vite port differs, add it to `ALLOWED_ORIGINS` in `app/config.py`.
