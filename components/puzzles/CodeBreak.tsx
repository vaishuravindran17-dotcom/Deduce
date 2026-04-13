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

  const [input, setInput]     = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]     = useState('');
  const [shake, setShake]     = useState(false);
  const [popIdx, setPopIdx]   = useState<number | null>(null);

  const press = (digit: string) => {
    if (submitted || input.length >= codeLength) return;
    setPopIdx(input.length);
    setInput(p => p + digit);
    setTimeout(() => setPopIdx(null), 180);
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
      setError('Wrong code — use the clues to narrow it down');
      setTimeout(() => { setShake(false); setInput(''); setError(''); }, 750);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-4 pb-8">

      {/* ── Clue table ─────────────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#1E1E1E] p-4">
        <p className="text-[10px] font-bold text-[#67E8F9] uppercase tracking-[0.2em] mb-4">Clues</p>
        <div className="space-y-3">
          {clues.map((clue, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4"
            >
              {/* Digit tiles */}
              <div className="flex gap-1.5 shrink-0">
                {clue.guess.split('').map((d, di) => (
                  <div
                    key={di}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#2A2A2A] text-sm font-black text-white font-mono"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#888] leading-relaxed">{clue.hint}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Wrong guesses history ───────────────────────────────────── */}
      <AnimatePresence>
        {guesses.filter(g => g !== answer).length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2"
          >
            <span className="text-[10px] text-[#444] uppercase tracking-wider w-full">Tried:</span>
            {guesses.filter(g => g !== answer).map((g, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-[#1E1E1E] text-xs font-mono font-bold text-[#F87171]">
                {g}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Code input cells ─────────────────────────────────────────── */}
      <motion.div
        animate={shake ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-center gap-3 py-2"
      >
        {Array.from({ length: codeLength }).map((_, i) => {
          const filled   = i < input.length;
          const isCursor = i === input.length && !submitted;
          const isPopped = popIdx === i;
          return (
            <motion.div
              key={i}
              animate={isPopped ? { scale: [0.85, 1.1, 1] } : {}}
              transition={{ duration: 0.18 }}
              className="relative"
            >
              <div
                className={[
                  'w-[68px] h-[68px] rounded-2xl flex items-center justify-center',
                  'text-4xl font-black font-mono transition-all duration-150',
                  filled
                    ? 'bg-[#67E8F9]/12 border-2 border-[#67E8F9] text-[#67E8F9]'
                    : isCursor
                    ? 'bg-[#1E1E1E] border-2 border-[#67E8F9]/40 text-white'
                    : 'bg-[#1E1E1E] border-2 border-transparent text-[#333]',
                ].join(' ')}
              >
                {input[i] ?? ''}
                {isCursor && !filled && (
                  <span className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[#67E8F9]/60 animate-pulse" />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-[#F87171] text-center font-semibold -mt-2"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ── Keypad ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 max-w-[288px] mx-auto w-full">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <KeyBtn key={d} label={d} onPress={() => press(d)} disabled={submitted} />
        ))}
        <div />
        <KeyBtn label="0" onPress={() => press('0')} disabled={submitted} />
        <KeyBtn label="⌫" onPress={backspace} disabled={submitted || input.length === 0} dim />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={input.length !== codeLength || submitted}
        className="w-full py-4 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          background: input.length === codeLength && !submitted ? '#67E8F9' : '#1E1E1E',
          color: input.length === codeLength && !submitted ? '#141414' : '#444',
        }}
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
      className={[
        'h-16 rounded-2xl text-xl font-black transition-all select-none',
        dim
          ? 'bg-[#1A1A1A] text-[#555] hover:text-[#888]'
          : 'bg-[#252525] text-white hover:bg-[#2A2A2A]',
        disabled ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {label}
    </motion.button>
  );
}
