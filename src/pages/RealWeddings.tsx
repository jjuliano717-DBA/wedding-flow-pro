
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Heart, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

// Default fallback image if none provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1519225468759-428dbe8aa33f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const styles = ["All Styles", "Minimalist", "Boho", "Classic", "Moody", "Whimsical", "Garden Romance", "Classic Elegance", "Rustic Chic", "Destination Beach", "Southern Charm"];
const seasons = ["All Seasons", "Spring", "Summer", "Fall", "Winter"];
const locationsList = ["All Locations", "California", "New York", "Tennessee", "South Carolina", "Colorado", "International"];

const RealWeddings = () => {
  const [weddings, setWeddings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("All Styles");
  const [selectedSeason, setSelectedSeason] = useState("All Seasons");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch Weddings from Supabase
  useEffect(() => {
    const fetchWeddings = async () => {
      try {
        const { data, error } = await supabase
          .from('real_weddings')
          .select('*')
          .eq('exclusive', true);

        if (error) throw error;
        setWeddings(data || []);
      } catch (error) {
        console.error("Error fetching weddings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWeddings();
  }, []);

  const filteredWeddings = useMemo(() => {
    return weddings.filter((wedding) => {
      // Map DB field names to expected logic if needed, or update logic below
      const coupleName = wedding.couple_names || "";

      const matchesSearch =
        coupleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (wedding.location && wedding.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (wedding.style && wedding.style.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStyle = selectedStyle === "All Styles" || wedding.style === selectedStyle;
      const matchesSeason = selectedSeason === "All Seasons" || wedding.season === selectedSeason;

      const loc = wedding.location || "";
      const matchesLocation =
        selectedLocation === "All Locations" ||
        (selectedLocation === "International" && !loc.includes("USA") &&
          !["California", "New York", "Tennessee", "South Carolina", "Colorado"].some(l => loc.includes(l))) ||
        loc.includes(selectedLocation);

      return matchesSearch && matchesStyle && matchesSeason && matchesLocation;
    });
  }, [weddings, searchQuery, selectedStyle, selectedSeason, selectedLocation]);

  const displayWeddings = filteredWeddings.map(w => ({
    ...w,
    couple: w.couple_names, // Map DB 'couple_names' to UI 'couple'
    image: w.image_url || DEFAULT_IMAGE,
    vendors: w.vendors || [] // DB uses text[] array
  }));

  const clearFilters = () => {
    setSelectedStyle("All Styles");
    setSelectedSeason("All Seasons");
    setSelectedLocation("All Locations");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedStyle !== "All Styles" || selectedSeason !== "All Seasons" || selectedLocation !== "All Locations" || searchQuery !== "";

  return (
    <div className="min-h-screen bg-background">


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
              Weddings
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Get inspired by real couples and discover the talented professionals who brought their dream weddings to life.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search weddings, styles, or locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border-border shadow-sm"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-border/50 sticky top-[72px] z-10 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <Button
                variant={showFilters ? "secondary" : "outline"}
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2 shrink-0 text-rose-600 hover:bg-rose-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </Button>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-2">
                <select
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-rose-600 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {styles.map((style) => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>

                <select
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-rose-600 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {seasons.map((season) => (
                    <option key={season} value={season}>{season}</option>
                  ))}
                </select>

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-rose-600 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {locationsList.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>

                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-2 gap-1 text-muted-foreground hover:text-foreground">
                    <X className="w-4 h-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {displayWeddings.length} weddings found
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden pt-4 grid grid-cols-1 gap-3"
            >
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-card text-sm"
              >
                {styles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>

              <select
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-card text-sm"
              >
                {seasons.map((season) => (
                  <option key={season} value={season}>{season}</option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="h-10 px-3 rounded-md border border-border bg-card text-sm"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </motion.div>
          )}
        </div>
      </section>

      {/* Weddings Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.08 },
              },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {displayWeddings.map((wedding) => (
              <motion.article
                key={wedding.id}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
                className="group cursor-pointer"
              >
                <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={wedding.image}
                      alt={wedding.couple}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 right-4">
                      <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-heart" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="text-xs font-medium text-primary mb-2 uppercase tracking-wider">
                      {wedding.style} • {wedding.season}
                    </div>
                    <h3 className="font-serif text-xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {wedding.couple}
                    </h3>
                    <div className="flex items-start gap-2 text-muted-foreground mb-4">
                      <MapPin className="w-4 h-4 mt-1 shrink-0" />
                      <span className="text-sm">{wedding.location}</span>
                    </div>

                    {/* Vendors Preview */}
                    <div className="pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">FEATURING</p>
                      <div className="flex flex-wrap gap-2">
                        {wedding.vendors.slice(0, 2).map((vendor: string, idx: number) => (
                          <span key={idx} className="text-xs bg-secondary px-2 py-1 rounded-md text-secondary-foreground">
                            {vendor}
                          </span>
                        ))}
                        {wedding.vendors.length > 2 && (
                          <span className="text-xs text-muted-foreground py-1">
                            +{wedding.vendors.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {displayWeddings.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No weddings found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default RealWeddings;
