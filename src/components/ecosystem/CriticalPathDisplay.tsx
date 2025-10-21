import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useEcosystemStore } from '@/stores/ecosystemStore';
import type { CriticalPath, CriticalPathPhase, CriticalPathTask } from '@/types/ecosystem';
import { Flag, Target, CheckCircle2, Clock, Briefcase, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
interface CriticalPathDisplayProps {
  activeCriticalPath: CriticalPath | null;
}
export const CriticalPathDisplay: React.FC<CriticalPathDisplayProps> = ({ activeCriticalPath }) => {
  const { updateCriticalPathTask, organizations } = useEcosystemStore();
  const [filteredOrgId, setFilteredOrgId] = useState<string>('all');
  const orgMap = useMemo(() =>
    organizations.reduce((acc, org) => {
      acc[org.id] = org.name;
      return acc;
    }, {} as Record<string, string>),
  [organizations]);
  if (!activeCriticalPath) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flag className="w-6 h-6 text-accent" />
            Critical Path
          </CardTitle>
          <CardDescription>Your strategic plan to achieve a major objective.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">No active critical path selected.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-6 h-6 text-accent" />
              {activeCriticalPath.title}
            </CardTitle>
            <CardDescription>{activeCriticalPath.description}</CardDescription>
            <div className="flex items-center text-xs text-muted-foreground pt-2 gap-2">
              <Clock className="w-3 h-3" />
              <span>Overall Timeline: {activeCriticalPath.overallTimeline}</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-full sm:w-48">
            <Select value={filteredOrgId} onValueChange={setFilteredOrgId}>
              <SelectTrigger className="text-xs">
                <Filter className="w-3 h-3 mr-2" />
                <SelectValue placeholder="Filter by organization..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={[]} className="w-full">
          {activeCriticalPath.phases.map((phase: CriticalPathPhase) => {
            const filteredTasks = phase.keyTasks.filter(task => {
              if (filteredOrgId === 'all') return true;
              return task.assignedToOrgId === filteredOrgId;
            });
            if (filteredTasks.length === 0 && filteredOrgId !== 'all') {
              return null; // Hide phase if no tasks match filter
            }
            return (
              <AccordionItem value={phase.id} key={phase.id}>
                <AccordionTrigger>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold">{phase.name}</span>
                    <span className="text-xs text-muted-foreground">{phase.duration}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Objective</h4>
                    <p className="text-sm text-muted-foreground">{phase.objective}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2">Key Tasks</h4>
                    <div className="space-y-2">
                      {filteredTasks.length > 0 ? filteredTasks.map((task: CriticalPathTask) => (
                        <div key={task.id} className="flex items-center gap-3 p-2 rounded-md bg-muted/50">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={(checked) => updateCriticalPathTask(phase.id, task.id, { completed: !!checked })}
                          />
                          <label
                            htmlFor={`task-${task.id}`}
                            className={`flex-1 text-sm font-medium cursor-pointer transition-colors break-words ${
                              task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                            }`}
                          >
                            {task.text}
                            {task.assignedToOrgId && orgMap[task.assignedToOrgId] && (
                              <span className="ml-2 text-xs font-normal text-primary inline-flex items-center gap-1">
                                <Briefcase className="w-3 h-3" />
                                {orgMap[task.assignedToOrgId]}
                              </span>
                            )}
                          </label>
                          <Select
                            value={task.assignedToOrgId || 'unassigned'}
                            onValueChange={(orgId) => {
                              updateCriticalPathTask(phase.id, task.id, { assignedToOrgId: orgId === 'unassigned' ? undefined : orgId });
                            }}
                          >
                            <SelectTrigger className="w-[130px] h-7 ml-auto text-xs flex-shrink-0">
                              <SelectValue placeholder="Assign..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">None</SelectItem>
                              {organizations.map(org => (
                                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )) : (
                        <p className="text-xs text-muted-foreground text-center py-4">No tasks for the selected filter in this phase.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" />Deliverable</h4>
                    <p className="text-sm text-muted-foreground">{phase.deliverable}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
};