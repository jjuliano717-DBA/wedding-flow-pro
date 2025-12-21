import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Filter, Bell, Rocket, ShieldCheck, Star, BarChart3, Clock, RefreshCw } from "lucide-react";

const ListBusiness = () => {
    return (
        <div className="min-h-screen bg-background text-foreground pb-24">
            {/* 1. HERO SECTION */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-slate-50">
                <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight text-slate-900">
                            Leads That Actually <br className="hidden md:block" />
                            <span className="text-primary italic">Turn Into Weddings.</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light mb-10 text-slate-600 max-w-3xl mx-auto">
                            Stop paying for bots, ghost leads, and price-shoppers. 2PlanAWedding verifies every inquiry so you only talk to high-intent couples with a real date and budget.
                        </p>
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Start My Risk-Free Trial
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="mt-4 text-sm text-slate-500">No credit card required • Cancel anytime</p>
                    </motion.div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-100/50 rounded-full blur-3xl z-0" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-100/50 rounded-full blur-3xl z-0" />
            </section>

            {/* 2. VENDOR SUPERPOWERS */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-medium tracking-widest uppercase text-sm">Vendor-Centric Superpowers</span>
                        <h2 className="font-serif text-4xl mt-3 text-slate-900">Built for Your Workflow</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Direct CRM Integration</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Leads don’t sit in a proprietary inbox. We push them directly to HoneyBook, Dubsado, or your email instantly.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Filter className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Niche Filtering</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Don't get "Barn Wedding" leads if you only do "Luxury Hotel" events. Our algorithm filters by your specific style.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Bell className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">"Anti-Ghosting" Protocol</h3>
                            <p className="text-slate-600 leading-relaxed">
                                We send automated reminders to couples who haven't replied to your initial quote, doing the follow-up work for you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PRICING PLANS */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl mb-4">Simple, Transparent Pricing</h2>
                        <p className="text-slate-400">Choose the plan that fits your growth stage. No hidden fees.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Option 1: Growth Plan */}
                        <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col">
                            <h3 className="text-2xl font-bold mb-2">Growth Plan</h3>
                            <div className="text-4xl font-serif font-bold text-white mb-6">$49<span className="text-lg text-slate-400 font-sans font-normal">/mo</span></div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Standard listing in directory
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Verified lead notifications
                                </li>
                                <li className="flex items-center gap-3 text-slate-300">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Direct link to website
                                </li>
                            </ul>

                            <Button variant="outline" className="w-full py-6 border-slate-600 text-slate-200 hover:bg-slate-700 hover:text-white">
                                Choose Growth
                            </Button>
                        </div>

                        {/* Option 2: Dominance Plan */}
                        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-slate-800 border-2 border-primary shadow-2xl flex flex-col transform md:scale-105">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                                Most Popular
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-primary">Dominance Plan</h3>
                            <div className="text-4xl font-serif font-bold text-white mb-6">$99<span className="text-lg text-slate-400 font-sans font-normal">/mo</span></div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-white">
                                    <Rocket className="w-5 h-5 text-primary shrink-0" />
                                    <span className="font-semibold">Priority Placement (Top 5)</span>
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                                    "Verified Professional" Badge
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <Star className="w-5 h-5 text-primary shrink-0" />
                                    Manual Lead Vetting (Lead Guard)
                                </li>
                            </ul>

                            <Button className="w-full py-6 bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-lg">
                                Choose Dominance
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. ARCHITECT PROOF POINT (DASHBOARD) */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-block bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-6">
                            Data Driven
                        </div>
                        <h2 className="font-serif text-4xl mb-6 text-slate-900">Total Visibility Into Your Growth</h2>
                        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                            Stop guessing where your money goes. Our "Architect" dashboard shows you exactly which photos drive clicks, your real-time Inquiry-to-Booking ratio, and total ROI.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-sm text-slate-500 mb-1">Inquiry Rate</div>
                                <div className="text-2xl font-bold text-slate-900">18.5%</div>
                                <div className="text-xs text-emerald-600 flex items-center mt-1">
                                    <TrendingUp className="w-3 h-3 mr-1" /> +2.4% vs last mo
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="text-sm text-slate-500 mb-1">Avg. Budget</div>
                                <div className="text-2xl font-bold text-slate-900">$32k</div>
                                <div className="text-xs text-slate-400 mt-1">
                                    Qualified Leads
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative group perspective-1000">
                        {/* Dashboard Mockup Container */}
                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-2 transform rotate-y-[-5deg] group-hover:rotate-y-0 transition-transform duration-700 ease-out">
                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-100 aspect-[4/3] flex flex-col gap-4">
                                {/* Header Mockup */}
                                <div className="h-8 bg-white rounded w-full shadow-sm" />
                                <div className="flex gap-4">
                                    <div className="h-32 bg-white rounded w-1/3 shadow-sm" />
                                    <div className="h-32 bg-white rounded w-1/3 shadow-sm" />
                                    <div className="h-32 bg-white rounded w-1/3 shadow-sm" />
                                </div>
                                <div className="h-48 bg-white rounded w-full shadow-sm flex items-center justify-center text-slate-300">
                                    <BarChart3 className="w-12 h-12" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. ZERO FRICTION SIGNUP */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl mb-4 text-slate-900">Go Live in 24 Hours</h2>
                        <p className="text-slate-600">The "Zero Friction" onboarding process.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -z-10 -translate-y-1/2" />

                        {[
                            { icon: RefreshCw, title: "Sync", desc: "Import photos & reviews from Google in 1 click." },
                            { icon: ShieldCheck, title: "Verify", desc: "Brief 24-hour account audit by our team." },
                            { icon: Rocket, title: "Launch", desc: "Start receiving filtered leads immediately." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg text-center w-full md:w-1/3">
                                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. STICKY FOOTER CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 md:p-6 shadow-2xl z-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="hidden md:block">
                    <p className="font-serif font-bold text-lg text-slate-900">Join the community that values your time.</p>
                    <p className="text-sm text-slate-500">List your business in under 5 minutes.</p>
                </div>
                <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                    Start My Risk-Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
            </div>

            {/** Extra padding for sticky footer */}
            <div className="h-24" />
        </div>
    );
};

// Helper icon for dashboard content
function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}

export default ListBusiness;
