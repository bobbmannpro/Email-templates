# Cooper Swim Email Generator

## Quick Start (local)
```bash
npm install
npm run dev
```

## Deploy to Netlify (Free — handles API key securely)

### 1. Push to GitHub
```bash
git init && git add . && git commit -m "init"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/cooper-swim-email.git
git push -u origin main
```

### 2. Connect to Netlify
1. Go to app.netlify.com → sign in with GitHub
2. Add new site → Import existing project → pick your repo
3. Build settings auto-detected from netlify.toml
4. Click Deploy

### 3. Add your Anthropic API key
1. Netlify dashboard → Site configuration → Environment variables
2. Add variable: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
3. Save → Trigger redeploy

AI features (weather fetch + header generator) will work on your live URL.

## Photos
Drop in `public/photos/`:
- bobby.jpg, riley-niksich.jpg, riley-dyke.jpg
- madeline-shaw.jpg, peyton-ganss.jpg, ayden-benel.jpg

Square crop, min 200×200px, under 500KB.
