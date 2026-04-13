'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase, PUZZLE_META } from '@/lib/data/cases';
import { Button } from '@/components/ui/Button';
import { DifficultyBadge } from '@/components/ui/Badge';
import type { PuzzleType } from '@/types';

const PUZZLE_COLORS: Record<PuzzleType, string> = {
  linkGrid:  '#818CF8',
  timeTrace: '#FB923C',
  trueLie:   '#F472B6',
  codeBreak: '#4ADE80',
};

const PUZZLE_ICONS: Record<PuzzleType, string> = {
  linkGrid:  '⊞',
  timeTrace: '◷',
  trueLie:   '⊡',
  codeBreak: '◈',
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
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

  const isCaseDone    = daily?.completedAt != null;
  const isCaseStarted = daily?.startedAt != null;
  const solvedCount   = daily?.puzzles.filter(p => p.status === 'solved').length ?? 0;
  const puzzleTypes   = Object.keys(PUZZLE_META) as PuzzleType[];

  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col">
      {/* ── Top bar ────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 pt-safe pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="18" r="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="19" cy="17" r="5" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="23" y1="21" x2="27" y2="25" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="text-[#F0F0F0] font-black text-lg tracking-tight">DEDUCE</span>
        </div>

        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FB923C]/10 border border-[#FB923C]/20">
              <span className="text-base">🔥</span>
              <span className="text-sm font-bold text-[#FB923C]">{streak}</span>
            </div>
          )}
          <button
            onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
            className="w-8 h-8 rounded-xl bg-[#161616] border border-[#242424] flex items-center justify-center text-[#888] hover:text-[#F0F0F0] transition-colors text-xs font-bold"
          >
            {(user.displayName?.[0] ?? user.email?.[0] ?? 'G').toUpperCase()}
          </button>
        </div>
      </header>

      <motion.div
        variants={container} initial="hidden" animate="show"
        className="flex-1 overflow-y-auto px-5 pb-safe pb-8 space-y-4 pt-2"
      >
        {/* ── Daily Case Hero ─────────────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <div className="relative rounded-3xl overflow-hidden border border-[#242424]"
            style={{ background: 'linear-gradient(135deg, #161616 0%, #111111 100%)' }}>

            {/* Background accent glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)' }} />

            {/* Sketch magnifying glass watermark */}
            <div className="absolute right-5 top-5 opacity-[0.06] pointer-events-none">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                <circle cx="42" cy="42" r="28" stroke="#4ADE80" strokeWidth="3"/>
                <line x1="63" y1="63" x2="90" y2="90" stroke="#4ADE80" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="relative z-10 p-6">
              {/* Label row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em]">Daily Case</span>
                  <DifficultyBadge difficulty={todayCase.difficulty} />
                </div>
                {isCaseDone && (
                  <span className="text-xs font-bold text-[#4ADE80] bg-[#4ADE80]/10 border border-[#4ADE80]/20 px-2.5 py-1 rounded-lg">
                    ✓ Solved
                  </span>
                )}
              </div>

              {/* Case title */}
              <h2 className="text-2xl font-black text-[#F0F0F0] leading-tight mb-1">
                {todayCase.title}
              </h2>
              <p className="text-sm text-[#555] mb-5">
                Case #{todayCase.id} · 4 logic puzzles
              </p>

              {/* Progress bar */}
              {isCaseStarted && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#888]">Progress</span>
                    <span className="text-xs font-bold text-[#4ADE80]">{solvedCount}/4</span>
                  </div>
                  <div className="flex gap-1.5">
                    {daily?.puzzles.map((p, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 h-1.5 rounded-full overflow-hidden bg-[#242424]"
                        initial={false}
                      >
                        <motion.div
                          className="h-full rounded-full bg-[#4ADE80]"
                          initial={{ width: 0 }}
                          animate={{ width: p.status === 'solved' ? '100%' : p.status === 'active' ? '40%' : '0%' }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA */}
              {isCaseDone ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#555] mb-0.5">Your score</p>
                    <p className="text-2xl font-black text-[#4ADE80]">
                      {daily?.score?.toLocaleString() ?? '—'}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => router.push('/result')}>
                    View Result
                  </Button>
                </div>
              ) : (
                <Button
                  fullWidth size="lg" glow
                  onClick={() => router.push('/daily')}
                >
                  {isCaseStarted ? 'Continue Case →' : 'Start Case →'}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Divider ─────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#1E1E1E]" />
          <span className="text-[10px] text-[#444] uppercase tracking-[0.2em] font-semibold">Puzzle Modes</span>
          <div className="flex-1 h-px bg-[#1E1E1E]" />
        </motion.div>

        {/* ── Mode Grid ───────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3">
          {puzzleTypes.map((type, i) => {
            const meta  = PUZZLE_META[type];
            const color = PUZZLE_COLORS[type];
            const icon  = PUZZLE_ICONS[type];

            return (
              <motion.button
                key={type}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/modes/${type}`)}
                className="group text-left rounded-2xl border border-[#242424] bg-[#161616] p-4 transition-colors hover:border-[#333] hover:bg-[#1A1A1A]"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 text-xl"
                  style={{ backgroundColor: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <span style={{ color }}>{icon}</span>
                </div>
                <p className="text-sm font-bold text-[#F0F0F0] mb-0.5">{meta.label}</p>
                <p className="text-xs text-[#555]">{meta.description}</p>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-semibold" style={{ color }}>
                  <span>⏱ Time Attack</span>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── Stats bar ───────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
          {[
            { label: 'Streak',     value: streak > 0 ? `${streak}🔥` : '0', color: '#FB923C' },
            { label: 'Best Score', value: bestScore > 0 ? bestScore.toLocaleString() : '—', color: '#4ADE80' },
            { label: 'Solved',     value: String(totalSolved), color: '#818CF8' },
          ].map(stat => (
            <div key={stat.label}
              className="rounded-2xl border border-[#1E1E1E] bg-[#111] p-3.5 text-center">
              <p className="text-base font-black" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-[10px] text-[#555] mt-0.5 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
