import { BOOK_URL, COACH_EMAIL, FACILITY_ADDRESS, FORECAST_ZIP_LABEL, EMAIL_IMAGE_BASE } from "../config.js";
import { fmtDate } from "./date.js";

/**
 * Extracts initials from a full name (first + last initial).
 * @param {string} name - Full name
 * @returns {string} Up to 2 uppercase initials
 */
export function initials(name) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/**
 * Builds the pool location HTML block.
 * @param {string} poolType - "hotel" or "fitness"
 * @returns {string} HTML table row string
 */
export function buildPoolBlock(poolType) {
  if (poolType === "hotel") {
    return `
<tr><td style="padding:18px 20px;border-bottom:1px solid #e8ecf0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffcf3;border:1px solid #f0dca0;border-left:4px solid #e8a838;border-radius:8px;"><tr><td style="padding:14px 16px;">
<p style="font-size:11px;font-weight:bold;color:#d4942e;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Pool Location - Hotel Pool</p>
<p style="font-size:12px;line-height:1.7;color:#5a4a2a;margin:0 0 4px;"><strong style="color:#8b6914;">Come already in your swimsuit</strong> - no changing rooms near the pool.</p>
<p style="font-size:12px;line-height:1.7;color:#5a4a2a;margin:0 0 4px;"><strong style="color:#8b6914;">Bring your own towel.</strong></p>
<p style="font-size:12px;line-height:1.7;color:#5a4a2a;margin:0 0 10px;"><strong style="color:#8b6914;">No bathrooms near the pool</strong> - please plan accordingly.</p>
<p style="font-size:11px;font-weight:bold;color:#8b6914;margin:0 0 4px;">Directions</p>
<p style="font-size:12px;line-height:1.7;color:#5a4a2a;margin:0 0 4px;"><strong>From Preston/Churchill:</strong> Enter and continue straight past the track to the pool.</p>
<p style="font-size:12px;line-height:1.7;color:#5a4a2a;margin:0;"><strong>From the Fitness Center:</strong> Left out of the lobby, around the tennis courts, straight ahead.</p>
</td></tr></table></td></tr>`;
  }
  return `
<tr><td style="padding:18px 20px;border-bottom:1px solid #e8ecf0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e6f5ee;border:1px solid #b8e0cc;border-left:4px solid #1a8a5c;border-radius:8px;"><tr><td style="padding:14px 16px;">
<p style="font-size:11px;font-weight:bold;color:#1a8a5c;text-transform:uppercase;letter-spacing:1px;margin:0 0 8px;">Pool Location - Fitness Center Pool</p>
<p style="font-size:12px;line-height:1.7;color:#2a5a45;margin:0 0 4px;"><strong>Towels are available at the pool.</strong></p>
<p style="font-size:12px;line-height:1.7;color:#2a5a45;margin:0 0 10px;"><strong>Family restroom available near the pool.</strong></p>
<p style="font-size:11px;font-weight:bold;color:#1a8a5c;margin:0 0 4px;">Directions</p>
<p style="font-size:12px;line-height:1.7;color:#2a5a45;margin:0;">Enter through the <strong>Preston/Willow corner entrance</strong>, follow the driveway, park, enter through the lobby and check in at the front desk.</p>
</td></tr></table></td></tr>`;
}

/**
 * Builds the weather forecast HTML block.
 * @param {Array<{day:string,icon:string,high:string,low:string,rain:string}>|null} forecast
 * @returns {string} HTML table row string, or "" if no forecast
 */
export function buildWeatherBlock(forecast) {
  if (!forecast || forecast.length === 0) return "";
  const cells = forecast
    .map(
      (d) =>
        `<td style="text-align:center;background:#f5f7f9;border:1px solid #e8ecf0;border-radius:8px;padding:8px 4px;min-width:56px;max-width:80px;">` +
        `<p style="font-size:7px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;margin:0;white-space:nowrap;">${d.day}</p>` +
        `<p style="font-size:15px;margin:2px 0;">${d.icon}</p>` +
        `<p style="font-size:13px;font-weight:bold;color:#0b2545;margin:0;">${d.high}</p>` +
        `<p style="font-size:10px;color:#9aa8b5;margin:1px 0;">${d.low}</p>` +
        `<p style="font-size:8px;color:#9aa8b5;margin:2px 0 0;">${d.rain}</p></td>`
    )
    .join("");
  return (
    `<tr><td style="padding:18px 20px;border-bottom:1px solid #e8ecf0;">` +
    `<p style="font-family:Georgia,serif;font-size:17px;color:#0b2545;margin:0 0 12px;">${forecast.length}-Day Pool-Side Forecast</p>` +
    `<div class="scroll-x" style="overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;display:block;">` +
    `<table cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;border-spacing:4px;"><tr>${cells}</tr></table>` +
    `</div><p style="font-size:11px;color:#9aa8b5;margin:8px 0 0;">Forecast for ${FORECAST_ZIP_LABEL}</p></td></tr>`
  );
}

