import React, { useMemo } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useEcosystemStore } from '@/stores/ecosystemStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import type { SessionInfo, UserProfileContext } from '../../../worker/types';
import { ScrollArea } from '../ui/scroll-area';
import { CriticalPathDisplay } from '../ecosystem/CriticalPathDisplay';
import { AiSuggestionsPanel } from '../ai/AiSuggestionsPanel';
import { useAiSuggestions } from '@/hooks/useAiSuggestions';
import { Flag, Lightbulb } from 'lucide-react';
interface ChatViewProps {
  activeSessionId: string | null;
  activeSession?: SessionInfo;
  loadSessions: () => Promise<void>;
}
export const ChatView: React.FC<ChatViewProps> = ({ activeSessionId, activeSession, loadSessions }) => {
  const goals = useUserProfileStore(state => state.goals);
  const { ecosystemDataItems, relationships, criticalPaths, activeCriticalPathId } = useEcosystemStore(state => ({
    ecosystemDataItems: state.ecosystemDataItems,
    relationships: state.relationships,
    criticalPaths: state.criticalPaths,
    activeCriticalPathId: state.activeCriticalPathId,
  }));

  const userContext = useMemo((): UserProfileContext => ({
    goals,
    ecosystemDataItems,
    relationships,
    criticalPaths,
    activeCriticalPathId,
  }), [goals, ecosystemDataItems, relationships, criticalPaths, activeCriticalPathId]);
  const { suggestions, isLoading: isLoadingSuggestions, error: suggestionsError } = useAiSuggestions(activeSessionId, userContext);
  const activeCriticalPath = useMemo(() => {
    return criticalPaths.find(p => p.id === activeCriticalPathId) || null;
  }, [criticalPaths, activeCriticalPathId]);
  return (
    <ResizablePanelGroup direction="horizontal" className="w-full h-full">
      <ResizablePanel defaultSize={100} minSize={40}>
        <ChatInterface
          activeSessionId={activeSessionId}
          activeSession={activeSession}
          loadSessions={loadSessions}
        />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={25}>
        <Tabs defaultValue="critical-path" className="w-full h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 m-2">
            <TabsTrigger value="critical-path"><Flag className="w-4 h-4 mr-2" />Critical Path</TabsTrigger>
            <TabsTrigger value="suggestions"><Lightbulb className="w-4 h-4 mr-2" />AI Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="critical-path" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 pt-0">
                <CriticalPathDisplay activeCriticalPath={activeCriticalPath} />
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="suggestions" className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 pt-0">
                <AiSuggestionsPanel
                  suggestions={suggestions}
                  isLoading={isLoadingSuggestions}
                  error={suggestionsError}
                />
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};