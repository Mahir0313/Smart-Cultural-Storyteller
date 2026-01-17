export const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

/**
 * Fetch available stories/chapters
 */
export async function fetchStories() {
  const res = await fetch(`${BASE_URL}/stories`);
  if (!res.ok) {
    throw new Error("Failed to fetch stories");
  }
  return res.json();
}

/**
 * Play a chapter with selected voice
 * @param {string} chapterTitle
 * @param {string} voiceGender - "male" or "female"
 */
export async function playChapter(chapterTitle, voiceGender = "male") {
  const res = await fetch(`${BASE_URL}/play/${voiceGender}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chapter_title: chapterTitle,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to play chapter");
  }

  return res.json(); // { url: "/audio/xyz.mp3" }
}

/**
 * Generate episode from free text
 */
export async function generateEpisode(text) {
  const res = await fetch(`${BASE_URL}/generate_episode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error("Failed to generate episode");
  }

  return res.json(); // { url: "/audio/xyz.mp3" }
}
