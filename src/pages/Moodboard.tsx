
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Filter, Grid, List, DollarSign, ArrowRight, FileText, CheckCircle2, Clock, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";

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

interface Quote {
    id: string;
    status: 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED';
    grand_total_cents: number;
    created_at: string;
    vendor_id: string;
    vendors: {
        name: string;
    } | any;
    items: any[];
}

export default function Moodboard() {
    const { user } = useAuth();
    const [assets, setAssets] = useState<SwipedAsset[]>([]);
    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"moodboard" | "bookings">("moodboard");
    const [filter, setFilter] = useState("All");
    const [view, setView] = useState<"grid" | "list">("grid");

    useEffect(() => {
        if (user?.id) {
            fetchLikedAssets();
            fetchQuotes();
        }
    }, [user?.id]);

    const fetchLikedAssets = async () => {
        try {
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

            const fetchedAssets = (data || []).map((item: any) => ({
                ...item.inspiration_assets,
                id: item.asset_id
            }));

            setAssets(fetchedAssets);
        } catch (error) {
            console.error("Error fetching moodboard:", error);
        }
    };

    const fetchQuotes = async () => {
        try {
            const { data, error } = await supabase
                .from('quotes')
                .select(`
                    *,
                    vendors ( name )
                `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setQuotes(data || []);
        } catch (error) {
            console.error("Error fetching quotes:", error);
            // Don't toast if table missing
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
        <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-1000 bg-white min-h-screen">
            <header className="mb-12 border-b border-rose-50 pb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <h1 className="text-5xl font-serif font-extrabold text-[#2D334A] mb-3 tracking-tight">The Moodboard</h1>
                        <p className="text-slate-500 max-w-lg font-medium">
                            Your curated collection and booking progress for your Florida wedding.
                        </p>
                    </div>

                    <div className="flex items-center gap-1 bg-[#FFF5F7] p-1.5 rounded-2xl shadow-sm border border-rose-100">
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab("moodboard")}
                            className={`rounded-xl h-10 px-6 font-bold transition-all ${activeTab === "moodboard" ? "bg-white text-[#FFB7C5] shadow-sm" : "text-rose-300"}`}
                        >
                            Inspiration
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setActiveTab("bookings")}
                            className={`rounded-xl h-10 px-6 font-bold transition-all ${activeTab === "bookings" ? "bg-white text-[#FFB7C5] shadow-sm" : "text-rose-300"}`}
                        >
                            Bookings
                            {quotes.length > 0 && (
                                <span className="ml-2 w-5 h-5 bg-rose-400 text-white rounded-full text-[10px] flex items-center justify-center">
                                    {quotes.length}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>

                {activeTab === "moodboard" && (
                    <div className="flex items-center gap-4">
                        <div className="flex bg-rose-50 rounded-xl p-1">
                            <Button
                                variant={view === "grid" ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setView("grid")}
                                className={`rounded-lg h-10 w-10 ${view === "grid" ? "bg-[#FFB7C5] text-white hover:bg-[#FFA4B5]" : "text-rose-300"}`}
                            >
                                <Grid className="w-5 h-5" />
                            </Button>
                            <Button
                                variant={view === "list" ? "default" : "ghost"}
                                size="icon"
                                onClick={() => setView("list")}
                                className={`rounded-lg h-10 w-10 ${view === "list" ? "bg-[#FFB7C5] text-white hover:bg-[#FFA4B5]" : "text-rose-300"}`}
                            >
                                <List className="w-5 h-5" />
                            </Button>
                        </div>
                        <div className="h-6 w-[1px] bg-rose-200" />
                        <div className="flex items-center gap-2 pr-2">
                            <Filter className="w-4 h-4 text-rose-400" />
                            <select
                                className="text-sm font-bold bg-transparent border-none focus:outline-none cursor-pointer text-[#2D334A]"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                {["All", "Floral", "Decor", "Venue", "Attire", "Cake"].map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </header>

            <AnimatePresence mode="wait">
                {activeTab === "moodboard" ? (
                    <motion.div
                        key="moodboard"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        {assets.length === 0 ? (
                            <div className="text-center py-32 bg-[#FFFBFC] rounded-[48px] border-2 border-dashed border-rose-100 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFB7C5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-md border border-rose-50">
                                    <Heart className="w-12 h-12 text-[#FFB7C5]" />
                                </div>
                                <h2 className="text-3xl font-serif font-bold mb-4 text-[#2D334A]">Your vision is a blank canvas</h2>
                                <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg">
                                    Head over to the Discovery feed to start swiping on the styles and venues that speak to you.
                                </p>
                                <Link to="/discover">
                                    <Button className="bg-[#FFB7C5] hover:bg-[#FFA4B5] text-white px-10 py-7 rounded-full font-bold text-lg shadow-lg shadow-rose-100 transition-all hover:scale-105">
                                        Start Swiping <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className={`
                                ${view === "grid"
                                    ? "columns-1 lg:columns-2 xl:columns-3 gap-8 space-y-8"
                                    : "flex flex-col gap-6 max-w-5xl mx-auto"}
                            `}>
                                {filteredAssets.map((asset) => (
                                    <motion.div
                                        key={asset.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="break-inside-avoid"
                                    >
                                        <Card className={`group relative overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-700 bg-white rounded-[32px] ${view === 'list' ? 'flex items-center p-6 gap-8' : ''}`}>
                                            <div className={`${view === 'grid' ? 'w-full' : 'w-32 h-32 shrink-0'} relative overflow-hidden rounded-[24px]`}>
                                                <img
                                                    src={asset.image_url}
                                                    alt={asset.category_tag}
                                                    className={`${view === 'grid' ? 'w-full' : 'w-full h-full'} object-cover group-hover:scale-110 transition-transform duration-1000`}
                                                />
                                                {view === 'grid' && (
                                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8 text-center backdrop-blur-[2px]">
                                                        <Button
                                                            onClick={() => handleConvertToBudget(asset.id)}
                                                            className="bg-white text-[#2D334A] hover:bg-[#FFB7C5] hover:text-white rounded-full font-bold px-8 py-6 shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-700"
                                                        >
                                                            <DollarSign className="w-5 h-5 mr-2" /> Convert to Budget
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={`${view === 'grid' ? 'p-6' : 'flex-1 flex items-center justify-between'}`}>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-[0.1em] font-bold bg-rose-50 text-[#FFB7C5] border-none px-3 py-1">
                                                            {asset.category_tag}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="text-xl font-serif font-black text-[#2D334A] leading-tight">
                                                        {asset.vendors?.[0]?.name || "Featured Provider"}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 mt-2 font-medium">
                                                        Est. ${(asset.base_cost_low / 100).toLocaleString()} - ${(asset.base_cost_high / 100).toLocaleString()}
                                                    </p>
                                                </div>

                                                {view === 'list' && (
                                                    <Button
                                                        onClick={() => handleConvertToBudget(asset.id)}
                                                        className="bg-[#FFB7C5] hover:bg-[#FFA4B5] text-white rounded-full px-8 py-6 shadow-lg shadow-rose-100 transition-all"
                                                    >
                                                        <DollarSign className="w-5 h-5 mr-2" /> Add to Budget
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="bookings"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {quotes.length === 0 ? (
                            <div className="text-center py-32 bg-slate-50 rounded-[48px] border border-slate-100">
                                <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <FileText className="w-8 h-8 text-slate-300" />
                                </div>
                                <h2 className="text-2xl font-serif font-bold mb-2 text-[#2D334A]">No quotes received yet</h2>
                                <p className="text-slate-500 max-w-sm mx-auto">
                                    When you swipe right or super like a vendor, they'll be notified and can send you a custom quote.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {quotes.map((quote) => (
                                    <Card key={quote.id} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all bg-white rounded-3xl">
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-[#FFB7C5]">
                                                        <FileText className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[#2D334A]">{quote.vendors?.name}</h4>
                                                        <p className="text-xs text-slate-400">{format(parseISO(quote.created_at), 'MMMM d, yyyy')}</p>
                                                    </div>
                                                </div>
                                                <Badge className={`
                                                    ${quote.status === 'SENT' ? 'bg-blue-50 text-blue-500' :
                                                        quote.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}
                                                    border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest
                                                `}>
                                                    {quote.status === 'SENT' ? 'Review Required' : quote.status}
                                                </Badge>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500">Service</span>
                                                    <span className="font-medium">{quote.items[0]?.description || "Wedding Services"}</span>
                                                </div>
                                                <div className="flex justify-between items-center pr-2">
                                                    <span className="text-slate-500 text-sm">Total Quote</span>
                                                    <span className="text-2xl font-serif font-black text-[#2D334A]">
                                                        ${(quote.grand_total_cents / 100).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3">
                                                <Button variant="outline" className="rounded-xl border-rose-100 text-rose-300 font-bold">
                                                    Decline
                                                </Button>
                                                <Button className="rounded-xl bg-[#FFB7C5] hover:bg-[#FFA4B5] text-white font-bold shadow-lg shadow-rose-100">
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
