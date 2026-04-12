'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeBreakPuzzle } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface CodeBreakProps {
  puzzle: CodeBreakPuzzle;
  onSolve: () => void;
  onMistake: () => void;
}

export function CodeBreak({ puzzle, onSolve, onMistake }: CodeBreakProps) {
  const { clues, answer } = puzzle;
  const codeLength = answer.length;

  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const press = (digit: string) => {
    if (submitted) return;
    if (input.length < codeLength) setInput((p) => p + digit);
  };

  const backspace = () => {
    if (submitted) return;
    setInput((p) => p.slice(0, -1));
  };

  const handleSubmit = () => {
    if (input.length !== codeLength) return;
    if (guesses.includes(input)) {
      setError('Already tried that code');
      return;
    }

    const newGuesses = [...guesses, input];
    setGuesses(newGuesses);

    if (input === answer) {
      setSubmitted(true);
      onSolve();
    } else {
      onMistake();
      setError('Wrong code — use the clues to narrow it down');
      setInput('');
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-8">
      {/* Clues */}
      <Card compact>
        <p className="text-[11px] font-medium text-[#9A9A9A] uppercase tracking-wider mb-2">
          Clues
        </p>
        <div className="space-y-2">
          {clues.map((clue, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex gap-0.5 shrink-0 mt-0.5">
                {clue.guess.split('').map((d, di) => (
                  <span
                    key={di}
                    className="w-6 h-6 flex items-center justify-center rounded-md bg-[#2A2A2A] text-xs font-mono font-bold text-[#EAEAEA]"
                  >
                    {d}
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#9A9A9A] leading-tight">{clue.hint}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Previous wrong guesses */}
      {guesses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {guesses.filter(g => g !== answer).map((g, i) => (
            <span
              key={i}
              className="px-2 py-1 rounded-lg bg-[#F87171]/8 border border-[#F87171]/20 text-xs font-mono text-[#F87171]"
            >
              {g}
            </span>
          ))}
        </div>
      )}

      {/* Code display */}
      <div className="flex items-center justify-center gap-3 py-2">
        {Array.from({ length: codeLength }).map((_, i) => (
          <motion.div
            key={i}
            animate={input.length === i ? { scale: [1, 1.06, 1] } : {}}
            transition={{ duration: 0.2 }}
            className={[
              'w-14 h-14 rounded-xl border-2 flex items-center justify-center',
              'text-2xl font-mono font-bold transition-all',
              i < input.length
                ? 'border-[#4ADE80] text-[#4ADE80] bg-[#4ADE80]/5'
                : i === input.length
                ? 'border-[#4ADE80]/40 text-transparent'
                : 'border-[#2A2A2A] text-transparent',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {input[i] ?? ''}
          </motion.div>
        ))}
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-[#F87171] text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Keypad */}
      <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto w-full">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((d) => (
          <KeypadButton key={d} label={d} onPress={() => press(d)} disabled={submitted} />
        ))}
        <div /> {/* spacer */}
        <KeypadButton label="0" onPress={() => press('0')} disabled={submitted} />
        <KeypadButton
          label="⌫"
          onPress={backspace}
          disabled={submitted || input.length === 0}
          dimmed
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={input.length !== codeLength || submitted}
        fullWidth
      >
        Crack the Code
      </Button>
    </div>
  );
}

function KeypadButton({
  label,
  onPress,
  disabled = false,
  dimmed = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  dimmed?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onPress}
      disabled={disabled}
      className={[
        'h-14 rounded-xl border text-lg font-semibold transition-all',
        dimmed
          ? 'border-[#2A2A2A] text-[#9A9A9A] hover:text-[#EAEAEA]'
          : 'border-[#2A2A2A] text-[#EAEAEA] hover:border-[#4ADE80]/40 hover:bg-[#4ADE80]/5',
        disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {label}
    </motion.button>
  );
}
