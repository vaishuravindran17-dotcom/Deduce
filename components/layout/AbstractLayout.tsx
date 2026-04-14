'use client';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ABSTRACT_TYPE_META, ABSTRACT_PUZZLE_TYPES } from '@/types/abstract';
import type { AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';

const ABSTRACT_COLOR = '#60A5FA'; // category accent

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

const HOW_TO_PLAY: Record<AbstractPuzzleType, { steps: string[]; example: { label: string; lines: string[] } }> = {
  ruleShift: {
    steps: [
      'Study the 3 worked examples carefully.',
      'Identify the pattern (e.g. word length, vowel count, letter position).',
      'Apply the same rule to the target word.',
      'Select the correct output from the 4 options.',
      'Tap Lock In Answer when ready.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Apple → 5, Mango → 5, Banana → 6.',
        'Rule: count the letters in each word.',
        'Orange has 6 letters → answer is 6.',
      ],
    },
  },
  swapLogic: {
    steps: [
      'Note the starting order of all items.',
      'Apply each swap step mentally, one at a time.',
      'A swap exchanges two named items\' positions.',
      'After all swaps, identify the final order.',
      'Pick the matching option and confirm.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Start: Pizza, Burger, Pasta.',
        'Swap Pizza & Pasta → Pasta, Burger, Pizza.',
        'Swap Burger & Pizza → Pasta, Pizza, Burger.',
        'Final answer: Pasta, Pizza, Burger.',
      ],
    },
  },
  binaryDecision: {
    steps: [
      'Read all if → then rules carefully.',
      'Note the given fact at the bottom.',
      'Apply the fact to trigger the first rule.',
      'Chain the result through subsequent rules.',
      'Choose the final conclusion from the options.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Rule: If Ravi eats Pizza → Neha eats Salad.',
        'Rule: If Neha eats Salad → Arjun drinks Juice.',
        'Fact: Ravi eats Pizza.',
        'Chain: Pizza → Salad → Juice. Answer: Arjun drinks Juice.',
      ],
    },
  },
  setLogic: {
    steps: [
      'Read each premise and note the quantifier (All / Some / No).',
      'All A are B means every A is inside B.',
      'No A are B means A and B never overlap.',
      'Some A are B means at least one A is a B.',
      'Pick the one statement that MUST be true from the options.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Premise: All Cats are Mammals.',
        'Premise: All Mammals breathe air.',
        'Chain: Cats → Mammals → breathe air.',
        'Answer: All Cats breathe air (must be true).',
      ],
    },
  },
};

interface AbstractLayoutProps {
  puzzleType: AbstractPuzzleType;
  difficulty?: AbstractDifficulty;
  puzzleIndex?: number;
  /** For daily mode: which puzzle types are solved */
  typeStatuses?: Partial<Record<AbstractPuzzleType, 'solved' | 'active' | 'locked'>>;
  elapsedSeconds?: number;
  mistakes?: number;
  children: ReactNode;
  onBack?: () => void;
  timeAttack?: boolean;
  timeLeft?: number;
  solvedCount?: number;
}