/**
 * Builds the instructors HTML block.
 * @param {string[]} instOrder - Ordered array of instructor IDs
 * @param {Object} insts - Map of instructor ID → instructor state object
 * @returns {string} HTML table row string, or "" if no instructors selected
 */
export function buildInstructorBlock(instOrder, insts) {
  const selIds   = instOrder.filter((id) => insts[id] && insts[id].sel);
  const hasBobby = selIds.includes("bobby");
  const otherIds = selIds.filter((id) => id !== "bobby");
  const n        = otherIds.length;
  const psz      = n <= 1 ? 100 : n === 2 ? 90 : n === 3 ? 82 : 72;
  const nsz      = n <= 1 ? 15  : n === 2 ? 14 : 13;
  const pad      = n <= 1 ? 18  : 14;

  if (selIds.length === 0) return "";

  let bobbyHtml = "";
  if (hasBobby) {
    const b = insts.bobby;
    const bobbyAvatar = b.photo
      ? `<img src="${EMAIL_IMAGE_BASE}/${b.photo}" alt="${b.name}" width="82" height="82" style="width:82px;height:82px;border-radius:50%;object-fit:cover;border:3px solid #e8a838;display:block;" />`
      : `<div style="width:82px;height:82px;border-radius:50%;background:#e8a838;text-align:center;line-height:82px;font-size:22px;font-weight:bold;color:#0b2545;border:3px solid #e8a838;">${b.ini}</div>`;
    bobbyHtml =
      `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0b2545;border-radius:12px;margin-bottom:14px;">` +
      `<tr><td style="width:106px;padding:16px 0 16px 16px;vertical-align:top;">` +
      bobbyAvatar +
      `</td><td style="padding:16px 16px 16px 10px;vertical-align:middle;">` +
      `<p style="font-family:Georgia,serif;font-size:16px;color:#fff;font-weight:bold;margin:0 0 2px;">${b.name}</p>` +
      `<p style="font-size:10px;color:#e8a838;font-weight:bold;margin:0 0 8px;">${b.role}</p>` +
      `<p style="font-size:11px;color:rgba(255,255,255,0.8);margin:0 0 3px;">📅 ${b.avail}</p>` +
      `<p style="font-size:11px;color:rgba(255,255,255,0.8);margin:0 0 9px;">🏊 ${b.ages}</p>` +
      `<span style="display:inline-block;font-size:9px;font-weight:bold;text-transform:uppercase;padding:3px 10px;border-radius:12px;background:rgba(255,255,255,0.12);color:#fff;margin-bottom:10px;">${b.badge}</span><br>` +
      `<a href="${BOOK_URL}" style="display:inline-block;background:#e8a838;color:#0b2545;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;text-decoration:none;padding:8px 20px;border-radius:20px;">Book a Lesson</a>` +
      `</td></tr></table>`;
  }

  const otherCells = otherIds
    .map((id) => {
      const s = insts[id];
      const w = n <= 2 ? Math.floor(100 / n) + "%" : "130px";
      return (
        `<td style="width:${w};min-width:${n > 2 ? "130px" : "0"};padding:0 4px;vertical-align:top;">` +
        `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f7f9;border:1px solid #e8ecf0;border-radius:12px;">` +
        `<tr><td style="padding:${pad}px 8px;text-align:center;">` +
        (s.photo
          ? `<img src="${EMAIL_IMAGE_BASE}/${s.photo}" alt="${s.name}" width="${psz}" height="${psz}" style="width:${psz}px;height:${psz}px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block;border:2px solid #1e88c7;" />`
          : `<div style="width:${psz}px;height:${psz}px;border-radius:50%;background:${s.col};margin:0 auto 10px;text-align:center;line-height:${psz}px;font-size:${Math.floor(psz * 0.27)}px;font-weight:bold;color:${s.dark ? "#0b2545" : "#fff"};border:2px solid #1e88c7;">${s.ini}</div>`) +
        `<p style="font-family:Georgia,serif;font-size:${nsz}px;color:#0b2545;font-weight:bold;margin:0 0 2px;">${s.name}</p>` +
        `<p style="font-size:10px;color:#1e88c7;font-weight:bold;margin:0 0 8px;">${s.role}</p>` +
        `<p style="font-size:10px;color:#5a6a78;margin:0 0 2px;">📅 ${s.avail}</p>` +
        `<p style="font-size:10px;color:#5a6a78;margin:0 0 8px;">🏊 ${s.ages}</p>` +
        `<span style="display:inline-block;font-size:9px;font-weight:bold;text-transform:uppercase;padding:3px 8px;border-radius:12px;background:${s.bb};color:${s.bc};margin-bottom:10px;">${s.badge}</span><br>` +
        `<a href="${BOOK_URL}" style="display:inline-block;background:#1e88c7;color:#fff;font-family:Arial,sans-serif;font-size:11px;font-weight:bold;text-decoration:none;padding:7px 16px;border-radius:18px;">Book</a>` +
        `</td></tr></table></td>`
      );
    })
    .join("");

  const scrollStyle = n > 2 ? "overflow-x:auto;-webkit-overflow-scrolling:touch;max-width:100%;display:block;padding-bottom:4px;" : "";
  const tableStyle  = n <= 2 ? "width:100%;table-layout:fixed;" : "";

  return (
    `<tr><td style="padding:18px 20px;border-bottom:1px solid #e8ecf0;">` +
    `<p style="font-family:Georgia,serif;font-size:17px;color:#0b2545;margin:0 0 14px;">Meet Your Instructors</p>` +
    bobbyHtml +
    (n > 0
      ? `<div style="${scrollStyle}"><table cellpadding="0" cellspacing="0" border="0" style="${tableStyle}"><tr>${otherCells}</tr></table></div>`
      : "") +
    `</td></tr>`
  );
}

