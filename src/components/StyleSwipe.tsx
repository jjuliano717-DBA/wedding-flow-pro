
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Heart, X, RotateCcw } from "lucide-react";
import { toast } from "sonner";

// Matrix Data Structure
const ARCHETYPES = ['Minimalist', 'Boho', 'Classic', 'Moody', 'Whimsical'];
const CATEGORIES = ['Vibe', 'Venue', 'Florals', 'Decor'];

// Helper to generate a consistent matrix of cards
const STYLE_MATRIX = [
    // Minimalist
    { archetype: 'Minimalist', category: 'Vibe', label: 'Clean & Bright', img: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Minimalist', category: 'Venue', label: 'Industrial Loft', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Minimalist', category: 'Florals', label: 'Single Stem', img: 'https://images.unsplash.com/photo-1596435016830-1017b2b51685?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Minimalist', category: 'Decor', label: 'Ghost Chairs', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600' },

    // Boho
    { archetype: 'Boho', category: 'Vibe', label: 'Warm & Earthy', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Boho', category: 'Venue', label: 'Desert / Forest', img: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Boho', category: 'Florals', label: 'Dried Grasses', img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Boho', category: 'Decor', label: 'Macramé Details', img: 'https://images.unsplash.com/photo-1588602528760-b620b78c85fa?auto=format&fit=crop&q=80&w=600' },

    // Classic
    { archetype: 'Classic', category: 'Vibe', label: 'Timeless Elegance', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Classic', category: 'Venue', label: 'Ballroom Estate', img: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Classic', category: 'Florals', label: 'White Roses', img: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Classic', category: 'Decor', label: 'Crystal & Gold', img: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&q=80&w=600' },

    // Moody
    { archetype: 'Moody', category: 'Vibe', label: 'Dark & Edgy', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Moody', category: 'Venue', label: 'Speakeasy / Vault', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Moody', category: 'Florals', label: 'Deep Burgundy', img: 'https://images.unsplash.com/photo-1596395279361-b1e194e43f55?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Moody', category: 'Decor', label: 'Neon & Velvet', img: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&q=80&w=600' },

    // Whimsical
    { archetype: 'Whimsical', category: 'Vibe', label: 'Playful Color', img: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Whimsical', category: 'Venue', label: 'Garden Tent', img: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Whimsical', category: 'Florals', label: 'Wildflowers', img: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&q=80&w=600' },
    { archetype: 'Whimsical', category: 'Decor', label: 'Fairy Lights', img: 'https://images.unsplash.com/photo-1516142514652-32b0051bf78e?auto=format&fit=crop&q=80&w=600' },
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
        let primaryArchetype = max1 ? max1[0] : 'Classic';
        let secondaryArchetype = null;

        // 2. Apply Threshold Logic
        if (!max2) {
            resultString = `Seems you have a ${primaryArchetype} Wedding Style.`;
        } else {
            const score1 = max1[1];
            const score2 = max2[1];
            const delta = score1 - score2;

            if (delta > 2) {
                resultString = `Seems you have a ${primaryArchetype} Wedding Style.`;
            } else {
                secondaryArchetype = max2[0];
                resultString = `Seems you have a ${primaryArchetype} and ${secondaryArchetype} Wedding Style.`;
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                        <p className="tracking-widest uppercase text-sm font-medium opacity-90">Your Match</p>
                        <h3 className="text-3xl font-serif font-bold">{result?.winner}</h3>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                    <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">{currentCard.archetype}</p>
                    <h3 className="text-3xl font-serif font-bold">{currentCard.label}</h3>
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
