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
    <div className="flex flex-col gap-6 py-6">

      {/* ── Clues ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 mx-1"
      >
        <p className="font-game text-[#F97316] text-lg mb-4" style={{ letterSpacing: '0.1em' }}>CLUES</p>
        <ul className="space-y-3">
          {clues.map((clue, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start gap-3 text-sm text-[#DDD] leading-relaxed"
            >
              <span className="text-[#F97316] font-black shrink-0 mt-0.5 text-base">›</span>
              {clue}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* ── Entity tokens ──────────────────────────────────────────── */}
      <div className="mx-1">
        <p className="text-xs font-bold text-[#888] uppercase tracking-[0.2em] mb-3">
          {selected ? `Place "${selected}" into a time slot` : 'Select a suspect to place'}
        </p>
        <div className="flex flex-wrap gap-3">
          {entities.map(entity => {
            const isAssigned = !unassigned.includes(entity);
            const isSel      = selected === entity;
            return (
              <motion.button
                key={entity}
                whileTap={{ scale: 0.88 }}
                onClick={() => { if (submitted || isAssigned) return; setSelected(isSel ? null : entity); }}
                disabled={isAssigned}
                className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={
                  isAssigned
                    ? { background: '#181818', color: '#333', cursor: 'not-allowed', border: '1px solid #222' }
                    : isSel
                    ? { background: '#F97316', color: '#fff', boxShadow: '0 0 20px rgba(249,115,22,0.3)', border: '1px solid transparent' }
                    : { background: '#2A2A2A', color: '#CCCCCC', border: '1px solid #383838' }
                }
              >
                {entity}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* ── Timeline ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 mx-1"
      >
        <p className="font-game text-[#F97316] text-lg mb-6" style={{ letterSpacing: '0.1em' }}>TIMELINE</p>

        <div className="space-y-4">
          {slots.map((slot, i) => {
            const isCrimeSlot = i === 1;
            const assigned    = assignments[i];
            const isTarget    = selected !== null && !submitted;

            return (
              <motion.div
                key={slot}
                animate={error && submitted ? { x: [0, -10, 10, -6, 6, 0] } : {}}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-4"
              >
                {/* Time label */}
                <div className="w-16 shrink-0 text-right">
                  <p className="font-mono font-black text-sm"
                    style={{ color: isCrimeSlot ? '#F97316' : '#888' }}>
                    {slot}
                  </p>
                  {isCrimeSlot && (
                    <p className="text-[9px] font-bold uppercase tracking-wider text-[#F97316]/70 mt-0.5">
                      crime
                    </p>
                  )}
                </div>

                {/* Timeline dot */}
                <div className="relative flex items-center justify-center shrink-0">
                  <div className="absolute w-px h-16 -top-8 bg-[#2A2A2A] -z-10" />
                  <div
                    className="w-3 h-3 rounded-full border-2 z-10 transition-all"
                    style={
                      assigned
                        ? { borderColor: '#F97316', background: '#F97316' }
                        : isCrimeSlot
                        ? { borderColor: '#F9731680', background: '#0D0D0D' }
                        : { borderColor: '#333', background: '#0D0D0D' }
                    }
                  />
                </div>

                {/* Slot button */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => assigned ? removeFromSlot(i) : assignToSlot(i)}
                  className="flex-1 min-h-[52px] rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all"
                  style={
                    assigned
                      ? { background: '#F9731618', border: '1.5px solid #F97316', color: '#F97316' }
                      : isTarget
                      ? { background: '#252525', border: '1.5px dashed #F9731650', color: '#888' }
                      : { background: '#252525', border: '1.5px solid #383838', color: '#888' }
                  }
                >
                  {assigned ? (
                    <>{assigned} <span className="opacity-50 text-xs ml-1">✕</span></>
                  ) : (
                    <span className="text-xs opacity-60">{isTarget ? 'tap to place here' : '—'}</span>
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {question && <p className="text-xs text-[#888] mt-6 text-center">{question}</p>}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/25 px-4 py-3 text-center"
            >
              <p className="text-sm font-bold text-[#EF4444]">Wrong order — try again</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={allFilled ? { scale: 1.02 } : {}}
          whileTap={allFilled ? { scale: 0.97 } : {}}
          onClick={handleSubmit}
          disabled={!allFilled}
          className="w-full mt-6 py-4 rounded-2xl font-black text-base tracking-wide transition-all"
          style={{
            background: allFilled ? '#F97316' : '#1A1A1A',
            color: allFilled ? '#fff' : '#777',
            border: allFilled ? 'none' : '1px dashed #333',
            boxShadow: allFilled ? '0 0 28px rgba(249,115,22,0.25)' : 'none',
          }}
        >
          LOCK IN TIMELINE
        </motion.button>
      </motion.div>
    </div>
  );
}