export function AbstractLayout({
  puzzleType, difficulty, puzzleIndex, typeStatuses,
  elapsedSeconds, mistakes = 0, children, onBack,
  timeAttack, timeLeft, solvedCount,
}: AbstractLayoutProps) {
  const router = useRouter();
  const meta   = ABSTRACT_TYPE_META[puzzleType];
  const color  = meta.color;
  const back   = onBack ?? (() => router.back());
  const isLow  = timeAttack && (timeLeft ?? 60) <= 10;
  const displayTime = timeAttack ? fmt(timeLeft ?? 0) : fmt(elapsedSeconds ?? 0);
  const timerColor  = isLow ? '#EF4444' : '#B5F23D';

  const [showHelp, setShowHelp] = useState(false);
  const { steps, example } = HOW_TO_PLAY[puzzleType];

  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;

  return (
    <div className="flex flex-col" style={{ background: '#0C0C0F', minHeight: '100dvh', maxWidth: 480, margin: '0 auto' }}>

      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <header className="shrink-0 sticky top-0 z-10" style={{ background: '#0C0C0F' }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Left: back + badge */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={back}
              className="flex items-center justify-center shrink-0"
              style={{
                width: 34, height: 34, borderRadius: 8,
                background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
                color: '#A0A0B0',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4l-6 5 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <div className="flex items-center" style={{ gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
              <span
                className="font-game"
                style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color }}
              >
                {meta.label}
              </span>
            </div>

            {difficulty && (
              <span
                className="text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded"
                style={{ background: rgba(0.1), color, border: `1px solid ${rgba(0.25)}` }}
              >
                {difficulty}
              </span>
            )}
          </div>

          {/* Right: mistakes + timer + solved + help */}
          <div className="flex items-center" style={{ gap: 10 }}>
            {mistakes > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>×{mistakes}</span>
            )}
            <div className="flex items-center" style={{ gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: timerColor }} />
              <span
                className="font-game tabular-nums"
                style={{ fontSize: 17, fontWeight: 700, color: timerColor }}
              >
                {displayTime}
              </span>
            </div>
            {timeAttack && solvedCount !== undefined && (
              <div className="flex items-center" style={{ gap: 4, color: '#B5F23D', fontSize: 13, fontWeight: 600 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path d="M2 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {solvedCount}
              </div>
            )}
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center justify-center shrink-0"
              style={{
                width: 28, height: 28, borderRadius: 7,
                background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
                color: '#5A5A6E',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.5 6c0-0.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5c0 .7-.4 1.2-1 1.5C8 7.8 8 8 8 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="8" cy="11" r="0.75" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex" style={{ gap: 4, padding: '10px 20px' }}>
          {typeStatuses && !timeAttack ? (
            ABSTRACT_PUZZLE_TYPES.map(t => {
              const s = typeStatuses[t];
              return (
                <div
                  key={t}
                  className="flex-1 transition-all duration-500"
                  style={{
                    height: 3, borderRadius: 2,
                    background: s === 'solved' || s === 'active'
                      ? ABSTRACT_TYPE_META[t].color
                      : 'rgba(255,255,255,0.07)',
                  }}
                />
              );
            })
          ) : (
            <div className="flex-1" style={{ height: 3, borderRadius: 2, background: color }} />
          )}
        </div>
      </header>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto relative" style={{ padding: '0 20px' }}>
        {children}
      </main>

      {/* ── How to Play Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showHelp && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(12,12,15,0.85)' }}
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed z-50 left-0 right-0 overflow-y-auto"
              style={{
                bottom: 0, maxWidth: 480, margin: '0 auto',
                background: '#141418', borderRadius: '20px 20px 0 0',
                border: '1px solid rgba(255,255,255,0.09)', borderBottom: 'none',
                padding: '0 0 32px', maxHeight: '80dvh',
              }}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
              </div>
              <div
                className="flex items-center justify-between"
                style={{ padding: '14px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center" style={{ gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                  <span className="font-game" style={{ fontSize: 15, letterSpacing: '0.07em', color }}>HOW TO PLAY</span>
                  <span className="font-game" style={{ fontSize: 15, letterSpacing: '0.07em', color: '#5A5A6E' }}>
                    · {meta.label.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="flex items-center justify-center"
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start" style={{ gap: 14 }}
                  >
                    <div
                      className="flex items-center justify-center shrink-0 font-game"
                      style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: rgba(0.12), border: `1px solid ${rgba(0.25)}`,
                        fontSize: 13, color, lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                    <p style={{ fontSize: 14, color: '#A0A0B0', lineHeight: 1.55, paddingTop: 3 }}>{step}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ margin: '16px 20px 0' }}
              >
                <div
                  style={{
                    borderRadius: 12, padding: '14px 16px',
                    background: rgba(0.07), border: `1px solid ${rgba(0.18)}`,
                  }}
                >
                  <p className="font-game" style={{ fontSize: 11, letterSpacing: '0.1em', color, marginBottom: 10 }}>
                    {example.label.toUpperCase()}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {example.lines.map((line, i) => (
                      <div key={i} className="flex items-start" style={{ gap: 8 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: color, flexShrink: 0, marginTop: 6 }} />
                        <p style={{ fontSize: 12, color: '#A0A0B0', lineHeight: 1.6 }}>{line}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
