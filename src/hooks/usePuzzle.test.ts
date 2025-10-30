import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePuzzle } from './usePuzzle';

describe('usePuzzle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('initializes with empty boards', () => {
    const { result } = renderHook(() => usePuzzle());

    expect(result.current.puzzle).toEqual([]);
    expect(result.current.solution).toEqual([]);
    expect(result.current.userBoard).toEqual([]);
    expect(result.current.selectedCell).toBeNull();
    expect(result.current.selectedNumber).toBeNull();
    expect(result.current.isNewPuzzle).toBe(false);
  });

  it('generates a new puzzle', () => {
    const { result } = renderHook(() => usePuzzle());

    act(() => {
      result.current.generateNewPuzzle(2);
    });

    expect(result.current.puzzle.length).toBe(2);
    expect(result.current.solution.length).toBe(2);
    expect(result.current.userBoard.length).toBe(2);
    expect(result.current.isNewPuzzle).toBe(true);

    // Animation should clear after timeout
    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(result.current.isNewPuzzle).toBe(false);
  });

  it('selects and deselects cells', () => {
    const { result } = renderHook(() => usePuzzle());

    act(() => {
      result.current.setSelectedCell([0, 1]);
    });

    expect(result.current.selectedCell).toEqual([0, 1]);

    act(() => {
      result.current.setSelectedCell(null);
    });

    expect(result.current.selectedCell).toBeNull();
  });

  it('selects and deselects numbers', () => {
    const { result } = renderHook(() => usePuzzle());

    act(() => {
      result.current.setSelectedNumber(5);
    });

    expect(result.current.selectedNumber).toBe(5);

    act(() => {
      result.current.setSelectedNumber(null);
    });

    expect(result.current.selectedNumber).toBeNull();
  });

  it('updates user board', () => {
    const { result } = renderHook(() => usePuzzle());

    act(() => {
      result.current.generateNewPuzzle(2);
    });

    const newBoard = [
      [1, 2],
      [2, 1],
    ];

    act(() => {
      result.current.updateUserBoard(newBoard);
    });

    expect(result.current.userBoard).toEqual(newBoard);
  });

  it('checks if board is complete', () => {
    const { result } = renderHook(() => usePuzzle());

    act(() => {
      result.current.generateNewPuzzle(1);
    });

    // Initially not complete (has empty cells)
    expect(result.current.checkIfComplete()).toBe(false);

    // Fill the board
    act(() => {
      result.current.updateUserBoard([[1]]);
    });

    expect(result.current.checkIfComplete()).toBe(true);
  });

  it('checks if solution is correct', () => {
    const { result } = renderHook(() => usePuzzle());

    act(() => {
      result.current.generateNewPuzzle(2);
    });

    // Copy the solution to user board (correct answer)
    act(() => {
      const correctBoard = result.current.solution.map(row => [...row]);
      result.current.updateUserBoard(correctBoard);
    });

    expect(result.current.checkIfCorrect()).toBe(true);
  });
});
