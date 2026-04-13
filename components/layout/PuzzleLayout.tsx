'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleStatus, PuzzleType } from '@/types';

const STEP_COLORS: Record<PuzzleType, string> = {
  linkGrid:  '#A855F7',
  timeTrace: '#F97316',
  trueLie:   '#EC4899',
  codeBreak: '#5CE1E6',
};
const PUZZLE_TYPES: PuzzleType[] = ['linkGrid', 'timeTrace', 'trueLie', 'codeBreak'];

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

interface PuzzleLayoutProps {
  title: string;
  puzzleType: PuzzleType;
  puzzleIndex?: number;
  totalPuzzles?: number;
  puzzleStatuses?: PuzzleStatus[];
  elapsedSeconds?: number;
  mistakes?: number;
  children: ReactNode;
  onBack?: () => void;
  timeAttack?: boolean;
  timeLeft?: number;
  solvedCount?: number;
}

export function PuzzleLayout({
  title, puzzleType, puzzleIndex, totalPuzzles, puzzleStatuses,
  elapsedSeconds, mistakes = 0, children, onBack,
  timeAttack, timeLeft, solvedCount,
}: PuzzleLayoutProps) {
  const router  = useRouter();
  const meta    = PUZZLE_META[puzzleType];
  const color   = STEP_COLORS[puzzleType];
  const back    = onBack ?? (() => router.back());
  const isLow   = timeAttack && (timeLeft ?? 60) <= 10;
  const isWarn  = timeAttack && (timeLeft ?? 60) <= 20 && (timeLeft ?? 60) > 10;

  return (
    <div className="min-h-dvh flex flex-col bg-[#0D0D0D] grid-bg">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur sticky top-0 z-10">
        <div className="game-container h-16 flex items-center gap-4">

          {/* Back */}
          <button
            onClick={back}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#1E1E1E] text-[#666] hover:text-white hover:bg-[#252525] transition-all shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Puzzle label */}
          <div className="flex-1 min-w-0 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="font-game text-lg text-white truncate" style={{ letterSpacing: '0.05em' }}>
              {meta.label.toUpperCase()}
            </span>
            {puzzleIndex !== undefined && totalPuzzles !== undefined && (
              <span className="text-xs text-[#777] font-mono shrink-0">
                {puzzleIndex + 1}/{totalPuzzles}
              </span>
            )}
          </div>

          {/* Timer + score */}
          <div className="flex items-center gap-2 shrink-0">
            {mistakes > 0 && (
              <div className="px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-black text-[#EF4444]">
                ×{mistakes}
              </div>
            )}

            {timeAttack && timeLeft !== undefined ? (
              <motion.div
                animate={isLow ? { scale: [1, 1.08, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.65 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl"
                style={{
                  background: isLow ? '#EF444415' : isWarn ? '#F9731615' : '#1E1E1E',
                  border: `1px solid ${isLow ? '#EF444430' : isWarn ? '#F9731630' : 'transparent'}`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: isLow ? '#EF4444' : isWarn ? '#F97316' : '#5CE1E6' }}
                />
                <span
                  className="font-mono font-black text-base"
                  style={{ color: isLow ? '#EF4444' : isWarn ? '#F97316' : '#fff' }}
                >
                  {fmt(timeLeft)}
                </span>
              </motion.div>
            ) : elapsedSeconds !== undefined ? (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1E1E]">
                <span className="w-2 h-2 rounded-full bg-[#5CE1E6]" />
                <span className="font-mono font-black text-base text-white">{fmt(elapsedSeconds)}</span>
              </div>
            ) : null}

            {timeAttack && solvedCount !== undefined && (
              <div className="px-3 py-2 rounded-xl text-sm font-black"
                style={{ background: '#C8FF5720', color: '#C8FF57' }}>
                {solvedCount} ✓
              </div>
            )}
          </div>
        </div>

        {/* Step progress (daily) */}
        {puzzleStatuses && !timeAttack && (
          <div className="game-container pb-2 flex gap-1.5">
            {PUZZLE_TYPES.map((t, i) => {
              const status = puzzleStatuses[i];
              return (
                <motion.div key={t} className="flex-1 h-1 rounded-full overflow-hidden bg-[#1E1E1E]">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: STEP_COLORS[t] }}
                    initial={{ width: 0 }}
                    animate={{
                      width: status === 'solved' ? '100%' : status === 'active' ? '30%' : '0%',
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto game-container relative">
        {children}
      </main>
    </div>
  );
}
