-- Add website and service_zipcodes columns to vendors table
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS service_zipcodes TEXT[];

-- Add images column if it doesn't exist (optional, for gallery)
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Update RLS policies to allow reading these new columns (usually automatic for public tables, but good to be safe if specific columns were restricted)
-- (Assuming standard public read access exists)
