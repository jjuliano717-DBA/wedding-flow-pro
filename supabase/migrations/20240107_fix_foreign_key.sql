-- FIX: Update foreign key to reference auth.users instead of public.users
-- The vendors.owner_id should reference auth.users(id), not public.users(id)

-- Drop the incorrect foreign key constraint
ALTER TABLE public.vendors
DROP CONSTRAINT IF EXISTS vendors_owner_id_fkey;

-- Add the correct foreign key constraint referencing auth.users
ALTER TABLE public.vendors
ADD CONSTRAINT vendors_owner_id_fkey
FOREIGN KEY (owner_id)
REFERENCES auth.users(id)
ON DELETE CASCADE;

-- Verify the fix
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'vendors'
AND kcu.column_name = 'owner_id';
