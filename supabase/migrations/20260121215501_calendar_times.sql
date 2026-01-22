-- Migration: Add time columns to vendor_availability
ALTER TABLE vendor_availability 
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS end_time TIME,
ADD COLUMN IF NOT EXISTS is_all_day BOOLEAN DEFAULT TRUE;

-- Seed Data: Insert some leads (swipes) for the current user (assuming vendor role)
-- We need to find the vendor ID associated with the current user first, but we can't do that easily in SQL without knowing the UUID.
-- However, we can create a function or just insert based on a known mock vendor if we are running locally.
-- Since I can't know the exact user ID, I will rely on the app to CREATE leads if none exist, 
-- OR I can create a button in the UI "Generate Test Leads" for the user to click. 
-- That is safer and better for the user.

-- Actually, I will create a SQL function that `Leads.tsx` can call to seed data, or just do it in the UI code.
-- I'll do it in the UI code: "Generate Demo Data" button if list is empty.
