#!/usr/bin/env python3
"""
Batch Audio Generator for Smart Story Teller
Phase 6: High-Fidelity Audio Production - All Episodes Unlocked
"""

import os
import sys
import json
import asyncio
import re
from pathlib import Path

# Add PDF content parser
from pdf_content_parser import get_pdf_content_for_episode
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.services.story_generator import load_stories
from backend.app.services.tts_service import generate_speech
from backend.app.services.audio_service import mix_with_ambience
from backend.app.config import BASE_DIR, GENERATED_DIR

# Audio directory setup
AUDIO_DIR = os.path.join(BASE_DIR, "static", "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

# Audio map file
AUDIO_MAP_FILE = os.path.join(BASE_DIR, "audio_map.json")

def clean_filename(title, category="", subcategory=""):
    """Create descriptive filename based on episode info"""
    # Clean title
    clean_title = re.sub(r'[^\w\s-]', '', title)
    clean_title = re.sub(r'[-\s]+', '_', clean_title)
    clean_title = clean_title.strip()
    
    # Add category/subcategory prefix for better organization
    if category and subcategory:
        # Extract key info from category/subcategory
        if "PURANIC" in category.upper():
            prefix = "puranic"
        elif "INFERIOR" in category.upper():
            prefix = "inferior"
        else:
            prefix = "general"
        
        # Add subcategory info if it's meaningful
        if "VISHNU" in subcategory.upper():
            prefix += "_vishnu"
        elif "SHIVA" in subcategory.upper() or "SIVA" in subcategory.upper():
            prefix += "_shiva"
        elif "BRAHMA" in subcategory.upper():
            prefix += "_brahma"
        elif "PLANETS" in subcategory.upper():
            prefix += "_planets"
        elif "RISHIS" in subcategory.upper():
            prefix += "_rishis"
        elif "AVATAR" in subcategory.upper():
            prefix += "_avatar"
        
        return f"{prefix}_{clean_title}.mp3"
    
    return f"{clean_title}.mp3"

def collect_pdf_deities_only():
    """Collect only deities that have content in PDF"""
    from pdf_content_parser import parse_pdf_content
    
    pdf_content = parse_pdf_content()
    pdf_deities = set()
    
    for deity_name in pdf_content.keys():
        pdf_deities.add(deity_name.lower())

def collect_all_episodes(stories_data):
    """Collect ALL episodes from stories data - everything unlocked"""
    episodes = []
    
    for category in stories_data:
        category_title = category.get("title", "")
        
        # Process subcategories
        for subcategory in category.get("subcategories", []):
            subcategory_title = subcategory.get("title", "")
            
            # Process main episodes
            for episode in subcategory.get("episodes", []):
                if isinstance(episode, str):
                    episodes.append({
                        "title": episode,
                        "category": category_title,
                        "subcategory": subcategory_title
                    })
            
            # Process sub-series episodes (these were previously locked)
            for sub_series in subcategory.get("sub_series", []):
                if isinstance(sub_series, str):
                    episodes.append({
                        "title": sub_series,
                        "category": category_title,
                        "subcategory": subcategory_title
                    })
    
    return episodes

async def generate_episode_audio(title, category="", subcategory="", voice_gender="male"):
    """Generate audio for a single episode using PDF content"""
    filename = clean_filename(title, category, subcategory)
    output_path = os.path.join(AUDIO_DIR, filename)
    
    # Skip if already exists
    if os.path.exists(output_path):
        print(f"✓ Skipping {title} (already exists)")
        return filename
    
    print(f"🎙️  Generating {title}... ({category} / {subcategory})")
    
    # Get content from PDF only
    text = get_pdf_content_for_episode(title)
    
    if not text:
        print(f"⚠️  No PDF content found for {title}, skipping...")
        return None
    else:
        print(f"✅ Using PDF content for {title} ({len(text)} chars)")
    
    try:
        # Generate speech with male voice only
        speech_file = await generate_speech(text, "male")
        
        # Mix with ambience (simplified)
        await asyncio.get_event_loop().run_in_executor(
            None, mix_with_ambience, speech_file, output_path
        )
        
        # Clean up temporary speech file
        if os.path.exists(speech_file):
            os.remove(speech_file)
        
        print(f"✅ Generated {filename}")
        return filename
        
    except Exception as e:
        print(f"❌ Failed to generate {title}: {e}")
        return None

async def main():
    """Main batch generation function - PDF deities only"""
    print("🎬 Smart Story Teller - Batch Audio Generator")
    print("🔓 PDF Deities Only - Generating Audio for PDF Content")
    print("=" * 60)
    
    # Get PDF deities first
    from pdf_content_parser import parse_pdf_content
    pdf_content = parse_pdf_content()
    pdf_deities = set()
    for deity_name in pdf_content.keys():
        pdf_deities.add(deity_name.lower())
    
    print(f"📖 Found {len(pdf_deities)} deities in PDF:")
    for deity in sorted(pdf_deities):
        print(f"  - {deity}")
    
    # Load stories data
    stories_data = load_stories()
    print(f"📚 Loaded stories data")
    
    # Collect ALL episodes (everything unlocked)
    all_episodes = collect_all_episodes(stories_data)
    print(f"📚 Found {len(all_episodes)} total episodes")
    
    # Filter to only PDF deities
    pdf_episodes = []
    skipped_episodes = []
    
    for episode in all_episodes:
        title_lower = episode["title"].lower()
        # Clean title for comparison (remove numbering and special chars)
        clean_title = re.sub(r'[^\w\s-]', '', episode["title"]).lower().strip()
        
        if any(deity in clean_title for deity in pdf_deities):
            pdf_episodes.append(episode)
        else:
            skipped_episodes.append(episode)
    
    print(f"\n📋 Processing {len(pdf_episodes)} episodes from PDF:")
    for i, episode in enumerate(pdf_episodes, 1):
        print(f"  {i:2d}. {episode['title']} ({episode['category']} / {episode['subcategory']})")
    
    print(f"\n⏭️ Skipping {len(skipped_episodes)} episodes (no PDF content):")
    for episode in skipped_episodes[:5]:  # Show first 5 skipped
        print(f"  - {episode['title']}")
    if len(skipped_episodes) > 5:
        print(f"  ... and {len(skipped_episodes) - 5} more")
    
    # Load existing audio map
    audio_map = {}
    if os.path.exists(AUDIO_MAP_FILE):
        with open(AUDIO_MAP_FILE, 'r') as f:
            audio_map = json.load(f)
    
    print(f"\n🎵 Starting audio generation at 1.25x speed...")
    print(f"📍 Output directory: {AUDIO_DIR}")
    print(f"🗺️  Audio map file: {AUDIO_MAP_FILE}")
    
    # Update TTS service to use 1.25x speed
    import backend.app.services.tts_service as tts_service
    original_generate = tts_service.generate_speech
    
    async def generate_speech_fast(text, voice_gender):
        """Generate speech at 1.25x speed"""
        return await original_generate(text, voice_gender, rate="+25%")  # 1.25x speed
    
    tts_service.generate_speech = generate_speech_fast
    
    # Generate audio for each PDF episode (male voice only for better quality)
    for episode in pdf_episodes:
        title = episode["title"]
        category = episode["category"]
        subcategory = episode["subcategory"]
        
        filename = await generate_episode_audio(title, category, subcategory, "male")
        
        if filename:
            # Update audio map
            audio_map[title] = {
                "filename": filename,
                "category": category,
                "subcategory": subcategory,
                "voice": "male",
                "speed": "1.25x"
            }
            
            # Save audio map after each successful generation
            with open(AUDIO_MAP_FILE, 'w') as f:
                json.dump(audio_map, f, indent=2)
    
    print(f"\n🎉 Batch generation complete!")
    print(f"📊 Generated {len(audio_map)} audio files from PDF content")
    print(f"📄 Audio map saved to: {AUDIO_MAP_FILE}")
    print(f"🎵 PDF episodes are now ready for playback at 1.25x speed!")
    
    if skipped_episodes:
        print(f"\n📝 Skipped episodes (no PDF content):")
        for episode in skipped_episodes:
            print(f"  - {episode['title']} ({episode['category']} / {episode['subcategory']})")
        print(f"\n💡 Add these deities to PDF to generate their audio later")

if __name__ == "__main__":
    asyncio.run(main())
