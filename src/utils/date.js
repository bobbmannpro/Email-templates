/**
 * Formats an ISO date string into a human-readable date.
 * @param {string} s - ISO date string (YYYY-MM-DD)
 * @returns {string} e.g. "May 12, 2025", or "" if s is falsy
 */
export function fmtDate(s) {
  if (!s) return "";
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Returns a short day label offset from a base date.
 * @param {string} base - ISO date string (YYYY-MM-DD)
 * @param {number} n - Number of days to offset from base
 * @returns {string} e.g. "Mon May 12"
 */
export function dayLabel(base, n) {
  const d = new Date(base + "T00:00:00");
  d.setDate(d.getDate() + n);
  return d
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
    .replace(",", "");
}

/**
 * Computes the number of days in a date range, clamped to 1–16.
 * Returns 7 if either date is missing.
 * @param {string} s - Start date ISO string
 * @param {string} e - End date ISO string
 * @returns {number}
 */
export function numDays(s, e) {
  if (!s || !e) return 7;
  const diff =
    Math.round(
      (new Date(e + "T00:00:00") - new Date(s + "T00:00:00")) / 86400000
    ) + 1;
  return Math.max(1, Math.min(diff, 16));
}
