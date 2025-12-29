# Phase 4 Migration Instructions

The automated migration via `supabase db push` encountered a conflict with existing policies. Since your database already has the base schema, you only need to run the **Phase 4 migration** to add the financial tables.

## Option 1: Run via Supabase Dashboard (Recommended)

1. Go to your [Supabase SQL Editor](https://supabase.com/dashboard/project/_/sql)
2. Open a new query
3. Copy and paste the contents of `supabase/migrations/20251226_phase_4_finance_contracts.sql`
4. Click "Run" to execute

## Option 2: Run via CLI (Manual Execution)

```bash
# From the project root
npx supabase db execute --file supabase/migrations/20251226_phase_4_finance_contracts.sql --db-url "$YOUR_DATABASE_URL"
```

## What This Migration Creates

- **`quotes` table**: Stores generated quotes from vendors to couples
- **`contracts` table**: Legal agreements with signature tracking
- **`payments` table**: Stripe payment records and transaction history
- **RLS Policies**: Row-level security for vendor/couple data isolation

## Verification

After running, test by:
1. Log in as a **vendor** account
2. Navigate to `/pro/leads`
3. Click "Generate Quote" on a lead
4. Verify the quote appears in `/pro/finance`
5. Switch to a **couple** account and check the "Bookings" tab on the Moodboard

---

The frontend features are already implemented and ready to use once the database tables are created!
