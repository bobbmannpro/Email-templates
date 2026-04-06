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

// ─── Email Header Templates (subtitle + bullets pool) ────────────────────────
export const HEADER_TEMPLATES = [
  {
    subtitle: "Cooper Fitness Center is your home for private swim lessons — all skill levels, all ages, certified instruction.",
    bullets: ["Expert one-on-one coaching", "Beginner to competitive levels", "Flexible scheduling available", "Members and non-members welcome"],
  },
  {
    subtitle: "Summer is around the corner — get in the water now with personalized swim lessons at Cooper Fitness Center.",
    bullets: ["After-school and weekend slots", "Build real water confidence", "Certified USA Swimming coaches", "Heated pool, year-round lessons"],
  },
  {
    subtitle: "Whether it is your first lap or your fastest, our instructors meet you where you are and push you forward.",
    bullets: ["Private and semi-private options", "Ages 3 and up welcome", "Stroke technique focus", "Book anytime online"],
  },
  {
    subtitle: "Stop thinking about it — book a swim lesson at Cooper Fitness Center and start seeing real results in the water.",
    bullets: ["Personalized certified instruction", "All ages and skill levels", "Hotel Pool and Fitness Center", "Non-members always welcome"],
  },
  {
    subtitle: "From first-time swimmers to triathletes, Coach Bobby and the Cooper team are ready to help you reach your goals.",
    bullets: ["One-on-one focused coaching", "Race prep and triathlon training", "Youth to adult lessons", "Flexible lesson lengths"],
  },
  {
    subtitle: "Private swim lessons at Cooper Fitness Center build confidence, technique, and a love for the water — at any age.",
    bullets: ["All skill levels welcome", "Certified expert instructors", "Flexible lesson times", "Non-members always welcome"],
  },
  {
    subtitle: "Give yourself or your child the gift of water confidence with private lessons from Cooper's certified swim team.",
    bullets: ["Ages 3 and up", "30, 45, and 60 min options", "Semi-private group lessons too", "Easy online booking"],
  },
  {
    subtitle: "There is no better time to get in the water. Cooper Fitness Center swim lessons fit every schedule and every skill level.",
    bullets: ["Weekend and weekday slots", "Beginner through advanced", "Trusted certified coaches", "Book online in minutes"],
  },
];

// ─── 100 Headline Titles (shuffled randomly by the Shuffle button) ────────────
export const HEADER_TITLES = [
  "Dive In This Week",
  "Make a Splash",
  "Swim Smarter This Season",
  "Get in the Water",
  "Your Best Swim Starts Here",
  "Private Swim Lessons Now Open",
  "Build Confidence in the Water",
  "Learn to Swim at Cooper",
  "Stroke by Stroke to Success",
  "Summer Swim Spots Are Open",
  "Jump In and Get Started",
  "Water Confidence Starts Here",
  "Your Swim Journey Starts Now",
  "Certified Coaches Ready for You",
  "First Lesson Changes Everything",
  "Small Class Big Results",
  "Every Age Every Level",
  "Swim Better Starting Today",
  "Book Your Lesson This Week",
  "One-on-One in the Pool",
  "Spring Swim Lessons Are Back",
  "Train With the Best",
  "Fear Less Swim More",
  "From Nervous to Natural",
  "Real Coaching Real Results",
  "More Than Just Swimming",
  "Splash Into Something New",
  "Ready to Learn to Swim",
  "The Water Is Waiting",
  "Progress Every Single Lesson",
  "Start Where You Are",
  "Swim Lessons for Every Age",
  "Non-Members Always Welcome",
  "Build Skills All Summer Long",
  "Your Fastest Lap Starts Here",
  "Private Lessons Open Now",
  "Fun Fast Effective Lessons",
  "All Levels All Ages Welcome",
  "Get Comfortable in the Water",
  "Time to Hit the Pool",
  "Swim Into a New Season",
  "No Experience Needed",
  "Lessons That Actually Work",
  "Coach Bobby Is Ready for You",
  "Slots Filling Up Fast",
  "Personalized Swim Coaching Available",
  "Take the Plunge This Week",
  "Kids Adults All Welcome",
  "Stop Waiting Start Swimming",
  "Year-Round Lessons at Cooper",
  "Technique Focus Results Follow",
  "A Lap Above the Rest",
  "Your Goals Our Coaching",
  "Unlock Your Potential in Water",
  "Weekend Lessons Now Available",
  "Flip Turn Your Fitness Around",
  "Conquer the Water This Month",
  "Early Bird Spots Available",
  "Swim Season Is Here",
  "Lessons for Every Swimmer",
  "Expert Instruction Every Session",
  "Certified Coaches Every Time",
  "Swim Smarter Not Harder",
  "From Splash to Stroke",
  "Beyond the Basics",
  "Lessons With Lasting Results",
  "Book Today Swim Tomorrow",
  "Every Stroke Counts",
  "Make Every Lap Count",
  "Swim With Purpose",
  "Reach Your Potential in the Pool",
  "Summer Starts in the Water",
  "Get Race-Ready With Bobby",
  "Triathlon Training Available",
  "Kids Love the Pool",
  "Parents Trust Cooper",
  "Confidence Starts at the Edge",
  "One Lesson at a Time",
  "Weekend Warriors Welcome",
  "Morning Lessons Now Available",
  "Swim Your Way to Fitness",
  "Dallas Best Swim Coaching",
  "Lessons the Whole Family Needs",
  "Your Summer Starts Here",
  "Open Water Prep Starts Now",
  "Half the Time Twice the Progress",
  "Semi-Private Lessons Available",
  "Group Lessons for Ages 3 and Up",
  "Fall Into Better Swimming",
  "Winter Swim Lessons Open",
  "Spring Into the Pool",
  "Beat the Summer Heat",
  "Swim Lessons Worth Every Lap",
  "Find Your Rhythm in the Water",
  "Back to Basics Back to the Pool",
  "Pool Time That Pays Off",
  "Swim Stronger This Season",
  "More Laps Less Worry",
  "Goals in the Water Met Here",
  "The Pool Is Your Playground",
];
