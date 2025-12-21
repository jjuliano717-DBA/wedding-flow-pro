/**
 * Email Service Utility
 * Sends emails via Supabase Edge Function using Resend
 */

import { supabase } from './supabase';

interface SendInquiryEmailParams {
    vendorName: string;
    vendorEmail: string;
    contactName: string;
    contactEmail: string;
    eventDate?: string;
    guestCount?: number;
    message: string;
}

interface SendWelcomeEmailParams {
    contactName: string;
    contactEmail: string;
}

/**
 * Send inquiry notification to vendor and confirmation to couple
 */
export async function sendInquiryEmails(params: SendInquiryEmailParams) {
    const { vendorName, vendorEmail, contactName, contactEmail, eventDate, guestCount, message } = params;

    try {
        // Send notification to vendor
        const vendorResult = await supabase.functions.invoke('send-inquiry-email', {
            body: {
                type: 'vendor_notification',
                vendor_name: vendorName,
                vendor_email: vendorEmail,
                contact_name: contactName,
                contact_email: contactEmail,
                event_date: eventDate,
                guest_count: guestCount,
                message,
            },
        });

        if (vendorResult.error) {
            console.error('Failed to send vendor notification:', vendorResult.error);
        }

        // Send confirmation to couple
        const confirmResult = await supabase.functions.invoke('send-inquiry-email', {
            body: {
                type: 'confirmation',
                vendor_name: vendorName,
                contact_name: contactName,
                contact_email: contactEmail,
            },
        });

        if (confirmResult.error) {
            console.error('Failed to send confirmation:', confirmResult.error);
        }

        return {
            success: !vendorResult.error && !confirmResult.error,
            vendorNotified: !vendorResult.error,
            confirmationSent: !confirmResult.error,
        };
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, error };
    }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(params: SendWelcomeEmailParams) {
    const { contactName, contactEmail } = params;

    try {
        const result = await supabase.functions.invoke('send-inquiry-email', {
            body: {
                type: 'welcome',
                contact_name: contactName,
                contact_email: contactEmail,
            },
        });

        if (result.error) {
            console.error('Failed to send welcome email:', result.error);
            return { success: false, error: result.error };
        }

        return { success: true };
    } catch (error) {
        console.error('Welcome email error:', error);
        return { success: false, error };
    }
}
