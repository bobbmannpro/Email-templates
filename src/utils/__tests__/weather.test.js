import { describe, it, expect } from "vitest";
import { weatherIcon, generateWeather } from "../weather.js";

describe("weatherIcon", () => {
  it("returns sunny for empty or unknown string", () => {
    expect(weatherIcon("")).toBe("☀️");
    expect(weatherIcon("Unknown")).toBe("☀️");
  });

  it("returns storm emoji for thunderstorms", () => {
    expect(weatherIcon("Thunderstorms")).toBe("⛈️");
  });

  it("returns rain emoji for Rain", () => {
    expect(weatherIcon("Rain")).toBe("🌧️");
  });

  it("returns rain emoji for Scattered Showers", () => {
    expect(weatherIcon("Scattered Showers")).toBe("🌧️");
  });

  it("returns cloudy emoji for Mostly Cloudy", () => {
    expect(weatherIcon("Mostly Cloudy")).toBe("🌥️");
  });

  it("returns partly cloudy for Partly Cloudy", () => {
    expect(weatherIcon("Partly Cloudy")).toBe("🌤️");
  });

  it("returns fog emoji for Fog", () => {
    expect(weatherIcon("Fog")).toBe("🌫️");
  });

  it("returns sun emoji for Sunny", () => {
    expect(weatherIcon("Sunny")).toBe("☀️");
  });
});

describe("generateWeather", () => {
  it("returns an array of the requested length", () => {
    const result = generateWeather("2025-05-12", 3);
    expect(result).toHaveLength(3);
  });

  it("each entry has required properties", () => {
    const result = generateWeather("2025-05-12", 1);
    const d = result[0];
    expect(d).toHaveProperty("day");
    expect(d).toHaveProperty("icon");
    expect(d).toHaveProperty("high");
    expect(d).toHaveProperty("low");
    expect(d).toHaveProperty("rain");
  });

  it("high and low strings end with degree symbol", () => {
    const result = generateWeather("2025-05-12", 1);
    expect(result[0].high).toMatch(/°$/);
    expect(result[0].low).toMatch(/°$/);
  });

  it("rain string ends with % symbol", () => {
    const result = generateWeather("2025-05-12", 1);
    expect(result[0].rain).toMatch(/%$/);
  });

  it("May temperatures are in a reasonable range", () => {
    const results = Array.from({ length: 20 }, () => generateWeather("2025-05-15", 1)[0]);
    results.forEach((d) => {
      const hi = parseInt(d.high, 10);
      const lo = parseInt(d.low, 10);
      expect(hi).toBeGreaterThan(60);
      expect(hi).toBeLessThan(110);
      expect(lo).toBeGreaterThan(50);
      expect(lo).toBeLessThan(100);
    });
  });
});
