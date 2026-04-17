'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { ABSTRACT_TYPE_META } from '@/types/abstract';
import type { AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';

const DURATIONS = [
  { seconds: 60,  label: '1 Min', sub: '60 sec' },
  { seconds: 180, label: '3 Min', sub: '3 min' },
  { seconds: 300, label: '5 Min', sub: '5 min' },
];

const DIFFICULTIES: { key: AbstractDifficulty; label: string; sub: string }[] = [
  { key: 'easy',   label: 'Easy',   sub: 'Gentle warmup' },
  { key: 'medium', label: 'Medium', sub: 'Some challenge' },
  { key: 'hard',   label: 'Hard',   sub: 'Think deep' },
];

function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function AbstractTypePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const type = params?.type as AbstractPuzzleType;

  const [selectedDuration, setSelectedDuration] = useState(180);
  const [selectedDifficulty, setSelectedDifficulty] = useState<AbstractDifficulty>('medium');

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user || !ABSTRACT_TYPE_META[type]) { router.replace('/abstract'); return null; }

  const meta  = ABSTRACT_TYPE_META[type];
  const color = meta.color;
  const ca    = (a: number) => hexAlpha(color, a);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{ background: '#0C0C0F', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="game-container h-14 flex items-center gap-3">
          <button
            onClick={() => router.push('/abstract')}
            className="flex items-center justify-center shrink-0 transition-colors"
            style={{
              width: 34, height: 34, borderRadius: 8,
              background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="font-game text-sm tracking-widest" style={{ color }}>
              {meta.label.toUpperCase()}
            </span>
          </div>
          <div style={{ width: 34 }} />
        </div>
        <div className="game-container pb-2.5">
          <div className="rounded-full" style={{ height: 3, background: color }} />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center"
        style={{ padding: '36px 24px 32px', maxWidth: 480, margin: '0 auto', width: '100%' }}
      >
        {/* Icon + title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 280, damping: 22 }}
          className="flex flex-col items-center"
          style={{ marginBottom: 32, gap: 18 }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 80, height: 80, borderRadius: 22,
              background: '#1C1C22', border: `1px solid ${ca(0.25)}`,
              fontSize: 36,
            }}
          >
            {meta.emoji}
          </div>
          <div className="text-center">
            <h1
              className="font-game text-white"
              style={{ fontSize: 26, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}
            >
              {meta.label.toUpperCase()}
            </h1>
            <p style={{ fontSize: 13, color: '#5A5A6E' }}>{meta.description}</p>
          </div>
        </motion.div>

        <div className="w-full flex flex-col" style={{ gap: 10 }}>

          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5A6E', marginBottom: 2 }}>
            Difficulty
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
            {DIFFICULTIES.map(d => (
              <motion.button
                key={d.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(d.key)}
                style={
                  selectedDifficulty === d.key
                    ? { flex: 1, padding: '9px 6px', borderRadius: 8, textAlign: 'center', background: ca(0.18), border: `1px solid ${ca(0.45)}` }
                    : { flex: 1, padding: '9px 6px', borderRadius: 8, textAlign: 'center', background: '#23232B', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                <p style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: selectedDifficulty === d.key ? color : '#F0F0F4' }}>
                  {d.label}
                </p>
                <p style={{ fontSize: 10, color: '#5A5A6E', marginTop: 2 }}>{d.sub}</p>
              </motion.button>
            ))}
          </div>

          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#5A5A6E', marginBottom: 2, marginTop: 6 }}>
            Choose Mode
          </p>

          {/* ── Time Attack card ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{
              width: '100%',
              background: ca(0.07),
              border: `1px solid ${ca(0.45)}`,
              borderRadius: 16,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 11,
                flexShrink: 0, marginTop: 1,
                background: 'rgba(251,191,36,0.1)',
                border: '1px solid rgba(251,191,36,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}
            >
              ⏱
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#F0F0F4', marginBottom: 2 }}>Time Attack</p>
              <p style={{ fontSize: 12, color: '#5A5A6E' }}>Solve as many puzzles as possible</p>
              <div style={{ display: 'flex', gap: 8, paddingTop: 14 }}>
                {DURATIONS.map(d => (
                  <motion.button
                    key={d.seconds}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDuration(d.seconds)}
                    style={
                      selectedDuration === d.seconds
                        ? { flex: 1, padding: '9px 6px', borderRadius: 8, textAlign: 'center', background: ca(0.18), border: `1px solid ${ca(0.45)}` }
                        : { flex: 1, padding: '9px 6px', borderRadius: 8, textAlign: 'center', background: '#23232B', border: '1px solid rgba(255,255,255,0.07)' }
                    }
                  >
                    <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: selectedDuration === d.seconds ? color : '#F0F0F4' }}>
                      {d.label}
                    </p>
                    <p style={{ fontSize: 10, color: '#5A5A6E', marginTop: 2 }}>{d.sub}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── Online Duel — coming soon ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            style={{
              width: '100%',
              background: '#141418',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 16,
              padding: '16px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 14,
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 11,
                flexShrink: 0, marginTop: 1,
                background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}
            >
              🌐
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#F0F0F4' }}>Online Duel</p>
                <span
                  style={{
                    fontSize: 9, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    padding: '2px 7px', borderRadius: 4,
                    background: 'rgba(251,146,60,0.15)',
                    color: '#FB923C',
                    border: '1px solid rgba(251,146,60,0.25)',
                  }}
                >
                  SOON
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#5A5A6E' }}>Live vs global leaderboard</p>
            </div>
          </motion.div>

          {/* ── Start button ── */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/abstract/time-attack?type=${type}&d=${selectedDifficulty}&t=${selectedDuration}`)}
            className="w-full font-game tracking-widest uppercase transition-all"
            style={{
              marginTop: 22, padding: 15, borderRadius: 12, fontSize: 14,
              background: color, color: '#0C0C0F',
              boxShadow: `0 0 28px ${ca(0.35)}`,
            }}
          >
            Start Game →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
