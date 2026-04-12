'use client';
import { useState } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { TimeTracePuzzle } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface TimeTraceProps {
  puzzle: TimeTracePuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function TimeTrace({ puzzle, onSolve, onMistake }: TimeTraceProps) {
  const { slots, entities, clues, question, answer } = puzzle;

  // assignments[slotIndex] = entityName | null
  const [assignments, setAssignments] = useState<(string | null)[]>(
    slots.map(() => null),
  );
  const [unassigned, setUnassigned] = useState<string[]>([...entities]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);

  const assignToSlot = (slotIndex: number) => {
    if (!selectedEntity || submitted) return;

    // Remove entity from wherever it currently is
    const prevSlot = assignments.findIndex((a) => a === selectedEntity);

    const newAssignments = [...assignments];
    const newUnassigned = [...unassigned];

    // Place back what was in that slot
    if (newAssignments[slotIndex] !== null) {
      newUnassigned.push(newAssignments[slotIndex]!);
    }

    newAssignments[slotIndex] = selectedEntity;

    // Remove from unassigned or previous slot
    if (prevSlot >= 0) {
      newAssignments[prevSlot] = null;
    } else {
      const idx = newUnassigned.indexOf(selectedEntity);
      if (idx !== -1) newUnassigned.splice(idx, 1);
    }

    setAssignments(newAssignments);
    setUnassigned(newUnassigned);
    setSelectedEntity(null);
  };

  const removeFromSlot = (slotIndex: number) => {
    if (submitted) return;
    const entity = assignments[slotIndex];
    if (!entity) return;
    const newAssignments = [...assignments];
    newAssignments[slotIndex] = null;
    setAssignments(newAssignments);
    setUnassigned((prev) => [...prev, entity]);
    if (selectedEntity === entity) setSelectedEntity(null);
  };

  const allFilled = assignments.every((a) => a !== null);

  const handleSubmit = () => {
    if (!allFilled) return;
    // Find which slot has the answer entity
    const answerSlotIndex = assignments.findIndex((a) => a === answer);
    const expectedSlotIndex = Math.floor(slots.length / 2); // answer is always at middle slot (theft time)
    // More precisely: find the slot that corresponds to the answer time
    // The answer is the entity at the "crime time" slot — always slot index 1 (middle)
    const correctSlot = 1;
    const isCorrect = assignments[correctSlot] === answer;

    setSubmitted(true);
    if (isCorrect) {
      onSolve();
    } else {
      setError(true);
      onMistake();
      setTimeout(() => {
        setError(false);
        setSubmitted(false);
      }, 900);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Clues */}
      <Card compact>
        <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-2">Clues</p>
        <ul className="space-y-1.5">
          {clues.map((clue, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#EAEAEA]">
              <span className="text-[#FB923C] mt-0.5 shrink-0">›</span>
              {clue}
            </li>
          ))}
        </ul>
      </Card>

      {/* Instruction */}
      <p className="text-xs text-[#9A9A9A] text-center">
        {selectedEntity
          ? `Tap a time slot to place "${selectedEntity}"`
          : 'Tap a person to select, then tap a time slot'}
      </p>

      {/* Unassigned entities */}
      <div className="flex flex-wrap gap-2 justify-center">
        {entities.map((entity) => {
          const isAssigned = !unassigned.includes(entity);
          const isSelected = selectedEntity === entity;
          return (
            <motion.button
              key={entity}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (submitted) return;
                if (isAssigned) return;
                setSelectedEntity(isSelected ? null : entity);
              }}
              disabled={isAssigned}
              className={[
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all',
                isAssigned
                  ? 'opacity-30 cursor-not-allowed border-[#2A2A2A] text-[#9A9A9A]'
                  : isSelected
                  ? 'bg-[#FB923C]/15 border-[#FB923C] text-[#FB923C] ring-2 ring-[#FB923C]/20'
                  : 'border-[#2A2A2A] text-[#EAEAEA] hover:border-[#FB923C]/40',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {entity}
            </motion.button>
          );
        })}
      </div>

      {/* Timeline */}
      <Card>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[2.5rem] top-0 bottom-0 w-px bg-[#2A2A2A]" />

          <div className="space-y-3">
            {slots.map((slot, i) => (
              <motion.div
                key={slot}
                className="flex items-center gap-4"
                animate={
                  error && submitted ? { x: [0, -6, 6, -4, 4, 0] } : {}
                }
                transition={{ duration: 0.4 }}
              >
                {/* Time label */}
                <div className="w-16 text-right shrink-0">
                  <span
                    className={`text-xs font-mono font-semibold ${
                      i === 1 ? 'text-[#FB923C]' : 'text-[#9A9A9A]'
                    }`}
                  >
                    {slot}
                  </span>
                </div>

                {/* Dot */}
                <div
                  className={`w-3 h-3 rounded-full border-2 shrink-0 z-10 ${
                    assignments[i]
                      ? 'border-[#FB923C] bg-[#FB923C]'
                      : 'border-[#2A2A2A] bg-[#0D0D0D]'
                  }`}
                />

                {/* Slot */}
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    if (assignments[i]) {
                      removeFromSlot(i);
                    } else {
                      assignToSlot(i);
                    }
                  }}
                  className={[
                    'flex-1 min-h-[44px] rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-1',
                    assignments[i]
                      ? 'bg-[#FB923C]/10 border-[#FB923C] text-[#FB923C]'
                      : selectedEntity
                      ? 'border-[#FB923C]/40 border-dashed text-[#9A9A9A] hover:border-[#FB923C]'
                      : 'border-[#2A2A2A] text-[#2A2A2A] hover:border-[#9A9A9A]/40',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {assignments[i] ? (
                    <>
                      {assignments[i]}
                      <span className="text-[#FB923C]/50 text-xs ml-1">✕</span>
                    </>
                  ) : (
                    <span className="text-xs opacity-50">place here</span>
                  )}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        {question && (
          <p className="text-xs text-[#9A9A9A] mt-4 text-center italic">{question}</p>
        )}

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[#F87171] mt-3 text-center"
            >
              Wrong order — try again
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          onClick={handleSubmit}
          disabled={!allFilled}
          fullWidth
          className="mt-4"
        >
          Submit Timeline
        </Button>
      </Card>
    </div>
  );
}
