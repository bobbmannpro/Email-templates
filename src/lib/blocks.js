// Every email section is a "block". Each block type declares:
//   label / icon / hint  – shown in the editor
//   fields               – drives the generic field editor (no per-block UI code needed)
//   defaults()           – a fresh block of this type
//   render(block, ctx)   – returns inner HTML for the block
// Adding a new kind of section = adding one entry here.

import {
  esc, color, tint, onColor, mix, md, plain, href, photoUrl, button, avatar, heading, eyebrow, tokens,
} from "./render.js";

const ALIGN = [["left", "Left"], ["center", "Center"], ["right", "Right"]];

export const BLOCK_TYPES = {
  hero: {
    label: "Headline / Hero",
    icon: "🏷️",
    hint: "Big headline, date line, intro and benefit bullets",
    fields: [
      { key: "ideas", type: "ideas" },
      { key: "title", label: "Headline", type: "text" },
      { key: "dateLine", label: "Date line", type: "text", help: "Use {dates} for the date range from Settings, or type anything." },
      { key: "subtitle", label: "Intro", type: "textarea" },
      { key: "bullets", label: "Bullets", type: "list", addLabel: "+ Bullet" },
      { key: "columns", label: "Bullet columns", type: "select", options: [["1", "1"], ["2", "2"]] },
      { key: "align", label: "Align", type: "select", options: ALIGN },
    ],
    defaults: () => ({
      title: "Private Swim Lessons",
      dateLine: "{dates}",
      subtitle: "Cooper Fitness Center is your home for private swim lessons — all skill levels, all ages, certified instruction.",
      bullets: ["Expert one-on-one coaching", "Beginner to competitive levels", "Flexible scheduling available", "Members and non-members welcome"],
      columns: "2",
      align: "left",
      bg: "#f3f8fc",
      borderBottom: "accent",
    }),
    render(b, ctx) {
      const dl = tokens(b.dateLine, ctx).trim();
      const items = (b.bullets || []).filter((x) => x && x.trim());
      const cell = (arr) =>
        arr.map((x) => `<p style="font-size:12px;color:${ctx.brand.text};margin:0 0 4px;"><span style="color:${ctx.brand.accent};font-weight:bold;">&#10003;</span> ${md(x, ctx)}</p>`).join("");
      let list = "";
      if (items.length) {
        if (b.columns === "2" && items.length > 1) {
          const half = Math.ceil(items.length / 2);
          list = `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;"><tr><td style="width:50%;padding-right:8px;vertical-align:top;">${cell(items.slice(0, half))}</td><td style="width:50%;vertical-align:top;">${cell(items.slice(half))}</td></tr></table>`;
        } else list = cell(items);
      }
      return (
        `<p style="font-family:${ctx.brand.headingFont};font-size:22px;color:${ctx.brand.primary};line-height:1.2;margin:0 0 8px;text-align:${b.align || "left"};">${plain(b.title, ctx)}` +
        (dl ? `<br><em style="color:${ctx.brand.accent};font-weight:normal;">${esc(dl)}</em>` : "") +
        `</p>` +
        (b.subtitle ? `<p style="font-size:13px;color:${ctx.brand.muted};line-height:1.6;margin:0 0 12px;text-align:${b.align || "left"};">${md(b.subtitle, ctx)}</p>` : "") +
        list
      );
    },
  },

  banner: {
    label: "Banner strip",
    icon: "📣",
    hint: "Colored strip with a short message",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "sub", label: "Subtext", type: "text" },
      { key: "color", label: "Color", type: "color" },
    ],
    defaults: () => ({ title: "Non-Members Are Always Welcome!", sub: "No Cooper membership needed. Everyone is invited.", color: "highlight", pad: "tight" }),
    render(b, ctx) {
      const bg = color(b.color, ctx, "highlight");
      const fg = onColor(bg, ctx.brand.primary);
      return { bg, html: `<p style="font-family:${ctx.brand.headingFont};font-size:14px;color:${fg};font-weight:bold;margin:0;text-align:center;">${plain(b.title, ctx)}</p>` + (b.sub ? `<p style="font-size:11px;color:${mix(fg, bg, 0.9)};margin:3px 0 0;text-align:center;">${md(b.sub, ctx)}</p>` : "") };
    },
  },

  heading: {
    label: "Heading",
    icon: "🔠",
    hint: "A section title",
    fields: [
      { key: "text", label: "Text", type: "text" },
      { key: "size", label: "Size", type: "select", options: [["15", "Small"], ["18", "Medium"], ["22", "Large"], ["28", "Huge"]] },
      { key: "align", label: "Align", type: "select", options: ALIGN },
      { key: "color", label: "Color", type: "color" },
    ],
    defaults: () => ({ text: "New Section", size: "18", align: "left", color: "primary", pad: "tight" }),
    render: (b, ctx) => heading(b.text, ctx, { size: +b.size || 18, align: b.align, color: color(b.color, ctx, "primary"), margin: "0" }),
  },

  text: {
    label: "Text",
    icon: "📝",
    hint: "A paragraph. **bold**, *italic*, [links](url), - bullets",
    fields: [
      { key: "body", label: "Text", type: "textarea", rows: 5 },
      { key: "size", label: "Size", type: "select", options: [["12", "Small"], ["14", "Normal"], ["16", "Large"]] },
      { key: "align", label: "Align", type: "select", options: ALIGN },
    ],
    defaults: () => ({ body: "Write anything here. Use **bold**, *italic*, and [links](https://example.com).", size: "14", align: "left" }),
    render: (b, ctx) => `<p style="font-size:${+b.size || 14}px;color:${ctx.brand.text};line-height:1.65;margin:0;text-align:${b.align || "left"};">${md(b.body, ctx)}</p>`,
  },

  callout: {
    label: "Callout box",
    icon: "🗂️",
    hint: "Boxed info: pool location, conditions, programs, announcements",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea", rows: 5 },
      { key: "style", label: "Style", type: "select", options: [["tint", "Tinted"], ["dark", "Dark / bold"], ["outline", "Outline"], ["plain", "Plain"]] },
      { key: "color", label: "Color", type: "color" },
      { key: "logo", label: "Logo / image (right side)", type: "image" },
      { key: "btnLabel", label: "Button text", type: "text" },
      { key: "btnUrl", label: "Button link", type: "text", help: "{book}, {email}, an email address, or any URL" },
    ],
    defaults: () => ({ eyebrow: "Heads Up", title: "", body: "- First point\n- Second point", style: "tint", color: "accent", logo: "", btnLabel: "", btnUrl: "{book}" }),
    render(b, ctx) {
      const c = color(b.color, ctx);
      const dark = b.style === "dark";
      const boxBg = dark ? c : b.style === "tint" ? tint(c, 0.9) : "#ffffff";
      const boxBorder = dark ? "none" : b.style === "plain" ? "none" : b.style === "outline" ? `2px solid ${c}` : `1px solid ${tint(c, 0.7)};border-left:4px solid ${c}`;
      const titleColor = dark ? "#ffffff" : ctx.brand.primary;
      const bodyColor = dark ? mix("#ffffff", c, 0.85) : ctx.brand.text;
      const accent = dark ? ctx.brand.highlight : c;
      const logo = photoUrl(b.logo, ctx);
      const titleCell =
        eyebrow(b.eyebrow, ctx, accent) +
        (b.title ? heading(b.title, ctx, { size: 18, color: titleColor, margin: "0" }) : "");
      const top = logo
        ? `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;"><tr><td valign="middle">${titleCell}</td><td width="66" valign="middle" style="text-align:right;"><img src="${esc(logo)}" alt="" width="56" height="56" style="width:56px;height:56px;object-fit:contain;border-radius:8px;display:block;margin-left:auto;" /></td></tr></table>`
        : titleCell ? `<div style="margin-bottom:10px;">${titleCell}</div>` : "";
      const btn = b.btnLabel ? button(b.btnLabel, b.btnUrl, ctx, { bg: dark ? ctx.brand.highlight : c, mt: 14 }) : "";
      return (
        `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${boxBg};border:${boxBorder};border-radius:10px;"><tr><td style="padding:16px 18px;">` +
        top +
        (b.body ? `<p style="font-size:12px;line-height:1.7;color:${bodyColor};margin:0;">${md(b.body, ctx, { bullet: "&#8226;", bulletColor: accent })}</p>` : "") +
        btn +
        `</td></tr></table>`
      );
    },
  },

  people: {
    label: "Instructor cards",
    icon: "👥",
    hint: "Cards for anyone on your roster",
    fields: [
      { key: "title", label: "Section title", type: "text" },
      { key: "ids", label: "Who shows in this email", type: "people" },
      { key: "btnLabel", label: "Card button text", type: "text", help: "Leave blank for no button. {first} = first name" },
      { key: "btnUrl", label: "Card button link", type: "text" },
      { key: "showDetails", label: "Show availability & ages", type: "toggle" },
    ],
    defaults: () => ({ title: "Meet Your Instructors", ids: [], btnLabel: "Book", btnUrl: "{book}", showDetails: true }),
    render(b, ctx) {
      const people = (b.ids || []).map((id) => ctx.roster.find((p) => p.id === id)).filter(Boolean);
      if (!people.length) return ctx.preview ? `<p style="font-size:12px;color:#9aa8b5;margin:0;text-align:center;">Instructor cards: nobody switched on — this section won't appear in the email.</p>` : "";
      const featured = people.filter((p) => p.featured);
      const others = people.filter((p) => !p.featured);
      const first = (p) => (p.name || "").split(" ")[0];
      const details = (p, fg) =>
        b.showDetails === false ? "" :
        (p.avail ? `<p style="font-size:11px;color:${fg};margin:0 0 3px;">📅 ${plain(p.avail, ctx)}</p>` : "") +
        (p.ages ? `<p style="font-size:11px;color:${fg};margin:0 0 8px;">🏊 ${plain(p.ages, ctx)}</p>` : "");
      const badge = (p, dark) => {
        if (!p.badge) return "";
        const auto = /\bavailable\b/i.test(p.badge) ? ctx.brand.success : ctx.brand.highlight;
        const c = p.badgeColor && p.badgeColor !== "auto" ? color(p.badgeColor, ctx) : auto;
        const bg = dark ? mix("#ffffff", ctx.brand.primary, 0.16) : tint(c, 0.85);
        const fg = dark ? "#ffffff" : c;
        return `<span style="display:inline-block;font-size:9px;font-weight:bold;text-transform:uppercase;padding:3px 10px;border-radius:12px;background:${bg};color:${fg};margin-bottom:10px;">${plain(p.badge, ctx)}</span><br>`;
      };
      const featHtml = featured
        .map((p) =>
          `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${ctx.brand.primary};border-radius:12px;margin-bottom:12px;"><tr>` +
          `<td style="width:104px;padding:16px 0 16px 16px;vertical-align:top;">${avatar(p, 82, ctx, ctx.brand.highlight)}</td>` +
          `<td style="padding:16px 16px 16px 10px;vertical-align:middle;">` +
          `<p style="font-family:${ctx.brand.headingFont};font-size:16px;color:#fff;font-weight:bold;margin:0 0 2px;">${plain(p.name, ctx)}</p>` +
          `<p style="font-size:10px;color:${ctx.brand.highlight};font-weight:bold;margin:0 0 8px;">${plain(p.role, ctx)}</p>` +
          details(p, mix("#ffffff", ctx.brand.primary, 0.8)) + badge(p, true) +
          (b.btnLabel ? button(tokens(b.btnLabel, ctx, { first: first(p) }), p.link || b.btnUrl, ctx, { bg: ctx.brand.highlight }) : "") +
          `</td></tr></table>`
        )
        .join("");
      // Cards go two per row (no sideways scrolling — Outlook can't scroll and phones would overflow).
      const n = others.length;
      const psz = n === 1 ? 96 : 76;
      const card = (p) =>
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f7f9" style="background-color:#f5f7f9;border:1px solid #e8ecf0;border-radius:12px;"><tr><td align="center" style="padding:14px 8px;text-align:center;">` +
        `<div style="padding-bottom:10px;">${avatar(p, psz, ctx, ctx.brand.accent)}</div>` +
        `<p style="font-family:${ctx.brand.headingFont};font-size:14px;color:${ctx.brand.primary};font-weight:bold;margin:0 0 2px;">${plain(p.name, ctx)}</p>` +
        `<p style="font-size:10px;color:${ctx.brand.accent};font-weight:bold;margin:0 0 8px;">${plain(p.role, ctx)}</p>` +
        details(p, ctx.brand.muted) + badge(p, false) +
        (b.btnLabel ? button(tokens(b.btnLabel, ctx, { first: first(p) }), p.link || b.btnUrl, ctx, { size: "sm", align: "center" }) : "") +
        `</td></tr></table>`;
      let grid = "";
      for (let i = 0; i < n; i += 2) {
        const pair = others.slice(i, i + 2);
        const cells = pair.length === 2
          ? pair.map((p, k) => `<td width="50%" valign="top" style="width:50%;vertical-align:top;padding:0 ${k === 0 ? 5 : 0}px 10px ${k === 1 ? 5 : 0}px;">${card(p)}</td>`).join("")
          : `<td width="25%" style="width:25%;"></td><td width="50%" valign="top" style="width:50%;vertical-align:top;padding-bottom:10px;">${card(pair[0])}</td><td width="25%" style="width:25%;"></td>`;
        grid += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;"><tr>${cells}</tr></table>`;
      }
      return heading(b.title, ctx) + featHtml + grid;
    },
  },

  spotlight: {
    label: "Spotlight",
    icon: "⭐",
    hint: "Feature one person with a bio, fun fact and greeting clip",
    fields: [
      { key: "eyebrow", label: "Small label", type: "text" },
      { key: "personId", label: "Person", type: "person" },
      { key: "name", label: "Name (if not on roster)", type: "text", showIf: (b) => !b.personId },
      { key: "role", label: "Role (if not on roster)", type: "text", showIf: (b) => !b.personId },
      { key: "photo", label: "Photo (if not on roster)", type: "image", showIf: (b) => !b.personId },
      { key: "bio", label: "Bio", type: "textarea", rows: 4 },
      { key: "fun", label: "Fun fact", type: "text" },
      { key: "clip", label: "Greeting clip URL (MP4)", type: "text", help: "Plays in Apple Mail & Samsung Mail; others just see the card." },
      { key: "style", label: "Card style", type: "select", options: [["light", "Light"], ["dark", "Dark"]] },
      { key: "btnLabel", label: "Button text", type: "text", help: "{first} = first name" },
      { key: "btnUrl", label: "Button link", type: "text" },
    ],
    defaults: () => ({ eyebrow: "Instructor Spotlight", personId: "", name: "", role: "", photo: "", bio: "", fun: "", clip: "", style: "light", btnLabel: "Book a Lesson with {first}", btnUrl: "{book}" }),
    render(b, ctx) {
      const r = b.personId ? ctx.roster.find((p) => p.id === b.personId) : null;
      const p = r || { name: b.name, role: b.role, photo: b.photo, color: "accent" };
      if (!p.name) return "";
      const dark = b.style === "dark";
      const bg = dark ? ctx.brand.primary : "#f5f7f9";
      const first = p.name.split(" ")[0];
      const poster = photoUrl(p.photo, ctx);
      const clip = b.clip
        ? `<video autoplay="" muted="" loop="" playsinline=""${poster ? ` poster="${esc(poster)}"` : ""} style="width:100%;border-radius:10px;margin-bottom:12px;display:block;"><source src="${esc(b.clip)}" type="video/mp4"></video>`
        : "";
      return (
        eyebrow(b.eyebrow, ctx) + clip +
        `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${bg};border:${dark ? "none" : "1px solid #e8ecf0"};border-radius:12px;"><tr>` +
        `<td width="96" style="padding:16px 0 16px 16px;vertical-align:top;">${avatar(p, 72, ctx, dark ? ctx.brand.highlight : ctx.brand.accent)}</td>` +
        `<td style="padding:16px 14px 16px 6px;vertical-align:top;">` +
        `<p style="font-family:${ctx.brand.headingFont};font-size:15px;color:${dark ? "#fff" : ctx.brand.primary};font-weight:bold;margin:0 0 2px;">${plain(p.name, ctx)}</p>` +
        `<p style="font-size:10px;color:${dark ? ctx.brand.highlight : ctx.brand.accent};font-weight:bold;text-transform:uppercase;margin:0 0 8px;">${plain(p.role, ctx)}</p>` +
        (b.bio ? `<p style="font-size:12px;color:${dark ? mix("#ffffff", ctx.brand.primary, 0.85) : ctx.brand.muted};line-height:1.6;margin:0 0 8px;">${md(b.bio, ctx, { extra: { first } })}</p>` : "") +
        (b.fun ? `<p style="font-size:11px;color:${ctx.brand.highlight};font-weight:bold;margin:0;">⭐ ${plain(b.fun, ctx)}</p>` : "") +
        `</td></tr></table>` +
        (b.btnLabel ? button(tokens(b.btnLabel, ctx, { first }), (r && r.link) || b.btnUrl, ctx, { bg: dark ? ctx.brand.highlight : ctx.brand.accent, align: "center", mt: 12 }) : "")
      );
    },
  },

  rates: {
    label: "Rates / price table",
    icon: "💲",
    hint: "Any number of price tables, any rows",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "badge", label: "Badge", type: "text", help: "e.g. PRO or INSTRUCTOR — blank to hide" },
      { key: "badgeColor", label: "Badge color", type: "color" },
      { key: "badgeName", label: "Name next to badge", type: "text" },
      { key: "tables", label: "Tables", type: "tables" },
      { key: "btnLabel", label: "Button text", type: "text" },
      { key: "btnUrl", label: "Button link", type: "text" },
      { key: "note", label: "Footnote", type: "text" },
    ],
    defaults: () => ({
      title: "Rates", badge: "", badgeColor: "primary", badgeName: "",
      tables: [{ title: "Private Lessons", col1: "Duration", col2: "Rate", rows: [{ label: "30 min", price: "$60" }, { label: "60 min", price: "$120" }] }],
      btnLabel: "Book Now", btnUrl: "{book}", note: "Members and non-members welcome.",
    }),
    render(b, ctx) {
      const th = (t, right) => `<td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;border-bottom:2px solid #e8ecf0;${right ? "text-align:right;" : ""}">${plain(t, ctx)}</td>`;
      const tables = (b.tables || [])
        .map((t) => {
          const rows = (t.rows || []).filter((r) => r.label || r.price);
          return (
            (t.title ? `<p style="font-size:10px;font-weight:bold;color:${ctx.brand.accent};text-transform:uppercase;letter-spacing:1px;margin:12px 0 4px;">${plain(t.title, ctx)}</p>` : "") +
            `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">` +
            (t.col1 || t.col2 ? `<tr>${th(t.col1)}${th(t.col2, true)}</tr>` : "") +
            rows
              .map((r, i) => {
                const bd = i < rows.length - 1 ? "border-bottom:1px solid #e8ecf0;" : "";
                return `<tr><td style="font-size:13px;color:${ctx.brand.text};padding:7px 8px;${bd}">${plain(r.label, ctx)}</td><td style="font-size:13px;padding:7px 8px;${bd}color:${ctx.brand.primary};font-weight:bold;text-align:right;">${plain(r.price, ctx)}</td></tr>`;
              })
              .join("") +
            `</table>`
          );
        })
        .join("");
      const bc = color(b.badgeColor, ctx, "primary");
      const badge = b.badge || b.badgeName
        ? `<p style="margin:0 0 5px;">` +
          (b.badge ? `<span style="display:inline-block;font-size:9px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:4px 12px;border-radius:12px;background:${bc};color:${onColor(bc)};">${plain(b.badge, ctx)}</span>&nbsp;` : "") +
          (b.badgeName ? `<span style="font-family:${ctx.brand.headingFont};font-size:13px;color:${ctx.brand.primary};">${plain(b.badgeName, ctx)}</span>` : "") +
          `</p>`
        : "";
      return (
        heading(b.title, ctx) + badge + tables +
        (b.btnLabel ? button(b.btnLabel, b.btnUrl, ctx, { align: "center", mt: 14 }) : "") +
        (b.note ? `<p style="font-size:11px;color:#9aa8b5;text-align:center;margin:8px 0 0;">${md(b.note, ctx)}</p>` : "")
      );
    },
  },

  weather: {
    label: "Weather forecast",
    icon: "🌤️",
    hint: "Uses the forecast from Settings → Dates & Weather",
    fields: [
      { key: "title", label: "Title", type: "text", help: "{days} = number of days" },
      { key: "note", label: "Note under forecast", type: "text" },
      { key: "wxinfo", type: "info", text: "Set dates and load the forecast in Settings → Dates & Weather." },
    ],
    defaults: () => ({ title: "{days}-Day Pool-Side Forecast", note: "Forecast for 75230 North Dallas, TX" }),
    render(b, ctx) {
      const f = ctx.forecast || [];
      if (!f.length) return ctx.preview ? `<p style="font-size:12px;color:#9aa8b5;margin:0;text-align:center;">Weather: no forecast loaded yet (Settings → Dates &amp; Weather)</p>` : "";
      // Up to 4 days per row so it fits a 320px phone without sideways scrolling.
      const cell = (d) =>
        `<td width="25%" align="center" valign="top" style="width:25%;padding:3px;">` +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f7f9" style="background-color:#f5f7f9;border:1px solid #e8ecf0;border-radius:8px;"><tr><td align="center" style="padding:8px 2px;text-align:center;">` +
        `<p style="font-size:9px;font-weight:bold;color:#8796a5;text-transform:uppercase;margin:0;">${esc(d.day)}</p>` +
        `<p style="font-size:16px;margin:2px 0;">${esc(d.icon)}</p>` +
        `<p style="font-size:14px;font-weight:bold;color:${ctx.brand.primary};margin:0;">${esc(d.high)}</p>` +
        `<p style="font-size:11px;color:#8796a5;margin:1px 0;">${esc(d.low)}</p>` +
        `<p style="font-size:9px;color:#8796a5;margin:2px 0 0;">${esc(d.rain)}</p></td></tr></table></td>`;
      let rows = "";
      for (let i = 0; i < f.length; i += 4) {
        const row = f.slice(i, i + 4);
        rows += `<tr>${row.map(cell).join("")}${"<td width=\"25%\" style=\"width:25%;\"></td>".repeat(4 - row.length)}</tr>`;
      }
      return (
        heading(tokens(b.title, ctx, { days: f.length }), ctx) +
        `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;table-layout:fixed;">${rows}</table>` +
        (b.note ? `<p style="font-size:11px;color:#9aa8b5;margin:8px 0 0;">${plain(b.note, ctx)}</p>` : "")
      );
    },
  },

  image: {
    label: "Image",
    icon: "🖼️",
    hint: "A photo or graphic, optionally linked",
    fields: [
      { key: "src", label: "Image", type: "image" },
      { key: "alt", label: "Description (alt text)", type: "text" },
      { key: "link", label: "Link when tapped (optional)", type: "text" },
      { key: "width", label: "Width", type: "select", options: [["100", "Full"], ["75", "75%"], ["50", "Half"], ["33", "Small"]] },
      { key: "radius", label: "Rounded corners", type: "toggle" },
      { key: "caption", label: "Caption", type: "text" },
    ],
    defaults: () => ({ src: "", alt: "", link: "", width: "100", radius: true, caption: "" }),
    render(b, ctx) {
      const src = photoUrl(b.src, ctx);
      if (!src) return ctx.preview ? `<p style="font-size:12px;color:#9aa8b5;text-align:center;margin:0;">Image: add a URL or pick a photo</p>` : "";
      const w = Math.round((560 * (+b.width || 100)) / 100);
      let img = `<img src="${esc(src)}" alt="${esc(b.alt)}" width="${w}" style="width:100%;max-width:${w}px;height:auto;${b.radius ? "border-radius:10px;" : ""}display:block;margin:0 auto;" />`;
      const h = href(b.link, ctx);
      if (h) img = `<a href="${esc(h)}" style="display:block;line-height:0;">${img}</a>`;
      return img + (b.caption ? `<p style="font-size:12px;color:${ctx.brand.muted};text-align:center;margin:8px 0 0;">${md(b.caption, ctx)}</p>` : "");
    },
  },

  video: {
    label: "Video",
    icon: "🎬",
    hint: "Thumbnail + Watch button (works in every email app)",
    fields: [
      { key: "url", label: "Video link (YouTube, Drive, MP4…)", type: "text" },
      { key: "poster", label: "Thumbnail image", type: "image" },
      { key: "btnLabel", label: "Button text", type: "text" },
      { key: "caption", label: "Caption", type: "text" },
    ],
    defaults: () => ({ url: "", poster: "", btnLabel: "▶  Watch Video", caption: "" }),
    render(b, ctx) {
      if (!b.url) return ctx.preview ? `<p style="font-size:12px;color:#9aa8b5;text-align:center;margin:0;">Video: add a link</p>` : "";
      const poster = photoUrl(b.poster, ctx);
      const thumb = poster ? `<a href="${esc(href(b.url, ctx))}" style="display:block;line-height:0;margin-bottom:10px;"><img src="${esc(poster)}" width="520" alt="${esc(b.caption || "Watch video")}" style="width:100%;max-width:520px;border-radius:10px;display:block;margin:0 auto;" /></a>` : "";
      return thumb + button(b.btnLabel || "Watch Video", b.url, ctx, { align: "center" }) + (b.caption ? `<p style="font-size:12px;color:${ctx.brand.muted};text-align:center;margin:10px 0 0;">${md(b.caption, ctx)}</p>` : "");
    },
  },

  button: {
    label: "Button",
    icon: "🔘",
    hint: "A call-to-action button",
    fields: [
      { key: "label", label: "Text", type: "text" },
      { key: "url", label: "Link", type: "text", help: "{book}, {email}, an email address, or any URL" },
      { key: "color", label: "Color", type: "color" },
      { key: "size", label: "Size", type: "select", options: [["sm", "Small"], ["md", "Medium"], ["lg", "Large"]] },
      { key: "align", label: "Align", type: "select", options: ALIGN },
    ],
    defaults: () => ({ label: "Book a Lesson", url: "{book}", color: "accent", size: "md", align: "center", pad: "tight" }),
    render: (b, ctx) => button(b.label, b.url, ctx, { bg: color(b.color, ctx), size: b.size, align: b.align || "center" }),
  },

  cta: {
    label: "Big call-to-action",
    icon: "🚀",
    hint: "Bold closing band with a button",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "sub", label: "Subtext", type: "text" },
      { key: "btnLabel", label: "Button text", type: "text" },
      { key: "btnUrl", label: "Button link", type: "text" },
      { key: "foot", label: "Small print", type: "text" },
      { key: "color", label: "Background", type: "color" },
    ],
    defaults: () => ({ title: "Ready to Jump In?", sub: "Spots fill up fast - book your lesson today!", btnLabel: "Book a Lesson", btnUrl: "{book}", foot: "Questions? Email [{email}]({email})", color: "primary" }),
    render(b, ctx) {
      const bg = color(b.color, ctx, "primary");
      const fg = onColor(bg, ctx.brand.primary);
      return {
        bg,
        html:
          `<div style="text-align:center;padding:8px 0;">` +
          heading(b.title, ctx, { size: 20, color: fg, align: "center", margin: "0 0 6px" }) +
          (b.sub ? `<p style="font-size:13px;color:${mix(fg, bg, 0.7)};margin:0 0 16px;">${md(b.sub, ctx)}</p>` : "") +
          button(b.btnLabel, b.btnUrl, ctx, { bg: ctx.brand.highlight, size: "lg", align: "center" }) +
          (b.foot ? `<p style="font-size:12px;color:${mix(fg, bg, 0.6)};margin:14px 0 0;">${md(b.foot, ctx).replace(new RegExp(`color:${ctx.brand.accent}`, "g"), `color:${ctx.brand.highlight}`)}</p>` : "") +
          `</div>`,
      };
    },
  },

  signature: {
    label: "Signature",
    icon: "✍️",
    hint: "Closing line and your sign-off",
    fields: [
      { key: "closing", label: "Closing line", type: "text" },
      { key: "name", label: "Name", type: "text" },
      { key: "title", label: "Title line", type: "text" },
      { key: "extra", label: "Extra lines (email, phone…)", type: "textarea", rows: 2 },
    ],
    defaults: () => ({ closing: "See you in the pool,", name: "Bobby Manning", title: "Swim Pro, Cooper Fitness Center", extra: "[{email}]({email})" }),
    render: (b, ctx) =>
      (b.closing ? `<p style="font-size:14px;color:${ctx.brand.text};margin:0 0 10px;">${md(b.closing, ctx)}</p>` : "") +
      `<p style="font-family:${ctx.brand.headingFont};font-size:15px;color:${ctx.brand.primary};font-weight:bold;margin:0;">${plain(b.name, ctx)}</p>` +
      (b.title ? `<p style="font-size:12px;color:${ctx.brand.muted};margin:2px 0 0;">${plain(b.title, ctx)}</p>` : "") +
      (b.extra ? `<p style="font-size:12px;color:${ctx.brand.muted};margin:4px 0 0;line-height:1.6;">${md(b.extra, ctx)}</p>` : ""),
  },

  divider: {
    label: "Divider / space",
    icon: "➖",
    hint: "A line or empty space",
    fields: [
      { key: "kind", label: "Type", type: "select", options: [["line", "Line"], ["space", "Space only"]] },
      { key: "height", label: "Height", type: "select", options: [["8", "Small"], ["20", "Medium"], ["40", "Large"]] },
    ],
    defaults: () => ({ kind: "line", height: "20", pad: "none", divider: false }),
    render: (b) => {
      const h = +b.height || 20;
      return b.kind === "line"
        ? `<div style="height:${Math.floor(h / 2)}px;line-height:${Math.floor(h / 2)}px;font-size:1px;">&nbsp;</div><div style="border-top:1px solid #e8ecf0;margin:0 20px;height:${Math.ceil(h / 2)}px;line-height:1px;font-size:1px;">&nbsp;</div>`
        : `<div style="height:${h}px;line-height:${h}px;font-size:1px;">&nbsp;</div>`;
    },
  },

  html: {
    label: "Custom HTML",
    icon: "🧩",
    hint: "Paste any HTML — total freedom",
    fields: [{ key: "code", label: "HTML", type: "code", rows: 8, help: "Inserted as-is. Use inline styles so email apps keep them." }],
    defaults: () => ({ code: "<p style=\"margin:0;\">Your HTML here</p>" }),
    render: (b) => b.code || "",
  },
};

