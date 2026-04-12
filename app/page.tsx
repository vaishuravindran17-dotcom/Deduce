'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

export default function RootPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;
    if (user) {
      router.replace('/home');
    } else {
      router.replace('/auth');
    }
  }, [user, isLoading, router]);

  // Splash / loading state
  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="18" r="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19" cy="17" r="5" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="23" y1="21" x2="27" y2="25" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="13" cy="32" r="1.5" fill="#4ADE80" opacity="0.8" />
          <circle cx="17" cy="35" r="1" fill="#4ADE80" opacity="0.5" />
          <circle cx="21" cy="37" r="0.7" fill="#4ADE80" opacity="0.3" />
        </svg>
        <span className="text-[#9A9A9A] text-sm tracking-widest font-medium uppercase">
          Deduce
        </span>
      </div>
    </div>
  );
}
