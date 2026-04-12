'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DailyGameState, GameResult, PuzzleType, TimeAttackState } from '@/types';
import { getTodayKey } from '@/lib/data/cases';

// ─── Streak ───────────────────────────────────────────────────────────────────

interface StreakState {
  streak: number;
  lastPlayedDate: string | null;
  totalSolved: number;
  bestScore: number;
}

// ─── Full Store ───────────────────────────────────────────────────────────────

interface GameStore extends StreakState {
  // Daily
  daily: DailyGameState | null;
  initDaily: (caseId: number) => void;
  solvePuzzle: (index: number) => void;
  addMistake: (index: number) => void;
  completeDailyCase: (score: number) => void;

  // Time Attack
  timeAttack: TimeAttackState | null;
  startTimeAttack: (type: PuzzleType) => void;
  incrementSolved: () => void;
  addTimeAttackMistake: () => void;
  endTimeAttack: (score: number) => void;

  // Result
  lastResult: GameResult | null;
  setLastResult: (r: GameResult) => void;

  // Streak utils
  checkAndUpdateStreak: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Streak
      streak: 0,
      lastPlayedDate: null,
      totalSolved: 0,
      bestScore: 0,

      // Daily
      daily: null,
      initDaily: (caseId) => {
        const today = getTodayKey();
        const existing = get().daily;
        // Don't reinitialize if same case today
        if (existing && existing.date === today && existing.caseId === caseId) return;

        set({
          daily: {
            caseId,
            date: today,
            startedAt: null,
            completedAt: null,
            puzzles: [
              { type: 'linkGrid', status: 'active', mistakes: 0 },
              { type: 'timeTrace', status: 'locked', mistakes: 0 },
              { type: 'trueLie', status: 'locked', mistakes: 0 },
              { type: 'codeBreak', status: 'locked', mistakes: 0 },
            ],
            totalMistakes: 0,
            score: null,
          },
        });
      },
      solvePuzzle: (index) => {
        const state = get().daily;
        if (!state) return;
        const puzzles = [...state.puzzles];
        puzzles[index] = { ...puzzles[index], status: 'solved', solvedAt: Date.now() };
        if (index + 1 < puzzles.length) {
          puzzles[index + 1] = { ...puzzles[index + 1], status: 'active' };
        }
        const startedAt = state.startedAt ?? Date.now();
        set({ daily: { ...state, puzzles, startedAt } });
      },
      addMistake: (index) => {
        const state = get().daily;
        if (!state) return;
        const puzzles = [...state.puzzles];
        puzzles[index] = { ...puzzles[index], mistakes: puzzles[index].mistakes + 1 };
        set({
          daily: {
            ...state,
            puzzles,
            totalMistakes: state.totalMistakes + 1,
            startedAt: state.startedAt ?? Date.now(),
          },
        });
      },
      completeDailyCase: (score) => {
        const state = get().daily;
        if (!state) return;
        const now = Date.now();
        set({
          daily: { ...state, completedAt: now, score },
          totalSolved: get().totalSolved + 1,
          bestScore: Math.max(get().bestScore, score),
        });
        get().checkAndUpdateStreak();
      },

      // Time Attack
      timeAttack: null,
      startTimeAttack: (type) => {
        set({
          timeAttack: {
            puzzleType: type,
            solved: 0,
            mistakes: 0,
            startedAt: Date.now(),
            endedAt: null,
            score: null,
          },
        });
      },
      incrementSolved: () => {
        const ta = get().timeAttack;
        if (!ta) return;
        set({ timeAttack: { ...ta, solved: ta.solved + 1 } });
      },
      addTimeAttackMistake: () => {
        const ta = get().timeAttack;
        if (!ta) return;
        set({ timeAttack: { ...ta, mistakes: ta.mistakes + 1 } });
      },
      endTimeAttack: (score) => {
        const ta = get().timeAttack;
        if (!ta) return;
        set({
          timeAttack: { ...ta, endedAt: Date.now(), score },
          bestScore: Math.max(get().bestScore, score),
        });
      },

      // Result
      lastResult: null,
      setLastResult: (r) => set({ lastResult: r }),

      // Streak
      checkAndUpdateStreak: () => {
        const today = getTodayKey();
        const last = get().lastPlayedDate;
        const streak = get().streak;

        if (last === today) return; // Already counted today

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split('T')[0];

        const newStreak = last === yesterdayKey ? streak + 1 : 1;
        set({ streak: newStreak, lastPlayedDate: today });
      },
    }),
    {
      name: 'deduce-game',
      partialize: (s) => ({
        streak: s.streak,
        lastPlayedDate: s.lastPlayedDate,
        totalSolved: s.totalSolved,
        bestScore: s.bestScore,
        daily: s.daily,
        lastResult: s.lastResult,
      }),
    },
  ),
);
