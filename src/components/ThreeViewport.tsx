import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GridEntity, SandboxMode, EnvironmentPreset, ItemDefinition } from '../types';
import { FLOOR_ITEMS } from '../itemsRegistry';
import { createItemMesh } from '../utils/meshBuilder';
import { Maximize2, Minimize2, RotateCcw, Compass, Sun, Moon, Camera } from 'lucide-react';

interface ThreeViewportProps {
  entities: GridEntity[];
  mode: SandboxMode;
  environment: EnvironmentPreset;
  selectedEntityId: string | null;
  selectedFloorLevel: number;
  onSelectEntity: (id: string | null) => void;
  gridSize?: number;
}

export const ThreeViewport: React.FC<ThreeViewportProps> = ({
  entities,
  mode,
  environment,
  selectedEntityId,
  selectedFloorLevel,
  onSelectEntity,
  gridSize = 30,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for Three.js instances to avoid re-instantiation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Lighting References for live animation / adjustment
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  // Groups
  const entitiesGroupRef = useRef<THREE.Group | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const groundRef = useRef<THREE.Mesh | null>(null);
  const selectionHighlightRef = useRef<THREE.BoxHelper | null>(null);

  // Double checking sizes
  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  // Reset Camera Viewport
  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(gridSize * 0.5, gridSize * 0.8, gridSize * 0.8);
      controlsRef.current.target.set(gridSize / 2, 0, gridSize / 2);
      controlsRef.current.update();
    }
  };

  const handleDownloadImage = () => {
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const canvas = canvasRef.current;
    if (!renderer || !scene || !camera || !canvas) return;

    // Force one extra render pass right before capture so the buffer
    // definitely holds the most current frame, including the latest
    // camera angle / selection highlight.
    renderer.render(scene, camera);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arshvault_${mode}_3dview_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  };

  // 1. Setup Resize Observer on parent container to follow custom guidelines
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      // Guarantee valid sizing to avoid divide-by-zero
      setDimensions({
        width: Math.max(width, 100),
        height: Math.max(height, 100),
      });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isFullscreen]); // Re-observe when full screen state changes

  // 2. Respond to dimension changes on the renderer
  useEffect(() => {
    if (cameraRef.current && rendererRef.current) {
      cameraRef.current.aspect = dimensions.width / dimensions.height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(dimensions.width, dimensions.height);
    }
  }, [dimensions]);

  // 3. Initialize Three.js WebGL and Orbit controls once on mount
  useEffect(() => {
    if (!canvasRef.current) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    // Initial strategic angle focusing at grid center
    camera.position.set(22, 24, 28);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.02; // prevent going below ground
    controls.minDistance = 3;
    controls.maxDistance = 150;
    controls.target.set(15, 0, 15); // midpoint of default 30x30 grid
    controlsRef.current = controls;

    // AMBIENT LIGHT
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    // DIRECTIONAL SUNLIGHT (w/ active shadow cameras)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1548;
    dirLight.shadow.mapSize.height = 1548;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 150;
    const size = 32;
    dirLight.shadow.camera.left = -size;
    dirLight.shadow.camera.right = size;
    dirLight.shadow.camera.top = size;
    dirLight.shadow.camera.bottom = -size;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // HEMISPHERE SKY GRADIENT
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.4);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Entity Group container
    const entitiesGroup = new THREE.Group();
    scene.add(entitiesGroup);
    entitiesGroupRef.current = entitiesGroup;

    // Selection highlight helper
    const selectionHighlight = new THREE.BoxHelper(new THREE.Mesh(), 0x29b6f6);
    selectionHighlight.visible = false;
    scene.add(selectionHighlight);
    selectionHighlightRef.current = selectionHighlight;

    // ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      // Rotate some items subtlely if sunset/night to give lively feeling
      const elapsedTime = clock.getElapsedTime();
      entitiesGroup.children.forEach((groupNode) => {
        // Find turbines inside turbine groups to rotate blades
        if (groupNode.name.includes('entity-')) {
          const turbineNode = groupNode.children.find(
            (n) => n.name === 'turbine-blades'
          );
          if (turbineNode) {
            turbineNode.rotation.z += 0.015;
          }
          // If the group wraps dynamic objects, iterate them
          groupNode.children.forEach((subObj) => {
            if (subObj instanceof THREE.Group) {
              subObj.children.forEach((leaf) => {
                // If it's a blade arm group
                if (leaf.position.y > 3.5 && leaf.children.length === 1) {
                  leaf.rotation.z += 0.02;
                }
              });
            }
          });
        }
      });

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Set initial custom perspective matching mode
    handleResetCamera();

    return () => {
      cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.dispose();
    };
  }, []);

  // Update Grid Helper and Ground plane when dynamic gridSize or selectedFloorLevel changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old helper
    if (gridHelperRef.current) {
      scene.remove(gridHelperRef.current);
    }
    const gridHelper = new THREE.GridHelper(gridSize, gridSize, 0x4f46e5, 0x312e81);
    const height = selectedFloorLevel * 2.4;
    gridHelper.position.set(gridSize / 2, height, gridSize / 2);
    scene.add(gridHelper);
    gridHelperRef.current = gridHelper;

    // Remove and recreate ground mesh based on exact layout dimensions
    if (groundRef.current) {
      scene.remove(groundRef.current);
    }
    const groundGeo = new THREE.PlaneGeometry(gridSize * 2.8, gridSize * 2.8);
    const groundMat = new THREE.MeshStandardMaterial({
      color: environment === 'day' ? 0xffffff : 0x070b14,
      roughness: 0.9,
      metalness: 0.08,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(gridSize / 2, -0.01, gridSize / 2);
    ground.receiveShadow = true;
    scene.add(ground);
    groundRef.current = ground;

    // Shift directional light central shadow frustum camera target to the center
    if (dirLightRef.current) {
      dirLightRef.current.target.position.set(gridSize / 2, 0, gridSize / 2);
    }

    if (controlsRef.current) {
      controlsRef.current.target.set(gridSize / 2, 0, gridSize / 2);
    }
  }, [gridSize, selectedFloorLevel, environment]);

  // 4. Update scene parameters based on layout MODE & environment PRESETS
  useEffect(() => {
    const scene = sceneRef.current;
    const dirLight = dirLightRef.current;
    const hemiLight = hemiLightRef.current;
    const ambientLight = ambientLightRef.current;

    if (!scene || !dirLight || !hemiLight || !ambientLight) return;

    // Clear dynamic skyline elements
    const skyDome = scene.getObjectByName('skydome');
    if (skyDome) scene.remove(skyDome);

    if (environment === 'day') {
      // Crisp daylight
      scene.background = new THREE.Color(0xe0f7fa);
      scene.fog = new THREE.FogExp2(0xe0f7fa, 0.012);

      ambientLight.color.setHex(0xb2ebf2);
      ambientLight.intensity = 0.55;

      dirLight.color.setHex(0xffffff);
      dirLight.intensity = 1.35;
      dirLight.position.set(35, 45, 20);
      dirLight.visible = true;

      hemiLight.color.setHex(0x90caf9); // Sky
      hemiLight.groundColor.setHex(0xd7ccc8); // Ground reflections
      hemiLight.intensity = 0.45;
    } else if (environment === 'sunset') {
      // Cozy sunset gradient hour
      scene.background = new THREE.Color(0xfff3e0);
      scene.fog = new THREE.FogExp2(0xffe0b2, 0.015);

      ambientLight.color.setHex(0xffcc80);
      ambientLight.intensity = 0.45;

      dirLight.color.setHex(0xff7043); // Deep amber
      dirLight.intensity = 1.6;
      dirLight.position.set(40, 15, 12); // Low angle sunset sweeping shadows
      dirLight.visible = true;

      hemiLight.color.setHex(0xab47bc); // Purple sky reflection
      hemiLight.groundColor.setHex(0x5d4037); // Terracotta ground
      hemiLight.intensity = 0.45;
    } else {
      // Cosmic Night Mode
      scene.background = new THREE.Color(0x0a0f1d);
      scene.fog = new THREE.FogExp2(0x0c101f, 0.022);

      ambientLight.color.setHex(0x3f51b5); // Moody blue base
      ambientLight.intensity = 0.18;

      dirLight.color.setHex(0x5c6bc0); // Cool purple moonlight shadow
      dirLight.intensity = 0.22;
      dirLight.position.set(15, 32, 25);
      dirLight.visible = true;

      hemiLight.color.setHex(0x0288d1); // Night sky skybox projection
      hemiLight.groundColor.setHex(0x1a237e);
      hemiLight.intensity = 0.25;
    }
  }, [environment]);

  // 5. Update Grid Helper level float value to match height of selected level
  useEffect(() => {
    if (gridHelperRef.current) {
      const height = selectedFloorLevel * 2.4;
      // Animate grid pointer subtly to float perfectly
      gridHelperRef.current.position.y = height;
    }
  }, [selectedFloorLevel]);

  // 6. Draw and delta-update 3D meshes for entities list
  useEffect(() => {
    const group = entitiesGroupRef.current;
    if (!group) return;

    // Clear old visual children
    while (group.children.length > 0) {
      group.remove(group.children[0]);
    }

    const isNight = environment === 'night';
    const isSunset = environment === 'sunset';

    // Populate active scene tree entities
    entities.forEach((entity) => {
      // Pick matching registry
      const registry = FLOOR_ITEMS;
      const itemDef = registry.find((item) => item.id === entity.type);

      if (itemDef) {
        const itemMesh = createItemMesh(entity, itemDef, isNight, isSunset);

        // Grid spacing starts at local origin (0, height, 0)
        // Set coordinates based on selection.
        // Math matches grid coordinates: X coordinates (0 to 29) map to direct Three workspace units!
        // Stacking vertically depending on floorLevel: floorLevel * height_per_floor (2.4 units per floor)
        const verticalY = entity.floorLevel * 2.4;
        itemMesh.position.set(entity.gridX + 0.5, verticalY, entity.gridZ + 0.5);

        // Custom reference tag to help raycast matching
        itemMesh.userData = { entityId: entity.id };

        group.add(itemMesh);
      }
    });

    // Refresh highlights
    updateHighlight();
  }, [entities, mode, environment]);

  // 7. Watch selection highlight and update wireframe box
  useEffect(() => {
    updateHighlight();
  }, [selectedEntityId, entities]);

  const updateHighlight = () => {
    const highlight = selectionHighlightRef.current;
    const group = entitiesGroupRef.current;
    if (!highlight || !group) return;

    if (!selectedEntityId) {
      highlight.visible = false;
      return;
    }

    // Find the mesh inside the group matching selected entity id
    const matchedMesh = group.children.find(
      (child) => child.userData && child.userData.entityId === selectedEntityId
    );

    if (matchedMesh) {
      highlight.setFromObject(matchedMesh);
      highlight.visible = true;
    } else {
      highlight.visible = false;
    }
  };

  // 8. Handle Mouse Click Raycasting for selection
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    const group = entitiesGroupRef.current;
    if (!canvas || !camera || !group) return;

    // Convert mouse coordinates to normalized device coordinates (-1 to +1)
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    // Intersect the whole entities container
    const intersects = raycaster.intersectObjects(group.children, true);

    if (intersects.length > 0) {
      // Walk parent tree to locate named mesh group containing userData info
      let targetNode = intersects[0].object;
      while (targetNode.parent && targetNode.parent !== group) {
        targetNode = targetNode.parent;
      }

      if (targetNode.userData && targetNode.userData.entityId) {
        onSelectEntity(targetNode.userData.entityId);
        return;
      }
    }

    // Clicked empty background - clear focus selection
    onSelectEntity(null);
  };

  return (
    <div
      ref={containerRef}
      id="three-viewport-container"
      className={
        isFullscreen
          ? 'fixed inset-0 z-[9999] w-screen h-screen bg-slate-950 overflow-hidden'
          : 'relative w-full h-full bg-slate-950 overflow-hidden'
      }
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        id="three-viewport-canvas"
        className="w-full h-full cursor-grab active:cursor-grabbing block"
        onClick={handleCanvasClick}
      />

      {/* Floating Panel Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <button
          onClick={handleDownloadImage}
          id="btn-capture-3d"
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-100 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-1.5 text-xs font-mono"
          title="Download current 3D view as PNG"
        >
          <Camera className="w-4 h-4 text-purple-500" />
          <span>CAPTURE PNG</span>
        </button>
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          id="btn-toggle-fullscreen-3d"
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-100 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-1.5 text-xs font-mono"
          title={isFullscreen ? 'Exit Fullscreen' : 'Enlarge to Fullscreen'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>MINIMIZE VIEW</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-emerald-500" />
              <span>ENLARGE 3D</span>
            </>
          )}
        </button>

        <button
          onClick={handleResetCamera}
          id="btn-reset-view-3d"
          className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-slate-100 shadow-md backdrop-blur-sm transition-all hover:scale-105 active:scale-95 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-1.5 text-xs font-mono"
          title="Reset View (R)"
        >
          <Compass className="w-4 h-4 text-blue-500" />
          <span>RESET CAM</span>
        </button>
      </div>

      {/* Mini Legends & Status Banner */}
      <div className="absolute bottom-4 left-4 p-3 rounded-xl bg-slate-900/85 text-white/90 backdrop-blur-md shadow-lg text-[10px] font-mono border border-slate-800/80 max-w-[240px] pointer-events-none space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-blue-400">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>3D Viewport Controls</span>
        </div>
        <p className="text-slate-300">
          • drag mouse to <span className="text-white font-medium">Orbit</span>
        </p>
        <p className="text-slate-300">
          • scroll wheel to <span className="text-white font-medium">Zoom</span>
        </p>
        <p className="text-slate-300">
          • right-click drag to <span className="text-white font-medium">Pan</span>
        </p>
        <p className="text-slate-300">
          • click model to <span className="text-white font-medium">Select</span>
        </p>
        {selectedEntityId && (
          <div className="pt-1.5 mt-1 border-t border-slate-800 text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>ELEMENT SELECTED</span>
          </div>
        )}
      </div>
    </div>
  );
};
