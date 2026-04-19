'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { ABSTRACT_TYPE_META } from '@/types/abstract';
import { PUZZLE_META } from '@/lib/data/cases';
import { getDuelAbstractPool } from '@/lib/data/abstractHelpers';
import { getDuelDetectivePuzzles } from '@/lib/data/detectiveHelpers';
import { RuleShift }      from '@/components/puzzles/abstract/RuleShift';
import { SwapLogic }      from '@/components/puzzles/abstract/SwapLogic';
import { BinaryDecision } from '@/components/puzzles/abstract/BinaryDecision';
import { SetLogic }       from '@/components/puzzles/abstract/SetLogic';
import { LinkGrid }  from '@/components/puzzles/LinkGrid';
import { TimeTrace } from '@/components/puzzles/TimeTrace';
import { TrueLie }   from '@/components/puzzles/TrueLie';
import { CodeBreak } from '@/components/puzzles/CodeBreak';
import type { Duel, DuelPlayer } from '@/types/duel';
import type { AbstractPuzzle, AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';
import type { PuzzleType, LinkGridPuzzle, TimeTracePuzzle, TrueLiePuzzle, CodeBreakPuzzle } from '@/types';

type Phase = 'loading' | 'waiting' | 'join' | 'countdown' | 'playing' | 'results';

// ── Puzzle renderer (handles both categories) ─────────────────────────────────

function PuzzleView({ puzzle, type, category, onSolve, onMistake }: {
  puzzle: unknown;
  type: string;
  category: 'abstract' | 'detective';
  onSolve: () => void;
  onMistake: () => void;
}) {
  if (category === 'detective') {
    switch (type) {
      case 'linkGrid':  return <LinkGrid  puzzle={puzzle as LinkGridPuzzle}  onSolve={onSolve} onMistake={onMistake} />;
      case 'timeTrace': return <TimeTrace puzzle={puzzle as TimeTracePuzzle} onSolve={onSolve} onMistake={onMistake} />;
      case 'trueLie':   return <TrueLie   puzzle={puzzle as TrueLiePuzzle}   onSolve={onSolve} onMistake={onMistake} />;
      case 'codeBreak': return <CodeBreak puzzle={puzzle as CodeBreakPuzzle} onSolve={onSolve} onMistake={onMistake} />;
    }
  } else {
    const p = puzzle as AbstractPuzzle;
    switch (type) {
      case 'ruleShift':      return <RuleShift      puzzle={p} onSolve={onSolve} onMistake={onMistake} />;
      case 'swapLogic':      return <SwapLogic      puzzle={p} onSolve={onSolve} onMistake={onMistake} />;
      case 'binaryDecision': return <BinaryDecision puzzle={p} onSolve={onSolve} onMistake={onMistake} />;
      case 'setLogic':       return <SetLogic       puzzle={p} onSolve={onSolve} onMistake={onMistake} />;
    }
  }
  return null;
}

// ── Avatar ────────────────────────────────────────────────────────────────────

function Avatar({ player, size = 28 }: { player: DuelPlayer; size?: number }) {
  if (player.photoURL) {
    return <img src={player.photoURL} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />;
  }
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: '#1C1C22', border: '1px solid rgba(255,255,255,0.1)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.46, color: '#A0A0B0', fontWeight: 700,
    }}>
      {(player.displayName || '?').charAt(0).toUpperCase()}
    </div>
  );
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function DuelGamePage() {
  const router   = useRouter();
  const params   = useParams();
  const { user } = useAuthStore();
  const duelId   = params.id as string;

  const [duel,        setDuel]        = useState<Duel | null>(null);
  const [puzzles,     setPuzzles]     = useState<unknown[]>([]);
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [phase,       setPhase]       = useState<Phase>('loading');
  const [countdown,   setCountdown]   = useState(3);
  const [timeLeft,    setTimeLeft]    = useState(0);
  const [localSolved, setLocalSolved] = useState(0);
  const [localScore,  setLocalScore]  = useState(0);
  const [isJoining,   setIsJoining]   = useState(false);
  const [gameOver,    setGameOver]    = useState(false); // room started before visitor joined
  const [copied,      setCopied]      = useState<'code' | 'link' | null>(null);

  const solvedRef    = useRef(0);
  const mistakesRef  = useRef(0);
  const scoreRef     = useRef(0);
  const finishedRef  = useRef(false);
  const puzzlesInit  = useRef(false);
  const duelRef      = useRef<Duel | null>(null);

  // ── Firestore subscription ──────────────────────────────────────────────────
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
          const cat = updated.puzzleCategory ?? 'abstract';
          const pool = cat === 'detective'
            ? getDuelDetectivePuzzles(updated.type as PuzzleType, updated.difficulty, duelId)
            : getDuelAbstractPool(updated.type as AbstractPuzzleType, updated.difficulty as AbstractDifficulty, duelId);
          setPuzzles(pool);
        }

        const isPlayer = user.uid in (updated.players ?? {});

        if (!isPlayer) {
          if (updated.status !== 'waiting') setGameOver(true);
          setPhase('join');
          return;
        }

        if (updated.status === 'waiting') {
          setPhase(p => p === 'loading' ? 'waiting' : p);
        } else if (updated.status === 'starting') {
          const now = Date.now();
          if ((updated.startAt ?? 0) <= now) {
            setPhase(p => ['loading','waiting','countdown'].includes(p) ? 'playing' : p);
          } else {
            setPhase(p => ['loading','waiting'].includes(p) ? 'countdown' : p);
          }
        } else if (updated.status === 'finished') {
          setPhase('results');
        }
      });
    };

    setup();
    return () => { unsub?.(); };
  }, [user, duelId]);

  // ── Countdown ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'countdown') return;
    const startAt = duelRef.current?.startAt;
    if (!startAt) return;
    const tick = () => {
      const rem = startAt - Date.now();
      setCountdown(Math.max(0, Math.ceil(rem / 1000)));
      if (rem <= 0) setPhase('playing');
    };
    tick();
    const id = setInterval(tick, 120);
    return () => clearInterval(id);
  }, [phase]);

  // ── Game timer ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'playing') return;
    const d = duelRef.current;
    if (!d?.startAt) return;
    const endAt = d.startAt + d.duration * 1000;

    const tick = async () => {
      const rem = endAt - Date.now();
      setTimeLeft(Math.max(0, Math.ceil(rem / 1000)));
      if (rem <= 0 && !finishedRef.current) {
        finishedRef.current = true;
        setPhase('results');
        const { finishDuel } = await import('@/lib/firebase/duel');
        finishDuel(duelId, user!.uid, solvedRef.current, mistakesRef.current, scoreRef.current).catch(() => {});
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [phase, duelId, user]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleJoin = async () => {
    if (!user) return;
    setIsJoining(true);
    try {
      const { joinDuelById } = await import('@/lib/firebase/duel');
      await joinDuelById(duelId, {
        uid:         user.uid,
        displayName: user.displayName ?? 'Detective',
        photoURL:    user.photoURL,
        isGuest:     user.isGuest ?? false,
      });
    } catch {
      setIsJoining(false);
    }
  };

  const handleSolve = useCallback(() => {
    solvedRef.current  += 1;
    scoreRef.current   += 100;
    setLocalSolved(solvedRef.current);
    setLocalScore(scoreRef.current);
    if (!finishedRef.current && user) {
      import('@/lib/firebase/duel').then(({ updateMyProgress }) =>
        updateMyProgress(duelId, user.uid, solvedRef.current, mistakesRef.current, scoreRef.current).catch(() => {})
      );
    }
    setTimeout(() => setPuzzleIndex(i => i + 1), 520);
  }, [user, duelId]);

  const handleMistake = useCallback(() => { mistakesRef.current += 1; }, []);

  const copyToClipboard = async (text: string, key: 'code' | 'link') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch { /* ignore */ }
  };

  if (!user) return null;

  // ── Derived ──────────────────────────────────────────────────────────────────
  const cat      = duel?.puzzleCategory ?? 'abstract';
  const meta     = duel
    ? cat === 'detective' ? PUZZLE_META[duel.type as PuzzleType] : ABSTRACT_TYPE_META[duel.type as AbstractPuzzleType]
    : null;
  const color    = meta?.color ?? '#60A5FA';
  const me       = duel?.players[user.uid];
  const oppUid   = duel ? Object.keys(duel.players).find(u => u !== user.uid) : undefined;
  const opp      = oppUid ? duel?.players[oppUid] : null;
  const creator  = duel ? Object.values(duel.players)[0] : null; // for join screen
  const puzzle   = puzzles.length > 0 ? puzzles[puzzleIndex % puzzles.length] : null;
  const duration = duel?.duration ?? 90;
  const timerPct = timeLeft / duration;
  const timerColor = timeLeft > 30 ? color : timeLeft > 10 ? '#FBBF24' : '#EF4444';
  const isWinner = duel?.winnerId === user.uid;
  const isTie    = duel?.isTie === true;

  // Share info
  const shareLink   = typeof window !== 'undefined' ? window.location.href : '';
  const inviteCode  = duel?.inviteCode;

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: '#0C0C0F' }}>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-20"
        style={{ background: 'rgba(12,12,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="game-container h-14 flex items-center gap-3">
          <button
            onClick={() => router.push('/home')}
            style={{ width: 34, height: 34, borderRadius: 8, flexShrink: 0, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            <span className="font-game tracking-widest" style={{ fontSize: 11, color }}>
              {meta?.label?.toUpperCase() ?? 'DUEL'} · ONLINE DUEL
            </span>
          </div>
          <div style={{ width: 52, textAlign: 'right' }}>
            {phase === 'playing' && (
              <span className="font-game" style={{ fontSize: 15, color: timerColor }}>{fmt(timeLeft)}</span>
            )}
          </div>
        </div>
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

      {/* ── Live player bar (shown during countdown + playing) ───────────── */}
      {(phase === 'playing' || phase === 'countdown') && me && (
        <div className="game-container" style={{ padding: '10px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: 10 }}>
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
                  <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 1 }}>{opp.displayName.split(' ')[0]}</p>
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

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto game-container" style={{ padding: '0 20px' }}>
        <AnimatePresence mode="wait">

          {/* Loading */}
          {phase === 'loading' && (
            <motion.div key="loading" className="flex items-center justify-center" style={{ height: '60vh' }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{ width: 32, height: 32, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.07)`, borderTop: `2px solid ${color}` }} />
            </motion.div>
          )}

          {/* Join — non-participant visited via link */}
          {phase === 'join' && (
            <motion.div key="join" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center" style={{ paddingTop: 52, paddingBottom: 40, gap: 20, textAlign: 'center' }}
            >
              {creator && <Avatar player={creator} size={56} />}
              <div>
                <p style={{ fontSize: 17, fontWeight: 600, color: '#F0F0F4', marginBottom: 6 }}>
                  {creator?.displayName ?? 'Someone'} invited you to a duel
                </p>
                <p style={{ fontSize: 13, color: '#5A5A6E' }}>
                  {meta?.label ?? duel?.type} · {duel?.difficulty} · {duel?.duration}s
                </p>
              </div>
              {gameOver ? (
                <div style={{ padding: '12px 20px', borderRadius: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <p style={{ fontSize: 13, color: '#EF4444' }}>This game has already started.</p>
                </div>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleJoin}
                  disabled={isJoining}
                  className="font-game tracking-widest uppercase"
                  style={{ padding: '15px 36px', borderRadius: 12, fontSize: 14, background: color, color: '#0C0C0F', opacity: isJoining ? 0.6 : 1 }}
                >
                  {isJoining ? 'Joining…' : 'Accept & Play →'}
                </motion.button>
              )}
              <button onClick={() => router.push('/home')} style={{ fontSize: 12, color: '#5A5A6E', padding: '8px 20px', background: 'transparent', border: 'none' }}>
                Back to Home
              </button>
            </motion.div>
          )}

          {/* Waiting — room creator holding for opponent */}
          {phase === 'waiting' && (
            <motion.div key="waiting" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center" style={{ paddingTop: 40, paddingBottom: 40, gap: 24 }}
            >
              {inviteCode ? (
                /* Private room — show invite code */
                <>
                  <div className="text-center" style={{ gap: 6 }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                      style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid rgba(255,255,255,0.06)`, borderTop: `3px solid ${color}`, margin: '0 auto 16px' }} />
                    <p style={{ fontSize: 16, fontWeight: 600, color: '#F0F0F4', marginBottom: 4 }}>Waiting for opponent…</p>
                    <p style={{ fontSize: 13, color: '#5A5A6E' }}>Share the code or link below</p>
                  </div>

                  {/* Invite code display */}
                  <div style={{ width: '100%', padding: '20px 20px 16px', borderRadius: 16, background: '#141418', border: `1px solid ${color}33`, textAlign: 'center' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.16em', color: '#5A5A6E', marginBottom: 12, textTransform: 'uppercase' }}>Invite Code</p>
                    <p className="font-game" style={{ fontSize: 38, letterSpacing: '0.35em', color, marginBottom: 16 }}>{inviteCode}</p>
                    <button
                      onClick={() => copyToClipboard(inviteCode, 'code')}
                      style={{ width: '100%', padding: '10px 16px', borderRadius: 8, background: copied === 'code' ? `${color}22` : '#1C1C22', border: `1px solid ${copied === 'code' ? color : 'rgba(255,255,255,0.08)'}`, color: copied === 'code' ? color : '#A0A0B0', fontSize: 13, fontWeight: 600, transition: 'all 0.2s' }}
                    >
                      {copied === 'code' ? '✓ Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  {/* Link copy */}
                  <div style={{ width: '100%' }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: '#5A5A6E', marginBottom: 8, textTransform: 'uppercase' }}>Or Share Link</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <div style={{ flex: 1, padding: '10px 12px', borderRadius: 8, background: '#141418', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                        <p style={{ fontSize: 11, color: '#5A5A6E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{shareLink}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(shareLink, 'link')}
                        style={{ padding: '10px 14px', borderRadius: 8, background: copied === 'link' ? `${color}22` : '#1C1C22', border: `1px solid ${copied === 'link' ? color : 'rgba(255,255,255,0.08)'}`, color: copied === 'link' ? color : '#A0A0B0', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                      >
                        {copied === 'link' ? '✓' : 'Copy'}
                      </button>
                    </div>
                    <p style={{ fontSize: 11, color: '#3A3A4E', marginTop: 8 }}>Friend can also enter the code at <span style={{ color: '#5A5A6E' }}>/duel/join</span></p>
                  </div>
                </>
              ) : (
                /* Quick match — just spinner */
                <div className="flex flex-col items-center" style={{ height: '55vh', justifyContent: 'center', gap: 20 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 48, height: 48, borderRadius: '50%', border: `3px solid rgba(255,255,255,0.06)`, borderTop: `3px solid ${color}` }} />
                  <p style={{ fontSize: 16, fontWeight: 600, color: '#F0F0F4' }}>Waiting for opponent…</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Countdown */}
          {phase === 'countdown' && (
            <motion.div key="countdown" className="flex flex-col items-center justify-center" style={{ height: '65vh', gap: 16 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="font-game" style={{ fontSize: 88, color, lineHeight: 1 }}
                >
                  {countdown > 0 ? countdown : '⚡'}
                </motion.div>
              </AnimatePresence>
              <p style={{ fontSize: 14, color: '#5A5A6E' }}>
                {opp ? `vs ${opp.displayName.split(' ')[0]}` : 'Get ready!'}
              </p>
            </motion.div>
          )}

          {/* Playing */}
          {phase === 'playing' && puzzle != null && (
            <motion.div key={`p-${puzzleIndex}`} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.18 }}>
              <PuzzleView
                key={puzzleIndex}
                puzzle={puzzle}
                type={duel?.type ?? ''}
                category={cat}
                onSolve={handleSolve}
                onMistake={handleMistake}
              />
            </motion.div>
          )}

          {/* Results */}
          {phase === 'results' && duel && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center" style={{ paddingTop: 52, paddingBottom: 48, gap: 28, textAlign: 'center' }}
            >
              {duel.status !== 'finished' ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 36, height: 36, borderRadius: '50%', border: `2px solid rgba(255,255,255,0.07)`, borderTop: `2px solid ${color}` }} />
                  <p style={{ fontSize: 14, color: '#5A5A6E' }}>Finalizing results…</p>
                </>
              ) : (
                <>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18, delay: 0.1 }}
                    style={{ fontSize: 68, lineHeight: 1, marginBottom: 4 }}
                  >
                    {isTie ? '🤝' : isWinner ? '🏆' : '💀'}
                  </motion.div>
                  <h1 className="font-game tracking-widest" style={{ fontSize: 30, color: isTie ? '#FBBF24' : isWinner ? '#34D399' : '#EF4444' }}>
                    {isTie ? 'DRAW' : isWinner ? 'YOU WIN' : 'YOU LOSE'}
                  </h1>

                  {/* Score cards */}
                  <div style={{ width: '100%', display: 'flex', gap: 10, marginTop: 4 }}>
                    <div style={{ flex: 1, padding: '18px 14px', borderRadius: 16, textAlign: 'center', background: isWinner || isTie ? `${color}10` : '#141418', border: `1px solid ${isWinner || isTie ? `${color}55` : 'rgba(255,255,255,0.07)'}` }}>
                      <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>You</p>
                      <p style={{ fontSize: 32, fontWeight: 800, color, marginBottom: 2 }}>{duel.players[user.uid]?.score ?? localScore}</p>
                      <p style={{ fontSize: 12, color: '#5A5A6E' }}>{duel.players[user.uid]?.solved ?? localSolved} solved</p>
                    </div>
                    {opp && (
                      <div style={{ flex: 1, padding: '18px 14px', borderRadius: 16, textAlign: 'center', background: (!isWinner && !isTie) ? `${color}10` : '#141418', border: `1px solid ${(!isWinner && !isTie) ? `${color}55` : 'rgba(255,255,255,0.07)'}` }}>
                        <p style={{ fontSize: 10, color: '#5A5A6E', marginBottom: 8, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{opp.displayName.split(' ')[0]}</p>
                        <p style={{ fontSize: 32, fontWeight: 800, color: '#F0F0F4', marginBottom: 2 }}>{opp.score}</p>
                        <p style={{ fontSize: 12, color: '#5A5A6E' }}>{opp.solved} solved</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                    <motion.button whileTap={{ scale: 0.97 }}
                      onClick={() => router.push(`/duel/lobby?type=${duel.type}&d=${duel.difficulty}&cat=${cat}`)}
                      className="w-full font-game tracking-widest uppercase"
                      style={{ padding: '15px 20px', borderRadius: 12, fontSize: 13, background: color, color: '#0C0C0F', boxShadow: `0 0 24px ${color}44` }}
                    >
                      Rematch →
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => router.push('/home')}
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
