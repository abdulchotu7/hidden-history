import * as THREE from "three";

// 3-step toon gradient texture for crisp Blender-style cel shading
const gradData = new Uint8Array([95, 175, 255]);
const toonGradient = new THREE.DataTexture(gradData, 3, 1, THREE.RedFormat);
toonGradient.minFilter = THREE.NearestFilter;
toonGradient.magFilter = THREE.NearestFilter;
toonGradient.needsUpdate = true;

export const outlineMat = new THREE.MeshBasicMaterial({
  color: 0x160f09,
  side: THREE.BackSide,
});

export function toonMat(hex, opts = {}) {
  return new THREE.MeshToonMaterial({
    color: hex,
    gradientMap: toonGradient,
    ...opts,
  });
}

export function addOutline(mesh, scale = 1.055) {
  const outline = new THREE.Mesh(mesh.geometry, outlineMat);
  outline.scale.setScalar(scale);
  mesh.add(outline);
  return mesh;
}

export function makeMesh(geo, hex, outlineScale = 1.05, matOpts = {}) {
  const m = new THREE.Mesh(geo, toonMat(hex, matOpts));
  if (outlineScale > 1) addOutline(m, outlineScale);
  return m;
}

export function createCharacter({
  skin = 0xc68652,
  robe = 0x1d3528,
  turban = 0xf2ede2,
  turbanStripe = 0x1a2736,
  beard = true,
  mustache = false,
  aigrette = false,
  crownGem = false,
  pithHelmet = false,
  hair = false,
  sashColor = 0xd4a44a,
  earrings = false,
} = {}) {
  const g = new THREE.Group();

  // Torso/robe
  const body = makeMesh(new THREE.CylinderGeometry(0.28, 0.34, 1.05, 14), robe, 1.06);
  body.position.y = 0.72;
  g.add(body);

  // Waist sash
  const sash = makeMesh(new THREE.CylinderGeometry(0.305, 0.315, 0.12, 14), sashColor, 1.04);
  sash.position.y = 0.68;
  g.add(sash);

  // Feet
  for (const sx of [-0.11, 0.11]) {
    const leg = makeMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 8), 0x2a1c14, 1.08);
    leg.position.set(sx, 0.12, 0);
    g.add(leg);
  }

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.y = 1.52;
  const head = makeMesh(new THREE.SphereGeometry(0.32, 16, 14), skin, 1.06);
  head.scale.set(1, 0.96, 0.95);
  headGroup.add(head);

  // Eyes
  for (const ex of [-0.1, 0.1]) {
    const eyeWhite = new THREE.Mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    eyeWhite.scale.set(1, 1.15, 0.4);
    eyeWhite.position.set(ex, 0.04, 0.28);
    headGroup.add(eyeWhite);

    const pupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0x111111 })
    );
    pupil.position.set(ex, 0.04, 0.305);
    headGroup.add(pupil);
  }

  if (earrings) {
    for (const ex of [-0.33, 0.33]) {
      const ring = makeMesh(new THREE.TorusGeometry(0.045, 0.015, 6, 10), 0xf2c94c, 1.05);
      ring.position.set(ex, -0.04, 0);
      headGroup.add(ring);
    }
  }

  if (beard) {
    const beardMesh = makeMesh(
      new THREE.SphereGeometry(0.305, 14, 10, 0, Math.PI * 2, Math.PI * 0.48, Math.PI * 0.52),
      0x181514,
      1.04
    );
    beardMesh.position.set(0, -0.04, 0.03);
    headGroup.add(beardMesh);
  } else if (mustache) {
    const must = makeMesh(new THREE.BoxGeometry(0.22, 0.045, 0.06), 0x1a1512, 1.04);
    must.position.set(0, -0.06, 0.29);
    headGroup.add(must);
  }

  if (pithHelmet) {
    const brim = makeMesh(new THREE.CylinderGeometry(0.45, 0.48, 0.06, 14), 0xe6dcc4, 1.04);
    brim.position.set(0, 0.22, 0);
    headGroup.add(brim);
    const dome = makeMesh(new THREE.SphereGeometry(0.33, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.5), 0xe6dcc4, 1.05);
    dome.position.set(0, 0.24, 0);
    headGroup.add(dome);
  } else if (hair) {
    const cap = makeMesh(new THREE.SphereGeometry(0.335, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.48), 0x3b2616, 1.05);
    cap.position.set(0, 0.14, -0.02);
    headGroup.add(cap);
  } else if (turban) {
    const turb = makeMesh(new THREE.TorusGeometry(0.26, 0.13, 10, 16), turban, 1.05);
    turb.rotation.x = Math.PI * 0.45;
    turb.position.set(0, 0.2, -0.01);
    headGroup.add(turb);

    const turbBand = makeMesh(new THREE.CylinderGeometry(0.31, 0.32, 0.1, 14), turbanStripe, 1.03);
    turbBand.position.set(0, 0.24, 0);
    headGroup.add(turbBand);

    if (crownGem) {
      const topBun = makeMesh(new THREE.SphereGeometry(0.14, 10, 10), turban, 1.06);
      topBun.position.set(0, 0.36, 0.04);
      headGroup.add(topBun);
    }
    if (aigrette) {
      const feather = makeMesh(new THREE.ConeGeometry(0.06, 0.26, 8), 0xf6f0e2, 1.06);
      feather.position.set(0.08, 0.42, 0.1);
      feather.rotation.z = -0.25;
      headGroup.add(feather);
    }
  }

  g.add(headGroup);

  // Arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.34, 1.12, 0);
  const lMesh = makeMesh(new THREE.CylinderGeometry(0.055, 0.05, 0.52, 8), skin, 1.08);
  lMesh.position.y = -0.22;
  leftArm.add(lMesh);
  g.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.34, 1.12, 0);
  const rMesh = makeMesh(new THREE.CylinderGeometry(0.055, 0.05, 0.52, 8), skin, 1.08);
  rMesh.position.y = -0.22;
  rightArm.add(rMesh);
  g.add(rightArm);

  g.userData = { headGroup, leftArm, rightArm };
  return g;
}

