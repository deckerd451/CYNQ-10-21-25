# Supabase Integration for CYNQ Ecosystem

This document describes the Supabase integration that has been added to the CYNQ application to enable database-backed storage for the Ecosystem feature.

## What Was Implemented

### 1. Supabase Client Library
- Installed `@supabase/supabase-js` package
- Created Supabase client service at `src/lib/supabaseClient.ts`
- Implemented CRUD operations for all ecosystem entities

### 2. Environment Configuration
- Created `.env` file with Supabase credentials
- Added `.env.example` for reference
- Updated `.gitignore` to protect credentials

### 3. Database Schema
- Created migration script at `supabase/migrations/001_create_ecosystem_tables.sql`
- Defines tables for: contacts, events, communities, organizations, skills, projects, knowledge, relationships, and critical paths
- Includes indexes for performance
- Implements Row Level Security (RLS)
- Contains sample data for testing

### 4. Store Integration
- Updated `src/stores/ecosystemStore.ts` to include `syncFromSupabase()` method
- Fetches all ecosystem data from Supabase on page load
- Maintains local state with Zustand while syncing with database

### 5. UI Integration
- Updated `src/pages/EcosystemPage.tsx` to automatically load data from Supabase on mount
- Seamless integration with existing ecosystem visualization

## Architecture

```
┌─────────────────┐
│  EcosystemPage  │
└────────┬────────┘
         │
         ├─ useEffect() → syncFromSupabase()
         │
         ▼
┌──────────────────┐
│ ecosystemStore   │
│ (Zustand)        │
└────────┬─────────┘
         │
         ├─ syncFromSupabase()
         │
         ▼
┌──────────────────────┐
│ supabaseClient.ts    │
│ - getAllEcosystemData│
│ - CRUD operations    │
└────────┬─────────────┘
         │
         ▼
┌──────────────────┐
│ Supabase Backend │
│ PostgreSQL DB    │
└──────────────────┘
```

## Setup Instructions

### Step 1: Run the Database Migration

**Option A: Using Supabase Dashboard (Easiest)**
1. Open your Supabase project: https://neauumarptlcuixqzuhr.supabase.co
2. Go to SQL Editor
3. Copy contents of `supabase/migrations/001_create_ecosystem_tables.sql`
4. Paste and run the SQL

**Option B: Using Supabase CLI**
```bash
supabase init
supabase link --project-ref neauumarptlcuixqzuhr
supabase db push
```

### Step 2: Verify Environment Variables

The `.env` file has been created with your credentials:
```env
VITE_SUPABASE_URL=https://neauumarptlcuixqzuhr.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=sb_secret_CQOfiXsWFfAgi-6HXQHlgw_2sYvSPQd
```

**Note**: This file is git-ignored to protect your credentials.

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Test the Integration

1. Navigate to the Ecosystem page
2. You should see the sample data loaded from Supabase:
   - 3 contacts
   - 3 events
   - 3 communities
   - 3 organizations
   - 4 skills
   - 3 projects
   - 3 knowledge items

## Database Tables

| Table | Columns | Description |
|-------|---------|-------------|
| `contacts` | id, name, email | Contact information |
| `events` | id, name | Event/meeting information |
| `communities` | id, name | Community groups |
| `organizations` | id, name | Organizations (FDA, partners, etc.) |
| `skills` | id, name | Skills and competencies |
| `projects` | id, name | Project information |
| `knowledge` | id, name, url | Knowledge resources with links |
| `relationships` | id, source_id, source_type, target_id, target_type | Connections between entities |
| `critical_paths` | id, title, description, overall_timeline, phases | Critical path data (JSONB) |

All tables include:
- UUID primary keys
- `created_at` and `updated_at` timestamps
- Automatic timestamp updates via triggers
- Row Level Security enabled

## API Methods

The `supabaseEcosystemService` provides the following methods:

### Contacts
- `getContacts()` - Fetch all contacts
- `addContact(contact)` - Add new contact
- `deleteContact(id)` - Delete contact

### Events
- `getEvents()` - Fetch all events
- `addEvent(event)` - Add new event
- `deleteEvent(id)` - Delete event

