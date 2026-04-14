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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── CLUES ───────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLOR, marginBottom: 10 }}>
          Clues
        </p>
        <div className="rounded-xl overflow-hidden" style={{ background: '#141418', padding: '4px 0' }}>
          {clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-[10px]"
              style={{
                padding: '10px 16px',
                borderBottom: i < clues.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}
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
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLOR, marginBottom: 10 }}>
          People × Locations
        </p>
        <div className="rounded-xl overflow-x-auto" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}>
          <GridTable rows={people} cols={categoryA} cells={gridA}
            onTap={(r, c) => tap(gridA, setGridA, r, c)} disabled={submitted} />
        </div>
      </section>

      {/* ── GRID B ──────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLOR, marginBottom: 10 }}>
          People × Items
        </p>
        <div className="rounded-xl overflow-x-auto" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}>
          <GridTable rows={people} cols={categoryB} cells={gridB}
            onTap={(r, c) => tap(gridB, setGridB, r, c)} disabled={submitted} />
        </div>
      </section>

      {/* ── ANSWER ──────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em]" style={{ color: COLOR, marginBottom: 10 }}>
          Answer
        </p>
        <div className="rounded-xl" style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '18px 20px' }}>
          <p style={{ fontSize: 13, color: '#5A5A6E', marginBottom: 12 }}>{question}</p>

          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {people.map(person => (
              <motion.button
                key={person}
                whileTap={{ scale: 0.93 }}
                onClick={() => !submitted && setSelected(person)}
                style={
                  selected === person
                    ? { padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: COLOR_DIM, border: `1px solid ${COLOR}`, color: COLOR }
                    : { padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#A0A0B0' }
                }
              >
                {person}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-xs font-semibold" style={{ color: '#EF4444', marginTop: 10 }}>
                Not quite — check the clues again
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={!selected}
            className="w-full font-bold uppercase tracking-[0.08em] transition-all"
            style={
              selected
                ? { padding: '14px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, marginTop: 14, background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }
                : { padding: '14px 20px', borderRadius: 12, fontSize: 13, fontWeight: 600, marginTop: 14, background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
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
          <th style={{ width: 90 }} />
          {cols.map(col => (
            <th key={col}
              className="text-center uppercase"
              style={{
                padding: '0 4px 8px',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: '#5A5A6E',
                minWidth: 54,
              }}>
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, ri) => (
          <tr key={row}>
            <td
              className="whitespace-nowrap"
              style={{ fontSize: 13, fontWeight: 500, color: '#A0A0B0', padding: '4px', paddingLeft: 0 }}
            >
              {row}
            </td>
            {cols.map((_, ci) => (
              <td key={ci} className="text-center" style={{ padding: 4 }}>
                <motion.button
                  whileTap={{ scale: 0.78 }}
                  onClick={() => !disabled && onTap(ri, ci)}
                  className="flex items-center justify-center font-black transition-all mx-auto"
                  style={{
                    width: 46, height: 46, borderRadius: 11,
                    fontSize: 14,
                    ...(cells[ri][ci] === 'check'
                      ? { background: 'rgba(167,139,250,0.18)', border: '1px solid rgba(167,139,250,0.5)', color: '#A78BFA' }
                      : cells[ri][ci] === 'cross'
                      ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', color: 'rgba(239,68,68,0.6)' }
                      : { background: '#1C1C22', border: '1px solid rgba(255,255,255,0.07)', color: 'transparent' })
                  }}
                >
                  {cells[ri][ci] === 'check' ? '✓' : cells[ri][ci] === 'cross' ? '✕' : ''}
                </motion.button>
              </td>
            ))}
          </tr>
        ))}
        <tr><td colSpan={cols.length + 1} style={{ height: 12 }} /></tr>
      </tbody>
    </table>
  );
}
