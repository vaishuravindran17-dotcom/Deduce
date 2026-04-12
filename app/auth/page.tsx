'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase/auth';
import { MagnifyingGlass, DeduceLogoMark } from '@/components/ui/SketchIllustration';

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState<'google' | 'guest' | null>(null);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading('google');
    setError('');
    try {
      const user = await signInWithGoogle();
      setUser(user);
      router.replace('/home');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('not configured')) {
        setError('Firebase is not configured. Play as guest instead.');
      } else {
        setError('Sign-in failed. Try again.');
      }
    } finally {
      setLoading(null);
    }
  };

  const handleGuest = async () => {
    setLoading('guest');
    setError('');
    try {
      const user = await signInAsGuest();
      setUser(user);
      router.replace('/home');
    } catch {
      setError('Something went wrong. Please refresh.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col px-6">
      {/* Decorative top */}
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        {/* Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <DeduceLogoMark size={64} />
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#EAEAEA] tracking-tight">
              Deduce
            </h1>
            <p className="text-[#9A9A9A] text-sm mt-1.5 tracking-wide">
              Daily logic mystery
            </p>
          </div>
        </motion.div>

        {/* Hero illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <MagnifyingGlass size={120} color="#4ADE80" className="opacity-80" />
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="text-center max-w-xs"
        >
          <p className="text-[#9A9A9A] text-sm leading-relaxed">
            Solve a new case every day. Use logic to find{' '}
            <span className="text-[#EAEAEA]">who</span>,{' '}
            <span className="text-[#EAEAEA]">when</span>,{' '}
            <span className="text-[#EAEAEA]">where</span> and{' '}
            <span className="text-[#EAEAEA]">how</span>.
          </p>
        </motion.div>
      </div>

      {/* Auth buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="pb-safe pb-10 flex flex-col gap-3"
      >
        {error && (
          <p className="text-xs text-[#F87171] text-center px-4">{error}</p>
        )}

        {/* Google */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          loading={loading === 'google'}
          onClick={handleGoogle}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          }
        >
          Continue with Google
        </Button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2A2A2A]" />
          <span className="text-xs text-[#9A9A9A]">or</span>
          <div className="flex-1 h-px bg-[#2A2A2A]" />
        </div>

        {/* Guest */}
        <Button
          variant="ghost"
          size="lg"
          fullWidth
          loading={loading === 'guest'}
          onClick={handleGuest}
        >
          Play as Guest
        </Button>

        <p className="text-[11px] text-[#9A9A9A] text-center px-4 leading-relaxed">
          Guest progress is saved locally.{' '}
          Sign in to sync across devices and join leaderboards.
        </p>
      </motion.div>
    </div>
  );
}
