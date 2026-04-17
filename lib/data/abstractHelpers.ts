import type { AbstractPuzzle, AbstractPuzzleType, AbstractDifficulty } from '@/types/abstract';
import {
  RULE_SHIFT_PUZZLES,
  SWAP_LOGIC_PUZZLES,
  BINARY_DECISION_PUZZLES,
  SET_LOGIC_PUZZLES,
} from './abstractPuzzles';

const POOLS: Record<AbstractPuzzleType, AbstractPuzzle[]> = {
  ruleShift:      RULE_SHIFT_PUZZLES,
  swapLogic:      SWAP_LOGIC_PUZZLES,
  binaryDecision: BINARY_DECISION_PUZZLES,
  setLogic:       SET_LOGIC_PUZZLES,
};

function filterByDifficulty(puzzles: AbstractPuzzle[], difficulty: AbstractDifficulty) {
  return puzzles.filter(p => p.difficulty === difficulty);
}

/** Seeded daily pick — same puzzle every day per type+difficulty combo */
export function getDailyAbstractPuzzles(difficulty: AbstractDifficulty): AbstractPuzzle[] {
  const seed = Math.floor(Date.now() / 86_400_000);
  const types: AbstractPuzzleType[] = ['ruleShift', 'swapLogic', 'binaryDecision', 'setLogic'];
  return types.map(type => {
    const pool = filterByDifficulty(POOLS[type], difficulty);
    return pool[seed % pool.length];
  });
}

/** Fisher-Yates shuffled pool for time attack */
export function getAbstractPool(type: AbstractPuzzleType, difficulty: AbstractDifficulty): AbstractPuzzle[] {
  const pool = [...filterByDifficulty(POOLS[type], difficulty)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
