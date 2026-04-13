'use client';

interface IconProps { size?: number; color?: string }

export function LinkGridIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" rx="2" fill={color}/>
      <rect x="13" y="2" width="9" height="9" rx="2" fill={color} opacity="0.6"/>
      <rect x="2" y="13" width="9" height="9" rx="2" fill={color} opacity="0.6"/>
      <rect x="13" y="13" width="9" height="9" rx="2" fill={color}/>
    </svg>
  );
}

export function TimeTraceIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <circle cx="7" cy="12" r="2.5" fill={color}/>
      <circle cx="12" cy="12" r="2.5" fill={color}/>
      <circle cx="17" cy="12" r="2.5" fill={color}/>
      <polyline points="19,9 22,12 19,15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export function TrueLieIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 6h10a1 1 0 011 1v5a1 1 0 01-1 1H9l-3 3v-3H3a1 1 0 01-1-1V7a1 1 0 011-1z" fill={color}/>
      <path d="M13 10h8a1 1 0 011 1v4a1 1 0 01-1 1h-2v2l-2-2h-4a1 1 0 01-1-1v-4a1 1 0 011-1z" fill={color} opacity="0.5"/>
    </svg>
  );
}

export function CodeBreakIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="11" rx="2" fill={color}/>
      <path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="16" r="1.5" fill="#0D0D0D"/>
      <line x1="12" y1="17.5" x2="12" y2="20" stroke="#0D0D0D" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function FlameIcon({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2c0 0 4 5 2 9 2-1 4-4 3-7 2 2 5 6 3 11-1.5 3.5-5 5-8 5s-6.5-1.5-8-5c-2-5 1-9 3-11-1 3 1 6 3 7-2-4 2-9 2-9z"/>
    </svg>
  );
}

export function TrophyIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9H4a2 2 0 01-2-2V5h4M18 9h2a2 2 0 002-2V5h-4"/>
      <path d="M6 5h12v7a6 6 0 01-12 0V5z"/>
      <line x1="12" y1="18" x2="12" y2="22"/>
      <line x1="8" y1="22" x2="16" y2="22"/>
    </svg>
  );
}

export function CheckIcon({ size = 24, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );
}

export function ClockIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9"/>
      <polyline points="12,7 12,12 15,14"/>
    </svg>
  );
}

export function StarIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );
}

export function ZapIcon({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
  );
}
