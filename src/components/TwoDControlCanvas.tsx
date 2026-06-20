import React, { useEffect, useRef, useState } from 'react';
import { GridEntity, SandboxMode, ItemDefinition, EnvironmentPreset } from '../types';
import { FLOOR_ITEMS } from '../itemsRegistry';
import { Eraser, RotateCw, Plus, HelpCircle, Eye } from 'lucide-react';

interface TwoDControlCanvasProps {
  entities: GridEntity[];
  mode: SandboxMode;
  environment: EnvironmentPreset;
  selectedEntityId: string | null;
  onSelectEntity: (id: string | null) => void;
  selectedFloorLevel: number;
  activeTool: 'place' | 'eraser' | 'rotate' | 'inspect';
  selectedItemDef: ItemDefinition | null;
  placedRotation: number; // in radians: 0, Math.PI/2, etc.
  onAddEntity: (entity: Omit<GridEntity, 'id'>) => void;
  onRemoveEntity: (id: string) => void;
  onUpdateEntityRotation: (id: string, nextRotation: number) => void;
  onRotatePlacedItem: () => void;
  gridSize?: number;
}

export const TwoDControlCanvas: React.FC<TwoDControlCanvasProps> = ({
  entities,
  mode,
  environment,
  selectedEntityId,
  onSelectEntity,
  selectedFloorLevel,
  activeTool,
  selectedItemDef,
  placedRotation,
  onAddEntity,
  onRemoveEntity,
  onUpdateEntityRotation,
  onRotatePlacedItem,
  gridSize = 30,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [hoveredCell, setHoveredCell] = useState<{ x: number; z: number } | null>(null);
  const [dimensions, setDimensions] = useState({ size: 450 });

  const activeRegistry = FLOOR_ITEMS;

  // 1. Resize observer to keep canvas perfectly square and fluid
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rect = entries[0].contentRect;
      // Subtract margins to fit in a clean grid box
      const minVal = Math.max(Math.min(rect.width, rect.height) - 12, 280);
      setDimensions({ size: minVal });
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 2. Main Render Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = dimensions.size;
    const ratio = window.devicePixelRatio || 1;

    // High DPI scaling
    canvas.width = size * ratio;
    canvas.height = size * ratio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(ratio, ratio);

    // Padding for grid margins/ruler markings
    const margin = 24;
    const gridArea = size - margin * 2;
    const cellSize = gridArea / gridSize;

    // Background styling based on environment/time-of-day
    if (environment === 'day') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#f0f4f8';
      ctx.fillRect(margin, margin, gridArea, gridArea);
    } else {
      ctx.fillStyle = '#060a14';
      ctx.fillRect(0, 0, size, size);
      ctx.fillStyle = '#0a101f';
      ctx.fillRect(margin, margin, gridArea, gridArea);
    }

    // DRAW GRID LINES
    ctx.lineWidth = 0.5;
    const isNight = environment === 'night';
    ctx.strokeStyle = isNight ? '#1e293b' : '#cbd5e1';

    for (let i = 0; i <= gridSize; i++) {
      const pos = margin + i * cellSize;
      // Vertical Lines
      ctx.beginPath();
      ctx.moveTo(pos, margin);
      ctx.lineTo(pos, margin + gridArea);
      ctx.stroke();

      // Horizontal Lines
      ctx.beginPath();
      ctx.moveTo(margin, pos);
      ctx.lineTo(margin + gridArea, pos);
      ctx.stroke();
    }

    // DRAW RULER LABELS
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isNight ? '#94a3b8' : '#475569';

    // Step labels by 5, or by 2 for smaller grids
    const labelStep = gridSize <= 15 ? 2 : 5;
    for (let i = 0; i <= gridSize; i += labelStep) {
      if (i > gridSize) continue;
      const num = i === gridSize ? gridSize - 1 : i;
      const labelPos = margin + i * cellSize;

      // X Label at top
      ctx.fillText(num.toString(), labelPos, margin - 12);
      // Z Label at left
      ctx.fillText(num.toString(), margin - 12, labelPos);
    }

    // DRAW ENTITIES
    // Render back-layer floor translucent overrides as context guidelines
    entities.forEach((entity) => {
      const itemDef = activeRegistry.find((item) => item.id === entity.type);
      if (!itemDef) return;

      const isCurrentFloor = entity.floorLevel === selectedFloorLevel;
      const isUnderFloor = entity.floorLevel < selectedFloorLevel;

      // Only draw current floor levels AND lower level structures as guidelines
      if (!isCurrentFloor && !isUnderFloor) return;

      ctx.save();

      // Set opacity depending on current layer
      const opacity = isCurrentFloor ? 1.0 : 0.28;
      ctx.globalAlpha = opacity;

      // Center spacing coordinates math
      const baseCellX = margin + entity.gridX * cellSize;
      const baseCellZ = margin + entity.gridZ * cellSize;

      const entitySelected = entity.id === selectedEntityId;

      // Rect dimensional sizes for item bounds
      const w = itemDef.gridWidth * cellSize;
      const l = itemDef.gridLength * cellSize;

      // Move center context pivot to rotate beautifully
      ctx.translate(baseCellX + w / 2, baseCellZ + l / 2);
      ctx.rotate(entity.rotation);

      if (isCurrentFloor) {
        // Main block paint
        ctx.fillStyle = entity.customColor || itemDef.color;
        ctx.fillRect(-w / 2 + 1, -l / 2 + 1, w - 2, l - 2);

        // Highlight inner core
        if (itemDef.secondaryColor) {
          ctx.fillStyle = itemDef.secondaryColor;
          ctx.fillRect(-w * 0.25, -l * 0.25, w * 0.5, l * 0.5);
        }

        // Selected highlights
        if (entitySelected) {
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-w / 2 + 2, -l / 2 + 2, w - 4, l - 4);

          // Add mini anchor cursor
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Orientation arrow point indicators
        ctx.fillStyle = isNight ? '#ffffff' : '#222222';
        ctx.beginPath();
        // points facing UP in local pivot (representing default direction)
        ctx.moveTo(0, -l / 2 + 2);
        ctx.lineTo(-4, -l / 2 + 8);
        ctx.lineTo(4, -l / 2 + 8);
        ctx.closePath();
        ctx.fill();

        // Optional short tag representation for visual clarity
        ctx.fillStyle = isNight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.8)';
        ctx.font = '8px "Inter", sans-serif';
        const labelText = itemDef.name.substring(0, 7) + (entity.storeys !== undefined ? ` (${entity.storeys}F)` : '.');
        ctx.fillText(labelText, 0, l / 2 - 8);

      } else {
        // Lower story trace (drawn grey striped/dashed)
        ctx.strokeStyle = isNight ? '#475569' : '#94a3b8';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(-w / 2 + 2, -l / 2 + 2, w - 4, l - 4);

        ctx.fillStyle = isNight ? 'rgba(71,85,105,0.2)' : 'rgba(148,163,184,0.15)';
        ctx.fillRect(-w / 2 + 2, -l / 2 + 2, w - 4, l - 4);
      }

      ctx.restore();
    });

    // DRAW CELL GHOST PLACEMENT PREVIEW IF PLACING
    if (activeTool === 'place' && hoveredCell && selectedItemDef) {
      const { x: hX, z: hZ } = hoveredCell;

      if (hX >= 0 && hX < gridSize && hZ >= 0 && hZ < gridSize) {
        const w = selectedItemDef.gridWidth;
        const l = selectedItemDef.gridLength;

        // Check bounds logic
        const inBounds = hX + w <= gridSize && hZ + l <= gridSize;

        ctx.save();
        ctx.globalAlpha = 0.52;

        const baseCellX = margin + hX * cellSize;
        const baseCellZ = margin + hZ * cellSize;

        // Translate and Rotate around centered pivot
        ctx.translate(baseCellX + (w * cellSize) / 2, baseCellZ + (l * cellSize) / 2);
        ctx.rotate(placedRotation);

        if (inBounds) {
          ctx.fillStyle = selectedItemDef.color;
          ctx.fillRect((-w * cellSize) / 2 + 1, (-l * cellSize) / 2 + 1, w * cellSize - 2, l * cellSize - 2);

          ctx.strokeStyle = '#10b981'; // Green highlights
          ctx.lineWidth = 2.0;
          ctx.strokeRect((-w * cellSize) / 2 + 2, (-l * cellSize) / 2 + 2, w * cellSize - 4, l * cellSize - 4);
        } else {
          ctx.fillStyle = '#ef4444'; // Red alarm warning block
          ctx.fillRect((-w * cellSize) / 2 + 1, (-l * cellSize) / 2 + 1, w * cellSize - 2, l * cellSize - 2);
        }

        ctx.restore();
      }
    }
  }, [dimensions, entities, selectedFloorLevel, environment, hoveredCell, activeTool, selectedItemDef, placedRotation, selectedEntityId, gridSize]);

  // 3. Translate raw click mouse event to exact grid coordinates
  const handleCanvasAction = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const size = dimensions.size;
    const margin = 24;
    const gridArea = size - margin * 2;
    const cellSize = gridArea / gridSize;

    // Extract exact pixel position
    const clickX = event.clientX - rect.left;
    const clickZ = event.clientY - rect.top;

    // Filter margin clearances
    if (clickX < margin || clickX > margin + gridArea || clickZ < margin || clickZ > margin + gridArea) {
      // Clear selections
      onSelectEntity(null);
      return;
    }

    // Grid coordinates
    const gridX = Math.floor((clickX - margin) / cellSize);
    const gridZ = Math.floor((clickZ - margin) / cellSize);

    if (gridX < 0 || gridX >= gridSize || gridZ < 0 || gridZ >= gridSize) return;

    // EXECUTE CORRESPONDING TOOL LOGIC
    // Find entities on current layer occupying this tile spacing
    const occupying = entities.find(
      (ent) =>
        ent.floorLevel === selectedFloorLevel &&
        gridX >= ent.gridX &&
        gridX < ent.gridX + (activeRegistry.find((i) => i.id === ent.type)?.gridWidth || 1) &&
        gridZ >= ent.gridZ &&
        gridZ < ent.gridZ + (activeRegistry.find((i) => i.id === ent.type)?.gridLength || 1)
    );

    if (activeTool === 'place') {
      if (!selectedItemDef) return;

      // Occupancy checks
      const validBound = gridX + selectedItemDef.gridWidth <= gridSize && gridZ + selectedItemDef.gridLength <= gridSize;
      if (!validBound) return;

      // Overwrite previous items directly at that coordinate space to make placement clean
      if (occupying) {
        onRemoveEntity(occupying.id);
      }

      onAddEntity({
        type: selectedItemDef.id,
        gridX,
        gridZ,
        floorLevel: selectedFloorLevel,
        rotation: placedRotation,
      });
    } else if (activeTool === 'eraser') {
      if (occupying) {
        onRemoveEntity(occupying.id);
      }
    } else if (activeTool === 'rotate') {
      if (occupying) {
        // Toggle rotational steps: 0 -> 90deg -> 180deg -> 270deg
        const nextRot = (occupying.rotation + Math.PI / 2) % (Math.PI * 2);
        onUpdateEntityRotation(occupying.id, nextRot);
      } else if (selectedItemDef) {
        // Empty cell: stamp the last-selected item using the current
        // "rotate cursor" angle (placedRotation), then advance that
        // cursor — mirrors the effect of repeatedly rotating a placed item.
        const validBound =
          gridX + selectedItemDef.gridWidth <= gridSize &&
          gridZ + selectedItemDef.gridLength <= gridSize;
        if (!validBound) return;

        onAddEntity({
          type: selectedItemDef.id,
          gridX,
          gridZ,
          floorLevel: selectedFloorLevel,
          rotation: placedRotation,
        });

        onRotatePlacedItem();
      }
    } else if (activeTool === 'inspect') {
      if (occupying) {
        onSelectEntity(occupying.id);
      } else {
        onSelectEntity(null);
      }
    }
  };

  // 4. Record hover pointer locations
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const margin = 24;
    const gridArea = dimensions.size - margin * 2;
    const cellSize = gridArea / gridSize;

    const mouseX = event.clientX - rect.left;
    const mouseZ = event.clientY - rect.top;

    if (mouseX < margin || mouseX > margin + gridArea || mouseZ < margin || mouseZ > margin + gridArea) {
      setHoveredCell(null);
      return;
    }

    const gridX = Math.floor((mouseX - margin) / cellSize);
    const gridZ = Math.floor((mouseZ - margin) / cellSize);

    setHoveredCell({ x: gridX, z: gridZ });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div
      ref={containerRef}
      id="twod-canvas-container"
      className="w-full h-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-2 relative select-none"
    >
      {/* Dynamic Header Badge for Current Active Layer */}
      <div className="absolute top-2 left-6 px-3 py-1.5 rounded-full bg-slate-900/85 text-white shadow-md z-10 text-[10px] font-mono flex items-center gap-2 border border-slate-700/50 backdrop-blur">
        <Eye className="w-3.5 h-3.5 text-blue-400" />
        <span>EDITING FLOOR LEVEL:</span>
        <span className="font-bold text-cyan-400">{selectedFloorLevel}</span>
      </div>

      <div className="flex-1 flex justify-center w-full">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasAction}
          className="border-2 border-slate-300 dark:border-slate-800 rounded-xl shadow-lg cursor-crosshair max-w-full max-h-full"
        />
      </div>

      {/* Mini Helper Controls Legend bar underneath */}
      <div className="mt-1 flex items-center gap-3 text-[10.5px] font-mono text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-emerald-400 border border-slate-300 rounded" />
          <span>Fitted preview</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-red-400 border border-slate-300 rounded" />
          <span>Collision / Out of bounds</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 bg-slate-400 border border-dashed border-slate-500 rounded" />
          <span>Lower Floor Trace</span>
        </div>
      </div>
    </div>
  );
};
