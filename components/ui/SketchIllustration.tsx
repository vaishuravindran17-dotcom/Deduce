'use client';

interface SVGProps {
  size?: number;
  color?: string;
  className?: string;
}

const STROKE = { strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

// ─── Magnifying Glass (hero / investigation) ──────────────────────────────────
export function MagnifyingGlass({ size = 80, color = '#EAEAEA', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" className={className}>
      <circle cx="34" cy="34" r="20" stroke={color} strokeWidth="2.5" {...STROKE} />
      <line x1="49" y1="49" x2="68" y2="68" stroke={color} strokeWidth="3" {...STROKE} />
      {/* Sketch detail lines inside lens */}
      <path d="M26 28 Q30 24 36 26" stroke={color} strokeWidth="1.5" opacity="0.5" {...STROKE} />
      <path d="M24 34 Q25 38 29 40" stroke={color} strokeWidth="1.5" opacity="0.5" {...STROKE} />
    </svg>
  );
}

// ─── Grid (LinkGrid) ──────────────────────────────────────────────────────────
export function GridIcon({ size = 48, color = '#818CF8', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Grid lines */}
      <line x1="16" y1="8" x2="16" y2="40" stroke={color} strokeWidth="1.8" {...STROKE} />
      <line x1="32" y1="8" x2="32" y2="40" stroke={color} strokeWidth="1.8" {...STROKE} />
      <line x1="8" y1="16" x2="40" y2="16" stroke={color} strokeWidth="1.8" {...STROKE} />
      <line x1="8" y1="32" x2="40" y2="32" stroke={color} strokeWidth="1.8" {...STROKE} />
      {/* X mark */}
      <line x1="10" y1="10" x2="14" y2="14" stroke={color} strokeWidth="2" {...STROKE} />
      <line x1="14" y1="10" x2="10" y2="14" stroke={color} strokeWidth="2" {...STROKE} />
      {/* Checkmark */}
      <polyline points="18,22 22,27 30,19" stroke={color} strokeWidth="2" fill="none" {...STROKE} />
      {/* Dot */}
      <circle cx="36" cy="36" r="2.5" fill={color} />
    </svg>
  );
}

// ─── Timeline Arrow (TimeTrace) ───────────────────────────────────────────────
export function TimelineIcon({ size = 48, color = '#FB923C', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Main line */}
      <line x1="6" y1="24" x2="42" y2="24" stroke={color} strokeWidth="2" {...STROKE} />
      {/* Arrowhead */}
      <polyline points="36,18 43,24 36,30" stroke={color} strokeWidth="2" fill="none" {...STROKE} />
      {/* Dots on timeline */}
      <circle cx="12" cy="24" r="3" fill={color} />
      <circle cx="24" cy="24" r="3" fill={color} />
      <circle cx="36" cy="24" r="3" fill={color} />
      {/* Labels above dots */}
      <line x1="12" y1="18" x2="12" y2="21" stroke={color} strokeWidth="1.5" {...STROKE} />
      <line x1="24" y1="14" x2="24" y2="21" stroke={color} strokeWidth="1.5" {...STROKE} />
      <line x1="36" y1="18" x2="36" y2="21" stroke={color} strokeWidth="1.5" {...STROKE} />
    </svg>
  );
}

// ─── Speech Bubbles (TrueLie) ─────────────────────────────────────────────────
export function TrueLieIcon({ size = 48, color = '#F472B6', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Top bubble */}
      <rect x="4" y="4" width="26" height="16" rx="5" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M10 20 L8 26 L18 20" stroke={color} strokeWidth="1.8" fill="none" {...STROKE} />
      {/* Bottom bubble (offset) */}
      <rect x="18" y="26" width="26" height="16" rx="5" stroke={color} strokeWidth="1.8" {...STROKE} />
      <path d="M30 26 L24 20 L34 26" stroke={color} strokeWidth="1.8" fill="none" {...STROKE} />
      {/* Check inside top */}
      <polyline points="9,11 12,14 19,8" stroke={color} strokeWidth="1.8" fill="none" {...STROKE} />
      {/* X inside bottom */}
      <line x1="28" y1="31" x2="32" y2="35" stroke={color} strokeWidth="1.8" {...STROKE} />
      <line x1="32" y1="31" x2="28" y2="35" stroke={color} strokeWidth="1.8" {...STROKE} />
    </svg>
  );
}

