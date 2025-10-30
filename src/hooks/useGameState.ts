import { useState } from 'react';
import type { GridSize } from '../utils/genericSudoku';
import { getNextSize } from '../constants/gameConfig';

interface UseGameStateReturn {
  hasStarted: boolean;
  currentSize: GridSize;
  score: number;
  completedCount: number;
  isGameOver: boolean;
  startGame: () => void;
  completeLevel: (points: number) => GridSize;
  setIsGameOver: (value: boolean) => void;
  resetGame: () => void;
}

export function useGameState(): UseGameStateReturn {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSize, setCurrentSize] = useState<GridSize>(1);
  const [score, setScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const startGame = () => {
    setHasStarted(true);
  };

  const completeLevel = (points: number): GridSize => {
    let nextSize: GridSize = 1;

    setCompletedCount(prev => {
      const newCompleted = prev + 1;
      nextSize = getNextSize(newCompleted);
      setCurrentSize(nextSize);
      return newCompleted;
    });

    setScore(prev => prev + points);

    return nextSize;
  };

  const resetGame = () => {
    setHasStarted(false);
    setCurrentSize(1);
    setScore(0);
    setCompletedCount(0);
    setIsGameOver(false);
  };

  return {
    hasStarted,
    currentSize,
    score,
    completedCount,
    isGameOver,
    startGame,
    completeLevel,
    setIsGameOver,
    resetGame,
  };
}
