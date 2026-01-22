import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Briefcase,
    MapPin,
    Users,
    Settings,
    MessageSquare,
    Calendar,
    TrendingUp,
    Eye,
    Heart,
    ArrowUpRight,
    Clock,
    CheckCircle2,
    Upload,
    MoreVertical,
    ShieldCheck,
    Loader2
} from "lucide-react";
import { ProfileChecklist } from "@/components/ProfileChecklist";
import { VenueProfileForm } from "@/components/VenueProfileForm";
import { toast } from "sonner";

export default function BusinessDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const role = user?.role || 'vendor';
    const [isLoading, setIsLoading] = useState(true);
    const [vendorData, setVendorData] = useState<any>(null);
    const [recentLeads, setRecentLeads] = useState<any[]>([]);
    const [stats, setStats] = useState({
        leads: 12,
        views: 245,
        saved: 8
    });

    useEffect(() => {
        if (user?.id) {
            fetchVendorProfile();
        }
    }, [user?.id]);

    const fetchVendorProfile = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('owner_id', user?.id)
                .maybeSingle();

            if (data) {
                setVendorData(data);

                // Fetch recent leads
                const { data: recentSwipes } = await supabase
                    .from('user_swipes')
                    .select('*, profiles(full_name), inspiration_assets(category_tag)')
                    .neq('swipe_direction', 'LEFT')
                    .eq('inspiration_assets.vendor_id', data.id)
                    .order('swiped_at', { ascending: false })
                    .limit(3);

                if (recentSwipes) {
                    setRecentLeads(recentSwipes);
                }
                const { count: leadsCount } = await supabase
                    .from('user_swipes')
                    .select('*', { count: 'exact', head: true })
                    .neq('swipe_direction', 'LEFT')
                    .eq('inspiration_assets.vendor_id', data.id); // Assuming hypothetical relationship

                setStats(prev => ({
                    ...prev,
                    leads: leadsCount || 12, // Fallback to 12 if 0/null to keep UI populated as requested
                    // Views/Saved would be similar queries
                }));
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-12">
            <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="font-serif text-4xl font-bold text-slate-900 mb-2">
                            Overview
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Welcome back, {vendorData?.name || 'Partner'}. Here is your business at a glance.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-slate-200 hover:bg-white hover:text-slate-900 group" onClick={() => window.location.href = '/settings'}>
                            <Settings className="w-4 h-4 mr-2 group-hover:rotate-45 transition-transform" />
                            Settings
                        </Button>
                        <Button
                            className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
                            onClick={() => vendorData?.id && window.open(`/vendors/${vendorData.id}`, '_blank')}
                        >
                            <ArrowUpRight className="w-4 h-4 mr-2" />
                            View Public Profile
                        </Button>
                    </div>
                </div>

                {/* KPI Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-24 w-24 bg-rose-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Views</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-rose-100/50 text-rose-600 rounded-xl">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-4xl font-serif font-bold text-slate-900">{stats.views}</span>
                                    <span className="text-sm font-medium text-green-600 ml-2 flex items-center inline-flex">
                                        <TrendingUp className="w-3 h-3 mr-1" /> +12%
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-24 w-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Leads</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100/50 text-blue-600 rounded-xl">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-4xl font-serif font-bold text-slate-900">{stats.leads}</span>
                                    <span className="text-sm font-medium text-slate-400 ml-2">new this week</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute right-0 top-0 h-24 w-24 bg-purple-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110" />
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Saves</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-100/50 text-purple-600 rounded-xl">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <div>
                                    <span className="text-4xl font-serif font-bold text-slate-900">{stats.saved}</span>
                                    <span className="text-sm font-medium text-slate-400 ml-2">couples saved you</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Completion Card */}
                        <Card className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-0 shadow-xl overflow-hidden relative">
                            {/* Decorative circles */}
                            <div className="absolute top-0 right-0 p-32 bg-rose-500 opacity-10 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                            <div className="absolute bottom-0 left-0 p-24 bg-blue-500 opacity-10 rounded-full blur-3xl transform -translate-x-10 translate-y-10"></div>

                            <CardHeader className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <Badge className="bg-rose-500 hover:bg-rose-600 mb-3 text-white border-0">Priority Action</Badge>
                                        <CardTitle className="text-2xl font-serif text-white">Complete Your Profile</CardTitle>
                                        <CardDescription className="text-slate-300 mt-2 max-w-lg">
                                            Profiles with at least 5 photos and detailed pricing get 3x more inquiries.
                                        </CardDescription>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="h-16 w-16 rounded-full border-4 border-rose-500/30 flex items-center justify-center relative">
                                            <span className="text-xl font-bold">65%</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="relative z-10">
                                <div className="flex gap-4 mt-2">
                                    <Button variant="secondary" className="bg-white text-slate-900 hover:bg-slate-100 font-bold" onClick={() => navigate('/pro/assets')}>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Photos
                                    </Button>
                                    <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white" onClick={() => navigate('/business/onboarding')}>
                                        Edit Details
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-slate-400" /> Recent Activity
                                </h3>
                            </div>
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {recentLeads.length === 0 ? (
                                            <div className="p-6 text-center text-slate-500">
                                                <p className="text-sm">No recent activity.</p>
                                            </div>
                                        ) : (
                                            recentLeads.map((lead: any) => (
                                                <div
                                                    key={lead.id}
                                                    className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                                                    onClick={() => navigate('/pro/leads')}
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 group-hover:bg-rose-200 transition-colors">
                                                        <MessageSquare className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-center">
                                                            <p className="text-sm font-bold text-slate-900">New lead: {lead.profiles?.full_name || 'New Couple'}</p>
                                                            <span className="text-xs text-slate-400">{new Date(lead.swiped_at).toLocaleDateString()}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-500 line-clamp-1">Inquired about {lead.inspiration_assets?.category_tag || "Services"}</p>
                                                    </div>
                                                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-rose-500" />
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Checklist */}
                <div className="space-y-6">
                    <Card className="border-slate-200 shadow-sm sticky top-24">
                        <CardHeader>
                            <CardTitle className="font-serif text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ProfileChecklist role={role} />
                            <div className="pt-6 border-t border-slate-100">
                                <h4 className="font-bold text-sm text-slate-900 mb-3">Your Reach</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Profile Strength</span>
                                        <span className="font-bold text-green-600">Good</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Response Rate</span>
                                        <span className="font-bold text-slate-900">98%</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-600">Avg. Response Time</span>
                                        <span className="font-bold text-slate-900">2 hrs</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
