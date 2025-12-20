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
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
                const { data, error } = await supabase
                    .from('venues')
                    .select('*')
                    .eq('id', id)
                    .single();

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

    // Fallbacks
    const images = venue.images && venue.images.length > 0 ? venue.images : [venue.image_url || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200"];
    const amenities = venue.amenities || ["Parking", "Restrooms", "Wheelchair Access", "WiFi", "Event Cleanup"];
    const faqs = venue.faq || [
        { question: "What is included in the rental fee?", answer: "Tables, chairs, and basic linens are typically included." },
        { question: "Is there a preferred vendor list?", answer: "Yes, we work with a curated list of top-tier professionals." },
        { question: "Can we bring our own alcohol?", answer: "Alcohol policies vary by package. Please inquire for details." }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />

            <main className="pt-24 pb-20">
                {/* Breadcrumb */}
                <div className="container mx-auto px-4 mb-6">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <Link to="/venues" className="hover:text-primary transition-colors">Venues</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-foreground font-medium">{venue.name}</span>
                    </div>
                </div>

                {/* Hero Gallery */}
                <div className="container mx-auto px-4 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[500px] relative">
                        {/* Main Large Image */}
                        <div className="md:col-span-2 relative rounded-2xl overflow-hidden cursor-pointer group">
                            <img src={images[activeImage]} alt={venue.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className={`rounded-full bg-white/90 hover:bg-white transition-colors ${isLiked ? 'text-rose-500' : 'text-gray-400'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsLiked(!isLiked);
                                        }}
                                    >
                                        <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        className="rounded-full bg-white/90 hover:bg-white text-gray-700"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShare();
                                        }}
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* Side Images */}
                        <div className="hidden md:flex flex-col gap-4">
                            <div className="flex-1 rounded-2xl overflow-hidden relative cursor-pointer" onClick={() => setActiveImage(1)}>
                                <img src={images[1] || images[0]} alt="Venue detail" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                            </div>
                            <div className="flex-1 rounded-2xl overflow-hidden relative cursor-pointer" onClick={() => setActiveImage(2)}>
                                <img src={images[2] || images[0]} alt="Venue detail" className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                                {images.length > 3 && (
                                    <div
                                        className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors"
                                        onClick={() => setIsGalleryOpen(true)}
                                    >
                                        <span className="text-white font-medium text-lg">See All Photos</span>
                                    </div>
                                )}
                            </div>
                        </div>
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
                            <span className="text-sm text-muted-foreground">{venue.type} Venue</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 py-6 border-y border-border/50 mb-8">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <span className="font-medium">{venue.capacity} Guests</span>
                        </div>
                        <div className="w-px h-6 bg-border/50"></div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            <span className="font-medium">{venue.price} Price Range</span>
                        </div>
                        <div className="w-px h-6 bg-border/50"></div>
                        <div className="flex items-center gap-2">
                            {venue.indoor && venue.outdoor ? <span>Indoor & Outdoor</span> : venue.indoor ? "Indoor" : "Outdoor"}
                        </div>
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

                            {/* Map (Placeholder) */}
                            <section className="rounded-2xl overflow-hidden h-[300px] bg-muted relative flex items-center justify-center border border-border">
                                <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1600" alt="Map View" className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" />
                                <div className="relative bg-background/90 p-6 rounded-xl shadow-lg text-center max-w-sm">
                                    <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
                                    <h3 className="font-medium text-lg mb-1">{venue.address || venue.location}</h3>
                                    <Button variant="link" asChild className="text-primary mt-2">
                                        <a href={`https://maps.google.com/?q=${encodeURIComponent(venue.address || venue.location)}`} target="_blank" rel="noopener noreferrer">
                                            Get Directions <ExternalLink className="w-3 h-3 ml-1" />
                                        </a>
                                    </Button>
                                </div>
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
                                            <span className="font-medium">{venue.phone || "(555) 123-4567"}</span>
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


            <Footer />

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
