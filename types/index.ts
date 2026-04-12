// ─── Puzzle Types ────────────────────────────────────────────────────────────

export type PuzzleType = 'linkGrid' | 'timeTrace' | 'trueLie' | 'codeBreak';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type GameMode = 'daily' | 'timeAttack';

// ─── Puzzle Data Shapes ───────────────────────────────────────────────────────

export interface LinkGridPuzzle {
  people: string[];
  categoryA: string[];
  categoryB: string[];
  clues: string[];
  question: string;
  answer: string;
}

export interface TimeTracePuzzle {
  slots: string[];
  entities: string[];
  clues: string[];
  question?: string;
  answer: string;
}

export interface TrueLiePuzzle {
  statements: { person: string; text: string }[];
  question?: string;
  answer: string;
}

export interface CodeBreakPuzzle {
  clues: { guess: string; hint: string }[];
  answer: string;
}

export interface CasePuzzles {
  linkGrid: LinkGridPuzzle;
  timeTrace: TimeTracePuzzle;
  trueLie: TrueLiePuzzle;
  codeBreak: CodeBreakPuzzle;
}

// ─── Case Structure ───────────────────────────────────────────────────────────

export interface CaseSolution {
  culprit: string;
  time: string;
  location: string;
  code: string;
}

export interface Case {
  id: number;
  title: string;
  difficulty: Difficulty;
  puzzles: CasePuzzles;
  solution: CaseSolution;
}

// ─── Puzzle State ─────────────────────────────────────────────────────────────

export type PuzzleStatus = 'locked' | 'active' | 'solved';

export interface PuzzleProgress {
  type: PuzzleType;
  status: PuzzleStatus;
  mistakes: number;
  solvedAt?: number; // timestamp
}

// ─── Game State ───────────────────────────────────────────────────────────────

export interface DailyGameState {
  caseId: number;
  date: string;           // YYYY-MM-DD
  startedAt: number | null;
  completedAt: number | null;
  puzzles: PuzzleProgress[];
  totalMistakes: number;
  score: number | null;
}

export interface TimeAttackState {
  puzzleType: PuzzleType;
  solved: number;
  mistakes: number;
  startedAt: number | null;
  endedAt: number | null;
  score: number | null;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface DeduceUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isGuest: boolean;
}

export interface UserStats {
  streak: number;
  lastPlayedDate: string | null;
  totalSolved: number;
  bestScore: number;
  averageTime: number;
}

// ─── Result ───────────────────────────────────────────────────────────────────

export interface PuzzleResult {
  type: PuzzleType;
  solved: boolean;
  mistakes: number;
  timeSeconds: number;
}

export interface GameResult {
  mode: GameMode;
  caseId?: number;
  caseTitle?: string;
  puzzleType?: PuzzleType; // for time attack
  score: number;
  timeSeconds: number;
  mistakes: number;
  perfect: boolean;
  puzzleResults?: PuzzleResult[];
  timeAttackSolved?: number;
  streak?: number;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

export interface ScoreBreakdown {
  base: number;
  timeBonus: number;
  mistakePenalty: number;
  perfectBonus: number;
  total: number;
}
