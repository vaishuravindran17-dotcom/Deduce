'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LinkGridPuzzle } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type CellState = 'empty' | 'cross' | 'check';
const CYCLE: Record<CellState, CellState> = { empty: 'cross', cross: 'check', check: 'empty' };

interface LinkGridProps {
  puzzle: LinkGridPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function LinkGrid({ puzzle, onSolve, onMistake }: LinkGridProps) {
  const { people, categoryA, categoryB, clues, question, answer } = puzzle;

  // Grid A: people × categoryA
  const [gridA, setGridA] = useState<CellState[][]>(() =>
    people.map(() => categoryA.map(() => 'empty')),
  );
  // Grid B: people × categoryB
  const [gridB, setGridB] = useState<CellState[][]>(() =>
    people.map(() => categoryB.map(() => 'empty')),
  );

  const [submitted, setSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const tap = (
    grid: CellState[][],
    setGrid: React.Dispatch<React.SetStateAction<CellState[][]>>,
    row: number,
    col: number,
  ) => {
    if (submitted) return;
    const next = grid.map((r, ri) =>
      r.map((c, ci) => {
        if (ri === row && ci === col) return CYCLE[c];
        return c;
      }),
    );
    setGrid(next);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;
    setSubmitted(true);
    if (selectedAnswer === answer) {
      onSolve();
    } else {
      setShake(true);
      onMistake();
      setTimeout(() => {
        setShake(false);
        setSubmitted(false);
        setSelectedAnswer(null);
      }, 800);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Clues */}
      <Card compact>
        <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-2">Clues</p>
        <ul className="space-y-1.5">
          {clues.map((clue, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#EAEAEA]">
              <span className="text-[#4ADE80] mt-0.5 shrink-0">›</span>
              {clue}
            </li>
          ))}
        </ul>
      </Card>

      {/* Grid A: people × locations */}
      <Card compact>
        <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
          People × Locations
        </p>
        <Grid
          rows={people}
          cols={categoryA}
          cells={gridA}
          onTap={(r, c) => tap(gridA, setGridA, r, c)}
          disabled={submitted}
        />
      </Card>

      {/* Grid B: people × items */}
      <Card compact>
        <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-3">
          People × Items
        </p>
        <Grid
          rows={people}
          cols={categoryB}
          cells={gridB}
          onTap={(r, c) => tap(gridB, setGridB, r, c)}
          disabled={submitted}
        />
      </Card>

      {/* Question & answer selection */}
      <Card>
        <p className="text-sm text-[#EAEAEA] font-medium mb-3">{question}</p>
        <div className="flex flex-wrap gap-2">
          {people.map((person) => (
            <motion.button
              key={person}
              whileTap={{ scale: 0.95 }}
              onClick={() => !submitted && setSelectedAnswer(person)}
              className={[
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                selectedAnswer === person
                  ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80]'
                  : 'border-[#2A2A2A] text-[#9A9A9A] hover:border-[#4ADE80]/40 hover:text-[#EAEAEA]',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {person}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {shake && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[#F87171] mt-3"
            >
              Not quite — review the clues again
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          fullWidth
          className="mt-4"
        >
          Submit Answer
        </Button>
      </Card>
    </div>
  );
}

// ─── Reusable grid sub-component ──────────────────────────────────────────────

function Grid({
  rows,
  cols,
  cells,
  onTap,
  disabled,
}: {
  rows: string[];
  cols: string[];
  cells: CellState[][];
  onTap: (row: number, col: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="overflow-x-auto -mx-1">
      <table className="w-full border-collapse min-w-[280px]">
        <thead>
          <tr>
            <th className="w-20" />
            {cols.map((col) => (
              <th
                key={col}
                className="text-[10px] text-[#9A9A9A] font-medium pb-2 text-center px-1"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row}>
              <td className="text-xs text-[#EAEAEA] py-1 pr-2 font-medium whitespace-nowrap">
                {row}
              </td>
              {cols.map((_, ci) => (
                <td key={ci} className="p-0.5 text-center">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => !disabled && onTap(ri, ci)}
                    className={[
                      'w-9 h-9 rounded-lg border text-base font-bold transition-all',
                      cells[ri][ci] === 'check'
                        ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80]'
                        : cells[ri][ci] === 'cross'
                        ? 'bg-[#F87171]/5 border-[#F87171]/40 text-[#F87171]'
                        : 'border-[#2A2A2A] text-[#2A2A2A] hover:border-[#9A9A9A]',
                      disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={`${row} × ${cols[ci]}: ${cells[ri][ci]}`}
                  >
                    {cells[ri][ci] === 'check' ? '✓' : cells[ri][ci] === 'cross' ? '✕' : ''}
                  </motion.button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
