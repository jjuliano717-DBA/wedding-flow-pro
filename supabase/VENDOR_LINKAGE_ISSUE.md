# Vendor Linkage Issue - Root Cause Analysis

## Problem Summary
The business "Jason Juliano" with contact email `info@mosquitofl.com` was not properly linked to the user profile during signup.

## Root Cause

### Issue 1: Signup Trigger Not Using Business Name
**Location**: `supabase/migrations/20240107_auto_create_vendor_profiles.sql` (line 46)

The `handle_new_user()` trigger function was creating vendor records with a hardcoded generic name:

```sql
business_name = 'Business for ' || NEW.email,  -- WRONG: Ignores actual business name
```

Even though the frontend (`AuthContext.tsx` line 156) was correctly sending:
```typescript
data: {
    business_name: userData.businessName,  // Sent but ignored!
}
```

### Issue 2: Profile Role Changed to 'planner'
The `info@mosquitofl.com` profile somehow had its role changed from `vendor` to `planner`, causing redirects to `/planner` instead of `/pro/*` routes.

## Impact
- Vendor records created with generic names like "Business for info@mosquitofl.com"
- No connection between the intended business name and the vendor record
- Users couldn't access `/pro/leads`, `/pro/finance`, or `/pro/contracts`

## Solution

### Fix 1: Immediate Linkage Repair
**Script**: `supabase/fix_mosquito_linkage.sql`

This script:
1. Finds the profile for `info@mosquitofl.com`
2. Links or updates the vendor record with the correct business name "Jason Juliano"
3. Corrects the role back to `vendor`
4. Handles all edge cases (existing vendor, orphaned vendor, or new vendor)

### Fix 2: Improve Signup Trigger
**Migration**: `supabase/migrations/20251226_fix_signup_trigger_business_name.sql`

Updates `handle_new_user()` to:
```sql
-- Now CORRECTLY uses the business_name from signup metadata
business_name = COALESCE(business_name_value, 'Business for ' || NEW.email)
```

Also properly handles `couple_names` for couple signups.

## How to Apply Fixes

### Step 1: Fix Current Account (URGENT)
Run in Supabase SQL Editor:
```bash
cat supabase/fix_mosquito_linkage.sql
```

### Step 2: Fix Future Signups
Run in Supabase SQL Editor:
```bash
cat supabase/migrations/20251226_fix_signup_trigger_business_name.sql
```

### Step 3: Verify
```sql
SELECT 
    p.email,
    p.role,
    v.name as vendor_name,
    v.business_name,
    v.owner_id
FROM profiles p
LEFT JOIN vendors v ON v.owner_id = p.id
WHERE p.email = 'info@mosquitofl.com';
```

Expected result:
- `role`: `vendor`
- `vendor_name`: `Jason Juliano`
- `business_name`: `Jason Juliano`
- `owner_id`: (should match profile ID)

## Prevention
The improved trigger now:
✅ Uses actual business names from signup
✅ Uses couple names for couple signups
✅ Falls back to generic names only if metadata is missing

All future signups will work correctly!
