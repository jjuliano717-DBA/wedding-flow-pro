-- Create function to allow admins to set user passwords
-- This function uses pgcrypto to hash passwords properly

-- Enable pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop function if it exists
DROP FUNCTION IF EXISTS admin_set_user_password(uuid, text);

-- Create the admin_set_user_password function
CREATE OR REPLACE FUNCTION admin_set_user_password(
    user_id uuid,
    new_password text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update the user's password in auth.users
    -- Using crypt to hash the password with bcrypt
    UPDATE auth.users
    SET 
        encrypted_password = crypt(new_password, gen_salt('bf')),
        updated_at = now()
    WHERE id = user_id;
    
    -- Check if the update affected any rows
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found';
    END IF;
END;
$$;

-- Grant execute permission to authenticated users
-- Note: You should add additional RLS or checks in your application
-- to ensure only admins can call this function
GRANT EXECUTE ON FUNCTION admin_set_user_password(uuid, text) TO authenticated;

-- Add a comment
COMMENT ON FUNCTION admin_set_user_password IS 'Allows administrators to set a new password for any user. Should only be called by admin users.';
