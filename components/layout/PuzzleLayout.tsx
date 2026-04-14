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
    <div className="flex flex-col" style={{ background: '#0C0C0F', minHeight: '100dvh', maxWidth: 480, margin: '0 auto' }}>

      {/* ── Top Bar ────────────────────────────────────────────────── */}
      <header className="shrink-0 sticky top-0 z-10" style={{ background: '#0C0C0F' }}>
        {/* top-bar row: padding 16px 20px */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Left: back + badge + index */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={back}
              className="flex items-center justify-center shrink-0 transition-colors"
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
                color: '#A0A0B0',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4l-6 5 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="flex items-center" style={{ gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span
                className="font-game"
                style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color }}
              >
                {meta.label.toUpperCase()}
              </span>
            </div>

            {puzzleIndex !== undefined && (
              <span style={{ fontSize: 12, color: '#5A5A6E' }}>
                {totalPuzzles ? `${puzzleIndex + 1} / ${totalPuzzles}` : `Puzzle ${puzzleIndex + 1}`}
              </span>
            )}
          </div>

          {/* Right: mistakes + timer + solved */}
          <div className="flex items-center" style={{ gap: 10 }}>
            {mistakes > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>×{mistakes}</span>
            )}
            <div className="flex items-center" style={{ gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: timerColor }} />
              <span
                className="font-game tabular-nums"
                style={{ fontSize: 17, fontWeight: 700, color: timerColor }}
              >
                {displayTime}
              </span>
            </div>
            {timeAttack && solvedCount !== undefined && (
              <div className="flex items-center" style={{ gap: 4, color: '#B5F23D', fontSize: 13, fontWeight: 600 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {solvedCount}
              </div>
            )}
          </div>
        </div>

        {/* Progress segments: padding 10px 20px */}
        <div className="flex" style={{ gap: 4, padding: '10px 20px' }}>
          {puzzleStatuses && !timeAttack ? (
            PUZZLE_TYPES.map((t, i) => (
              <div
                key={t}
                className="flex-1 transition-all duration-500"
                style={{
                  height: 3, borderRadius: 2,
                  background: puzzleStatuses[i] === 'solved' || puzzleStatuses[i] === 'active'
                    ? STEP_COLORS[t]
                    : 'rgba(255,255,255,0.07)',
                }}
              />
            ))
          ) : (
            <div className="flex-1" style={{ height: 3, borderRadius: 2, background: color }} />
          )}
        </div>
      </header>

      {/* ── scroll-body ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto relative" style={{ padding: '0 20px' }}>
        {children}
      </main>
    </div>
  );
}
