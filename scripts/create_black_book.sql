-- Create Black Book table for Planners
-- This allows planners to save vendors to a private list

CREATE TABLE IF NOT EXISTS black_book (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  planner_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicates
  CONSTRAINT unique_black_book_entry UNIQUE (planner_id, vendor_id),
  -- Prevent saving self
  CONSTRAINT no_self_black_book CHECK (planner_id != vendor_id)
);

-- Enable RLS
ALTER TABLE black_book ENABLE ROW LEVEL SECURITY;

-- Policies

-- View: Planners can view their own black book
DROP POLICY IF EXISTS "View own black book" ON black_book;
CREATE POLICY "View own black book" ON black_book
  FOR SELECT USING (
    planner_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Insert: Planners can add to their black book
DROP POLICY IF EXISTS "Add to black book" ON black_book;
CREATE POLICY "Add to black book" ON black_book
  FOR INSERT WITH CHECK (
    planner_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Delete: Planners can remove from their black book
DROP POLICY IF EXISTS "Remove from black book" ON black_book;
CREATE POLICY "Remove from black book" ON black_book
  FOR DELETE USING (
    planner_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Update: Planners can update notes
DROP POLICY IF EXISTS "Update black book notes" ON black_book;
CREATE POLICY "Update black book notes" ON black_book
  FOR UPDATE USING (
    planner_id IN (SELECT id FROM vendors WHERE owner_id = auth.uid())
  );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_black_book_planner ON black_book(planner_id);
