/**
 * Business Profile Linking Action
 * 
 * This function acts as the bridge between Auth and Business Data.
 * It handles claiming, linking, and creating business profiles based on email matching.
 * 
 * @module lib/actions/link-business-profile
 */

import { supabase } from '@/lib/supabase';
import type {
    LinkBusinessProfileResult,
    LinkBusinessProfileInput,
    BusinessProfile
} from '@/lib/types/business-profile';

/**
 * Links a user to their business profile based on email matching
 * 
 * Logic Flow:
 * 1. Query vendors table where contact_email matches userEmail
 * 2. If match found:
 *    - If owner_id is null: CLAIM IT (update with userId)
 *    - If owner_id matches userId: ALREADY LINKED (return success)
 *    - If owner_id is different: CONFLICT (return error)
 * 3. If no match: CREATE NEW business profile
 * 
 * @param input - Object containing userEmail and userId
 * @returns Promise with status and profileId or error message
 * 
 * @example
 * ```typescript
 * const result = await linkUserToBusiness({
 *   userEmail: 'vendor@example.com',
 *   userId: 'auth-user-id-123'
 * });
 * 
 * if (result.status === 'claimed') {
 *   console.log('Business profile claimed!', result.profileId);
 * }
 * ```
 */
export async function linkUserToBusiness(
    input: LinkBusinessProfileInput
): Promise<LinkBusinessProfileResult> {
    const { userEmail, userId, userRole } = input;

    // Validate inputs
    if (!userEmail || !userId) {
        return {
            status: 'error',
            message: 'Missing required fields: userEmail and userId are required',
        };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return {
            status: 'error',
            message: 'Invalid email format',
        };
    }

    try {
        // Step A: Query vendors table where contact_email matches userEmail
        const { data: profile, error: queryError } = await supabase
            .from('vendors')
            .select('*')
            .eq('contact_email', userEmail)
            .maybeSingle(); // Use maybeSingle() to handle 0 or 1 results gracefully

        if (queryError) {
            console.error('Error querying business profile:', queryError);
            return {
                status: 'error',
                message: 'Failed to query business profile',
                error: queryError,
            };
        }

        // Step C: No Match - CREATE NEW business profile
        if (!profile) {
            const { data: newProfile, error: insertError } = await supabase
                .from('vendors')
                .insert({
                    contact_email: userEmail,
                    owner_id: userId,
                    name: `Business for ${userEmail}`, // Default name, can be updated later
                    category: userRole || 'vendor', // Use userRole or default to 'vendor'
                })
                .select()
                .single();

            if (insertError) {
                console.error('Error creating business profile:', insertError);
                return {
                    status: 'error',
                    message: 'Failed to create business profile',
                    error: insertError,
                };
            }

            return {
                status: 'created',
                profileId: newProfile.id,
                message: 'New business profile created successfully',
            };
        }

        // Step B: Match Found - Check ownership status

        // Case 1: owner_id is null - CLAIM IT
        if (!profile.owner_id) {
            const { data: updatedProfile, error: updateError } = await supabase
                .from('vendors')
                .update({ owner_id: userId })
                .eq('id', profile.id)
                .select()
                .single();

            if (updateError) {
                console.error('Error claiming business profile:', updateError);
                return {
                    status: 'error',
                    message: 'Failed to claim business profile',
                    error: updateError,
                };
            }

            return {
                status: 'claimed',
                profileId: updatedProfile.id,
                message: 'Business profile claimed successfully',
            };
        }

        // Case 2: owner_id matches current userId - ALREADY LINKED
        if (profile.owner_id === userId) {
            return {
                status: 'linked',
                profileId: profile.id,
                message: 'Business profile already linked to this user',
            };
        }

        // Case 3: owner_id is different - CONFLICT
        return {
            status: 'error',
            message: 'This email is already claimed by another user account',
        };

    } catch (error) {
        console.error('Unexpected error in linkUserToBusiness:', error);
        return {
            status: 'error',
            message: 'An unexpected error occurred',
            error,
        };
    }
}

/**
 * Get business profile by user ID
 * 
 * @param userId - The authenticated user's ID
 * @returns Promise with business profile or null
 */
export async function getBusinessProfileByUserId(
    userId: string
): Promise<BusinessProfile | null> {
    try {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('owner_id', userId)
            .maybeSingle();

        if (error) {
            console.error('Error fetching business profile:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error in getBusinessProfileByUserId:', error);
        return null;
    }
}

/**
 * Get business profile by contact email
 * 
 * @param email - The contact email to search for
 * @returns Promise with business profile or null
 */
export async function getBusinessProfileByEmail(
    email: string
): Promise<BusinessProfile | null> {
    try {
        const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('contact_email', email)
            .maybeSingle();

        if (error) {
            console.error('Error fetching business profile by email:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Unexpected error in getBusinessProfileByEmail:', error);
        return null;
    }
}
