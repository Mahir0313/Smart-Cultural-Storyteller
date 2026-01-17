import os
import uuid
import re
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from ..services.story_generator import load_stories
from ..services.tts_service import generate_speech
from ..services.audio_service import mix_with_ambience
from ..utils.file_utils import extract_chapter_text
from ..config import GENERATED_DIR

router = APIRouter()

class PlayRequest(BaseModel):
    chapter_title: str
    voice_gender: str = "male"

class EpisodeRequest(BaseModel):
    text: str

@router.get("/stories")
def get_stories():
    return load_stories()

@router.post("/play/{voice_gender}")
async def play_chapter(request: Request, play_request: PlayRequest, voice_gender: str): # voice_gender is currently ignored as pre-generated files are voice-agnostic
    audio_map = request.app.state.audio_map
    chapter_title = play_request.chapter_title
    
    print(f"Received request for chapter: {chapter_title}")

    if chapter_title in audio_map:
        filename = audio_map[chapter_title]['filename']
        print(f"Found in audio map. Filename: {filename}")
        return {"url": f"/audio/{filename}"}
    else:
        print(f"Chapter '{chapter_title}' not found in audio map. Falling back to generation.")
        # Fallback to on-the-fly generation if not in map
        return await generate_and_play_chapter(chapter_title, voice_gender)

async def generate_and_play_chapter(chapter_title: str, voice_gender: str):
        
    print(f"Received request for chapter: {chapter_title} with voice: {voice_gender}")

    safe_title = re.sub(r"[^a-zA-Z0-9_-]", "_", chapter_title)
    voice_prefix = f"{voice_gender.lower()}_" if voice_gender.lower() == "female" else ""
    output_file = f"{voice_prefix}{safe_title}.mp3"
    output_path = os.path.join(GENERATED_DIR, output_file)

    print(f"Output file will be: {output_file}")

    if os.path.exists(output_path):
        print(f"File already exists, returning existing file: {output_file}")
        return {"url": f"/audio/{output_file}"}

    text = extract_chapter_text(chapter_title)
    print(f"Extracted text length: {len(text)} characters")

    speech_file = await generate_speech(text, voice_gender)
    print("TTS generation completed")
    
    mix_with_ambience(speech_file, output_path)
    print("Audio mixing completed")
    
    os.remove(speech_file)
    print(f"Successfully generated: {output_file}")
    return {"url": f"/audio/{output_file}"}

@router.post("/generate_episode")
async def generate_episode(request: EpisodeRequest):
    if not request.text.strip():
        raise HTTPException(400, "Text is required")

    speech_file = await generate_speech(request.text, "male")
    output_file = os.path.join(
        GENERATED_DIR,
        f"episode_{uuid.uuid4()}.mp3"
    )

    try:
        mix_with_ambience(speech_file, output_file)
        os.remove(speech_file)

        return {"url": f"/audio/{os.path.basename(output_file)}"}

    except Exception as e:
        print(f"Episode error: {e}")
        raise HTTPException(500, "Failed to generate episode")
