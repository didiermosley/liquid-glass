# Liquid Glass

Refractive "liquid glass" UI elements for React, built on SVG displacement maps inside `backdrop-filter`.

- `components/GlassElement.tsx` – the glass component (fixed or auto size, press state, debug map view)
- `lib/displacement.ts` – displacement map and SVG filter generation (cached)
- `components/Playground.tsx` – live demo: draggable lens, parameter sliders, nav, dock, cards, buttons

Chromium (Chrome, Edge) renders the full refraction. Safari, Firefox and iOS browsers get a frosted-blur fallback.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000.
