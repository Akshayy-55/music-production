# BeatPath

**Live (GitHub Pages):** [https://akshayy-55.github.io/music-production/](https://akshayy-55.github.io/music-production/)

GitHub repo: [https://github.com/Akshayy-55/music-production](https://github.com/Akshayy-55/music-production)

One hub from absolute beginner → first DJ set + first finished track.

Warm, concrete lessons. Browser practice tools (Tone.js). Progress in `localStorage` (no auth). India-friendly gear tiers. Free & legal resources only — no piracy.

## Open on your computer

```bash
git clone https://github.com/Akshayy-55/music-production.git
cd music-production
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Production static build (local)

```bash
npm run build
npx --yes serve out
```

Hosted site is the static export on the `gh-pages` branch (built with `BASE_PATH=/music-production`). Local builds omit `BASE_PATH` and run at `/`.

### Smoke test (against a running server)

```bash
npm run smoke
# or: node scripts/smoke.mjs http://127.0.0.1:3000
```

## Stack

- Next.js 15 (App Router) + TypeScript — static export (`output: 'export'`)
- Tailwind CSS v4
- Tone.js (metronome, beat pad, EQ, crossfader, ear trainers)
- lucide-react
- Versioned `localStorage` progress (`beatpath-progress-v1`)

## Content

| File | Purpose |
|------|---------|
| `content/curriculum.json` | Source of truth for modules & lessons |
| `content/glossary.json` | ≥40 terms |
| `content/gear.json` | India ₹ tiers |
| `content/software.json` | DJ + DAW comparison |
| `content/resources.json` | Legal free links |

Edit `content/curriculum.json` to change the path; lesson pages are generated from it.

## Routes

- `/` — Today’s Practice (next lesson + rotating drill)
- `/path` — Learning path; DJ/Prod soft-locked until `m3.l5` complete
- `/modules/[moduleId]`, `/lessons/[lessonId]`
- `/practice/*` — metronome, beat-pad, eq-demo, crossfader, ear-drums, ear-feel
- `/glossary`, `/gear`, `/software`, `/resources`, `/about`

## Soft-lock

DJ and Production tracks show a lock until checklist completion of Shared exam lesson **`m3.l5`**. Shared modules stay open.

## License / ethics

Curriculum links are free/legal only. Samples for tools are synthesized with Tone.js (no copyrighted loops). Skills before spend.
