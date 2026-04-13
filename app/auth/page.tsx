'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store/authStore';
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase/auth';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

export default function AuthPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState<'google' | 'guest' | null>(null);
  const [error, setError] = useState('');

  const handleGoogle = async () => {
    setLoading('google'); setError('');
    try {
      const user = await signInWithGoogle();
      setUser(user);
      router.replace('/home');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      setError(msg.includes('not configured') ? 'Firebase not set up. Play as guest.' : 'Sign-in failed. Try again.');
    } finally { setLoading(null); }
  };

  const handleGuest = async () => {
    setLoading('guest'); setError('');
    try {
      const user = await signInAsGuest();
      setUser(user);
      router.replace('/home');
    } catch { setError('Something went wrong. Refresh and retry.'); }
    finally { setLoading(null); }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#0A0A0A] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />
      </div>

      {/* Hero */}
      <motion.div
        variants={container} initial="hidden" animate="show"
        className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-8"
      >
        {/* Logo mark */}
        <motion.div variants={item} className="flex flex-col items-center gap-5">
          <div className="relative animate-float">
            <div className="absolute inset-0 rounded-full blur-xl bg-[#4ADE80]/20 scale-110" />
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="relative z-10">
              <circle cx="36" cy="34" r="22" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="34" cy="32" r="9" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="41" y1="39" x2="50" y2="48" stroke="#4ADE80" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="24" cy="58" r="2.5" fill="#4ADE80" opacity="0.7" />
              <circle cx="30" cy="63" r="1.5" fill="#4ADE80" opacity="0.4" />
              <circle cx="37" cy="66" r="1" fill="#4ADE80" opacity="0.2" />
            </svg>
          </div>

          <div>
            <h1 className="text-5xl font-black tracking-tight text-[#F0F0F0]">
              DEDUCE
            </h1>
            <p className="text-[#4ADE80] text-sm font-semibold tracking-[0.2em] uppercase mt-2">
              Daily Logic Mystery
            </p>
          </div>
        </motion.div>

        {/* Stats pills */}
        <motion.div variants={item} className="flex items-center gap-3">
          {[['4', 'Puzzles'], ['Daily', 'Case'], ['10+', 'Cases']].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center px-4 py-2 rounded-2xl border border-[#242424] bg-[#161616]">
              <span className="text-lg font-bold text-[#4ADE80]">{val}</span>
              <span className="text-[10px] text-[#888] uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p variants={item} className="text-[#888] text-sm leading-relaxed max-w-[280px]">
          A new mystery every day. Deduce{' '}
          <span className="text-[#F0F0F0] font-medium">who</span>,{' '}
          <span className="text-[#F0F0F0] font-medium">when</span>,{' '}
          <span className="text-[#F0F0F0] font-medium">where</span> and{' '}
          <span className="text-[#F0F0F0] font-medium">how</span>{' '}
          using 4 logic challenges.
        </motion.p>
      </motion.div>

      {/* Auth panel */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: 'spring' as const, stiffness: 200, damping: 24 }}
        className="px-6 pb-safe pb-10 pt-6 flex flex-col gap-3 border-t border-[#1A1A1A]"
      >
        {error && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-xs text-[#F87171] text-center bg-[#F87171]/10 border border-[#F87171]/20 rounded-xl px-4 py-2"
          >
            {error}
          </motion.p>
        )}

        <Button
          variant="glass"
          size="lg"
          fullWidth
          loading={loading === 'google'}
          onClick={handleGoogle}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          }
        >
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1E1E1E]" />
          <span className="text-xs text-[#555]">or</span>
          <div className="flex-1 h-px bg-[#1E1E1E]" />
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          glow
          loading={loading === 'guest'}
          onClick={handleGuest}
        >
          Play as Guest →
        </Button>

        <p className="text-[11px] text-[#555] text-center leading-relaxed">
          Guest progress is saved locally. Sign in to sync across devices.
        </p>
      </motion.div>
    </div>
  );
}
