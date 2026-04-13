'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { signInWithGoogle, signInAsGuest } from '@/lib/firebase/auth';

const stats = [
  { value: '4', label: 'Puzzle Types' },
  { value: 'Daily', label: 'New Case' },
  { value: '10+', label: 'Cases' },
  { value: '60s', label: 'Time Attack' },
];

export default function AuthPage() {
  const router  = useRouter();
  const { setUser } = useAuthStore();
  const [loading, setLoading] = useState<'google' | 'guest' | null>(null);
  const [error, setError]     = useState('');

  const handleGoogle = async () => {
    setLoading('google'); setError('');
    try {
      const user = await signInWithGoogle();
      setUser(user);
      router.replace('/home');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      setError(msg.includes('not configured') ? 'Firebase not set up — play as guest.' : 'Sign-in failed.');
    } finally { setLoading(null); }
  };

  const handleGuest = async () => {
    setLoading('guest'); setError('');
    try {
      const user = await signInAsGuest();
      setUser(user);
      router.replace('/home');
    } catch { setError('Something went wrong.'); }
    finally { setLoading(null); }
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-center relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(200,255,87,0.055) 0%, transparent 65%)' }} />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(92,225,230,0.04) 0%, transparent 65%)' }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-lg px-8 flex flex-col items-center gap-10">

        {/* Logo + title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {/* Animated magnifier */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(200,255,87,0.25) 0%, transparent 70%)', transform: 'scale(1.6)' }} />
            <svg width="72" height="72" viewBox="0 0 72 72" fill="none" className="relative z-10">
              <circle cx="32" cy="32" r="20" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="32" cy="32" r="9" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="47" y1="47" x2="62" y2="62" stroke="#C8FF57" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* DEDUCE in game font */}
          <div className="text-center">
            <h1
              className="font-game text-[#FFFFFF] leading-none"
              style={{ fontSize: 'clamp(72px, 12vw, 120px)', letterSpacing: '0.05em' }}
            >
              DEDUCE
            </h1>
            <p className="text-[#C8FF57] text-sm font-bold tracking-[0.4em] uppercase mt-2">
              Daily Logic Mystery
            </p>
          </div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-4 gap-3 w-full"
        >
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1 bg-[#181818] rounded-2xl py-3 px-2">
              <span className="font-game text-2xl text-[#C8FF57]">{s.value}</span>
              <span className="text-[10px] text-[#555] uppercase tracking-wider text-center leading-tight">{s.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-[#555] text-center text-sm leading-relaxed max-w-xs"
        >
          A new mystery every day. Solve{' '}
          <span className="text-white font-semibold">who did it</span>,{' '}
          <span className="text-white font-semibold">when</span>,{' '}
          <span className="text-white font-semibold">where</span>{' '}
          and <span className="text-white font-semibold">how</span>{' '}
          using 4 logic puzzles.
        </motion.p>

        {/* Auth buttons */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-3 w-full"
        >
          {error && (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-xs text-[#EF4444] text-center bg-[#EF4444]/10 rounded-xl py-2 px-4"
            >
              {error}
            </motion.p>
          )}

          {/* Google */}
          <button
            onClick={handleGoogle}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-[#1E1E1E] text-white font-bold text-sm transition-all hover:bg-[#252525] active:scale-[0.98] disabled:opacity-40"
          >
            {loading === 'google'
              ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
            }
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1E1E1E]" />
            <span className="text-xs text-[#3A3A3A] font-medium">or</span>
            <div className="flex-1 h-px bg-[#1E1E1E]" />
          </div>

          {/* Guest → lime CTA */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGuest}
            disabled={!!loading}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base tracking-wide transition-all disabled:opacity-40"
            style={{ background: '#C8FF57', color: '#0D0D0D' }}
          >
            {loading === 'guest'
              ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              : 'Play as Guest →'
            }
          </motion.button>

          <p className="text-[11px] text-[#333] text-center">
            Guest progress saved locally · Sign in to sync across devices
          </p>
        </motion.div>
      </div>
    </div>
  );
}
