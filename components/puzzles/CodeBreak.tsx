'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeBreakPuzzle } from '@/types';

const COLOR     = '#2DD4BF';
const COLOR_DIM = 'rgba(45,212,191,0.15)';
const COLOR_BDR = 'rgba(45,212,191,0.3)';

interface CodeBreakProps {
  puzzle: CodeBreakPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function CodeBreak({ puzzle, onSolve, onMistake }: CodeBreakProps) {
  const { clues, answer } = puzzle;
  const codeLength = answer.length;

  const [input, setInput]         = useState('');
  const [guesses, setGuesses]     = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState('');
  const [shake, setShake]         = useState(false);
  const [flashIdx, setFlashIdx]   = useState<number | null>(null);

  const press = (digit: string) => {
    if (submitted || input.length >= codeLength) return;
    const idx = input.length;
    setFlashIdx(idx);
    setInput(p => p + digit);
    setTimeout(() => setFlashIdx(null), 200);
  };

  const backspace = () => {
    if (!submitted && input.length > 0) setInput(p => p.slice(0, -1));
  };

  const handleSubmit = () => {
    if (input.length !== codeLength) return;
    if (guesses.includes(input)) { setError('Already tried that'); return; }
    const newGuesses = [...guesses, input];
    setGuesses(newGuesses);
    if (input === answer) {
      setSubmitted(true);
      onSolve();
    } else {
      setShake(true);
      onMistake();
      setError('Wrong code — try another combination');
      setTimeout(() => { setShake(false); setInput(''); setError(''); }, 700);
    }
  };

  const ready = input.length === codeLength && !submitted;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22, paddingTop: 16, paddingBottom: 80 }}>

      {/* ── Clues ───────────────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Clues
        </p>
        <div className="flex flex-col gap-2">
          {clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-xl flex items-center"
              style={{ padding: '13px 16px', gap: 14, background: '#141418', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {clue.guess.split('').map((d, di) => (
                  <div
                    key={di}
                    className="flex items-center justify-center font-mono font-black text-sm"
                    style={{
                      width: 38, height: 42, borderRadius: 8,
                      background: '#1C1C22',
                      border: '1px solid rgba(255,255,255,0.13)',
                      color: '#A0A0B0',
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLOR }} />
              <p className="text-sm leading-relaxed" style={{ color: '#A0A0B0' }}>{clue.hint}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Previous wrong guesses ─────────────────────────────────── */}
      <AnimatePresence>
        {guesses.filter(g => g !== answer).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 items-center"
          >
            <span
              className="text-[10px] font-bold uppercase tracking-[0.14em]"
              style={{ color: '#5A5A6E' }}
            >
              Tried:
            </span>
            {guesses.filter(g => g !== answer).map((g, i) => (
              <span
                key={i}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-black"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                }}
              >
                {g}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Code input cells ─────────────────────────────────────────── */}
      <section>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: COLOR }}>
          Enter Code
        </p>
        <motion.div
          animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-center gap-3"
        >
          {Array.from({ length: codeLength }).map((_, i) => {
            const filled    = i < input.length;
            const isCursor  = i === input.length && !submitted;
            const isFlashed = flashIdx === i;

            return (
              <motion.div
                key={i}
                animate={isFlashed ? { scale: [0.9, 1.1, 1] } : {}}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center font-mono font-black transition-all"
                style={{
                  width: 66, height: 74, borderRadius: 12,
                  fontSize: 30,
                  background: filled ? COLOR_DIM : '#1C1C22',
                  border: `2px solid ${filled ? COLOR : isCursor ? COLOR_BDR : 'rgba(255,255,255,0.07)'}`,
                  color: filled ? COLOR : '#5A5A6E',
                }}
              >
                {input[i] ?? ''}
                {isCursor && (
                  <span
                    className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full animate-pulse"
                    style={{ background: COLOR_BDR }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-sm text-center font-semibold"
            style={{ color: '#EF4444' }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Keypad ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, maxWidth: 260, margin: '0 auto 20px', width: '100%' }}>
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <KeyBtn key={d} label={d} onPress={() => press(d)} disabled={submitted} />
        ))}
        <div />
        <KeyBtn label="0" onPress={() => press('0')} disabled={submitted} />
        <KeyBtn label="⌫" onPress={backspace} disabled={submitted || input.length === 0} dim />
      </div>

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <button
        onClick={handleSubmit}
        disabled={!ready}
        className="w-full rounded-xl font-bold text-xs tracking-[0.08em] uppercase transition-all"
        style={
          ready
            ? { padding: '14px 20px', background: COLOR_DIM, border: `1px solid ${COLOR_BDR}`, color: COLOR }
            : { padding: '14px 20px', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', color: '#5A5A6E' }
        }
      >
        Crack the Code
      </button>
    </div>
  );
}

function KeyBtn({ label, onPress, disabled, dim }: {
  label: string; onPress: () => void; disabled?: boolean; dim?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.88 }}
      onClick={onPress}
      disabled={disabled}
      className="rounded-xl font-black transition-all select-none"
      style={{
        height: 54,
        fontSize: 20,
        background: '#141418',
        color: dim ? '#5A5A6E' : '#A0A0B0',
        border: `1px solid rgba(255,255,255,${dim ? '0.07' : '0.13'})`,
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </motion.button>
  );
}
