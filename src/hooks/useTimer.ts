import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isGameOver, onTimeUp]);

  const resetTimer = () => {
    setTimeRemaining(INITIAL_TIME);
  };

  const addTime = (seconds: number) => {
    setTimeRemaining(prev => prev + seconds);
  };

  const subtractTime = (seconds: number) => {
    setTimeRemaining(prev => Math.max(0, prev - seconds));
  };

  return {
    timeRemaining,
    setTimeRemaining,
    resetTimer,
    addTime,
    subtractTime,
  };
}
