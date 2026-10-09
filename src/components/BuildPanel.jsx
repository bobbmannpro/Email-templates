import { useEffect, useRef, useState } from "react";
import { BLOCK_TYPES, COMMON_FIELDS, blockSummary, createBlock, newId } from "../lib/blocks.js";
import { TEMPLATES, fromTemplate } from "../lib/defaults.js";
import { Field, Toggle } from "./Fields.jsx";

function BlockCard({ block, index, count, open, onOpen, ctl, brand, roster }) {
  const def = BLOCK_TYPES[block.type];
  const [styleOpen, setStyleOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (open && ref.current) ref.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [open]);
  if (!def) return null;
  const set = (patch) => ctl.setBlock(block.id, patch);
  return (
    <div
      ref={ref}
      className={"bcard" + (open ? " open" : "") + (block.hidden ? " hidden" : "")}
      draggable={!open}
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", String(index)); e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); const from = +e.dataTransfer.getData("text/plain"); if (!isNaN(from)) ctl.move(from, index); }}
    >
      <div className="bhead">
        <button type="button" className="bhead-main" onClick={onOpen} aria-expanded={open}>
          <span className="bicon" aria-hidden>{def.icon}</span>
          <span className="btxt">
            <span className="btype">{def.label}</span>
            <span className="bsum">{blockSummary(block, roster) || " "}</span>
          </span>
        </button>
        <div className="bctl">
          <button type="button" className="ib" onClick={() => ctl.move(index, index - 1)} disabled={index === 0} title="Move up" aria-label="Move up">↑</button>
          <button type="button" className="ib" onClick={() => ctl.move(index, index + 1)} disabled={index === count - 1} title="Move down" aria-label="Move down">↓</button>
          <span className="bswitch" title={block.hidden ? "Off — not in the email" : "On — in the email"}>
            <Toggle on={!block.hidden} onChange={(v) => set({ hidden: !v })} label={block.hidden ? "Off" : "On"} />
          </span>
        </div>
      </div>
      {open && (
        <div className="bbody">
          {def.hint && <p className="hint">{def.hint}</p>}
          {def.fields.map((f, i) => (
            <Field key={f.key + i} f={f} block={block} set={set} brand={brand} roster={roster} />
          ))}
          <button type="button" className="link-btn" onClick={() => setStyleOpen((s) => !s)}>{styleOpen ? "▾" : "▸"} Block style</button>
          {styleOpen && COMMON_FIELDS.map((f) => <Field key={f.key} f={f} block={block} set={set} brand={brand} roster={roster} />)}
          <div className="bfoot">
            <button type="button" className="btn sm ghost" onClick={() => ctl.duplicate(index)}>⧉ Duplicate</button>
            <button type="button" className="btn sm ghost" onClick={() => ctl.addAt(index + 1)}>+ Add below</button>
            <button type="button" className="btn sm danger" onClick={() => ctl.remove(index)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export function AddBlockMenu({ onPick, onClose }) {
  const [tab, setTab] = useState("templates");
  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Add a block">
        <div className="modal-head">
          <div className="seg">
            <button type="button" className={tab === "templates" ? "on" : ""} onClick={() => setTab("templates")}>Ready-made</button>
            <button type="button" className={tab === "blank" ? "on" : ""} onClick={() => setTab("blank")}>Blank blocks</button>
          </div>
          <button type="button" className="ib" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="pick-grid">
          {tab === "templates"
            ? TEMPLATES.map((t) => (
                <button type="button" key={t.name} className="pick" onClick={() => onPick(fromTemplate(t))}>
                  <span className="bicon">{BLOCK_TYPES[t.type].icon}</span>
                  <span><strong>{t.name}</strong><small>{BLOCK_TYPES[t.type].label}</small></span>
                </button>
              ))
            : Object.entries(BLOCK_TYPES).map(([type, d]) => (
                <button type="button" key={type} className="pick" onClick={() => onPick(createBlock(type))}>
                  <span className="bicon">{d.icon}</span>
                  <span><strong>{d.label}</strong><small>{d.hint}</small></span>
                </button>
              ))}
        </div>
      </div>
    </div>
  );
}

export default function BuildPanel({ api, selected, setSelected }) {
  const { doc, update, setBlock } = api;
  const [adding, setAdding] = useState(null); // insert index or null
  const blocks = doc.blocks;

  const ctl = {
    setBlock,
    move(from, to) {
      if (to < 0 || to >= blocks.length || from === to) return;
      update((d) => {
        const b = [...d.blocks];
        const [x] = b.splice(from, 1);
        b.splice(to, 0, x);
        return { ...d, blocks: b };
      });
    },
    duplicate(i) {
      const copy = { ...JSON.parse(JSON.stringify(blocks[i])), id: newId() };
      update((d) => { const b = [...d.blocks]; b.splice(i + 1, 0, copy); return { ...d, blocks: b }; });
      setSelected(copy.id);
    },
    remove(i) {
      update((d) => ({ ...d, blocks: d.blocks.filter((_, j) => j !== i) }));
    },
    addAt(i) { setAdding(i); },
  };

  function insert(block) {
    const at = adding ?? blocks.length;
    update((d) => { const b = [...d.blocks]; b.splice(at, 0, block); return { ...d, blocks: b }; });
    setAdding(null);
    setSelected(block.id);
  }

  return (
    <div className="panel">
      <p className="panel-tip">Switch any section On or Off for this email. Tap a section to edit it, ↑ ↓ to reorder. Tap any section in the preview to jump to it.</p>
      {blocks.map((b, i) => (
        <BlockCard
          key={b.id}
          block={b}
          index={i}
          count={blocks.length}
          open={selected === b.id}
          onOpen={() => setSelected(selected === b.id ? null : b.id)}
          ctl={ctl}
          brand={doc.settings.brand}
          roster={doc.roster}
        />
      ))}
      {!blocks.length && <p className="empty">This email is empty. Add your first block ↓</p>}
      <button type="button" className="btn add" onClick={() => setAdding(blocks.length)}>+ Add a block</button>
      {adding != null && <AddBlockMenu onPick={insert} onClose={() => setAdding(null)} />}
    </div>
  );
}
