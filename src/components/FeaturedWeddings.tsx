import { motion } from "framer-motion";
import { Heart, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import wedding1 from "@/assets/wedding-1.jpg";
import wedding2 from "@/assets/wedding-2.jpg";
import wedding3 from "@/assets/wedding-3.jpg";
import wedding4 from "@/assets/wedding-4.jpg";

const featuredWeddings = [
  {
    id: 1,
    image: wedding1,
    couple: "Sarah & Michael",
    location: "Napa Valley, California",
    style: "Garden Romance",
    vendors: ["Simply Sunshine Events", "The Grovers Photography"],
  },
  {
    id: 2,
    image: wedding2,
    couple: "Emily & James",
    location: "The Plaza, New York",
    style: "Classic Elegance",
    vendors: ["Valley & Company Events", "Heather Durham Photography"],
  },
  {
    id: 3,
    image: wedding3,
    couple: "Jessica & David",
    location: "Rustic Ridge Barn, Tennessee",
    style: "Rustic Chic",
    vendors: ["Creative Touch Party Design", "Early Bird Vintage"],
  },
  {
    id: 4,
    image: wedding4,
    couple: "Amanda & Ryan",
    location: "Turks & Caicos",
    style: "Destination Beach",
    vendors: ["Brooke Keegan Special Events", "The de Jaureguis"],
  },
];

export const FeaturedWeddings = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
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
            Real Wedding Inspiration
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            Featured Weddings
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the talented professionals behind these stunning celebrations 
            and get inspired for your own special day.
          </p>
        </motion.div>

        {/* Wedding Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {featuredWeddings.map((wedding) => (
            <motion.article
              key={wedding.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                },
              }}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-card">
                <img
                  src={wedding.image}
                  alt={`${wedding.couple}'s wedding`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                
                {/* Like Button */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                  <Heart className="w-5 h-5 text-rose-gold" />
                </button>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <span className="inline-block px-3 py-1 rounded-full bg-champagne/90 text-primary-foreground text-xs font-medium mb-3">
                    {wedding.style}
                  </span>
                  <h3 className="font-serif text-xl text-primary-foreground font-medium mb-1">
                    {wedding.couple}
                  </h3>
                  <p className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {wedding.location}
                  </p>
                  
                  {/* Vendors Preview */}
                  <div className="mt-3 pt-3 border-t border-primary-foreground/20">
                    <p className="text-primary-foreground/60 text-xs">
                      Featuring: {wedding.vendors[0]}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" className="gap-2">
            View All Real Weddings
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
