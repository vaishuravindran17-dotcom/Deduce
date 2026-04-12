'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface UseTimerOptions {
  initialSeconds?: number;
  countDown?: boolean;   // if true, counts down from initialSeconds to 0
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useTimer({
  initialSeconds = 0,
  countDown = false,
  autoStart = false,
  onComplete,
}: UseTimerOptions = {}) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const start = useCallback(() => setIsRunning(true), []);

  const reset = useCallback(() => {
    stop();
    setSeconds(initialSeconds);
  }, [stop, initialSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (countDown) {
          if (prev <= 1) {
            stop();
            onCompleteRef.current?.();
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, countDown, stop]);

  return { seconds, isRunning, start, stop, reset };
}