/**
 * Builds the lesson rates HTML block. Rates are static — no parameters needed.
 * @returns {string} HTML table row string
 */
export function buildRatesBlock() {
  return `
<tr><td class="pad" style="padding:20px;border-bottom:1px solid #e8ecf0;">
<p style="font-family:Georgia,serif;font-size:17px;color:#0b2545;margin:0 0 12px;">Lesson Rates</p>
<p style="margin:0 0 5px;"><span style="display:inline-block;font-size:9px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:4px 12px;border-radius:12px;background:#0b2545;color:#fff;">Pro</span>&nbsp;<span style="font-family:Georgia,serif;font-size:13px;color:#0b2545;">Bobby Manning</span></p>
<p style="font-size:10px;font-weight:bold;color:#1e88c7;text-transform:uppercase;letter-spacing:1px;margin:10px 0 4px;">Private Lessons</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;border-bottom:2px solid #e8ecf0;">Duration</td><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;text-align:right;border-bottom:2px solid #e8ecf0;">Rate</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">30 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$80</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">45 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$120</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;">60 min</td><td style="font-size:13px;padding:7px 8px;color:#0b2545;font-weight:bold;text-align:right;">$160</td></tr>
</table>
<p style="font-size:10px;font-weight:bold;color:#1e88c7;text-transform:uppercase;letter-spacing:1px;margin:12px 0 4px;">Semi-Private (2-6 swimmers)</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;border-bottom:2px solid #e8ecf0;">Duration</td><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;text-align:right;border-bottom:2px solid #e8ecf0;">Per Swimmer</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">30 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$50</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">45 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$65</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;">60 min</td><td style="font-size:13px;padding:7px 8px;color:#0b2545;font-weight:bold;text-align:right;">$85</td></tr>
</table>
<div style="height:1px;background:#e8ecf0;margin:16px 0;"></div>
<p style="margin:0 0 5px;"><span style="display:inline-block;font-size:9px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;padding:4px 12px;border-radius:12px;background:#1e88c7;color:#fff;">Instructor</span></p>
<p style="font-size:10px;font-weight:bold;color:#1e88c7;text-transform:uppercase;letter-spacing:1px;margin:10px 0 4px;">Private Lessons</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;border-bottom:2px solid #e8ecf0;">Duration</td><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;text-align:right;border-bottom:2px solid #e8ecf0;">Rate</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">15 min (age 3 and under)</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$30</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">30 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$60</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">45 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$90</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;">60 min</td><td style="font-size:13px;padding:7px 8px;color:#0b2545;font-weight:bold;text-align:right;">$120</td></tr>
</table>
<p style="font-size:10px;font-weight:bold;color:#1e88c7;text-transform:uppercase;letter-spacing:1px;margin:12px 0 4px;">Semi-Private (2-6 swimmers)</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
<tr><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;border-bottom:2px solid #e8ecf0;">Duration</td><td style="font-size:9px;font-weight:bold;color:#9aa8b5;text-transform:uppercase;padding:5px 8px;text-align:right;border-bottom:2px solid #e8ecf0;">Per Swimmer</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">30 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$40</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;">45 min</td><td style="font-size:13px;padding:7px 8px;border-bottom:1px solid #e8ecf0;color:#0b2545;font-weight:bold;text-align:right;">$55</td></tr>
<tr><td style="font-size:13px;padding:7px 8px;">60 min</td><td style="font-size:13px;padding:7px 8px;color:#0b2545;font-weight:bold;text-align:right;">$70</td></tr>
</table>
<p style="text-align:center;margin:14px 0 0;"><a href="${BOOK_URL}" style="display:inline-block;background:#1e88c7;color:#fff;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;text-decoration:none;padding:10px 26px;border-radius:24px;">Book Now</a></p>
<p style="font-size:11px;color:#9aa8b5;text-align:center;margin:8px 0 0;">Members and non-members welcome.</p>
</td></tr>`;
}