/** Style options shared by every block (shown under "Block style"). */
export const COMMON_FIELDS = [
  { key: "bg", label: "Background", type: "color", allowNone: true },
  { key: "pad", label: "Padding", type: "select", options: [["normal", "Normal"], ["tight", "Tight"], ["none", "None"]] },
  { key: "divider", label: "Line under this block", type: "toggle" },
];

let counter = 0;
export function newId(prefix = "b") {
  counter += 1;
  return prefix + "_" + Date.now().toString(36) + counter.toString(36);
}

export function createBlock(type, overrides = {}) {
  const def = BLOCK_TYPES[type];
  return { id: newId(), type, hidden: false, pad: "normal", divider: true, bg: "", ...def.defaults(), ...overrides };
}

/** A short one-line summary for the collapsed card in the editor. */
export function blockSummary(b, roster = []) {
  switch (b.type) {
    case "people": {
      const names = (b.ids || []).map((id) => roster.find((p) => p.id === id)?.name.split(" ")[0]).filter(Boolean);
      return names.length ? names.join(", ") : "No one selected";
    }
    case "spotlight":
      return roster.find((p) => p.id === b.personId)?.name || b.name || "No person";
    case "rates":
      return b.title || (b.tables || []).map((t) => t.title).join(", ");
    case "text":
      return (b.body || "").slice(0, 60);
    case "html":
      return "Custom code";
    case "image":
    case "video":
      return b.caption || b.alt || b.src || b.url || "";
    case "button":
      return b.label;
    case "divider":
      return b.kind === "line" ? "Line" : "Space";
    case "signature":
      return b.name;
    case "weather":
      return "Uses the forecast in Settings";
    default:
      return b.title || b.text || b.eyebrow || "";
  }
}
