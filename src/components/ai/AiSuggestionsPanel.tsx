import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { useEcosystemStore } from '@/stores/ecosystemStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import { toast } from 'sonner';
import { Link as LinkIcon, Lightbulb } from 'lucide-react';
import type { RelationshipSuggestion } from '../../../worker/types';
import { getAllEcosystemItems } from '@/lib/analytics';
interface AiSuggestionsPanelProps {
  suggestions: RelationshipSuggestion[] | null;
  isLoading: boolean;
  error: string | null;
}
export const AiSuggestionsPanel: React.FC<AiSuggestionsPanelProps> = ({ suggestions, isLoading, error }) => {
  const { relationships, addRelationship } = useEcosystemStore();
  const ecosystemData = {
    ...useUserProfileStore.getState(),
    ...useEcosystemStore.getState(),
    criticalPath: useEcosystemStore.getState().criticalPaths.find(p => p.id === useEcosystemStore.getState().activeCriticalPathId) || null,
  };
  const allItems = getAllEcosystemItems(ecosystemData);
  const handleAddRelationship = (suggestion: RelationshipSuggestion) => {
    const { sourceId, sourceType, targetId, targetType } = suggestion;
    const existing = relationships.find(r =>
      (r.sourceId === sourceId && r.targetId === targetId) ||
      (r.sourceId === targetId && r.targetId === sourceId)
    );
    if (existing) {
      toast.info("This relationship already exists.");
      return;
    }
    addRelationship({ sourceId, sourceType, targetId, targetType });
    const sourceName = allItems.find(i => i.id === sourceId)?.name || 'Item';
    const targetName = allItems.find(i => i.id === targetId)?.name || 'Item';
    toast.success(`Linked '${sourceName}' and '${targetName}'.`);
  };
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-9 w-24 ml-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  if (error) {
    return <ErrorDisplay title="Failed to load suggestions" message={error} variant="inline" />;
  }
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-center py-10">
        <Lightbulb className="w-8 h-8 mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">No new suggestions right now.</p>
        <p className="text-xs text-muted-foreground/80 mt-1">As your ecosystem grows, CYNQ will find new connections for you.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {suggestions.map((suggestion, index) => {
        const sourceItem = allItems.find(i => i.id === suggestion.sourceId);
        const targetItem = allItems.find(i => i.id === suggestion.targetId);
        if (!sourceItem || !targetItem) return null;
        return (
          <motion.div
            key={`${suggestion.sourceId}-${suggestion.targetId}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-primary/5 border-primary/20 border-dashed">
              <CardContent className="p-4">
                <p className="text-sm font-semibold">
                  Link <span className="text-primary">{sourceItem.name}</span> with <span className="text-primary">{targetItem.name}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1 italic">"{suggestion.justification}"</p>
                <div className="flex justify-end mt-3">
                  <Button size="sm" onClick={() => handleAddRelationship(suggestion)}>
                    <LinkIcon className="w-3 h-3 mr-1.5" />
                    Create Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};