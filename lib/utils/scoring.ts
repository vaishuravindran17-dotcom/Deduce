import type { ScoreBreakdown } from '@/types';

const BASE_SCORE = 1000;
const MISTAKE_PENALTY = 50;
const PERFECT_BONUS = 300;
const MAX_TIME_BONUS = 500;
const REFERENCE_TIME = 120; // seconds — par time for a daily case

/**
 * Calculate score for a completed daily case.
 */
export function calculateDailyScore(
  timeSeconds: number,
  mistakes: number,
): ScoreBreakdown {
  const base = BASE_SCORE;
  const timeBonus = Math.max(
    0,
    Math.round(MAX_TIME_BONUS * (1 - timeSeconds / (REFERENCE_TIME * 3))),
  );
  const mistakePenalty = mistakes * MISTAKE_PENALTY;
  const perfectBonus = mistakes === 0 ? PERFECT_BONUS : 0;
  const total = Math.max(0, base + timeBonus - mistakePenalty + perfectBonus);

  return { base, timeBonus, mistakePenalty, perfectBonus, total };
}

/**
 * Calculate score for time attack mode.
 * Score = solved * 200 + time bonus (if finished under 60s)
 */
export function calculateTimeAttackScore(
  solved: number,
  timeUsedSeconds: number,
  mistakes: number,
): ScoreBreakdown {
  const base = solved * 200;
  const timeBonus = 0; // Not applicable for time attack
  const mistakePenalty = mistakes * MISTAKE_PENALTY;
  const perfectBonus = mistakes === 0 && solved > 0 ? PERFECT_BONUS : 0;
  const total = Math.max(0, base - mistakePenalty + perfectBonus);

  return { base, timeBonus, mistakePenalty, perfectBonus, total };
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function formatScore(score: number): string {
  return score.toLocaleString();
}
