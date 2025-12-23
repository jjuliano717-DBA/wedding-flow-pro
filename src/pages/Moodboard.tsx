
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Filter, Grid, List, DollarSign, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface SwipedAsset {
    id: string;
    image_url: string;
    category_tag: string;
    vendors: {
        name: string;
    };
    base_cost_low: number;
    base_cost_high: number;
}

export default function Moodboard() {
    const { user } = useAuth();
    const [assets, setAssets] = useState<SwipedAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("All");
    const [view, setView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        if (user?.id) {
            fetchLikedAssets();
        }
    }, [user?.id]);

    const fetchLikedAssets = async () => {
        setLoading(true);
        try {
            // Fetch assets where swipe_direction = 'RIGHT'
            const { data, error } = await supabase
                .from('user_swipes')
                .select(`
                    asset_id,
                    inspiration_assets (
                        id,
                        image_url,
                        category_tag,
                        base_cost_low,
                        base_cost_high,
                        vendors (name)
                    )
                `)
                .eq('user_id', user?.id)
                .eq('swipe_direction', 'RIGHT');

            if (error) throw error;

            const fetchedAssets = data.map((item: any) => ({
                ...item.inspiration_assets,
                id: item.asset_id
            }));

            setAssets(fetchedAssets);
        } catch (error) {
            console.error("Error fetching moodboard:", error);
            toast.error("Could not load your moodboard.");
        } finally {
            setLoading(false);
        }
    };

    const categories = ["All", ...Array.from(new Set(assets.map(a => a.category_tag)))];
    const filteredAssets = filter === "All" ? assets : assets.filter(a => a.category_tag === filter);

    const handleConvertToBudget = (assetId: string) => {
        toast.success("Added to Budget Flow!", {
            description: "We've created a budget candidate for this item.",
            icon: <DollarSign className="w-4 h-4 text-green-500" />
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold"></div>
                <p className="mt-4 text-slate-500 font-serif italic">Curating your vision...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-1000">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-brand-navy mb-2">The Moodboard</h1>
                    <p className="text-slate-500 max-w-lg">
                        Your curated collection of Florida wedding inspirations. Every swipe right builds your dream.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-2 rounded-full shadow-sm border border-slate-100">
                    <div className="flex bg-slate-50 rounded-full p-1">
                        <Button
                            variant={view === "grid" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setView("grid")}
                            className={`rounded-full h-8 w-8 ${view === "grid" ? "bg-brand-navy text-white" : "text-slate-400"}`}
                        >
                            <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                            variant={view === "list" ? "default" : "ghost"}
                            size="icon"
                            onClick={() => setView("list")}
                            className={`rounded-full h-8 w-8 ${view === "list" ? "bg-brand-navy text-white" : "text-slate-400"}`}
                        >
                            <List className="w-4 h-4" />
                        </Button>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-200" />
                    <div className="flex items-center gap-2 pr-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            className="text-sm font-medium bg-transparent border-none focus:outline-none cursor-pointer"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </header>

            {assets.length === 0 ? (
                <div className="space-y-16">
                    <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Heart className="w-10 h-10 text-rose-gold opacity-20" />
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-3">Your vision is a blank canvas</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Head over to the Discovery feed to start swiping on the styles and venues that speak to you.
                        </p>
                        <Link to="/discover">
                            <Button className="bg-rose-gold hover:bg-rose-600 px-8 py-6 rounded-full font-bold">
                                Start Swiping <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>

                    {/* Trending Styles Carousel in Empty State */}
                    <section className="pt-16 border-t border-slate-100">
                        <h2 className="text-2xl font-serif font-bold text-brand-navy mb-8">Jumpstart Your Vision</h2>
                        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Link key={i} to="/discover" className="min-w-[280px] h-[400px] rounded-3xl bg-slate-200 relative group cursor-pointer overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                        <p className="text-xs uppercase tracking-widest mb-1 opacity-80">Beach Minimalism</p>
                                        <h4 className="font-serif font-bold text-xl">Sand & Silk Collection</h4>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                </div>
            ) : (
                <div className={`
                    ${view === "grid"
                        ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
                        : "flex flex-col gap-4 max-w-4xl mx-auto"}
                `}>
                    <AnimatePresence>
                        {filteredAssets.map((asset) => (
                            <motion.div
                                key={asset.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="break-inside-avoid"
                            >
                                <Card className={`group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white ${view === 'list' ? 'flex items-center p-4 gap-6' : ''}`}>
                                    <div className={`${view === 'grid' ? 'w-full' : 'w-24 h-24 shrink-0'} relative overflow-hidden rounded-xl`}>
                                        <img
                                            src={asset.image_url}
                                            alt={asset.category_tag}
                                            className={`${view === 'grid' ? 'w-full' : 'w-full h-full'} object-cover group-hover:scale-105 transition-transform duration-700`}
                                        />
                                        {view === 'grid' && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 text-center">
                                                <Button
                                                    onClick={() => handleConvertToBudget(asset.id)}
                                                    className="bg-white text-brand-navy hover:bg-rose-gold hover:text-white rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                                                >
                                                    <DollarSign className="w-4 h-4 mr-2" /> Convert to Budget
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    <div className={`${view === 'grid' ? 'p-5' : 'flex-1 flex items-center justify-between'}`}>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Badge variant="secondary" className="text-[10px] uppercase tracking-widest bg-rose-50 text-rose-gold border-none">
                                                    {asset.category_tag}
                                                </Badge>
                                            </div>
                                            <h3 className="text-lg font-serif font-bold text-brand-navy leading-tight">
                                                By {asset.vendors.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 mt-1 italic">
                                                Est. ${(asset.base_cost_low / 100).toLocaleString()} - ${(asset.base_cost_high / 100).toLocaleString()}
                                            </p>
                                        </div>

                                        {view === 'list' && (
                                            <Button
                                                onClick={() => handleConvertToBudget(asset.id)}
                                                variant="outline"
                                                className="border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-white transition-all rounded-full"
                                            >
                                                <DollarSign className="w-4 h-4 mr-2" /> Budget flow
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Trending Styles Carousel (Mock) */}
            {assets.length > 0 && (
                <section className="mt-24 pt-16 border-t border-slate-100">
                    <h2 className="text-2xl font-serif font-bold text-brand-navy mb-8">Trending in Florida</h2>
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="min-w-[280px] h-[400px] rounded-3xl bg-slate-200 animate-pulse relative group cursor-pointer overflow-hidden">
                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent text-white">
                                    <p className="text-xs uppercase tracking-widest mb-1 opacity-80">Beach Minimalism</p>
                                    <h4 className="font-serif font-bold text-xl">Sand & Silk Collection</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
