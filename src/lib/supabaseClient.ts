import { createClient } from '@supabase/supabase-js';
import type {
  Contact,
  KismetEvent,
  Community,
  Organization,
  Skill,
  Project,
  KnowledgeItem,
  Relationship,
  CriticalPath,
} from '@/types/ecosystem';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Database {
  contacts: Contact;
  events: KismetEvent;
  communities: Community;
  organizations: Organization;
  skills: Skill;
  projects: Project;
  knowledge: KnowledgeItem;
  relationships: Relationship;
  critical_paths: CriticalPath;
}

// Supabase service for ecosystem data
export class SupabaseEcosystemService {
  // Contacts
  async getContacts(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert([contact])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Events
  async getEvents(): Promise<KismetEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addEvent(event: Omit<KismetEvent, 'id'>): Promise<KismetEvent> {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Communities
  async getCommunities(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addCommunity(community: Omit<Community, 'id'>): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .insert([community])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCommunity(id: string): Promise<void> {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Organizations
  async getOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addOrganization(organization: Omit<Organization, 'id'>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert([organization])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteOrganization(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert([skill])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteSkill(id: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Knowledge
  async getKnowledge(): Promise<KnowledgeItem[]> {
    const { data, error } = await supabase
      .from('knowledge')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  }

  async addKnowledge(knowledge: Omit<KnowledgeItem, 'id'>): Promise<KnowledgeItem> {
    const { data, error } = await supabase
      .from('knowledge')
      .insert([knowledge])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteKnowledge(id: string): Promise<void> {
    const { error } = await supabase
      .from('knowledge')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Relationships
  async getRelationships(): Promise<Relationship[]> {
    const { data, error } = await supabase
      .from('relationships')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async addRelationship(relationship: Omit<Relationship, 'id'>): Promise<Relationship> {
    const { data, error } = await supabase
      .from('relationships')
      .insert([relationship])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteRelationship(id: string): Promise<void> {
    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Critical Paths
  async getCriticalPaths(): Promise<CriticalPath[]> {
    const { data, error } = await supabase
      .from('critical_paths')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async addCriticalPath(criticalPath: Omit<CriticalPath, 'id'>): Promise<CriticalPath> {
    const { data, error } = await supabase
      .from('critical_paths')
      .insert([criticalPath])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCriticalPath(id: string, updates: Partial<CriticalPath>): Promise<CriticalPath> {
    const { data, error } = await supabase
      .from('critical_paths')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCriticalPath(id: string): Promise<void> {
    const { error } = await supabase
      .from('critical_paths')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Fetch all ecosystem data at once
  async getAllEcosystemData() {
    const [
      contacts,
      events,
      communities,
      organizations,
      skills,
      projects,
      knowledge,
      relationships,
      criticalPaths,
    ] = await Promise.all([
      this.getContacts(),
      this.getEvents(),
      this.getCommunities(),
      this.getOrganizations(),
      this.getSkills(),
      this.getProjects(),
      this.getKnowledge(),
      this.getRelationships(),
      this.getCriticalPaths(),
    ]);

    return {
      contacts,
      events,
      communities,
      organizations,
      skills,
      projects,
      knowledge,
      relationships,
      criticalPaths,
    };
  }
}

export const supabaseEcosystemService = new SupabaseEcosystemService();
