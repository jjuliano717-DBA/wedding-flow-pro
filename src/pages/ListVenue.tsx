import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, TrendingUp, Users, ShieldCheck, Upload, Settings, Play } from "lucide-react";
import { Link } from "react-router-dom";

const ListVenue = () => {
    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* 1. HERO SECTION */}
            <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Background Video/Image Placeholder */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=2000"
                        alt="Wedding Venue Background"
                        className="w-full h-full object-cover opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Radical Clarity.
                        </h1>
                        <p className="text-xl md:text-3xl font-light mb-8 text-foreground/80">
                            Get your venue in front of <span className="font-semibold text-primary">50k+ ready-to-book couples</span> every month.
                        </p>
                        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                            No bots, no fake leads, and no long-term contracts. Just high-intent inquiries delivered directly to your inbox.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 h-auto rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                                <Link to="/auth?mode=signin">
                                    Start Your 30-Day Free Trial
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. PROBLEM / SOLUTION BLOCK */}
            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
                        <div>
                            <h2 className="font-serif text-4xl mb-8">The Old Way vs. The <br /><span className="text-primary italic">2PlanAWedding</span> Way</h2>
                            <div className="space-y-6">
                                <div className="bg-white/50 p-6 rounded-xl border border-rose-100">
                                    <h3 className="font-semibold text-rose-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                                        Industry Pain Points
                                    </h3>
                                    <ul className="space-y-3 text-muted-foreground">
                                        <li className="flex items-start gap-2">
                                            <span className="text-rose-400 mt-1">✕</span>
                                            Tired of paying for "ghost leads" that never reply?
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rose-400 mt-1">✕</span>
                                            Hidden commission fees eating 20-30% of your margins?
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-rose-400 mt-1">✕</span>
                                            Contracts that lock you in for 12 months?
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="bg-white p-8 rounded-2xl shadow-elegant border border-primary/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <ShieldCheck className="w-32 h-32 text-primary" />
                                </div>
                                <h3 className="font-serif text-2xl mb-6 text-primary">Our Solution</h3>
                                <ul className="space-y-4">
                                    {[
                                        "Verified Lead Filtering: We block spam before it hits your inbox.",
                                        "Zero Commissions: You keep 100% of every booking.",
                                        "Month-to-Month Freedom: Cancel anytime. We earn your business daily.",
                                        "Direct Connections: Leads go straight to your CRM or email."
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <Check className="w-4 h-4 text-primary" />
                                            </div>
                                            <span className="text-foreground/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. SUPERPOWERS GRID */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="text-primary font-medium tracking-widest uppercase text-sm">Why Venues Choose Us</span>
                        <h2 className="font-serif text-4xl mt-3 mb-4">Built for Growth</h2>
                        <p className="text-muted-foreground">We handle the marketing so you can focus on hosting unforgettable events.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: "SEO Dominance",
                                desc: "We rank for 'Tampa Wedding Venues' and 'Luxury Barns' so you don't have to fight the algorithm alone."
                            },
                            {
                                icon: Users,
                                title: "High-Intent Leads",
                                desc: "Mandatory budget and wedding date fields ensure you only talk to serious couples ready to book."
                            },
                            {
                                icon: ArrowRight,
                                title: "Direct Access",
                                desc: "Zero middlemen. No gated conversations. Leads land directly in your preferred system instantly."
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group p-8 rounded-2xl bg-muted/20 hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/10">
                                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-primary" />
                                </div>
                                <h3 className="font-serif text-xl mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    {feature.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. HOW IT WORKS */}
            <section className="py-24 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl mb-4">Get Listed in Minutes</h2>
                        <p className="text-primary-foreground">A simple 4-step process to double your inquiries.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-primary-foreground/30 z-0" />

                        {[
                            { icon: Users, title: "Create Profile", desc: "5-minute setup wizard." },
                            { icon: Upload, title: "Upload Media", desc: "Showcase your best 4k shots." },
                            { icon: Settings, title: "Set Preferences", desc: "Define your ideal couple." },
                            { icon: Check, title: "Go Live", desc: "Start receiving inquiries." }
                        ].map((step, i) => (
                            <div key={i} className="relative z-10 flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-primary-foreground text-primary flex items-center justify-center font-bold text-xl mb-6 shadow-lg">
                                    {i + 1}
                                </div>
                                <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                                <p className="text-primary-foreground">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. SOCIAL PROOF & DATA */}
            <section className="py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="font-serif text-4xl mb-8">Numbers Don't Lie</h2>
                            <div className="grid grid-cols-2 gap-8 mb-10">
                                <div>
                                    <div className="text-5xl font-bold text-primary mb-2">12x</div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-widest">Average ROI</div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-primary mb-2">14+</div>
                                    <div className="text-sm text-muted-foreground uppercase tracking-widest">Leads Per Month</div>
                                </div>
                            </div>
                            <div className="p-8 bg-muted/30 rounded-2xl italic text-lg leading-relaxed border-l-4 border-primary">
                                "Since listing with 2PlanAWedding, our weekend tours have fully booked out. The quality of leads is night and day compared to other platforms."
                                <div className="mt-4 not-italic font-semibold text-base not-italic text-foreground">
                                    — Sarah J., Owner of The Crystal Barn
                                </div>
                            </div>
                        </div>
                        <div className="bg-muted rounded-2xl p-8 flex items-center justify-center min-h-[400px]">
                            {/* Placeholder for Dashboard Preview Image */}
                            <div className="text-center">
                                <div className="w-full aspect-video bg-background shadow-2xl rounded-lg flex items-center justify-center mb-4">
                                    <span className="text-muted-foreground">Dashboard Preview UI</span>
                                </div>
                                <p className="text-sm text-muted-foreground">Venue Analytics Dashboard</p>
                            </div>
                        </div>
                    </div>

                    {/* Logos Bar */}
                    <div className="mt-20 pt-10 border-t border-border/40 text-center">
                        <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest">Trusted by Top Venues in Florida</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            <span className="text-xl font-serif font-bold">The Orlo</span>
                            <span className="text-xl font-serif font-bold">Armature Works</span>
                            <span className="text-xl font-serif font-bold">Hotel Haya</span>
                            <span className="text-xl font-serif font-bold">Rialto Theatre</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 bg-muted/50 text-center">
                <div className="container mx-auto px-4 max-w-3xl">
                    <h2 className="font-serif text-4xl mb-6">Ready to Fill Your Calendar?</h2>
                    <p className="text-xl text-muted-foreground mb-10">
                        Join 500+ venues growing their business with 2PlanAWedding today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 h-auto rounded-full shadow-lg">
                            List My Venue Now
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground">
                        No credit card required for trial. Cancel anytime.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default ListVenue;
