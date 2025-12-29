
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Star, MapPin, ExternalLink, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BlackBook() {
    const vendors = [
        { id: 1, name: "Luxe Florals Miami", category: "Florist", rating: 5.0, status: "Preferred", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=400", tags: ["Luxury", "Full-Service"] },
        { id: 2, name: "Coastal Catering", category: "Catering", rating: 4.8, status: "Trusted", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400", tags: ["Beachfront", "Seafood"] },
        { id: 3, name: "Midnight Beats", category: "Entertainment", rating: 4.9, status: "Preferred", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400", tags: ["DJ", "Lighting"] },
        { id: 4, name: "Ocean View Studios", category: "Photography", rating: 5.0, status: "Elite", image: "https://images.unsplash.com/photo-1537633552985-df8429e844b5?auto=format&fit=crop&q=80&w=400", tags: ["Fine Art", "Drone"] },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-[#0F172A] text-white min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight">The Black Book</h1>
                    <p className="text-slate-400 mt-1">Your curated directory of elite Florida wedding professionals.</p>
                </div>
                <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-6 py-6 transition-all hover:scale-105">
                    Invite Vendor
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
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {vendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden bg-slate-900/50 border-slate-800 shadow-none hover:bg-slate-900 hover:border-slate-700 transition-all duration-500 group">
                        <CardContent className="p-0 flex flex-col sm:flex-row">
                            <div className="w-full sm:w-48 h-48 shrink-0 relative overflow-hidden">
                                <img src={vendor.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                <div className="absolute top-3 left-3">
                                    <Badge className="bg-slate-900/80 text-white backdrop-blur-md border-slate-700 shadow-xl px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{vendor.status}</Badge>
                                </div>
                            </div>
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h3 className="font-serif font-bold text-xl group-hover:text-rose-400 transition-colors">{vendor.name}</h3>
                                            <p className="text-xs text-rose-300 font-bold uppercase tracking-wider">{vendor.category}</p>
                                        </div>
                                        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg text-amber-400 font-bold text-xs ring-1 ring-slate-700">
                                            <Star className="w-3.5 h-3.5 fill-amber-400" /> {vendor.rating}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {vendor.tags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="bg-slate-800 text-slate-400 border-none text-[8px] uppercase font-bold tracking-widest">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>

                                    <p className="text-[10px] text-slate-500 flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-slate-600" /> Miami & Fort Lauderdale
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-6 pt-6 border-t border-slate-800/50">
                                    <Button variant="ghost" size="sm" className="text-xs h-9 text-slate-400 hover:text-white hover:bg-slate-800 gap-2 px-3">
                                        <ExternalLink className="w-4 h-4" /> Profile
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-xs h-9 text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 gap-2 px-3">
                                        <ThumbsUp className="w-4 h-4" /> Recommend
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

