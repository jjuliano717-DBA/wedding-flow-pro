import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Heart, ArrowLeft, Globe, Mail, Check, Share2, Instagram, Facebook, ShieldCheck, ExternalLink, TrendingUp, Loader2, BookOpen, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { VerificationBadge } from "@/components/VerificationBadge";
import { TrustScore, calculateTrustScore } from "@/lib/googlePlaces";
import { Progress } from "@/components/ui/progress";
import { sendInquiryEmails } from "@/lib/emailService";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Vendor {
    id: string;
    name: string;
    description: string;
    type: string;
    location: string;
    website: string;
    service_zipcodes: string[];
    google_rating: number;
    google_reviews: number;
    heart_rating: number;
    exclusive: boolean;
    image_url: string;
    google_business_url?: string;
    owner_id?: string;
}

// Calculate trust score from vendor data
function calculateVendorTrustScore(vendor: Vendor): TrustScore {
    if (vendor.google_rating && vendor.google_reviews) {
        return calculateTrustScore({
            placeId: vendor.google_business_url || '',
            name: vendor.name,
            rating: vendor.google_rating || 0,
            userRatingsTotal: vendor.google_reviews || 0,
            businessStatus: 'OPERATIONAL',
            verified: !!vendor.google_business_url
        });
    }
    return {
        score: 0,
        tier: 'unverified',
        breakdown: { ratingScore: 0, reviewCountScore: 0, statusScore: 0 }
    };
}

const VendorDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Referral Dialog State
    const [isReferralOpen, setIsReferralOpen] = useState(false);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [loadingProjects, setLoadingProjects] = useState(false);

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        date: '',
        message: ''
    });

    const [isInBlackBook, setIsInBlackBook] = useState(false);
    const [plannerProfileId, setPlannerProfileId] = useState<string | null>(null);
    const [partnership, setPartnership] = useState<any | null>(null);

    // Check if user is a planner and get their profile ID
    useEffect(() => {
        const checkPlannerStatus = async () => {
            if (user?.role === 'planner' || user?.role === 'admin') { // Allow admins to test
                const { data } = await supabase
                    .from('vendors')
                    .select('id')
                    .eq('owner_id', user.id)
                    .single();
                if (data) setPlannerProfileId(data.id);
            }
        };
        checkPlannerStatus();
    }, [user]);

    // Check if vendor is in black book AND check partnership status
    useEffect(() => {
        const checkStatus = async () => {
            if (!plannerProfileId || !id) return;

            // Check Black Book
            const { data: bbData } = await supabase
                .from('black_book')
                .select('id')
                .eq('planner_id', plannerProfileId)
                .eq('vendor_id', id)
                .single();
            setIsInBlackBook(!!bbData);

            // Check Partnership
            const { data: pData } = await supabase
                .from('vendor_partnerships')
                .select('*')
                .or(`and(requester_id.eq.${plannerProfileId},receiver_id.eq.${id}),and(requester_id.eq.${id},receiver_id.eq.${plannerProfileId})`)
                .eq('status', 'accepted')
                .maybeSingle(); // Use maybeSingle as there might not be one

            setPartnership(pData);
        };
        checkStatus();
    }, [plannerProfileId, id]);

    const toggleBlackBook = async () => {
        if (!plannerProfileId || !id) return;

        if (isInBlackBook) {
            // Remove
            const { error } = await supabase
                .from('black_book')
                .delete()
                .eq('planner_id', plannerProfileId)
                .eq('vendor_id', id);

            if (error) {
                toast.error("Failed to remove from Black Book");
            } else {
                setIsInBlackBook(false);
                toast.success("Removed from Black Book");
            }
        } else {
            // Add
            const { error } = await supabase
                .from('black_book')
                .insert({
                    planner_id: plannerProfileId,
                    vendor_id: id
                });

            if (error) {
                toast.error("Failed to add to Black Book");
            } else {
                setIsInBlackBook(true);
                toast.success("Added to Black Book");
            }
        }
    };
    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
        if (user?.fullName) {
            const [fname, ...lnameArr] = user.fullName.split(' ');
            setFormData(prev => ({
                ...prev,
                fname: fname || '',
                lname: lnameArr.join(' ') || ''
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchVendor = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setVendor(data);
            } catch (error) {
                console.error("Error fetching vendor:", error);
                toast.error("Could not load vendor details.");
            } finally {
                setLoading(false);
            }
        };
        fetchVendor();
    }, [id]);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: vendor?.name || 'Wedding Vendor',
                    text: `Check out ${vendor?.name} on 2PlanAWedding!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
        }
    };

    // Fetch projects when opening referral dialog
    useEffect(() => {
        if (isReferralOpen && user) {
            const fetchProjects = async () => {
                setLoadingProjects(true);
                const { data } = await supabase
                    .from('projects')
                    .select('id, client_name, wedding_date')
                    .eq('user_id', user.id)
                    .order('client_name');
                setProjects(data || []);
                setLoadingProjects(false);
            };
            fetchProjects();
        }
    }, [isReferralOpen, user]);

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground animate-pulse">Loading vendor profile...</p>
            </div>
        );
    }

    const handleSendReferral = async () => {
        if (!selectedProject || !plannerProfileId || !vendor) return;

        const project = projects.find(p => p.id === selectedProject);
        if (!project) return;

        try {
            setSubmitting(true);
            const { error } = await supabase
                .from('referrals')
                .insert({
                    from_vendor_id: plannerProfileId,
                    to_vendor_id: vendor.id,
                    project_id: project.id,
                    client_name: project.client_name,
                    event_date: project.wedding_date,
                    status: 'sent',
                    client_email: '' // Optional or could be fetched from project if added later
                });

            if (error) throw error;

            toast.success(`Referral sent to ${vendor.name} for ${project.client_name}!`);
            setIsReferralOpen(false);
            setSelectedProject("");
        } catch (error) {
            console.error("Error sending referral:", error);
            toast.error("Failed to send referral");
        } finally {
            setSubmitting(false);
        }
    };

    if (!vendor) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-muted-foreground">Vendor not found.</p>
                <Button variant="outline" asChild><Link to="/vendors">Back to Directory</Link></Button>
            </div>
        );
    }

    const trustScore = calculateVendorTrustScore(vendor);

    return (
        <div className="min-h-screen bg-background flex flex-col animate-fade-in">
            <div className="container mx-auto px-4 max-w-6xl py-8">
                <Button variant="ghost" className="mb-6 pl-0 gap-2 text-muted-foreground hover:text-foreground" asChild>
                    <Link to="/vendors"><ArrowLeft className="w-4 h-4" /> Back to Vendors</Link>
                </Button>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 border-b pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant="secondary" className="text-sm font-normal">{vendor.type}</Badge>
                            {vendor.exclusive && <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-200">Exclusive Partner</Badge>}
                            {trustScore.tier !== 'unverified' && (
                                <VerificationBadge trustScore={trustScore} size="sm" />
                            )}
                        </div>
                        <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4">{vendor.name}</h1>

                        {/* Partnership Badge */}
                        {partnership && (
                            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-medium">
                                <Check className="w-4 h-4" />
                                <span>Partner Connected</span>
                                {partnership.default_commission_rate_pct && (
                                    <span className="ml-1 pl-2 border-l border-emerald-200">
                                        {partnership.default_commission_rate_pct}% Commission
                                    </span>
                                )}
                            </div>
                        )}

                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">
                            <div className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                <span>{vendor.location}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{vendor.google_rating}</span>
                                <span className="text-muted-foreground">({vendor.google_reviews} Google reviews)</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                                <span className="font-semibold">{vendor.heart_rating}</span>
                                <span className="text-muted-foreground">(2Plan Heart Rating)</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* Planner Action: Refer to Client */}
                        {plannerProfileId && user?.id !== vendor.owner_id && (
                            <Dialog open={isReferralOpen} onOpenChange={setIsReferralOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2 border-brand-navy text-brand-navy hover:bg-slate-100">
                                        <Send className="w-4 h-4" /> Refer to Client
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Refer {vendor.name} to a Client</DialogTitle>
                                        <DialogDescription>
                                            Select one of your active client projects to send this vendor to.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label>Select Client Project</Label>
                                            <Select value={selectedProject} onValueChange={setSelectedProject}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Choose a client..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {loadingProjects ? (
                                                        <div className="p-2 text-center text-sm text-muted-foreground">Loading projects...</div>
                                                    ) : projects.length === 0 ? (
                                                        <div className="p-2 text-center text-sm text-muted-foreground">No active projects found.</div>
                                                    ) : (
                                                        projects.map(p => (
                                                            <SelectItem key={p.id} value={p.id}>
                                                                {p.client_name}
                                                                {p.wedding_date && <span className="text-muted-foreground ml-2">({format(new Date(p.wedding_date), 'MMM yyyy')})</span>}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsReferralOpen(false)}>Cancel</Button>
                                        <Button
                                            onClick={handleSendReferral}
                                            disabled={!selectedProject || submitting}
                                            className="bg-brand-navy text-white"
                                        >
                                            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Referral"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}

                        {/* Planner Action: Add to Black Book */}
                        {plannerProfileId && user?.id !== vendor.owner_id && (
                            <Button
                                variant={isInBlackBook ? "secondary" : "default"}
                                className={`gap-2 ${isInBlackBook ? "bg-slate-100 text-slate-900 border border-slate-200" : "bg-brand-navy hover:bg-slate-800"}`}
                                onClick={toggleBlackBook}
                            >
                                <BookOpen className="w-4 h-4" />
                                {isInBlackBook ? "Saved to Black Book" : "Add to Black Book"}
                            </Button>
                        )}

                        {user?.id === vendor.owner_id && (
                            <Button variant="outline" className="gap-2 border-slate-300 text-slate-700 hover:text-slate-900" asChild>
                                <Link to="/business/onboarding">
                                    <Globe className="w-4 h-4" /> Edit Profile
                                </Link>
                            </Button>
                        )}
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => setIsLiked(!isLiked)}>
                            <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-muted-foreground'}`} />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full" onClick={handleShare}>
                            <Share2 className="w-5 h-5 text-muted-foreground" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Hero Image */}
                        <div className="rounded-2xl overflow-hidden aspect-video shadow-sm bg-muted relative group">
                            <img
                                src={vendor.image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"}
                                alt={vendor.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* About */}
                        <section>
                            <h2 className="font-serif text-2xl mb-4">About {vendor.name}</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{vendor.description || "No description provided."}</p>
                        </section>

                        {/* Google Verification Section */}
                        {trustScore.tier !== 'unverified' && (
                            <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 border border-amber-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                                        <ShieldCheck className="w-6 h-6 text-amber-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl">Google Verified Business</h3>
                                        <p className="text-sm text-muted-foreground">Trust score based on Google Business data</p>
                                    </div>
                                </div>

                                {/* Trust Score Display */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">Overall Trust Score</span>
                                            <span className="text-2xl font-bold text-amber-600">{trustScore.score}/100</span>
                                        </div>
                                        <Progress value={trustScore.score} className="h-2" />
                                    </div>
                                    <div className="bg-white rounded-xl p-4 shadow-sm">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Rating Score</span>
                                                <span className="font-medium">{trustScore.breakdown.ratingScore}/40</span>
                                            </div>
                                            <Progress value={(trustScore.breakdown.ratingScore / 40) * 100} className="h-1.5" />
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Review Volume</span>
                                                <span className="font-medium">{trustScore.breakdown.reviewCountScore}/40</span>
                                            </div>
                                            <Progress value={(trustScore.breakdown.reviewCountScore / 40) * 100} className="h-1.5" />
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Business Status</span>
                                                <span className="font-medium">{trustScore.breakdown.statusScore}/20</span>
                                            </div>
                                            <Progress value={(trustScore.breakdown.statusScore / 20) * 100} className="h-1.5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Why We Trust Section */}
                                <div className="bg-white rounded-xl p-4 shadow-sm">
                                    <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        Why We Trust This Vendor
                                    </h4>
                                    <ul className="text-sm text-muted-foreground space-y-2">
                                        {vendor.google_rating >= 4.5 && (
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                Excellent rating ({vendor.google_rating} stars)
                                            </li>
                                        )}
                                        {vendor.google_reviews >= 50 && (
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                Strong review volume ({vendor.google_reviews}+ reviews)
                                            </li>
                                        )}
                                        <li className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            Verified active business on Google
                                        </li>
                                        {vendor.exclusive && (
                                            <li className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-green-500" />
                                                Vetted exclusive partner
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {vendor.google_business_url && (
                                    <div className="mt-4">
                                        <a
                                            href={vendor.google_business_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-amber-700 hover:text-amber-800 hover:underline"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View on Google Business
                                        </a>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Details Grid */}
                        <section className="bg-slate-50 rounded-2xl p-6 md:p-8">
                            <h3 className="font-serif text-xl mb-6">Service Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <Globe className="w-4 h-4 text-rose-gold" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Website</p>
                                            {vendor.website ? (
                                                <a href={vendor.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline break-all">{vendor.website}</a>
                                            ) : <span className="text-sm text-muted-foreground">Not available</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <MapPin className="w-4 h-4 text-rose-gold" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Service Areas (Zipcodes)</p>
                                            <p className="text-sm text-muted-foreground">
                                                {vendor.service_zipcodes && vendor.service_zipcodes.length > 0
                                                    ? vendor.service_zipcodes.join(', ')
                                                    : "Contact for service area details"
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                            <Check className="w-4 h-4 text-rose-gold" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Vetted Vendor</p>
                                            <p className="text-sm text-muted-foreground">Verified by 2PlanAWedding</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Contact Form Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-rose-100/50 p-6 md:p-8">
                                <div className="text-center mb-6">
                                    <h3 className="font-serif text-xl mb-2">Request a Quote</h3>
                                    <p className="text-sm text-muted-foreground">Get in touch with {vendor.name} securely.</p>
                                </div>

                                <form className="space-y-4" onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!vendor) return;

                                    setSubmitting(true);
                                    try {
                                        const contactName = `${formData.fname} ${formData.lname}`.trim();

                                        // Save inquiry to database
                                        const { error: dbError } = await supabase
                                            .from('inquiries')
                                            .insert({
                                                vendor_id: vendor.id,
                                                contact_name: contactName,
                                                contact_email: formData.email,
                                                event_date: formData.date || null,
                                                message: formData.message || `Interested in learning more about ${vendor.name}'s services.`,
                                                user_id: user?.id || null,
                                            });

                                        if (dbError) throw dbError;

                                        // Send email notifications (non-blocking)
                                        sendInquiryEmails({
                                            vendorName: vendor.name,
                                            vendorEmail: vendor.website ? `contact@${new URL(vendor.website).hostname}` : 'notifications@2planawedding.com',
                                            contactName,
                                            contactEmail: formData.email,
                                            eventDate: formData.date,
                                            message: formData.message,
                                        }).catch(console.error);

                                        toast.success("Inquiry sent! You'll hear back within 24-48 hours.");
                                        setFormData({ fname: '', lname: '', email: '', date: '', message: '' });
                                    } catch (error) {
                                        console.error('Inquiry error:', error);
                                        toast.error("Failed to send inquiry. Please try again.");
                                    } finally {
                                        setSubmitting(false);
                                    }
                                }}>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <Label htmlFor="fname">First Name</Label>
                                            <Input
                                                id="fname"
                                                placeholder="Jane"
                                                required
                                                value={formData.fname}
                                                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="lname">Last Name</Label>
                                            <Input
                                                id="lname"
                                                placeholder="Doe"
                                                required
                                                value={formData.lname}
                                                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="jane@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="date">Wedding Date</Label>
                                        <Input
                                            id="date"
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea
                                            id="message"
                                            placeholder={`Hi ${vendor.name}, we love your work...`}
                                            className="min-h-[100px]"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-rose-gold hover:bg-rose-600 text-white font-medium py-6"
                                        disabled={submitting}
                                    >
                                        {submitting ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</>
                                        ) : (
                                            'Send Inquiry'
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-muted-foreground mt-4">
                                        You'll receive a response within 24-48 hours. By clicking send, you agree to our Terms.
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorDetail;

