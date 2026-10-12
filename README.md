# Maria Michalakakou · Interior Design Portal (prototype)

A clickable visual prototype for a high-end, Greek-language interior design studio site.
It shows the immersive features we can offer, using mock content and freely licensed media.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. The intro animation plays once per browser session.

## What's inside

| Page | Route | What it shows |
| --- | --- | --- |
| Home | `/` | Wordmark preloader, cinematic scroll-zoom hero, word-by-word manifesto, pinned horizontal project gallery, material moodboard with cursor-follow previews, before/after slider, process steps |
| 3D room | `/room` | Orbitable living room (React Three Fiber) with hotspots, sofa and armchair fabric swaps (glTF material variants), wall and floor finishes, and morning / dusk / night lighting moods |
| 360° tour | `/tour` | Three-node virtual tour (Photo Sphere Viewer) with walk-through arrows, info hotspots and a room gallery |
| Catalogue | `/catalogue` | Filterable product grid by category and room |
| Product | `/catalogue/[slug]` | Rotatable 3D model with colour variants, specs and calls to action |

Site-wide: Lenis smooth scrolling, a custom cursor, page-transition curtain and a film-grain overlay.

## Design system

- **Fonts:** Noto Serif Display (headings, wordmark) and Manrope (body). Both include full Greek, loaded via `next/font`.
- **Palette** (`app/globals.css`): Ink `#0D0F12`, Graphite `#171B20`, Slate `#2A3038`, Steel blue `#7F9BB0`, Mist `#C5D3DD`, Ivory `#EEE9E1`, Bronze `#A88B67`.
- **Wordmark:** `components/Wordmark.tsx`, spaced display capitals with an optional Greek tagline.

## Content

Mock copy, projects and products live in `lib/content.ts`. Media credits are in [CREDITS.md](CREDITS.md).
