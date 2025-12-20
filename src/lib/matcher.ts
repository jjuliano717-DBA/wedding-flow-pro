
import { Vendor } from "../data/florida_vendors";
import { User } from "../context/AuthContext";

/**
 * Calculates a simple similarity score between two style vectors.
 * Mocking a cosine similarity or dot product approach.
 * Range: 0.0 to 1.0
 */
function calculateSimilarity(userVector: Record<string, number>, vendorVector: Record<string, number>): number {
    let dotProduct = 0;
    let userMagnitude = 0;
    let vendorMagnitude = 0;

    // Get all unique tags from both vectors
    const allTags = new Set([...Object.keys(userVector), ...Object.keys(vendorVector)]);

    allTags.forEach((tag) => {
        const uVal = userVector[tag] || 0;
        const vVal = vendorVector[tag] || 0;

        dotProduct += uVal * vVal;
        userMagnitude += uVal * uVal;
        vendorMagnitude += vVal * vVal;
    });

    if (userMagnitude === 0 || vendorMagnitude === 0) return 0;

    return dotProduct / (Math.sqrt(userMagnitude) * Math.sqrt(vendorMagnitude));
}

/**
 * Ranks vendors for a specific user based on:
 * 1. Budget Tier Match (Hard Filter - mostly)
 * 2. Hub Preference (Boost)
 * 3. Style Similarity (Sorting)
 */
export function getRankedVendors(vendors: Vendor[], user: User): { vendor: Vendor; score: number }[] {
    // If user has no preferences, return generic sort
    if (!user.stylePreferences) {
        return vendors.map(v => ({ vendor: v, score: 0 }));
    }

    const scoredVendors = vendors.map((vendor) => {
        let score = calculateSimilarity(user.stylePreferences!, vendor.styleVector);

        // Boost score if in user's Location/Hub (Simple string match for now)
        if (user.location && user.location.includes(vendor.hub)) {
            score += 0.2; // Hub Boost
        }

        // Penalize if tier mismatch (Optional logic)
        // For now, we filter strictly or just rank lower? Let's just boost matches.
        if (user.budgetTier === vendor.tier) {
            score += 0.3; // Tier Perfect Match Boost
        }

        return { vendor, score };
    });

    // Sort descending by score
    return scoredVendors.sort((a, b) => b.score - a.score);
}

/**
 * Enhanced Matching Formula for Planner Dashboard
 * Score = (Style * 0.5) + (Budget * 0.3) + (Availability * 0.2)
 */
export interface CompositeMatch {
    vendor: Vendor;
    totalScore: number;
    breakdown: {
        style: number;
        budget: number;
        availability: number;
    };
}

export function getCompositeRankedVendors(vendors: Vendor[], user: User): CompositeMatch[] {
    return vendors.map(vendor => {
        // 1. Style Score (0-1)
        const styleScore = user.stylePreferences
            ? calculateSimilarity(user.stylePreferences || {}, vendor.styleVector)
            : 0;

        // 2. Budget Score (0-1)
        // Exact tier match = 1.0, Adjacent tier = 0.5, Mismatch = 0
        let budgetScore = 0;
        if (user.budgetTier === vendor.tier) {
            budgetScore = 1.0;
        } else {
            // Basic adjacency logic could go here, for now simulate simple match
            const tiers = ['$', '$$', '$$$', '$$$$'];
            const uIdx = tiers.indexOf(user.budgetTier || '$');
            const vIdx = tiers.indexOf(vendor.tier);
            if (Math.abs(uIdx - vIdx) === 1) budgetScore = 0.5;
        }

        // 3. Availability Score (Mocked: 0-1)
        // In real app, check DB. Here random high availability to keep users happy.
        const availabilityScore = 0.8 + (Math.random() * 0.2);

        // Weighted Total
        const total = (styleScore * 0.5) + (budgetScore * 0.3) + (availabilityScore * 0.2);

        return {
            vendor,
            totalScore: total,
            breakdown: {
                style: styleScore,
                budget: budgetScore,
                availability: availabilityScore
            }
        };
    }).sort((a, b) => b.totalScore - a.totalScore);
}
