-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create communities table
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge table
CREATE TABLE IF NOT EXISTS knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationships table
CREATE TABLE IF NOT EXISTS relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  target_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create critical_paths table
CREATE TABLE IF NOT EXISTS critical_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  overall_timeline TEXT NOT NULL,
  phases JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
CREATE INDEX IF NOT EXISTS idx_events_name ON events(name);
CREATE INDEX IF NOT EXISTS idx_communities_name ON communities(name);
CREATE INDEX IF NOT EXISTS idx_organizations_name ON organizations(name);
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);
CREATE INDEX IF NOT EXISTS idx_projects_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_knowledge_name ON knowledge(name);
CREATE INDEX IF NOT EXISTS idx_relationships_source ON relationships(source_id, source_type);
CREATE INDEX IF NOT EXISTS idx_relationships_target ON relationships(target_id, target_type);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_updated_at BEFORE UPDATE ON knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_relationships_updated_at BEFORE UPDATE ON relationships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_critical_paths_updated_at BEFORE UPDATE ON critical_paths
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE critical_paths ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role to access all data
-- For now, we'll use service role which bypasses RLS
-- In production, you should implement proper user-based policies

-- Allow anonymous/authenticated users to read data (optional - adjust based on your needs)
CREATE POLICY "Allow read access to contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Allow read access to events" ON events FOR SELECT USING (true);
CREATE POLICY "Allow read access to communities" ON communities FOR SELECT USING (true);
CREATE POLICY "Allow read access to organizations" ON organizations FOR SELECT USING (true);
CREATE POLICY "Allow read access to skills" ON skills FOR SELECT USING (true);
CREATE POLICY "Allow read access to projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow read access to knowledge" ON knowledge FOR SELECT USING (true);
CREATE POLICY "Allow read access to relationships" ON relationships FOR SELECT USING (true);
CREATE POLICY "Allow read access to critical_paths" ON critical_paths FOR SELECT USING (true);

-- Insert some sample data for testing
INSERT INTO contacts (name, email) VALUES
  ('John Doe', 'john@example.com'),
  ('Jane Smith', 'jane@example.com'),
  ('Bob Johnson', 'bob@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO events (name) VALUES
  ('Tech Conference 2025'),
  ('Startup Meetup'),
  ('Health Innovation Summit')
ON CONFLICT DO NOTHING;

INSERT INTO communities (name) VALUES
  ('Digital Health Innovators'),
  ('Startup Founders Network'),
  ('Medical Device Developers')
ON CONFLICT DO NOTHING;

INSERT INTO organizations (name) VALUES
  ('FDA'),
  ('Notified Body EU'),
  ('Contract Manufacturer')
ON CONFLICT DO NOTHING;

INSERT INTO skills (name) VALUES
  ('Regulatory Affairs'),
  ('Clinical Trials'),
  ('Software Development'),
  ('Quality Management')
ON CONFLICT DO NOTHING;

INSERT INTO projects (name) VALUES
  ('Class II Surgical Device'),
  ('Digital Health App'),
  ('FDA 510(k) Submission')
ON CONFLICT DO NOTHING;

INSERT INTO knowledge (name, url) VALUES
  ('FDA Guidance Documents', 'https://www.fda.gov/regulatory-information/search-fda-guidance-documents'),
  ('EU MDR Regulation', 'https://ec.europa.eu/health/md_sector/overview_en'),
  ('ISO 13485 Standard', 'https://www.iso.org/standard/59752.html')
ON CONFLICT DO NOTHING;
