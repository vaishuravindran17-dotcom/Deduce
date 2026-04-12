'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { PUZZLE_META } from '@/lib/data/cases';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GridIcon, TimelineIcon, TrueLieIcon, CodeIcon } from '@/components/ui/SketchIllustration';
import type { PuzzleType } from '@/types';

const ICONS: Record<string, React.FC<{ size?: number }>> = {
  linkGrid: (p) => <GridIcon {...p} />,
  timeTrace: (p) => <TimelineIcon {...p} />,
  trueLie: (p) => <TrueLieIcon {...p} />,
  codeBreak: (p) => <CodeIcon {...p} />,
};

const COLORS: Record<string, string> = {
  linkGrid: '#818CF8',
  timeTrace: '#FB923C',
  trueLie: '#F472B6',
  codeBreak: '#4ADE80',
};

export default function PuzzleTypePage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const type = params?.type as string;

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user) return null;
  if (!type || !PUZZLE_META[type]) {
    router.replace('/modes');
    return null;
  }

  const meta = PUZZLE_META[type];
  const Icon = ICONS[type];
  const color = COLORS[type] ?? '#4ADE80';

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 pt-safe pt-5 pb-4 border-b border-[#2A2A2A]">
        <button
          onClick={() => router.push('/modes')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#2A2A2A] text-[#9A9A9A] hover:text-[#EAEAEA] transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-base font-bold text-[#EAEAEA]">{meta.label}</h1>
      </header>

      <div className="flex-1 px-4 py-8 flex flex-col items-center gap-8">
        {/* Puzzle icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{ backgroundColor: `${color}18`, border: `1.5px solid ${color}30` }}
        >
          <Icon size={52} />
        </motion.div>

        {/* Info */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#EAEAEA] mb-2">{meta.label}</h2>
          <p className="text-[#9A9A9A] text-sm leading-relaxed max-w-xs">{meta.description}</p>
        </div>

        {/* Mode selection */}
        <div className="w-full space-y-3">
          <p className="text-xs text-[#9A9A9A] uppercase tracking-widest font-medium text-center">
            Choose Mode
          </p>

          {/* Time Attack */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => router.push(`/modes/${type}/time-attack`)}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 text-left hover:border-[#4A4A4A] active:scale-[0.98] transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⏱</span>
                <span className="text-base font-semibold text-[#EAEAEA]">Time Attack</span>
              </div>
              <Badge variant="warn">60s</Badge>
            </div>
            <p className="text-sm text-[#9A9A9A]">
              Solve as many puzzles as you can in 60 seconds. Score based on count and speed.
            </p>
          </motion.button>

          {/* Online — coming soon */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="w-full rounded-2xl border border-[#2A2A2A] bg-[#161616] p-5 opacity-50 cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                <span className="text-base font-semibold text-[#EAEAEA]">Online</span>
              </div>
              <Badge variant="muted">Soon</Badge>
            </div>
            <p className="text-sm text-[#9A9A9A]">
              Compete on a global leaderboard. Coming soon.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
