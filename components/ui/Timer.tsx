'use client';
import { formatTime } from '@/lib/utils/scoring';
import { ClockIcon } from './SketchIllustration';

interface TimerProps {
  seconds: number;
  countDown?: boolean;
  totalSeconds?: number; // for countdown ring
  className?: string;
}

export function Timer({ seconds, countDown = false, totalSeconds, className = '' }: TimerProps) {
  const displaySeconds = seconds;
  const isLow = countDown && seconds <= 10;
  const isWarning = countDown && seconds <= 20 && seconds > 10;

  return (
    <div
      className={[
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl',
        'border bg-[#161616] font-mono text-sm font-semibold',
        isLow
          ? 'border-[#F87171]/40 text-[#F87171]'
          : isWarning
          ? 'border-[#FBBF24]/40 text-[#FBBF24]'
          : 'border-[#2A2A2A] text-[#EAEAEA]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ClockIcon
        size={14}
        color={isLow ? '#F87171' : isWarning ? '#FBBF24' : '#9A9A9A'}
      />
      {formatTime(displaySeconds)}
      {countDown && totalSeconds && (
        <CountdownRing seconds={seconds} total={totalSeconds} />
      )}
    </div>
  );
}

function CountdownRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 8;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, seconds / total);
  const dashOffset = circumference * (1 - progress);
  const color = seconds <= 10 ? '#F87171' : seconds <= 20 ? '#FBBF24' : '#4ADE80';

  return (
    <svg width={20} height={20} viewBox="0 0 20 20" className="-rotate-90">
      <circle cx="10" cy="10" r={r} stroke="#2A2A2A" strokeWidth="2" fill="none" />
      <circle
        cx="10"
        cy="10"
        r={r}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={dashOffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.5s ease' }}
      />
    </svg>
  );
}
