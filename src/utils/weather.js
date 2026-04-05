import { SEASONAL_TEMPS, COND_LIST } from "../config.js";
import { dayLabel } from "./date.js";

/**
 * Returns a weather emoji for a given condition string.
 * @param {string} cond - Weather condition text
 * @returns {string} Weather emoji
 */
export function weatherIcon(cond) {
  const s = (cond || "").toLowerCase();
  if (s.includes("thunder")) return "⛈️";
  if (s.includes("rain") || s.includes("shower")) return "🌧️";
  if (s.includes("fog")) return "🌫️";
  if (s.includes("mostly cloudy")) return "🌥️";
  if (s.includes("partly") || s.includes("mostly sunny")) return "🌤️";
  if (s.includes("cloudy")) return "☁️";
  return "☀️";
}

/**
 * Generates a synthetic weather forecast array based on Dallas seasonal baselines.
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {number} count - Number of forecast days to generate
 * @returns {Array<{day: string, icon: string, high: string, low: string, rain: string}>}
 */
export function generateWeather(startDate, count) {
  const month = new Date(startDate + "T00:00:00").getMonth();
  const [baseHi, baseLo] = SEASONAL_TEMPS[month];
  const condPool = [
    "Sunny", "Mostly Sunny", "Partly Cloudy", "Sunny",
    "Partly Cloudy", "Mostly Cloudy", "Scattered Showers", "Sunny",
  ];
  return Array.from({ length: count }, (_, i) => {
    const label = dayLabel(startDate, i);
    const vary  = Math.round((Math.random() - 0.5) * 8);
    const cond  = condPool[i % condPool.length];
    const rain  = cond.includes("Shower")
      ? "35%"
      : cond.includes("Cloud")
      ? Math.floor(Math.random() * 15) + "%"
      : "2%";
    return {
      day:  label,
      icon: weatherIcon(cond),
      high: baseHi + vary + "°",
      low:  baseLo + Math.round(vary * 0.6) + "°",
      rain,
    };
  });
}

// Re-export so consumers don't need to import from config directly
export { COND_LIST };
