'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleStatus, PuzzleType } from '@/types';

const STEP_COLORS: Record<PuzzleType, string> = {
  linkGrid:  '#A78BFA',
  timeTrace: '#FB923C',
  trueLie:   '#F472B6',
  codeBreak: '#2DD4BF',
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
  puzzleType, puzzleIndex, totalPuzzles, puzzleStatuses,
  elapsedSeconds, mistakes = 0, children, onBack,
  timeAttack, timeLeft, solvedCount,
}: PuzzleLayoutProps) {
  const router = useRouter();
  const meta   = PUZZLE_META[puzzleType];
  const color  = STEP_COLORS[puzzleType];
  const back   = onBack ?? (() => router.back());
  const isLow  = timeAttack && (timeLeft ?? 60) <= 10;
  const displayTime = timeAttack ? fmt(timeLeft ?? 0) : fmt(elapsedSeconds ?? 0);
  const timerColor  = isLow ? '#EF4444' : '#B5F23D';

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10"
        style={{ background: '#0C0C0F', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="game-container h-14 flex items-center gap-3"
        >
          {/* Back */}
          <button
            onClick={back}
            className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0 transition-colors"
            style={{
              background: '#1C1C22',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#A0A0B0',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Center */}
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="font-game text-sm tracking-widest" style={{ color }}>
              {meta.label.toUpperCase()}
            </span>
            {puzzleIndex !== undefined && (
              <span className="text-xs ml-0.5" style={{ color: '#5A5A6E' }}>
                {totalPuzzles
                  ? `${puzzleIndex + 1}/${totalPuzzles}`
                  : `Puzzle ${puzzleIndex + 1}`}
              </span>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 shrink-0">
            {mistakes > 0 && (
              <span className="text-xs font-bold" style={{ color: '#EF4444' }}>×{mistakes}</span>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: timerColor }} />
              <span className="font-game text-sm tabular-nums" style={{ color: timerColor }}>
                {displayTime}
              </span>
            </div>
            {timeAttack && solvedCount !== undefined && (
              <div className="flex items-center gap-1" style={{ color: '#B5F23D' }}>
                <span className="text-sm font-bold">{solvedCount}</span>
                <span className="text-xs">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="game-container">
          {puzzleStatuses && !timeAttack ? (
            <div className="flex gap-1">
              {PUZZLE_TYPES.map((t, i) => (
                <div
                  key={t}
                  className="flex-1 rounded-full transition-all duration-500"
                  style={{
                    height: '3px',
                    background: puzzleStatuses[i] === 'solved' || puzzleStatuses[i] === 'active'
                      ? STEP_COLORS[t]
                      : 'rgba(255,255,255,0.07)',
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-full" style={{ height: '3px', background: color }} />
          )}
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto game-container relative">
        {children}
      </main>
    </div>
  );
}
