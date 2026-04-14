'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AbstractPuzzle, BinaryDecisionData } from '@/types/abstract';

const COLOR     = '#FBBF24';
const COLOR_DIM = 'rgba(251,191,36,0.12)';
const COLOR_BDR = 'rgba(251,191,36,0.3)';

interface BinaryDecisionProps {
  puzzle: AbstractPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function BinaryDecision({ puzzle, onSolve, onMistake }: BinaryDecisionProps) {
  const data = puzzle.data as BinaryDecisionData;
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState(false);

  const handleSubmit = () => {
    if (!selected || submitted) return;
    setSubmitted(true);
    if (selected === puzzle.answer) {
      onSolve();
    } else {
      setError(true);
      onMistake();
      setTimeout(() => {
        setError(false);
        setSubmitted(false);
        setSelected(null);
      }, 900);
    }
  };

  // Last condition is the triggering fact; the rest are rules
  const rules = data.conditions.slice(0, -1);
  const fact  = data.conditions[data.conditions.length - 1];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── Rules ─────────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Logic Rules
        </p>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {rules.map((rule, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start rounded-xl"
              style={{ padding: '12px 16px', gap: 12, background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex items-center justify-center shrink-0"
                style={{
                  width: 20, height: 20, borderRadius: 5, marginTop: 1,
                  background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`,
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4h8M6 1l3 3-3 3" stroke={COLOR} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 13, color: '#A0A0B0', lineHeight: 1.55 }}>{rule}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Given fact ────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Given Fact
        </p>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl"
          style={{
            padding: '14px 18px',
            background: 'rgba(251,191,36,0.08)',
            border: `1px solid ${COLOR_BDR}`,
          }}
        >
          <p style={{ fontSize: 14, fontWeight: 600, color: '#F0F0F4' }}>{fact}</p>
        </motion.div>
      </section>

      {/* ── Question ──────────────────────────────────────────────────── */}
      <p className="text-sm text-center font-medium" style={{ color: '#A0A0B0' }}>
        {puzzle.question}
      </p>

      {/* ── Options ───────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Conclusion
        </p>
        <div className="flex flex-col" style={{ gap: 8 }}>
          {puzzle.options.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !submitted && setSelected(opt)}
                className="text-left rounded-xl transition-all"
                style={
                  isSelected
                    ? { padding: '13px 16px', background: COLOR_DIM, border: `1px solid ${COLOR}` }
                    : { padding: '13px 16px', background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                <p style={{ fontSize: 13, color: isSelected ? '#F0F0F4' : '#A0A0B0', lineHeight: 1.5 }}>{opt}</p>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* ── Error ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="rounded-xl px-4 py-3 text-center"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>Wrong — retrace the logic</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Submit ────────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="w-full rounded-xl font-bold text-xs tracking-[0.08em] uppercase transition-all"
        style={
          selected
            ? { padding: '14px 20px', background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }
            : { padding: '14px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
        }
      >
        Commit Conclusion
      </button>
    </div>
  );
}
