import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Star, MapPin, Filter, X, Heart, Camera, Flower2, Music, UtensilsCrossed, Cake, Sparkles, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import wedding1 from "@/assets/wedding-1.jpg";
import wedding2 from "@/assets/wedding-2.jpg";
import wedding3 from "@/assets/wedding-3.jpg";
import wedding4 from "@/assets/wedding-4.jpg";

const categoryIcons: Record<string, React.ElementType> = {
  "Photographer": Camera,
  "Florist": Flower2,
  "DJ/Band": Music,
  "Caterer": UtensilsCrossed,
  "Cake Designer": Cake,
  "Planner": Sparkles,
  "Hair & Makeup": Users,
  "Videographer": Video,
};

const allVendors = [
  {
    id: 1,
    name: "Simply Sunshine Events",
    image: wedding1,
    category: "Planner",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 127,
    priceRange: "$$$$",
    featured: true,
  },
  {
    id: 2,
    name: "The Grovers Photography",
    image: wedding2,
    category: "Photographer",
    location: "San Francisco, CA",
    rating: 5.0,
    reviews: 89,
    priceRange: "$$$",
    featured: true,
  },
  {
    id: 3,
    name: "Bloomington Florals",
    image: wedding3,
    category: "Florist",
    location: "New York, NY",
    rating: 4.8,
    reviews: 156,
    priceRange: "$$",
    featured: false,
  },
  {
    id: 4,
    name: "DJ Smooth Beats",
    image: wedding4,
    category: "DJ/Band",
    location: "Miami, FL",
    rating: 4.7,
    reviews: 78,
    priceRange: "$$",
    featured: false,
  },
  {
    id: 5,
    name: "Gourmet Catering Co",
    image: wedding1,
    category: "Caterer",
    location: "Chicago, IL",
    rating: 4.9,
    reviews: 201,
    priceRange: "$$$$",
    featured: true,
  },
  {
    id: 6,
    name: "Sweet Dreams Bakery",
    image: wedding2,
    category: "Cake Designer",
    location: "Nashville, TN",
    rating: 4.8,
    reviews: 94,
    priceRange: "$$$",
    featured: false,
  },
  {
    id: 7,
    name: "Glamour Squad",
    image: wedding3,
    category: "Hair & Makeup",
    location: "Austin, TX",
    rating: 4.9,
    reviews: 167,
    priceRange: "$$$",
    featured: true,
  },
  {
    id: 8,
    name: "Cinema Love Films",
    image: wedding4,
    category: "Videographer",
    location: "Seattle, WA",
    rating: 5.0,
    reviews: 54,
    priceRange: "$$$$",
    featured: false,
  },
  {
    id: 9,
    name: "Valley & Company Events",
    image: wedding1,
    category: "Planner",
    location: "Denver, CO",
    rating: 4.8,
    reviews: 112,
    priceRange: "$$$",
    featured: false,
  },
  {
    id: 10,
    name: "Heather Durham Photography",
    image: wedding2,
    category: "Photographer",
    location: "Atlanta, GA",
    rating: 4.9,
    reviews: 198,
    priceRange: "$$$$",
    featured: true,
  },
  {
    id: 11,
    name: "Garden of Eden Florals",
    image: wedding3,
    category: "Florist",
    location: "Portland, OR",
    rating: 4.7,
    reviews: 76,
    priceRange: "$$",
    featured: false,
  },
  {
    id: 12,
    name: "The Harmony Band",
    image: wedding4,
    category: "DJ/Band",
    location: "Boston, MA",
    rating: 4.9,
    reviews: 145,
    priceRange: "$$$$",
    featured: true,
  },
];

const categories = ["All Categories", "Photographer", "Florist", "DJ/Band", "Caterer", "Cake Designer", "Planner", "Hair & Makeup", "Videographer"];
const locationsList = ["All Locations", "California", "New York", "Florida", "Illinois", "Tennessee", "Texas", "Washington", "Colorado", "Georgia", "Oregon", "Massachusetts"];
const priceRanges = ["All Prices", "$", "$$", "$$$", "$$$$"];

const VendorsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedPrice, setSelectedPrice] = useState("All Prices");
  const [showFilters, setShowFilters] = useState(false);

  const filteredVendors = useMemo(() => {
    return allVendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === "All Categories" || vendor.category === selectedCategory;
      const matchesLocation = selectedLocation === "All Locations" || vendor.location.includes(selectedLocation);
      const matchesPrice = selectedPrice === "All Prices" || vendor.priceRange === selectedPrice;

      return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
    });
  }, [searchQuery, selectedCategory, selectedLocation, selectedPrice]);

  const clearFilters = () => {
    setSelectedCategory("All Categories");
    setSelectedLocation("All Locations");
    setSelectedPrice("All Prices");
    setSearchQuery("");
  };

  const hasActiveFilters = selectedCategory !== "All Categories" || selectedLocation !== "All Locations" || selectedPrice !== "All Prices" || searchQuery !== "";

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
              Wedding Vendors
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Find and connect with the best wedding professionals in your area. Browse portfolios, read reviews, and book your dream team.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search vendors by name, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 h-14 text-base rounded-full border-border bg-card"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Quick Links */}
      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.slice(1).map((category) => {
              const Icon = categoryIcons[category] || Sparkles;
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(isActive ? "All Categories" : category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-card border border-border hover:border-primary/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category}</span>
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
              {filteredVendors.length} vendors found
            </span>
          </div>
        </div>
      </section>

      {/* Vendors Grid */}
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
            {filteredVendors.map((vendor) => {
              const CategoryIcon = categoryIcons[vendor.category] || Sparkles;
              return (
                <motion.article
                  key={vendor.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4 },
                    },
                  }}
                  className="group cursor-pointer"
                >
                  <div className="bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-300">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={vendor.image}
                        alt={vendor.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {vendor.featured && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-champagne text-primary-foreground text-xs font-medium">
                            Featured
                          </span>
                        </div>
                      )}
                      <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors">
                        <Heart className="w-5 h-5 text-rose-gold" />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium text-foreground">
                          <CategoryIcon className="w-4 h-4 text-primary" />
                          {vendor.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-serif text-lg text-foreground font-medium group-hover:text-primary transition-colors">
                          {vendor.name}
                        </h3>
                        <span className="text-sm font-medium text-muted-foreground">
                          {vendor.priceRange}
                        </span>
                      </div>
                      
                      <p className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                        <MapPin className="w-4 h-4" />
                        {vendor.location}
                      </p>

                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-champagne fill-champagne" />
                        <span className="font-medium text-foreground">{vendor.rating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({vendor.reviews} reviews)
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">No vendors found matching your criteria.</p>
              <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VendorsDirectory;
