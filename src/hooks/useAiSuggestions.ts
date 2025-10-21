import { useState, useEffect, useMemo } from 'react';
import { chatService } from '@/lib/chat';
import type { RelationshipSuggestion, UserProfileContext } from '../../worker/types';
export const useAiSuggestions = (sessionId: string | null, context: UserProfileContext) => {
  const [suggestions, setSuggestions] = useState<RelationshipSuggestion[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contextKey = useMemo(() => JSON.stringify(context), [context]);
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!sessionId) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await chatService.getRelationshipSuggestions(sessionId, context);
        if (response.success && response.data) {
          setSuggestions(response.data);
        } else {
          throw new Error(response.error || 'Failed to fetch suggestions.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    // Fetch suggestions when the component mounts or context changes significantly
    // A simple timeout can debounce this to avoid excessive calls
    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 1000); // Debounce for 1 second
    return () => clearTimeout(handler);
  }, [sessionId, contextKey]); // context is intentionally omitted, as contextKey ensures the effect runs only when the context value changes.
  return { suggestions, isLoading, error };
};