/**
 * Generates email header content (title, subtitle, bullets) using the Claude API.
 * The API key is stored in localStorage under "anthropic_key".
 *
 * Note: Calls the Anthropic API directly from the browser. This is intentional
 * for this internal tool — the key is only stored locally in your browser.
 *
 * @param {{ poolType: string, startD: string, endD: string }} context
 * @returns {Promise<{ title: string, subtitle: string, bullets: string[] }>}
 */
export async function generateHeader(context) {
  const apiKey = localStorage.getItem("anthropic_key");
  if (!apiKey) throw new Error("NO_KEY");

  const { poolType, startD, endD } = context;
  const pool   = poolType === "hotel" ? "Hotel Pool" : "Fitness Center Pool";
  const dates  = startD && endD ? `${startD} through ${endD}` : startD || "upcoming dates";

  const prompt = `You are writing marketing copy for swim lesson emails at Cooper Fitness Center in Dallas, TX.

Generate a fresh email header for private swim lessons. The lessons are at the ${pool}, running ${dates}.

Return ONLY valid JSON in this exact shape — no markdown, no explanation:
{
  "title": "short punchy headline (4-7 words, no punctuation at end)",
  "subtitle": "2-sentence description that mentions Cooper Fitness Center, welcoming non-members, and the value of private lessons (under 160 characters)",
  "bullets": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"]
}

Make it feel fresh and different each time. Focus on confidence, fun, and results.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.content[0].text.trim();
  return JSON.parse(text);
}

/**
 * Gets the stored Anthropic API key from localStorage.
 * @returns {string} The key, or empty string if not set
 */
export function getApiKey() {
  return localStorage.getItem("anthropic_key") || "";
}

/**
 * Saves the Anthropic API key to localStorage.
 * @param {string} key
 */
export function saveApiKey(key) {
  localStorage.setItem("anthropic_key", key.trim());
}
