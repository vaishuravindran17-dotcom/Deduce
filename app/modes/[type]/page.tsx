'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';
import { LinkGridIcon, TimeTraceIcon, TrueLieIcon, CodeBreakIcon } from '@/components/ui/GameIcons';
import type { PuzzleType } from '@/types';

const COLORS: Record<string, string> = {
  linkGrid: '#A78BFA', timeTrace: '#FB923C',
  trueLie:  '#F472B6', codeBreak: '#2DD4BF',
};

const DURATIONS = [
  { seconds: 60,  label: '1 Min',  sub: '60 sec' },
  { seconds: 180, label: '3 Min',  sub: '3 min' },
  { seconds: 300, label: '5 Min',  sub: '5 min' },
];

function hexAlpha(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function PuzzleIcon({ type, size }: { type: string; size: number }) {
  const c = COLORS[type] ?? '#2DD4BF';
  switch (type) {
    case 'linkGrid':  return <LinkGridIcon  size={size} color={c} />;
    case 'timeTrace': return <TimeTraceIcon size={size} color={c} />;
    case 'trueLie':   return <TrueLieIcon   size={size} color={c} />;
    case 'codeBreak': return <CodeBreakIcon size={size} color={c} />;
    default:          return null;
  }
}

export default function PuzzleTypePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const type = params?.type as string;

  const [selectedDuration, setSelectedDuration] = useState<number | null>(180);

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user || !PUZZLE_META[type]) { router.replace('/modes'); return null; }

  const meta  = PUZZLE_META[type];
  const color = COLORS[type] ?? '#2DD4BF';

  const colorAlpha = (a: number) => hexAlpha(color, a);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{ background: '#0C0C0F', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="game-container h-14 flex items-center gap-3">
          <button
            onClick={() => router.push('/home')}
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
              background: '#1C1C22', border: `1px solid ${colorAlpha(0.25)}`,
            }}
          >
            <PuzzleIcon type={type} size={36} />
          </div>
          <div className="text-center">
            <h1
              className="font-game text-white"
              style={{ fontSize: 26, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}
            >
              {meta.label.toUpperCase()}
            </h1>
            <p style={{ fontSize: 13, color: '#5A5A6E' }}>
              {meta.description}
            </p>
          </div>
        </motion.div>

        {/* Mode section */}
        <div className="w-full flex flex-col" style={{ gap: 10 }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-center" style={{ color: '#5A5A6E' }}>
            Choose Mode
          </p>

          {/* Time Attack card */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-xl overflow-hidden"
            style={{ background: '#141418', border: `1px solid ${colorAlpha(0.2)}` }}
          >
            {/* Mode header row */}
            <div
              className="flex items-center gap-3 px-4 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex items-center justify-center shrink-0 text-xl"
                style={{
                  width: 40, height: 40, borderRadius: 11,
                  background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)',
                }}
              >
                ⏱
              </div>
              <div>
                <p className="font-game text-sm tracking-widest" style={{ color: '#F0F0F4' }}>TIME ATTACK</p>
                <p className="text-xs mt-0.5" style={{ color: '#5A5A6E' }}>Solve as many puzzles as possible</p>
              </div>
            </div>

            {/* Duration picker */}
            <div className="px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: '#5A5A6E' }}>
                Select Duration
              </p>
              <div className="grid grid-cols-3 gap-2">
                {DURATIONS.map(d => (
                  <motion.button
                    key={d.seconds}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDuration(d.seconds)}
                    className="py-3 rounded-lg text-center transition-all"
                    style={
                      selectedDuration === d.seconds
                        ? { background: colorAlpha(0.18), border: `1.5px solid ${colorAlpha(0.45)}`, color }
                        : { background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
                    }
                  >
                    <p className="font-bold text-sm leading-none">{d.label}</p>
                    <p className="text-[10px] mt-1 opacity-70">{d.sub}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Online Duel — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="rounded-xl px-4 py-4 flex items-center gap-3 opacity-30 pointer-events-none"
            style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div
              className="flex items-center justify-center shrink-0 text-xl"
              style={{
                width: 40, height: 40, borderRadius: 11,
                background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              🌐
            </div>
            <div className="flex-1">
              <p className="font-game text-sm tracking-widest" style={{ color: '#F0F0F4' }}>ONLINE DUEL</p>
              <p className="text-xs mt-0.5" style={{ color: '#5A5A6E' }}>Live vs global leaderboard</p>
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-lg"
              style={{ background: '#1C1C22', color: '#5A5A6E' }}
            >
              Soon
            </span>
          </motion.div>

          {/* Start button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={selectedDuration ? { scale: 1.02 } : {}}
            whileTap={selectedDuration ? { scale: 0.97 } : {}}
            onClick={() => selectedDuration && router.push(`/modes/${type}/time-attack?t=${selectedDuration}`)}
            disabled={!selectedDuration}
            className="w-full font-game text-sm tracking-widest uppercase transition-all"
            style={
              selectedDuration
                ? {
                    padding: 15, borderRadius: 12,
                    background: color, color: '#0C0C0F',
                    boxShadow: `0 0 28px ${colorAlpha(0.35)}`,
                  }
                : {
                    padding: 15, borderRadius: 12,
                    background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E',
                  }
            }
          >
            Start Game →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
