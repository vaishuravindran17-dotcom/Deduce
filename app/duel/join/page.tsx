'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { isFirebaseConfigured } from '@/lib/firebase/config';

export default function JoinDuelPage() {
  const router   = useRouter();
  const { user } = useAuthStore();

  const [code,      setCode]      = useState('');
  const [status,    setStatus]    = useState<'idle' | 'joining' | 'error'>('idle');
  const [errorMsg,  setErrorMsg]  = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJoin = async () => {
    if (!user) { router.replace('/auth'); return; }
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length !== 6) {
      setErrorMsg('Enter the full 6-character code.');
      setStatus('error');
      return;
    }
    if (!isFirebaseConfigured) {
      setErrorMsg('Firebase is not configured. Sign in with Google to play online.');
      setStatus('error');
      return;
    }

    setStatus('joining');
    setErrorMsg('');
    try {
      const { joinByInviteCode } = await import('@/lib/firebase/duel');
      const duelId = await joinByInviteCode(trimmed, {
        uid:         user.uid,
        displayName: user.displayName ?? 'Detective',
        photoURL:    user.photoURL,
        isGuest:     user.isGuest ?? false,
      });
      router.replace(`/duel/${duelId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong.';
      setErrorMsg(msg === 'Invalid invite code' ? 'Code not found — check for typos.' : msg);
      setStatus('error');
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setCode(val);
    if (status === 'error') { setStatus('idle'); setErrorMsg(''); }
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* Header */}
      <header className="sticky top-0 z-10" style={{ background: 'rgba(12,12,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="game-container h-14 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            style={{ width: 34, height: 34, borderRadius: 8, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#60A5FA' }} />
            <span className="font-game tracking-widest" style={{ fontSize: 12, color: '#60A5FA' }}>JOIN A DUEL</span>
          </div>
          <div style={{ width: 34 }} />
        </div>
        <div className="game-container pb-3">
          <div className="rounded-full" style={{ height: 2, background: '#60A5FA' }} />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 flex flex-col items-center justify-center game-container" style={{ padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full flex flex-col items-center"
          style={{ gap: 28, maxWidth: 360 }}
        >
          {/* Icon */}
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
            🔗
          </div>

          <div className="text-center">
            <h1 className="font-game tracking-widest" style={{ fontSize: 22, color: '#F0F0F4', marginBottom: 8 }}>
              ENTER INVITE CODE
            </h1>
            <p style={{ fontSize: 13, color: '#5A5A6E', lineHeight: 1.5 }}>
              Type the 6-character code your opponent shared with you
            </p>
          </div>

          {/* Code input */}
          <div className="w-full">
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={handleInput}
              onKeyDown={e => e.key === 'Enter' && code.length === 6 && handleJoin()}
              placeholder="A B C 1 2 3"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              maxLength={6}
              className="w-full font-game text-center"
              style={{
                padding: '18px 20px',
                borderRadius: 14,
                background: '#141418',
                border: `1px solid ${status === 'error' ? 'rgba(239,68,68,0.4)' : code.length === 6 ? 'rgba(96,165,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                color: '#F0F0F4',
                fontSize: 28,
                letterSpacing: '0.5em',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
            />
          </div>

          {/* Error */}
          <AnimatePresence>
            {status === 'error' && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ width: '100%', padding: '10px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', textAlign: 'center' }}
              >
                <p style={{ fontSize: 13, color: '#EF4444' }}>{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Join button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleJoin}
            disabled={status === 'joining' || code.length < 6}
            className="w-full font-game tracking-widest uppercase"
            style={{
              padding: '16px 20px', borderRadius: 14, fontSize: 14,
              background: code.length === 6 ? '#60A5FA' : '#1C1C22',
              color: code.length === 6 ? '#0C0C0F' : '#5A5A6E',
              border: code.length === 6 ? 'none' : '1px solid rgba(255,255,255,0.07)',
              opacity: status === 'joining' ? 0.6 : 1,
              transition: 'all 0.2s',
            }}
          >
            {status === 'joining' ? 'Joining…' : 'Join Duel →'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