/**
 * Builds the triathlon training HTML block.
 * @param {boolean} triOn
 * @param {string} triDate - ISO date string or ""
 * @param {string} triTitle
 * @param {string} triDesc
 * @param {string} triPrice
 * @returns {string} HTML table row string, or "" if triOn is false
 */
export function buildTriathlonBlock(triOn, triDate, triTitle, triDesc, triPrice) {
  if (!triOn) return "";
  return (
    `<tr><td style="padding:18px 20px;border-bottom:1px solid #e8ecf0;">` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0b2545;border-radius:12px;"><tr><td style="padding:20px;">` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;"><tr>` +
    `<td valign="middle"><p style="font-size:11px;font-weight:bold;color:#e8a838;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Triathlon Training</p>` +
    `<p style="font-family:Georgia,serif;font-size:18px;color:#fff;font-weight:bold;margin:0;">${triTitle || "Triathlon Swim Training"}</p></td>` +
    `<td width="60" valign="middle" style="text-align:right;"><img src="${EMAIL_IMAGE_BASE}/cfclogo.jpg" alt="Cooper Fitness Center" width="52" height="52" style="width:52px;height:52px;border-radius:8px;display:block;margin-left:auto;" /></td>` +
    `</tr></table>` +
    (triDate ? `<p style="font-size:12px;color:#e8a838;font-weight:bold;margin:0 0 10px;">📅 ${fmtDate(triDate)}</p>` : "") +
    `<p style="font-size:12px;color:rgba(255,255,255,0.8);line-height:1.6;margin:0 0 14px;">${triDesc || "Train your swim leg with Coach Bobby."}</p>` +
    (triPrice ? `<p style="font-size:13px;color:#fff;font-weight:bold;margin:0 0 12px;">💰 ${triPrice}</p>` : "") +
    `<a href="${BOOK_URL}" style="display:inline-block;background:#e8a838;color:#0b2545;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;text-decoration:none;padding:9px 22px;border-radius:20px;">Sign Up</a>` +
    `</td></tr></table></td></tr>`
  );
}

/**
 * Builds the Cooper Cyclones swim team HTML block.
 * @param {boolean} teamOn
 * @param {string} teamTitle
 * @param {string} teamDesc
 * @param {string} teamExtra - Additional details, or ""
 * @returns {string} HTML table row string, or "" if teamOn is false
 */
