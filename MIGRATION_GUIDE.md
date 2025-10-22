# CYNQ Migration Guide: Cloudflare → Supabase

This document outlines the migration of the CYNQ application from Cloudflare infrastructure to Supabase.

## Table of Contents
- [Overview](#overview)
- [Architecture Changes](#architecture-changes)
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [API Changes](#api-changes)
- [Frontend Changes](#frontend-changes)
- [Deployment](#deployment)

## Overview

### What Changed

| Component | Before (Cloudflare) | After (Supabase) |
|-----------|---------------------|------------------|
| **Backend** | Cloudflare Workers | Express API Server |
| **Database** | Durable Objects (SQLite) | PostgreSQL |
| **Auth** | Mock OAuth | Supabase Auth |
| **Storage** | localStorage + Durable Objects | Supabase Database + Real-time |
| **AI Gateway** | Cloudflare AI Gateway | Direct OpenAI API |
| **Hosting** | Cloudflare Pages | Vercel/Netlify/Supabase (recommended) |

### Benefits

- **Real database**: PostgreSQL with proper schema, migrations, and ACID compliance
- **Multi-user support**: True authentication with user isolation via RLS
- **Real-time sync**: Supabase real-time subscriptions for live updates
- **Better scaling**: Database-backed instead of edge-only storage
- **Standard tooling**: Use standard PostgreSQL tools and workflows

## Architecture Changes

### Before (Cloudflare)

```
┌─────────────────┐
│   React App     │
│  (Vite + SPA)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Cloudflare      │
│   Workers       │
│   (Hono API)    │
└────────┬────────┘
         │
         ├──► Durable Objects (ChatAgent)
         ├──► Durable Objects (AppController)
         └──► Cloudflare AI Gateway
```

### After (Supabase)

```
┌─────────────────┐
│   React App     │
│  (Vite + SPA)   │
└────────┬────────┘
         │
         ├──► Supabase Client (direct)
         │    └──► PostgreSQL
         │    └──► Supabase Auth
         │    └──► Real-time
         │
         └──► Express API Server
              ├──► Supabase (server-side)
              └──► OpenAI API
```

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key
3. Copy the service role key (for backend)

### 2. Run Database Migrations

Apply the database schema:

```bash
# Using Supabase CLI
supabase db push

# Or manually via Supabase Dashboard
# Copy contents of supabase/migrations/20251022000001_initial_schema.sql
# Run in SQL Editor
```

### 3. Configure Environment Variables

Create a `.env` file:

```bash
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
VITE_OPENAI_API_KEY=your-openai-api-key
OPENAI_API_KEY=your-openai-api-key

# API Server
PORT=3001

# Optional
VITE_SERPAPI_KEY=your-serpapi-key
```

### 4. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 5. Run Development Servers

Run both frontend and backend:

```bash
npm run dev:all
```

Or run separately:

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend API
npm run dev:api
```

The frontend will run on `http://localhost:3000`
The API will run on `http://localhost:3001`

## Database Schema

### Core Tables

#### Users & Authentication
- `user_profiles` - User profile data (extends Supabase auth.users)
- `user_goals` - User goals with completion status
- `user_interests` - User interests/topics

#### Chat System
- `chat_sessions` - Chat sessions per user
- `chat_messages` - All messages in each session

#### Ecosystem Data
- `contacts` - User's contacts
- `events` - Events (Kismet)
- `communities` - Communities
- `organizations` - Organizations
- `skills` - Skills
- `projects` - Projects
- `knowledge_items` - Knowledge resources
- `relationships` - Connections between entities

#### Strategic Planning
- `critical_paths` - Multi-phase strategic plans
- `critical_path_phases` - Phases within critical paths
- `critical_path_tasks` - Tasks within phases

#### Community
- `community_resources` - Shared resources (articles, tools, contacts)
- `anonymized_insights` - Anonymized insights from users

#### OAuth & Data Sources
- `oauth_tokens` - OAuth tokens for external services
- `data_source_connections` - Connection status per service

### Row-Level Security (RLS)

All tables have RLS policies enabled to ensure:
- Users can only see/modify their own data
- Community resources are public-read, authenticated-write
- Multi-tenant data isolation

## API Changes

### Authentication

**Before:**
```typescript
// Mock auth in localStorage
useAuthStore.getState().login({ isNew: true });
```

**After:**
```typescript
// Real Supabase auth
const { error } = await useAuthStore.getState().signUp(email, password);
const { error } = await useAuthStore.getState().signIn(email, password);
await useAuthStore.getState().signOut();
```

### Data Access

**Before (localStorage):**
```typescript
// Direct localStorage access
const profile = useUserProfileStore.getState();
```

**After (Supabase):**
```typescript
// Supabase-backed with real-time sync
import { userService } from '@/lib/supabaseUserService';

const profile = await userService.getProfile();
await userService.updateBackground('My background');
```

### Chat API

**Before:**
```typescript
// Worker endpoint
fetch('/api/chat/:sessionId/chat', { method: 'POST', body: JSON.stringify({ message }) });
```

**After:**
```typescript
// Still uses API server, but with auth token
fetch('/api/chat/:sessionId/chat', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ message })
});
```

## Frontend Changes

### Key Files Modified

1. **`src/lib/supabase.ts`** - Supabase client setup
2. **`src/stores/authStore.ts`** - Updated to use Supabase Auth
3. **`src/lib/supabaseEcosystemService.ts`** - Ecosystem data service
4. **`src/lib/supabaseChatService.ts`** - Chat service
5. **`src/lib/supabaseUserService.ts`** - User profile service
6. **`src/components/auth/AuthProvider.tsx`** - Auth initialization
7. **`src/main.tsx`** - Added AuthProvider wrapper

### Service Layer

Three main service classes handle Supabase interactions:

```typescript
import { userService } from '@/lib/supabaseUserService';
import { ecosystemService } from '@/lib/supabaseEcosystemService';
import { chatService } from '@/lib/supabaseChatService';

// All services automatically use the authenticated user
// Set via AuthProvider on user login
```

### Real-time Subscriptions

Enable live updates:

```typescript
// Subscribe to new messages
const subscription = chatService.subscribeToSessionUpdates(
  sessionId,
  (message) => {
    console.log('New message:', message);
  }
);

// Cleanup
chatService.unsubscribeFromSessionUpdates(sessionId);
```

## Deployment

### Backend API

#### Option 1: Node.js Server (Recommended for Development)

```bash
npm run build:api
npm run start:api
```

Deploy to any Node.js host:
- Railway
- Render
- Fly.io
- Heroku
- DigitalOcean App Platform

#### Option 2: Supabase Edge Functions

Convert the Express API to Supabase Edge Functions for serverless deployment.

### Frontend

Deploy the Vite build to any static host:

```bash
npm run build
```

Recommended hosts:
- **Vercel** (easiest, auto-deploys from Git)
- **Netlify** (similar to Vercel)
- **Supabase Storage** (host directly on Supabase)
- Cloudflare Pages (ironic!)

### Environment Variables

Set these in your deployment platform:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_OPENAI_API_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... (backend only)
OPENAI_API_KEY=... (backend only)
```

## Migration Checklist

- [x] Set up Supabase project
- [x] Create database schema and migrations
- [x] Create TypeScript types for database
- [x] Implement Supabase Auth integration
- [x] Create service layer (user, ecosystem, chat)
- [x] Update authStore to use Supabase
- [x] Create Express API server
- [x] Add authentication middleware
- [x] Implement chat endpoints with OpenAI
- [x] Implement session management endpoints
- [x] Implement community endpoints
- [x] Add AuthProvider to app initialization
- [ ] Update remaining stores to use Supabase services
- [ ] Update all frontend components to use new API
- [ ] Migrate OAuth integration to real services
- [ ] Test all features end-to-end
- [ ] Deploy to production

## Troubleshooting

### Common Issues

**Issue**: "User ID not set" error
**Solution**: Ensure user is authenticated and AuthProvider is initialized

**Issue**: RLS policies blocking requests
**Solution**: Check that the auth token is being passed correctly

**Issue**: CORS errors
**Solution**: Update CORS settings in `api/server.ts` to allow your frontend origin

**Issue**: Database connection failed
**Solution**: Verify Supabase URL and keys in `.env` file

## Next Steps

1. **Test the migration**: Create a test user and verify all features work
2. **Migrate data**: If you have existing users, write a data migration script
3. **Update OAuth**: Replace mock OAuth with real integrations
4. **Enable real-time**: Add Supabase real-time subscriptions throughout the app
5. **Deploy**: Choose hosting platforms and deploy both frontend and API
6. **Monitor**: Set up error tracking and monitoring

## Support

For issues or questions:
- Check the [Supabase Documentation](https://supabase.com/docs)
- Review database logs in Supabase Dashboard
- Check API server logs for backend errors
