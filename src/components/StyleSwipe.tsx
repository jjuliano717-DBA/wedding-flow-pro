
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Heart, X, Check } from "lucide-react";
import { toast } from "sonner";

// Florida Styles
const STYLES = [
    { id: "Coastal Chic", label: "Coastal Chic", img: "https://images.unsplash.com/photo-1544124971-e962be8c47f7?q=80&w=600&auto=format&fit=crop" },
    { id: "South Beach Glam", label: "South Beach Glam", img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop" },
    { id: "Tropical", label: "Tropical Lush", img: "https://images.unsplash.com/photo-1557095655-de7453472093?q=80&w=600&auto=format&fit=crop" },
    { id: "Modern Orchard", label: "Modern Orchard", img: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=600&auto=format&fit=crop" },
    { id: "Everglades", label: "Everglades Rustic", img: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600&auto=format&fit=crop" }
];

export const StyleSwipe = ({ onComplete }: { onComplete?: () => void }) => {
    const { user, updateProfile } = useAuth();
    const [index, setIndex] = useState(0);
    const [preferences, setPreferences] = useState<Record<string, number>>(user?.stylePreferences || {});

    const currentStyle = STYLES[index];

    const handleRate = (score: number) => {
        const newPrefs = { ...preferences, [currentStyle.id]: score };
        setPreferences(newPrefs);

        if (index < STYLES.length - 1) {
            setIndex(index + 1);
        } else {
            // Done
            updateProfile({ stylePreferences: newPrefs });
            toast.success("Style Profile Saved!", { description: "We've matched you with Florida's best." });
            if (onComplete) onComplete();
        }
    };

    if (!currentStyle) return <div className="text-center p-8">All Done!</div>;

    return (
        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
            <h2 className="text-2xl font-serif text-center">Find Your Florida Vibe</h2>
            <Card className="w-full overflow-hidden border-none shadow-lg relative group">
                <div className="aspect-[3/4] relative">
                    <img
                        src={currentStyle.img}
                        alt={currentStyle.label}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 p-6 text-white text-center">
                        <h3 className="text-xl font-bold">{currentStyle.label}</h3>
                    </div>
                </div>

            </Card>

            <div className="flex gap-4 w-full justify-center">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-2 border-red-200 text-red-400 hover:bg-red-50 hover:text-red-500 hover:border-red-300"
                    onClick={() => handleRate(0.0)}
                >
                    <X className="w-8 h-8" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 rounded-full border-2 border-champagne text-yellow-600 hover:bg-yellow-50"
                    onClick={() => handleRate(0.5)}
                >
                    <span className="text-lg font-bold">−</span>
                </Button>
                <Button
                    variant="default"
                    size="icon"
                    className="h-14 w-14 rounded-full bg-rose-gold hover:bg-rose-600 shadow-lg text-white"
                    onClick={() => handleRate(1.0)}
                >
                    <Heart className="w-8 h-8 fill-current" />
                </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                {index + 1} / {STYLES.length}
            </p>
        </div>
    );
};
