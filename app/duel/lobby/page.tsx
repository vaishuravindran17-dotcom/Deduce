'use client';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { isFirebaseConfigured } from '@/lib/firebase/config';
import { ABSTRACT_TYPE_META } from '@/types/abstract';
import type { AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';

function LobbyContent() {
  const router   = useRouter();
  const params   = useSearchParams();
  const { user } = useAuthStore();

  const type       = params.get('type') as AbstractPuzzleType;
  const difficulty = (params.get('d') ?? 'medium') as AbstractDifficulty;

  const [status, setStatus] = useState<'searching' | 'matched' | 'error'>('searching');
  const [errorMsg, setErrorMsg] = useState('');
  const initRef  = useRef(false);
  const unsubRef = useRef<(() => void) | null>(null);

  const meta  = ABSTRACT_TYPE_META[type];
  const color = meta?.color ?? '#60A5FA';

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    if (!meta)  { router.replace('/home'); return; }

    if (!isFirebaseConfigured) {
      setStatus('error');
      setErrorMsg('Online Duel requires Firebase. Sign in with Google to play online.');
      return;
    }

    if (initRef.current) return;
    initRef.current = true;

    const run = async () => {
      try {
        const { createOrJoinMatchmaking, subscribeToDuel } = await import('@/lib/firebase/duel');
        const duelId = await createOrJoinMatchmaking(type, difficulty, {
          uid:         user.uid,
          displayName: user.displayName ?? 'Detective',
          photoURL:    user.photoURL,
          isGuest:     user.isGuest ?? false,
        });

        unsubRef.current = await subscribeToDuel(duelId, (duel) => {
          const twoPlayers = Object.keys(duel.players).length >= 2;
          if (twoPlayers || duel.status === 'starting' || duel.status === 'finished') {
            setStatus('matched');
            setTimeout(() => router.replace(`/duel/${duelId}`), 350);
          }
        });
      } catch {
        setStatus('error');
        setErrorMsg('Connection failed. Check your internet and try again.');
      }
    };

    run();
  }, [user, router, type, difficulty, meta]);

  useEffect(() => () => { unsubRef.current?.(); }, []);

  const handleCancel = async () => {
    if (user && type && difficulty && isFirebaseConfigured) {
      const { cancelMatchmaking } = await import('@/lib/firebase/duel');
      cancelMatchmaking(type, difficulty, user.uid).catch(() => {});
    }
    router.back();
  };

  const diffLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center"
      style={{ background: '#0C0C0F', padding: 24 }}
    >
      {/* Back */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '0 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center' }}>
          <button
            onClick={handleCancel}
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
              color: '#A0A0B0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === 'searching' && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center"
            style={{ gap: 24, maxWidth: 300, textAlign: 'center' }}
          >
            {/* Spinner */}
            <div style={{ position: 'relative', width: 80, height: 80 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 80, height: 80, borderRadius: '50%', position: 'absolute',
                  border: `3px solid rgba(96,165,250,0.08)`,
                  borderTop: `3px solid ${color}`,
                }}
              />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
                🌐
              </div>
            </div>

            <div>
              <p className="font-game tracking-widest" style={{ fontSize: 18, color: '#F0F0F4', marginBottom: 6 }}>
                Finding Opponent
              </p>
              <p style={{ fontSize: 13, color: '#5A5A6E' }}>
                {meta?.label} · {diffLabel}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 7 }}>
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.28 }}
                  style={{ width: 7, height: 7, borderRadius: '50%', background: color }}
                />
              ))}
            </div>

            <button
              onClick={handleCancel}
              style={{
                fontSize: 12, color: '#5A5A6E', padding: '8px 24px',
                borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: 'transparent',
              }}
            >
              Cancel
            </button>
          </motion.div>
        )}

        {status === 'matched' && (
          <motion.div
            key="matched"
            initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
            style={{ gap: 14, textAlign: 'center' }}
          >
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 0.45 }}
              style={{ fontSize: 56, lineHeight: 1 }}
            >
              ⚡
            </motion.div>
            <p className="font-game tracking-widest" style={{ fontSize: 20, color }}>Opponent Found!</p>
            <p style={{ fontSize: 13, color: '#5A5A6E' }}>Starting duel…</p>
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
            style={{ gap: 20, maxWidth: 320, textAlign: 'center' }}
          >
            <div style={{ fontSize: 44 }}>⚠️</div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 600, color: '#F0F0F4', marginBottom: 8 }}>Can't Connect</p>
              <p style={{ fontSize: 13, color: '#5A5A6E', lineHeight: 1.6 }}>{errorMsg}</p>
            </div>
            <button
              onClick={() => router.back()}
              style={{
                padding: '12px 32px', borderRadius: 10,
                background: '#1C1C22', border: '1px solid rgba(255,255,255,0.1)',
                color: '#F0F0F4', fontSize: 14, fontWeight: 600,
              }}
            >
              Go Back
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function DuelLobbyPage() {
  return (
    <Suspense>
      <LobbyContent />
    </Suspense>
  );
}
