# AI Assistant Setup - Groq API Key Configuration

## Problem
Getting error: "I'm sorry, I'm having trouble connecting right now. Please try again later!"

**Root Cause:** Missing `VITE_GROQ_API_KEY` in `.env` file.

---

## Solution

### Step 1: Get a Groq API Key

1. Go to **https://console.groq.com**
2. Sign in or create a free account
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy the generated key (starts with `gsk_...`)

---

### Step 2: Add to .env File

Open `.env` file and add this line:

```bash
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```

**Important:** Replace `gsk_your_actual_key_here` with your actual key from Step 1.

---

### Step 3: Restart Dev Server

The dev server needs to reload environment variables:

```bash
# Stop the current dev server (Ctrl+C in terminal)
# Then restart it:
npm run dev
```

Or if you want to keep it running, just refresh the browser page - Vite should pick up the change.

---

### Step 4: Test AI Assistant

1. Open http://localhost:8080/
2. Sign in as a couple user
3. Click the AI Assistant FAB (bottom right floating button)
4. Send a test message like "What can you help me with?"

**Expected Response:** The AI should now respond with a friendly greeting mentioning your role, budget, and wedding details.

---

## Example .env File

Your `.env` should look something like this:

```bash
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key

# Groq AI (for Planning Buddy assistant)
VITE_GROQ_API_KEY=gsk_youractualgroqkeyhere

# Other services
VITE_GOOGLE_PLACES_API_KEY=your-google-key
```

---

## Troubleshooting

**Still getting the error after adding the key?**
1. Make sure there are no extra spaces around the `=` sign
2. Make sure the key starts with `gsk_`
3. Restart the dev server (Ctrl+C, then `npm run dev`)
4. Hard refresh the browser (Cmd+Shift+R on Mac)

**API key not working?**
- Verify it's active in the Groq console
- Check if you've exceeded the free tier limits
- Make sure you copied the entire key

---

## Notes

- The AI uses Groq's Llama 3.3 70B model for fast, intelligent responses
- Free tier includes generous usage limits
- The key is used client-side but rate-limited by the API
