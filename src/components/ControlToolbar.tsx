import React, { useState, useRef } from 'react';
import { SandboxMode, EnvironmentPreset } from '../types';
import {
  Sparkles,
  Save,
  CheckCircle,
  Undo2,
  Layers,
  MapPin,
  Keyboard,
  Info,
  X,
  Compass,
  Download,
  Upload,
  LayoutGrid,
} from 'lucide-react';

interface ControlToolbarProps {
  mode: SandboxMode;
  environment: EnvironmentPreset;
  selectedFloorLevel: number;
  onSelectFloorLevel: (level: number) => void;
  onRandomize: () => void;
  onSave: () => void;
  onBackToLanding: () => void;
  saveStatus: 'idle' | 'saving' | 'saved';
  gridSize: number;
  onSetGridSize: (size: number) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  mode,
  environment,
  selectedFloorLevel,
  onSelectFloorLevel,
  onRandomize,
  onSave,
  onBackToLanding,
  saveStatus,
  gridSize,
  onSetGridSize,
  onExportJSON,
  onImportJSON,
}) => {
  const [showShortcutsModal, setShowShortcutsModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 text-slate-100 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md z-25 relative">

      {/* 1. LEFT BRAND ACTION & GATEWAY ANCHORS */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToLanding}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-xs font-mono font-bold"
          title="Return to mode selection"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>LEAVE GATEWAY</span>
        </button>

        <div className="h-6 w-[1px] bg-slate-850" />

        <input
          type="file"
          accept=".json,application/json"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportJSON(file);
            e.target.value = ''; // reset so re-selecting the same file re-triggers onChange
          }}
        />

        {/* IMPORT JSON */}
        <button
          onClick={() => fileInputRef.current?.click()}
          id="btn-import-json"
          className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer"
          title="Import blueprint from a JSON file"
        >
          <Upload className="w-3.5 h-3.5 text-cyan-400" />
          <span>IMPORT JSON</span>
        </button>

        {/* EXPORT JSON */}
        <button
          onClick={onExportJSON}
          id="btn-export-json"
          className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer"
          title="Export blueprint as a JSON file"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>EXPORT JSON</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Mode Badge Indicator */}
          <div className="py-1 px-3 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/85 text-xs font-mono font-extrabold flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span>
              {'INTERIOR ARCHITECT FLOORPLAN'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. CENTER PIECE: VERTICAL FLOOR SELECTOR BAR & GRID SIZE PANEL */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-bold font-mono text-slate-400">LAYER LEVEL:</span>

          <div className="flex gap-1">
            {[0, 1, 2].map((lvl) => {
              const isSelected = selectedFloorLevel === lvl;
              return (
                <button
                  key={lvl}
                  onClick={() => onSelectFloorLevel(lvl)}
                  className={`px-3 py-1 text-[11px] font-mono font-bold rounded-lg transition-all ${isSelected
                    ? 'bg-blue-600 text-white shadow-inner scale-102 border border-blue-400'
                    : 'bg-slate-850 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
                    }`}
                >
                  {lvl === 0 ? '0 (Ground)' : `Lvl ${lvl}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Grid Size Slider */}
        <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <LayoutGrid className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold font-mono text-slate-400">GRID SIZE:</span>

          <div className="flex items-center gap-2">
            <input
              type="range"
              min="15"
              max="45"
              step="5"
              value={gridSize}
              onChange={(e) => onSetGridSize(Number(e.target.value))}
              className="w-20 accent-emerald-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs font-bold font-mono text-emerald-400 min-w-[28px] text-right bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
              {gridSize}
            </span>
          </div>
        </div>
      </div>

      {/* 4. ACTIONS: RANDOMIZE | SAVE | SHORTCUT HELPMENU */}
      <div className="flex items-center gap-2">
        {/* Help shortcuts */}
        <button
          onClick={() => setShowShortcutsModal(true)}
          className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:text-slate-250 transition-all font-mono text-xs flex items-center gap-1.5 font-bold cursor-pointer"
        >
          <Keyboard className="w-4 h-4 text-slate-400" />
          <span>SHORTCUTS</span>
        </button>

        {/* RANDOMIZE / CHAOS BUTTON (FR-03) */}
        <button
          onClick={onRandomize}
          id="btn-chaos"
          className="p-2.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-900 text-indigo-300 font-mono text-xs flex items-center justify-center gap-1.5 font-bold transition-all hover:scale-103 active:scale-97 cursor-pointer"
          title="Procedural Generative Chaos Spawning"
        >
          <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>CHAOS SPARK</span>
        </button>

        {/* SAVE BLUEPRINT Persistence (FR-04) */}
        <button
          onClick={onSave}
          id="btn-save-blueprint"
          className={`p-2.5 rounded-xl border font-mono text-xs flex items-center justify-center gap-1.5 font-bold transition-all hover:scale-103 active:scale-97 cursor-pointer ${saveStatus === 'saved'
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-400'
            : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow-md'
            }`}
        >
          {saveStatus === 'saved' ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400 animate-bounce" />
              <span>SAVED!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-white" />
              <span>SAVE BLUEPRINT</span>
            </>
          )}
        </button>
      </div>

      {/* 5. SHORTCUTS INFO DIALOG / MODAL */}
      {showShortcutsModal && (
        <div className="fixed inset-0 bg-slate-950/75 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 relative overflow-hidden flex flex-col gap-4">

            <button
              onClick={() => setShowShortcutsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
              <Keyboard className="w-5 h-5 text-blue-400" />
              <h3 className="font-mono font-bold text-base text-slate-100">
                Blueprint Shortcut Keys
              </h3>
            </div>

            <div className="space-y-2.5 font-mono text-[11.5px] text-slate-300">
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>ROTATE PLACING PLACEMENT:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">R</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>INSPECT TOOL DIRECTIVE:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-bold border border-slate-700">1</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>PLACE GHOST POINTER:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">2</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>ROTATE ROTATE CELL TOOL:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">3</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>ERASER DEMOLITION TOOL:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-rose-400 font-bold border border-slate-700">4</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>SPARK CHAOS LAYOUT:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold border border-slate-700">C</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>SAVE BLUEPRINT PAYLOAD:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold border border-slate-700">S</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>DISMISS ELEMENT FOCUS:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-bold border border-slate-700">ESC</kbd>
              </div>
              <div className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850">
                <span>CYCLE FLOOR VERTICAL:</span>
                <kbd className="px-2 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">F</kbd>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 italic text-center font-mono pt-1">
              Press any of these triggers anywhere on the planner viewport to accelerate.
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
