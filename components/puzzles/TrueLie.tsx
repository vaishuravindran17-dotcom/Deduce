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
    <div className="flex flex-col gap-6 py-6">

      {/* ── Rule banner ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 mx-1"
        style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.25)' }}
      >
        <p className="font-game text-[#EC4899] text-lg mb-2" style={{ letterSpacing: '0.1em' }}>THE RULE</p>
        <p className="text-sm text-[#CCC] leading-relaxed">
          Exactly <span className="text-[#EC4899] font-bold">one person</span> is lying.
          Mark each statement as TRUE or LIE to find the liar.
        </p>
      </motion.div>

      {/* ── Statements ─────────────────────────────────────────────── */}
      <div className="space-y-3 mx-1">
        {statements.map((stmt, i) => {
          const state   = marked[i];
          const isLie   = state === true;
          const isTruth = state === false;

          return (
            <motion.div
              key={stmt.person}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              layout
              className="rounded-2xl p-5 transition-all"
              style={{
                background: isLie
                  ? 'rgba(236,72,153,0.12)'
                  : isTruth
                  ? 'rgba(200,255,87,0.07)'
                  : '#1C1C1C',
                border: `1.5px solid ${
                  isLie ? 'rgba(236,72,153,0.5)'
                  : isTruth ? 'rgba(200,255,87,0.3)'
                  : '#2C2C2C'
                }`,
              }}
            >
              {/* Person name row */}
              <div className="flex items-center justify-between mb-3">
                <p className="font-game text-base tracking-widest"
                  style={{ color: isLie ? '#EC4899' : isTruth ? '#C8FF57' : '#AAAAAA' }}
                >
                  {stmt.person.toUpperCase()}
                </p>

                {/* TRUE / LIE buttons */}
                <div className="flex gap-2 shrink-0">
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => mark(i, false)}
                    className="px-4 py-2 rounded-xl text-xs font-black transition-all"
                    style={
                      isTruth
                        ? { background: '#C8FF57', color: '#0D0D0D', boxShadow: '0 0 12px rgba(200,255,87,0.3)' }
                        : { background: '#2A2A2A', color: '#AAAAAA', border: '1px solid #383838' }
                    }
                  >
                    TRUE
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={() => mark(i, true)}
                    className="px-4 py-2 rounded-xl text-xs font-black transition-all"
                    style={
                      isLie
                        ? { background: '#EC4899', color: '#fff', boxShadow: '0 0 12px rgba(236,72,153,0.3)' }
                        : { background: '#2A2A2A', color: '#AAAAAA', border: '1px solid #383838' }
                    }
                  >
                    LIE
                  </motion.button>
                </div>
              </div>

              {/* Statement text */}
              <p className="text-sm leading-relaxed pl-0.5"
                style={{ color: isLie ? '#FFCCE0' : isTruth ? '#E8FFB0' : '#DDDDDD' }}>
                &ldquo;{stmt.text}&rdquo;
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Warnings */}
      <AnimatePresence>
        {lieCount > 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-1 rounded-xl bg-[#FFD60A]/10 border border-[#FFD60A]/25 px-4 py-3 text-center"
          >
            <p className="text-sm font-bold text-[#FFD60A]">Only one person can be the liar</p>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mx-1 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 px-4 py-3 text-center"
          >
            <p className="text-sm font-bold text-[#EF4444]">Wrong — reconsider the statements</p>
          </motion.div>
        )}
      </AnimatePresence>

      {question && (
        <p className="text-sm text-[#666] text-center">{question}</p>
      )}

      <motion.button
        whileHover={canSubmit ? { scale: 1.02 } : {}}
        whileTap={canSubmit ? { scale: 0.97 } : {}}
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="mx-1 py-4 rounded-2xl font-black text-base tracking-wide transition-all"
        style={{
          background: canSubmit ? '#EC4899' : '#1E1E1E',
          color: canSubmit ? '#fff' : '#444',
          boxShadow: canSubmit ? '0 0 28px rgba(236,72,153,0.25)' : 'none',
        }}
      >
        EXPOSE THE LIAR
      </motion.button>
    </div>
  );
}
