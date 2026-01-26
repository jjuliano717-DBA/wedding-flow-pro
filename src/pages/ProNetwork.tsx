import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Heart, X, MapPin, Star, Sparkles, TrendingUp,
    Users, ChevronLeft, ChevronRight, Loader2, Handshake
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useBusiness } from "@/context/BusinessContext";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

interface PartnerCandidate {
    vendor_id: string;
    vendor_name: string;
    vendor_type: string;
    distance_miles: number;
    style_match_pct: number;
    partnership_status: string;
}

export default function ProNetwork() {
    const { businessProfile } = useBusiness();
    const [candidates, setCandidates] = useState<PartnerCandidate[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [radiusMiles, setRadiusMiles] = useState(50);

    // Connection Dialog State
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [commissionRate, setCommissionRate] = useState([10]);
    const [connectionNote, setConnectionNote] = useState("");

    useEffect(() => {
        if (businessProfile?.id) {
            loadPartners();
        }
    }, [businessProfile?.id, radiusMiles]);

    const loadPartners = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('find_compatible_partners', {
                p_vendor_id: businessProfile!.id,
                p_radius_miles: radiusMiles
            });

            if (error) throw error;
            setCandidates(data || []);
            setCurrentIndex(0);
        } catch (error: any) {
            console.error("Error loading partners:", error);
            toast.error("Failed to load partner recommendations");
        } finally {
            setLoading(false);
        }
    };

    const handleConnectClick = () => {
        setCommissionRate([10]); // Reset to default
        setConnectionNote(`Hi! I'd love to partner with you. I usually offer ${commissionRate[0]}% commission on referrals.`);
        setShowConnectDialog(true);
    };

    const submitConnectionRequest = async () => {
        if (!currentCandidate) return;

        try {
            const { error } = await supabase
                .from('vendor_partnerships')
                .insert([{
                    requester_id: businessProfile!.id,
                    receiver_id: currentCandidate.vendor_id,
                    status: 'requested',
                    default_commission_rate_pct: commissionRate[0],
                    notes: connectionNote
                }]);

            if (error) throw error;

            toast.success("Partnership request sent!");
            setShowConnectDialog(false);
            nextCard();
        } catch (error: any) {
            console.error("Error creating partnership:", error);
            toast.error("Failed to send partnership request");
        }
    };

    const handlePass = () => {
        nextCard();
    };

    const nextCard = () => {
        if (currentIndex < candidates.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const previousCard = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const currentCandidate = candidates[currentIndex];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <Badge className="bg-rose-100 text-rose-600 mb-4 hover:bg-rose-200 px-4 py-1 text-sm">B2B Growth Engine</Badge>
                    <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                        Partner Network
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Find complementary professionals, agree on commission terms, and grow your revenue together.
                    </p>
                </div>

                {/* Radius Filter */}
                <div className="flex justify-center mb-8 gap-3">
                    {[25, 50, 100, 200].map((miles) => (
                        <Button
                            key={miles}
                            variant={radiusMiles === miles ? "default" : "outline"}
                            onClick={() => setRadiusMiles(miles)}
                            className={`rounded-full px-6 transition-all ${radiusMiles === miles
                                ? "bg-slate-900 text-white hover:bg-slate-800 shadow-lg"
                                : "bg-white text-slate-600 border-slate-200 hover:border-rose-200 hover:text-rose-600"
                                }`}
                        >
                            {miles} mi
                        </Button>
                    ))}
                </div>

                {/* Card Stack */}
                <div className="relative h-[650px] flex items-center justify-center perspective-1000">
                    <AnimatePresence mode="wait">
                        {currentCandidate ? (
                            <motion.div
                                key={currentCandidate.vendor_id}
                                initial={{ scale: 0.9, opacity: 0, y: 50 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, x: -100 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                className="w-full max-w-xl"
                            >
                                <Card className="bg-white shadow-2xl border-0 overflow-hidden rounded-3xl h-full flex flex-col">
                                    {/* Hero Image Section */}
                                    <div className="h-48 bg-gradient-to-br from-slate-900 via-rose-900 to-slate-900 relative p-8 flex flex-col justify-end">
                                        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>

                                        <div className="absolute top-6 right-6">
                                            <Badge className="bg-white/10 backdrop-blur-md text-white border-0 px-3 py-1.5 text-sm font-medium">
                                                {Math.round(currentCandidate.style_match_pct)}% Match
                                            </Badge>
                                        </div>

                                        <div className="relative z-10">
                                            <h2 className="font-serif text-3xl font-bold text-white mb-1 shadow-sm">
                                                {currentCandidate.vendor_name}
                                            </h2>
                                            <p className="text-rose-200 font-medium flex items-center gap-2">
                                                <Users className="w-4 h-4" />
                                                {currentCandidate.vendor_type}
                                            </p>
                                        </div>
                                    </div>

                                    <CardContent className="p-8 flex-1 flex flex-col">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-rose-100 transition-colors">
                                                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm mb-3 text-rose-500">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">Distance</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    {Math.round(currentCandidate.distance_miles)} <span className="text-sm font-normal text-slate-400">miles</span>
                                                </p>
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-rose-100 transition-colors">
                                                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm mb-3 text-indigo-500">
                                                    <Handshake className="w-5 h-5" />
                                                </div>
                                                <p className="text-sm text-slate-500 font-medium">Potential</p>
                                                <p className="text-2xl font-bold text-slate-900">
                                                    High <span className="text-sm font-normal text-slate-400">Overlap</span>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Insight Box */}
                                        <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 mb-8 flex gap-4">
                                            <div className="bg-rose-100 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                                <TrendingUp className="w-5 h-5 text-rose-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-rose-900 text-sm mb-1">Why this partnership?</h4>
                                                <p className="text-sm text-rose-700/80 leading-relaxed">
                                                    You share a similar aesthetic ({Math.round(currentCandidate.style_match_pct)}% style match) but offer different services. Perfect for cross-referrals!
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-auto flex gap-4">
                                            <Button
                                                variant="outline"
                                                size="lg"
                                                onClick={handlePass}
                                                className="flex-1 h-14 rounded-xl border-slate-200 hover:bg-slate-50 hover:text-slate-900 font-medium"
                                            >
                                                <X className="w-5 h-5 mr-2" />
                                                Pass
                                            </Button>
                                            <Button
                                                size="lg"
                                                onClick={handleConnectClick}
                                                className="flex-1 h-14 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all"
                                            >
                                                <Heart className="w-5 h-5 mr-2" />
                                                Connect
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Navigation Indicator */}
                                <div className="flex justify-center items-center mt-8 gap-4 text-sm font-medium text-slate-400">
                                    <Button variant="ghost" size="sm" onClick={previousCard} disabled={currentIndex === 0}>
                                        <ChevronLeft className="w-4 h-4 mr-1" /> Prev
                                    </Button>
                                    <span>{currentIndex + 1} / {candidates.length}</span>
                                    <Button variant="ghost" size="sm" onClick={nextCard} disabled={currentIndex === candidates.length - 1}>
                                        Next <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center bg-white p-16 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full"
                            >
                                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="font-serif text-2xl font-bold text-slate-900 mb-2">
                                    All Caught Up!
                                </h3>
                                <p className="text-slate-500 mb-8 leading-relaxed">
                                    You've viewed all recommended partners in this area. Try expanding your search radius to find more connections.
                                </p>
                                <Button onClick={() => setRadiusMiles(radiusMiles + 50)} className="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 rounded-full w-full">
                                    Expand Search Radius
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Connection Dialog */}
                <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
                    <DialogContent className="sm:max-w-md bg-white border-0 shadow-2xl rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-serif text-2xl text-center pt-4">Propose Partnership</DialogTitle>
                            <DialogDescription className="text-center text-slate-500">
                                Send a "Handshake" offer to {currentCandidate?.vendor_name}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-8 py-6 px-2">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center px-1">
                                    <Label className="text-base font-bold text-slate-900">Commission Offer</Label>
                                    <span className="text-2xl font-serif font-bold text-rose-600">{commissionRate}%</span>
                                </div>
                                <Slider
                                    value={commissionRate}
                                    onValueChange={setCommissionRate}
                                    max={30}
                                    step={1}
                                    className="py-6 cursor-pointer"
                                />
                                <p className="text-xs text-slate-500 text-center">
                                    This helps set expectations. You can adjust this per referral later.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-slate-900">Personal Note</Label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-xl border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none"
                                    value={connectionNote}
                                    onChange={(e) => setConnectionNote(e.target.value)}
                                    placeholder="Hi! I'd love to partner with you..."
                                />
                            </div>
                        </div>

                        <DialogFooter className="sm:justify-center pb-4">
                            <Button
                                onClick={submitConnectionRequest}
                                className="w-full h-12 rounded-xl bg-rose-600 hover:bg-rose-700 text-base font-bold shadow-lg shadow-rose-200"
                            >
                                Send Proposal
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
