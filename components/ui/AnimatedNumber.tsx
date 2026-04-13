'use client';
import { useEffect, useRef, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  duration?: number; // ms
  className?: string;
  format?: (n: number) => string;
}

export function AnimatedNumber({
  value,
  duration = 1200,
  className = '',
  format = (n) => Math.round(n).toLocaleString(),
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = display;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(startRef.current + (value - startRef.current) * ease);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span className={className}>{format(display)}</span>;
}
