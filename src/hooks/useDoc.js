import { useCallback, useEffect, useRef, useState } from "react";
import { defaultDoc, normalizeDoc } from "../lib/defaults.js";

const DOC_KEY = "swimEmails_doc_v3";
const PRESETS_KEY = "swimEmails_presets_v3";

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage full or blocked — app still works in memory */ }
}

/**
 * The whole email lives in one "doc" object. Every change goes through update(),
 * which keeps an undo history (typing in the same field is merged into one step).
 */
export function useDoc() {
  const [doc, setDoc] = useState(() => normalizeDoc(load(DOC_KEY, null)));
  const past = useRef([]);
  const future = useRef([]);
  const lastTag = useRef({ tag: null, t: 0 });
  const [, force] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => save(DOC_KEY, doc), 250);
    return () => clearTimeout(t);
  }, [doc]);

  const docRef = useRef(doc);
  docRef.current = doc;

  const commit = (next) => {
    docRef.current = next;
    setDoc(next);
    force((n) => n + 1);
  };

  const update = useCallback((fn, tag) => {
    const prev = docRef.current;
    const next = typeof fn === "function" ? fn(prev) : fn;
    if (next === prev) return;
    const now = Date.now();
    const merge = tag && lastTag.current.tag === tag && now - lastTag.current.t < 1200;
    if (!merge) {
      past.current.push(prev);
      if (past.current.length > 80) past.current.shift();
    }
    lastTag.current = { tag, t: now };
    future.current = [];
    commit(next);
  }, []);

  const undo = useCallback(() => {
    const p = past.current.pop();
    if (!p) return;
    future.current.push(docRef.current);
    lastTag.current = { tag: null, t: 0 };
    commit(p);
  }, []);

  const redo = useCallback(() => {
    const f = future.current.pop();
    if (!f) return;
    past.current.push(docRef.current);
    lastTag.current = { tag: null, t: 0 };
    commit(f);
  }, []);

  const replace = useCallback((d) => update(() => normalizeDoc(JSON.parse(JSON.stringify(d)))), [update]);
  const reset = useCallback(() => update(() => defaultDoc()), [update]);

  // ── Block helpers ──────────────────────────────────────────────────────────
  const setBlock = useCallback(
    (id, patch) => update((d) => ({ ...d, blocks: d.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }), "blk:" + id + ":" + Object.keys(patch).join(",")),
    [update]
  );

  return {
    doc, update, undo, redo, replace, reset, setBlock,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}

/** Saved email presets ("Weekly Lessons", "Cyclones Recruiting"…), stored in this browser. */
export function usePresets() {
  const [presets, setPresets] = useState(() => load(PRESETS_KEY, {}));
  useEffect(() => save(PRESETS_KEY, presets), [presets]);
  return {
    presets,
    savePreset: (name, doc) => setPresets((p) => ({ ...p, [name]: { ...doc, name, savedAt: new Date().toISOString() } })),
    deletePreset: (name) => setPresets((p) => { const n = { ...p }; delete n[name]; return n; }),
    importPresets: (obj) => setPresets((p) => ({ ...p, ...obj })),
  };
}
