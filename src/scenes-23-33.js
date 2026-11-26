import * as THREE from "three";
import {
  addStandardLighting,
  createAshokaPillar,
  createBanknoteTexture,
  createBrahmiTexture,
  createCharacter,
  createTree,
  makeMesh,
  toonMat,
} from "./toon-kit.js";

export function buildScenes23To33(aspect) {
  const scenes = [];

  // S23 (93.83 - 95.90s): Tight shot of rock inscription
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x9a8870, 0x7a6a54, 10, 28);
    const cam = new THREE.PerspectiveCamera(32, aspect, 0.1, 100);
    const tex = createBrahmiTexture({ bg: "#c9b394", ink: "#1c140c", glow: false });
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 8.5), new THREE.MeshBasicMaterial({ map: tex }));
    slab.position.set(0, 1.5, 0);
    scene.add(slab);

    scenes.push({
      start: 93.83,
      end: 95.9,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.5, 5.8 - p * 1.4);
        cam.lookAt(0, 1.5, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S24 (95.90 - 97.00s): ASHOKA glowing out of Brahmi rock script
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x7a6544, 0x5c4a30, 10, 28);
    const cam = new THREE.PerspectiveCamera(32, aspect, 0.1, 100);
    const baseTex = createBrahmiTexture({ bg: "#a88b5a", ink: "#24190c", glow: false });
    const slab = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 8.5), new THREE.MeshBasicMaterial({ map: baseTex }));
    slab.position.set(0, 1.5, 0);
    scene.add(slab);

    const glowTex = createBrahmiTexture({ glow: true, transparentBg: true, highlightText: "ASHOKA" });
    const glowMat = new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, opacity: 0 });
    const glowPlane = new THREE.Mesh(new THREE.PlaneGeometry(5.5, 8.5), glowMat);
    glowPlane.position.set(0, 1.5, 0.03);
    scene.add(glowPlane);

    scenes.push({
      start: 95.9,
      end: 97.0,
      render(lt, dur, renderer) {
        const p = lt / dur;
        glowMat.opacity = Math.min(1, p * 2.0);
        cam.position.set(0, 1.5, 5.2 - p * 0.9);
        cam.lookAt(0, 1.5, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S25 (97.00 - 102.00s): PATALIPUTRA pillared hall with red carpet
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x5cb2e6, 0x99d1f0, 18, 45);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), toonMat(0xe6dcc4));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const carpet = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 24), toonMat(0xc42020));
    carpet.rotation.x = -Math.PI / 2;
    carpet.position.y = 0.02;
    scene.add(carpet);

    for (let z = -8; z <= 4; z += 2.4) {
      for (const x of [-2.4, 2.4]) {
        const col = makeMesh(new THREE.CylinderGeometry(0.24, 0.28, 5.0, 12), 0xf0e8d6, 1.03);
        col.position.set(x, 2.5, z);
        scene.add(col);
      }
    }

    const ashoka = createCharacter({
      skin: 0xa6653a,
      robe: 0xf4efe4,
      turban: 0xf4efe4,
      turbanStripe: 0xd4a438,
      crownGem: true,
      earrings: true,
      beard: false,
    });
    ashoka.position.set(0, 0, -2.5);
    scene.add(ashoka);

    scenes.push({
      start: 97.0,
      end: 102.0,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 2.2, 8.0 - p * 2.2);
        cam.lookAt(0, 1.6, -2.5);
        renderer.render(scene, cam);
      },
    });
  }

  // S26 (102.00 - 105.23s): Ashoka behind Hindustan map table
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd49a48, 0xb87e30, 12, 30);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toonMat(0x8a5228));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const table = makeMesh(new THREE.BoxGeometry(3.8, 0.9, 2.8), 0x6b3d1a, 1.03);
    table.position.set(0, 0.45, 0.6);
    scene.add(table);

    const mapSea = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.2), toonMat(0x52b0e6));
    mapSea.rotation.x = -Math.PI / 2;
    mapSea.position.set(0, 0.92, 0.6);
    scene.add(mapSea);

    const india = makeMesh(new THREE.ConeGeometry(0.95, 0.08, 3), 0xe6d498, 1.03);
    india.rotation.y = Math.PI;
    india.position.set(0, 0.96, 0.6);
    scene.add(india);

    const ashoka = createCharacter({
      skin: 0xa6653a,
      robe: 0xf4efe4,
      turban: 0xf4efe4,
      turbanStripe: 0xd4a438,
      crownGem: true,
      earrings: true,
      beard: false,
    });
    ashoka.position.set(0, 0.2, -1.2);
    scene.add(ashoka);

    scenes.push({
      start: 102.0,
      end: 105.23,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 3.8 - p * 0.4, 5.2 - p * 0.6);
        cam.lookAt(0, 1.2, 0.2);
        renderer.render(scene, cam);
      },
    });
  }

  // S27 (105.23 - 108.87s): KALINGA c. 261 BCE battlefield with broken wheel
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd8889e, 0xe8a87c, 14, 36);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0xc48b28));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Distant dark hills
    for (const [hx, hz, hr] of [[-4.0, -12, 3.5], [3.5, -13, 4.0]]) {
      const hill = makeMesh(new THREE.SphereGeometry(hr, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.5), 0x3b2a14, 1.02);
      hill.position.set(hx, 0, hz);
      scene.add(hill);
    }

    // Broken chariot wheel
    const wheel = makeMesh(new THREE.TorusGeometry(0.7, 0.08, 8, 14), 0x543118, 1.05);
    wheel.rotation.x = Math.PI * 0.42;
    wheel.position.set(-1.3, 0.22, -1.5);
    scene.add(wheel);

    // Foreground & midground tall grass tufts for depth
    for (let i = 0; i < 18; i++) {
      const gx = -2.6 + (i % 6) * 1.05 + (i % 2 ? 0.2 : -0.2);
      const gz = 3.2 - Math.floor(i / 6) * 2.1;
      const tuft = makeMesh(new THREE.ConeGeometry(0.14, 0.65, 5), i % 2 ? 0xd99e26 : 0xb87b1a, 1.04);
      tuft.position.set(gx, 0.3, gz);
      tuft.rotation.z = ((i % 5) - 2) * 0.08;
      scene.add(tuft);
    }

    const ashoka = createCharacter({
      skin: 0xa6653a,
      robe: 0xf4efe4,
      turban: 0xf4efe4,
      turbanStripe: 0xd4a438,
      crownGem: true,
      earrings: true,
      beard: false,
    });
    ashoka.position.set(0, 0, 0.2);
    scene.add(ashoka);

    scenes.push({
      start: 105.23,
      end: 108.87,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.55, 6.2 - p * 0.9);
        cam.lookAt(0, 1.25, 0);
        ashoka.userData.headGroup.rotation.x = 0.12;
        renderer.render(scene, cam);
      },
    });
  }

  // S28 (108.87 - 112.50s): ROCK EDICT 13 wall with Ashoka & scribe
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x52b0e6, 0x8cc8eb, 14, 36);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), toonMat(0x6da632));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const tex = createBrahmiTexture({ bg: "#dfd5c3", ink: "#1c140c", glow: false });
    const slab = new THREE.Mesh(new THREE.BoxGeometry(6.2, 4.8, 0.8), new THREE.MeshToonMaterial({ map: tex }));
    slab.position.set(0, 2.4, -1.6);
    scene.add(slab);

    const ashoka = createCharacter({ skin: 0xa6653a, robe: 0xf4efe4, turban: 0xf4efe4, crownGem: true, earrings: true, beard: false });
    ashoka.position.set(-1.1, 0, 0.8);
    scene.add(ashoka);

    const scribe = createCharacter({ skin: 0xb97a4b, robe: 0xf0ece1, turban: 0xc83224, beard: false });
    scribe.position.set(1.1, 0, 0.6);
    scene.add(scribe);

    scenes.push({
      start: 108.87,
      end: 112.5,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.5, 5.8 - p * 1.1);
        cam.lookAt(0, 1.5, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S29 (112.50 - 114.43s): Villagers by stone well under green trees
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x52b0e6, 0x8cc8eb, 14, 36);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), toonMat(0x52992c));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const well = makeMesh(new THREE.CylinderGeometry(1.1, 1.2, 1.0, 14), 0xa89f91, 1.03);
    well.position.set(0, 0.5, -1.0);
    scene.add(well);

    for (const [tx, tz] of [[-2.6, -3.0], [2.8, -3.2]]) {
      const tr = createTree(1.2);
      tr.position.set(tx, 0, tz);
      scene.add(tr);
    }

    const v1 = createCharacter({ skin: 0xa4663b, robe: 0x245aa8, turban: 0xe6b84c, beard: false });
    v1.position.set(-1.1, 0, 0.4);
    scene.add(v1);

    const v2 = createCharacter({ skin: 0xa4663b, robe: 0xf0ece1, turban: null, hair: true, beard: false });
    v2.position.set(0.9, 0, 0.9);
    v2.scale.setScalar(0.7);
    scene.add(v2);

    scenes.push({
      start: 112.5,
      end: 114.43,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.5, 5.5 - p * 0.5);
        cam.lookAt(0, 1.1, -0.5);
        renderer.render(scene, cam);
      },
    });
  }

  // S30 (114.43 - 117.27s): Tree-lined road with travelers
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x4ea8de, 0x8cc8eb, 16, 42);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), toonMat(0x52992c));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const road = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 40), toonMat(0x6e4726));
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.02;
    scene.add(road);

    for (let z = -12; z <= 4; z += 3.2) {
      for (const x of [-2.2, 2.2]) {
        const tr = createTree(1.1);
        tr.position.set(x, 0, z);
        scene.add(tr);
      }
    }

    const t1 = createCharacter({ skin: 0xa4663b, robe: 0xd4a438, turban: 0xf0ece1, beard: false });
    t1.position.set(-0.3, 0, -2.0);
    t1.scale.setScalar(0.7);
    scene.add(t1);

    scenes.push({
      start: 114.43,
      end: 117.27,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.8, 7.5 - p * 1.5);
        cam.lookAt(0, 1.4, -4.0);
        renderer.render(scene, cam);
      },
    });
  }

  // S31 (117.27 - 121.83s): Shelter/hospital scene with ox & villagers
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x52b0e6, 0x8cc8eb, 14, 36);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), toonMat(0x6da632));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const ox = makeMesh(new THREE.SphereGeometry(0.9, 12, 10), 0xf0ece1, 1.03);
    ox.scale.set(1.5, 0.9, 0.9);
    ox.position.set(1.8, 0.85, -1.0);
    scene.add(ox);

    const healer = createCharacter({ skin: 0xa4663b, robe: 0xd4a438, turban: null, hair: true, beard: true });
    healer.position.set(0, 0, 0.4);
    scene.add(healer);

    const tr = createTree(1.3);
    tr.position.set(-2.5, 0, -2.5);
    scene.add(tr);

    scenes.push({
      start: 117.27,
      end: 121.83,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 1.65, 5.8 - p * 0.8);
        cam.lookAt(0.2, 1.2, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S32 (121.83 - 125.83s): 1,000 YEARS golden pillar
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd8889e, 0xe8a87c, 16, 45);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x52992c));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pillar = createAshokaPillar(11.0, 0xf2c94c, 0xf7d86a);
    pillar.position.set(0, 0, -2.0);
    scene.add(pillar);

    scenes.push({
      start: 121.83,
      end: 125.83,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 2.5 + p * 1.8, 12.0 - p * 1.2);
        cam.lookAt(0, 5.4, -2.0);
        renderer.render(scene, cam);
      },
    });
  }

  // S33 (125.83 - 134.00s): Indian rupee note + coins -> outro card
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x6b3a1a, 0x4d2810, 12, 30);
    const cam = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), toonMat(0x6b3a1a));
    desk.rotation.x = -Math.PI / 2;
    scene.add(desk);

    const noteTex = createBanknoteTexture();
    const note = new THREE.Mesh(
      new THREE.BoxGeometry(3.2, 0.04, 1.6),
      new THREE.MeshBasicMaterial({ map: noteTex })
    );
    note.position.set(-0.2, 0.03, 0);
    note.rotation.y = 0.28;
    scene.add(note);

    for (let i = 0; i < 3; i++) {
      const coin = makeMesh(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 14), 0xf2c94c, 1.05);
      coin.position.set(1.2 + i * 0.45, 0.04, 0.55 - i * 0.15);
      scene.add(coin);
    }

    scenes.push({
      start: 125.83,
      end: 134.0,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0.3, 6.8 - p * 0.6, 3.2);
        cam.lookAt(0.2, 0, 0);
        renderer.render(scene, cam);
      },
    });
  }

  return scenes;
}
