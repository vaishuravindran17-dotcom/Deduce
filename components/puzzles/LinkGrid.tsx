'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LinkGridPuzzle } from '@/types';

const COLOR     = '#A78BFA';
const COLOR_DIM = 'rgba(167,139,250,0.15)';
const COLOR_BDR = 'rgba(167,139,250,0.3)';

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
  const [error, setError]         = useState(false);

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
      setError(true);
      onMistake();
      setTimeout(() => { setError(false); setSubmitted(false); setSelected(null); }, 800);
    }
  };

  return (
    <div className="flex flex-col gap-5 py-5 pb-10">

      {/* ── CLUES ───────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Clues
        </p>
        <div className="rounded-xl overflow-hidden" style={{ background: '#141418', border: `1px solid ${COLOR_BDR}` }}>
          {clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 px-4 py-3"
              style={{ borderBottom: i < clues.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
                <path d="M6 3l5 5-5 5" stroke={COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm leading-relaxed" style={{ color: '#F0F0F4' }}>{clue}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── GRID A ──────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          People × Locations
        </p>
        <div className="rounded-xl overflow-x-auto" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}>
          <GridTable rows={people} cols={categoryA} cells={gridA}
            onTap={(r, c) => tap(gridA, setGridA, r, c)} disabled={submitted} />
        </div>
      </section>

      {/* ── GRID B ──────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          People × Items
        </p>
        <div className="rounded-xl overflow-x-auto" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}>
          <GridTable rows={people} cols={categoryB} cells={gridB}
            onTap={(r, c) => tap(gridB, setGridB, r, c)} disabled={submitted} />
        </div>
      </section>

      {/* ── ANSWER ──────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Answer
        </p>
        <div className="rounded-xl p-4" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-sm mb-4" style={{ color: '#5A5A6E' }}>{question}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {people.map(person => (
              <motion.button
                key={person}
                whileTap={{ scale: 0.93 }}
                onClick={() => !submitted && setSelected(person)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  selected === person
                    ? { background: COLOR_DIM, border: `1px solid ${COLOR}`, color: COLOR }
                    : { background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#A0A0B0' }
                }
              >
                {person}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs mb-3 font-semibold" style={{ color: '#EF4444' }}>
                Not quite — check the clues again
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="w-full py-3.5 rounded-xl font-bold text-xs tracking-[0.08em] uppercase transition-all"
            style={
              selected
                ? { background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }
                : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
            }
          >
            Confirm Answer
          </button>
        </div>
      </section>
    </div>
  );
}

function GridTable({ rows, cols, cells, onTap, disabled }: {
  rows: string[]; cols: string[]; cells: CellState[][];
  onTap: (r: number, c: number) => void; disabled: boolean;
}) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="w-24" />
          {cols.map(col => (
            <th key={col}
              className="text-[10px] font-semibold py-4 text-center uppercase tracking-[0.1em] min-w-[56px]"
              style={{ color: '#5A5A6E' }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={row} style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <td className="text-sm py-3 pl-4 pr-3 font-medium whitespace-nowrap" style={{ color: '#A0A0B0' }}>
              {row}
            </td>
            {cols.map((_, ci) => (
              <td key={ci} className="p-2 text-center">
                <motion.button
                  whileTap={{ scale: 0.78 }}
                  onClick={() => !disabled && onTap(ri, ci)}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black transition-all mx-auto"
                  style={
                    cells[ri][ci] === 'check'
                      ? { background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.5)', color: COLOR }
                      : cells[ri][ci] === 'cross'
                      ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.55)' }
                      : { background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: 'transparent' }
                  }
                >
                  {cells[ri][ci] === 'check' ? '✓' : cells[ri][ci] === 'cross' ? '✕' : ''}
                </motion.button>
              </td>
            ))}
          </tr>
        ))}
        <tr><td colSpan={cols.length + 1} style={{ height: '12px' }} /></tr>
      </tbody>
    </table>
  );
}
