import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Share2, Network, GitMerge, UserPlus, Users, BarChart3, ArrowRight, CheckCircle2, Shield, HeartHandshake, Link as LinkIcon } from "lucide-react";

const Partner = () => {
    return (
        <div className="min-h-screen bg-background text-foreground pb-24">
            {/* 1. HERO SECTION */}
            <section className="relative py-24 md:py-32 overflow-hidden bg-slate-900 text-white">
                <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                            Stop Chasing Leads. <br className="hidden md:block" />
                            <span className="text-primary italic">Start Sharing Them.</span>
                        </h1>
                        <p className="text-xl md:text-2xl font-light mb-10 text-slate-300 max-w-3xl mx-auto">
                            Join the first wedding ecosystem built on <span className="font-semibold text-white">Preferred Partner Networks</span>. Turn your "Dates Booked" into a passive referral revenue stream.
                        </p>
                        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
                            Build My Partner Network
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </motion.div>
                </div>

                {/* Background Decor */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl z-0" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-500/20 rounded-full blur-3xl z-0" />
            </section>

            {/* 2. MATCHMAKING ENGINE (B2B VALUE) */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <span className="text-primary font-medium tracking-widest uppercase text-sm">The Network Effect</span>
                        <h2 className="font-serif text-4xl mt-3 text-slate-900">The Matchmaking Engine</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Share2 className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Automated Preferred Lists</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Digital "Recommended Vendor" lists for venues that couples actually click. No more outdated PDFs.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <GitMerge className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Cross-Pollination Logic</h3>
                            <p className="text-slate-600 leading-relaxed">
                                When a couple books a venue, your "Partner Circle" is automatically recommended to them based on style matching.
                            </p>
                        </div>

                        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <HeartHandshake className="w-7 h-7" />
                            </div>
                            <h3 className="font-serif text-xl font-bold mb-3 text-slate-900">Smart Referral Tracking</h3>
                            <p className="text-slate-600 leading-relaxed">
                                A transparent ledger that tracks who referred whom, enabling seamless referral fees or "credit-back" incentives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. PARTNER TRACKS */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="font-serif text-4xl mb-4 text-slate-900">Choose Your Path</h2>
                        <p className="text-slate-600">Two scalable tracks designed for different business models.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Track A: Venue Anchor */}
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                Track A
                            </div>
                            <h3 className="font-serif text-3xl font-bold mb-2 text-slate-900">The Venue Anchor</h3>
                            <p className="text-primary font-medium mb-8">Network Hub</p>

                            <ul className="space-y-6 mb-8">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <Shield className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">The Deal</h4>
                                        <p className="text-slate-600 text-sm">Venues get a free "Master Account" to manage their preferred vendor lists digitally.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <BarChart3 className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">The Scale</h4>
                                        <p className="text-slate-600 text-sm">Earn Premium Feature Unlocks for every vendor you "invite" to the platform.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 italic">
                                "You use venues to 'onboard' their existing vendor ecosystem for you."
                            </div>
                        </div>

                        {/* Track B: Vendor Alliance */}
                        <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-slate-100 text-slate-600 text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                Track B
                            </div>
                            <h3 className="font-serif text-3xl font-bold mb-2 text-slate-900">The Vendor Alliance</h3>
                            <p className="text-primary font-medium mb-8">Lead Multiplier</p>

                            <ul className="space-y-6 mb-8">
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <Users className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">The Deal</h4>
                                        <p className="text-slate-600 text-sm">Professional vendors (Photo, Floral, DJ) join "Pods" with complementary businesses.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                                        <Share2 className="w-5 h-5 text-slate-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">The Scale</h4>
                                        <p className="text-slate-600 text-sm">Access to shared lead buckets. "Booked for Photo? Here's who needs a DJ."</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-500 italic">
                                "If a photographer is booked, the system alerts the 'Pod' that the date is taken."
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. SYSTEMATIZED REFERRALS */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <div className="inline-block bg-indigo-100 text-indigo-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-6">
                                    The Architect Brain
                                </div>
                                <h2 className="font-serif text-4xl mb-6 text-slate-900">Systematized Referrals</h2>
                                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                    Eliminate the friction of manual networking. We track the data so you can focus on the relationships.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { title: "One-Click 'Add to Preferred'", desc: "Curate your circle in seconds. No data entry." },
                                        { title: "Referral Analytics", desc: "See exactly who is sending you business and your top converters." },
                                        { title: "Reciprocity Scoring", desc: "A 'Partner Score' encouraging active participation in the network." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-1">
                                                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-slate-600 text-sm">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 relative">
                                <div className="bg-slate-900 rounded-2xl p-8 shadow-2xl text-white transform rotate-3 hover:rotate-0 transition-all duration-500">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-bold">Referral Ledger</h3>
                                        <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Live</span>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { vendor: "The Crystal Barn", action: "sent you a lead", time: "2m ago" },
                                            { vendor: "Luxe Florals", action: "viewed your profile", time: "15m ago" },
                                            { vendor: "DJ Mike", action: "accepted invite", time: "1h ago" }
                                        ].map((notif, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded bg-white/5 border border-white/10">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                <div className="text-sm">
                                                    <span className="font-bold">{notif.vendor}</span> {notif.action}
                                                </div>
                                                <div className="ml-auto text-xs text-slate-400">{notif.time}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. GROWTH LOOP ONBOARDING */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4 max-w-4xl cursor-default">
                    <div className="text-center mb-16">
                        <h2 className="font-serif text-4xl mb-4 text-slate-900">The "Growth Loop"</h2>
                        <p className="text-slate-600">Scale your network in 3 simple steps.</p>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />

                        {[
                            { icon: CheckCircle2, title: "Claim Profile", desc: "Sync your portfolio instantly." },
                            { icon: UserPlus, title: "Invite Circle", desc: "Import top 5 partners." },
                            { icon: Network, title: "Activate", desc: "Start cross-pollinating leads." }
                        ].map((step, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg text-center w-full md:w-1/3 hover:bg-primary/5 transition-colors">
                                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-6 text-xl font-bold shadow-md">
                                    {i + 1}
                                </div>
                                <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                                <p className="text-sm text-slate-500">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. STICKY FOOTER CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 p-4 md:p-6 shadow-2xl z-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="hidden md:block">
                    <p className="font-serif font-bold text-lg text-white">Built for professionals tired of paying for leads.</p>
                    <p className="text-sm text-slate-400">Ready to start winning as a network?</p>
                </div>
                <Button size="lg" className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg">
                    Build My Partner Network <LinkIcon className="ml-2 w-4 h-4" />
                </Button>
            </div>

            {/** Extra padding for sticky footer */}
            <div className="h-24" />
        </div>
    );
};

export default Partner;
