'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase } from '@/lib/data/cases';
import { PUZZLE_META } from '@/lib/data/cases';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, DifficultyBadge } from '@/components/ui/Badge';
import { DeduceLogoMark, FlameIcon, GridIcon, TimelineIcon, TrueLieIcon, CodeIcon } from '@/components/ui/SketchIllustration';
import type { PuzzleType } from '@/types';

const PUZZLE_ICONS: Record<PuzzleType, React.FC<{ size?: number; className?: string }>> = {
  linkGrid: (p) => <GridIcon {...p} />,
  timeTrace: (p) => <TimelineIcon {...p} />,
  trueLie: (p) => <TrueLieIcon {...p} />,
  codeBreak: (p) => <CodeIcon {...p} />,
};

const PUZZLE_COLORS: Record<PuzzleType, string> = {
  linkGrid: '#818CF8',
  timeTrace: '#FB923C',
  trueLie: '#F472B6',
  codeBreak: '#4ADE80',
};

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { streak, daily, initDaily, bestScore, totalSolved } = useGameStore();

  const todayCase = getTodaysCase();

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    initDaily(todayCase.id);
  }, [user, router, initDaily, todayCase.id]);

  if (!user) return null;

  const isCaseDone = daily?.completedAt != null;
  const isCaseStarted = daily?.startedAt != null;
  const solvedCount = daily?.puzzles.filter((p) => p.status === 'solved').length ?? 0;

  const puzzleTypes = Object.keys(PUZZLE_META) as PuzzleType[];

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 pt-safe pt-5 pb-2">
        <div className="flex items-center gap-2">
          <DeduceLogoMark size={28} />
          <span className="text-[#EAEAEA] font-bold text-lg tracking-tight">Deduce</span>
        </div>
        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FB923C]/10 border border-[#FB923C]/20">
              <FlameIcon size={14} color="#FB923C" />
              <span className="text-xs font-semibold text-[#FB923C]">{streak}</span>
            </div>
          )}
          <button
            onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
            className="text-[#9A9A9A] hover:text-[#EAEAEA] text-xs transition-colors"
          >
            {user.isGuest ? 'Guest' : user.displayName?.split(' ')[0] ?? 'You'}
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-5 pt-4">
        {/* ─── Daily Case Card ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card glow={!isCaseDone} className="relative overflow-hidden">
            {/* Background sketch pattern */}
            <div className="absolute right-4 top-4 opacity-5 pointer-events-none">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <circle cx="40" cy="40" r="30" stroke="#4ADE80" strokeWidth="1.5" strokeDasharray="4 4" />
                <circle cx="40" cy="40" r="18" stroke="#4ADE80" strokeWidth="1" />
                <line x1="40" y1="10" x2="40" y2="70" stroke="#4ADE80" strokeWidth="0.8" />
                <line x1="10" y1="40" x2="70" y2="40" stroke="#4ADE80" strokeWidth="0.8" />
              </svg>
            </div>

            {/* Label */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold text-[#9A9A9A] uppercase tracking-widest">
                Daily Case
              </span>
              <DifficultyBadge difficulty={todayCase.difficulty} />
              {isCaseDone && <Badge variant="accent">Solved</Badge>}
            </div>

            <h2 className="text-xl font-bold text-[#EAEAEA] mb-1">{todayCase.title}</h2>
            <p className="text-sm text-[#9A9A9A] mb-4">
              Case #{todayCase.id} — 4 puzzles to solve
            </p>

            {/* Progress dots */}
            {isCaseStarted && (
              <div className="flex items-center gap-2 mb-4">
                {daily?.puzzles.map((p, i) => (
                  <div
                    key={i}
                    className={[
                      'flex-1 h-1 rounded-full transition-all',
                      p.status === 'solved' ? 'bg-[#4ADE80]' :
                      p.status === 'active' ? 'bg-[#4ADE80]/30' : 'bg-[#2A2A2A]',
                    ].join(' ')}
                  />
                ))}
              </div>
            )}

            {isCaseStarted && !isCaseDone && (
              <p className="text-xs text-[#9A9A9A] mb-3">
                {solvedCount} of 4 puzzles solved
              </p>
            )}

            {isCaseDone ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#9A9A9A]">Score</p>
                  <p className="text-lg font-bold text-[#4ADE80]">
                    {daily?.score?.toLocaleString() ?? '—'}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => router.push('/result')}
                >
                  View Result
                </Button>
              </div>
            ) : (
              <Button
                fullWidth
                size="lg"
                onClick={() => router.push('/daily')}
              >
                {isCaseStarted ? 'Continue Case' : 'Start Case'}
              </Button>
            )}
          </Card>
        </motion.div>

        {/* ─── Section divider ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#2A2A2A]" />
          <span className="text-[11px] text-[#9A9A9A] uppercase tracking-widest font-medium">
            Puzzle Modes
          </span>
          <div className="flex-1 h-px bg-[#2A2A2A]" />
        </div>

        {/* ─── Puzzle Mode Grid ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {puzzleTypes.map((type, i) => {
            const meta = PUZZLE_META[type];
            const Icon = PUZZLE_ICONS[type];
            const color = PUZZLE_COLORS[type];
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
              >
                <button
                  onClick={() => router.push(`/modes/${type}`)}
                  className="w-full text-left rounded-2xl border border-[#2A2A2A] bg-[#161616] p-4 hover:border-[#4A4A4A] transition-all active:scale-[0.97] group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${color}18` }}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="text-sm font-semibold text-[#EAEAEA] mb-0.5">{meta.label}</p>
                  <p className="text-xs text-[#9A9A9A]">{meta.description}</p>
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Stats strip ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Streak', value: streak > 0 ? `${streak}🔥` : '0', },
            { label: 'Best Score', value: bestScore > 0 ? bestScore.toLocaleString() : '—' },
            { label: 'Solved', value: String(totalSolved) },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-3 text-center">
              <p className="text-sm font-bold text-[#EAEAEA]">{stat.value}</p>
              <p className="text-[10px] text-[#9A9A9A] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
