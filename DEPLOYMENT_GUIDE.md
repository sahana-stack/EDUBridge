# EduBridge — Deployment & Supabase Integration Guide

---

## 1. Supabase Database Setup (3 Minutes)

1. **Create a Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com) and create a free project.
   - Go to **SQL Editor** in your Supabase dashboard.
   - Click **New Query**, paste the contents of [`schema.sql`](file:///c:/ANTI/P1/schema.sql), and click **Run**.
   - This automatically creates all required tables, Row Level Security policies, realtime channels, and seed data.

2. **Connect Supabase to EduBridge**:
   - In your Supabase dashboard, navigate to **Project Settings** &rarr; **API**.
   - Copy your **Project URL** (e.g. `https://xxxx.supabase.co`) and **anon / public key**.
   - In the EduBridge web application header, click on the **Supabase: Config** badge.
   - Paste your URL and Anon Key, then click **Connect & Save**.

---

## 2. Vercel Deployment

### Option A: Via Vercel CLI (Recommended)
Run the following commands in terminal:

```bash
# 1. Log in to Vercel
npx vercel login

# 2. Deploy to Production
npx vercel --prod
```

### Option B: Deploy via GitHub / Vercel Web Dashboard
1. Push this workspace to your GitHub repository.
2. Go to [https://vercel.com/new](https://vercel.com/new).
3. Import your GitHub repository.
4. Set **Framework Preset** to **Other** (or Static).
5. Add Environment Variables (optional):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://your-project.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `your-anon-key`
6. Click **Deploy**.

---

## 3. Deployment Artifacts Included in Project

- [`schema.sql`](file:///c:/ANTI/P1/schema.sql) — PostgreSQL DDL & Seed migration script.
- [`vercel.json`](file:///c:/ANTI/P1/vercel.json) — Vercel headers, clean URLs, and routing configuration.
- [`package.json`](file:///c:/ANTI/P1/package.json) — Build dependencies and start scripts.
- [`api/status.js`](file:///c:/ANTI/P1/api/status.js) — Vercel Serverless Function endpoint (`/api/status`).
- [`js/supabase-config.js`](file:///c:/ANTI/P1/js/supabase-config.js) — Supabase JS Client integration & sync layer.
