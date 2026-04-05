import { NAVY, BLUE, GOLD } from "../config.js";
import { FI } from "./ui.jsx";

export default function InstructorCard({ id, st, togInst, updInst, removeInst }) {
  return (
    <div
      style={{
        border: `2px solid ${st.sel ? BLUE : "#e8ecf0"}`,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        background: st.sel ? "#f0f8ff" : "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: st.sel ? 12 : 0,
        }}
      >
        <div
          role="checkbox"
          aria-checked={st.sel}
          style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, cursor: "pointer" }}
          onClick={() => togInst(id)}
        >
          <input
            type="checkbox"
            id={`inst-check-${id}`}
            checked={st.sel}
            onChange={() => togInst(id)}
            style={{ width: 17, height: 17, cursor: "pointer", accentColor: BLUE }}
          />
          {st.photo ? (
            <img
              src={`/photos/${st.photo}`}
              alt={st.name}
              style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: `3px solid ${st.sel ? BLUE : "#e8ecf0"}`, flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 42, height: 42, borderRadius: "50%", background: st.col,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: "bold", color: st.dark ? NAVY : "#fff",
                border: `3px solid ${st.sel ? BLUE : "#e8ecf0"}`, flexShrink: 0,
              }}
            >
              {st.ini}
            </div>
          )}
          <div>
            <div style={{ fontWeight: "bold", color: NAVY, fontSize: 14 }}>{st.name}</div>
            <div style={{ fontSize: 11, color: "#9aa8b5" }}>
              {st.role}
              {st.pro && <span style={{ color: GOLD, fontWeight: "bold" }}> Pro</span>}
            </div>
          </div>
        </div>
        {st.custom && (
          <button
            onClick={() => removeInst(id)}
            aria-label={`Remove ${st.name}`}
            style={{
              background: "none",
              border: "1px solid #fcc",
              color: "#e00",
              borderRadius: 6,
              padding: "4px 8px",
              fontSize: 11,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Remove
          </button>
        )}
      </div>

      {st.sel && (
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <FI id={`inst-name-${id}`} label="Name" value={st.name} onChange={(v) => updInst(id, "name", v)} placeholder="Name" />
            <FI id={`inst-role-${id}`} label="Role" value={st.role} onChange={(v) => updInst(id, "role", v)} placeholder="Swim Instructor" />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <FI id={`inst-avail-${id}`} label="Availability" value={st.avail} onChange={(v) => updInst(id, "avail", v)} placeholder="e.g. Mon-Fri" />
            <FI id={`inst-ages-${id}`} label="Ages" value={st.ages} onChange={(v) => updInst(id, "ages", v)} placeholder="All ages" />
            <FI id={`inst-badge-${id}`} label="Badge" value={st.badge} onChange={(v) => updInst(id, "badge", v)} placeholder="Available" />
          </div>
          <div
            style={{
              padding: 10,
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #e8ecf0",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "#9aa8b5",
                marginBottom: 6,
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              Preview
            </div>
            {id === "bobby" ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: NAVY,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                {st.photo ? (
                  <img src={`/photos/${st.photo}`} alt={st.name} style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover", border: "2px solid #e8a838", flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: GOLD, textAlign: "center", lineHeight: "52px", fontSize: 14, fontWeight: "bold", color: NAVY, border: "2px solid #e8a838", flexShrink: 0 }}>
                    {st.ini}
                  </div>
                )}
                <div>
                  <div style={{ color: "#fff", fontWeight: "bold", fontSize: 13 }}>{st.name}</div>
                  <div style={{ color: GOLD, fontSize: 10, fontWeight: "bold", marginBottom: 3 }}>{st.role}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.75)" }}>
                    📅 {st.avail} · 🏊 {st.ages}
                  </div>
                  <div style={{ marginTop: 3 }}>
                    <span
                      style={{
                        background: "rgba(255,255,255,0.15)",
                        color: "#fff",
                        fontSize: 9,
                        fontWeight: "bold",
                        padding: "2px 8px",
                        borderRadius: 10,
                        textTransform: "uppercase",
                      }}
                    >
                      {st.badge}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  padding: "10px 14px",
                  background: "#f5f7f9",
                  borderRadius: 10,
                  border: "1px solid #e8ecf0",
                  minWidth: 120,
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: st.col,
                    margin: "0 auto 6px",
                    textAlign: "center",
                    lineHeight: "52px",
                    fontSize: 14,
                    fontWeight: "bold",
                    color: st.dark ? NAVY : "#fff",
                    border: "2px solid #1e88c7",
                  }}
                >
                  {st.ini}
                </div>
                <div style={{ fontWeight: "bold", color: NAVY, fontSize: 12 }}>{st.name}</div>
                <div style={{ fontSize: 10, color: BLUE, fontWeight: "bold", margin: "2px 0 4px" }}>{st.role}</div>
                <div style={{ fontSize: 10, color: "#5a6a78" }}>
                  📅 {st.avail} · 🏊 {st.ages}
                </div>
                <div style={{ marginTop: 4 }}>
                  <span
                    style={{
                      background: st.bb,
                      color: st.bc,
                      fontSize: 9,
                      fontWeight: "bold",
                      padding: "2px 8px",
                      borderRadius: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    {st.badge}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