export function createAshokaPillar(height = 8.0, color = 0xe3cf9e, capitalColor = 0xe8c768) {
  const g = new THREE.Group();
  const base = makeMesh(new THREE.BoxGeometry(1.2, 0.7, 1.2), 0xc7ad7c, 1.03);
  base.position.y = 0.35;
  g.add(base);

  const shaft = makeMesh(new THREE.CylinderGeometry(0.24, 0.34, height, 16), color, 1.04);
  shaft.position.y = 0.7 + height / 2;
  g.add(shaft);

  const capital = makeMesh(new THREE.CylinderGeometry(0.42, 0.25, 0.45, 14), capitalColor, 1.05);
  capital.position.y = 0.7 + height + 0.2;
  g.add(capital);

  const finial = makeMesh(new THREE.SphereGeometry(0.32, 12, 12), capitalColor, 1.06);
  finial.position.y = 0.7 + height + 0.65;
  g.add(finial);
  return g;
}

export function createTent(roofColor = 0xc83224) {
  const g = new THREE.Group();
  const base = makeMesh(new THREE.CylinderGeometry(0.75, 0.85, 0.7, 8), 0xe8dec8, 1.03);
  base.position.y = 0.35;
  g.add(base);
  const roof = makeMesh(new THREE.ConeGeometry(0.95, 0.9, 8), roofColor, 1.03);
  roof.position.y = 1.15;
  g.add(roof);
  return g;
}

export function createTree(scale = 1.0, leafColor = 0x3b8c32) {
  const g = new THREE.Group();
  const trunk = makeMesh(new THREE.CylinderGeometry(0.14, 0.2, 1.6, 8), 0x5c3a21, 1.05);
  trunk.position.y = 0.8;
  g.add(trunk);
  const crown = makeMesh(new THREE.SphereGeometry(0.95, 12, 10), leafColor, 1.04);
  crown.scale.set(1.1, 0.85, 1.1);
  crown.position.y = 2.1;
  g.add(crown);
  g.scale.setScalar(scale);
  return g;
}

