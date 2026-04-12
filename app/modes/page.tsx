'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';
import { GridIcon, TimelineIcon, TrueLieIcon, CodeIcon, DeduceLogoMark } from '@/components/ui/SketchIllustration';
import type { PuzzleType } from '@/types';

const ICONS: Record<PuzzleType, React.FC<{ size?: number }>> = {
  linkGrid: (p) => <GridIcon {...p} />,
  timeTrace: (p) => <TimelineIcon {...p} />,
  trueLie: (p) => <TrueLieIcon {...p} />,
  codeBreak: (p) => <CodeIcon {...p} />,
};

const COLORS: Record<PuzzleType, string> = {
  linkGrid: '#818CF8',
  timeTrace: '#FB923C',
  trueLie: '#F472B6',
  codeBreak: '#4ADE80',
};

export default function ModesPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user) return null;

  const puzzleTypes = Object.keys(PUZZLE_META) as PuzzleType[];

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-5 pb-4 border-b border-[#2A2A2A]">
        <button
          onClick={() => router.push('/home')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#EAEAEA] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div>
          <h1 className="text-base font-bold text-[#EAEAEA]">Puzzle Modes</h1>
          <p className="text-xs text-[#9A9A9A]">Choose your challenge</p>
        </div>
      </header>

      <div className="flex-1 px-4 py-6 space-y-4">
        <p className="text-sm text-[#9A9A9A]">
          Select a puzzle type to practice solo or race against the clock.
        </p>

        <div className="space-y-3">
          {puzzleTypes.map((type, i) => {
            const meta = PUZZLE_META[type];
            const Icon = ICONS[type];
            const color = COLORS[type];

            return (
              <motion.button
                key={type}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => router.push(`/modes/${type}`)}
                className="w-full flex items-center gap-4 rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4 hover:border-[#4A4A4A] active:scale-[0.98] transition-all text-left"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon size={28} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#EAEAEA]">{meta.label}</p>
                  <p className="text-xs text-[#9A9A9A] mt-0.5">{meta.description}</p>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-[#9A9A9A]">
                  <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
