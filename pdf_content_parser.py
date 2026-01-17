#!/usr/bin/env python3
"""
PDF Content Parser for Smart Story Teller
Extracts content from mythology_source.pdf using CHAPTER_TITLE format
"""

import os
import re
import json
from pathlib import Path
import pdfplumber
import PyPDF2

def extract_pdf_content(pdf_path):
    """Extract all text from PDF using pdfplumber"""
    print(f"📖 Extracting content from: {pdf_path}")
    
    try:
        # Try pdfplumber first (better for text extraction)
        with pdfplumber.open(pdf_path) as pdf:
            full_text = ""
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    full_text += text + "\n"
            return full_text
    except Exception as e:
        print(f"⚠️  pdfplumber failed: {e}")
        
        try:
            # Fallback to PyPDF2
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                full_text = ""
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        full_text += text + "\n"
                return full_text
        except Exception as e2:
            print(f"❌ Both PDF readers failed: {e2}")
            return ""

def parse_chapters_from_text(full_text):
    """Parse chapters from PDF text using CHAPTER_TITLE format"""
    if not full_text:
        return {}
    
    print("🔍 Parsing chapters from PDF text...")
    
    # Find all chapter blocks with cleaner pattern
    chapter_pattern = r'CHAPTER_TITLE:\s*([^\n]+)'
    chapter_matches = re.findall(chapter_pattern, full_text)
    
    parsed_content = {}
    
    for chapter_title in chapter_matches:
        # Clean chapter title - take only the first line (deity name)
        clean_title = chapter_title.strip()
        
        # Find the story content for this chapter
        story_start = full_text.find(f"CHAPTER_TITLE: {chapter_title}")
        if story_start == -1:
            continue
            
        # Find the next chapter or end of text
        next_chapter = full_text.find("CHAPTER_TITLE:", story_start + 1)
        
        # Extract the chapter block
        if next_chapter == -1:
            chapter_block = full_text[story_start:]
        else:
            chapter_block = full_text[story_start:next_chapter]
        
        # Extract story content between STORY START and STORY END
        story_match = re.search(r'--- STORY START ---\s*(.*?)\s*--- STORY END\s*---', chapter_block, re.DOTALL)
        
        if story_match:
            story_content = story_match.group(1).strip()
            
            # Clean up the story content
            story_content = re.sub(r'\n+', ' ', story_content)  # Replace multiple newlines with spaces
            story_content = re.sub(r'\s+', ' ', story_content)  # Replace multiple spaces with single space
            
            if len(story_content) > 100:  # Only keep substantial content
                parsed_content[clean_title] = {
                    "CHAPTER_TITLE": clean_title,
                    "STORY": story_content,
                    "WORD_COUNT": len(story_content.split()),
                    "CHARACTER_COUNT": len(story_content)
                }
                print(f"✅ Found chapter: {clean_title} ({len(story_content)} chars)")
            else:
                print(f"⚠️  Chapter too short: {clean_title}")
        else:
            print(f"⚠️  No story found for: {clean_title}")
    
    return parsed_content

def parse_pdf_content():
    """Parse mythology_source.pdf and extract structured content"""
    
    pdf_path = os.path.join(os.path.dirname(__file__), 'backend', 'assets', 'mythology_source.pdf')
    
    if not os.path.exists(pdf_path):
        print(f"❌ PDF not found: {pdf_path}")
        return {}
    
    # Extract text from PDF
    full_text = extract_pdf_content(pdf_path)
    
    if not full_text:
        print("❌ No text extracted from PDF")
        return {}
    
    # Parse chapters from the extracted text
    structured_content = parse_chapters_from_text(full_text)
    
    print(f"📚 Successfully parsed {len(structured_content)} chapters from PDF")
    
    return structured_content

