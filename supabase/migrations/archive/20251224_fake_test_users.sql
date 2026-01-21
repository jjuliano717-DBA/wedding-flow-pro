-- Fake test users for vendors and venues pages
-- Insert a vendor user and a venue user with simple emails and role information.
-- Passwords for Supabase Auth cannot be set via SQL; they should be created via the Auth UI or API.

INSERT INTO profiles (id, email, role, full_name, created_at)
VALUES (
  gen_random_uuid(),
  'vendor_user@example.com',
  'vendor',
  'Vendor User',
  now()
);

INSERT INTO profiles (id, email, role, full_name, created_at)
VALUES (
  gen_random_uuid(),
  'venue_user@example.com',
  'venue',
  'Venue User',
  now()
);