// ─── Keypad / Lock (CodeBreak) ────────────────────────────────────────────────
export function CodeIcon({ size = 48, color = '#4ADE80', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      {/* Lock body */}
      <rect x="10" y="22" width="28" height="20" rx="3" stroke={color} strokeWidth="2" {...STROKE} />
      {/* Lock shackle */}
      <path d="M16 22 L16 14 Q16 8 24 8 Q32 8 32 14 L32 22" stroke={color} strokeWidth="2" fill="none" {...STROKE} />
      {/* Keyhole */}
      <circle cx="24" cy="32" r="3" stroke={color} strokeWidth="1.8" />
      <line x1="24" y1="35" x2="24" y2="39" stroke={color} strokeWidth="1.8" {...STROKE} />
      {/* Dots on side */}
      <circle cx="7" cy="14" r="1.5" fill={color} opacity="0.6" />
      <circle cx="41" cy="14" r="1.5" fill={color} opacity="0.6" />
    </svg>
  );
}

// ─── Flame (Streak) ───────────────────────────────────────────────────────────
export function FlameIcon({ size = 24, color = '#FB923C', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2 C12 2 14 6 11 9 C11 9 15 8 14 13 C14 13 17 11 16 14.5 C16 14.5 18 17 13 21 C13 21 7 21 7 16.5 C7 14 9 13 9 13 C9 13 7 10 9.5 8 C9.5 8 8 12 11 13 C11 13 10 9 12 6 C12 6 13 9 14 9 C14 9 12 5 12 2Z"
        stroke={color} strokeWidth="1.5" fill="none" {...STROKE}
      />
      <path d="M12 17 C12 17 10 15 11 13.5 C11 13.5 13 14.5 12 17Z"
        fill={color} opacity="0.7" />
    </svg>
  );
}

// ─── Trophy (Result) ──────────────────────────────────────────────────────────
export function TrophyIcon({ size = 56, color = '#4ADE80', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" className={className}>
      {/* Cup */}
      <path d="M18 8 L38 8 L36 28 Q34 34 28 36 Q22 34 20 28 Z"
        stroke={color} strokeWidth="2" fill="none" {...STROKE} />
      {/* Handles */}
      <path d="M18 12 Q10 12 10 20 Q10 28 18 26" stroke={color} strokeWidth="2" fill="none" {...STROKE} />
      <path d="M38 12 Q46 12 46 20 Q46 28 38 26" stroke={color} strokeWidth="2" fill="none" {...STROKE} />
      {/* Base stem */}
      <line x1="28" y1="36" x2="28" y2="44" stroke={color} strokeWidth="2" {...STROKE} />
      {/* Base */}
      <line x1="18" y1="44" x2="38" y2="44" stroke={color} strokeWidth="2.5" {...STROKE} />
      {/* Stars */}
      <path d="M24 16 L25.2 19.5 L29 19.5 L26.2 21.5 L27.2 25 L24 23 L20.8 25 L21.8 21.5 L19 19.5 L22.8 19.5 Z"
        stroke={color} strokeWidth="1" fill="none" opacity="0.7" {...STROKE} />
    </svg>
  );
}

// ─── Clock (Timer) ────────────────────────────────────────────────────────────
export function ClockIcon({ size = 24, color = '#EAEAEA', className = '' }: SVGProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" {...STROKE} />
      <line x1="12" y1="7" x2="12" y2="12" stroke={color} strokeWidth="2" {...STROKE} />
      <line x1="12" y1="12" x2="16" y2="14" stroke={color} strokeWidth="2" {...STROKE} />
    </svg>
  );
}

// ─── Deduce Logo (brand mark) ─────────────────────────────────────────────────
export function DeduceLogoMark({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      {/* Thought bubble / deduction symbol */}
      <circle cx="20" cy="18" r="12" stroke="#4ADE80" strokeWidth="2.5" {...STROKE} />
      {/* Inner magnifying glass */}
      <circle cx="19" cy="17" r="5" stroke="#4ADE80" strokeWidth="2" {...STROKE} />
      <line x1="23" y1="21" x2="27" y2="25" stroke="#4ADE80" strokeWidth="2.5" {...STROKE} />
      {/* Dots at bottom (thought trail) */}
      <circle cx="13" cy="32" r="1.5" fill="#4ADE80" opacity="0.8" />
      <circle cx="17" cy="35" r="1" fill="#4ADE80" opacity="0.5" />
      <circle cx="21" cy="37" r="0.7" fill="#4ADE80" opacity="0.3" />
    </svg>
  );
}
