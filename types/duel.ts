import type { AbstractPuzzleType, AbstractDifficulty } from './abstract';
import type { PuzzleType } from './index';

export type DuelPuzzleType = AbstractPuzzleType | PuzzleType;
export type DuelCategory = 'abstract' | 'detective';

export interface DuelPlayer {
  uid: string;
  displayName: string;
  photoURL: string | null;
  isGuest: boolean;
  solved: number;
  mistakes: number;
  score: number;
  finished: boolean;
  finishedAt: number | null;
}

export interface Duel {
  id: string;
  type: DuelPuzzleType;
  difficulty: string;               // 'easy'|'medium'|'hard' for abstract; 'beginner'|'intermediate'|'hard' for detective
  puzzleCategory: DuelCategory;
  status: 'waiting' | 'starting' | 'finished';
  duration: number;                 // seconds (90)
  createdAt: number;                // epoch ms
  startAt: number | null;           // epoch ms, null while waiting
  winnerId: string | null;
  isTie: boolean;
  inviteCode: string | null;        // null = quick match, 6-char code = private room
  players: Record<string, DuelPlayer>;
}
