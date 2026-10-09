import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { renderEmail, previewPage } from "../lib/email.js";

// Common screen widths (CSS pixels) people read email on.
const DEVICES = [
  { id: "sm", label: "Small phone", w: 320, note: "iPhone SE / older Android" },
  { id: "phone", label: "Phone", w: 390, note: "iPhone 14–16, Galaxy S" },
  { id: "lg", label: "Large phone", w: 430, note: "iPhone Pro Max, Galaxy Ultra" },
  { id: "tablet", label: "Tablet", w: 768, note: "iPad portrait" },
  { id: "laptop", label: "Laptop", w: 1024, note: "Gmail / Outlook on a laptop" },
  { id: "desktop", label: "Desktop", w: 1440, note: "Big monitor" },
];
const KEY = "swimEmails_previewWidth";

function loadWidth() {
  try { return +localStorage.getItem(KEY) || 390; } catch { return 390; }
}

export default function Preview({ doc, selected, onSelect }) {
  const [w, setW] = useState(loadWidth);
  const [custom, setCustom] = useState("");
  const [chrome, setChrome] = useState(true);
  const [avail, setAvail] = useState(600);
  const [pageH, setPageH] = useState(900);
  const frame = useRef(null);
  const wrap = useRef(null);
  const [html, setHtml] = useState("");

  useEffect(() => { try { localStorage.setItem(KEY, String(w)); } catch { /* ignore */ } }, [w]);

  // Debounce re-rendering while typing.
  const body = useMemo(() => renderEmail(doc, { preview: true }), [doc]);
  useEffect(() => {
    const t = setTimeout(() => setHtml(previewPage(body, { showChrome: chrome })), 150);
    return () => clearTimeout(t);
  }, [body, chrome]);

  // Fit wide screens into the panel by scaling, so you see the true layout at that width.
  useLayoutEffect(() => {
    if (!wrap.current) return;
    const ro = new ResizeObserver(([e]) => setAvail(Math.floor(e.contentRect.width)));
    ro.observe(wrap.current);
    return () => ro.disconnect();
  }, []);
  const scale = Math.min(1, avail / w);
  const viewH = Math.max(480, Math.round((window.innerHeight - 300) / scale));

  useEffect(() => {
    const onMsg = (e) => e.data && e.data.swimEmailsSelect && onSelect(e.data.swimEmailsSelect);
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onSelect]);

  const highlight = () => {
    frame.current?.contentWindow?.postMessage({ swimEmailsHighlight: selected || "" }, "*");
  };
  useEffect(highlight, [selected, html]);
  useEffect(() => setPageH(viewH), [viewH]);

  const dev = DEVICES.find((d) => d.w === w);

  return (
    <div className="preview">
      <div className="pv-bar">
        <select className="inp pv-dev" value={dev ? w : "custom"} onChange={(e) => e.target.value !== "custom" && setW(+e.target.value)} aria-label="Screen size">
          {DEVICES.map((d) => <option key={d.id} value={d.w}>{d.label} · {d.w}px</option>)}
          <option value="custom">Custom width…</option>
        </select>
        <div className="pv-custom">
          <input className="inp" type="number" min="280" max="2560" inputMode="numeric" placeholder={String(w)} value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && +custom >= 280 && setW(Math.min(2560, +custom))}
            onBlur={() => +custom >= 280 && setW(Math.min(2560, +custom))}
            aria-label="Custom width in pixels" />
          <span>px</span>
        </div>
      </div>
      <div className="pv-chips">
        {DEVICES.map((d) => (
          <button type="button" key={d.id} className={"pv-chip" + (w === d.w ? " on" : "")} onClick={() => { setW(d.w); setCustom(""); }} title={d.note}>
            {d.label}
          </button>
        ))}
      </div>
      <div className="pv-meta">
        <span>{w}px wide{dev ? ` · ${dev.note}` : ""}{scale < 1 ? ` · shown at ${Math.round(scale * 100)}%` : ""}</span>
        <label className="pv-chk"><input type="checkbox" checked={chrome} onChange={(e) => setChrome(e.target.checked)} /> Cooper header/footer spots</label>
      </div>
      {doc.settings.subject && (
        <div className="inbox">
          <strong>{doc.settings.subject}</strong>
          {doc.settings.preheader && <span> — {doc.settings.preheader}</span>}
        </div>
      )}
      <div className="pv-frame-wrap" ref={wrap}>
        <div style={{ width: w * scale, height: pageH * scale, flexShrink: 0 }}>
          <iframe
            ref={frame}
            title="Email preview"
            className="pv-frame"
            style={{ width: w, height: pageH, transform: `scale(${scale})`, transformOrigin: "0 0" }}
            srcDoc={html}
            onLoad={highlight}
            sandbox="allow-scripts"
          />
        </div>
      </div>
    </div>
  );
}
