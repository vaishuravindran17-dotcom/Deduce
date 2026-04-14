'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
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

type Phase = 'countdown' | 'playing' | 'done';

/** Thin wrapper — incrementing gameKey forces full remount, fixing Play Again */
export default function TimeAttackPage() {
  const params       = useParams();
  const searchParams = useSearchParams();
  const { user }     = useAuthStore();
  const router       = useRouter();
  const type         = params?.type as PuzzleType;
  const timeLimit    = parseInt(searchParams?.get('t') ?? '60', 10);

  const [gameKey, setGameKey] = useState(0);

  if (!user || !type || !PUZZLE_META[type]) return null;

  return (
    <TimeAttackGame
      key={gameKey}
      type={type}
      timeLimit={timeLimit}
      onRestart={() => setGameKey(k => k + 1)}
    />
  );
}

function TimeAttackGame({ type, timeLimit, onRestart }: { type: PuzzleType; timeLimit: number; onRestart: () => void }) {
  const router  = useRouter();
  const { user } = useAuthStore();
  const { startTimeAttack, incrementSolved, addTimeAttackMistake, endTimeAttack, setLastResult } = useGameStore();

  const TIME_LIMIT = timeLimit;

  const [phase, setPhase]         = useState<Phase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [solved, setSolved]       = useState(0);
  const [mistakes, setMistakes]   = useState(0);
  const [key, setKey]             = useState(0);

  const puzzles = useRef(getAllPuzzlesOfType(type as 'linkGrid' | 'timeTrace' | 'trueLie' | 'codeBreak'));

  // solvedRef / mistakesRef so the onComplete closure always sees current values
  const solvedRef   = useRef(0);
  const mistakesRef = useRef(0);
  solvedRef.current   = solved;
  mistakesRef.current = mistakes;

  const { seconds: timeLeft, start: startTimer } = useTimer({
    initialSeconds: TIME_LIMIT,
    countDown: true,
    onComplete: () => handleTimeUp(solvedRef.current, mistakesRef.current),
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty — this component is remounted fresh on restart

  const handleSolve = useCallback(() => {
    incrementSolved();
    setSolved(p => p + 1);
    setPuzzleIdx(p => (p + 1) % (puzzles.current?.length ?? 1));
    setKey(k => k + 1);
  }, [incrementSolved]);

  const handleMistake = useCallback(() => {
    addTimeAttackMistake();
    setMistakes(p => p + 1);
  }, [addTimeAttackMistake]);

  const meta    = PUZZLE_META[type];
  const all     = puzzles.current ?? [];
  const current = all[puzzleIdx % all.length];
  const isLow   = timeLeft <= 10;

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
      puzzleIndex={puzzleIdx}
      timeAttack
      timeLeft={timeLeft}
      solvedCount={solved}
      mistakes={mistakes}
      onBack={() => router.push(`/modes/${type}`)}
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
              transition={{ type: 'spring' as const, stiffness: 260, damping: 18 }}
              className="font-game leading-none"
              style={{
                fontSize: 'clamp(100px, 20vw, 160px)',
                color: countdown > 1 ? '#2DD4BF' : countdown === 1 ? '#FB923C' : '#B5F23D',
              }}
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.div>
            <p className="text-sm font-semibold" style={{ color: '#5A5A6E' }}>
              Solve as many as you can in {TIME_LIMIT >= 60 ? `${TIME_LIMIT / 60} minute${TIME_LIMIT > 60 ? 's' : ''}` : `${TIME_LIMIT} seconds`}
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
            {/* Time's up label */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring' as const, stiffness: 260, damping: 18, delay: 0.1 }}
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
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex flex-col gap-3 w-full max-w-xs"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/result')}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide"
                style={{ background: '#B5F23D', color: '#0C0C0F' }}
              >
                SEE FULL SCORE →
              </motion.button>
              <button
                onClick={onRestart}
                className="w-full py-4 rounded-2xl font-black text-sm transition-all"
                style={{ background: '#141418', color: '#A0A0B0', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                PLAY AGAIN
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Puzzle area ────────────────────────────────────────────── */}
      {phase === 'playing' && (
        <AnimatePresence mode="wait">
          <motion.div
            key={key}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex-1 overflow-auto"
          >
            <div className="px-5 pt-6 pb-2 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-bold mb-1" style={{ color: '#5A5A6E' }}>Puzzle {puzzleIdx + 1}</p>
                {isLow && (
                  <motion.p
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="text-xs font-bold text-[#EF4444]"
                  >
                    ⚡ Last seconds!
                  </motion.p>
                )}
              </div>
              {solved > 0 && (
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
    </PuzzleLayout>
  );
}
