'use client';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'glass';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
  glow?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary:
    'bg-[#4ADE80] text-[#0A0A0A] font-bold hover:bg-[#22c55e] active:bg-[#16a34a] shadow-[0_0_24px_rgba(74,222,128,0.25)]',
  secondary:
    'bg-transparent border border-[#333] text-[#F0F0F0] hover:border-[#4ADE80]/60 hover:bg-[#4ADE80]/5 hover:text-[#4ADE80]',
  ghost:
    'bg-transparent text-[#888] hover:text-[#F0F0F0] hover:bg-white/5',
  danger:
    'bg-[#F87171]/10 border border-[#F87171]/40 text-[#F87171] hover:bg-[#F87171]/20',
  glass:
    'bg-white/5 border border-white/10 text-[#F0F0F0] hover:bg-white/10 backdrop-blur-sm',
};

const sizeStyles: Record<Size, string> = {
  sm:  'px-3.5 py-2 text-xs rounded-xl gap-1.5',
  md:  'px-5 py-2.5 text-sm rounded-2xl gap-2',
  lg:  'px-6 py-3.5 text-sm font-semibold rounded-2xl gap-2',
  xl:  'px-8 py-4 text-base font-semibold rounded-2xl gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  fullWidth = false,
  glow = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center transition-all duration-150 select-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth ? 'w-full' : '',
        glow && !isDisabled ? 'shadow-[0_0_32px_rgba(74,222,128,0.3)]' : '',
        isDisabled ? 'opacity-35 cursor-not-allowed' : 'cursor-pointer active:scale-[0.96]',
        className,
      ].filter(Boolean).join(' ')}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      {children}
    </button>
  );
}
