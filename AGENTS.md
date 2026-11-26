# Hidden History — HyperFrames + Three.js Project Guide

## Overview
- **Format:** `1080×1920` (9:16 vertical), `30 fps`, `134s` (`4,020` frames), **33 scenes**.
- **Style:** 3D cel-shaded / toon-outlined dioramas (Three.js `MeshToonMaterial` + inverted-hull black outlines) paired with upper-third gold serif title cards (`Playfair Display`), Hinglish captions (`Montserrat`), and a persistent `HIDDEN HISTORY` keyhole watermark.
- **Reference breakdown:** See [`ANALYSIS.md`](./ANALYSIS.md) and [`analysis/`](./analysis/).

## Directory Structure
- `index.html` — Root composition (`data-composition-id="main"`, `data-duration="134"`), audio track, title cards, captions, and outro card.
- `scene.js` — Main Three.js renderer (`720×1280` internal WebGL surface scaled to `1080×1920`), GSAP timeline, and `hf-seek` dispatcher.
- `src/toon-kit.js` — Reusable cel-shading helpers (`toonMat`, `addOutline`, `createCharacter`, `createAshokaPillar`, `createTent`, `createTree`, `createBrahmiTexture`).
- `src/scenes-1-11.js`, `src/scenes-12-22.js`, `src/scenes-23-33.js` — Deterministic per-shot 3D scene builders (`render(localTime, duration, renderer)`).
- `assets/vendor/` — Local `three.module.js`, `three.core.js`, `gsap.min.js` (zero network dependency).
- `assets/audio/original-audio.m4a` — Extracted stereo audio track (`134s`). For new scripts or ElevenLabs voiceover tests, replace or layer this `<audio>` element in `index.html`.
- `renders/` — Output MP4s (`sample-5s.mp4`, full render).

## Commands on This Machine (ARM64 Linux)
The snap `/usr/bin/chromium-browser` fails WebGL (`BindToCurrentSequence failed`), and `TMPDIR` under T3's `antigravity-tmp` can hit `SingletonLock` permission errors. Always use Playwright Chromium under `xvfb-run` with `TMPDIR=/tmp`:

```bash
# Check composition (lint, runtime, layout, contrast)
TMPDIR=/tmp HYPERFRAMES_BROWSER_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1148/chrome-linux/chrome \
  xvfb-run -a node /home/ubuntu/.agents/skills/hyperframes/scripts/plugin-cli.mjs check --json

# Snapshot specific timestamps
TMPDIR=/tmp HYPERFRAMES_BROWSER_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1148/chrome-linux/chrome \
  xvfb-run -a node /home/ubuntu/.agents/skills/hyperframes/scripts/plugin-cli.mjs snapshot --at 1,15,45,76,107,132 -o analysis/full_snap

# Render to MP4
TMPDIR=/tmp HYPERFRAMES_BROWSER_PATH=/home/ubuntu/.cache/ms-playwright/chromium-1148/chrome-linux/chrome \
  xvfb-run -a node /home/ubuntu/.agents/skills/hyperframes/scripts/plugin-cli.mjs render --no-browser-gpu -q looks -o renders/hidden-history-full.mp4
```

## Notes for Future Sessions
- **Canonical CLI Version:** Built and verified with HyperFrames CLI `0.9.97` (`node /home/ubuntu/.agents/skills/hyperframes/scripts/plugin-cli.mjs`).
- **Timing Sync Locations:** Shot start/end timestamps live in `src/scenes-*.js` (`start`, `end`); title cards, captions, and the outro card (`131.5s–134s`) live in `index.html` (`data-start`, `data-duration`) and `scene.js` (`#outro-inner`). Keep these synchronized when retiming scenes.
- **Bundled Fonts & Glyphs:** `Playfair Display` and `Montserrat` `.woff2` files are bundled in `assets/fonts/` via `@font-face`, and Brahmi inscriptions are drawn procedurally with vector paths in `src/toon-kit.js` (zero network or system-font dependency).
- **Determinism & Seek Verification:** Never use `Math.random()`, `Date.now()`, or `requestAnimationFrame` inside `src/` or `scene.js`. Verify out-of-order seek equivalence by snapshotting timestamps out of sequence (`--at 128,15,76,15`) and comparing frame hashes.
- **WebGL Capture:** Always keep `preserveDrawingBuffer: true` on `THREE.WebGLRenderer`.
- **Adding New Episodes:** Copy `src/toon-kit.js`, define new scene modules, update `SCENES` timing + `index.html` title cards/captions, and swap `assets/audio/` with your voiceover + music mix.
