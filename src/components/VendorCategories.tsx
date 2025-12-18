import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Camera, 
  Flower2, 
  Music, 
  UtensilsCrossed, 
  Cake, 
  Sparkles,
  Users,
  Video,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  { name: "Photographers", icon: Camera, count: "1,200+", color: "bg-blush" },
  { name: "Florists", icon: Flower2, count: "850+", color: "bg-sage-light" },
  { name: "Musicians & DJs", icon: Music, count: "620+", color: "bg-champagne-light" },
  { name: "Caterers", icon: UtensilsCrossed, count: "780+", color: "bg-blush" },
  { name: "Cake Designers", icon: Cake, count: "340+", color: "bg-sage-light" },
  { name: "Planners", icon: Sparkles, count: "950+", color: "bg-champagne-light" },
  { name: "Hair & Makeup", icon: Users, count: "530+", color: "bg-blush" },
  { name: "Videographers", icon: Video, count: "420+", color: "bg-sage-light" },
];

export const VendorCategories = () => {
  return (
    <section className="py-20 md:py-32 bg-romantic">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium tracking-widest uppercase text-sm mb-3">
            Trusted Professionals
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            Find Your Dream Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse thousands of verified wedding vendors, view their portfolios, 
            and connect directly to bring your vision to life.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.08 },
            },
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
        >
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.name}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  visible: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.4 },
                  },
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className={`${category.color} rounded-2xl p-6 md:p-8 text-center transition-all duration-300 shadow-card hover:shadow-elegant`}>
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto rounded-xl bg-card/80 flex items-center justify-center mb-4 group-hover:bg-card transition-colors">
                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-lg md:text-xl text-foreground font-medium mb-1">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {category.count} vendors
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/vendors">
            <Button variant="champagne" size="lg" className="gap-2">
              Browse All Vendors
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
