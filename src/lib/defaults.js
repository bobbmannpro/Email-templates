// Starting data: brand, links, roster, block templates, and the default email.
// Everything here is only a starting point — all of it is editable in the app.

import { createBlock, newId } from "./blocks.js";

export const DEFAULT_SETTINGS = {
  brand: {
    primary: "#0b2545",   // navy
    accent: "#1e88c7",    // blue
    highlight: "#e8a838", // gold
    success: "#1a8a5c",   // green
    text: "#2a3642",
    muted: "#5a6a78",
    bg: "#ffffff",
    font: "Arial,Helvetica,sans-serif",
    headingFont: "Georgia,serif",
  },
  links: {
    book: "https://cfc.smarthealthclubs.com/v4/club-department?department=Swim&section=Services",
    email: "bmanning@cooperfitnesscenter.com",
    phone: "",
  },
  imageBase: "https://bobbmannpro.github.io/Email-templates/photos",
  startDate: "",
  endDate: "",
  weather: { lat: 32.87, lon: -96.76, label: "75230 North Dallas, TX" },
  subject: "",
  preheader: "",
};

export const BRAND_TOKENS = [
  ["primary", "Primary"],
  ["accent", "Accent"],
  ["highlight", "Highlight"],
  ["success", "Success"],
];

/** Photos already hosted in public/photos (pick from these or paste any image URL). */
export const PHOTO_FILES = ["bobby.jpg", "riley_n.jpg", "riley_d.jpg", "madeline.jpg", "peyton.jpg", "ayden.jpg", "caden.jpg", "olivia.jpg", "cfclogo.jpg", "cycloneslogo.png"];

export const DEFAULT_ROSTER = [
  { id: "bobby", name: "Bobby Manning", role: "Swim Pro · Head Swim Coach", photo: "bobby.jpg", avail: "Every day", ages: "All ages", badge: "Available Every Day", badgeColor: "auto", featured: true, color: "highlight", link: "" },
  { id: "riley_n", name: "Riley Niksich", role: "Swim Instructor", photo: "riley_n.jpg", avail: "Sat & Sun", ages: "Ages 3-12", badge: "Sat & Sun", badgeColor: "success", featured: false, color: "accent", link: "" },
  { id: "riley_d", name: "Riley Dyke", role: "Swim Instructor", photo: "riley_d.jpg", avail: "Starting May", ages: "All ages", badge: "Starting May", badgeColor: "auto", featured: false, color: "accent", link: "" },
  { id: "madeline", name: "Madeline Shaw", role: "Swim Instructor", photo: "madeline.jpg", avail: "Starting May", ages: "All ages", badge: "Starting May", badgeColor: "auto", featured: false, color: "accent", link: "" },
  { id: "peyton", name: "Peyton Ganss", role: "Swim Instructor", photo: "peyton.jpg", avail: "Starting May", ages: "All ages", badge: "Starting May", badgeColor: "auto", featured: false, color: "#5c6bc0", link: "" },
  { id: "ayden", name: "Ayden Benel", role: "Swim Instructor", photo: "ayden.jpg", avail: "TBD", ages: "All ages", badge: "Available", badgeColor: "auto", featured: false, color: "#26a69a", link: "" },
];

export function newPerson() {
  return { id: newId("p"), name: "New Instructor", role: "Swim Instructor", photo: "", avail: "", ages: "All ages", badge: "Available", badgeColor: "auto", featured: false, color: "accent", link: "" };
}

