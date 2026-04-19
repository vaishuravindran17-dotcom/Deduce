import type { PuzzleType, LinkGridPuzzle, TimeTracePuzzle, TrueLiePuzzle, CodeBreakPuzzle } from '@/types';
import { LINK_GRID_POOL, TIME_TRACE_POOL, TRUE_LIE_POOL, CODE_BREAK_POOL } from './puzzlePools';
import {
  LINK_GRID_INTERMEDIATE, TIME_TRACE_INTERMEDIATE, TRUE_LIE_INTERMEDIATE, CODE_BREAK_INTERMEDIATE,
  LINK_GRID_HARD, TIME_TRACE_HARD, TRUE_LIE_HARD, CODE_BREAK_HARD,
} from './puzzlePoolsAdvanced';

export type DetectivePuzzle = LinkGridPuzzle | TimeTracePuzzle | TrueLiePuzzle | CodeBreakPuzzle;

function getPool(type: PuzzleType, difficulty: string): DetectivePuzzle[] {
  if (difficulty === 'intermediate') {
    if (type === 'linkGrid')  return LINK_GRID_INTERMEDIATE;
    if (type === 'timeTrace') return TIME_TRACE_INTERMEDIATE;
    if (type === 'trueLie')   return TRUE_LIE_INTERMEDIATE;
    return CODE_BREAK_INTERMEDIATE;
  }
  if (difficulty === 'hard') {
    if (type === 'linkGrid')  return LINK_GRID_HARD;
    if (type === 'timeTrace') return TIME_TRACE_HARD;
    if (type === 'trueLie')   return TRUE_LIE_HARD;
    return CODE_BREAK_HARD;
  }
  // beginner / default
  if (type === 'linkGrid')  return LINK_GRID_POOL;
  if (type === 'timeTrace') return TIME_TRACE_POOL;
  if (type === 'trueLie')   return TRUE_LIE_POOL;
  return CODE_BREAK_POOL;
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const pool = [...arr];
  let h = 5381;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(h, 33) ^ seed.charCodeAt(i)) >>> 0;
  }
  const rand = () => {
    h = (Math.imul(1664525, h) + 1013904223) >>> 0;
    return h / 4294967296;
  };
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}

/** Deterministic shuffle seeded by duelId — both players get the same puzzle order */
export function getDuelDetectivePuzzles(
  type: PuzzleType,
  difficulty: string,
  duelId: string,
): DetectivePuzzle[] {
  return seededShuffle(getPool(type, difficulty), duelId);
}
