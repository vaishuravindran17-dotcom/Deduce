'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LinkGridPuzzle } from '@/types';
import { Button } from '@/components/ui/Button';

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
  const [selected, setSelected] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  const tap = (grid: CellState[][], setGrid: React.Dispatch<React.SetStateAction<CellState[][]>>, row: number, col: number) => {
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
      {/* Clues */}
      <div className="rounded-2xl border border-[#242424] bg-[#111] p-4">
        <p className="text-[10px] font-bold text-[#818CF8] uppercase tracking-[0.15em] mb-3">Clues</p>
        <ul className="space-y-2">
          {clues.map((clue, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-[#D0D0D0]">
              <span className="text-[#818CF8] shrink-0 mt-0.5 font-bold">›</span>
              {clue}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Grid A */}
      <GridTable label="People × Locations" color="#818CF8"
        rows={people} cols={categoryA} cells={gridA}
        onTap={(r,c) => tap(gridA, setGridA, r, c)} disabled={submitted} />

      {/* Grid B */}
      <GridTable label="People × Items" color="#818CF8"
        rows={people} cols={categoryB} cells={gridB}
        onTap={(r,c) => tap(gridB, setGridB, r, c)} disabled={submitted} />

      {/* Answer selection */}
      <div className="rounded-2xl border border-[#242424] bg-[#161616] p-4">
        <p className="text-sm font-semibold text-[#F0F0F0] mb-3">{question}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {people.map(person => (
            <motion.button key={person} whileTap={{ scale: 0.92 }}
              onClick={() => !submitted && setSelected(person)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                selected === person
                  ? 'bg-[#818CF8]/15 border-[#818CF8] text-[#818CF8]'
                  : 'border-[#242424] text-[#888] hover:border-[#818CF8]/40 hover:text-[#F0F0F0]'
              }`}>
              {person}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {shake && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-xs text-[#F87171] mb-3">
              Not quite — review the clues again
            </motion.p>
          )}
        </AnimatePresence>

        <Button onClick={handleSubmit} disabled={!selected} fullWidth size="lg"
          className="bg-[#818CF8] hover:bg-[#6366f1] text-white shadow-[0_0_24px_rgba(129,140,248,0.2)]">
          Confirm Answer
        </Button>
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
    <div className="rounded-2xl border border-[#242424] bg-[#111] p-4 overflow-x-auto">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color }}>{label}</p>
      <table className="w-full border-collapse min-w-[240px]">
        <thead>
          <tr>
            <th className="w-20" />
            {cols.map(col => (
              <th key={col} className="text-[10px] text-[#555] font-semibold pb-2 text-center px-1 min-w-[40px]">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row}>
              <td className="text-xs text-[#D0D0D0] py-1 pr-2 font-semibold whitespace-nowrap">{row}</td>
              {cols.map((_, ci) => (
                <td key={ci} className="p-0.5 text-center">
                  <motion.button whileTap={{ scale: 0.82 }}
                    onClick={() => !disabled && onTap(ri, ci)}
                    className={`w-9 h-9 rounded-xl border-2 text-sm font-black transition-all ${
                      cells[ri][ci] === 'check' ? 'bg-[#4ADE80]/10 border-[#4ADE80] text-[#4ADE80]' :
                      cells[ri][ci] === 'cross' ? 'bg-[#F87171]/8 border-[#F87171]/50 text-[#F87171]' :
                      'border-[#242424] text-[#333] hover:border-[#888]'
                    } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
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
