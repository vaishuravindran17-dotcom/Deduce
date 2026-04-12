'use client';
import { ReactNode, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { onAuthChange } from '@/lib/firebase/auth';

export function Providers({ children }: { children: ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    setLoading(true);
    const unsub = onAuthChange((user) => {
      setUser(user);
      setLoading(false);
    });
    // If Firebase isn't configured, stop loading after short delay
    const fallback = setTimeout(() => setLoading(false), 500);
    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
