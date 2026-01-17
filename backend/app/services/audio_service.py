import os
import shutil
from pydub import AudioSegment
from ..config import AMBIENCE_FILE, AMBIENCE_VOLUME_ADJUST, GENERATED_DIR

# Try to configure ffmpeg path
try:
    import ffmpeg
    FFMPEG_AVAILABLE = True
    print("FFmpeg Python library found")
except ImportError:
    # Fallback to system ffmpeg
    FFMPEG_AVAILABLE = shutil.which("ffmpeg") is not None
    if FFMPEG_AVAILABLE:
        print("System FFmpeg found")
    else:
        print("FFmpeg not found. Audio mixing will be disabled.")

# Configure AudioSegment to use ffmpeg if available
if FFMPEG_AVAILABLE:
    try:
        # Try to set ffmpeg path if needed
        AudioSegment.converter = "ffmpeg"
        AudioSegment.ffmpeg = "ffmpeg"
        AudioSegment.ffprobe = "ffprobe"
    except:
        pass

def mix_with_ambience(speech_path: str, output_path: str):
    # For now, just copy the speech file as final output
    # TODO: Add ambience mixing when ffmpeg is properly configured
    try:
        import shutil
        shutil.copy2(speech_path, output_path)
        print(f"Audio saved successfully.")
    except Exception as e:
        print(f"Failed to copy audio: {e}")
        raise e
