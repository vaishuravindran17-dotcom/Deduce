'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrueLiePuzzle } from '@/types';

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
    setMarked(prev => {
      const n = [...prev];
      n[i] = n[i] === value ? null : value;
      return n;
    });
  };

  const lieCount   = marked.filter(m => m === true).length;
  const liarPerson = lieCount === 1 ? statements[marked.findIndex(m => m === true)]?.person : null;
  const canSubmit  = liarPerson !== null;

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
    <div className="flex flex-col gap-4 p-4 pb-8">

      {/* ── Rule banner ────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#F472B6]/8 border border-[#F472B6]/20 p-4">
        <p className="text-[10px] font-bold text-[#F472B6] uppercase tracking-[0.2em] mb-1">Rule</p>
        <p className="text-sm text-[#D0D0D0] leading-relaxed">
          Exactly <span className="text-[#F472B6] font-bold">one person</span> is lying.
          Mark each statement — find the liar.
        </p>
      </div>

      {/* ── Statements ─────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        {statements.map((stmt, i) => {
          const state   = marked[i];
          const isLie   = state === true;
          const isTruth = state === false;

          return (
            <motion.div
              key={stmt.person}
              layout
              className={[
                'rounded-2xl p-4 transition-all',
                isLie   ? 'bg-[#F472B6]/10 border border-[#F472B6]/40'
                : isTruth ? 'bg-[#C8FF57]/5 border border-[#C8FF57]/20'
                : 'bg-[#1E1E1E] border border-transparent',
              ].join(' ')}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-[#888] uppercase tracking-wider mb-2">
                    {stmt.person}
                  </p>
                  <p className="text-sm text-[#E0E0E0] leading-relaxed">
                    &ldquo;{stmt.text}&rdquo;
                  </p>
                </div>

                {/* Truth / Lie toggle buttons */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => mark(i, false)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black transition-all"
                    style={
                      isTruth
                        ? { background: '#C8FF57', color: '#141414' }
                        : { background: '#252525', color: '#555' }
                    }
                  >
                    TRUE
                  </button>
                  <button
                    onClick={() => mark(i, true)}
                    className="px-3 py-1.5 rounded-xl text-[11px] font-black transition-all"
                    style={
                      isLie
                        ? { background: '#F472B6', color: '#141414' }
                        : { background: '#252525', color: '#555' }
                    }
                  >
                    LIE
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Warnings */}
      {lieCount > 1 && (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-[#FBBF24] text-center font-semibold"
        >
          ⚠ Only one person can be the liar
        </motion.p>
      )}

      {question && (
        <p className="text-sm text-[#888] text-center">{question}</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-[#F87171] text-center font-semibold"
          >
            Wrong — reconsider the statements
          </motion.p>
        )}
      </AnimatePresence>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || lieCount > 1}
        className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-30"
        style={{
          background: canSubmit && lieCount === 1 ? '#F472B6' : '#1E1E1E',
          color: canSubmit && lieCount === 1 ? '#141414' : '#444',
        }}
      >
        Expose the Liar
      </button>
    </div>
  );
}
