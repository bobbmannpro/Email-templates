import { BLOCK_TYPES } from "./blocks.js";
import { color, esc } from "./render.js";

export function makeCtx(doc, opts = {}) {
  return {
    brand: doc.settings.brand,
    settings: doc.settings,
    roster: doc.roster || [],
    forecast: doc.forecast || [],
    preview: !!opts.preview,
  };
}

const PAD = { normal: "18px 20px", tight: "10px 20px", none: "0" };

export function renderBlock(block, ctx) {
  const def = BLOCK_TYPES[block.type];
  if (!def || block.hidden) return "";
  let out = def.render(block, ctx);
  let bg = block.bg ? color(block.bg, ctx) : "";
  if (out && typeof out === "object") {
    bg = block.bg ? bg : out.bg;
    out = out.html;
  }
  if (!out) return "";
  const border = block.divider ? "border-bottom:1px solid #e8ecf0;" : "";
  const bb = block.borderBottom ? `border-bottom:2px solid ${color(block.borderBottom, ctx)};` : border;
  return (
    `<tr><td data-block="${esc(block.id)}"${bg ? ` bgcolor="${bg}"` : ""} style="padding:${PAD[block.pad] || PAD.normal};${bg ? `background-color:${bg};` : ""}${bb}">` +
    out +
    `</td></tr>`
  );
}

/**
 * Body-only email HTML (banner through signature). No <html>/<head>/<style>:
 * the Cooper email builder wraps it with its own logo header and footer.
 */
export function renderEmail(doc, opts = {}) {
  const ctx = makeCtx(doc, opts);
  const rows = (doc.blocks || []).map((b) => renderBlock(b, ctx)).filter(Boolean).join("\n");
  const bgc = doc.settings.brand.bg || "#ffffff";
  const pre = doc.settings.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ffffff;opacity:0;">${esc(doc.settings.preheader)}</div>\n`
    : "";
  return (
    pre +
    // Outlook desktop ignores max-width, so a hidden 600px "ghost" table keeps it from stretching.
    `<!--[if mso]><table role="presentation" width="600" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->\n` +
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" align="center" bgcolor="${bgc}" style="width:100%;max-width:600px;margin:0 auto;background-color:${bgc};border-collapse:collapse;font-family:${doc.settings.brand.font};">\n` +
    rows +
    `\n</table>\n<!--[if mso]></td></tr></table><![endif]-->`
  );
}

/** A full page for the in-app preview iframe, with placeholders for Cooper's header/footer. */
export function previewPage(body, { showChrome = true } = {}) {
  const ph = (t) =>
    `<div style="max-width:600px;margin:0 auto;padding:14px;text-align:center;font:12px Arial,sans-serif;color:#8a97a5;background:#dfe5ec;border:1px dashed #b6c2cf;">${t}</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:16px 0;background:#e8ecf0;}
[data-block]{cursor:pointer;transition:outline-color .15s;outline:2px solid transparent;outline-offset:-2px;}[data-block]:hover{outline-color:rgba(30,136,199,.45);}[data-block].sel{outline-color:#1e88c7;}</style>
</head><body>${showChrome ? ph("Cooper logo header — added by the email builder") : ""}${body}${showChrome ? ph("Cooper footer — added by the email builder") : ""}
<script>document.addEventListener('click',function(e){var t=e.target.closest('[data-block]');if(!t)return;e.preventDefault();parent.postMessage({swimEmailsSelect:t.getAttribute('data-block')},'*');});
window.addEventListener('message',function(e){if(!e.data||!('swimEmailsHighlight' in e.data))return;document.querySelectorAll('[data-block].sel').forEach(function(n){n.classList.remove('sel')});var n=document.querySelector('[data-block="'+e.data.swimEmailsHighlight+'"]');if(n){n.classList.add('sel');n.scrollIntoView({block:'nearest',behavior:'smooth'});}});</script>
</body></html>`;
}

/** Strip editor-only attributes from the exported HTML. */
export function exportHtml(doc) {
  return renderEmail(doc).replace(/ data-block="[^"]*"/g, "");
}

/**
 * Inbox-compatibility check. Returns [{level: "ok"|"warn"|"info", msg}] for the export panel.
 * Rules come from how Gmail, Outlook, Yahoo and Apple Mail actually treat email HTML.
 */
export function checkEmail(doc) {
  const html = exportHtml(doc);
  const kb = new Blob([html]).size / 1024;
  const out = [];
  const visible = (doc.blocks || []).filter((b) => !b.hidden);
  if (kb > 95) out.push({ level: "warn", msg: `Email is ${kb.toFixed(0)} KB. Gmail cuts off anything over ~102 KB behind a "View entire message" link — remove or shorten some blocks.` });
  else out.push({ level: "ok", msg: `Size ${kb.toFixed(0)} KB — under Gmail's 102 KB clipping limit.` });
  const vids = visible.filter((b) => b.type === "spotlight" && b.clip);
  if (vids.length) out.push({ level: "info", msg: "Greeting clips only play in Apple Mail & Samsung Mail. Gmail, Outlook and Yahoo show the normal card instead (nothing breaks)." });
  if (visible.some((b) => b.type === "html")) out.push({ level: "warn", msg: "Custom HTML block: use tables and inline styles only — Gmail and Outlook strip <style> tags, classes, flexbox and grid." });
  const imgs = [...html.matchAll(/<img [^>]*src="([^"]*)"/g)].map((m) => m[1]);
  if (imgs.some((u) => u.startsWith("http:"))) out.push({ level: "warn", msg: "Some images use http:// — Gmail and Outlook may block them. Use https:// links." });
  if (imgs.some((u) => u.startsWith("data:"))) out.push({ level: "warn", msg: "Embedded (data:) images are blocked by Gmail and Outlook. Use a hosted image URL." });
  if (/<img (?![^>]*alt="[^"]+")[^>]*>/.test(html)) out.push({ level: "info", msg: "Add a description (alt text) to images — Outlook hides images by default and shows that text instead." });
  if (visible.some((b) => b.type === "image" && /\.(svg|webp)(\?|$)/i.test(b.src || ""))) out.push({ level: "warn", msg: "SVG and WebP images don't show in Outlook or Gmail. Use JPG or PNG." });
  if (!doc.settings.preheader) out.push({ level: "info", msg: "Tip: add Preview text in Settings — it's the gray line after the subject in Gmail and Yahoo." });
  out.push({ level: "ok", msg: "Layout is table-based with inline styles and bulletproof buttons — built for Gmail, Outlook (incl. Hotmail/Outlook.com), Yahoo and Apple Mail." });
  return out;
}
