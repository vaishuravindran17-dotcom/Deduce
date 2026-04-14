'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AbstractPuzzle, SetLogicData } from '@/types/abstract';

const COLOR     = '#F87171';
const COLOR_DIM = 'rgba(248,113,113,0.12)';
const COLOR_BDR = 'rgba(248,113,113,0.3)';

const QUANTIFIER_COLORS: Record<string, string> = {
  'All':  '#60A5FA',
  'No':   '#F87171',
  'Some': '#FBBF24',
};

function highlightQuantifier(text: string) {
  // Bold the first quantifier word (All / No / Some)
  const match = text.match(/^(All|No|Some)\b/);
  if (!match) return <span style={{ color: '#A0A0B0' }}>{text}</span>;
  const q    = match[1];
  const rest = text.slice(q.length);
  return (
    <>
      <span style={{ fontWeight: 700, color: QUANTIFIER_COLORS[q] ?? COLOR }}>{q}</span>
      <span style={{ color: '#A0A0B0' }}>{rest}</span>
    </>
  );
}

interface SetLogicProps {
  puzzle: AbstractPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function SetLogic({ puzzle, onSolve, onMistake }: SetLogicProps) {
  const data = puzzle.data as SetLogicData;
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

      {/* ── Premises ──────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Premises
        </p>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {data.premises.map((premise, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-start rounded-xl"
              style={{ padding: '12px 16px', gap: 12, background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div
                style={{
                  width: 4, flexShrink: 0, alignSelf: 'stretch',
                  borderRadius: 2, background: COLOR, marginTop: 2,
                }}
              />
              <p style={{ fontSize: 13, lineHeight: 1.55 }}>
                {highlightQuantifier(premise)}
              </p>
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
          Which must be true?
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
                <p style={{ fontSize: 13, color: isSelected ? '#F0F0F4' : '#A0A0B0', lineHeight: 1.5 }}>
                  {highlightQuantifier(opt)}
                </p>
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
            <p className="text-sm font-semibold" style={{ color: '#EF4444' }}>Wrong — reread the premises</p>
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
        Submit Conclusion
      </button>
    </div>
  );
}
