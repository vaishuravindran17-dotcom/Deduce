'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useGameStore } from '@/lib/store/gameStore';
import { getCaseById } from '@/lib/data/cases';
import { PUZZLE_META } from '@/lib/data/cases';
import { formatTime, formatScore, calculateDailyScore, calculateTimeAttackScore } from '@/lib/utils/scoring';
import { shareResult, generateShareText } from '@/lib/utils/share';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TrophyIcon, FlameIcon, DeduceLogoMark } from '@/components/ui/SketchIllustration';
import type { PuzzleType } from '@/types';

const PUZZLE_ROW_COLORS: Record<PuzzleType, string> = {
  linkGrid: '#818CF8',
  timeTrace: '#FB923C',
  trueLie: '#F472B6',
  codeBreak: '#4ADE80',
};

export default function ResultPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { lastResult, streak, daily } = useGameStore();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) router.replace('/auth');
  }, [user, router]);

  if (!user || !lastResult) {
    return (
      <div className="min-h-dvh bg-[#0D0D0D] flex flex-col items-center justify-center gap-4 px-6">
        <p className="text-[#9A9A9A] text-sm">No result to show.</p>
        <Button onClick={() => router.push('/home')}>Go Home</Button>
      </div>
    );
  }

  const isDaily = lastResult.mode === 'daily';
  const caseData = isDaily && lastResult.caseId ? getCaseById(lastResult.caseId) : null;

  const breakdown = isDaily
    ? calculateDailyScore(lastResult.timeSeconds, lastResult.mistakes)
    : calculateTimeAttackScore(lastResult.timeAttackSolved ?? 0, lastResult.timeSeconds, lastResult.mistakes);

  const handleShare = async () => {
    const ok = await shareResult(lastResult);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-dvh bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-safe pt-5 pb-4 border-b border-[#2A2A2A]">
        <div className="flex items-center gap-2">
          <DeduceLogoMark size={24} />
          <span className="text-[#EAEAEA] font-bold">Deduce</span>
        </div>
        <button
          onClick={() => router.push('/home')}
          className="text-xs text-[#9A9A9A] hover:text-[#EAEAEA] transition-colors"
        >
          Home
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 pb-10">

        {/* Trophy + score hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3 pt-4 pb-2"
        >
          <TrophyIcon size={64} color={lastResult.perfect ? '#4ADE80' : '#9A9A9A'} />
          <div className="text-center">
            <p className="text-[#9A9A9A] text-xs uppercase tracking-widest mb-1">
              {lastResult.perfect ? 'Perfect Solve!' : isDaily ? 'Case Solved' : 'Time Attack'}
            </p>
            <p className="text-4xl font-bold text-[#EAEAEA]">
              {formatScore(lastResult.score)}
            </p>
            <p className="text-[#9A9A9A] text-xs mt-1">points</p>
          </div>
        </motion.div>

        {/* Case solution reveal (daily only) */}
        {isDaily && caseData && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card glow>
              <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
                The Verdict — {caseData.title}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Culprit', value: caseData.solution.culprit, icon: '🕵️' },
                  { label: 'Time', value: caseData.solution.time, icon: '🕐' },
                  { label: 'Location', value: caseData.solution.location, icon: '📍' },
                  { label: 'Code', value: caseData.solution.code, icon: '🔐' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl bg-[#0D0D0D] border border-[#2A2A2A] p-3"
                  >
                    <p className="text-[10px] text-[#9A9A9A] mb-1">{item.icon} {item.label}</p>
                    <p className="text-sm font-semibold text-[#4ADE80]">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Time attack result */}
        {!isDaily && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card>
              <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
                Time Attack — {lastResult.puzzleType ? PUZZLE_META[lastResult.puzzleType]?.label : ''}
              </p>
              <div className="flex items-center justify-center py-4">
                <div className="text-center">
                  <p className="text-5xl font-bold text-[#4ADE80]">
                    {lastResult.timeAttackSolved ?? 0}
                  </p>
                  <p className="text-sm text-[#9A9A9A] mt-1">puzzles solved in 60s</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Score breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <Card compact>
            <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
              Score Breakdown
            </p>
            <div className="space-y-2">
              {[
                { label: 'Base score', value: `+${breakdown.base}` },
                { label: `Time (${formatTime(lastResult.timeSeconds)})`, value: `+${breakdown.timeBonus}` },
                { label: `Mistakes (×${lastResult.mistakes})`, value: `-${breakdown.mistakePenalty}`, negative: breakdown.mistakePenalty > 0 },
                ...(breakdown.perfectBonus > 0 ? [{ label: 'Perfect bonus', value: `+${breakdown.perfectBonus}`, highlight: true }] : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="text-[#9A9A9A]">{row.label}</span>
                  <span
                    className={
                      'highlight' in row && row.highlight
                        ? 'text-[#4ADE80] font-semibold'
                        : 'negative' in row && row.negative
                        ? 'text-[#F87171]'
                        : 'text-[#EAEAEA]'
                    }
                  >
                    {row.value}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-[#2A2A2A] text-sm font-semibold">
                <span className="text-[#EAEAEA]">Total</span>
                <span className="text-[#4ADE80]">{formatScore(breakdown.total)}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="grid grid-cols-3 gap-2"
        >
          <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-3 text-center">
            <p className="text-sm font-bold text-[#EAEAEA]">{formatTime(lastResult.timeSeconds)}</p>
            <p className="text-[10px] text-[#9A9A9A] mt-0.5">Time</p>
          </div>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-3 text-center">
            <p className="text-sm font-bold text-[#EAEAEA]">{lastResult.mistakes}</p>
            <p className="text-[10px] text-[#9A9A9A] mt-0.5">Mistakes</p>
          </div>
          <div className="rounded-xl border border-[#2A2A2A] bg-[#161616] p-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <FlameIcon size={14} color="#FB923C" />
              <p className="text-sm font-bold text-[#EAEAEA]">{streak}</p>
            </div>
            <p className="text-[10px] text-[#9A9A9A] mt-0.5">Streak</p>
          </div>
        </motion.div>

        {/* Share box */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <Card compact className="bg-[#161616]">
            <pre className="text-xs text-[#9A9A9A] font-mono whitespace-pre-wrap leading-relaxed">
              {generateShareText({ ...lastResult, streak })}
            </pre>
          </Card>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Button fullWidth size="lg" onClick={handleShare}>
            {copied ? '✓ Copied!' : 'Share Result'}
          </Button>
          <Button variant="secondary" fullWidth onClick={() => router.push('/home')}>
            Back to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
