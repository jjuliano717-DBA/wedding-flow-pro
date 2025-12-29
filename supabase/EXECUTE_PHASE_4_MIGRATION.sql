-- ==================================================================
-- PHASE 4: FINANCIAL ENGINE & CONTRACTS - STANDALONE MIGRATION
-- ==================================================================
-- This script can be executed directly in the Supabase SQL Editor
-- It includes safety checks to avoid conflicts with existing schema
-- ==================================================================

-- 1. QUOTES TABLE
-- Stores vendor quotes sent to couples based on swipe inquiries
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED')),
    items JSONB DEFAULT '[]', -- Array of { description: string, quantity: number, unit_price: number (in cents) }
    subtotal_cents INTEGER DEFAULT 0,
    tax_cents INTEGER DEFAULT 0,
    service_fee_cents INTEGER DEFAULT 0,
    grand_total_cents INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CONTRACTS TABLE
-- Legal agreements with signature tracking
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'SIGNED', 'EXPIRED')),
    contract_text TEXT NOT NULL,
    couple_signature TEXT,
    vendor_signature TEXT,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PAYMENTS TABLE
-- Stripe payment records and transaction history
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    stripe_payment_intent_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_type TEXT DEFAULT 'DEPOSIT', -- DEPOSIT, FULL, RETAINER
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==================================================================
-- ROW LEVEL SECURITY POLICIES
-- ==================================================================

-- QUOTES RLS
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (idempotent)
DROP POLICY IF EXISTS "Vendors can manage their own quotes" ON quotes;
DROP POLICY IF EXISTS "Users can view quotes sent to them" ON quotes;

CREATE POLICY "Vendors can manage their own quotes"
ON quotes FOR ALL
USING (EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = quotes.vendor_id AND v.owner_id = auth.uid()
));

CREATE POLICY "Users can view quotes sent to them"
ON quotes FOR SELECT
USING (auth.uid() = user_id);

-- CONTRACTS RLS
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendors can manage their own contracts" ON contracts;
DROP POLICY IF EXISTS "Users can view and sign their own contracts" ON contracts;

CREATE POLICY "Vendors can manage their own contracts"
ON contracts FOR ALL
USING (EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = contracts.vendor_id AND v.owner_id = auth.uid()
));

CREATE POLICY "Users can view and sign their own contracts"
ON contracts FOR ALL
USING (auth.uid() = user_id);

-- PAYMENTS RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vendors can view their own payments" ON payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;

CREATE POLICY "Vendors can view their own payments"
ON payments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = payments.vendor_id AND v.owner_id = auth.uid()
));

CREATE POLICY "Users can view their own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- ==================================================================
-- GRANTS
-- ==================================================================

GRANT ALL ON TABLE quotes TO authenticated;
GRANT ALL ON TABLE contracts TO authenticated;
GRANT ALL ON TABLE payments TO authenticated;

-- ==================================================================
-- VERIFICATION QUERY
-- ==================================================================
-- Run this to confirm tables were created:
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name IN ('quotes', 'contracts', 'payments');
