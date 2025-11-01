import { useEffect, useCallback } from 'react';
import type { Board } from '../utils/genericSudoku';
import { calculateNextCell } from '../utils/gridNavigation';
import {
  isNavigationKey,
  getDirectionFromKey,
  shouldHandleKeyEvent,
  isActionKey,
  isEscapeKey,
  isDeleteKey,
  parseNumberKey,
  focusCellElement,
} from '../utils/keyboardHelpers';

interface UseKeyboardParams {
  // Game state
  hasStarted: boolean;
  isGameOver: boolean;
  gridSize: number;

  // Puzzle state
  puzzle: Board;
  userBoard: Board;
  selectedCell: [number, number] | null;

  // Focus state
  focusedCell: [number, number] | null;
  setFocusedCell: (cell: [number, number] | null) => void;

  // Callbacks
  onCellClick: (row: number, col: number) => void;
  onFillCell: (row: number, col: number, num: number) => void;
  onClearCell: (row: number, col: number) => void;
  onNumberClick: (num: number) => void;
  onDeselectAll: () => void;
}

/**
 * Hook for managing all keyboard interactions in the game.
 * Handles navigation, number input, deletion, and shortcuts.
 */
export function useKeyboard({
  hasStarted,
  isGameOver,
  gridSize,
  puzzle,
  userBoard,
  selectedCell,
  focusedCell,
  setFocusedCell,
  onCellClick,
  onFillCell,
  onClearCell,
  onNumberClick,
  onDeselectAll,
}: UseKeyboardParams): {
  handleCellKeyDown: (row: number, col: number, e: React.KeyboardEvent) => void;
} {
  /**
   * Handle keyboard events when a cell is focused
   */
  const handleCellKeyDown = useCallback(
    (row: number, col: number, e: React.KeyboardEvent) => {
      if (!hasStarted || isGameOver) return;

      const isClue = puzzle[row][col] !== 0;

      // Navigation keys (Arrow, WASD, Vim hjkl)
      if (isNavigationKey(e.key)) {
        if (!shouldHandleKeyEvent(e)) {
          // Allow browser shortcuts like Cmd+Arrow keys
          return;
        }

        e.preventDefault();

        // Set focused cell when user first uses navigation keys
        if (!focusedCell) {
          setFocusedCell([row, col]);
          return;
        }

        const direction = getDirectionFromKey(e.key);
        if (!direction) return;

        // Check if Shift is held for jump mode
        const jump = e.shiftKey;

        // Use navigation algorithm to find next cell
        const result = calculateNextCell({
          currentRow: row,
          currentCol: col,
          gridSize,
          direction,
          jump,
        });

        if (!result.moved) {
          return;
        }

        setFocusedCell([result.row, result.col]);
        focusCellElement();
        return;
      }

      // Enter or Space to select/interact with cell
      if (isActionKey(e.key)) {
        e.preventDefault();
        onCellClick(row, col);
        return;
      }

      // Escape to deselect
      if (isEscapeKey(e.key)) {
        e.preventDefault();
        onDeselectAll();
        return;
      }

      // Prevent editing clue cells with number keys or delete
      if (isClue) {
        return;
      }

      // Number keys to fill cell
      const num = parseNumberKey(e.key, gridSize);
      if (num !== null) {
        e.preventDefault();
        const currentValue = userBoard[row][col];

        // If pressing the same number as current value, clear it
        if (currentValue === num) {
          onClearCell(row, col);
        } else {
          onFillCell(row, col, num);
        }
        return;
      }

      // Delete/Backspace to clear cell
      if (isDeleteKey(e.key)) {
        e.preventDefault();
        if (userBoard[row][col] !== 0) {
          onClearCell(row, col);
        }
        return;
      }
    },
    [
      hasStarted,
      isGameOver,
      puzzle,
      userBoard,
      gridSize,
      focusedCell,
      setFocusedCell,
      onCellClick,
      onFillCell,
      onClearCell,
      onDeselectAll,
    ]
  );

  /**
   * Handle global keyboard events (when no cell is focused)
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!hasStarted || isGameOver) return;

      // Handle navigation keys when no cell is focused
      if (isNavigationKey(e.key)) {
        if (!shouldHandleKeyEvent(e)) {
          // Allow browser shortcuts like Cmd+Arrow keys
          return;
        }

        e.preventDefault();

        // If we have a focused cell, try to focus it (in case user clicked outside)
        if (focusedCell) {
          const [row, col] = focusedCell;
          // Check if the focused cell is still valid (within bounds)
          if (puzzle[row] && puzzle[row][col] !== undefined) {
            focusCellElement();
            return;
          }
        }

        // If no focused cell or it's invalid, find first cell
        if (puzzle.length > 0 && puzzle[0].length > 0) {
          setFocusedCell([0, 0]);
          focusCellElement();
          return;
        }
        return;
      }

      // Handle number keys 1-9
      const num = parseNumberKey(e.key, gridSize);
      if (num !== null) {
        onNumberClick(num);
        return;
      }

      // Handle Delete/Backspace to clear selected cell
      if (isDeleteKey(e.key) && selectedCell) {
        const [row, col] = selectedCell;
        if (puzzle[row][col] === 0 && userBoard[row][col] !== 0) {
          onClearCell(row, col);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    hasStarted,
    isGameOver,
    gridSize,
    puzzle,
    userBoard,
    selectedCell,
    focusedCell,
    setFocusedCell,
    onNumberClick,
    onClearCell,
  ]);

  return {
    handleCellKeyDown,
  };
}
