import { describe, it, expect } from "vitest";
import { fmtDate, dayLabel, numDays } from "../date.js";

describe("fmtDate", () => {
  it("returns empty string for falsy input", () => {
    expect(fmtDate("")).toBe("");
    expect(fmtDate(null)).toBe("");
    expect(fmtDate(undefined)).toBe("");
  });

  it("formats a date to short month, day, year", () => {
    expect(fmtDate("2025-05-12")).toBe("May 12, 2025");
  });

  it("formats January correctly", () => {
    expect(fmtDate("2025-01-01")).toBe("Jan 1, 2025");
  });
});

describe("numDays", () => {
  it("returns 7 when start is missing", () => {
    expect(numDays("", "2025-05-18")).toBe(7);
  });

  it("returns 7 when end is missing", () => {
    expect(numDays("2025-05-12", "")).toBe(7);
  });

  it("counts days inclusively", () => {
    expect(numDays("2025-05-12", "2025-05-18")).toBe(7);
  });

  it("returns 1 for same-day range", () => {
    expect(numDays("2025-05-12", "2025-05-12")).toBe(1);
  });

  it("clamps at 16 for long ranges", () => {
    expect(numDays("2025-05-01", "2025-06-30")).toBe(16);
  });

  it("returns 1 minimum for reversed dates", () => {
    expect(numDays("2025-05-18", "2025-05-12")).toBe(1);
  });
});

describe("dayLabel", () => {
  it("returns the correct day for offset 0", () => {
    // 2025-05-12 is a Monday
    const label = dayLabel("2025-05-12", 0);
    expect(label).toMatch(/^Mon/);
  });

  it("advances by one day for offset 1", () => {
    const label = dayLabel("2025-05-12", 1);
    expect(label).toMatch(/^Tue/);
  });

  it("contains the month and day", () => {
    const label = dayLabel("2025-05-12", 0);
    expect(label).toContain("May");
    expect(label).toContain("12");
  });
});
