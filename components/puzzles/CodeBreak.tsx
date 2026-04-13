'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeBreakPuzzle } from '@/types';
import { Button } from '@/components/ui/Button';

interface CodeBreakProps {
  puzzle: CodeBreakPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function CodeBreak({ puzzle, onSolve, onMistake }: CodeBreakProps) {
  const { clues, answer } = puzzle;
  const codeLength = answer.length;

  const [input, setInput]   = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]   = useState('');
  const [shake, setShake]   = useState(false);

  const press = (digit: string) => {
    if (submitted || input.length >= codeLength) return;
    setInput(p => p + digit);
  };

  const backspace = () => { if (!submitted) setInput(p => p.slice(0, -1)); };

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
      setError('Wrong — use the clues to narrow it down');
      setTimeout(() => { setShake(false); setInput(''); setError(''); }, 700);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Clue table */}
      <div className="rounded-2xl border border-[#242424] bg-[#111] p-4">
        <p className="text-[10px] font-bold text-[#4ADE80] uppercase tracking-[0.15em] mb-3">Clues</p>
        <div className="space-y-3">
          {clues.map((clue, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-3">
              <div className="flex gap-1 shrink-0">
                {clue.guess.split('').map((d, di) => (
                  <span key={di}
                    className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-xs font-black font-mono text-[#F0F0F0]">
                    {d}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#888] leading-tight">{clue.hint}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Previous wrong guesses */}
      <AnimatePresence>
        {guesses.filter(g => g !== answer).length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap gap-2">
            {guesses.filter(g => g !== answer).map((g, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F87171]/8 border border-[#F87171]/20 text-xs font-mono font-bold text-[#F87171]">
                {g}
              </span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code display */}
      <motion.div
        animate={shake ? { x: [-8, 8, -6, 6, 0] } : {}}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-center gap-3 py-3"
      >
        {Array.from({ length: codeLength }).map((_, i) => {
          const filled   = i < input.length;
          const isCursor = i === input.length;
          return (
            <motion.div key={i}
              animate={filled ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.15 }}
              className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-3xl font-black font-mono transition-all ${
                filled
                  ? 'border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/8 shadow-[0_0_20px_rgba(74,222,128,0.15)]'
                  : isCursor
                  ? 'border-[#4ADE80]/30 bg-[#4ADE80]/3 animate-pulse'
                  : 'border-[#1E1E1E] bg-[#111]'
              }`}
            >
              {input[i] ?? ''}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="text-xs text-[#F87171] text-center font-semibold">
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto w-full">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <KeyBtn key={d} label={d} onPress={() => press(d)} disabled={submitted} />
        ))}
        <div />
        <KeyBtn label="0" onPress={() => press('0')} disabled={submitted} />
        <KeyBtn label="⌫" onPress={backspace} disabled={submitted || input.length === 0} dim />
      </div>

      <Button onClick={handleSubmit} disabled={input.length !== codeLength || submitted} fullWidth size="lg"
        className="bg-[#4ADE80] hover:bg-[#22c55e] text-[#0A0A0A] font-black shadow-[0_0_28px_rgba(74,222,128,0.25)]">
        Crack the Code
      </Button>
    </div>
  );
}

function KeyBtn({ label, onPress, disabled, dim }: {
  label: string; onPress: () => void; disabled?: boolean; dim?: boolean;
}) {
  return (
    <motion.button whileTap={{ scale: 0.88 }} onClick={onPress} disabled={disabled}
      className={`h-14 rounded-2xl border text-lg font-black transition-all ${
        dim
          ? 'border-[#1E1E1E] text-[#555] hover:text-[#888]'
          : 'border-[#242424] bg-[#161616] text-[#F0F0F0] hover:border-[#4ADE80]/40 hover:bg-[#4ADE80]/5 hover:text-[#4ADE80]'
      } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}>
      {label}
    </motion.button>
  );
}
