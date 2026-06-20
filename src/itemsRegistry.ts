import { ItemDefinition } from './types';
export const FLOOR_ITEMS: ItemDefinition[] = [
  // Walls
  {
    id: 'wall-concrete',
    name: 'Concrete Exterior Wall',
    category: 'Walls',
    color: '#90a4ae', // Raw concrete grey
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Load-bearing concrete perimeter wall block.'
  },
  {
    id: 'wall-drywall',
    name: 'Interior dry partition',
    category: 'Walls',
    color: '#eceff1', // Soft drywall white
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Lightweight interior partition separating living spaces.'
  },
  {
    id: 'wall-window',
    name: 'Windowed Wall Panel',
    category: 'Walls',
    color: '#cfd8dc',
    secondaryColor: '#80deea', // Soft cyan glass
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Steel framework with built-in thermal-insulated glass pane.'
  },
  {
    id: 'wall-archway',
    name: 'Architectural Archway',
    category: 'Walls',
    color: '#e0e0e0',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'An open-concept bricked architectural gateway.'
  },
  {
    id: 'wall-sliding-door',
    name: 'Glass Sliding Door',
    category: 'Walls',
    color: '#37474f',
    secondaryColor: '#e0f7fa',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'An elegant sliding patio entrance.'
  },

  // Flooring
  {
    id: 'floor-hardwood',
    name: 'Oak Hardwood Flooring',
    category: 'Flooring',
    color: '#a1887f', // Deep wood tone
    secondaryColor: '#8d6e63',
    gridWidth: 1,
    gridLength: 1,
    height: 0.05,
    isFloorTile: true,
    description: 'Warm, interlocking natural oak wooden planks.'
  },
  {
    id: 'floor-tile',
    name: 'Ceramic Grid Tile',
    category: 'Flooring',
    color: '#e0e0e0', // Pale grey with grid grouting
    secondaryColor: '#bdbdbd',
    gridWidth: 1,
    gridLength: 1,
    height: 0.05,
    isFloorTile: true,
    description: 'High-durability grout lines and non-slip tiles.'
  },
  {
    id: 'floor-rug',
    name: 'Sultana Area Rug',
    category: 'Flooring',
    color: '#c62828', // Royal crimson pattern
    secondaryColor: '#fbc02d',
    gridWidth: 2,
    gridLength: 2,
    height: 0.06,
    isFloorTile: true,
    description: 'Ornate, high-pile decorative floor tapestry.'
  },

  // Fixtures & Lighting
  {
    id: 'fixture-spotlight',
    name: 'Ceiling Spotlight',
    category: 'Fixtures',
    color: '#212121',
    secondaryColor: '#ffeb3b',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    emissiveColor: '#ffea00',
    description: 'Overhead recessed spotlight aiming sharp light indicators downwards.'
  },
  {
    id: 'fixture-sconce',
    name: 'Wall Sconce Fixture',
    category: 'Fixtures',
    color: '#757575',
    secondaryColor: '#ffb300',
    gridWidth: 1,
    gridLength: 1,
    height: 1.5,
    emissiveColor: '#ffb300',
    description: 'A wall-mounted ambient light casting an upwards wash glow.'
  },
  {
    id: 'fixture-counter',
    name: 'Marble Kitchen Console',
    category: 'Fixtures',
    color: '#f5f5f5', // Carrara white marble
    secondaryColor: '#424242', // Chrome faucets
    gridWidth: 2,
    gridLength: 1,
    height: 0.9,
    description: 'Multi-functional island console with high-end integrated sink.'
  },
  {
    id: 'fixture-refrigerator',
    name: 'Smart Refrigerator',
    category: 'Fixtures',
    color: '#b0bec5', // Brushed silver
    secondaryColor: '#00e5ff', // Neon status screen
    gridWidth: 1,
    gridLength: 1,
    height: 2.0,
    emissiveColor: '#00e5ff',
    description: 'Double-french door tall silver cooling appliance.'
  },
  {
    id: 'fixture-toilet',
    name: 'Porcelain Toiletry Unit',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 1,
    gridLength: 1,
    height: 0.8,
    description: 'Vitreous china plumbing fixture.'
  },
  {
    id: 'fixture-bathtub',
    name: 'Deep-Soak Bathtub',
    category: 'Fixtures',
    color: '#ffffff',
    secondaryColor: '#80deea', // Water shimmer
    gridWidth: 2,
    gridLength: 1,
    height: 0.7,
    description: 'Free-standing luxury ergonomic soaking tub.'
  },
  {
    id: 'fixture-tv',
    name: 'Home Entertainment Hub',
    category: 'Fixtures',
    color: '#212121',
    secondaryColor: '#455a64',
    gridWidth: 2,
    gridLength: 1,
    height: 1.2,
    emissiveColor: '#29b6f6',
    description: 'A wide solid wooden console carrying a thin glowing display panel.'
  },

  // Furniture
  {
    id: 'furniture-sofa',
    name: 'L-Shape Sectional Sofa',
    category: 'Furniture',
    color: '#3e2723', // Espresso mahogany leather
    secondaryColor: '#5d4037',
    gridWidth: 2,
    gridLength: 2,
    height: 0.8,
    description: 'Expansive padded leather lounge modules with corner brackets.'
  },
  {
    id: 'furniture-table',
    name: 'Mid-Century Dining Table',
    category: 'Furniture',
    color: '#8d6e63',
    gridWidth: 2,
    gridLength: 1,
    height: 0.75,
    description: 'Warm walnut breakfast table.'
  },
  {
    id: 'furniture-chair',
    name: 'Ergonomic Task Chair',
    category: 'Furniture',
    color: '#1565c0', // Royal blue mesh
    secondaryColor: '#37474f',
    gridWidth: 1,
    gridLength: 1,
    height: 1.0,
    description: 'High-backed swivel chair with lumbar contour pads.'
  },
  {
    id: 'furniture-bookshelf',
    name: 'Hardwood Library Tower',
    category: 'Furniture',
    color: '#5d4037',
    secondaryColor: '#90caf9', // Book clusters
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Vertical shelving filled with assorted books and ornaments.'
  },
  {
    id: 'furniture-monstera',
    name: 'Potted Broadleaf Monstera',
    category: 'Furniture',
    color: '#1b5e20', // Forest green foliage
    secondaryColor: '#8d6e63', // Clay terracotta pot
    gridWidth: 1,
    gridLength: 1,
    height: 1.2,
    description: 'A lush potted houseplant with iconic leaf shapes.'
  },
  {
    id: 'furniture-coffee-table',
    name: 'Minimalist Coffee Table',
    category: 'Furniture',
    color: '#d7ccc8',
    secondaryColor: '#795548',
    gridWidth: 1,
    gridLength: 1,
    height: 0.45,
    description: 'Low-profile circular tabletop resting on wooden legs.'
  },
  {
    id: 'furniture-bed',
    name: 'Deluxe King Bed Unit',
    category: 'Furniture',
    color: '#cfd8dc', // Light grey linen
    secondaryColor: '#0d47a1', // Velvet blue throw
    gridWidth: 2,
    gridLength: 2,
    height: 0.9,
    description: 'Sturdy padded frame with memory foam mattress and soft pillows.'
  }
];
