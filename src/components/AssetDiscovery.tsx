import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Heart, X, RotateCcw, Info, Wallet } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

interface Asset {
    id: string;
    vendor_id: string;
    category_tag: string;
    image_url: string;
    base_cost_low: number;
    base_cost_high: number;
    cost_model: string;
    vendors: {
        name: string;
    };
}

export const AssetDiscovery = () => {
    const { user } = useAuth();
    const [assets, setAssets] = useState<Asset[]>([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [projectId, setProjectId] = useState<string | null>(null);

    useEffect(() => {
        fetchAssets();
        fetchProjectId();
    }, [user?.id]);

    const fetchProjectId = async () => {
        if (!user?.id) return;
        const { data } = await supabase
            .from('projects')
            .select('id')
            .eq('user_id', user.id)
            .limit(1)
            .single();

        if (data) setProjectId(data.id);
    };

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inspiration_assets')
                .select('*, vendors(name)')
                .limit(20);

            if (error) throw error;
            setAssets(data || []);
        } catch (error) {
            console.error("Error fetching assets:", error);
            toast.error("Could not load inspiration assets.");
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (assetId: string, direction: 'RIGHT' | 'LEFT') => {
        if (!user?.id || !projectId) {
            toast.error("Please log in to save your swipes.");
            return;
        }

        // Optimistic UI: move to next card
        setIndex(prev => prev + 1);

        try {
            const response = await fetch('/api/v1/interactions/swipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user.id,
                    asset_id: assetId,
                    project_id: projectId,
                    swipe_direction: direction
                }),
            });

            const data = await response.json();

            if (direction === 'RIGHT' && data.budget_impact) {
                toast.info("Added to Budget!", {
                    description: `Estimated Cost: ${data.budget_impact.total} (${data.budget_impact.breakdown})`,
                    icon: <Wallet className="h-4 w-4 text-green-500" />,
                });
            }
        } catch (error) {
            console.error("Swipe API error:", error);
            // We don't necessarily want to block the UI if the API fails, 
            // but maybe show a subtle warning.
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold"></div>
                <p className="mt-4 text-muted-foreground">Finding inspiration...</p>
            </div>
        );
    }

    const currentAsset = assets[index];

    if (!currentAsset) {
        return (
            <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto text-center py-20 px-4">
                <div className="bg-brand-blush/30 p-8 rounded-full mb-4 animate-in fade-in zoom-in duration-700">
                    <Heart className="w-16 h-16 text-rose-gold opacity-40" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-3xl font-serif font-bold text-brand-navy">
                        {assets.length === 0 ? "Building Your Inspiration Feed" : "You've Seen Everything!"}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
                        {assets.length === 0
                            ? "We're currently curating the best wedding inspirations for you. Check back soon for new styles, venues, and decor!"
                            : "You've swiped through all our current inspirations. Head over to your Budget page to see your saved favorites."}
                    </p>
                </div>
                {assets.length > 0 && (
                    <Button
                        onClick={() => window.location.reload()}
                        variant="outline"
                        className="mt-8 px-8 py-6 rounded-full border-rose-gold text-rose-gold hover:bg-rose-50 transition-all font-semibold"
                    >
                        <RotateCcw className="mr-2 h-5 w-5" /> Start Over
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 max-w-sm mx-auto">
            <div className="w-full space-y-2">
                <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    <span>{currentAsset.category_tag}</span>
                    <span>{index + 1} / {assets.length}</span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-rose-gold transition-all duration-300"
                        style={{ width: `${((index + 1) / assets.length) * 100}%` }}
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentAsset.id}
                    initial={{ opacity: 0, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                >
                    <Card className="w-full overflow-hidden border-none shadow-2xl relative group aspect-[3/4]">
                        <img
                            src={currentAsset.image_url}
                            alt={currentAsset.category_tag}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        <div className="absolute top-4 right-4">
                            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                                <p className="text-white text-xs font-bold tracking-tight">
                                    Est. ${(currentAsset.base_cost_low / 100).toLocaleString()} - ${(currentAsset.base_cost_high / 100).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <p className="text-sm font-medium opacity-80 uppercase tracking-widest mb-1">
                                {currentAsset.vendors.name}
                            </p>
                            <h3 className="text-2xl font-serif font-bold leading-tight">
                                {currentAsset.category_tag} Inspiration
                            </h3>
                            <div className="mt-4 flex items-center gap-2 text-xs opacity-70">
                                <Info className="w-3 h-3" />
                                <span>Swipe right to add to your budget & get a detailed quote</span>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            <div className="flex gap-6 w-full justify-center">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-16 w-16 rounded-full border-2 border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all hover:scale-110 active:scale-95"
                    onClick={() => handleSwipe(currentAsset.id, 'LEFT')}
                >
                    <X className="w-8 h-8" />
                </Button>
                <Button
                    variant="default"
                    size="icon"
                    className="h-16 w-16 rounded-full bg-rose-gold hover:bg-rose-600 shadow-xl shadow-rose-200 text-white transition-all hover:scale-110 active:scale-95"
                    onClick={() => handleSwipe(currentAsset.id, 'RIGHT')}
                >
                    <Heart className="w-8 h-8 fill-current" />
                </Button>
            </div>
        </div>
    );
};
