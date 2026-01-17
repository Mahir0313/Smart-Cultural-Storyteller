import json
import os
from functools import lru_cache
from ..config import BASE_DIR

@lru_cache(maxsize=None)
def load_stories():
    stories_path = os.path.join(BASE_DIR, "app", "data", "stories.json")
    with open(stories_path, "r", encoding="utf-8") as f:
        return json.load(f)
