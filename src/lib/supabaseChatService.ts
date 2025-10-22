import { supabase } from './supabase';
import type { Message } from '../types/ecosystem';

export interface SessionInfo {
  id: string;
  title: string;
  createdAt: number;
  lastActive: number;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  model: string;
  created_at: string;
  last_active: string;
}

export class SupabaseChatService {
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
  // SESSION MANAGEMENT
  // ============================================================================

  async getSessions(): Promise<SessionInfo[]> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', this.getUserId())
      .order('last_active', { ascending: false });

    if (error) throw error;

    return data.map(session => ({
      id: session.id,
      title: session.title,
      createdAt: new Date(session.created_at).getTime(),
      lastActive: new Date(session.last_active).getTime(),
    }));
  }

  async createSession(model: string = 'gemini-2.5-flash'): Promise<SessionInfo> {
    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: this.getUserId(),
        title: 'New Chat',
        model,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      createdAt: new Date(data.created_at).getTime(),
      lastActive: new Date(data.last_active).getTime(),
    };
  }

  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ title })
      .eq('id', sessionId)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  async updateSessionModel(sessionId: string, model: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .update({ model })
      .eq('id', sessionId)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('id', sessionId)
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  async clearAllSessions(): Promise<void> {
    const { error } = await supabase
      .from('chat_sessions')
      .delete()
      .eq('user_id', this.getUserId());

    if (error) throw error;
  }

  // ============================================================================
  // MESSAGE MANAGEMENT
  // ============================================================================

  async getMessages(sessionId: string): Promise<Message[]> {
    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', this.getUserId())
      .single();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not found');

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    return data.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      timestamp: new Date(msg.timestamp).getTime(),
      toolCalls: msg.tool_calls as any,
    }));
  }

  async addMessage(
    sessionId: string,
    message: Omit<Message, 'id'>
  ): Promise<Message> {
    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', this.getUserId())
      .single();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not found');

    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        session_id: sessionId,
        role: message.role,
        content: message.content,
        timestamp: new Date(message.timestamp).toISOString(),
        tool_calls: message.toolCalls as any,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      role: data.role as 'user' | 'assistant' | 'system',
      content: data.content,
      timestamp: new Date(data.timestamp).getTime(),
      toolCalls: data.tool_calls as any,
    };
  }

  async clearMessages(sessionId: string): Promise<void> {
    // Verify session belongs to user
    const { data: session, error: sessionError } = await supabase
      .from('chat_sessions')
      .select('id')
      .eq('id', sessionId)
      .eq('user_id', this.getUserId())
      .single();

    if (sessionError) throw sessionError;
    if (!session) throw new Error('Session not found');

    const { error } = await supabase
      .from('chat_messages')
      .delete()
      .eq('session_id', sessionId);

    if (error) throw error;
  }

  // ============================================================================
  // REAL-TIME SUBSCRIPTIONS
  // ============================================================================

  subscribeToSessionUpdates(
    sessionId: string,
    onMessage: (message: Message) => void
  ) {
    return supabase
      .channel(`session:${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const msg = payload.new as any;
          onMessage({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp).getTime(),
            toolCalls: msg.tool_calls,
          });
        }
      )
      .subscribe();
  }

  unsubscribeFromSessionUpdates(sessionId: string) {
    supabase.channel(`session:${sessionId}`).unsubscribe();
  }
}

// Export singleton instance
export const chatService = new SupabaseChatService();
