import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Building2, Shield, ChevronRight, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

type Step = 'verification' | 'authentication' | 'processing' | 'success';

export default function ClaimBusiness() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user, signIn, signUp } = useAuth();

    const [currentStep, setCurrentStep] = useState<Step>('verification');
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [claimError, setClaimError] = useState<string | null>(null);

    // Auth form state
    const [isSignup, setIsSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const venueId = searchParams.get('venue_id');

    // Fetch venue details
    useEffect(() => {
        const fetchVenue = async () => {
            if (!venueId) {
                setError('No venue ID provided. Please use the claim button from the venue page.');
                setLoading(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('vendors')
                    .select('id, name, location, street_address, is_claimed, claim_token')
                    .eq('id', venueId)
                    .single();

                if (error) throw error;

                if (!data) {
                    setError('Venue not found. Please check the link and try again.');
                    return;
                }

                if (data.is_claimed) {
                    setError('This venue has already been claimed. If you believe this is an error, please contact support.');
                    return;
                }

                setVenue(data);

                // If user is already authenticated, skip to verification
                if (user) {
                    setCurrentStep('verification');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load venue details.');
            } finally {
                setLoading(false);
            }
        };

        fetchVenue();
    }, [venueId, user]);

    // Handle authentication
    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        setClaimError(null);

        try {
            if (isSignup) {
                const { error } = await signUp(email, password, {
                    full_name: fullName,
                    role: 'venue',
                });
                if (error) throw error;
            } else {
                const { error } = await signIn(email, password);
                if (error) throw error;
            }

            // Move to processing step after successful auth
            setCurrentStep('processing');
            await processClaim();
        } catch (err: any) {
            setClaimError(err.message || 'Authentication failed. Please try again.');
        } finally {
            setAuthLoading(false);
        }
    };

    // Process the claim via RPC
    const processClaim = async () => {
        if (!venue || !user) return;

        setCurrentStep('processing');
        setClaimError(null);

        try {
            const { data, error } = await supabase.rpc('claim_vendor_profile', {
                p_vendor_id: venue.id,
                p_claim_token: venue.claim_token,
            });

            if (error) throw error;

            const result = typeof data === 'string' ? JSON.parse(data) : data;

            if (!result.success) {
                throw new Error(result.error || 'Failed to claim venue');
            }

            // Success! Show success step
            setCurrentStep('success');

            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                navigate('/pro/dashboard?welcome=true');
            }, 3000);
        } catch (err: any) {
            setClaimError(err.message || 'Failed to claim venue. Please try again.');
            setCurrentStep('verification');
        }
    };

    // Handle confirm ownership click
    const handleConfirmOwnership = () => {
        if (!user) {
            setCurrentStep('authentication');
        } else {
            processClaim();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                            <AlertCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <CardTitle>Unable to Process Claim</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => navigate('/venues')} className="w-full">
                            Back to Venues
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Progress Indicator */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2">
                        <StepIndicator active={currentStep === 'verification'} completed={['authentication', 'processing', 'success'].includes(currentStep)} number={1} label="Verify" />
                        <div className="w-12 h-0.5 bg-border" />
                        <StepIndicator active={currentStep === 'authentication'} completed={['processing', 'success'].includes(currentStep)} number={2} label="Authenticate" />
                        <div className="w-12 h-0.5 bg-border" />
                        <StepIndicator active={currentStep === 'processing'} completed={currentStep === 'success'} number={3} label="Claim" />
                        <div className="w-12 h-0.5 bg-border" />
                        <StepIndicator active={currentStep === 'success'} completed={false} number={4} label="Success" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Verification */}
                    {currentStep === 'verification' && (
                        <motion.div
                            key="verification"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                        <Building2 className="w-8 h-8 text-primary" />
                                    </div>
                                    <CardTitle className="text-2xl">Claim Your Business</CardTitle>
                                    <CardDescription>
                                        Verify that you are the owner of this venue
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted rounded-lg p-4">
                                        <h3 className="font-semibold text-lg mb-1">{venue?.name}</h3>
                                        <p className="text-sm text-muted-foreground">{venue?.street_address || venue?.location}</p>
                                    </div>

                                    {claimError && (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{claimError}</AlertDescription>
                                        </Alert>
                                    )}

                                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium mb-1">By claiming this business, you confirm that:</p>
                                                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                                    <li>You are the legal owner or authorized representative</li>
                                                    <li>You have permission to manage this business profile</li>
                                                    <li>The information you provide will be accurate</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex gap-3">
                                    <Button variant="outline" onClick={() => navigate(-1)} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleConfirmOwnership} className="flex-1">
                                        I am the owner
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 2: Authentication */}
                    {currentStep === 'authentication' && (
                        <motion.div
                            key="authentication"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {isSignup ? 'Create Your Account' : 'Sign In'}
                                    </CardTitle>
                                    <CardDescription>
                                        {isSignup
                                            ? 'Create an account to manage your venue profile'
                                            : 'Sign in to complete the claim process'}
                                    </CardDescription>
                                </CardHeader>
                                <form onSubmit={handleAuth}>
                                    <CardContent className="space-y-4">
                                        {claimError && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{claimError}</AlertDescription>
                                            </Alert>
                                        )}

                                        {isSignup && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium">Full Name</label>
                                                <Input
                                                    type="text"
                                                    placeholder="John Doe"
                                                    value={fullName}
                                                    onChange={(e) => setFullName(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Email</label>
                                            <Input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Password</label>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex-col gap-4">
                                        <Button type="submit" className="w-full" disabled={authLoading}>
                                            {authLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            {isSignup ? 'Create Account & Claim' : 'Sign In & Claim'}
                                        </Button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSignup(!isSignup);
                                                setClaimError(null);
                                            }}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
                                        </button>
                                    </CardFooter>
                                </form>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 3: Processing */}
                    {currentStep === 'processing' && (
                        <motion.div
                            key="processing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                                    <h3 className="text-xl font-semibold mb-2">Processing Your Claim</h3>
                                    <p className="text-muted-foreground text-center">
                                        Please wait while we verify and complete your business claim...
                                    </p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {/* Step 4: Success */}
                    {currentStep === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                                        <Check className="w-10 h-10 text-green-500" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2">Venue Successfully Claimed!</h3>
                                    <p className="text-muted-foreground mb-6 max-w-md">
                                        Congratulations! You can now manage your venue profile, respond to inquiries, and connect with couples.
                                    </p>
                                    <div className="text-sm text-muted-foreground">
                                        Redirecting to your dashboard...
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// Step Indicator Component
function StepIndicator({ active, completed, number, label }: { active: boolean; completed: boolean; number: number; label: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${completed
                    ? 'bg-primary text-primary-foreground'
                    : active
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
            >
                {completed ? <Check className="w-5 h-5" /> : number}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{label}</span>
        </div>
    );
}
