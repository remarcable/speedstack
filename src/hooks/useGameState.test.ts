import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useGameState } from './useGameState';

describe('useGameState', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useGameState());

    expect(result.current.hasStarted).toBe(false);
    expect(result.current.currentSize).toBe(1);
    expect(result.current.score).toBe(0);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.isGameOver).toBe(false);
  });

  it('starts the game', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
    });

    expect(result.current.hasStarted).toBe(true);
  });

  it('completes a level and returns next size', () => {
    const { result } = renderHook(() => useGameState());

    let nextSize: number;
    act(() => {
      nextSize = result.current.completeLevel(10);
    });

    expect(nextSize!).toBe(2); // After 1 completion, move to size 2
    expect(result.current.completedCount).toBe(1);
    expect(result.current.score).toBe(10);
  });

  it('progresses through levels correctly', async () => {
    const { result } = renderHook(() => useGameState());

    // Complete 3 levels to reach size 3
    act(() => {
      result.current.completeLevel(10); // Completion 1 (1x1 done, move to 2x2)
      result.current.completeLevel(10); // Completion 2 (2x2 #1 done)
      result.current.completeLevel(10); // Completion 3 (2x2 #2 done, move to 3x3)
    });

    await waitFor(() => {
      expect(result.current.completedCount).toBe(3);
      expect(result.current.score).toBe(30);
      expect(result.current.currentSize).toBe(3); // Should now be size 3
    });
  });

  it('resets game to initial state', () => {
    const { result } = renderHook(() => useGameState());

    act(() => {
      result.current.startGame();
      result.current.completeLevel(100);
      result.current.setIsGameOver(true);
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.hasStarted).toBe(false);
    expect(result.current.currentSize).toBe(1);
    expect(result.current.score).toBe(0);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.isGameOver).toBe(false);
  });
});
