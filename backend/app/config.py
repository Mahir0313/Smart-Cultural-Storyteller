import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GENERATED_DIR = os.path.join(BASE_DIR, "static", "audio")
AMBIENCE_FILE = os.path.join(BASE_DIR, "assets", "background_ambience.mp3")

VOICE_MALE = "en-IN-PrabhatNeural"
VOICE_FEMALE = "en-IN-NeerjaNeural"
AMBIENCE_VOLUME_ADJUST = -35  # dB

os.makedirs(GENERATED_DIR, exist_ok=True)
