import { useState, useEffect } from "react";
import { NAVY, BLUE } from "../config.js";
import { Card, SLabel } from "./ui.jsx";
import { generateHeader, getApiKey, saveApiKey } from "../utils/ai.js";

export default function HeaderEditor({
  hTitle, setHTitle,
  hSub, setHSub,
  hBullets, setHBullets,
  cycleTemplate,
  poolType, startD, endD,
}) {
  const [apiKey, setApiKey]       = useState(getApiKey);
  const [showKey, setShowKey]     = useState(!getApiKey());
  const [aiLoading, setAiLoading] = useState(false);
  const [aiErr, setAiErr]         = useState("");

  // Keep local key state in sync with localStorage
  useEffect(() => {
    if (apiKey) saveApiKey(apiKey);
  }, [apiKey]);

  async function handleAiGenerate() {
    if (!apiKey.trim()) { setShowKey(true); setAiErr("Enter your Anthropic API key first."); return; }
    setAiErr("");
    setAiLoading(true);
    try {
      const result = await generateHeader({ poolType, startD, endD });
      setHTitle(result.title);
      setHSub(result.subtitle);
      setHBullets(result.bullets.slice(0, 4));
    } catch (e) {
      if (e.message === "NO_KEY") {
        setShowKey(true);
        setAiErr("Enter your Anthropic API key first.");
      } else {
        setAiErr("AI generation failed: " + e.message);
      }
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, gap: 6, flexWrap: "wrap" }}>
        <SLabel text="Email Header" />
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={handleAiGenerate}
            disabled={aiLoading}
            aria-label="Generate header with AI"
            style={{
              background: aiLoading ? "#c0ccda" : "#6c47d9",
              color: "#fff", border: "none", padding: "7px 14px",
              borderRadius: 8, fontSize: 12, fontWeight: "bold",
              cursor: aiLoading ? "default" : "pointer",
            }}
          >
            {aiLoading ? "Generating…" : "✨ AI Generate"}
          </button>
          <button
            onClick={cycleTemplate}
            aria-label="Shuffle to next header template"
            style={{ background: BLUE, color: "#fff", border: "none", padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
          >
            Shuffle
          </button>
        </div>
      </div>

      {/* API Key section */}
      <div style={{ marginBottom: 10 }}>
        <button
          onClick={() => setShowKey((v) => !v)}
          style={{ background: "none", border: "none", fontSize: 11, color: "#9aa8b5", cursor: "pointer", padding: 0, textDecoration: "underline" }}
        >
          {showKey ? "Hide API key" : apiKey ? "🔑 API key saved — click to change" : "🔑 Set Anthropic API key for AI generation"}
        </button>
        {showKey && (
          <div style={{ marginTop: 6, display: "flex", gap: 6 }}>
            <input
              id="anthropic-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ flex: 1, padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }}
            />
            <button
              onClick={() => { saveApiKey(apiKey); setShowKey(false); setAiErr(""); }}
              style={{ background: NAVY, color: "#fff", border: "none", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontWeight: "bold", cursor: "pointer" }}
            >
              Save
            </button>
          </div>
        )}
        {aiErr && <p style={{ color: "#c00", fontSize: 11, margin: "6px 0 0" }}>{aiErr}</p>}
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
