import { useState, useEffect } from "react";

export function useAuth() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get or create anonymous session
    const createSession = async () => {
      try {
        const response = await fetch('/api/user/session');
        const data = await response.json();
        setSessionId(data.sessionId);
      } catch (error) {
        console.error('Failed to create session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    createSession();
  }, []);

  return {
    sessionId,
    isLoading,
    isAuthenticated: true, // Always authenticated for anonymous chat
  };
}
