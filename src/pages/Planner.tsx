import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    LayoutDashboard,
    Calendar,
    CheckSquare,
    DollarSign,
    Heart,
    Users,
    MapPin,
    ArrowRight,
    Sparkles,
    ShoppingBag
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Planner() {
    const { user } = useAuth();
    const [daysToGo, setDaysToGo] = useState<number | null>(null);
    const [progress, setProgress] = useState(0);
    const [team, setTeam] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            // Days to go logic
            if (user.weddingDate) {
                const today = new Date();
                const wedding = new Date(user.weddingDate);
                const diffTime = Math.abs(wedding.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                setDaysToGo(diffDays);
            }

            // Fetch Planning Team (Planners who added this couple)
            const fetchTeam = async () => {
                // 1. Fetch projects where I am the client
                const { data: projects, error: projError } = await supabase
                    .from('projects')
                    .select('id, client_status, user_id')
                    .eq('client_id', user.id);

                if (projError) {
                    console.error("Error fetching team projects:", projError);
                    return;
                }

                if (!projects || projects.length === 0) {
                    setTeam([]);
                    return;
                }

                // 2. Fetch profiles for those planners
                const plannerIds = projects.map(p => p.user_id);
                const { data: profiles, error: profError } = await supabase
                    .from('profiles')
                    .select('id, full_name, business_name, email')
                    .in('id', plannerIds);

                if (profError) {
                    console.error("Error fetching planner profiles:", profError);
                    return;
                }

                // 3. Merge data
                const teamData = projects.map(p => {
                    const plannerProfile = profiles?.find(prof => prof.id === p.user_id);
                    return {
                        id: p.id,
                        client_status: p.client_status,
                        planner: plannerProfile
                    };
                });

                setTeam(teamData);
            };
            fetchTeam();
        }
    }, [user]);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-slate-900">
                        Welcome, {user?.coupleNames || user?.fullName || "Lovebirds"}!
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Let's plan your dream wedding. You're doing great!
                    </p>
                </div>
                {daysToGo !== null && (
                    <div className="bg-rose-50 border border-rose-100 px-6 py-3 rounded-2xl flex flex-col items-center">
                        <span className="text-3xl font-bold text-rose-600 font-serif">{daysToGo}</span>
                        <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">Days To Go</span>
                    </div>
                )}
            </div>

            {/* My Planning Team Section */}
            {team.length > 0 && (
                <Card className="bg-gradient-to-r from-brand-navy to-slate-800 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Users className="w-6 h-6 text-rose-300" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl font-bold">My Planning Team</h3>
                                <p className="text-slate-300 text-sm"> professionals collaborating on your wedding</p>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {team.map((member) => (
                                <div key={member.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4 border border-white/10">
                                    <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center font-bold">
                                        {(member.planner?.business_name || member.planner?.full_name || "P")[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold">{member.planner?.business_name || member.planner?.full_name || "Unknown Planner"}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-none text-[10px]">
                                                PLANNER
                                            </Badge>
                                            <span className="text-xs text-slate-300 capitalize">{member.client_status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Checklist", icon: CheckSquare, color: "text-blue-500", bg: "bg-blue-50", link: "/checklist" }, // Future link
                    { label: "Budget", icon: DollarSign, color: "text-green-500", bg: "bg-green-50", link: "/budget" },
                    { label: "Guests", icon: Users, color: "text-purple-500", bg: "bg-purple-50", link: "/guests" }, // Future
                    { label: "Vendors", icon: ShoppingBag, color: "text-amber-500", bg: "bg-amber-50", link: "/vendors" },
                ].map((action, i) => (
                    <Link to={action.link} key={i}>
                        <Card className="hover:shadow-md transition-all cursor-pointer border-slate-200">
                            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                                <div className={`w-12 h-12 rounded-full ${action.bg} flex items-center justify-center`}>
                                    <action.icon className={`w-6 h-6 ${action.color}`} />
                                </div>
                                <span className="font-semibold text-slate-700">{action.label}</span>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: Tasks & Style */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Style Matcher: Promo or Results */}
                    {(user?.stylePreferences && user.stylePreferences?.primaryArchetype) ? (
                        <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                            <div className="absolute inset-0">
                                <img
                                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop"
                                    className="w-full h-full object-cover opacity-50 block"
                                    alt="Style Background"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
                            </div>
                            <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-4">
                                    <Badge className="bg-rose-500 text-white border-none">Style Locked</Badge>
                                    <div>
                                        <h2 className="text-3xl font-serif font-bold">{user.stylePreferences.primaryArchetype}</h2>
                                        {user.stylePreferences.secondaryArchetype && (
                                            <p className="text-rose-200">with {user.stylePreferences.secondaryArchetype} vibes</p>
                                        )}
                                    </div>
                                    <p className="text-slate-300 max-w-sm text-sm">
                                        Your aesthetic is set! We'll use this to tailor your vendor and venue recommendations.
                                    </p>
                                    <div className="flex gap-4">
                                        <Link to="/style-matcher">
                                            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                                                Review Board
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="shrink-0 hidden md:block">
                                    <div className="w-16 h-16 rounded-full bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-900/50">
                                        <Heart className="w-8 h-8 fill-current text-white" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="bg-slate-900 text-white border-none overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <CardContent className="p-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-4">
                                    <Badge className="bg-rose-500 text-white border-none">AI Powered</Badge>
                                    <h2 className="text-2xl font-serif font-bold">Discover Your Wedding Style</h2>
                                    <p className="text-slate-300 max-w-md">
                                        Not sure where to start? Swipe through our style matcher to define your aesthetic and get personalized venue recommendations.
                                    </p>
                                    <Link to="/style-matcher">
                                        <Button className="bg-white text-slate-900 hover:bg-slate-200">
                                            Start Style Quiz <Sparkles className="w-4 h-4 ml-2 text-rose-500" />
                                        </Button>
                                    </Link>
                                </div>
                                <div className="shrink-0">
                                    {/* Visual Graphic Placeholder */}
                                    <div className="w-24 h-32 bg-slate-800 rounded-lg -rotate-6 border border-slate-700 shadow-xl"></div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Progress / Next Steps */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-serif">Next Steps</CardTitle>
                            <CardDescription>Keep your momentum going with these priority tasks.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium text-slate-700">Overall Progress</span>
                                    <span className="text-rose-600 font-bold">15%</span>
                                </div>
                                <Progress value={15} className="h-2 bg-slate-100" />
                            </div>

                            <div className="space-y-3">
                                {[
                                    { title: "Set your budget", status: "In Progress", urgent: true },
                                    { title: "Draft guest list", status: "Not Started", urgent: false },
                                    { title: "Book Venue", status: "Not Started", urgent: true },
                                ].map((task, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${task.urgent ? 'bg-rose-500' : 'bg-slate-300'}`}></div>
                                            <span className="font-medium text-slate-700 group-hover:text-rose-900 transition-colors">{task.title}</span>
                                        </div>
                                        <Button size="sm" variant="ghost" className="text-slate-400 hover:text-rose-600">
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar: Recommendations */}
                <div className="space-y-6">
                    <Card className="bg-slate-50 border-dashed border-2 border-slate-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-lg font-serif">Venue Recommendations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500 mb-4">Based on your location ({user?.location || "FL"}), here are some top picks.</p>
                            <div className="space-y-4">
                                <div className="aspect-video bg-slate-200 rounded-lg animate-pulse"></div>
                                <div className="aspect-video bg-slate-200 rounded-lg animate-pulse"></div>
                            </div>
                            <Button variant="link" className="w-full mt-2 text-rose-600">View All Venues</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
