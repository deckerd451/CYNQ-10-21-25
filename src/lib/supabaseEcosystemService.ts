import { supabase } from './supabase';
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
} from '../types/ecosystem';

export class SupabaseEcosystemService {
  private userId: string | null = null;

  setUserId(userId: string | null) {
    this.userId = userId;
  }

  private getUserId(): string {
    if (!this.userId) {
      throw new Error('User ID not set. Please authenticate first.');
    }
    return this.userId;
  }

  // ============================================================================
  // CONTACTS
  // ============================================================================

  async getContacts(): Promise<Contact[]> {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbContactToContact);
  }

  async createContact(contact: Omit<Contact, 'id'>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .insert({
        user_id: this.getUserId(),
        name: contact.name,
        email: contact.email,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbContactToContact(data);
  }

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contacts')
      .update({
        name: updates.name,
        email: updates.email,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbContactToContact(data);
  }

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbContactToContact(dbContact: any): Contact {
    return {
      id: dbContact.id,
      name: dbContact.name,
      email: dbContact.email || undefined,
    };
  }

  // ============================================================================
  // EVENTS
  // ============================================================================

  async getEvents(): Promise<KismetEvent[]> {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbEventToEvent);
  }

  async createEvent(event: Omit<KismetEvent, 'id'>): Promise<KismetEvent> {
    const { data, error } = await supabase
      .from('events')
      .insert({
        user_id: this.getUserId(),
        name: event.name,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbEventToEvent(data);
  }

  async updateEvent(id: string, updates: Partial<KismetEvent>): Promise<KismetEvent> {
    const { data, error } = await supabase
      .from('events')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbEventToEvent(data);
  }

  async deleteEvent(id: string): Promise<void> {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbEventToEvent(dbEvent: any): KismetEvent {
    return {
      id: dbEvent.id,
      name: dbEvent.name,
    };
  }

  // ============================================================================
  // COMMUNITIES
  // ============================================================================

  async getCommunities(): Promise<Community[]> {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbCommunityToCommunity);
  }

  async createCommunity(community: Omit<Community, 'id'>): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .insert({
        user_id: this.getUserId(),
        name: community.name,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbCommunityToCommunity(data);
  }

  async updateCommunity(id: string, updates: Partial<Community>): Promise<Community> {
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbCommunityToCommunity(data);
  }

  async deleteCommunity(id: string): Promise<void> {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbCommunityToCommunity(dbCommunity: any): Community {
    return {
      id: dbCommunity.id,
      name: dbCommunity.name,
    };
  }

  // ============================================================================
  // ORGANIZATIONS
  // ============================================================================

  async getOrganizations(): Promise<Organization[]> {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbOrganizationToOrganization);
  }

  async createOrganization(organization: Omit<Organization, 'id'>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .insert({
        user_id: this.getUserId(),
        name: organization.name,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbOrganizationToOrganization(data);
  }

  async updateOrganization(id: string, updates: Partial<Organization>): Promise<Organization> {
    const { data, error } = await supabase
      .from('organizations')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbOrganizationToOrganization(data);
  }

  async deleteOrganization(id: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbOrganizationToOrganization(dbOrg: any): Organization {
    return {
      id: dbOrg.id,
      name: dbOrg.name,
    };
  }

  // ============================================================================
  // SKILLS
  // ============================================================================

  async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbSkillToSkill);
  }

  async createSkill(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .insert({
        user_id: this.getUserId(),
        name: skill.name,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbSkillToSkill(data);
  }

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    const { data, error } = await supabase
      .from('skills')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbSkillToSkill(data);
  }

  async deleteSkill(id: string): Promise<void> {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbSkillToSkill(dbSkill: any): Skill {
    return {
      id: dbSkill.id,
      name: dbSkill.name,
    };
  }

  // ============================================================================
  // PROJECTS
  // ============================================================================

  async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbProjectToProject);
  }

  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: this.getUserId(),
        name: project.name,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbProjectToProject(data);
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbProjectToProject(data);
  }

  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbProjectToProject(dbProject: any): Project {
    return {
      id: dbProject.id,
      name: dbProject.name,
    };
  }

  // ============================================================================
  // KNOWLEDGE ITEMS
  // ============================================================================

  async getKnowledgeItems(): Promise<KnowledgeItem[]> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbKnowledgeToKnowledge);
  }

  async createKnowledgeItem(item: Omit<KnowledgeItem, 'id'>): Promise<KnowledgeItem> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .insert({
        user_id: this.getUserId(),
        name: item.name,
        url: item.url,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbKnowledgeToKnowledge(data);
  }

  async updateKnowledgeItem(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    const { data, error } = await supabase
      .from('knowledge_items')
      .update({
        name: updates.name,
        url: updates.url,
      })
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbKnowledgeToKnowledge(data);
  }

  async deleteKnowledgeItem(id: string): Promise<void> {
    const { error } = await supabase
      .from('knowledge_items')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbKnowledgeToKnowledge(dbKnowledge: any): KnowledgeItem {
    return {
      id: dbKnowledge.id,
      name: dbKnowledge.name,
      url: dbKnowledge.url || undefined,
    };
  }

  // ============================================================================
  // RELATIONSHIPS
  // ============================================================================

  async getRelationships(): Promise<Relationship[]> {
    const { data, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(this.mapDbRelationshipToRelationship);
  }

  async createRelationship(relationship: Omit<Relationship, 'id'>): Promise<Relationship> {
    const { data, error } = await supabase
      .from('relationships')
      .insert({
        user_id: this.getUserId(),
        source_id: relationship.source,
        source_type: relationship.sourceType,
        target_id: relationship.target,
        target_type: relationship.targetType,
        relationship_type: relationship.type,
        strength: relationship.strength || 0.5,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRelationshipToRelationship(data);
  }

  async updateRelationship(id: string, updates: Partial<Relationship>): Promise<Relationship> {
    const updateData: any = {};
    if (updates.type) updateData.relationship_type = updates.type;
    if (updates.strength !== undefined) updateData.strength = updates.strength;

    const { data, error } = await supabase
      .from('relationships')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', this.getUserId())
      .select()
      .single();

    if (error) throw error;
    return this.mapDbRelationshipToRelationship(data);
  }

  async deleteRelationship(id: string): Promise<void> {
    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  private mapDbRelationshipToRelationship(dbRel: any): Relationship {
    return {
      id: dbRel.id,
      source: dbRel.source_id,
      sourceType: dbRel.source_type,
      target: dbRel.target_id,
      targetType: dbRel.target_type,
      type: dbRel.relationship_type,
      strength: dbRel.strength,
    };
  }

  // ============================================================================
  // CRITICAL PATHS
  // ============================================================================

  async getCriticalPaths(): Promise<CriticalPath[]> {
    const { data: paths, error: pathsError } = await supabase
      .from('critical_paths')
      .select(`
        *,
        critical_path_phases (
          *,
          critical_path_tasks (*)
        )
      `)
      .eq('user_id', this.getUserId())
      .order('created_at', { ascending: false });

    if (pathsError) throw pathsError;

    return paths.map((path: any) => ({
      id: path.id,
      title: path.title,
      description: path.description || '',
      overallTimeline: path.overall_timeline || '',
      phases: (path.critical_path_phases || [])
        .sort((a: any, b: any) => a.phase_order - b.phase_order)
        .map((phase: any) => ({
          id: phase.id,
          name: phase.name,
          duration: phase.duration || '',
          objective: phase.objective || '',
          keyTasks: (phase.critical_path_tasks || [])
            .sort((a: any, b: any) => a.task_order - b.task_order)
            .map((task: any) => ({
              id: task.id,
              text: task.text,
              completed: task.completed,
              assignedToOrgId: task.assigned_to_org_id || undefined,
            })),
          deliverable: phase.deliverable || '',
        })),
    }));
  }

  async createCriticalPath(criticalPath: Omit<CriticalPath, 'id'>): Promise<CriticalPath> {
    const { data: path, error: pathError } = await supabase
      .from('critical_paths')
      .insert({
        user_id: this.getUserId(),
        title: criticalPath.title,
        description: criticalPath.description,
        overall_timeline: criticalPath.overallTimeline,
      })
      .select()
      .single();

    if (pathError) throw pathError;

    // Create phases
    for (let i = 0; i < criticalPath.phases.length; i++) {
      const phase = criticalPath.phases[i];
      const { data: createdPhase, error: phaseError } = await supabase
        .from('critical_path_phases')
        .insert({
          critical_path_id: path.id,
          name: phase.name,
          duration: phase.duration,
          objective: phase.objective,
          deliverable: phase.deliverable,
          phase_order: i,
        })
        .select()
        .single();

      if (phaseError) throw phaseError;

      // Create tasks for this phase
      for (let j = 0; j < phase.keyTasks.length; j++) {
        const task = phase.keyTasks[j];
        const { error: taskError } = await supabase
          .from('critical_path_tasks')
          .insert({
            phase_id: createdPhase.id,
            text: task.text,
            completed: task.completed,
            assigned_to_org_id: task.assignedToOrgId,
            task_order: j,
          });

        if (taskError) throw taskError;
      }
    }

    // Fetch the complete critical path with all relations
    const paths = await this.getCriticalPaths();
    return paths.find(p => p.id === path.id)!;
  }

  async deleteCriticalPath(id: string): Promise<void> {
    const { error } = await supabase
      .from('critical_paths')
      .delete()
      .eq('id', id)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  async updateCriticalPathTask(taskId: string, completed: boolean): Promise<void> {
    const { error } = await supabase
      .from('critical_path_tasks')
      .update({ completed })
      .eq('id', taskId);

    if (error) throw error;
  }
}

// Export singleton instance
export const ecosystemService = new SupabaseEcosystemService();
