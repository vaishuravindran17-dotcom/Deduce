'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AbstractPuzzle, RuleShiftData } from '@/types/abstract';

const COLOR     = '#60A5FA';
const COLOR_DIM = 'rgba(96,165,250,0.12)';
const COLOR_BDR = 'rgba(96,165,250,0.3)';

interface RuleShiftProps {
  puzzle: AbstractPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function RuleShift({ puzzle, onSolve, onMistake }: RuleShiftProps) {
  const data = puzzle.data as RuleShiftData;
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState(false);

  const handleSelect = (opt: string) => {
    if (submitted) return;
    setSelected(opt);
  };

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── Examples card ─────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Pattern
        </p>
        <div
          className="rounded-xl"
          style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}
        >
          {data.examples.map((ex, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center justify-between"
              style={{
                padding: '13px 18px',
                borderBottom: i < data.examples.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 500, color: '#F0F0F4' }}>{ex.input}</span>
              <div className="flex items-center gap-3">
                <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                  <path d="M1 5h14M10 1l5 4-5 4" stroke={COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span
                  className="font-game"
                  style={{ fontSize: 18, color: COLOR, letterSpacing: '0.04em', minWidth: 28, textAlign: 'right' }}
                >
                  {ex.output}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Target row */}
          <div
            className="flex items-center justify-between"
            style={{
              padding: '13px 18px',
              background: 'rgba(96,165,250,0.06)',
              borderTop: `1px solid ${COLOR_BDR}`,
            }}
          >
            <span style={{ fontSize: 15, fontWeight: 600, color: '#F0F0F4' }}>{data.target}</span>
            <div className="flex items-center gap-3">
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path d="M1 5h14M10 1l5 4-5 4" stroke={COLOR} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span
                className="font-game"
                style={{ fontSize: 18, color: '#5A5A6E', letterSpacing: '0.04em', minWidth: 28, textAlign: 'right' }}
              >
                ?
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Question ──────────────────────────────────────────────────── */}
      <p className="text-sm text-center font-medium" style={{ color: '#A0A0B0' }}>
        {puzzle.question}
      </p>

      {/* ── Options ───────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Choose
        </p>
        <div className="grid grid-cols-2" style={{ gap: 8 }}>
          {puzzle.options.map((opt, i) => {
            const isSelected = selected === opt;
            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(opt)}
                className="rounded-xl font-game transition-all"
                style={
                  isSelected
                    ? { padding: '18px 12px', background: COLOR_DIM, border: `1px solid ${COLOR}`, color: COLOR, fontSize: 22 }
                    : { padding: '18px 12px', background: '#141418', border: '1px solid rgba(255,255,255,0.07)', color: '#A0A0B0', fontSize: 22 }
                }
              >
                {opt}
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
            <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>Wrong — recheck the pattern</p>
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
        Lock In Answer
      </button>
    </div>
  );
}
