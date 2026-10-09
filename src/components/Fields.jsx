import { useState } from "react";
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

/** Photo/image field: pick a hosted photo or paste any URL. */
export function ImageField({ value, onChange }) {
  const custom = value && !PHOTO_FILES.includes(value);
  return (
    <div className="img-field">
      <select className="inp" value={custom ? "__url" : value || ""} onChange={(e) => onChange(e.target.value === "__url" ? "https://" : e.target.value)}>
        <option value="">— None —</option>
        {PHOTO_FILES.map((f) => <option key={f} value={f}>{f}</option>)}
        <option value="__url">Paste an image URL…</option>
      </select>
      {custom && <TextInput value={value} onChange={onChange} placeholder="https://…/photo.jpg" />}
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
  const sel = value.filter((id) => roster.some((p) => p.id === id));
  const unsel = roster.filter((p) => !sel.includes(p.id));
  const move = (i, d) => {
    const n = [...sel];
    const j = i + d;
    if (j < 0 || j >= n.length) return;
    [n[i], n[j]] = [n[j], n[i]];
    onChange(n);
  };
  return (
    <div className="people-pick">
      {sel.map((id, i) => {
        const p = roster.find((x) => x.id === id);
        return (
          <div className="pp-row on" key={id}>
            <input type="checkbox" checked onChange={() => onChange(sel.filter((x) => x !== id))} aria-label={"Remove " + p.name} />
            <span className="pp-name">{p.name}{p.featured && <em> · featured</em>}</span>
            <button type="button" className="ib" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
            <button type="button" className="ib" onClick={() => move(i, 1)} disabled={i === sel.length - 1} aria-label="Move down">↓</button>
          </div>
        );
      })}
      {unsel.map((p) => (
        <div className="pp-row" key={p.id}>
          <input type="checkbox" checked={false} onChange={() => onChange([...sel, p.id])} aria-label={"Add " + p.name} />
          <span className="pp-name muted">{p.name}</span>
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
