'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { PUZZLE_META, getAllPuzzlesOfType } from '@/lib/data/cases';
import { useTimer } from '@/lib/hooks/useTimer';
import { calculateTimeAttackScore } from '@/lib/utils/scoring';
import { Timer } from '@/components/ui/Timer';
import { Button } from '@/components/ui/Button';
import { LinkGrid } from '@/components/puzzles/LinkGrid';
import { TimeTrace } from '@/components/puzzles/TimeTrace';
import { TrueLie } from '@/components/puzzles/TrueLie';
import { CodeBreak } from '@/components/puzzles/CodeBreak';
import type { PuzzleType } from '@/types';

const TIME_LIMIT = 60;
const COUNTDOWN = 3;

type Phase = 'countdown' | 'playing' | 'done';

export default function TimeAttackPage() {
  const router = useRouter();
  const params = useParams();
  const { user } = useAuthStore();
  const { startTimeAttack, incrementSolved, addTimeAttackMistake, endTimeAttack, setLastResult, timeAttack } = useGameStore();
  const type = params?.type as PuzzleType;

  const [phase, setPhase] = useState<Phase>('countdown');
  const [countdownVal, setCountdownVal] = useState(COUNTDOWN);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);
  const [key, setKey] = useState(0); // force remount puzzle

  const allPuzzles = useRef(getAllPuzzlesOfType(type as 'linkGrid' | 'timeTrace' | 'trueLie' | 'codeBreak'));

  const { seconds: timeLeft, start: startTimer, stop: stopTimer } = useTimer({
    initialSeconds: TIME_LIMIT,
    countDown: true,
    onComplete: handleTimeUp,
  });

  function handleTimeUp() {
    setPhase('done');
    const breakdown = calculateTimeAttackScore(solvedCount, TIME_LIMIT - timeLeft, mistakeCount);
    endTimeAttack(breakdown.total);
    setLastResult({
      mode: 'timeAttack',
      puzzleType: type,
      score: breakdown.total,
      timeSeconds: TIME_LIMIT,
      mistakes: mistakeCount,
      perfect: mistakeCount === 0,
      timeAttackSolved: solvedCount,
      streak: useGameStore.getState().streak,
    });
  }

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    if (!type || !PUZZLE_META[type]) { router.replace('/modes'); return; }
    startTimeAttack(type);

    // Countdown
    let c = COUNTDOWN;
    const iv = setInterval(() => {
      c -= 1;
      setCountdownVal(c);
      if (c <= 0) {
        clearInterval(iv);
        setPhase('playing');
        startTimer();
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [user, type, router, startTimeAttack, startTimer]);

  const handleSolve = useCallback(() => {
    incrementSolved();
    setSolvedCount((p) => p + 1);
    // Next puzzle
    setPuzzleIdx((p) => (p + 1) % (allPuzzles.current?.length ?? 1));
    setKey((k) => k + 1);
  }, [incrementSolved]);

  const handleMistake = useCallback(() => {
    addTimeAttackMistake();
    setMistakeCount((p) => p + 1);
  }, [addTimeAttackMistake]);

  if (!user || !type) return null;

  const meta = PUZZLE_META[type];
  const puzzles = allPuzzles.current ?? [];
  const currentPuzzle = puzzles[puzzleIdx % puzzles.length];

  const renderPuzzle = () => {
    if (!currentPuzzle) return null;
    switch (type) {
      case 'linkGrid':
        return <LinkGrid key={key} puzzle={currentPuzzle as any} onSolve={handleSolve} onMistake={handleMistake} />;
      case 'timeTrace':
        return <TimeTrace key={key} puzzle={currentPuzzle as any} onSolve={handleSolve} onMistake={handleMistake} />;
      case 'trueLie':
        return <TrueLie key={key} puzzle={currentPuzzle as any} onSolve={handleSolve} onMistake={handleMistake} />;
      case 'codeBreak':
        return <CodeBreak key={key} puzzle={currentPuzzle as any} onSolve={handleSolve} onMistake={handleMistake} />;
    }
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-safe pt-4 pb-3 border-b border-[#2A2A2A]">
        <div>
          <p className="text-[10px] text-[#9A9A9A] uppercase tracking-widest font-medium">Time Attack</p>
          <p className="text-sm font-semibold text-[#EAEAEA]">{meta.label}</p>
        </div>
        <div className="flex items-center gap-3">
          {mistakeCount > 0 && (
            <span className="text-xs text-[#F87171] font-medium">×{mistakeCount}</span>
          )}
          <div className="text-sm font-semibold text-[#4ADE80] bg-[#4ADE80]/10 px-2.5 py-1 rounded-lg border border-[#4ADE80]/20">
            {solvedCount} solved
          </div>
          {phase === 'playing' && (
            <Timer seconds={timeLeft} countDown totalSeconds={TIME_LIMIT} />
          )}
        </div>
      </header>

      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#0D0D0D] flex flex-col items-center justify-center gap-4"
          >
            <p className="text-[#9A9A9A] text-sm uppercase tracking-widest">Get ready</p>
            <motion.span
              key={countdownVal}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-8xl font-bold text-[#EAEAEA]"
            >
              {countdownVal > 0 ? countdownVal : 'Go!'}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done overlay */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-50 bg-[#0D0D0D] flex flex-col items-center justify-center gap-6 px-6"
          >
            <p className="text-5xl">⏱</p>
            <div className="text-center">
              <p className="text-[#9A9A9A] text-sm mb-1">Time&apos;s up!</p>
              <p className="text-4xl font-bold text-[#4ADE80]">{solvedCount}</p>
              <p className="text-[#9A9A9A] text-sm mt-1">puzzles solved</p>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => router.push(`/modes/${type}`)}>
                Play Again
              </Button>
              <Button onClick={() => router.push('/result')}>
                See Score
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle */}
      {phase === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-auto"
          >
            <div className="px-4 pt-4 pb-2">
              <h2 className="text-base font-bold text-[#EAEAEA]">
                Puzzle {puzzleIdx + 1}
              </h2>
            </div>
            {renderPuzzle()}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
