import * as THREE from "three";
import {
  addStandardLighting,
  createAshokaPillar,
  createBrahmiTexture,
  createCharacter,
  createTent,
  createTree,
  makeMesh,
  toonMat,
} from "./toon-kit.js";

export function buildScenes1To11(aspect) {
  const scenes = [];

  // S01 (0.00 - 2.03s): Marching soldiers line in desert sunset
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xf6c264, 0xe89b44, 10, 30);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), toonMat(0x8a3a18));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(3.4, 28), new THREE.MeshBasicMaterial({ color: 0xfff0b3 }));
    sunDisc.position.set(2.5, 4.2, -24);
    scene.add(sunDisc);

    const soldiers = [];
    for (let i = 0; i < 12; i++) {
      const s = createCharacter({ skin: 0xa4663b, robe: 0xeee6d8, turban: i % 2 ? 0xc83224 : 0xd4a438, beard: i % 3 === 0 });
      s.position.set(-1.5 + i * 0.2, 0, 2.5 - i * 1.4);
      s.scale.setScalar(0.85);
      scene.add(s);
      soldiers.push(s);
    }

    scenes.push({
      start: 0.0,
      end: 2.03,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(-2.6 + p * 0.8, 1.8, 6.2 - p * 1.1);
        cam.lookAt(-0.4, 1.2, -2.5);
        soldiers.forEach((s, idx) => {
          s.position.y = Math.abs(Math.sin(lt * 7 + idx)) * 0.06;
        });
        renderer.render(scene, cam);
      },
    });
  }

  // S02 (2.03 - 6.77s): Firuz Shah Tughlaq on red dais
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xf4b95a, 0xe89b44, 12, 32);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x8e3b18));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(3.2, 28), new THREE.MeshBasicMaterial({ color: 0xffe9a6 }));
    sunDisc.position.set(-3.5, 4.5, -22);
    scene.add(sunDisc);

    const dais = makeMesh(new THREE.BoxGeometry(3.4, 0.24, 2.8), 0xc42020, 1.02);
    dais.position.set(0, 0.12, 0);
    scene.add(dais);

    for (const [px, pz] of [[-1.5, -1.2], [1.5, -1.2], [-1.5, 1.2], [1.5, 1.2]]) {
      const pole = makeMesh(new THREE.CylinderGeometry(0.04, 0.04, 2.7, 8), 0x4a2912, 1.08);
      pole.position.set(px, 1.4, pz);
      scene.add(pole);
    }
    const canopy = makeMesh(new THREE.ConeGeometry(2.4, 0.55, 4), 0xc83728, 1.02);
    canopy.rotation.y = Math.PI / 4;
    canopy.position.set(0, 2.95, 0);
    scene.add(canopy);

    const sultan = createCharacter({ skin: 0xb97a4b, robe: 0x162b22, turban: 0xf4efe4, turbanStripe: 0x172436, beard: true, aigrette: true });
    sultan.position.set(0, 0.24, 0.1);
    scene.add(sultan);

    const guardL = createCharacter({ skin: 0xa4663b, robe: 0xd9d2c5, turban: 0xc27b30, beard: true });
    guardL.position.set(-2.3, 0, -0.5);
    guardL.scale.setScalar(0.92);
    scene.add(guardL);

    const guardR = createCharacter({ skin: 0xa4663b, robe: 0xd9d2c5, turban: 0xb83024, beard: false });
    guardR.position.set(2.3, 0, -0.6);
    guardR.scale.setScalar(0.92);
    scene.add(guardR);

    for (const [tx, tz, col] of [[-4.5, -5.5, 0xc83224], [-2.2, -7.2, 0x2c6b3f], [3.6, -6.0, 0xc83224], [5.4, -8.5, 0xd4a438]]) {
      const t = createTent(col);
      t.position.set(tx, 0, tz);
      scene.add(t);
    }

    scenes.push({
      start: 2.03,
      end: 6.77,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(-0.4 + p * 0.7, 2.55 - p * 0.15, 10.4 - p * 1.6);
        cam.lookAt(0, 1.55, 0);
        sultan.position.y = 0.24 + Math.sin(lt * 4.2) * 0.015;
        sultan.userData.rightArm.rotation.z = 0.25 + Math.sin(lt * 3.0) * 0.18;
        sultan.userData.rightArm.rotation.x = -0.35 - Math.sin(lt * 3.0) * 0.15;
        sultan.userData.headGroup.rotation.y = Math.sin(lt * 1.8) * 0.08;
        renderer.render(scene, cam);
      },
    });
  }

  // S03 (6.77 - 8.97s): Giant multi-wheeled cart carrying the pillar
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xf2b554, 0xd68536, 10, 30);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x823716));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const cart = new THREE.Group();
    const bed = makeMesh(new THREE.BoxGeometry(1.6, 0.3, 6.2), 0x6e411e, 1.03);
    bed.position.y = 0.85;
    cart.add(bed);

    const pillar = makeMesh(new THREE.CylinderGeometry(0.32, 0.4, 5.8, 14), 0xe3cf9e, 1.03);
    pillar.rotation.x = Math.PI / 2;
    pillar.position.y = 1.35;
    cart.add(pillar);

    const wheels = [];
    for (let wz = -2.2; wz <= 2.2; wz += 1.1) {
      for (const wx of [-0.95, 0.95]) {
        const w = makeMesh(new THREE.CylinderGeometry(0.65, 0.65, 0.14, 14), 0x5c3314, 1.05);
        w.rotation.z = Math.PI / 2;
        w.position.set(wx, 0.65, wz);
        cart.add(w);
        wheels.push(w);
      }
    }
    scene.add(cart);

    const driver = createCharacter({ skin: 0xa4663b, robe: 0xeee6d8, turban: 0xd4a438, beard: true });
    driver.position.set(1.4, 0, 2.2);
    scene.add(driver);

    scenes.push({
      start: 6.77,
      end: 8.97,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cart.position.z = -0.6 + p * 0.9;
        wheels.forEach((w) => (w.rotation.x = p * 3.2));
        cam.position.set(3.2 - p * 0.5, 2.0, 6.8 - p * 0.8);
        cam.lookAt(0, 1.2, 0.4);
        renderer.render(scene, cam);
      },
    });
  }

  // S04 (8.97 - 10.83s): Overhead isometric 8,000 MEN marching past tents
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xa8431b, 0x8a3214, 18, 45);
    const cam = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), toonMat(0x883515));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const army = new THREE.Group();
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 3; col++) {
        const s = createCharacter({ skin: 0xa4663b, robe: 0xf0eadc, turban: 0xd99b2e, beard: false });
        s.position.set(-1.0 + col * 1.0, 0, -6 + row * 1.4);
        s.scale.setScalar(0.65);
        army.add(s);
      }
    }
    scene.add(army);

    for (let i = 0; i < 6; i++) {
      const t = createTent(i % 2 ? 0xc83224 : 0x2c6b3f);
      t.position.set(-4.2 + (i % 2) * 8.4, 0, -5 + Math.floor(i / 2) * 3.5);
      t.scale.setScalar(1.1);
      scene.add(t);
    }

    scenes.push({
      start: 8.97,
      end: 10.83,
      render(lt, dur, renderer) {
        const p = lt / dur;
        army.position.z = p * 1.4;
        cam.position.set(5.5 - p * 0.8, 12.0, 9.5 - p * 1.0);
        cam.lookAt(0, 0, -1.0);
        renderer.render(scene, cam);
      },
    });
  }

  // S05 (10.83 - 13.00s): Aerial desert view TOPRA -> DELHI
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd97d32, 0xc26524, 15, 45);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 120);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), toonMat(0x9e481e));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Winding road
    const road = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 40), toonMat(0xc88d4b));
    road.rotation.x = -Math.PI / 2;
    road.rotation.z = 0.25;
    road.position.y = 0.02;
    scene.add(road);

    for (let i = 0; i < 10; i++) {
      const hut = makeMesh(new THREE.BoxGeometry(0.9, 0.6, 0.9), 0xd4a45a, 1.04);
      hut.position.set((i % 2 ? 1 : -1) * (2.5 + (i % 3) * 1.4), 0.3, -10 + i * 2.1);
      scene.add(hut);
    }

    scenes.push({
      start: 10.83,
      end: 13.0,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0, 11.5 - p * 1.5, 13.0 - p * 3.0);
        cam.lookAt(0, 0, -4.0);
        renderer.render(scene, cam);
      },
    });
  }

  // S06 (13.00 - 17.73s): Arched palace orbit with Ashoka pillar
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x52b0e6, 0x7cc7f0, 22, 55);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 120);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0xd6c297));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const palace = new THREE.Group();
    const darkArchMat = new THREE.MeshBasicMaterial({ color: 0x1d1610 });
    function buildArcadeTier(width, height, depth, numArches, yPos) {
      const tier = new THREE.Group();
      tier.position.y = yPos;
      const body = makeMesh(new THREE.BoxGeometry(width, height, depth), 0xd9c398, 1.015);
      body.position.y = height / 2;
      tier.add(body);
      const spacing = width / (numArches + 0.6);
      for (let i = 0; i < numArches; i++) {
        const ax = -width / 2 + spacing * (i + 0.8);
        const archRect = new THREE.Mesh(new THREE.BoxGeometry(spacing * 0.56, height * 0.58, 0.12), darkArchMat);
        archRect.position.set(ax, height * 0.32, depth / 2 + 0.02);
        tier.add(archRect);
        const archTop = new THREE.Mesh(new THREE.CylinderGeometry(spacing * 0.28, spacing * 0.28, 0.12, 10), darkArchMat);
        archTop.rotation.x = Math.PI / 2;
        archTop.position.set(ax, height * 0.61, depth / 2 + 0.02);
        tier.add(archTop);
      }
      return tier;
    }
    palace.add(buildArcadeTier(9.6, 2.3, 3.6, 8, 0));
    palace.add(buildArcadeTier(8.2, 2.0, 3.0, 7, 2.3));
    palace.add(buildArcadeTier(5.8, 1.7, 2.4, 5, 4.3));

    for (let s = 0; s < 8; s++) {
      const step = makeMesh(new THREE.BoxGeometry(1.5, 0.28, 2.8 - s * 0.25), 0xcbb386, 1.02);
      step.position.set(4.1, 0.14 + s * 0.28, 1.6 - s * 0.12);
      palace.add(step);
    }

    const pillar = createAshokaPillar(7.2);
    pillar.position.set(0, 6.0, 0);
    palace.add(pillar);

    const c1 = createCharacter({ skin: 0xb97a4b, robe: 0xf0ece1, turban: 0xc83224, beard: true });
    c1.position.set(3.8, 2.24, 0.8);
    c1.scale.setScalar(0.58);
    palace.add(c1);

    const c2 = createCharacter({ skin: 0xa4663b, robe: 0x2c6b3f, turban: 0xd4a438, beard: true });
    c2.position.set(4.3, 1.4, 1.1);
    c2.scale.setScalar(0.58);
    palace.add(c2);

    scene.add(palace);

    scenes.push({
      start: 13.0,
      end: 17.73,
      render(lt, dur, renderer) {
        const p = lt / dur;
        const angle = -0.45 + p * 0.55;
        const radius = 25.0 - p * 2.0;
        cam.position.set(Math.sin(angle) * radius, 6.4 + p * 1.6, Math.cos(angle) * radius);
        cam.lookAt(0.4, 7.2 + p * 0.6, 0);
        c1.position.y = 2.24 + Math.abs(Math.sin(lt * 5.0)) * 0.04;
        c2.position.y = 1.4 + Math.abs(Math.cos(lt * 5.0)) * 0.04;
        renderer.render(scene, cam);
      },
    });
  }

  // S07 (17.73 - 20.77s): Sultan gesturing at pillar
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x7ab8de, 0x9acae6, 14, 38);
    const cam = new THREE.PerspectiveCamera(36, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0xd2bf97));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pillar = createAshokaPillar(9.0);
    pillar.position.set(1.2, 0, -2.5);
    scene.add(pillar);

    const sultan = createCharacter({ skin: 0xb97a4b, robe: 0x162b22, turban: 0xf4efe4, turbanStripe: 0x172436, beard: true, aigrette: true });
    sultan.position.set(-0.7, 0, 1.0);
    scene.add(sultan);

    scenes.push({
      start: 17.73,
      end: 20.77,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(-0.3 + p * 0.3, 1.9, 6.8 - p * 0.7);
        cam.lookAt(0, 1.6, 0);
        sultan.userData.rightArm.rotation.z = 0.8 + Math.sin(lt * 4) * 0.15;
        sultan.userData.rightArm.rotation.x = -0.6;
        renderer.render(scene, cam);
      },
    });
  }

  // S08 (20.77 - 22.47s): Close-up character ("NOBODY COULD READ IT")
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x87c3e6, 0xa8d4ee, 10, 30);
    const cam = new THREE.PerspectiveCamera(32, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), toonMat(0xcbb68c));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pillar = createAshokaPillar(8.0);
    pillar.position.set(-1.6, 0, -2.2);
    scene.add(pillar);

    const scholar = createCharacter({ skin: 0xa6653a, robe: 0x8f5829, turban: 0x2c6b3f, turbanStripe: 0xd4a438, beard: true });
    scholar.position.set(0.2, 0, 0.8);
    scene.add(scholar);

    scenes.push({
      start: 20.77,
      end: 22.47,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0.15, 1.65, 4.6 - p * 0.4);
        cam.lookAt(0.15, 1.45, 0.8);
        scholar.userData.headGroup.rotation.y = Math.sin(lt * 5) * 0.15;
        renderer.render(scene, cam);
      },
    });
  }

  // S09 (22.47 - 27.47s): Close-up of carved Brahmi script on pillar
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x7ebee3, 0xa2d0eb, 10, 30);
    const cam = new THREE.PerspectiveCamera(34, aspect, 0.1, 100);
    const tex = createBrahmiTexture({ bg: "#d9c8a9", ink: "#1e160e", glow: false });
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(1.1, 1.15, 8.0, 24),
      new THREE.MeshToonMaterial({ map: tex })
    );
    shaft.position.set(0, 2.0, 0);
    scene.add(shaft);

    scenes.push({
      start: 22.47,
      end: 27.47,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(Math.sin(p * 0.5) * 0.6, 1.8 + p * 0.9, 5.2 - p * 0.6);
        cam.lookAt(0, 1.8 + p * 0.6, 0);
        renderer.render(scene, cam);
      },
    });
  }

  // S10 (27.47 - 31.17s): Pillar in green countryside (LAURIYA NANDANGARH)
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0x4ca8e0, 0x7ec4ed, 16, 45);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x5ea334));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pillar = createAshokaPillar(9.5);
    pillar.position.set(0, 0, -3.5);
    scene.add(pillar);

    for (const [tx, tz, sc] of [[-4.5, -7, 1.1], [4.2, -6.5, 1.2], [-2.5, -10, 0.9], [2.8, -11, 1.0]]) {
      const tree = createTree(sc);
      tree.position.set(tx, 0, tz);
      scene.add(tree);
    }

    const v1 = createCharacter({ skin: 0xb06c3f, robe: 0x245aa8, turban: 0xd99b2e, beard: false });
    v1.position.set(-1.3, 0, 1.4);
    v1.scale.setScalar(0.8);
    scene.add(v1);

    const v2 = createCharacter({ skin: 0xb06c3f, robe: 0xb83024, turban: 0xe6b84c, beard: false });
    v2.position.set(1.5, 0, 1.0);
    v2.scale.setScalar(0.8);
    scene.add(v2);

    scenes.push({
      start: 27.47,
      end: 31.17,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(0.2 - p * 0.4, 2.5 + p * 0.5, 14.5 - p * 1.5);
        cam.lookAt(0, 4.8, -3.5);
        renderer.render(scene, cam);
      },
    });
  }

  // S11 (31.17 - 38.40s): Tall golden-lit pillar against dusk sky
  {
    const scene = new THREE.Scene();
    addStandardLighting(scene, 0xd8889e, 0xe8a87c, 16, 45);
    const cam = new THREE.PerspectiveCamera(38, aspect, 0.1, 100);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), toonMat(0x523722));
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    const pillar = createAshokaPillar(11.0, 0xf2c94c, 0xf7d86a);
    pillar.position.set(0, 0, -2.0);
    scene.add(pillar);

    scenes.push({
      start: 31.17,
      end: 38.4,
      render(lt, dur, renderer) {
        const p = lt / dur;
        cam.position.set(Math.sin(p * 0.4) * 1.2, 2.4 + p * 2.2, 12.5 - p * 1.5);
        cam.lookAt(0, 5.2 + p * 1.0, -2.0);
        renderer.render(scene, cam);
      },
    });
  }

  return scenes;
}
