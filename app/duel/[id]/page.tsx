'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { ABSTRACT_TYPE_META } from '@/types/abstract';
import { getDuelAbstractPool } from '@/lib/data/abstractHelpers';
import { RuleShift }      from '@/components/puzzles/abstract/RuleShift';
import { SwapLogic }      from '@/components/puzzles/abstract/SwapLogic';
import { BinaryDecision } from '@/components/puzzles/abstract/BinaryDecision';
import { SetLogic }       from '@/components/puzzles/abstract/SetLogic';
import type { Duel, DuelPlayer } from '@/types/duel';
import type { AbstractPuzzle } from '@/types/abstract';

type Phase = 'loading' | 'waiting' | 'countdown' | 'playing' | 'results';

function PuzzleView({ puzzle, onSolve, onMistake }: {
  puzzle: AbstractPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}) {
  switch (puzzle.type) {
    case 'ruleShift':      return <RuleShift      puzzle={puzzle} onSolve={onSolve} onMistake={onMistake} />;
    case 'swapLogic':      return <SwapLogic      puzzle={puzzle} onSolve={onSolve} onMistake={onMistake} />;
    case 'binaryDecision': return <BinaryDecision puzzle={puzzle} onSolve={onSolve} onMistake={onMistake} />;
    case 'setLogic':       return <SetLogic       puzzle={puzzle} onSolve={onSolve} onMistake={onMistake} />;
    default: return null;
  }
}

