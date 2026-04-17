import { useState, useRef, useCallback } from "react";
import html2canvas from "html2canvas";
import { NAVY, BLUE, GOLD } from "../config.js";

// ─── Format definitions ───────────────────────────────────────────────────────
const FORMATS = [
  { id: "ig_post",      label: "Instagram Post",   w: 1080, h: 1080, icon: "📷" },
  { id: "ig_story",     label: "Instagram Story",  w: 1080, h: 1920, icon: "📱" },
  { id: "ig_reel",      label: "Instagram Reel",   w: 1080, h: 1920, icon: "🎬" },
  { id: "fb_post",      label: "Facebook Post",    w: 1200, h: 630,  icon: "📘" },
  { id: "fb_story",     label: "Facebook Story",   w: 1080, h: 1920, icon: "📱" },
  { id: "fb_reel",      label: "Facebook Reel",    w: 1080, h: 1920, icon: "🎬" },
];

// ─── Photo assets ─────────────────────────────────────────────────────────────
const INSTRUCTOR_PHOTOS = [
  { id: "bobby",    label: "Coach Bobby",    file: "bobby.jpg" },
  { id: "riley_n",  label: "Riley N.",       file: "riley_n.jpg" },
  { id: "riley_d",  label: "Riley D.",       file: "riley_d.jpg" },
  { id: "madeline", label: "Madeline",       file: "madeline.jpg" },
  { id: "peyton",   label: "Peyton",         file: "peyton.jpg" },
  { id: "ayden",    label: "Ayden",          file: "ayden.jpg" },
  { id: "caden",    label: "Caden",          file: "caden.jpg" },
];

// ─── Curated templates by category ───────────────────────────────────────────
const TEMPLATES = {
  promo: [
    { headline: "🏊 Swim Lessons Now Enrolling!", body: "All ages · All skill levels\nRegister today and make a splash!", cta: "Book Your Lesson" },
    { headline: "Make This Summer Count", body: "Private & semi-private swim lessons\nat Cooper Fitness Center", cta: "Spots Are Limited" },
    { headline: "Learn to Swim with Confidence", body: "Expert instructors · Personalized coaching\nHotel pool & fitness center pool available", cta: "Enroll Now" },
    { headline: "🌊 Swim. Grow. Thrive.", body: "Beginner to advanced lessons for\nchildren and adults", cta: "Start Today" },
    { headline: "Your Best Stroke Is Ahead", body: "One-on-one coaching designed\naround YOUR goals", cta: "Get Started" },
    { headline: "Never Too Late to Learn", body: "Adult swim lessons available\nPrivate sessions with certified instructors", cta: "Schedule a Lesson" },
  ],
  spotlight: [
    { headline: "Meet Your Coach", body: "Passionate about swimming\nand helping students reach their goals", cta: "Book a Session" },
    { headline: "Expert Instruction. Real Results.", body: "Certified. Experienced. Dedicated\nto your swimmer's success.", cta: "Learn More" },
    { headline: "In Good Hands", body: "Our instructors bring skill,\npatiece, and passion to every lesson.", cta: "Meet the Team" },
    { headline: "Your Coach is Ready", body: "Flexible scheduling · All experience levels\nLet's get in the water!", cta: "Book Now" },
  ],
  cyclones: [
    { headline: "Join the Cooper Cyclones! 🌀", body: "Competitive swim team for youth athletes\nUSA Swimming sanctioned · All levels welcome", cta: "Try Out Today" },
    { headline: "Swim. Compete. Win.", body: "The Cyclones are building champions\non and off the block.", cta: "Join the Team" },
    { headline: "More Than a Team. A Family.", body: "Cooper Cyclones · Year-round training\nSpring & summer seasons available", cta: "Learn More" },
  ],
  triathlon: [
    { headline: "Train Smarter. Race Faster.", body: "Triathlon swim coaching with Coach Bobby\nSprint · Olympic · 70.3 distances", cta: "Book a Session" },
    { headline: "Conquer the Swim Leg", body: "Personalized open-water technique\nand race-pace training", cta: "Get Coached" },
    { headline: "Your Tri Goals Start Here", body: "Expert swim training for triathletes\nof all experience levels", cta: "Start Training" },
  ],
};

const CATEGORIES = [
  { id: "promo",     label: "Swim Promo" },
  { id: "spotlight", label: "Instructor Spotlight" },
  { id: "cyclones",  label: "Cyclones" },
  { id: "triathlon", label: "Triathlon" },
];

