# 🚀 Migration Guide: Supabase & Vercel

This document outlines the steps to migrate "2PlanAWedding" from a local-only prototype to a production-ready application using Supabase (Database & Auth) and Vercel (Hosting).

## 1. 📦 Install Dependencies

Since the migration introduces new libraries, you need to install them. Run this in your project root:

```bash
npm install @supabase/supabase-js
```

## 2. 🗄️ Supabase Database Setup

All your tables (Users, Venues, Vendors, etc.) need to be created in your Supabase project.

1.  **Go to Supabase Dashboard:** [https://supabase.com/dashboard/project/wytscoyfbsklptqdqkir](https://supabase.com/dashboard/project/wytscoyfbsklptqdqkir)
2.  **Open SQL Editor:** Click on the SQL icon in the left sidebar.
3.  **Run Migration Script:**
    *   Open the file `supabase_schema.sql` (located in your artifacts or project folder if you saved it).
    *   Copy the entire content.
    *   Paste it into the Supabase SQL Editor.
    *   Click **RUN**.

**What this does:**
*   Creates tables: `public.users`, `vendors`, `venues`, `real_weddings`, `tasks`, `threads`, `replies`.
*   Sets up Row Level Security (RLS) policies to protect data.
*   Creates a trigger to automatically create a public user profile when someone signs up via Auth.

## 3. 🔑 Environment Variables

Your application is already configured to read these keys, but they must be present in your environment.

### Local Development (`.env`)
Ensure your `.env` file in the project root contains:

```env
VITE_SUPABASE_URL=https://wytscoyfbsklptqdqkir.supabase.co
VITE_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
```
*(Note: The Anon Key was added during our session, but verify it is saved).*

### Vercel Deployment
When deploying to Vercel, you must add these as **Environment Variables**:

1.  Go to your Project Settings on Vercel.
2.  Navigate to **Environment Variables**.
3.  Add `VITE_SUPABASE_URL` with the value above.
4.  Add `VITE_SUPABASE_ANON_KEY` with your key.

## 4. 🚀 Deploy to Vercel

1.  **Push to GitHub:** Ensure all your latest changes (including `vercel.json`) are committed and pushed to your GitHub repository.
2.  **Import to Vercel:**
    *   Go to [Vercel Dashboard](https://vercel.com/dashboard).
    *   Click **Add New...** -> **Project**.
    *   Select your GitHub repository.
    *   **Framework Preset:** Vite (should be auto-detected).
    *   **Build Command:** `npm run build`
    *   **Output Directory:** `dist`
3.  **Add Environment Variables:** (As described in Step 3).
4.  **Deploy:** Click **Deploy**.

## ✅ Verification
Once deployed:
1.  **Sign Up:** Create a new account. You should be redirected to the Planner or Business dashboard.
2.  **Check Admin:** Log in (or update your role to 'admin' in Supabase `public.users` table manually for the first admin) and visit `/admin`. You should see real data.

---
**Need Help?**
If the database connection fails, check the Browser Console (F12) for connection errors, usually related to missing or incorrect API keys.
