'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrueLiePuzzle } from '@/types';
import { Button } from '@/components/ui/Button';

interface TrueLieProps {
  puzzle: TrueLiePuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function TrueLie({ puzzle, onSolve, onMistake }: TrueLieProps) {
  const { statements, question, answer } = puzzle;

  // null = unset, false = truth, true = lie
  const [marked, setMarked] = useState<(boolean | null)[]>(statements.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setMarked(prev => { const n = [...prev]; n[i] = n[i] === null ? false : !n[i]; return n; });
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
      {/* Rule card */}
      <div className="rounded-2xl border border-[#F472B6]/20 bg-[#F472B6]/5 p-4">
        <p className="text-[10px] font-bold text-[#F472B6] uppercase tracking-[0.15em] mb-1.5">The Rule</p>
        <p className="text-sm text-[#D0D0D0] leading-relaxed">
          Exactly <span className="text-[#F472B6] font-bold">one person</span> is lying.
          Toggle each statement — find the liar.
        </p>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#555]" />
          <span className="text-[#555]">Unknown</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#4ADE80]" />
          <span className="text-[#888]">Truth</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#F472B6]" />
          <span className="text-[#888]">Lie</span>
        </div>
      </div>

      {/* Statements */}
      <div className="space-y-3">
        {statements.map((stmt, i) => {
          const state = marked[i];
          const isLie = state === true;
          const isTruth = state === false;

          return (
            <motion.div
              key={stmt.person}
              layout
              whileTap={{ scale: 0.98 }}
              onClick={() => toggle(i)}
              role="button"
              className={`rounded-2xl border p-4 cursor-pointer transition-all select-none ${
                isLie   ? 'bg-[#F472B6]/8 border-[#F472B6]/60' :
                isTruth ? 'bg-[#4ADE80]/5 border-[#4ADE80]/30' :
                          'bg-[#161616] border-[#242424] hover:border-[#333]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isLie ? 'bg-[#F472B6]' : isTruth ? 'bg-[#4ADE80]' : 'bg-[#333]'}`} />
                    <p className="text-xs font-bold text-[#888] uppercase tracking-wider">{stmt.person}</p>
                  </div>
                  <p className="text-sm text-[#E0E0E0] leading-relaxed">
                    &ldquo;{stmt.text}&rdquo;
                  </p>
                </div>

                <motion.div
                  animate={{ scale: state !== null ? [1, 1.15, 1] : 1 }}
                  className={`shrink-0 w-14 py-1.5 rounded-xl text-xs font-black text-center border transition-all ${
                    isLie   ? 'bg-[#F472B6]/15 border-[#F472B6] text-[#F472B6]' :
                    isTruth ? 'bg-[#4ADE80]/10 border-[#4ADE80]/50 text-[#4ADE80]' :
                              'bg-[#1A1A1A] border-[#242424] text-[#333]'
                  }`}
                >
                  {isLie ? 'LIE' : isTruth ? 'TRUE' : '?'}
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {lieCount > 1 && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-xs text-[#FBBF24] text-center font-semibold">
          ⚠ Only one person can be the liar
        </motion.p>
      )}

      {question && (
        <p className="text-sm text-[#F0F0F0] text-center font-semibold">{question}</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-[#F87171] text-center font-semibold">
            Wrong — reconsider the statements
          </motion.p>
        )}
      </AnimatePresence>

      <Button onClick={handleSubmit} disabled={!canSubmit || lieCount > 1} fullWidth size="lg"
        className="bg-[#F472B6] hover:bg-[#ec4899] text-white shadow-[0_0_24px_rgba(244,114,182,0.2)]">
        Expose the Liar
      </Button>
    </div>
  );
}
