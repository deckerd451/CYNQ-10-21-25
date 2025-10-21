import React, { useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { ChatView } from '@/components/layout/ChatView';
import type { SessionInfo } from "../../worker/types";
interface AppLayoutContext {
  activeSessionId: string | null;
  setActiveSessionId: (id: string | null) => void;
  activeSession?: SessionInfo;
  loadSessions: () => Promise<void>;
}
export function ChatPage() {
  const { sessionId } = useParams<{sessionId: string;}>();
  const { setActiveSessionId, activeSession, loadSessions } = useOutletContext<AppLayoutContext>();
  useEffect(() => {
    if (sessionId) {
      setActiveSessionId(sessionId);
    }
  }, [sessionId, setActiveSessionId]);
  return <ChatView activeSessionId={sessionId || null} activeSession={activeSession} loadSessions={loadSessions} />;
}