import { NAVY, BLUE, GRN } from "../config.js";
import { Card, SLabel, Btn } from "./ui.jsx";

export default function WeatherForecast({
  wxMode, setWxMode,
  forecast, wxErr, setWxErr, wxLoading,
  manRows, startD, dc,
  setupRows, updateRow, applyManual, genAutoWx, fetchLiveWx,
  COND_LIST,
}) {
  const modes = [
    ["live",   "Live Weather"],
    ["auto",   "Auto-Generate"],
    ["manual", "Manual Entry"],
  ];

  return (
    <Card>
      <SLabel text="Weather Forecast - 75230" />
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {modes.map(([m, l]) => (
          <button
            key={m}
            onClick={() => { setWxMode(m); setWxErr(""); }}
            aria-pressed={wxMode === m}
            style={{
              flex: 1,
              padding: "8px 4px",
              border: `2px solid ${wxMode === m ? BLUE : "#e8ecf0"}`,
              borderRadius: 8,
              background: wxMode === m ? "#f0f8ff" : "#fafafa",
              color: wxMode === m ? BLUE : NAVY,
              fontWeight: wxMode === m ? "bold" : "normal",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            {l}
          </button>
        ))}
      </div>

      {wxErr && (
        <div style={{ background: "#fff0f0", border: "1px solid #fcc", color: "#c00", padding: "8px 10px", borderRadius: 8, marginBottom: 10, fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>{wxErr}</span>
          <button onClick={() => setWxErr("")} aria-label="Dismiss error" style={{ background: "none", border: "none", color: "#c00", cursor: "pointer", fontSize: 16 }}>×</button>
        </div>
      )}

      {wxMode === "live" && (
        <>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#9aa8b5" }}>
            Pulls the real forecast for <strong>75230 North Dallas</strong> from Open-Meteo (free, no API key).
            Select your date range first.
          </p>
          <Btn onClick={fetchLiveWx} disabled={!startD || wxLoading} color={BLUE}>
            {wxLoading ? "Fetching…" : startD ? `Fetch ${dc}-Day Forecast` : "Select a date first"}
          </Btn>
        </>
      )}

      {wxMode === "auto" && (
        <>
          <p style={{ margin: "0 0 10px", fontSize: 12, color: "#9aa8b5" }}>
            Generates realistic Dallas temps based on the season. Works offline.
          </p>
          <Btn onClick={genAutoWx} disabled={!startD} color={BLUE}>
            {startD ? `Generate ${dc}-Day Forecast` : "Select a date first"}
          </Btn>
        </>
      )}

      {wxMode === "manual" && (
        <>
          {!manRows.length ? (
            <>
              <p style={{ margin: "0 0 10px", fontSize: 12, color: "#9aa8b5" }}>
                Enter values from your Weather Channel app.
              </p>
              <Btn onClick={setupRows} disabled={!startD} color={BLUE}>Set Up Fields</Btn>
            </>
          ) : (
            <>
              <div style={{ overflowX: "auto", marginBottom: 10 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, minWidth: 380 }}>
                  <thead>
                    <tr style={{ background: "#f5f7f9" }}>
                      {["Day", "Condition", "High", "Low", "Rain %"].map((h) => (
                        <th key={h} scope="col" style={{ padding: "6px", textAlign: "left", color: "#9aa8b5", fontWeight: "bold", fontSize: 10, textTransform: "uppercase", borderBottom: "2px solid #e8ecf0", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {manRows.map((r, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "5px 6px", fontWeight: "bold", color: NAVY, whiteSpace: "nowrap", fontSize: 11 }}>{r.day}</td>
                        <td style={{ padding: "4px" }}>
                          <label htmlFor={`wx-cond-${i}`} style={{ display: "none" }}>Condition</label>
                          <select id={`wx-cond-${i}`} value={r.cond} onChange={(e) => updateRow(i, "cond", e.target.value)}
                            style={{ fontSize: 11, padding: "4px", border: "1px solid #e8ecf0", borderRadius: 5, width: "100%", background: "#fff" }}>
                            {COND_LIST.map((c) => <option key={c}>{c}</option>)}
                          </select>
                        </td>
                        {[{ f: "hi", label: "High", placeholder: "73" }, { f: "lo", label: "Low", placeholder: "47" }, { f: "rain", label: "Rain %", placeholder: "2%" }].map(({ f, label, placeholder }) => (
                          <td key={f} style={{ padding: "4px 3px" }}>
                            <label htmlFor={`wx-${f}-${i}`} style={{ display: "none" }}>{label}</label>
                            <input id={`wx-${f}-${i}`} value={r[f]} onChange={(e) => updateRow(i, f, e.target.value)} placeholder={placeholder}
                              style={{ width: "100%", padding: "4px 5px", border: "1px solid #e8ecf0", borderRadius: 5, fontSize: 12, boxSizing: "border-box", minWidth: 36 }} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Btn onClick={applyManual} color={BLUE} full>Apply Forecast</Btn>
            </>
          )}
        </>
      )}

      {forecast && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {forecast.map((d, i) => (
              <div key={i} style={{ background: "#f5f7f9", border: "1px solid #e8ecf0", borderRadius: 8, padding: "8px 6px", textAlign: "center", minWidth: 52, flex: "0 0 auto" }}>
                <div style={{ fontSize: 7, fontWeight: "bold", color: "#9aa8b5", textTransform: "uppercase" }}>{d.day}</div>
                <div style={{ fontSize: 18, margin: "2px 0" }}>{d.icon}</div>
                <div style={{ fontSize: 13, fontWeight: "bold", color: NAVY }}>{d.high}</div>
                <div style={{ fontSize: 10, color: "#9aa8b5" }}>{d.low}</div>
                <div style={{ fontSize: 8, color: "#9aa8b5" }}>{d.rain}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 6, fontSize: 11, color: GRN, fontWeight: "bold" }}>
            ✓ {forecast.length}-day forecast ready
          </div>
        </div>
      )}
    </Card>
  );
}
