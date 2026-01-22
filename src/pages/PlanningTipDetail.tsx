import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const PlanningTipDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [tip, setTip] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const handleShare = async () => {
        if (!tip) return;
        const shareData = {
            title: tip.title,
            text: tip.excerpt,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast({
                    title: "Link copied!",
                    description: "The article link has been copied to your clipboard.",
                });
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    useEffect(() => {
        const fetchTip = async () => {
            if (!id) return;
            try {
                const { data, error } = await supabase
                    .from('planning_tips')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setTip(data);
            } catch (error) {
                console.error("Error fetching tip:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTip();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!tip) {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-serif mb-4">Tip not found</h1>
                <Link to="/tips"><Button>Return to Tips</Button></Link>
            </div>
        );
    }

    const formattedDate = new Date(tip.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="pb-20">
            {/* Hero / Header Section */}
            <div className="container mx-auto px-4 max-w-4xl pt-8">
                <Link to="/tips" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Tips
                </Link>

                <div className="space-y-6 text-center mb-12">
                    <Badge variant="secondary" className="mb-4">{tip.category}</Badge>
                    <h1 className="font-serif text-3xl md:text-5xl text-foreground leading-tight">
                        {tip.title}
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-muted-foreground text-sm">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{tip.author || "Wedding Flow Team"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{tip.read_time || "5 min read"}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Image */}
            <div className="container mx-auto px-4 max-w-5xl mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative aspect-video rounded-2xl overflow-hidden shadow-lg"
                >
                    <img
                        src={tip.image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1200"}
                        alt={tip.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            </div>

            {/* Content */}
            <article className="container mx-auto px-4 max-w-3xl">
                <div className="prose prose-lg prose-stone mx-auto">
                    <p className="lead text-xl text-muted-foreground mb-8 text-center italic font-serif">
                        {tip.excerpt}
                    </p>
                    <div className="whitespace-pre-wrap leading-relaxed text-foreground/90">
                        {tip.content}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Tags: {tip.tags ? tip.tags.join(', ') : 'Wedding, Planning'}
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
                        <Share2 className="w-4 h-4" /> Share Article
                    </Button>
                </div>
            </article>
        </div>
    );
};

export default PlanningTipDetail;
