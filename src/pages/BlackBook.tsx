
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Star, MapPin, ExternalLink, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface BlackBookEntry {
    id: string; // relationship id
    vendor_id: string;
    notes: string;
    vendor: {
        id: string;
        name: string;
        category: string; // mapped from category or type
        location: string;
        image_url: string;
        rating: number; // google_rating
        tags: string[]; // style_tags
    }
}

export default function BlackBook() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [vendors, setVendors] = useState<BlackBookEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBlackBook = async () => {
            if (!user) return;

            try {
                // Get planner ID first
                const { data: plannerData } = await supabase
                    .from('vendors')
                    .select('id')
                    .eq('owner_id', user.id)
                    .single();

                if (!plannerData) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from('black_book')
                    .select(`
                        id,
                        vendor_id,
                        notes,
                        vendor:vendors!vendor_id (
                            id,
                            name,
                            category,
                            location,
                            image_url,
                            google_rating,
                            style_tags,
                            type
                        )
                    `)
                    .eq('planner_id', plannerData.id);

                if (error) throw error;

                // Map the data to a friendlier structure
                const formattedData = (data || []).map((item: any) => ({
                    id: item.id,
                    vendor_id: item.vendor_id,
                    notes: item.notes,
                    vendor: {
                        id: item.vendor.id,
                        name: item.vendor.name,
                        category: item.vendor.type || item.vendor.category || 'Vendor',
                        location: item.vendor.location || 'Florida',
                        image_url: item.vendor.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400',
                        rating: item.vendor.google_rating || 5.0,
                        tags: item.vendor.style_tags || []
                    }
                }));

                setVendors(formattedData);
            } catch (error) {
                console.error("Error fetching black book:", error);
                toast.error("Failed to load your Black Book");
            } finally {
                setLoading(false);
            }
        };

        fetchBlackBook();
    }, [user]);

    const filteredVendors = vendors.filter(v =>
        v.vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-[#0F172A] text-white min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">The Black Book</h1>
                    <p className="text-slate-400 mt-1">Your curated directory of elite Florida wedding professionals.</p>
                </div>
                <Button
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-6 transition-all hover:scale-105"
                    onClick={() => navigate('/vendors')}
                >
                    Browse Vendors
                </Button>
            </div>

            <Card className="bg-slate-900 border-rose-500/20 border-l-4 border-l-rose-500 rounded-2xl p-6 flex items-center gap-6 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <BookOpen size={120} className="text-white" />
                </div>
                <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center shadow-inner shrink-0 z-10">
                    <BookOpen className="w-8 h-8 text-rose-400" />
                </div>
                <div className="z-10">
                    <h3 className="font-serif font-bold text-xl">Planner Exclusive</h3>
                    <p className="text-sm text-slate-400 max-w-lg leading-relaxed">This directory is only visible to agency accounts. Use it to build dream teams for your clients and manage private preferred relationships.</p>
                </div>
            </Card>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Filter by name, category, or style tag..."
                        className="pl-11 bg-slate-900 border-slate-700 text-white py-6 rounded-xl focus:ring-rose-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                    <div className="col-span-2 text-center py-20 text-slate-500">Loading your Black Book...</div>
                ) : filteredVendors.length === 0 ? (
                    <div className="col-span-2 text-center py-20 text-slate-500">
                        <p className="text-xl mb-4">Your Black Book is empty.</p>
                        <Button variant="outline" onClick={() => navigate('/vendors')}>Browse Directory</Button>
                    </div>
                ) : (
                    filteredVendors.map((entry) => (
                        <Card key={entry.id} className="overflow-hidden bg-slate-900/50 border-slate-800 shadow-none hover:bg-slate-900 hover:border-slate-700 transition-all duration-500 group">
                            <CardContent className="p-0 flex flex-col sm:flex-row">
                                <div className="w-full sm:w-48 h-48 shrink-0 relative overflow-hidden">
                                    <img src={entry.vendor.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    <div className="absolute top-3 left-3">
                                        <Badge className="bg-slate-900/80 text-white backdrop-blur-md border-slate-700 shadow-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                            PREFERRED
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-serif font-bold text-xl group-hover:text-rose-400 transition-colors">{entry.vendor.name}</h3>
                                                <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">{entry.vendor.category}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg text-amber-400 font-bold text-xs ring-1 ring-slate-700">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" /> {entry.vendor.rating.toFixed(1)}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {entry.vendor.tags.slice(0, 3).map((tag, i) => (
                                                <Badge key={i} variant="secondary" className="bg-slate-800 text-slate-400 border-none text-[8px] uppercase font-bold tracking-widest">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>

                                        <p className="text-[10px] text-slate-500 flex items-center gap-2">
                                            <MapPin className="w-3.5 h-3.5 text-slate-600" /> {entry.vendor.location}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-800/50">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs h-9 text-slate-400 hover:text-white hover:bg-slate-800 gap-2 px-3"
                                            onClick={() => navigate(`/vendors/${entry.vendor_id}`)}
                                        >
                                            <ExternalLink className="w-4 h-4" /> Profile
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-xs h-9 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 gap-2 px-3">
                                            <ThumbsUp className="w-4 h-4" /> Recommend
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

