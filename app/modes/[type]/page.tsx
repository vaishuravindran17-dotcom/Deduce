'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';
import { LinkGridIcon, TimeTraceIcon, TrueLieIcon, CodeBreakIcon } from '@/components/ui/GameIcons';
import type { PuzzleType } from '@/types';

const COLORS: Record<string, string> = {
  linkGrid: '#8B5CF6', timeTrace: '#F97316',
  trueLie:  '#EC4899', codeBreak: '#06B6D4',
};

const DURATIONS = [
  { seconds: 60,  label: '1 MIN',  sub: '60 seconds' },
  { seconds: 180, label: '3 MIN',  sub: '3 minutes' },
  { seconds: 300, label: '5 MIN',  sub: '5 minutes' },
];

function PuzzleIcon({ type, size }: { type: string; size: number }) {
  const c = COLORS[type] ?? '#06B6D4';
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
  const type  = params?.type as string;

  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user || !PUZZLE_META[type]) { router.replace('/modes'); return null; }

  const meta  = PUZZLE_META[type];
  const color = COLORS[type] ?? '#06B6D4';

  return (
    <div className="min-h-dvh bg-[#0D0D0D] grid-bg flex flex-col">

      {/* Header */}
      <header className="border-b border-[#1E1E1E] bg-[#0D0D0D]/95 backdrop-blur sticky top-0 z-10">
        <div className="game-container h-16 flex items-center gap-4">
          <button
            onClick={() => router.push('/home')}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-[#888] hover:text-white transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="font-game text-white text-xl tracking-wider">{meta.label.toUpperCase()}</span>
        </div>
      </header>

      <div className="flex-1 game-container py-12 flex flex-col items-center gap-10">

        {/* Puzzle icon + title */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' as const, stiffness: 280, damping: 22 }}
          className="flex flex-col items-center gap-6"
        >
          <div
            className="w-28 h-28 rounded-3xl flex items-center justify-center"
            style={{ background: `${color}15`, border: `1px solid ${color}30`, boxShadow: `0 0 60px ${color}15` }}
          >
            <PuzzleIcon type={type} size={52} />
          </div>
          <div className="text-center">
            <h1 className="font-game text-white mb-3" style={{ fontSize: '48px', letterSpacing: '0.05em' }}>
              {meta.label.toUpperCase()}
            </h1>
            <p className="text-[#999] text-sm leading-relaxed max-w-xs">{meta.description}</p>
          </div>
        </motion.div>

        {/* Mode section */}
        <div className="w-full space-y-5 max-w-md">
          <p className="font-game text-[#777] text-center mb-2" style={{ fontSize: '13px', letterSpacing: '0.25em' }}>
            CHOOSE MODE
          </p>

          {/* Time Attack */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring' as const, stiffness: 280, damping: 24 }}
            className="rounded-2xl bg-[#141414] border border-[#2A2A2A] p-7"
          >
            {/* Header row */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: '#FFD60A15', border: '1px solid #FFD60A20' }}
              >
                ⏱
              </div>
              <div className="flex-1">
                <p className="font-game text-white text-xl" style={{ letterSpacing: '0.05em' }}>TIME ATTACK</p>
                <p className="text-xs text-[#666] mt-0.5">Solve as many puzzles as possible</p>
              </div>
            </div>

            {/* Duration picker */}
            <p className="text-xs font-bold text-[#888] uppercase tracking-[0.2em] mb-3">Select duration</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {DURATIONS.map(d => (
                <motion.button
                  key={d.seconds}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDuration(d.seconds)}
                  className="py-3 rounded-xl text-center transition-all"
                  style={
                    selectedDuration === d.seconds
                      ? { background: `${color}20`, border: `1.5px solid ${color}`, color }
                      : { background: '#222', border: '1.5px solid #333', color: '#888' }
                  }
                >
                  <p className="font-game text-lg leading-none">{d.label}</p>
                  <p className="text-[10px] mt-1 opacity-70">{d.sub}</p>
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={selectedDuration ? { scale: 1.02 } : {}}
              whileTap={selectedDuration ? { scale: 0.97 } : {}}
              onClick={() => selectedDuration && router.push(`/modes/${type}/time-attack?t=${selectedDuration}`)}
              disabled={!selectedDuration}
              className="w-full py-4 rounded-xl font-black text-base tracking-wide transition-all"
              style={
                selectedDuration
                  ? { background: '#FFD60A', color: '#0D0D0D', boxShadow: '0 0 24px rgba(255,214,10,0.2)' }
                  : { background: '#1A1A1A', color: '#777', border: '1px dashed #333' }
              }
            >
              {selectedDuration ? `START ${DURATIONS.find(d => d.seconds === selectedDuration)?.label}` : 'SELECT A DURATION'}
            </motion.button>
          </motion.div>

          {/* Online — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full rounded-2xl bg-[#111] border border-[#1E1E1E] p-6 opacity-25 pointer-events-none"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1E1E1E] flex items-center justify-center text-xl">🌐</div>
              <div>
                <p className="font-game text-white text-xl" style={{ letterSpacing: '0.05em' }}>ONLINE DUEL</p>
                <p className="text-xs text-[#444] mt-0.5">Live vs global leaderboard</p>
              </div>
              <span className="ml-auto font-game text-xs px-3 py-1.5 rounded-xl bg-[#252525] text-[#444]">SOON</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
