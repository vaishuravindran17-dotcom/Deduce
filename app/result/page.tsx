'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getCaseById } from '@/lib/data/cases';
import { formatTime, calculateDailyScore, calculateTimeAttackScore } from '@/lib/utils/scoring';
import { shareResult, generateShareText } from '@/lib/utils/share';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Confetti } from '@/components/ui/Confetti';

const VERDICT_COLORS = ['#A78BFA', '#FB923C', '#F472B6', '#67E8F9'];
const VERDICT_KEYS   = ['culprit', 'time', 'location', 'code'] as const;
const VERDICT_LABELS = ['Culprit', 'Time', 'Location', 'Code'];

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp  = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 24 } },
};

export default function ResultPage() {
  const router  = useRouter();
  const { user } = useAuthStore();
  const { lastResult, streak } = useGameStore();
  const [copied, setCopied]   = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    setTimeout(() => setShowConfetti(true), 400);
  }, [user, router]);

  if (!user || !lastResult) {
    return (
      <div className="min-h-dvh bg-[#141414] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[#555] text-sm">No result to display.</p>
        <button
          onClick={() => router.push('/home')}
          className="px-6 py-3 rounded-2xl bg-[#1E1E1E] text-white font-bold text-sm"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isDaily   = lastResult.mode === 'daily';
  const caseData  = isDaily && lastResult.caseId ? getCaseById(lastResult.caseId) : null;
  const breakdown = isDaily
    ? calculateDailyScore(lastResult.timeSeconds, lastResult.mistakes)
    : calculateTimeAttackScore(lastResult.timeAttackSolved ?? 0, lastResult.timeSeconds, lastResult.mistakes);

  const handleShare = async () => {
    const ok = await shareResult({ ...lastResult, streak });
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  return (
    <div className="min-h-dvh bg-[#141414] flex flex-col">
      <Confetti trigger={showConfetti} type={lastResult.perfect ? 'celebration' : 'subtle'} />

      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-safe pt-5 pb-4 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <svg width="22" height="22" viewBox="0 0 80 80" fill="none">
            <circle cx="36" cy="36" r="22" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="35" cy="35" r="10" stroke="#C8FF57" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="43" y1="43" x2="56" y2="56" stroke="#C8FF57" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <span className="font-black text-white tracking-tight">DEDUCE</span>
        </div>
        <button
          onClick={() => router.push('/home')}
          className="text-xs text-[#555] hover:text-white transition-colors font-semibold"
        >
          Home →
        </button>
      </header>

      <motion.div
        variants={stagger} initial="hidden" animate="show"
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4 pb-safe pb-10"
      >

        {/* ── Score hero ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-[#1E1E1E] overflow-hidden">
          {/* Top color accent */}
          <div className="h-1.5 w-full" style={{ background: '#C8FF57' }} />

          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 18, delay: 0.2 }}
              className="text-6xl mb-5"
            >
              {lastResult.perfect ? '🏆' : isDaily ? '🔍' : '⏱'}
            </motion.div>

            <p className="text-[11px] font-bold text-[#555] uppercase tracking-[0.25em] mb-3">
              {lastResult.perfect ? 'Perfect Solve!' : isDaily ? 'Case Solved' : 'Time Attack Complete'}
            </p>

            <div className="text-6xl font-black text-white mb-1">
              <AnimatedNumber value={breakdown.total} duration={1400} />
            </div>
            <p className="text-[#555] text-sm">points</p>

            {!isDaily && (
              <div className="mt-5 inline-flex items-center gap-3 bg-[#252525] rounded-2xl px-6 py-3">
                <span className="text-4xl font-black text-[#C8FF57]">{lastResult.timeAttackSolved ?? 0}</span>
                <span className="text-sm text-[#666]">puzzles in 60s</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Verdict (daily only) ─────────────────────────────────── */}
        {isDaily && caseData && (
          <motion.div variants={fadeUp} className="rounded-2xl bg-[#1E1E1E] p-5">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-4">
              The Verdict · {caseData.title}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {VERDICT_KEYS.map((key, i) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, type: 'spring' as const, stiffness: 260, damping: 20 }}
                  className="rounded-xl bg-[#252525] p-3"
                >
                  <p className="text-[10px] text-[#555] mb-1.5 uppercase tracking-wider">{VERDICT_LABELS[i]}</p>
                  <p className="text-sm font-black" style={{ color: VERDICT_COLORS[i] }}>
                    {caseData.solution[key]}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Score breakdown ──────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-[#1E1E1E] p-5">
          <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-4">Score Breakdown</p>
          <div className="space-y-3">
            {[
              { label: 'Base score',                            value: `+${breakdown.base}`,          red: false, green: false },
              { label: `Time  (${formatTime(lastResult.timeSeconds)})`, value: `+${breakdown.timeBonus}`,  red: false, green: false },
              { label: `Mistakes ×${lastResult.mistakes}`,     value: `-${breakdown.mistakePenalty}`, red: breakdown.mistakePenalty > 0, green: false },
              ...(breakdown.perfectBonus > 0
                ? [{ label: 'Perfect bonus', value: `+${breakdown.perfectBonus}`, red: false, green: true }]
                : []),
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-[#666]">{row.label}</span>
                <span className={row.green ? 'text-[#C8FF57] font-bold' : row.red ? 'text-[#F87171]' : 'text-[#CCC]'}>
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-[#252525] font-black">
              <span className="text-white">Total</span>
              <span className="text-[#C8FF57] text-xl">{breakdown.total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
          {[
            { label: 'Time',     value: formatTime(lastResult.timeSeconds), color: '#FB923C' },
            { label: 'Mistakes', value: String(lastResult.mistakes),        color: lastResult.mistakes === 0 ? '#C8FF57' : '#F87171' },
            { label: 'Streak',   value: `${streak} 🔥`,                    color: '#FB923C' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl bg-[#1E1E1E] p-3.5 text-center">
              <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-[#555] mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Share preview ────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="rounded-2xl bg-[#1A1A1A] p-4">
          <pre className="text-xs text-[#444] font-mono whitespace-pre-wrap leading-relaxed">
            {generateShareText({ ...lastResult, streak })}
          </pre>
        </motion.div>

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex flex-col gap-2.5">
          <button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95"
            style={{ background: '#C8FF57', color: '#141414' }}
          >
            {copied ? '✓ Copied to clipboard!' : '↑ Share Result'}
          </button>
          <button
            onClick={() => router.push('/home')}
            className="w-full py-4 rounded-2xl font-black text-sm bg-[#1E1E1E] text-white transition-all active:scale-95"
          >
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
