/**
 * Business Context Provider
 * 
 * Makes the application "Business Aware" globally by automatically linking
 * authenticated users to their business profiles based on email matching.
 * 
 * @module context/BusinessContext
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import {
    linkUserToBusiness,
    getBusinessProfileByUserId
} from '@/lib/actions/link-business-profile';
import type { BusinessProfile } from '@/lib/types/business-profile';

interface BusinessContextType {
    businessProfile: BusinessProfile | null;
    isLoading: boolean;
    error: string | null;
    refreshBusinessProfile: () => Promise<void>;
    clearError: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const [businessProfile, setBusinessProfile] = useState<BusinessProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Auto-link business profile when user authenticates
     * Triggers whenever the user object changes
     */
    useEffect(() => {
        // Guard: If no user, reset state and return
        if (!user || !isAuthenticated) {
            setBusinessProfile(null);
            setIsLoading(false);
            setError(null);
            return;
        }

        // Only attempt linking for business roles
        const businessRoles = ['vendor', 'planner', 'venue'];
        if (!businessRoles.includes(user.role)) {
            setBusinessProfile(null);
            setIsLoading(false);
            return;
        }

        // Execute auto-linking
        linkBusinessProfile();
    }, [user, isAuthenticated]);

    /**
     * Link or fetch business profile for the current user
     */
    const linkBusinessProfile = async () => {
        if (!user?.id || !user?.email) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Attempt to link user to business profile
            const result = await linkUserToBusiness({
                userEmail: user.email,
                userId: user.id,
                userRole: user.role, // Pass role to set category
            });

            switch (result.status) {
                case 'claimed':
                    // User claimed an existing unclaimed business profile
                    toast.success('Business profile claimed successfully!');
                    await fetchBusinessProfile(user.id);
                    break;

                case 'created':
                    // New business profile was created
                    toast.success('Business profile created! Please complete your profile.');
                    await fetchBusinessProfile(user.id);
                    break;

                case 'linked':
                    // Profile already linked, just fetch it
                    await fetchBusinessProfile(user.id);
                    break;

                case 'error':
                    // Error occurred during linking
                    setError(result.message);
                    toast.error(result.message);
                    console.error('Business linking error:', result.error);
                    break;
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to link business profile';
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Unexpected error in linkBusinessProfile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Fetch the full business profile from the database
     */
    const fetchBusinessProfile = async (userId: string) => {
        try {
            const profile = await getBusinessProfileByUserId(userId);

            if (profile) {
                setBusinessProfile(profile);
            } else {
                setError('Business profile not found');
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch business profile';
            setError(errorMessage);
            console.error('Error fetching business profile:', err);
        }
    };

    /**
     * Manually refresh the business profile
     * Useful after profile updates
     */
    const refreshBusinessProfile = async () => {
        if (!user?.id) return;

        setIsLoading(true);
        setError(null);

        try {
            await fetchBusinessProfile(user.id);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Clear error state
     */
    const clearError = () => {
        setError(null);
    };

    return (
        <BusinessContext.Provider
            value={{
                businessProfile,
                isLoading,
                error,
                refreshBusinessProfile,
                clearError,
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
};

/**
 * Custom hook to consume Business Context
 * 
 * @throws Error if used outside of BusinessProvider
 * 
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { businessProfile, isLoading } = useBusiness();
 *   
 *   if (isLoading) return <Spinner />;
 *   if (!businessProfile) return <CreateProfilePrompt />;
 *   
 *   return <div>{businessProfile.business_name}</div>;
 * }
 * ```
 */
export const useBusiness = () => {
    const context = useContext(BusinessContext);

    if (context === undefined) {
        throw new Error('useBusiness must be used within a BusinessProvider');
    }

    return context;
};
