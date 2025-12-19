
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { floridaVendors } from "@/data/florida_vendors";
import { getCompositeRankedVendors, CompositeMatch } from "@/lib/matcher";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles, DollarSign, Calendar, Heart, ArrowRight } from "lucide-react";

export default function Planner() {
    const { user } = useAuth();
    const [matches, setMatches] = useState<CompositeMatch[]>([]);
    const stress = user?.stressLevel || 5;

    useEffect(() => {
        if (user) {
            const ranked = getCompositeRankedVendors(floridaVendors, user);
            setMatches(ranked.slice(0, 4)); // Top 4 matches
        }
    }, [user]);

    // Vibe-Aware Tips Logic
    const getTipContent = () => {
        if (stress > 7) {
            return {
                title: "Deep Breaths 🌿",
                text: "You're doing great. Today, just choose ONE small thing easily done. Maybe just pick a font? Or hydrate.",
                color: "bg-blue-50 text-blue-800 border-blue-200"
            };
        } else if (stress < 4) {
            return {
                title: "You're on Fire! 🔥",
                text: "High energy day! Perfect time to tackle the big contracts or negotiate with venues.",
                color: "bg-green-50 text-green-800 border-green-200"
            };
        }
        return {
            title: "Steady Progress ✨",
            text: "Stay consistent. Check your budget and maybe shortlist 3 photographers today.",
            color: "bg-purple-50 text-purple-800 border-purple-200"
        };
    };

    const tip = getTipContent();

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                        The Planner
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Welcome back, {user?.fullName?.split(" ")[0]}. Let's orchestrate your dream.
                    </p>
                </div>
                <div className={`px-4 py-2 rounded-lg border ${tip.color} max-w-md`}>
                    <div className="flex items-center gap-2 font-bold mb-1">
                        <Sparkles className="w-4 h-4" /> {tip.title}
                    </div>
                    <p className="text-sm">{tip.text}</p>
                </div>
            </div>

            {/* Core Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Style Module */}
                <Card className="hover:shadow-lg transition-shadow border-rose-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-rose-gold">
                            <Heart className="w-5 h-5" /> My Style
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 rounded-md bg-cover bg-center mb-4 relative overflow-hidden" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1544124971-e962be8c47f7?q=80&w=400)' }}>
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-white font-serif font-bold text-lg">
                                    {user?.stylePreferences ? "Profile Active" : "Start Matching"}
                                </span>
                            </div>
                        </div>
                        <Link to="/style-matcher">
                            <Button variant="outline" className="w-full">Update Vibe</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Budget Module */}
                <Card className="hover:shadow-lg transition-shadow border-green-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-green-700">
                            <DollarSign className="w-5 h-5" /> Budget Advisor
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-2 mb-4">
                            <div className="flex justify-between text-sm">
                                <span>Tier detected:</span>
                                <span className="font-bold">{user?.budgetTier || "Not set"}</span>
                            </div>
                            <Progress value={user?.budgetTier ? 75 : 0} className="h-2" />
                            <p className="text-xs text-muted-foreground">Keep an eye on hidden fees.</p>
                        </div>
                        <Link to="/budget">
                            <Button variant="outline" className="w-full">Manage Budget</Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Vendors / Venues Quick Link */}
                <Card className="hover:shadow-lg transition-shadow border-indigo-100">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2 text-indigo-700">
                            <Calendar className="w-5 h-5" /> Directory
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Link to="/venues">
                                <Button variant="ghost" className="w-full justify-start">Browse Venues</Button>
                            </Link>
                            <Link to="/vendors">
                                <Button variant="ghost" className="w-full justify-start">Find Vendors</Button>
                            </Link>
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground" disabled>Checklist (Coming Soon)</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* The Matchmaker Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-serif font-bold">The Matchmaker</h2>
                    <Badge variant="secondary" className="text-xs">Florida Data</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {matches.length > 0 ? matches.map((match, i) => (
                        <Card key={match.vendor.id} className="relative overflow-hidden group">
                            <div className="flex h-full flex-col sm:flex-row">
                                <div className="w-full sm:w-1/3 min-h-[160px]">
                                    <img src={match.vendor.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={match.vendor.name} />
                                </div>
                                <div className="flex-1 p-4 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{match.vendor.name}</h3>
                                            <Badge className={`${match.totalScore > 0.8 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
                                                }`}>
                                                {(match.totalScore * 100).toFixed(0)}% Match
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{match.vendor.hub} • {match.vendor.category}</p>
                                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">{match.vendor.description}</p>
                                    </div>

                                    {/* Score Breakdown */}
                                    <div className="grid grid-cols-3 gap-2 text-[10px] bg-slate-50 p-2 rounded border">
                                        <div className="text-center">
                                            <span className="block font-bold text-rose-500">{(match.breakdown.style * 100).toFixed(0)}%</span>
                                            <span className="text-muted-foreground">Style</span>
                                        </div>
                                        <div className="text-center border-l">
                                            <span className="block font-bold text-green-600">{(match.breakdown.budget * 100).toFixed(0)}%</span>
                                            <span className="text-muted-foreground">Budget</span>
                                        </div>
                                        <div className="text-center border-l">
                                            <span className="block font-bold text-blue-500">{(match.breakdown.availability * 100).toFixed(0)}%</span>
                                            <span className="text-muted-foreground">Avail</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )) : (
                        <div className="col-span-full py-12 text-center text-muted-foreground bg-slate-50 rounded-lg">
                            <p>Complete your Style Profile and Budget to get matched!</p>
                            <Link to="/style-matcher">
                                <Button className="mt-4">Start Matching</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
