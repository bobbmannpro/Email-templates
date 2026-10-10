import { useEffect, useRef, useState } from "react";
import { getToken, listPhotos, preparePhoto, setToken, slug, testToken, uploadPhoto } from "../lib/photos.js";
import { BRAND_TOKENS, PHOTO_FILES } from "../lib/defaults.js";
import { IDEA_TOPICS } from "../lib/ideas.js";

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function Label({ children, help }) {
  return (
    <span className="lbl">
      {children}
      {help && <small>{help}</small>}
    </span>
  );
}

export function TextInput({ value, onChange, ...rest }) {
  return <input className="inp" value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function TextArea({ value, onChange, rows = 3, mono, ...rest }) {
  return <textarea className={"inp" + (mono ? " mono" : "")} rows={rows} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} />;
}

export function Toggle({ on, onChange, label }) {
  return (
    <button type="button" className={"tog" + (on ? " on" : "")} onClick={() => onChange(!on)} aria-pressed={!!on}>
      <span className="knob" />
      {label && <span className="tog-lbl">{label}</span>}
    </button>
  );
}

/** Color picker: brand token chips + any custom hex. */
export function ColorField({ value, onChange, brand, allowNone }) {
  const isToken = brand[value] != null;
  const hex = isToken ? brand[value] : /^#[0-9a-f]{6}$/i.test(value || "") ? value : "#ffffff";
  return (
    <div className="colors">
      {allowNone && (
        <button type="button" className={"chip none" + (!value ? " sel" : "")} onClick={() => onChange("")} title="None">∅</button>
      )}
      {BRAND_TOKENS.map(([k, l]) => (
        <button type="button" key={k} title={l} className={"chip" + (value === k ? " sel" : "")} style={{ background: brand[k] }} onClick={() => onChange(k)} />
      ))}
      <label className={"chip custom" + (value && !isToken ? " sel" : "")} title="Custom color" style={{ background: !isToken && value ? hex : undefined }}>
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} />
        {(!value || isToken) && "+"}
      </label>
      {value && !isToken && <code className="hex">{value}</code>}
    </div>
  );
}

/** Photo/image field: upload a new photo, pick one already on the site, or paste any URL. */
let photoListPromise = null;
function usePhotoList() {
  const [list, setList] = useState(PHOTO_FILES);
  useEffect(() => {
    photoListPromise = photoListPromise || listPhotos(PHOTO_FILES);
    let live = true;
    photoListPromise.then((l) => live && setList(l));
    return () => { live = false; };
  }, []);
  return [list, (name) => setList((l) => (l.includes(name) ? l : [...l, name].sort()))];
}

export function GitHubConnect({ onDone }) {
  const [tok, setTok] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    setToken(tok);
    const r = await testToken();
    setMsg(r);
    setBusy(false);
    if (r.ok) onDone && onDone();
    else setToken("");
  }
  return (
    <div className="gh-connect">
      <p className="note"><b>One-time setup:</b> photos go on your GitHub site so every email app can show them. Paste a GitHub key once and uploads just work on this device.</p>
      <ol className="steps">
        <li>Open <a href={`https://github.com/settings/personal-access-tokens/new`} target="_blank" rel="noreferrer">GitHub → new fine-grained token</a>.</li>
        <li>Name it “Swim Emails”, set expiration to 1 year.</li>
        <li>Repository access → <b>Only select repositories</b> → <b>Email-templates</b>.</li>
        <li>Permissions → Repository → <b>Contents: Read and write</b>.</li>
        <li>Generate, copy it, paste below.</li>
      </ol>
      <div className="row-inline">
        <input className="inp" type="password" autoComplete="off" value={tok} onChange={(e) => setTok(e.target.value)} placeholder="github_pat_…" aria-label="GitHub key" />
        <button type="button" className="btn sm" disabled={!tok.trim() || busy} onClick={save}>{busy ? "Checking…" : "Connect"}</button>
      </div>
      {msg && <p className={"note " + (msg.ok ? "ok" : "warn")}>{msg.msg}</p>}
      <p className="note">The key is saved only in this browser — never in your emails or presets.</p>
    </div>
  );
}

