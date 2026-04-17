'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { ABSTRACT_TYPE_META, ABSTRACT_PUZZLE_TYPES } from '@/types/abstract';
import type { AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';

const ACCENT = '#60A5FA';

const DIFFICULTIES: { value: AbstractDifficulty; label: string }[] = [
  { value: 'easy',   label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard',   label: 'Hard' },
];

const DURATIONS = [
  { seconds: 60,  label: '1 min' },
  { seconds: 180, label: '3 min' },
  { seconds: 300, label: '5 min' },
];

export default function AbstractHubPage() {
  const router    = useRouter();
  const { user }  = useAuthStore();

  const [dailyDiff,  setDailyDiff]  = useState<AbstractDifficulty>('medium');
  const [taType,     setTaType]     = useState<AbstractPuzzleType>('ruleShift');
  const [taDiff,     setTaDiff]     = useState<AbstractDifficulty>('medium');
  const [taDuration, setTaDuration] = useState(180);

  if (!user) { router.replace('/auth'); return null; }

  function startDaily() {
    router.push(`/abstract/daily?d=${dailyDiff}`);
  }

  function startTimeAttack() {
    router.push(`/abstract/time-attack?type=${taType}&d=${taDiff}&t=${taDuration}`);
  }

  return (
    <div
      className="flex flex-col"
      style={{ background: '#0C0C0F', minHeight: '100dvh', maxWidth: 480, margin: '0 auto' }}
    >
      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="flex items-center shrink-0"
        style={{ padding: '16px 20px', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <button
          onClick={() => router.push('/home')}
          className="flex items-center justify-center shrink-0"
          style={{
            width: 34, height: 34, borderRadius: 8,
            background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11 4l-6 5 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex items-center" style={{ gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
          <span
            className="font-game"
            style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: ACCENT }}
          >
            Abstract Logic
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-auto" style={{ padding: '20px 20px 40px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        {/* ── 4 Type Cards ──────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#5A5A6E' }}>
            Puzzle Types
          </p>
          <div className="grid grid-cols-2" style={{ gap: 10 }}>
            {ABSTRACT_PUZZLE_TYPES.map((type, i) => {
              const meta  = ABSTRACT_TYPE_META[type];
              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl"
                  style={{
                    background: '#141418',
                    border: `1px solid rgba(255,255,255,0.07)`,
                    padding: '14px 16px',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-[10px] mb-2.5"
                    style={{ width: 36, height: 36, background: `${meta.color}18`, fontSize: 18 }}
                  >
                    {meta.emoji}
                  </div>
                  <p
                    className="font-game"
                    style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: meta.color, marginBottom: 3 }}
                  >
                    {meta.label}
                  </p>
                  <p style={{ fontSize: 11, color: '#5A5A6E', lineHeight: 1.4 }}>{meta.description}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Daily Mode ────────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#5A5A6E' }}>
            Daily Challenge
          </p>
          <div
            className="rounded-2xl"
            style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '16px' }}
          >
            <div className="flex items-center" style={{ gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${ACCENT}12`, border: `1px solid ${ACCENT}28`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}
              >
                📅
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F4', marginBottom: 2 }}>Daily Mode</p>
                <p style={{ fontSize: 12, color: '#5A5A6E' }}>4 puzzles · one of each type · seeded daily</p>
              </div>
            </div>

            {/* Difficulty picker */}
            <div className="flex" style={{ gap: 8, marginBottom: 14 }}>
              {DIFFICULTIES.map(d => (
                <motion.button
                  key={d.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDailyDiff(d.value)}
                  className="flex-1 rounded-lg text-center font-bold transition-all"
                  style={
                    dailyDiff === d.value
                      ? { padding: '9px 6px', fontSize: 12, background: `${ACCENT}18`, border: `1px solid ${ACCENT}55`, color: ACCENT }
                      : { padding: '9px 6px', fontSize: 12, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
                  }
                >
                  {d.label}
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={startDaily}
              className="w-full rounded-xl font-bold text-xs tracking-[0.08em] uppercase"
              style={{ padding: '13px 20px', background: `${ACCENT}18`, border: `1px solid ${ACCENT}45`, color: ACCENT }}
            >
              Start Daily →
            </motion.button>
          </div>
        </section>

        {/* ── Time Attack ───────────────────────────────────────────── */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#5A5A6E' }}>
            Time Attack
          </p>
          <div
            className="rounded-2xl"
            style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '16px' }}
          >
            <div className="flex items-center" style={{ gap: 10, marginBottom: 14 }}>
              <div
                style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                }}
              >
                ⏱
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F4', marginBottom: 2 }}>Time Attack</p>
                <p style={{ fontSize: 12, color: '#5A5A6E' }}>Solve as many as you can before time runs out</p>
              </div>
            </div>

            {/* Type selector */}
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#5A5A6E' }}>Puzzle type</p>
            <div className="flex flex-wrap" style={{ gap: 8, marginBottom: 14 }}>
              {ABSTRACT_PUZZLE_TYPES.map(type => {
                const meta = ABSTRACT_TYPE_META[type];
                const active = taType === type;
                return (
                  <motion.button
                    key={type}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTaType(type)}
                    className="rounded-lg font-bold text-xs tracking-wide"
                    style={
                      active
                        ? { padding: '7px 12px', background: `${meta.color}18`, border: `1px solid ${meta.color}55`, color: meta.color }
                        : { padding: '7px 12px', background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
                    }
                  >
                    {meta.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Difficulty selector */}
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#5A5A6E' }}>Difficulty</p>
            <div className="flex" style={{ gap: 8, marginBottom: 14 }}>
              {DIFFICULTIES.map(d => (
                <motion.button
                  key={d.value}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTaDiff(d.value)}
                  className="flex-1 rounded-lg text-center font-bold transition-all"
                  style={
                    taDiff === d.value
                      ? { padding: '9px 6px', fontSize: 12, background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)', color: '#FBBF24' }
                      : { padding: '9px 6px', fontSize: 12, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
                  }
                >
                  {d.label}
                </motion.button>
              ))}
            </div>

            {/* Duration selector */}
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: '#5A5A6E' }}>Duration</p>
            <div className="flex" style={{ gap: 8, marginBottom: 16 }}>
              {DURATIONS.map(d => (
                <motion.button
                  key={d.seconds}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTaDuration(d.seconds)}
                  className="flex-1 rounded-lg text-center transition-all"
                  style={
                    taDuration === d.seconds
                      ? { padding: '9px 6px', background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.4)' }
                      : { padding: '9px 6px', background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }
                  }
                >
                  <p style={{ fontSize: 13, fontWeight: 700, color: taDuration === d.seconds ? '#FBBF24' : '#F0F0F4', lineHeight: 1 }}>
                    {d.label}
                  </p>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={startTimeAttack}
              className="w-full rounded-xl font-bold text-xs tracking-[0.08em] uppercase"
              style={{ padding: '13px 20px', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.35)', color: '#FBBF24' }}
            >
              Start Time Attack →
            </motion.button>
          </div>
        </section>

      </div>
    </div>
  );
}
