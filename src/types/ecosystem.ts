export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}
export interface Contact {
  id: string;
  name: string;
  email?: string;
}
export interface KismetEvent {
  id: string;
  name: string;
}
export interface Community {
  id: string;
  name: string;
}
export interface Organization {
  id: string;
  name: string;
}
export interface Skill {
  id: string;
  name: string;
}
export interface Project {
  id: string;
  name: string;
}
export interface KnowledgeItem {
  id: string;
  name: string;
  url?: string;
}
export interface Relationship {
  id: string;
  sourceId: string;
  sourceType: string;
  targetId: string;
  targetType: string;
}
// --- Critical Path Types ---
export interface CriticalPathTask {
  id: string;
  text: string;
  completed: boolean;
  assignedToOrgId?: string;
}
export interface CriticalPathPhase {
  id: string;
  name: string;
  duration: string;
  objective: string;
  keyTasks: CriticalPathTask[];
  deliverable: string;
}
export interface CriticalPath {
  id: string;
  title: string;
  description: string;
  overallTimeline: string;
  phases: CriticalPathPhase[];
}
export type NodeType = 'you' | 'contacts' | 'events' | 'communities' | 'projects' | 'skills' | 'knowledge' | 'organizations' | 'criticalPath';
export interface EcosystemDataItem {
  id: string;
  name: string;
  type: 'goal' | 'interest' | 'contact' | 'event' | 'community' | 'communityResource' | 'organization' | 'skill' | 'project' | 'knowledge' | 'criticalPath';
}
export type { CommunityResource } from '../../worker/types';