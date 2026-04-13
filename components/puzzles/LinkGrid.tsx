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

  const [gridA, setGridA]         = useState<CellState[][]>(() => people.map(() => categoryA.map(() => 'empty')));
  const [gridB, setGridB]         = useState<CellState[][]>(() => people.map(() => categoryB.map(() => 'empty')));
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
    <div className="flex flex-col gap-6 py-6">

      {/* ── Clues ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 mx-1"
      >
        <p className="font-game text-[#A855F7] text-lg mb-4" style={{ letterSpacing: '0.1em' }}>CLUES</p>
        <ul className="space-y-3">
          {clues.map((clue, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 text-sm text-[#DDD] leading-relaxed"
            >
              <span className="text-[#A855F7] font-black shrink-0 mt-0.5 text-base">›</span>
              {clue}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* ── Grid A ─────────────────────────────────────────────────── */}
      <GridTable label={`People × ${categoryA[0].includes('Desk') || categoryA[0].includes('Room') || categoryA[0].includes('Gate') || categoryA[0].includes('Studio') || categoryA[0].includes('Coach') || categoryA[0].includes('Hall') || categoryA[0].includes('Table') ? 'Locations' : 'Locations'}`}
        color="#A855F7"
        rows={people} cols={categoryA} cells={gridA}
        onTap={(r,c) => tap(gridA, setGridA, r, c)} disabled={submitted} />

      {/* ── Grid B ─────────────────────────────────────────────────── */}
      <GridTable label="People × Items" color="#A855F7"
        rows={people} cols={categoryB} cells={gridB}
        onTap={(r,c) => tap(gridB, setGridB, r, c)} disabled={submitted} />

      {/* ── Answer selection ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 mx-1"
      >
        <p className="font-game text-[#A855F7] text-lg mb-2" style={{ letterSpacing: '0.1em' }}>ANSWER</p>
        <p className="text-sm text-[#999] mb-5">{question}</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {people.map(person => (
            <motion.button
              key={person}
              whileTap={{ scale: 0.9 }}
              onClick={() => !submitted && setSelected(person)}
              className="px-6 py-3 rounded-xl text-sm font-bold transition-all"
              style={
                selected === person
                  ? { background: '#A855F7', color: '#fff', boxShadow: '0 0 20px rgba(168,85,247,0.3)' }
                  : { background: '#2A2A2A', color: '#CCCCCC', border: '1px solid #363636' }
              }
            >
              {person}
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {shake && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-sm text-[#EF4444] mb-3 font-semibold">
              Not quite — review the clues again
            </motion.p>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={selected ? { scale: 1.02 } : {}}
          whileTap={selected ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full py-4 rounded-2xl font-black text-base tracking-wide transition-all"
          style={{
            background: selected ? '#A855F7' : '#252525',
            color: selected ? '#fff' : '#444',
            boxShadow: selected ? '0 0 28px rgba(168,85,247,0.25)' : 'none',
          }}
        >
          CONFIRM ANSWER
        </motion.button>
      </motion.div>
    </div>
  );
}

function GridTable({ label, color, rows, cols, cells, onTap, disabled }: {
  label: string; color: string;
  rows: string[]; cols: string[]; cells: CellState[][];
  onTap: (r: number, c: number) => void; disabled: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 mx-1 overflow-x-auto"
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ color }}>{label}</p>
      <table className="w-full border-collapse min-w-[240px]">
        <thead>
          <tr>
            <th className="w-20" />
            {cols.map(col => (
              <th key={col} className="text-[11px] text-[#888] font-bold pb-3 text-center px-1 min-w-[52px] uppercase tracking-wider">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row}>
              <td className="text-sm text-[#CCC] py-2 pr-4 font-semibold whitespace-nowrap">{row}</td>
              {cols.map((_, ci) => (
                <td key={ci} className="p-1.5 text-center">
                  <motion.button
                    whileTap={{ scale: 0.78 }}
                    onClick={() => !disabled && onTap(ri, ci)}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black transition-all"
                    style={
                      cells[ri][ci] === 'check'
                        ? { background: `${color}25`, border: `2px solid ${color}`, color }
                        : cells[ri][ci] === 'cross'
                        ? { background: '#EF444418', border: '2px solid #EF444445', color: '#EF4444' }
                        : { background: '#282828', border: '2px solid #383838', color: '#555' }
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
    </motion.div>
  );
}
