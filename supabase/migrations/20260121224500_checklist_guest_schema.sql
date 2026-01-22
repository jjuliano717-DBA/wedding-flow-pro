
-- Schema for Guests and Checklist

-- 1. GUESTS TABLE
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'Guest', -- Bride Family, Groom Family, Friend, etc.
  rsvp_status TEXT DEFAULT 'pending', -- pending, attending, declined
  dietary_notes TEXT,
  plus_one BOOLEAN DEFAULT false,
  table_number TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own guests" ON guests;
DROP POLICY IF EXISTS "Users can manage own and client guests" ON guests;

CREATE POLICY "Users can manage own and client guests" ON guests
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = guests.user_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = guests.user_id 
      AND projects.user_id = auth.uid()
    )
  );

-- 2. CHECKLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS checklist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  timeline_phase TEXT, -- 12_months, 9_months, 6_months, 3_months, 1_month, week_of
  is_completed BOOLEAN DEFAULT false,
  due_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for Checklist
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own checklist" ON checklist_items;
DROP POLICY IF EXISTS "Users can manage own and client checklist" ON checklist_items;

CREATE POLICY "Users can manage own and client checklist" ON checklist_items
  USING (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = checklist_items.user_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.client_id = checklist_items.user_id 
      AND projects.user_id = auth.uid()
    )
  );
