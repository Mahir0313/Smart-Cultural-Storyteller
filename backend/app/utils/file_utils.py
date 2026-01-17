import os
import re
import pdfplumber
from ..config import BASE_DIR

def extract_chapter_text(chapter_title: str) -> str:
    assets_dir = os.path.join(BASE_DIR, "assets")
    pdf_path = os.path.join(assets_dir, "mythology_source.pdf")
    extracted_text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:
            found = False
            for page in pdf.pages:
                text = page.extract_text() or ""

                if re.search(re.escape(chapter_title), text, re.IGNORECASE):
                    found = True
                    match = re.search(
                        re.escape(chapter_title) + r"(.*)",
                        text,
                        re.DOTALL | re.IGNORECASE
                    )
                    if match:
                        extracted_text += match.group(1).strip()
                elif found:
                    if re.search(r"^[A-Z][A-Z\s]{5,}$", text, re.MULTILINE):
                        break
                    extracted_text += "\n" + text.strip()

        extracted_text = re.sub(r"\n\s*\n", "\n", extracted_text).strip()

        if len(extracted_text) > 200:
            return extracted_text

    except Exception as e:
        print(f"PDF parsing error: {e}")

    # Fallback text
    return (
        f"Welcome to the ancient story of {chapter_title}. "
        "This is a demonstration of the OmStream audio engine. "
        "In the final version, the complete scripture will be narrated, "
        "bringing to life the epic tales of gods, demons, and heroes."
    )
