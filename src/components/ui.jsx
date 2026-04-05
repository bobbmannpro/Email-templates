import { NAVY, BLUE, GOLD, GRN } from "../config.js";

export function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SLabel({ text }) {
  return (
    <h3
      style={{
        margin: "0 0 10px",
        color: NAVY,
        fontSize: 12,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}
    >
      {text}
    </h3>
  );
}

export function Btn({ onClick, disabled, color, children, full, style }) {
  const bg = disabled ? "#c0ccda" : color || NAVY;
  const fg = bg === GOLD ? NAVY : "#fff";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg,
        color: fg,
        border: "none",
        padding: "10px 18px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: "bold",
        cursor: disabled ? "default" : "pointer",
        width: full ? "100%" : "auto",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function FI({ label, value, onChange, placeholder, style, id }) {
  return (
    <div style={{ flex: "1 1 120px", ...style }}>
      <label
        htmlFor={id}
        style={{ display: "block", fontSize: 10, color: "#5a6a78", marginBottom: 3 }}
      >
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "6px 8px",
          border: "1px solid #e8ecf0",
          borderRadius: 6,
          fontSize: 12,
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export function ToggleRow({ on, onToggle, label, sub }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <div>
        <SLabel text={label} />
        {sub && (
          <p style={{ margin: "-6px 0 0", fontSize: 12, color: "#9aa8b5" }}>{sub}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        aria-pressed={on}
        style={{
          background: on ? GRN : "#e8ecf0",
          color: on ? "#fff" : "#9aa8b5",
          border: "none",
          padding: "8px 16px",
          borderRadius: 20,
          fontSize: 12,
          fontWeight: "bold",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        {on ? "On" : "Off"}
      </button>
    </div>
  );
}
