'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TrueLiePuzzle } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TrueLieProps {
  puzzle: TrueLiePuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function TrueLie({ puzzle, onSolve, onMistake }: TrueLieProps) {
  const { statements, question, answer } = puzzle;

  // marked[i] = true means "lie", false means "truth"
  const [marked, setMarked] = useState<(boolean | null)[]>(
    statements.map(() => null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const toggle = (i: number) => {
    if (submitted) return;
    setMarked((prev) => {
      const next = [...prev];
      next[i] = next[i] === null ? false : !next[i];
      return next;
    });
  };

  // Valid state: exactly one person marked as liar
  const lieCount = marked.filter((m) => m === true).length;
  const selectedLiar = lieCount === 1
    ? statements[marked.findIndex((m) => m === true)]?.person
    : null;
  const canSubmit = selectedLiar !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);

    if (selectedLiar === answer) {
      onSolve();
    } else {
      setError(true);
      onMistake();
      setTimeout(() => {
        setError(false);
        setSubmitted(false);
        setMarked(statements.map(() => null));
      }, 900);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      <Card compact>
        <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-1">Rule</p>
        <p className="text-sm text-[#EAEAEA]">
          Exactly <span className="text-[#F472B6] font-semibold">one person</span> is lying.
          Toggle each statement to reveal the liar.
        </p>
      </Card>

      {/* Statements */}
      <div className="space-y-3">
        {statements.map((stmt, i) => {
          const state = marked[i]; // null=unset, false=truth, true=lie
          return (
            <motion.div
              key={stmt.person}
              layout
              className={[
                'rounded-2xl border p-4 cursor-pointer transition-all select-none',
                state === true
                  ? 'bg-[#F472B6]/8 border-[#F472B6]'
                  : state === false
                  ? 'bg-[#4ADE80]/5 border-[#4ADE80]/40'
                  : 'bg-[#161616] border-[#2A2A2A] hover:border-[#9A9A9A]/40',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => toggle(i)}
              role="button"
              aria-pressed={state === true}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-[#9A9A9A] mb-1">{stmt.person}</p>
                  <p className="text-sm text-[#EAEAEA] leading-relaxed">
                    &ldquo;{stmt.text}&rdquo;
                  </p>
                </div>

                {/* Toggle badge */}
                <div
                  className={[
                    'shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all',
                    state === true
                      ? 'bg-[#F472B6]/15 border-[#F472B6] text-[#F472B6]'
                      : state === false
                      ? 'bg-[#4ADE80]/10 border-[#4ADE80]/50 text-[#4ADE80]'
                      : 'border-[#2A2A2A] text-[#2A2A2A]',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {state === true ? 'LIE' : state === false ? 'TRUTH' : '?'}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Hint */}
      <p className="text-[11px] text-[#9A9A9A] text-center">
        Tap to cycle: <span className="text-[#EAEAEA]">?</span> → <span className="text-[#4ADE80]">Truth</span> → <span className="text-[#F472B6]">Lie</span>
      </p>

      {lieCount > 1 && (
        <p className="text-xs text-[#FBBF24] text-center">
          Only one person can be lying
        </p>
      )}

      {question && (
        <p className="text-sm text-[#EAEAEA] text-center font-medium">{question}</p>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-[#F87171] text-center"
          >
            That&apos;s not the liar — reconsider the statements
          </motion.p>
        )}
      </AnimatePresence>

      <Button
        onClick={handleSubmit}
        disabled={!canSubmit || lieCount > 1}
        fullWidth
      >
        Expose the Liar
      </Button>
    </div>
  );
}
