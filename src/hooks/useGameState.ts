import { useState } from 'react';
import type { GridSize } from '../utils/genericSudoku';
import { getNextSize } from '../constants/gameConfig';

interface UseGameStateReturn {
  hasStarted: boolean;
  currentSize: GridSize;
  score: number;
  completedCount: number;
  isGameOver: boolean;
  totalBonuses: number;
  totalPenalties: number;
  startTime: number | null;
  startGame: () => void;
  completeLevel: (points: number) => GridSize;
  addBonus: (bonus: number) => void;
  addPenalty: (penalty: number) => void;
  setIsGameOver: (value: boolean) => void;
  resetGame: () => void;
  getPlayTime: () => number;
}

export function useGameState(): UseGameStateReturn {
  const [hasStarted, setHasStarted] = useState(true);
  const [currentSize, setCurrentSize] = useState<GridSize>(1);
  const [score, setScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [totalBonuses, setTotalBonuses] = useState(0);
  const [totalPenalties, setTotalPenalties] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(() => Date.now());

  const startGame = () => {
    setHasStarted(true);
    if (startTime === null) {
      setStartTime(Date.now());
    }
  };

  const addBonus = (bonus: number) => {
    setTotalBonuses(prev => prev + bonus);
  };

  const addPenalty = (penalty: number) => {
    setTotalPenalties(prev => prev + penalty);
  };

  const getPlayTime = (): number => {
    if (startTime === null) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  const completeLevel = (points: number): GridSize => {
    let nextSize: GridSize = 1;

    // Update all state in a single batch
    setCompletedCount(prev => {
      const newCompleted = prev + 1;
      nextSize = getNextSize(newCompleted);

      // Update size and score in the same update cycle
      setCurrentSize(nextSize);
      setScore(prevScore => prevScore + points);

      return newCompleted;
    });

    return nextSize;
  };

  const resetGame = () => {
    setHasStarted(true);
    setCurrentSize(1);
    setScore(0);
    setCompletedCount(0);
    setIsGameOver(false);
    setTotalBonuses(0);
    setTotalPenalties(0);
    setStartTime(Date.now());
  };

  return {
    hasStarted,
    currentSize,
    score,
    completedCount,
    isGameOver,
    totalBonuses,
    totalPenalties,
    startTime,
    startGame,
    completeLevel,
    addBonus,
    addPenalty,
    setIsGameOver,
    resetGame,
    getPlayTime,
  };
}
