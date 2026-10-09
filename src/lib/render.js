// Low-level helpers shared by every block renderer.
// Everything here outputs inline-styled, table-based HTML so it survives email clients.

import { fmtDate } from "../utils/date.js";

export function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Resolve a color token ("primary", "accent"...) or pass a hex/rgb through. */
export function color(value, ctx, fallback = "accent") {
  const v = (value || "").trim() || fallback;
  return ctx.brand[v] || v;
}

/** Mix a hex color with white. amount 0 = original, 1 = white. */
export function tint(hex, amount = 0.9) {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return "#f5f7f9";
  const n = parseInt(m[1], 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => Math.round(c + (255 - c) * amount));
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** Blend fg over bg at alpha (hex only) — a solid stand-in for rgba(), which Outlook ignores. */
export function mix(fg, bg, a) {
  const h = (x) => { const m = /^#?([0-9a-f]{6})$/i.exec((x || "").trim()); return m ? parseInt(m[1], 16) : null; };
  const f = h(fg), b = h(bg);
  if (f == null || b == null) return fg;
  const ch = [16, 8, 0].map((sh) => Math.round(((f >> sh) & 255) * a + ((b >> sh) & 255) * (1 - a)));
  return "#" + ch.map((c) => c.toString(16).padStart(2, "0")).join("");
}

/** Pick black or white text for a background color. */
export function onColor(hex, dark = "#0b2545") {
  const m = /^#?([0-9a-f]{6})$/i.exec((hex || "").trim());
  if (!m) return "#ffffff";
  const n = parseInt(m[1], 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return (r * 299 + g * 587 + b * 114) / 1000 > 165 ? dark : "#ffffff";
}

/** Date range text built from the global start/end dates. */
export function dateRange(settings) {
  const { startDate, endDate } = settings;
  if (startDate && endDate) return fmtDate(startDate) + " - " + fmtDate(endDate);
  if (startDate) return "Starting " + fmtDate(startDate);
  return "";
}

/** Replace {book}, {email}, {dates}, {first} … tokens. */
export function tokens(str, ctx, extra = {}) {
  const map = {
    book: ctx.settings.links.book,
    email: ctx.settings.links.email,
    phone: ctx.settings.links.phone,
    dates: dateRange(ctx.settings),
    ...extra,
  };
  return String(str ?? "").replace(/\{(\w+)\}/g, (all, k) => (map[k] != null ? map[k] : all));
}

/** Turn a link field into a usable href ("{book}", an email, or a URL). */
export function href(url, ctx) {
  const u = tokens(url, ctx).trim();
  if (!u) return "";
  if (/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(u)) return "mailto:" + u;
  return u;
}

/**
 * Mini-markdown for user text: **bold**, *italic*, [label](url), line breaks,
 * and lines starting with "- " become check/bullet rows.
 */
export function md(str, ctx, opts = {}) {
  const { extra, bullet = "&#10003;", bulletColor } = opts;
  const lines = esc(tokens(str, ctx, extra)).split(/\r?\n/);
  const inline = (s) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, label, url) => {
        const h = href(url.replace(/&amp;/g, "&"), ctx);
        return `<a href="${esc(h)}" style="color:${ctx.brand.accent};text-decoration:underline;">${label}</a>`;
      });
  const out = [];
  for (const line of lines) {
    const b = /^\s*[-•]\s+(.*)$/.exec(line);
    if (b) {
      out.push(
        `<span style="display:block;margin:2px 0;"><span style="color:${bulletColor || ctx.brand.accent};font-weight:bold;">${bullet}</span>&nbsp;${inline(b[1])}</span>`
      );
    } else {
      out.push(inline(line) + "<br>");
    }
  }
  return out.join("").replace(/(<br>)+$/, "");
}

export function plain(str, ctx, extra) {
  return esc(tokens(str, ctx, extra));
}

/** Resolve a photo field: full URL, or a filename under the image base. */
export function photoUrl(photo, ctx) {
  const p = (photo || "").trim();
  if (!p) return "";
  if (/^(https?:|data:)/i.test(p)) return p;
  return ctx.settings.imageBase.replace(/\/$/, "") + "/" + p.replace(/^\//, "");
}

/**
 * "Bulletproof" button: the color and padding live on a table cell, so it keeps its
 * shape in Outlook desktop (which ignores padding on links) as well as Gmail/Yahoo/Apple.
 */
export function button(label, url, ctx, { bg, fg, size = "md", align, mt = 0 } = {}) {
  const h = href(url, ctx);
  if (!label || !h) return "";
  const b = bg || ctx.brand.accent;
  const f = fg || onColor(b);
  const pad = size === "lg" ? "12px 30px" : size === "sm" ? "7px 16px" : "9px 22px";
  const fs = size === "lg" ? 14 : size === "sm" ? 11 : 12;
  const al = align === "center" ? ' align="center"' : align === "right" ? ' align="right"' : "";
  return (
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"${al} style="border-collapse:separate;${align === "center" ? "margin:" + mt + "px auto 0;" : "margin-top:" + mt + "px;"}">` +
    `<tr><td bgcolor="${b}" style="background-color:${b};border-radius:24px;padding:${pad};mso-padding-alt:${pad};text-align:center;">` +
    `<a href="${esc(h)}" target="_blank" style="color:${f};font-family:${ctx.brand.font};font-size:${fs}px;font-weight:bold;line-height:1.2;text-decoration:none;display:inline-block;">${plain(label, ctx)}</a>` +
    `</td></tr></table>`
  );
}

export function avatar(person, size, ctx, ring) {
  const src = photoUrl(person.photo, ctx);
  const border = ring ? `border:3px solid ${ring};` : "";
  let inner;
  if (src) {
    inner = `<img src="${esc(src)}" alt="${esc(person.name)}" width="${size}" height="${size}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;${border}display:block;" />`;
  } else {
    const bg = color(person.color, ctx, "accent");
    inner = `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="${size}" height="${size}" bgcolor="${bg}" align="center" valign="middle" style="width:${size}px;height:${size}px;border-radius:50%;background-color:${bg};${border}font-family:${ctx.brand.font};font-size:${Math.floor(size * 0.28)}px;font-weight:bold;color:${onColor(bg)};text-align:center;">${esc(initials(person.name || "?"))}</td></tr></table>`;
  }
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;"><tr><td align="center">${inner}</td></tr></table>`;
}

export function initials(name) {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return String(name || "").slice(0, 2).toUpperCase();
}

export function heading(text, ctx, { size = 17, color: c, align = "left", margin = "0 0 12px" } = {}) {
  if (!text) return "";
  return `<p style="font-family:${ctx.brand.headingFont};font-size:${size}px;color:${c || ctx.brand.primary};font-weight:bold;line-height:1.25;margin:${margin};text-align:${align};">${plain(text, ctx)}</p>`;
}

export function eyebrow(text, ctx, c) {
  if (!text) return "";
  return `<p style="font-size:11px;font-weight:bold;color:${c || ctx.brand.accent};text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">${plain(text, ctx)}</p>`;
}
