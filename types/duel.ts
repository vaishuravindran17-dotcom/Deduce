import type { AbstractPuzzleType, AbstractDifficulty } from './abstract';

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
  type: AbstractPuzzleType;
  difficulty: AbstractDifficulty;
  /** waiting = no opponent yet · starting = countdown running · finished = both done */
  status: 'waiting' | 'starting' | 'finished';
  duration: number;       // seconds
  createdAt: number;      // epoch ms
  startAt: number | null; // epoch ms, null while waiting
  winnerId: string | null;
  isTie: boolean;
  players: Record<string, DuelPlayer>;
}
