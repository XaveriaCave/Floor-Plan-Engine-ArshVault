export interface GridEntity {
  id: string;          // UUIDv4
  type: string;        // e.g., 'skyscraper-a', 'couch-leather'
  gridX: number;       // Coordinate integer (0 to gridSize - 1)
  gridZ: number;       // Coordinate integer (0 to gridSize - 1)
  floorLevel: number;  // Vertical index (0 = ground, 1 = first floor)
  rotation: number;    // In radians (0, Math.PI/2, Math.PI, 1.5 * Math.PI)
  storeys?: number;    // Customizable storey count (e.g., 0 to 90)
}

export type SandboxMode = 'floor';
export type EnvironmentPreset = 'day' | 'night';

export interface ProjectState {
  mode: SandboxMode;
  entities: GridEntity[];
  environment: EnvironmentPreset;
}

export interface ItemDefinition {
  id: string;
  name: string;
  category: 'Structures' | 'Infrastructure' | 'Decor' | 'Furniture' | 'Walls' | 'Flooring' | 'Fixtures';
  color: string;         // Default primary hex color (used in 2D or 3D)
  secondaryColor?: string;
  gridWidth: number;     // Multi-grid dimensions
  gridLength: number;
  height: number;        // Height in 3D units
  isFloorTile?: boolean; // If true, placed flat on the ground
  emissiveColor?: string; // Color of neon/light emission at night
  description: string;
}
