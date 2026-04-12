'use client';
import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  compact?: boolean;
}

export function Card({ children, glow = false, compact = false, className = '', ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        'bg-[#161616] border border-[#2A2A2A] rounded-2xl',
        compact ? 'p-3' : 'p-5',
        glow ? 'shadow-[0_0_0_1px_rgba(74,222,128,0.15)]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

// ─── Section heading inside a card ───────────────────────────────────────────
export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}
