import { useCallback, useEffect, useState } from "react";
import { useDoc, usePresets } from "./hooks/useDoc.js";
import { exportHtml, checkEmail } from "./lib/email.js";
import BuildPanel from "./components/BuildPanel.jsx";
import PeoplePanel from "./components/PeoplePanel.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import PresetsMenu from "./components/PresetsMenu.jsx";
import Preview from "./components/Preview.jsx";

const TABS = [
  ["build", "Build"],
  ["people", "People"],
  ["settings", "Settings"],
  ["preview", "Preview"],
];

function useWide() {
  const q = "(min-width: 1000px)";
  const [wide, setWide] = useState(() => window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const on = () => setWide(m.matches);
    m.addEventListener("change", on);
    return () => m.removeEventListener("change", on);
  }, []);
  return wide;
}

export default function App() {
  const api = useDoc();
  const presets = usePresets();
  const wide = useWide();
  const [tab, setTab] = useState("build");
  const [selected, setSelected] = useState(null);
  const [showPresets, setShowPresets] = useState(false);
  const [toast, setToast] = useState("");

  const flash = (t) => { setToast(t); setTimeout(() => setToast(""), 2200); };

  async function copy(text, what) {
    try {
      await navigator.clipboard.writeText(text);
      flash(what + " copied ✓");
    } catch {
      flash("Copy blocked — use Download instead");
    }
  }

  function downloadHtml() {
    const blob = new Blob([exportHtml(api.doc)], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `swim-email-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
  }

  // Clicking a section in the preview opens it in the editor.
  const onPreviewSelect = useCallback((id) => {
    setSelected(id);
    setTab("build");
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || e.key.toLowerCase() !== "z") return;
      if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
      e.preventDefault();
      e.shiftKey ? api.redo() : api.undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [api]);

  const activeTab = wide && tab === "preview" ? "build" : tab;
  const tabs = wide ? TABS.filter(([k]) => k !== "preview") : TABS;

  return (
    <div className="app">
      <div className="sticky">
      <header className="top">
        <div className="brand-mark" aria-hidden>🏊</div>
        <div className="top-title">
          <span>Swim Emails</span>
          <input
            className="doc-name"
            value={api.doc.name || ""}
            onChange={(e) => api.update((d) => ({ ...d, name: e.target.value }), "name")}
            aria-label="Email name"
          />
        </div>
        <div className="top-actions">
          <button type="button" className="tb" onClick={api.undo} disabled={!api.canUndo} title="Undo" aria-label="Undo">↶</button>
          <button type="button" className="tb" onClick={api.redo} disabled={!api.canRedo} title="Redo" aria-label="Redo">↷</button>
          <button type="button" className="tb text" onClick={() => setShowPresets(true)}>📁 <span className="hide-sm">Saved</span></button>
          <button type="button" className="tb primary" onClick={() => copy(exportHtml(api.doc), "HTML")}>Copy HTML</button>
        </div>
      </header>

      <nav className="tabs">
        {tabs.map(([k, l]) => (
          <button type="button" key={k} className={activeTab === k ? "on" : ""} onClick={() => setTab(k)}>{l}</button>
        ))}
      </nav>
      </div>

      <main className={"main" + (wide ? " wide" : "")}>
        <section className="left">
          {activeTab === "build" && <BuildPanel api={api} selected={selected} setSelected={setSelected} />}
          {activeTab === "people" && <PeoplePanel api={api} />}
          {activeTab === "settings" && <SettingsPanel api={api} />}
          {activeTab === "preview" && <Preview doc={api.doc} selected={selected} onSelect={onPreviewSelect} />}
          {activeTab === "preview" && <ExportBar api={api} copy={copy} downloadHtml={downloadHtml} />}
        </section>
        {wide && (
          <section className="right">
            <Preview doc={api.doc} selected={selected} onSelect={onPreviewSelect} />
            <ExportBar api={api} copy={copy} downloadHtml={downloadHtml} />
          </section>
        )}
      </main>

      {showPresets && <PresetsMenu api={api} presets={presets} onClose={() => setShowPresets(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function ExportBar({ api, copy, downloadHtml }) {
  const s = api.doc.settings;
  return (
    <div className="export">
      <button type="button" className="btn" onClick={() => copy(exportHtml(api.doc), "HTML")}>📋 Copy email HTML</button>
      {s.subject && <button type="button" className="btn ghost" onClick={() => copy(s.subject, "Subject")}>Copy subject</button>}
      <button type="button" className="btn ghost" onClick={downloadHtml}>⬇ .html</button>
      <p className="note">Body only (banner through signature) — paste it into the Cooper email builder, which adds the logo header and footer.</p>
      <p className="checks-title">Inbox check</p>
      <ul className="checks">
        {checkEmail(api.doc).map((c, i) => <li key={i} className={c.level}>{c.msg}</li>)}
      </ul>
    </div>
  );
}
