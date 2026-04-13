'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getCaseById } from '@/lib/data/cases';
import { formatTime, calculateDailyScore, calculateTimeAttackScore } from '@/lib/utils/scoring';
import { shareResult, generateShareText } from '@/lib/utils/share';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Confetti } from '@/components/ui/Confetti';

const VERDICT_COLORS = ['#A855F7', '#F97316', '#EC4899', '#5CE1E6'];
const VERDICT_KEYS   = ['culprit', 'time', 'location', 'code'] as const;
const VERDICT_LABELS = ['CULPRIT', 'TIME', 'LOCATION', 'CODE'];

export default function ResultPage() {
  const router  = useRouter();
  const { user } = useAuthStore();
  const { lastResult, streak } = useGameStore();
  const [copied, setCopied]   = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showDetails, setShowDetails]   = useState(false);

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    setTimeout(() => setShowConfetti(true), 300);
    setTimeout(() => setShowDetails(true), 600);
  }, [user, router]);

  if (!user || !lastResult) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-center gap-4">
        <p className="text-[#444] text-sm">No result to display.</p>
        <button onClick={() => router.push('/home')}
          className="px-6 py-3 rounded-xl bg-[#1E1E1E] text-white font-bold text-sm">
          Back to Home
        </button>
      </div>
    );
  }

  const isDaily   = lastResult.mode === 'daily';
  const isPerfect = lastResult.perfect;
  const caseData  = isDaily && lastResult.caseId ? getCaseById(lastResult.caseId) : null;
  const breakdown = isDaily
    ? calculateDailyScore(lastResult.timeSeconds, lastResult.mistakes)
    : calculateTimeAttackScore(lastResult.timeAttackSolved ?? 0, lastResult.timeSeconds, lastResult.mistakes);

  const resultLabel = isPerfect ? 'PERFECT!' : isDaily ? 'SOLVED!' : 'TIME\'S UP!';
  const resultColor = isPerfect ? '#C8FF57' : isDaily ? '#5CE1E6' : '#F97316';

  const handleShare = async () => {
    const ok = await shareResult({ ...lastResult, streak });
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D] grid-overlay flex flex-col">
      <Confetti trigger={showConfetti} type={isPerfect ? 'celebration' : 'subtle'} />

      {/* Header */}
      <header className="border-b border-[#1A1A1A] bg-[#0D0D0D]/95 backdrop-blur">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 72 72" fill="none">
              <circle cx="32" cy="32" r="20" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="32" cy="32" r="9" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="47" y1="47" x2="62" y2="62" stroke="#C8FF57" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <span className="font-game text-white text-xl tracking-wider">DEDUCE</span>
          </div>
          <button onClick={() => router.push('/home')}
            className="text-xs font-bold text-[#444] hover:text-white transition-colors uppercase tracking-wider">
            Home →
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-5 py-8 flex flex-col gap-6">

        {/* ── RESULT HERO ─────────────────────────────────────────── */}
        <motion.div
          className="rounded-2xl overflow-hidden bg-[#181818] text-center"
        >
          {/* Color top border */}
          <motion.div
            className="h-2 w-full"
            style={{ background: resultColor }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
          />

          <div className="py-12 px-8">
            {/* Big result label */}
            <motion.h1
              initial={{ scale: 0.5, opacity: 0, rotate: -6 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring' as const, stiffness: 260, damping: 18, delay: 0.15 }}
              className="font-game leading-none mb-6"
              style={{ fontSize: 'clamp(56px, 10vw, 96px)', color: resultColor }}
            >
              {resultLabel}
            </motion.h1>

            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5, ease: [0.16,1,0.3,1] }}
            >
              <p className="text-[#444] text-xs font-bold uppercase tracking-[0.3em] mb-2">Score</p>
              <div className="font-game text-white leading-none mb-1" style={{ fontSize: 'clamp(60px, 10vw, 90px)' }}>
                <AnimatedNumber value={breakdown.total} duration={1600} />
              </div>
              <p className="text-[#444] text-sm">points</p>
            </motion.div>

            {!isDaily && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 inline-flex items-center gap-3 rounded-2xl px-8 py-4"
                style={{ background: '#252525' }}
              >
                <span className="font-game leading-none" style={{ fontSize: '52px', color: '#C8FF57' }}>
                  {lastResult.timeAttackSolved ?? 0}
                </span>
                <span className="text-[#666] text-sm">puzzles in 60s</span>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ── DETAILS ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16,1,0.3,1] }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Verdict (daily only) */}
              {isDaily && caseData && (
                <div className="rounded-2xl bg-[#181818] p-5">
                  <p className="font-game text-sm text-[#444] mb-4" style={{ letterSpacing: '0.1em' }}>
                    THE VERDICT — {caseData.title.toUpperCase()}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {VERDICT_KEYS.map((key, i) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + i * 0.08, type: 'spring' as const, stiffness: 260, damping: 22 }}
                        className="rounded-xl bg-[#252525] p-3"
                      >
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5"
                          style={{ color: VERDICT_COLORS[i] }}>
                          {VERDICT_LABELS[i]}
                        </p>
                        <p className="text-sm font-black text-white">{caseData.solution[key]}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Score breakdown */}
              <div className="rounded-2xl bg-[#181818] p-5">
                <p className="font-game text-sm text-[#444] mb-4" style={{ letterSpacing: '0.1em' }}>
                  SCORE BREAKDOWN
                </p>
                <div className="space-y-3">
                  {[
                    { label: 'Base score',                              value: `+${breakdown.base}`,          red: false, green: false },
                    { label: `Time  (${formatTime(lastResult.timeSeconds)})`, value: `+${breakdown.timeBonus}`, red: false, green: false },
                    { label: `Mistakes ×${lastResult.mistakes}`,        value: `-${breakdown.mistakePenalty}`, red: breakdown.mistakePenalty > 0, green: false },
                    ...(breakdown.perfectBonus > 0
                      ? [{ label: 'Perfect bonus', value: `+${breakdown.perfectBonus}`, red: false, green: true }]
                      : []),
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between text-sm">
                      <span className="text-[#555]">{row.label}</span>
                      <span className={
                        row.green ? 'text-[#C8FF57] font-bold'
                        : row.red ? 'text-[#EF4444]'
                        : 'text-[#CCC]'
                      }>{row.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-3 border-t border-[#252525]">
                    <span className="font-game text-white" style={{ letterSpacing: '0.08em' }}>TOTAL</span>
                    <span className="font-game text-2xl" style={{ color: resultColor }}>{breakdown.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── STATS ROW ───────────────────────────────────────────── */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { label: 'TIME',     value: formatTime(lastResult.timeSeconds),         color: '#F97316' },
                { label: 'MISTAKES', value: String(lastResult.mistakes),                 color: lastResult.mistakes === 0 ? '#C8FF57' : '#EF4444' },
                { label: 'STREAK',   value: `${streak}🔥`,                              color: '#F97316' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl bg-[#181818] p-4 text-center">
                  <p className="font-game text-3xl leading-none mb-1" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[10px] text-[#444] uppercase tracking-[0.2em]">{s.label}</p>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTAs ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col gap-3"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleShare}
                className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all"
                style={{ background: '#C8FF57', color: '#0D0D0D' }}
              >
                {copied ? '✓ COPIED!' : '↑ SHARE RESULT'}
              </motion.button>
              <button
                onClick={() => router.push('/home')}
                className="w-full py-4 rounded-2xl font-black text-sm bg-[#181818] text-[#888] hover:text-white hover:bg-[#1E1E1E] transition-all"
              >
                BACK TO HOME
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
