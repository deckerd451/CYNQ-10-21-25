#!/usr/bin/env node
/**
 * Script to check Supabase database connection and verify tables exist
 * Usage: node scripts/check-database.js
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  console.error('See .env.example for reference');
  process.exit(1);
}

console.log('🔍 Checking Supabase connection...');
console.log(`📍 URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Tables that should exist in CYNQ database
const requiredTables = [
  'user_profiles',
  'user_goals',
  'user_interests',
  'chat_sessions',
  'chat_messages',
  'contacts',
  'events',
  'communities',
  'organizations',
  'skills',
  'projects',
  'knowledge_items',
  'relationships',
  'critical_paths',
  'critical_path_phases',
  'critical_path_tasks',
  'community_resources',
  'anonymized_insights',
  'oauth_tokens',
  'data_source_connections'
];

async function checkDatabase() {
  try {
    // Test connection by querying pg_catalog
    console.log('\n📊 Checking database tables...\n');

    const { data, error } = await supabase
      .rpc('check_table_exists', { table_name: 'user_profiles' })
      .catch(async () => {
        // Fallback: query information_schema
        return await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public');
      });

    if (error) {
      // Try alternative method
      const results = [];
      for (const table of requiredTables) {
        try {
          const { error: tableError } = await supabase
            .from(table)
            .select('id')
            .limit(1);

          if (!tableError) {
            results.push({ table, exists: true });
            console.log(`✅ ${table}`);
          } else if (tableError.code === 'PGRST116' || tableError.message.includes('does not exist')) {
            results.push({ table, exists: false });
            console.log(`❌ ${table} - NOT FOUND`);
          } else {
            results.push({ table, exists: true, warning: tableError.message });
            console.log(`⚠️  ${table} - EXISTS (warning: ${tableError.message})`);
          }
        } catch (err) {
          results.push({ table, exists: false });
          console.log(`❌ ${table} - ERROR: ${err.message}`);
        }
      }

      const missingTables = results.filter(r => !r.exists);

      console.log('\n📈 Summary:');
      console.log(`   Total tables checked: ${requiredTables.length}`);
      console.log(`   Found: ${results.filter(r => r.exists).length}`);
      console.log(`   Missing: ${missingTables.length}`);

      if (missingTables.length > 0) {
        console.log('\n⚠️  Missing tables detected!');
        console.log('\n📝 Next steps:');
        console.log('   1. Go to your Supabase dashboard: https://app.supabase.com');
        console.log('   2. Navigate to SQL Editor');
        console.log('   3. Copy and paste the contents of:');
        console.log('      supabase/migrations/20251022000001_initial_schema.sql');
        console.log('   4. Run the migration');
        console.log('\n   Or use Supabase CLI: npx supabase db push');
        process.exit(1);
      } else {
        console.log('\n✅ All tables exist! Database is ready.');
        console.log('\n🚀 You can now run the application:');
        console.log('   npm run dev:all');
      }
    }
  } catch (err) {
    console.error('\n❌ Database connection failed:');
    console.error(err.message);
    console.error('\n🔧 Please check:');
    console.error('   1. Your Supabase URL is correct');
    console.error('   2. Your service role key is valid');
    console.error('   3. Your Supabase project is active');
    console.error('   4. You have network connectivity');
    process.exit(1);
  }
}

checkDatabase();
