'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimeTracePuzzle } from '@/types';
import { Button } from '@/components/ui/Button';

interface TimeTraceProps {
  puzzle: TimeTracePuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function TimeTrace({ puzzle, onSolve, onMistake }: TimeTraceProps) {
  const { slots, entities, clues, question, answer } = puzzle;

  const [assignments, setAssignments] = useState<(string | null)[]>(slots.map(() => null));
  const [unassigned, setUnassigned]   = useState<string[]>([...entities]);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState(false);
  const [selected, setSelected]       = useState<string | null>(null);

  const assignToSlot = (slotIndex: number) => {
    if (!selected || submitted) return;
    const prevSlot = assignments.findIndex(a => a === selected);
    const newA = [...assignments];
    const newU = [...unassigned];

    if (newA[slotIndex] !== null) newU.push(newA[slotIndex]!);
    newA[slotIndex] = selected;

    if (prevSlot >= 0) newA[prevSlot] = null;
    else { const idx = newU.indexOf(selected); if (idx !== -1) newU.splice(idx, 1); }

    setAssignments(newA);
    setUnassigned(newU);
    setSelected(null);
  };

  const removeFromSlot = (slotIndex: number) => {
    if (submitted) return;
    const entity = assignments[slotIndex];
    if (!entity) return;
    const newA = [...assignments];
    newA[slotIndex] = null;
    setAssignments(newA);
    setUnassigned(p => [...p, entity]);
    if (selected === entity) setSelected(null);
  };

  const allFilled = assignments.every(a => a !== null);

  const handleSubmit = () => {
    if (!allFilled) return;
    const isCorrect = assignments[1] === answer; // crime always at middle slot
    setSubmitted(true);
    if (isCorrect) {
      onSolve();
    } else {
      setError(true);
      onMistake();
      setTimeout(() => { setError(false); setSubmitted(false); }, 900);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Clues */}
      <div className="rounded-2xl border border-[#242424] bg-[#111] p-4">
        <p className="text-[10px] font-bold text-[#FB923C] uppercase tracking-[0.15em] mb-3">Clues</p>
        <ul className="space-y-2">
          {clues.map((clue, i) => (
            <motion.li key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-[#D0D0D0]">
              <span className="text-[#FB923C] shrink-0 font-bold">›</span>
              {clue}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* People tokens */}
      <div>
        <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] mb-2.5">
          {selected ? `Place "${selected}" in a time slot` : 'Select a person, then a time slot'}
        </p>
        <div className="flex flex-wrap gap-2">
          {entities.map(entity => {
            const isAssigned = !unassigned.includes(entity);
            const isSel      = selected === entity;
            return (
              <motion.button key={entity} whileTap={{ scale: 0.92 }}
                onClick={() => { if (submitted || isAssigned) return; setSelected(isSel ? null : entity); }}
                disabled={isAssigned}
                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                  isAssigned ? 'opacity-25 cursor-not-allowed border-[#242424] text-[#555]' :
                  isSel      ? 'bg-[#FB923C]/15 border-[#FB923C] text-[#FB923C] shadow-[0_0_16px_rgba(251,146,60,0.2)]' :
                               'border-[#242424] text-[#D0D0D0] hover:border-[#FB923C]/40 hover:text-[#F0F0F0]'
                }`}>
                {entity}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl border border-[#242424] bg-[#161616] p-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[3.75rem] top-0 bottom-0 w-px bg-[#1E1E1E]" />

          <div className="space-y-3">
            {slots.map((slot, i) => {
              const isCrimeSlot = i === 1;
              return (
                <motion.div key={slot}
                  animate={error && submitted ? { x: [0,-6,6,-4,4,0] } : {}}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3"
                >
                  {/* Time */}
                  <div className="w-14 text-right shrink-0">
                    <span className={`text-xs font-bold font-mono ${isCrimeSlot ? 'text-[#FB923C]' : 'text-[#555]'}`}>
                      {slot}
                    </span>
                    {isCrimeSlot && (
                      <p className="text-[8px] text-[#FB923C]/60 font-semibold uppercase">crime</p>
                    )}
                  </div>

                  {/* Dot */}
                  <div className={`w-3 h-3 rounded-full border-2 shrink-0 z-10 transition-all ${
                    assignments[i] ? 'border-[#FB923C] bg-[#FB923C]' :
                    isCrimeSlot   ? 'border-[#FB923C]/40 bg-[#0A0A0A]' : 'border-[#242424] bg-[#0A0A0A]'
                  }`} />

                  {/* Slot */}
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => assignments[i] ? removeFromSlot(i) : assignToSlot(i)}
                    className={`flex-1 min-h-[46px] rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      assignments[i]
                        ? 'bg-[#FB923C]/10 border-[#FB923C] text-[#FB923C]'
                        : selected
                        ? 'border-[#FB923C]/40 border-dashed text-[#555] hover:border-[#FB923C] hover:bg-[#FB923C]/5'
                        : 'border-[#1E1E1E] text-[#333]'
                    }`}
                  >
                    {assignments[i] ? (
                      <>{assignments[i]} <span className="text-[#FB923C]/40 text-xs">✕</span></>
                    ) : (
                      <span className="text-xs opacity-40">drop here</span>
                    )}
                  </motion.button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {question && (
          <p className="text-xs text-[#555] mt-4 text-center italic">{question}</p>
        )}

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-[#F87171] mt-3 text-center font-semibold">
              Wrong order — try again
            </motion.p>
          )}
        </AnimatePresence>

        <Button onClick={handleSubmit} disabled={!allFilled} fullWidth size="lg"
          className="mt-4 bg-[#FB923C] hover:bg-[#f97316] text-white shadow-[0_0_24px_rgba(251,146,60,0.2)]">
          Lock In Timeline
        </Button>
      </div>
    </div>
  );
}
