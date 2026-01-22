-- =============================================
-- UX/UI Overhaul - Phase 1: Referral Logic Upgrade
-- Date: 2026-01-21
-- Purpose: Add commission terms to partnerships and refined tracking
-- =============================================

-- 1. Add default_commission_rate to vendor_partnerships
-- This allows partners to agree on a standard rate upfront (The "Handshake")
ALTER TABLE vendor_partnerships 
  ADD COLUMN IF NOT EXISTS default_commission_rate_pct DECIMAL(5,2) DEFAULT 10.00;

-- 2. Add status tracking for referrals pipeline if needed
-- (Already covered by existing status enum, but ensuring 'accepted' is clear)
-- Existing statuses: pending, accepted, declined, completed, pending_payout, paid

-- 3. Add 'client_status' to referrals to track where the lead is in the partner's funnel
ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS partner_lead_status TEXT DEFAULT 'New'; 
  -- e.g., New, Contacted, Booked (Synced from partner's lead status)

-- 4. Notify about changes
DO $$
BEGIN
  RAISE NOTICE '✅ Referral Logic Schema Updated';
  RAISE NOTICE '   - Added default_commission_rate_pct to partnerships';
  RAISE NOTICE '   - Added partner_lead_status to referrals';
END $$;
