'use client';
import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PUZZLE_META } from '@/lib/data/cases';
import type { PuzzleStatus, PuzzleType } from '@/types';

const STEP_COLORS: Record<PuzzleType, string> = {
  linkGrid:  '#A78BFA',
  timeTrace: '#FB923C',
  trueLie:   '#F472B6',
  codeBreak: '#2DD4BF',
};
const PUZZLE_TYPES: PuzzleType[] = ['linkGrid', 'timeTrace', 'trueLie', 'codeBreak'];

const HOW_TO_PLAY: Record<PuzzleType, { steps: string[]; example: { label: string; lines: string[] } }> = {
  linkGrid: {
    steps: [
      'Read the clues to understand who belongs where.',
      'Tap a cell to cycle: empty → ✕ (ruled out) → ✓ (confirmed).',
      'Every row and column must have exactly one ✓.',
      'Use elimination — placing one person rules out others.',
      'Select your final answer from the chips below and confirm.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Clue: "Ravi is at Corner" → mark Ravi × Corner as ✓.',
        'Clue: "Cabin has Laptop" → Ravi (Corner) ≠ Cabin.',
        'Clue: "Asha not at Window" → Asha must be at Cabin → she has Laptop.',
      ],
    },
  },
  timeTrace: {
    steps: [
      'Read the clues to figure out the order of events.',
      'Tap a suspect name to select them (it highlights).',
      'Tap a time slot on the timeline to place them there.',
      'The crime always occurs at the highlighted middle slot.',
      'Fill every slot, then tap Lock In Timeline.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Clue: "Ravi came before Neha" → Ravi is placed earlier.',
        'Clue: "Asha was not first" → order is Ravi → Asha → Neha.',
        'Crime at 2 PM (middle slot) → Asha was present.',
      ],
    },
  },
  trueLie: {
    steps: [
      'Exactly one person is lying — everyone else tells the truth.',
      'Read each statement and think about whether it is consistent.',
      'Toggle each statement TRUE or LIE using the buttons.',
      'If two statements contradict, one of those people is the liar.',
      'Mark exactly one liar and tap Expose the Liar.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Asha: "Ravi did it". Ravi: "Neha is lying".',
        'If Ravi is innocent, Asha lies. But Ravi also wrongly blames Neha.',
        'Only one liar is valid — test each to find the contradiction.',
      ],
    },
  },
  codeBreak: {
    steps: [
      'Each clue shows a past guess and a hint about its digits.',
      '"Correct in right place" — the digit is right and in the right spot.',
      '"Correct but wrong place" — right digit, but in the wrong position.',
      'Cross-reference all clues to narrow down each digit.',
      'Enter your code using the keypad and tap Crack the Code.',
    ],
    example: {
      label: 'Example',
      lines: [
        'Guess 123 → "1 correct in right place": one digit is perfect.',
        'Guess 567 → "none correct": 5, 6, 7 are all eliminated.',
        'Guess 356 → "1 correct but wrong place": 3 is right, wrong spot.',
        'Conclusion: 3 goes to position 3, giving answer 132.',
      ],
    },
  },
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

interface PuzzleLayoutProps {
  title: string;
  puzzleType: PuzzleType;
  puzzleIndex?: number;
  totalPuzzles?: number;
  puzzleStatuses?: PuzzleStatus[];
  elapsedSeconds?: number;
  mistakes?: number;
  children: ReactNode;
  onBack?: () => void;
  timeAttack?: boolean;
  timeLeft?: number;
  solvedCount?: number;
}

