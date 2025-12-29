-- Add UNIQUE constraint to vendors(owner_id) to enable robust UPSERT
ALTER TABLE vendors ADD CONSTRAINT vendors_owner_id_key UNIQUE (owner_id);

-- Create Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Link to a registered user if available, else null
    client_name TEXT NOT NULL, -- "Sarah & Mike"
    client_email TEXT,
    event_date DATE,
    guest_count INTEGER,
    budget TEXT, -- "$15k - $20k"
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Replied', 'Booked', 'Archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Vendors can view and update their own leads
CREATE POLICY "Vendors can view own leads"
    ON leads FOR SELECT
    USING (vendor_id IN (
        SELECT id FROM vendors WHERE owner_id = auth.uid()
    ));

CREATE POLICY "Vendors can update own leads"
    ON leads FOR UPDATE
    USING (vendor_id IN (
        SELECT id FROM vendors WHERE owner_id = auth.uid()
    ));

-- Users (Couples) can insert leads (inquiry) -> This might need public access if inquiry form is public
-- For now allowing authenticated users to insert
CREATE POLICY "Users can create leads"
    ON leads FOR INSERT
    WITH CHECK (auth.uid() = user_id); -- Or just true if we allow public inquiries later

-- Indexes
CREATE INDEX idx_leads_vendor ON leads(vendor_id);
CREATE INDEX idx_leads_status ON leads(status);