/** Ready-made sections (the old app's fixed sections, now fully editable). */
export const TEMPLATES = [
  { name: "Non-Members Welcome banner", type: "banner", props: {} },
  {
    name: "Pool location — Hotel Pool", type: "callout",
    props: {
      eyebrow: "Pool Location - Hotel Pool", title: "", style: "tint", color: "highlight",
      body: "**Come already in your swimsuit** - no changing rooms near the pool.\n**Bring your own towel.**\n**No bathrooms near the pool** - please plan accordingly.\n\n**Directions**\n**From Preston/Churchill:** Enter and continue straight past the track to the pool.\n**From the Fitness Center:** Left out of the lobby, around the tennis courts, straight ahead.",
    },
  },
  {
    name: "Pool location — Fitness Center Pool", type: "callout",
    props: {
      eyebrow: "Pool Location - Fitness Center Pool", title: "", style: "tint", color: "success",
      body: "**Towels are available at the pool.**\n**Family restroom available near the pool.**\n\n**Directions**\nEnter through the **Preston/Willow corner entrance**, follow the driveway, park, enter through the lobby and check in at the front desk.",
    },
  },
  {
    name: "Outdoor pool conditions", type: "callout",
    props: {
      eyebrow: "Outdoor Pool Conditions", title: "", style: "tint", color: "accent",
      body: "🌡️ **Pools are heated to 80°F** — comfortable for swimming regardless of the outside temperature.\n👶 **Ages 6 and under:** We recommend an air temperature of **70°F or warmer** for young swimmers.\n📲 **Weather cancellations:** You will be contacted directly if your session needs to be cancelled due to weather.",
    },
  },
  {
    name: "Triathlon training", type: "callout",
    props: {
      eyebrow: "Triathlon Training", title: "Triathlon Swim Training", style: "dark", color: "primary", logo: "cfclogo.jpg",
      body: "Train your swim leg with Coach Bobby - personalized sessions for sprint, Olympic, and 70.3 distances.\n\n💰 **$120/hour**",
      btnLabel: "Sign Up", btnUrl: "{book}",
    },
  },
  {
    name: "Cooper Cyclones swim team", type: "callout",
    props: {
      eyebrow: "Cooper Cyclones Swim Team", title: "Join the Cooper Cyclones!", style: "tint", color: "accent", logo: "cycloneslogo.png",
      body: "Year-round competitive swim team for youth athletes of all levels. USA Swimming sanctioned meets, structured training, and an incredible team culture.",
      btnLabel: "Email Coach Bobby", btnUrl: "{email}",
    },
  },
  { name: "Weather forecast", type: "weather", props: {} },
  { name: "Meet your instructors", type: "people", props: { ids: DEFAULT_ROSTER.map((p) => p.id) } },
  { name: "Instructor spotlight", type: "spotlight", props: { personId: "bobby", style: "dark" } },
  {
    name: "Pro rates (Bobby)", type: "rates",
    props: {
      title: "Pro Rates", badge: "Pro", badgeColor: "primary", badgeName: "Bobby Manning",
      tables: [
        { title: "Private Lessons", col1: "Duration", col2: "Rate", rows: [{ label: "30 min", price: "$80" }, { label: "45 min", price: "$120" }, { label: "60 min", price: "$160" }] },
        { title: "Semi-Private (2-6 swimmers)", col1: "Duration", col2: "Per Swimmer", rows: [{ label: "30 min", price: "$50" }, { label: "45 min", price: "$65" }, { label: "60 min", price: "$85" }] },
      ],
    },
  },
  {
    name: "Instructor rates", type: "rates",
    props: {
      title: "Instructor Rates", badge: "Instructor", badgeColor: "accent", badgeName: "",
      tables: [
        { title: "Private Lessons", col1: "Duration", col2: "Rate", rows: [{ label: "15 min (age 3 and under)", price: "$30" }, { label: "30 min", price: "$60" }, { label: "45 min", price: "$90" }, { label: "60 min", price: "$120" }] },
        { title: "Semi-Private (2-6 swimmers)", col1: "Duration", col2: "Per Swimmer", rows: [{ label: "30 min", price: "$40" }, { label: "45 min", price: "$55" }, { label: "60 min", price: "$70" }] },
      ],
    },
  },
  { name: "“Ready to Jump In?” closing band", type: "cta", props: {} },
  { name: "Signature", type: "signature", props: {} },
];

export function fromTemplate(t) {
  const props = JSON.parse(JSON.stringify(t.props));
  return createBlock(t.type, props);
}

const T = (name) => fromTemplate(TEMPLATES.find((t) => t.name.startsWith(name)));

export function defaultDoc() {
  return {
    version: 3,
    name: "Weekly Swim Lessons",
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    roster: JSON.parse(JSON.stringify(DEFAULT_ROSTER)),
    forecast: [],
    blocks: [
      createBlock("hero", { divider: false }),
      T("Non-Members"),
      T("Pool location — Hotel"),
      T("Weather"),
      T("Meet your"),
      T("Pro rates"),
      T("Instructor rates"),
      T("“Ready"),
      createBlock("signature", { divider: false }),
    ],
  };
}

/** Fill in anything missing from an older/imported doc so it never crashes. */
export function normalizeDoc(raw) {
  const base = defaultDoc();
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.blocks)) return base;
  return {
    ...base,
    ...raw,
    settings: {
      ...base.settings,
      ...raw.settings,
      brand: { ...base.settings.brand, ...(raw.settings?.brand || {}) },
      links: { ...base.settings.links, ...(raw.settings?.links || {}) },
      weather: { ...base.settings.weather, ...(raw.settings?.weather || {}) },
    },
    roster: Array.isArray(raw.roster) ? raw.roster : base.roster,
    forecast: Array.isArray(raw.forecast) ? raw.forecast : [],
    blocks: raw.blocks.filter((b) => b && b.type).map((b) => ({ id: b.id || newId(), ...b })),
  };
}