export function buildTeamBlock(teamOn, teamTitle, teamDesc, teamExtra) {
  if (!teamOn) return "";
  return (
    `<tr><td style="padding:18px 20px;border-bottom:1px solid #e8ecf0;">` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8f6fc;border:1px solid #b3dff0;border-left:4px solid #1e88c7;border-radius:8px;"><tr><td style="padding:18px;">` +
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:10px;"><tr>` +
    `<td valign="middle"><p style="font-size:11px;font-weight:bold;color:#1e88c7;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px;">Cooper Cyclones Swim Team</p>` +
    `<p style="font-family:Georgia,serif;font-size:18px;color:#0b2545;font-weight:bold;margin:0;">${teamTitle || "Join the Cooper Cyclones!"}</p></td>` +
    `<td width="70" valign="middle" style="text-align:right;"><img src="${EMAIL_IMAGE_BASE}/cycloneslogo.png" alt="Cooper Cyclones" width="60" height="60" style="width:60px;height:60px;object-fit:contain;display:block;margin-left:auto;" /></td>` +
    `</tr></table>` +
    `<p style="font-size:12px;color:#5a6a78;line-height:1.6;margin:0 0 ${teamExtra ? "12px" : "14px"};">${teamDesc || "Year-round competitive swim team for youth athletes."}</p>` +
    (teamExtra ? `<p style="font-size:12px;color:#5a6a78;line-height:1.6;margin:0 0 14px;">${teamExtra}</p>` : "") +
    `<a href="mailto:${COACH_EMAIL}" style="display:inline-block;background:#1e88c7;color:#fff;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;text-decoration:none;padding:9px 22px;border-radius:20px;">Email Coach Bobby</a>` +
    `</td></tr></table></td></tr>`
  );
}

/**
 * Builds the complete HTML email string.
 * @param {Object} opts - All email options
 * @param {string} opts.poolType
 * @param {string} opts.startD
 * @param {string} opts.endD
 * @param {Array|null} opts.forecast
 * @param {string[]} opts.instOrder
 * @param {Object} opts.insts
 * @param {string} opts.title
 * @param {string} opts.subtitle
 * @param {string[]} opts.bullets
 * @param {boolean} opts.triOn
 * @param {string} opts.triDate
 * @param {string} opts.triTitle
 * @param {string} opts.triDesc
 * @param {string} opts.triPrice
 * @param {boolean} opts.teamOn
 * @param {string} opts.teamTitle
 * @param {string} opts.teamDesc
 * @param {string} opts.teamExtra
 * @returns {string} Full DOCTYPE HTML string
 */
