'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase, PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleType } from '@/types';

const PUZZLE_COLORS: Record<PuzzleType, string> = {
  linkGrid:  '#A855F7',
  timeTrace: '#F97316',
  trueLie:   '#EC4899',
  codeBreak: '#5CE1E6',
};
const PUZZLE_BG: Record<PuzzleType, string> = {
  linkGrid:  'rgba(168,85,247,0.12)',
  timeTrace: 'rgba(249,115,22,0.12)',
  trueLie:   'rgba(236,72,153,0.12)',
  codeBreak: 'rgba(92,225,230,0.12)',
};
const PUZZLE_ICONS: Record<PuzzleType, string> = {
  linkGrid:  '⊞',
  timeTrace: '⊙',
  trueLie:   '⊡',
  codeBreak: '◈',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 28 } },
};

export default function HomePage() {
  const router   = useRouter();
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
  const avatar        = (user.displayName?.[0] ?? user.email?.[0] ?? 'G').toUpperCase();

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">

      {/* ── TOP NAV ─────────────────────────────────────────────────── */}
      <nav className="w-full border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 72 72" fill="none">
              <circle cx="32" cy="32" r="20" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="32" cy="32" r="9" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="47" y1="47" x2="62" y2="62" stroke="#C8FF57" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="font-game text-white text-2xl tracking-wider">DEDUCE</span>
          </div>

          {/* Right: streak + avatar */}
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1E1E]">
                <span>🔥</span>
                <span className="font-black text-[#F97316]">{streak}</span>
                <span className="text-xs text-[#555]">streak</span>
              </div>
            )}
            <button
              onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
              className="w-10 h-10 rounded-xl bg-[#1E1E1E] hover:bg-[#252525] flex items-center justify-center font-black text-sm text-white transition-colors"
            >
              {avatar}
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN CONTENT ────────────────────────────────────────────── */}
      <motion.main
        variants={stagger} initial="hidden" animate="show"
        className="flex-1 max-w-5xl mx-auto w-full px-6 py-8 space-y-10"
      >

        {/* ── DAILY CHALLENGE ─────────────────────────────────────── */}
        <motion.section variants={fadeUp}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-[#444] uppercase tracking-[0.25em]">Daily Challenge</p>
            <p className="text-xs font-bold text-[#5CE1E6] font-mono">Case #{todayCase.id}</p>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            onClick={() => !isCaseDone && router.push('/daily')}
            className="relative rounded-2xl bg-[#181818] overflow-hidden cursor-pointer group"
          >
            {/* Color progress bar top */}
            <div className="h-1.5 w-full flex">
              {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                const status = daily?.puzzles[i]?.status;
                return (
                  <motion.div
                    key={t}
                    className="flex-1"
                    style={{
                      background: status === 'solved'
                        ? PUZZLE_COLORS[t]
                        : status === 'active'
                        ? `${PUZZLE_COLORS[t]}55`
                        : '#252525',
                    }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                  />
                );
              })}
            </div>

            <div className="p-8 flex items-center gap-8">
              {/* Text content */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#555] uppercase tracking-widest mb-2">
                  {todayCase.difficulty} · 4 Puzzles
                </p>
                <h2 className="font-game text-white mb-4"
                  style={{ fontSize: 'clamp(28px, 4vw, 48px)', lineHeight: 1.1 }}>
                  {todayCase.title.toUpperCase()}
                </h2>

                {isCaseDone ? (
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-[#444] uppercase tracking-wider mb-1">Final Score</p>
                      <p className="font-game text-[#C8FF57]" style={{ fontSize: '42px', lineHeight: 1 }}>
                        {daily?.score?.toLocaleString() ?? '—'}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); router.push('/result'); }}
                      className="px-5 py-2.5 rounded-xl bg-[#252525] text-white text-sm font-bold hover:bg-[#2E2E2E] transition-colors"
                    >
                      View Result →
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/daily')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm tracking-wide transition-all"
                    style={{ background: '#C8FF57', color: '#0D0D0D' }}
                  >
                    {isCaseStarted ? `Continue · ${solvedCount}/4 →` : 'Start Investigation →'}
                  </motion.button>
                )}
              </div>

              {/* Solved checkmark or case icon */}
              <div className="shrink-0 hidden sm:flex">
                {isCaseDone ? (
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: '#C8FF57' }}>
                    <span className="font-game text-[#0D0D0D] text-4xl">✓</span>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-[#252525] flex items-center justify-center">
                    <span className="text-4xl">🔍</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* ── PUZZLE MODES ────────────────────────────────────────── */}
        <motion.section variants={fadeUp}>
          <p className="text-xs font-bold text-[#444] uppercase tracking-[0.25em] mb-4">Puzzle Modes</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {puzzleTypes.map((type, i) => {
              const meta  = PUZZLE_META[type];
              const color = PUZZLE_COLORS[type];
              const bg    = PUZZLE_BG[type];
              const icon  = PUZZLE_ICONS[type];

              return (
                <motion.button
                  key={type}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06, type: 'spring' as const, stiffness: 300, damping: 28 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/modes/${type}`)}
                  className="text-left rounded-2xl bg-[#181818] p-5 transition-all hover:bg-[#1E1E1E] group"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110"
                    style={{ background: bg }}
                  >
                    <span style={{ color }}>{icon}</span>
                  </div>
                  <p className="font-game text-white text-xl mb-1">{meta.label.toUpperCase()}</p>
                  <p className="text-[11px] text-[#555] leading-relaxed">{meta.description}</p>
                  <div className="mt-3">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                      style={{ background: `${color}20`, color }}
                    >
                      TIME ATTACK
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ── STATS ───────────────────────────────────────────────── */}
        <motion.section variants={fadeUp}>
          <p className="text-xs font-bold text-[#444] uppercase tracking-[0.25em] mb-4">Your Stats</p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Streak',     value: streak > 0 ? streak : 0,  unit: 'days', color: '#F97316', icon: '🔥' },
              { label: 'Best Score', value: bestScore > 0 ? bestScore : 0, unit: 'pts', color: '#C8FF57', icon: '⭐' },
              { label: 'Solved',     value: totalSolved, unit: 'cases', color: '#A855F7', icon: '🔍' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-[#181818] p-5 flex flex-col gap-2">
                <span className="text-2xl">{s.icon}</span>
                <p className="font-game leading-none" style={{ fontSize: '36px', color: s.color }}>
                  {s.value.toLocaleString()}
                </p>
                <p className="text-[11px] text-[#555] uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
