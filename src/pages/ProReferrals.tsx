import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DollarSign, TrendingUp, Send, CheckCircle, Clock,
    Users, Plus, Loader2, ArrowRight, Wallet, UserCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface Referral {
    id: string;
    source_vendor_id: string;
    target_vendor_id: string;
    client_name: string;
    client_email: string;
    event_date: string;
    commission_earned_cents: number;
    status: 'pending' | 'accepted' | 'declined' | 'completed' | 'pending_payout' | 'paid';
    created_at: string;
    partner_lead_status?: string;
    target_vendor?: any;
    source_vendor?: any;
}

interface Partnership {
    id: string;
    receiver_id: string;
    requester_id: string;
    status: string;
    default_commission_rate_pct?: number;
    receiver_vendor?: any;
    requester_vendor?: any;
}

export default function ProReferrals() {
    const { businessProfile } = useBusiness();
    const [referrals, setReferrals] = useState<Referral[]>([]);
    const [partnerships, setPartnerships] = useState<Partnership[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSendDialog, setShowSendDialog] = useState(false);
    const [activeTab, setActiveTab] = useState<'sent' | 'received'>('sent');

    // Form state
    const [selectedPartner, setSelectedPartner] = useState("");
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [potentialValue, setPotentialValue] = useState("");
    const [commissionRate, setCommissionRate] = useState("10");

    useEffect(() => {
        if (businessProfile?.id) {
            loadData();
        }
    }, [businessProfile?.id]);

    // Update commission rate when partner is selected
    useEffect(() => {
        if (selectedPartner) {
            const partner = activePartners.find(p => p.id === selectedPartner);
            if (partner?.defaultRate) {
                setCommissionRate(partner.defaultRate.toString());
            }
        }
    }, [selectedPartner]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load referrals
            const { data: referralData, error: refError } = await supabase
                .from('referrals')
                .select(`
          *,
          target_vendor:vendors!referrals_target_vendor_id_fkey(id, name, type),
          source_vendor:vendors!referrals_source_vendor_id_fkey(id, name, type)
        `)
                .or(`source_vendor_id.eq.${businessProfile!.id},target_vendor_id.eq.${businessProfile!.id}`)
                .order('created_at', { ascending: false });

            if (refError) throw refError;

            // Load ALL vendors to enable open networking/referrals
            const { data: vendorData, error: vendError } = await supabase
                .from('vendors')
                .select('*')
                .neq('id', businessProfile!.id)
                .limit(50); // Limit for performance

            if (vendError) throw vendError;

            setReferrals(referralData || []);
            // Map raw vendors to the structure expected by the UI (simulating partnerships for now)
            setPartnerships(vendorData?.map(v => ({
                id: `temp-${v.id}`,
                receiver_id: v.id, // For a "referral out", the receiver is the other vendor
                requester_id: businessProfile!.id,
                status: 'active',
                default_commission_rate_pct: 10,
                receiver_vendor: v,
                requester_vendor: businessProfile
            })) || []);
        } catch (error: any) {
            console.error("Error loading data:", error);
            toast.error("Failed to load referrals");
        } finally {
            setLoading(false);
        }
    };

    const handleSendReferral = async () => {
        if (!selectedPartner || !clientName) {
            toast.error("Please fill in required fields");
            return;
        }

        try {
            const valueCents = potentialValue ? parseFloat(potentialValue) * 100 : 0;
            const commissionEarned = valueCents * (parseFloat(commissionRate) / 100);

            // selectedPartner in UI is the "partnership id" or "vendor id"? 
            // In mapping below, we used `p.id` (partnership id) for key, but value needs to be TARGET VENDOR ID.
            // Wait, look at the SelectItem value below. 
            // `activePartners` maps `id: isRequester ? p.receiver_id : p.requester_id`. 
            // So `selectedPartner` IS the target vendor ID if we keep that logic.

            const { error } = await supabase
                .from('referrals')
                .insert([{
                    source_vendor_id: businessProfile!.id,
                    target_vendor_id: selectedPartner,
                    client_name: clientName,
                    client_email: clientEmail,
                    client_phone: clientPhone,
                    event_date: eventDate || null,
                    potential_value_cents: valueCents,
                    commission_rate_pct: parseFloat(commissionRate),
                    commission_earned_cents: Math.round(commissionEarned),
                    status: 'pending' // Initial status
                }]);

            if (error) throw error;

            toast.success("Referral sent successfully!");
            setShowSendDialog(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error("Error sending referral:", error);
            toast.error("Failed to send referral");
        }
    };

    const resetForm = () => {
        setSelectedPartner("");
        setClientName("");
        setClientEmail("");
        setClientPhone("");
        setEventDate("");
        setPotentialValue("");
        setCommissionRate("10");
    };

    const activePartners = partnerships.map(p => {
        // With the new "All Vendors" fetch, `p` simulates a partnership where WE are the requester.
        // So just map directly.
        return {
            partnershipId: p.id,
            id: p.receiver_id, // This is the target vendor ID
            vendor: p.receiver_vendor,
            defaultRate: p.default_commission_rate_pct || 10
        };
    });

    // Pipeline Metrics
    const sentReferrals = referrals.filter(r => r.source_vendor_id === businessProfile?.id);
    const totalPotentialCommission = sentReferrals.reduce((sum, r) => sum + (r.commission_earned_cents || 0), 0) / 100;

    // Pipeline Columns
    const pipelineStatuses = [
        { id: 'pending', label: 'Pending Acceptance', color: 'bg-slate-100 text-slate-600' },
        { id: 'accepted', label: 'Active Lead', color: 'bg-blue-100 text-blue-600' },
        { id: 'completed', label: 'Job Completed', color: 'bg-emerald-100 text-emerald-600' },
        { id: 'paid', label: 'Commission Paid', color: 'bg-rose-100 text-rose-600' }
    ];

    const getFilteredReferrals = (status: string) => {
        return (activeTab === 'sent' ? sentReferrals : referrals.filter(r => r.target_vendor_id === businessProfile?.id))
            .filter(r => {
                if (status === 'pending') return r.status === 'pending';
                if (status === 'accepted') return ['accepted', 'pending_payout'].includes(r.status);
                if (status === 'completed') return r.status === 'completed';
                if (status === 'paid') return r.status === 'paid';
                return false;
            });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                            Referral Pipeline
                        </h1>
                        <p className="text-slate-600 text-lg">
                            Track your revenue from partnerships and earned commissions.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab('sent')}
                                className={activeTab === 'sent' ? "bg-rose-50 text-rose-600 shadow-sm" : "text-slate-500"}
                            >
                                referrals Out
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setActiveTab('received')}
                                className={activeTab === 'received' ? "bg-rose-50 text-rose-600 shadow-sm" : "text-slate-500"}
                            >
                                Referrals In
                            </Button>
                        </div>
                        <Button
                            onClick={() => setShowSendDialog(true)}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 px-6 shadow-lg shadow-rose-200"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Send New Referral
                        </Button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center text-green-600">
                                <Wallet className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Pipeline Value</p>
                                <p className="text-2xl font-bold text-slate-900">${totalPotentialCommission.toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-blue-600">
                                <Send className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Sent</p>
                                <p className="text-2xl font-bold text-slate-900">{sentReferrals.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center text-purple-600">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">Active Partners</p>
                                <p className="text-2xl font-bold text-slate-900">{activePartners.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Kanban Pipeline */}
                <div className="flex flex-col md:grid md:grid-cols-4 gap-6 overflow-x-auto pb-8 snap-x snap-mandatory md:snap-none">
                    {pipelineStatuses.map((status) => (
                        <div key={status.id} className="min-w-[85vw] md:min-w-0 snap-center md:snap-align-none">
                            <div className="flex items-center gap-2 mb-4">
                                <span className={`w-2 h-2 rounded-full ${status.id === 'paid' ? 'bg-rose-500' : 'bg-slate-300'}`} />
                                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{status.label}</h3>
                                <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded-full font-bold">
                                    {getFilteredReferrals(status.id).length}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {getFilteredReferrals(status.id).map((referral) => {
                                    const partner = activeTab === 'sent' ? referral.target_vendor : referral.source_vendor;

                                    return (
                                        <motion.div
                                            key={referral.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            layoutId={referral.id}
                                        >
                                            <Card className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer bg-white group">
                                                <CardContent className="p-4">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h4 className="font-serif font-bold text-slate-900 text-lg">
                                                            {referral.client_name}
                                                        </h4>
                                                        <Badge variant="outline" className={`${status.color} border-0 font-bold uppercase text-[10px]`}>
                                                            {referral.status.replace('_', ' ')}
                                                        </Badge>
                                                    </div>

                                                    <div className="text-sm text-slate-500 mb-4 space-y-1">
                                                        <p className="flex items-center gap-2">
                                                            <Users className="w-4 h-4 text-slate-400" />
                                                            vs {partner?.name}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            {referral.event_date ? format(parseISO(referral.event_date), 'MMM d, yyyy') : 'No Date'}
                                                        </p>
                                                    </div>

                                                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center group-hover:border-rose-100 transition-colors">
                                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commission</span>
                                                        <span className="font-bold text-green-600">
                                                            ${(referral.commission_earned_cents / 100).toFixed(0)}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })}

                                {getFilteredReferrals(status.id).length === 0 && (
                                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                                        <p className="text-sm text-slate-400">No referrals in this stage</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Send Referral Dialog */}
                <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
                    <DialogContent className="bg-white border-0 shadow-2xl rounded-2xl max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl md:text-3xl font-serif font-bold text-center">Send Referral</DialogTitle>
                            <DialogDescription className="text-center text-slate-500 text-base">
                                Share a lead with a partner and earn commission.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6 py-6">
                            {/* Partner Selection */}
                            <div className="grid gap-2">
                                <Label className="font-bold text-slate-900">Select Partner</Label>
                                <Select value={selectedPartner} onValueChange={setSelectedPartner}>
                                    <SelectTrigger className="h-12 border-slate-200 bg-slate-50 rounded-xl text-base">
                                        <SelectValue placeholder="Choose a partner..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activePartners.map((p) => (
                                            <SelectItem key={p.id} value={p.id} className="py-3">
                                                <div className="flex items-center justify-between w-full min-w-[300px]">
                                                    <span className="font-medium">{p.vendor?.name}</span>
                                                    <Badge variant="secondary" className="bg-green-100 text-green-800 ml-2">
                                                        {p.defaultRate}% Comm.
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Client Details */}
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <UserCircle className="w-5 h-5 text-rose-500" /> Client Details
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Client Name</Label>
                                        <Input placeholder="Couples Name" value={clientName} onChange={e => setClientName(e.target.value)} className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Client Email</Label>
                                        <Input placeholder="email@example.com" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Event Date</Label>
                                        <Input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Estimated Value ($)</Label>
                                        <Input type="number" placeholder="5000" value={potentialValue} onChange={e => setPotentialValue(e.target.value)} className="bg-white" />
                                    </div>
                                </div>
                            </div>

                            {/* Commission Preview */}
                            {potentialValue && (
                                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex justify-between items-center animate-in fade-in">
                                    <div>
                                        <p className="text-green-800 font-bold text-sm">Estimated Commission ({commissionRate}%)</p>
                                        <p className="text-green-600 text-xs">Based on partner agreement</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-700">
                                        ${((parseFloat(potentialValue) * parseFloat(commissionRate)) / 100).toFixed(0)}
                                    </p>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="sm:justify-center">
                            <Button onClick={handleSendReferral} className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-lg font-bold shadow-lg shadow-rose-200">
                                Send Referral
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
