import type {
  EcosystemDataItem,
  Relationship,
  Contact,
  KismetEvent,
  Community,
  Organization,
  Skill,
  Project,
  KnowledgeItem,
  Goal,
  CriticalPath,
} from '@/types/ecosystem';
// Define a type for the full ecosystem data
type EcosystemData = {
  goals: Goal[];
  interests: string[];
  contacts: Contact[];
  events: KismetEvent[];
  communities: Community[];
  organizations: Organization[];
  skills: Skill[];
  projects: Project[];
  knowledge: KnowledgeItem[];
  relationships: Relationship[];
  criticalPath: CriticalPath | null;
};
export const getAllEcosystemItems = (data: EcosystemData): EcosystemDataItem[] => {
  const items: EcosystemDataItem[] = [
    ...data.goals.map((g): EcosystemDataItem => ({ id: g.id, name: g.text, type: 'goal' })),
    ...data.interests.map((i, idx): EcosystemDataItem => ({ id: `interest-${idx}`, name: i, type: 'interest' })),
    ...data.contacts.map((c): EcosystemDataItem => ({ id: c.id, name: c.name, type: 'contact' })),
    ...data.events.map((e): EcosystemDataItem => ({ id: e.id, name: e.name, type: 'event' })),
    ...data.communities.map((c): EcosystemDataItem => ({ id: c.id, name: c.name, type: 'community' })),
    ...data.organizations.map((o): EcosystemDataItem => ({ id: o.id, name: o.name, type: 'organization' })),
    ...data.skills.map((s): EcosystemDataItem => ({ id: s.id, name: s.name, type: 'skill' })),
    ...data.projects.map((p): EcosystemDataItem => ({ id: p.id, name: p.name, type: 'project' })),
    ...data.knowledge.map((k): EcosystemDataItem => ({ id: k.id, name: k.name, type: 'knowledge' })),
  ];
  if (data.criticalPath) {
    items.push({ id: data.criticalPath.id, name: data.criticalPath.title, type: 'criticalPath' });
  }
  return items;
};
export const calculateTotalItems = (data: EcosystemData): number => {
  return getAllEcosystemItems(data).length;
};
export const calculateTotalConnections = (relationships: Relationship[]): number => {
  return relationships.length;
};
export const calculateConnectionDensity = (itemCount: number, connectionCount: number): number => {
  if (itemCount <= 1) return 0;
  const maxPossibleConnections = (itemCount * (itemCount - 1)) / 2;
  if (maxPossibleConnections === 0) return 0;
  return (connectionCount / maxPossibleConnections) * 100;
};
export const findMostConnectedItem = (items: EcosystemDataItem[], relationships: Relationship[]): { name: string; type: string; count: number } | null => {
  if (relationships.length === 0) return null;
  const connectionCounts = items.reduce((acc, item) => {
    acc[item.id] = { ...item, count: 0 };
    return acc;
  }, {} as Record<string, EcosystemDataItem & { count: number }>);
  relationships.forEach(rel => {
    if (connectionCounts[rel.sourceId]) {
      connectionCounts[rel.sourceId].count++;
    }
    if (connectionCounts[rel.targetId]) {
      connectionCounts[rel.targetId].count++;
    }
  });
  const mostConnected = Object.values(connectionCounts).sort((a, b) => b.count - a.count)[0];
  if (mostConnected && mostConnected.count > 0) {
    return {
      name: mostConnected.name,
      type: mostConnected.type,
      count: mostConnected.count,
    };
  }
  return null;
};
export const calculateCategoryDistribution = (relationships: Relationship[]): { name: string; value: number }[] => {
  const categoryCounts = relationships.reduce((acc, rel) => {
    const sourceType = rel.sourceType;
    const targetType = rel.targetType;
    acc[sourceType] = (acc[sourceType] || 0) + 1;
    acc[targetType] = (acc[targetType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  return Object.entries(categoryCounts)
    .map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }))
    .sort((a, b) => b.value - a.value);
};