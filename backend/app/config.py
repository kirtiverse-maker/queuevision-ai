"""Settings you may want to change. Everything lives here so main.py stays clean."""
import os

# Addresses the React dev server runs on. Vite uses port 5173 by default.
ALLOWED_ORIGINS = [
    "https://queuevision-ai.vercel.app",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# Queue status thresholds, in minutes of waiting time.
#   wait below LOW_MAX_MINUTES     -> "Low"
#   wait below MEDIUM_MAX_MINUTES  -> "Medium"
#   otherwise                      -> "High"
# You can override them without editing code, e.g. on Windows (cmd):
#   set QUEUE_LOW_MAX_MINUTES=4
LOW_MAX_MINUTES = float(os.getenv("QUEUE_LOW_MAX_MINUTES", "5"))
MEDIUM_MAX_MINUTES = float(os.getenv("QUEUE_MEDIUM_MAX_MINUTES", "12"))
