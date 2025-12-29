
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Heart, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Matrix Data Structure - Aligned with Onboarding Wizard (12 Wedding Styles)
const ARCHETYPES = ['Intimate', 'Boho', 'Rustic', 'Unique', 'Artistic & Thematic', 'Nautical', 'Tropical & Destination', 'Romantic', 'Garden & Fairytale', 'Traditional', 'Formal', 'Modern', 'Urban'];
const CATEGORIES = ['Vibe', 'Venue', 'Florals', 'Decor'];

// Helper to generate a consistent matrix of cards (20 cards across 12 styles)
const STYLE_MATRIX = [
    // Intimate (2 cards)
    { archetype: 'Intimate', category: 'Vibe', label: 'Close & Personal', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=800&fit=crop' },
    { archetype: 'Intimate', category: 'Venue', label: 'Small Gathering', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop' },

    // Boho (2 cards)
    { archetype: 'Boho', category: 'Vibe', label: 'Free-Spirited', img: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&h=800&fit=crop' },
    { archetype: 'Boho', category: 'Florals', label: 'Wildflower Vibes', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop' },

    // Rustic (2 cards)
    { archetype: 'Rustic', category: 'Venue', label: 'Barn & Country', img: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&h=800&fit=crop' },
    { archetype: 'Rustic', category: 'Decor', label: 'Natural Wood', img: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=800&fit=crop' },

    // Unique (2 cards)
    { archetype: 'Unique', category: 'Vibe', label: 'One of a Kind', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop' },
    { archetype: 'Unique', category: 'Decor', label: 'Unexpected Details', img: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=800&fit=crop' },

    // Artistic & Thematic (2 cards)
    { archetype: 'Artistic & Thematic', category: 'Vibe', label: 'Creative Expression', img: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&h=800&fit=crop' },
    { archetype: 'Artistic & Thematic', category: 'Decor', label: 'Bold Statements', img: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&h=800&fit=crop' },

    // Nautical (1 card)
    { archetype: 'Nautical', category: 'Venue', label: 'Waterfront Views', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop' },

    // Tropical & Destination (2 cards)
    { archetype: 'Tropical & Destination', category: 'Vibe', label: 'Beach Paradise', img: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&h=800&fit=crop' },
    { archetype: 'Tropical & Destination', category: 'Venue', label: 'Exotic Locale', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&h=800&fit=crop' },

    // Romantic (2 cards)
    { archetype: 'Romantic', category: 'Vibe', label: 'Soft & Dreamy', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=800&fit=crop' },
    { archetype: 'Romantic', category: 'Florals', label: 'Lush Blooms', img: 'https://images.unsplash.com/photo-1544124971-e962be8c47f7?w=600&h=800&fit=crop' },

    // Garden & Fairytale (2 cards)
    { archetype: 'Garden & Fairytale', category: 'Venue', label: 'Enchanted Garden', img: 'https://images.unsplash.com/photo-1525258437598-0fae8f1e1ed5?w=600&h=800&fit=crop' },
    { archetype: 'Garden & Fairytale', category: 'Decor', label: 'Whimsical Magic', img: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&h=800&fit=crop' },

    // Traditional (1 card)
    { archetype: 'Traditional', category: 'Vibe', label: 'Classic Ceremony', img: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&h=800&fit=crop' },

    // Formal (1 card)
    { archetype: 'Formal', category: 'Venue', label: 'Black Tie Affair', img: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&h=800&fit=crop' },

    // Modern (1 card)
    { archetype: 'Modern', category: 'Vibe', label: 'Contemporary Chic', img: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&h=800&fit=crop' },

    // Urban (1 card)
    { archetype: 'Urban', category: 'Venue', label: 'City Skyline', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=800&fit=crop' },
];

export const StyleSwipe = ({ onComplete }: { onComplete?: () => void }) => {
    const { user, updateProfile } = useAuth();
    const [index, setIndex] = useState(0);
    const [result, setResult] = useState<{ winner: string, text: string } | null>(null);
    const [scores, setScores] = useState<Record<string, number>>({});

    // Shuffle cards once on mount to mix up archetypes
    const shuffledCards = useMemo(() => {
        return [...STYLE_MATRIX].sort(() => Math.random() - 0.5);
    }, []);

    const currentCard = shuffledCards[index];

    const handleVote = (liked: boolean) => {
        let newScores = { ...scores };

        if (liked) {
            const archetype = currentCard.archetype;
            newScores[archetype] = (newScores[archetype] || 0) + 1;
            setScores(newScores);
        }

        if (index < shuffledCards.length - 1) {
            setIndex(index + 1);
        } else {
            // Unmount the card stack by moving index beyond array length
            // setIndex(prev => prev + 1); // Removed to prevent premature transition
            finishVoting(newScores);
        }
    };

    const finishVoting = async (finalScores: Record<string, number>) => {
        // 1. Calculate and Sort Scores
        const sorted = Object.entries(finalScores).sort((a, b) => b[1] - a[1]);

        const max1 = sorted[0];
        const max2 = sorted[1];

        let resultString = "";
        let primaryArchetype = max1 ? max1[0] : 'Modern';
        let secondaryArchetype = null;

        // 2. Apply Threshold Logic
        if (!max2) {
            resultString = `Your wedding style is ${primaryArchetype}.`;
        } else {
            const score1 = max1[1];
            const score2 = max2[1];
            const delta = score1 - score2;

            if (delta > 2) {
                resultString = `Your wedding style is ${primaryArchetype}.`;
            } else {
                secondaryArchetype = max2[0];
                resultString = `Your wedding style is ${primaryArchetype} & ${secondaryArchetype}.`;
            }
        }



        // 3. Save & Notify
        const finalProfile = {
            primaryArchetype,
            secondaryArchetype, // Might be null, that's fine
            scoreBreakdown: finalScores,
            generatedAt: new Date().toISOString()
        };

        // Show results immediately
        setResult({ winner: primaryArchetype, text: resultString });
        setIndex(prev => prev + 1);

        try {
            if (user?.id) {
                await updateProfile({ stylePreferences: finalProfile });
                toast.success("Style Profile Locked!", {
                    description: resultString,
                    duration: 5000,
                });
            }
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Failed to save style to profile", error);
            toast.warning("Could not save to your profile, but here are your moodboard results!");
        }
    };

    if (!currentCard) {
        // Get an image for the result
        const resultImg = STYLE_MATRIX.find(c => c.archetype === result?.winner)?.img || STYLE_MATRIX[0].img;

        return (
            <div className="flex flex-col items-center gap-6 max-w-sm mx-auto animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-serif font-bold text-gray-900">You're All Set!</h2>
                    <p className="text-muted-foreground">{result?.text || "Analyzing your style..."}</p>
                </div>

                <Card className="w-full overflow-hidden border-none shadow-xl relative aspect-[3/4]">
                    <img
                        src={resultImg}
                        alt="Result Style"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                        <p className="tracking-widest uppercase text-sm font-medium opacity-90">Your Match</p>
                        <h3 className="text-3xl font-serif font-bold text-white">{result?.winner}</h3>
                    </div>
                </Card>

                <Button onClick={() => window.location.reload()} className="w-full bg-rose-gold hover:bg-rose-600">
                    <RotateCcw className="mr-2 h-4 w-4" /> Start Over
                </Button>
            </div>
        );
    }

    const progress = ((index) / shuffledCards.length) * 100;

    return (
        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
            <div className="w-full space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground">
                    <span>{currentCard.category}</span>
                    <span>{index + 1} / {shuffledCards.length}</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-gold transition-all duration-300" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <Card className="w-full overflow-hidden border-none shadow-xl relative group aspect-[3/4]">
                <img
                    src={currentCard.img}
                    alt={currentCard.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                    <p className="text-sm font-medium opacity-90 uppercase tracking-widest mb-1">{currentCard.archetype}</p>
                    <h3 className="text-3xl font-serif font-bold text-white">{currentCard.label}</h3>
                </div>
            </Card>

            <div className="flex gap-6 w-full justify-center">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-full border-2 border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 hover:border-slate-300 transition-all hover:scale-110"
                    onClick={() => handleVote(false)}
                >
                    <X className="w-8 h-8" />
                </Button>
                <Button
                    variant="default"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-rose-gold hover:bg-rose-600 shadow-xl shadow-rose-200 text-white transition-all hover:scale-110"
                    onClick={() => handleVote(true)}
                >
                    <Heart className="w-8 h-8 fill-current" />
                </Button>
            </div>
        </div>
    );
};
