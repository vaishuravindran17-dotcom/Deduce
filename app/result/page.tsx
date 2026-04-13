'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getCaseById, PUZZLE_META } from '@/lib/data/cases';
import { formatTime, calculateDailyScore, calculateTimeAttackScore } from '@/lib/utils/scoring';
import { shareResult, generateShareText } from '@/lib/utils/share';
import { Button } from '@/components/ui/Button';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';
import { Confetti } from '@/components/ui/Confetti';
import type { PuzzleType } from '@/types';

const VERDICT_ITEMS = [
  { key: 'culprit',  label: 'Culprit',   icon: '🕵️', color: '#818CF8' },
  { key: 'time',     label: 'Time',      icon: '🕐', color: '#FB923C' },
  { key: 'location', label: 'Location',  icon: '📍', color: '#F472B6' },
  { key: 'code',     label: 'Code',      icon: '🔐', color: '#4ADE80' },
] as const;

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const fadeUp  = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 240, damping: 22 } },
};

export default function ResultPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { lastResult, streak } = useGameStore();
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (!user) { router.replace('/auth'); return; }
    setTimeout(() => setShowConfetti(true), 300);
  }, [user, router]);

  if (!user || !lastResult) {
    return (
      <div className="min-h-dvh bg-[#0A0A0A] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[#555] text-sm">No result to display.</p>
        <Button onClick={() => router.push('/home')}>Back to Home</Button>
      </div>
    );
  }

  const isDaily  = lastResult.mode === 'daily';
  const caseData = isDaily && lastResult.caseId ? getCaseById(lastResult.caseId) : null;
  const breakdown = isDaily
    ? calculateDailyScore(lastResult.timeSeconds, lastResult.mistakes)
    : calculateTimeAttackScore(lastResult.timeAttackSolved ?? 0, lastResult.timeSeconds, lastResult.mistakes);

  const handleShare = async () => {
    const ok = await shareResult({ ...lastResult, streak });
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2500); }
  };

  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex flex-col">
      <Confetti trigger={showConfetti} type={lastResult.perfect ? 'celebration' : 'subtle'} />

      {/* Header */}
      <header className="flex items-center justify-between px-5 pt-safe pt-5 pb-3 border-b border-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="18" r="12" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="19" cy="17" r="5" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round"/>
            <line x1="23" y1="21" x2="27" y2="25" stroke="#4ADE80" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <span className="font-black text-[#F0F0F0] tracking-tight">DEDUCE</span>
        </div>
        <button onClick={() => router.push('/home')}
          className="text-xs text-[#555] hover:text-[#F0F0F0] transition-colors">
          Home
        </button>
      </header>

      <motion.div variants={stagger} initial="hidden" animate="show"
        className="flex-1 overflow-y-auto px-5 py-6 space-y-4 pb-safe pb-10">

        {/* ── Score hero ──────────────────────────────────────────── */}
        <motion.div variants={fadeUp}
          className="relative rounded-3xl overflow-hidden border border-[#242424] text-center py-10 px-6"
          style={{ background: 'linear-gradient(160deg, #111 0%, #0D1A10 100%)' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(circle at 50% 0%, rgba(74,222,128,0.08) 0%, transparent 60%)' }} />

          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring' as const, stiffness: 280, damping: 18, delay: 0.2 }}
            className="text-6xl mb-4"
          >
            {lastResult.perfect ? '🏆' : isDaily ? '🔍' : '⏱'}
          </motion.div>

          <p className="text-[#4ADE80] text-xs font-bold uppercase tracking-[0.2em] mb-2">
            {lastResult.perfect ? 'Perfect Solve!' : isDaily ? 'Case Solved' : 'Time Attack'}
          </p>

          <div className="text-5xl font-black text-[#F0F0F0] mb-1">
            <AnimatedNumber value={breakdown.total} duration={1400} />
          </div>
          <p className="text-[#555] text-sm">points</p>

          {!isDaily && (
            <div className="mt-4 inline-flex items-center gap-2 bg-[#4ADE80]/10 border border-[#4ADE80]/20 rounded-2xl px-5 py-2">
              <span className="text-3xl font-black text-[#4ADE80]">{lastResult.timeAttackSolved ?? 0}</span>
              <span className="text-sm text-[#888]">puzzles in 60s</span>
            </div>
          )}
        </motion.div>

        {/* ── Verdict (daily only) ─────────────────────────────────── */}
        {isDaily && caseData && (
          <motion.div variants={fadeUp}
            className="rounded-2xl border border-[#242424] bg-[#161616] p-5">
            <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-4">
              The Verdict — {caseData.title}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {VERDICT_ITEMS.map(({ key, label, icon, color }, i) => (
                <motion.div key={key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.08, type: 'spring' as const, stiffness: 260, damping: 20 }}
                  className="rounded-xl bg-[#0A0A0A] border border-[#1E1E1E] p-3"
                >
                  <p className="text-[10px] text-[#555] mb-1.5">{icon} {label}</p>
                  <p className="text-sm font-black" style={{ color }}>
                    {caseData.solution[key]}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Score breakdown ──────────────────────────────────────── */}
        <motion.div variants={fadeUp}
          className="rounded-2xl border border-[#242424] bg-[#161616] p-5">
          <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.2em] mb-4">Score Breakdown</p>
          <div className="space-y-2.5">
            {[
              { label: 'Base score',                     value: `+${breakdown.base}`,           dim: false, red: false, green: false },
              { label: `Time  (${formatTime(lastResult.timeSeconds)})`, value: `+${breakdown.timeBonus}`, dim: false, red: false, green: false },
              { label: `Mistakes ×${lastResult.mistakes}`, value: `-${breakdown.mistakePenalty}`, dim: false, red: breakdown.mistakePenalty > 0, green: false },
              ...(breakdown.perfectBonus > 0 ? [{ label: 'Perfect bonus', value: `+${breakdown.perfectBonus}`, dim: false, red: false, green: true }] : []),
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="text-[#888]">{row.label}</span>
                <span className={row.green ? 'text-[#4ADE80] font-bold' : row.red ? 'text-[#F87171]' : 'text-[#D0D0D0]'}>
                  {row.value}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-[#1E1E1E] font-bold">
              <span className="text-[#F0F0F0]">Total</span>
              <span className="text-[#4ADE80] text-lg">{breakdown.total.toLocaleString()}</span>
            </div>
          </div>
        </motion.div>

        {/* ── Stats row ────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2">
          {[
            { label: 'Time',     value: formatTime(lastResult.timeSeconds), color: '#FB923C' },
            { label: 'Mistakes', value: String(lastResult.mistakes),        color: lastResult.mistakes === 0 ? '#4ADE80' : '#F87171' },
            { label: 'Streak',   value: `${streak}🔥`,                      color: '#FB923C' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl border border-[#1E1E1E] bg-[#111] p-3.5 text-center">
              <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] text-[#555] mt-0.5 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* ── Share preview ────────────────────────────────────────── */}
        <motion.div variants={fadeUp}
          className="rounded-2xl border border-[#1E1E1E] bg-[#111] p-4">
          <pre className="text-xs text-[#555] font-mono whitespace-pre-wrap leading-relaxed">
            {generateShareText({ ...lastResult, streak })}
          </pre>
        </motion.div>

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <Button fullWidth size="xl" glow onClick={handleShare}>
            {copied ? '✓ Copied to clipboard!' : '📤 Share Result'}
          </Button>
          <Button variant="secondary" fullWidth size="lg" onClick={() => router.push('/home')}>
            Back to Home
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
