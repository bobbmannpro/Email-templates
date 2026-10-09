import { useState } from "react";
import { DEFAULT_SETTINGS } from "../lib/defaults.js";
import { fetchRealWeather, generateWeather, weatherIcon, COND_LIST } from "../utils/weather.js";
import { numDays, fmtDate } from "../utils/date.js";
import { TextInput, Label } from "./Fields.jsx";

const FONTS = [
  ["Arial,Helvetica,sans-serif", "Arial"],
  ["Georgia,serif", "Georgia"],
  ["'Trebuchet MS',Arial,sans-serif", "Trebuchet"],
  ["Verdana,Geneva,sans-serif", "Verdana"],
  ["'Times New Roman',Times,serif", "Times"],
  ["Tahoma,Geneva,sans-serif", "Tahoma"],
];

function Section({ title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={"bcard" + (open ? " open" : "")}>
      <div className="bhead">
        <button type="button" className="bhead-main" onClick={() => setOpen(!open)} aria-expanded={open}>
          <span className="btxt"><span className="btype">{title}</span></span>
          <span className="chev">{open ? "▾" : "▸"}</span>
        </button>
      </div>
      {open && <div className="bbody">{children}</div>}
    </div>
  );
}

function WeatherEditor({ api }) {
  const { doc, update } = api;
  const { startDate, endDate, weather } = doc.settings;
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const f = doc.forecast || [];
  const setF = (forecast, tag) => update((d) => ({ ...d, forecast }), tag);
  const days = numDays(startDate, endDate);

  async function live() {
    if (!startDate) return setMsg("Pick a start date first.");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if ((new Date(startDate + "T00:00:00") - today) / 86400000 > 15) {
      setMsg("Live forecasts only reach ~16 days out — used an estimate instead.");
      return setF(generateWeather(startDate, days));
    }
    setBusy(true); setMsg("");
    try {
      setF(await fetchRealWeather(startDate, endDate || startDate, weather.lat, weather.lon));
    } catch {
      setMsg("Couldn't reach the weather service — used an estimate instead.");
      setF(generateWeather(startDate, days));
    } finally { setBusy(false); }
  }
  const row = (i, patch) => setF(f.map((d, j) => (j === i ? { ...d, ...patch } : d)), "wx" + i + Object.keys(patch));

  return (
    <>
      <div className="row-inline wrap">
        <button type="button" className="btn sm" onClick={live} disabled={busy}>{busy ? "Loading…" : "☁ Fetch live"}</button>
        <button type="button" className="btn sm ghost" onClick={() => (startDate ? setF(generateWeather(startDate, days)) : setMsg("Pick a start date first."))}>Estimate</button>
        <button type="button" className="btn sm ghost" onClick={() => setF([...f, { day: "Day", icon: "☀️", high: "", low: "", rain: "" }])}>+ Day</button>
        {f.length > 0 && <button type="button" className="btn sm danger" onClick={() => setF([])}>Clear</button>}
      </div>
      {msg && <p className="note warn">{msg}</p>}
      {f.length > 0 && (
        <div className="wx-table">
          <div className="wx-row head"><span>Day</span><span>Sky</span><span>Hi</span><span>Lo</span><span>Rain</span><span /></div>
          {f.map((d, i) => (
            <div className="wx-row" key={i}>
              <input className="inp" value={d.day} onChange={(e) => row(i, { day: e.target.value })} aria-label="Day" />
              <select className="inp" value={d.icon} onChange={(e) => row(i, { icon: e.target.value })} aria-label="Conditions">
                {[...new Set(COND_LIST.map(weatherIcon))].concat(d.icon && !COND_LIST.map(weatherIcon).includes(d.icon) ? [d.icon] : []).map((ic) => (
                  <option key={ic} value={ic}>{ic} {COND_LIST.find((c) => weatherIcon(c) === ic) || ""}</option>
                ))}
              </select>
              <input className="inp" value={d.high} onChange={(e) => row(i, { high: e.target.value })} aria-label="High" />
              <input className="inp" value={d.low} onChange={(e) => row(i, { low: e.target.value })} aria-label="Low" />
              <input className="inp" value={d.rain} onChange={(e) => row(i, { rain: e.target.value })} aria-label="Rain chance" />
              <button type="button" className="ib danger" onClick={() => setF(f.filter((_, j) => j !== i))} aria-label="Remove day">×</button>
            </div>
          ))}
        </div>
      )}
      <details className="more">
        <summary>Forecast location</summary>
        <div className="row3">
          <label className="field"><Label>Latitude</Label><TextInput value={weather.lat} onChange={(v) => update((d) => ({ ...d, settings: { ...d.settings, weather: { ...d.settings.weather, lat: v } } }), "lat")} /></label>
          <label className="field"><Label>Longitude</Label><TextInput value={weather.lon} onChange={(v) => update((d) => ({ ...d, settings: { ...d.settings, weather: { ...d.settings.weather, lon: v } } }), "lon")} /></label>
        </div>
      </details>
    </>
  );
}

