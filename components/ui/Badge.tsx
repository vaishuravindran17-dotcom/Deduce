'use client';
import { ReactNode } from 'react';

type BadgeVariant = 'accent' | 'muted' | 'warn' | 'danger' | 'easy' | 'medium' | 'hard';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const styles: Record<BadgeVariant, string> = {
  accent:  'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20',
  muted:   'bg-[#2A2A2A] text-[#9A9A9A]',
  warn:    'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20',
  danger:  'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20',
  easy:    'bg-[#4ADE80]/10 text-[#4ADE80] border border-[#4ADE80]/20',
  medium:  'bg-[#FBBF24]/10 text-[#FBBF24] border border-[#FBBF24]/20',
  hard:    'bg-[#F87171]/10 text-[#F87171] border border-[#F87171]/20',
};

export function Badge({ children, variant = 'muted', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium',
        styles[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const variant = (difficulty.toLowerCase() as BadgeVariant) ?? 'muted';
  return <Badge variant={variant}>{difficulty}</Badge>;
}
