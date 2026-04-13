'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase, PUZZLE_META } from '@/lib/data/cases';
import { LinkGridIcon, TimeTraceIcon, TrueLieIcon, CodeBreakIcon, FlameIcon, TrophyIcon, StarIcon } from '@/components/ui/GameIcons';
import type { PuzzleType } from '@/types';

const PUZZLE_COLOR: Record<PuzzleType, string> = {
  linkGrid:  '#8B5CF6',
  timeTrace: '#F97316',
  trueLie:   '#EC4899',
  codeBreak: '#06B6D4',
};

function PuzzleIcon({ type, size }: { type: PuzzleType; size: number }) {
  const c = PUZZLE_COLOR[type];
  switch (type) {
    case 'linkGrid':  return <LinkGridIcon  size={size} color={c} />;
    case 'timeTrace': return <TimeTraceIcon size={size} color={c} />;
    case 'trueLie':   return <TrueLieIcon   size={size} color={c} />;
    case 'codeBreak': return <CodeBreakIcon size={size} color={c} />;
  }
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };
const up = {
  hidden: { opacity: 0, y: 20 },
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
    <div className="min-h-dvh bg-[#0D0D0D]">

      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0D0D0D]/95 backdrop-blur-sm border-b border-[#1E1E1E]">
        <div className="page-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="7" stroke="#C8FF57" strokeWidth="2.5"/>
              <circle cx="10" cy="10" r="3.5" stroke="#C8FF57" strokeWidth="2"/>
              <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="font-game text-white text-2xl tracking-wider">DEDUCE</span>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A]">
                <FlameIcon size={16} color="#F97316" />
                <span className="font-black text-[#F97316] text-sm">{streak}</span>
              </div>
            )}
            <button
              onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
              className="w-9 h-9 rounded-xl bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#252525] flex items-center justify-center font-black text-sm text-white transition-colors"
            >
              {avatar}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="page-container py-12 space-y-12"
      >

        {/* ── DAILY CHALLENGE ────────────────────────────────────────── */}
        <motion.section variants={up}>
          <p className="font-game text-[#555] text-xs mb-5" style={{ letterSpacing: '0.25em' }}>
            DAILY CHALLENGE
          </p>

          <div
            onClick={() => !isCaseDone && router.push('/daily')}
            className={`rounded-2xl bg-[#111111] border border-[#222] overflow-hidden ${!isCaseDone ? 'cursor-pointer hover:border-[#333] transition-colors' : ''}`}
          >
            {/* Top accent bar — 4 color segments */}
            <div className="flex h-1.5">
              {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                const s = daily?.puzzles[i]?.status;
                return (
                  <motion.div
                    key={t}
                    className="flex-1"
                    style={{ background: s === 'solved' ? PUZZLE_COLOR[t] : s === 'active' ? `${PUZZLE_COLOR[t]}55` : '#222' }}
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                  />
                );
              })}
            </div>

            <div className="p-8 lg:p-10 flex flex-col md:flex-row md:items-center gap-8">
              {/* Left: text */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">
                    {todayCase.difficulty}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#333]" />
                  <span className="text-xs font-bold text-[#666] uppercase tracking-[0.2em]">
                    4 Puzzles
                  </span>
                  {isCaseDone && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#333]" />
                      <span className="text-xs font-bold text-[#C8FF57] uppercase tracking-[0.2em]">
                        ✓ Completed
                      </span>
                    </>
                  )}
                </div>

                <h2 className="font-game text-white mb-7"
                  style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.05, letterSpacing: '0.03em' }}>
                  {todayCase.title.toUpperCase()}
                </h2>

                {/* Puzzle progress pills */}
                {isCaseStarted && (
                  <div className="flex gap-2 mb-7 flex-wrap">
                    {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                      const s = daily?.puzzles[i]?.status;
                      const meta = PUZZLE_META[t];
                      return (
                        <div
                          key={t}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{
                            background: s === 'solved' ? `${PUZZLE_COLOR[t]}18` : '#1A1A1A',
                            color: s === 'solved' ? PUZZLE_COLOR[t] : '#555',
                            border: `1px solid ${s === 'solved' ? `${PUZZLE_COLOR[t]}35` : '#2A2A2A'}`,
                          }}
                        >
                          {s === 'solved' && <span>✓</span>}
                          {meta.label}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isCaseDone ? (
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-[#555] uppercase tracking-widest mb-1">Final Score</p>
                      <p className="font-game text-[#C8FF57]" style={{ fontSize: '48px', lineHeight: 1 }}>
                        {daily?.score?.toLocaleString() ?? '—'}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); router.push('/result'); }}
                      className="px-5 py-3 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A] text-white text-sm font-bold hover:bg-[#252525] transition-colors"
                    >
                      View Result →
                    </button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/daily')}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-base tracking-wide transition-all"
                    style={{ background: '#C8FF57', color: '#0D0D0D', boxShadow: '0 0 32px rgba(200,255,87,0.2)' }}
                  >
                    {isCaseStarted ? `Continue · ${solvedCount}/4 done →` : 'Begin Investigation →'}
                  </motion.button>
                )}
              </div>

              {/* Right: icon */}
              <div className="shrink-0 hidden lg:flex">
                {isCaseDone ? (
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center"
                    style={{ background: '#C8FF5715', border: '1.5px solid #C8FF5735' }}
                  >
                    <span className="font-game text-[#C8FF57] text-5xl">✓</span>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-[#1A1A1A] border border-[#252525] flex items-center justify-center">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="10" cy="10" r="7" stroke="#444" strokeWidth="2"/>
                      <circle cx="10" cy="10" r="3.5" stroke="#444" strokeWidth="1.5"/>
                      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#444" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── PUZZLE MODES ───────────────────────────────────────────── */}
        <motion.section variants={up}>
          <p className="font-game text-[#555] text-xs mb-5" style={{ letterSpacing: '0.25em' }}>
            PUZZLE MODES
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {puzzleTypes.map((type, i) => {
              const meta  = PUZZLE_META[type];
              const color = PUZZLE_COLOR[type];

              return (
                <motion.button
                  key={type}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, type: 'spring' as const, stiffness: 300, damping: 26 }}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/modes/${type}`)}
                  className="group text-left rounded-2xl bg-[#111111] border border-[#222] p-6 transition-all hover:border-[#333] hover:bg-[#141414]"
                >
                  <div className="mb-6 p-3 rounded-xl inline-block" style={{ background: `${color}15` }}>
                    <PuzzleIcon type={type} size={28} />
                  </div>
                  <p className="font-game text-white text-2xl mb-2" style={{ letterSpacing: '0.04em' }}>
                    {meta.label.toUpperCase()}
                  </p>
                  <p className="text-xs text-[#777] leading-relaxed mb-5">{meta.description}</p>
                  <span
                    className="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider"
                    style={{ background: `${color}18`, color, border: `1px solid ${color}25` }}
                  >
                    Time Attack
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ── STATS ──────────────────────────────────────────────────── */}
        <motion.section variants={up}>
          <p className="font-game text-[#555] text-xs mb-5" style={{ letterSpacing: '0.25em' }}>
            YOUR STATS
          </p>
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: 'Streak',     value: streak,      unit: 'days',   color: '#F97316', icon: <FlameIcon  size={20} color="#F97316" /> },
              { label: 'Best Score', value: bestScore,   unit: 'points', color: '#C8FF57', icon: <StarIcon   size={20} color="#C8FF57" /> },
              { label: 'Solved',     value: totalSolved, unit: 'cases',  color: '#8B5CF6', icon: <TrophyIcon size={20} color="#8B5CF6" /> },
            ].map(s => (
              <div key={s.label} className="rounded-2xl bg-[#111111] border border-[#222] p-6 flex items-start gap-4">
                <div className="mt-1 p-2 rounded-xl shrink-0" style={{ background: `${s.color}15` }}>
                  {s.icon}
                </div>
                <div>
                  <p className="font-game leading-none mb-1.5" style={{ fontSize: '38px', color: s.color }}>
                    {s.value.toLocaleString()}
                  </p>
                  <p className="text-xs text-[#666] uppercase tracking-wider">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Bottom padding */}
        <div className="h-8" />
      </motion.div>
    </div>
  );
}