export default function SettingsPanel({ api }) {
  const { doc, update } = api;
  const s = doc.settings;
  const setS = (patch, tag) => update((d) => ({ ...d, settings: { ...d.settings, ...patch } }), tag);
  const setGroup = (group, key, val) => setS({ [group]: { ...s[group], [key]: val } }, group + key);
  const dateErr = s.startDate && s.endDate && s.endDate < s.startDate;

  return (
    <div className="panel">
      <Section title="📅 Dates & weather" defaultOpen>
        <div className="row2">
          <label className="field"><Label>Start date</Label><input className="inp" type="date" value={s.startDate} onChange={(e) => setS({ startDate: e.target.value })} /></label>
          <label className="field"><Label>End date (optional)</Label><input className="inp" type="date" value={s.endDate} onChange={(e) => setS({ endDate: e.target.value })} /></label>
        </div>
        {dateErr ? <p className="note warn">End date is before the start date.</p> : s.startDate && <p className="note">Shows as “{s.endDate ? `${fmtDate(s.startDate)} - ${fmtDate(s.endDate)}` : "Starting " + fmtDate(s.startDate)}” anywhere you type <code>{"{dates}"}</code>.</p>}
        <Label>Forecast</Label>
        <WeatherEditor api={api} />
      </Section>

      <Section title="✉️ Subject & inbox preview">
        <label className="field"><Label help="Copy this into your email builder's subject line">Subject line</Label><TextInput value={s.subject} onChange={(v) => setS({ subject: v }, "subj")} placeholder="Private Swim Lessons This Week 🏊" /></label>
        <label className="field"><Label help="The gray preview text after the subject in most inboxes (hidden in the email)">Preview text</Label><TextInput value={s.preheader} onChange={(v) => setS({ preheader: v }, "pre")} /></label>
      </Section>

      <Section title="🔗 Links & contact">
        <label className="field"><Label help="Use {book} in any button or text">Booking link</Label><TextInput value={s.links.book} onChange={(v) => setGroup("links", "book", v)} /></label>
        <label className="field"><Label help="Use {email}">Contact email</Label><TextInput value={s.links.email} onChange={(v) => setGroup("links", "email", v)} /></label>
        <label className="field"><Label help="Use {phone}">Phone</Label><TextInput value={s.links.phone} onChange={(v) => setGroup("links", "phone", v)} /></label>
        <label className="field"><Label help="Where photo filenames like bobby.jpg are hosted">Photo folder URL</Label><TextInput value={s.imageBase} onChange={(v) => setS({ imageBase: v }, "img")} /></label>
      </Section>

      <Section title="🎨 Brand colors & fonts">
        <div className="brand-grid">
          {[["primary", "Primary (navy)"], ["accent", "Accent (blue)"], ["highlight", "Highlight (gold)"], ["success", "Success (green)"], ["text", "Body text"], ["muted", "Soft text"], ["bg", "Email background"]].map(([k, l]) => (
            <label className="brand-sw" key={k}>
              <input type="color" value={s.brand[k]} onChange={(e) => setGroup("brand", k, e.target.value)} />
              <span>{l}<code>{s.brand[k]}</code></span>
            </label>
          ))}
        </div>
        <div className="row2">
          <label className="field"><Label>Heading font</Label>
            <select className="inp" value={s.brand.headingFont} onChange={(e) => setGroup("brand", "headingFont", e.target.value)}>{FONTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
          <label className="field"><Label>Body font</Label>
            <select className="inp" value={s.brand.font} onChange={(e) => setGroup("brand", "font", e.target.value)}>{FONTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          </label>
        </div>
        <button type="button" className="link-btn" onClick={() => setS({ brand: { ...DEFAULT_SETTINGS.brand } })}>Restore Cooper colors</button>
      </Section>

      <div className="cheat">
        <b>Text shortcuts</b> (any text box): <code>**bold**</code> <code>*italic*</code> <code>[label](link)</code>, start a line with <code>- </code> for a bullet. Tokens: <code>{"{book}"}</code> <code>{"{email}"}</code> <code>{"{phone}"}</code> <code>{"{dates}"}</code> <code>{"{first}"}</code> (first name, on person buttons).
      </div>
    </div>
  );
}
