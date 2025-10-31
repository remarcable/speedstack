import { useState, useCallback } from 'react';
import { generatePuzzle, isBoardComplete, type GridSize, type Board } from '../utils/genericSudoku';
import { NEW_PUZZLE_ANIMATION_DURATION } from '../constants/gameConfig';

interface UsePuzzleReturn {
  puzzle: Board;
  solution: Board;
  userBoard: Board;
  selectedCell: [number, number] | null;
  selectedNumber: number | null;
  isNewPuzzle: boolean;
  puzzleStartTime: number;
  setSelectedCell: (cell: [number, number] | null) => void;
  setSelectedNumber: (num: number | null) => void;
  updateUserBoard: (board: Board) => void;
  checkIfComplete: () => boolean;
  checkIfCorrect: () => boolean;
  generateNewPuzzle: (size: GridSize) => void;
  getPuzzleElapsedTime: () => number;
}

export function usePuzzle(): UsePuzzleReturn {
  const [puzzle, setPuzzle] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [userBoard, setUserBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isNewPuzzle, setIsNewPuzzle] = useState(false);
  const [puzzleStartTime, setPuzzleStartTime] = useState<number>(() => Date.now());

  const generateNewPuzzleCallback = useCallback((size: GridSize) => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(size);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserBoard(newPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setSelectedNumber(null);
    setPuzzleStartTime(Date.now());

    // Trigger new puzzle animation
    setIsNewPuzzle(true);
    setTimeout(() => setIsNewPuzzle(false), NEW_PUZZLE_ANIMATION_DURATION);
  }, []);

  const updateUserBoard = (board: Board) => {
    setUserBoard(board);
  };

  const checkIfComplete = () => {
    return isBoardComplete(userBoard);
  };

  const checkIfCorrect = () => {
    if (!isBoardComplete(userBoard)) return false;

    for (let i = 0; i < userBoard.length; i++) {
      for (let j = 0; j < userBoard[i].length; j++) {
        if (userBoard[i][j] !== solution[i][j]) {
          return false;
        }
      }
    }
    return true;
  };

  const getPuzzleElapsedTime = (): number => {
    return (Date.now() - puzzleStartTime) / 1000; // Return in seconds
  };

  return {
    puzzle,
    solution,
    userBoard,
    selectedCell,
    selectedNumber,
    isNewPuzzle,
    puzzleStartTime,
    setSelectedCell,
    setSelectedNumber,
    updateUserBoard,
    checkIfComplete,
    checkIfCorrect,
    generateNewPuzzle: generateNewPuzzleCallback,
    getPuzzleElapsedTime,
  };
}
