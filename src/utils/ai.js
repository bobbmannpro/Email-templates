import { AI_WORKER_URL } from "../config.js";

/**
 * Generates email header content (title, subtitle, bullets) via the Cloudflare Worker proxy.
 * The Worker calls Google Gemini Flash — no API key needed in the browser.
 *
 * @param {{ poolType: string, startD: string, endD: string }} context
 * @returns {Promise<{ title: string, subtitle: string, bullets: string[] }>}
 */
export async function generateHeader(context) {
  const res = await fetch(AI_WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(context),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Worker error ${res.status}`);
  }

  return res.json();
}
