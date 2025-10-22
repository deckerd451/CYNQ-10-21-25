# CYNQ Setup Guide

This guide will help you configure CYNQ to use your existing Supabase database.

## Prerequisites

- Supabase project created at https://supabase.com
- Node.js 18+ installed
- Your Supabase project credentials

## Setup Steps

### 1. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Then edit `.env` with your actual Supabase credentials:

**Get your credentials from Supabase Dashboard:**
1. Go to https://app.supabase.com/project/_/settings/api
2. Copy the following values:
   - **Project URL** → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

Example `.env` file:
```
VITE_SUPABASE_URL=https://neauumarptlcuixqzuhr.supabase.co
SUPABASE_URL=https://neauumarptlcuixqzuhr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENAI_API_KEY=sk-...
VITE_OPENAI_API_KEY=sk-...
PORT=3001
```

### 2. Check if Database Tables Exist

The CYNQ application requires specific database tables. You can check if they exist in your Supabase project:

1. Go to https://app.supabase.com/project/_/editor
2. Check if you see tables like:
   - `user_profiles`
   - `chat_sessions`
   - `chat_messages`
   - `contacts`, `events`, `communities`, etc.

### 3. Apply Database Migration (If Needed)

If the tables don't exist, you need to run the migration:

**Option A: Using Supabase Dashboard**
1. Go to https://app.supabase.com/project/_/sql/new
2. Copy the contents of `supabase/migrations/20251022000001_initial_schema.sql`
3. Paste into the SQL Editor
4. Click "Run" to execute

**Option B: Using Supabase CLI** (if installed)
```bash
npx supabase db push
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Application

**Development Mode (Frontend + API):**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend API
npm run dev:api
```

The application will be available at:
- Frontend: http://localhost:3000
- API: http://localhost:3001

## Verification

Once running, you should be able to:
1. Create an account at http://localhost:3000
2. Sign in
3. Start using CYNQ features

## Troubleshooting

### "Invalid API key" or connection errors
- Verify your credentials in `.env` are correct
- Make sure you copied the complete keys (they're very long)
- Check that your Supabase project is active

### "Table does not exist" errors
- You need to run the database migration (Step 3)

### CORS errors
- The API server is configured to accept requests from localhost
- If deploying, update CORS settings in `api/server.ts`

## Next Steps

After setup, refer to `MIGRATION_GUIDE.md` for detailed information about:
- Database schema
- API endpoints
- Service layer usage
- Deployment options
