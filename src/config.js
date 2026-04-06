// ─── AI Header Generation (Cloudflare Worker proxy) ──────────────────────────
// After deploying cloudflare-worker/worker.js, paste your Worker URL here.
// Example: "https://swim-ai.yourusername.workers.dev"
export const AI_WORKER_URL = "https://swim-ai.bobbmannpro.workers.dev";

// ─── Deployment ───────────────────────────────────────────────────────────────
// Absolute base URL used for instructor photo <img> tags inside generated emails.
// Email clients open emails offline from any website context, so relative paths
// won't resolve — the full URL is required.
export const EMAIL_IMAGE_BASE = "https://bobbmannpro.github.io/Email-templates/photos";

// ─── Weather (Open-Meteo — free, no API key required) ─────────────────────────
// Coordinates for zip code 75230 (North Dallas, TX)
export const WEATHER_LAT = 32.87;
export const WEATHER_LON = -96.76;

// ─── Brand Colors ─────────────────────────────────────────────────────────────
export const NAVY = "#0b2545";
export const BLUE = "#1e88c7";
export const GOLD = "#e8a838";
export const GRN  = "#1a8a5c";

// ─── Contact & Booking ────────────────────────────────────────────────────────
export const BOOK_URL       = "https://cfc.smarthealthclubs.com/v4/club-department?department=Swim&section=Services";
export const COACH_EMAIL    = "bmanning@cooperfitnesscenter.com";
export const FACILITY_ADDRESS = "Cooper Fitness Center · 12100 Greenville Ave, Dallas, TX 75243";
export const FORECAST_ZIP_LABEL = "75230 North Dallas, TX";

// ─── Seasonal Temperature Baselines (Dallas) ──────────────────────────────────
// Each entry is [high, low] for that month (Jan=0 … Dec=11)
export const SEASONAL_TEMPS = [
  [57, 37], [62, 41], [70, 48], [78, 57], [85, 65],
  [93, 73], [97, 77], [97, 77], [90, 70], [80, 59],
  [68, 48], [59, 39],
];

// ─── Instructor Seed Data ─────────────────────────────────────────────────────
export const SEED = [
  { id: "bobby",    name: "Bobby Manning",  role: "Swim Pro · Head Swim Coach", ini: "BM", col: GOLD,      dark: true,  bb: "rgba(255,255,255,0.15)", bc: "#fff",    av: "Every day",    badge: "Available Every Day", ages: "All ages",  pro: true,  photo: "bobby.jpg"    },
  { id: "riley_n",  name: "Riley Niksich",  role: "Swim Instructor",            ini: "RN", col: BLUE,      dark: false, bb: "#e6f5ee",               bc: "#1a8a5c", av: "Sat & Sun",    badge: "Sat & Sun",           ages: "Ages 3-12", pro: false, photo: "riley_n.jpg"  },
  { id: "riley_d",  name: "Riley Dyke",     role: "Swim Instructor",            ini: "RD", col: BLUE,      dark: false, bb: "#fff3e0",               bc: "#c77700", av: "Starting May", badge: "Starting May",         ages: "All ages",  pro: false, photo: "riley_d.jpg"  },
  { id: "madeline", name: "Madeline Shaw",  role: "Swim Instructor",            ini: "MS", col: BLUE,      dark: false, bb: "#fff3e0",               bc: "#c77700", av: "Starting May", badge: "Starting May",         ages: "All ages",  pro: false, photo: "madeline.jpg" },
  { id: "peyton",   name: "Peyton Ganss",   role: "Swim Instructor",            ini: "PG", col: "#5c6bc0", dark: false, bb: "#fff3e0",               bc: "#c77700", av: "Starting May", badge: "Starting May",         ages: "All ages",  pro: false, photo: "peyton.jpg"   },
  { id: "ayden",    name: "Ayden Benel",    role: "Swim Instructor",            ini: "AB", col: "#26a69a", dark: false, bb: "#e0f2f1",               bc: "#00796b", av: "TBD",          badge: "Available",            ages: "All ages",  pro: false, photo: "ayden.jpg"    },
];

// ─── Weather Condition List ───────────────────────────────────────────────────
export const COND_LIST = [
  "Sunny", "Mostly Sunny", "Partly Cloudy", "Mostly Cloudy",
  "Cloudy", "Scattered Showers", "Rain", "Thunderstorms", "Fog",
];

// ─── Instructor Avatar Colors (for custom instructors) ────────────────────────
export const COLORS = [BLUE, "#5c6bc0", "#26a69a", "#ef5350", "#ab47bc", "#66bb6a", "#ffa726"];

// ─── Email Header Templates ───────────────────────────────────────────────────
export const HEADER_TEMPLATES = [
  {
    title:   "Dive In This Week!",
    subtitle: "Cooper Fitness Center is your home for private swim lessons — all skill levels, all ages, certified instruction.",
    bullets: ["Expert one-on-one coaching", "Beginner to competitive levels", "Flexible scheduling available", "Members and non-members welcome"],
  },
  {
    title:   "Make a Splash",
    subtitle: "Summer is around the corner — get in the water now with personalized swim lessons at Cooper Fitness Center.",
    bullets: ["After-school and weekend slots", "Build real water confidence", "Certified USA Swimming coaches", "Heated pool, year-round lessons"],
  },
  {
    title:   "Swim Smarter This Season",
    subtitle: "Whether it is your first lap or your fastest, our instructors meet you where you are and push you forward.",
    bullets: ["Private and semi-private options", "Ages 3 and up welcome", "Stroke technique focus", "Book anytime online"],
  },
  {
    title:   "Get in the Water",
    subtitle: "Stop thinking about it — book a swim lesson at Cooper Fitness Center and start seeing real results in the water.",
    bullets: ["Personalized certified instruction", "All ages and skill levels", "Hotel Pool and Fitness Center", "Non-members always welcome"],
  },
  {
    title:   "Your Best Swim Starts Here",
    subtitle: "From first-time swimmers to triathletes, Coach Bobby and the Cooper team are ready to help you reach your goals.",
    bullets: ["One-on-one focused coaching", "Race prep and triathlon training", "Youth to adult lessons", "Flexible lesson lengths"],
  },
];
