"""Plain Python functions with the queue maths. No web code here, so they are easy to test."""
from app.config import LOW_MAX_MINUTES, MEDIUM_MAX_MINUTES


def estimate_wait_minutes(people_count: int, service_rate: float) -> float:
    """Waiting time = people in queue / people served per minute."""
    return round(people_count / service_rate, 1)


def get_status(wait_minutes: float) -> str:
    """Turn a waiting time into Low, Medium or High using the thresholds in config.py."""
    if wait_minutes < LOW_MAX_MINUTES:
        return "Low"
    if wait_minutes < MEDIUM_MAX_MINUTES:
        return "Medium"
    return "High"
