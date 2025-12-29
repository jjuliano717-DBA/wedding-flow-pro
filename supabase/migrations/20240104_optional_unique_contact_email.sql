-- =====================================================
-- Migration: Add Unique Constraint to contact_email
-- File: 20240104_add_unique_contact_email.sql
-- =====================================================
-- 
-- Decision: contact_email should be UNIQUE
-- This enforces one business per contact email address for MVP simplicity
--
-- Current State: vendors.contact_email exists but is NOT unique
-- Change: Add UNIQUE constraint
--
-- =====================================================

-- Step 1: Check for existing duplicates (IMPORTANT - run this first!)
-- If this returns any rows, you must resolve duplicates before adding constraint
SELECT contact_email, COUNT(*) as duplicate_count, array_agg(id) as vendor_ids
FROM vendors 
WHERE contact_email IS NOT NULL
GROUP BY contact_email 
HAVING COUNT(*) > 1;

-- Step 2: Add the unique constraint
-- This will fail if duplicates exist - resolve them first
ALTER TABLE vendors 
ADD CONSTRAINT vendors_contact_email_key UNIQUE (contact_email);

-- Step 3: Verify the constraint was added successfully
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'public.vendors'::regclass 
  AND conname = 'vendors_contact_email_key';

-- Step 4: Add comment for documentation
COMMENT ON CONSTRAINT vendors_contact_email_key ON vendors 
IS 'Ensures one business per contact email for MVP simplicity and clean ownership matching';

-- =====================================================
-- NOTES:
-- =====================================================
-- 
-- Benefits of unique constraint:
-- ✅ Simpler for MVP
-- ✅ Prevents confusion about which business belongs to which email
-- ✅ Easier to match users to businesses via email
-- ✅ Cleaner data integrity
--
-- If duplicates exist, resolve them by either:
-- 1. Updating duplicate entries to use different emails
-- 2. Deleting duplicate/test entries
-- 3. Merging duplicate businesses (if appropriate)
--
-- =====================================================
