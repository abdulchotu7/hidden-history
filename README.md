# Hidden History (HyperFrames + Three.js)

A 134-second (`1080×1920`, `30 fps`, 33 scenes) 3D cel-shaded historical explainer built with **Three.js** and **HyperFrames**.

All fonts (`Playfair Display`, `Montserrat`), Three.js/GSAP vendor scripts, vector Brahmi glyphs, and audio (`assets/audio/original-audio.m4a`) are bundled locally—no external runtime fetches required.

## Run & Render on macOS

### 1. Prerequisites
- **Node.js** (v20+): `brew install node`
- **FFmpeg**: `brew install ffmpeg`
- **Google Chrome** (or Chromium) installed in `/Applications`

### 2. Clone & Install
```bash
git clone https://github.com/abdulchotu7/hidden-history.git
cd hidden-history
npm install
```

*(If `hyperframes` isn't in `package.json` dependencies yet, you can run it directly via `npx hyperframes@0.9.97` or install the HyperFrames skill/CLI globally: `npm i -g hyperframes`.)*

### 3. Check the Composition
```bash
npx hyperframes check
```

### 4. Preview & Edit Live
```bash
npx hyperframes preview
```
Or open the folder in the **HyperFrames Desktop App** (`https://hyperframes.studio/studio/download`).

### 5. Render to MP4
On macOS, Chrome uses your Mac's GPU directly (no `xvfb-run` needed):
```bash
npx hyperframes render -q looks -o renders/hidden-history-full.mp4
```

### 6. Snapshot Specific Timestamps (Optional)
```bash
npx hyperframes snapshot --at 0.5,15,45,76,107,128 -o analysis/mac_snap
```
