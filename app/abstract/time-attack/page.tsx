'use client';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { getAbstractPool } from '@/lib/data/abstractHelpers';
import { useTimer } from '@/lib/hooks/useTimer';
import { calculateTimeAttackScore } from '@/lib/utils/scoring';
import { AbstractLayout } from '@/components/layout/AbstractLayout';
import { RuleShift } from '@/components/puzzles/abstract/RuleShift';
import { SwapLogic } from '@/components/puzzles/abstract/SwapLogic';
import { BinaryDecision } from '@/components/puzzles/abstract/BinaryDecision';
import { SetLogic } from '@/components/puzzles/abstract/SetLogic';
import type { AbstractPuzzle, AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';
import { ABSTRACT_TYPE_META } from '@/types/abstract';

type Phase = 'countdown' | 'playing' | 'done';

export default function AbstractTimeAttackPage() {
  return (
    <Suspense>
      <AbstractTimeAttackInner />
    </Suspense>
  );
}

function AbstractTimeAttackInner() {
  const searchParams = useSearchParams();
  const { user }     = useAuthStore();
  const router       = useRouter();

  const type       = (searchParams?.get('type') ?? 'ruleShift') as AbstractPuzzleType;
  const difficulty = (searchParams?.get('d')    ?? 'medium')    as AbstractDifficulty;
  const timeLimit  = parseInt(searchParams?.get('t') ?? '180', 10);

  const [gameKey, setGameKey] = useState(0);

  if (!user) { router.replace('/auth'); return null; }

  return (
    <TimeAttackGame
      key={gameKey}
      type={type}
      difficulty={difficulty}
      timeLimit={timeLimit}
      onRestart={() => setGameKey(k => k + 1)}
    />
  );
}

interface GameProps {
  type: AbstractPuzzleType;
  difficulty: AbstractDifficulty;
  timeLimit: number;
  onRestart: () => void;
}

function TimeAttackGame({ type, difficulty, timeLimit, onRestart }: GameProps) {
  const router = useRouter();
  const meta   = ABSTRACT_TYPE_META[type];

  const [phase,     setPhase]     = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [solved,    setSolved]    = useState(0);
  const [mistakes,  setMistakes]  = useState(0);
  const [slideKey,  setSlideKey]  = useState(0);

  const puzzles     = useRef<AbstractPuzzle[]>(getAbstractPool(type, difficulty));
  const solvedRef   = useRef(0);
  const mistakesRef = useRef(0);
  solvedRef.current   = solved;
  mistakesRef.current = mistakes;

  const isLow = (timeLeft: number) => timeLeft <= 10;

  const handleTimeUp = useCallback((s: number, m: number) => {
    setPhase('done');
    calculateTimeAttackScore(s, timeLimit, m); // side-effect-free; score shown inline
  }, [timeLimit]);

  const { seconds: timeLeft, start: startTimer } = useTimer({
    initialSeconds: timeLimit,
    countDown: true,
    onComplete: () => handleTimeUp(solvedRef.current, mistakesRef.current),
  });

  const handleSolve = useCallback(() => {
    setSolved(s => s + 1);
    setPuzzleIdx(i => {
      const next = i + 1;
      // loop back if we exhaust the pool
      if (next >= puzzles.current.length) {
        puzzles.current = getAbstractPool(type, difficulty);
        return 0;
      }
      return next;
    });
    setSlideKey(k => k + 1);
  }, [type, difficulty]);

  const handleMistake = useCallback(() => {
    setMistakes(m => m + 1);
  }, []);

  useEffect(() => {
    let c = 3;
    const iv = setInterval(() => {
      c -= 1;
      setCountdown(c);
      if (c <= 0) { clearInterval(iv); setPhase('playing'); startTimer(); }
    }, 1000);
    return () => clearInterval(iv);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPuzzle = puzzles.current[puzzleIdx];
  const score = calculateTimeAttackScore(solved, timeLimit, mistakes);

  function renderPuzzle() {
    if (!currentPuzzle) return null;
    const props = { puzzle: currentPuzzle, onSolve: handleSolve, onMistake: handleMistake };
    switch (type) {
      case 'ruleShift':      return <RuleShift      {...props} />;
      case 'swapLogic':      return <SwapLogic      {...props} />;
      case 'binaryDecision': return <BinaryDecision {...props} />;
      case 'setLogic':       return <SetLogic       {...props} />;
    }
  }

  return (
    <AbstractLayout
      puzzleType={type}
      difficulty={difficulty}
      timeAttack
      timeLeft={timeLeft}
      solvedCount={solved}
      mistakes={mistakes}
      onBack={() => router.push('/abstract')}
    >
      {/* ── Countdown overlay ──────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4"
            style={{ background: '#0C0C0F' }}
          >
            <p className="font-game text-xl tracking-[0.4em]" style={{ color: '#5A5A6E' }}>STARTING IN</p>
            <motion.div
              key={countdown}
              initial={{ scale: 2, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="font-game leading-none"
              style={{
                fontSize: 'clamp(100px, 20vw, 160px)',
                color: countdown > 1 ? meta.color : countdown === 1 ? '#FB923C' : '#B5F23D',
              }}
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.div>
            <p className="text-sm font-semibold" style={{ color: '#5A5A6E' }}>
              Solve as many {meta.label} puzzles as you can in{' '}
              {timeLimit >= 60 ? `${timeLimit / 60} min` : `${timeLimit}s`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Done overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 px-8"
            style={{ background: '#0C0C0F' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="text-center"
            >
              <p className="font-game mb-2" style={{ fontSize: '18px', letterSpacing: '0.35em', color: '#5A5A6E' }}>
                TIME&apos;S UP
              </p>
              <p className="font-game leading-none" style={{ fontSize: 'clamp(80px, 15vw, 120px)', color: '#B5F23D' }}>
                {solved}
              </p>
              <p className="font-game mt-1" style={{ fontSize: '24px', letterSpacing: '0.1em', color: '#3A3A4A' }}>
                {solved === 1 ? 'PUZZLE SOLVED' : 'PUZZLES SOLVED'}
              </p>
              {mistakes > 0 && (
                <p className="text-[#EF4444] text-sm mt-2 font-semibold">
                  {mistakes} mistake{mistakes !== 1 ? 's' : ''}
                </p>
              )}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 rounded-xl px-6 py-3 inline-block"
                style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <p className="font-game" style={{ fontSize: 28, color: '#B5F23D', letterSpacing: '0.05em' }}>
                  {score.total.toLocaleString()}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest mt-1" style={{ color: '#5A5A6E' }}>Score</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col gap-3 w-full max-w-xs"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onRestart}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide"
                style={{ background: '#B5F23D', color: '#0C0C0F' }}
              >
                PLAY AGAIN
              </motion.button>
              <button
                onClick={() => router.push('/abstract')}
                className="w-full py-4 rounded-2xl font-black text-sm transition-all"
                style={{ background: '#141418', color: '#A0A0B0', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                BACK TO HUB
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Puzzle area ────────────────────────────────────────────── */}
      {phase === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={slideKey}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-1 overflow-auto"
          >
            <div className="pt-4 pb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#5A5A6E' }}>
                Puzzle {puzzleIdx + 1}
              </p>
              {timeLeft <= 10 && (
                <motion.p
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ repeat: Infinity, duration: 0.7 }}
                  className="text-xs font-bold text-[#EF4444]"
                >
                  ⚡ Last seconds!
                </motion.p>
              )}
              {solved > 0 && timeLeft > 10 && (
                <motion.div
                  key={solved}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-game text-[#C8FF57] text-2xl"
                  style={{ letterSpacing: '0.05em' }}
                >
                  {solved} ✓
                </motion.div>
              )}
            </div>
            {renderPuzzle()}
          </motion.div>
        </AnimatePresence>
      )}
    </AbstractLayout>
  );
}
