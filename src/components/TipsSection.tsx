import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tips = [
  {
    id: 1,
    title: "How to Choose Your Wedding Photographer",
    category: "Photography",
    excerpt: "Tips for finding a photographer whose style matches your vision and personality.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Wedding Budget Breakdown Guide",
    category: "Planning",
    excerpt: "A comprehensive guide to allocating your wedding budget across all categories.",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "Seasonal Flower Guide for Your Wedding",
    category: "Florals",
    excerpt: "Discover which blooms are in season and how to choose arrangements that last.",
    readTime: "4 min read",
  },
];

export const TipsSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-champagne-light mb-6">
              <Lightbulb className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Expert Advice</span>
            </div>
            
            <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
              Wedding Planning Tips
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              From choosing vendors to managing your timeline, our expert guides 
              help you navigate every step of your wedding journey.
            </p>

            <Button variant="champagne" size="lg" className="gap-2">
              Explore All Tips
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Right Content - Tips List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {tips.map((tip, index) => (
              <motion.article
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-card rounded-xl p-6 shadow-card hover:shadow-elegant transition-all duration-300 border border-border/50 hover:border-primary/20">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-3">
                        {tip.category}
                      </span>
                      <h3 className="font-serif text-lg text-foreground font-medium mb-2 group-hover:text-primary transition-colors">
                        {tip.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {tip.excerpt}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                  <p className="text-muted-foreground text-xs mt-4">{tip.readTime}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
