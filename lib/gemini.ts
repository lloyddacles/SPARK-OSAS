/**
 * SPARK OSAS — Gemini AI Client
 * Uses native fetch so no additional packages are required.
 * Set GEMINI_API_KEY in .env.local to activate real inference.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

export const isGeminiAvailable = () => GEMINI_API_KEY.length > 0;

/**
 * Sends a prompt to Gemini and returns the raw text response.
 * Returns null if the API key is missing or the request fails.
 */
export async function generateGeminiContent(prompt: string): Promise<string | null> {
  if (!isGeminiAvailable()) return null;

  try {
    const response = await fetch(GEMINI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("[Gemini] API error:", err);
      return null;
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? null;
  } catch (err) {
    console.error("[Gemini] Fetch failed:", err);
    return null;
  }
}

/**
 * Sends a prompt expecting a JSON-structured response.
 * Strips markdown code fences if Gemini wraps the output.
 * Returns parsed object or null.
 */
export async function generateGeminiJSON<T = any>(prompt: string): Promise<T | null> {
  const raw = await generateGeminiContent(
    `${prompt}\n\nIMPORTANT: Respond with ONLY valid JSON, no markdown, no explanation.`
  );
  if (!raw) return null;

  try {
    // Strip ```json ... ``` wrappers Gemini sometimes adds
    const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    return JSON.parse(cleaned) as T;
  } catch (e) {
    console.error("[Gemini] JSON parse failed:", e, "\nRaw:", raw);
    return null;
  }
}
