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
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: 'rgba(12,12,15,0.93)', backdropFilter: 'blur(12px)' }}
          >
            {/* Animated rings */}
            <div className="relative flex items-center justify-center">
              {[1,2,3].map(i => (
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
              {activeIdx < PUZZLE_TYPES.length - 1 && (
                <p className="text-sm mt-2" style={{ color: '#A0A0B0' }}>Next: {PUZZLE_LABELS[activeIdx + 1]}</p>
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
          {renderPuzzle()}
        </motion.div>
      </AnimatePresence>
    </PuzzleLayout>
  );
}
