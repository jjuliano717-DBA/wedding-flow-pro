-- =====================================================
-- 2PlanAWedding Database Maintenance & Feature Setup
-- Run this in Supabase SQL Editor
-- Date: December 21, 2025
-- =====================================================

-- =====================================================
-- PART 1: IMMEDIATE FIXES
-- =====================================================

-- 1. Add/Update Mosquito Shield of Central Tampa vendor
-- Event Shield service for outdoor weddings
UPDATE vendors SET
    type = 'Other',
    category = 'Other',
    location = 'Tampa, Florida',
    description = 'Specializing in "Event Shield" - professional mosquito and tick control for outdoor weddings and events. Our technicians apply a fast-drying spray 24-48 hours before your event, creating an invisible barrier so guests can enjoy your celebration without bites or buzzing insects. Serving Central Tampa and Hillsborough County.',
    website = 'https://moshield.com',
    image_url = 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800',
    google_rating = 4.8,
    google_reviews = 50,
    heart_rating = 4.5,
    exclusive = true
WHERE name = 'Mosquito Shield of Central Tampa';

-- 2. Fix broken image URLs (update with working Unsplash images)
-- Note: Run SELECT first to see which records need updating

-- Check for potentially broken venue images
-- SELECT id, name, image_url FROM venues WHERE image_url LIKE '%unsplash%';

-- Example fix for Crystal Palace (update the ID if different):
UPDATE venues 
SET image_url = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&q=80&w=800'
WHERE name = 'The Crystal Palace';

-- Fix ALL wedding gallery images with diverse, working Unsplash photos
-- First, set default for any NULL or empty images
UPDATE real_weddings 
SET image_url = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
WHERE image_url IS NULL OR image_url = '';

-- Update specific weddings with unique, beautiful wedding images
-- Classic/Elegant Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1519225468759-428dbe8aa33f?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Classic Elegance' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Classic' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Boho Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Boho' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Garden/Romantic Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Garden Romance' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Rustic Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Rustic Chic' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Beach/Destination Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Destination Beach' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Moody Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1494955870715-979ca4f13bf0?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Moody' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Minimalist Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Minimalist' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Whimsical Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Whimsical' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Southern Charm Weddings
UPDATE real_weddings SET image_url = 'https://images.unsplash.com/photo-1549417229-7686ac5595fd?auto=format&fit=crop&q=80&w=800'
WHERE style = 'Southern Charm' AND (image_url IS NULL OR image_url = '' OR image_url LIKE '%broken%');

-- Final catch-all: Update any remaining weddings with broken/missing images
UPDATE real_weddings 
SET image_url = CASE 
    WHEN id::text LIKE '%1' THEN 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%2' THEN 'https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%3' THEN 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%4' THEN 'https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%5' THEN 'https://images.unsplash.com/photo-1470290378698-263fa7ca60ab?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%6' THEN 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%7' THEN 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%8' THEN 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&q=80&w=800'
    WHEN id::text LIKE '%9' THEN 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800'
    ELSE 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800'
END
WHERE image_url IS NULL 
   OR image_url = '' 
   OR image_url NOT LIKE 'https://images.unsplash.com%';

-- =====================================================
-- PART 2: USER ROLES MIGRATION
-- =====================================================
-- Migrate 'business' role to 'vendor' 
-- Add new roles: 'planner' and 'venue'

-- Step 1: Drop the old constraint FIRST (must be before data update)
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_role_check;

-- Step 2: Update existing 'business' users to 'vendor'
UPDATE public.users SET role = 'vendor' WHERE role = 'business';

-- Step 3: Add new constraint with updated roles
ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('couple', 'vendor', 'planner', 'venue', 'admin'));

-- =====================================================
-- PART 3: ADD MISSING COLUMNS TO USERS TABLE
-- =====================================================

