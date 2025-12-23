
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Star, MapPin, ExternalLink, ThumbsUp } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function BlackBook() {
    const vendors = [
        { id: 1, name: "Luxe Florals Miami", category: "Florist", rating: 5.0, status: "Preferred", image: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=400" },
        { id: 2, name: "Coastal Catering", category: "Catering", rating: 4.8, status: "Trusted", image: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=400" },
        { id: 3, name: "Midnight Beats", category: "Entertainment", rating: 4.9, status: "Preferred", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400" },
        { id: 4, name: "Ocean View Studios", category: "Photography", rating: 5.0, status: "Elite", image: "https://images.unsplash.com/photo-1537633552985-df8429e844b5?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-brand-navy">The Black Book</h1>
                    <p className="text-slate-500 mt-1">Your curated directory of elite Florida wedding professionals.</p>
                </div>
                <Button className="bg-brand-navy text-white">Invite Vendor</Button>
            </div>

            <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 flex items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0">
                    <BookOpen className="w-8 h-8 text-rose-gold" />
                </div>
                <div>
                    <h3 className="font-serif font-bold text-lg text-brand-navy">Planner Exclusive</h3>
                    <p className="text-sm text-slate-600">This directory is only visible to agency accounts. Use it to build dream teams for your clients.</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input placeholder="Search preferred vendors..." className="pl-9 bg-white" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {vendors.map((vendor) => (
                    <Card key={vendor.id} className="overflow-hidden border-none shadow-sm hover:shadow-md transition-all group border-l-4 border-l-rose-gold/0 hover:border-l-rose-gold">
                        <CardContent className="p-0 flex h-40">
                            <div className="w-40 shrink-0 relative overflow-hidden">
                                <img src={vendor.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 left-2">
                                    <Badge className="bg-white/90 text-brand-navy backdrop-blur-sm border-none shadow-sm">{vendor.status}</Badge>
                                </div>
                            </div>
                            <div className="flex-1 p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-brand-navy">{vendor.name}</h3>
                                            <p className="text-xs text-slate-500">{vendor.category}</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                                            <Star className="w-3 h-3 fill-amber-500" /> {vendor.rating}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> Miami & Fort Lauderdale
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" className="text-xs h-8 hover:text-rose-gold"><ExternalLink className="w-3 h-3 mr-1" /> Profile</Button>
                                    <Button variant="ghost" size="sm" className="text-xs h-8 hover:text-green-600"><ThumbsUp className="w-3 h-3 mr-1" /> Recommend</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