export function PuzzleLayout({
  puzzleType, puzzleIndex, totalPuzzles, puzzleStatuses,
  elapsedSeconds, mistakes = 0, children, onBack,
  timeAttack, timeLeft, solvedCount,
}: PuzzleLayoutProps) {
  const router = useRouter();
  const meta   = PUZZLE_META[puzzleType];
  const color  = STEP_COLORS[puzzleType];
  const back   = onBack ?? (() => router.back());
  const isLow  = timeAttack && (timeLeft ?? 60) <= 10;
  const displayTime = timeAttack ? fmt(timeLeft ?? 0) : fmt(elapsedSeconds ?? 0);
  const timerColor  = isLow ? '#EF4444' : '#B5F23D';

  const [showHelp, setShowHelp] = useState(false);
  const { steps, example } = HOW_TO_PLAY[puzzleType];

  return (
    <div className="flex flex-col" style={{ background: '#0C0C0F', minHeight: '100dvh', maxWidth: 480, margin: '0 auto' }}>

      {/* ── Top Bar ────────────────────────────────────────────────── */}
      <header className="shrink-0 sticky top-0 z-10" style={{ background: '#0C0C0F' }}>
        <div
          className="flex items-center justify-between"
          style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Left: back + badge + index */}
          <div className="flex items-center" style={{ gap: 12 }}>
            <button
              onClick={back}
              className="flex items-center justify-center shrink-0 transition-colors"
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
                {meta.label.toUpperCase()}
              </span>
            </div>

            {puzzleIndex !== undefined && (
              <span style={{ fontSize: 12, color: '#5A5A6E' }}>
                {totalPuzzles ? `${puzzleIndex + 1} / ${totalPuzzles}` : `Puzzle ${puzzleIndex + 1}`}
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
            {/* How to play button */}
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center justify-center shrink-0 transition-colors"
              style={{
                width: 28, height: 28, borderRadius: 7,
                background: '#1C1C22', border: `1px solid rgba(255,255,255,0.07)`,
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

        {/* Progress segments */}
        <div className="flex" style={{ gap: 4, padding: '10px 20px' }}>
          {puzzleStatuses && !timeAttack ? (
            PUZZLE_TYPES.map((t, i) => (
              <div
                key={t}
                className="flex-1 transition-all duration-500"
                style={{
                  height: 3, borderRadius: 2,
                  background: puzzleStatuses[i] === 'solved' || puzzleStatuses[i] === 'active'
                    ? STEP_COLORS[t]
                    : 'rgba(255,255,255,0.07)',
                }}
              />
            ))
          ) : (
            <div className="flex-1" style={{ height: 3, borderRadius: 2, background: color }} />
          )}
        </div>
      </header>

      {/* ── scroll-body ────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto relative" style={{ padding: '0 20px' }}>
        {children}
      </main>

      {/* ── How to Play Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showHelp && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowHelp(false)}
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(12,12,15,0.85)' }}
            />

            {/* Modal sheet */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed z-50 left-0 right-0"
              style={{
                bottom: 0,
                maxWidth: 480,
                margin: '0 auto',
                background: '#141418',
                borderRadius: '20px 20px 0 0',
                border: '1px solid rgba(255,255,255,0.09)',
                borderBottom: 'none',
                padding: '0 0 32px',
              }}
            >
              {/* Handle */}
              <div className="flex justify-center pt-3 pb-1">
                <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.12)' }} />
              </div>

              {/* Header */}
              <div
                className="flex items-center justify-between"
                style={{ padding: '14px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center" style={{ gap: 8 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                  <span className="font-game" style={{ fontSize: 15, letterSpacing: '0.07em', color }}>
                    HOW TO PLAY
                  </span>
                  <span className="font-game" style={{ fontSize: 15, letterSpacing: '0.07em', color: '#5A5A6E' }}>
                    · {meta.label.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="flex items-center justify-center transition-colors"
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
                    color: '#5A5A6E',
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>

              {/* Steps */}
              <div style={{ padding: '18px 20px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start"
                    style={{ gap: 14 }}
                  >
                    {/* Step number */}
                    <div
                      className="flex items-center justify-center shrink-0 font-game"
                      style={{
                        width: 26, height: 26, borderRadius: 7,
                        background: `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.12)`,
                        border: `1px solid rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.25)`,
                        fontSize: 13, color, lineHeight: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                    {/* Step text */}
                    <p style={{ fontSize: 14, color: '#A0A0B0', lineHeight: 1.55, paddingTop: 3 }}>
                      {step}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Example */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ margin: '16px 20px 0' }}
              >
                <div
                  style={{
                    borderRadius: 12,
                    background: `rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.07)`,
                    border: `1px solid rgba(${parseInt(color.slice(1,3),16)},${parseInt(color.slice(3,5),16)},${parseInt(color.slice(5,7),16)},0.18)`,
                    padding: '14px 16px',
                  }}
                >
                  <p
                    className="font-game"
                    style={{ fontSize: 11, letterSpacing: '0.1em', color, marginBottom: 10 }}
                  >
                    {example.label.toUpperCase()}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {example.lines.map((line, i) => (
                      <div key={i} className="flex items-start" style={{ gap: 8 }}>
                        <div
                          style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: color, flexShrink: 0, marginTop: 6,
                          }}
                        />
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
