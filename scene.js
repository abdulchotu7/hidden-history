import * as THREE from "three";
import { buildScenes1To11 } from "./src/scenes-1-11.js";
import { buildScenes12To22 } from "./src/scenes-12-22.js";
import { buildScenes23To33 } from "./src/scenes-23-33.js";

const RENDER_W = 720;
const RENDER_H = 1280;
const ASPECT = RENDER_W / RENDER_H;
const DURATION = 134;

const canvas = document.getElementById("three-layer");
const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: false,
  antialias: true,
  preserveDrawingBuffer: true,
});
renderer.setSize(RENDER_W, RENDER_H, false);
renderer.setPixelRatio(1);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const allScenes = [
  ...buildScenes1To11(ASPECT),
  ...buildScenes12To22(ASPECT),
  ...buildScenes23To33(ASPECT),
];

function renderAt(t) {
  const clamped = Math.max(0, Math.min(DURATION - 0.001, t));
  let active = allScenes[allScenes.length - 1];
  for (const s of allScenes) {
    if (clamped >= s.start && clamped < s.end) {
      active = s;
      break;
    }
  }
  active.render(clamped - active.start, active.end - active.start, renderer);
}

const playhead = { time: 0 };
const tl = gsap.timeline({ paused: true });
tl.to(playhead, { time: DURATION, duration: DURATION, ease: "none", onUpdate: () => renderAt(playhead.time) }, 0);

// Animate every .title-card-inner cleanly over its parent's [data-start, data-start+data-duration)
document.querySelectorAll(".title-card").forEach((card) => {
  const start = parseFloat(card.dataset.start || "0");
  const dur = parseFloat(card.dataset.duration || "2");
  const inner = card.querySelector(".title-card-inner");
  if (!inner) return;
  tl.fromTo(inner, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, start);
  tl.to(inner, { opacity: 0, duration: 0.25, ease: "power2.in" }, start + dur - 0.28);
});

// Outro card fade-in (131.5s - 134.0s)
tl.fromTo("#outro-inner", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" }, 131.5);

window.addEventListener("hf-seek", (event) => renderAt(event.detail.time));

window.__timelines ??= {};
window.__timelines["main"] = tl;
tl.seek(0);
renderAt(0);
