'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase } from '@/lib/data/cases';
import { useTimer } from '@/lib/hooks/useTimer';
import { calculateDailyScore } from '@/lib/utils/scoring';
import { PuzzleLayout } from '@/components/layout/PuzzleLayout';
import { AbstractLayout } from '@/components/layout/AbstractLayout';
import { LinkGrid } from '@/components/puzzles/LinkGrid';
import { TimeTrace } from '@/components/puzzles/TimeTrace';
import { TrueLie } from '@/components/puzzles/TrueLie';
import { CodeBreak } from '@/components/puzzles/CodeBreak';
import { RuleShift } from '@/components/puzzles/abstract/RuleShift';
import { SwapLogic } from '@/components/puzzles/abstract/SwapLogic';
import { BinaryDecision } from '@/components/puzzles/abstract/BinaryDecision';
import { SetLogic } from '@/components/puzzles/abstract/SetLogic';
import { getDailyAbstractPuzzles } from '@/lib/data/abstractHelpers';
import { ABSTRACT_PUZZLE_TYPES } from '@/types/abstract';
import type { AbstractPuzzle, AbstractPuzzleType } from '@/types/abstract';
import type { PuzzleType, PuzzleStatus } from '@/types';

const PUZZLE_TYPES: PuzzleType[] = ['linkGrid', 'timeTrace', 'trueLie', 'codeBreak'];
const DETECTIVE_LABELS = ['Link Grid', 'Time Trace', 'True Lie', 'Code Break'];

type Phase = 'detective' | 'abstract';