function Avatar({ player, size = 28 }: { player: DuelPlayer; size?: number }) {
  if (player.photoURL) {
    return (
      <img
        src={player.photoURL} alt=""
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: '#1C1C22', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.5, color: '#A0A0B0', fontWeight: 700,
    }}>
      {(player.displayName || '?').charAt(0).toUpperCase()}
    </div>
  );
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export default function DuelGamePage() {
  const router     = useRouter();
  const params     = useParams();
  const { user }   = useAuthStore();
  const duelId     = params.id as string;

  const [duel,         setDuel]         = useState<Duel | null>(null);
  const [puzzles,      setPuzzles]      = useState<AbstractPuzzle[]>([]);
  const [puzzleIndex,  setPuzzleIndex]  = useState(0);
  const [phase,        setPhase]        = useState<Phase>('loading');
  const [countdown,    setCountdown]    = useState(3);
  const [timeLeft,     setTimeLeft]     = useState(0);
  const [localSolved,  setLocalSolved]  = useState(0);
  const [localScore,   setLocalScore]   = useState(0);

  // Refs hold the "live" values for timer callbacks (avoids stale closures)
  const solvedRef   = useRef(0);
  const mistakesRef = useRef(0);
  const scoreRef    = useRef(0);
  const finishedRef = useRef(false);
  const puzzlesInit = useRef(false);
  const duelRef     = useRef<Duel | null>(null);

  // ── Firestore subscription ────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !duelId) return;
    let unsub: (() => void) | null = null;

    const setup = async () => {
      const { subscribeToDuel } = await import('@/lib/firebase/duel');
      unsub = await subscribeToDuel(duelId, (updated) => {
        setDuel(updated);
        duelRef.current = updated;

        // Init puzzle pool once
        if (!puzzlesInit.current && updated.type) {
          puzzlesInit.current = true;
          const pool = getDuelAbstractPool(updated.type, updated.difficulty, duelId);
          setPuzzles(pool);
        }

        // Phase transitions driven by Firestore state
        if (updated.status === 'waiting') {
          setPhase(p => p === 'loading' ? 'waiting' : p);
        } else if (updated.status === 'starting') {
          const now = Date.now();
          if ((updated.startAt ?? 0) <= now) {
            setPhase(p => (p === 'loading' || p === 'waiting' || p === 'countdown') ? 'playing' : p);
          } else {
            setPhase(p => (p === 'loading' || p === 'waiting') ? 'countdown' : p);
          }
        } else if (updated.status === 'finished') {
          setPhase('results');
        }
      });
    };

    setup();
    return () => { unsub?.(); };
  }, [user, duelId]);

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    const startAt = duelRef.current?.startAt;
    if (!startAt) return;

    const tick = () => {
      const remaining = startAt - Date.now();
      setCountdown(Math.max(0, Math.ceil(remaining / 1000)));
      if (remaining <= 0) setPhase('playing');
    };
    tick();
    const id = setInterval(tick, 120);
    return () => clearInterval(id);
  }, [phase]);

  // ── Game timer ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    const d = duelRef.current;
    if (!d?.startAt) return;

    const endAt = d.startAt + d.duration * 1000;

    const tick = async () => {
      const remaining = endAt - Date.now();
      setTimeLeft(Math.max(0, Math.ceil(remaining / 1000)));

      if (remaining <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        setPhase('results');
        const { finishDuel } = await import('@/lib/firebase/duel');
        finishDuel(duelId, user!.uid, solvedRef.current, mistakesRef.current, scoreRef.current)
          .catch(() => {});
      }
    };

    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [phase, duelId, user]);

  // ── Puzzle callbacks ──────────────────────────────────────────────────────
  const handleSolve = useCallback(() => {
    solvedRef.current += 1;
    scoreRef.current  += 100;
    setLocalSolved(solvedRef.current);
    setLocalScore(scoreRef.current);

    if (!finishedRef.current && user) {
      import('@/lib/firebase/duel').then(({ updateMyProgress }) =>
        updateMyProgress(duelId, user.uid, solvedRef.current, mistakesRef.current, scoreRef.current)
          .catch(() => {})
      );
    }
    // brief pause so the correct answer stays highlighted before advancing
    setTimeout(() => setPuzzleIndex(i => i + 1), 520);
  }, [user, duelId]);

  const handleMistake = useCallback(() => {
    mistakesRef.current += 1;
  }, []);

  if (!user) return null;

  const meta     = duel ? ABSTRACT_TYPE_META[duel.type] : null;
  const color    = meta?.color ?? '#60A5FA';
  const me       = duel?.players[user.uid];
  const oppUid   = duel ? Object.keys(duel.players).find(u => u !== user.uid) : undefined;
  const opp      = oppUid ? duel?.players[oppUid] : null;
  const puzzle   = puzzles.length > 0 ? puzzles[puzzleIndex % puzzles.length] : null;
  const duration = duel?.duration ?? 90;

  const timerPct   = timeLeft / duration;
  const timerColor = timeLeft > 30 ? color : timeLeft > 10 ? '#FBBF24' : '#EF4444';

  const isWinner = duel?.winnerId === user.uid;
  const isTie    = duel?.isTie === true;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20"
        style={{ background: 'rgba(12,12,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="game-container h-14 flex items-center gap-3">
          <button
            onClick={() => router.push('/home')}
            style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0,
              background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)',
              color: '#A0A0B0', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="font-game tracking-widest" style={{ fontSize: 11, color }}>
              {meta?.label.toUpperCase() ?? 'DUEL'} · ONLINE DUEL
            </span>
          </div>

          <div style={{ width: 52, textAlign: 'right' }}>
            {phase === 'playing' && (
              <span className="font-game" style={{ fontSize: 15, color: timerColor }}>
                {fmt(timeLeft)}
              </span>
            )}
          </div>
        </div>

        {/* Timer / accent bar */}
        {phase === 'playing' ? (
          <div style={{ height: 3, background: '#1C1C22' }}>
            <motion.div
              style={{ height: '100%', background: timerColor, transformOrigin: 'left' }}
              animate={{ scaleX: timerPct }}
              transition={{ duration: 0.25, ease: 'linear' }}
            />
          </div>
        ) : (
          <div style={{ height: 3, background: color }} />
        )}
      </header>

      {/* ── Player bar ────────────────────────────────────────────────── */}
      {(phase === 'playing' || phase === 'countdown') && me && (
        <div
          className="game-container"
          style={{
            padding: '10px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', gap: 10,
          }}
        >
          {/* Me */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar player={{ ...me, solved: localSolved, score: localScore }} />
            <div>
              <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 1 }}>You</p>
              <p className="font-game" style={{ fontSize: 16, color, lineHeight: 1 }}>{localScore}</p>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <p style={{ fontSize: 9, color: '#5A5A6E', textAlign: 'right' }}>Solved</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F0F4', textAlign: 'right' }}>{localSolved}</p>
            </div>
          </div>

          <div style={{ width: 24, textAlign: 'center' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: '#3A3A4E' }}>VS</span>
          </div>

          {/* Opponent */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, flexDirection: 'row-reverse' }}>
            {opp ? (
              <>
                <Avatar player={opp} />
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 1 }}>
                    {opp.displayName.split(' ')[0]}
                  </p>
                  <p className="font-game" style={{ fontSize: 16, color: '#F0F0F4', lineHeight: 1 }}>{opp.score}</p>
                </div>
                <div>
                  <p style={{ fontSize: 9, color: '#5A5A6E' }}>Solved</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: '#F0F0F4' }}>{opp.solved}</p>
                </div>
              </>
            ) : (
              <p style={{ fontSize: 12, color: '#3A3A4E' }}>—</p>
            )}
          </div>
        </div>
      )}

      {/* ── Main ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto game-container" style={{ padding: '0 20px' }}>
        <AnimatePresence mode="wait">

          {(phase === 'loading' || phase === 'waiting') && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center"
              style={{ height: '65vh', gap: 22 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 48, height: 48, borderRadius: '50%',
                  border: `3px solid rgba(96,165,250,0.08)`,
                  borderTop: `3px solid ${color}`,
                }}
              />
              <div className="text-center">
                <p style={{ fontSize: 16, fontWeight: 600, color: '#F0F0F4', marginBottom: 6 }}>
                  Waiting for opponent…
                </p>
                <p style={{ fontSize: 13, color: '#5A5A6E' }}>
                  Share your room link with a friend
                </p>
              </div>
            </motion.div>
          )}

          {phase === 'countdown' && (
            <motion.div
              key="countdown"
              className="flex flex-col items-center justify-center"
              style={{ height: '65vh', gap: 16 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.8, opacity: 0 }}
                  animate={{ scale: 1,   opacity: 1 }}
                  exit={{   scale: 0.5,  opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="font-game"
                  style={{ fontSize: 88, color, lineHeight: 1 }}
                >
                  {countdown > 0 ? countdown : '⚡'}
                </motion.div>
              </AnimatePresence>
              <p style={{ fontSize: 14, color: '#5A5A6E' }}>
                {opp ? `vs ${opp.displayName.split(' ')[0]}` : 'Get ready!'}
              </p>
            </motion.div>
          )}

          {phase === 'playing' && puzzle && (
            <motion.div
              key={`p-${puzzleIndex}`}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18 }}
            >
              <PuzzleView
                key={puzzleIndex}
                puzzle={puzzle}
                onSolve={handleSolve}
                onMistake={handleMistake}
              />
            </motion.div>
          )}

          {phase === 'results' && duel && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
              style={{ paddingTop: 52, paddingBottom: 48, gap: 28, textAlign: 'center' }}
            >
              {duel.status !== 'finished' ? (
                /* Waiting for final result from Firestore */
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.07)`, borderTop: `2px solid ${color}` }}
                  />
                  <p style={{ fontSize: 14, color: '#5A5A6E' }}>Finalizing results…</p>
                </>
              ) : (
                <>
                  {/* Outcome */}
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                    style={{ fontSize: 68, lineHeight: 1, marginBottom: 4 }}
                  >
                    {isTie ? '🤝' : isWinner ? '🏆' : '💀'}
                  </motion.div>
                  <h1
                    className="font-game tracking-widest"
                    style={{
                      fontSize: 30,
                      color: isTie ? '#FBBF24' : isWinner ? '#34D399' : '#EF4444',
                    }}
                  >
                    {isTie ? 'DRAW' : isWinner ? 'YOU WIN' : 'YOU LOSE'}
                  </h1>

                  {/* Score cards */}
                  <div style={{ width: '100%', display: 'flex', gap: 10, marginTop: 4 }}>
                    {/* Me */}
                    <div style={{
                      flex: 1, padding: '18px 14px', borderRadius: 16, textAlign: 'center',
                      background: isWinner ? `rgba(${color.slice(1).match(/.{2}/g)?.map(h => parseInt(h,16)).join(',')},0.08)` : '#141418',
                      border: `1px solid ${isWinner ? `${color}66` : 'rgba(255,255,255,0.07)'}`,
                    }}>
                      <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>You</p>
                      <p style={{ fontSize: 32, fontWeight: 800, color, marginBottom: 2 }}>
                        {duel.players[user.uid]?.score ?? localScore}
                      </p>
                      <p style={{ fontSize: 12, color: '#5A5A6E' }}>
                        {duel.players[user.uid]?.solved ?? localSolved} solved
                      </p>
                    </div>

                    {/* Opponent */}
                    {opp && (
                      <div style={{
                        flex: 1, padding: '18px 14px', borderRadius: 16, textAlign: 'center',
                        background: (!isWinner && !isTie) ? 'rgba(52,211,153,0.06)' : '#141418',
                        border: `1px solid ${(!isWinner && !isTie) ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.07)'}`,
                      }}>
                        <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          {opp.displayName.split(' ')[0]}
                        </p>
                        <p style={{ fontSize: 32, fontWeight: 800, color: '#F0F0F4', marginBottom: 2 }}>
                          {opp.score}
                        </p>
                        <p style={{ fontSize: 12, color: '#5A5A6E' }}>{opp.solved} solved</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push(`/duel/lobby?type=${duel.type}&d=${duel.difficulty}`)}
                      className="w-full font-game tracking-widest uppercase"
                      style={{ padding: '15px 20px', borderRadius: 12, fontSize: 13, background: color, color: '#0C0C0F', boxShadow: `0 0 24px ${color}44` }}
                    >
                      Rematch →
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push('/home')}
                      style={{ padding: '15px 20px', borderRadius: 12, fontSize: 13, background: '#141418', border: '1px solid rgba(255,255,255,0.08)', color: '#A0A0B0', fontWeight: 600 }}
                    >
                      Home
                    </motion.button>
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
