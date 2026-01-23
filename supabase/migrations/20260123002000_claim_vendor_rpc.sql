-- =====================================================
-- Secure Vendor Claim RPC Function
-- =====================================================
-- This function allows authenticated users to claim
-- unclaimed vendor profiles with proper security checks
-- =====================================================

CREATE OR REPLACE FUNCTION claim_vendor_profile(
    p_vendor_id UUID,
    p_claim_token UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_user_id UUID;
    v_vendor RECORD;
    v_result JSON;
BEGIN
    -- Get the authenticated user ID
    v_user_id := (SELECT auth.uid());
    
    -- Check if user is authenticated
    IF v_user_id IS NULL THEN
        RETURN json_build_object(
            'success', false,
            'error', 'User must be authenticated to claim a venue'
        );
    END IF;

    -- Get vendor details with FOR UPDATE lock to prevent race conditions
    SELECT * INTO v_vendor
    FROM vendors
    WHERE id = p_vendor_id
    FOR UPDATE;

    -- Check if vendor exists
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Venue not found'
        );
    END IF;

    -- Check if already claimed
    IF v_vendor.is_claimed = true THEN
        RETURN json_build_object(
            'success', false,
            'error', 'This venue has already been claimed'
        );
    END IF;

    -- Verify claim token matches
    IF v_vendor.claim_token IS NULL OR v_vendor.claim_token != p_claim_token THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Invalid claim token. Please use the claim link from the venue page.'
        );
    END IF;

    -- All checks passed, claim the venue
    UPDATE vendors
    SET 
        owner_id = v_user_id,
        is_claimed = true,
        claim_token = NULL,
        updated_at = NOW()
    WHERE id = p_vendor_id;

    -- Return success
    RETURN json_build_object(
        'success', true,
        'vendor_id', p_vendor_id,
        'message', 'Venue successfully claimed! Welcome to Wedding Flow Pro.'
    );

EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'An unexpected error occurred. Please try again or contact support.'
        );
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION claim_vendor_profile IS 
'Securely claims an unclaimed vendor profile for the authenticated user. 
Validates claim token and ensures venue has not already been claimed.';

-- =====================================================
-- Summary:
-- ✅ Created secure RPC function with SECURITY DEFINER
-- ✅ Validates user authentication
-- ✅ Verifies claim token matches
-- ✅ Prevents claiming already-claimed venues
-- ✅ Uses row-level locking to prevent race conditions
-- ✅ Clears claim_token after successful claim
-- ✅ Returns detailed success/error messages
-- =====================================================
