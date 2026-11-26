import * as THREE from "three";
import {
  addStandardLighting,
  createAshokaPillar,
  createBrahmiTexture,
  createCharacter,
  createTree,
  makeMesh,
  toonMat,
} from "./toon-kit.js";

export function buildScenes12To22(aspect) {
  const scenes = [];

  // S12 (38.40 - 43.90s): Calcutta Mint neoclassical facade
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x4ea8de, 0x8cc8eb, 18, 45);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x9a8f7c));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const mint = new THREE.Group();
    const facade = makeMesh(new THREE.BoxGeometry(10.5, 4.6, 2.4), 0xf0ece1, 1.015);
    facade.position.y = 2.6;
    mint.add(facade);

    const pediment = makeMesh(new THREE.ConeGeometry(4.8, 1.5, 4), 0xe6e0d2, 1.02);
    pediment.rotation.y = Math.PI / 4;
    pediment.scale.set(1.6, 1, 0.5);
    pediment.position.set(0, 5.65, 0.5);
    mint.add(pediment);

    for (let cx = -3.6; cx <= 3.6; cx += 1.44) {
      const col = makeMesh(new THREE.CylinderGeometry(0.18, 0.2, 3.8, 10), 0xf7f4ec, 1.04);
      col.position.set(cx, 2.2, 1.35);
      mint.add(col);
    }
    scene.add(mint);

    const officer = createCharacter({ skin: 0xf2c8a8, robe: 0x1e2838, hair: true, beard: false });
    officer.position.set(-0.5, 0, 2.6);
    officer.scale.setScalar(0.65);
    scene.add(officer);

    scenes.push({
      start: 38.4,
      end: 43.9,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(-0.3 + p * 0.4, 2.1, 13.0 - p * 3.0);
        cam.lookAt(0, 2.6, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S13 (43.90 - 46.40s): James Prinsep in his office
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd4a554, 0xb88635, 10, 28);
    const cam = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toonMat(0x6e4726));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const wall = makeMesh(new THREE.BoxGeometry(10, 7, 0.3), 0xd8b467, 1.01);
    wall.position.set(0, 3.5, -2.2);
    scene.add(wall);

    const desk = makeMesh(new THREE.BoxGeometry(3.0, 0.9, 1.3), 0x543118, 1.03);
    desk.position.set(0, 0.45, 0.5);
    scene.add(desk);

    const prinsep = createCharacter({ skin: 0xf2c8a8, robe: 0x1c2536, hair: true, beard: false });
    prinsep.position.set(0, 0, -0.4);
    scene.add(prinsep);

    scenes.push({
      start: 43.9,
      end: 46.4,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.75, 5.6 - p * 0.8);
        cam.lookAt(0, 1.35, 0);
        prinsep.userData.headGroup.rotation.y = Math.sin(lt * 2.5) * 0.1;
        renderer.render(scene, cam);
      },
    });
  }

  // S14 (46.40 - 53.57s): Sanchi Stupa railing & visitors
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xe8a552, 0xd48332, 14, 38);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0xa67428));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const stupa = makeMesh(new THREE.SphereGeometry(4.8, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), 0xd69a49, 1.015);
    stupa.position.set(1.5, 0, -5.5);
    scene.add(stupa);

    // Curved/angled railing
    for (let i = -3; i <= 3; i++) {
      const post = makeMesh(new THREE.BoxGeometry(0.28, 1.9, 0.28), 0xd9a854, 1.04);
      post.position.set(i * 1.1, 0.95, -1.2);
      scene.add(post);
    }
    const railTop = makeMesh(new THREE.BoxGeometry(7.4, 0.22, 0.32), 0xd9a854, 1.03);
    railTop.position.set(0, 1.85, -1.2);
    scene.add(railTop);

    for (const [vx, col] of [[-1.6, 0x6b2894], [-0.4, 0x285ea8], [0.8, 0x2c8c38], [2.0, 0xf0ece1]]) {
      const v = createCharacter({ skin: 0xa4663b, robe: col, turban: 0xc83224, beard: false });
      v.position.set(vx, 0, 0.6);
      v.scale.setScalar(0.85);
      scene.add(v);
    }

    scenes.push({
      start: 46.4,
      end: 53.57,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(-1.5 + p * 2.2, 1.9, 7.2 - p * 0.8);
        cam.lookAt(0.4, 1.6, -1.5);
        renderer.render(scene, cam);
      },
    });
  }

  // S15 (53.57 - 58.57s): Glowing golden Brahmi characters on stone (progressive reveal)
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd48e24, 0xb87414, 10, 28);
    const cam = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    const baseTex = createBrahmiTexture({ bg: "#c9851a", ink: "#4a2406", glow: false });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.5, 8.5, 0.5), new THREE.MeshBasicMaterial({ map: baseTex }));
    slab.position.set(0, 1.5, 0);
    scene.add(slab);

    const glowTex = createBrahmiTexture({ glow: true, transparentBg: true });
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0 });
    const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 8.5), glowMat);
    glowPlane.position.set(0, 1.5, 0.27);
    scene.add(glowPlane);

    scenes.push({
      start: 53.57,
      end: 58.57,
      render(lt, dur, renderer) {
        const p = lt / dur;
        glowMat.opacity = Math.min(1, Math.max(0, (p - 0.15) * 1.6));
        cam.position.set(0, 1.2 + p * 0.8, 6.2 - p * 1.1);
        cam.lookAt(0, 1.4, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S16 (58.57 - 63.00s): Prinsep studying at desk with India map on wall
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x9c8e78, 0x7a6c58, 10, 28);
    const cam = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toonMat(0x4d3420));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const wall = makeMesh(new THREE.BoxGeometry(10, 7, 0.3), 0xa89b84, 1.01);
    wall.position.set(0, 3.5, -2.2);
    scene.add(wall);

    const mapFrame = makeMesh(new THREE.BoxGeometry(2.4, 1.6, 0.1), 0x4ea8de, 1.03);
    mapFrame.position.set(1.2, 3.2, -2.0);
    scene.add(mapFrame);

    const desk = makeMesh(new THREE.BoxGeometry(3.2, 0.9, 1.4), 0x3b2616, 1.03);
    desk.position.set(0, 0.45, 0.4);
    scene.add(desk);

    const prinsep = createCharacter({ skin: 0xf2c8a8, robe: 0x1c2536, hair: true, beard: false });
    prinsep.position.set(-0.2, 0, -0.5);
    scene.add(prinsep);

    scenes.push({
      start: 58.57,
      end: 63.0,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0.3 - p * 0.4, 1.9, 6.0 - p * 0.7);
        cam.lookAt(0, 1.5, -0.4);
        prinsep.userData.headGroup.rotation.x = 0.18;
        renderer.render(scene, cam);
      },
    });
  }

  // S17 (63.00 - 68.23s): Brahmi glyph grid lighting up on wall
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x877b6a, 0x6b6052, 10, 28);
    const cam = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    const baseTex = createBrahmiTexture({ bg: "#8a7e6e", ink: "#241d15", glow: false });
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(7, 9), new THREE.MeshBasicMaterial({ map: baseTex }));
    wall.position.set(0, 1.5, 0);
    scene.add(wall);

    const glowTex = createBrahmiTexture({ glow: true, transparentBg: true });
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0 });
    const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(7, 9), glowMat);
    glowPlane.position.set(0, 1.5, 0.03);
    scene.add(glowPlane);

    scenes.push({
      start: 63.0,
      end: 68.23,
      render(lt, dur, renderer) {
        const p = lt / dur;
        glowMat.opacity = Math.min(1, Math.max(0, (p - 0.12) * 1.5));
        cam.position.set(0, 1.4, 7.0 - p * 1.4);
        cam.lookAt(0, 1.5, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S18 (68.23 - 74.00s): Pillar inscriptions glowing
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x52b0e6, 0x7cc7f0, 12, 34);
    const cam = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    const tex = createBrahmiTexture({ bg: "#d9c8a9", ink: "#1e160e", glow: false });
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.2, 9.0, 24), new THREE.MeshToonMaterial({ map: tex }));
    shaft.position.set(0, 2.0, 0);
    scene.add(shaft);

    scenes.push({
      start: 68.23,
      end: 74.0,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0.3 - p * 0.5, 1.8 + p * 0.6, 5.4 - p * 0.5);
        cam.lookAt(0, 2.0, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S19 (74.00 - 78.90s): DEVANAMPRIYA PRIYADARSHI over glowing script
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x8f7a58, 0x6b5a40, 10, 28);
    const cam = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    const tex = createBrahmiTexture({ bg: "#e3d2b0", ink: "#241b10", glow: false });
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(3, 2);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.35, 9.0, 24), new THREE.MeshBasicMaterial({ map: tex }));
    shaft.position.set(0, 1.8, 0);
    scene.add(shaft);

    const glowTex = createBrahmiTexture({ glow: true, transparentBg: true });
    glowTex.wrapS = THREE.RepeatWrapping;
    glowTex.wrapT = THREE.RepeatWrapping;
    glowTex.repeat.set(3, 2);
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0 });
    const glowShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.32, 1.37, 9.0, 24), glowMat);
    glowShaft.position.set(0, 1.8, 0);
    scene.add(glowShaft);

    scenes.push({
      start: 74.0,
      end: 78.9,
      render(lt, dur, renderer) {
        const p = lt / dur;
        glowMat.opacity = Math.min(1, Math.max(0, (p - 0.1) * 1.6));
        cam.position.set(0, 1.4 + p * 0.7, 5.6 - p * 0.8);
        cam.lookAt(0, 1.6, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S20 (78.90 - 83.93s): DIPAVAMSA palm-leaf manuscript on stand
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x5c3e26, 0x422b19, 10, 28);
    const cam = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    const ped = makeMesh(new THREE.BoxGeometry(2.6, 1.6, 1.8), 0x4a2914, 1.03);
    ped.position.set(0, 0.8, 0);
    scene.add(ped);

    const book = makeMesh(new THREE.BoxGeometry(2.2, 0.35, 0.9), 0xd4b472, 1.04);
    book.position.set(0, 1.85, 0.1);
    book.rotation.x = 0.25;
    book.rotation.y = -0.3;
    scene.add(book);

    scenes.push({
      start: 78.9,
      end: 83.93,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(-0.6 + p * 0.8, 2.7, 4.8 - p * 0.6);
        cam.lookAt(0, 1.7, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S21 (83.93 - 90.27s): MASKI, KARNATAKA rocky landscape
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x4ea8de, 0x7cc7f0, 16, 44);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x6da632));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    for (const [bx, bz, r] of [[-3.5, -5.5, 2.2], [3.6, -6.5, 2.5], [0.5, -9.0, 3.0]]) {
      const boulder = makeMesh(new THREE.DodecahedronGeometry(r, 1), 0x8f7a62, 1.03);
      boulder.position.set(bx, r * 0.6, bz);
      scene.add(boulder);
    }

    for (let i = 0; i < 4; i++) {
      const p = createCharacter({
        skin: i === 3 ? 0xf2c8a8 : 0xa4663b,
        robe: 0xf0ece1,
        pithHelmet: i === 3,
        turban: i === 3 ? null : 0xf0ece1,
        beard: false,
      });
      p.position.set(-1.5 + i * 1.0, 0, -1.0);
      p.scale.setScalar(0.8);
      scene.add(p);
    }

    scenes.push({
      start: 83.93,
      end: 90.27,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.8, 9.0 - p * 2.2);
        cam.lookAt(0, 1.2, -2.0);
        renderer.render(scene, cam);
      },
    });
  }

  // S22 (90.27 - 93.83s): Indian & British officer in front of rock edict
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x5cb2e6, 0x8cc8eb, 12, 34);
    const cam = new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), toonMat(0x6da632));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const tex = createBrahmiTexture({ bg: "#d9c8a9", ink: "#1e160e", glow: false });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(5.8, 4.4, 0.8), new THREE.MeshToonMaterial({ map: tex }));
    slab.position.set(0, 2.2, -1.5);
    scene.add(slab);

    const ind = createCharacter({ skin: 0xa4663b, robe: 0xf2ede2, turban: 0xd4a438, mustache: true, beard: false });
    ind.position.set(-0.9, 0, 0.6);
    scene.add(ind);

    const brit = createCharacter({ skin: 0xf2c8a8, robe: 0xc2b28a, pithHelmet: true, mustache: true, beard: false });
    brit.position.set(0.9, 0, 0.6);
    scene.add(brit);

    scenes.push({
      start: 90.27,
      end: 93.83,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.45, 5.4 - p * 0.6);
        cam.lookAt(0, 1.35, 0);
        renderer.render(scene, cam);
      },
    });
  }

  return scenes;
}
