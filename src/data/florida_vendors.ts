
export type BudgetTier = '$' | '$$' | '$$$' | '$$$$';
export type FloridaHub = 'Tampa' | 'Miami' | 'Orlando';
export type VendorCategory = 'Venue' | 'Photo' | 'Floral' | 'Planner';

export interface Vendor {
    id: string;
    name: string;
    tier: BudgetTier;
    hub: FloridaHub;
    styleVector: Record<string, number>; // Scale 0-1
    category: VendorCategory;
    description: string;
    imageUrl: string;
}

export const floridaVendors: Vendor[] = [
    // $$$$ - DREAM (Miami / South Beach Logic)
    {
        id: "v-01",
        name: "Vizcaya Museum & Gardens",
        tier: "$$$$",
        hub: "Miami",
        category: "Venue",
        styleVector: { "Coastal Chic": 0.8, "South Beach Glam": 0.9, "Tropical": 0.4, "Modern Orchard": 0.1 },
        description: "Iconic Italian Renaissance-style estate on Biscayne Bay.",
        imageUrl: "https://images.unsplash.com/photo-1544124971-e962be8c47f7?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-02",
        name: "The Breakers Palm Beach",
        tier: "$$$$",
        hub: "Miami",
        category: "Venue",
        styleVector: { "Coastal Chic": 1.0, "South Beach Glam": 0.8, "Tropical": 0.2, "Modern Orchard": 0.0 },
        description: "Legendary oceanfront resort defined by Renaissance splendor.",
        imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-03",
        name: "Always Flowers Events",
        tier: "$$$$",
        hub: "Miami",
        category: "Floral",
        styleVector: { "South Beach Glam": 1.0, "Modern Orchard": 0.2 },
        description: "High-end conceptual floral design for luxury events.",
        imageUrl: "https://images.unsplash.com/photo-1563245159-f793f19d8c37?q=80&w=600&auto=format&fit=crop"
    },

    // $$$ - EVENT PRO (Orlando / Central FL)
    {
        id: "v-04",
        name: "Cypress Grove Estate House",
        tier: "$$$",
        hub: "Orlando",
        category: "Venue",
        styleVector: { "Modern Orchard": 0.7, "Tropical": 0.3, "Coastal Chic": 0.1 },
        description: "Southern estate offering lakeside charm and vintage vibes.",
        imageUrl: "https://images.unsplash.com/photo-1505944357481-86b48c66e6c5?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-05",
        name: "Concept Photography",
        tier: "$$$",
        hub: "Orlando",
        category: "Photo",
        styleVector: { "Modern Orchard": 0.5, "Everglades": 0.2 },
        description: "Award-winning artistic wedding photography team.",
        imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-06",
        name: "Raining Roses Productions",
        tier: "$$$",
        hub: "Orlando",
        category: "Floral",
        styleVector: { "Tropical": 0.5, "South Beach Glam": 0.3 },
        description: "Premier floral design and production company.",
        imageUrl: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?q=80&w=600&auto=format&fit=crop"
    },

    // $$ - BASIC (Tampa / West Coast)
    {
        id: "v-07",
        name: "Tampa Garden Club",
        tier: "$$",
        hub: "Tampa",
        category: "Venue",
        styleVector: { "Modern Orchard": 0.6, "Coastal Chic": 0.5 },
        description: "Beautiful garden venue on Bayshore Boulevard.",
        imageUrl: "https://images.unsplash.com/photo-1585938389612-a552a28d6914?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-08",
        name: "Limelight Photography",
        tier: "$$",
        hub: "Tampa",
        category: "Photo",
        styleVector: { "Coastal Chic": 0.6, "Tropical": 0.4 },
        description: "Serving the West Coast with bright, vibrant imagery.",
        imageUrl: "https://images.unsplash.com/photo-1520854221256-17451cc330e7?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-09",
        name: "Botanica Design Studio",
        tier: "$$",
        hub: "Tampa",
        category: "Floral",
        styleVector: { "Tropical": 0.8, "Modern Orchard": 0.4 },
        description: "Creative floral designs inspired by nature's textures.",
        imageUrl: "https://images.unsplash.com/photo-1557095655-de7453472093?q=80&w=600&auto=format&fit=crop"
    },

    // $ - DIY (Everglades / Rustic / Statewide)
    {
        id: "v-10",
        name: "Everglades National Park (Permit)",
        tier: "$",
        hub: "Miami",
        category: "Venue",
        styleVector: { "Everglades": 1.0, "Tropical": 0.6 },
        description: "Wilderness elopements for the adventurous couple.",
        imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-11",
        name: "Local Grove & Farm",
        tier: "$",
        hub: "Orlando",
        category: "Venue",
        styleVector: { "Modern Orchard": 0.9, "Coastal Chic": 0.0 },
        description: "Pick-your-own style rustic farm venue.",
        imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop"
    },
    {
        id: "v-12",
        name: "DIY Flower Market",
        tier: "$",
        hub: "Tampa",
        category: "Floral",
        styleVector: { "Modern Orchard": 0.4, "Tropical": 0.4 },
        description: "Wholesale stems for the creative couple.",
        imageUrl: "https://images.unsplash.com/photo-1487037381977-fb0c9cbfa88c?q=80&w=600&auto=format&fit=crop"
    }
];