def get_pdf_content_for_episode(episode_title):
    """Get PDF content for a specific episode"""
    content = parse_pdf_content()
    
    # Try exact match first
    if episode_title in content:
        return content[episode_title]["STORY"]
    
    # Try case-insensitive match
    for key, value in content.items():
        if key.lower() == episode_title.lower():
            return value["STORY"]
    
    # Try partial match (remove numbering and special chars)
    clean_episode = re.sub(r'[^\w\s-]', '', episode_title).lower().strip()
    for key, value in content.items():
        clean_key = re.sub(r'[^\w\s-]', '', key).lower().strip()
        if clean_episode in clean_key or clean_key in clean_episode:
            return value["STORY"]
    
    # Special matching for numbered avatars and goddesses
    episode_lower = episode_title.lower()
    
    # Avatar matching: "1. THE MATSYA OR FISH AVATĀRA" -> "MATSYA AVATĀRA"
    if "avatāra" in episode_lower or "avatar" in episode_lower:
        # Extract the full name after "THE" with a simple approach
        # First, find the position after "THE"
        the_pos = episode_title.find("THE ")
        if the_pos == -1:
            return None
        
        # Extract everything after "THE" until "AVAT"
        avatar_part = episode_title[the_pos + 4:]
        
        # Now handle the OR part
        or_pos = avatar_part.find(" OR ")
        if or_pos == -1:
            name_after_or = ""
        else:
            name_after_or = avatar_part[or_pos + 4:].strip()
        
        # Combine names to get the full avatar name
        avatar_name = f"{avatar_part.strip()} {name_after_or}".strip()
        for key in content.keys():
            # Match both possible name combinations with PDF keys
            if avatar_name.upper() in key.upper() and ("AVATĀRA" in key or "AVATAR" in key):
                return content[key]["STORY"]
        # Also try direct matching for numbered avatars without "THE"
        avatar_match2 = re.search(r'^[1-9a]*\.?\s*(\w+)\s+AVAT', episode_title, re.IGNORECASE)
        if avatar_match2:
            # Extract the name after "THE" (everything after "THE" until "AVAT")
            avatar_name = avatar_match2.group(1).strip()
            avatar_name = avatar_match2.group(1).upper()
            for key in content.keys():
                # Match "KŪRMA" with "KŪRMA AVATĀRA"
                if avatar_name in key.upper() and ("AVATĀRA" in key or "AVATAR" in key):
                    return content[key]["STORY"]
    
    # Planet matching: "1. Ravi (Surya)" -> "RAVI (SŪRYA)"
    if re.match(r'^\d+\.\s+', episode_title):
        # Remove numbering and clean up
        clean_name = re.sub(r'^\d+\.\s+', '', episode_title).strip()
        
        # Try exact match first
        if clean_name in content:
            return content[clean_name]["STORY"]
        
        # Try case-insensitive match
        for key in content.keys():
            if key.lower() == clean_name.lower():
                return content[key]["STORY"]
        
        # Try partial match for planets
        planet_match = re.match(r'^(\w+)\s+\([^)]+\)', clean_name)
        if planet_match:
            planet_name = planet_match.group(1)
            for key in content.keys():
                if planet_name.upper() in key.upper() and ('(' in key or 'SURYA' in key.upper() or 'SOMA' in key.upper()):
                    return content[key]["STORY"]
        
        # Try goddess matching for numbered goddess forms
        goddess_name = clean_name
        for key in content.keys():
            if goddess_name.upper() in key.upper() and key != goddess_name.upper():
                return content[key]["STORY"]
    
    # Special cases for main deities
    deity_mapping = {
        "brahmā": "brahman",
        "vishnu": "vishnu",  # Now Vishnu content is available!
        "sarasvati": "sarasvati",
        "lakshmi": "lakshmi",
        "umā": "umā",
        "pārvati": "umā",
        "durgā": "umā",  # Main Durgā maps to Umā content
        "ganesa": "ganesa",
        "kartikeya": "kartikeya"
    }
    
    for episode_key, pdf_key in deity_mapping.items():
        if episode_lower == episode_key and pdf_key and pdf_key in content:
            return content[pdf_key]["STORY"]
    
    return None

def save_structured_content():
    """Save structured content to JSON file"""
    content = parse_pdf_content()
    
    output_file = os.path.join(os.path.dirname(__file__), 'backend', 'structured_content.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Structured content saved to: {output_file}")
    return output_file

def main():
    """Test the PDF content parser"""
    print("📖 Testing PDF Content Parser...")
    
    content = parse_pdf_content()
    print(f"📚 Found {len(content)} structured chapters")
    
    for key, value in content.items():
        print(f"✅ {value['CHAPTER_TITLE']}: {value['WORD_COUNT']} words, {value['CHARACTER_COUNT']} chars")
        print(f"   Preview: {value['STORY'][:100]}...")
        print()
    
    # Save structured content
    save_structured_content()

if __name__ == "__main__":
    main()
