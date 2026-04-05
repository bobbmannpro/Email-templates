import { describe, it, expect } from "vitest";
import {
  buildPoolBlock,
  buildWeatherBlock,
  buildInstructorBlock,
  buildRatesBlock,
  buildTriathlonBlock,
  buildTeamBlock,
  buildEmailHtml,
} from "../email.js";

describe("buildPoolBlock", () => {
  it("contains Hotel Pool label for hotel type", () => {
    expect(buildPoolBlock("hotel")).toContain("Hotel Pool");
  });

  it("contains Fitness Center Pool label for fitness type", () => {
    expect(buildPoolBlock("fitness")).toContain("Fitness Center Pool");
  });

  it("hotel block mentions towels", () => {
    expect(buildPoolBlock("hotel")).toContain("Bring your own towel");
  });

  it("fitness block mentions towels available", () => {
    expect(buildPoolBlock("fitness")).toContain("Towels are available");
  });
});

describe("buildWeatherBlock", () => {
  it("returns empty string for null forecast", () => {
    expect(buildWeatherBlock(null)).toBe("");
  });

  it("returns empty string for empty array", () => {
    expect(buildWeatherBlock([])).toBe("");
  });

  it("includes forecast data when provided", () => {
    const forecast = [{ day: "Mon May 12", icon: "☀️", high: "85°", low: "65°", rain: "2%" }];
    const result = buildWeatherBlock(forecast);
    expect(result).toContain("85°");
    expect(result).toContain("Mon May 12");
    expect(result).toContain("1-Day Pool-Side Forecast");
  });
});

describe("buildRatesBlock", () => {
  it("contains Bobby 30-min rate of $80", () => {
    expect(buildRatesBlock()).toContain("$80");
  });

  it("contains Instructor 30-min rate of $60", () => {
    expect(buildRatesBlock()).toContain("$60");
  });

  it("contains Lesson Rates heading", () => {
    expect(buildRatesBlock()).toContain("Lesson Rates");
  });
});

describe("buildTriathlonBlock", () => {
  it("returns empty string when triOn is false", () => {
    expect(buildTriathlonBlock(false, "", "Title", "Desc", "$100")).toBe("");
  });

  it("includes title when triOn is true", () => {
    const result = buildTriathlonBlock(true, "", "My Tri Title", "Some desc", "$120");
    expect(result).toContain("My Tri Title");
  });

  it("includes price when provided", () => {
    const result = buildTriathlonBlock(true, "", "Title", "Desc", "$150/hour");
    expect(result).toContain("$150/hour");
  });

  it("omits date section when triDate is empty", () => {
    const result = buildTriathlonBlock(true, "", "Title", "Desc", "");
    expect(result).not.toContain("📅");
  });
});

describe("buildTeamBlock", () => {
  it("returns empty string when teamOn is false", () => {
    expect(buildTeamBlock(false, "Title", "Desc", "")).toBe("");
  });

  it("includes title when teamOn is true", () => {
    const result = buildTeamBlock(true, "Join the Team", "Great team", "");
    expect(result).toContain("Join the Team");
  });

  it("includes extra details when provided", () => {
    const result = buildTeamBlock(true, "Title", "Desc", "Practice Mon/Wed");
    expect(result).toContain("Practice Mon/Wed");
  });

  it("includes coach email link", () => {
    const result = buildTeamBlock(true, "Title", "Desc", "");
    expect(result).toContain("bmanning@cooperfitnesscenter.com");
  });
});

describe("buildEmailHtml", () => {
  const baseOpts = {
    poolType: "hotel",
    startD: "2025-06-01",
    endD: "2025-06-07",
    forecast: null,
    instOrder: ["bobby"],
    insts: {
      bobby: {
        sel: true,
        name: "Bobby Manning",
        role: "Swim Pro",
        avail: "Every day",
        badge: "Available",
        ages: "All ages",
        pro: true,
        col: "#e8a838",
        ini: "BM",
        bb: "rgba(0,0,0,0.1)",
        bc: "#fff",
        dark: true,
        custom: false,
      },
    },
    title: "Test Email",
    subtitle: "Test subtitle",
    bullets: ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"],
    triOn: false, triDate: "", triTitle: "", triDesc: "", triPrice: "",
    teamOn: false, teamTitle: "", teamDesc: "", teamExtra: "",
  };

  it("starts with DOCTYPE html", () => {
    const result = buildEmailHtml(baseOpts);
    expect(result).toMatch(/^<!DOCTYPE html>/);
  });

  it("contains the booking URL", () => {
    const result = buildEmailHtml(baseOpts);
    expect(result).toContain("cfc.smarthealthclubs.com");
  });

  it("contains the title", () => {
    const result = buildEmailHtml(baseOpts);
    expect(result).toContain("Test Email");
  });

  it("does not contain literal 'undefined' or 'null' in output", () => {
    const result = buildEmailHtml(baseOpts);
    expect(result).not.toContain(">undefined<");
    expect(result).not.toContain(">null<");
  });

  it("includes date range in output", () => {
    const result = buildEmailHtml(baseOpts);
    expect(result).toContain("Jun 1, 2025");
  });
});
