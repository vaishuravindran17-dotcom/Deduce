'use client';
import { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  glow?: boolean;
  compact?: boolean;
  hover?: boolean;
  accent?: string; // color for left border accent
}

export function Card({
  children,
  glow = false,
  compact = false,
  hover = false,
  accent,
  className = '',
  ...props
}: CardProps) {
  return (
    <div
      {...props}
      className={[
        'bg-[#161616] border border-[#242424] rounded-2xl relative overflow-hidden',
        compact ? 'p-4' : 'p-5',
        glow ? 'border-[#4ADE80]/30 shadow-[0_0_32px_rgba(74,222,128,0.08)]' : '',
        hover ? 'transition-all duration-200 hover:border-[#333] hover:bg-[#1A1A1A] hover:-translate-y-0.5' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={accent ? { borderLeftColor: accent, borderLeftWidth: 2 } : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}
