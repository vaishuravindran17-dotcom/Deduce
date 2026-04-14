// ─── Abstract Logic Puzzle Types ─────────────────────────────────────────────

export type AbstractPuzzleType = 'ruleShift' | 'swapLogic' | 'binaryDecision' | 'setLogic';
export type AbstractDifficulty = 'easy' | 'medium' | 'hard';

// ─── Per-type Data Shapes ─────────────────────────────────────────────────────

export interface RuleShiftData {
  /** The worked examples shown to the player */
  examples: { input: string; output: string }[];
  /** The word / item the player must solve */
  target: string;
}

export interface SwapLogicData {
  /** Starting order of items */
  initial: string[];
  /** Human-readable swap steps, e.g. "Swap Pizza & Pasta" */
  steps: string[];
}

export interface BinaryDecisionData {
  /** List of conditions/facts; last one is the trigger fact */
  conditions: string[];
}

export interface SetLogicData {
  /** Logical premises using all / some / no */
  premises: string[];
}

export type AbstractPuzzleData =
  | RuleShiftData
  | SwapLogicData
  | BinaryDecisionData
  | SetLogicData;

// ─── Unified Puzzle Shape ─────────────────────────────────────────────────────

export interface AbstractPuzzle {
  id: string;
  type: AbstractPuzzleType;
  difficulty: AbstractDifficulty;
  /** Short display text / prompt shown above options */
  question: string;
  data: AbstractPuzzleData;
  /** Exactly 4 option strings */
  options: string[];
  /** Must match one of options exactly */
  answer: string;
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export interface AbstractTypeMeta {
  label: string;
  description: string;
  color: string;
  emoji: string;
}

export const ABSTRACT_TYPE_META: Record<AbstractPuzzleType, AbstractTypeMeta> = {
  ruleShift: {
    label: 'RuleShift',
    description: 'Find the transformation rule',
    color: '#60A5FA',
    emoji: '⟿',
  },
  swapLogic: {
    label: 'SwapLogic',
    description: 'Track the swaps',
    color: '#34D399',
    emoji: '⇌',
  },
  binaryDecision: {
    label: 'BinaryDecision',
    description: 'Follow the logic chain',
    color: '#FBBF24',
    emoji: '⊢',
  },
  setLogic: {
    label: 'SetLogic',
    description: 'Reason with sets',
    color: '#F87171',
    emoji: '∈',
  },
};

export const ABSTRACT_PUZZLE_TYPES: AbstractPuzzleType[] = [
  'ruleShift',
  'swapLogic',
  'binaryDecision',
  'setLogic',
];
