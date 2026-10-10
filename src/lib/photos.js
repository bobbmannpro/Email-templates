// Photo uploads.
// Email apps (Gmail, Outlook…) block images embedded inside the email, so every photo
// must live at a public https URL. We upload straight into the site's public/photos
// folder on GitHub; GitHub Pages then serves it at {imageBase}/{filename} (~1–2 min).

const TOKEN_KEY = "swimEmails_githubToken";
const CACHE_KEY = "swimEmails_photoCache"; // filename -> small data URL, so previews work before GitHub finishes publishing

export const REPO = { owner: "bobbmannpro", repo: "Email-templates", branch: "main", dir: "public/photos" };

const safe = (fn, fallback) => { try { return fn(); } catch { return fallback; } };

export const getToken = () => safe(() => localStorage.getItem(TOKEN_KEY) || "", "");
export const setToken = (t) => safe(() => (t ? localStorage.setItem(TOKEN_KEY, t.trim()) : localStorage.removeItem(TOKEN_KEY)));

let cache = safe(() => JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"), {});
export const photoCache = () => cache;
function cachePut(name, dataUrl) {
  cache = { ...cache, [name]: dataUrl };
  // Keep only the 30 newest so storage never fills up.
  const keys = Object.keys(cache);
  if (keys.length > 30) keys.slice(0, keys.length - 30).forEach((k) => delete cache[k]);
  safe(() => localStorage.setItem(CACHE_KEY, JSON.stringify(cache)));
}

/** "Madeline Shaw" -> "madeline-shaw" */
export function slug(s) {
  return String(s || "photo").toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "photo";
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That file isn't a photo this browser can open. Try a JPG or PNG.")); };
    img.src = url;
  });
}

/**
 * Resize (and for headshots, center-crop square) to an email-friendly JPEG.
 * Phone photos are 3–8 MB; this makes them ~40–150 KB.
 */
export async function preparePhoto(file, { square = true, size = 480, maxWidth = 1200 } = {}) {
  const { img, url } = await loadImage(file);
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  if (square) {
    const s = Math.min(img.naturalWidth, img.naturalHeight);
    // Bias the crop slightly upward — faces usually sit in the top half of portrait shots.
    const sx = (img.naturalWidth - s) / 2;
    const sy = img.naturalHeight > img.naturalWidth ? Math.max(0, (img.naturalHeight - s) * 0.3) : (img.naturalHeight - s) / 2;
    c.width = c.height = Math.min(size, s);
    ctx.drawImage(img, sx, sy, s, s, 0, 0, c.width, c.height);
  } else {
    const scale = Math.min(1, maxWidth / img.naturalWidth);
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(img, 0, 0, c.width, c.height);
  }
  URL.revokeObjectURL(url);
  const dataUrl = c.toDataURL("image/jpeg", 0.86);
  return { dataUrl, base64: dataUrl.split(",")[1] };
}

async function gh(path, opts = {}) {
  const token = getToken();
  const res = await fetch(`https://api.github.com/repos/${REPO.owner}/${REPO.repo}${path}`, {
    ...opts,
    headers: {
      Accept: "application/vnd.github+json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  return res;
}

/** Upload (or replace) public/photos/{filename}. Returns the filename. */
export async function uploadPhoto(filename, base64, dataUrl) {
  if (!getToken()) throw new Error("Connect GitHub first (Settings → Photo uploads).");
  const path = `/contents/${REPO.dir}/${encodeURIComponent(filename)}`;
  // Existing file? GitHub needs its "sha" to replace it.
  let sha;
  const head = await gh(`${path}?ref=${REPO.branch}`);
  if (head.ok) sha = (await head.json()).sha;
  const res = await gh(path, {
    method: "PUT",
    body: JSON.stringify({ message: `Add photo ${filename} (from Swim Emails)`, content: base64, branch: REPO.branch, ...(sha ? { sha } : {}) }),
  });
  if (!res.ok) {
    const msg = res.status === 401 ? "GitHub didn't accept the key — it may be expired or mistyped. Paste a new one in Settings → Photo uploads."
      : res.status === 403 || res.status === 404 ? "That GitHub key can't write to the Email-templates repo. Make sure it has Contents: Read and write on that repo."
      : `GitHub upload failed (${res.status}). Try again in a minute.`;
    throw new Error(msg);
  }
  cachePut(filename, dataUrl);
  return filename;
}

/** Check a token can write to the repo. */
export async function testToken() {
  const res = await gh("");
  if (!res.ok) return { ok: false, msg: res.status === 401 ? "GitHub didn't accept that key." : "That key can't see the Email-templates repo." };
  const j = await res.json();
  return j.permissions && j.permissions.push
    ? { ok: true, msg: "Connected — photo uploads are ready." }
    : { ok: false, msg: "Key works but can't write. Give it Contents: Read and write." };
}

/** Photos already on the site (public repo, no key needed). Falls back to the built-in list. */
export async function listPhotos(fallback) {
  try {
    const res = await gh(`/contents/${REPO.dir}?ref=${REPO.branch}`);
    if (!res.ok) return fallback;
    const items = await res.json();
    const names = items.filter((i) => i.type === "file" && /\.(jpe?g|png|gif)$/i.test(i.name)).map((i) => i.name);
    return [...new Set([...names, ...Object.keys(cache)])].sort();
  } catch {
    return fallback;
  }
}
