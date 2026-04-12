'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DeduceUser } from '@/types';

interface AuthState {
  user: DeduceUser | null;
  isLoading: boolean;
  setUser: (user: DeduceUser | null) => void;
  setLoading: (v: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'deduce-auth',
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