-- Add wedding planning fields for AI context
ALTER TABLE users ADD COLUMN IF NOT EXISTS wedding_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS guest_count INTEGER DEFAULT 100;
ALTER TABLE users ADD COLUMN IF NOT EXISTS planning_pace TEXT DEFAULT 'steady' CHECK (planning_pace IN ('relaxed', 'steady', 'fast'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PART 3: CREATE FAVORITES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('vendor', 'venue', 'wedding')),
    item_id UUID NOT NULL, -- UUID to match vendors/venues/real_weddings tables
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Users can only see their own favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- PART 4: CREATE CHECKLIST TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS checklist_items (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'General',
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    priority INTEGER DEFAULT 2 CHECK (priority BETWEEN 1 AND 3), -- 1=High, 2=Medium, 3=Low
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own checklist" ON checklist_items;
CREATE POLICY "Users can manage own checklist" ON checklist_items
    FOR ALL USING (auth.uid() = user_id);

-- Add updated_at trigger
DROP TRIGGER IF EXISTS update_checklist_updated_at ON checklist_items;
CREATE TRIGGER update_checklist_updated_at
    BEFORE UPDATE ON checklist_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- PART 5: CREATE BOOKINGS/INQUIRIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS inquiries (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    vendor_id UUID, -- No FK constraint - manually managed (vendors use UUID)
    venue_id UUID,  -- No FK constraint - manually managed (venues use UUID)
    
    -- Contact Info (for non-logged-in users)
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    
    -- Inquiry Details
    event_date DATE,
    guest_count INTEGER,
    message TEXT NOT NULL,
    
    -- Status Tracking
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'booked', 'declined')),
    vendor_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure either vendor or venue is set
    CONSTRAINT inquiry_target CHECK (vendor_id IS NOT NULL OR venue_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- Users can see their own inquiries
DROP POLICY IF EXISTS "Users can view own inquiries" ON inquiries;
CREATE POLICY "Users can view own inquiries" ON inquiries
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
CREATE POLICY "Anyone can create inquiries" ON inquiries
    FOR INSERT WITH CHECK (true);

-- Business users can see inquiries for their listings
-- (You'll need to link vendors to users via a user_id column on vendors table)

-- =====================================================
-- PART 6: CREATE GUEST LIST TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS guests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Guest Info
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    
    -- Grouping
    group_name TEXT DEFAULT 'General', -- e.g., "Bride's Family", "Groom's Friends"
    plus_one_allowed BOOLEAN DEFAULT FALSE,
    plus_one_name TEXT,
    
    -- RSVP Status
    rsvp_status TEXT DEFAULT 'pending' CHECK (rsvp_status IN ('pending', 'attending', 'declined', 'maybe')),
    dietary_restrictions TEXT,
    table_assignment TEXT,
    
    -- Tracking
    invite_sent BOOLEAN DEFAULT FALSE,
    invite_sent_at TIMESTAMPTZ,
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own guests" ON guests;
CREATE POLICY "Users can manage own guests" ON guests
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- PART 7: DEFAULT CHECKLIST TEMPLATE
-- =====================================================

-- Function to create default checklist for new users
CREATE OR REPLACE FUNCTION create_default_checklist(p_user_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO checklist_items (user_id, title, category, priority, sort_order) VALUES
    (p_user_id, 'Set your wedding date', 'Getting Started', 1, 1),
    (p_user_id, 'Determine your budget', 'Getting Started', 1, 2),
    (p_user_id, 'Complete Style Matcher quiz', 'Getting Started', 2, 3),
    (p_user_id, 'Book your venue', 'Venue', 1, 4),
    (p_user_id, 'Hire a photographer', 'Vendors', 1, 5),
    (p_user_id, 'Choose your caterer', 'Vendors', 2, 6),
    (p_user_id, 'Book DJ or band', 'Vendors', 2, 7),
    (p_user_id, 'Select a florist', 'Vendors', 2, 8),
    (p_user_id, 'Order wedding cake', 'Vendors', 3, 9),
    (p_user_id, 'Create guest list', 'Guests', 1, 10),
    (p_user_id, 'Send save-the-dates', 'Guests', 2, 11),
    (p_user_id, 'Send invitations', 'Guests', 1, 12),
    (p_user_id, 'Book hair and makeup', 'Personal', 2, 13),
    (p_user_id, 'Plan honeymoon', 'Personal', 3, 14);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 8: RATE LIMITING
-- Best practice implementation for API abuse prevention
-- =====================================================

-- Rate limit tracking table
CREATE TABLE IF NOT EXISTS rate_limits (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL, -- 'inquiry', 'thread_create', 'reply', 'favorite'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action 
ON rate_limits(user_id, action_type, created_at DESC);

-- Enable RLS
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own rate limit data
DROP POLICY IF EXISTS "Users can view own rate limits" ON rate_limits;
CREATE POLICY "Users can view own rate limits" ON rate_limits
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own rate limits" ON rate_limits;
CREATE POLICY "Users can insert own rate limits" ON rate_limits
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
    p_user_id UUID,
    p_action_type TEXT,
    p_max_requests INTEGER,
    p_time_window_minutes INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    request_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO request_count
    FROM rate_limits
    WHERE user_id = p_user_id
      AND action_type = p_action_type
      AND created_at > NOW() - (p_time_window_minutes || ' minutes')::INTERVAL;
    
    RETURN request_count < p_max_requests;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to record an action
CREATE OR REPLACE FUNCTION record_rate_limit_action(
    p_action_type TEXT
) RETURNS void AS $$
BEGIN
    INSERT INTO rate_limits (user_id, action_type)
    VALUES (auth.uid(), p_action_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rate limit inquiries: 5 per hour per user
CREATE OR REPLACE FUNCTION enforce_inquiry_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF auth.uid() IS NOT NULL AND NOT check_rate_limit(auth.uid(), 'inquiry', 5, 60) THEN
        RAISE EXCEPTION 'Rate limit exceeded: Maximum 5 inquiries per hour';
    END IF;
    
    IF auth.uid() IS NOT NULL THEN
        PERFORM record_rate_limit_action('inquiry');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS rate_limit_inquiries ON inquiries;
CREATE TRIGGER rate_limit_inquiries
    BEFORE INSERT ON inquiries
    FOR EACH ROW
    EXECUTE FUNCTION enforce_inquiry_rate_limit();

-- Rate limit thread creation: 10 per hour
CREATE OR REPLACE FUNCTION enforce_thread_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT check_rate_limit(auth.uid(), 'thread_create', 10, 60) THEN
        RAISE EXCEPTION 'Rate limit exceeded: Maximum 10 threads per hour';
    END IF;
    
    PERFORM record_rate_limit_action('thread_create');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS rate_limit_threads ON threads;
CREATE TRIGGER rate_limit_threads
    BEFORE INSERT ON threads
    FOR EACH ROW
    EXECUTE FUNCTION enforce_thread_rate_limit();

-- Rate limit replies: 30 per hour
CREATE OR REPLACE FUNCTION enforce_reply_rate_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT check_rate_limit(auth.uid(), 'reply', 30, 60) THEN
        RAISE EXCEPTION 'Rate limit exceeded: Maximum 30 replies per hour';
    END IF;
    
    PERFORM record_rate_limit_action('reply');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS rate_limit_replies ON replies;
CREATE TRIGGER rate_limit_replies
    BEFORE INSERT ON replies
    FOR EACH ROW
    EXECUTE FUNCTION enforce_reply_rate_limit();

-- Function to clean up old rate limit records (run daily)
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
    DELETE FROM rate_limits 
    WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Run these to verify the changes:

-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('favorites', 'checklist_items', 'inquiries', 'guests', 'rate_limits');

-- Check user columns were added
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('wedding_date', 'guest_count', 'planning_pace', 'updated_at');

-- Verify rate limiting functions exist
SELECT proname FROM pg_proc WHERE proname LIKE '%rate_limit%';
