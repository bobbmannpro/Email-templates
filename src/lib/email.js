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
    `<tr><td data-block="${esc(block.id)}" style="padding:${PAD[block.pad] || PAD.normal};${bg ? `background:${bg};` : ""}${bb}">` +
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
  const pre = doc.settings.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#ffffff;opacity:0;">${esc(doc.settings.preheader)}</div>\n`
    : "";
  return (
    pre +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" align="center" style="width:100%;max-width:600px;margin:0 auto;background:${doc.settings.brand.bg || "#ffffff"};border-collapse:collapse;table-layout:fixed;font-family:${doc.settings.brand.font};">\n` +
    rows +
    `\n</table>`
  );
}

/** A full page for the in-app preview iframe, with placeholders for Cooper's header/footer. */
export function previewPage(body, { showChrome = true } = {}) {
  const ph = (t) =>
    `<div style="max-width:600px;margin:0 auto;padding:14px;text-align:center;font:12px Arial,sans-serif;color:#8a97a5;background:#dfe5ec;border:1px dashed #b6c2cf;">${t}</div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:16px 0;background:#e8ecf0;}img{max-width:100%;height:auto;}*{box-sizing:border-box;}p,td,span,a{word-break:break-word;overflow-wrap:break-word;}
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
