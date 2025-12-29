/**
 * Venue Profile Form Component
 * 
 * Comprehensive form for editing venue profile with all required fields
 */

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { VENUE_TYPES } from "@/lib/constants/venue-types";
import { GoogleBusinessImporter } from "@/components/GoogleBusinessImporter";
import type { VenueData } from "@/lib/utils/google-places";

interface VenueProfileFormProps {
    formData: {
        business_name: string;
        description: string;
        location: string;
        street_address: string;
        website: string;
        google_business_url: string;
        guest_capacity: number;
        contact_phone: string;
        contact_email: string;
        price_range: string;
        service_zipcodes: string;
        venue_type: string;
        amenities: string; // comma-separated
        faqs: { question: string; answer: string }[]; // JSON array
    };
    onChange: (field: string, value: any) => void;
    role: string;
}

export function VenueProfileForm({ formData, onChange, role }: VenueProfileFormProps) {
    const handleGoogleImport = (data: Partial<VenueData>) => {
        console.log('Google Places data received:', data);

        // Build the updates object
        const updates: Record<string, any> = {};

        if (data.business_name) {
            console.log('Setting business_name:', data.business_name);
            updates.business_name = data.business_name;
        }
        if (data.location) {
            console.log('Setting location:', data.location);
            updates.location = data.location;
        }
        if (data.street_address) {
            console.log('Setting street_address:', data.street_address);
            updates.street_address = data.street_address;
        }
        if (data.contact_phone) {
            console.log('Setting contact_phone:', data.contact_phone);
            updates.contact_phone = data.contact_phone;
        }
        if (data.website) {
            console.log('Setting website:', data.website);
            updates.website = data.website;
        }
        if (data.description) {
            console.log('Setting description:', data.description);
            updates.description = data.description;
        }
        if (data.google_business_url) {
            console.log('Setting google_business_url:', data.google_business_url);
            updates.google_business_url = data.google_business_url;
        }
        if (data.google_rating !== undefined) {
            console.log('Setting google_rating:', data.google_rating);
            updates.google_rating = data.google_rating;
        }
        if (data.google_reviews !== undefined) {
            console.log('Setting google_reviews:', data.google_reviews);
            updates.google_reviews = data.google_reviews;
        }

        // Apply all updates at once using functional setState
        console.log('Applying updates:', updates);

        // Call onChange for each field to properly update parent state
        Object.entries(updates).forEach(([field, value]) => {
            onChange(field, value);
        });

        console.log('All updates applied');
    };

    return (
        <div className="space-y-6">
            {/* Google Business Importer Section */}
            {role === 'venue' && (
                <div className="space-y-4">
                    <GoogleBusinessImporter
                        onImport={handleGoogleImport}
                        currentUrl={formData.google_business_url}
                    />

                    <div className="space-y-2">
                        <Label htmlFor="google_business_url">Google Business URL (Optional)</Label>
                        <Input
                            id="google_business_url"
                            placeholder="https://g.page/your-business"
                            value={formData.google_business_url}
                            onChange={(e) => onChange('google_business_url', e.target.value)}
                        />
                        <p className="text-xs text-slate-500">
                            Save your Google Business Profile URL for reference
                        </p>
                    </div>
                </div>
            )}

            {/* Basic Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-brand-navy">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="business_name">Business Name</Label>
                        <Input
                            id="business_name"
                            value={formData.business_name}
                            onChange={(e) => onChange('business_name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="location">Location (City, State)</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <Input
                                id="location"
                                className="pl-9"
                                placeholder="Austin, TX"
                                value={formData.location}
                                onChange={(e) => onChange('location', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="street_address">Street Address</Label>
                        <Input
                            id="street_address"
                            placeholder="123 Main Street"
                            value={formData.street_address}
                            onChange={(e) => onChange('street_address', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            className="h-24"
                            placeholder="Tell couples about your venue..."
                            value={formData.description}
                            onChange={(e) => onChange('description', e.target.value)}
                        />
                    </div>

                    {/* Venue-specific fields */}
                    {role === 'venue' && (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="venue_type">Venue Type</Label>
                                <Select
                                    value={formData.venue_type}
                                    onValueChange={(value) => onChange('venue_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select venue type" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {VENUE_TYPES.map((category) => (
                                            <div key={category.category}>
                                                <div className="px-2 py-1.5 text-xs font-semibold text-slate-500">
                                                    {category.category}
                                                </div>
                                                {category.types.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </div>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guest_capacity">Guest Capacity</Label>
                                <Input
                                    id="guest_capacity"
                                    type="number"
                                    placeholder="150"
                                    value={formData.guest_capacity}
                                    onChange={(e) => onChange('guest_capacity', parseInt(e.target.value) || 0)}
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="price_range">Price Range</Label>
                        <Select
                            value={formData.price_range}
                            onValueChange={(value) => onChange('price_range', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select price range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="$">$ (Affordable)</SelectItem>
                                <SelectItem value="$$">$$ (Moderate)</SelectItem>
                                <SelectItem value="$$$">$$$ (Premium)</SelectItem>
                                <SelectItem value="$$$$">$$$$ (Luxury)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {role !== 'venue' && (
                        <div className="space-y-2">
                            <Label htmlFor="guest_capacity">Guest Capacity</Label>
                            <Input
                                id="guest_capacity"
                                type="number"
                                value={formData.guest_capacity}
                                onChange={(e) => onChange('guest_capacity', parseInt(e.target.value) || 0)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
                <h3 className="text-lg font-serif font-bold text-brand-navy">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contact_email">Public Contact Email</Label>
                        <Input
                            id="contact_email"
                            type="email"
                            placeholder="info@yourvenue.com"
                            value={formData.contact_email}
                            onChange={(e) => onChange('contact_email', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact_phone">Public Phone Number</Label>
                        <Input
                            id="contact_phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.contact_phone}
                            onChange={(e) => onChange('contact_phone', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input
                            id="website"
                            type="url"
                            placeholder="https://www.yourvenue.com"
                            value={formData.website}
                            onChange={(e) => onChange('website', e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Service Area (Venue only) */}
            {role === 'venue' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-brand-navy">Service Area</h3>
                    <div className="space-y-2">
                        <Label htmlFor="service_zipcodes">Service Zipcodes</Label>
                        <Input
                            id="service_zipcodes"
                            placeholder="78701, 78702, 78703"
                            value={formData.service_zipcodes}
                            onChange={(e) => onChange('service_zipcodes', e.target.value)}
                        />
                        <p className="text-xs text-slate-500">
                            Enter zipcodes separated by commas
                        </p>
                    </div>
                </div>
            )}

            {/* Amenities & Features (Venue only) */}
            {role === 'venue' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-brand-navy">Amenities & Features</h3>
                    <div className="space-y-2">
                        <Label htmlFor="amenities">Amenities</Label>
                        <Textarea
                            id="amenities"
                            placeholder="Parking, WiFi, Outdoor Ceremony Space, Bridal Suite, Kitchen"
                            value={formData.amenities}
                            onChange={(e) => onChange('amenities', e.target.value)}
                            className="h-24"
                        />
                        <p className="text-xs text-slate-500">
                            Enter amenities separated by commas
                        </p>
                    </div>
                </div>
            )}

            {/* Frequently Asked Questions (Venue only) */}
            {role === 'venue' && (
                <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-brand-navy">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        {formData.faqs && formData.faqs.length > 0 ? (
                            formData.faqs.map((faq, index) => (
                                <div key={index} className="p-4 border border-slate-200 rounded-lg space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-slate-600">FAQ #{index + 1}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                const newFaqs = formData.faqs.filter((_, i) => i !== index);
                                                onChange('faqs', newFaqs);
                                            }}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`faq-question-${index}`}>Question</Label>
                                        <Input
                                            id={`faq-question-${index}`}
                                            placeholder="What is included in the rental fee?"
                                            value={faq.question}
                                            onChange={(e) => {
                                                const newFaqs = [...formData.faqs];
                                                newFaqs[index] = { ...newFaqs[index], question: e.target.value };
                                                onChange('faqs', newFaqs);
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor={`faq-answer-${index}`}>Answer</Label>
                                        <Textarea
                                            id={`faq-answer-${index}`}
                                            placeholder="Tables, chairs, and basic linens are typically included."
                                            value={faq.answer}
                                            onChange={(e) => {
                                                const newFaqs = [...formData.faqs];
                                                newFaqs[index] = { ...newFaqs[index], answer: e.target.value };
                                                onChange('faqs', newFaqs);
                                            }}
                                            className="h-20"
                                        />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">No FAQs added yet. Click below to add your first FAQ.</p>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                const newFaqs = [...(formData.faqs || []), { question: '', answer: '' }];
                                onChange('faqs', newFaqs);
                            }}
                            className="w-full"
                        >
                            + Add FAQ
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
