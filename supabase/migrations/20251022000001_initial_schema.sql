-- CYNQ Database Schema Migration
-- Migrated from Cloudflare Durable Objects to Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS & AUTHENTICATION
-- ============================================================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  background TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User goals
CREATE TABLE public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User interests
CREATE TABLE public.user_interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  interest TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, interest)
);

-- ============================================================================
-- CHAT SESSIONS & MESSAGES
-- ============================================================================

-- Chat sessions
CREATE TABLE public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'New Chat',
  model TEXT DEFAULT 'gemini-2.5-flash',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- Chat messages
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  tool_calls JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ECOSYSTEM DATA
-- ============================================================================

-- Contacts
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMPTZ,
  location TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Communities
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  website TEXT,
  industry TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Skills
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  proficiency_level TEXT,
  years_experience INTEGER,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge items
CREATE TABLE public.knowledge_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  content_type TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationships between ecosystem entities
CREATE TABLE public.relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  source_id UUID NOT NULL,
  source_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  relationship_type TEXT NOT NULL,
  strength DECIMAL(3,2) DEFAULT 0.5,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CRITICAL PATHS (STRATEGIC PLANNING)
-- ============================================================================

-- Critical paths
CREATE TABLE public.critical_paths (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  overall_timeline TEXT,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical path phases
CREATE TABLE public.critical_path_phases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  critical_path_id UUID NOT NULL REFERENCES public.critical_paths(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration TEXT,
  objective TEXT,
  deliverable TEXT,
  phase_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Critical path tasks
CREATE TABLE public.critical_path_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phase_id UUID NOT NULL REFERENCES public.critical_path_phases(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  assigned_to_org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  task_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COMMUNITY & SHARED DATA
-- ============================================================================

-- Community resources (shared knowledge)
CREATE TABLE public.community_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('article', 'tool', 'contact')),
  title TEXT NOT NULL,
  description TEXT,
  tags TEXT[],
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Anonymized insights (for community sharing)
CREATE TABLE public.anonymized_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  relevance_score DECIMAL(3,2),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- OAUTH & DATA SOURCES
-- ============================================================================

-- OAuth tokens for external services
CREATE TABLE public.oauth_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_in INTEGER,
  scope TEXT,
  token_type TEXT DEFAULT 'Bearer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- Data source connection status
CREATE TABLE public.data_source_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  service TEXT NOT NULL,
  is_connected BOOLEAN DEFAULT FALSE,
  last_sync_at TIMESTAMPTZ,
  sync_status TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, service)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- User data indexes
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_interests_user_id ON public.user_interests(user_id);

-- Chat indexes
CREATE INDEX idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_last_active ON public.chat_sessions(last_active DESC);
CREATE INDEX idx_chat_messages_session_id ON public.chat_messages(session_id);
CREATE INDEX idx_chat_messages_timestamp ON public.chat_messages(timestamp);

-- Ecosystem indexes
CREATE INDEX idx_contacts_user_id ON public.contacts(user_id);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_communities_user_id ON public.communities(user_id);
CREATE INDEX idx_organizations_user_id ON public.organizations(user_id);
CREATE INDEX idx_skills_user_id ON public.skills(user_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_knowledge_items_user_id ON public.knowledge_items(user_id);
CREATE INDEX idx_relationships_user_id ON public.relationships(user_id);
CREATE INDEX idx_relationships_source ON public.relationships(source_id, source_type);
CREATE INDEX idx_relationships_target ON public.relationships(target_id, target_type);

-- Critical path indexes
CREATE INDEX idx_critical_paths_user_id ON public.critical_paths(user_id);
CREATE INDEX idx_critical_path_phases_path_id ON public.critical_path_phases(critical_path_id);
CREATE INDEX idx_critical_path_tasks_phase_id ON public.critical_path_tasks(phase_id);

-- OAuth indexes
CREATE INDEX idx_oauth_tokens_user_id ON public.oauth_tokens(user_id);
CREATE INDEX idx_data_source_connections_user_id ON public.data_source_connections(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critical_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critical_path_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.critical_path_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oauth_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_source_connections ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User goals policies
CREATE POLICY "Users can manage own goals"
  ON public.user_goals FOR ALL
  USING (auth.uid() = user_id);

-- User interests policies
CREATE POLICY "Users can manage own interests"
  ON public.user_interests FOR ALL
  USING (auth.uid() = user_id);

-- Chat sessions policies
CREATE POLICY "Users can manage own chat sessions"
  ON public.chat_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Chat messages policies
CREATE POLICY "Users can manage own chat messages"
  ON public.chat_messages FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.chat_sessions
      WHERE id = chat_messages.session_id
      AND user_id = auth.uid()
    )
  );

-- Ecosystem data policies (contacts, events, etc.)
CREATE POLICY "Users can manage own contacts"
  ON public.contacts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own events"
  ON public.events FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own communities"
  ON public.communities FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own organizations"
  ON public.organizations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own skills"
  ON public.skills FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own projects"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own knowledge items"
  ON public.knowledge_items FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own relationships"
  ON public.relationships FOR ALL
  USING (auth.uid() = user_id);

-- Critical paths policies
CREATE POLICY "Users can manage own critical paths"
  ON public.critical_paths FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own critical path phases"
  ON public.critical_path_phases FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.critical_paths
      WHERE id = critical_path_phases.critical_path_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own critical path tasks"
  ON public.critical_path_tasks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.critical_path_phases
      JOIN public.critical_paths ON critical_paths.id = critical_path_phases.critical_path_id
      WHERE critical_path_phases.id = critical_path_tasks.phase_id
      AND critical_paths.user_id = auth.uid()
    )
  );

