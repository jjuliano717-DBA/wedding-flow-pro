import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Users, Filter, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import wedding1 from "@/assets/wedding-1.jpg";
import wedding2 from "@/assets/wedding-2.jpg";
import wedding3 from "@/assets/wedding-3.jpg";
import wedding4 from "@/assets/wedding-4.jpg";

import { supabase } from "@/lib/supabase"; // Ensure import

// Default fallback image if none provided
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const venueTypes = ["All Types", "Ballroom", "Garden & Estate", "Rustic Barn", "Waterfront", "Historic", "Mountain", "Loft/Industrial", "Winery"];
const locationsList = ["All Locations", "California", "New York", "Tennessee", "South Carolina", "Colorado", "Illinois", "Texas", "Florida", "Oregon"];
const capacities = ["Any Capacity", "Up to 100", "100-200", "200-300", "300+"];
const priceRanges = ["All Prices", "$$", "$$$", "$$$$"];

const VenuesDirectory = () => {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedCapacity, setSelectedCapacity] = useState("Any Capacity");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch Venues from Supabase
  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data, error } = await supabase
          .from('venues')
          .select('*')
          //.eq('exclusive', true); // Assuming we want all venues or exclusive? User said "do the same workflow... entries in localhost:8082/venues to venues tab in admin". The sql inserted them as exclusive=true. So let's fetch exclusive ones or all? Directory usually shows all approved. But let's stick to exclusive=true for consistency with "same workflow".
          .eq('exclusive', true);

        if (error) throw error;
        setVenues(data || []);
      } catch (error) {
        console.error("Error fetching venues:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (venue.location && venue.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (venue.type && venue.type.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesType = selectedType === "All Types" || venue.type === selectedType;
      const matchesLocation = selectedLocation === "All Locations" || (venue.location && venue.location.includes(selectedLocation));
      const matchesPrice = selectedPrice === "All Prices" || venue.price === selectedPrice;

      let matchesCapacity = true;
      if (selectedCapacity === "Up to 100") matchesCapacity = venue.capacity_num <= 100;
      else if (selectedCapacity === "100-200") matchesCapacity = venue.capacity_num > 100 && venue.capacity_num <= 200;
      else if (selectedCapacity === "200-300") matchesCapacity = venue.capacity_num > 200 && venue.capacity_num <= 300;
      else if (selectedCapacity === "300+") matchesCapacity = venue.capacity_num > 300;

      return matchesSearch && matchesType && matchesLocation && matchesCapacity && matchesPrice;
    });
  }, [venues, searchQuery, selectedType, selectedLocation, selectedCapacity, selectedPrice]);

  const displayVenues = filteredVenues.map(v => ({
    ...v,
    image: v.image_url || DEFAULT_IMAGE,
    rating: v.google_rating || 0,
    reviews: v.google_reviews || 0,
    capacity: v.capacity || 'N/A', // Display string
    capacityNum: v.capacity_num || 0
  }));

  const clearFilters = () => {
    setSelectedType("All Types");
    setSelectedLocation("All Locations");
    setSelectedCapacity("Any Capacity");
    setSelectedPrice("All Prices");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedType !== "All Types" || selectedLocation !== "All Locations" || selectedCapacity !== "Any Capacity" || selectedPrice !== "All Prices" || searchQuery !== "";

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
              Wedding Venues
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Discover stunning wedding venues from elegant ballrooms to romantic gardens. Find the perfect backdrop for your special day.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search venues by name, location, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-base rounded-full border-border bg-card"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Type Quick Links */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {venueTypes.slice(1).map((type) => {
              const isActive = selectedType === type;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(isActive ? "All Types" : type)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary/50"
                    }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
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
              More Filters
            </Button>

            {showFilters && (
              <>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm"
                >
                  {locationsList.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>

                <select
                  value={selectedCapacity}
                  onChange={(e) => setSelectedCapacity(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm"
                >
                  {capacities.map((capacity) => (
                    <option key={capacity} value={capacity}>{capacity}</option>
                  ))}
                </select>

                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  className="h-9 px-3 rounded-md border border-border bg-card text-sm"
                >
                  {priceRanges.map((price) => (
                    <option key={price} value={price}>{price}</option>
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
              {displayVenues.length} venues found
            </span>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayVenues.map((venue) => (
              <motion.article
                key={venue.id}
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
                    <div className="absolute top-4 right-4 flex gap-2">
                      <span className="px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium">
                        {venue.price}
                      </span>
                      <button className="w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                        <Heart className="w-4 h-4 text-rose-gold" />
                      </button>
                    </div>
                    {(venue.indoor && venue.outdoor) && (
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        <span className="px-2 py-1 rounded bg-card/90 backdrop-blur-sm text-xs font-medium text-foreground">
                          Indoor & Outdoor
                        </span>
                      </div>
                    )}
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
                          ({venue.reviews})
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

          {displayVenues.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No venues found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>


    </div>
  );
};

export default VenuesDirectory;
