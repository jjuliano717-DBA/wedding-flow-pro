/**
 * Business Onboarding Page
 * 
 * Allows business users to complete their profile information
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useBusiness } from '@/context/BusinessContext';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { VenueTypeSelector } from '@/components/VenueTypeSelector';

const onboardingSchema = z.object({
    // Google Business
    google_business_url: z.string().url('Please enter a valid URL').optional().or(z.literal('')),

    // Basic Info
    name: z.string().min(2, 'Business name must be at least 2 characters'),
    description: z.string().optional(),

    // Location
    street_address: z.string().optional(),
    location: z.string().optional(), // City, State
    service_zipcodes: z.string().optional(), // Comma-separated

    // Contact
    contact_email: z.string().email('Please enter a valid email address'),
    contact_phone: z.string().min(10, 'Please enter a valid phone number').optional().or(z.literal('')),
    website: z.string().url('Please enter a valid URL').optional().or(z.literal('')),

    // Venue Specific (conditional)
    venue_type: z.string().optional(),
    price: z.enum(['$', '$$', '$$$', '$$$$', '']).optional(),
    guest_capacity: z.coerce.number().min(1).optional().or(z.literal('')),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function BusinessOnboarding() {
    const navigate = useNavigate();
    const { businessProfile, refreshBusinessProfile } = useBusiness();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<OnboardingFormData>({
        resolver: zodResolver(onboardingSchema),
        defaultValues: {
            google_business_url: businessProfile?.google_business_url || '',
            name: businessProfile?.name || '',
            contact_email: businessProfile?.contact_email || '',
            contact_phone: businessProfile?.contact_phone || '',
            street_address: businessProfile?.street_address || '',
            location: businessProfile?.location || '',
            service_zipcodes: businessProfile?.service_zipcodes?.join(', ') || '',
            description: businessProfile?.description || '',
            website: businessProfile?.website || '',
            venue_type: businessProfile?.venue_type || '',
            price: (businessProfile?.price as '$' | '$$' | '$$$' | '$$$$' | '') || '',
            guest_capacity: businessProfile?.guest_capacity || ('' as any),
        },
    });

    const onSubmit = async (values: OnboardingFormData) => {
        if (!businessProfile?.id) {
            toast.error('Business profile not found');
            return;
        }

        setIsSubmitting(true);

        try {
            // Parse service zipcodes from comma-separated string to array
            const serviceZipcodesArray = values.service_zipcodes
                ? values.service_zipcodes.split(',').map(zip => zip.trim()).filter(Boolean)
                : null;

            const { error } = await supabase
                .from('vendors')
                .update({
                    google_business_url: values.google_business_url || null,
                    name: values.name,
                    contact_email: values.contact_email,
                    contact_phone: values.contact_phone || null,
                    street_address: values.street_address || null,
                    location: values.location || null,
                    service_zipcodes: serviceZipcodesArray,
                    description: values.description || null,
                    website: values.website || null,
                    venue_type: values.venue_type || null,
                    price: values.price || null,
                    guest_capacity: values.guest_capacity || null,
                })
                .eq('id', businessProfile.id);

            if (error) throw error;

            toast.success('Business profile updated successfully!');
            await refreshBusinessProfile();
            navigate('/business');
        } catch (error) {
            console.error('Error updating business profile:', error);
            toast.error('Failed to update business profile');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-8 px-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-serif">Complete Your Business Profile</CardTitle>
                    <CardDescription>
                        Please provide your business information to get started
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Google Business URL */}
                            <FormField
                                control={form.control}
                                name="google_business_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Google Business URL</FormLabel>
                                        <FormControl>
                                            <Input type="url" placeholder="https://maps.google.com/..." {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Link to your Google Business Profile or Google Maps listing
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business Name <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Your Business Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact_email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Email <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="contact@yourbusiness.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This email will be visible to potential clients
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="contact_phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Phone</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="(555) 123-4567" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="street_address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Street Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123 Main St" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Location</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City, State" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            City and State where your business is located
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="service_zipcodes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Service ZIP Codes</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345, 12346, 12347" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Comma-separated list of ZIP codes you serve
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input type="url" placeholder="https://yourbusiness.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Business Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell potential clients about your business..."
                                                className="min-h-[120px]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Venue-Specific Fields */}
                            {businessProfile?.category === 'venue' && (
                                <>
                                    <div className="pt-4 border-t">
                                        <h3 className="text-lg font-semibold mb-4">Venue Details</h3>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="venue_type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Venue Type</FormLabel>
                                                <FormControl>
                                                    <VenueTypeSelector
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price Range</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select price range" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="$">$ - Budget Friendly</SelectItem>
                                                            <SelectItem value="$$">$$ - Moderate</SelectItem>
                                                            <SelectItem value="$$$">$$$ - Upscale</SelectItem>
                                                            <SelectItem value="$$$$">$$$$ - Luxury</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="guest_capacity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Guest Capacity</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="150"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/business')}
                                    disabled={isSubmitting}
                                >
                                    Skip for Now
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Complete Profile'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
