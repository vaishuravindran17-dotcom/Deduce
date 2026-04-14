'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AbstractPuzzle, SwapLogicData } from '@/types/abstract';

const COLOR     = '#34D399';
const COLOR_DIM = 'rgba(52,211,153,0.12)';
const COLOR_BDR = 'rgba(52,211,153,0.3)';

interface SwapLogicProps {
  puzzle: AbstractPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function SwapLogic({ puzzle, onSolve, onMistake }: SwapLogicProps) {
  const data = puzzle.data as SwapLogicData;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── Initial state ─────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Starting Order
        </p>
        <div
          className="rounded-xl flex items-center"
          style={{ background: '#141418', border: '1px solid rgba(255,255,255,0.07)', padding: '14px 18px', gap: 8, flexWrap: 'wrap' }}
        >
          {data.initial.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-2"
            >
              <span
                className="px-3 py-1.5 rounded-lg text-sm font-semibold"
                style={{ background: '#1C1C22', border: '1px solid rgba(255,255,255,0.13)', color: '#F0F0F4' }}
              >
                {item}
              </span>
              {i < data.initial.length - 1 && (
                <span style={{ color: '#3A3A4A', fontSize: 12, fontWeight: 700 }}>·</span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Swap steps ────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Swap Steps
        </p>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {data.steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center rounded-xl"
              style={{ padding: '11px 16px', gap: 12, background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                className="flex items-center justify-center font-game shrink-0"
                style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`,
                  fontSize: 12, color: COLOR,
                }}
              >
                {i + 1}
              </div>
              <p style={{ fontSize: 14, color: '#F0F0F4' }}>{step}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Question ──────────────────────────────────────────────────── */}
      <p className="text-sm text-center font-medium" style={{ color: '#A0A0B0' }}>
        {puzzle.question}
      </p>

      {/* ── Options ───────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Final Order
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
                <div className="flex items-center gap-2 flex-wrap">
                  {opt.split(', ').map((item, j) => (
                    <span key={j} className="flex items-center gap-1.5">
                      <span
                        className="px-2.5 py-1 rounded-md text-sm font-medium"
                        style={{
                          background: isSelected ? 'rgba(52,211,153,0.15)' : '#1C1C22',
                          color: isSelected ? COLOR : '#A0A0B0',
                          border: `1px solid ${isSelected ? COLOR_BDR : 'rgba(255,255,255,0.07)'}`,
                        }}
                      >
                        {item}
                      </span>
                      {j < opt.split(', ').length - 1 && (
                        <span style={{ color: '#3A3A4A', fontSize: 11 }}>→</span>
                      )}
                    </span>
                  ))}
                </div>
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
            <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>Wrong — retrace the swaps</p>
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
        Confirm Final Order
      </button>
    </div>
  );
}
