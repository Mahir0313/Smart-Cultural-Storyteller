from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import json
import os

from .routes import story_routes
from .config import BASE_DIR, GENERATED_DIR

app = FastAPI()

# Load audio map
AUDIO_MAP_FILE = os.path.join(BASE_DIR, "audio_map.json")
if not os.path.exists(AUDIO_MAP_FILE):
    raise RuntimeError("audio_map.json not found. Please run generate_audio_map.py first.")
with open(AUDIO_MAP_FILE, 'r', encoding='utf-8') as f:
    audio_map = json.load(f)

app.state.audio_map = audio_map

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(story_routes.router)

# Root endpoint
@app.get("/")
def root():
    return {"message": "OmStream Backend is running."}

# Static mounts
AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")
app.mount("/audio", StaticFiles(directory=AUDIO_DIR), name="audio")
app.mount(
    "/images",
    StaticFiles(directory="../frontend/public/images"),
    name="images"
)
