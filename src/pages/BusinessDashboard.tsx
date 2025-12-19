
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { floridaVendors } from "@/data/florida_vendors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Briefcase, MapPin, Users, Settings } from "lucide-react";

export default function BusinessDashboard() {
    const { user, updateProfile } = useAuth();

    // Local State for Form
    const [service, setService] = useState(user?.businessProfile?.serviceCategory || "Photography");
    const [price, setPrice] = useState(user?.businessProfile?.priceRange || "$$");
    const [zips, setZips] = useState(user?.businessProfile?.zipCodes?.join(", ") || "33139, 33140");

    const handleSave = () => {
        updateProfile({
            businessProfile: {
                serviceCategory: service,
                priceRange: price as any,
                zipCodes: zips.split(",").map(s => s.trim()),
                isAvailable: true
            }
        });
        toast.success("Business Profile Saved");
    };

    // B2B Logic: Find vendors NOT in my category (Potential Referrals)
    const potentialPartners = floridaVendors.filter(v =>
        !user?.businessProfile?.serviceCategory || !v.category.toLowerCase().includes(user.businessProfile.serviceCategory.toLowerCase())
    ).slice(0, 5);

    return (
        <div className="container mx-auto px-4 py-8 mt-16 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold">Business Hub</h1>
                    <p className="text-muted-foreground">Manage your Florida Wedding Business</p>
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded text-sm font-medium">
                    {user?.businessProfile?.isAvailable ? "🟢 Accepting Inquiries" : "🔴 Unavailable"}
                </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="profile"><Settings className="w-4 h-4 mr-2" /> Profile</TabsTrigger>
                    <TabsTrigger value="network"><Users className="w-4 h-4 mr-2" /> B2B Network</TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Business Details</CardTitle>
                                <CardDescription>Update your public listing info.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Service Category</label>
                                    <Input value={service} onChange={(e) => setService(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Pricing Tier</label>
                                    <div className="flex gap-2">
                                        {['$', '$$', '$$$', '$$$$'].map((t) => (
                                            <Button
                                                key={t}
                                                variant={price === t ? 'default' : 'outline'}
                                                onClick={() => setPrice(t as any)}
                                                size="sm"
                                            >
                                                {t}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Service Zip Codes (CSV)</label>
                                    <div className="flex gap-2 items-center">
                                        <MapPin className="text-muted-foreground" size={16} />
                                        <Input value={zips} onChange={(e) => setZips(e.target.value)} />
                                    </div>
                                </div>
                                <Button onClick={handleSave} className="w-full bg-slate-900 text-white">Save Changes</Button>
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-50 border-dashed">
                            <CardHeader>
                                <CardTitle>Availability Calendar</CardTitle>
                                <CardDescription>Mock integration with Calendar API</CardDescription>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center h-40 text-muted-foreground">
                                Calendar Widget Placeholder
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="network">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recommended Partners</CardTitle>
                            <CardDescription>Connect with Florida pros to fill gaps.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {potentialPartners.map(vendor => (
                                    <div key={vendor.id} className="flex items-center justify-between p-4 border rounded hover:bg-slate-50">
                                        <div className="flex items-center gap-4">
                                            <img src={vendor.imageUrl} className="w-12 h-12 rounded bg-slate-200 object-cover" />
                                            <div>
                                                <h4 className="font-bold">{vendor.name}</h4>
                                                <p className="text-sm text-muted-foreground">{vendor.category} • {vendor.hub}</p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Connect</Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
