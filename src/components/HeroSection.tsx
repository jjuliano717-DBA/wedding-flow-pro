import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-wedding.jpg";


export const HeroSection = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  const handleSearch = () => {
    // Default to venues search for now as it maps best to the UI (locations/types)
    const params = new URLSearchParams();
    if (searchQuery) params.append("search", searchQuery);
    if (selectedLocation !== "All Locations") params.append("location", selectedLocation);

    navigate(`/venues?${params.toString()}`);
  };

  const handleQuickFilter = (style: string) => {
    const params = new URLSearchParams();
    // Map style buttons to search or type
    params.append("type", style);
    navigate(`/venues?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Elegant wedding table setting"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/20 to-foreground/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-champagne-light font-medium tracking-widest uppercase text-[2rem] mb-4"
          >
            Discover Your Dream Wedding
          </motion.p>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-primary-foreground font-medium leading-tight mb-6">
            Where Love Stories
            <br />
            <span className="italic">Come to Life</span>
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-primary-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10"
          >
            Connect with top wedding vendors, discover stunning venues, and find
            inspiration from real weddings to plan your perfect day.
          </motion.p>

          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-card/95 backdrop-blur-md rounded-2xl shadow-elegant p-4 md:p-6 max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search vendors, venues, or styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full h-12 pl-12 pr-4 rounded-lg bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex gap-4">
                <div className="relative flex-1 md:w-48">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-muted border-0 text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>All Locations</option>
                    <option>New York</option>
                    <option>Los Angeles</option>
                    <option>Chicago</option>
                    <option>Miami</option>
                  </select>
                </div>

                <Button variant="champagne" size="lg" className="px-8" onClick={handleSearch}>
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <button
                onClick={() => window.location.href = "/discover"}
                className="px-4 py-1.5 rounded-full bg-rose-gold text-white text-sm hover:bg-rose-600 transition-colors font-bold shadow-sm"
              >
                ✨ Start Discovery Swipe
              </button>
              {["Garden & Estate", "Waterfront", "Rustic Barn", "Ballroom", "Historic"].map((style) => (
                <button
                  key={style}
                  onClick={() => handleQuickFilter(style)}
                  className="px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors"
                >
                  {style}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-8 md:gap-16 mt-12 text-primary-foreground"
        >
          {[
            { number: "10,000+", label: "Real Weddings" },
            { number: "5,000+", label: "Trusted Vendors" },
            { number: "2,500+", label: "Stunning Venues" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl md:text-3xl font-semibold">{stat.number}</p>
              <p className="text-sm text-primary-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1, y: { repeat: Infinity, duration: 2 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/50 flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-primary-foreground/70 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};
