'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeBreakPuzzle } from '@/types';

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
    <div className="flex flex-col gap-6 py-6">

      {/* ── Clue table ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-[#1A1A1A] border border-[#2A2A2A] p-6 mx-1"
      >
        <p className="font-game text-[#06B6D4] text-lg mb-5" style={{ letterSpacing: '0.1em' }}>CLUES</p>
        <div className="space-y-4">
          {clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-5"
            >
              <div className="flex gap-2 shrink-0">
                {clue.guess.split('').map((d, di) => (
                  <div
                    key={di}
                    className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#252525] border border-[#333] font-mono font-black text-base text-white"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#CCCCCC] leading-relaxed">{clue.hint}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Previous wrong guesses ─────────────────────────────────── */}
      <AnimatePresence>
        {guesses.filter(g => g !== answer).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2 items-center mx-1"
          >
            <span className="text-[10px] text-[#555] uppercase tracking-widest font-bold">Tried:</span>
            {guesses.filter(g => g !== answer).map((g, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20 text-xs font-mono font-black text-[#EF4444]">
                {g}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Code input cells ─────────────────────────────────────────── */}
      <motion.div
        animate={shake ? { x: [-12, 12, -9, 9, -5, 5, 0] } : {}}
        transition={{ duration: 0.45 }}
        className="flex items-center justify-center gap-5 py-4"
      >
        {Array.from({ length: codeLength }).map((_, i) => {
          const filled    = i < input.length;
          const isCursor  = i === input.length && !submitted;
          const isFlashed = flashIdx === i;

          return (
            <motion.div
              key={i}
              animate={isFlashed ? { scale: [0.85, 1.12, 1] } : {}}
              transition={{ duration: 0.2 }}
              className="relative flex items-center justify-center rounded-2xl font-mono font-black transition-all duration-150"
              style={{
                width: 80, height: 80, fontSize: 40,
                background: filled ? '#06B6D415' : '#1E1E1E',
                border: `2.5px solid ${filled ? '#06B6D4' : isCursor ? '#06B6D450' : '#2A2A2A'}`,
                color: filled ? '#06B6D4' : '#444',
                boxShadow: filled ? '0 0 24px rgba(6,182,212,0.15)' : 'none',
              }}
            >
              {input[i] ?? ''}
              {isCursor && (
                <span
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full animate-pulse"
                  style={{ background: '#06B6D480' }}
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-sm text-[#EF4444] text-center font-semibold -mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Keypad ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto w-full px-1">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <KeyBtn key={d} label={d} onPress={() => press(d)} disabled={submitted} />
        ))}
        <div />
        <KeyBtn label="0" onPress={() => press('0')} disabled={submitted} />
        <KeyBtn label="⌫" onPress={backspace} disabled={submitted || input.length === 0} dim />
      </div>

      {/* ── Submit ─────────────────────────────────────────────────── */}
      <motion.button
        whileHover={ready ? { scale: 1.02 } : {}}
        whileTap={ready ? { scale: 0.97 } : {}}
        onClick={handleSubmit}
        disabled={!ready}
        className="mx-1 py-4 rounded-2xl font-black text-base tracking-wide transition-all"
        style={{
          background: ready ? '#06B6D4' : '#1E1E1E',
          color: ready ? '#0D0D0D' : '#444',
          boxShadow: ready ? '0 0 32px rgba(6,182,212,0.25)' : 'none',
        }}
      >
        CRACK THE CODE
      </motion.button>
    </div>
  );
}

function KeyBtn({ label, onPress, disabled, dim }: {
  label: string; onPress: () => void; disabled?: boolean; dim?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={onPress}
      disabled={disabled}
      className="h-16 rounded-2xl font-black text-xl transition-all select-none"
      style={{
        background: dim ? '#181818' : '#252525',
        color: dim ? '#666' : '#EEE',
        border: dim ? '1px solid #222' : '1px solid #333',
        opacity: disabled ? 0.25 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {label}
    </motion.button>
  );
}
