import React, { useState } from 'react';
import { SandboxMode, ItemDefinition, GridEntity } from '../types';
import { FLOOR_ITEMS } from '../itemsRegistry';
import {
  Search,
  Grid,
  Sparkles,
  Eraser,
  RotateCw,
  Info,
  Layers,
  ArrowRight,
  MousePointer,
  HelpCircle,
  Plus,
} from 'lucide-react';

interface ItemSidebarProps {
  mode: SandboxMode;
  activeTool: 'place' | 'eraser' | 'rotate' | 'inspect';
  onChangeActiveTool: (tool: 'place' | 'eraser' | 'rotate' | 'inspect') => void;
  selectedItemDef: ItemDefinition | null;
  onSelectItemDef: (item: ItemDefinition) => void;
  placedRotation: number;
  onRotatePlacedItem: () => void;
  selectedEntity: GridEntity | null;
  selectedEntityDef: ItemDefinition | null;
  onClearSelection: () => void;
  onRemoveEntity: (id: string) => void;
  onUpdateEntityStoreys?: (id: string, storeys: number) => void;
  onUpdateEntityColor?: (id: string, color: string) => void;
  placingStoreys?: number;
  onSetPlacingStoreys?: (storeys: number) => void;
}

export const ItemSidebar: React.FC<ItemSidebarProps> = ({
  mode,
  activeTool,
  onChangeActiveTool,
  selectedItemDef,
  onSelectItemDef,
  placedRotation,
  onRotatePlacedItem,
  selectedEntity,
  selectedEntityDef,
  onClearSelection,
  onRemoveEntity,
  onUpdateEntityStoreys,
  onUpdateEntityColor,
  placingStoreys = 10,
  onSetPlacingStoreys,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const registry = FLOOR_ITEMS;

  // Collect distinct categories dynamically + Add "All"
  const categories = ['All', ...Array.from(new Set(registry.map((item) => item.category)))];

  // Filtering
  const filteredItems = registry.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const getRotationDegrees = (rad: number) => {
    const degrees = Math.round((rad * 180) / Math.PI);
    return `${degrees % 360}°`;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-900 border-r border-slate-800 text-slate-100 divide-y divide-slate-800/80">
      
      {/* 1. TOOL SWITCHER CONTROL PANEL */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          PRIMARY ACTION ACTIONS
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {/* Inspect tool */}
          <button
            onClick={() => onChangeActiveTool('inspect')}
            id="tool-inspect"
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium font-mono ${
              activeTool === 'inspect'
                ? 'bg-blue-600 border-blue-400 text-white shadow-md scale-102'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            <span>INSPECT</span>
          </button>

          {/* Place Tool */}
          <button
            onClick={() => {
              onChangeActiveTool('place');
              if (!selectedItemDef && registry.length > 0) {
                onSelectItemDef(registry[0]);
              }
            }}
            id="tool-place"
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium font-mono ${
              activeTool === 'place'
                ? 'bg-emerald-600 border-emerald-400 text-white shadow-md scale-102'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>PLACE ITEM</span>
          </button>

          {/* Rotate Tool */}
          <button
            onClick={() => onChangeActiveTool('rotate')}
            id="tool-rotate"
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium font-mono ${
              activeTool === 'rotate'
                ? 'bg-amber-600 border-amber-400 text-white shadow-md scale-102'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            <span>ROTATE CELL</span>
          </button>

          {/* Eraser Tool */}
          <button
            onClick={() => onChangeActiveTool('eraser')}
            id="tool-eraser"
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-xs font-medium font-mono ${
              activeTool === 'eraser'
                ? 'bg-rose-600 border-rose-400 text-white shadow-md scale-102'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>ERASER</span>
          </button>
        </div>
      </div>

      {/* 2. PLACED ROTATION SETTINGS (Active only in Place tool) */}
      {activeTool === 'place' && selectedItemDef && (
        <div className="p-4 bg-slate-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-medium text-slate-300">
              PLACEMENT ROTATION
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-850 border border-slate-800/80">
              {getRotationDegrees(placedRotation)}
            </span>
          </div>
          <button
            onClick={onRotatePlacedItem}
            id="btn-rotate-preplace"
            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-mono font-semibold text-slate-100 hover:text-white flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>ROTATE SELECTED ITEM (R)</span>
          </button>

          {/* Dynamic pre-placement storey adjuster for structural assets */}
          {selectedItemDef.category === 'Structures' && (
            <div className="space-y-2 pt-3 border-t border-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-[10.5px] font-mono font-medium text-slate-300 uppercase tracking-wide">
                  BUILDING STOREYS (Height)
                </span>
                <span className="text-xs font-mono font-extrabold text-cyan-400 px-2 py-0.5 rounded bg-slate-950 border border-slate-850">
                  {placingStoreys} F
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                value={placingStoreys}
                onChange={(e) => onSetPlacingStoreys?.(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>0 F (Flat footprint)</span>
                <span>45 F</span>
                <span>90 F (Skyline tower)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SEARCH AND CATEGORIZED DIRECTORY LISTING */}
      {activeTool === 'place' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Input */}
          <div className="p-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search blueprints..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs placeholder-slate-500 text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex gap-1.5 px-4 overflow-x-auto py-2 scrollbar-none border-b border-slate-850">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold whitespace-nowrap transition-colors uppercase tracking-wider ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Main List Layout */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isSelected = selectedItemDef?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectItemDef(item)}
                    className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/50 shadow-md'
                        : 'bg-slate-850/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Visual Color Swatch */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/10 shadow-inner relative overflow-hidden"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.secondaryColor && (
                        <div
                          className="w-5 h-5 absolute bottom-0 right-0 rounded-tl-lg"
                          style={{ backgroundColor: item.secondaryColor }}
                        />
                      )}
                      <Grid className="w-4 h-4 text-white/40 mix-blend-overlay" />
                    </div>

                    {/* Metadata */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-semibold text-xs text-slate-100 truncate">
                          {item.name}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shrink-0">
                          {item.gridWidth}x{item.gridLength}
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-600 animate-pulse" />
                <span className="text-xs text-slate-500 font-mono">
                  No matching elements found
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* INSPECTOR DISPLAY INFO PANEL */
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          <div className="p-4 space-y-4 overflow-y-auto">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Inspector Module</span>
            </h3>

            {selectedEntity ? (
              <div className="space-y-4">
                {/* Visual Header */}
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-850/60 flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center border border-white/10"
                    style={{ backgroundColor: selectedEntity.customColor || selectedEntityDef?.color || '#334155' }}
                  >
                    <div className="w-5 h-5 bg-white/20 rounded rotate-12" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-sm text-slate-100">
                      {selectedEntityDef?.name || 'Placed Object'}
                    </h4>
                    <span className="text-[9.5px] font-mono font-bold bg-blue-650 text-blue-200 px-2 py-0.5 rounded uppercase">
                      ID: {selectedEntity.id.substring(0, 8)}
                    </span>
                  </div>
                </div>

                {/* Properties specifications */}
                <div className="space-y-2 font-mono text-[11px] bg-slate-950 p-3.5 rounded-xl border border-slate-850 leading-relaxed text-slate-300">
                  <div className="flex justify-between border-b border-slate-900 pb-1.5">
                    <span className="text-slate-500">CATEGORY:</span>
                    <span className="font-bold text-slate-200">
                      {selectedEntityDef?.category || 'General'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 py-1.5">
                    <span className="text-slate-500">DIMENSION FOOTPRINT:</span>
                    <span className="font-bold text-slate-200">
                      {selectedEntityDef?.gridWidth} x {selectedEntityDef?.gridLength} grid
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 py-1.5">
                    <span className="text-slate-500">GRID LOCATION:</span>
                    <span className="font-bold text-emerald-400">
                      [{selectedEntity.gridX}, {selectedEntity.gridZ}]
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-900 py-1.5">
                    <span className="text-slate-500">VERTICAL LAYER:</span>
                    <span className="font-bold text-cyan-400">
                      Floor level (Lvl {selectedEntity.floorLevel})
                    </span>
                  </div>
                  {selectedEntity.storeys !== undefined && (
                    <div className="flex justify-between border-b border-slate-900 py-1.5">
                      <span className="text-slate-500">HEIGHT CAPACITY:</span>
                      <span className="font-bold text-cyan-400">
                        {selectedEntity.storeys} Storeys (F)
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1.5">
                    <span className="text-slate-500">ORIENTATION:</span>
                    <span className="font-bold text-yellow-400">
                      {getRotationDegrees(selectedEntity.rotation)}
                    </span>
                  </div>
                </div>

                {/* Color Override Input */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-mono font-medium text-slate-300 uppercase tracking-wide">
                      CUSTOM COMPONENT COLOR
                    </span>
                    <label className="relative cursor-pointer">
                      <div className="w-6 h-6 rounded border border-slate-600 shadow-sm" style={{ backgroundColor: selectedEntity.customColor || selectedEntityDef?.color || '#ffffff' }} />
                      <input
                        type="color"
                        value={selectedEntity.customColor || selectedEntityDef?.color || '#ffffff'}
                        onChange={(e) => onUpdateEntityColor?.(selectedEntity.id, e.target.value)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>
                </div>

                {/* Dynamic Storeys Config Inspector Element */}
                {selectedEntityDef?.category === 'Structures' && (
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-mono font-medium text-slate-300 uppercase tracking-wide">
                        AMEND HEIGHT (0 - 90 F)
                      </span>
                      <span className="text-xs font-mono font-extrabold text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                        {selectedEntity.storeys !== undefined ? selectedEntity.storeys : 10} F
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      value={selectedEntity.storeys !== undefined ? selectedEntity.storeys : 10}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        onUpdateEntityStoreys?.(selectedEntity.id, val);
                      }}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>0 F (Pavement)</span>
                      <span>45 F</span>
                      <span>90 F (Apex peak)</span>
                    </div>
                  </div>
                )}

                {/* Description details */}
                <div className="p-3 bg-slate-850/40 rounded-xl text-neutral-400 text-xs leading-relaxed border border-slate-800">
                  <span className="font-bold text-neutral-300 block mb-1">
                    Description:
                  </span>
                  {selectedEntityDef?.description ||
                    'Placed decorative blueprint asset in focus.'}
                </div>

                {/* Quick Deletion Control */}
                <button
                  onClick={() => {
                    onRemoveEntity(selectedEntity.id);
                    onClearSelection();
                  }}
                  id="btn-remove-selected-entity"
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-950/40 border border-rose-900/50 hover:bg-rose-900 text-rose-200 font-mono font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Eraser className="w-4 h-4 text-rose-400" />
                  <span>DEMOLISH ELEMENT</span>
                </button>
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-850 flex flex-col items-center gap-2.5">
                <MousePointer className="w-6 h-6 text-slate-600 animate-bounce" />
                <p className="text-xs text-slate-400 leading-relaxed max-w-[200px]">
                  No item currently in focus. Switch to{' '}
                  <span className="text-amber-400 font-bold">INSPECT</span> tool and click a cell on
                  the grid.
                </p>
                <button
                  onClick={() => onChangeActiveTool('inspect')}
                  className="mt-1.5 px-3 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-700 text-[10.5px] rounded-lg font-mono font-bold"
                >
                  Toggle Inspect View
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-950/45 text-slate-500 text-[10px] leading-relaxed select-none font-mono">
            • Close selection, inspect other components, or press{' '}
            <span className="text-slate-300">ESC</span> to dismiss.
          </div>
        </div>
      )}
    </div>
  );
};
