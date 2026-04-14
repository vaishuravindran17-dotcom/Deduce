'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TimeTracePuzzle } from '@/types';

const COLOR     = '#FB923C';
const COLOR_DIM = 'rgba(251,146,60,0.15)';
const COLOR_BDR = 'rgba(251,146,60,0.3)';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── CLUES ─────────────────────────────────────────────────── */}
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

      {/* ── SELECT SUSPECT ────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          {selected ? `Place "${selected}" into a time slot` : 'Select a Suspect to Place'}
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
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={
                  isAssigned
                    ? { background: '#141418', border: '1px solid rgba(255,255,255,0.05)', color: '#3A3A4A', cursor: 'not-allowed' }
                    : isSel
                    ? { background: COLOR_DIM, border: `1px solid ${COLOR}`, color: COLOR }
                    : { background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#A0A0B0' }
                }
              >
                {entity}
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Timeline
        </p>
        <motion.div
          animate={error ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="rounded-xl overflow-hidden"
          style={{ background: '#141418', border: `1px solid rgba(251,146,60,0.18)` }}
        >
          {slots.map((slot, i) => {
            const isCrimeSlot = i === 1;
            const assigned    = assignments[i];
            const isTarget    = selected !== null && !submitted;

            return (
              <div
                key={slot}
                className="flex items-stretch"
                style={{
                  minHeight: '62px',
                  borderBottom: i < slots.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                }}
              >
                {/* Time label */}
                <div className="flex flex-col justify-center pl-4 pr-3 shrink-0" style={{ width: '76px' }}>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: isCrimeSlot ? COLOR : '#A0A0B0' }}
                  >
                    {slot}
                  </span>
                  {isCrimeSlot && (
                    <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: `${COLOR}99` }}>
                      Crime
                    </span>
                  )}
                </div>

                {/* Dot */}
                <div className="flex items-center px-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full border-2"
                    style={{
                      borderColor: assigned ? COLOR : isCrimeSlot ? `${COLOR}80` : 'rgba(255,255,255,0.2)',
                      background: assigned ? COLOR : 'transparent',
                    }}
                  />
                </div>

                {/* Slot */}
                <button
                  onClick={() => assigned ? removeFromSlot(i) : assignToSlot(i)}
                  className="flex-1 flex items-center px-4 transition-all"
                  style={{ cursor: (assigned || isTarget) ? 'pointer' : 'default' }}
                >
                  {assigned ? (
                    <span
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                      style={{ background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }}
                    >
                      {assigned}
                    </span>
                  ) : (
                    <span className="text-xl" style={{ color: isTarget ? 'rgba(251,146,60,0.3)' : 'rgba(255,255,255,0.15)' }}>
                      —
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </motion.div>

        {question && (
          <p className="text-sm text-center mt-4" style={{ color: '#5A5A6E' }}>{question}</p>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-3 rounded-xl px-4 py-3 text-center"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>Wrong order — try again</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── SUBMIT ────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={!allFilled}
        className="w-full py-3.5 rounded-xl font-bold text-xs tracking-[0.08em] uppercase transition-all"
        style={
          allFilled
            ? { background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }
            : { background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
        }
      >
        Lock In Timeline
      </button>
    </div>
  );
}
