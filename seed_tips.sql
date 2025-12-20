
-- 1. Create Table
CREATE TABLE IF NOT EXISTS planning_tips (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    category text NOT NULL, -- "Planning", "Budget", "Vendors", etc.
    excerpt text,
    content text, -- Full article content
    image_url text,
    read_time text, -- e.g. "5 min read"
    author text,
    publish boolean DEFAULT true,
    exclusive boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

-- 2. Security (RLS)
ALTER TABLE planning_tips ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow Public Access" ON planning_tips;
CREATE POLICY "Allow Public Access" ON planning_tips FOR ALL USING (true) WITH CHECK (true);

-- 3. Seed Data
-- Using ON CONFLICT logic if possible, or just insert if empty. 
-- Since we don't have a unique constraint on title easily, we'll just insert matching the mockup.

INSERT INTO planning_tips (title, category, excerpt, content, image_url, read_time, author, created_at)
VALUES
(
    'How to Choose Your Wedding Photographer', 
    'Vendors', 
    'Tips for finding a photographer whose style matches your vision and personality.',
    'Finding the right photographer is crucial...', 
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800', 
    '5 min read', 
    'Emma Wilson', 
    '2024-12-12'
),
(
    'Wedding Budget Breakdown Guide', 
    'Budget', 
    'A comprehensive guide to allocating your wedding budget across all categories.',
    ' budgeting is often the most stressful part...', 
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800', 
    '8 min read', 
    'James Chen', 
    '2024-12-10'
),
(
    'Seasonal Flower Guide for Your Wedding', 
    'Decor', 
    'Discover which blooms are in season and how to choose arrangements that last.',
    'Choosing in-season flowers can save you money...', 
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=800', 
    '4 min read', 
    'Sophie Miller', 
    '2024-12-08'
),
(
    'Creating the Perfect Timeline', 
    'Planning', 
    'Ensure your big day runs smoothly with our hour-by-hour timeline templates.',
    'A detailed timeline is the backbone of a stress-free wedding...', 
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800', 
    '6 min read', 
    'Emma Wilson', 
    '2024-12-05'
),
(
    'Top 10 Wedding Dress Trends for 2025', 
    'Fashion', 
    'From minimalist chic to maximalist glamour, see what is trending this year.',
    'Fashion is always evolving...', 
    'https://images.unsplash.com/photo-1594539656641-c0529d47932c?auto=format&fit=crop&q=80&w=800', 
    '5 min read', 
    'Isabella Rossi', 
    '2024-12-01'
),
(
    'Guide to Wedding Etiquette', 
    'Etiquette', 
    'Navigating RSVPs, plus-ones, and thank you notes with grace.',
    'Etiquette rules can be tricky...', 
    'https://images.unsplash.com/photo-1522673607200-1645062cd958?auto=format&fit=crop&q=80&w=800', 
    '7 min read', 
    'James Chen', 
    '2024-11-28'
);
