import { SEASONAL_TEMPS, COND_LIST, WEATHER_LAT, WEATHER_LON } from "../config.js";
import { dayLabel } from "./date.js";

// WMO weather interpretation codes → condition string
const WMO_TO_COND = {
  0: "Sunny",
  1: "Mostly Sunny",
  2: "Partly Cloudy",
  3: "Mostly Cloudy",
  45: "Fog", 48: "Fog",
  51: "Rain", 53: "Rain", 55: "Rain",
  56: "Rain", 57: "Rain",
  61: "Rain", 63: "Rain", 65: "Rain",
  66: "Rain", 67: "Rain",
  71: "Cloudy", 73: "Cloudy", 75: "Cloudy", 77: "Cloudy",
  80: "Scattered Showers", 81: "Scattered Showers", 82: "Scattered Showers",
  85: "Cloudy", 86: "Cloudy",
  95: "Thunderstorms",
  96: "Thunderstorms", 99: "Thunderstorms",
};

/**
 * Fetches a real weather forecast for zip 75230 (North Dallas) from Open-Meteo.
 * Free API — no key required.
 * @param {string} startDate - ISO date string (YYYY-MM-DD)
 * @param {string} endDate - ISO date string (YYYY-MM-DD)
 * @returns {Promise<Array<{day,icon,high,low,rain}>>}
 */
export async function fetchRealWeather(startDate, endDate) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", WEATHER_LAT);
  url.searchParams.set("longitude", WEATHER_LON);
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "America/Chicago");
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  const data = await res.json();

  const { time, temperature_2m_max, temperature_2m_min, weather_code, precipitation_probability_max } = data.daily;

  return time.map((isoDate, i) => {
    const d = new Date(isoDate + "T00:00:00");
    const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).replace(",", "");
    const cond  = WMO_TO_COND[weather_code[i]] || "Sunny";
    const rain  = precipitation_probability_max[i] != null ? precipitation_probability_max[i] + "%" : "2%";
    return {
      day:  label,
      icon: weatherIcon(cond),
      high: temperature_2m_max[i] + "°",
      low:  temperature_2m_min[i] + "°",
      rain,
    };
  });
}

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
