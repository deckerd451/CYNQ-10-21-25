import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Contact, KismetEvent, Community, Organization, Skill, Project, KnowledgeItem, Relationship, CriticalPath, CriticalPathTask } from '@/types/ecosystem';
import { produce } from 'immer';
const commercializationCriticalPath: CriticalPath = {
  id: 'cp-commercialization-1',
  title: 'CRITICAL PATH TO COMMERCIALIZATION — CLASS II SURGICAL DEVICE (U.S. + EU)',
  description: 'A strategic plan to achieve regulatory approval and market launch for a Class II surgical device in both the United States and the European Union.',
  overallTimeline: '24-36 Months',
  phases: [
    {
      id: 'phase-1-feasibility',
      name: 'Phase 1: Concept & Feasibility',
      duration: 'Months 1-3',
      objective: 'Define the device concept, assess technical feasibility, and analyze the market and regulatory landscape.',
      keyTasks: [
        { id: 't1-1', text: 'Define user needs and device requirements document (DRD)', completed: false },
        { id: 't1-2', text: 'Conduct initial patent and literature search for freedom-to-operate', completed: false },
        { id: 't1-3', text: 'Assess preliminary regulatory pathway (U.S. 510(k) & EU MDR)', completed: false },
        { id: 't1-4', text: 'Create initial business case and market analysis', completed: false },
      ],
      deliverable: 'Feasibility Report & Initial Device Requirements Document.',
    },
    {
      id: 'phase-2-development',
      name: 'Phase 2: Design & Development',
      duration: 'Months 4-12',
      objective: 'Develop a functional prototype that meets design inputs and is suitable for V&V testing.',
      keyTasks: [
        { id: 't2-1', text: 'Develop detailed engineering specifications and CAD models', completed: false },
        { id: 't2-2', text: 'Establish Design History File (DHF)', completed: false },
        { id: 't2-3', text: 'Conduct risk analysis (ISO 14971) and usability engineering (IEC 62366)', completed: false },
        { id: 't2-4', text: 'Select key suppliers and materials for manufacturing', completed: false },
      ],
      deliverable: 'Design Freeze, Functional Prototype, and comprehensive DHF.',
    },
    {
      id: 'phase-3-vv',
      name: 'Phase 3: Verification & Validation (V&V)',
      duration: 'Months 13-18',
      objective: 'Formally test the device against its specifications (verification) and user needs (validation).',
      keyTasks: [
        { id: 't3-1', text: 'Execute benchtop testing (performance, durability)', completed: false },
        { id: 't3-2', text: 'Conduct biocompatibility testing (ISO 10993)', completed: false },
        { id: 't3-3', text: 'Perform sterilization validation', completed: false },
        { id: 't3-4', text: 'Finalize labeling and Instructions for Use (IFU)', completed: false },
      ],
      deliverable: 'Completed V&V Test Reports.',
    },
    {
      id: 'phase-4-regulatory',
      name: 'Phase 4: Regulatory Submission & QMS',
      duration: 'Months 19-24',
      objective: 'Prepare and submit regulatory filings to the FDA (U.S.) and a Notified Body (EU).',
      keyTasks: [
        { id: 't4-1', text: 'Compile 510(k) submission package for FDA', completed: false },
        { id: 't4-2', text: 'Compile Technical Documentation for EU MDR', completed: false },
        { id: 't4-3', text: 'Establish Quality Management System (QMS) compliant with 21 CFR 820 & ISO 13485', completed: false },
        { id: 't4-4', text: 'Submit regulatory packages to authorities', completed: false },
      ],
      deliverable: 'Submission receipts from FDA and Notified Body.',
    },
    {
      id: 'phase-5-launch',
      name: 'Phase 5: Market Launch & Post-Market Surveillance',
      duration: 'Months 25-36',
      objective: 'Achieve regulatory clearance, initiate commercial launch, and establish post-market surveillance activities.',
      keyTasks: [
        { id: 't5-1', text: 'Respond to regulatory body questions (e.g., FDA AI/RTA)', completed: false },
        { id: 't5-2', text: 'Receive 510(k) clearance and CE Mark', completed: false },
        { id: 't5-3', text: 'Scale up manufacturing and supply chain', completed: false },
        { id: 't5-4', text: 'Implement post-market surveillance plan', completed: false },
      ],
      deliverable: 'Regulatory clearances and initial product sales.',
    },
  ],
};
const digitalHealthCriticalPath: CriticalPath = {
  id: 'cp-digital-health-1',
  title: 'CRITICAL PATH TO COMMERCIALIZATION — DIGITAL HEALTH APP (U.S. FDA + EU MDR)',
  description: 'A strategic plan for a Software as a Medical Device (SaMD) to achieve regulatory clearance and market launch in the U.S. and EU.',
  overallTimeline: '19-24+ Months',
  phases: [
    {
      id: 'dh-phase-1',
      name: 'Phase 1: Product Definition & Regulatory Strategy',
      duration: 'Months 1-2',
      objective: 'Define the SaMD, its intended use, and establish the U.S. and EU regulatory classification and strategy.',
      keyTasks: [
        { id: 'dh-t1-1', text: 'Develop Product Requirements Document (PRD) and define Intended Use/Indications for Use.', completed: false },
        { id: 'dh-t1-2', text: 'Classify device under FDA (Class I/II/III) and EU MDR (Class I/IIa/IIb/III).', completed: false },
        { id: 'dh-t1-3', text: 'Conduct preliminary cybersecurity and data privacy (HIPAA/GDPR) risk assessment.', completed: false },
        { id: 'dh-t1-4', text: 'Draft Regulatory Affairs Plan (RAP).', completed: false },
      ],
      deliverable: 'Final PRD and Regulatory Affairs Plan.',
    },
    {
      id: 'dh-phase-2',
      name: 'Phase 2: Agile Development & QMS Implementation',
      duration: 'Months 3-9',
      objective: 'Develop the application following IEC 62304 standards and establish a compliant Quality Management System (QMS).',
      keyTasks: [
        { id: 'dh-t2-1', text: 'Establish QMS (ISO 13485) and document control procedures.', completed: false },
        { id: 'dh-t2-2', text: 'Develop software architecture and detailed software requirements specification (SRS).', completed: false },
        { id: 'dh-t2-3', text: 'Implement agile development sprints with continuous integration and unit testing.', completed: false },
        { id: 'dh-t2-4', text: 'Create Software Design and Development Plan (SDDP) and Risk Management File (ISO 14971).', completed: false },
      ],
      deliverable: 'Alpha version of the application; QMS procedures established.',
    },
    {
      id: 'dh-phase-3',
      name: 'Phase 3: Verification, Validation & Clinical Evaluation',
      duration: 'Months 10-15',
      objective: 'Verify software meets specifications, validate it meets user needs, and compile clinical evidence.',
      keyTasks: [
        { id: 'dh-t3-1', text: 'Execute Software Verification and Validation (V&V) protocols.', completed: false },
        { id: 'dh-t3-2', text: 'Conduct formative and summative usability testing (IEC 62366).', completed: false },
        { id: 'dh-t3-3', text: 'Compile Clinical Evaluation Report (CER) for EU MDR.', completed: false },
        { id: 'dh-t3-4', text: 'If required, conduct clinical studies to gather performance data.', completed: false },
      ],
      deliverable: 'Completed V&V reports, Usability Engineering File, and Clinical Evaluation Report.',
    },
    {
      id: 'dh-phase-4',
      name: 'Phase 4: Regulatory Submissions',
      duration: 'Months 16-18',
      objective: 'Prepare and submit regulatory filings to the FDA and a Notified Body.',
      keyTasks: [
        { id: 'dh-t4-1', text: 'Compile 510(k) or De Novo submission for FDA.', completed: false },
        { id: 'dh-t4-2', text: 'Compile Technical Documentation for EU MDR CE Marking.', completed: false },
        { id: 'dh-t4-3', text: 'Perform final cybersecurity and interoperability testing.', completed: false },
        { id: 'dh-t4-4', text: 'Submit packages to regulatory authorities.', completed: false },
      ],
      deliverable: 'Submission receipts from FDA and Notified Body.',
    },
    {
      id: 'dh-phase-5',
      name: 'Phase 5: Launch & Post-Market Activities',
      duration: 'Months 19-24+',
      objective: 'Achieve regulatory clearance, launch the app on relevant platforms, and establish post-market surveillance.',
      keyTasks: [
        { id: 'dh-t5-1', text: 'Respond to regulatory body inquiries (e.g., FDA RTA/AI letters).', completed: false },
        { id: 'dh-t5-2', text: 'Receive FDA clearance/approval and CE Mark certificate.', completed: false },
        { id: 'dh-t5-3', text: 'Deploy application to App Store / Google Play with compliant labeling.', completed: false },
        { id: 'dh-t5-4', text: 'Implement Post-Market Surveillance (PMS) and Post-Market Clinical Follow-up (PMCF) plans.', completed: false },
      ],
      deliverable: 'Regulatory clearances, app live on stores, and initial PMS report.',
    },
  ],
};
interface EcosystemState {
  contacts: Contact[];
  events: KismetEvent[];
  communities: Community[];
  organizations: Organization[];
  skills: Skill[];
  projects: Project[];
  knowledge: KnowledgeItem[];
  relationships: Relationship[];
  criticalPaths: CriticalPath[];
  activeCriticalPathId: string | null;
  googleCalendarConnected: boolean;
  linkedInConnected: boolean;
  githubConnected: boolean;
  slackConnected: boolean;
  notionConnected: boolean;
  meetupConnected: boolean;
  discordConnected: boolean;
  eventbriteConnected: boolean;
  crunchbaseConnected: boolean;
  twitterConnected: boolean;
  addContact: (name: string, email?: string) => void;
  importEcosystem: (data: {
    contacts?: {name: string;email?: string;}[];
    events?: {name: string;}[];
    communities?: {name: string;}[];
    organizations?: {name: string;}[];
    skills?: {name: string;}[];
    projects?: {name: string;}[];
    knowledge?: {name: string;url?: string;}[];
  }) => {importedCounts: Record<string, number>; importedTypes: string[]};
  removeContact: (id: string) => void;
  addEvent: (name: string) => void;
  removeEvent: (id: string) => void;
  addCommunity: (name: string) => void;
  removeCommunity: (id: string) => void;
  addOrganization: (name: string) => void;
  removeOrganization: (id: string) => void;
  addSkill: (name: string) => void;
  removeSkill: (id: string) => void;
  addProject: (name: string) => void;
  removeProject: (id: string) => void;
  addKnowledgeItem: (name: string, url?: string) => void;
  removeKnowledgeItem: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  removeRelationship: (id: string) => void;
  addCriticalPath: (path: Omit<CriticalPath, 'id' | 'phases'>) => void;
  removeCriticalPath: (id: string) => void;
  setActiveCriticalPath: (id: string | null) => void;
  updateCriticalPathTask: (phaseId: string, taskId: string, data: Partial<CriticalPathTask>) => void;
  connectGoogleCalendar: () => void;
  disconnectGoogleCalendar: () => void;
  connectLinkedIn: () => void;
  disconnectLinkedIn: () => void;
  connectGithub: () => void;
  disconnectGithub: () => void;
  connectSlack: () => void;
  disconnectSlack: () => void;
  connectNotion: () => void;
  disconnectNotion: () => void;
  connectMeetup: () => void;
  disconnectMeetup: () => void;
  connectDiscord: () => void;
  disconnectDiscord: () => void;
  connectEventbrite: () => void;
  disconnectEventbrite: () => void;
  connectCrunchbase: () => void;
  disconnectCrunchbase: () => void;
  connectTwitter: () => void;
  disconnectTwitter: () => void;
  clear: () => void;
}
const initialState = {
  contacts: [],
  events: [],
  communities: [],
  organizations: [],
  skills: [],
  projects: [],
  knowledge: [],
  relationships: [],
  criticalPaths: [commercializationCriticalPath, digitalHealthCriticalPath],
  activeCriticalPathId: commercializationCriticalPath.id,
  googleCalendarConnected: false,
  linkedInConnected: false,
  githubConnected: false,
  slackConnected: false,
  notionConnected: false,
  meetupConnected: false,
  discordConnected: false,
  eventbriteConnected: false,
  crunchbaseConnected: false,
  twitterConnected: false
};
export const useEcosystemStore = create<EcosystemState>()(
  persist(
    (set, get) => ({
      ...initialState,
      importEcosystem: (data) => {
        const importedCounts: Record<string, number> = {
          contacts: 0, events: 0, communities: 0, organizations: 0, skills: 0, projects: 0, knowledge: 0
        };
        const currentState = get();
        const newState = { ...currentState };
        const existingContactNames = new Set(currentState.contacts.map((c) => c.name.toLowerCase()));
        const newContacts: Contact[] = [];
        (data.contacts || []).forEach((item) => {
          if (!existingContactNames.has(item.name.toLowerCase())) {
            newContacts.push({ id: uuidv4(), name: item.name, email: item.email });
            importedCounts.contacts++;
          }
        });
        newState.contacts = [...currentState.contacts, ...newContacts];
        const merge = <T extends {id: string;name: string;},>(
        currentStateItems: T[],
        importedItems: {name: string;}[] | undefined,
        key: keyof typeof importedCounts)
        : T[] => {
          if (!importedItems) return currentStateItems;
          const existingNames = new Set(currentStateItems.map((i) => i.name.toLowerCase()));
          const newItems: T[] = [];
          importedItems.forEach((item) => {
            if (!existingNames.has(item.name.toLowerCase())) {
              newItems.push({ ...item, id: uuidv4() } as T);
              importedCounts[key]++;
            }
          });
          return [...currentStateItems, ...newItems];
        };
        newState.events = merge(currentState.events, data.events, 'events');
        newState.communities = merge(currentState.communities, data.communities, 'communities');
        newState.organizations = merge(currentState.organizations, data.organizations, 'organizations');
        newState.skills = merge(currentState.skills, data.skills, 'skills');
        newState.projects = merge(currentState.projects, data.projects, 'projects');
        const existingKnowledgeNames = new Set(currentState.knowledge.map((k) => k.name.toLowerCase()));
        const newKnowledgeItems: KnowledgeItem[] = [];
        (data.knowledge || []).forEach((item) => {
          if (!existingKnowledgeNames.has(item.name.toLowerCase())) {
            newKnowledgeItems.push({ ...item, id: uuidv4() });
            importedCounts.knowledge++;
          }
        });
        newState.knowledge = [...currentState.knowledge, ...newKnowledgeItems];
        set(newState);
        const importedTypes = Object.entries(importedCounts)
          .filter(([, count]) => count > 0)
          .map(([type]) => type);
        return { importedCounts, importedTypes };
      },
      addContact: (name, email) => set((state) => ({ contacts: [...state.contacts, { id: uuidv4(), name, email }] })),
      removeContact: (id) => set((state) => ({ contacts: state.contacts.filter((c) => c.id !== id) })),
      addEvent: (name) => set((state) => ({ events: [...state.events, { id: uuidv4(), name }] })),
      removeEvent: (id) => set((state) => ({ events: state.events.filter((e) => e.id !== id) })),
      addCommunity: (name) => set((state) => ({ communities: [...state.communities, { id: uuidv4(), name }] })),
      removeCommunity: (id) => set((state) => ({ communities: state.communities.filter((c) => c.id !== id) })),
      addOrganization: (name) => set((state) => ({ organizations: [...state.organizations, { id: uuidv4(), name }] })),
      removeOrganization: (id) => set((state) => ({ organizations: state.organizations.filter((o) => o.id !== id) })),
      addSkill: (name) => set((state) => ({ skills: [...state.skills, { id: uuidv4(), name }] })),
      removeSkill: (id) => set((state) => ({ skills: state.skills.filter((s) => s.id !== id) })),
      addProject: (name) => set((state) => ({ projects: [...state.projects, { id: uuidv4(), name }] })),
      removeProject: (id) => set((state) => ({ projects: state.projects.filter((p) => p.id !== id) })),
      addKnowledgeItem: (name, url) => set((state) => ({ knowledge: [...state.knowledge, { id: uuidv4(), name, url }] })),
      removeKnowledgeItem: (id) => set((state) => ({ knowledge: state.knowledge.filter((k) => k.id !== id) })),
      addRelationship: (relationship) => set((state) => ({ relationships: [...state.relationships, { ...relationship, id: uuidv4() }] })),
      removeRelationship: (id) => set((state) => ({ relationships: state.relationships.filter((r) => r.id !== id) })),
      addCriticalPath: (path) => set((state) => {
        const newPath: CriticalPath = { ...path, id: uuidv4(), phases: [] };
        return { criticalPaths: [...state.criticalPaths, newPath] };
      }),
      removeCriticalPath: (id) => set((state) => ({
        criticalPaths: state.criticalPaths.filter(p => p.id !== id),
        activeCriticalPathId: state.activeCriticalPathId === id ? null : state.activeCriticalPathId,
      })),
      setActiveCriticalPath: (id) => set({ activeCriticalPathId: id }),
      updateCriticalPathTask: (phaseId, taskId, data) => set(produce((state: EcosystemState) => {
        const activePath = state.criticalPaths.find(p => p.id === state.activeCriticalPathId);
        if (activePath) {
          const phase = activePath.phases.find(p => p.id === phaseId);
          if (phase) {
            const task = phase.keyTasks.find(t => t.id === taskId);
            if (task) {
              Object.assign(task, data);
            }
          }
        }
      })),
      connectGoogleCalendar: () => set({ googleCalendarConnected: true }),
      disconnectGoogleCalendar: () => set({ googleCalendarConnected: false }),
      connectLinkedIn: () => set({ linkedInConnected: true }),
      disconnectLinkedIn: () => set({ linkedInConnected: false }),
      connectGithub: () => set({ githubConnected: true }),
      disconnectGithub: () => set({ githubConnected: false }),
      connectSlack: () => set({ slackConnected: true }),
      disconnectSlack: () => set({ slackConnected: false }),
      connectNotion: () => set({ notionConnected: true }),
      disconnectNotion: () => set({ notionConnected: false }),
      connectMeetup: () => set({ meetupConnected: true }),
      disconnectMeetup: () => set({ meetupConnected: false }),
      connectDiscord: () => set({ discordConnected: true }),
      disconnectDiscord: () => set({ discordConnected: false }),
      connectEventbrite: () => set({ eventbriteConnected: true }),
      disconnectEventbrite: () => set({ eventbriteConnected: false }),
      connectCrunchbase: () => set({ crunchbaseConnected: true }),
      disconnectCrunchbase: () => set({ crunchbaseConnected: false }),
      connectTwitter: () => set({ twitterConnected: true }),
      disconnectTwitter: () => set({ twitterConnected: false }),
      clear: () => set(initialState)
    }),
    {
      name: 'cynq-ecosystem-storage'
    }
  )
);