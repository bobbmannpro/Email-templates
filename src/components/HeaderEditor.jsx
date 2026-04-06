import { NAVY, BLUE } from "../config.js";
import { Card, SLabel } from "./ui.jsx";

export default function HeaderEditor({
  hTitle, setHTitle,
  hSub, setHSub,
  hBullets, setHBullets,
  cycleTemplate,
}) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 6 }}>
        <SLabel text="Email Header" />
        <button
          onClick={cycleTemplate}
          aria-label="Shuffle to a random header"
          style={{ background: BLUE, color: "#fff", border: "none", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
        >
          🔀 Shuffle
        </button>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="header-headline" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Headline</label>
        <input
          id="header-headline"
          value={hTitle}
          onChange={(e) => setHTitle(e.target.value)}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 14, fontWeight: "bold", color: NAVY, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label htmlFor="header-subtitle" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Subtitle</label>
        <textarea
          id="header-subtitle"
          value={hSub}
          onChange={(e) => setHSub(e.target.value)}
          rows={2}
          style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
        />
      </div>

      <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 6 }}>Bullet Points</label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {hBullets.map((b, i) => (
          <div key={i}>
            <label htmlFor={`bullet-${i}`} style={{ display: "none" }}>Bullet {i + 1}</label>
            <input
              id={`bullet-${i}`}
              value={b}
              onChange={(e) => { const next = [...hBullets]; next[i] = e.target.value; setHBullets(next); }}
              placeholder={"Benefit " + (i + 1)}
              style={{ width: "100%", padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
