'use client';

interface ProgressBarProps {
  value: number;    // 0–100
  className?: string;
  color?: string;
  thin?: boolean;
}

export function ProgressBar({ value, className = '', color = '#4ADE80', thin = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      className={[
        'w-full rounded-full bg-[#2A2A2A] overflow-hidden',
        thin ? 'h-1' : 'h-1.5',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}

// ─── Puzzle step dots ─────────────────────────────────────────────────────────
type StepStatus = 'locked' | 'active' | 'solved';

interface StepDotsProps {
  steps: StepStatus[];
  labels?: string[];
}

export function StepDots({ steps, labels }: StepDotsProps) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((status, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div
            className={[
              'w-2.5 h-2.5 rounded-full transition-all duration-300',
              status === 'solved'
                ? 'bg-[#4ADE80]'
                : status === 'active'
                ? 'bg-[#4ADE80]/40 ring-2 ring-[#4ADE80]/30'
                : 'bg-[#2A2A2A]',
            ]
              .filter(Boolean)
              .join(' ')}
          />
          {labels && (
            <span className="text-[9px] text-[#9A9A9A]">{labels[i]}</span>
          )}
        </div>
      ))}
    </div>
  );
}
