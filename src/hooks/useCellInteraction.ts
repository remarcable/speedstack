import { useCallback } from 'react';
import type { Board } from '../utils/genericSudoku';
import { TIME_PENALTY } from '../constants/gameConfig';
import {
  shouldApplyPenalty,
  createBoardWithCell,
  createBoardWithClearedCell,
  isCluCell,
} from '../utils/gameLogic';

interface UseCellInteractionParams {
  puzzle: Board;
  userBoard: Board;
  selectedNumber: number | null;
  timerStarted: boolean;
  onUpdateBoard: (board: Board) => void;
  onCheckCompletion: (board: Board) => void;
  onSubtractTime: (seconds: number) => void;
  onAddPenalty: (penalty: number) => void;
  onShowTimeDelta: (delta: number) => void;
  onShowFeedback: (type: 'correct' | 'incorrect', durationMs: number) => void;
  onSetSelectedCell: (cell: [number, number] | null) => void;
}

interface UseCellInteractionReturn {
  fillCell: (row: number, col: number, num: number) => void;
  clearCell: (row: number, col: number) => void;
  handleCellClick: (row: number, col: number) => void;
}

/**
 * Hook for managing cell interactions (filling, clearing, clicking).
 * Uses pure functions from gameLogic.ts for testable business logic.
 */
export function useCellInteraction({
  puzzle,
  userBoard,
  selectedNumber,
  timerStarted,
  onUpdateBoard,
  onCheckCompletion,
  onSubtractTime,
  onAddPenalty,
  onShowTimeDelta,
  onShowFeedback,
  onSetSelectedCell,
}: UseCellInteractionParams): UseCellInteractionReturn {
  const fillCell = useCallback(
    (row: number, col: number, num: number) => {
      // Use pure function to check if penalty should apply
      if (shouldApplyPenalty(userBoard, row, col, num, timerStarted)) {
        // Invalid move - apply penalty
        onSubtractTime(TIME_PENALTY);
        onAddPenalty(TIME_PENALTY);
        onShowTimeDelta(-TIME_PENALTY);
        onShowFeedback('incorrect', 500);
        return;
      }

      // Valid move - update board and check completion
      const newBoard = createBoardWithCell(userBoard, row, col, num);
      onUpdateBoard(newBoard);
      onCheckCompletion(newBoard);
    },
    [
      userBoard,
      timerStarted,
      onUpdateBoard,
      onCheckCompletion,
      onSubtractTime,
      onAddPenalty,
      onShowTimeDelta,
      onShowFeedback,
    ]
  );

  const clearCell = useCallback(
    (row: number, col: number) => {
      const newBoard = createBoardWithClearedCell(userBoard, row, col);
      onUpdateBoard(newBoard);
    },
    [userBoard, onUpdateBoard]
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      // Use pure function to check if cell is a clue
      if (isCluCell(puzzle, row, col)) {
        // Clue cells can be selected but not edited
        onSetSelectedCell([row, col]);
        return;
      }

      const currentValue = userBoard[row][col];

      // If a number is selected
      if (selectedNumber !== null) {
        // If clicking a cell with the same number, clear it (keep number selected)
        if (currentValue === selectedNumber) {
          clearCell(row, col);
          onSetSelectedCell(null);
          return;
        }

        // Otherwise, fill/replace the cell with the selected number (keep number selected)
        fillCell(row, col, selectedNumber);
        return;
      }

      // If no number is selected
      // If cell has a value, clear it
      if (currentValue !== 0) {
        clearCell(row, col);
        onSetSelectedCell(null);
        return;
      }

      // Otherwise, just select the cell
      onSetSelectedCell([row, col]);
    },
    [puzzle, userBoard, selectedNumber, fillCell, clearCell, onSetSelectedCell]
  );

  return {
    fillCell,
    clearCell,
    handleCellClick,
  };
}
