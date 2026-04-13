'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleStatus, PuzzleType } from '@/types';

const STEP_COLORS = ['#A78BFA', '#FB923C', '#F472B6', '#67E8F9'];

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
  const color   = STEP_COLORS[puzzleIndex ?? 0] ?? '#67E8F9';
  const back    = onBack ?? (() => router.back());
  const isLow   = timeAttack && (timeLeft ?? 60) <= 10;
  const isWarn  = timeAttack && (timeLeft ?? 60) <= 20 && (timeLeft ?? 60) > 10;

  return (
    <div className="min-h-dvh flex flex-col bg-[#141414]">

      {/* ── Top bar (Matiks game-screen style) ─────────────────────── */}
      <header className="bg-[#141414] border-b border-[#1E1E1E] pt-safe pt-3 pb-3">
        <div className="flex items-center px-4 gap-3">

          {/* Left: back + puzzle info */}
          <button onClick={back}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#1E1E1E] text-[#888] hover:text-white transition-colors shrink-0">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] truncate">
                {meta.label}
                {puzzleIndex !== undefined && totalPuzzles !== undefined && ` · ${puzzleIndex + 1} / ${totalPuzzles}`}
              </span>
            </div>
            <h1 className="text-sm font-bold text-white truncate">{title}</h1>
          </div>

          {/* Right: timer + mistakes */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Mistakes badge */}
            {mistakes > 0 && (
              <div className="px-2.5 py-1 rounded-xl bg-[#1E1E1E] text-xs font-black text-[#F87171]">
                ×{mistakes}
              </div>
            )}

            {/* Timer — Matiks style: cyan dot + MM:SS */}
            {timeAttack && timeLeft !== undefined ? (
              <motion.div
                animate={isLow ? { scale: [1, 1.06, 1] } : {}}
                transition={{ repeat: Infinity, duration: 0.7 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E1E1E]"
              >
                <div className={`w-1.5 h-1.5 rounded-full ${
                  isLow ? 'bg-[#F87171]' : isWarn ? 'bg-[#FB923C]' : 'bg-[#67E8F9]'
                }`} />
                <span className={`font-mono text-sm font-bold ${
                  isLow ? 'text-[#F87171]' : isWarn ? 'text-[#FB923C]' : 'text-white'
                }`}>
                  {fmt(timeLeft)}
                </span>
              </motion.div>
            ) : elapsedSeconds !== undefined ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E1E1E]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#67E8F9]" />
                <span className="font-mono text-sm font-bold text-white">{fmt(elapsedSeconds)}</span>
              </div>
            ) : null}

            {/* Solved count (time attack) */}
            {timeAttack && solvedCount !== undefined && (
              <div className="px-2.5 py-1.5 rounded-xl bg-[#C8FF57]/15 text-xs font-black text-[#C8FF57]">
                {solvedCount}✓
              </div>
            )}
          </div>
        </div>

        {/* Step progress — 4 colored bars (daily only) */}
        {puzzleStatuses && !timeAttack && (
          <div className="flex gap-1.5 px-4 mt-3">
            {puzzleStatuses.map((status, i) => (
              <motion.div
                key={i}
                className="flex-1 h-1 rounded-full overflow-hidden bg-[#252525]"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: STEP_COLORS[i] }}
                  initial={{ width: 0 }}
                  animate={{
                    width: status === 'solved' ? '100%' : status === 'active' ? '35%' : '0%',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </motion.div>
            ))}
          </div>
        )}
      </header>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto">{children}</main>
    </div>
  );
}
