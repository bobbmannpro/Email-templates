import { useState } from "react";
import { NAVY, BLUE, GOLD, GRN } from "./config.js";
import { fmtDate } from "./utils/date.js";
import { buildEmailHtml } from "./utils/email.js";
import { useInstructors } from "./hooks/useInstructors.js";
import { useWeather } from "./hooks/useWeather.js";
import { useHeaderForm } from "./hooks/useHeaderForm.js";
import { Card, SLabel, Btn, ToggleRow } from "./components/ui.jsx";
import AddInstructorModal from "./components/AddInstructorModal.jsx";
import InstructorCard from "./components/InstructorCard.jsx";
import WeatherForecast from "./components/WeatherForecast.jsx";
import HeaderEditor from "./components/HeaderEditor.jsx";
import PreviewPanel from "./components/PreviewPanel.jsx";

export default function App() {
  // ─── App-level state ─────────────────────────────────────────────────────────
  const [step, setStep]     = useState(1);
  const [poolType, setPoolType] = useState("hotel");
  const [startD, setStartD] = useState("");
  const [endD, setEndD]     = useState("");
  const [pvMode, setPvMode] = useState("mobile");
  const [copied, setCopied] = useState(false);

  // Add-ons
  const [triOn, setTriOn]       = useState(false);
  const [triDate, setTriDate]   = useState("");
  const [triTitle, setTriTitle] = useState("Triathlon Swim Training");
  const [triDesc, setTriDesc]   = useState(
    "Train your swim leg with Coach Bobby - personalized sessions for sprint, Olympic, and 70.3 distances."
  );
  const [triPrice, setTriPrice] = useState("$120/hour");
  const [teamOn, setTeamOn]         = useState(false);
  const [poolCondOn, setPoolCondOn] = useState(false);

  const [navTitle, setNavTitle] = useState("Swim Lessons at Cooper Fitness Center");

  // Per-section visibility (all on by default)
  const [showBanner,     setShowBanner]     = useState(true);
  const [showPoolLoc,    setShowPoolLoc]    = useState(true);
  const [showWeather,    setShowWeather]    = useState(true);
  const [showInstructors,setShowInstructors]= useState(true);
  const [showRates,      setShowRates]      = useState(true);
  const [showFooterCta,  setShowFooterCta]  = useState(true);
  const [spotlights, setSpotlights] = useState({});   // { [id]: { on, bio, fun } }

  function toggleSpotlight(id) {
    setSpotlights((prev) => ({ ...prev, [id]: { ...defaultSpot(prev[id]), on: !prev[id]?.on } }));
  }
  function updateSpotlight(id, key, val) {
    setSpotlights((prev) => ({ ...prev, [id]: { ...defaultSpot(prev[id]), [key]: val } }));
  }
  function defaultSpot(existing) {
    return { on: false, bio: "", fun: "", ...existing };
  }
  const [teamTitle, setTeamTitle] = useState("Join the Cooper Cyclones!");
  const [teamDesc, setTeamDesc]   = useState(
    "Year-round competitive swim team for youth athletes of all levels. USA Swimming sanctioned meets, structured training, and an incredible team culture."
  );
  const [teamExtra, setTeamExtra] = useState("");

  // ─── Custom hooks ─────────────────────────────────────────────────────────────
  const instructors = useInstructors();
  const weather     = useWeather(startD, endD);
  const header      = useHeaderForm();

  const { instOrder, insts, addOpen, setAddOpen, newName, setNewName, newRole, setNewRole,
          newAvail, setNewAvail, newAges, setNewAges, newBadge, setNewBadge,
          nameError, setNameError, togInst, updInst, addInst, removeInst } = instructors;

  const { forecast, wxMode, setWxMode, manRows, wxErr, setWxErr, wxLoading, dc,
          fetchLiveWx, setupRows, updateRow, applyManual, genAutoWx, COND_LIST } = weather;

  const { subjectId, changeSubject, hTitle, setHTitle, hSub, setHSub, hBullets, setHBullets, cycleTemplate } = header;

  // ─── Date validation ─────────────────────────────────────────────────────────
  const dateError =
    startD && endD && new Date(endD + "T00:00:00") < new Date(startD + "T00:00:00")
      ? "End date must be on or after start date."
      : "";

  // ─── Email building ───────────────────────────────────────────────────────────
  function getOpts() {
    return {
      poolType, startD, endD, forecast, instOrder, insts,
      title: hTitle, subtitle: hSub, bullets: hBullets,
      triOn, triDate, triTitle, triDesc, triPrice,
      teamOn, teamTitle, teamDesc, teamExtra,
      navTitle,
      poolCondOn, spotlights,
      showBanner, showPoolLoc, showWeather, showInstructors, showRates, showFooterCta,
    };
  }

  function buildAndSet() {
    return buildEmailHtml(getOpts());
  }

  async function copyHtml() {
    const h = buildAndSet();
    await navigator.clipboard.writeText(h);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "Arial,sans-serif", background: "#eef1f5", minHeight: "100vh", fontSize: 14 }}>

      {/* Nav bar */}
      <div style={{ background: NAVY, padding: "12px 18px", display: "flex", alignItems: "center", gap: 12 }}>
        <div
          aria-label="Cooper Fitness Center logo"
          style={{
            width: 36, height: 36, background: BLUE, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: "bold", color: "#fff",
            border: "2px solid rgba(255,255,255,0.25)", flexShrink: 0,
          }}
        >
          CFC
        </div>
        <div style={{ color: "#fff", fontSize: 15, fontWeight: "bold", fontFamily: "Georgia,serif" }}>
          Cooper Swim Email Generator
        </div>
      </div>

      {/* Step tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", display: "flex", padding: "0 8px", overflowX: "auto" }}>
        {["1. Settings", "2. Instructors", "3. Add-Ons", "4. Preview"].map((lbl, i) => {
          const active = step === i + 1;
          const done   = step > i + 1;
          return (
            <div
              key={i}
              onClick={() => done && setStep(i + 1)}
              role={done ? "button" : undefined}
              tabIndex={done ? 0 : undefined}
              onKeyDown={(e) => done && e.key === "Enter" && setStep(i + 1)}
              style={{
                padding: "11px 10px",
                fontSize: 12,
                fontWeight: active ? "bold" : "normal",
                color: active ? BLUE : done ? NAVY : "#b0bec5",
                borderBottom: `2px solid ${active ? BLUE : "transparent"}`,
                cursor: done ? "pointer" : "default",
                whiteSpace: "nowrap",
              }}
            >
              {lbl}
            </div>
          );
        })}
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "12px 10px" }}>

        {/* ═══════════════ STEP 1 ═══════════════ */}
        {step === 1 && (
          <>
            {/* Pool */}
            <Card>
              <SLabel text="Pool Location" />
              <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                {[
                  ["hotel", "Hotel Pool", "Bring towel · Swimsuit · No bathrooms"],
                  ["fitness", "Fitness Center Pool", "Towels provided · Restroom · Check in"],
                ].map(([v, l, d]) => (
                  <div
                    key={v}
                    onClick={() => setPoolType(v)}
                    role="radio"
                    aria-checked={poolType === v}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setPoolType(v)}
                    style={{
                      flex: 1, padding: 10,
                      border: `2px solid ${poolType === v ? BLUE : "#e8ecf0"}`,
                      borderRadius: 10, cursor: "pointer",
                      background: poolType === v ? "#f0f8ff" : "#fafafa",
                    }}
                  >
                    <div style={{ fontWeight: "bold", color: poolType === v ? BLUE : NAVY, fontSize: 12, marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: 10, color: "#9aa8b5", lineHeight: 1.4 }}>{d}</div>
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: 10, borderRadius: 8, fontSize: 11, lineHeight: 1.8,
                  background: poolType === "hotel" ? "#fffcf3" : "#e6f5ee",
                  border: `1px solid ${poolType === "hotel" ? "#f0dca0" : "#b8e0cc"}`,
                  borderLeft: `4px solid ${poolType === "hotel" ? GOLD : GRN}`,
                  color: poolType === "hotel" ? "#5a4a2a" : "#2a5a45",
                }}
              >
                {poolType === "hotel" ? (
                  <>
                    <strong style={{ color: "#8b6914" }}>Hotel Pool</strong><br />
                    Come in swimsuit · Bring towel · No bathrooms<br />
                    <strong>From Preston/Churchill:</strong> Straight past track to pool<br />
                    <strong>From Fitness Center:</strong> Left out lobby, around tennis courts
                  </>
                ) : (
                  <>
                    <strong style={{ color: GRN }}>Fitness Center Pool</strong><br />
                    Towels at pool · Family restroom nearby<br />
                    <strong>Directions:</strong> Preston/Willow entrance, driveway, park, lobby, front desk
                  </>
                )}
              </div>
            </Card>

            {/* Dates */}
            <Card>
              <SLabel text="Lesson Date Range" />
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 140px" }}>
                  <label htmlFor="start-date" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>
                    Start Date
                  </label>
                  <input
                    id="start-date"
                    type="date"
                    value={startD}
                    onChange={(e) => setStartD(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ flex: "1 1 140px" }}>
                  <label htmlFor="end-date" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>
                    End Date (optional)
                  </label>
                  <input
                    id="end-date"
                    type="date"
                    value={endD}
                    onChange={(e) => setEndD(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }}
                  />
                </div>
              </div>
              {dateError && (
                <p style={{ color: "#c00", fontSize: 12, margin: "8px 0 0" }}>{dateError}</p>
              )}
              {startD && !dateError && (
                <div style={{ marginTop: 8, fontSize: 13, color: BLUE, fontWeight: "bold" }}>
                  📅 {endD ? `${fmtDate(startD)} - ${fmtDate(endD)} (${dc} days)` : fmtDate(startD)}
                </div>
              )}
            </Card>

            {/* Weather */}
            <WeatherForecast
              wxMode={wxMode} setWxMode={setWxMode}
              forecast={forecast} wxErr={wxErr} setWxErr={setWxErr} wxLoading={wxLoading}
              manRows={manRows} startD={startD} dc={dc}
              fetchLiveWx={fetchLiveWx} setupRows={setupRows} updateRow={updateRow}
              applyManual={applyManual} genAutoWx={genAutoWx}
              COND_LIST={COND_LIST}
            />

            {/* Header */}
            <HeaderEditor
              subjectId={subjectId} changeSubject={changeSubject}
              hTitle={hTitle} setHTitle={setHTitle}
              hSub={hSub} setHSub={setHSub}
              hBullets={hBullets} setHBullets={setHBullets}
              cycleTemplate={cycleTemplate}
            />

            <Btn onClick={() => setStep(2)} full disabled={!!dateError}>
              Next: Instructors
            </Btn>
          </>
        )}

        {/* ═══════════════ STEP 2 ═══════════════ */}
        {step === 2 && (
          <>
            <Card>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <SLabel text="Instructors" />
                <button
                  onClick={() => setAddOpen((prev) => !prev)}
                  aria-expanded={addOpen}
                  aria-label={addOpen ? "Cancel adding instructor" : "Add new instructor"}
                  style={{
                    background: addOpen ? NAVY : BLUE,
                    color: "#fff", border: "none", padding: "7px 14px",
                    borderRadius: 8, fontSize: 12, fontWeight: "bold", cursor: "pointer",
                  }}
                >
                  {addOpen ? "Cancel" : "+ Add"}
                </button>
              </div>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: "#9aa8b5" }}>
                Check to include. Edit any field — preview updates live.
              </p>

              <AddInstructorModal
                addOpen={addOpen}
                newName={newName} setNewName={setNewName}
                newRole={newRole} setNewRole={setNewRole}
                newAvail={newAvail} setNewAvail={setNewAvail}
                newAges={newAges} setNewAges={setNewAges}
                newBadge={newBadge} setNewBadge={setNewBadge}
                nameError={nameError} setNameError={setNameError}
                addInst={addInst}
              />

              {instOrder.map((id) => {
                const st = insts[id];
                if (!st) return null;
                return (
                  <InstructorCard
                    key={id}
                    id={id}
                    st={st}
                    togInst={togInst}
                    updInst={updInst}
                    removeInst={removeInst}
                  />
                );
              })}
            </Card>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => setStep(1)} color="#8899aa">Back</Btn>
              <button
                onClick={() => setStep(3)}
                style={{
                  flex: 1, background: NAVY, color: "#fff", border: "none",
                  padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: "bold", cursor: "pointer",
                }}
              >
                Next: Add-Ons
              </button>
            </div>
          </>
        )}

        {/* ═══════════════ STEP 3 ═══════════════ */}
        {step === 3 && (
          <>
            <Card>
              <SLabel text="Email Sections" />
              <p style={{ fontSize: 11, color: "#9aa8b5", margin: "0 0 14px" }}>
                Toggle each section on or off. Sections with settings expand when turned on.
              </p>

              {/* Section rows */}
              {[
                { key: "banner",      label: "Non-Members Welcome Banner", on: showBanner,      set: setShowBanner },
                { key: "poolLoc",     label: "Pool Location Info",         on: showPoolLoc,     set: setShowPoolLoc },
                { key: "poolCond",    label: "Outdoor Pool Conditions",    on: poolCondOn,      set: setPoolCondOn },
                { key: "weather",     label: "Weather Forecast",           on: showWeather,     set: setShowWeather },
                { key: "instructors", label: "Meet Your Instructors",      on: showInstructors, set: setShowInstructors },
                { key: "spotlights",  label: "Instructor Spotlights",      on: Object.values(spotlights).some(s => s.on), custom: true },
                { key: "rates",       label: "Lesson Rates",               on: showRates,       set: setShowRates },
                { key: "triathlon",   label: "Triathlon Training",         on: triOn,           set: setTriOn },
                { key: "cyclones",    label: "Cooper Cyclones",            on: teamOn,          set: setTeamOn },
                { key: "footerCta",   label: "Footer Call-to-Action",      on: showFooterCta,   set: setShowFooterCta },
              ].map(({ key, label, on, set, custom }) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f0f3f6" }}>
                  <span style={{ fontSize: 13, color: NAVY, fontWeight: "500" }}>{label}</span>
                  {custom ? (
                    <span style={{ fontSize: 10, color: BLUE }}>Configured below ↓</span>
                  ) : (
                    <button
                      onClick={() => set(v => !v)}
                      style={{
                        width: 42, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                        background: on ? BLUE : "#d0d8e0", position: "relative", transition: "background 0.2s", flexShrink: 0,
                      }}
                      aria-label={`Toggle ${label}`}
                    >
                      <span style={{
                        position: "absolute", top: 3, left: on ? 21 : 3,
                        width: 18, height: 18, borderRadius: "50%", background: "#fff",
                        transition: "left 0.2s", display: "block",
                      }} />
                    </button>
                  )}
                </div>
              ))}
            </Card>

            {/* ── Header & Logo ── */}
            <Card>
              <SLabel text="Header & Logo" />
              <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Nav Bar Title</label>
              <input
                value={navTitle}
                onChange={(e) => setNavTitle(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 13, fontWeight: "bold", color: NAVY, boxSizing: "border-box" }}
              />
            </Card>

            {/* ── Headline & Subtitle ── */}
            <Card>
              <SLabel text="Headline & Subtitle" />
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Headline</label>
                <input
                  value={hTitle}
                  onChange={(e) => setHTitle(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 14, fontWeight: "bold", color: NAVY, boxSizing: "border-box" }}
                />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Subtitle</label>
                <textarea
                  value={hSub}
                  onChange={(e) => setHSub(e.target.value)}
                  rows={2}
                  style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
                />
              </div>
              <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 6 }}>Bullet Points</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {hBullets.map((b, i) => (
                  <input
                    key={i}
                    value={b}
                    onChange={(e) => { const next = [...hBullets]; next[i] = e.target.value; setHBullets(next); }}
                    placeholder={"Benefit " + (i + 1)}
                    style={{ width: "100%", padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }}
                  />
                ))}
              </div>
            </Card>

            {/* ── Pool Conditions config ── */}
            {poolCondOn && (
              <Card>
                <SLabel text="Outdoor Pool Conditions" />
                <div style={{ padding: 12, background: "#f0f8ff", border: "1px solid #b8d8f0", borderLeft: "4px solid #1e88c7", borderRadius: 8, fontSize: 12, lineHeight: 1.8, color: "#2a3d4d" }}>
                  <div>🌡️ <strong>Outdoor pools are heated to 80°F</strong></div>
                  <div>👶 <strong>Recommended air temp for ages 6 &amp; under:</strong> 70°F or warmer</div>
                  <div>📲 <strong>Weather cancellations:</strong> You will be contacted directly if a session is cancelled</div>
                </div>
              </Card>
            )}

            {/* ── Instructor Spotlights config ── */}
            {instOrder.map((id) => {
              const inst = insts[id];
              if (!inst) return null;
              const spot = spotlights[id] || { on: false, bio: "", fun: "" };
              return (
                <Card key={id}>
                  <ToggleRow
                    on={spot.on}
                    onToggle={() => toggleSpotlight(id)}
                    label={`${inst.name} Spotlight`}
                    sub={inst.role}
                  />
                  {spot.on && (
                    <>
                      <div style={{ marginTop: 10, marginBottom: 8 }}>
                        <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Bio / Description</label>
                        <textarea
                          value={spot.bio}
                          onChange={(e) => updateSpotlight(id, "bio", e.target.value)}
                          rows={3}
                          placeholder={`Background, specialty, teaching style...`}
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
                        />
                      </div>
                      <div style={{ marginBottom: 10 }}>
                        <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Fun Fact (optional)</label>
                        <input
                          value={spot.fun}
                          onChange={(e) => updateSpotlight(id, "fun", e.target.value)}
                          placeholder="e.g. Competed in 3 triathlons, former varsity swimmer..."
                          style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box" }}
                        />
                      </div>
                      <div style={{ padding: 10, background: "#f5f7f9", border: "1px solid #e8ecf0", borderRadius: 8, display: "flex", gap: 10, alignItems: "flex-start" }}>
                        {inst.photo ? (
                          <img src={`${import.meta.env.BASE_URL}photos/${inst.photo}`} alt={inst.name}
                            style={{ width: 46, height: 46, borderRadius: "50%", objectFit: "cover", border: `2px solid ${BLUE}`, flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 46, height: 46, borderRadius: "50%", background: inst.col, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", color: inst.dark ? NAVY : "#fff", border: `2px solid ${BLUE}`, flexShrink: 0 }}>
                            {inst.ini}
                          </div>
                        )}
                        <div>
                          <div style={{ fontWeight: "bold", color: NAVY, fontSize: 12 }}>{inst.name}</div>
                          <div style={{ fontSize: 10, color: BLUE, marginBottom: 3 }}>{inst.role}</div>
                          {spot.bio && <div style={{ fontSize: 11, color: "#5a6a78", lineHeight: 1.4 }}>{spot.bio}</div>}
                          {spot.fun && <div style={{ fontSize: 10, color: GOLD, fontWeight: "bold", marginTop: 3 }}>⭐ {spot.fun}</div>}
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              );
            })}

            {/* ── Triathlon config ── */}
            {triOn && (
              <Card>
                <SLabel text="Triathlon Training" />
                <div style={{ marginBottom: 10 }}>
                  <label htmlFor="tri-date" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Event / Session Date</label>
                  <input id="tri-date" type="date" value={triDate} onChange={(e) => setTriDate(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                  {triDate && <div style={{ marginTop: 4, fontSize: 12, color: BLUE, fontWeight: "bold" }}>📅 {fmtDate(triDate)}</div>}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                  <div style={{ flex: "1 1 120px" }}>
                    <label htmlFor="tri-title" style={{ display: "block", fontSize: 10, color: "#5a6a78", marginBottom: 3 }}>Title</label>
                    <input id="tri-title" value={triTitle} onChange={(e) => setTriTitle(e.target.value)} placeholder="Triathlon Swim Training"
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: "1 1 120px" }}>
                    <label htmlFor="tri-price" style={{ display: "block", fontSize: 10, color: "#5a6a78", marginBottom: 3 }}>Price / Rate</label>
                    <input id="tri-price" value={triPrice} onChange={(e) => setTriPrice(e.target.value)} placeholder="$120/hour"
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }} />
                  </div>
                </div>
                <div>
                  <label htmlFor="tri-desc" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Description</label>
                  <textarea id="tri-desc" value={triDesc} onChange={(e) => setTriDesc(e.target.value)} rows={3}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} />
                </div>
              </Card>
            )}

            {/* ── Cyclones config ── */}
            {teamOn && (
              <Card>
                <SLabel text="Cooper Cyclones Swim Team" />
                <div style={{ marginBottom: 8 }}>
                  <label htmlFor="team-title" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Title</label>
                  <input id="team-title" value={teamTitle} onChange={(e) => setTeamTitle(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label htmlFor="team-desc" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Description</label>
                  <textarea id="team-desc" value={teamDesc} onChange={(e) => setTeamDesc(e.target.value)} rows={2}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} />
                </div>
                <div>
                  <label htmlFor="team-extra" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Additional Details (optional)</label>
                  <textarea id="team-extra" value={teamExtra} onChange={(e) => setTeamExtra(e.target.value)} rows={2}
                    placeholder="e.g. Practice Mon/Wed/Fri 5-7pm, USA Swimming sanctioned meets"
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }} />
                </div>
              </Card>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={() => setStep(2)} color="#8899aa">Back</Btn>
              <button
                onClick={() => { buildAndSet(); setStep(4); }}
                style={{ flex: 1, background: NAVY, color: "#fff", border: "none", padding: "10px 18px", borderRadius: 8, fontSize: 13, fontWeight: "bold", cursor: "pointer" }}
              >
                Generate Preview
              </button>
            </div>
          </>
        )}

        {/* ═══════════════ STEP 4 ═══════════════ */}
        {step === 4 && (
          <PreviewPanel
            getOpts={getOpts}
            buildAndSet={buildAndSet}
            copyHtml={copyHtml}
            pvMode={pvMode}
            setPvMode={setPvMode}
            copied={copied}
            poolType={poolType}
            startD={startD}
            dc={dc}
            forecast={forecast}
            triOn={triOn}
            teamOn={teamOn}
            insts={insts}
            instOrder={instOrder}
            onBack={() => setStep(3)}
          />
        )}

      </div>
    </div>
  );
}
