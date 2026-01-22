import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageSquare,
    User,
    Calendar,
    Clock,
    Filter,
    Search,
    Heart,
    Star,
    ChevronRight,
    Loader2,
    Mail,
    Phone,
    MapPin,
    ArrowUpRight,
    Plus,
    Send
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";

interface Lead {
    id: string;
    client_name: string;
    client_email: string;
    status: 'New' | 'Contacted' | 'Contract Sent' | 'Booked';
    created_at: string;
    event_date: string | null;
    budget: string | null;
    asset_id: string;
    asset_image: string;
    asset_category: string;
    swipe_type: 'RIGHT' | 'SUPER_LIKE';
    // Pricing metadata
    cost_model?: string;
    base_cost?: number;
    min_service_fee_pct?: number;
    user_id: string;
}

export default function LeadResponseSystem() {
    const { businessProfile, isLoading: businessLoading } = useBusiness();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Quote Modal State
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Referral State
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [partnerships, setPartnerships] = useState<any[]>([]);
    const [selectedPartnerId, setSelectedPartnerId] = useState("");

    const selectedLead = leads.find(l => l.id === selectedLeadId);

    // Initial Quote State Effect
    useEffect(() => {
        if (selectedLead && isQuoteModalOpen) {
            setUnitPrice(selectedLead.base_cost || 0);
            // Default quantity based on cost model
            if (selectedLead.cost_model === 'per_guest') {
                setQuantity(100); // Default placeholder for guests
            } else {
                setQuantity(1);
            }
        }
    }, [selectedLead, isQuoteModalOpen]);

    // Fetch Leads Effect
    useEffect(() => {
        if (businessProfile?.id) {
            fetchLeadsFromSwipes();
        }
    }, [businessProfile?.id]);

    // Fetch Partnerships Effect
    useEffect(() => {
        if (isReferralModalOpen && businessProfile?.id) {
            fetchPartnerships();
        }
    }, [isReferralModalOpen, businessProfile?.id]);

    const fetchPartnerships = async () => {
        try {
            // Fetch ALL vendors to allow referring to anyone
            const { data } = await supabase
                .from('vendors')
                .select('id, name, type')
                .neq('id', businessProfile?.id || '')
                .limit(50); // Limit for now to avoid massive lists

            if (data) {
                const mapped = data.map(v => ({
                    id: `temp-${v.id}`, // Referral table might expect partnership ID, but we want target vendor ID. 
                    // Warning: The insertion logic expects a partnership rate. 
                    // If we refer to non-partner, we might need a default rate.
                    partnerId: v.id,
                    partnerName: v.name,
                    partnerType: v.type,
                    rate: 10 // Default rate for non-partners or standard
                }));
                setPartnerships(mapped);
            }
        } catch (error) {
            console.error("Error fetching vendors:", error);
            toast.error("Failed to load vendors");
        }
    };

    const fetchLeadsFromSwipes = async () => {
        setLoading(true);
        try {
            // Query user_swipes for this vendor's assets
            const { data: swipes, error } = await supabase
                .from('user_swipes')
                .select(`
                    id,
                    swipe_direction,
                    swiped_at,
                    asset_id,
                    inspiration_assets (
                        image_url,
                        category_tag,
                        cost_model,
                        base_cost_low,
                        base_cost_high,
                        min_service_fee_pct
                    ),
                    profiles (
                        id,
                        full_name,
                        email
                    )
                `)
                .neq('swipe_direction', 'LEFT')
                .eq('inspiration_assets.vendor_id', businessProfile!.id);

            if (error) throw error;

            // Map swipes to Lead interface
            const mappedLeads: Lead[] = (swipes as any[] || []).map(s => {
                const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                const asset = Array.isArray(s.inspiration_assets) ? s.inspiration_assets[0] : s.inspiration_assets;

                return {
                    id: s.id,
                    client_name: profile?.full_name || "New Couple",
                    client_email: profile?.email || "",
                    status: 'New',
                    created_at: s.swiped_at,
                    event_date: null,
                    budget: null,
                    asset_id: s.asset_id,
                    asset_image: asset?.image_url || "",
                    asset_category: asset?.category_tag || "",
                    swipe_type: s.swipe_direction as 'RIGHT' | 'SUPER_LIKE',
                    cost_model: asset?.cost_model,
                    base_cost: asset?.base_cost_low,
                    min_service_fee_pct: asset?.min_service_fee_pct,
                    user_id: profile?.id
                };
            });

            setLeads(mappedLeads);
            if (mappedLeads.length > 0 && !selectedLeadId) setSelectedLeadId(mappedLeads[0].id);
        } catch (error) {
            console.error("Error fetching leads:", error);
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads.filter(l =>
        l.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.asset_category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSeedData = async () => {
        if (!businessProfile?.id) return;
        setLoading(true);
        try {
            const { data: assets } = await supabase
                .from('inspiration_assets')
                .select('id')
                .eq('vendor_id', businessProfile.id)
                .limit(1);

            let assetId = assets?.[0]?.id;

            if (!assetId) {
                // Auto-create a placeholder asset if none exists
                const { data: newAsset, error: createError } = await supabase
                    .from('inspiration_assets')
                    .insert([{
                        vendor_id: businessProfile.id,
                        category_tag: 'Floral',
                        cost_model: 'per_guest',
                        base_cost_low: 1000,
                        base_cost_high: 2000,
                        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
                    }])
                    .select('id')
                    .single();

                if (createError) {
                    toast.error("Could not create demo asset. Please upload photos manually.");
                    setLoading(false);
                    return;
                }
                assetId = newAsset.id;
            }

            const demoUserId = businessProfile.owner_id;

            // Ensure demo project exists for the vendor user
            const { data: projects } = await supabase
                .from('projects')
                .select('id')
                .eq('user_id', demoUserId)
                .limit(1);

            let projectId = projects?.[0]?.id;

            if (!projectId) {
                const { data: newProject, error: pError } = await supabase
                    .from('projects')
                    .insert([{
                        user_id: demoUserId,
                        title: 'Demo Wedding',
                        event_date: '2025-06-01',
                        budget: 10000
                    }])
                    .select('id')
                    .single();

                if (!pError && newProject) {
                    projectId = newProject.id;
                } else {
                    console.error("Failed to create demo project", pError);
                    // Continue anyway, it might fail if project_id is strictly required
                }
            }

            await supabase.from('user_swipes').insert([
                {
                    user_id: demoUserId,
                    asset_id: assetId,
                    project_id: projectId,
                    swipe_direction: 'RIGHT',
                    swiped_at: new Date().toISOString()
                },
                {
                    user_id: demoUserId,
                    asset_id: assetId,
                    project_id: projectId,
                    swipe_direction: 'SUPER_LIKE',
                    swiped_at: new Date(Date.now() - 86400000).toISOString()
                }
            ]);

            toast.success("Demo leads generated! Refreshing...");
            fetchLeadsFromSwipes();

        } catch (error) {
            console.error("Error seeding:", error);
            toast.error("Failed to seed data");
            setLoading(false);
        }
    };

    const handleUpdateStatus = (status: Lead['status']) => {
        // In a real app, we'd update a 'leads' table or 'lead_status' in swipes
        toast.info(`Status updated to ${status}`);
        setLeads(prev => prev.map(l => l.id === selectedLeadId ? { ...l, status } : l));
    };

    const handleSendReferral = async () => {
        if (!selectedPartnerId || !selectedLead) return;

        try {
            const partner = partnerships.find(p => p.partnerId === selectedPartnerId);
            const { error } = await supabase.from('referrals').insert([{
                source_vendor_id: businessProfile!.id,
                target_vendor_id: selectedPartnerId,
                client_name: selectedLead.client_name,
                client_email: selectedLead.client_email,
                status: 'pending',
                commission_rate_pct: partner?.rate || 10,
                partner_lead_status: 'New'
            }]);

            if (error) throw error;
            toast.success("Lead referred successfully!");
            setIsReferralModalOpen(false);
        } catch (e) {
            console.error("Referral error:", e);
            toast.error("Failed to refer lead");
        }
    };

    const handleSaveQuote = async () => {
        if (!selectedLead || !businessProfile?.id) return;
        setSubmitting(true);

        const subtotal = quantity * unitPrice;
        const feePct = selectedLead.min_service_fee_pct || 20;
        const serviceFee = subtotal * (feePct / 100);
        const tax = subtotal * 0.08;
        const grandTotal = subtotal + serviceFee + tax;

        try {
            const { data, error } = await supabase
                .from('quotes')
                .insert([{
                    vendor_id: businessProfile.id,
                    user_id: selectedLead.user_id,
                    status: 'DRAFT',
                    items: [{
                        description: selectedLead.asset_category,
                        quantity,
                        unit_price: unitPrice * 100 // Convert to cents
                    }],
                    subtotal_cents: Math.round(subtotal * 100),
                    tax_cents: Math.round(tax * 100),
                    service_fee_cents: Math.round(serviceFee * 100),
                    grand_total_cents: Math.round(grandTotal * 100),
                    notes: `Quote generated from ${selectedLead.asset_category} inspiration swipe.`
                }])
                .select();

            if (error) throw error;

            toast.success("Quote draft created!");
            setIsQuoteModalOpen(false);
            handleUpdateStatus('Contacted');
        } catch (error) {
            console.error("Error creating quote:", error);
            toast.error("Failed to create quote");
        } finally {
            setSubmitting(false);
        }
    };

    if (businessLoading || (loading && leads.length === 0)) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-700 bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Lead Response System</h1>
                    <p className="text-slate-600 mt-1">Manage inquiries generated from your portfolio swipes.</p>
                </div>
                <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl">
                    <Button variant="ghost" size="sm" className="bg-slate-100 text-slate-900">Active</Button>
                    <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">Archived</Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 overflow-hidden">
                {/* Left Panel: Lead List */}
                <div className="w-full lg:w-96 flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <Input
                            className="bg-white border-slate-200 pl-10 h-12 rounded-xl focus-visible:ring-rose-500 text-slate-900"
                            placeholder="Search leads..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <ScrollArea className="flex-1 bg-white border border-slate-200 rounded-2xl">
                        <div className="p-2 space-y-1">
                            {filteredLeads.length === 0 ? (
                                <div className="p-8 text-center text-slate-500 space-y-4">
                                    <p>No leads found.</p>
                                    <Button variant="outline" size="sm" onClick={handleSeedData} className="border-dashed border-slate-300 hover:border-rose-400 hover:text-rose-500">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Generate Demo Leads
                                    </Button>
                                </div>
                            ) : filteredLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    onClick={() => setSelectedLeadId(lead.id)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all flex items-center gap-4 group ${selectedLeadId === lead.id
                                        ? "bg-rose-50 border-l-4 border-rose-500"
                                        : "hover:bg-slate-50 border-l-4 border-transparent"
                                        }`}
                                >
                                    <div className="relative">
                                        <Avatar className="w-12 h-12 border-2 border-slate-200">
                                            <AvatarFallback className="bg-rose-500/10 text-rose-500 font-bold">
                                                {lead.client_name[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        {lead.swipe_type === 'SUPER_LIKE' && (
                                            <div className="absolute -top-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-white">
                                                <Star className="w-2 h-2 text-white fill-current" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold truncate text-sm text-slate-900">{lead.client_name}</h4>
                                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-tighter">
                                                {format(parseISO(lead.created_at), 'MMM d')}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-600 truncate mt-0.5">{lead.asset_category} Inquiry</p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 border-slate-300 ${lead.status === 'New' ? 'text-rose-500' : 'text-slate-600'
                                                }`}>
                                                {lead.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-slate-700 transition-transform ${selectedLeadId === lead.id ? "rotate-90 text-rose-500" : ""
                                        }`} />
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Right Panel: Lead Detail */}
                <div className="hidden lg:flex flex-1 flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden">
                    {selectedLead ? (
                        <div className="flex flex-col h-full">
                            <div className="p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                                <div className="flex gap-6">
                                    <Avatar className="w-20 h-20 border-4 border-slate-200">
                                        <AvatarFallback className="bg-rose-500/10 text-rose-500 text-3xl font-serif">
                                            {selectedLead.client_name[0]}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-3xl font-serif font-bold text-slate-900">{selectedLead.client_name}</h2>
                                            {selectedLead.swipe_type === 'SUPER_LIKE' && (
                                                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30">Super Like</Badge>
                                            )}
                                        </div>
                                        <p className="text-slate-600 flex items-center gap-4 mt-2">
                                            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-rose-400" /> {selectedLead.client_email}</span>
                                            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-rose-400" /> Florida, US</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" className="border-slate-300">
                                        Archive
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                                        onClick={() => setIsReferralModalOpen(true)}
                                    >
                                        <Send className="w-4 h-4 mr-2" />
                                        Refer Lead
                                    </Button>
                                    <Button
                                        className="bg-rose-600 hover:bg-rose-700"
                                        onClick={() => setIsQuoteModalOpen(true)}
                                    >
                                        Generate Quote
                                    </Button>
                                </div>
                            </div>

                            <ScrollArea className="flex-1 p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <section>
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                                <Heart className="w-3 h-3 text-rose-500" /> The Inspiration
                                            </h3>
                                            <Card className="bg-white border-slate-200 overflow-hidden group">
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img
                                                        src={selectedLead.asset_image}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        alt="Liked asset"
                                                    />
                                                </div>
                                                <CardContent className="p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Category</p>
                                                        <p className="font-bold text-slate-900">{selectedLead.asset_category}</p>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-rose-400 hover:text-rose-300">
                                                        View Asset <ArrowUpRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </section>

                                        <section className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                                <Clock className="w-3 h-3 text-rose-500" /> Activity History
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                                                    <div className="text-sm">
                                                        <p className="font-bold text-slate-900">Swiped {selectedLead.swipe_type === 'RIGHT' ? 'Right' : 'SUPER LIKE'}</p>
                                                        <p className="text-slate-500 text-xs">{format(parseISO(selectedLead.created_at), 'MMMM d, yyyy h:mm a')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>

                                    <div className="space-y-6">
                                        <section className="bg-white border border-slate-200 rounded-xl p-6">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
                                                <Star className="w-3 h-3 text-rose-500" /> Manage Status
                                            </h3>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { id: 'New', color: 'bg-rose-500' },
                                                    { id: 'Contacted', color: 'bg-indigo-500' },
                                                    { id: 'Contract Sent', color: 'bg-amber-500' },
                                                    { id: 'Booked', color: 'bg-emerald-500' }
                                                ].map((stat) => (
                                                    <Button
                                                        key={stat.id}
                                                        variant="outline"
                                                        onClick={() => handleUpdateStatus(stat.id as any)}
                                                        className={`border-slate-800 text-xs justify-start px-3 py-6 h-auto ${selectedLead.status === stat.id
                                                            ? `bg-slate-800 border-l-4 border-l-rose-500 text-white`
                                                            : "bg-slate-900/50 text-white hover:bg-slate-800"
                                                            }`}
                                                    >
                                                        <div className={`w-2 h-2 rounded-full mr-3 ${stat.color}`} />
                                                        {stat.id}
                                                    </Button>
                                                ))}
                                            </div>
                                        </section>

                                        <section className="bg-indigo-600 text-white rounded-xl p-6 relative overflow-hidden group shadow-xl">
                                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:rotate-12 transition-transform">
                                                <MessageSquare className="w-16 h-16" />
                                            </div>
                                            <h4 className="text-xl font-serif text-xl font-bold mb-2">Lead Conversion Tip</h4>
                                            <p className="text-xs text-indigo-100 mb-4">
                                                Couples who receive a reply within 4 hours are 3x more likely to book. Try sending a quick "Hey, loved that you liked our floral style!"
                                            </p>
                                            <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold rounded-lg">
                                                Send Quick Reply
                                            </Button>
                                        </section>
                                    </div>
                                </div>
                            </ScrollArea>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-slate-500">
                            <MessageSquare className="w-16 h-16 mb-4 opacity-20" />
                            <h3 className="text-xl font-serif">Select a lead to start conversion</h3>
                            <p className="text-sm mt-2">Pick a couple from the left to view their inspiration and start chatting.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Generate Quote Dialog */}
            <Dialog open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen}>
                <DialogContent className="bg-white border-slate-200 max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif">Generate Quote for {businessProfile?.name || selectedLead?.client_name}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            Create a detailed quote based on the inspiration swiped.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Base Service/Item</Label>
                                <Input value={selectedLead?.asset_category} className="bg-white border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label>Pricing Model</Label>
                                <Input value={selectedLead?.cost_model?.replace('_', ' ').toUpperCase()} className="bg-white border-slate-200" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Units/Quantity</Label>
                                    <Input
                                        type="number"
                                        value={quantity}
                                        onChange={e => setQuantity(Number(e.target.value))}
                                        className="bg-white border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Unit Price ($)</Label>
                                    <Input
                                        type="number"
                                        value={unitPrice}
                                        onChange={e => setUnitPrice(Number(e.target.value))}
                                        className="bg-white border-slate-200"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">Estimated Total</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Subtotal</span>
                                    <span>${(quantity * unitPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Service Fee ({selectedLead?.min_service_fee_pct || 20}%)</span>
                                    <span>${((quantity * unitPrice) * (selectedLead?.min_service_fee_pct || 20) / 100).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Tax (8%)</span>
                                    <span>${((quantity * unitPrice) * 0.08).toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                                    <span className="font-bold">Grand Total</span>
                                    <span className="text-2xl font-serif text-rose-500 font-bold">
                                        ${((quantity * unitPrice) * (1 + (selectedLead?.min_service_fee_pct || 20) / 100 + 0.08)).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" className="border-slate-800 hover:bg-slate-800" onClick={() => setIsQuoteModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className="bg-rose-600 hover:bg-rose-700"
                            onClick={handleSaveQuote}
                            disabled={submitting}
                        >
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Create Quote
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Refer Lead Dialog */}
            <Dialog open={isReferralModalOpen} onOpenChange={setIsReferralModalOpen}>
                <DialogContent className="max-w-md bg-white border-none shadow-2xl rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif text-center">Refer This Lead</DialogTitle>
                        <DialogDescription className="text-center">
                            Send <strong>{selectedLead?.client_name}</strong> to a partner.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-6 space-y-6">
                        <div className="space-y-2">
                            <Label className="font-bold">Select Partner</Label>
                            <Select value={selectedPartnerId} onValueChange={setSelectedPartnerId}>
                                <SelectTrigger className="h-12 bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Choose a partner..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {partnerships.map(p => (
                                        <SelectItem key={p.partnerId} value={p.partnerId}>
                                            <div className="flex justify-between items-center w-[280px]">
                                                <span className="font-medium">{p.partnerName}</span>
                                                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                                                    {p.rate}% Comm.
                                                </Badge>
                                            </div>
                                        </SelectItem>
                                    ))}
                                    {partnerships.length === 0 && (
                                        <div className="p-4 text-center text-sm text-slate-500">
                                            No eligible partners found.
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={handleSendReferral}
                            className="w-full h-12 bg-rose-600 hover:bg-rose-700 font-bold text-lg rounded-xl shadow-lg shadow-rose-200"
                            disabled={!selectedPartnerId}
                        >
                            Send Referral
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
