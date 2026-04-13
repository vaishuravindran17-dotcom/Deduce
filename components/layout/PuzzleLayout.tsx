'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleStatus, PuzzleType } from '@/types';

const STEP_COLORS = ['#818CF8', '#FB923C', '#F472B6', '#4ADE80'];
const STEP_LABELS = ['Link', 'Time', 'Truth', 'Code'];

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
  subtitle?: string;
  timeAttack?: boolean;
  timeLeft?: number;
  solvedCount?: number;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2,'0')}`;
}

export function PuzzleLayout({
  title, puzzleType, puzzleIndex, totalPuzzles, puzzleStatuses,
  elapsedSeconds, mistakes = 0, children, onBack, subtitle,
  timeAttack, timeLeft, solvedCount,
}: PuzzleLayoutProps) {
  const router = useRouter();
  const meta   = PUZZLE_META[puzzleType];
  const color  = STEP_COLORS[puzzleIndex ?? 0] ?? '#4ADE80';

  const handleBack = onBack ?? (() => router.back());
  const isLow = timeAttack && (timeLeft ?? 60) <= 10;

  return (
    <div className="min-h-dvh flex flex-col bg-[#0A0A0A]">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-[#1E1E1E]">
        <button
          onClick={handleBack}
          className="w-9 h-9 flex items-center justify-center rounded-xl border border-[#242424] text-[#888] hover:text-[#F0F0F0] hover:border-[#333] transition-all shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em]">
              {meta.label}
              {puzzleIndex !== undefined && totalPuzzles !== undefined && ` · ${puzzleIndex + 1}/${totalPuzzles}`}
            </span>
          </div>
          <h1 className="text-sm font-bold text-[#F0F0F0] truncate mt-0.5">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          {mistakes > 0 && (
            <span className="text-xs font-bold text-[#F87171] bg-[#F87171]/10 px-2 py-1 rounded-lg">
              ×{mistakes}
            </span>
          )}
          {timeAttack && timeLeft !== undefined && (
            <motion.div
              animate={isLow ? { scale: [1, 1.08, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className={`font-mono text-sm font-bold px-3 py-1.5 rounded-xl border ${
                isLow
                  ? 'bg-[#F87171]/10 border-[#F87171]/40 text-[#F87171]'
                  : 'bg-[#161616] border-[#242424] text-[#F0F0F0]'
              }`}
            >
              {formatTime(timeLeft)}
            </motion.div>
          )}
          {!timeAttack && elapsedSeconds !== undefined && (
            <div className="font-mono text-xs text-[#555] bg-[#161616] border border-[#242424] px-2.5 py-1.5 rounded-xl">
              {formatTime(elapsedSeconds)}
            </div>
          )}
          {timeAttack && solvedCount !== undefined && (
            <div className="text-sm font-bold text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/20 px-2.5 py-1.5 rounded-xl">
              {solvedCount}✓
            </div>
          )}
        </div>
      </header>

      {/* ── Step progress (daily only) ──────────────────────────────── */}
      {puzzleStatuses && !timeAttack && (
        <div className="px-4 py-2.5 flex items-center gap-1.5 border-b border-[#1E1E1E]">
          {puzzleStatuses.map((status, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1 items-center">
              <motion.div
                className="w-full h-1 rounded-full overflow-hidden bg-[#1E1E1E]"
                initial={false}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: STEP_COLORS[i] }}
                  initial={{ width: 0 }}
                  animate={{
                    width: status === 'solved' ? '100%' : status === 'active' ? '30%' : '0%',
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </motion.div>
              <span className={`text-[9px] font-semibold uppercase tracking-wider ${
                status === 'active' ? 'text-[#F0F0F0]' : status === 'solved' ? 'text-[#4ADE80]' : 'text-[#333]'
              }`}>
                {STEP_LABELS[i]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto">{children}</main>
    </div>
  );
}
