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
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F', maxWidth: 480, margin: '0 auto' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="flex items-center justify-between shrink-0"
        style={{ padding: '18px 20px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: '#B5F23D' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="6" stroke="#0C0C0F" strokeWidth="2.5"/>
              <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="#0C0C0F" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="font-game text-white tracking-widest" style={{ fontSize: '17px' }}>DEDUCE</span>
        </div>

        {/* Right: streak + avatar */}
        <div className="flex items-center gap-2.5">
          {streak > 0 && (
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
              style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <FlameIcon size={14} color="#FB923C" />
              <span className="font-bold text-xs" style={{ color: '#FB923C' }}>{streak}</span>
            </div>
          )}
          <button
            onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
            style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#A0A0B0' }}
          >
            {avatar}
          </button>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 32 }}>

        {/* ── Daily Challenge ─────────────────────────────────────────── */}
        <section style={{ padding: '24px 20px 0' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: '#5A5A6E' }}>
            Daily Challenge
          </p>

          <div
            onClick={() => !isCaseDone && router.push('/daily')}
            className={`rounded-[20px] overflow-hidden ${!isCaseDone ? 'cursor-pointer' : ''}`}
            style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.13)' }}
          >
            {/* Accent bar */}
            <div className="flex" style={{ height: 4 }}>
              {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                const s = daily?.puzzles[i]?.status;
                return (
                  <div
                    key={t}
                    className="flex-1 transition-all duration-500"
                    style={{
                      background: s === 'solved'
                        ? PUZZLE_COLOR[t]
                        : s === 'active'
                        ? `${PUZZLE_COLOR[t]}55`
                        : 'rgba(255,255,255,0.07)',
                    }}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between gap-5" style={{ padding: '22px 24px' }}>
              <div className="flex-1 min-w-0">
                {/* Meta row */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em]" style={{ color: '#FB923C' }}>
                    {todayCase.difficulty}
                  </span>
                  <div className="w-1 h-1 rounded-full" style={{ background: '#5A5A6E' }} />
                  <span className="text-xs uppercase tracking-[0.05em]" style={{ color: '#5A5A6E' }}>
                    4 Puzzles
                  </span>
                  {isCaseDone && (
                    <>
                      <div className="w-1 h-1 rounded-full" style={{ background: '#5A5A6E' }} />
                      <span className="text-[11px] font-bold" style={{ color: '#B5F23D' }}>✓ Done</span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2
                  className="font-game text-white"
                  style={{ fontSize: 30, lineHeight: 1, letterSpacing: '-0.01em', marginBottom: 18 }}
                >
                  {todayCase.title.toUpperCase()}
                </h2>

                {/* Progress pills */}
                {isCaseStarted && !isCaseDone && (
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {(['linkGrid','timeTrace','trueLie','codeBreak'] as PuzzleType[]).map((t, i) => {
                      const s = daily?.puzzles[i]?.status;
                      return (
                        <div
                          key={t}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold"
                          style={{
                            background: s === 'solved' ? `${PUZZLE_COLOR[t]}18` : '#1C1C22',
                            color:      s === 'solved' ? PUZZLE_COLOR[t] : '#5A5A6E',
                            border:     `1px solid ${s === 'solved' ? `${PUZZLE_COLOR[t]}35` : 'rgba(255,255,255,0.07)'}`,
                          }}
                        >
                          {s === 'solved' && '✓ '}{PUZZLE_META[t].label}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isCaseDone ? (
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#5A5A6E' }}>Score</p>
                      <p className="font-game" style={{ fontSize: 40, lineHeight: 1, color: '#B5F23D' }}>
                        {daily?.score?.toLocaleString() ?? '—'}
                      </p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); router.push('/result'); }}
                      className="px-4 py-2 rounded-lg text-sm font-bold"
                      style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#F0F0F4' }}
                    >
                      Results →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => router.push('/daily')}
                    className="inline-flex items-center gap-1.5 rounded-lg font-bold"
                    style={{
                      background: '#B5F23D', color: '#0C0C0F',
                      fontSize: 13, letterSpacing: '0.06em',
                      padding: '9px 18px',
                    }}
                  >
                    {isCaseStarted ? `Continue · ${solvedCount}/4` : 'Begin Investigation'}
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                )}
              </div>

              {/* Graphic */}
              <div
                className="shrink-0 flex items-center justify-center rounded-xl"
                style={{ width: 68, height: 68, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                {isCaseDone
                  ? <span className="font-game text-3xl" style={{ color: '#B5F23D' }}>✓</span>
                  : <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="10" cy="10" r="7" stroke="#5A5A6E" strokeWidth="2"/>
                      <line x1="15" y1="15" x2="21" y2="21" stroke="#5A5A6E" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                }
              </div>
            </div>
          </div>
        </section>

        {/* ── Puzzle Modes ──────────────────────────────────────────── */}
        <section style={{ padding: '28px 20px 0' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: '#5A5A6E' }}>
            Puzzle Modes
          </p>
          <div className="grid grid-cols-2" style={{ gap: 10 }}>
            {puzzleTypes.map((type, i) => {
              const meta  = PUZZLE_META[type];
              const color = PUZZLE_COLOR[type];
              return (
                <motion.button
                  key={type}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push(`/modes/${type}`)}
                  className="text-left rounded-2xl transition-colors"
                  style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: 16 }}
                >
                  <div
                    className="flex items-center justify-center rounded-[10px] mb-2.5"
                    style={{ width: 36, height: 36, background: `${color}18` }}
                  >
                    <PuzzleIcon type={type} size={18} />
                  </div>
                  <p
                    className="font-game text-white"
                    style={{ fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}
                  >
                    {meta.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#5A5A6E' }}>{meta.description}</p>
                  <span
                    className="inline-block text-[10px] font-bold uppercase tracking-[0.1em] rounded-[5px]"
                    style={{ background: `${color}12`, color, padding: '3px 8px', marginTop: 8 }}
                  >
                    Time Attack
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* ── Abstract Logic ────────────────────────────────────────── */}
        <section style={{ padding: '28px 20px 0' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: '#5A5A6E' }}>
            Abstract Logic
          </p>
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/abstract')}
            className="w-full text-left rounded-2xl transition-colors"
            style={{ background: '#141418', border: '1px solid rgba(96,165,250,0.2)', padding: 16 }}
          >
            <div className="flex items-center" style={{ gap: 10 }}>
              <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: '#60A5FA', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="flex items-center flex-wrap" style={{ gap: 6, marginBottom: 8 }}>
                  {(['#60A5FA','#34D399','#FBBF24','#F87171'] as const).map((c, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-bold uppercase tracking-wide rounded-md px-2 py-0.5"
                      style={{ background: `${c}14`, color: c, border: `1px solid ${c}30` }}
                    >
                      {['RuleShift','SwapLogic','BinaryDecision','SetLogic'][i]}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-semibold" style={{ color: '#5A5A6E' }}>
                  4 types · Daily + Time Attack
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 4l4 4-4 4" stroke="#5A5A6E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.button>
        </section>

        {/* ── Stats ─────────────────────────────────────────────────── */}
        <section style={{ padding: '24px 20px 32px' }}>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: '#5A5A6E' }}>
            Your Stats
          </p>
          <div className="grid grid-cols-3" style={{ gap: 8 }}>
            {[
              { label: 'Streak',     value: streak,      color: '#FB923C', icon: <FlameIcon  size={14} color="#FB923C" /> },
              { label: 'Best Score', value: bestScore,   color: '#B5F23D', icon: <StarIcon   size={14} color="#B5F23D" /> },
              { label: 'Solved',     value: totalSolved, color: '#A78BFA', icon: <TrophyIcon size={14} color="#A78BFA" /> },
            ].map(s => (
              <div
                key={s.label}
                className="rounded-xl"
                style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '14px 16px' }}
              >
                <div className="flex items-center gap-1.5 mb-1.5" style={{ color: '#5A5A6E' }}>
                  {s.icon}
                </div>
                <p className="font-game leading-none" style={{ fontSize: 24, color: s.color }}>
                  {s.value.toLocaleString()}
                </p>
                <p
                  className="font-bold uppercase"
                  style={{ fontSize: 10, letterSpacing: '0.12em', color: '#5A5A6E', marginTop: 3 }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
