import json
import os
import re

def sanitize_title(title):
    # Handle special case for Umā
    if "Umā (also known as Pārvati, Durgā, Kāli, etc.)" in title:
        return "um_also_known_as_prvati_durg_kli_etc"

    # Remove numbers and punctuation, handle special characters
    sanitized = re.sub(r'^\d+[a-z]?\.\s*', '', title)  # Remove leading numbers like '1. ' or '8a. '
    # Allow unicode letters, remove other symbols
    sanitized = re.sub(r'[^\w\s]', '', sanitized, flags=re.UNICODE)
    sanitized = re.sub(r'\s+', '_', sanitized)
    return sanitized.lower()

def find_matching_audio_file(sanitized_title, audio_files):
    # Special case for the complex 'Umā' title
    if "um_also_known_as_prvati_durg_kli_etc" in sanitized_title:
        for f in audio_files:
            if "Umā_also_known_as_Pārvati_Durgā_Kāli_etc" in f:
                return f

    for audio_file in audio_files:
        # Create a sanitized version of the audio filename for comparison
        sanitized_audio_name = re.sub(r'^(general|inferior)_(vishnu_|shiva_)?(rishis_|planets_)?', '', audio_file.lower())
        sanitized_audio_name = sanitized_audio_name.replace('.mp3', '')
        if sanitized_title in sanitized_audio_name:
            return audio_file
    return None

def create_audio_map():
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    stories_path = os.path.join(backend_dir, 'backend', 'app', 'data', 'stories.json')
    audio_dir = os.path.join(backend_dir, 'backend', 'static', 'audio')

    with open(stories_path, 'r', encoding='utf-8') as f:
        stories_data = json.load(f)

    audio_files = [f for f in os.listdir(audio_dir) if f.endswith('.mp3')]
    
    audio_map = {}

    for category in stories_data:
        for subcategory in category.get('subcategories', []):
            for episode in subcategory.get('episodes', []):
                sanitized_episode = sanitize_title(episode)
                match = find_matching_audio_file(sanitized_episode, audio_files)
                if match:
                    audio_map[episode] = {'filename': match}
            for sub_series_episode in subcategory.get('sub_series', []):
                sanitized_sub_episode = sanitize_title(sub_series_episode)
                match = find_matching_audio_file(sanitized_sub_episode, audio_files)
                if match:
                    audio_map[sub_series_episode] = {'filename': match}

    output_path = os.path.join(backend_dir, 'backend', 'audio_map.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(audio_map, f, indent=4, ensure_ascii=False)

    print(f'Audio map generated at {output_path}')

if __name__ == '__main__':
    create_audio_map()
