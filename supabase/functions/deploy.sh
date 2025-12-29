#!/bin/bash

# Deploy Google Places Edge Function to Supabase
# This script deploys the function and sets the API key as a secret

echo "🚀 Deploying Google Places Edge Function..."

# Check if supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Deploy the function
echo "📦 Deploying function..."
supabase functions deploy google-places

if [ $? -ne 0 ]; then
    echo "❌ Function deployment failed"
    exit 1
fi

echo "✅ Function deployed successfully!"

# Set the API key as a secret
echo "🔑 Setting Google Places API key..."
supabase secrets set GOOGLE_PLACES_API_KEY=AIzaSyD7F9GOTRp52bfsF6mo6yFgLZDkuONBi2E

if [ $? -ne 0 ]; then
    echo "❌ Failed to set API key"
    exit 1
fi

echo "✅ API key set successfully!"
echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your Edge Function is now available at:"
echo "https://your-project.supabase.co/functions/v1/google-places"
echo ""
echo "Next steps:"
echo "1. Test the function with a Place ID"
echo "2. Try importing venue data in your app"
echo "3. Monitor usage in Supabase Dashboard"
