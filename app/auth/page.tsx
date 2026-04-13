'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase/auth';

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
      setError(msg.includes('not configured') ? 'Firebase not set up — play as guest.' : 'Sign-in failed. Try again.');
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
    <div className="min-h-dvh flex flex-col bg-[#141414]">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-10">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Logo mark — lime magnifier */}
          <div className="relative animate-float">
            <div
              className="absolute inset-0 rounded-full blur-2xl"
              style={{ background: 'radial-gradient(circle, rgba(200,255,87,0.18) 0%, transparent 70%)', transform: 'scale(1.4)' }}
            />
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="relative z-10">
              <circle cx="36" cy="36" r="22" stroke="#C8FF57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="35" cy="35" r="10" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="43" y1="43" x2="56" y2="56" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <h1 className="text-6xl font-black tracking-tight text-white" style={{ letterSpacing: '-0.02em' }}>
              DEDUCE
            </h1>
            <p className="text-[#C8FF57] text-xs font-bold tracking-[0.3em] uppercase mt-3">
              Daily Logic Mystery
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          {[['4', 'Puzzles'], ['Daily', 'Case'], ['10+', 'Cases']].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center px-5 py-3 rounded-2xl bg-[#1E1E1E]">
              <span className="text-xl font-black text-white">{val}</span>
              <span className="text-[10px] text-[#666] uppercase tracking-wider mt-0.5">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="text-[#666] text-sm leading-relaxed max-w-[260px]"
        >
          Solve <span className="text-white font-semibold">who</span>,{' '}
          <span className="text-white font-semibold">when</span>,{' '}
          <span className="text-white font-semibold">where</span> and{' '}
          <span className="text-white font-semibold">how</span> using 4 logic puzzles.
        </motion.p>
      </div>

      {/* Auth buttons */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
        className="px-6 pb-safe pb-10 pt-6 flex flex-col gap-3"
      >
        {error && (
          <p className="text-xs text-[#F87171] text-center bg-[#F87171]/10 rounded-xl px-4 py-2 mb-1">
            {error}
          </p>
        )}

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#1E1E1E] text-white font-bold text-sm transition-all hover:bg-[#252525] active:scale-95 disabled:opacity-50"
        >
          {loading === 'google' ? (
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          Continue with Google
        </button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#252525]" />
          <span className="text-xs text-[#444]">or</span>
          <div className="flex-1 h-px bg-[#252525]" />
        </div>

        {/* Guest — lime CTA */}
        <button
          onClick={handleGuest}
          disabled={!!loading}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50"
          style={{ background: '#C8FF57', color: '#141414' }}
        >
          {loading === 'guest' ? (
            <div className="w-4 h-4 border-2 border-[#141414]/30 border-t-[#141414] rounded-full animate-spin" />
          ) : (
            'Play as Guest →'
          )}
        </button>

        <p className="text-[11px] text-[#444] text-center">
          Guest progress saved locally · Sign in to sync across devices
        </p>
      </motion.div>
    </div>
  );
}