export default function DailyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { daily, solvePuzzle, addMistake, completeDailyCase, setLastResult } = useGameStore();
  const todayCase = getTodaysCase();
  const { seconds, start } = useTimer({ autoStart: false });

  const [phase, setPhase] = useState<Phase>('detective');
  const [activeIdx, setActiveIdx] = useState(0);
  const [solvedOverlay, setSolvedOverlay] = useState(false);
  const [abstractIdx, setAbstractIdx] = useState(0);
  const [abstractMistakes, setAbstractMistakes] = useState(0);
  const [abstractTypeStatuses, setAbstractTypeStatuses] = useState<
    Partial<Record<AbstractPuzzleType, 'solved' | 'active' | 'locked'>>
  >({ ruleShift: 'active' });

  const abstractPuzzles = useRef<AbstractPuzzle[]>(getDailyAbstractPuzzles('medium'));
  const abstractMistakesRef = useRef(0);
  abstractMistakesRef.current = abstractMistakes;

  useEffect(() => {
    if (!user)             { router.replace('/auth');   return; }
    if (!daily)            { router.replace('/home');   return; }
    if (daily.completedAt) { router.replace('/result'); return; }
    const idx = daily.puzzles.findIndex(p => p.status === 'active');
    if (idx >= 0) setActiveIdx(idx);
    if (daily.puzzles.every(p => p.status === 'solved')) setPhase('abstract');
    start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!user || !daily || daily.completedAt) return null;

  const currentType = PUZZLE_TYPES[activeIdx];
  const statuses = daily.puzzles.map(p => p.status as PuzzleStatus);

  const handleDetectiveSolve = () => {
    solvePuzzle(activeIdx);
    setSolvedOverlay(true);
    const isLast = activeIdx === PUZZLE_TYPES.length - 1;
    setTimeout(() => {
      setSolvedOverlay(false);
      if (isLast) {
        setPhase('abstract');
      } else {
        setActiveIdx(activeIdx + 1);
      }
    }, 900);
  };

  const handleAbstractSolve = useCallback(() => {
    const puzzle = abstractPuzzles.current[abstractIdx];
    const nextIdx = abstractIdx + 1;

    setAbstractTypeStatuses(prev => {
      const updated = { ...prev };
      updated[puzzle.type] = 'solved';
      if (nextIdx < abstractPuzzles.current.length) {
        updated[abstractPuzzles.current[nextIdx].type] = 'active';
      }
      return updated;
    });

    if (nextIdx >= abstractPuzzles.current.length) {
      const totalMistakes = daily.totalMistakes + abstractMistakesRef.current;
      const breakdown = calculateDailyScore(seconds, totalMistakes);
      completeDailyCase(breakdown.total);
      setLastResult({
        mode: 'daily',
        caseId: todayCase.id,
        caseTitle: todayCase.title,
        score: breakdown.total,
        timeSeconds: seconds,
        mistakes: totalMistakes,
        perfect: totalMistakes === 0,
        puzzleResults: PUZZLE_TYPES.map((t, i) => ({
          type: t, solved: true,
          mistakes: daily.puzzles[i]?.mistakes ?? 0, timeSeconds: 0,
        })),
        streak: useGameStore.getState().streak,
      });
      setTimeout(() => router.push('/result'), 1200);
    } else {
      setAbstractIdx(nextIdx);
    }
  }, [abstractIdx, daily, seconds, todayCase, completeDailyCase, setLastResult, router]);

  const handleAbstractMistake = useCallback(() => {
    setAbstractMistakes(m => m + 1);
  }, []);

  const renderDetectivePuzzle = () => {
    const p = todayCase.puzzles;
    const props = { onSolve: handleDetectiveSolve, onMistake: () => addMistake(activeIdx) };
    switch (currentType) {
      case 'linkGrid':  return <LinkGrid  puzzle={p.linkGrid}  {...props} />;
      case 'timeTrace': return <TimeTrace puzzle={p.timeTrace} {...props} />;
      case 'trueLie':   return <TrueLie   puzzle={p.trueLie}   {...props} />;
      case 'codeBreak': return <CodeBreak puzzle={p.codeBreak} {...props} />;
    }
  };

  const renderAbstractPuzzle = () => {
    const puzzle = abstractPuzzles.current[abstractIdx];
    if (!puzzle) return null;
    const props = { puzzle, onSolve: handleAbstractSolve, onMistake: handleAbstractMistake };
    switch (puzzle.type) {
      case 'ruleShift':      return <RuleShift      {...props} />;
      case 'swapLogic':      return <SwapLogic      {...props} />;
      case 'binaryDecision': return <BinaryDecision {...props} />;
      case 'setLogic':       return <SetLogic       {...props} />;
    }
  };

  // ── Detective Phase ───────────────────────────────────────────────────────
  if (phase === 'detective') {
    return (
      <PuzzleLayout
        title={todayCase.title}
        puzzleType={currentType}
        puzzleIndex={activeIdx}
        totalPuzzles={4}
        puzzleStatuses={statuses}
        elapsedSeconds={seconds}
        mistakes={daily.totalMistakes}
        onBack={() => router.push('/home')}
      >
        <AnimatePresence>
          {solvedOverlay && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
              style={{ background: 'rgba(12,12,15,0.93)', backdropFilter: 'blur(12px)' }}
            >
              <div className="relative flex items-center justify-center">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full border"
                    initial={{ scale: 0.8, opacity: 0.6 }}
                    animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                    transition={{ duration: 1.2, delay: i * 0.15, ease: 'easeOut' }}
                    style={{ width: 80, height: 80, borderColor: '#C8FF5740' }}
                  />
                ))}
                <motion.div
                  initial={{ scale: 0.4, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
                  className="w-20 h-20 rounded-2xl flex items-center justify-center relative z-10"
                  style={{ background: '#C8FF57', boxShadow: '0 0 60px rgba(200,255,87,0.4)' }}
                >
                  <span className="font-game text-[#0D0D0D]" style={{ fontSize: '40px' }}>✓</span>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <p className="font-game text-white" style={{ fontSize: '48px', letterSpacing: '0.05em' }}>SOLVED!</p>
                {activeIdx < PUZZLE_TYPES.length - 1 ? (
                  <p className="text-sm mt-2" style={{ color: '#A0A0B0' }}>
                    Next: {DETECTIVE_LABELS[activeIdx + 1]}
                  </p>
                ) : (
                  <p className="text-sm mt-2" style={{ color: '#60A5FA' }}>Up next: Abstract Logic</p>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentType}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {renderDetectivePuzzle()}
          </motion.div>
        </AnimatePresence>
      </PuzzleLayout>
    );
  }

  // ── Abstract Phase ────────────────────────────────────────────────────────
  const currentAbstractPuzzle = abstractPuzzles.current[abstractIdx];
  const currentAbstractType = currentAbstractPuzzle?.type ?? ABSTRACT_PUZZLE_TYPES[0];

  return (
    <AbstractLayout
      puzzleType={currentAbstractType}
      difficulty="medium"
      typeStatuses={abstractTypeStatuses}
      elapsedSeconds={seconds}
      mistakes={abstractMistakes}
      onBack={() => router.push('/home')}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={abstractIdx}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="flex-1 overflow-auto"
        >
          <div className="pt-4 pb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#5A5A6E' }}>
              Puzzle {abstractIdx + 5} of 8
            </p>
            <p className="text-xs font-bold" style={{ color: '#60A5FA' }}>Abstract Logic</p>
          </div>
          {renderAbstractPuzzle()}
        </motion.div>
      </AnimatePresence>
    </AbstractLayout>
  );
}
