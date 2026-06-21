import * as THREE from 'three';
import { GridEntity, ItemDefinition } from '../types';

/**
 * Creates a procedural Three.js Object3D/Group representing a specific placed entity.
 * Uses compound geometries, material variety, and proper lighting response so pieces
 * read clearly in both the 2D plan and the 3D viewport.
 */
export function createItemMesh(
  entity: GridEntity,
  itemDef: ItemDefinition,
  isNight: boolean,
  isSunset: boolean
): THREE.Group {
  const group = new THREE.Group();
  group.name = `entity-${entity.id}`;

  const primaryColor = new THREE.Color(entity.customColor || itemDef.color);
  const secondaryColor = itemDef.secondaryColor
    ? new THREE.Color(itemDef.secondaryColor)
    : primaryColor.clone().multiplyScalar(0.72);

  const isStructure = itemDef.category === 'Structures';
  const baseStoreys = 10;
  const storeys = entity.storeys !== undefined
    ? entity.storeys
    : (isStructure ? 10 : undefined);

  const finalHeight = storeys !== undefined
    ? (storeys === 0 ? 0.15 : (storeys / baseStoreys) * itemDef.height)
    : itemDef.height;

  let isEmissive = false;
  let emissiveColor = new THREE.Color(0x000000);
  let emissiveIntensity = 0.0;

  if (itemDef.emissiveColor && (isNight || isSunset)) {
    isEmissive = true;
    emissiveColor = new THREE.Color(itemDef.emissiveColor);
    emissiveIntensity = isNight ? 3.2 : 1.0;
  }

  const createMaterial = (
    color: THREE.Color,
    roughness = 0.55,
    metalness = 0.08,
    transparent = false,
    opacity = 1.0
  ) => {
    return new THREE.MeshStandardMaterial({
      color,
      roughness,
      metalness,
      transparent,
      opacity,
      shadowSide: THREE.DoubleSide,
    });
  };

  const isDaylight = !isNight && !isSunset;
  const mainMat = createMaterial(primaryColor, isStructure && isDaylight ? 0.25 : 0.55, isStructure && isDaylight ? 0.3 : 0.06);

  const glowMat = new THREE.MeshStandardMaterial({
    color: isEmissive ? emissiveColor : secondaryColor,
    emissive: isEmissive ? emissiveColor : new THREE.Color(0x000000),
    emissiveIntensity,
    roughness: 0.25,
    metalness: 0.08,
  });

  const secMat = createMaterial(secondaryColor, 0.45, 0.1);
  const darkMat = createMaterial(new THREE.Color(0x232730), 0.6, 0.35);
  const metalMat = createMaterial(new THREE.Color(0x9aa7b0), 0.22, 0.85);
  const fabricMat = createMaterial(primaryColor, 0.85, 0.0);
  const woodMat = createMaterial(primaryColor, 0.5, 0.04);

  const glassMat = new THREE.MeshStandardMaterial({
    color: isDaylight ? new THREE.Color(0x1976d2) : new THREE.Color(0x80deea),
    roughness: 0.05,
    metalness: 0.9,
    transparent: true,
    opacity: isDaylight ? 0.65 : 0.4,
    shadowSide: THREE.DoubleSide,
  });

  const ceramicMat = createMaterial(new THREE.Color(entity.customColor || itemDef.color), 0.15, 0.0);

  const tileWidth = 0.95;

  // --- shared helper builders -------------------------------------------------

  /** Generic chair: base/legs, seat cushion, backrest. Footprint-aware. */
  const buildChair = (opts: { seatH: number; hasArms?: boolean; swivel?: boolean }) => {
    const { seatH, hasArms, swivel } = opts;
    if (swivel) {
      const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.04, 16), darkMat);
      baseRing.position.y = 0.02;
      group.add(baseRing);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, seatH - 0.08, 8), metalMat);
      stem.position.y = seatH / 2;
      group.add(stem);
    } else {
      [[-0.16, -0.16], [0.16, -0.16], [-0.16, 0.16], [0.16, 0.16]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, seatH - 0.04, 6), woodMat);
        leg.position.set(x, (seatH - 0.04) / 2, z);
        leg.castShadow = true;
        group.add(leg);
      });
    }
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.07, 0.42), fabricMat);
    seat.position.y = seatH;
    seat.castShadow = true;
    seat.receiveShadow = true;
    group.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.5, 0.06), fabricMat);
    back.position.set(0, seatH + 0.28, -0.18);
    back.castShadow = true;
    group.add(back);

    if (hasArms) {
      [-0.21, 0.21].forEach((x) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.36), darkMat);
        arm.position.set(x, seatH + 0.12, -0.02);
        group.add(arm);
      });
    }
  };

  /** Generic tall/short cabinet-style case furniture (wardrobe, dresser, pantry, sideboard). */
  const buildCabinet = (w: number, h: number, d: number, drawerRows: number, doors: number) => {
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mainMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    if (doors > 0) {
      const doorW = (w - 0.04) / doors;
      for (let i = 0; i < doors; i++) {
        const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(doorW - 0.02, h - 0.1, 0.02), secMat);
        doorPanel.position.set(-w / 2 + doorW * i + doorW / 2 + 0.01, h / 2, d / 2 + 0.011);
        group.add(doorPanel);
        const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.12, 6), metalMat);
        handle.rotation.z = Math.PI / 2;
        handle.position.set(-w / 2 + doorW * i + doorW - 0.04, h / 2, d / 2 + 0.03);
        group.add(handle);
      }
    } else {
      for (let r = 0; r < drawerRows; r++) {
        const rowH = (h - 0.08) / drawerRows;
        const drawer = new THREE.Mesh(new THREE.BoxGeometry(w - 0.06, rowH - 0.025, 0.02), secMat);
        drawer.position.set(0, rowH / 2 + r * rowH + 0.04, d / 2 + 0.011);
        group.add(drawer);
        const handle = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.018, 0.02), metalMat);
        handle.position.set(0, rowH / 2 + r * rowH + 0.04, d / 2 + 0.03);
        group.add(handle);
      }
    }
  };

  /** Generic boxy appliance with a contrasting front control panel. */
  const buildAppliance = (w: number, h: number, d: number, panelGlow = false) => {
    const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mainMat);
    body.position.y = h / 2;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(w * 0.5, h * 0.16, 0.02), panelGlow ? glowMat : darkMat);
    panel.position.set(0, h * 0.82, d / 2 + 0.011);
    group.add(panel);

    const handle = new THREE.Mesh(new THREE.BoxGeometry(w * 0.42, 0.025, 0.02), metalMat);
    handle.position.set(0, h * 0.55, d / 2 + 0.02);
    group.add(handle);
  };

  /** Generic wall-mounted door leaf within a 1x1 tile, used for swing/folding doors. */
  const buildDoorLeaf = (folding = false) => {
    const frameThickness = 0.12;
    const colL = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, itemDef.height, 0.16), secMat);
    colL.position.set(-tileWidth / 2 + frameThickness / 2, itemDef.height / 2, 0);
    const colR = colL.clone();
    colR.position.x = tileWidth / 2 - frameThickness / 2;
    group.add(colL, colR);

    const leafW = tileWidth - frameThickness * 2 - 0.04;
    if (folding) {
      const half = leafW / 2;
      const leaf1 = new THREE.Mesh(new THREE.BoxGeometry(half, itemDef.height - 0.1, 0.04), mainMat);
      leaf1.position.set(-leafW / 4, (itemDef.height - 0.1) / 2, 0.04);
      leaf1.rotation.y = 0.5;
      const leaf2 = leaf1.clone();
      leaf2.position.x = leafW / 4;
      leaf2.rotation.y = -0.5;
      group.add(leaf1, leaf2);
    } else {
      const leaf = new THREE.Mesh(new THREE.BoxGeometry(leafW, itemDef.height - 0.1, 0.05), mainMat);
      leaf.position.set(-0.05, (itemDef.height - 0.1) / 2, 0.05);
      leaf.rotation.y = 0.55;
      leaf.castShadow = true;
      group.add(leaf);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), metalMat);
      knob.position.set(leafW * Math.cos(0.55) - 0.05, (itemDef.height - 0.1) * 0.45, leafW * Math.sin(0.55) + 0.05);
      group.add(knob);
    }
  };

  /** Generic sanitary fixture base (basin / mirror / shower glass). */
  const buildBasin = () => {
    const counter = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.4), ceramicMat);
    counter.position.y = 0.82;
    counter.castShadow = true;
    group.add(counter);
    const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.12, 16), ceramicMat);
    bowl.position.set(0, 0.74, 0);
    group.add(bowl);
    const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.18, 6), metalMat);
    tap.position.set(0, 0.92, -0.12);
    group.add(tap);
    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.7, 10), ceramicMat);
    pedestal.position.y = 0.35;
    group.add(pedestal);
  };

  // --- specific item builders --------------------------------------------------

  switch (itemDef.id) {
    // ===== WALLS =====
    case 'wall-concrete':
    case 'wall-drywall':
    case 'wall-partition': {
      const wallGeo = new THREE.BoxGeometry(tileWidth, itemDef.height, 0.14);
      const wall = new THREE.Mesh(wallGeo, mainMat);
      wall.position.y = itemDef.height / 2;
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);
      // subtle base trim for visual depth
      const trim = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.06, 0.16), secMat);
      trim.position.y = 0.03;
      group.add(trim);
      break;
    }

    case 'wall-window': {
      const colWidth = 0.18;
      const wallSec = new THREE.Mesh(new THREE.BoxGeometry(colWidth, itemDef.height, 0.14), mainMat);
      wallSec.position.set(-tileWidth / 2 + colWidth / 2, itemDef.height / 2, 0);
      wallSec.castShadow = true;
      const wallSecR = wallSec.clone();
      wallSecR.position.x = tileWidth / 2 - colWidth / 2;
      group.add(wallSec, wallSecR);

      const headerGeo = new THREE.BoxGeometry(tileWidth, 0.4, 0.14);
      const header = new THREE.Mesh(headerGeo, mainMat);
      header.position.set(0, itemDef.height - 0.2, 0);
      header.castShadow = true;
      group.add(header);

      const winH = itemDef.height - 0.4;
      const centerWinGeo = new THREE.BoxGeometry(tileWidth - colWidth * 2, winH, 0.04);
      const win = new THREE.Mesh(centerWinGeo, glassMat);
      win.position.set(0, winH / 2, 0);
      group.add(win);

      const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.03, winH, 0.05), secMat);
      mullion.position.set(0, winH / 2, 0);
      group.add(mullion);
      break;
    }

    case 'wall-bay-window': {
      const sillGeo = new THREE.BoxGeometry(1.9, 0.08, 0.5);
      const sill = new THREE.Mesh(sillGeo, secMat);
      sill.position.set(0.48, 0.05, 0.15);
      group.add(sill);

      const panes = [
        { x: -0.05, z: 0.15, ry: 0 },
        { x: 0.48, z: 0.3, ry: 0 },
        { x: 1.0, z: 0.15, ry: 0 },
      ];
      panes.forEach((p) => {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.3, 0.06), mainMat);
        frame.position.set(p.x, 0.75 + 0.05, p.z);
        group.add(frame);
        const pane = new THREE.Mesh(new THREE.BoxGeometry(0.78, 1.1, 0.03), glassMat);
        pane.position.set(p.x, 0.75 + 0.05, p.z + 0.02);
        group.add(pane);
      });
      break;
    }

    case 'wall-swing-door': {
      buildDoorLeaf(false);
      break;
    }

    case 'wall-folding-door': {
      buildDoorLeaf(true);
      break;
    }

    case 'wall-sliding-door': {
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.12, itemDef.height, 0.16), mainMat);
      edge.position.set(-tileWidth / 2 + 0.06, itemDef.height / 2, 0);
      const edgeR = edge.clone();
      edgeR.position.x = tileWidth / 2 - 0.06;
      group.add(edge, edgeR);

      const sliderRails = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.08, 0.16), darkMat);
      sliderRails.position.set(0, 0.04, 0);
      const upperRails = sliderRails.clone();
      upperRails.position.y = itemDef.height - 0.04;
      group.add(sliderRails, upperRails);

      const sH = itemDef.height - 0.16;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.68, sH, 0.04), glassMat);
      panel.position.set(0.1, sH / 2 + 0.08, -0.02);
      group.add(panel);
      break;
    }

    // ===== STRUCTURES =====
    case 'structure-column': {
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, itemDef.height, 12), mainMat);
      shaft.position.y = itemDef.height / 2;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      group.add(shaft);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 0.5), secMat);
      cap.position.y = itemDef.height - 0.05;
      group.add(cap);
      const base = cap.clone();
      base.position.y = 0.05;
      group.add(base);
      break;
    }

    case 'structure-staircase': {
      const steps = 8;
      for (let i = 0; i < steps; i++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.06, 1.8 / steps), mainMat);
        step.position.set(0, (i + 1) * (itemDef.height / steps), -0.9 + i * (1.8 / steps) + 0.9 / steps);
        step.castShadow = true;
        step.receiveShadow = true;
        group.add(step);
      }
      const railL = new THREE.Mesh(new THREE.BoxGeometry(0.04, itemDef.height, 0.04), metalMat);
      railL.position.set(-0.42, itemDef.height / 2, 0);
      railL.rotation.x = 0.42;
      const railR = railL.clone();
      railR.position.x = 0.42;
      group.add(railL, railR);
      break;
    }

    // ===== FLOORING =====
    case 'floor-hardwood': {
      const plankGeo = new THREE.BoxGeometry(tileWidth, 0.05, tileWidth);
      const wood = new THREE.Mesh(plankGeo, mainMat);
      wood.receiveShadow = true;
      group.add(wood);
      for (let x = -0.3; x <= 0.3; x += 0.3) {
        const line = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.008, 0.95), secMat);
        line.position.set(x, 0.026, 0);
        group.add(line);
      }
      break;
    }

    case 'floor-tile': {
      const tile = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), mainMat);
      tile.receiveShadow = true;
      group.add(tile);
      const lineX = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.008, 0.018), secMat);
      lineX.position.set(0, 0.026, 0);
      group.add(lineX);
      const lineZ = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, tileWidth), secMat);
      lineZ.position.set(0, 0.026, 0);
      group.add(lineZ);
      break;
    }

    // ===== LIGHTING FIXTURES =====
    case 'fixture-spotlight': {
      const hCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), darkMat);
      hCyl.position.y = itemDef.height - 0.075;
      group.add(hCyl);
      const coneLight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
      coneLight.position.y = itemDef.height - 0.18;
      group.add(coneLight);
      if (isNight || isSunset) {
        const projection = new THREE.CylinderGeometry(0.08, 0.8, 2.0, 12, 1, true);
        projection.translate(0, -1.0, 0);
        const projectionMat = new THREE.MeshBasicMaterial({
          color: 0xffea00, transparent: true, opacity: isNight ? 0.22 : 0.08, side: THREE.DoubleSide,
        });
        const lightBeam = new THREE.Mesh(projection, projectionMat);
        lightBeam.position.y = itemDef.height - 0.18;
        group.add(lightBeam);
      }
      break;
    }

    case 'fixture-sconce': {
      const mount = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.2, 0.1), darkMat);
      mount.position.set(-tileWidth / 2 + 0.025, 1.5, 0);
      group.add(mount);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.12, 6), metalMat);
      tube.position.set(-tileWidth / 2 + 0.07, 1.5, 0);
      group.add(tube);
      const bulbSet = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), glowMat);
      bulbSet.position.set(-tileWidth / 2 + 0.07, 1.58, 0);
      group.add(bulbSet);
      break;
    }

    // ===== LIVING & DINING =====
    case 'furniture-sofa-set': {
      const baseMain = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.32, 0.85), fabricMat);
      baseMain.position.set(1.4, 0.16, 0.4);
      baseMain.castShadow = true;
      group.add(baseMain);
      const back = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.55, 0.2), fabricMat);
      back.position.set(1.4, 0.55, -0.075);
      back.castShadow = true;
      group.add(back);
      for (let i = 0; i < 4; i++) {
        const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.16, 0.7), secMat);
        cushion.position.set(0.4 + i * 0.65, 0.4, 0.4);
        cushion.castShadow = true;
        group.add(cushion);
      }
      [0.08, 2.72].forEach((x) => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.85), fabricMat);
        arm.position.set(x, 0.25, 0.4);
        group.add(arm);
      });
      break;
    }

    case 'furniture-coffee-table': {
      const top = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.05, 0.55), woodMat);
      top.position.set(0.48, 0.42, 0);
      top.castShadow = true;
      group.add(top);
      [[0.1, -0.2], [0.86, -0.2], [0.1, 0.2], [0.86, 0.2]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.4, 6), secMat);
        leg.position.set(x, 0.2, z);
        leg.castShadow = true;
        group.add(leg);
      });
      break;
    }

    case 'furniture-tv-console': {
      const stand = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.5, 0.4), mainMat);
      stand.position.set(1.4, 0.25, 0);
      stand.castShadow = true;
      group.add(stand);
      const screen = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.95, 0.05), darkMat);
      screen.position.set(1.4, 1.0, -0.1);
      screen.castShadow = true;
      group.add(screen);
      const display = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.88, 0.01), glowMat);
      display.position.set(1.4, 1.0, -0.072);
      group.add(display);
      break;
    }

    case 'furniture-accent-chair': {
      buildChair({ seatH: 0.46, hasArms: true });
      break;
    }

    case 'furniture-office-chair': {
      buildChair({ seatH: 0.48, hasArms: true, swivel: true });
      break;
    }

    case 'furniture-bar-stool': {
      buildChair({ seatH: 0.7, swivel: true });
      break;
    }

    case 'furniture-dining-chairs': {
      buildChair({ seatH: 0.46 });
      break;
    }

    case 'furniture-dining-table-large': {
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.06, 1.85), woodMat);
      top.position.set(1.4, 0.74, 0.48);
      top.castShadow = true;
      group.add(top);
      [[0.15, 0.15], [2.65, 0.15], [0.15, 0.81], [2.65, 0.81]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.08), secMat);
        leg.position.set(x, 0.35, z);
        leg.castShadow = true;
        group.add(leg);
      });
      break;
    }

    case 'furniture-sideboard': {
      group.position.set(0, 0, 0);
      buildCabinet(1.9, 0.9, 0.45, 0, 2);
      break;
    }

    case 'furniture-bookshelf': {
      const shellGeo = new THREE.BoxGeometry(0.85, 2.05, 0.38);
      const cover = new THREE.Mesh(shellGeo, mainMat);
      cover.position.y = 1.025;
      cover.castShadow = true;
      group.add(cover);
      for (let h = 0.3; h < 1.9; h += 0.45) {
        const bookG = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.22), secMat);
        bookG.position.set(0.12, h, 0.08);
        group.add(bookG);
      }
      break;
    }

    // ===== BEDROOM =====
    case 'furniture-bed-frame': {
      const woodenBase = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.25, 1.84), woodMat);
      woodenBase.position.set(0.48, 0.125, 0.48);
      woodenBase.castShadow = true;
      woodenBase.receiveShadow = true;
      group.add(woodenBase);

      const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.32, 1.72), createMaterial(new THREE.Color(0xf5f5f5), 0.8, 0));
      mattress.position.set(0.48, 0.41, 0.48);
      mattress.castShadow = true;
      group.add(mattress);

      const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.18, 1.1), secMat);
      duvet.position.set(0.48, 0.5, 0.78);
      duvet.castShadow = true;
      group.add(duvet);

      [0.15, 0.81].forEach((off) => {
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.32), createMaterial(new THREE.Color(0xffffff), 0.9, 0));
        pillow.position.set(off, 0.62, 0.1);
        group.add(pillow);
      });

      [[0.06, 0.06], [0.9, 0.06], [0.06, 0.9], [0.9, 0.9]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, 0.06), secMat);
        leg.position.set(x, 0.05, z);
        group.add(leg);
      });
      break;
    }

    case 'furniture-nightstand': {
      buildCabinet(0.5, 0.5, 0.45, 2, 0);
      break;
    }

    case 'furniture-wardrobe': {
      buildCabinet(1.85, 2.2, 0.55, 0, 2);
      break;
    }

    case 'furniture-dresser': {
      buildCabinet(1.85, 0.9, 0.5, 3, 0);
      break;
    }

    case 'furniture-vanity-table': {
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.5), woodMat);
      top.position.set(0.48, 0.72, 0);
      top.castShadow = true;
      group.add(top);
      const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.65, 0.45), secMat);
      drawerBlock.position.set(0.85, 0.36, 0);
      group.add(drawerBlock);
      const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.04), secMat);
      mirrorFrame.position.set(0.1, 1.1, -0.2);
      group.add(mirrorFrame);
      const mirrorGlass = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.01), glassMat);
      mirrorGlass.position.set(0.1, 1.1, -0.18);
      group.add(mirrorGlass);
      break;
    }

    case 'furniture-bench': {
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.12, 0.5), fabricMat);
      top.position.set(0.48, 0.39, 0);
      top.castShadow = true;
      group.add(top);
      [[0.1, -0.18], [0.86, -0.18], [0.1, 0.18], [0.86, 0.18]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.33, 0.05), secMat);
        leg.position.set(x, 0.165, z);
        group.add(leg);
      });
      break;
    }

    // ===== KITCHEN =====
    case 'fixture-kitchen-counter': {
      const cabinet = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.88, 0.44), mainMat);
      cabinet.position.set(0.48, 0.44, 0);
      cabinet.castShadow = true;
      cabinet.receiveShadow = true;
      group.add(cabinet);
      const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 6), metalMat);
      tap.position.set(0.48, 0.98, 0.1);
      group.add(tap);
      const sink = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.01, 0.32), darkMat);
      sink.position.set(0.48, 0.885, -0.05);
      group.add(sink);
      break;
    }

    case 'fixture-kitchen-sink': {
      const counter = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), ceramicMat);
      counter.position.y = 0.87;
      group.add(counter);
      const basin = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.18, 0.6), darkMat);
      basin.position.y = 0.78;
      group.add(basin);
      const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.3, 6), metalMat);
      tap.position.set(0, 1.02, -0.2);
      group.add(tap);
      const cabinetBelow = new THREE.Mesh(new THREE.BoxGeometry(tileWidth - 0.06, 0.78, tileWidth - 0.1), mainMat);
      cabinetBelow.position.y = 0.39;
      cabinetBelow.castShadow = true;
      group.add(cabinetBelow);
      break;
    }

    case 'fixture-refrigerator': {
      const fridgeGeo = new THREE.BoxGeometry(tileWidth - 0.1, 1.95, tileWidth - 0.1);
      const body = new THREE.Mesh(fridgeGeo, mainMat);
      body.position.y = 1.0;
      body.castShadow = true;
      group.add(body);
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.04), metalMat);
      handle.position.set(0.12, 1.2, tileWidth / 2 - 0.04);
      group.add(handle);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.02), glowMat);
      panel.position.set(-0.15, 1.4, tileWidth / 2 - 0.04);
      group.add(panel);
      break;
    }

    case 'fixture-cooking-range': {
      buildAppliance(tileWidth - 0.06, 0.88, tileWidth - 0.1, false);
      [[-0.22, -0.18], [0.22, -0.18], [-0.22, 0.18], [0.22, 0.18]].forEach(([x, z]) => {
        const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.015, 12), darkMat);
        burner.position.set(x, 0.89, z);
        group.add(burner);
      });
      break;
    }

    case 'fixture-dishwasher': {
      buildAppliance(tileWidth - 0.08, 0.88, tileWidth - 0.12, false);
      break;
    }

    case 'fixture-kitchen-island': {
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.85, 0.85, 0.9), mainMat);
      body.position.set(1.4, 0.425, 0.45);
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.06, 1.0), ceramicMat);
      top.position.set(1.4, 0.88, 0.45);
      group.add(top);
      break;
    }

    case 'furniture-pantry-cabinet': {
      buildCabinet(0.9, 2.1, 0.5, 0, 1);
      break;
    }

    // ===== BATHROOM =====
    case 'fixture-wash-basin': {
      buildBasin();
      break;
    }

    case 'fixture-toilet-bowl': {
      const tank = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.22), ceramicMat);
      tank.position.set(0, 0.525, -0.28);
      tank.castShadow = true;
      group.add(tank);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.4, 12), ceramicMat);
      bowl.position.set(0, 0.2, 0.06);
      bowl.scale.set(1.1, 1.0, 1.35);
      bowl.castShadow = true;
      group.add(bowl);
      const seat = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.025, 8, 16), createMaterial(new THREE.Color(0xffffff), 0.4, 0));
      seat.rotation.x = Math.PI / 2;
      seat.position.set(0, 0.39, 0.08);
      group.add(seat);
      break;
    }

    case 'fixture-shower-enclosure': {
      const tray = new THREE.Mesh(new THREE.BoxGeometry(tileWidth - 0.06, 0.06, tileWidth - 0.06), ceramicMat);
      tray.position.y = 0.03;
      group.add(tray);
      const glassPanelA = new THREE.Mesh(new THREE.BoxGeometry(tileWidth - 0.1, itemDef.height - 0.1, 0.03), glassMat);
      glassPanelA.position.set(0, (itemDef.height - 0.1) / 2 + 0.06, tileWidth / 2 - 0.05);
      group.add(glassPanelA);
      const glassPanelB = glassPanelA.clone();
      glassPanelB.rotation.y = Math.PI / 2;
      glassPanelB.position.set(tileWidth / 2 - 0.05, (itemDef.height - 0.1) / 2 + 0.06, 0);
      group.add(glassPanelB);
      const showerHead = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 10), metalMat);
      showerHead.position.set(-0.3, itemDef.height - 0.3, -0.3);
      group.add(showerHead);
      break;
    }

    case 'fixture-bathtub': {
      const exterior = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 0.8), ceramicMat);
      exterior.position.set(0.35, 0.325, 0);
      exterior.castShadow = true;
      group.add(exterior);
      const waterTub = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.01, 0.68), secMat);
      waterTub.position.set(0.35, 0.55, 0);
      group.add(waterTub);
      const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 6), metalMat);
      tap.position.set(1.1, 0.7, 0);
      group.add(tap);
      break;
    }

    case 'fixture-vanity-mirror': {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.75, 0.04), secMat);
      frame.position.set(0, itemDef.height, -0.03);
      group.add(frame);
      const glass = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.67, 0.01), glassMat);
      glass.position.set(0, itemDef.height, -0.01);
      group.add(glass);
      break;
    }

    // ===== OFFICE & UTILITY =====
    case 'furniture-study-desk': {
      const top = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.05, 0.85), woodMat);
      top.position.set(0.48, 0.72, 0);
      top.castShadow = true;
      group.add(top);
      const drawerBlock = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.65, 0.8), secMat);
      drawerBlock.position.set(1.1, 0.36, 0);
      group.add(drawerBlock);
      [[0.06, -0.34], [0.06, 0.34]].forEach(([x, z]) => {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.65, 0.05), secMat);
        leg.position.set(x, 0.36, z);
        group.add(leg);
      });
      break;
    }

    case 'fixture-washing-machine': {
      buildAppliance(tileWidth - 0.08, 0.85, tileWidth - 0.1, true);
      const door = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.03, 16), darkMat);
      door.rotation.x = Math.PI / 2;
      door.position.set(0, 0.4, (tileWidth - 0.1) / 2 + 0.02);
      group.add(door);
      break;
    }

    case 'fixture-clothes-dryer': {
      buildAppliance(tileWidth - 0.08, 0.85, tileWidth - 0.1, false);
      const door = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 16), secMat);
      door.rotation.x = Math.PI / 2;
      door.position.set(0, 0.42, (tileWidth - 0.1) / 2 + 0.02);
      group.add(door);
      break;
    }

    case 'furniture-utility-shelf': {
      const frameMat = metalMat;
      const postOffsets: [number, number][] = [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]];
      postOffsets.forEach(([x, z]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, itemDef.height, 6), frameMat);
        post.position.set(x, itemDef.height / 2, z);
        group.add(post);
      });
      for (let h = 0.2; h < itemDef.height; h += (itemDef.height - 0.2) / 3) {
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.03, 0.85), mainMat);
        shelf.position.y = h;
        shelf.castShadow = true;
        group.add(shelf);
      }
      break;
    }

    default: {
      // Improved generic fallback: inset top + base trim so untouched items
      // don't read as a flat, featureless cube.
      const bodyH = itemDef.height * 0.86;
      const body = new THREE.Mesh(new THREE.BoxGeometry(tileWidth * 0.92, bodyH, tileWidth * 0.92), mainMat);
      body.position.y = bodyH / 2;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const base = new THREE.Mesh(new THREE.BoxGeometry(tileWidth * 0.98, itemDef.height * 0.06, tileWidth * 0.98), darkMat);
      base.position.y = itemDef.height * 0.03;
      group.add(base);

      const capGeo = new THREE.BoxGeometry(tileWidth * 0.8, itemDef.height * 0.08, tileWidth * 0.8);
      const cap = new THREE.Mesh(capGeo, secMat);
      cap.position.y = bodyH + itemDef.height * 0.04;
      cap.castShadow = true;
      group.add(cap);
    }
  }

  // Apply wall-style edge alignment so doors/windows/partitions sit flush
  if (itemDef.category === 'Walls') {
    const wallThickness = 0.14;
    const wallEdgeOffset = -(tileWidth / 2 - wallThickness / 2);
    group.children.forEach((child) => {
      child.position.z += wallEdgeOffset;
    });
  }

  group.rotation.y = entity.rotation;

  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}
