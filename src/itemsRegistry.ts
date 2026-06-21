import { ItemDefinition } from './types';

export const FLOOR_ITEMS: ItemDefinition[] = [
  // ===== WALLS (basic, max 2 types) =====
  {
    id: 'wall-concrete',
    name: 'Concrete Exterior Wall',
    category: 'Walls',
    color: '#90a4ae',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Load-bearing concrete perimeter wall block.'
  },
  {
    id: 'wall-drywall',
    name: 'Interior Partition Wall',
    category: 'Walls',
    color: '#eceff1',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Lightweight interior partition separating living spaces.'
  },

  // ===== FLOORING (max 2 types) =====
  {
    id: 'floor-hardwood',
    name: 'Oak Hardwood Flooring',
    category: 'Flooring',
    color: '#a1887f',
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
    color: '#e0e0e0',
    secondaryColor: '#bdbdbd',
    gridWidth: 1,
    gridLength: 1,
    height: 0.05,
    isFloorTile: true,
    description: 'High-durability grout lines and non-slip tiles.'
  },

  // ===== LIGHTING FIXTURES (max 2 types) =====
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
    description: 'Overhead recessed spotlight aiming sharp light downwards.'
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

  // ===== LIVING & DINING AREA =====
  {
    id: 'furniture-sofa-set',
    name: 'Sofa Set',
    category: 'Furniture',
    color: '#3e2723',
    secondaryColor: '#5d4037',
    gridWidth: 3,
    gridLength: 2,
    height: 0.8,
    description: 'A complete living room sofa set for family seating.'
  },
  {
    id: 'furniture-coffee-table',
    name: 'Coffee Table',
    category: 'Furniture',
    color: '#d7ccc8',
    secondaryColor: '#795548',
    gridWidth: 2,
    gridLength: 1,
    height: 0.45,
    description: 'Low-profile rectangular table for the center of the living area.'
  },
  {
    id: 'furniture-tv-console',
    name: 'TV Console',
    category: 'Furniture',
    color: '#212121',
    secondaryColor: '#29b6f6',
    gridWidth: 3,
    gridLength: 1,
    height: 0.6,
    emissiveColor: '#29b6f6',
    description: 'Low-profile media console with a glowing wide display panel.'
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
    name: 'Dining Table',
    category: 'Furniture',
    color: '#5d4037',
    gridWidth: 3,
    gridLength: 2,
    height: 0.8,
    description: 'Spacious dining table for six.'
  },
  {
    id: 'furniture-dining-chairs',
    name: 'Dining Chairs',
    category: 'Furniture',
    color: '#cfd8dc',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Standard wooden dining chair.'
  },
  {
    id: 'furniture-sideboard',
    name: 'Sideboard',
    category: 'Furniture',
    color: '#795548',
    gridWidth: 2,
    gridLength: 1,
    height: 0.9,
    description: 'Storage cabinet for dining ware.'
  },
  {
    id: 'furniture-bookshelf',
    name: 'Bookshelf',
    category: 'Furniture',
    color: '#5d4037',
    secondaryColor: '#90caf9',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Vertical shelving filled with assorted books and ornaments.'
  },

  // ===== BEDROOM =====
  {
    id: 'furniture-bed-frame',
    name: 'Bed Frame',
    category: 'Furniture',
    color: '#cfd8dc',
    secondaryColor: '#0d47a1',
    gridWidth: 2,
    gridLength: 2,
    height: 0.6,
    description: 'Sturdy bed frame with mattress, duvet and pillows.'
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
    name: 'Wardrobe',
    category: 'Furniture',
    color: '#5d4037',
    gridWidth: 2,
    gridLength: 1,
    height: 2.2,
    description: 'Standing closet for hanging clothes.'
  },
  {
    id: 'furniture-dresser',
    name: 'Dresser',
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
    name: 'Bench',
    category: 'Furniture',
    color: '#9e9e9e',
    gridWidth: 2,
    gridLength: 1,
    height: 0.45,
    description: 'Upholstered end-of-bed seating bench.'
  },

  // ===== KITCHEN =====
  {
    id: 'fixture-kitchen-counter',
    name: 'Kitchen Counter',
    category: 'Fixtures',
    color: '#f5f5f5',
    secondaryColor: '#424242',
    gridWidth: 2,
    gridLength: 1,
    height: 0.9,
    description: 'Marble-top kitchen countertop with integrated sink and faucet.'
  },
  {
    id: 'fixture-kitchen-sink',
    name: 'Kitchen Sink',
    category: 'Fixtures',
    color: '#b0bec5',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Stainless steel double basin sink.'
  },
  {
    id: 'fixture-refrigerator',
    name: 'Refrigerator',
    category: 'Fixtures',
    color: '#b0bec5',
    secondaryColor: '#00e5ff',
    gridWidth: 1,
    gridLength: 1,
    height: 2.0,
    emissiveColor: '#00e5ff',
    description: 'Double-french door tall silver cooling appliance with a smart display.'
  },
  {
    id: 'fixture-cooking-range',
    name: 'Cooking Range',
    category: 'Fixtures',
    color: '#37474f',
    gridWidth: 1,
    gridLength: 1,
    height: 0.9,
    description: 'Stove and oven combination unit.'
  },
  {
    id: 'fixture-dishwasher',
    name: 'Dishwasher',
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

  // ===== BATHROOM =====
  {
    id: 'fixture-wash-basin',
    name: 'Wash Basin',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 1,
    gridLength: 1,
    height: 0.85,
    description: 'Ceramic hand wash sink.'
  },
  {
    id: 'fixture-toilet-bowl',
    name: 'Toilet Bowl',
    category: 'Fixtures',
    color: '#ffffff',
    gridWidth: 1,
    gridLength: 1,
    height: 0.8,
    description: 'Vitreous china plumbing fixture with cistern.'
  },
  {
    id: 'fixture-shower-enclosure',
    name: 'Shower Enclosure',
    category: 'Fixtures',
    color: '#e0f7fa',
    gridWidth: 1,
    gridLength: 1,
    height: 2.2,
    description: 'Standing shower unit with glass doors.'
  },
  {
    id: 'fixture-bathtub',
    name: 'Bathtub',
    category: 'Fixtures',
    color: '#ffffff',
    secondaryColor: '#80deea',
    gridWidth: 2,
    gridLength: 1,
    height: 0.7,
    description: 'Free-standing soaking bathtub.'
  },
  {
    id: 'fixture-vanity-mirror',
    name: 'Vanity Mirror',
    category: 'Fixtures',
    color: '#b2ebf2',
    gridWidth: 1,
    gridLength: 1,
    height: 1.0,
    description: 'Reflective mirror placed above basins.'
  },

  // ===== ARCHITECTURAL & STRUCTURAL =====
  {
    id: 'wall-swing-door',
    name: 'Swing Door',
    category: 'Walls',
    color: '#8d6e63',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Standard hinged wooden door.'
  },
  {
    id: 'wall-sliding-door',
    name: 'Sliding Door',
    category: 'Walls',
    color: '#37474f',
    secondaryColor: '#e0f7fa',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'An elegant sliding glass patio entrance.'
  },
  {
    id: 'wall-folding-door',
    name: 'Folding Door',
    category: 'Walls',
    color: '#d7ccc8',
    gridWidth: 1,
    gridLength: 1,
    height: 2.1,
    description: 'Folding accordion door.'
  },
  {
    id: 'wall-window',
    name: 'Standard Window',
    category: 'Walls',
    color: '#cfd8dc',
    secondaryColor: '#80deea',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Steel framework with built-in thermal-insulated glass pane.'
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
    name: 'Partition Wall',
    category: 'Walls',
    color: '#cfd8dc',
    gridWidth: 1,
    gridLength: 1,
    height: 2.4,
    description: 'Non-load bearing room divider.'
  },
  {
    id: 'structure-staircase',
    name: 'Staircase',
    category: 'Structures',
    color: '#757575',
    gridWidth: 2,
    gridLength: 1,
    height: 2.4,
    description: 'Steps leading to the next floor level.'
  },

  // ===== OFFICE & UTILITY =====
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
    name: 'Storage Rack',
    category: 'Furniture',
    color: '#b0bec5',
    gridWidth: 1,
    gridLength: 1,
    height: 1.8,
    description: 'Metal shelving for garages or utility rooms.'
  }
];