export function buildEmailHtml(opts) {
  const {
    poolType, startD, endD, forecast, instOrder, insts,
    title, subtitle, bullets,
    triOn, triDate, triTitle, triDesc, triPrice,
    teamOn, teamTitle, teamDesc, teamExtra,
  } = opts;

  const dr = startD && endD
    ? fmtDate(startD) + " - " + fmtDate(endD)
    : startD
    ? "Starting " + fmtDate(startD)
    : "Now Available";

  const bl = bullets.filter(Boolean);
  const b0 = bl[0] ? `<p style="font-size:12px;color:#2a3642;margin:0 0 4px;">&#10003; ${bl[0]}</p>` : "";
  const b1 = bl[1] ? `<p style="font-size:12px;color:#2a3642;margin:0;">&#10003; ${bl[1]}</p>` : "";
  const b2 = bl[2] ? `<p style="font-size:12px;color:#2a3642;margin:0 0 4px;">&#10003; ${bl[2]}</p>` : "";
  const b3 = bl[3] ? `<p style="font-size:12px;color:#2a3642;margin:0;">&#10003; ${bl[3]}</p>` : "";

  return `<!DOCTYPE html><html lang="en"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
body,table,td,a{-webkit-text-size-adjust:100%;}
*{box-sizing:border-box;}
table,td{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}
body{margin:0;padding:0;background:#e8ecf0;font-family:Arial,Helvetica,sans-serif;width:100%!important;min-width:100%!important;}
p,td,span,a,div{word-break:break-word;overflow-wrap:break-word;}
img{max-width:100%;height:auto;display:block;}
.con{width:100%!important;max-width:600px!important;}
.scroll-x{overflow-x:auto!important;-webkit-overflow-scrolling:touch;max-width:100%!important;display:block!important;}
@media screen and (max-width:600px){.con{width:100%!important;}.pad{padding:14px 12px!important;}.hh{font-size:19px!important;}}
@media screen and (max-width:400px){.pad{padding:12px 10px!important;}.hh{font-size:17px!important;}.nav-title{font-size:12px!important;}}
</style></head>
<body style="margin:0;padding:0;background:#e8ecf0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#e8ecf0;table-layout:fixed;"><tr><td align="center" style="padding:0;">
<table cellpadding="0" cellspacing="0" border="0" align="center" class="con" style="width:100%;max-width:600px;background:#fff;table-layout:fixed;">

<tr><td class="pad" style="background:#0b2545;padding:16px 20px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
<td width="56" valign="middle"><img src="${EMAIL_IMAGE_BASE}/cfclogo.jpg" alt="Cooper Fitness Center" width="48" height="48" style="width:48px;height:48px;border-radius:6px;display:block;" /></td>
<td style="padding-left:12px;" valign="middle"><span class="nav-title" style="font-family:Georgia,serif;font-size:15px;color:#fff;font-weight:bold;word-break:break-word;">Swim Lessons at Cooper Fitness Center</span></td>
</tr></table></td></tr>

<tr><td class="pad" style="background:#f3f8fc;padding:20px;border-bottom:2px solid #1e88c7;">
<p class="hh" style="font-family:Georgia,serif;font-size:22px;color:#0b2545;line-height:1.2;margin:0 0 8px;">${title || "Private Swim Lessons"}<br><em style="color:#1e88c7;font-weight:normal;">${dr}</em></p>
<p style="font-size:13px;color:#5a6a78;line-height:1.6;margin:0 0 12px;">${subtitle}</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="table-layout:fixed;"><tr>
<td style="width:50%;padding-right:8px;vertical-align:top;">${b0}${b1}</td>
<td style="width:50%;vertical-align:top;">${b2}${b3}</td>
</tr></table></td></tr>

<tr><td style="background:#e8a838;padding:11px 20px;text-align:center;">
<p style="font-family:Georgia,serif;font-size:14px;color:#fff;font-weight:bold;margin:0;">Non-Members Are Always Welcome!</p>
<p style="font-size:11px;color:rgba(255,255,255,0.9);margin:3px 0 0;">No Cooper membership needed. Everyone is invited.</p>
</td></tr>

${buildPoolBlock(poolType)}${buildWeatherBlock(forecast)}${buildInstructorBlock(instOrder, insts)}

${buildRatesBlock()}

${buildTriathlonBlock(triOn, triDate, triTitle, triDesc, triPrice)}${buildTeamBlock(teamOn, teamTitle, teamDesc, teamExtra)}

<tr><td class="pad" style="background:#0b2545;padding:26px 20px;text-align:center;">
<p style="font-family:Georgia,serif;font-size:20px;color:#fff;margin:0 0 6px;font-weight:bold;">Ready to Jump In?</p>
<p style="font-size:13px;color:rgba(255,255,255,0.6);margin:0 0 16px;">Spots fill up fast - book your lesson today!</p>
<a href="${BOOK_URL}" style="display:inline-block;background:#e8a838;color:#0b2545;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;padding:12px 30px;border-radius:28px;">Book a Lesson</a>
<p style="font-size:12px;color:rgba(255,255,255,0.5);margin:14px 0 0;">Questions? Email <a href="mailto:${COACH_EMAIL}" style="color:#e8a838;">${COACH_EMAIL}</a></p>
</td></tr>
<tr><td style="background:#071a33;padding:14px 20px;text-align:center;">
<p style="font-size:10px;color:rgba(255,255,255,0.35);margin:0 0 2px;">${FACILITY_ADDRESS}</p>
<p style="font-size:10px;color:rgba(255,255,255,0.35);margin:0;"><a href="https://cooperfitness.com" style="color:rgba(255,255,255,0.4);text-decoration:none;">cooperfitness.com</a></p>
</td></tr>

</table></td></tr></table></body></html>`;
}
