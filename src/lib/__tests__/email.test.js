import { describe, it, expect } from "vitest";
import { renderEmail, exportHtml } from "../email.js";
import { defaultDoc, TEMPLATES, fromTemplate, normalizeDoc } from "../defaults.js";
import { BLOCK_TYPES, createBlock } from "../blocks.js";

describe("renderEmail", () => {
  it("outputs body-only HTML (no doctype/head/style)", () => {
    const html = exportHtml(defaultDoc());
    expect(html).not.toMatch(/<!DOCTYPE|<html|<head|<style/i);
    expect(html).toContain("max-width:600px");
    expect(html).not.toContain("data-block");
  });

  it("renders every block type without throwing", () => {
    const doc = defaultDoc();
    doc.blocks = Object.keys(BLOCK_TYPES).map((t) => createBlock(t));
    expect(() => renderEmail(doc, { preview: true })).not.toThrow();
  });

  it("renders every template", () => {
    const doc = defaultDoc();
    doc.blocks = TEMPLATES.map(fromTemplate);
    const html = renderEmail(doc);
    expect(html).toContain("Hotel Pool");
    expect(html).toContain("$160");
    expect(html).toContain("Cooper Cyclones");
  });

  it("hides hidden blocks", () => {
    const doc = defaultDoc();
    doc.blocks = [createBlock("text", { body: "SECRET", hidden: true })];
    expect(renderEmail(doc)).not.toContain("SECRET");
  });

  it("escapes user text but supports bold and links", () => {
    const doc = defaultDoc();
    doc.blocks = [createBlock("text", { body: "<script>x</script> **bold** [Book]({book})" })];
    const html = renderEmail(doc);
    expect(html).not.toContain("<script>");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain('href="https://cfc.smarthealthclubs.com');
  });

  it("uses the date range token", () => {
    const doc = defaultDoc();
    doc.settings.startDate = "2026-10-12";
    doc.settings.endDate = "2026-10-18";
    doc.blocks = [createBlock("hero")];
    expect(renderEmail(doc)).toContain("Oct 12, 2026 - Oct 18, 2026");
  });

  it("turns email addresses into mailto links", () => {
    const doc = defaultDoc();
    doc.blocks = [createBlock("button", { label: "Email", url: "{email}" })];
    expect(renderEmail(doc)).toContain("mailto:bmanning@cooperfitnesscenter.com");
  });

  it("featured flag is per-person, not hardcoded", () => {
    const doc = defaultDoc();
    doc.roster = doc.roster.map((p) => ({ ...p, featured: p.id === "madeline" }));
    doc.blocks = [createBlock("people", { ids: ["bobby", "madeline"] })];
    const html = renderEmail(doc);
    expect(html.indexOf("Madeline")).toBeLessThan(html.indexOf("Bobby"));
  });

  it("normalizeDoc repairs junk", () => {
    expect(normalizeDoc(null).blocks.length).toBeGreaterThan(0);
    const d = normalizeDoc({ blocks: [{ type: "text" }], settings: { brand: { primary: "#000000" } } });
    expect(d.settings.brand.accent).toBe("#1e88c7");
    expect(d.blocks[0].id).toBeTruthy();
  });
});

describe("inbox compatibility", () => {
  const all = () => {
    const doc = defaultDoc();
    doc.blocks = [...TEMPLATES.map(fromTemplate), ...Object.keys(BLOCK_TYPES).filter((t) => t !== "html").map((t) => createBlock(t))];
    doc.forecast = Array.from({ length: 7 }, (_, i) => ({ day: "Mon " + i, icon: "☀️", high: "80°", low: "60°", rain: "2%" }));
    return exportHtml(doc);
  };
  it("uses no rgba(), opacity, flex/grid, or scrolling containers", () => {
    const h = all();
    expect(h).not.toMatch(/rgba\(|opacity:0\.|display:flex|display:grid|overflow-x/);
  });
  it("has the Outlook 600px ghost table", () => {
    expect(all()).toContain('<!--[if mso]><table role="presentation" width="600"');
  });
  it("buttons are bulletproof table cells", () => {
    const h = all();
    expect(h).toMatch(/<td bgcolor="#[0-9a-f]{6}" style="background-color:#[0-9a-f]{6};border-radius:24px;padding:/);
    expect(h).not.toMatch(/<a [^>]*style="display:inline-block;background/);
  });
  it("has no <style> tags or classes", () => {
    expect(all()).not.toMatch(/<style|class="/);
  });
  it("stays well under Gmail's 102KB clip for a normal email", () => {
    expect(new Blob([exportHtml(defaultDoc())]).size).toBeLessThan(60000);
  });
});
