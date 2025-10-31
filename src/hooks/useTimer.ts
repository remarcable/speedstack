import { useState, useEffect, useRef } from 'react';
import { INITIAL_TIME } from '../constants/gameConfig';

interface UseTimerReturn {
  timeRemaining: number;
  setTimeRemaining: React.Dispatch<React.SetStateAction<number>>;
  resetTimer: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
}

export function useTimer(
  hasStarted: boolean,
  isGameOver: boolean,
  onTimeUp: () => void
): UseTimerReturn {
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const startTimeRef = useRef<number | null>(null);
  const bonusTimeRef = useRef(0);
  const penaltyTimeRef = useRef(0);

  useEffect(() => {
    if (!hasStarted || isGameOver) {
      startTimeRef.current = null;
      return;
    }

    // Set the start time when timer begins
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    // Update timer more frequently (every 50ms) for better accuracy
    const timer = setInterval(() => {
      if (startTimeRef.current === null) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000; // seconds elapsed
      const remaining = Math.max(
        0,
        INITIAL_TIME + bonusTimeRef.current - penaltyTimeRef.current - elapsed
      );

      setTimeRemaining(remaining);

      if (remaining === 0) {
        onTimeUp();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [hasStarted, isGameOver, onTimeUp]);

  const resetTimer = () => {
    setTimeRemaining(INITIAL_TIME);
    startTimeRef.current = null;
    bonusTimeRef.current = 0;
    penaltyTimeRef.current = 0;
  };

  const addTime = (seconds: number) => {
    bonusTimeRef.current += seconds;
  };

  const subtractTime = (seconds: number) => {
    penaltyTimeRef.current += seconds;
  };

  return {
    timeRemaining,
    setTimeRemaining,
    resetTimer,
    addTime,
    subtractTime,
  };
}
