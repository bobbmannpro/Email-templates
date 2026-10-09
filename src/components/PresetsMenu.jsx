import { useRef, useState } from "react";
import { defaultDoc, normalizeDoc } from "../lib/defaults.js";

function download(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export default function PresetsMenu({ api, presets, onClose }) {
  const { doc, replace, update } = api;
  const { presets: list, savePreset, deletePreset, importPresets } = presets;
  const [name, setName] = useState(doc.name || "");
  const [msg, setMsg] = useState("");
  const fileRef = useRef(null);
  const today = new Date().toISOString().slice(0, 10);

  const load = (p) => {
    // Keep the current dates/forecast so loading a layout doesn't wipe this week's info.
    const n = normalizeDoc(p);
    replace({ ...n, settings: { ...n.settings, startDate: doc.settings.startDate, endDate: doc.settings.endDate }, forecast: doc.forecast });
    onClose();
  };

  function onImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((t) => {
      try {
        const data = JSON.parse(t);
        if (Array.isArray(data.blocks)) { replace(data); onClose(); }
        else if (data.presets) { importPresets(data.presets); setMsg(`Imported ${Object.keys(data.presets).length} presets.`); }
        else setMsg("That file isn't a Swim Emails export.");
      } catch { setMsg("Couldn't read that file."); }
    });
    e.target.value = "";
  }

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Saved emails">
        <div className="modal-head"><strong>Saved emails & presets</strong><button type="button" className="ib" onClick={onClose} aria-label="Close">×</button></div>
        <div className="modal-body">
          <p className="note">Save this email's layout so you can reuse it — e.g. “Weekly Lessons”, “Cyclones Recruiting”, “Holiday Hours”.</p>
          <div className="row-inline">
            <input className="inp" value={name} onChange={(e) => setName(e.target.value)} placeholder="Preset name" />
            <button type="button" className="btn" disabled={!name.trim()} onClick={() => { savePreset(name.trim(), { ...doc, name: name.trim() }); update((d) => ({ ...d, name: name.trim() }), "name"); setMsg(`Saved “${name.trim()}”.`); }}>Save</button>
          </div>
          {msg && <p className="note ok">{msg}</p>}

          <div className="preset-list">
            {Object.values(list).sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || "")).map((p) => (
              <div className="preset" key={p.name}>
                <button type="button" className="preset-main" onClick={() => load(p)}>
                  <strong>{p.name}</strong>
                  <small>{p.blocks.length} blocks · saved {p.savedAt ? new Date(p.savedAt).toLocaleDateString() : ""}</small>
                </button>
                <button type="button" className="ib danger" onClick={() => confirm(`Delete “${p.name}”?`) && deletePreset(p.name)} aria-label="Delete preset">×</button>
              </div>
            ))}
            {!Object.keys(list).length && <p className="empty">No saved presets yet.</p>}
          </div>

          <div className="row-inline wrap">
            <button type="button" className="btn sm ghost" onClick={() => { if (confirm("Start a blank email? (You can Undo.)")) { replace({ ...defaultDoc(), name: "Untitled", blocks: [] }); onClose(); } }}>New blank email</button>
            <button type="button" className="btn sm ghost" onClick={() => { if (confirm("Load the default weekly email? (You can Undo.)")) { replace(defaultDoc()); onClose(); } }}>Default weekly email</button>
          </div>
          <div className="row-inline wrap">
            <button type="button" className="btn sm ghost" onClick={() => download(`swim-email-${today}.json`, doc)}>⬇ Export this email</button>
            <button type="button" className="btn sm ghost" onClick={() => download(`swim-email-presets-${today}.json`, { presets: list })}>⬇ Export all presets</button>
            <button type="button" className="btn sm ghost" onClick={() => fileRef.current.click()}>⬆ Import</button>
            <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
          </div>
          <p className="note">Presets live in this browser. Export them to back up or move to another device.</p>
        </div>
      </div>
    </div>
  );
}
