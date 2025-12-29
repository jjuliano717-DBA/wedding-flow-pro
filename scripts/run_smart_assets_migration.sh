#!/bin/bash
# Execute Smart Assets Migration on Remote Supabase Database
# This script runs the migration SQL file directly on the remote database

set -e  # Exit on error

echo "🚀 Starting Smart Assets Migration..."
echo "================================================="

# Database connection details
DB_HOST="db.wytscoyfbsklptqdqkir.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Prompt for database password (service role key password)
echo "Please enter your Supabase database password:"
echo "(Find it in: Supabase Dashboard → Settings → Database → Connection String)"
read -s DB_PASSWORD

# Path to migration file
MIGRATION_FILE="supabase/migrations/20251226_smart_assets_validation_and_data.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo ""
echo "📄 Migration file: $MIGRATION_FILE"
echo "🔗 Connecting to: $DB_HOST"
echo ""

# Execute the migration
PGPASSWORD="$DB_PASSWORD" psql \
    -h "$DB_HOST" \
    -p "$DB_PORT" \
    -U "$DB_USER" \
    -d "$DB_NAME" \
    -f "$MIGRATION_FILE" \
    --echo-errors \
    --no-password

EXIT_CODE=$?

echo ""
if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Migration completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Open Supabase Dashboard → Table Editor"
    echo "2. Check tables: inspiration_assets, vendor_availability, user_swipes"
    echo "3. Verify data was inserted (should see 3+ records in each)"
    echo "4. Test RLS policies by logging in as different users"
else
    echo "❌ Migration failed with exit code: $EXIT_CODE"
    echo "Please check the error messages above."
fi

echo "================================================="