// ─── Template designs ─────────────────────────────────────────────────────────
// design: "promo" | "spotlight" | "overlay"
const DESIGNS = [
  { id: "promo",     label: "Promo Card" },
  { id: "spotlight", label: "Spotlight" },
  { id: "overlay",   label: "Photo Overlay" },
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────
function PostCanvas({ format, design, template, photoSrc, customPhoto, logoSrc, style }) {
  const { w, h } = format;
  const photo = customPhoto || photoSrc;
  const isPortrait = h > w;

  const containerStyle = {
    position: "relative",
    width: w,
    height: h,
    overflow: "hidden",
    fontFamily: "Arial, sans-serif",
    ...style,
  };

  if (design === "overlay" && photo) {
    return (
      <div style={containerStyle}>
        {/* Background photo */}
        <img
          src={photo}
          alt=""
          crossOrigin="anonymous"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(11,37,69,0.35) 0%, rgba(11,37,69,0.85) 60%, rgba(11,37,69,0.97) 100%)",
          }}
        />
        {/* Logo top-left */}
        <div style={{ position: "absolute", top: isPortrait ? 60 : 32, left: 48, display: "flex", alignItems: "center", gap: 14 }}>
          <img src={logoSrc} alt="CFC" crossOrigin="anonymous"
            style={{ width: isPortrait ? 80 : 56, height: isPortrait ? 80 : 56, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.4)" }} />
          <div style={{ color: "#fff", fontSize: isPortrait ? 28 : 20, fontWeight: "bold", opacity: 0.9 }}>Cooper Fitness Center</div>
        </div>
        {/* Text bottom */}
        <div style={{ position: "absolute", bottom: isPortrait ? 100 : 48, left: 48, right: 48 }}>
          <div style={{ color: GOLD, fontSize: isPortrait ? 52 : 40, fontWeight: "bold", lineHeight: 1.1, marginBottom: 24, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
            {template.headline}
          </div>
          <div style={{ color: "rgba(255,255,255,0.9)", fontSize: isPortrait ? 30 : 22, lineHeight: 1.5, marginBottom: 32, whiteSpace: "pre-line" }}>
            {template.body}
          </div>
          <div style={{
            display: "inline-block",
            background: BLUE,
            color: "#fff",
            fontSize: isPortrait ? 26 : 20,
            fontWeight: "bold",
            padding: isPortrait ? "18px 44px" : "12px 32px",
            borderRadius: 50,
          }}>
            {template.cta}
          </div>
        </div>
      </div>
    );
  }

  if (design === "spotlight" && photo) {
    return (
      <div style={{ ...containerStyle, background: NAVY, display: "flex", flexDirection: "column" }}>
        {/* Header bar */}
        <div style={{ background: BLUE, padding: isPortrait ? "28px 48px" : "18px 36px", display: "flex", alignItems: "center", gap: 18 }}>
          <img src={logoSrc} alt="CFC" crossOrigin="anonymous"
            style={{ width: isPortrait ? 68 : 48, height: isPortrait ? 68 : 48, borderRadius: "50%", objectFit: "cover", border: "3px solid rgba(255,255,255,0.5)" }} />
          <div style={{ color: "#fff", fontSize: isPortrait ? 30 : 22, fontWeight: "bold" }}>Cooper Swim</div>
        </div>
        {/* Photo */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <img
            src={photo}
            alt=""
            crossOrigin="anonymous"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
          />
          {/* Bottom gradient */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: isPortrait ? "45%" : "55%",
            background: "linear-gradient(to bottom, transparent, rgba(11,37,69,0.95))" }} />
          {/* Text over gradient */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: isPortrait ? "40px 48px" : "24px 36px" }}>
            <div style={{ color: GOLD, fontSize: isPortrait ? 48 : 34, fontWeight: "bold", lineHeight: 1.1, marginBottom: 14 }}>
              {template.headline}
            </div>
            <div style={{ color: "rgba(255,255,255,0.85)", fontSize: isPortrait ? 26 : 18, lineHeight: 1.5, marginBottom: 24, whiteSpace: "pre-line" }}>
              {template.body}
            </div>
            <div style={{
              display: "inline-block",
              background: GOLD,
              color: NAVY,
              fontSize: isPortrait ? 24 : 17,
              fontWeight: "bold",
              padding: isPortrait ? "16px 40px" : "10px 28px",
              borderRadius: 50,
            }}>
              {template.cta}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // "promo" design (default, no photo required)
  return (
    <div style={{
      ...containerStyle,
      background: NAVY,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: isPortrait ? 80 : 60,
    }}>
      {/* Logo */}
      <img src={logoSrc} alt="CFC" crossOrigin="anonymous"
        style={{
          width: isPortrait ? 130 : 90,
          height: isPortrait ? 130 : 90,
          borderRadius: "50%",
          objectFit: "cover",
          border: `5px solid ${GOLD}`,
          marginBottom: isPortrait ? 48 : 32,
        }}
      />
      {/* Background water wave accent */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: isPortrait ? "28%" : "32%",
        background: `linear-gradient(to top, ${BLUE}55, transparent)`,
        borderTop: `3px solid ${BLUE}44`,
      }} />
      {/* Text */}
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{ color: GOLD, fontSize: isPortrait ? 62 : 46, fontWeight: "bold", lineHeight: 1.1, marginBottom: 28 }}>
          {template.headline}
        </div>
        <div style={{ color: "rgba(255,255,255,0.85)", fontSize: isPortrait ? 32 : 22, lineHeight: 1.6, marginBottom: 40, whiteSpace: "pre-line" }}>
          {template.body}
        </div>
        <div style={{
          display: "inline-block",
          background: BLUE,
          color: "#fff",
          fontSize: isPortrait ? 28 : 21,
          fontWeight: "bold",
          padding: isPortrait ? "22px 56px" : "15px 40px",
          borderRadius: 50,
          letterSpacing: 0.5,
        }}>
          {template.cta}
        </div>
        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: isPortrait ? 20 : 14, marginTop: 36 }}>
          CooperFitnessCenter.com
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function SocialGenerator() {
  const [formatId, setFormatId] = useState("ig_post");
  const [designId, setDesignId] = useState("promo");
  const [categoryId, setCategoryId] = useState("promo");
  const [templateIdx, setTemplateIdx] = useState(0);
  const [photoId, setPhotoId] = useState("bobby");
  const [customPhotoSrc, setCustomPhotoSrc] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Editable text
  const [headline, setHeadline] = useState(TEMPLATES.promo[0].headline);
  const [body, setBody]         = useState(TEMPLATES.promo[0].body);
  const [cta, setCta]           = useState(TEMPLATES.promo[0].cta);

  const canvasRef  = useRef(null);
  const fileInputRef = useRef(null);

  const format     = FORMATS.find((f) => f.id === formatId);
  const BASE       = import.meta.env.BASE_URL;
  const logoSrc    = `${BASE}photos/cfclogo.jpg`;
  const photoSrc   = `${BASE}photos/${INSTRUCTOR_PHOTOS.find((p) => p.id === photoId)?.file}`;

  // Scale factor to fit preview area (max 360px wide)
  const MAX_PREVIEW = 340;
  const scale = Math.min(MAX_PREVIEW / format.w, MAX_PREVIEW / (format.h / 2));

  function applyTemplate(catId, idx) {
    const t = TEMPLATES[catId][idx];
    setHeadline(t.headline);
    setBody(t.body);
    setCta(t.cta);
  }

  function handleCategoryChange(catId) {
    setCategoryId(catId);
    setTemplateIdx(0);
    applyTemplate(catId, 0);
  }

  function shuffleTemplate() {
    const pool = TEMPLATES[categoryId];
    const next = Math.floor(Math.random() * pool.length);
    setTemplateIdx(next);
    applyTemplate(categoryId, next);
  }

  function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCustomPhotoSrc(ev.target.result);
    reader.readAsDataURL(file);
  }

  const exportPost = useCallback(async () => {
    if (!canvasRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(canvasRef.current, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: format.w,
        height: format.h,
      });
      const link = document.createElement("a");
      link.download = `${formatId}_${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Try a different browser or image source.");
    } finally {
      setExporting(false);
    }
  }, [format, formatId]);

  const currentTemplate = { headline, body, cta };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "12px 10px" }}>

      {/* Format picker */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", padding: 16, marginBottom: 12 }}>
        <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a6a78", textTransform: "uppercase", marginBottom: 10 }}>Format</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {FORMATS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormatId(f.id)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: `2px solid ${formatId === f.id ? BLUE : "#e8ecf0"}`,
                background: formatId === f.id ? "#f0f8ff" : "#fafafa",
                color: formatId === f.id ? BLUE : NAVY,
                fontWeight: formatId === f.id ? "bold" : "normal",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>

        {/* Left controls */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Design + Category */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a6a78", textTransform: "uppercase", marginBottom: 8 }}>Design Style</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
              {DESIGNS.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDesignId(d.id)}
                  style={{
                    padding: "6px 12px", borderRadius: 8,
                    border: `2px solid ${designId === d.id ? BLUE : "#e8ecf0"}`,
                    background: designId === d.id ? "#f0f8ff" : "#fafafa",
                    color: designId === d.id ? BLUE : NAVY,
                    fontWeight: designId === d.id ? "bold" : "normal",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a6a78", textTransform: "uppercase", marginBottom: 8 }}>Category</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCategoryChange(c.id)}
                  style={{
                    padding: "6px 12px", borderRadius: 8,
                    border: `2px solid ${categoryId === c.id ? GOLD : "#e8ecf0"}`,
                    background: categoryId === c.id ? "#fffcf0" : "#fafafa",
                    color: categoryId === c.id ? "#8b6914" : NAVY,
                    fontWeight: categoryId === c.id ? "bold" : "normal",
                    fontSize: 12, cursor: "pointer",
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button
              onClick={shuffleTemplate}
              style={{
                background: BLUE, color: "#fff", border: "none",
                padding: "7px 14px", borderRadius: 8, fontSize: 12,
                fontWeight: "bold", cursor: "pointer",
              }}
            >
              🔀 Shuffle Template
            </button>
          </div>

          {/* Photo picker */}
          {(designId === "spotlight" || designId === "overlay") && (
            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a6a78", textTransform: "uppercase", marginBottom: 8 }}>Photo</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                {INSTRUCTOR_PHOTOS.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => { setPhotoId(p.id); setCustomPhotoSrc(null); }}
                    style={{
                      textAlign: "center", cursor: "pointer",
                      opacity: (!customPhotoSrc && photoId === p.id) ? 1 : 0.55,
                    }}
                  >
                    <img
                      src={`${BASE}photos/${p.file}`}
                      alt={p.label}
                      style={{
                        width: 44, height: 44, borderRadius: "50%", objectFit: "cover",
                        border: `3px solid ${(!customPhotoSrc && photoId === p.id) ? BLUE : "#e8ecf0"}`,
                        display: "block", marginBottom: 3,
                      }}
                    />
                    <div style={{ fontSize: 9, color: NAVY }}>{p.label.split(" ")[0]}</div>
                  </div>
                ))}
              </div>
              {customPhotoSrc && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, padding: "6px 10px", background: "#f0f8ff", borderRadius: 8, border: `1px solid ${BLUE}` }}>
                  <img src={customPhotoSrc} alt="Custom" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                  <span style={{ fontSize: 11, color: BLUE, flex: 1 }}>Custom photo selected</span>
                  <button
                    onClick={() => setCustomPhotoSrc(null)}
                    style={{ background: "none", border: "none", color: "#e00", cursor: "pointer", fontSize: 11 }}
                  >
                    ✕
                  </button>
                </div>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{ background: "#f5f7f9", border: "1px dashed #b0bec5", color: NAVY, padding: "7px 14px", borderRadius: 8, fontSize: 12, cursor: "pointer" }}
              >
                📁 Import Custom Photo
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileImport} />
            </div>
          )}

          {/* Text editor */}
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", padding: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a6a78", textTransform: "uppercase", marginBottom: 10 }}>Edit Text</div>
            <div style={{ marginBottom: 10 }}>
              <label htmlFor="social-headline" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Headline</label>
              <input
                id="social-headline"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 13, fontWeight: "bold", color: NAVY, boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label htmlFor="social-body" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Body Text</label>
              <textarea
                id="social-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, boxSizing: "border-box", resize: "vertical", lineHeight: 1.5 }}
              />
            </div>
            <div>
              <label htmlFor="social-cta" style={{ display: "block", fontSize: 11, color: "#5a6a78", marginBottom: 3 }}>Call to Action Button</label>
              <input
                id="social-cta"
                value={cta}
                onChange={(e) => setCta(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #e8ecf0", borderRadius: 8, fontSize: 12, color: NAVY, boxSizing: "border-box" }}
              />
            </div>
          </div>

          {/* Export */}
          <button
            onClick={exportPost}
            disabled={exporting}
            style={{
              width: "100%",
              padding: "13px",
              background: exporting ? "#b0bec5" : NAVY,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 14,
              fontWeight: "bold",
              cursor: exporting ? "default" : "pointer",
              marginBottom: 8,
            }}
          >
            {exporting ? "Exporting…" : `⬇ Export ${format.label} (${format.w}×${format.h})`}
          </button>
          <div style={{ fontSize: 10, color: "#9aa8b5", textAlign: "center", marginBottom: 12 }}>
            Exports as PNG · {format.w}×{format.h}px
          </div>
        </div>

        {/* Right: preview */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ fontSize: 11, fontWeight: "bold", color: "#5a6a78", textTransform: "uppercase", marginBottom: 8 }}>
            Preview
          </div>
          <div
            style={{
              width: Math.round(format.w * scale),
              height: Math.round(format.h * scale),
              overflow: "hidden",
              borderRadius: 10,
              border: "1px solid #e8ecf0",
              boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
              position: "relative",
            }}
          >
            {/* Actual canvas div — rendered at full size, scaled down */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                transformOrigin: "top left",
                transform: `scale(${scale})`,
                width: format.w,
                height: format.h,
              }}
            >
              <div ref={canvasRef}>
                <PostCanvas
                  format={format}
                  design={designId}
                  template={currentTemplate}
                  photoSrc={photoSrc}
                  customPhoto={customPhotoSrc}
                  logoSrc={logoSrc}
                />
              </div>
            </div>
          </div>
          <div style={{ marginTop: 6, fontSize: 10, color: "#9aa8b5", textAlign: "center" }}>
            {format.w} × {format.h}
          </div>
        </div>

      </div>
    </div>
  );
}
