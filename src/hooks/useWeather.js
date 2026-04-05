import { useState } from "react";
import { generateWeather } from "../utils/weather.js";
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
  const [forecast, setForecast] = useState(null);
  const [wxMode, setWxMode]     = useState("auto");
  const [manRows, setManRows]   = useState([]);
  const [wxErr, setWxErr]       = useState("");

  const dc = numDays(startD, endD);

  /**
   * Creates the manual weather entry rows based on the current date range.
   * Sets an error if no start date is selected.
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
   * @param {string} key - Field name ("cond", "hi", "lo", "rain")
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
   * Validates and applies the manual weather rows as the active forecast.
   * Sets wxErr on validation failure.
   */
  function applyManual() {
    for (const r of manRows) {
      if (!r.hi || !r.lo) {
        setWxErr("Fill High and Low for every day.");
        return;
      }
      const hi = parseInt(r.hi, 10);
      const lo = parseInt(r.lo, 10);
      if (isNaN(hi) || isNaN(lo)) {
        setWxErr("High and Low must be numbers (e.g. 85).");
        return;
      }
      if (hi < 0 || hi > 120 || lo < 0 || lo > 120) {
        setWxErr("Temperatures must be between 0°F and 120°F.");
        return;
      }
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

  /**
   * Generates an auto weather forecast for the current date range.
   * Sets an error if no start date is selected.
   */
  function genAutoWx() {
    if (!startD) { setWxErr("Select a start date first."); return; }
    setWxErr("");
    setForecast(generateWeather(startD, dc));
  }

  return {
    forecast, setForecast,
    wxMode, setWxMode,
    manRows, setManRows,
    wxErr, setWxErr,
    dc,
    setupRows, updateRow, applyManual, genAutoWx,
    COND_LIST,
  };
}
