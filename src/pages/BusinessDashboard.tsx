import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
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
    FileText,
    Upload,
    MoreVertical,
    ShieldCheck,
    Save,
    Loader2
} from "lucide-react";
import { ProfileChecklist } from "@/components/ProfileChecklist";
import { VENUE_TYPES, ALL_VENUE_TYPES } from "@/lib/constants/venue-types";
import { VenueProfileForm } from "@/components/VenueProfileForm";

export default function BusinessDashboard() {
    const { user } = useAuth();
    const role = user?.role || 'vendor';
    const [isLoading, setIsLoading] = useState(true);
    const [vendorData, setVendorData] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        business_name: "",
        description: "",
        location: "",
        street_address: "",
        website: "",
        google_business_url: "",
        guest_capacity: 0,
        amenities: "", // comma separated for edit
        faqs: [] as { question: string; answer: string }[], // JSON array
        base_cost_low: 0,
        contact_phone: "",
        contact_email: "",
        price_range: "$",
        service_zipcodes: "",
        venue_type: "",
        google_rating: 0,
        google_reviews: 0
    });

    useEffect(() => {
        if (user?.id) {
            fetchVendorProfile();
        }
    }, [user?.id]);

    const fetchVendorProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('vendors')
                .select('*')
                .eq('owner_id', user?.id)
                .maybeSingle();

            if (error) {
                console.error("Error fetching vendor profile:", error);
            }

            if (data) {
                console.log('Vendor data loaded:', data);
                console.log('FAQs from database:', data.faqs);
                console.log('FAQs type:', typeof data.faqs);
                console.log('FAQs is array?:', Array.isArray(data.faqs));

                setVendorData(data);
                setFormData({
                    business_name: data.name || "",
                    description: data.description || "",
                    location: data.location || "",
                    street_address: data.street_address || "",
                    website: data.website || "",
                    google_business_url: data.google_business_url || "",
                    guest_capacity: data.guest_capacity || 0,
                    amenities: data.amenities ? data.amenities.join(", ") : "",
                    faqs: Array.isArray(data.faqs) ? data.faqs : [],
                    base_cost_low: 0, // Placeholder if not in vendors table
                    contact_phone: data.contact_phone || "",
                    contact_email: data.contact_email || "",
                    price_range: data.price_range || "$",
                    service_zipcodes: data.service_zipcodes ? data.service_zipcodes.join(", ") : "",
                    venue_type: data.venue_type || "",
                    google_rating: data.google_rating || 0,
                    google_reviews: data.google_reviews || 0
                });

                console.log('FormData set with FAQs:', Array.isArray(data.faqs) ? data.faqs : []);
            }
        } catch (error) {
            console.error("Error fetching vendor profile:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user?.id) {
            toast.error("You must be logged in to save changes.");
            return;
        }

        try {
            const payload: any = {
                name: formData.business_name,
                description: formData.description,
                location: formData.location,
                street_address: formData.street_address,
                website: formData.website,
                google_business_url: formData.google_business_url,
                guest_capacity: formData.guest_capacity,
                amenities: formData.amenities.split(",").map(s => s.trim()).filter(Boolean),
                faqs: formData.faqs, // Already an array
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                price_range: formData.price_range,
                service_zipcodes: formData.service_zipcodes.split(",").map(s => s.trim()).filter(Boolean),
                venue_type: formData.venue_type,
                google_rating: formData.google_rating,
                google_reviews: formData.google_reviews,
                updated_at: new Date(),
                owner_id: user.id
            };

            // Set defaults for new records
            if (!vendorData?.id) {
                payload.type = role === 'venue' ? 'Venue' : 'Vendor';
                payload.category = role === 'venue' ? 'Venue' : 'Other';
            }

            let result;
            if (vendorData?.id) {
                result = await supabase.from('vendors').update(payload).eq('id', vendorData.id).select();
            } else {
                result = await supabase.from('vendors').insert([payload]).select();
            }

            const { error } = result;

            if (error) {
                throw error;
            }

            toast.success("Business Profile Saved Successfully");
            fetchVendorProfile(); // Refresh

        } catch (error: any) {
            console.error("Error updating vendor:", error);
            if (error?.message?.includes('column "price_range"') || error?.message?.includes('does not exist')) {
                toast.error("Database schema mismatch. Please run the migration '20240102_add_price_range.sql'.");
            } else {
                toast.error("Failed to save changes: " + (error.message || "Unknown error"));
            }
        }
    };

    const stats = [
        { label: "Total Swipes", value: "1,284", icon: Heart, trend: "+12%", color: "text-rose-400" },
        { label: "Active Leads", value: "48", icon: Eye, trend: "+5%", color: "text-blue-400" },
        { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, trend: "+0.4%", color: "text-green-400" },
    ];

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-slate-500" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700 bg-gray-50 min-h-screen">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">
                    {role === 'venue' ? 'Venue Dashboard' : 'Vendor Dashboard'}
                </h1>
                <p className="text-slate-600">Welcome back. Here's what's happening today.</p>
            </div>

            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={48} className={stat.color} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="uppercase tracking-wider text-[10px] font-bold text-slate-500">
                                {stat.label}
                            </CardDescription>
                            <CardTitle className="text-3xl font-serif font-bold text-slate-900">
                                {stat.value}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-400">
                                <ArrowUpRight className="w-3 h-3" />
                                <span>{stat.trend} from last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    <Tabs defaultValue="overview" className="w-full">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-200">
                            <TabsList className="bg-transparent rounded-none p-0 h-auto gap-8">
                                <TabsTrigger value="overview" className="border-b-2 border-transparent data-[state=active]:border-rose-600 rounded-none bg-transparent px-0 pb-2 font-bold uppercase tracking-widest text-xs text-slate-600 data-[state=active]:text-slate-900">Overview</TabsTrigger>
                                <TabsTrigger value="settings" className="border-b-2 border-transparent data-[state=active]:border-rose-600 rounded-none bg-transparent px-0 pb-2 font-bold uppercase tracking-widest text-xs text-slate-600 data-[state=active]:text-slate-900">Profile Settings</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Role-Specific Widget: Vendor (Inquiry Inbox) or Venue (Tour Scheduler) */}
                            {role === 'venue' ? (
                                <Card className="border-slate-200 bg-white shadow-sm">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                                <Calendar className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="font-serif text-slate-900">Tour Scheduler</CardTitle>
                                                <CardDescription className="text-slate-600">Upcoming site visits for this week.</CardDescription>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100">Manage Calendar</Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { couple: "Sarah & Mike", time: "Tomorrow, 2:00 PM", status: "Confirmed" },
                                                { couple: "Jessica & Dan", time: "Fri, 10:30 AM", status: "Pending" }
                                            ].map((tour, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-900">{tour.couple[0]}</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">{tour.couple}</p>
                                                            <p className="text-[10px] text-slate-500">{tour.time}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className={tour.status === 'Confirmed' ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"}>
                                                        {tour.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card className="border-slate-800 bg-slate-900/50 shadow-none text-white">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-rose-500/10 rounded-lg">
                                                <MessageSquare className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div>
                                                <CardTitle className="font-serif text-slate-900">Inquiry Inbox</CardTitle>
                                                <CardDescription className="text-slate-600">Service requests from potential clients.</CardDescription>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100" onClick={() => window.location.href = '/leads'}>View All</Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {[
                                                { name: "Emily Robinson", service: "Full Day Photography", date: "2h ago" },
                                                { name: "Robert Smith", service: "Wedding Portraits", date: "5h ago" }
                                            ].map((inquiry, i) => (
                                                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-900">{inquiry.name[0]}</div>
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-900">{inquiry.name}</p>
                                                            <p className="text-[10px] text-slate-500">{inquiry.service}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-slate-500">{inquiry.date}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Activity Chart Placeholder or Other Widget */}
                            <Card className="border-slate-200 bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-serif text-lg text-slate-900">Engagement Overview</CardTitle>
                                </CardHeader>
                                <CardContent className="h-48 flex items-center justify-center border border-dashed border-slate-200 rounded-lg m-4 mt-0">
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Analytics Graph Coming Soon</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card className="border-slate-200 bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-serif text-slate-900">Business Profile</CardTitle>
                                    <CardDescription className="text-slate-600">Manage how your {role} profile appears to couples.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <VenueProfileForm
                                        formData={formData}
                                        onChange={(field, value) => setFormData(prev => ({ ...prev, [field]: value }))}
                                        role={role}
                                    />

                                    <Button onClick={handleSave} className="w-full bg-rose-600 hover:bg-rose-700 text-white font-serif py-6 gap-2">
                                        <Save className="w-4 h-4" /> Save Changes
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar Widgets */}
                <div className="space-y-8">
                    <ProfileChecklist role={role} />

                    {/* Activity Feed */}
                    <Card className="border-slate-200 bg-white shadow-sm p-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Recent Activity</h3>
                        <div className="space-y-6">
                            {[
                                { text: "Profile updated", time: "Just now", icon: Settings, color: "text-slate-400" },
                                { text: "New lead from Sarah", time: "2h ago", icon: MessageSquare, color: "text-blue-400" },
                                { text: "Tour requested: Sarah & Mike", time: "1d ago", icon: Calendar, color: "text-green-400" },
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 items-start relative pb-6 last:pb-0">
                                    {i < 2 && <div className="absolute left-[7px] top-4 bottom-0 w-[1px] bg-slate-800"></div>}
                                    <div className={`mt-1 h-3.5 w-3.5 rounded-full bg-white border-2 border-slate-300 shadow-sm z-10 flex items-center justify-center`}>
                                        <div className={`h-1 w-1 rounded-full ${item.color.replace('text-', 'bg-')}`}></div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{item.text}</p>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
