import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Search, Filter, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { zipToCoords, isValidZip } from '@/lib/zipToCoords';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Venue {
    id: string;
    name: string;
    type: string;
    category: string;
    location: string;
    distance_miles: number;
    image_url: string;
    google_rating: number;
    google_reviews: number;
    heart_rating: number;
    is_claimed: boolean;
    capacity_num: number;
    website: string;
}

export function VenuesSearch() {
    const [zipCode, setZipCode] = useState('');
    const [radiusMiles, setRadiusMiles] = useState([25]);
    const [venueType, setVenueType] = useState('all');
    const [locationFilter, setLocationFilter] = useState('');
    const [minCapacity, setMinCapacity] = useState('');
    const [venues, setVenues] = useState<Venue[]>([]);
    const [allVenues, setAllVenues] = useState<Venue[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [venueTypes, setVenueTypes] = useState<string[]>([]);

    // Load venue types from database
    useEffect(() => {
        const loadTypes = async () => {
            const { data, error } = await supabase
                .from('vendors')
                .select('type')
                .eq('category', 'venue')
                .not('type', 'is', null);

            if (!error && data) {
                const uniqueTypes = [...new Set(data.map(v => v.type))];
                setVenueTypes(uniqueTypes.sort());
            }
        };
        loadTypes();
    }, []);

    // Load exclusive VENUES only on mount
    useEffect(() => {
        const loadExclusiveVenues = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('*')
                    .eq('exclusive', true)
                    .eq('category', 'venue')
                    .order('google_rating', { ascending: false })
                    .limit(50);

                if (error) throw error;

                const transformedData = (data || []).map(v => ({
                    ...v,
                    distance_miles: 0,
                    is_claimed: !!v.owner_id
                }));

                setVenues(transformedData);
                setAllVenues(transformedData);
            } catch (error) {
                console.error('Error loading exclusive venues:', error);
            } finally {
                setLoading(false);
            }
        };

        loadExclusiveVenues();
    }, []);

    // Apply filters to results
    const applyFilters = (data: Venue[]) => {
        let filtered = [...data];

        // Filter by venue type
        if (venueType !== 'all') {
            filtered = filtered.filter(v => v.type === venueType);
        }

        // Filter by location (city/state search)
        if (locationFilter.trim()) {
            const searchTerm = locationFilter.toLowerCase();
            filtered = filtered.filter(v =>
                v.location?.toLowerCase().includes(searchTerm)
            );
        }

        // Filter by capacity
        if (minCapacity) {
            const minCap = parseInt(minCapacity);
            filtered = filtered.filter(v => v.capacity_num && v.capacity_num >= minCap);
        }

        return filtered;
    };

    // Apply filters whenever filter values change
    useEffect(() => {
        if (allVenues.length > 0) {
            setVenues(applyFilters(allVenues));
        }
    }, [venueType, locationFilter, minCapacity, allVenues]);

    const handleSearch = async () => {
        if (!zipCode) {
            toast.error('Please enter a zip code');
            return;
        }

        if (!isValidZip(zipCode)) {
            toast.error('Please enter a valid 5-digit zip code');
            return;
        }

        const zipCoords = zipToCoords(zipCode);
        if (!zipCoords) {
            toast.error('Zip code not found. Try a Florida zip code like 33139 (Miami Beach)');
            return;
        }

        setHasSearched(true);
        setLoading(true);

        try {
            const { data, error } = await supabase.rpc('search_vendors_geo', {
                p_origin_lat: zipCoords.lat,
                p_origin_long: zipCoords.lng,
                p_radius_miles: radiusMiles[0],
                p_filter_capacity_min: minCapacity ? parseInt(minCapacity) : null,
                p_filter_category: 'venue',
            });

            if (error) {
                console.error('RPC error:', error);
                throw error;
            }

            setAllVenues(data || []);
            const filtered = applyFilters(data || []);
            setVenues(filtered);
            toast.success(`Found ${filtered.length} venues near ${zipCoords.city}`);
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Search failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 border-b">
                <div className="container mx-auto px-4 py-12 max-w-6xl">
                    <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-3">Find Your Perfect Venue</h1>
                    <p className="text-muted-foreground text-lg">Search wedding venues by location, capacity, and style</p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
                <div className="container mx-auto px-4 py-4 max-w-6xl">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3">
                        {/* Zip Code Input */}
                        <div className="md:col-span-1">
                            <Label htmlFor="zip" className="sr-only">Zip Code</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    id="zip"
                                    placeholder="Zip code"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Location Filter (City/State) */}
                        <div className="md:col-span-1">
                            <Input
                                placeholder="City or State"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            />
                        </div>

                        {/* Venue Type Filter */}
                        <div className="md:col-span-1">
                            <Select value={venueType} onValueChange={setVenueType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Venue Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Venues</SelectItem>
                                    {venueTypes.map(type => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Capacity Filter */}
                        <div className="md:col-span-1">
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="number"
                                    placeholder="Min guests"
                                    value={minCapacity}
                                    onChange={(e) => setMinCapacity(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Search Button */}
                        <div className="md:col-span-1">
                            <Button onClick={handleSearch} disabled={loading} className="w-full bg-rose-gold hover:bg-rose-600">
                                <Search className="w-4 h-4 mr-2" />
                                {loading ? 'Searching...' : 'Search by Zip'}
                            </Button>
                        </div>
                    </div>

                    {/* Radius Slider */}
                    <div className="max-w-md">
                        <Label className="text-sm font-medium mb-2 block">
                            Search Radius: {radiusMiles[0]} miles
                        </Label>
                        <Slider
                            value={radiusMiles}
                            onValueChange={setRadiusMiles}
                            min={10}
                            max={100}
                            step={5}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {!hasSearched && venues.length > 0 && (
                    <div className="mb-6">
                        <h2 className="font-serif text-2xl mb-2">Featured Exclusive Venue Partners</h2>
                        <p className="text-muted-foreground">Enter a zip code above to search by location, or use filters to refine results</p>
                    </div>
                )}
                {venues.length === 0 && !loading ? (
                    <div className="text-center py-16">
                        <Filter className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-serif text-2xl mb-2">{hasSearched ? 'No Venues Found' : 'Loading...'}</h3>
                        <p className="text-muted-foreground">
                            {hasSearched ? 'Try adjusting your search criteria or radius' : 'Loading exclusive venues...'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {venues.map((venue) => (
                            <motion.div
                                key={venue.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <Link to={`/venues/${venue.id}`}>
                                    <div className="aspect-video bg-muted relative overflow-hidden">
                                        <img
                                            src={venue.image_url?.trim() || 'https://images.unsplash.com/photo-1519167758481-83f29da8d6a4?auto=format&fit=crop&q=80&w=800'}
                                            alt={venue.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = 'https://images.unsplash.com/photo-1519167758481-83f29da8d6a4?auto=format&fit=crop&q=80&w=800';
                                            }}
                                        />
                                        {venue.is_claimed && (
                                            <Badge className="absolute top-2 right-2 bg-amber-500">Verified</Badge>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge variant="secondary" className="text-xs">
                                                {venue.type}
                                            </Badge>
                                            {hasSearched && venue.distance_miles > 0 && (
                                                <span className="text-sm text-muted-foreground">
                                                    {venue.distance_miles.toFixed(1)} mi
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-serif text-lg mb-2 line-clamp-1">{venue.name}</h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
                                            {venue.location}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="font-medium">{venue.google_rating}</span>
                                                <span className="text-muted-foreground">({venue.google_reviews})</span>
                                            </div>
                                            {venue.capacity_num && (
                                                <div className="flex items-center gap-1 text-muted-foreground">
                                                    <Users className="w-4 h-4" />
                                                    <span>{venue.capacity_num}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
