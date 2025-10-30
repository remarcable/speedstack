import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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

    expect(nextSize!).toBe(1); // Still size 1 after first completion
    expect(result.current.completedCount).toBe(1);
    expect(result.current.score).toBe(10);
  });

  it('progresses through levels correctly', () => {
    const { result } = renderHook(() => useGameState());

    // Complete 3 levels to reach size 2
    act(() => {
      result.current.completeLevel(10); // Completion 1
      result.current.completeLevel(10); // Completion 2
      result.current.completeLevel(10); // Completion 3
    });

    expect(result.current.completedCount).toBe(3);
    expect(result.current.score).toBe(30);
    expect(result.current.currentSize).toBe(2); // Should now be size 2
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
