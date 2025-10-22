import { useEffect, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { ecosystemService } from '@/lib/supabaseEcosystemService';
import { chatService } from '@/lib/supabaseChatService';
import { userService } from '@/lib/supabaseUserService';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Initialize auth on mount
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Update service user IDs when user changes
    const userId = user?.id || null;
    ecosystemService.setUserId(userId);
    chatService.setUserId(userId);
    userService.setUserId(userId);
  }, [user]);

  return <>{children}</>;
}
