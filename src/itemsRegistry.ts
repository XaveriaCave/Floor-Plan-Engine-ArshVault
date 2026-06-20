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
  },
  
  // LIVING & DINING AREA
  {
    id: 'furniture-sofa-set',
    name: 'Classic Sofa Set',
    category: 'Furniture',
    color: '#8d6e63',
    gridWidth: 3,
    gridLength: 2,
    height: 0.8,
    description: 'A complete living room sofa set for family seating.'
  },
  {
    id: 'furniture-coffee-table-rec',
    name: 'Rectangular Coffee Table',
    category: 'Furniture',
    color: '#a1887f',
    gridWidth: 2,
    gridLength: 1,
    height: 0.45,
    description: 'A long coffee table for the center of the living area.'
  },
  {
    id: 'furniture-tv-console',
    name: 'Modern TV Console',
    category: 'Furniture',
    color: '#424242',
    gridWidth: 3,
    gridLength: 1,
    height: 0.6,
    description: 'Low-profile media console unit.'
  },
  {
    id: 'furniture-accent-chair',
    name: 'Accent Chair',
    category: 'Furniture',
    color: '#ffb74d',
    gridWidth: 1,
    gridLength: 1,
    height: 0.85,
    description: 'A stylish corner or reading chair.'
  },
  {
    id: 'furniture-dining-table-large',
    name: 'Large Dining Table',
    category: 'Furniture',
    color: '#5d4037',
    gridWidth: 3,
    gridLength: 2,
    height: 0.8,
    description: 'Spacious dining table for six.'
  },
  {
    id: 'furniture-dining-chairs',
    name: 'Dining Chairs Set',
    category: 'Furniture',
    color: '#cfd8dc',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Standard wooden dining chair.'
  },
  {
    id: 'furniture-sideboard',
    name: 'Dining Sideboard',
    category: 'Furniture',
    color: '#795548',
    gridWidth: 2,
    gridLength: 1,
    height: 0.9,
    description: 'Storage cabinet for dining ware.'
  },
  {
    id: 'furniture-bookshelf-wide',
    name: 'Wide Bookshelf',
    category: 'Furniture',
    color: '#8d6e63',
    gridWidth: 2,
    gridLength: 1,
    height: 2.0,
    description: 'Broad shelving unit for a home library.'
  },

  // BEDROOM
  {
    id: 'furniture-bed-frame',
    name: 'Basic Bed Frame',
    category: 'Furniture',
    color: '#bcaaa4',
    gridWidth: 2,
    gridLength: 2,
    height: 0.6,
    description: 'Simple wooden bed frame.'
  },
  {
    id: 'furniture-nightstand',
    name: 'Nightstand',
    category: 'Furniture',
    color: '#8d6e63',
    gridWidth: 1,
    gridLength: 1,
    height: 0.5,
    description: 'Small bedside table with drawers.'
  },
  {
    id: 'furniture-wardrobe',
    name: 'Tall Wardrobe',
    category: 'Furniture',
    color: '#5d4037',
    gridWidth: 2,
    gridLength: 1,
    height: 2.2,
    description: 'Standing closet for hanging clothes.'
  },
  {
    id: 'furniture-dresser',
    name: 'Bedroom Dresser',
    category: 'Furniture',
    color: '#a1887f',
    gridWidth: 2,
    gridLength: 1,
    height: 0.9,
    description: 'Horizontal chest of drawers.'
  },
  {
    id: 'furniture-vanity-table',
    name: 'Vanity Table',
    category: 'Furniture',
    color: '#eceff1',
    gridWidth: 2,
    gridLength: 1,
    height: 1.5,
    description: 'Makeup table with an attached mirror.'
  },
  {
    id: 'furniture-bench',
    name: 'End-of-bed Bench',
    category: 'Furniture',
    color: '#9e9e9e',
    gridWidth: 2,
    gridLength: 1,
    height: 0.45,
    description: 'Upholstered seating bench.'
  },

  // KITCHEN
  {
    id: 'fixture-kitchen-counter',
    name: 'Standard Kitchen Counter',
    category: 'Fixtures',
    color: '#e0e0e0',
    gridWidth: 2,
    gridLength: 1,
    height: 0.9,
    description: 'Basic kitchen countertop with cabinets underneath.'
  },
  {
    id: 'fixture-kitchen-sink',
    name: 'Double Kitchen Sink',
    category: 'Fixtures',
    color: '#b0bec5',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Stainless steel double basin sink.'
  },
  {
    id: 'fixture-fridge-basic',
    name: 'Standard Refrigerator',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 1,
    gridLength: 1,
    height: 1.8,
    description: 'Standard white cooling appliance.'
  },
  {
    id: 'fixture-cooking-range',
    name: 'Cooking Range / Oven',
    category: 'Fixtures',
    color: '#37474f',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Stove and oven combination unit.'
  },
  {
    id: 'fixture-dishwasher',
    name: 'Dishwasher Unit',
    category: 'Fixtures',
    color: '#cfd8dc',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Under-counter automatic dishwasher.'
  },
  {
    id: 'fixture-kitchen-island',
    name: 'Kitchen Island',
    category: 'Fixtures',
    color: '#ffcc80',
    gridWidth: 3,
    gridLength: 1,
    height: 0.9,
    description: 'Freestanding kitchen prep island.'
  },
  {
    id: 'furniture-pantry-cabinet',
    name: 'Pantry Cabinet',
    category: 'Furniture',
    color: '#fff59d',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Tall cabinet for dry food storage.'
  },
  {
    id: 'furniture-bar-stool',
    name: 'Bar Stool',
    category: 'Furniture',
    color: '#212121',
    gridWidth: 1,
    gridLength: 1,
    height: 1.1,
    description: 'High stool for kitchen islands or bars.'
  },

  // BATHROOM
  {
    id: 'fixture-wash-basin',
    name: 'Bathroom Wash Basin',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 1,
    gridLength: 1,
    height: 0.85,
    description: 'Ceramic hand wash sink.'
  },
  {
    id: 'fixture-toilet-bowl',
    name: 'Standard Toilet Bowl',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 1,
    gridLength: 1,
    height: 0.8,
    description: 'Standard white toilet.'
  },
  {
    id: 'fixture-shower-enclosure',
    name: 'Glass Shower Enclosure',
    category: 'Fixtures',
    color: '#e0f7fa',
    gridWidth: 1,
    gridLength: 1,
    height: 2.2,
    description: 'Standing shower unit with glass doors.'
  },
  {
    id: 'fixture-bathtub-basic',
    name: 'Standard Bathtub',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 2,
    gridLength: 1,
    height: 0.6,
    description: 'Built-in standard bathtub.'
  },
  {
    id: 'fixture-vanity-mirror',
    name: 'Wall Vanity Mirror',
    category: 'Fixtures',
    color: '#b2ebf2',
    gridWidth: 1,
    gridLength: 1,
    height: 1.0,
    description: 'Reflective mirror placed above basins.'
  },

  // ARCHITECTURAL & STRUCTURAL
  {
    id: 'wall-swing-door',
    name: 'Internal Swing Door',
    category: 'Walls',
    color: '#8d6e63',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Standard hinged wooden door.'
  },
  {
    id: 'wall-sliding-door-int',
    name: 'Internal Sliding Door',
    category: 'Walls',
    color: '#a1887f',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Space-saving sliding partition door.'
  },
  {
    id: 'wall-folding-door',
    name: 'Bi-fold Door',
    category: 'Walls',
    color: '#d7ccc8',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Folding accordion door.'
  },
  {
    id: 'wall-standard-window',
    name: 'Standard Window',
    category: 'Walls',
    color: '#e1f5fe',
    gridWidth: 1,
    gridLength: 1,
    height: 1.2,
    description: 'Common glass window pane for walls.'
  },
  {
    id: 'wall-bay-window',
    name: 'Bay Window',
    category: 'Walls',
    color: '#b3e5fc',
    gridWidth: 2,
    gridLength: 1,
    height: 1.5,
    description: 'Protruding bay window with ledge.'
  },
  {
    id: 'structure-column',
    name: 'Structural Column',
    category: 'Structures',
    color: '#90a4ae',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Load-bearing support pillar.'
  },
  {
    id: 'wall-partition',
    name: 'Thin Partition Wall',
    category: 'Walls',
    color: '#cfd8dc',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Non-load bearing room divider.'
  },
  {
    id: 'structure-staircase',
    name: 'Staircase Flight',
    category: 'Structures',
    color: '#757575',
    gridWidth: 2,
    gridLength: 1,
    height: 2.4,
    description: 'Steps leading to the next floor level.'
  },

  // OFFICE & UTILITY
  {
    id: 'furniture-study-desk',
    name: 'Study Desk',
    category: 'Furniture',
    color: '#8d6e63',
    gridWidth: 2,
    gridLength: 1,
    height: 0.75,
    description: 'Writing or computer desk.'
  },
  {
    id: 'furniture-office-chair',
    name: 'Office Chair',
    category: 'Furniture',
    color: '#424242',
    gridWidth: 1,
    gridLength: 1,
    height: 1.0,
    description: 'Wheeled ergonomic desk chair.'
  },
  {
    id: 'fixture-washing-machine',
    name: 'Washing Machine',
    category: 'Fixtures',
    color: '#eceff1',
    gridWidth: 1,
    gridLength: 1,
    height: 0.85,
    description: 'Front or top loading laundry washer.'
  },
  {
    id: 'fixture-clothes-dryer',
    name: 'Clothes Dryer',
    category: 'Fixtures',
    color: '#cfd8dc',
    gridWidth: 1,
    gridLength: 1,
    height: 0.85,
    description: 'Laundry drying machine.'
  },
  {
    id: 'furniture-utility-shelf',
    name: 'Utility Shelf',
    category: 'Furniture',
    color: '#b0bec5',
    gridWidth: 1,
    gridLength: 1,
    height: 1.8,
    description: 'Metal shelving for garages or utility rooms.'
  }
];
