import { useState, useRef } from "react";
import { NAVY, BLUE, GOLD, GRN, COLORS } from "./config.js";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import SocialGenerator from "./components/SocialGenerator.jsx";
import { fmtDate } from "./utils/date.js";
import { buildEmailHtml, SECTION_KEYS, initials } from "./utils/email.js";
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
  // ─── App mode ────────────────────────────────────────────────────────────────
  const [appMode, setAppMode] = useState("email");

  // ─── UI-only state (not persisted) ───────────────────────────────────────────
  const [step, setStep]           = useState(1);
  const [pvMode, setPvMode]       = useState("mobile");
  const [copied, setCopied]       = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(""); // blob URL, not persisted

  // ─── Persisted app state ─────────────────────────────────────────────────────
  const [poolType, setPoolType]   = useLocalStorage("cfc_poolType", "hotel");
  const [startD, setStartD]       = useLocalStorage("cfc_startD", "");
  const [endD, setEndD]           = useLocalStorage("cfc_endD", "");

  const [triOn, setTriOn]         = useLocalStorage("cfc_triOn", false);
  const [triDate, setTriDate]     = useLocalStorage("cfc_triDate", "");
  const [triTitle, setTriTitle]   = useLocalStorage("cfc_triTitle", "Triathlon Swim Training");
  const [triDesc, setTriDesc]     = useLocalStorage("cfc_triDesc",
    "Train your swim leg with Coach Bobby - personalized sessions for sprint, Olympic, and 70.3 distances."
  );
  const [triPrice, setTriPrice]   = useLocalStorage("cfc_triPrice", "$120/hour");
  const [teamOn, setTeamOn]       = useLocalStorage("cfc_teamOn", false);
  const [poolCondOn, setPoolCondOn] = useLocalStorage("cfc_poolCondOn", false);

  const [navTitle, setNavTitle]   = useLocalStorage("cfc_navTitle", "Swim Lessons at Cooper Fitness Center");

  const [showBanner,      setShowBanner]      = useLocalStorage("cfc_showBanner", true);
  const [showPoolLoc,     setShowPoolLoc]      = useLocalStorage("cfc_showPoolLoc", true);
  const [showWeather,     setShowWeather]      = useLocalStorage("cfc_showWeather", true);
  const [showInstructors, setShowInstructors]  = useLocalStorage("cfc_showInstructors", true);
  const [showRates,       setShowRates]        = useLocalStorage("cfc_showRates", true);
  const [showFooterCta,   setShowFooterCta]    = useLocalStorage("cfc_showFooterCta", true);
  const [spotlights, setSpotlights]            = useLocalStorage("cfc_spotlights", {});
  const [customSpots, setCustomSpots]          = useLocalStorage("cfc_customSpots", []);

  const [teamTitle, setTeamTitle] = useLocalStorage("cfc_teamTitle", "Join the Cooper Cyclones!");
  const [teamDesc, setTeamDesc]   = useLocalStorage("cfc_teamDesc",
    "Year-round competitive swim team for youth athletes of all levels. USA Swimming sanctioned meets, structured training, and an incredible team culture."
  );
  const [teamExtra, setTeamExtra] = useLocalStorage("cfc_teamExtra", "");

  // ─── Video section ───────────────────────────────────────────────────────────
  const [videoOn, setVideoOn]         = useLocalStorage("cfc_videoOn", false);
  const [videoUrl, setVideoUrl]       = useLocalStorage("cfc_videoUrl", "");
  const [videoPoster, setVideoPoster] = useLocalStorage("cfc_videoPoster", "");
  const [videoCaption, setVideoCaption] = useLocalStorage("cfc_videoCaption", "");

  // ─── Section order (drag-and-drop) ───────────────────────────────────────────
  const [savedOrder, setSavedOrder] = useLocalStorage("cfc_sectionOrder", SECTION_KEYS);
  // Ensure any newly-added keys are appended to existing saved order
  const sectionOrder = [
    ...savedOrder.filter(k => SECTION_KEYS.includes(k)),
    ...SECTION_KEYS.filter(k => !savedOrder.includes(k)),
  ];
  const dragSrcRef = useRef(null);

  function onDragStart(e, idx) {
    dragSrcRef.current = idx;
    e.dataTransfer.effectAllowed = "move";
  }
  function onDragOver(e, idx) {
    e.preventDefault();
    if (dragSrcRef.current === null || dragSrcRef.current === idx) return;
    const src = dragSrcRef.current;
    setSavedOrder(prev => {
      const ord = [
        ...prev.filter(k => SECTION_KEYS.includes(k)),
        ...SECTION_KEYS.filter(k => !prev.includes(k)),
      ];
      const [removed] = ord.splice(src, 1);
      ord.splice(idx, 0, removed);
      dragSrcRef.current = idx;
      return ord;
    });
  }
  function onDragEnd() { dragSrcRef.current = null; }

  // ─── Instructor / spotlight drag-and-drop ─────────────────────────────────────
  const instDragRef = useRef(null);
  function onInstDragStart(idx) { instDragRef.current = idx; }
  function onInstDragOver(e, idx) {
    e.preventDefault();
    if (instDragRef.current === null || instDragRef.current === idx) return;
    const src = instDragRef.current;
    setInstOrder(prev => {
      const ord = [...prev];
      const [removed] = ord.splice(src, 1);
      ord.splice(idx, 0, removed);
      instDragRef.current = idx;
      return ord;
    });
  }
  function onInstDragEnd() { instDragRef.current = null; }

  // ─── Reset all settings ───────────────────────────────────────────────────────
  function resetAll() {
    if (!confirm("Reset all email settings to defaults?")) return;
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("cfc_")) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
    window.location.reload();
  }

  // ─── Custom hooks ─────────────────────────────────────────────────────────────
  const instructors = useInstructors();
  const weather     = useWeather(startD, endD);
  const header      = useHeaderForm();

  const { instOrder, setInstOrder, insts, addOpen, setAddOpen, newName, setNewName, newRole, setNewRole,
          newAvail, setNewAvail, newAges, setNewAges, newBadge, setNewBadge,
          nameError, setNameError, togInst, updInst, addInst, removeInst } = instructors;

  const { forecast, wxMode, setWxMode, manRows, wxErr, setWxErr, wxLoading, dc,
          fetchLiveWx, setupRows, updateRow, applyManual, genAutoWx, COND_LIST } = weather;

  const { subjectId, changeSubject, hTitle, setHTitle, hSub, setHSub, hBullets, setHBullets, cycleTemplate } = header;

  // ─── Spotlight helpers ────────────────────────────────────────────────────────
  function toggleSpotlight(id) {
    setSpotlights((prev) => ({ ...prev, [id]: { ...defaultSpot(prev[id]), on: !prev[id]?.on } }));
  }
  function updateSpotlight(id, key, val) {
    setSpotlights((prev) => ({ ...prev, [id]: { ...defaultSpot(prev[id]), [key]: val } }));
  }
  function defaultSpot(existing) {
    return { on: false, bio: "", fun: "", ...existing };
  }

  // ─── Custom spotlight helpers ─────────────────────────────────────────────────
  function addCustomSpot() {
    const col = COLORS[customSpots.length % COLORS.length];
    setCustomSpots(prev => [...prev, { id: "sp_" + Date.now(), name: "", role: "", bio: "", fun: "", col }]);
  }
  function updateCustomSpot(id, key, val) {
    setCustomSpots(prev => prev.map(s => s.id === id ? { ...s, [key]: val } : s));
  }
  function removeCustomSpot(id) {
    setCustomSpots(prev => prev.filter(s => s.id !== id));
  }

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
      poolCondOn, spotlights, customSpots,
      showBanner, showPoolLoc, showWeather, showInstructors, showRates, showFooterCta,
      videoOn, videoUrl, videoPoster, videoCaption,
      sectionOrder,
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

  // ─── Section definitions for Step 3 ──────────────────────────────────────────
  const sectionDefs = {
    banner:      { label: "Non-Members Welcome Banner", on: showBanner,      set: setShowBanner },
    poolLoc:     { label: "Pool Location Info",         on: showPoolLoc,     set: setShowPoolLoc },
    poolCond:    { label: "Outdoor Pool Conditions",    on: poolCondOn,      set: setPoolCondOn },
    weather:     { label: "Weather Forecast",           on: showWeather,     set: setShowWeather },
    instructors: { label: "Meet Your Instructors",      on: showInstructors, set: setShowInstructors },
    spotlights:  { label: "Instructor Spotlights",      on: Object.values(spotlights).some(s => s.on) || customSpots.some(s => s.name), custom: true },
    rates:       { label: "Lesson Rates",               on: showRates,       set: setShowRates },
    video:       { label: "Video",                      on: videoOn,         set: setVideoOn },
    triathlon:   { label: "Triathlon Training",         on: triOn,           set: setTriOn },
    cyclones:    { label: "Cooper Cyclones",            on: teamOn,          set: setTeamOn },
    footerCta:   { label: "Footer Call-to-Action",      on: showFooterCta,   set: setShowFooterCta },
  };

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
        <div style={{ color: "#fff", fontSize: 15, fontWeight: "bold", fontFamily: "Georgia,serif", flex: 1 }}>
          Cooper Swim Tools
        </div>
        {/* Mode toggle + Reset */}
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {[["email", "✉ Email"], ["social", "📸 Social"]].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setAppMode(mode)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `2px solid ${appMode === mode ? GOLD : "rgba(255,255,255,0.25)"}`,
                background: appMode === mode ? GOLD : "transparent",
                color: appMode === mode ? NAVY : "rgba(255,255,255,0.85)",
                fontWeight: "bold",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {label}
            </button>
          ))}
          <button
            onClick={resetAll}
            style={{
              padding: "6px 12px",
              borderRadius: 20,
              border: "2px solid rgba(255,100,100,0.4)",
              background: "transparent",
              color: "rgba(255,180,180,0.9)",
              fontWeight: "bold",
              fontSize: 11,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Social generator mode */}
      {appMode === "social" && <SocialGenerator />}

      {/* Email generator mode */}
      {appMode !== "social" && <>

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
                Check to include. Edit any field — preview updates live. Drag ⠿ to reorder.
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

              {instOrder.map((id, idx) => {
                const st = insts[id];
                if (!st) return null;
                return (
                  <div
                    key={id}
                    onDragOver={(e) => onInstDragOver(e, idx)}
                    style={{ display: "flex", alignItems: "flex-start", gap: 4 }}
                  >
                    <span
                      draggable
                      onDragStart={() => onInstDragStart(idx)}
                      onDragEnd={onInstDragEnd}
                      style={{ color: "#c0c8d0", fontSize: 18, paddingTop: 13, cursor: "grab", userSelect: "none", flexShrink: 0, lineHeight: 1 }}
                    >⠿</span>
                    <div style={{ flex: 1 }}>
                      <InstructorCard
                        id={id}
                        st={st}
                        togInst={togInst}
                        updInst={updInst}
                        removeInst={removeInst}
                      />
                    </div>
                  </div>
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
            {/* Email Sections — draggable to reorder */}
            <Card>
              <SLabel text="Email Sections" />
              <p style={{ fontSize: 11, color: "#9aa8b5", margin: "0 0 14px" }}>
                Toggle sections on or off. Drag ⠿ to reorder them in the email.
              </p>

              {sectionOrder.map((key, idx) => {
                const def = sectionDefs[key];
                if (!def) return null;
                const { label, on, set, custom } = def;
                return (
                  <div
                    key={key}
                    draggable
                    onDragStart={(e) => onDragStart(e, idx)}
                    onDragOver={(e) => onDragOver(e, idx)}
                    onDragEnd={onDragEnd}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "7px 0",
                      borderBottom: "1px solid #f0f3f6",
                      cursor: "grab",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                      <span style={{ color: "#c0c8d0", fontSize: 16, userSelect: "none", lineHeight: 1, cursor: "grab" }}>⠿</span>
                      <span style={{ fontSize: 13, color: NAVY, fontWeight: "500" }}>{label}</span>
                    </div>
                    {custom ? (
                      <span style={{ fontSize: 10, color: BLUE }}>Configured below ↓</span>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); set(v => !v); }}
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
                );
              })}
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
            {instOrder.map((id, idx) => {
              const inst = insts[id];
              if (!inst) return null;
              const spot = spotlights[id] || { on: false, bio: "", fun: "" };
              return (
                <div
                  key={id}
                  onDragOver={(e) => onInstDragOver(e, idx)}
                  style={{ display: "flex", alignItems: "flex-start", gap: 4 }}
                >
                  <span
                    draggable
                    onDragStart={() => onInstDragStart(idx)}
                    onDragEnd={onInstDragEnd}
                    style={{ color: "#c0c8d0", fontSize: 18, paddingTop: 14, cursor: "grab", userSelect: "none", flexShrink: 0, lineHeight: 1 }}
                  >⠿</span>
                <Card style={{ flex: 1 }}>
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
                </div>
              );
            })}

            {/* ── Add Custom Spotlight ── */}
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "-4px 0 8px" }}>
              <button
                onClick={addCustomSpot}
                style={{
                  background: BLUE, color: "#fff", border: "none",
                  padding: "7px 14px", borderRadius: 8, fontSize: 12,
                  fontWeight: "bold", cursor: "pointer",
                }}
              >
                + Add Spotlight
              </button>
            </div>

            {customSpots.map((spot) => (
              <Card key={spot.id}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: "50%", background: spot.col,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: "bold", color: "#fff", flexShrink: 0,
                    }}>
                      {initials(spot.name) || "?"}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: "bold", color: NAVY }}>
                      {spot.name || "New Spotlight"}
                    </span>
                  </div>
                  <button
                    onClick={() => removeCustomSpot(spot.id)}
                    aria-label="Remove spotlight"
                    style={{ background: "none", border: "none", color: "#c00", cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px" }}
                  >×</button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Name</label>
                    <input
                      value={spot.name}
                      onChange={(e) => updateCustomSpot(spot.id, "name", e.target.value)}
                      placeholder="Full Name"
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Role / Title</label>
                    <input
                      value={spot.role}
                      onChange={(e) => updateCustomSpot(spot.id, "role", e.target.value)}
                      placeholder="e.g. Swim Instructor"
                      style={{ width: "100%", padding: "6px 8px", border: "1px solid #e8ecf0", borderRadius: 6, fontSize: 12, boxSizing: "border-box" }}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Bio / Description</label>
                  <textarea
                    value={spot.bio}
                    onChange={(e) => updateCustomSpot(spot.id, "bio", e.target.value)}
                    rows={3}
                    placeholder="Background, specialty, teaching style..."
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Fun Fact (optional)</label>
                  <input
                    value={spot.fun}
                    onChange={(e) => updateCustomSpot(spot.id, "fun", e.target.value)}
                    placeholder="e.g. Former varsity swimmer, completed 5 triathlons..."
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
              </Card>
            ))}

            {/* ── Video config ── */}
            {videoOn && (
              <Card>
                <SLabel text="Video" />
                <div style={{ marginBottom: 10 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Import Video File (local preview)</label>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setVideoPreviewUrl(URL.createObjectURL(file));
                    }}
                    style={{ fontSize: 12, width: "100%", boxSizing: "border-box" }}
                  />
                  {videoPreviewUrl && (
                    <video
                      src={videoPreviewUrl}
                      controls
                      style={{ width: "100%", maxWidth: 420, borderRadius: 8, marginTop: 8, display: "block" }}
                    />
                  )}
                  <p style={{ fontSize: 10, color: "#9aa8b5", margin: "4px 0 0" }}>
                    To embed in the actual email, upload your video to a host (e.g. Google Drive, Dropbox, S3) and paste the MP4 URL below.
                  </p>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Hosted Video URL (MP4 — for email)</label>
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/video.mp4"
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Thumbnail / Poster URL (optional)</label>
                  <input
                    value={videoPoster}
                    onChange={(e) => setVideoPoster(e.target.value)}
                    placeholder="https://example.com/thumbnail.jpg"
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Caption (optional)</label>
                  <input
                    value={videoCaption}
                    onChange={(e) => setVideoCaption(e.target.value)}
                    placeholder="e.g. Watch Coach Bobby demonstrate freestyle technique"
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box" }}
                  />
                </div>
              </Card>
            )}

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

      </>} {/* end email mode */}
    </div>
  );
}
