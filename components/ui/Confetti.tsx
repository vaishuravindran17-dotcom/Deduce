'use client';
import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger?: boolean;
  type?: 'celebration' | 'subtle';
}

export function Confetti({ trigger = true, type = 'celebration' }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    if (type === 'celebration') {
      // Big burst from both sides
      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...opts,
          origin: { y: 0.7 },
          particleCount: Math.floor(200 * particleRatio),
          colors: ['#4ADE80', '#22c55e', '#86efac', '#F0F0F0', '#818CF8', '#F472B6'],
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2,  { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1,  { spread: 120, startVelocity: 45 });
    } else {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ADE80', '#22c55e', '#86efac'],
      });
    }
  }, [trigger, type]);

  return null;
}

export function triggerConfetti() {
  const fire = (particleRatio: number, opts: confetti.Options) => {
    confetti({
      ...opts,
      origin: { y: 0.7 },
      particleCount: Math.floor(200 * particleRatio),
      colors: ['#4ADE80', '#22c55e', '#86efac', '#F0F0F0', '#818CF8'],
    });
  };
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2,  { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1,  { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
}
