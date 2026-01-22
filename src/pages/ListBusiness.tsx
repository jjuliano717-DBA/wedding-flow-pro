import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Filter, Bell, Rocket, ShieldCheck, Star, BarChart3, Users, Briefcase, BookOpen, RefreshCw, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ListBusiness = () => {
    const navigate = useNavigate();
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
                        <p className="text-xl md:text-2xl font-light mb-10 text-slate-700 max-w-3xl mx-auto leading-relaxed">
                            Stop paying for bots, ghost leads, and price-shoppers. 2PlanAWedding verifies every inquiry so you only talk to high-intent couples with a real date and budget.
                        </p>
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" onClick={() => navigate('/auth?type=vendor')}>
                            Start My Risk-Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="mt-4 text-sm text-slate-500">No credit card required • Cancel anytime</p>
                    </motion.div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-rose-100/50 rounded-full blur-3xl z-0" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-teal-100/50 rounded-full blur-3xl z-0" />
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-bold tracking-widest uppercase text-sm">Vendor-Centric Superpowers</span>
                        <h2 className="font-serif text-4xl mt-3 text-slate-900">Built for Your Workflow</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Direct CRM Integration</h3>
                            <p className="text-slate-700 font-medium leading-relaxed">
                                Leads don’t sit in a proprietary inbox. We push them directly to HoneyBook, Dubsado, or your email instantly.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Filter className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Niche Filtering</h3>
                            <p className="text-slate-700 font-medium leading-relaxed">
                                Don't get "Barn Wedding" leads if you only do "Luxury Hotel" events. Our algorithm filters by your specific style.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Bell className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">"Anti-Ghosting" Protocol</h3>
                            <p className="text-slate-700 font-medium leading-relaxed">
                                We send automated reminders to couples who haven't replied to your initial quote, doing the follow-up work for you.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.5 B2B GROWTH ENGINE (NEW FEATURE) */}
            <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">New Feature</span>
                            <h2 className="font-serif text-4xl md:text-5xl mb-6 text-white">Unlock the Power of <br />Vendor Networks</h2>
                            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                                Growth isn't just about ads. It's about who you know. Our new <strong className="text-white">B2B Growth Engine</strong> lets you connect with planners and venues to automate your referrals.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Star className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 text-white">Commission Automation</h3>
                                        <p className="text-slate-400">Set referral terms (e.g., 10%) and get paid automatically when your partners book you.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Star className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 text-white">Planner's Black Book</h3>
                                        <p className="text-slate-400">Get listed in private "Preferred Vendor" lists used by top wedding planners.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                                        <Star className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-1 text-white">Smart Matching</h3>
                                        <p className="text-slate-400">We suggest partners based on style, price point, and location so you build the right team.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-bold">EP</div>
                                        <div>
                                            <div className="font-bold">Elite Planning Co.</div>
                                            <div className="text-xs text-white">Referred you to a Client</div>
                                        </div>
                                    </div>
                                    <div className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded font-medium">New Lead</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-sm text-slate-400 mb-1">Client</div>
                                        <div className="font-bold">The Smith Wedding</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                            <div className="text-sm text-slate-400 mb-1">Budget</div>
                                            <div className="font-bold">$85,000</div>
                                        </div>
                                        <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                                            <div className="text-sm text-slate-400 mb-1">Date</div>
                                            <div className="font-bold">Oct 12, 2026</div>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white">Accept Referral</Button>
                                    </div>
                                </div>
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white text-slate-900 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce">
                                <div className="bg-emerald-100 p-2 rounded-full">
                                    <Users className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm">Network Effect</div>
                                    <div className="text-xs text-slate-500">+35% more bookings</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PRICING PLANS */}
            <section className="py-24 bg-slate-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl mb-4 text-white">Simple, Transparent Pricing start May 1, 2026</h2>
                        <p className="text-white">Choose the plan that fits your growth stage. No hidden fees.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Option 1: Growth Plan */}
                        <div className="p-8 rounded-2xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors flex flex-col">
                            <h3 className="text-2xl font-bold mb-2 text-white">Growth Plan</h3>
                            <div className="text-4xl font-serif font-bold text-white mb-6">$49<span className="text-lg text-white font-sans font-normal">/mo</span></div>

                            <ul className="space-y-4 mb-8 flex-grow">
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Standard listing in directory
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Verified lead notifications
                                </li>
                                <li className="flex items-center gap-3 text-white">
                                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                                    Direct link to website
                                </li>
                            </ul>

                            <Button variant="outline" className="w-full py-6 border-slate-600 text-white hover:bg-slate-700 hover:text-white">
                                Choose Growth
                            </Button>
                        </div>

                        {/* Option 2: Dominance Plan */}
                        <div className="relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-slate-800 border-2 border-primary shadow-2xl flex flex-col transform md:scale-105">
                            <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg uppercase tracking-wider">
                                Most Popular
                            </div>
                            <h3 className="text-2xl font-bold mb-2 text-white">Dominance Plan</h3>
                            <div className="text-4xl font-serif font-bold text-white mb-6">$99<span className="text-lg text-white font-sans font-normal">/mo</span></div>

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
                        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 transform rotate-y-[-5deg] group-hover:rotate-y-0 transition-transform duration-700 ease-out flex flex-col gap-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div>
                                    <div className="text-sm text-slate-500 font-medium">Performance</div>
                                    <div className="font-bold text-slate-800">Last 30 Days</div>
                                </div>
                                <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold">+24% Growth</div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Users className="w-4 h-4" />
                                        <span className="text-xs">Profile Views</span>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">1,248</div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <MessageSquare className="w-4 h-4" />
                                        <span className="text-xs">Inquiries</span>
                                    </div>
                                    <div className="text-2xl font-bold text-slate-900">12</div>
                                </div>
                            </div>

                            {/* Graph Visualization */}
                            <div className="h-32 flex items-end justify-between gap-2 px-2 border-b border-slate-100 pb-2">
                                {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
                                    <div key={i} className="w-full bg-slate-100 rounded-t-sm relative h-full group cursor-pointer hover:bg-slate-200 transition-colors overflow-hidden">
                                        <div
                                            className="absolute bottom-0 left-0 w-full bg-primary rounded-t-sm transition-all duration-1000 ease-out group-hover:bg-primary/90"
                                            style={{ height: `${h}%` }}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between text-xs text-slate-400 px-2">
                                <span>Mon</span>
                                <span>Tue</span>
                                <span>Wed</span>
                                <span>Thu</span>
                                <span>Fri</span>
                                <span>Sat</span>
                                <span>Sun</span>
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
                <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" onClick={() => navigate('/auth?type=vendor')}>
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
