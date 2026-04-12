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

  const [activePuzzleIdx, setActivePuzzleIdx] = useState(0);
  const [justSolved, setJustSolved] = useState(false);

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    if (!daily) { router.replace('/home'); return; }
    if (daily.completedAt) { router.replace('/result'); return; }
    // Find first non-solved puzzle
    const activeIdx = daily.puzzles.findIndex((p) => p.status === 'active');
    if (activeIdx >= 0) setActivePuzzleIdx(activeIdx);
    start();
  }, [user, daily, router, start]);

  if (!user || !daily) return null;
  if (daily.completedAt) return null;

  const currentPuzzleType = PUZZLE_TYPES[activePuzzleIdx];
  const puzzleStatuses = daily.puzzles.map((p) => p.status as PuzzleStatus);

  const handleSolve = () => {
    solvePuzzle(activePuzzleIdx);
    setJustSolved(true);

    const isLast = activePuzzleIdx === PUZZLE_TYPES.length - 1;
    if (isLast) {
      // Case complete
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
          type: t,
          solved: true,
          mistakes: daily.puzzles[i]?.mistakes ?? 0,
          timeSeconds: 0,
        })),
        streak: useGameStore.getState().streak,
      });

      setTimeout(() => router.push('/result'), 600);
    } else {
      setTimeout(() => {
        setJustSolved(false);
        setActivePuzzleIdx(activePuzzleIdx + 1);
      }, 700);
    }
  };

  const handleMistake = () => {
    addMistake(activePuzzleIdx);
  };

  const renderPuzzle = () => {
    const puzzle = todayCase.puzzles;
    switch (currentPuzzleType) {
      case 'linkGrid':
        return <LinkGrid puzzle={puzzle.linkGrid} onSolve={handleSolve} onMistake={handleMistake} />;
      case 'timeTrace':
        return <TimeTrace puzzle={puzzle.timeTrace} onSolve={handleSolve} onMistake={handleMistake} />;
      case 'trueLie':
        return <TrueLie puzzle={puzzle.trueLie} onSolve={handleSolve} onMistake={handleMistake} />;
      case 'codeBreak':
        return <CodeBreak puzzle={puzzle.codeBreak} onSolve={handleSolve} onMistake={handleMistake} />;
    }
  };

  return (
    <PuzzleLayout
      title={todayCase.title}
      puzzleType={currentPuzzleType}
      puzzleIndex={activePuzzleIdx}
      totalPuzzles={4}
      puzzleStatuses={puzzleStatuses}
      elapsedSeconds={seconds}
      mistakes={daily.totalMistakes}
      onBack={() => router.push('/home')}
      subtitle={`Case #${todayCase.id} · ${todayCase.difficulty}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPuzzleType}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col"
        >
          {/* Puzzle heading */}
          <div className="px-4 pt-4 pb-2">
            <h2 className="text-lg font-bold text-[#EAEAEA]">
              {PUZZLE_LABELS[activePuzzleIdx]}
            </h2>
            <p className="text-xs text-[#9A9A9A] mt-0.5">
              Puzzle {activePuzzleIdx + 1} of 4
            </p>
          </div>

          {/* Solved overlay */}
          {justSolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-4 mb-4 p-4 rounded-2xl bg-[#4ADE80]/10 border border-[#4ADE80]/30 text-center"
            >
              <p className="text-[#4ADE80] font-semibold text-sm">Solved! Moving on…</p>
            </motion.div>
          )}

          {renderPuzzle()}
        </motion.div>
      </AnimatePresence>
    </PuzzleLayout>
  );
}
