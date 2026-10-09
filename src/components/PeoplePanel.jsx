import { useState } from "react";
import { newPerson } from "../lib/defaults.js";
import { photoUrl, initials } from "../lib/render.js";
import { TextInput, ImageField, ColorField, Toggle, Label } from "./Fields.jsx";

export default function PeoplePanel({ api }) {
  const { doc, update } = api;
  const [open, setOpen] = useState(null);
  const roster = doc.roster;
  const setP = (id, patch) =>
    update((d) => ({ ...d, roster: d.roster.map((p) => (p.id === id ? { ...p, ...patch } : p)) }), "p:" + id + Object.keys(patch).join());
  const move = (i, dir) =>
    update((d) => {
      const r = [...d.roster];
      const j = i + dir;
      if (j < 0 || j >= r.length) return d;
      [r[i], r[j]] = [r[j], r[i]];
      return { ...d, roster: r };
    });
  const remove = (id) => {
    update((d) => ({ ...d, roster: d.roster.filter((p) => p.id !== id) }));
  };
  const add = () => {
    const p = newPerson();
    update((d) => ({ ...d, roster: [...d.roster, p] }));
    setOpen(p.id);
  };
  const ctx = { settings: doc.settings };
  // "In email" = included in the email's Instructor cards section(s).
  const cardBlocks = doc.blocks.filter((b) => b.type === "people");
  const inEmail = (id) => cardBlocks.some((b) => (b.ids || []).includes(id));
  const setInEmail = (id, v) =>
    update((d) => ({
      ...d,
      blocks: d.blocks.map((b) =>
        b.type !== "people" ? b : { ...b, ids: d.roster.map((p) => p.id).filter((pid) => (pid === id ? v : (b.ids || []).includes(pid))) }
      ),
    }));
  const allInEmail = (v) => update((d) => ({ ...d, blocks: d.blocks.map((b) => (b.type === "people" ? { ...b, ids: v ? d.roster.map((p) => p.id) : [] } : b)) }));

  return (
    <div className="panel">
      <p className="panel-tip">Your roster. Switch people <b>On</b> to show them in this email's instructor cards, <b>Off</b> to leave them out. Tap a name to edit. <b>Featured</b> gives someone the big dark card.</p>
      {cardBlocks.length ? (
        <div className="pp-bar top">
          <span>{roster.filter((p) => inEmail(p.id)).length} of {roster.length} in this email</span>
          <button type="button" className="link-btn inline" onClick={() => allInEmail(true)}>All on</button>
          <button type="button" className="link-btn inline" onClick={() => allInEmail(false)}>All off</button>
        </div>
      ) : (
        <p className="note warn">This email has no Instructor cards section yet — add one from Build → + Add a block → “Meet your instructors”.</p>
      )}
      {roster.map((p, i) => {
        const src = photoUrl(p.photo, ctx);
        const isOpen = open === p.id;
        return (
          <div className={"bcard" + (isOpen ? " open" : "")} key={p.id}>
            <div className="bhead">
              <button type="button" className="bhead-main" onClick={() => setOpen(isOpen ? null : p.id)}>
                {src ? <img className="av" src={src} alt="" /> : <span className="av ini">{initials(p.name)}</span>}
                <span className="btxt">
                  <span className="btype">{p.name || "Unnamed"}{p.featured && " ★"}</span>
                  <span className="bsum">{p.role} {p.avail && "· " + p.avail}</span>
                </span>
              </button>
              <div className="bctl">
                {cardBlocks.length > 0 && <span className="bswitch"><Toggle on={inEmail(p.id)} onChange={(v) => setInEmail(p.id, v)} label={inEmail(p.id) ? "On" : "Off"} /></span>}
                <button type="button" className="ib" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up">↑</button>
                <button type="button" className="ib" onClick={() => move(i, 1)} disabled={i === roster.length - 1} aria-label="Move down">↓</button>
              </div>
            </div>
            {isOpen && (
              <div className="bbody">
                <div className="row2">
                  <label className="field"><Label>Name</Label><TextInput value={p.name} onChange={(v) => setP(p.id, { name: v })} /></label>
                  <label className="field"><Label>Role / title</Label><TextInput value={p.role} onChange={(v) => setP(p.id, { role: v })} /></label>
                </div>
                <div className="field block-field"><Label>Photo</Label><ImageField value={p.photo} onChange={(v) => setP(p.id, { photo: v })} /></div>
                <div className="row2">
                  <label className="field"><Label>Availability</Label><TextInput value={p.avail} onChange={(v) => setP(p.id, { avail: v })} placeholder="Sat & Sun" /></label>
                  <label className="field"><Label>Ages</Label><TextInput value={p.ages} onChange={(v) => setP(p.id, { ages: v })} placeholder="All ages" /></label>
                </div>
                <label className="field"><Label help="Blank = no badge">Badge</Label><TextInput value={p.badge} onChange={(v) => setP(p.id, { badge: v })} placeholder="Available" /></label>
                <div className="field block-field">
                  <Label help="“Auto” = green when it says Available, gold otherwise">Badge color</Label>
                  <div className="row-inline">
                    <button type="button" className={"btn sm " + (p.badgeColor === "auto" || !p.badgeColor ? "" : "ghost")} onClick={() => setP(p.id, { badgeColor: "auto" })}>Auto</button>
                    <ColorField value={p.badgeColor === "auto" ? "" : p.badgeColor} onChange={(v) => setP(p.id, { badgeColor: v || "auto" })} brand={doc.settings.brand} />
                  </div>
                </div>
                <div className="field block-field"><Label help="Used when there's no photo">Initials circle color</Label><ColorField value={p.color} onChange={(v) => setP(p.id, { color: v })} brand={doc.settings.brand} /></div>
                <label className="field"><Label help="Optional — overrides the booking link on this person's buttons">Personal booking link</Label><TextInput value={p.link} onChange={(v) => setP(p.id, { link: v })} placeholder="{book}" /></label>
                <div className="field inline"><Toggle on={!!p.featured} onChange={(v) => setP(p.id, { featured: v })} label="Featured (big dark card)" /></div>
                <div className="bfoot"><button type="button" className="btn sm danger" onClick={() => remove(p.id)}>Remove from roster</button></div>
              </div>
            )}
          </div>
        );
      })}
      <button type="button" className="btn add" onClick={add}>+ Add person</button>
    </div>
  );
}
