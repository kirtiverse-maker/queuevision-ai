"""The FastAPI application: creates the app, turns on CORS and defines the endpoints."""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from app import config
from app.queue_logic import estimate_wait_minutes, get_status
from app.sample_data import HISTORY, HOURS
from app.schemas import HistoryPoint, HistoryResponse, QueueEstimateRequest, QueueEstimateResponse

app = FastAPI(title="QueueVision AI API", version="0.1.0")

# CORS: browsers block a page on localhost:5173 from calling localhost:8000 unless
# the server says it is allowed. This lets the React dev server talk to this API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    """Quick check that the server is running."""
    return {"status": "ok", "service": "QueueVision AI API"}


@app.post("/api/queue/estimate", response_model=QueueEstimateResponse)
def estimate_queue(body: QueueEstimateRequest):
    """Take a location, people count and service rate; return waiting time and status."""
    wait = estimate_wait_minutes(body.people_count, body.service_rate)
    return QueueEstimateResponse(
        location=body.location,
        people_count=body.people_count,
        service_rate=body.service_rate,
        estimated_wait_minutes=wait,
        status=get_status(wait),
        low_max_minutes=config.LOW_MAX_MINUTES,
        medium_max_minutes=config.MEDIUM_MAX_MINUTES,
    )


@app.get("/api/queue/history", response_model=HistoryResponse)
def queue_history(location: str = Query(examples=["Canteen A"])):
    """Return demo queue history for a location, ready to plot as a line chart."""
    counts = HISTORY.get(location)
    if counts is None:
        raise HTTPException(status_code=404, detail=f"Unknown location. Choose one of: {', '.join(HISTORY)}")
    return HistoryResponse(
        location=location,
        is_demo_data=True,
        note="DEMO DATA: invented sample numbers, not real measurements.",
        points=[HistoryPoint(time=t, people=p) for t, p in zip(HOURS, counts)],
    )
# ---------------------------------------------------------
# YOLO / Vision integration
# ---------------------------------------------------------

LATEST_VISION_COUNT = {
    "location": "Canteen A",
    "people_count": 0,
}


@app.post("/api/vision/count")
def update_vision_count(location: str, people_count: int):
    """Receive the latest people count from the YOLO detector."""

    if people_count < 0:
        raise HTTPException(
            status_code=400,
            detail="People count cannot be negative."
        )

    LATEST_VISION_COUNT["location"] = location
    LATEST_VISION_COUNT["people_count"] = people_count

    return {
        "location": location,
        "people_count": people_count,
        "source": "YOLO",
    }


@app.get("/api/vision/latest")
def get_latest_vision_count():
    """Return the latest people count detected by YOLO."""

    return {
        "location": LATEST_VISION_COUNT["location"],
        "people_count": LATEST_VISION_COUNT["people_count"],
        "source": "YOLO",
    }