### Communities
- `getCommunities()` - Fetch all communities
- `addCommunity(community)` - Add new community
- `deleteCommunity(id)` - Delete community

### Organizations
- `getOrganizations()` - Fetch all organizations
- `addOrganization(org)` - Add new organization
- `deleteOrganization(id)` - Delete organization

### Skills
- `getSkills()` - Fetch all skills
- `addSkill(skill)` - Add new skill
- `deleteSkill(id)` - Delete skill

### Projects
- `getProjects()` - Fetch all projects
- `addProject(project)` - Add new project
- `deleteProject(id)` - Delete project

### Knowledge
- `getKnowledge()` - Fetch all knowledge items
- `addKnowledge(knowledge)` - Add new knowledge
- `deleteKnowledge(id)` - Delete knowledge

### Relationships
- `getRelationships()` - Fetch all relationships
- `addRelationship(relationship)` - Add new relationship
- `deleteRelationship(id)` - Delete relationship

### Critical Paths
- `getCriticalPaths()` - Fetch all critical paths
- `addCriticalPath(path)` - Add new critical path
- `updateCriticalPath(id, updates)` - Update critical path
- `deleteCriticalPath(id)` - Delete critical path

### Batch Operations
- `getAllEcosystemData()` - Fetch all data in parallel

## Current Behavior

1. **On Page Load**: The ecosystem page automatically fetches all data from Supabase
2. **Data Display**: Fetched data is displayed in the ecosystem visualization
3. **Local State**: Data is stored in Zustand store for fast access
4. **Persistence**: Data persists in Supabase database

## Next Steps / Future Enhancements

### 1. Real-time Sync
Add Supabase realtime subscriptions to sync changes across devices:
```typescript
supabase
  .channel('ecosystem-changes')
  .on('postgres_changes', { event: '*', schema: 'public' }, handleChange)
  .subscribe()
```

### 2. Bidirectional Sync
Update CRUD operations to write back to Supabase:
```typescript
addContact: async (name, email) => {
  const contact = await supabaseEcosystemService.addContact({ name, email });
  set((state) => ({ contacts: [...state.contacts, contact] }));
}
```

### 3. User Authentication
- Add user authentication with Supabase Auth
- Implement user-specific RLS policies
- Scope data to authenticated users

### 4. Conflict Resolution
- Handle offline/online scenarios
- Implement conflict resolution strategies
- Add optimistic updates

### 5. Data Migration
- Create script to migrate existing localStorage data to Supabase
- Provide import/export functionality

## Troubleshooting

### Data Not Loading
1. Check browser console for errors
2. Verify `.env` file exists in project root
3. Restart dev server after adding `.env`
4. Confirm migration was run successfully in Supabase

### Permission Errors
1. Verify using service role key (not anon key)
2. Check RLS policies in Supabase dashboard
3. Ensure tables were created with proper permissions

### Connection Issues
1. Verify Supabase URL is correct
2. Check network connectivity
3. Verify project is not paused in Supabase dashboard

## Security Notes

⚠️ **Important**: The current implementation uses the service role key for simplicity. This key bypasses Row Level Security and should be used with caution.

For production:
1. Use the anonymous/public key for client-side access
2. Implement user authentication
3. Create user-specific RLS policies
4. Never commit the service role key to version control
5. Use environment-specific credentials

## Sample Data

The migration includes sample data for immediate testing:
- John Doe, Jane Smith, Bob Johnson (contacts)
- Tech Conference 2025, Startup Meetup, Health Innovation Summit (events)
- Digital Health Innovators, Startup Founders Network, Medical Device Developers (communities)
- FDA, Notified Body EU, Contract Manufacturer (organizations)
- Regulatory Affairs, Clinical Trials, Software Development, Quality Management (skills)
- Class II Surgical Device, Digital Health App, FDA 510(k) Submission (projects)
- FDA Guidance Documents, EU MDR Regulation, ISO 13485 Standard (knowledge with URLs)

You can modify or remove this data as needed through the Supabase dashboard or by updating the migration script.
