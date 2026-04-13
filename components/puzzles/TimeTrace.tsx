'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimeTracePuzzle } from '@/types';

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
    const isCorrect = assignments[1] === answer;
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

      {/* ── Clues ──────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1E1E1E] p-4">
        <p className="text-[10px] font-bold text-[#FB923C] uppercase tracking-[0.2em] mb-3">Clues</p>
        <ul className="space-y-2.5">
          {clues.map((clue, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-2.5 text-sm text-[#D0D0D0]"
            >
              <span className="text-[#FB923C] shrink-0 font-black leading-5">›</span>
              {clue}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* ── Entity tokens ───────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-[#555] uppercase tracking-[0.15em] mb-3">
          {selected ? `Tap a time slot to place "${selected}"` : 'Tap a person, then a time slot'}
        </p>
        <div className="flex flex-wrap gap-2">
          {entities.map(entity => {
            const isAssigned = !unassigned.includes(entity);
            const isSel      = selected === entity;
            return (
              <motion.button
                key={entity}
                whileTap={{ scale: 0.9 }}
                onClick={() => { if (submitted || isAssigned) return; setSelected(isSel ? null : entity); }}
                disabled={isAssigned}
                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={
                  isAssigned
                    ? { background: '#1A1A1A', color: '#333', cursor: 'not-allowed' }
                    : isSel
                    ? { background: '#FB923C', color: '#141414' }
                    : { background: '#252525', color: '#CCC' }
                }
              >
                {entity}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Timeline ────────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1E1E1E] p-4">
        <div className="space-y-2.5">
          {slots.map((slot, i) => {
            const isCrimeSlot = i === 1;
            const assigned    = assignments[i];
            const isTarget    = selected !== null && !submitted;

            return (
              <motion.div
                key={slot}
                animate={error && submitted ? { x: [0, -8, 8, -5, 5, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-3"
              >
                {/* Time label */}
                <div className="w-16 shrink-0 text-right">
                  <p className={`text-xs font-black font-mono ${isCrimeSlot ? 'text-[#FB923C]' : 'text-[#555]'}`}>
                    {slot}
                  </p>
                  {isCrimeSlot && (
                    <p className="text-[8px] font-bold text-[#FB923C]/60 uppercase tracking-wider">crime</p>
                  )}
                </div>

                {/* Dot */}
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0 border-2 transition-all"
                  style={
                    assigned
                      ? { borderColor: '#FB923C', background: '#FB923C' }
                      : isCrimeSlot
                      ? { borderColor: '#FB923C60', background: '#141414' }
                      : { borderColor: '#303030', background: '#141414' }
                  }
                />

                {/* Slot button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => assigned ? removeFromSlot(i) : assignToSlot(i)}
                  className="flex-1 min-h-[50px] rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                  style={
                    assigned
                      ? { background: '#FB923C18', border: '1.5px solid #FB923C', color: '#FB923C' }
                      : isTarget
                      ? { background: '#252525', border: '1.5px dashed #FB923C60', color: '#555' }
                      : { background: '#252525', border: '1.5px solid transparent', color: '#333' }
                  }
                >
                  {assigned ? (
                    <>
                      {assigned}
                      <span className="text-[#FB923C]/40 text-xs">✕</span>
                    </>
                  ) : (
                    <span className="text-xs opacity-50">
                      {isTarget ? 'place here' : '—'}
                    </span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {question && (
          <p className="text-xs text-[#555] mt-4 text-center">{question}</p>
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="text-xs text-[#F87171] mt-3 text-center font-semibold"
            >
              Wrong order — try again
            </motion.p>
          )}
        </AnimatePresence>

        <button
          onClick={handleSubmit}
          disabled={!allFilled}
          className="w-full mt-4 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-30"
          style={{
            background: allFilled ? '#FB923C' : '#252525',
            color: allFilled ? '#141414' : '#444',
          }}
        >
          Lock In Timeline
        </button>
      </div>
    </div>
  );
}
