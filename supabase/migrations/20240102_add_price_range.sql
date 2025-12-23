-- Add price_range column to vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS price_range TEXT;

-- Comment on column
COMMENT ON COLUMN vendors.price_range IS 'Price range indicator (e.g. $$, $$$, $$$$)';
