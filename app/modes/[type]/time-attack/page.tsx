'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { PUZZLE_META, getAllPuzzlesOfType } from '@/lib/data/cases';
import { useTimer } from '@/lib/hooks/useTimer';
import { calculateTimeAttackScore } from '@/lib/utils/scoring';
import { PuzzleLayout } from '@/components/layout/PuzzleLayout';
import { LinkGrid } from '@/components/puzzles/LinkGrid';
import { TimeTrace } from '@/components/puzzles/TimeTrace';
import { TrueLie } from '@/components/puzzles/TrueLie';
import { CodeBreak } from '@/components/puzzles/CodeBreak';
import type { PuzzleType } from '@/types';

const TIME_LIMIT = 60;

type Phase = 'countdown' | 'playing' | 'done';

export default function TimeAttackPage() {
  const router  = useRouter();
  const params  = useParams();
  const { user } = useAuthStore();
  const { startTimeAttack, incrementSolved, addTimeAttackMistake, endTimeAttack, setLastResult } = useGameStore();
  const type = params?.type as PuzzleType;

  const [phase, setPhase]         = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [solved, setSolved]       = useState(0);
  const [mistakes, setMistakes]   = useState(0);
  const [key, setKey]             = useState(0);

  const puzzles = useRef(getAllPuzzlesOfType(type as 'linkGrid' | 'timeTrace' | 'trueLie' | 'codeBreak'));

  const { seconds: timeLeft, start: startTimer } = useTimer({
    initialSeconds: TIME_LIMIT,
    countDown: true,
    onComplete: () => handleTimeUp(solved, mistakes),
  });

  function handleTimeUp(s: number, m: number) {
    setPhase('done');
    const breakdown = calculateTimeAttackScore(s, TIME_LIMIT, m);
    endTimeAttack(breakdown.total);
    setLastResult({
      mode: 'timeAttack',
      puzzleType: type,
      score: breakdown.total,
      timeSeconds: TIME_LIMIT,
      mistakes: m,
      perfect: m === 0,
      timeAttackSolved: s,
      streak: useGameStore.getState().streak,
    });
  }

  useEffect(() => {
    if (!user || !type || !PUZZLE_META[type]) { router.replace('/modes'); return; }
    startTimeAttack(type);
    let c = 3;
    const iv = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(iv); setPhase('playing'); startTimer(); }
    }, 1000);
    return () => clearInterval(iv);
  }, [user, type, router, startTimeAttack, startTimer]);

  const handleSolve = useCallback(() => {
    incrementSolved();
    setSolved(p => { const n = p + 1; return n; });
    setPuzzleIdx(p => (p + 1) % (puzzles.current?.length ?? 1));
    setKey(k => k + 1);
  }, [incrementSolved]);

  const handleMistake = useCallback(() => {
    addTimeAttackMistake();
    setMistakes(p => p + 1);
  }, [addTimeAttackMistake]);

  if (!user || !type || !PUZZLE_META[type]) return null;

  const meta    = PUZZLE_META[type];
  const all     = puzzles.current ?? [];
  const current = all[puzzleIdx % all.length];

  const renderPuzzle = () => {
    if (!current) return null;
    const props = { key, onSolve: handleSolve, onMistake: handleMistake };
    switch (type) {
      case 'linkGrid':  return <LinkGrid  puzzle={current as any} {...props} />;
      case 'timeTrace': return <TimeTrace puzzle={current as any} {...props} />;
      case 'trueLie':   return <TrueLie   puzzle={current as any} {...props} />;
      case 'codeBreak': return <CodeBreak puzzle={current as any} {...props} />;
    }
  };

  return (
    <PuzzleLayout
      title={`${meta.label} — Time Attack`}
      puzzleType={type}
      timeAttack
      timeLeft={timeLeft}
      solvedCount={solved}
      mistakes={mistakes}
      onBack={() => router.push(`/modes/${type}`)}
    >
      {/* Countdown */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center gap-6">
            <p className="text-[#555] text-sm font-semibold uppercase tracking-[0.2em]">Get Ready</p>
            <motion.span
              key={countdown}
              initial={{ scale: 1.8, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 18 }}
              className="text-9xl font-black text-[#F0F0F0]"
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.span>
            <div className="flex items-center gap-2 text-[#555] text-sm">
              <span>⏱</span><span>60 seconds</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Done screen */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 z-50 bg-[#0A0A0A] flex flex-col items-center justify-center gap-8 px-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' as const, stiffness: 250, damping: 18, delay: 0.15 }}
              className="text-7xl"
            >⏱</motion.div>

            <div className="text-center">
              <p className="text-[#555] text-sm mb-3 uppercase tracking-widest">Time&apos;s Up!</p>
              <div className="text-7xl font-black text-[#4ADE80]">{solved}</div>
              <p className="text-[#888] text-base mt-2">
                puzzle{solved !== 1 ? 's' : ''} solved
              </p>
              {mistakes > 0 && (
                <p className="text-[#F87171] text-sm mt-1">{mistakes} mistake{mistakes !== 1 ? 's' : ''}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 w-full">
              <motion.div whileTap={{ scale: 0.97 }}>
                <button
                  onClick={() => router.push('/result')}
                  className="w-full py-4 rounded-2xl bg-[#4ADE80] text-[#0A0A0A] font-black text-base shadow-[0_0_28px_rgba(74,222,128,0.25)] hover:bg-[#22c55e] transition-all"
                >
                  See Full Score →
                </button>
              </motion.div>
              <button
                onClick={() => { setPhase('countdown'); setCountdown(3); setSolved(0); setMistakes(0); setKey(0); setPuzzleIdx(0); }}
                className="w-full py-3.5 rounded-2xl border border-[#242424] text-[#888] hover:text-[#F0F0F0] hover:border-[#333] transition-all font-semibold"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Puzzle */}
      {phase === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div key={key}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-auto"
          >
            <div className="px-4 pt-5 pb-2">
              <h2 className="text-xl font-black text-[#F0F0F0]">Puzzle {puzzleIdx + 1}</h2>
              <p className="text-xs text-[#555] mt-0.5">Solve it fast!</p>
            </div>
            {renderPuzzle()}
          </motion.div>
        </AnimatePresence>
      )}
    </PuzzleLayout>
  );
}
