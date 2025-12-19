
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

// Dummy Blog Data
const BLOG_POSTS = [
    {
        id: 1,
        title: "10 Hidden Gem Barn Venues in Central Florida",
        excerpt: "Looking for rustic charm without the typical price tag? We uncovered 10 stunning barns just outside Orlando.",
        category: "Venues",
        author: "Sarah Jenkins",
        date: "Dec 15, 2025",
        image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
        readTime: "5 min read"
    },
    {
        id: 2,
        title: "The Ultimate Miami Floral Budget Guide",
        excerpt: "Don't let floral costs surprise you. Here is a realistic breakdown of what to expect for weddings in Miami-Dade.",
        category: "Budget Tips",
        author: "Jessica Williams",
        date: "Dec 10, 2025",
        image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800",
        readTime: "8 min read"
    },
    {
        id: 3,
        title: "Why You Need a 'Vibe Check' Before Booking",
        excerpt: "Stress levels rising? Learn how checking your 'vibe' can save you from booking the wrong vendors.",
        category: "Planning Hacks",
        author: "Editorial Team",
        date: "Dec 05, 2025",
        image: "https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80&w=800",
        readTime: "3 min read"
    },
    {
        id: 4,
        title: "2026 Wedding Dress Trends: Coastal Chic",
        excerpt: "From breezy silhouettes to pearl accents, see what's trending for Florida beach weddings next season.",
        category: "Style",
        author: "Emily Chen",
        date: "Nov 28, 2025",
        image: "https://images.unsplash.com/photo-1594539931907-ac305842eead?auto=format&fit=crop&q=80&w=800",
        readTime: "6 min read"
    }
];

export default function Blog() {
    return (
        <div className="container mx-auto px-4 py-16 mt-16 max-w-7xl">
            {/* Header */}
            <div className="text-center mb-16 space-y-4">
                <Badge variant="secondary" className="mb-2">The Wedding Edit</Badge>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Expert Tips & Inspiration</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Your go-to source for Florida wedding trends, budget hacks, and planning advice.
                </p>
            </div>

            {/* Featured Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {BLOG_POSTS.map((post) => (
                    <Card key={post.id} className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none shadow-md flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-4 left-4 bg-white/90 text-slate-900 hover:bg-white">
                                {post.category}
                            </Badge>
                        </div>
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                            </div>
                            <CardTitle className="text-xl leading-tight group-hover:text-purple-700 transition-colors">
                                {post.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-3 flex-grow">
                            <CardDescription className="text-sm line-clamp-3">
                                {post.excerpt}
                            </CardDescription>
                        </CardContent>
                        <CardFooter className="pt-0 border-t bg-slate-50/50 p-4 mt-auto">
                            <div className="flex items-center justify-between w-full text-xs font-medium text-muted-foreground">
                                <span>{post.readTime}</span>
                                <Button variant="ghost" size="sm" className="h-8 gap-1 hover:text-purple-700 p-0 hover:bg-transparent">
                                    Read Article <ArrowRight className="w-3 h-3" />
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-20 bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-10"></div>
                <div className="relative z-10 max-w-xl mx-auto space-y-6">
                    <h2 className="text-3xl font-serif font-bold">Don't Miss a Tip</h2>
                    <p className="text-slate-300">Join 5,000+ Florida couples getting weekly budget hacks and venue drops.</p>
                    <div className="flex gap-2 max-w-sm mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-2 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Button className="bg-purple-600 hover:bg-purple-700">Subscribe</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
