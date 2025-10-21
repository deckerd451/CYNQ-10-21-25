import React, { useState } from 'react';
import { useEcosystemStore } from '@/stores/ecosystemStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Flag } from 'lucide-react';
import { toast } from 'sonner';
export const CriticalPathManager: React.FC = () => {
  const { criticalPaths, activeCriticalPathId, addCriticalPath, removeCriticalPath, setActiveCriticalPath } = useEcosystemStore();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPathTitle, setNewPathTitle] = useState('');
  const [newPathDescription, setNewPathDescription] = useState('');
  const [newPathTimeline, setNewPathTimeline] = useState('');
  const handleCreatePath = () => {
    if (!newPathTitle.trim()) {
      toast.error("Title is required to create a new path.");
      return;
    }
    addCriticalPath({
      title: newPathTitle,
      description: newPathDescription,
      overallTimeline: newPathTimeline,
    });
    toast.success(`Critical Path "${newPathTitle}" created.`);
    setNewPathTitle('');
    setNewPathDescription('');
    setNewPathTimeline('');
    setIsCreateOpen(false);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="w-6 h-6 text-accent" />
          Manage Critical Paths
        </CardTitle>
        <CardDescription>Select, create, or remove your strategic plans.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Create New Path
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Critical Path</DialogTitle>
              <DialogDescription>
                Provide the details for your new strategic plan. You can add phases and tasks later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Path Title (e.g., Q3 Product Launch)"
                value={newPathTitle}
                onChange={(e) => setNewPathTitle(e.target.value)}
              />
              <Textarea
                placeholder="Description"
                value={newPathDescription}
                onChange={(e) => setNewPathDescription(e.target.value)}
              />
              <Input
                placeholder="Overall Timeline (e.g., 3 Months)"
                value={newPathTimeline}
                onChange={(e) => setNewPathTimeline(e.target.value)}
              />
            </div>
            <Button onClick={handleCreatePath}>Create Path</Button>
          </DialogContent>
        </Dialog>
        <ScrollArea className="h-40">
          <RadioGroup
            value={activeCriticalPathId || ''}
            onValueChange={setActiveCriticalPath}
            className="space-y-2 pr-4"
          >
            {criticalPaths.map(path => (
              <div key={path.id} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                <div className="flex items-center space-x-2 min-w-0">
                  <RadioGroupItem value={path.id} id={path.id} />
                  <Label htmlFor={path.id} className="font-medium cursor-pointer truncate">{path.title}</Label>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCriticalPath(path.id);
                    toast.info(`Path "${path.title}" removed.`);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </RadioGroup>
          {criticalPaths.length === 0 && (
            <p className="text-sm text-muted-foreground text-center pt-10">No critical paths created yet.</p>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};