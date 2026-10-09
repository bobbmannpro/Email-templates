# Swim Emails

Block-based email builder for Cooper swim emails. Every section is a block you can add, edit, duplicate, hide, reorder, or delete. Nothing is hard-coded: rates, pool info, people, colors, links, and text are all editable in the app.

## How it works
- **Build**: tap a block to edit it. Use **+ Add a block** for ready-made sections (pool location, rates, Cyclones, triathlon, spotlight…) or blank blocks (text, heading, callout, image, video, button, rates, people, weather, divider, signature, custom HTML).
- **People**: your instructor roster. Anyone can be **Featured** (the big dark card).
- **Settings**: dates and weather, subject and preview text, booking link and email, brand colors and fonts.
- **📁 Saved**: save and load presets (for example "Weekly Lessons" or "Cyclones Recruiting"), and export or import them as JSON for backups.
- **Copy HTML**: body-only HTML (banner through signature). The Cooper email builder adds the logo header and footer.

Text shortcuts work in any text box: `**bold**`, `*italic*`, `[label](link)`, and `- ` at the start of a line for a bullet. Tokens: `{book}` `{email}` `{phone}` `{dates}` `{first}`.

## Develop
```bash
npm install
npm run dev     # local
npm test        # renderer tests
npm run build
```
Pushing to `main` deploys to GitHub Pages (`.github/workflows/deploy.yml`).

## Code map
- `src/lib/blocks.js`: every block type (fields + HTML renderer). Add a new kind of section here.
- `src/lib/defaults.js`: starting brand, roster, ready-made templates, and the default email.
- `src/lib/email.js`: assembles the body-only email HTML and the preview page.
- `src/components/`: editor UI.
- Photos live in `public/photos/`. Pick them by filename or paste any image URL.
