# Supabase Integration Setup

This guide will help you set up the Supabase database for the CYNQ ecosystem feature.

## Prerequisites

- A Supabase account and project
- Your Supabase project URL and service role key

## Setup Instructions

### 1. Run the Migration

You have two options to run the migration:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** tab
3. Create a new query
4. Copy and paste the contents of `migrations/001_create_ecosystem_tables.sql`
5. Click **Run** to execute the migration

#### Option B: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 2. Configure Environment Variables

The `.env` file has already been created with your credentials:

```env
VITE_SUPABASE_URL=https://neauumarptlcuixqzuhr.supabase.co
VITE_SUPABASE_SERVICE_ROLE_KEY=sb_secret_CQOfiXsWFfAgi-6HXQHlgw_2sYvSPQd
```

### 3. Verify the Setup

After running the migration:

1. Check that all tables were created successfully in your Supabase dashboard
2. Verify that sample data was inserted (optional)
3. Start your development server: `npm run dev`
4. Navigate to the Ecosystem page
5. The app should automatically load data from Supabase

## Database Schema

The migration creates the following tables:

- **contacts**: Store contact information (name, email)
- **events**: Store event information
- **communities**: Store community information
- **organizations**: Store organization information
- **skills**: Store skill information
- **projects**: Store project information
- **knowledge**: Store knowledge items with optional URLs
- **relationships**: Store relationships between different entities
- **critical_paths**: Store critical path data with phases (stored as JSONB)

## Sample Data

The migration includes sample data for testing:
- 3 contacts
- 3 events
- 3 communities
- 3 organizations
- 4 skills
- 3 projects
- 3 knowledge items

You can modify or remove this sample data as needed.

## Security

Row Level Security (RLS) is enabled on all tables. The current policies allow:
- Read access for all users
- Write access via service role key

**Important**: For production, you should implement proper user-based policies to restrict access based on authentication.

## Troubleshooting

### Issue: Tables not showing in Supabase dashboard
- Ensure the migration SQL ran without errors
- Check the Supabase logs for any error messages

### Issue: Data not loading in the app
- Check the browser console for error messages
- Verify your environment variables are correct
- Ensure the `.env` file is in the root directory
- Restart your development server after adding the `.env` file

### Issue: Permission errors
- Verify you're using the service role key (not the anon key)
- Check that RLS policies are configured correctly

## Next Steps

To extend the integration:

1. **Add user authentication**: Implement user-specific data access
2. **Add real-time subscriptions**: Use Supabase realtime to sync data across devices
3. **Implement data synchronization**: Sync local changes back to Supabase
4. **Add more fields**: Extend the schema with additional columns as needed
