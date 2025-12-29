import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ExternalLink, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface Vendor {
    id: string;
    name: string;
    type: string;
    location: string;
    image_url: string;
    google_rating: number;
    google_reviews: number;
    category: string;
}

interface UserProject {
    location: string;
    style: string;
}

const RecommendedVendors = () => {
    const { user } = useAuth();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [userProject, setUserProject] = useState<UserProject | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserProjectAndVendors();
    }, [user]);

    const fetchUserProjectAndVendors = async () => {
        if (!user) return;

        try {
            // Fetch user's project to get location and style
            const { data: projectData, error: projectError } = await supabase
                .from('projects')
                .select('location, style')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (projectError) {
                console.error('Error fetching project:', projectError);
                setLoading(false);
                return;
            }

            setUserProject(projectData);

            // Fetch vendors filtered by location
            let query = supabase
                .from('vendors')
                .select('*')
                .order('google_rating', { ascending: false })
                .limit(6);

            // Filter by location if available
            if (projectData?.location) {
                // Extract city from "City, State" format
                const city = projectData.location.split(',')[0].trim();
                query = query.ilike('location', `%${city}%`);
            }

            const { data: vendorsData, error: vendorsError } = await query;

            if (vendorsError) {
                console.error('Error fetching vendors:', vendorsError);
            } else {
                setVendors(vendorsData || []);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-gold" />
                        Recommended for You
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        Loading recommendations...
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!userProject) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-gold" />
                        Recommended for You
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                            Complete your onboarding to get personalized vendor recommendations!
                        </p>
                        <Button asChild className="bg-rose-gold hover:bg-rose-gold/90">
                            <Link to="/onboarding/couple">Start Onboarding</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (vendors.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-gold" />
                        Recommended for You
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground py-8">
                        <p>No vendors found in your area yet.</p>
                        <p className="text-sm mt-2">Check back soon as we add more vendors!</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-rose-gold" />
                        Recommended for You
                    </CardTitle>
                    {userProject.style && (
                        <Badge variant="secondary" className="bg-rose-50 text-rose-gold">
                            {userProject.style} Style
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    Based on your {userProject.location} location
                </p>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {vendors.map(vendor => (
                        <Link
                            key={vendor.id}
                            to={`/vendors/${vendor.id}`}
                            className="group block"
                        >
                            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-all">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={vendor.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=300&fit=crop'}
                                        alt={vendor.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-semibold">{vendor.google_rating?.toFixed(1) || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-lg mb-1 group-hover:text-rose-gold transition-colors">
                                        {vendor.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mb-2">{vendor.type}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="w-4 h-4" />
                                        <span>{vendor.location}</span>
                                    </div>
                                    {vendor.google_reviews && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {vendor.google_reviews} reviews
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="mt-6 text-center">
                    <Button variant="outline" asChild>
                        <Link to="/vendors" className="flex items-center gap-2">
                            View All Vendors
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default RecommendedVendors;
