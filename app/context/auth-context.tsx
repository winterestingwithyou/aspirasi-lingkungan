import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from 'react';
import type { BetterFetchError } from '@better-fetch/fetch';
import { authClient } from '~/lib/auth-client';

type AuthSession = (typeof authClient)['$Infer']['Session'] | null;

type AuthContextValue = {
  session: AuthSession;
  isLoading: boolean;
  error: BetterFetchError | null;
  refreshSession: () => void;
  client: typeof authClient;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const sessionState = authClient.useSession();

  const value = useMemo<AuthContextValue>(
    () => ({
      session: sessionState.data ?? null,
      isLoading: sessionState.isPending,
      error: sessionState.error,
      refreshSession: sessionState.refetch,
      client: authClient,
    }),
    [
      sessionState.data,
      sessionState.error,
      sessionState.isPending,
      sessionState.refetch,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