// Procedural vector Brahmi-inspired glyphs (100% deterministic, zero system-font fallback)
function drawVectorBrahmiGlyph(ctx, idx, cx, cy, r) {
  ctx.beginPath();
  switch (idx % 12) {
    case 0: // + (ka)
      ctx.moveTo(cx - r, cy); ctx.lineTo(cx + r, cy);
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
      break;
    case 1: // ⊥ (dha/ta)
      ctx.moveTo(cx - r, cy + r * 0.8); ctx.lineTo(cx + r, cy + r * 0.8);
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r * 0.8);
      break;
    case 2: // △ (e)
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx + r * 0.9, cy + r * 0.8);
      ctx.lineTo(cx - r * 0.9, cy + r * 0.8); ctx.closePath();
      break;
    case 3: // ○ (tha)
      ctx.arc(cx, cy, r * 0.75, 0, Math.PI * 2);
      break;
    case 4: // ⊔ (pa/ma)
      ctx.moveTo(cx - r * 0.75, cy - r * 0.8); ctx.lineTo(cx - r * 0.75, cy + r * 0.8);
      ctx.lineTo(cx + r * 0.75, cy + r * 0.8); ctx.lineTo(cx + r * 0.75, cy - r * 0.8);
      break;
    case 5: // ⊏ (ba)
      ctx.moveTo(cx + r * 0.75, cy - r * 0.8); ctx.lineTo(cx - r * 0.75, cy - r * 0.8);
      ctx.lineTo(cx - r * 0.75, cy + r * 0.8); ctx.lineTo(cx + r * 0.75, cy + r * 0.8);
      break;
    case 6: // ⋀ (ga)
      ctx.moveTo(cx - r * 0.8, cy + r * 0.85); ctx.lineTo(cx, cy - r * 0.85);
      ctx.lineTo(cx + r * 0.8, cy + r * 0.85);
      break;
    case 7: // ⊢ (ya/va)
      ctx.moveTo(cx, cy - r); ctx.lineTo(cx, cy + r);
      ctx.moveTo(cx, cy); ctx.lineTo(cx + r * 0.8, cy);
      ctx.arc(cx - r * 0.1, cy + r * 0.45, r * 0.45, 0, Math.PI * 2);
      break;
    case 8: // L (la)
      ctx.moveTo(cx - r * 0.6, cy - r); ctx.lineTo(cx - r * 0.6, cy + r * 0.8);
      ctx.lineTo(cx + r * 0.8, cy + r * 0.8);
      break;
    case 9: // E-like (ja)
      ctx.moveTo(cx + r * 0.6, cy - r * 0.8); ctx.lineTo(cx - r * 0.6, cy - r * 0.8);
      ctx.lineTo(cx - r * 0.6, cy + r * 0.8); ctx.lineTo(cx + r * 0.6, cy + r * 0.8);
      ctx.moveTo(cx - r * 0.6, cy); ctx.lineTo(cx + r * 0.5, cy);
      break;
    case 10: // ⫝ (a)
      ctx.moveTo(cx + r * 0.5, cy - r); ctx.lineTo(cx + r * 0.5, cy + r);
      ctx.moveTo(cx - r * 0.7, cy - r * 0.6); ctx.lineTo(cx + r * 0.5, cy);
      ctx.lineTo(cx - r * 0.7, cy + r * 0.6);
      break;
    default: // ⊓ (sa)
      ctx.moveTo(cx - r * 0.75, cy + r * 0.85); ctx.lineTo(cx - r * 0.75, cy - r * 0.75);
      ctx.lineTo(cx + r * 0.75, cy - r * 0.75); ctx.lineTo(cx + r * 0.75, cy + r * 0.85);
      break;
  }
  ctx.stroke();
}

// Procedural CanvasTexture for Brahmi stone inscriptions (and optional golden glow)
export function createBrahmiTexture({
  bg = "#d9c8a9",
  ink = "#1e160e",
  glow = false,
  transparentBg = false,
  highlightText = "",
} = {}) {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext("2d");
  if (!transparentBg) {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 2;
    for (let y = 16; y < 512; y += 32) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(512, y);
      ctx.stroke();
    }
  }

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = glow ? 5 : 4.5;

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const idx = row * 7 + col * 3;
      const x = 42 + col * 60;
      const y = 42 + row * 60;
      if (glow) {
        if ((row + col) % 3 !== 0 && !transparentBg) continue;
        ctx.shadowColor = "#ffd24a";
        ctx.shadowBlur = 18;
        ctx.strokeStyle = "#fff0a8";
      } else {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = ink;
      }
      drawVectorBrahmiGlyph(ctx, idx, x, y, 16);
    }
  }

  if (highlightText) {
    ctx.shadowColor = "#ffd24a";
    ctx.shadowBlur = 24;
    ctx.fillStyle = "#fff1b8";
    ctx.font = "bold 62px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(highlightText, 256, 256);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createBanknoteTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext("2d");

  ctx.fillStyle = "#e8cb68";
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = "#7a5b18";
  ctx.lineWidth = 6;
  ctx.strokeRect(14, 14, 484, 228);
  ctx.lineWidth = 2;
  ctx.strokeRect(24, 24, 464, 208);

  // Watermark oval
  ctx.fillStyle = "#f4df93";
  ctx.beginPath();
  ctx.ellipse(265, 128, 48, 66, 0, 0, Math.PI * 2);
  ctx.fill();

  // Ashoka Lion Capital silhouette on left
  ctx.fillStyle = "#3a290b";
  ctx.fillRect(72, 148, 56, 18);
  ctx.beginPath();
  ctx.arc(100, 118, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(82, 124, 14, 0, Math.PI * 2);
  ctx.arc(118, 124, 14, 0, Math.PI * 2);
  ctx.fill();

  // Rupee symbol on right
  ctx.fillStyle = "#3a290b";
  ctx.font = "bold 76px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("₹", 405, 124);

  ctx.font = "bold 18px serif";
  ctx.fillText("RESERVE BANK", 256, 46);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function addStandardLighting(scene, skyColor = 0xf4b95a, fogColor = 0xe89b44, fogNear = 12, fogFar = 34) {
  scene.background = new THREE.Color(skyColor);
  scene.fog = new THREE.Fog(fogColor, fogNear, fogFar);
  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x5c3519, 1.1));
  const sun = new THREE.DirectionalLight(0xfff5dc, 1.45);
  sun.position.set(-6, 12, 7);
  scene.add(sun);
  return sun;
}