export function ImageField({ value, onChange, nameHint, square }) {
  const [list, addToList] = usePhotoList();
  const [state, setState] = useState({ busy: false, err: "", ok: "" });
  const [needKey, setNeedKey] = useState(false);
  const pending = useRef(null);
  const fileRef = useRef(null);
  const custom = value && !list.includes(value);

  async function doUpload(file) {
    setState({ busy: true, err: "", ok: "" });
    try {
      const prepared = await preparePhoto(file, { square: !!square });
      const base = nameHint ? slug(nameHint) : "image-" + new Date().toISOString().slice(0, 10);
      const name = `${base}-${Date.now().toString(36).slice(-4)}.jpg`;
      await uploadPhoto(name, prepared.base64, prepared.dataUrl);
      addToList(name);
      onChange(name);
      setState({ busy: false, err: "", ok: "Uploaded ✓ — it shows here now and in sent emails within ~2 minutes." });
    } catch (e) {
      setState({ busy: false, err: e.message, ok: "" });
    }
  }
  function onFile(e) {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    if (!getToken()) { pending.current = file; setNeedKey(true); return; }
    doUpload(file);
  }

  return (
    <div className="img-field">
      <div className="row-inline">
        <button type="button" className="btn sm" disabled={state.busy} onClick={() => fileRef.current.click()}>
          {state.busy ? "Uploading…" : "📷 Upload photo"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        <select className="inp" value={custom ? "__url" : value || ""} onChange={(e) => onChange(e.target.value === "__url" ? "https://" : e.target.value)} aria-label="Choose a photo">
          <option value="">— No photo —</option>
          {list.map((f) => <option key={f} value={f}>{f}</option>)}
          <option value="__url">Paste an image URL…</option>
        </select>
      </div>
      {custom && <TextInput value={value} onChange={onChange} placeholder="https://…/photo.jpg" />}
      {state.ok && <p className="note ok">{state.ok}</p>}
      {state.err && <p className="note warn">{state.err}</p>}
      {needKey && (
        <GitHubConnect onDone={() => { setNeedKey(false); if (pending.current) { doUpload(pending.current); pending.current = null; } }} />
      )}
    </div>
  );
}

export function ListField({ value = [], onChange, addLabel = "+ Add" }) {
  const set = (i, v) => onChange(value.map((x, j) => (j === i ? v : x)));
  const move = (i, d) => {
    const n = [...value];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="list">
      {value.map((x, i) => (
        <div className="list-row" key={i}>
          <TextInput value={x} onChange={(v) => set(i, v)} />
          <button type="button" className="ib" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
          <button type="button" className="ib danger" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove">×</button>
        </div>
      ))}
      <button type="button" className="link-btn" onClick={() => onChange([...value, ""])}>{addLabel}</button>
    </div>
  );
}

function PeopleField({ value = [], onChange, roster }) {
  const on = new Set(value);
  // Keep roster order for the ones switched on.
  const toggle = (id, v) => onChange(roster.filter((p) => (p.id === id ? v : on.has(p.id))).map((p) => p.id));
  return (
    <div className="people-pick">
      <div className="pp-bar">
        <span>{value.filter((id) => roster.some((p) => p.id === id)).length} of {roster.length} showing</span>
        <button type="button" className="link-btn inline" onClick={() => onChange(roster.map((p) => p.id))}>All</button>
        <button type="button" className="link-btn inline" onClick={() => onChange([])}>None</button>
      </div>
      {roster.map((p) => (
        <div className={"pp-row" + (on.has(p.id) ? " on" : "")} key={p.id}>
          <span className="pp-name">{p.name}{p.featured && <em> · featured</em>}<small>{p.avail}</small></span>
          <Toggle on={on.has(p.id)} onChange={(v) => toggle(p.id, v)} />
        </div>
      ))}
      {!roster.length && <p className="note">Your roster is empty — add people in the People tab.</p>}
    </div>
  );
}


function TablesField({ value = [], onChange }) {
  const setT = (i, patch) => onChange(value.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  return (
    <div className="tables">
      {value.map((t, i) => (
        <div className="tbl" key={i}>
          <div className="tbl-head">
            <TextInput value={t.title} onChange={(v) => setT(i, { title: v })} placeholder="Table title (e.g. Private Lessons)" />
            <button type="button" className="ib danger" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Remove table">×</button>
          </div>
          <div className="row2 keep">
            <TextInput value={t.col1} onChange={(v) => setT(i, { col1: v })} placeholder="Left header" />
            <TextInput value={t.col2} onChange={(v) => setT(i, { col2: v })} placeholder="Right header" />
          </div>
          {(t.rows || []).map((r, k) => (
            <div className="row2 rate-row" key={k}>
              <TextInput value={r.label} onChange={(v) => setT(i, { rows: t.rows.map((x, j) => (j === k ? { ...x, label: v } : x)) })} placeholder="30 min" />
              <TextInput value={r.price} onChange={(v) => setT(i, { rows: t.rows.map((x, j) => (j === k ? { ...x, price: v } : x)) })} placeholder="$60" />
              <button type="button" className="ib danger" onClick={() => setT(i, { rows: t.rows.filter((_, j) => j !== k) })} aria-label="Remove row">×</button>
            </div>
          ))}
          <button type="button" className="link-btn" onClick={() => setT(i, { rows: [...(t.rows || []), { label: "", price: "" }] })}>+ Row</button>
        </div>
      ))}
      <button type="button" className="link-btn" onClick={() => onChange([...value, { title: "", col1: "Duration", col2: "Rate", rows: [{ label: "", price: "" }] }])}>+ Table</button>
    </div>
  );
}

function IdeasField({ block, set }) {
  const [topic, setTopic] = useState(IDEA_TOPICS[0].id);
  const t = IDEA_TOPICS.find((x) => x.id === topic);
  const shuffle = (what) => {
    const tpl = pick(t.templates);
    if (what !== "copy") set({ title: pick(t.titles) });
    if (what !== "title") set({ subtitle: tpl.subtitle, bullets: [...tpl.bullets] });
  };
  return (
    <div className="ideas">
      <span className="lbl">Need ideas?</span>
      <div className="ideas-row">
        <select className="inp" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {IDEA_TOPICS.map((x) => <option key={x.id} value={x.id}>{x.label}</option>)}
        </select>
        <button type="button" className="btn sm" onClick={() => shuffle("all")}>🎲 Shuffle</button>
        <button type="button" className="btn sm ghost" onClick={() => shuffle("title")}>Headline only</button>
      </div>
    </div>
  );
}

/** Renders any field from a block type's schema. */
export function Field({ f, block, set, brand, roster }) {
  const v = block[f.key];
  const on = (val) => set({ [f.key]: val });
  if (f.showIf && !f.showIf(block)) return null;
  switch (f.type) {
    case "ideas":
      return <IdeasField block={block} set={set} />;
    case "info":
      return <p className="note">{f.text}</p>;
    case "toggle":
      return <div className="field inline"><Toggle on={v !== false && !!v} onChange={on} label={f.label} /></div>;
    default:
      break;
  }
  let input;
  switch (f.type) {
    case "textarea":
      input = <TextArea value={v} onChange={on} rows={f.rows || 3} />;
      break;
    case "code":
      input = <TextArea value={v} onChange={on} rows={f.rows || 6} mono spellCheck={false} />;
      break;
    case "select":
      input = (
        <select className="inp" value={v ?? ""} onChange={(e) => on(e.target.value)}>
          {f.options.map(([val, l]) => <option key={val} value={val}>{l}</option>)}
        </select>
      );
      break;
    case "color":
      input = <ColorField value={v} onChange={on} brand={brand} allowNone={f.allowNone} />;
      break;
    case "image":
      input = <ImageField value={v} onChange={on} />;
      break;
    case "list":
      input = <ListField value={v} onChange={on} addLabel={f.addLabel} />;
      break;
    case "people":
      input = <PeopleField value={v} onChange={on} roster={roster} />;
      break;
    case "person":
      input = (
        <select className="inp" value={v || ""} onChange={(e) => on(e.target.value)}>
          <option value="">Someone not on the roster…</option>
          {roster.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      );
      break;
    case "tables":
      input = <TablesField value={v} onChange={on} />;
      break;
    default:
      input = <TextInput value={v} onChange={on} />;
  }
  const complex = ["list", "people", "tables", "color", "image"].includes(f.type);
  const Tag = complex ? "div" : "label";
  return (
    <Tag className={"field" + (complex ? " block-field" : "")}>
      <Label help={f.help}>{f.label}</Label>
      {input}
    </Tag>
  );
}
