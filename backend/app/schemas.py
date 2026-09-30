"""Pydantic models describe the JSON the API accepts and returns.
FastAPI uses them to validate input automatically and to build the /docs page."""
from pydantic import BaseModel, Field


class QueueEstimateRequest(BaseModel):
    location: str = Field(min_length=1, examples=["Canteen A"])
    people_count: int = Field(ge=0, description="People currently in the queue", examples=[45])
    service_rate: float = Field(gt=0, description="People served per minute (must be above 0)", examples=[6])


class QueueEstimateResponse(BaseModel):
    location: str
    people_count: int
    service_rate: float
    estimated_wait_minutes: float
    status: str  # "Low", "Medium" or "High"
    low_max_minutes: float
    medium_max_minutes: float


class HistoryPoint(BaseModel):
    time: str
    people: int


class HistoryResponse(BaseModel):
    location: str
    is_demo_data: bool
    note: str
    points: list[HistoryPoint]
