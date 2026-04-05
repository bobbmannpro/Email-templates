import { useState } from "react";
import { generateWeather, fetchRealWeather } from "../utils/weather.js";
import { numDays, dayLabel } from "../utils/date.js";
import { COND_LIST } from "../config.js";
import { weatherIcon } from "../utils/weather.js";

/**
 * Custom hook for managing weather forecast state and actions.
 * @param {string} startD - Start date ISO string
 * @param {string} endD - End date ISO string
 * @returns {Object} Weather state, setters, and action handlers
 */
export function useWeather(startD, endD) {
  const [forecast, setForecast]   = useState(null);
  const [wxMode, setWxMode]       = useState("live");
  const [manRows, setManRows]     = useState([]);
  const [wxErr, setWxErr]         = useState("");
  const [wxLoading, setWxLoading] = useState(false);

  const dc = numDays(startD, endD);

  /**
   * Fetches a real weather forecast from Open-Meteo for zip 75230.
   * Falls back to auto-generate if the date range is beyond the 16-day forecast window.
   */
  async function fetchLiveWx() {
    if (!startD) { setWxErr("Select a start date first."); return; }
    setWxErr("");

    // Open-Meteo only forecasts up to 16 days from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startD);
    const daysUntilStart = Math.round((start - today) / 86400000);
    if (daysUntilStart > 16) {
      setWxErr("Live weather only available within 16 days — using Auto-Generate for this date range.");
      setForecast(generateWeather(startD, dc));
      return;
    }

    setWxLoading(true);
    try {
      const end = endD || startD;
      const data = await fetchRealWeather(startD, end);
      setForecast(data);
    } catch (e) {
      setWxErr("Could not fetch live weather. Using Auto-Generate instead.");
      setForecast(generateWeather(startD, dc));
    } finally {
      setWxLoading(false);
    }
  }

  /**
   * Generates an auto weather forecast for the current date range.
   */
  function genAutoWx() {
    if (!startD) { setWxErr("Select a start date first."); return; }
    setWxErr("");
    setForecast(generateWeather(startD, dc));
  }

  /**
   * Creates the manual weather entry rows based on the current date range.
   */
  function setupRows() {
    if (!startD) { setWxErr("Select a start date first."); return; }
    setWxErr("");
    setForecast(null);
    const count = endD ? dc : 1;
    setManRows(
      Array.from({ length: count }, (_, i) => ({
        day: dayLabel(startD, i),
        cond: "Sunny",
        hi: "",
        lo: "",
        rain: "",
      }))
    );
  }

  /**
   * Updates a single field in a manual weather row.
   * @param {number} i - Row index
   * @param {string} key - Field name
   * @param {string} val - New value
   */
  function updateRow(i, key, val) {
    setManRows((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: val };
      return next;
    });
  }

  /**
   * Validates and applies manual weather rows as the active forecast.
   */
  function applyManual() {
    for (const r of manRows) {
      if (!r.hi || !r.lo) { setWxErr("Fill High and Low for every day."); return; }
      const hi = parseInt(r.hi, 10);
      const lo = parseInt(r.lo, 10);
      if (isNaN(hi) || isNaN(lo)) { setWxErr("High and Low must be numbers (e.g. 85)."); return; }
      if (hi < 0 || hi > 120 || lo < 0 || lo > 120) { setWxErr("Temperatures must be between 0°F and 120°F."); return; }
    }
    setWxErr("");
    setForecast(
      manRows.map((r) => ({
        day:  r.day,
        icon: weatherIcon(r.cond),
        high: r.hi.includes("°") ? r.hi : r.hi + "°",
        low:  r.lo.includes("°") ? r.lo : r.lo + "°",
        rain: r.rain ? (r.rain.includes("%") ? r.rain : r.rain + "%") : "--",
      }))
    );
  }

  return {
    forecast, setForecast,
    wxMode, setWxMode,
    manRows, setManRows,
    wxErr, setWxErr,
    wxLoading,
    dc,
    fetchLiveWx, genAutoWx, setupRows, updateRow, applyManual,
    COND_LIST,
  };
}
