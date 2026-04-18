'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase, PUZZLE_META } from '@/lib/data/cases';
import { LinkGridIcon, TimeTraceIcon, TrueLieIcon, CodeBreakIcon, FlameIcon, TrophyIcon, StarIcon } from '@/components/ui/GameIcons';
import { ABSTRACT_PUZZLE_TYPES, ABSTRACT_TYPE_META } from '@/types/abstract';
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

const DETECTIVE_TYPES: PuzzleType[] = ['linkGrid', 'timeTrace', 'trueLie', 'codeBreak'];

const CARD_HOVER = { y: -3, transition: { duration: 0.15, ease: 'easeOut' as const } };
const CARD_TAP   = { scale: 0.97 };

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.18em', color: '#5A5A6E', marginBottom: 16 }}>
      {children}
    </p>
  );
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
  const avatar        = (user.displayName?.[0] ?? user.email?.[0] ?? 'G').toUpperCase();

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-10 w-full shrink-0"
        style={{ background: 'rgba(12,12,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center shrink-0 rounded-lg"
              style={{ width: 32, height: 32, background: '#B5F23D' }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="10" cy="10" r="6" stroke="#0C0C0F" strokeWidth="2.5"/>
                <line x1="14.5" y1="14.5" x2="20" y2="20" stroke="#0C0C0F" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-game text-white" style={{ fontSize: 17, letterSpacing: '0.1em' }}>DEDUCE</span>
          </div>

          <div className="flex items-center gap-2.5">
            {streak > 0 && (
              <div
                className="flex items-center gap-1.5 rounded-lg"
                style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', padding: '6px 10px' }}
              >
                <FlameIcon size={14} color="#FB923C" />
                <span className="font-bold" style={{ fontSize: 12, color: '#FB923C' }}>{streak}</span>
              </div>
            )}
            <button
              onClick={() => { useAuthStore.getState().logout(); router.replace('/auth'); }}
              className="flex items-center justify-center font-bold rounded-full"
              style={{ width: 36, height: 36, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#A0A0B0', fontSize: 13 }}
            >
              {avatar}
            </button>
          </div>
        </div>
      </header>

      {/* ── Scrollable body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px 56px' }}>

          {/* ── Daily Challenge ────────────────────────────────────────── */}
          <section style={{ marginBottom: 44 }}>
            <SectionLabel>Daily Challenge</SectionLabel>

            <motion.div
              whileHover={!isCaseDone ? { y: -2, transition: { duration: 0.15 } } : {}}
              onClick={() => !isCaseDone && router.push('/daily')}
              className={`rounded-2xl overflow-hidden ${!isCaseDone ? 'cursor-pointer' : ''}`}
              style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {/* 8-segment accent bar */}
              <div className="flex" style={{ height: 3 }}>
                {DETECTIVE_TYPES.map((t, i) => {
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
                          : 'rgba(255,255,255,0.06)',
                      }}
                    />
                  );
                })}
                {ABSTRACT_PUZZLE_TYPES.map(t => (
                  <div key={t} className="flex-1" style={{ background: 'rgba(255,255,255,0.06)' }} />
                ))}
              </div>

              <div className="flex items-center justify-between gap-6" style={{ padding: '24px 28px' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginBottom: 8 }}>
                    <span className="font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.1em', color: '#FB923C' }}>
                      {todayCase.difficulty}
                    </span>
                    <div className="w-1 h-1 rounded-full" style={{ background: '#3A3A4A' }} />
                    <span className="uppercase" style={{ fontSize: 11, letterSpacing: '0.05em', color: '#5A5A6E' }}>
                      8 Puzzles · Detective + Abstract
                    </span>
                    {isCaseDone && (
                      <>
                        <div className="w-1 h-1 rounded-full" style={{ background: '#3A3A4A' }} />
                        <span className="font-bold" style={{ fontSize: 11, color: '#B5F23D' }}>✓ Complete</span>
                      </>
                    )}
                  </div>

                  <h2
                    className="font-game text-white"
                    style={{ fontSize: 'clamp(22px, 3vw, 36px)', lineHeight: 1.05, letterSpacing: '-0.01em', marginBottom: 20 }}
                  >
                    {todayCase.title.toUpperCase()}
                  </h2>

                  {isCaseStarted && !isCaseDone && (
                    <div className="flex gap-1.5 flex-wrap" style={{ marginBottom: 16 }}>
                      {DETECTIVE_TYPES.map((t, i) => {
                        const s = daily?.puzzles[i]?.status;
                        return (
                          <div
                            key={t}
                            className="flex items-center gap-1 rounded-md font-bold"
                            style={{
                              padding: '4px 10px', fontSize: 11,
                              background: s === 'solved' ? `${PUZZLE_COLOR[t]}15` : '#1C1C22',
                              color:      s === 'solved' ? PUZZLE_COLOR[t] : '#5A5A6E',
                              border:     `1px solid ${s === 'solved' ? `${PUZZLE_COLOR[t]}30` : 'rgba(255,255,255,0.06)'}`,
                            }}
                          >
                            {s === 'solved' && '✓ '}{PUZZLE_META[t].label}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {isCaseDone ? (
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="uppercase font-bold" style={{ fontSize: 10, letterSpacing: '0.14em', color: '#5A5A6E', marginBottom: 4 }}>Score</p>
                        <p className="font-game" style={{ fontSize: 44, lineHeight: 1, color: '#B5F23D' }}>
                          {daily?.score?.toLocaleString() ?? '—'}
                        </p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); router.push('/result'); }}
                        className="rounded-lg font-bold transition-colors"
                        style={{ padding: '8px 16px', background: '#1C1C22', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F0F4', fontSize: 13 }}
                      >
                        Results →
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => router.push('/daily')}
                      className="inline-flex items-center gap-2 rounded-xl font-bold transition-all"
                      style={{ background: '#B5F23D', color: '#0C0C0F', fontSize: 13, letterSpacing: '0.05em', padding: '10px 20px' }}
                    >
                      {isCaseStarted ? `Continue · ${solvedCount}/8` : 'Begin Investigation'}
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  )}
                </div>

                <div
                  className="shrink-0 flex items-center justify-center rounded-2xl"
                  style={{ width: 72, height: 72, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  {isCaseDone
                    ? <span className="font-game" style={{ fontSize: 32, color: '#B5F23D' }}>✓</span>
                    : <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <circle cx="10" cy="10" r="7" stroke="#3A3A4A" strokeWidth="2"/>
                        <line x1="15" y1="15" x2="21" y2="21" stroke="#3A3A4A" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                  }
                </div>
              </div>
            </motion.div>
          </section>

          {/* ── Game Modes — all 8 ─────────────────────────────────────── */}
          <section style={{ marginBottom: 44 }}>
            <SectionLabel>Game Modes</SectionLabel>

            <div className="grid grid-cols-2 sm:grid-cols-4" style={{ gap: 14 }}>

              {/* ── Detective games ── */}
              {DETECTIVE_TYPES.map((type, i) => {
                const meta  = PUZZLE_META[type];
                const color = PUZZLE_COLOR[type];
                return (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={CARD_HOVER}
                    whileTap={CARD_TAP}
                    onClick={() => router.push(`/modes/${type}`)}
                    className="text-left rounded-2xl"
                    style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 18px 16px' }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, background: `${color}15`, marginBottom: 14 }}
                    >
                      <PuzzleIcon type={type} size={20} />
                    </div>
                    <p
                      className="font-game text-white"
                      style={{ fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}
                    >
                      {meta.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#5A5A6E', lineHeight: 1.4, marginBottom: 12 }}>{meta.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-block font-bold uppercase rounded-md"
                        style={{ fontSize: 10, letterSpacing: '0.1em', background: `${color}12`, color, padding: '3px 8px' }}
                      >
                        Time Attack
                      </span>
                      <span
                        className="inline-block font-bold uppercase rounded-md"
                        style={{ fontSize: 10, letterSpacing: '0.1em', background: 'rgba(255,255,255,0.04)', color: '#4A4A5A', padding: '3px 8px' }}
                      >
                        Detective
                      </span>
                    </div>
                  </motion.button>
                );
              })}

              {/* ── Abstract games ── */}
              {ABSTRACT_PUZZLE_TYPES.map((type, i) => {
                const meta  = ABSTRACT_TYPE_META[type];
                const color = meta.color;
                return (
                  <motion.button
                    key={type}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (i + 4) * 0.05 }}
                    whileHover={CARD_HOVER}
                    whileTap={CARD_TAP}
                    onClick={() => router.push(`/abstract/${type}`)}
                    className="text-left rounded-2xl"
                    style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 18px 16px' }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, background: `${color}15`, marginBottom: 14, fontSize: 20 }}
                    >
                      {meta.emoji}
                    </div>
                    <p
                      className="font-game text-white"
                      style={{ fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}
                    >
                      {meta.label}
                    </p>
                    <p style={{ fontSize: 12, color: '#5A5A6E', lineHeight: 1.4, marginBottom: 12 }}>{meta.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="inline-block font-bold uppercase rounded-md"
                        style={{ fontSize: 10, letterSpacing: '0.1em', background: `${color}12`, color, padding: '3px 8px' }}
                      >
                        Time Attack
                      </span>
                      <span
                        className="inline-block font-bold uppercase rounded-md"
                        style={{ fontSize: 10, letterSpacing: '0.1em', background: 'rgba(255,255,255,0.04)', color: '#4A4A5A', padding: '3px 8px' }}
                      >
                        Abstract
                      </span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </section>

          {/* ── Stats ─────────────────────────────────────────────────── */}
          <section>
            <SectionLabel>Your Stats</SectionLabel>
            <div className="grid grid-cols-3" style={{ gap: 12 }}>
              {[
                { label: 'Streak',     value: streak,      color: '#FB923C', icon: <FlameIcon  size={16} color="#FB923C" /> },
                { label: 'Best Score', value: bestScore,   color: '#B5F23D', icon: <StarIcon   size={16} color="#B5F23D" /> },
                { label: 'Solved',     value: totalSolved, color: '#A78BFA', icon: <TrophyIcon size={16} color="#A78BFA" /> },
              ].map(s => (
                <div
                  key={s.label}
                  className="rounded-2xl"
                  style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px' }}
                >
                  <div className="flex items-center gap-1.5" style={{ marginBottom: 10, color: '#5A5A6E' }}>
                    {s.icon}
                  </div>
                  <p className="font-game leading-none" style={{ fontSize: 28, color: s.color, marginBottom: 6 }}>
                    {s.value.toLocaleString()}
                  </p>
                  <p className="font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.14em', color: '#5A5A6E' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
