import { NAVY, BLUE, GOLD, GRN } from "../config.js";
import { fmtDate } from "../utils/date.js";
import { Btn } from "./ui.jsx";
import EmailPreview from "./EmailPreview.jsx";

export default function PreviewPanel({
  getOpts, buildAndSet, copyHtml,
  pvMode, setPvMode, copied,
  poolType, startD, dc, forecast, triOn, teamOn, insts, instOrder,
  onBack,
}) {
  const opts = getOpts();

  return (
    <>
      <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
        <Btn onClick={onBack} color="#8899aa">Back</Btn>
        <button
          onClick={buildAndSet}
          aria-label="Refresh email preview"
          style={{
            background: GOLD,
            color: NAVY,
            border: "none",
            padding: "10px 14px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
        <button
          onClick={copyHtml}
          aria-label={copied ? "HTML copied to clipboard" : "Copy email HTML to clipboard"}
          style={{
            flex: 1,
            background: copied ? GRN : BLUE,
            color: "#fff",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          {copied ? "Copied!" : "Copy HTML"}
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 10,
          padding: "8px 12px",
          marginBottom: 8,
          fontSize: 11,
          color: "#5a6a78",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span>
          <strong>{poolType === "hotel" ? "Hotel Pool" : "Fitness Center Pool"}</strong>
        </span>
        {startD && (
          <span>
            📅 <strong>{dc} days</strong>
          </span>
        )}
        {forecast && (
          <span>
            🌤 <strong>{forecast.length}d wx</strong>
          </span>
        )}
        {triOn && <span><strong>Tri</strong></span>}
        {teamOn && <span><strong>Cyclones</strong></span>}
        <span>
          👤{" "}
          <strong>
            {instOrder
              .filter((id) => insts[id]?.sel)
              .map((id) => insts[id].name.split(" ")[0])
              .join(", ")}
          </strong>
        </span>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 8, justifyContent: "center" }}>
        {[
          ["mobile", "375px"],
          ["tablet", "600px"],
          ["desktop", "Full"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setPvMode(k)}
            aria-label={`Preview as ${k}`}
            aria-pressed={pvMode === k}
            style={{
              background: pvMode === k ? NAVY : "#fff",
              color: pvMode === k ? "#fff" : "#9aa8b5",
              border: `1px solid ${pvMode === k ? NAVY : "#e8ecf0"}`,
              padding: "5px 10px",
              borderRadius: 6,
              fontSize: 11,
              cursor: "pointer",
              fontWeight: pvMode === k ? "bold" : "normal",
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ background: "#dde2e8", borderRadius: 12, padding: 8 }}>
        <div
          style={{
            background: "#e0e5ea",
            borderRadius: "8px 8px 0 0",
            padding: "6px 12px",
            display: "flex",
            gap: 5,
            alignItems: "center",
          }}
        >
          {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
          ))}
          <span style={{ marginLeft: 6, fontSize: 11, color: "#9aa8b5" }}>{pvMode}</span>
        </div>
        <div
          style={{
            background: "#e8ecf0",
            borderRadius: "0 0 8px 8px",
            overflowY: "auto",
            maxHeight: 640,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", padding: "12px 0" }}>
            <EmailPreview opts={opts} pvMode={pvMode} />
          </div>
        </div>
      </div>
    </>
  );
}
