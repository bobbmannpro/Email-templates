import { useEffect, useMemo, useRef, useState } from "react";
import { renderEmail, previewPage } from "../lib/email.js";

export default function Preview({ doc, selected, onSelect }) {
  const [width, setWidth] = useState("mobile");
  const [chrome, setChrome] = useState(true);
  const frame = useRef(null);
  const [html, setHtml] = useState("");

  // Debounce re-rendering while typing.
  const body = useMemo(() => renderEmail(doc, { preview: true }), [doc]);
  useEffect(() => {
    const t = setTimeout(() => setHtml(previewPage(body, { showChrome: chrome })), 150);
    return () => clearTimeout(t);
  }, [body, chrome]);

  useEffect(() => {
    const onMsg = (e) => e.data && e.data.swimEmailsSelect && onSelect(e.data.swimEmailsSelect);
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [onSelect]);

  const highlight = () => frame.current?.contentWindow?.postMessage({ swimEmailsHighlight: selected || "" }, "*");
  useEffect(highlight, [selected, html]);

  return (
    <div className="preview">
      <div className="pv-bar">
        <div className="seg">
          <button type="button" className={width === "mobile" ? "on" : ""} onClick={() => setWidth("mobile")}>📱 Phone</button>
          <button type="button" className={width === "desktop" ? "on" : ""} onClick={() => setWidth("desktop")}>🖥 Desktop</button>
        </div>
        <label className="pv-chk"><input type="checkbox" checked={chrome} onChange={(e) => setChrome(e.target.checked)} /> Show Cooper header/footer spots</label>
      </div>
      {doc.settings.subject && (
        <div className="inbox" style={{ maxWidth: width === "mobile" ? 380 : 640 }}>
          <strong>{doc.settings.subject}</strong>
          {doc.settings.preheader && <span> — {doc.settings.preheader}</span>}
        </div>
      )}
      <div className="pv-frame-wrap">
        <iframe ref={frame} title="Email preview" className="pv-frame" style={{ width: width === "mobile" ? 380 : 640 }} srcDoc={html} onLoad={highlight} sandbox="allow-scripts" />
      </div>
    </div>
  );
}
