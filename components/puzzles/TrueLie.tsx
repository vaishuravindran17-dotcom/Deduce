'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrueLiePuzzle } from '@/types';

const COLOR     = '#F472B6';
const COLOR_DIM = 'rgba(244,114,182,0.15)';
const COLOR_BDR = 'rgba(244,114,182,0.3)';

interface TrueLieProps {
  puzzle: TrueLiePuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function TrueLie({ puzzle, onSolve, onMistake }: TrueLieProps) {
  const { statements, question, answer } = puzzle;

  const [marked, setMarked]       = useState<(boolean | null)[]>(statements.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState(false);

  const mark = (i: number, value: boolean) => {
    if (submitted) return;
    setMarked(prev => { const n = [...prev]; n[i] = n[i] === value ? null : value; return n; });
  };

  const lieCount   = marked.filter(m => m === true).length;
  const liarPerson = lieCount === 1 ? statements[marked.findIndex(m => m === true)]?.person : null;
  const canSubmit  = liarPerson !== null && lieCount === 1;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
    if (liarPerson === answer) {
      onSolve();
    } else {
      setError(true);
      onMistake();
      setTimeout(() => { setError(false); setSubmitted(false); setMarked(statements.map(() => null)); }, 900);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── Rule banner ─────────────────────────────────────────────── */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: COLOR_DIM, border: `1px solid ${COLOR_BDR}` }}
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: COLOR }}>
          The Rule
        </p>
        <p className="text-sm" style={{ color: '#A0A0B0' }}>
          Exactly <span style={{ color: COLOR, fontWeight: 700 }}>one person</span> is lying.
          Mark each statement TRUE or LIE.
        </p>
      </div>

      {/* ── Statements ──────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Statements
        </p>
        <div className="flex flex-col gap-2">
          {statements.map((stmt, i) => {
            const state   = marked[i];
            const isLie   = state === true;
            const isTruth = state === false;

            return (
              <motion.div
                key={stmt.person}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl flex items-center justify-between gap-4 px-4 py-3"
                style={{
                  background: '#141418',
                  border: `1px solid ${
                    isLie    ? 'rgba(239,68,68,0.3)'
                    : isTruth ? 'rgba(34,197,94,0.25)'
                    : 'rgba(255,255,255,0.07)'
                  }`,
                  minHeight: '64px',
                }}
              >
                {/* Left: person + statement */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1"
                    style={{ color: '#5A5A6E' }}
                  >
                    {stmt.person}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: '#F0F0F4' }}>
                    &ldquo;{stmt.text}&rdquo;
                  </p>
                </div>

                {/* Right: toggle group */}
                <div
                  className="flex shrink-0 rounded-lg overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.13)' }}
                >
                  <button
                    onClick={() => mark(i, false)}
                    className="px-3 py-2 text-[11px] font-bold transition-all"
                    style={
                      isTruth
                        ? { background: 'rgba(34,197,94,0.18)', color: '#4ade80' }
                        : { background: 'transparent', color: '#5A5A6E' }
                    }
                  >
                    True
                  </button>
                  <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
                  <button
                    onClick={() => mark(i, true)}
                    className="px-3 py-2 text-[11px] font-bold transition-all"
                    style={
                      isLie
                        ? { background: 'rgba(239,68,68,0.15)', color: '#f87171' }
                        : { background: 'transparent', color: '#5A5A6E' }
                    }
                  >
                    Lie
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Question / warnings ──────────────────────────────────────── */}
      {question && (
        <p className="text-sm text-center" style={{ color: '#5A5A6E' }}>{question}</p>
      )}

      <AnimatePresence>
        {lieCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3 text-center"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#FBBF24' }}>Only one person can be the liar</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3 text-center"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>Wrong — reconsider the statements</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ──────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full py-3.5 rounded-xl font-bold text-xs tracking-[0.08em] uppercase transition-all"
        style={
          canSubmit
            ? { background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }
            : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
        }
      >
        Expose the Liar
      </button>
    </div>
  );
}
