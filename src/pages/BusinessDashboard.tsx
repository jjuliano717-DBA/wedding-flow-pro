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
        website: "",
        guest_capacity: 0,
        amenities: "", // comma separated for edit
        base_cost_low: 0,
        contact_phone: "",
        contact_email: "",
        price_range: "$"
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
                setVendorData(data);
                setFormData({
                    business_name: data.name || "",
                    description: data.description || "",
                    location: data.location || "",
                    website: data.website || "",
                    guest_capacity: data.guest_capacity || 0,
                    amenities: data.amenities ? data.amenities.join(", ") : "",
                    base_cost_low: 0, // Placeholder if not in vendors table
                    contact_phone: data.contact_phone || "",
                    contact_email: data.contact_email || "",
                    price_range: data.price_range || "$"
                });
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
                website: formData.website,
                guest_capacity: formData.guest_capacity,
                amenities: formData.amenities.split(",").map(s => s.trim()).filter(Boolean),
                contact_phone: formData.contact_phone,
                contact_email: formData.contact_email,
                price_range: formData.price_range,
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
        { label: "Total Swipes", value: "1,284", icon: Heart, trend: "+12%", color: "text-rose-500" },
        { label: "Active Leads", value: "48", icon: Eye, trend: "+5%", color: "text-blue-500" },
        { label: "Conversion Rate", value: "3.2%", icon: TrendingUp, trend: "+0.4%", color: "text-green-500" },
    ];

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-slate-300" /></div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <stat.icon size={48} />
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="uppercase tracking-wider text-[10px] font-bold text-slate-400">
                                {stat.label}
                            </CardDescription>
                            <CardTitle className="text-3xl font-serif font-bold text-brand-navy">
                                {stat.value}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
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
                        <div className="flex items-center justify-between mb-4">
                            <TabsList className="bg-transparent border-b rounded-none p-0 h-auto gap-8">
                                <TabsTrigger value="overview" className="border-b-2 border-transparent data-[state=active]:border-rose-gold rounded-none bg-transparent px-0 pb-2 font-bold uppercase tracking-widest text-xs">Overview</TabsTrigger>
                                <TabsTrigger value="settings" className="border-b-2 border-transparent data-[state=active]:border-rose-gold rounded-none bg-transparent px-0 pb-2 font-bold uppercase tracking-widest text-xs">Profile Settings</TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Simple Lead Preview */}
                            <Card className="border-none shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="font-serif">Recent Inquiries</CardTitle>
                                        <CardDescription>You have new requests waiting.</CardDescription>
                                    </div>
                                    <Button variant="outline" size="sm" className="text-xs" onClick={() => window.location.href = '/leads'}>View All</Button>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500 italic">Navigate to the Leads tab to manage your full inbox.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="settings">
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <CardTitle className="font-serif">Business Profile</CardTitle>
                                    <CardDescription>Manage how your venue appears to couples.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-serif font-bold text-brand-navy">Basic Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="business_name">Business Name</Label>
                                                <Input
                                                    id="business_name"
                                                    value={formData.business_name}
                                                    onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="location">Location</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                                    <Input
                                                        id="location"
                                                        className="pl-9"
                                                        value={formData.location}
                                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2 md:col-span-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    className="h-24"
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="price_range">Price Range</Label>
                                                <Select
                                                    value={formData.price_range}
                                                    onValueChange={(value) => setFormData({ ...formData, price_range: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select price range" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="$">$ (Affordable)</SelectItem>
                                                        <SelectItem value="$$">$$ (Moderate)</SelectItem>
                                                        <SelectItem value="$$$">$$$ (Premium)</SelectItem>
                                                        <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="guest_capacity">Guest Capacity</Label>
                                                <Input
                                                    id="guest_capacity"
                                                    type="number"
                                                    value={formData.guest_capacity}
                                                    onChange={(e) => setFormData({ ...formData, guest_capacity: parseInt(e.target.value) || 0 })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-serif font-bold text-brand-navy">Contact Information</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="contact_email">Public Contact Email</Label>
                                                <Input
                                                    id="contact_email"
                                                    value={formData.contact_email}
                                                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact_phone">Public Phone Number</Label>
                                                <Input
                                                    id="contact_phone"
                                                    value={formData.contact_phone}
                                                    onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website URL</Label>
                                            <Input
                                                id="website"
                                                value={formData.website}
                                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <Button onClick={handleSave} className="w-full bg-brand-navy hover:bg-slate-800 text-white font-serif py-6 gap-2">
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
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 px-1">Recent Activity</h3>
                        {[
                            { text: "Profile updated", time: "Just now", icon: Settings },
                            { text: "New lead from Sarah", time: "2h ago", icon: MessageSquare },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-3 items-start p-1">
                                <div className="mt-1">
                                    <item.icon className="w-3.5 h-3.5 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-700 font-medium">{item.text}</p>
                                    <p className="text-[10px] text-slate-400">{item.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
