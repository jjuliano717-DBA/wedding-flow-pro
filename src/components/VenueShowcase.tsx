import { motion } from "framer-motion";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import wedding1 from "@/assets/wedding-1.jpg";
import wedding2 from "@/assets/wedding-2.jpg";
import wedding3 from "@/assets/wedding-3.jpg";

const venues = [
  {
    id: 1,
    name: "The Grand Estate",
    image: wedding1,
    location: "Napa Valley, CA",
    type: "Garden & Estate",
    capacity: "50-300",
    rating: 4.9,
    reviews: 127,
    price: "$$$$",
  },
  {
    id: 2,
    name: "Rosewood Ballroom",
    image: wedding2,
    location: "New York, NY",
    type: "Ballroom",
    capacity: "100-500",
    rating: 4.8,
    reviews: 89,
    price: "$$$$",
  },
  {
    id: 3,
    name: "Harvest Moon Barn",
    image: wedding3,
    location: "Nashville, TN",
    type: "Rustic Barn",
    capacity: "75-250",
    rating: 4.9,
    reviews: 156,
    price: "$$$",
  },
];

export const VenueShowcase = () => {
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
            Stunning Locations
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            Featured Venues
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From elegant ballrooms to romantic gardens, discover the perfect 
            backdrop for your celebration.
          </p>
        </motion.div>

        {/* Venues Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {venues.map((venue) => (
            <motion.article
              key={venue.id}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
              className="group cursor-pointer"
            >
              <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={venue.image}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium text-foreground">
                      {venue.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium">
                      {venue.price}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif text-xl text-foreground font-medium mb-2 group-hover:text-primary transition-colors">
                    {venue.name}
                  </h3>
                  
                  <p className="flex items-center gap-1.5 text-muted-foreground text-sm mb-4">
                    <MapPin className="w-4 h-4" />
                    {venue.location}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-champagne fill-champagne" />
                      <span className="font-medium text-foreground">{venue.rating}</span>
                      <span className="text-muted-foreground text-sm">
                        ({venue.reviews} reviews)
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Users className="w-4 h-4" />
                      {venue.capacity}
                    </div>
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
            Explore All Venues
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
