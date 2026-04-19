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

  if (!user || !ABSTRACT_TYPE_META[type]) { router.replace('/home'); return null; }

  const meta  = ABSTRACT_TYPE_META[type];
  const color = meta.color;
  const ca    = (a: number) => hexAlpha(color, a);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{ background: 'rgba(12,12,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="game-container h-14 flex items-center gap-3">
          <button
            onClick={() => router.push('/home')}
            className="flex items-center justify-center shrink-0"
            style={{ width: 34, height: 34, borderRadius: 8, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="font-game tracking-widest" style={{ fontSize: 13, color }}>{meta.label.toUpperCase()}</span>
          </div>
          <div style={{ width: 34 }} />
        </div>
        <div className="game-container pb-3">
          <div className="rounded-full" style={{ height: 2, background: color }} />
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────────── */}
      <div
        className="flex-1 flex flex-col items-center"
        style={{ padding: '40px 24px 40px', maxWidth: 480, margin: '0 auto', width: '100%' }}
      >
        {/* Icon + title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 280, damping: 22 }}
          className="flex flex-col items-center"
          style={{ marginBottom: 36, gap: 16 }}
        >
          <div
            className="flex items-center justify-center"
            style={{ width: 84, height: 84, borderRadius: 24, background: '#1C1C22', border: `1px solid ${ca(0.25)}`, fontSize: 38 }}
          >
            {meta.emoji}
          </div>
          <div className="text-center">
            <h1
              className="font-game text-white"
              style={{ fontSize: 28, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}
            >
              {meta.label.toUpperCase()}
            </h1>
            <p style={{ fontSize: 13, color: '#5A5A6E', lineHeight: 1.5 }}>{meta.description}</p>
          </div>
        </motion.div>

        <div className="w-full flex flex-col" style={{ gap: 8 }}>

          {/* Difficulty */}
          <p className="font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#5A5A6E', marginBottom: 4 }}>
            Difficulty
          </p>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {DIFFICULTIES.map(d => (
              <motion.button
                key={d.key}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDifficulty(d.key)}
                style={
                  selectedDifficulty === d.key
                    ? { flex: 1, padding: '10px 6px', borderRadius: 10, textAlign: 'center', background: ca(0.15), border: `1px solid ${ca(0.45)}` }
                    : { flex: 1, padding: '10px 6px', borderRadius: 10, textAlign: 'center', background: '#1A1A20', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: selectedDifficulty === d.key ? color : '#F0F0F4', marginBottom: 3 }}>
                  {d.label}
                </p>
                <p style={{ fontSize: 10, color: '#5A5A6E' }}>{d.sub}</p>
              </motion.button>
            ))}
          </div>

          {/* Choose Mode */}
          <p className="font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.16em', color: '#5A5A6E', marginBottom: 4 }}>
            Choose Mode
          </p>

          {/* Time Attack card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{
              background: ca(0.06), border: `1px solid ${ca(0.35)}`,
              borderRadius: 16, padding: '18px 18px',
              display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
              }}
            >
              ⏱
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: '#F0F0F4', marginBottom: 3 }}>Time Attack</p>
              <p style={{ fontSize: 12, color: '#5A5A6E', marginBottom: 16 }}>Solve as many puzzles as possible before time runs out</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {DURATIONS.map(d => (
                  <motion.button
                    key={d.seconds}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDuration(d.seconds)}
                    style={
                      selectedDuration === d.seconds
                        ? { flex: 1, padding: '9px 6px', borderRadius: 8, textAlign: 'center', background: ca(0.15), border: `1px solid ${ca(0.45)}` }
                        : { flex: 1, padding: '9px 6px', borderRadius: 8, textAlign: 'center', background: '#1A1A20', border: '1px solid rgba(255,255,255,0.07)' }
                    }
                  >
                    <p style={{ fontSize: 13, fontWeight: 700, lineHeight: 1, color: selectedDuration === d.seconds ? color : '#F0F0F4', marginBottom: 2 }}>
                      {d.label}
                    </p>
                    <p style={{ fontSize: 10, color: '#5A5A6E' }}>{d.sub}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Online Duel */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            style={{
              background: ca(0.05), border: `1px solid ${ca(0.2)}`,
              borderRadius: 16, padding: '18px 18px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 14 }}>
              <div
                style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                }}
              >
                🌐
              </div>
              <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#F0F0F4' }}>Online Duel</p>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 4, background: 'rgba(96,165,250,0.12)', color: '#60A5FA', border: '1px solid rgba(96,165,250,0.25)' }}>
                  LIVE
                </span>
              </div>
              <p style={{ fontSize: 12, color: '#5A5A6E' }}>Race a real opponent · same puzzles · 90 seconds</p>
            </div>
            </div>
            {/* Quick Match + Private Room buttons */}
            <div style={{ display: 'flex', gap: 8 }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/duel/lobby?type=${type}&d=${selectedDifficulty}&cat=abstract`)}
                style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: ca(0.12), border: `1px solid ${ca(0.35)}`, textAlign: 'center' }}
              >
                <p style={{ fontSize: 13, fontWeight: 700, color, marginBottom: 2 }}>⚡ Quick Match</p>
                <p style={{ fontSize: 10, color: '#5A5A6E' }}>Random opponent</p>
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => router.push(`/duel/lobby?type=${type}&d=${selectedDifficulty}&cat=abstract&mode=private`)}
                style={{ flex: 1, padding: '10px 8px', borderRadius: 10, background: '#1A1A20', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}
              >
                <p style={{ fontSize: 13, fontWeight: 700, color: '#F0F0F4', marginBottom: 2 }}>🔗 Private Room</p>
                <p style={{ fontSize: 10, color: '#5A5A6E' }}>Invite a friend</p>
              </motion.button>
            </div>
          </motion.div>

          {/* Start button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/abstract/time-attack?type=${type}&d=${selectedDifficulty}&t=${selectedDuration}`)}
            className="w-full font-game tracking-widest uppercase"
            style={{
              marginTop: 24, padding: '16px 20px', borderRadius: 14, fontSize: 14,
              background: color, color: '#0C0C0F', boxShadow: `0 0 32px ${ca(0.3)}`,
            }}
          >
            Start Game →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
