/**
 * Cloudflare Worker — AI header generation proxy for Cooper Swim Email Generator
 *
 * Deploy this to Cloudflare Workers (free plan: 100k requests/day).
 * Set a secret environment variable named GEMINI_KEY with your Google Gemini API key.
 * Get a free Gemini key at: https://aistudio.google.com/apikey
 *
 * Deploy with Wrangler CLI:
 *   npx wrangler deploy
 *   npx wrangler secret put GEMINI_KEY
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function buildPrompt(poolType, startD, endD) {
  const pool  = poolType === "hotel" ? "Hotel Pool" : "Fitness Center Pool";
  const dates = startD && endD ? `${startD} through ${endD}` : startD || "upcoming dates";
  return `You are writing marketing copy for swim lesson emails at Cooper Fitness Center in Dallas, TX.

Generate a fresh email header for private swim lessons. The lessons are at the ${pool}, running ${dates}.

Return ONLY valid JSON in this exact shape — no markdown, no explanation:
{
  "title": "short punchy headline (4-7 words, no punctuation at end)",
  "subtitle": "2-sentence description that mentions Cooper Fitness Center, welcoming non-members, and the value of private lessons (under 160 characters)",
  "bullets": ["benefit 1", "benefit 2", "benefit 3", "benefit 4"]
}

Make it feel fresh and different each time. Focus on confidence, fun, and results.`;
}

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    if (!env.GEMINI_KEY) {
      return json({ error: "GEMINI_KEY secret not configured" }, 500);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const { poolType, startD, endD } = body;
    const prompt = buildPrompt(poolType, startD, endD);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 400, temperature: 0.85 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}));
      return json({ error: err?.error?.message || `Gemini error ${geminiRes.status}` }, 502);
    }

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Strip markdown code fences if Gemini wraps the JSON
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return json({ error: "Could not parse AI response as JSON", raw: text }, 500);
    }

    return json(parsed);
  },
};