-- OAuth tokens policies (highly sensitive)
CREATE POLICY "Users can manage own oauth tokens"
  ON public.oauth_tokens FOR ALL
  USING (auth.uid() = user_id);

-- Data source connections policies
CREATE POLICY "Users can manage own data source connections"
  ON public.data_source_connections FOR ALL
  USING (auth.uid() = user_id);

-- Community resources policies (public read, authenticated write)
CREATE POLICY "Anyone can view community resources"
  ON public.community_resources FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create community resources"
  ON public.community_resources FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own community resources"
  ON public.community_resources FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own community resources"
  ON public.community_resources FOR DELETE
  USING (auth.uid() = created_by);

-- Anonymized insights policies (public)
CREATE POLICY "Anyone can view anonymized insights"
  ON public.anonymized_insights FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create anonymized insights"
  ON public.anonymized_insights FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at BEFORE UPDATE ON public.user_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON public.communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON public.organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_items_updated_at BEFORE UPDATE ON public.knowledge_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON public.relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_critical_paths_updated_at BEFORE UPDATE ON public.critical_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_critical_path_phases_updated_at BEFORE UPDATE ON public.critical_path_phases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_critical_path_tasks_updated_at BEFORE UPDATE ON public.critical_path_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_resources_updated_at BEFORE UPDATE ON public.community_resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_oauth_tokens_updated_at BEFORE UPDATE ON public.oauth_tokens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_data_source_connections_updated_at BEFORE UPDATE ON public.data_source_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_active on chat sessions
CREATE OR REPLACE FUNCTION update_chat_session_last_active()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_sessions
  SET last_active = NOW()
  WHERE id = NEW.session_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_last_active_on_message
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_session_last_active();

-- ============================================================================
-- INITIAL DATA / SEED DATA
-- ============================================================================

-- Insert some sample community resources
INSERT INTO public.community_resources (type, title, description, tags) VALUES
  ('article', 'Getting Started with Professional Networking', 'A comprehensive guide to building meaningful professional relationships', ARRAY['networking', 'career', 'guide']),
  ('tool', 'LinkedIn Profile Optimizer', 'Free tool to analyze and improve your LinkedIn profile', ARRAY['linkedin', 'career', 'tool']),
  ('article', 'The Art of the Warm Introduction', 'How to leverage your network for introductions', ARRAY['networking', 'introductions', 'guide']);
