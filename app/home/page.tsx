'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase, PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleType } from '@/types';

const PUZZLE_COLORS: Record<PuzzleType, string> = {
  linkGrid:  '#A78BFA',
  timeTrace: '#FB923C',
  trueLie:   '#F472B6',
  codeBreak: '#67E8F9',
};

const PUZZLE_ICONS: Record<PuzzleType, string> = {
  linkGrid:  '⊞',
  timeTrace: '⊙',
  trueLie:   '⊡',
  codeBreak: '◈',
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 280, damping: 26 } },
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
  const avatar        = (user.displayName?.[0] ?? user.email?.[0] ?? 'G').toUpperCase();

  return (
    <div className="min-h-dvh bg-[#141414] flex flex-col">

      {/* ── Top bar (Matiks-style) ─────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 pt-safe pt-5 pb-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="26" height="26" viewBox="0 0 80 80" fill="none">
            <circle cx="36" cy="36" r="22" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="35" cy="35" r="10" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="43" y1="43" x2="56" y2="56" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <span className="text-white font-black text-xl tracking-tight">DEDUCE</span>
        </div>

        {/* Right: streak + avatar */}
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E1E1E]">
              <span className="text-sm">🔥</span>
              <span className="text-sm font-black text-[#FB923C]">{streak}</span>
            </div>
          )}
          <button
            onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
            className="w-9 h-9 rounded-xl bg-[#1E1E1E] flex items-center justify-center text-xs font-black text-white"
          >
            {avatar}
          </button>
        </div>
      </header>

      <motion.div variants={stagger} initial="hidden" animate="show"
        className="flex-1 overflow-y-auto px-4 pb-safe pb-8 space-y-5 pt-1"
      >

        {/* ── DAILY CHALLENGE section ─────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="text-[11px] font-bold text-[#555] uppercase tracking-[0.2em] mb-3 flex items-center justify-between">
            <span>Daily Challenge</span>
            <span className="text-[#67E8F9] font-mono">Case #{todayCase.id}</span>
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => !isCaseDone && router.push('/daily')}
            className="w-full text-left rounded-2xl bg-[#1E1E1E] overflow-hidden"
          >
            {/* Color strip */}
            <div className="h-1 w-full" style={{
              background: isCaseDone
                ? '#C8FF57'
                : 'linear-gradient(90deg, #A78BFA, #FB923C, #F472B6, #67E8F9)'
            }} />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-xl font-black text-white leading-tight">{todayCase.title}</p>
                  <p className="text-xs text-[#555] mt-1 uppercase tracking-wider font-semibold">
                    {todayCase.difficulty} · 4 Puzzles
                  </p>
                </div>
                {isCaseDone && (
                  <div className="w-9 h-9 rounded-xl bg-[#C8FF57]/15 flex items-center justify-center shrink-0">
                    <span className="text-[#C8FF57] text-lg font-black">✓</span>
                  </div>
                )}
              </div>

              {/* Puzzle step pills */}
              <div className="flex gap-2 mb-4">
                {(['linkGrid', 'timeTrace', 'trueLie', 'codeBreak'] as PuzzleType[]).map((t, i) => {
                  const status = daily?.puzzles[i]?.status;
                  const color  = PUZZLE_COLORS[t];
                  return (
                    <div
                      key={t}
                      className="flex-1 h-1.5 rounded-full"
                      style={{
                        background: status === 'solved'
                          ? color
                          : status === 'active'
                          ? `${color}50`
                          : '#2A2A2A',
                      }}
                    />
                  );
                })}
              </div>

              {isCaseDone ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#555] uppercase tracking-wider">Score</p>
                    <p className="text-2xl font-black text-[#C8FF57]">
                      {daily?.score?.toLocaleString() ?? '—'}
                    </p>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); router.push('/result'); }}
                    className="px-4 py-2 rounded-xl bg-[#252525] text-white text-xs font-bold"
                  >
                    View Result →
                  </button>
                </div>
              ) : (
                <button
                  className="w-full py-3.5 rounded-xl font-black text-sm transition-all active:scale-95"
                  style={{ background: '#C8FF57', color: '#141414' }}
                >
                  {isCaseStarted ? `Continue · ${solvedCount}/4 done →` : 'Start Investigation →'}
                </button>
              )}
            </div>
          </motion.button>
        </motion.div>

        {/* ── PUZZLE MODES section ────────────────────────────────── */}
        <motion.div variants={fadeUp}>
          <p className="text-[11px] font-bold text-[#555] uppercase tracking-[0.2em] mb-3">
            Puzzle Modes
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {puzzleTypes.map(type => {
              const meta  = PUZZLE_META[type];
              const color = PUZZLE_COLORS[type];
              const icon  = PUZZLE_ICONS[type];

              return (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => router.push(`/modes/${type}`)}
                  className="text-left rounded-2xl bg-[#1E1E1E] p-4 transition-all"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 text-2xl"
                    style={{ background: `${color}18` }}
                  >
                    <span style={{ color }}>{icon}</span>
                  </div>
                  <p className="text-sm font-black text-white">{meta.label}</p>
                  <p className="text-[11px] text-[#555] mt-0.5 leading-tight">{meta.description}</p>
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
        </motion.div>

        {/* ── Stats row ───────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
          {[
            { label: 'Streak',     value: streak > 0 ? `${streak} 🔥` : '0', color: '#FB923C' },
            { label: 'Best',       value: bestScore > 0 ? bestScore.toLocaleString() : '—', color: '#C8FF57' },
            { label: 'Solved',     value: String(totalSolved), color: '#A78BFA' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-[#1E1E1E] p-3.5 text-center">
              <p className="text-base font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-[#555] mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
