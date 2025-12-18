import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Heart, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import wedding1 from "@/assets/wedding-1.jpg";
import wedding2 from "@/assets/wedding-2.jpg";
import wedding3 from "@/assets/wedding-3.jpg";
import wedding4 from "@/assets/wedding-4.jpg";

const allWeddings = [
  {
    id: 1,
    image: wedding1,
    couple: "Sarah & Michael",
    location: "Napa Valley, California",
    style: "Garden Romance",
    season: "Spring",
    vendors: ["Simply Sunshine Events", "The Grovers Photography"],
  },
  {
    id: 2,
    image: wedding2,
    couple: "Emily & James",
    location: "The Plaza, New York",
    style: "Classic Elegance",
    season: "Fall",
    vendors: ["Valley & Company Events", "Heather Durham Photography"],
  },
  {
    id: 3,
    image: wedding3,
    couple: "Jessica & David",
    location: "Rustic Ridge Barn, Tennessee",
    style: "Rustic Chic",
    season: "Summer",
    vendors: ["Creative Touch Party Design", "Early Bird Vintage"],
  },
  {
    id: 4,
    image: wedding4,
    couple: "Amanda & Ryan",
    location: "Turks & Caicos",
    style: "Destination Beach",
    season: "Winter",
    vendors: ["Brooke Keegan Special Events", "The de Jaureguis"],
  },
  {
    id: 5,
    image: wedding1,
    couple: "Olivia & Thomas",
    location: "Charleston, South Carolina",
    style: "Southern Charm",
    season: "Spring",
    vendors: ["Southern Elegance Events", "Anne Rhett Photography"],
  },
  {
    id: 6,
    image: wedding2,
    couple: "Madison & William",
    location: "Lake Como, Italy",
    style: "Destination Beach",
    season: "Summer",
    vendors: ["Italian Dreams Weddings", "Luca Vieri Photography"],
  },
  {
    id: 7,
    image: wedding3,
    couple: "Sophia & Benjamin",
    location: "Aspen, Colorado",
    style: "Rustic Chic",
    season: "Winter",
    vendors: ["Mountain Top Events", "Carrie Patterson Photography"],
  },
  {
    id: 8,
    image: wedding4,
    couple: "Isabella & Alexander",
    location: "Beverly Hills, California",
    style: "Classic Elegance",
    season: "Fall",
    vendors: ["Mindy Weiss Party Consultants", "Jose Villa Photography"],
  },
];

const styles = ["All Styles", "Garden Romance", "Classic Elegance", "Rustic Chic", "Destination Beach", "Southern Charm"];
const seasons = ["All Seasons", "Spring", "Summer", "Fall", "Winter"];
const locations = ["All Locations", "California", "New York", "Tennessee", "South Carolina", "Colorado", "International"];

const RealWeddings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [selectedSeason, setSelectedSeason] = useState("All Seasons");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);

  const filteredWeddings = useMemo(() => {
    return allWeddings.filter((wedding) => {
      const matchesSearch =
        wedding.couple.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wedding.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wedding.style.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStyle = selectedStyle === "All Styles" || wedding.style === selectedStyle;
      const matchesSeason = selectedSeason === "All Seasons" || wedding.season === selectedSeason;
      const matchesLocation =
        selectedLocation === "All Locations" ||
        (selectedLocation === "International" && !wedding.location.includes("USA") && 
          !["California", "New York", "Tennessee", "South Carolina", "Colorado"].some(loc => wedding.location.includes(loc))) ||
        wedding.location.includes(selectedLocation);

      return matchesSearch && matchesStyle && matchesSeason && matchesLocation;
    });
  }, [searchQuery, selectedStyle, selectedSeason, selectedLocation]);

  const clearFilters = () => {
    setSelectedStyle("All Styles");
    setSelectedSeason("All Seasons");
    setSelectedLocation("All Locations");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedStyle !== "All Styles" || selectedSeason !== "All Seasons" || selectedLocation !== "All Locations" || searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-romantic">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-serif text-4xl md:text-6xl text-foreground mb-4">
              Real Weddings
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Get inspired by real couples and discover the talented professionals who brought their dream weddings to life.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by couple name, location, or style..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-base rounded-full border-border bg-card"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-background sticky top-16 md:top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>

            {showFilters && (
              <>
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm"
                >
                  {styles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>

                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm"
                >
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </>
            )}

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                <X className="w-4 h-4" />
                Clear all
              </Button>
            )}

            <span className="ml-auto text-sm text-muted-foreground">
              {filteredWeddings.length} weddings found
            </span>
          </div>
        </div>
      </section>

      {/* Wedding Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredWeddings.map((wedding) => (
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
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  
                  <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                    <Heart className="w-5 h-5 text-rose-gold" />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex gap-2 mb-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-champagne/90 text-primary-foreground text-xs font-medium">
                        {wedding.style}
                      </span>
                      <span className="inline-block px-3 py-1 rounded-full bg-sage/90 text-primary-foreground text-xs font-medium">
                        {wedding.season}
                      </span>
                    </div>
                    <h3 className="font-serif text-xl text-primary-foreground font-medium mb-1">
                      {wedding.couple}
                    </h3>
                    <p className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                      <MapPin className="w-3.5 h-3.5" />
                      {wedding.location}
                    </p>
                    
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

          {filteredWeddings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No weddings found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RealWeddings;
