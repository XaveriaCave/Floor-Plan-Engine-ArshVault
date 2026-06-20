import * as THREE from 'three';
import { GridEntity, ItemDefinition } from '../types';

/**
 * Creates a procedural Three.js Object3D/Group representing a specific placed entity.
 * Uses high-fidelity compound geometries, rich colors, and proper material specs.
 */
export function createItemMesh(
  entity: GridEntity,
  itemDef: ItemDefinition,
  isNight: boolean,
  isSunset: boolean
): THREE.Group {
  const group = new THREE.Group();
  group.name = `entity-${entity.id}`;

  const primaryColor = new THREE.Color(itemDef.color);
  const secondaryColor = itemDef.secondaryColor
    ? new THREE.Color(itemDef.secondaryColor)
    : primaryColor.clone().multiplyScalar(0.7);

  // Dynamically compute height scaling based on customizable storeys (0 to 90)
  const isStructure = itemDef.category === 'Structures';
  const baseStoreys = 10;
  // If entity.storeys is defined, we use it. Otherwise, default structures to 10 storeys.
  const storeys = entity.storeys !== undefined
    ? entity.storeys
    : (isStructure ? 10 : undefined);

  // finalHeight scales itemDef.height proportionally based on the active storeys counter (relative to base 10 storeys)
  // If storeys is 0, give it a minor flat slab height of 0.15.
  const finalHeight = storeys !== undefined
    ? (storeys === 0 ? 0.15 : (storeys / baseStoreys) * itemDef.height)
    : itemDef.height;

  // Set up standard emissive details for night mode
  let isEmissive = false;
  let emissiveColor = new THREE.Color(0x000000);
  let emissiveIntensity = 0.0;

  if (itemDef.emissiveColor && (isNight || isSunset)) {
    isEmissive = true;
    emissiveColor = new THREE.Color(itemDef.emissiveColor);
    emissiveIntensity = isNight ? 4.5 : 1.2;
  }

  // Helper to create shared stylized materials
  const createMaterial = (
    color: THREE.Color,
    roughness = 0.5,
    metalness = 0.1,
    transparent = false,
    opacity = 1.0
  ) => {
    return new THREE.MeshStandardMaterial({
      color: color,
      roughness: roughness,
      metalness: metalness,
      transparent: transparent,
      opacity: opacity,
      shadowSide: THREE.DoubleSide,
    });
  };

  const isDaylight = !isNight && !isSunset;
  const mainRoughness = isStructure && isDaylight ? 0.22 : 0.4;
  const mainMetalness = isStructure && isDaylight ? 0.42 : 0.15;
  const mainMat = createMaterial(primaryColor, mainRoughness, mainMetalness);

  // Separate glowing material for night effects
  const glowMat = new THREE.MeshStandardMaterial({
    color: isEmissive ? emissiveColor : secondaryColor,
    emissive: isEmissive ? emissiveColor : new THREE.Color(0x000000),
    emissiveIntensity: emissiveIntensity,
    roughness: 0.2,
    metalness: 0.1,
  });

  const secMat = createMaterial(secondaryColor, isDaylight ? 0.3 : 0.6, isDaylight ? 0.3 : 0.05);
  const darkMat = createMaterial(new THREE.Color(0x222222), 0.7, 0.4);
  const metalMat = createMaterial(new THREE.Color(0x90a4ae), 0.25, 0.85);

  // Real glass mirror material for high-fidelity reflections during daylight
  const glassMat = new THREE.MeshStandardMaterial({
    color: isDaylight ? new THREE.Color(0x1976d2) : new THREE.Color(0x80deea),
    roughness: 0.04,
    metalness: isDaylight ? 0.95 : 0.85,
    transparent: true,
    opacity: isDaylight ? 0.72 : 0.45,
    shadowSide: THREE.DoubleSide,
  });

  const tileWidth = 0.95; // slightly smaller than 1.0 to give subtle grid visibility

  // Custom visual builders based on item def ID
  switch (itemDef.id) {
    // === CITY MODE: STRUCTURES ===
    case 'residential-low': {
      // Base building block
      const baseGeo = new THREE.BoxGeometry(tileWidth, 0.6, tileWidth);
      const baseMesh = new THREE.Mesh(baseGeo, mainMat);
      baseMesh.position.y = 0.3;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      group.add(baseMesh);

      // Angled Roof (using a pyramid or translated box structure)
      const roofGeo = new THREE.ConeGeometry(0.72, 0.6, 4);
      const roofMesh = new THREE.Mesh(roofGeo, secMat);
      roofMesh.rotation.y = Math.PI / 4; // align faces with box
      roofMesh.position.y = 0.9;
      roofMesh.castShadow = true;
      group.add(roofMesh);

      // Tiny chimney
      const chimneyGeo = new THREE.BoxGeometry(0.12, 0.4, 0.12);
      const chimney = new THREE.Mesh(chimneyGeo, darkMat);
      chimney.position.set(0.2, 0.8, 0.2);
      group.add(chimney);

      // Cozy door
      const doorGeo = new THREE.BoxGeometry(0.2, 0.4, 0.05);
      const door = new THREE.Mesh(doorGeo, secMat);
      door.position.set(0, 0.2, 0.48);
      group.add(door);

      // Glowing Windows
      for (const offset of [-0.25, 0.25]) {
        const winGeo = new THREE.BoxGeometry(0.15, 0.15, 0.05);
        if (isNight) {
          winGeo.translate(offset, 0.45, 0.48);
          group.add(new THREE.Mesh(winGeo, glowMat));
        } else {
          winGeo.translate(offset, 0.45, 0.48);
          group.add(new THREE.Mesh(winGeo, glassMat));
        }
      }
      break;
    }

    case 'skyscraper-modern': {
      // Main soaring glass block
      const mainGeo = new THREE.BoxGeometry(tileWidth, finalHeight - 0.5, tileWidth);
      const mainMesh = new THREE.Mesh(mainGeo, mainMat);
      mainMesh.position.y = (finalHeight - 0.5) / 2;
      mainMesh.castShadow = true;
      mainMesh.receiveShadow = true;
      group.add(mainMesh);

      // Crown structural tier
      const crownGeo = new THREE.BoxGeometry(tileWidth * 0.8, 0.3, tileWidth * 0.8);
      const crownMesh = new THREE.Mesh(crownGeo, secMat);
      crownMesh.position.y = finalHeight - 0.35;
      crownMesh.castShadow = true;
      group.add(crownMesh);

      // Antenna needles
      const antGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.6);
      const antenna = new THREE.Mesh(antGeo, metalMat);
      antenna.position.set(0, finalHeight + 0.1, 0);
      group.add(antenna);

      // Glowing tip
      const tipGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const tip = new THREE.Mesh(tipGeo, glowMat);
      tip.position.set(0, finalHeight + 0.4, 0);
      group.add(tip);

      // High-Fidelity Day Light structural columns (chrome steel) on the corners
      const cornerSteelMat = createMaterial(new THREE.Color(0xd1d5db), 0.1, 0.9);
      const colGeo = new THREE.BoxGeometry(0.04, finalHeight - 0.5, 0.04);
      const offsets = [-tileWidth / 2, tileWidth / 2];
      offsets.forEach((ox) => {
        offsets.forEach((oz) => {
          const colMesh = new THREE.Mesh(colGeo, cornerSteelMat);
          colMesh.position.set(ox, (finalHeight - 0.5) / 2, oz);
          colMesh.castShadow = true;
          group.add(colMesh);
        });
      });

      // Windows and facade horizontal panels stripes
      const floorsCount = Math.floor(finalHeight / 0.4);
      for (let f = 1; f < floorsCount; f++) {
        const yCoord = f * 0.4;
        // Horizontal bands
        const bandGeo = new THREE.BoxGeometry(tileWidth * 1.015, 0.08, tileWidth * 1.015);
        const winMesh = new THREE.Mesh(bandGeo, isNight ? glowMat : glassMat);
        winMesh.position.y = yCoord;
        winMesh.castShadow = true;
        group.add(winMesh);
      }
      break;
    }

    case 'cyberpunk-tower': {
      const hScale = finalHeight / 5.5;

      // Tier 1 Base
      const t1Geo = new THREE.CylinderGeometry(0.48, 0.5, 2.0 * hScale, 6);
      const t1 = new THREE.Mesh(t1Geo, mainMat);
      t1.position.y = 1.0 * hScale;
      t1.castShadow = true;
      t1.receiveShadow = true;
      group.add(t1);

      // Tier 2 Middle
      const t2Geo = new THREE.CylinderGeometry(0.35, 0.42, 2.0 * hScale, 6);
      const t2 = new THREE.Mesh(t2Geo, secMat);
      t2.position.y = 3.0 * hScale;
      t2.castShadow = true;
      group.add(t2);

      // Tier 3 Spreading Top
      const t3Geo = new THREE.BoxGeometry(0.8, 0.8 * hScale, 0.8);
      const t3 = new THREE.Mesh(t3Geo, darkMat);
      t3.position.y = 4.4 * hScale;
      t3.castShadow = true;
      group.add(t3);

      // Observation glass ring deck (Highly realistic in Daylight)
      const ringGeo = new THREE.TorusGeometry(0.52, 0.08, 12, 24);
      const deckRing = new THREE.Mesh(ringGeo, glassMat);
      deckRing.rotation.x = Math.PI / 2;
      deckRing.position.y = 3.6 * hScale;
      group.add(deckRing);

      // Dual antenna arrays
      const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.2 * hScale), metalMat);
      a1.position.set(-0.2, 5.2 * hScale, 0);
      a1.rotation.z = -0.15;
      const a2 = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.8 * hScale), metalMat);
      a2.position.set(0.2, 5.0 * hScale, 0);
      a2.rotation.z = 0.15;
      group.add(a1);
      group.add(a2);

      // Side structural support braces
      const braceGeo = new THREE.CylinderGeometry(0.02, 0.02, 4.0 * hScale);
      const braceL = new THREE.Mesh(braceGeo, metalMat);
      braceL.position.set(-0.55, 2.0 * hScale, 0);
      braceL.rotation.z = 0.1;
      const braceR = braceL.clone();
      braceR.position.x = 0.55;
      braceR.rotation.z = -0.1;
      group.add(braceL);
      group.add(braceR);

      // Vertical fluorescent/neon accents
      const bandGeo = new THREE.BoxGeometry(0.1, finalHeight - 1.2 * hScale, 1.04);
      const band = new THREE.Mesh(bandGeo, glowMat);
      band.position.y = (finalHeight - 1.2 * hScale) / 2 + 0.3 * hScale;
      group.add(band);
      break;
    }

    case 'factory': {
      const fScale = finalHeight / 2.0;

      // Main industrial hall (fits 2x1 grid)
      const coreGeo = new THREE.BoxGeometry(1.9, 1.2 * fScale, tileWidth);
      const mainBlock = new THREE.Mesh(coreGeo, mainMat);
      mainBlock.position.set(0.48, (0.6 * fScale), 0);
      mainBlock.castShadow = true;
      mainBlock.receiveShadow = true;
      group.add(mainBlock);

      // Angled corrugated roof panels
      const roof1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, tileWidth * 1.02), secMat);
      roof1.position.set(0.0, 1.25 * fScale, 0);
      roof1.rotation.z = 0.18;
      const roof2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.2, tileWidth * 1.02), secMat);
      roof2.position.set(0.96, 1.25 * fScale, 0);
      roof2.rotation.z = -0.18;
      group.add(roof1);
      group.add(roof2);

      // Heavy boiler piping and ventilation cylinders
      const stackGeo = new THREE.CylinderGeometry(0.12, 0.12, 1.6 * fScale, 8);
      const stack1 = new THREE.Mesh(stackGeo, metalMat);
      stack1.position.set(0.4, 1.4 * fScale, -0.2);
      stack1.castShadow = true;
      group.add(stack1);

      // Loading bay roller shutter door at the base
      const shutterMat = createMaterial(new THREE.Color(0xb0bec5), 0.4, 0.85);
      const doorGeo = new THREE.BoxGeometry(0.5, 0.5 * fScale, 0.02);
      const shDoor = new THREE.Mesh(doorGeo, shutterMat);
      shDoor.position.set(0, (0.25 * fScale), tileWidth / 2 + 0.015);
      shDoor.castShadow = true;
      group.add(shDoor);

      // Large extraction fan window circular casing
      const ventGeo = new THREE.TorusGeometry(0.18, 0.04, 8, 16);
      const ventFan = new THREE.Mesh(ventGeo, metalMat);
      ventFan.position.set(0.8, 0.6 * fScale, tileWidth / 2 + 0.015);
      group.add(ventFan);

      // Steam fumes cap
      if (isNight || isSunset) {
        const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), glowMat);
        glowSphere.position.set(0.4, 2.2 * fScale, -0.2);
        group.add(glowSphere);
      }
      break;
    }

    case 'power-plant': {
      const pScale = finalHeight / 3.2;

      // Dual futuristic cooling towers (ground dimension 2x2 grid)
      const centers = [
        { x: 0, z: 0 },
        { x: 0.9, z: 0.9 },
      ];

      centers.forEach((c) => {
        const towerGroup = new THREE.Group();
        towerGroup.position.set(c.x, 0, c.z);

        // Hyperbolic-like cooling tower constructed of stacked cylinders
        const botGeo = new THREE.CylinderGeometry(0.35, 0.48, 1.2 * pScale, 12);
        const bot = new THREE.Mesh(botGeo, mainMat);
        bot.position.y = 0.6 * pScale;
        bot.castShadow = true;
        bot.receiveShadow = true;
        towerGroup.add(bot);

        const topGeo = new THREE.CylinderGeometry(0.4, 0.35, 1.2 * pScale, 12);
        const top = new THREE.Mesh(topGeo, mainMat);
        top.position.y = 1.8 * pScale;
        top.castShadow = true;
        towerGroup.add(top);

        // Glowing alert ring on top brim
        const ringGeo = new THREE.TorusGeometry(0.4, 0.05, 8, 16);
        const ring = new THREE.Mesh(ringGeo, glowMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 2.4 * pScale;
        towerGroup.add(ring);

        group.add(towerGroup);
      });
      break;
    }

    case 'bridge': {
      const bScale = finalHeight / 2.5;

      // Spanning structure 1x3 grid
      const pathGeo = new THREE.BoxGeometry(0.8, 0.12, 2.9);
      const pathway = new THREE.Mesh(pathGeo, mainMat);
      pathway.position.set(0, 0.6 * bScale, 0.9);
      pathway.castShadow = true;
      pathway.receiveShadow = true;
      group.add(pathway);

      // Twin steel pillars/pylons
      const p1Geo = new THREE.BoxGeometry(0.12, 1.8 * bScale, 0.12);
      const p1 = new THREE.Mesh(p1Geo, metalMat);
      p1.position.set(-0.35, 1.2 * bScale, 0.9);
      p1.castShadow = true;
      const p2 = p1.clone();
      p2.position.x = 0.35;
      group.add(p1);
      group.add(p2);

      // Support trusses (slanted rods)
      const trussGeo = new THREE.BoxGeometry(0.03, 1.5 * bScale, 0.03);
      const truss1 = new THREE.Mesh(trussGeo, metalMat);
      truss1.position.set(-0.35, 1.1 * bScale, 0.0);
      truss1.rotation.x = 0.6;
      group.add(truss1);

      const truss2 = truss1.clone();
      truss2.position.set(-0.35, 1.1 * bScale, 1.8);
      truss2.rotation.x = -0.6;
      group.add(truss2);

      // If Night Mode / Cyberpunk, add hyper-bright neon cables
      if (isNight) {
        // Left side neon rail
        const neonRailL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 2.9), glowMat);
        neonRailL.position.set(-0.38, 0.68 * bScale, 0.9);
        group.add(neonRailL);

        // Right side neon rail
        const neonRailR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, 2.9), glowMat);
        neonRailR.position.set(0.38, 0.68 * bScale, 0.9);
        group.add(neonRailR);

        // Suspension cable glowing arches
        const archCylinderGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 6);
        const archL = new THREE.Mesh(archCylinderGeo, glowMat);
        archL.position.set(-0.35, 1.3 * bScale, 0.9);
        archL.rotation.z = Math.PI / 2;
        group.add(archL);

        const archR = archL.clone();
        archR.position.x = 0.35;
        group.add(archR);
      }
      break;
    }

    case 'hospital': {
      const hScale = finalHeight / 2.8;

      // Triple white blocks crossing each other (2x2 grid)
      const baseBlockGeo = new THREE.BoxGeometry(1.8, 1.8 * hScale, 1.8);
      const baseBlock = new THREE.Mesh(baseBlockGeo, mainMat);
      baseBlock.position.set(0.48, 0.9 * hScale, 0.48);
      baseBlock.castShadow = true;
      baseBlock.receiveShadow = true;
      group.add(baseBlock);

      // Red cross insignia - front facing
      const crossVert = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6 * hScale, 0.06), secMat);
      crossVert.position.set(0.48, 1.0 * hScale, 1.39);
      const crossHoriz = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.15 * hScale, 0.06), secMat);
      crossHoriz.position.set(0.48, 1.0 * hScale, 1.39);
      group.add(crossVert);
      group.add(crossHoriz);

      // Cross beacon glows
      if (isNight) {
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), glowMat);
        beacon.position.set(0.48, 1.95 * hScale, 0.48);
        group.add(beacon);
      }
      break;
    }

    case 'police-station': {
      const polScale = finalHeight / 2.2;

      const pGeo = new THREE.BoxGeometry(tileWidth, 1.8 * polScale, tileWidth);
      const mainBuilding = new THREE.Mesh(pGeo, mainMat);
      mainBuilding.position.y = 0.9 * polScale;
      mainBuilding.castShadow = true;
      mainBuilding.receiveShadow = true;
      group.add(mainBuilding);

      // Police garage overhang
      const hangarGeo = new THREE.BoxGeometry(0.4, 0.8 * polScale, 0.6);
      const hangar = new THREE.Mesh(hangarGeo, secMat);
      hangar.position.set(0.35, 0.4 * polScale, 0.35);
      group.add(hangar);

      // Flashing alert lights on roof
      const sirenLeft = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
      sirenLeft.position.set(-0.2, 1.85 * polScale, 0.2);
      group.add(sirenLeft);

      const sirenRight = sirensRight(isNight, itemDef);
      sirenRight.position.set(0.2, 1.85 * polScale, 0.2);
      group.add(sirenRight);
      break;
    }

    case 'supermarket': {
      const mScale = finalHeight / 1.6;

      // 2x2 wide shopping center
      const mallGeo = new THREE.BoxGeometry(1.8, 1.1 * mScale, 1.8);
      const mall = new THREE.Mesh(mallGeo, mainMat);
      mall.position.set(0.48, 0.55 * mScale, 0.48);
      mall.castShadow = true;
      mall.receiveShadow = true;
      group.add(mall);

      // Green canopy
      const canopyGeo = new THREE.BoxGeometry(1.9, 0.15 * mScale, 0.4);
      const canopy = new THREE.Mesh(canopyGeo, secMat);
      canopy.position.set(0.48, 0.8 * mScale, 0.9);
      group.add(canopy);

      // Sliding doors
      const entDoor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6 * mScale, 0.05), glassMat);
      entDoor.position.set(0.48, 0.3 * mScale, 0.89);
      group.add(entDoor);
      break;
    }

    case 'wind-turbine': {
      // Slim high pylon with propeller blades
      const pylonGeo = new THREE.CylinderGeometry(0.06, 0.1, finalHeight - 1.2, 8);
      const pylon = new THREE.Mesh(pylonGeo, mainMat);
      pylon.position.y = (finalHeight - 1.2) / 2;
      pylon.castShadow = true;
      group.add(pylon);

      // Hub node
      const hubGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const hub = new THREE.Mesh(hubGeo, secMat);
      hub.position.set(0, finalHeight - 1.2, 0.1);
      group.add(hub);

      // Tri-rotor blades
      const bladeLength = 1.1;
      for (let i = 0; i < 3; i++) {
        const bladeGeo = new THREE.BoxGeometry(0.08, bladeLength, 0.01);
        const blade = new THREE.Mesh(bladeGeo, mainMat);
        blade.position.y = bladeLength / 2;
        // Rotation offset for 3 blades
        const armGroup = new THREE.Group();
        armGroup.position.set(0, finalHeight - 1.2, 0.14);
        armGroup.rotation.z = (i * Math.PI * 2) / 3;
        armGroup.add(blade);
        group.add(armGroup);
      }
      break;
    }

    // === COMMON: CITY MODE INFRASTRUCTURE ===
    case 'road-2lane': {
      // standard dark asphalt flat pad
      const tar = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), mainMat);
      tar.receiveShadow = true;
      group.add(tar);

      // double yellow safety stripes (z-direction)
      const stripeGeo = new THREE.BoxGeometry(0.03, 0.008, 0.95);
      const stripeL = new THREE.Mesh(stripeGeo, secMat);
      stripeL.position.set(-0.04, 0.03, 0);
      const stripeR = new THREE.Mesh(stripeGeo, secMat);
      stripeR.position.set(0.04, 0.03, 0);
      group.add(stripeL);
      group.add(stripeR);
      break;
    }

    case 'road-crossing': {
      const tar = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), mainMat);
      tar.receiveShadow = true;
      group.add(tar);

      // white zebra decals crossing horizontally and vertically
      const addZebra = (ox: number, oz: number, r: boolean) => {
        const zebra = new THREE.Mesh(new THREE.BoxGeometry(r ? 0.32 : 0.08, 0.008, r ? 0.08 : 0.32), secMat);
        zebra.position.set(ox, 0.03, oz);
        group.add(zebra);
      };

      addZebra(-0.3, 0, false);
      addZebra(0.3, 0, false);
      addZebra(0, -0.3, true);
      addZebra(0, 0.3, true);
      break;
    }

    case 'road-t-junction': {
      const tar = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), mainMat);
      tar.receiveShadow = true;
      group.add(tar);

      // 3-way divider yellow stripes
      const straight = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.008, 0.95), secMat);
      straight.position.set(0, 0.03, 0);
      group.add(straight);

      const split = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.008, 0.03), secMat);
      split.position.set(0.22, 0.03, 0);
      group.add(split);
      break;
    }

    case 'train-tracks': {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), mainMat);
      bed.receiveShadow = true;
      group.add(bed);

      // wooden ties (horizontal planks)
      for (let z = -0.4; z <= 0.4; z += 0.2) {
        const tie = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.03, 0.04), mainMat);
        tie.position.set(0, 0.045, z);
        group.add(tie);
      }

      // steel dual lines
      const steelGeo = new THREE.BoxGeometry(0.02, 0.04, 1.0);
      const railL = new THREE.Mesh(steelGeo, secMat);
      railL.position.set(-0.25, 0.07, 0);
      const railR = new THREE.Mesh(steelGeo, secMat);
      railR.position.set(0.25, 0.07, 0);
      group.add(railL);
      group.add(railR);
      break;
    }

    case 'streetlight': {
      // post
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.9, 6), mainMat);
      base.position.y = 0.95;
      base.castShadow = true;
      group.add(base);

      const head = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.12), mainMat);
      head.position.set(0.12, 1.9, 0);
      group.add(head);

      // Light bulb sphere
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), glowMat);
      bulb.position.set(0.22, 1.84, 0);
      group.add(bulb);

      // Translucent light cone if night/sunset
      if (isNight || isSunset) {
        const coneGeo = new THREE.ConeGeometry(0.6, 1.6, 12, 1, true);
        coneGeo.translate(0, -0.8, 0);
        const coneMat = new THREE.MeshBasicMaterial({
          color: 0xffea00,
          transparent: true,
          opacity: isNight ? 0.22 : 0.08,
          side: THREE.DoubleSide,
        });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.set(0.22, 1.84, 0);
        group.add(cone);
      }
      break;
    }

    case 'power-grid-pole': {
      // wooden tall post with lateral t-bar crossbar
      const rGrid = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 3.2, 6), mainMat);
      rGrid.position.y = 1.6;
      group.add(rGrid);

      const cross = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.06), mainMat);
      cross.position.set(0, 3.0, 0);
      group.add(cross);

      // tiny isolate spheres on crossbar
      for (const offset of [-0.5, 0, 0.5]) {
        const iso = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), secMat);
        iso.position.set(offset, 3.06, 0);
        group.add(iso);
      }
      break;
    }

    // === COMMON: CITY MODE DECOR ===
    case 'park-grid': {
      // 2x2 green area
      const ground = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.05, 1.9), mainMat);
      ground.position.set(0.48, 0, 0.48);
      ground.receiveShadow = true;
      group.add(ground);

      // center sand circle
      const pathGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.01, 16);
      const path = new THREE.Mesh(pathGeo, secMat);
      path.position.set(0.48, 0.03, 0.48);
      group.add(path);

      // Small bench block
      const bench = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.15, 0.15), secMat);
      bench.position.set(0.48, 0.1, 0.1);
      group.add(bench);
      break;
    }

    case 'oak-trees': {
      // thick cluster of trees
      const treeConfigs = [
        { px: 0, pz: 0.15, scale: 1.0 },
        { px: -0.22, pz: -0.15, scale: 0.8 },
        { px: 0.22, pz: -0.15, scale: 0.9 },
      ];

      treeConfigs.forEach((t) => {
        const subGroup = new THREE.Group();
        subGroup.position.set(t.px, 0, t.pz);

        // Trunk
        const trunkGeo = new THREE.CylinderGeometry(0.05 * t.scale, 0.08 * t.scale, 0.7 * t.scale, 6);
        const trunk = new THREE.Mesh(trunkGeo, secMat);
        trunk.position.y = 0.35 * t.scale;
        trunk.castShadow = true;
        subGroup.add(trunk);

        // Crown leaves spheres
        const leavesGeo = new THREE.SphereGeometry(0.45 * t.scale, 10, 10);
        const leaves = new THREE.Mesh(leavesGeo, mainMat);
        leaves.position.y = 0.9 * t.scale;
        leaves.castShadow = true;
        subGroup.add(leaves);

        group.add(subGroup);
      });
      break;
    }

    case 'water-fountain': {
      // circular fountain
      const basinGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.25, 16);
      const basin = new THREE.Mesh(basinGeo, mainMat);
      basin.position.y = 0.125;
      basin.castShadow = true;
      group.add(basin);

      // sparkly water cylinder inside
      const waterGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.05, 16);
      const water = new THREE.Mesh(waterGeo, isNight || isSunset ? glowMat : secMat);
      water.position.set(0, 0.22, 0);
      group.add(water);

      // center spray nozzle
      const centerSet = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.4, 8), darkMat);
      centerSet.position.y = 0.25;
      group.add(centerSet);
      break;
    }

    case 'parking-lot': {
      const lot = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.05, tileWidth), mainMat);
      lot.receiveShadow = true;
      group.add(lot);

      // Parking bay dashes
      for (const offsetZ of [-0.3, 0, 0.3]) {
        const lineGeo = new THREE.BoxGeometry(0.4, 0.01, 0.03);
        const l1 = new THREE.Mesh(lineGeo, secMat);
        l1.position.set(-0.25, 0.03, offsetZ);
        const l2 = new THREE.Mesh(lineGeo, secMat);
        l2.position.set(0.25, 0.03, offsetZ);
        group.add(l1);
        group.add(l2);
      }
      break;
    }

    case 'billboard-neon': {
      // single offset post
      const corePole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.0, 6), secMat);
      corePole.position.y = 1.0;
      group.add(corePole);

      // large corporate sign board
      const signGeo = new THREE.BoxGeometry(0.9, 0.5, 0.12);
      const board = new THREE.Mesh(signGeo, mainMat);
      board.position.set(0, 2.2, 0);
      group.add(board);

      // neon screen decal facing forward
      const screenGeo = new THREE.BoxGeometry(0.8, 0.4, 0.04);
      const screen = new THREE.Mesh(screenGeo, glowMat);
      screen.position.set(0, 2.2, 0.06);
      group.add(screen);
      break;
    }

    // === FLOOR MODE: WALLS ===
    case 'wall-concrete':
    case 'wall-drywall': {
      // Extends exactly the length of a grid cell
      const wallGeo = new THREE.BoxGeometry(tileWidth, itemDef.height, 0.14);
      const wall = new THREE.Mesh(wallGeo, mainMat);
      wall.position.y = itemDef.height / 2;
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);
      break;
    }

    case 'wall-window': {
      // Wall has left column, right column, and center glass pane
      const colWidth = 0.18;
      const wallSec = new THREE.Mesh(new THREE.BoxGeometry(colWidth, itemDef.height, 0.14), mainMat);
      wallSec.position.set(-tileWidth / 2 + colWidth / 2, itemDef.height / 2, 0);
      wallSec.castShadow = true;
      const wallSecR = wallSec.clone();
      wallSecR.position.x = tileWidth / 2 - colWidth / 2;
      group.add(wallSec);
      group.add(wallSecR);

      // Header lintel
      const headerGeo = new THREE.BoxGeometry(tileWidth, 0.4, 0.14);
      const header = new THREE.Mesh(headerGeo, mainMat);
      header.position.set(0, itemDef.height - 0.2, 0);
      header.castShadow = true;
      group.add(header);

      // glass block in the center frame
      const winH = itemDef.height - 0.4;
      const centerWinGeo = new THREE.BoxGeometry(tileWidth - colWidth * 2, winH, 0.04);
      const win = new THREE.Mesh(centerWinGeo, glassMat);
      win.position.set(0, winH / 2, 0);
      group.add(win);
      break;
    }

    case 'wall-archway': {
      // column blocks
      const colW = 0.24;
      const colL = new THREE.Mesh(new THREE.BoxGeometry(colW, itemDef.height - 0.5, 0.16), mainMat);
      colL.castShadow = true;
      colL.position.set(-tileWidth / 2 + colW / 2, (itemDef.height - 0.5) / 2, 0);
      const colR = colL.clone();
      colR.position.x = tileWidth / 2 - colW / 2;
      group.add(colL);
      group.add(colR);

      // Top lintel / arch segment
      const archTop = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.5, 0.16), mainMat);
      archTop.position.set(0, itemDef.height - 0.25, 0);
      archTop.castShadow = true;
      group.add(archTop);
      break;
    }

    case 'wall-sliding-door': {
      // wall panels on edges
      const edge = new THREE.Mesh(new THREE.BoxGeometry(0.12, itemDef.height, 0.16), mainMat);
      edge.position.set(-tileWidth / 2 + 0.06, itemDef.height / 2, 0);
      const edgeR = edge.clone();
      edgeR.position.x = tileWidth / 2 - 0.06;
      group.add(edge);
      group.add(edgeR);

      // Frame bars
      const sliderRails = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.08, 0.16), darkMat);
      sliderRails.position.set(0, 0.04, 0);
      const upperRails = sliderRails.clone();
      upperRails.position.y = itemDef.height - 0.04;
      group.add(sliderRails);
      group.add(upperRails);

      // Sliding glass panel
      const sH = itemDef.height - 0.16;
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.68, sH, 0.04), glassMat);
      // slightly slid open to look interactive!
      panel.position.set(0.1, sH / 2 + 0.08, -0.02);
      group.add(panel);
      break;
    }

    // === FLOOR MODE: FLOORING ===
    case 'floor-hardwood': {
      const plankGeo = new THREE.BoxGeometry(tileWidth, 0.05, tileWidth);
      const wood = new THREE.Mesh(plankGeo, mainMat);
      wood.receiveShadow = true;
      group.add(wood);

      // subtle panel divider lines
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

      // tile grout grid stripes
      const lineX = new THREE.Mesh(new THREE.BoxGeometry(tileWidth, 0.008, 0.018), secMat);
      lineX.position.set(0, 0.026, 0);
      group.add(lineX);

      const lineZ = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, tileWidth), secMat);
      lineZ.position.set(0, 0.026, 0);
      group.add(lineZ);
      break;
    }

    case 'floor-rug': {
      // 2x2 rug
      const sheet = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 1.7), mainMat);
      sheet.position.set(0.35, 0, 0.35);
      sheet.receiveShadow = true;
      group.add(sheet);

      // decorative cross stripes on the rug
      const trimGeo = new THREE.BoxGeometry(1.6, 0.008, 0.1);
      const trim1 = new THREE.Mesh(trimGeo, secMat);
      trim1.position.set(0.35, 0.021, 0.1);
      const trim2 = new THREE.Mesh(trimGeo, secMat);
      trim2.position.set(0.35, 0.021, 0.6);
      group.add(trim1);
      group.add(trim2);
      break;
    }

    // === FLOOR MODE: FIXTURES ===
    case 'fixture-spotlight': {
      // ceiling mount node
      const hCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), darkMat);
      hCyl.position.y = itemDef.height - 0.075;
      group.add(hCyl);

      // light emitter sphere
      const coneLight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
      coneLight.position.y = itemDef.height - 0.18;
      group.add(coneLight);

      // ambient downward lighting cone
      if (isNight || isSunset) {
        const projection = new THREE.CylinderGeometry(0.08, 0.8, 2.0, 12, 1, true);
        projection.translate(0, -1.0, 0);
        const projectionMat = new THREE.MeshBasicMaterial({
          color: 0xffea00,
          transparent: true,
          opacity: isNight ? 0.25 : 0.09,
          side: THREE.DoubleSide,
        });
        const lightBeam = new THREE.Mesh(projection, projectionMat);
        lightBeam.position.y = itemDef.height - 0.18;
        group.add(lightBeam);
      }
      break;
    }

    case 'fixture-sconce': {
      // wall bracket
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

    case 'fixture-counter': {
      // spans 2x1 grid
      const cabinetGeo = new THREE.BoxGeometry(1.85, 0.88, 0.44);
      const cabinet = new THREE.Mesh(cabinetGeo, mainMat);
      cabinet.position.set(0.48, 0.44, 0);
      cabinet.castShadow = true;
      cabinet.receiveShadow = true;
      group.add(cabinet);

      // metallic chrome faucet assembly
      const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.2, 6), metalMat);
      tap.position.set(0.48, 0.98, 0.1);
      group.add(tap);

      // sink hollow plane
      const sink = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.01, 0.32), darkMat);
      sink.position.set(0.48, 0.885, -0.05);
      group.add(sink);
      break;
    }

    case 'fixture-refrigerator': {
      const fridgeGeo = new THREE.BoxGeometry(tileWidth - 0.1, 1.95, tileWidth - 0.1);
      const body = new THREE.Mesh(fridgeGeo, mainMat);
      body.position.y = 1.0;
      body.castShadow = true;
      group.add(body);

      // horizontal fridge handles
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.4, 0.04), metalMat);
      handle.position.set(0.12, 1.2, tileWidth / 2 - 0.04);
      group.add(handle);

      // cyan control console glow
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.25, 0.02), glowMat);
      panel.position.set(-0.15, 1.4, tileWidth / 2 - 0.04);
      group.add(panel);
      break;
    }

    case 'fixture-toilet': {
      // Cistern block back facing
      const tank = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 0.22), mainMat);
      tank.position.set(0, 0.525, -0.28);
      tank.castShadow = true;
      group.add(tank);

      // toilet bowl
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.4, 12), mainMat);
      bowl.position.set(0, 0.2, 0.06);
      bowl.scale.set(1.1, 1.0, 1.35); // oval-ish shape
      bowl.castShadow = true;
      group.add(bowl);
      break;
    }

    case 'fixture-bathtub': {
      // 2x1 grid bathtub
      const exterior = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.65, 0.8), mainMat);
      exterior.position.set(0.35, 0.325, 0);
      exterior.castShadow = true;
      group.add(exterior);

      // hollow water plane
      const waterTub = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.01, 0.68), secMat);
      waterTub.position.set(0.35, 0.55, 0);
      group.add(waterTub);
      break;
    }

    case 'fixture-tv': {
      // TV Stand table
      const stand = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.35, 0.35), mainMat);
      stand.position.set(0.35, 0.175, 0);
      stand.castShadow = true;
      group.add(stand);

      // Thin screen plane
      const screenMain = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.75, 0.04), darkMat);
      screenMain.position.set(0.35, 0.75, 0);
      screenMain.castShadow = true;
      group.add(screenMain);

      // Glowing blue screen decals at night
      const activeDecal = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.71, 0.01), glowMat);
      activeDecal.position.set(0.35, 0.75, 0.022);
      group.add(activeDecal);
      break;
    }

    // === FLOOR MODE: FURNITURE ===
    case 'furniture-sofa': {
      // L shaped sofa (2x2 grid) centered
      const baseMain = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 0.78), mainMat);
      baseMain.position.set(0.48, 0.125, 0);
      baseMain.castShadow = true;
      group.add(baseMain);

      const baseL = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.25, 1.0), mainMat);
      baseL.position.set(-0.03, 0.125, 0.89);
      baseL.castShadow = true;
      group.add(baseL);

      // Soft backrest
      const back1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 0.18), secMat);
      back1.position.set(0.48, 0.45, -0.3);
      back1.castShadow = true;
      group.add(back1);

      const back2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.6, 1.0), secMat);
      back2.position.set(-0.33, 0.45, 0.89);
      back2.castShadow = true;
      group.add(back2);
      break;
    }

    case 'furniture-table': {
      // dining table (2x1 grid)
      const topGeo = new THREE.BoxGeometry(1.7, 0.05, 0.85);
      const boardTop = new THREE.Mesh(topGeo, mainMat);
      boardTop.position.set(0.35, 0.725, 0);
      boardTop.castShadow = true;
      group.add(boardTop);

      // 4 simple vertical wooden cylinder legs
      const offsetsX = [-0.42, 1.12];
      const offsetsZ = [-0.34, 0.34];
      offsetsX.forEach((x) => {
        offsetsZ.forEach((z) => {
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.7, 6), secMat);
          leg.position.set(x, 0.35, z);
          leg.castShadow = true;
          group.add(leg);
        });
      });
      break;
    }

    case 'furniture-chair': {
      // single task office chair
      const baseGrid = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.04, 5), darkMat);
      baseGrid.position.y = 0.06;
      group.add(baseGrid);

      const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.4, 6), metalMat);
      spindle.position.y = 0.24;
      group.add(spindle);

      // cushion cushion
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.08, 0.44), mainMat);
      seat.position.y = 0.46;
      seat.castShadow = true;
      group.add(seat);

      // high blue backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.06), secMat);
      back.position.set(0, 0.75, -0.19);
      back.castShadow = true;
      group.add(back);
      break;
    }

    case 'furniture-bookshelf': {
      // Tall timber cabinet
      const shellGeo = new THREE.BoxGeometry(0.85, 2.05, 0.38);
      const cover = new THREE.Mesh(shellGeo, mainMat);
      cover.position.y = 1.025;
      cover.castShadow = true;
      group.add(cover);

      // visual layered blocks (books inside)
      for (let h = 0.3; h < 1.9; h += 0.45) {
        const bookG = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.22, 0.22), secMat);
        bookG.position.set(0.12, h, 0.08);
        group.add(bookG);
      }
      break;
    }

    case 'furniture-monstera': {
      // Terracotta Pot
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.16, 0.32, 10), secMat);
      pot.position.y = 0.16;
      pot.castShadow = true;
      group.add(pot);

      // Dark soil inside
      const dirt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 10), darkMat);
      dirt.position.y = 0.305;
      group.add(dirt);

      // Fan green leaves (multiple angled boxes represent broad leaves)
      const leavesAngles = [0, 1.2, 2.4, 3.6, 4.8];
      leavesAngles.forEach((angle) => {
        const branchGroup = new THREE.Group();
        branchGroup.position.set(0, 0.31, 0);
        branchGroup.rotation.y = angle;

        // stem curved upward
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.6), secMat);
        stem.position.set(0.12, 0.24, 0);
        stem.rotation.z = -0.4;
        branchGroup.add(stem);

        // leafy broad fan
        const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.01, 0.25), mainMat);
        leaf.position.set(0.35, 0.48, 0);
        leaf.rotation.z = -0.2;
        branchGroup.add(leaf);

        group.add(branchGroup);
      });
      break;
    }

    case 'furniture-coffee-table': {
      // Round wooden slab
      const plateau = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.05, 16), mainMat);
      plateau.position.y = 0.425;
      plateau.castShadow = true;
      group.add(plateau);

      // Slant legs
      for (let i = 0; i < 3; i++) {
        const legGroup = new THREE.Group();
        legGroup.rotation.y = (i * Math.PI * 2) / 3;

        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.42, 6), secMat);
        leg.position.set(0.22, 0.21, 0);
        leg.rotation.z = -0.2;
        leg.castShadow = true;
        legGroup.add(leg);

        group.add(legGroup);
      }
      break;
    }

    case 'river-flow': {
      // Dark grey canal concrete casing
      const casingGeo = new THREE.BoxGeometry(tileWidth, 0.04, tileWidth);
      const casing = new THREE.Mesh(casingGeo, darkMat);
      casing.receiveShadow = true;
      group.add(casing);

      // Liquid neon flowing canal water bed
      const waterWidth = tileWidth * 0.78;
      const waterGeo = new THREE.BoxGeometry(waterWidth, 0.045, tileWidth);
      const water = new THREE.Mesh(waterGeo, glowMat);
      water.receiveShadow = true;
      water.position.y = 0.01;
      group.add(water);

      // Light glow strips along the shorelines
      const boundaryEdgeL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, tileWidth), mainMat);
      boundaryEdgeL.position.set(-tileWidth / 2 + 0.02, 0.015, 0);
      const boundaryEdgeR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, tileWidth), mainMat);
      boundaryEdgeR.position.set(tileWidth / 2 - 0.02, 0.015, 0);
      group.add(boundaryEdgeL);
      group.add(boundaryEdgeR);
      break;
    }

    case 'ai-data-center': {
      // 2x2 grid. Centered around (0.48, 0, 0.48) for 2x2 dimensions.
      // Solid dark monolith hull
      const hullGeo = new THREE.BoxGeometry(1.82, 1.4, 1.82);
      const hull = new THREE.Mesh(hullGeo, mainMat);
      hull.position.set(0.48, 0.7, 0.48);
      hull.castShadow = true;
      hull.receiveShadow = true;
      group.add(hull);

      // Server rack blinking corridors (glowing vents built of multiple stacked lines)
      const ventGeo = new THREE.BoxGeometry(1.84, 0.06, 0.4);
      for (let y = 0.2; y <= 1.2; y += 0.25) {
        const ventFaceF = new THREE.Mesh(ventGeo, glowMat);
        ventFaceF.position.set(0.48, y, 1.15);
        ventFaceF.scale.set(0.85, 1.0, 0.05);

        const ventFaceB = new THREE.Mesh(ventGeo, glowMat);
        ventFaceB.position.set(0.48, y, -0.19);
        ventFaceB.scale.set(0.85, 1.0, 0.05);

        group.add(ventFaceF);
        group.add(ventFaceB);
      }

      // High-power exhaust server turbine on top
      const turbineRingGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 12);
      const turbineRing = new THREE.Mesh(turbineRingGeo, darkMat);
      turbineRing.position.set(0.48, 1.45, 0.48);
      group.add(turbineRing);

      // Fan node
      const fanGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const fanHub = new THREE.Mesh(fanGeo, glowMat);
      fanHub.position.set(0.48, 1.48, 0.48);
      group.add(fanHub);
      break;
    }

    case 'grand-hotel': {
      // 2x2 grid. Fits (1.8, 5.2, 1.8). High tower luxury resort.
      // Tier 1 Base Lobby
      const lobGeo = new THREE.BoxGeometry(1.82, 1.8, 1.82);
      const lobby = new THREE.Mesh(lobGeo, mainMat);
      lobby.position.set(0.48, 0.9, 0.48);
      lobby.castShadow = true;
      lobby.receiveShadow = true;
      group.add(lobby);

      // Tier 2 Majestic Guest Tower
      const tGeo = new THREE.BoxGeometry(1.3, 3.4, 1.3);
      const tower = new THREE.Mesh(tGeo, secMat);
      tower.position.set(0.48, 3.0, 0.48);
      tower.castShadow = true;
      group.add(tower);

      // Glass bottom swimming pool on cantilever platform
      const poolGeo = new THREE.BoxGeometry(0.85, 0.25, 0.65);
      const poolFrame = new THREE.Mesh(poolGeo, darkMat);
      poolFrame.position.set(0.48, 2.1, 1.2);
      poolFrame.castShadow = true;
      group.add(poolFrame);

      const poolWaterGeo = new THREE.BoxGeometry(0.78, 0.2, 0.58);
      const poolWater = new THREE.Mesh(poolWaterGeo, glowMat);
      poolWater.position.set(0.48, 2.16, 1.2);
      group.add(poolWater);

      // Decorative spire light
      const spireGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 6);
      const spire = new THREE.Mesh(spireGeo, metalMat);
      spire.position.set(0.48, 5.2, 0.48);
      group.add(spire);

      // Beacon
      const hotelBeaconGeo = new THREE.SphereGeometry(0.1, 8, 8);
      const hotelBeacon = new THREE.Mesh(hotelBeaconGeo, glowMat);
      hotelBeacon.position.set(0.48, 5.8, 0.48);
      group.add(hotelBeacon);
      break;
    }

    case 'neon-park': {
      // 2x2 grid, 0.1 flat tile
      const estateGeo = new THREE.BoxGeometry(1.85, 0.06, 1.85);
      const lawn = new THREE.Mesh(estateGeo, mainMat);
      lawn.receiveShadow = true;
      lawn.position.set(0.48, 0, 0.48);
      group.add(lawn);

      // Central bioluminescent concentric circle pond
      const pondGeo = new THREE.TorusGeometry(0.48, 0.08, 6, 16);
      const pond = new THREE.Mesh(pondGeo, glowMat);
      pond.rotation.x = Math.PI / 2;
      pond.position.set(0.48, 0.04, 0.48);
      group.add(pond);

      // Pathway bridge over pool
      const parkBridgeGeo = new THREE.BoxGeometry(0.24, 0.08, 1.4);
      const parkBridge = new THREE.Mesh(parkBridgeGeo, secMat);
      parkBridge.position.set(0.48, 0.05, 0.48);
      group.add(parkBridge);

      // Giant glowing arches
      const archGeo = new THREE.TorusGeometry(0.68, 0.03, 6, 16, Math.PI);
      const arch1 = new THREE.Mesh(archGeo, glowMat);
      arch1.position.set(0.48, 0.01, 0.48);
      // Span across diagonals
      arch1.rotation.y = Math.PI / 4;
      group.add(arch1);
      break;
    }

    case 'rainbow-tree': {
      // 1x1 tree with glowing visual leaves
      const trunkGeo = new THREE.CylinderGeometry(0.05, 0.08, 0.8, 8);
      const trunk = new THREE.Mesh(trunkGeo, darkMat);
      trunk.position.y = 0.4;
      trunk.castShadow = true;
      group.add(trunk);

      // Concentric glowing digital light canopies
      const bottomCanopyGeo = new THREE.BoxGeometry(0.65, 0.18, 0.65);
      const bCanopy = new THREE.Mesh(bottomCanopyGeo, glowMat);
      bCanopy.position.y = 0.9;
      bCanopy.castShadow = true;
      group.add(bCanopy);

      const topCanopyGeo = new THREE.BoxGeometry(0.45, 0.45, 0.45);
      const tCanopy = new THREE.Mesh(topCanopyGeo, glowMat);
      tCanopy.position.y = 1.35;
      tCanopy.castShadow = true;
      group.add(tCanopy);
      break;
    }

    case 'furniture-bed': {
      // Bed wood base 2x2 grid
      const woodenBase = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.25, 1.84), mainMat);
      woodenBase.position.set(0.48, 0.125, 0.48);
      woodenBase.castShadow = true;
      woodenBase.receiveShadow = true;
      group.add(woodenBase);

      // Mattress
      const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.44, 1.72), createMaterial(new THREE.Color(0xf5f5f5), 0.8, 0));
      mattress.position.set(0.48, 0.44, 0.48);
      mattress.castShadow = true;
      group.add(mattress);

      // Bed velvet throw/duvet
      const duvet = new THREE.Mesh(new THREE.BoxGeometry(1.74, 0.2, 1.1), secMat);
      duvet.position.set(0.48, 0.55, 0.78);
      duvet.castShadow = true;
      group.add(duvet);

      // Dual white pillows
      for (const off of [0.15, 0.81]) {
        const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.32), createMaterial(new THREE.Color(0xffffff), 0.9, 0));
        pillow.position.set(off, 0.68, 0.1);
        group.add(pillow);
      }
      break;
    }

    default: {
      // Fallback fallback cube
      const geometry = new THREE.BoxGeometry(tileWidth, itemDef.height, tileWidth);
      const mesh = new THREE.Mesh(geometry, mainMat);
      mesh.position.y = itemDef.height / 2;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }

  // Apply rotation and coordinate translation based on placed entity config
  if (itemDef.category === 'Walls') {
    const wallThickness = 0.14;
    const wallEdgeOffset = -(tileWidth / 2 - wallThickness / 2);
    group.children.forEach((child) => {
      child.position.z += wallEdgeOffset;
    });
  }

  // Apply rotation and coordinate translation based on placed entity config
  group.rotation.y = entity.rotation;

  // Let's configure shadow properties recursively for the group
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  return group;
}

function sirensRight(isNight: boolean, itemDef: ItemDefinition): THREE.Mesh {
  let isEmissive = false;
  let emissiveIntensity = 0.0;
  let emissiveColor = new THREE.Color(0x0a1c1e);
  if (isNight) {
    isEmissive = true;
    emissiveIntensity = 2.5;
    emissiveColor = new THREE.Color(0x0d47a1);
  }
  const glowMat = new THREE.MeshStandardMaterial({
    color: isNight ? new THREE.Color(0x2ef37f) : new THREE.Color(0xff1221),
    emissive: isEmissive ? emissiveColor : new THREE.Color(0x000000),
    emissiveIntensity: emissiveIntensity,
    roughness: 0.2,
    metalness: 0.1,
  });
  const sirenRight = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowMat);
  return sirenRight;
}
