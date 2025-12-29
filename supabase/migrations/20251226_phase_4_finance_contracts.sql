-- Phase 4: Financial Engine & Contracts
-- Tables for Quotes, Contracts, and Payments

-- 1. Quotes Table
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED')),
    items JSONB DEFAULT '[]', -- Array of { description: string, quantity: number, unit_price: number }
    subtotal_cents INTEGER DEFAULT 0,
    tax_cents INTEGER DEFAULT 0,
    service_fee_cents INTEGER DEFAULT 0,
    grand_total_cents INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'SIGNED', 'EXPIRED')),
    contract_text TEXT NOT NULL,
    couple_signature TEXT,
    vendor_signature TEXT,
    signed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'usd',
    stripe_payment_intent_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    payment_type TEXT DEFAULT 'DEPOSIT', -- DEPOSIT, FULL, RETAINER
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES --

-- Quotes
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage their own quotes"
ON quotes FOR ALL
USING (EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = quotes.vendor_id AND v.owner_id = auth.uid()
));

CREATE POLICY "Users can view quotes sent to them"
ON quotes FOR SELECT
USING (auth.uid() = user_id);

-- Contracts
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can manage their own contracts"
ON contracts FOR ALL
USING (EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = contracts.vendor_id AND v.owner_id = auth.uid()
));

CREATE POLICY "Users can view and sign their own contracts"
ON contracts FOR ALL
USING (auth.uid() = user_id);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can view their own payments"
ON payments FOR SELECT
USING (EXISTS (
    SELECT 1 FROM vendors v 
    WHERE v.id = payments.vendor_id AND v.owner_id = auth.uid()
));

CREATE POLICY "Users can view their own payments"
ON payments FOR SELECT
USING (auth.uid() = user_id);

-- GRANTS --
GRANT ALL ON TABLE quotes TO authenticated;
GRANT ALL ON TABLE contracts TO authenticated;
GRANT ALL ON TABLE payments TO authenticated;
