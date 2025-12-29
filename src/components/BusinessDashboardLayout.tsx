/**
 * Business Dashboard Layout
 * 
 * Wrapper component for all business-related routes that integrates with BusinessContext
 * to provide loading states, safety checks, and onboarding enforcement.
 * 
 * @module components/BusinessDashboardLayout
 */

import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { useBusiness } from '@/context/BusinessContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BusinessDashboardLayoutProps {
    children: ReactNode;
}

/**
 * Loading Skeleton for Business Dashboard
 */
function DashboardSkeleton() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-rose-gold" />
            <div className="text-center space-y-2">
                <h3 className="text-lg font-serif font-bold text-brand-navy">Syncing Business Profile...</h3>
                <p className="text-sm text-slate-500">Please wait while we load your business information</p>
            </div>
        </div>
    );
}

/**
 * No Business Profile Message (for non-business roles)
 */
function NoBusinessProfile() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2 text-amber-600 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <CardTitle>No Business Profile Found</CardTitle>
                    </div>
                    <CardDescription>
                        This area is for business accounts only. Your account doesn't have a business profile associated with it.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600">
                        If you're a vendor, planner, or venue owner, please contact support to set up your business profile.
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.location.href = '/'}>
                            Go to Homepage
                        </Button>
                        <Button onClick={() => window.location.href = '/join-vendor'}>
                            Register as Vendor
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

/**
 * Business Dashboard Layout Component
 * 
 * Handles:
 * - Loading states while BusinessContext syncs
 * - Safety checks for non-business roles
 * - Onboarding enforcement for incomplete profiles
 * - Prevents infinite redirect loops
 */
export function BusinessDashboardLayout({ children }: BusinessDashboardLayoutProps) {
    const { user } = useAuth();
    const { businessProfile, isLoading, error } = useBusiness();
    const location = useLocation();

    // Critical: Show loading skeleton while syncing
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    // Safety Check: Handle non-business roles gracefully
    // If user is authenticated but has no business profile (e.g., couple role)
    if (!businessProfile && user) {
        const businessRoles = ['vendor', 'planner', 'venue', 'admin'];

        // If user has a business role but no profile, show error
        if (businessRoles.includes(user.role)) {
            return (
                <div className="flex items-center justify-center min-h-[60vh]">
                    <Card className="max-w-md border-red-200">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-red-600 mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <CardTitle>Profile Sync Error</CardTitle>
                            </div>
                            <CardDescription>
                                {error || 'Unable to load your business profile. Please try refreshing the page.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => window.location.reload()} className="w-full">
                                Refresh Page
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            );
        }

        // User is not a business role (e.g., couple)
        return <NoBusinessProfile />;
    }

    // Onboarding Enforcement: Check if profile is incomplete
    if (businessProfile) {
        const isIncomplete =
            !businessProfile.name ||
            !businessProfile.contact_email;

        // Prevent infinite redirect loop: don't redirect if already on onboarding page
        const isOnOnboardingPage = location.pathname === '/business/onboarding' ||
            location.pathname === '/onboarding';

        if (isIncomplete && !isOnOnboardingPage) {
            // Redirect to onboarding to complete profile
            return <Navigate to="/business/onboarding" replace />;
        }
    }

    // All checks passed - render children
    return <>{children}</>;
}
