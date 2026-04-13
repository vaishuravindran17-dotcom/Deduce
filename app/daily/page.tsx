'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getTodaysCase } from '@/lib/data/cases';
import { useTimer } from '@/lib/hooks/useTimer';
import { calculateDailyScore } from '@/lib/utils/scoring';
import { PuzzleLayout } from '@/components/layout/PuzzleLayout';
import { LinkGrid } from '@/components/puzzles/LinkGrid';
import { TimeTrace } from '@/components/puzzles/TimeTrace';
import { TrueLie } from '@/components/puzzles/TrueLie';
import { CodeBreak } from '@/components/puzzles/CodeBreak';
import type { PuzzleType, PuzzleStatus } from '@/types';

const PUZZLE_TYPES: PuzzleType[] = ['linkGrid', 'timeTrace', 'trueLie', 'codeBreak'];
const PUZZLE_LABELS = ['LinkGrid', 'TimeTrace', 'TrueLie', 'CodeBreak'];
const PUZZLE_DESCS  = [
  'Eliminate with the grid',
  'Order the timeline',
  'Find the liar',
  'Crack the code',
];

export default function DailyPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { daily, solvePuzzle, addMistake, completeDailyCase, setLastResult } = useGameStore();

  const todayCase = getTodaysCase();
  const { seconds, start } = useTimer({ autoStart: false });

  const [activeIdx, setActiveIdx] = useState(0);
  const [solvedOverlay, setSolvedOverlay] = useState(false);

  useEffect(() => {
    if (!user)         { router.replace('/auth');   return; }
    if (!daily)        { router.replace('/home');   return; }
    if (daily.completedAt) { router.replace('/result'); return; }
    const idx = daily.puzzles.findIndex(p => p.status === 'active');
    if (idx >= 0) setActiveIdx(idx);
    start();
  }, [user, daily, router, start]);

  if (!user || !daily || daily.completedAt) return null;

  const currentType   = PUZZLE_TYPES[activeIdx];
  const statuses      = daily.puzzles.map(p => p.status as PuzzleStatus);

  const handleSolve = () => {
    solvePuzzle(activeIdx);
    setSolvedOverlay(true);
    const isLast = activeIdx === PUZZLE_TYPES.length - 1;

    if (isLast) {
      const breakdown = calculateDailyScore(seconds, daily.totalMistakes);
      completeDailyCase(breakdown.total);
      setLastResult({
        mode: 'daily',
        caseId: todayCase.id,
        caseTitle: todayCase.title,
        score: breakdown.total,
        timeSeconds: seconds,
        mistakes: daily.totalMistakes,
        perfect: daily.totalMistakes === 0,
        puzzleResults: PUZZLE_TYPES.map((t, i) => ({
          type: t, solved: true,
          mistakes: daily.puzzles[i]?.mistakes ?? 0, timeSeconds: 0,
        })),
        streak: useGameStore.getState().streak,
      });
      setTimeout(() => router.push('/result'), 1200);
    } else {
      setTimeout(() => {
        setSolvedOverlay(false);
        setActiveIdx(activeIdx + 1);
      }, 900);
    }
  };

  const renderPuzzle = () => {
    const p = todayCase.puzzles;
    const props = { onSolve: handleSolve, onMistake: () => addMistake(activeIdx) };
    switch (currentType) {
      case 'linkGrid':  return <LinkGrid  puzzle={p.linkGrid}  {...props} />;
      case 'timeTrace': return <TimeTrace puzzle={p.timeTrace} {...props} />;
      case 'trueLie':   return <TrueLie   puzzle={p.trueLie}   {...props} />;
      case 'codeBreak': return <CodeBreak puzzle={p.codeBreak} {...props} />;
    }
  };

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
      {/* Solved overlay */}
      <AnimatePresence>
        {solvedOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(20,20,20,0.88)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' as const, stiffness: 320, damping: 22 }}
              className="flex flex-col items-center gap-4"
            >
              <div
                className="w-24 h-24 rounded-3xl flex items-center justify-center"
                style={{ background: '#C8FF57', boxShadow: '0 0 60px rgba(200,255,87,0.35)' }}
              >
                <span className="text-5xl font-black text-[#141414]">✓</span>
              </div>
              <p className="font-black text-xl text-white">Solved!</p>
              {activeIdx < PUZZLE_TYPES.length - 1 && (
                <p className="text-[#888] text-sm">Next: {PUZZLE_LABELS[activeIdx + 1]}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle content */}
      <AnimatePresence mode="wait">
        <motion.div key={currentType}
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -32 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          <div className="px-4 pt-5 pb-2">
            <h2 className="text-xl font-black text-white">{PUZZLE_LABELS[activeIdx]}</h2>
            <p className="text-sm text-[#555] mt-0.5">{PUZZLE_DESCS[activeIdx]}</p>
          </div>
          {renderPuzzle()}
        </motion.div>
      </AnimatePresence>
    </PuzzleLayout>
  );
}
