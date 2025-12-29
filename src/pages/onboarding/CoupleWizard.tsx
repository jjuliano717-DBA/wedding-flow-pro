import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Users, DollarSign, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

// Style quiz images with their corresponding style tags (20 images across 12 categories)
const STYLE_IMAGES = [
    // Intimate (2 images)
    { id: 'intimate-1', url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop&q=80', style: 'Intimate' },
    { id: 'intimate-2', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop&q=80', style: 'Intimate' },

    // Boho (2 images)
    { id: 'boho-1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80', style: 'Boho' },
    { id: 'boho-2', url: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=400&h=400&fit=crop&q=80', style: 'Boho' },

    // Rustic (2 images)
    { id: 'rustic-1', url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=400&fit=crop&q=80', style: 'Rustic' },
    { id: 'rustic-2', url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=400&h=400&fit=crop&q=80', style: 'Rustic' },

    // Unique (2 images)
    { id: 'unique-1', url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop&q=80', style: 'Unique' },
    { id: 'unique-2', url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400&h=400&fit=crop&q=80', style: 'Unique' },

    // Artistic & Thematic (2 images)
    { id: 'artistic-1', url: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=400&h=400&fit=crop&q=80', style: 'Artistic & Thematic' },
    { id: 'artistic-2', url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop&q=80', style: 'Artistic & Thematic' },

    // Nautical (2 images)
    { id: 'nautical-1', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=400&h=400&fit=crop&q=80', style: 'Nautical' },
    { id: 'nautical-2', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop&q=80', style: 'Nautical' },

    // Tropical & Destination (2 images)
    { id: 'tropical-1', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400&h=400&fit=crop&q=80', style: 'Tropical & Destination' },
    { id: 'tropical-2', url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=400&h=400&fit=crop&q=80', style: 'Tropical & Destination' },

    // Romantic (2 images)
    { id: 'romantic-1', url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=400&fit=crop&q=80', style: 'Romantic' },
    { id: 'romantic-2', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=400&fit=crop&q=80', style: 'Romantic' },

    // Garden & Fairytale (2 images)
    { id: 'garden-1', url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=400&h=400&fit=crop&q=80', style: 'Garden & Fairytale' },
    { id: 'garden-2', url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=400&h=400&fit=crop&q=80', style: 'Garden & Fairytale' },

    // Traditional (1 image)
    { id: 'traditional-1', url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=400&h=400&fit=crop&q=80', style: 'Traditional' },

    // Formal (1 image)
    { id: 'formal-1', url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400&h=400&fit=crop&q=80', style: 'Formal' },

    // Modern (1 image)
    { id: 'modern-1', url: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=400&h=400&fit=crop&q=80', style: 'Modern' },

    // Urban (1 image)
    { id: 'urban-1', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop&q=80', style: 'Urban' },
];

interface FormData {
    weddingDate: string;
    location: string;
    budget: number;
    guestCount: number;
    selectedImages: string[];
    calculatedStyle: string;
}

const CoupleWizard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        weddingDate: '',
        location: '',
        budget: 50000,
        guestCount: 100,
        selectedImages: [],
        calculatedStyle: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Validate Step 1
    const validateStep1 = () => {
        if (!formData.weddingDate) {
            toast.error('Please select a wedding date');
            return false;
        }

        const selectedDate = new Date(formData.weddingDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate <= today) {
            toast.error('Wedding date must be in the future');
            return false;
        }

        if (!formData.location.trim()) {
            toast.error('Please enter a location');
            return false;
        }

        return true;
    };

    // Calculate top 1-2 styles from selected images
    const calculateStyle = (selectedImages: string[]) => {
        const styleCounts: Record<string, number> = {};

        selectedImages.forEach(imageId => {
            const image = STYLE_IMAGES.find(img => img.id === imageId);
            if (image) {
                styleCounts[image.style] = (styleCounts[image.style] || 0) + 1;
            }
        });

        // Sort styles by count (descending)
        const sortedStyles = Object.entries(styleCounts)
            .sort(([, a], [, b]) => b - a);

        if (sortedStyles.length === 0) return 'Modern';

        // If top style has 2+ selections, return just that style
        if (sortedStyles[0][1] >= 2) {
            return sortedStyles[0][0];
        }

        // Otherwise, combine top 2 styles
        if (sortedStyles.length >= 2) {
            return `${sortedStyles[0][0]} & ${sortedStyles[1][0]}`;
        }

        return sortedStyles[0][0];
    };

    // Handle image selection
    const toggleImageSelection = (imageId: string) => {
        setFormData(prev => {
            const isSelected = prev.selectedImages.includes(imageId);
            let newSelectedImages: string[];

            if (isSelected) {
                // Deselect
                newSelectedImages = prev.selectedImages.filter(id => id !== imageId);
            } else {
                // Select (max 3)
                if (prev.selectedImages.length >= 3) {
                    toast.error('You can only select 3 images');
                    return prev;
                }
                newSelectedImages = [...prev.selectedImages, imageId];
            }

            return { ...prev, selectedImages: newSelectedImages };
        });
    };

    // Handle next step
    const handleNext = () => {
        if (currentStep === 1) {
            if (!validateStep1()) return;
            setCurrentStep(2);
        } else if (currentStep === 2) {
            if (formData.selectedImages.length !== 3) {
                toast.error('Please select exactly 3 images');
                return;
            }
            const style = calculateStyle(formData.selectedImages);
            setFormData(prev => ({ ...prev, calculatedStyle: style }));
            setCurrentStep(3);
        }
    };

    // Handle previous step
    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    // Save to database
    const handleComplete = async () => {
        if (!user) {
            toast.error('You must be logged in');
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error } = await supabase
                .from('projects')
                .insert({
                    user_id: user.id,
                    name: `${formData.location} Wedding`,
                    wedding_date: formData.weddingDate,
                    location: formData.location,
                    budget_total: formData.budget * 100, // Convert to cents
                    guest_count: formData.guestCount,
                    style: formData.calculatedStyle,
                })
                .select();

            if (error) throw error;

            toast.success('Onboarding complete! Welcome to your wedding planning journey! 🎉');
            navigate('/planner');
        } catch (error: any) {
            console.error('Error saving project:', error);
            toast.error('Failed to save your information. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-12 px-4">
            <div className="container mx-auto max-w-4xl">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        {[1, 2, 3].map(step => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${currentStep >= step
                                    ? 'bg-rose-gold text-white'
                                    : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {currentStep > step ? <Check className="w-5 h-5" /> : step}
                                </div>
                                {step < 3 && (
                                    <div className={`w-24 h-1 mx-2 transition-all ${currentStep > step ? 'bg-rose-gold' : 'bg-gray-200'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Step {currentStep} of 3: {currentStep === 1 ? 'Wedding Details' : currentStep === 2 ? 'Your Style' : 'Complete'}
                        </p>
                    </div>
                </div>

                {/* Step 1: Wedding Details */}
                {currentStep === 1 && (
                    <Card className="animate-fade-in">
                        <CardHeader>
                            <CardTitle className="text-2xl font-serif">Tell us about your big day</CardTitle>
                            <CardDescription>Let's start with the basics</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="weddingDate" className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-rose-gold" />
                                    Wedding Date
                                </Label>
                                <Input
                                    id="weddingDate"
                                    type="date"
                                    value={formData.weddingDate}
                                    onChange={e => setFormData(prev => ({ ...prev, weddingDate: e.target.value }))}
                                    className="text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location" className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-rose-gold" />
                                    Location (City, State)
                                </Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="e.g., Tampa, FL"
                                    value={formData.location}
                                    onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                    className="text-lg"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-rose-gold" />
                                    Budget: ${formData.budget >= 250000 ? '250,000+' : formData.budget.toLocaleString()}
                                </Label>
                                <Slider
                                    value={[formData.budget]}
                                    onValueChange={([value]) => setFormData(prev => ({ ...prev, budget: value }))}
                                    min={5000}
                                    max={250000}
                                    step={5000}
                                    className="py-4"
                                />
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>$5,000</span>
                                    <span>$250,000+</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="guestCount" className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-rose-gold" />
                                    Guest Count
                                </Label>
                                <Input
                                    id="guestCount"
                                    type="number"
                                    min="1"
                                    value={formData.guestCount}
                                    onChange={e => setFormData(prev => ({ ...prev, guestCount: parseInt(e.target.value) || 0 }))}
                                    className="text-lg"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleNext} size="lg" className="bg-rose-gold hover:bg-rose-gold/90">
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 2: Visual Style Quiz */}
                {currentStep === 2 && (
                    <Card className="animate-fade-in">
                        <CardHeader>
                            <CardTitle className="text-2xl font-serif flex items-center gap-2">
                                <Sparkles className="w-6 h-6 text-rose-gold" />
                                What's your vibe?
                            </CardTitle>
                            <CardDescription>Select any 3 images that speak to you (selected: {formData.selectedImages.length}/3)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                {STYLE_IMAGES.map(image => {
                                    const isSelected = formData.selectedImages.includes(image.id);
                                    return (
                                        <div
                                            key={image.id}
                                            onClick={() => toggleImageSelection(image.id)}
                                            className={`relative cursor-pointer rounded-lg overflow-hidden transition-all transform hover:scale-105 ${isSelected ? 'ring-4 ring-rose-gold shadow-xl' : 'ring-2 ring-gray-200'
                                                }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`${image.style} wedding style`}
                                                className="w-full h-48 object-cover"
                                            />
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-rose-gold text-white rounded-full p-1">
                                                    <Check className="w-5 h-5" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                                <p className="text-white text-sm font-medium">{image.style}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button onClick={handlePrevious} variant="outline" size="lg">
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    size="lg"
                                    className="bg-rose-gold hover:bg-rose-gold/90"
                                    disabled={formData.selectedImages.length !== 3}
                                >
                                    Next Step
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Step 3: Complete */}
                {currentStep === 3 && (
                    <Card className="animate-fade-in">
                        <CardHeader>
                            <CardTitle className="text-2xl font-serif">You're all set! 🎉</CardTitle>
                            <CardDescription>Review your information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="bg-rose-50 rounded-lg p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Wedding Date:</span>
                                    <span className="font-semibold">{new Date(formData.weddingDate).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Location:</span>
                                    <span className="font-semibold">{formData.location}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Budget:</span>
                                    <span className="font-semibold">${formData.budget >= 250000 ? '250,000+' : formData.budget.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Guest Count:</span>
                                    <span className="font-semibold">{formData.guestCount}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Your Style:</span>
                                    <span className="font-semibold text-rose-gold">{formData.calculatedStyle}</span>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button onClick={handlePrevious} variant="outline" size="lg">
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleComplete}
                                    size="lg"
                                    className="bg-rose-gold hover:bg-rose-gold/90"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Complete Onboarding'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default CoupleWizard;
