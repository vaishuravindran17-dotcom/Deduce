'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LinkGridPuzzle } from '@/types';

type CellState = 'empty' | 'cross' | 'check';
const CYCLE: Record<CellState, CellState> = { empty: 'cross', cross: 'check', check: 'empty' };

interface LinkGridProps {
  puzzle: LinkGridPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function LinkGrid({ puzzle, onSolve, onMistake }: LinkGridProps) {
  const { people, categoryA, categoryB, clues, question, answer } = puzzle;

  const [gridA, setGridA] = useState<CellState[][]>(() => people.map(() => categoryA.map(() => 'empty')));
  const [gridB, setGridB] = useState<CellState[][]>(() => people.map(() => categoryB.map(() => 'empty')));
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected]   = useState<string | null>(null);
  const [shake, setShake]         = useState(false);

  const tap = (
    grid: CellState[][],
    setGrid: React.Dispatch<React.SetStateAction<CellState[][]>>,
    row: number, col: number,
  ) => {
    if (submitted) return;
    setGrid(prev => prev.map((r, ri) => r.map((c, ci) => ri === row && ci === col ? CYCLE[c] : c)));
  };

  const handleSubmit = () => {
    if (!selected) return;
    setSubmitted(true);
    if (selected === answer) {
      onSolve();
    } else {
      setShake(true);
      onMistake();
      setTimeout(() => { setShake(false); setSubmitted(false); setSelected(null); }, 800);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">

      {/* ── Clues ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1E1E1E] p-4">
        <p className="text-[10px] font-bold text-[#A78BFA] uppercase tracking-[0.2em] mb-3">Clues</p>
        <ul className="space-y-2.5">
          {clues.map((clue, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-[#D0D0D0]"
            >
              <span className="text-[#A78BFA] shrink-0 font-black leading-5">›</span>
              {clue}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* ── Grid A ─────────────────────────────────────────────────── */}
      <GridTable
        label="People × Locations"
        color="#A78BFA"
        rows={people} cols={categoryA} cells={gridA}
        onTap={(r,c) => tap(gridA, setGridA, r, c)}
        disabled={submitted}
      />

      {/* ── Grid B ─────────────────────────────────────────────────── */}
      <GridTable
        label="People × Items"
        color="#A78BFA"
        rows={people} cols={categoryB} cells={gridB}
        onTap={(r,c) => tap(gridB, setGridB, r, c)}
        disabled={submitted}
      />

      {/* ── Answer selection ────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1E1E1E] p-4">
        <p className="text-sm font-bold text-white mb-3">{question}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {people.map(person => (
            <motion.button
              key={person}
              whileTap={{ scale: 0.92 }}
              onClick={() => !submitted && setSelected(person)}
              className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={
                selected === person
                  ? { background: '#A78BFA20', border: '1.5px solid #A78BFA', color: '#A78BFA' }
                  : { background: '#252525', border: '1.5px solid transparent', color: '#888' }
              }
            >
              {person}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {shake && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-[#F87171] mb-3 text-center"
            >
              Not quite — review the clues again
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-30"
          style={{
            background: selected ? '#A78BFA' : '#252525',
            color: selected ? '#141414' : '#444',
          }}
        >
          Confirm Answer
        </button>
      </div>
    </div>
  );
}

function GridTable({ label, color, rows, cols, cells, onTap, disabled }: {
  label: string; color: string;
  rows: string[]; cols: string[]; cells: CellState[][];
  onTap: (r: number, c: number) => void; disabled: boolean;
}) {
  return (
    <div className="rounded-2xl bg-[#1E1E1E] p-4 overflow-x-auto">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color }}>{label}</p>
      <table className="w-full border-collapse min-w-[220px]">
        <thead>
          <tr>
            <th className="w-20" />
            {cols.map(col => (
              <th key={col} className="text-[10px] text-[#555] font-semibold pb-2 text-center px-1 min-w-[44px]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row}>
              <td className="text-xs text-[#CCC] py-1 pr-2 font-semibold whitespace-nowrap">{row}</td>
              {cols.map((_, ci) => (
                <td key={ci} className="p-1 text-center">
                  <motion.button
                    whileTap={{ scale: 0.8 }}
                    onClick={() => !disabled && onTap(ri, ci)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black transition-all"
                    style={
                      cells[ri][ci] === 'check'
                        ? { background: '#A78BFA20', border: '2px solid #A78BFA', color: '#A78BFA' }
                        : cells[ri][ci] === 'cross'
                        ? { background: '#F8717120', border: '2px solid #F87171', color: '#F87171' }
                        : { background: '#252525', border: '2px solid transparent', color: '#333' }
                    }
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
