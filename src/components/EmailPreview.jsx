import { BOOK_URL, COACH_EMAIL, FACILITY_ADDRESS } from "../config.js";
import { fmtDate } from "../utils/date.js";

export default function EmailPreview({ opts, pvMode }) {
  const {
    poolType, startD, endD, forecast, instOrder, insts,
    title, subtitle, bullets,
    triOn, triDate, triTitle, triDesc, triPrice,
    teamOn, teamTitle, teamDesc, teamExtra,
  } = opts;

  const maxW  = pvMode === "mobile" ? 375 : 600;
  const dr    = startD && endD
    ? fmtDate(startD) + " - " + fmtDate(endD)
    : startD
    ? "Starting " + fmtDate(startD)
    : "Now Available";
  const bl    = bullets.filter(Boolean);
  const sec   = { background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "16px 18px" };
  const small = { fontSize: 11, lineHeight: 1.6 };

  const selIds   = instOrder.filter((id) => insts[id] && insts[id].sel);
  const hasBobby = selIds.includes("bobby");
  const otherIds = selIds.filter((id) => id !== "bobby");
  const n        = otherIds.length;
  const psz      = n <= 1 ? 88 : n === 2 ? 80 : n === 3 ? 72 : 64;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: maxW,
        background: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(0,0,0,0.13)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0b2545",
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <img
          src={`${import.meta.env.BASE_URL}photos/cfclogo.jpg`}
          alt="Cooper Fitness Center"
          style={{ width: 42, height: 42, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
        />
        <span
          style={{
            fontFamily: "Georgia,serif",
            fontSize: maxW < 400 ? 13 : 15,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Swim Lessons at Cooper Fitness Center
        </span>
      </div>

      {/* Hero */}
      <div
        style={{
          ...sec,
          background: "#f3f8fc",
          borderBottom: "2px solid #1e88c7",
          padding: "18px 18px",
        }}
      >
        <p
          style={{
            fontFamily: "Georgia,serif",
            fontSize: maxW < 400 ? 18 : 21,
            color: "#0b2545",
            lineHeight: 1.2,
            margin: "0 0 8px",
          }}
        >
          {title || "Private Swim Lessons"}
          <br />
          <em style={{ color: "#1e88c7", fontWeight: "normal" }}>{dr}</em>
        </p>
        <p style={{ ...small, color: "#5a6a78", margin: "0 0 10px" }}>{subtitle}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px 8px" }}>
          {bl.map((b, i) => (
            <p key={i} style={{ fontSize: 11, color: "#2a3642", margin: 0 }}>
              &#10003; {b}
            </p>
          ))}
        </div>
      </div>

      {/* Banner */}
      <div style={{ background: "#e8a838", padding: "10px 18px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "Georgia,serif",
            fontSize: 14,
            color: "#fff",
            fontWeight: "bold",
            margin: 0,
          }}
        >
          Non-Members Are Always Welcome!
        </p>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.9)", margin: "3px 0 0" }}>
          No Cooper membership needed. Everyone is invited.
        </p>
      </div>

      {/* Pool */}
      <div style={{ ...sec }}>
        {poolType === "hotel" ? (
          <div
            style={{
              background: "#fffcf3",
              border: "1px solid #f0dca0",
              borderLeft: "4px solid #e8a838",
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: "#d4942e",
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: "0 0 6px",
              }}
            >
              Hotel Pool
            </p>
            <p style={{ ...small, color: "#5a4a2a", margin: "0 0 3px" }}>
              <strong style={{ color: "#8b6914" }}>Come already in your swimsuit</strong> - no changing rooms near the pool.
            </p>
            <p style={{ ...small, color: "#5a4a2a", margin: "0 0 3px" }}>
              <strong style={{ color: "#8b6914" }}>Bring your own towel.</strong>
            </p>
            <p style={{ ...small, color: "#5a4a2a", margin: "0 0 8px" }}>
              <strong style={{ color: "#8b6914" }}>No bathrooms near the pool.</strong>
            </p>
            <p style={{ fontSize: 10, fontWeight: "bold", color: "#8b6914", margin: "0 0 3px" }}>Directions</p>
            <p style={{ ...small, color: "#5a4a2a", margin: "0 0 2px" }}>
              From Preston/Churchill: Straight past the track to the pool.
            </p>
            <p style={{ ...small, color: "#5a4a2a", margin: 0 }}>
              From Fitness Center: Left out lobby, around tennis courts, straight ahead.
            </p>
          </div>
        ) : (
          <div
            style={{
              background: "#e6f5ee",
              border: "1px solid #b8e0cc",
              borderLeft: "4px solid #1a8a5c",
              borderRadius: 8,
              padding: "12px 14px",
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: "bold",
                color: "#1a8a5c",
                textTransform: "uppercase",
                letterSpacing: 1,
                margin: "0 0 6px",
              }}
            >
              Fitness Center Pool
            </p>
            <p style={{ ...small, color: "#2a5a45", margin: "0 0 3px" }}>
              <strong>Towels available at the pool.</strong>
            </p>
            <p style={{ ...small, color: "#2a5a45", margin: "0 0 8px" }}>
              <strong>Family restroom available near the pool.</strong>
            </p>
            <p style={{ fontSize: 10, fontWeight: "bold", color: "#1a8a5c", margin: "0 0 3px" }}>Directions</p>
            <p style={{ ...small, color: "#2a5a45", margin: 0 }}>
              Preston/Willow entrance, follow the driveway, park, enter through the lobby and check in at the front desk.
            </p>
          </div>
        )}
      </div>

      {/* Weather */}
      {forecast && forecast.length > 0 && (
        <div style={{ ...sec }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "#0b2545", margin: "0 0 10px" }}>
            {forecast.length}-Day Pool-Side Forecast
          </p>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {forecast.map((d, i) => (
                <div
                  key={i}
                  style={{
                    background: "#f5f7f9",
                    border: "1px solid #e8ecf0",
                    borderRadius: 8,
                    padding: "8px 5px",
                    textAlign: "center",
                    minWidth: 56,
                    flex: "0 0 auto",
                  }}
                >
                  <div style={{ fontSize: 7, fontWeight: "bold", color: "#9aa8b5", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                    {d.day}
                  </div>
                  <div style={{ fontSize: 16, margin: "2px 0" }}>{d.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: "bold", color: "#0b2545" }}>{d.high}</div>
                  <div style={{ fontSize: 10, color: "#9aa8b5" }}>{d.low}</div>
                  <div style={{ fontSize: 8, color: "#9aa8b5" }}>{d.rain}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructors */}
      {selIds.length > 0 && (
        <div style={{ ...sec }}>
          <p style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "#0b2545", margin: "0 0 12px" }}>
            Meet Your Instructors
          </p>

          {hasBobby && (
            <div
              style={{
                background: "#0b2545",
                borderRadius: 10,
                padding: "14px",
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: n > 0 ? 12 : 0,
              }}
            >
              {insts.bobby.photo ? (
                <img src={`${import.meta.env.BASE_URL}photos/${insts.bobby.photo}`} alt={insts.bobby.name} style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover", border: "2px solid #e8a838", flexShrink: 0 }} />
              ) : (
                <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#e8a838", textAlign: "center", lineHeight: "70px", fontSize: 18, fontWeight: "bold", color: "#0b2545", border: "2px solid #e8a838", flexShrink: 0 }}>
                  {insts.bobby.ini}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: 15, color: "#fff", fontWeight: "bold", margin: "0 0 2px" }}>
                  {insts.bobby.name}
                </p>
                <p style={{ fontSize: 10, color: "#e8a838", fontWeight: "bold", margin: "0 0 5px" }}>
                  {insts.bobby.role}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", margin: "0 0 2px" }}>
                  📅 {insts.bobby.avail}
                </p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.75)", margin: "0 0 6px" }}>
                  🏊 {insts.bobby.ages}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: "bold",
                      padding: "2px 8px",
                      borderRadius: 10,
                      textTransform: "uppercase",
                    }}
                  >
                    {insts.bobby.badge}
                  </span>
                  <a
                    href={BOOK_URL}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      background: "#e8a838",
                      color: "#0b2545",
                      fontSize: 10,
                      fontWeight: "bold",
                      padding: "5px 14px",
                      borderRadius: 16,
                      textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Book
                  </a>
                </div>
              </div>
            </div>
          )}

          {n > 0 && (
            <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", paddingBottom: 4 }}>
              <div style={{ display: "flex", gap: 8, width: n <= 2 ? "100%" : "max-content" }}>
                {otherIds.map((id, i) => {
                  const s = insts[id];
                  return (
                    <div
                      key={i}
                      style={{
                        background: "#f5f7f9",
                        border: "1px solid #e8ecf0",
                        borderRadius: 10,
                        padding: "14px 10px",
                        textAlign: "center",
                        flex: n <= 2 ? 1 : "0 0 140px",
                        minWidth: n <= 2 ? 0 : 140,
                      }}
                    >
                      {s.photo ? (
                        <img
                          src={`${import.meta.env.BASE_URL}photos/${s.photo}`}
                          alt={s.name}
                          style={{
                            width: psz,
                            height: psz,
                            borderRadius: "50%",
                            objectFit: "cover",
                            margin: "0 auto 8px",
                            display: "block",
                            border: "2px solid #1e88c7",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: psz,
                            height: psz,
                            borderRadius: "50%",
                            background: s.col,
                            margin: "0 auto 8px",
                            textAlign: "center",
                            lineHeight: psz + "px",
                            fontSize: Math.floor(psz * 0.28),
                            fontWeight: "bold",
                            color: s.dark ? "#0b2545" : "#fff",
                            border: "2px solid #1e88c7",
                          }}
                        >
                          {s.ini}
                        </div>
                      )}
                      <p style={{ fontFamily: "Georgia,serif", fontSize: 13, color: "#0b2545", fontWeight: "bold", margin: "0 0 2px" }}>
                        {s.name}
                      </p>
                      <p style={{ fontSize: 10, color: "#1e88c7", fontWeight: "bold", margin: "0 0 6px" }}>
                        {s.role}
                      </p>
                      <p style={{ fontSize: 10, color: "#5a6a78", margin: "0 0 2px" }}>📅 {s.avail}</p>
                      <p style={{ fontSize: 10, color: "#5a6a78", margin: "0 0 6px" }}>🏊 {s.ages}</p>
                      <span
                        style={{
                          display: "inline-block",
                          background: s.bb,
                          color: s.bc,
                          fontSize: 9,
                          fontWeight: "bold",
                          padding: "2px 8px",
                          borderRadius: 10,
                          textTransform: "uppercase",
                          marginBottom: 8,
                        }}
                      >
                        {s.badge}
                      </span>
                      <br />
                      <a
                        href={BOOK_URL}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: "#1e88c7",
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: "bold",
                          padding: "5px 14px",
                          borderRadius: 16,
                          textDecoration: "none",
                          display: "inline-block",
                        }}
                      >
                        Book
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Rates summary */}
      <div style={{ ...sec }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: 16, color: "#0b2545", margin: "0 0 10px" }}>
          Lesson Rates
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: "bold", color: "#0b2545", margin: "0 0 4px" }}>
              Bobby Manning{" "}
              <span
                style={{
                  background: "#0b2545",
                  color: "#fff",
                  fontSize: 8,
                  padding: "1px 6px",
                  borderRadius: 8,
                  marginLeft: 4,
                }}
              >
                PRO
              </span>
            </p>
            <p style={{ fontSize: 11, color: "#5a6a78", margin: "0 0 1px" }}>30 min — $80</p>
            <p style={{ fontSize: 11, color: "#5a6a78", margin: "0 0 1px" }}>45 min — $120</p>
            <p style={{ fontSize: 11, color: "#5a6a78", margin: 0 }}>60 min — $160</p>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: "bold", color: "#1e88c7", margin: "0 0 4px" }}>Instructors</p>
            <p style={{ fontSize: 11, color: "#5a6a78", margin: "0 0 1px" }}>15 min — $30</p>
            <p style={{ fontSize: 11, color: "#5a6a78", margin: "0 0 1px" }}>30 min — $60</p>
            <p style={{ fontSize: 11, color: "#5a6a78", margin: 0 }}>45 min — $90 / 60 min — $120</p>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 12 }}>
          <a
            href={BOOK_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              background: "#1e88c7",
              color: "#fff",
              fontSize: 12,
              fontWeight: "bold",
              padding: "9px 24px",
              borderRadius: 22,
              textDecoration: "none",
            }}
          >
            Book Now
          </a>
        </div>
      </div>

      {/* Triathlon */}
      {triOn && (
        <div style={{ ...sec }}>
          <div style={{ background: "#0b2545", borderRadius: 10, padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: "bold", color: "#e8a838", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>
                  Triathlon Training
                </p>
                <p style={{ fontFamily: "Georgia,serif", fontSize: 17, color: "#fff", fontWeight: "bold", margin: 0 }}>
                  {triTitle}
                </p>
              </div>
              <img src={`${import.meta.env.BASE_URL}photos/cfclogo.jpg`} alt="Cooper Fitness Center" style={{ width: 46, height: 46, borderRadius: 8, objectFit: "cover", flexShrink: 0, marginLeft: 10 }} />
            </div>
            {triDate && (
              <p style={{ fontSize: 11, color: "#e8a838", fontWeight: "bold", margin: "0 0 8px" }}>
                📅 {fmtDate(triDate)}
              </p>
            )}
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", lineHeight: 1.6, margin: "0 0 10px" }}>
              {triDesc}
            </p>
            {triPrice && (
              <p style={{ fontSize: 12, color: "#fff", fontWeight: "bold", margin: "0 0 10px" }}>
                💰 {triPrice}
              </p>
            )}
            <a
              href={BOOK_URL}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#e8a838",
                color: "#0b2545",
                fontSize: 11,
                fontWeight: "bold",
                padding: "7px 18px",
                borderRadius: 18,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}

      {/* Swim team */}
      {teamOn && (
        <div style={{ ...sec }}>
          <div
            style={{
              background: "#e8f6fc",
              border: "1px solid #b3dff0",
              borderLeft: "4px solid #1e88c7",
              borderRadius: 8,
              padding: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: "bold", color: "#1e88c7", textTransform: "uppercase", letterSpacing: 1, margin: "0 0 4px" }}>
                  Cooper Cyclones Swim Team
                </p>
                <p style={{ fontFamily: "Georgia,serif", fontSize: 17, color: "#0b2545", fontWeight: "bold", margin: 0 }}>
                  {teamTitle}
                </p>
              </div>
              <img src={`${import.meta.env.BASE_URL}photos/cycloneslogo.png`} alt="Cooper Cyclones" style={{ width: 54, height: 54, objectFit: "contain", flexShrink: 0, marginLeft: 10 }} />
            </div>
            <p style={{ fontSize: 11, color: "#5a6a78", lineHeight: 1.6, margin: "0 0 8px" }}>{teamDesc}</p>
            {teamExtra && (
              <p style={{ fontSize: 11, color: "#5a6a78", lineHeight: 1.6, margin: "0 0 8px" }}>{teamExtra}</p>
            )}
            <a
              href={`mailto:${COACH_EMAIL}`}
              style={{
                background: "#1e88c7",
                color: "#fff",
                fontSize: 11,
                fontWeight: "bold",
                padding: "7px 18px",
                borderRadius: 18,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Email Coach Bobby
            </a>
          </div>
        </div>
      )}

      {/* CTA */}
      <div style={{ background: "#0b2545", padding: "22px 18px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "Georgia,serif",
            fontSize: maxW < 400 ? 17 : 19,
            color: "#fff",
            fontWeight: "bold",
            margin: "0 0 6px",
          }}
        >
          Ready to Jump In?
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 14px" }}>
          Spots fill up fast - book your lesson today!
        </p>
        <a
          href={BOOK_URL}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-block",
            background: "#e8a838",
            color: "#0b2545",
            fontSize: 13,
            fontWeight: "bold",
            padding: "11px 28px",
            borderRadius: 26,
            textDecoration: "none",
          }}
        >
          Book a Lesson
        </a>
        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "12px 0 0" }}>
          {COACH_EMAIL}
        </p>
      </div>

      {/* Footer */}
      <div style={{ background: "#071a33", padding: "12px 18px", textAlign: "center" }}>
        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", margin: 0 }}>
          {FACILITY_ADDRESS}
        </p>
      </div>
    </div>
  );
}
