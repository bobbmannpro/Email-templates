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

// ─── Photos available in public/photos/ ──────────────────────────────────────
export const PHOTO_FILES = [
  "ayden.jpg",
  "bobby.jpg",
  "caden.jpg",
  "madeline.jpg",
  "olivia.jpg",
  "peyton.jpg",
  "riley_d.jpg",
  "riley_n.jpg",
];

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

// ─── Email Subject Types ──────────────────────────────────────────────────────
// Each subject has its own pool of headlines, subtitles, and bullets.
// The Shuffle button pulls randomly from whichever subject is selected.
export const EMAIL_SUBJECTS = [
  {
    id: "swim_lessons",
    label: "Swim Lessons",
    titles: [
      "Private Swim Lessons Now Open",
      "Dive In This Week",
      "Make a Splash",
      "Swim Smarter This Season",
      "Get in the Water",
      "Your Best Swim Starts Here",
      "Build Confidence in the Water",
      "Learn to Swim at Cooper",
      "Book Your Lesson This Week",
      "Spots Filling Up Fast",
      "Jump In and Get Started",
      "Water Confidence Starts Here",
      "Every Age Every Level",
      "Swim Better Starting Today",
      "One-on-One in the Pool",
      "Spring Swim Lessons Are Back",
      "Fear Less Swim More",
      "From Nervous to Natural",
      "Real Coaching Real Results",
      "Start Where You Are",
    ],
    templates: [
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
        subtitle: "Give yourself or your child the gift of water confidence with private lessons from Cooper's certified swim team.",
        bullets: ["Ages 3 and up", "30, 45, and 60 min options", "Semi-private group lessons too", "Easy online booking"],
      },
    ],
  },
  {
    id: "bobby_spotlight",
    label: "Coach Bobby Spotlight",
    titles: [
      "Train With Coach Bobby",
      "Meet Your Head Swim Coach",
      "Bobby Manning — Cooper Swim Pro",
      "One-on-One With Coach Bobby",
      "Dallas Best Swim Coach",
      "Expert Coaching From Bobby Manning",
      "Your Coach Your Goals",
      "Bobby Manning Is Ready for You",
      "Swim Lessons With a Pro",
      "Book a Session With Bobby",
      "Get Race-Ready With Bobby",
      "Triathlon Prep With Coach Bobby",
      "Coach Bobby Has Openings",
      "Private Lessons With the Best",
      "Trusted by Dallas Swimmers",
    ],
    templates: [
      {
        subtitle: "Coach Bobby Manning is Cooper's head swim instructor — a USA Swimming certified pro with years of experience coaching all ages and levels.",
        bullets: ["USA Swimming certified", "All ages and skill levels", "Private and triathlon training", "Book online anytime"],
      },
      {
        subtitle: "From beginner swimmers to competitive triathletes, Coach Bobby customizes every lesson to push you further than you thought possible.",
        bullets: ["Personalized lesson plans", "Technique and speed focus", "Available every day", "Non-members welcome"],
      },
      {
        subtitle: "Bobby Manning brings professional-level coaching to every session — whether you're 4 years old or training for your next 70.3.",
        bullets: ["Youth through adult lessons", "Race prep available", "30, 45, and 60 min sessions", "Flexible scheduling"],
      },
    ],
  },
  {
    id: "riley_spotlight",
    label: "Coach Riley Spotlight",
    titles: [
      "Meet Coach Riley",
      "Riley Is Taking New Students",
      "Weekend Lessons With Riley",
      "Train With Coach Riley",
      "Riley Niksich — Swim Instructor",
      "Book a Lesson With Riley",
      "Weekend Swim Coaching at Cooper",
      "Ages 3 to 12 With Coach Riley",
      "Riley Has Weekend Openings",
      "Kid-Focused Coaching With Riley",
    ],
    templates: [
      {
        subtitle: "Coach Riley specializes in building water confidence in young swimmers — patient, encouraging, and results-driven every session.",
        bullets: ["Ages 3 to 12", "Weekend availability", "Fun and encouraging style", "Book online anytime"],
      },
      {
        subtitle: "Riley Niksich brings energy and enthusiasm to every lesson, helping kids fall in love with the water at Cooper Fitness Center.",
        bullets: ["Saturday and Sunday slots", "Beginner friendly", "Small focused sessions", "Non-members welcome"],
      },
    ],
  },
  {
    id: "cooper_cyclones",
    label: "Cooper Cyclones Swim Team",
    titles: [
      "Join the Cooper Cyclones",
      "Cooper Cyclones — Now Recruiting",
      "Compete With the Cyclones",
      "Youth Swim Team at Cooper",
      "Level Up With the Cyclones",
      "The Cyclones Are Calling",
      "Swim Competitively at Cooper",
      "Train Race Win With the Cyclones",
      "Cooper Cyclones Open Enrollment",
      "USA Swimming Youth Team at Cooper",
      "Cyclones Team Spots Available",
      "Take Your Swimming to the Next Level",
    ],
    templates: [
      {
        subtitle: "The Cooper Cyclones are a USA Swimming sanctioned youth swim team offering structured training, meets, and lifelong friendships.",
        bullets: ["Youth ages 6 and up", "USA Swimming sanctioned", "Year-round training", "All skill levels considered"],
      },
      {
        subtitle: "Join the Cooper Cyclones and experience competitive swimming in a supportive, high-energy team environment at Cooper Fitness Center.",
        bullets: ["Competitive meets schedule", "Expert coaching staff", "Team camaraderie", "Email Coach Bobby to join"],
      },
      {
        subtitle: "The Cyclones develop swimmers into athletes — technically sound, mentally tough, and ready to compete at any level.",
        bullets: ["Structured practice schedule", "Stroke and turn clinics", "Travel meet opportunities", "Members and non-members"],
      },
    ],
  },
  {
    id: "triathlon",
    label: "Triathlon Training",
    titles: [
      "Conquer the Swim Leg",
      "Triathlon Swim Training at Cooper",
      "Get Race-Ready in the Water",
      "Train Your Swim With Bobby",
      "Open Water Prep Starts Now",
      "Sprint to 70.3 Swim Coaching",
      "Triathlon Season Is Here",
      "Swim Faster on Race Day",
      "Build Your Race Pace With Bobby",
      "Triathlon Swim Clinics Available",
      "From Pool to Open Water",
      "Race Prep With Coach Bobby",
    ],
    templates: [
      {
        subtitle: "Coach Bobby specializes in triathlon swim coaching — from your first sprint to a full 70.3, he will get you across the finish line faster.",
        bullets: ["Sprint, Olympic, and 70.3 prep", "Open water technique", "Private and group sessions", "Book with Coach Bobby"],
      },
      {
        subtitle: "Stop losing time in the water. Cooper's triathlon swim training builds the technique and endurance to make the swim leg your strength.",
        bullets: ["Race-pace interval training", "Stroke efficiency focus", "Flip turns and open water starts", "All triathlon distances"],
      },
    ],
  },
  {
    id: "general",
    label: "General / Promotional",
    titles: [
      "Non-Members Always Welcome",
      "Summer at the Cooper Pool",
      "The Pool Is Open",
      "Beat the Heat at Cooper",
      "Year-Round Swimming at Cooper",
      "Cooper Fitness — More Than a Gym",
      "Something for Every Swimmer",
      "Swim Fitness for the Whole Family",
      "Your Summer Starts Here",
      "The Water Is Waiting",
      "Pool Time That Pays Off",
      "More Laps Less Worry",
      "Dallas Premier Swim Facility",
      "Members and Non-Members Welcome",
      "Get in the Pool This Week",
    ],
    templates: [
      {
        subtitle: "Cooper Fitness Center welcomes members and non-members to swim, train, and grow — world-class aquatics in the heart of Dallas.",
        bullets: ["Private and semi-private lessons", "Competitive swim team", "Triathlon coaching available", "Hotel and Fitness Center pools"],
      },
      {
        subtitle: "Whether you're a first-time swimmer or a seasoned competitor, Cooper Fitness Center has a program for you.",
        bullets: ["All ages and skill levels", "Certified expert coaches", "Flexible scheduling", "Non-members always welcome"],
      },
    ],
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
