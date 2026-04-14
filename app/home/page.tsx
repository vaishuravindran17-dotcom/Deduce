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
  linkGrid:  '#A78BFA',
  timeTrace: '#FB923C',
  trueLie:   '#F472B6',
  codeBreak: '#2DD4BF',
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
    <div className="min-h-dvh" style={{ background: '#0C0C0F' }}>

      {/* ── NAVIGATION ───────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 backdrop-blur-sm"
        style={{ background: 'rgba(12,12,15,0.95)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="page-container h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="7" stroke="#B5F23D" strokeWidth="2.5"/>
              <circle cx="10" cy="10" r="3.5" stroke="#B5F23D" strokeWidth="2"/>
              <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#B5F23D" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="font-game text-white text-2xl tracking-wider">DEDUCE</span>
          </div>
          <div className="flex items-center gap-3">
            {streak > 0 && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <FlameIcon size={16} color="#FB923C" />
                <span className="font-black text-sm" style={{ color: '#FB923C' }}>{streak}</span>
              </div>
            )}
            <button
              onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm text-white transition-colors"
              style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {avatar}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ─────────────────────────────────────────────── */}
      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="page-container py-14 space-y-14"
      >

        {/* ── DAILY CHALLENGE ────────────────────────────────────────── */}
        <motion.section variants={up}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#5A5A6E' }}>
            Daily Challenge
          </p>

          <div
            onClick={() => !isCaseDone && router.push('/daily')}
            className={`rounded-2xl overflow-hidden ${!isCaseDone ? 'cursor-pointer' : ''}`}
            style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Top accent bar — 4 color segments */}
            <div className="flex h-1.5">
              {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                const s = daily?.puzzles[i]?.status;
                return (
                  <motion.div
                    key={t}
                    className="flex-1"
                    style={{
                      background: s === 'solved'
                        ? PUZZLE_COLOR[t]
                        : s === 'active'
                        ? `${PUZZLE_COLOR[t]}55`
                        : 'rgba(255,255,255,0.07)',
                    }}
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
                  <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#5A5A6E' }}>
                    {todayCase.difficulty}
                  </span>
                  <span className="w-1 h-1 rounded-full" style={{ background: '#3A3A4A' }} />
                  <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#5A5A6E' }}>
                    4 Puzzles
                  </span>
                  {isCaseDone && (
                    <>
                      <span className="w-1 h-1 rounded-full" style={{ background: '#3A3A4A' }} />
                      <span className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#B5F23D' }}>
                        ✓ Completed
                      </span>
                    </>
                  )}
                </div>

                <h2
                  className="font-game text-white mb-7"
                  style={{ fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 1.05, letterSpacing: '0.03em' }}
                >
                  {todayCase.title.toUpperCase()}
                </h2>

                {/* Puzzle progress pills */}
                {isCaseStarted && (
                  <div className="flex gap-2 mb-7 flex-wrap">
                    {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                      const s    = daily?.puzzles[i]?.status;
                      const meta = PUZZLE_META[t];
                      return (
                        <div
                          key={t}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{
                            background: s === 'solved' ? `${PUZZLE_COLOR[t]}18` : '#1C1C22',
                            color:      s === 'solved' ? PUZZLE_COLOR[t] : '#5A5A6E',
                            border:     `1px solid ${s === 'solved' ? `${PUZZLE_COLOR[t]}35` : 'rgba(255,255,255,0.07)'}`,
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
                      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#5A5A6E' }}>Final Score</p>
                      <p className="font-game" style={{ fontSize: '48px', lineHeight: 1, color: '#B5F23D' }}>
                        {daily?.score?.toLocaleString() ?? '—'}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); router.push('/result'); }}
                      className="px-5 py-3 rounded-xl text-white text-sm font-bold transition-colors"
                      style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)' }}
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
                    style={{ background: '#B5F23D', color: '#0C0C0F', boxShadow: '0 0 40px rgba(181,242,61,0.2)' }}
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
                    style={{ background: 'rgba(181,242,61,0.1)', border: '1px solid rgba(181,242,61,0.25)' }}
                  >
                    <span className="font-game text-5xl" style={{ color: '#B5F23D' }}>✓</span>
                  </div>
                ) : (
                  <div
                    className="w-24 h-24 rounded-2xl flex items-center justify-center"
                    style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="10" cy="10" r="7" stroke="#5A5A6E" strokeWidth="2"/>
                      <circle cx="10" cy="10" r="3.5" stroke="#5A5A6E" strokeWidth="1.5"/>
                      <line x1="15.5" y1="15.5" x2="21" y2="21" stroke="#5A5A6E" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── PUZZLE MODES ───────────────────────────────────────────── */}
        <motion.section variants={up}>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#5A5A6E' }}>
            Puzzle Modes
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                  className="group text-left rounded-2xl p-6 transition-all"
                  style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="mb-5 p-3 rounded-xl inline-block"
                    style={{ background: `${color}18`, border: `1px solid ${color}25` }}
                  >
                    <PuzzleIcon type={type} size={28} />
                  </div>
                  <p className="font-game text-white text-2xl mb-2" style={{ letterSpacing: '0.04em' }}>
                    {meta.label.toUpperCase()}
                  </p>
                  <p className="text-xs leading-relaxed mb-5" style={{ color: '#A0A0B0' }}>{meta.description}</p>
                  <span
                    className="inline-block text-[10px] font-black px-2.5 py-1.5 rounded-lg uppercase tracking-wider"
                    style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
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
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: '#5A5A6E' }}>
            Your Stats
          </p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Streak',     value: streak,      color: '#FB923C', icon: <FlameIcon  size={20} color="#FB923C" /> },
              { label: 'Best Score', value: bestScore,   color: '#B5F23D', icon: <StarIcon   size={20} color="#B5F23D" /> },
              { label: 'Solved',     value: totalSolved, color: '#A78BFA', icon: <TrophyIcon size={20} color="#A78BFA" /> },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-2xl p-6 flex items-start gap-4"
                style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div
                  className="mt-1 p-2.5 rounded-xl shrink-0"
                  style={{ background: `${s.color}18`, border: `1px solid ${s.color}25` }}
                >
                  {s.icon}
                </div>
                <div>
                  <p className="font-game leading-none mb-2" style={{ fontSize: '38px', color: s.color }}>
                    {s.value.toLocaleString()}
                  </p>
                  <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: '#5A5A6E' }}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <div className="h-8" />
      </motion.div>
    </div>
  );
}
