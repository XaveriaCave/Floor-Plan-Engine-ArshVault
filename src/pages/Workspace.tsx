import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SandboxMode, EnvironmentPreset, GridEntity, ItemDefinition } from '../types';
import { FLOOR_ITEMS } from '../itemsRegistry';

import { ControlToolbar } from '../components/ControlToolbar';
import { ItemSidebar } from '../components/ItemSidebar';
import { TwoDControlCanvas } from '../components/TwoDControlCanvas';
import { ThreeViewport } from '../components/ThreeViewport';
import { EnvironmentalControls } from '../components/EnvironmentalControls';
import {
  Menu,
  ChevronLeft,
  X,
  Compass,
  AlertCircle,
  Code,
  LayoutGrid,
  Monitor,
} from 'lucide-react';
import { LoadingOverlay } from '../components/LoadingOverlay';

export default function Workspace() {
  const navigate = useNavigate();
  // Navigation View Coordinator
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState('Compiling blueprint...');
  const [view, setView] = useState<'workspace'>('workspace');
  const mode: SandboxMode = 'floor';

  // Entities & layout setups
  const [entities, setEntities] = useState<GridEntity[]>([]);
  const [selectedFloorLevel, setSelectedFloorLevel] = useState<number>(0);
  const [environment, setEnvironment] = useState<EnvironmentPreset>('day');
  const [gridSize, setGridSize] = useState<number>(30); // dynamic grid size state

  // Interactive building variables
  const [activeTool, setActiveTool] = useState<'place' | 'eraser' | 'rotate' | 'inspect'>('place');
  const [selectedItemDef, setSelectedItemDef] = useState<ItemDefinition | null>(null);
  const [placedRotation, setPlacedRotation] = useState<number>(0);
  const [placingStoreys, setPlacingStoreys] = useState<number>(10); // dynamic placing height capacity (0 to 90 storeys)

  // Inspector element selection
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);

  // Status indicators & saved caches counts
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [savedFloorCount, setSavedFloorCount] = useState<number>(0);

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' } | null>(null);

  // Responsive layout elements
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<'2d' | '3d'>('2d');

  // Helper registry selection
  const activeRegistry = FLOOR_ITEMS;

  // On page load, compute counts of saved layouts in localStorage
  useEffect(() => {
    updateSavedDraftCounts();
  }, []);

  const updateSavedDraftCounts = () => {
    try {
      const floorData = localStorage.getItem('gridcraft_blueprint_floor');

      if (floorData) {
        const parsed = JSON.parse(floorData);
        setSavedFloorCount(Array.isArray(parsed) ? parsed.length : 0);
      } else {
        setSavedFloorCount(0);
      }
    } catch (e) {
      console.error('Failed reading template blueprint caches', e);
    }
  };

  const showToast = (message: string, type: 'info' | 'success' = 'info') => {
    setToast({ message, type });
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  };

  // Keyboard shortcut bindings effect
  useEffect(() => {
    if (view !== 'workspace') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside text searches/inputs
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }

      const key = e.key.toLowerCase();

      if (key === 'r') {
        // Rotate placing rotation prior to stamping
        setPlacedRotation((prev) => (prev + Math.PI / 2) % (Math.PI * 2));
        showToast('Placement rotation dialed clockwise.');
      } else if (key === '1') {
        setActiveTool('inspect');
        showToast('Pointer inspection mode active.');
      } else if (key === '2') {
        setActiveTool('place');
        showToast('Construction item placement active.');
      } else if (key === '3') {
        setActiveTool('rotate');
        showToast('Rotate cells tool active.');
      } else if (key === '4') {
        setActiveTool('eraser');
        showToast('Eraser/Demolish tool active.');
      } else if (key === 'c') {
        handleRandomize();
      } else if (key === 's') {
        e.preventDefault();
        handleSave();
      } else if (key === 'escape') {
        setSelectedEntityId(null);
        showToast('Focus selection dismissed.');
      } else if (key === 'f') {
        // Cycle floor levels
        setSelectedFloorLevel((prev) => (prev + 1) % 3);
        showToast(`Swapped to Vertical level layer.`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, mode, entities, placedRotation]);

  // Entrance routing selector
  const handleSelectMode = (selectedMode: SandboxMode, loadSaved: boolean) => {
    setView('workspace');
    setSelectedFloorLevel(0);
    setEnvironment('day');
    setPlacedRotation(0);
    setSelectedEntityId(null);
    setActiveTool('place');

    const registry = FLOOR_ITEMS;
    setSelectedItemDef(registry[0] || null);

    if (loadSaved) {
      try {
        const raw = localStorage.getItem(`gridcraft_blueprint_floor`);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setEntities(parsed);
            showToast(`Loaded ${parsed.length} elements from recent blueprint backup.`, 'success');
            return;
          }
        }
      } catch (e) {
        console.error('Failed restoring localStorage blueprints', e);
      }
    }

    // Default start fresh: blank canvas or demo initial items
    setEntities([]);
    showToast('Starting fresh blueprint sandbox canvas.');
  };

  const handleClearSaved = (selectedMode: SandboxMode) => {
    localStorage.removeItem(`gridcraft_blueprint_${selectedMode}`);
    updateSavedDraftCounts();
    showToast('Sandbox localStorage blueprint successfully purged.');
  };

  // ADD ENTITY TO BLUEPRINT GRIDS
  const handleAddEntity = (entityData: Omit<GridEntity, 'id'>) => {
    // Generate fresh item coordinates instance with UUID
    const id = `entity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const itemDef = activeRegistry.find((i) => i.id === entityData.type);
    const fresh: GridEntity = {
      id,
      ...entityData,
      storeys: itemDef?.category === 'Structures' ? (entityData.storeys !== undefined ? entityData.storeys : placingStoreys) : undefined,
    };

    setEntities((prev) => [...prev, fresh]);
    showToast(`Placed ${itemDef?.name} on grid.`, 'success');
  };

  // REMOVE ENTITY (DEMOLISHION)
  const handleRemoveEntity = (id: string) => {
    const target = entities.find((e) => e.id === id);
    const itemDef = activeRegistry.find((i) => i.id === target?.type);

    setEntities((prev) => prev.filter((item) => item.id !== id));
    if (selectedEntityId === id) {
      setSelectedEntityId(null);
    }
    showToast(`Demolished ${itemDef?.name || 'placed unit'} from blueprints.`);
  };

  // UPDATE ROTATION IN PLACE
  const handleUpdateEntityRotation = (id: string, nextRotation: number) => {
    setEntities((prev) =>
      prev.map((ent) => (ent.id === id ? { ...ent, rotation: nextRotation } : ent))
    );
    showToast('Rotated placed cell components.');
  };

  // UPDATE STOREYS IN PLACE
  const handleUpdateEntityStoreys = (id: string, storeys: number) => {
    setEntities((prev) =>
      prev.map((ent) => (ent.id === id ? { ...ent, storeys } : ent))
    );
  };

  const handleRotatePreplaceItem = () => {
    setPlacedRotation((prev) => (prev + Math.PI / 2) % (Math.PI * 2));
  };

  // CHAOS RANDOMIZER PROCEDURAL GENERATIVE SHUFFLER (FR-03)
  const handleRandomize = () => {
    const registry = FLOOR_ITEMS;
    const generated: GridEntity[] = [];
    const occupied = new Set<string>(); // composite string index matching "floor-gridX-gridZ"

    // Spawns 12-18 random assets safely on grid clearances to satisfy procedural chaos buttons
    const targetCount = Math.floor(Math.random() * 7) + 12;

    for (let i = 0; i < targetCount; i++) {
      const item = registry[Math.floor(Math.random() * registry.length)];
      const randomFloorLvl = Math.floor(Math.random() * 3); // random levels 0, 1, 2

      let searchValid = false;
      // up to 60 randomized cell trial snaps to avoid high computational overlaps
      for (let trials = 0; trials < 60; trials++) {
        const rx = Math.floor(Math.random() * (gridSize - item.gridWidth + 1));
        const rz = Math.floor(Math.random() * (gridSize - item.gridLength + 1));

        let doesOverlap = false;

        // check footprint cell occupancies
        for (let dx = 0; dx < item.gridWidth; dx++) {
          for (let dz = 0; dz < item.gridLength; dz++) {
            if (occupied.has(`${randomFloorLvl}-${rx + dx}-${rz + dz}`)) {
              doesOverlap = true;
              break;
            }
          }
          if (doesOverlap) break;
        }

        if (!doesOverlap) {
          // stamp occupied locks
          for (let dx = 0; dx < item.gridWidth; dx++) {
            for (let dz = 0; dz < item.gridLength; dz++) {
              occupied.add(`${randomFloorLvl}-${rx + dx}-${rz + dz}`);
            }
          }

          const rotOptions = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
          const rRot = rotOptions[Math.floor(Math.random() * rotOptions.length)];

          generated.push({
            id: `rand-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            type: item.id,
            gridX: rx,
            gridZ: rz,
            floorLevel: randomFloorLvl,
            rotation: rRot,
          });

          searchValid = true;
          break;
        }
      }
    }

    setEntities(generated);
    setSelectedEntityId(null);
    showToast(`Chaos Spawner instanced ${generated.length} procedural elements.`, 'success');
  };

  // LOCAL STORAGE SERIALIZATION SAVE ACTION
  const handleSave = () => {
    try {
      localStorage.setItem(`gridcraft_blueprint_${mode}`, JSON.stringify(entities));
      setSaveStatus('saved');
      showToast('Blueprint saved successfully to local browser.', 'success');
      setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);
      updateSavedDraftCounts();
    } catch (e) {
      console.error('Failed writing blueprint state', e);
      showToast('Failed to write local database configurations.', 'info');
    }
  };

  // EXPORT FULL BLUEPRINT STATE AS DOWNLOADABLE JSON
  const handleExportJSON = () => {
    try {
      const payload = {
        version: 1,
        mode,
        environment,
        gridSize,
        entities,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arshvault_${mode}_blueprint_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Blueprint exported as JSON file.', 'success');
    } catch (e) {
      console.error('Failed exporting JSON', e);
      showToast('Failed to export blueprint JSON.', 'info');
    }
  };

  // IMPORT BLUEPRINT STATE FROM A USER-SELECTED JSON FILE
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed || !Array.isArray(parsed.entities)) {
          showToast('Invalid blueprint JSON — missing entities array.', 'info');
          return;
        }

        // Basic shape validation on each entity before trusting it
        const isValidEntity = (e: any) =>
          e &&
          typeof e.id === 'string' &&
          typeof e.type === 'string' &&
          typeof e.gridX === 'number' &&
          typeof e.gridZ === 'number' &&
          typeof e.floorLevel === 'number' &&
          typeof e.rotation === 'number';

        if (!parsed.entities.every(isValidEntity)) {
          showToast('Blueprint JSON contains malformed entity records.', 'info');
          return;
        }

        setEntities(parsed.entities);
        setSelectedEntityId(null);

        if (parsed.environment === 'day' || parsed.environment === 'night') {
          setEnvironment(parsed.environment);
        }

        if (typeof parsed.gridSize === 'number' && parsed.gridSize >= 15 && parsed.gridSize <= 45) {
          setGridSize(parsed.gridSize);
        }

        showToast(`Imported ${parsed.entities.length} elements from blueprint JSON.`, 'success');
      } catch (e) {
        console.error('Failed importing JSON', e);
        showToast('Failed to parse blueprint JSON file — check file format.', 'info');
      }
    };
    reader.readAsText(file);
  };



  const selectedEntity = selectedEntityId ? entities.find((e) => e.id === selectedEntityId) || null : null;
  const selectedEntityDef = selectedEntity ? activeRegistry.find((i) => i.id === selectedEntity.type) || null : null;

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-100 font-sans antialiased">

      {/* 1. Header Toolbar Controls */}
      <ControlToolbar
        mode={mode}
        environment={environment}
        selectedFloorLevel={selectedFloorLevel}
        onSelectFloorLevel={setSelectedFloorLevel}
        onRandomize={handleRandomize}
        onSave={handleSave}
        onBackToLanding={() => navigate('/')}
        saveStatus={saveStatus}
        gridSize={gridSize}
        onSetGridSize={setGridSize}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
      />

      {/* 2. Primary Editor workspace columns split */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* SIDEBAR COMPONENT SELECTION (Hidden on mobile inside sliding drawer) */}
        {/* Desktop Sidebar Column */}
        <aside className="hidden lg:block w-[340px] shrink-0 border-r border-slate-850 h-full overflow-hidden">
          <ItemSidebar
            mode={mode}
            activeTool={activeTool}
            onChangeActiveTool={setActiveTool}
            selectedItemDef={selectedItemDef}
            onSelectItemDef={setSelectedItemDef}
            placedRotation={placedRotation}
            onRotatePlacedItem={handleRotatePreplaceItem}
            selectedEntity={selectedEntity}
            selectedEntityDef={selectedEntityDef}
            onClearSelection={() => setSelectedEntityId(null)}
            onRemoveEntity={handleRemoveEntity}
            onUpdateEntityStoreys={handleUpdateEntityStoreys}
            placingStoreys={placingStoreys}
            onSetPlacingStoreys={setPlacingStoreys}
          />
        </aside>

        {/* Mobile Sidebar sliding drawer overlay */}
        {isSidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-slate-950/80 z-40 flex backdrop-blur-sm">
            <div className="w-[300px] h-full bg-slate-900 border-r border-slate-800 animate-slide-in relative flex flex-col">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-50 p-1 bg-slate-950/40 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex-1 overflow-hidden pt-10">
                <ItemSidebar
                  mode={mode}
                  activeTool={activeTool}
                  onChangeActiveTool={setActiveTool}
                  selectedItemDef={selectedItemDef}
                  onSelectItemDef={(item) => {
                    setSelectedItemDef(item);
                    setIsSidebarOpen(false); // Auto close drawer on click item
                  }}
                  placedRotation={placedRotation}
                  onRotatePlacedItem={handleRotatePreplaceItem}
                  selectedEntity={selectedEntity}
                  selectedEntityDef={selectedEntityDef}
                  onClearSelection={() => setSelectedEntityId(null)}
                  onRemoveEntity={handleRemoveEntity}
                  onUpdateEntityStoreys={handleUpdateEntityStoreys}
                  placingStoreys={placingStoreys}
                  onSetPlacingStoreys={setPlacingStoreys}
                />
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
          </div>
        )}

        {/* WORKSPACE DOUBLE PANEL SPLIT RENDERING */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-900">

          {/* Dynamic Environment Lighting Toolbar widget */}
          <EnvironmentalControls activePreset={environment} onSetPreset={setEnvironment} />

          {/* Desktop Dual-Pane Layout Grid (Split screen) */}
          <div className="flex-1 hidden md:grid grid-cols-2 overflow-hidden bg-slate-900">
            {/* 2D CANVAS SECTION */}
            <div className="h-full border-r border-slate-850 overflow-hidden flex flex-col relative select-none">
              <div className="p-3 bg-slate-950/60 text-slate-400 font-mono text-[10.5px] uppercase border-b border-slate-850 flex items-center justify-between">
                <span>2D Interactive Plan view</span>
                <span className="text-cyan-400 font-bold">GRID SNAPPING ACTIVE</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <TwoDControlCanvas
                  entities={entities}
                  mode={mode}
                  environment={environment}
                  selectedEntityId={selectedEntityId}
                  onSelectEntity={setSelectedEntityId}
                  selectedFloorLevel={selectedFloorLevel}
                  activeTool={activeTool}
                  selectedItemDef={selectedItemDef}
                  placedRotation={placedRotation}
                  onAddEntity={handleAddEntity}
                  onRemoveEntity={handleRemoveEntity}
                  onUpdateEntityRotation={handleUpdateEntityRotation}
                  onRotatePlacedItem={handleRotatePreplaceItem}
                  gridSize={gridSize}
                />
              </div>
            </div>

            {/* 3D VIEWPORT SECTION */}
            <div className="h-full overflow-hidden flex flex-col relative select-none">
              <div className="p-3 bg-slate-950/60 text-slate-400 font-mono text-[10.5px] uppercase border-b border-slate-850 flex items-center justify-between">
                <span>Real-time high-fidelity 3D render</span>
                <span className="text-indigo-400 font-bold">WEBGL ENABLED</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <ThreeViewport
                  entities={entities}
                  mode={mode}
                  environment={environment}
                  selectedEntityId={selectedEntityId}
                  selectedFloorLevel={selectedFloorLevel}
                  onSelectEntity={setSelectedEntityId}
                  gridSize={gridSize}
                />
              </div>
            </div>
          </div>

          {/* Mobile Tab-Switching View layout */}
          <div className="flex-1 md:hidden flex flex-col overflow-hidden relative">
            <div className="flex bg-slate-950 border-b border-slate-850 py-1 px-2 gap-1 justify-around">
              <button
                onClick={() => setMobileTab('2d')}
                className={`flex-1 py-2 font-mono text-xs font-bold text-center rounded-lg transition-colors ${mobileTab === '2d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                  }`}
              >
                2D COMPENSATOR
              </button>
              <button
                onClick={() => setMobileTab('3d')}
                className={`flex-1 py-2 font-mono text-xs font-bold text-center rounded-lg transition-colors ${mobileTab === '3d' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                  }`}
              >
                3D RENDER CELL
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
              {mobileTab === '2d' ? (
                <TwoDControlCanvas
                  entities={entities}
                  mode={mode}
                  environment={environment}
                  selectedEntityId={selectedEntityId}
                  onSelectEntity={setSelectedEntityId}
                  selectedFloorLevel={selectedFloorLevel}
                  activeTool={activeTool}
                  selectedItemDef={selectedItemDef}
                  placedRotation={placedRotation}
                  onAddEntity={handleAddEntity}
                  onRemoveEntity={handleRemoveEntity}
                  onUpdateEntityRotation={handleUpdateEntityRotation}
                  gridSize={gridSize}
                />
              ) : (
                <ThreeViewport
                  entities={entities}
                  mode={mode}
                  environment={environment}
                  selectedEntityId={selectedEntityId}
                  selectedFloorLevel={selectedFloorLevel}
                  onSelectEntity={setSelectedEntityId}
                  gridSize={gridSize}
                />
              )}
            </div>
          </div>
        </main>
      </div>

      {/* MOBILE TRIGGER FLOATING BUTTON LISTS */}
      {/* 1. Mobile Sidebar FAB trigger */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 p-4 rounded-full bg-blue-600 text-white shadow-2xl shadow-blue-500/50 hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all z-30 border border-blue-400 flex items-center justify-center cursor-pointer"
        title="Open Tool Drawer"
      >
        <Menu className="w-5 h-5 text-white" />
      </button>

      {/* FLOAT NOTIFICATION TOAST BAR */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-slate-100 flex items-center gap-2 shadow-2xl z-50 backdrop-blur-md anim-fade-in text-xs font-mono">
          <div className={`w-2 h-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-400 animate-ping' : 'bg-blue-400'}`} />
          <span className="font-semibold text-slate-200">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
