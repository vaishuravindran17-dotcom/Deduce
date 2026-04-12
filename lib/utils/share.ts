import type { GameResult } from '@/types';
import { formatTime } from './scoring';

const PUZZLE_EMOJIS: Record<string, string> = {
  linkGrid: '🟩',
  timeTrace: '🟨',
  trueLie: '🟦',
  codeBreak: '🟪',
};

export function generateShareText(result: GameResult): string {
  const lines: string[] = [];

  if (result.mode === 'daily') {
    lines.push(`Deduce #${result.caseId}`);
    lines.push('');

    // Puzzle row
    if (result.puzzleResults) {
      const row = result.puzzleResults
        .map((p) => {
          if (!p.solved) return '⬛';
          if (p.mistakes === 0) return PUZZLE_EMOJIS[p.type] ?? '🟩';
          return '🟧';
        })
        .join('');
      lines.push(row);
    }

    lines.push('');
    lines.push(`⏱ ${formatTime(result.timeSeconds)}`);
    if ((result.streak ?? 0) > 0) lines.push(`🔥 Streak: ${result.streak}`);
    lines.push(`✨ Score: ${result.score.toLocaleString()}`);
  } else {
    lines.push(`Deduce – Time Attack`);
    lines.push('');
    lines.push(`Solved ${result.timeAttackSolved} puzzles in 60s`);
    lines.push(`✨ Score: ${result.score.toLocaleString()}`);
    if ((result.streak ?? 0) > 0) lines.push(`🔥 Streak: ${result.streak}`);
  }

  return lines.join('\n');
}

export async function shareResult(result: GameResult): Promise<boolean> {
  const text = generateShareText(result);

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      // User cancelled or not supported
    }
  }

  // Fallback: clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
