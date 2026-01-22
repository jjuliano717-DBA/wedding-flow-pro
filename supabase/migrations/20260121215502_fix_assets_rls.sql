-- Enable RLS on inspiration_assets if not already enabled
ALTER TABLE inspiration_assets ENABLE ROW LEVEL SECURITY;

-- Allow vendors to insert their own assets
DROP POLICY IF EXISTS "Vendors can insert own assets" ON inspiration_assets;
CREATE POLICY "Vendors can insert own assets" ON inspiration_assets
    FOR INSERT
    WITH CHECK (
        vendor_id IN (
            SELECT id FROM vendors WHERE owner_id = auth.uid()
        )
    );

-- Allow vendors to update/delete their own assets (good practice)
DROP POLICY IF EXISTS "Vendors can manage own assets" ON inspiration_assets;
CREATE POLICY "Vendors can manage own assets" ON inspiration_assets
    FOR ALL
    USING (
        vendor_id IN (
            SELECT id FROM vendors WHERE owner_id = auth.uid()
        )
    );

-- Allow everyone to read assets (required for public pages)
DROP POLICY IF EXISTS "Assets are viewable by everyone" ON inspiration_assets;
CREATE POLICY "Assets are viewable by everyone" ON inspiration_assets
    FOR SELECT
    USING (true);
