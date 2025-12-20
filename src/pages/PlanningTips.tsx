import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, User, Calendar, DollarSign, Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["All", "Planning", "Budget", "Vendors", "Decor", "Fashion", "Etiquette"];

const PlanningTips = () => {
    const [tips, setTips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchTips = async () => {
            try {
                const { data, error } = await supabase
                    .from('planning_tips')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTips(data || []);
            } catch (error) {
                console.error("Error fetching tips:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTips();
    }, []);

    const filteredTips = tips.map(tip => ({
        ...tip,
        image: tip.image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        date: new Date(tip.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: tip.read_time || "5 min read"
    })).filter(tip => {
        const matchesCategory = selectedCategory === "All" || tip.category === selectedCategory;
        const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (tip.excerpt || "").toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-background">

            {/* Hero Section */}
            <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-gradient-to-b from-champagne-light/50 to-background">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <Badge variant="outline" className="mb-4 bg-background/50 backdrop-blur-sm border-primary/20 text-primary">
                            Expert Guides & Advice
                        </Badge>
                        <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-6">
                            Wedding Planning Tips
                        </h1>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                            From choosing vendors to managing your timeline, our expert guides help you navigate every step of your wedding journey with confidence.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-xl mx-auto mb-12">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search for advice (e.g., 'budget', 'timeline')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 h-12 rounded-full bg-background border-border shadow-sm focus:ring-primary/20"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Categories & Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">

                    {/* Categories */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
                        {CATEGORIES.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                onClick={() => setSelectedCategory(category)}
                                className={`rounded-full ${selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'} `}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTips.map((tip, index) => (
                            <motion.article
                                key={tip.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-elegant transition-all duration-300"
                            >
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden">
                                    <img
                                        src={tip.image}
                                        alt={tip.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-medium text-foreground shadow-sm">
                                            {tip.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                        <BookOpen className="w-3 h-3" />
                                        <span>{tip.readTime}</span>
                                        <span>•</span>
                                        <span>{tip.date}</span>
                                    </div>

                                    <h3 className="font-serif text-xl text-foreground font-medium mb-3 group-hover:text-primary transition-colors">
                                        {tip.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                                        {tip.excerpt}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                                                {tip.author.charAt(0)}
                                            </div>
                                            <span className="text-xs text-muted-foreground font-medium">{tip.author}</span>
                                        </div>
                                        <Link to={`/tips/${tip.id}`}>
                                            <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary p-0 hover:bg-transparent hover:underline">
                                                Read Guide <ArrowRight className="w-3 h-3" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>

                    {filteredTips.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-muted-foreground">No tips found matching your search.</p>
                            <Button variant="link" onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}>Reset Filters</Button>
                        </div>
                    )}

                </div>
            </section>

        </div>
    );
};

export default PlanningTips;
