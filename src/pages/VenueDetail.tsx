import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Users, DollarSign, Star, Check, Mail, Globe, Phone, ExternalLink, ChevronRight, Heart, Share2, X, ChevronLeft } from "lucide-react"; // Icons
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
// Footer removed as it's provided by LayoutShell
import { Separator } from "@/components/ui/separator";

const VenueDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: venue.name,
                    text: `Check out ${venue.name} on Wedding Flow!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            // Could add toast here
            alert("Link copied to clipboard!");
        }
    };

    const nextImage = () => {
        setActiveImage((prev) => (prev + 1) % Math.min(images.length, 5));
    };

    const prevImage = () => {
        setActiveImage((prev) => (prev - 1 + Math.min(images.length, 5)) % Math.min(images.length, 5));
    };

    // Fetch Venue Data
    useEffect(() => {
        const fetchVenue = async () => {
            if (!id) return;
            try {
                // First try to fetch by ID (for real database records)
                let { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('id', id)
                    .eq('category', 'venue')
                    .single();

                // If not found and ID looks like mock data (starts with 'v'), try to find by name from mock data
                if (error && id.startsWith('v')) {
                    // Mock venue names mapping
                    const mockVenueNames: Record<string, string> = {
                        'v1': 'Vineyard Vista',
                        'v2': 'The Crystal Palace',
                        'v3': 'The Florida Aquarium',
                        'v4': 'Hotel Haya',
                        'v5': 'Rialto Theatre',
                        'v6': 'Oxford Exchange',
                        'v7': 'Armature Works',
                        'v8': 'The Orlo House & Ballroom',
                        'v9': 'Le Méridien Tampa, The Courthouse',
                        'v10': 'Tampa Museum of Art',
                        'v11': 'Yacht StarShip Cruises & Events',
                        'v12': 'Tampa Garden Club',
                        'v13': 'Flora Groves Farm'
                    };

                    const venueName = mockVenueNames[id];
                    if (venueName) {
                        const nameResult = await supabase
                            .from('vendors')
                            .select('*')
                            .eq('category', 'venue')
                            .ilike('name', venueName)
                            .single();

                        if (!nameResult.error) {
                            data = nameResult.data;
                            error = null;
                        }
                    }
                }

                if (error) throw error;
                setVenue(data);
            } catch (error) {
                console.error("Error fetching venue:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVenue();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="min-h-screen bg-background text-center pt-32">
                <h1 className="text-2xl font-serif mb-4">Venue not found</h1>
                <Link to="/venues"><Button>Return to Venues</Button></Link>
            </div>
        );
    }

    // Build images array from venue data
    const buildImagesArray = () => {
        const imagesList = [];

        // Add main image first
        if (venue.image_url) {
            imagesList.push(venue.image_url);
        }

        // Add all portfolio images
        if (venue.images && Array.isArray(venue.images)) {
            imagesList.push(...venue.images);
        }

        // Fallback to placeholder if no images
        return imagesList.length > 0 ? imagesList : ["https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200"];
    };

    const images = buildImagesArray();
    const amenities = venue.amenities && venue.amenities.length > 0
        ? venue.amenities
        : ["Parking", "Restrooms", "Wheelchair Access", "WiFi", "Event Cleanup"];
    const faqs = venue.faqs && venue.faqs.length > 0
        ? venue.faqs
        : [
            { question: "What is included in the rental fee?", answer: "Tables, chairs, and basic linens are typically included." },
            { question: "Is there a preferred vendor list?", answer: "Yes, we work with a curated list of top-tier professionals." },
            { question: "Can we bring our own alcohol?", answer: "Alcohol policies vary by package. Please inquire for details." }
        ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Header removed as it's provided by LayoutShell */}

            <main className="pt-24 pb-20">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Link to="/venues" className="hover:text-primary transition-colors">Venues</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-foreground font-medium">{venue.business_name}</span>
                    </div>
                </div>

                {/* Claim Banner for Unclaimed Venues */}
                {venue.is_claimed === false && (
                    <div className="container mx-auto px-4 mb-6">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-2 border-primary/20 rounded-xl p-6 shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                        <Check className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl text-foreground mb-1">Own this business?</h3>
                                        <p className="text-muted-foreground text-sm">
                                            Claim your free listing to update information, respond to reviews, and connect with couples.
                                        </p>
                                    </div>
                                </div>
                                <Link to={`/business/claim?venue_id=${venue.id}`}>
                                    <Button size="lg" className="whitespace-nowrap bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all">
                                        <Check className="w-5 h-5 mr-2" />
                                        Claim This Venue
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Hero Gallery - Full Width Slider */}
                <div className="container mx-auto px-4 mb-12">
                    <div className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] rounded-2xl overflow-hidden bg-slate-100">
                        {/* Main Image */}
                        <div className="relative w-full h-full bg-slate-900">
                            <img
                                src={images[activeImage]}
                                alt={`${venue.name} - Image ${activeImage + 1}`}
                                className="w-full h-full object-contain"
                            />

                            {/* Navigation Arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-8 h-8 text-slate-700" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all z-10"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-8 h-8 text-slate-700" />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-sm font-medium z-10">
                                {activeImage + 1} / {images.length}
                            </div>

                            {/* Heart & Share Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2 z-10">
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className={`rounded-full bg-white/90 hover:bg-white transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-400'}`}
                                    onClick={() => setIsLiked(!isLiked)}
                                >
                                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    className="rounded-full bg-white/90 hover:bg-white text-gray-700"
                                    onClick={handleShare}
                                >
                                    <Share2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Thumbnail Strip - Only show if multiple images */}
                        {images.length > 1 && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 z-10">
                                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImage
                                                ? 'border-white scale-105'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Header Info & About (Full Width for Alignment) */}
                <div className="container mx-auto px-4 mb-12">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                        <div>
                            <h1 className="font-serif text-4xl text-foreground mb-2">{venue.name}</h1>
                            <div className="flex items-center text-muted-foreground">
                                <MapPin className="w-4 h-4 mr-1" />
                                {venue.location}
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1 mb-1 bg-primary/10 px-3 py-1 rounded-full text-primary font-medium">
                                <Star className="w-4 h-4 fill-primary" />
                                <span>{venue.heart_rating || 5.0}</span>
                                <span className="text-muted-foreground text-sm font-normal">({venue.google_reviews || 0} reviews)</span>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {venue.venue_type || venue.category || 'Venue'}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 py-6 border-y border-border/50 mb-8">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="font-medium">{venue.guest_capacity ? `Up to ${venue.guest_capacity}` : 'N/A'} Guests</span>
                        </div>
                        <div className="w-px h-6 bg-border/50"></div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <span className="font-medium">{venue.price_range || "$$"} Price Range</span>
                        </div>
                        {venue.venue_type && (
                            <>
                                <div className="w-px h-6 bg-border/50"></div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{venue.venue_type}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <section>
                        <h2 className="font-serif text-2xl mb-4">About the Venue</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed whitespace-pre-line">
                            {venue.description || "Experience the wedding of your dreams at this stunning venue. With its breathtaking views and elegant architecture, it provides the perfect backdrop for your special day. Our dedicated team is committed to making every detail perfect, ensuring an unforgettable experience for you and your guests."}
                        </p>
                    </section>
                </div>


                {/* Main Content Layout */}
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Left Column: Amenities, FAQ, Map */}
                        <div className="lg:col-span-2 space-y-12">

                            {/* Amenities */}
                            <section>
                                <h2 className="font-serif text-2xl mb-6">Amenities & Features</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                                    {amenities.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 text-muted-foreground">
                                            <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0" />
                                            <span>{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* FAQ Accordion */}
                            <section>
                                <h2 className="font-serif text-2xl mb-6">Frequently Asked Questions</h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {faqs.map((faq: any, i: number) => (
                                        <AccordionItem key={i} value={`item-${i}`}>
                                            <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                                            <AccordionContent className="text-muted-foreground">
                                                {faq.answer}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>

                            {/* Embedded Google Maps */}
                            <section className="rounded-2xl overflow-hidden h-[300px] relative">
                                <iframe
                                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(venue.street_address || venue.location)}`}
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                            </section>

                        </div>

                        {/* Right Column: Sticky Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 space-y-6 z-10">

                                {/* Contact Card */}
                                <div className="bg-card border border-border shadow-elegant rounded-2xl p-6 md:p-8">
                                    <div className="text-center mb-6">
                                        <h3 className="font-serif text-2xl mb-2">Request a Quote</h3>
                                        <p className="text-muted-foreground text-sm">Contact this venue directly for pricing and availability.</p>
                                    </div>

                                    <form className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium uppercase text-muted-foreground">First Name</label>
                                                <Input placeholder="Jane" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-medium uppercase text-muted-foreground">Last Name</label>
                                                <Input placeholder="Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase text-muted-foreground">Email</label>
                                            <Input type="email" placeholder="jane@example.com" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase text-muted-foreground">Phone</label>
                                            <Input type="tel" placeholder="(555) 555-5555" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase text-muted-foreground">Wedding Date</label>
                                            <Input type="date" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-medium uppercase text-muted-foreground">Message</label>
                                            <Textarea placeholder="I'm interested in learning more about your venue..." className="min-h-[100px] resize-none" />
                                        </div>

                                        <Button size="lg" className="w-full bg-primary text-white hover:bg-primary/90 mt-2">
                                            Request Pricing
                                        </Button>
                                    </form>

                                    <div className="mt-6 pt-6 border-t border-border space-y-3">
                                        {venue.website && (
                                            <a href={venue.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/50">
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary"><Globe className="w-4 h-4" /></div>
                                                <span className="font-medium">Visit Website</span>
                                            </a>
                                        )}
                                        {venue.contact_email && (
                                            <a href={`mailto:${venue.contact_email}`} className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted/50">
                                                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary"><Mail className="w-4 h-4" /></div>
                                                <span className="font-medium">Email Venue</span>
                                            </a>
                                        )}
                                        <div className="flex items-center gap-3 text-sm text-foreground p-2">
                                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-primary"><Phone className="w-4 h-4" /></div>
                                            <span className="font-medium">{venue.contact_phone || "(555) 123-4567"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 rounded-xl p-6 text-center border border-primary/10">
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-2">Venue Matcher</p>
                                    <h4 className="font-serif text-lg mb-4">Not sure if this is the one?</h4>
                                    <Link to="/style-matcher">
                                        <Button variant="outline" className="w-full bg-background">Take the Style Quiz</Button>
                                    </Link>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </main>




            {/* Photo Gallery Dialog */}
            <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none text-white">
                    <div className="relative w-full h-[80vh] flex items-center justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>

                        <div className="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black/80">
                            <img
                                src={images.slice(0, 5)[activeImage]}
                                alt={`${venue?.name} gallery ${activeImage + 1}`}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full h-12 w-12"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>

                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                            {images.slice(0, 5).map((_: string, idx: number) => (
                                <button
                                    key={idx}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === activeImage ? 'bg-white w-4' : 'bg-white/50'}`}
                                    onClick={() => setActiveImage(idx)}
                                />
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default VenueDetail;
