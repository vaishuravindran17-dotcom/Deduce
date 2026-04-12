'use client';
import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Timer } from '@/components/ui/Timer';
import { StepDots } from '@/components/ui/ProgressBar';
import { PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleStatus, PuzzleType } from '@/types';

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
}

export function PuzzleLayout({
  title,
  puzzleType,
  puzzleIndex,
  totalPuzzles,
  puzzleStatuses,
  elapsedSeconds,
  mistakes = 0,
  children,
  onBack,
  subtitle,
}: PuzzleLayoutProps) {
  const router = useRouter();
  const meta = PUZZLE_META[puzzleType];

  const handleBack = onBack ?? (() => router.back());

  return (
    <div className="min-h-dvh flex flex-col bg-[#0D0D0D]">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-4 pb-3 border-b border-[#2A2A2A]">
        <button
          onClick={handleBack}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#EAEAEA] transition-colors shrink-0"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-[#9A9A9A] uppercase tracking-widest">
              {meta.label}
            </span>
            {puzzleIndex !== undefined && totalPuzzles !== undefined && (
              <span className="text-[10px] text-[#2A2A2A]">
                {puzzleIndex + 1}/{totalPuzzles}
              </span>
            )}
          </div>
          <h1 className="text-sm font-semibold text-[#EAEAEA] truncate">{title}</h1>
          {subtitle && (
            <p className="text-xs text-[#9A9A9A] mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {mistakes > 0 && (
            <span className="text-xs text-[#F87171] font-medium">
              ×{mistakes}
            </span>
          )}
          {elapsedSeconds !== undefined && (
            <Timer seconds={elapsedSeconds} />
          )}
        </div>
      </header>

      {/* Step progress */}
      {puzzleStatuses && (
        <div className="px-4 py-2 flex items-center gap-3">
          <StepDots
            steps={puzzleStatuses}
            labels={['Link', 'Time', 'Truth', 'Code']}
          />
        </div>
      )}

      {/* Puzzle content */}
      <main className="flex-1 flex flex-col overflow-auto">
        {children}
      </main>
    </div>
  );
}
