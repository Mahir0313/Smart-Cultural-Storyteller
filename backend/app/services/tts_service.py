import os
import uuid
import edge_tts
from ..config import VOICE_MALE, VOICE_FEMALE, GENERATED_DIR

async def generate_speech(text: str, voice_gender: str = "male"):
    voice = VOICE_MALE if voice_gender.lower() == "male" else VOICE_FEMALE
    
    speech_file = os.path.join(
        GENERATED_DIR,
        f"speech_{uuid.uuid4()}.mp3"
    )
    
    # Smart stretching: slower rate for profound narration
    communicate = edge_tts.Communicate(text, voice, rate="-10%")
    
    # Simple generation without complex audio processing
    await communicate.save(speech_file)
    
    return speech_file
