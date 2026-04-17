'use client';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { getDailyAbstractPuzzles } from '@/lib/data/abstractHelpers';
import { useTimer } from '@/lib/hooks/useTimer';
import { AbstractLayout } from '@/components/layout/AbstractLayout';
import { RuleShift } from '@/components/puzzles/abstract/RuleShift';
import { SwapLogic } from '@/components/puzzles/abstract/SwapLogic';
import { BinaryDecision } from '@/components/puzzles/abstract/BinaryDecision';
import { SetLogic } from '@/components/puzzles/abstract/SetLogic';
import { ABSTRACT_PUZZLE_TYPES, ABSTRACT_TYPE_META } from '@/types/abstract';
import type { AbstractPuzzle, AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';

type Phase = 'countdown' | 'playing' | 'done';

export default function AbstractDailyPage() {
  return (
    <Suspense>
      <AbstractDailyInner />
    </Suspense>
  );
}

function AbstractDailyInner() {
  const searchParams = useSearchParams();
  const { user }     = useAuthStore();
  const router       = useRouter();
  const difficulty   = (searchParams?.get('d') ?? 'medium') as AbstractDifficulty;

  if (!user) { router.replace('/auth'); return null; }

  return <DailyGame difficulty={difficulty} />;
}

function DailyGame({ difficulty }: { difficulty: AbstractDifficulty }) {
  const router = useRouter();

  const puzzles = useRef<AbstractPuzzle[]>(getDailyAbstractPuzzles(difficulty));

  const [phase,       setPhase]       = useState<Phase>('countdown');
  const [countdown,   setCountdown]   = useState(3);
  const [puzzleIdx,   setPuzzleIdx]   = useState(0);
  const [mistakes,    setMistakes]    = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);

  // per-type status for progress bar
  const [typeStatuses, setTypeStatuses] = useState<Partial<Record<AbstractPuzzleType, 'solved' | 'active' | 'locked'>>>({
    ruleShift: 'active',
  });

  const solvedRef   = useRef(0);
  const mistakesRef = useRef(0);
  solvedRef.current   = solvedCount;
  mistakesRef.current = mistakes;

  const { seconds: elapsed, start: startTimer } = useTimer({ initialSeconds: 0, countDown: false });

  const currentPuzzle = puzzles.current[puzzleIdx];
  const currentType   = currentPuzzle?.type ?? ABSTRACT_PUZZLE_TYPES[puzzleIdx];

  const handleSolve = useCallback(() => {
    const nextIdx = puzzleIdx + 1;
    setSolvedCount(s => s + 1);

    setTypeStatuses(prev => {
      const updated: Partial<Record<AbstractPuzzleType, 'solved' | 'active' | 'locked'>> = { ...prev };
      updated[currentType] = 'solved';
      if (nextIdx < puzzles.current.length) {
        updated[puzzles.current[nextIdx].type] = 'active';
      }
      return updated;
    });

    if (nextIdx >= puzzles.current.length) {
      setPhase('done');
    } else {
      setPuzzleIdx(nextIdx);
    }
  }, [puzzleIdx, currentType]);

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

  function renderPuzzle() {
    if (!currentPuzzle) return null;
    const props = { puzzle: currentPuzzle, onSolve: handleSolve, onMistake: handleMistake };
    switch (currentPuzzle.type) {
      case 'ruleShift':      return <RuleShift      {...props} />;
      case 'swapLogic':      return <SwapLogic      {...props} />;
      case 'binaryDecision': return <BinaryDecision {...props} />;
      case 'setLogic':       return <SetLogic       {...props} />;
    }
  }

  return (
    <AbstractLayout
      puzzleType={currentType}
      difficulty={difficulty}
      typeStatuses={typeStatuses}
      elapsedSeconds={elapsed}
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
                color: countdown > 1 ? '#60A5FA' : countdown === 1 ? '#FBBF24' : '#B5F23D',
              }}
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.div>
            <p className="text-sm font-semibold" style={{ color: '#5A5A6E' }}>4 abstract puzzles · {difficulty}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Done overlay ───────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === 'done' && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-8 px-8"
            style={{ background: '#0C0C0F' }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
              className="text-center"
            >
              <p className="font-game mb-2" style={{ fontSize: '18px', letterSpacing: '0.35em', color: '#5A5A6E' }}>COMPLETE</p>
              <div className="flex justify-center gap-3 mb-4">
                {ABSTRACT_PUZZLE_TYPES.map(t => (
                  <div
                    key={t}
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: typeStatuses[t] === 'solved' ? ABSTRACT_TYPE_META[t].color : '#2A2A34',
                    }}
                  />
                ))}
              </div>
              <p className="font-game leading-none" style={{ fontSize: 'clamp(80px, 15vw, 120px)', color: '#B5F23D' }}>
                {solvedCount}
              </p>
              <p className="font-game mt-1" style={{ fontSize: '20px', letterSpacing: '0.1em', color: '#3A3A4A' }}>
                {solvedCount === 1 ? 'SOLVED' : 'PUZZLES SOLVED'}
              </p>
              {mistakes > 0 && (
                <p className="text-[#EF4444] text-sm mt-2 font-semibold">
                  {mistakes} mistake{mistakes !== 1 ? 's' : ''}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col gap-3 w-full max-w-xs"
            >
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/abstract')}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide"
                style={{ background: '#B5F23D', color: '#0C0C0F' }}
              >
                BACK TO HUB →
              </motion.button>
              <button
                onClick={() => router.push('/home')}
                className="w-full py-4 rounded-2xl font-black text-sm transition-all"
                style={{ background: '#141418', color: '#A0A0B0', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                HOME
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Puzzle area ────────────────────────────────────────────── */}
      {phase === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={puzzleIdx}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-1 overflow-auto"
          >
            <div className="pt-4 pb-2 flex items-center justify-between">
              <p className="text-xs uppercase tracking-widest font-bold" style={{ color: '#5A5A6E' }}>
                Puzzle {puzzleIdx + 1} of {puzzles.current.length}
              </p>
              {solvedCount > 0 && (
                <motion.p
                  key={solvedCount}
                  initial={{ scale: 1.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-game text-[#B5F23D] text-lg"
                >
                  {solvedCount} ✓
                </motion.p>
              )}
            </div>
            {renderPuzzle()}
          </motion.div>
        </AnimatePresence>
      )}
    </AbstractLayout>
  );
}
