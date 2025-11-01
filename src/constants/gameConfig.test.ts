import { describe, it, expect } from 'vitest';
import { getPuzzleDifficulty, getNextSize } from './gameConfig';

describe('getPuzzleDifficulty', () => {
  it('returns 0.5 for size 1 (only 1 puzzle)', () => {
    expect(getPuzzleDifficulty(0, 1)).toBe(0.5);
  });

  it('returns progressive difficulty for size 2 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(1, 2)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(2, 2)).toBe(1); // Second puzzle: hardest
  });

  it('returns progressive difficulty for size 3 (3 puzzles)', () => {
    expect(getPuzzleDifficulty(3, 3)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(4, 3)).toBe(0.5); // Second puzzle: medium
    expect(getPuzzleDifficulty(5, 3)).toBe(1); // Third puzzle: hardest
  });

  it('returns progressive difficulty for size 4 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(6, 4)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(7, 4)).toBe(1); // Second puzzle: hardest
  });

  it('returns progressive difficulty for size 5 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(8, 5)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(9, 5)).toBe(1); // Second puzzle: hardest
  });

  it('returns progressive difficulty for size 6 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(10, 6)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(11, 6)).toBe(1); // Second puzzle: hardest
  });

  it('returns progressive difficulty for size 7 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(12, 7)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(13, 7)).toBe(1); // Second puzzle: hardest
  });

  it('returns progressive difficulty for size 8 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(14, 8)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(15, 8)).toBe(1); // Second puzzle: hardest
  });

  it('returns progressive difficulty for size 9 (2 puzzles)', () => {
    expect(getPuzzleDifficulty(16, 9)).toBe(0); // First puzzle: easiest
    expect(getPuzzleDifficulty(17, 9)).toBe(1); // Second puzzle: hardest
  });
});

describe('Integration: getNextSize with getPuzzleDifficulty', () => {
  it('shows progression through the game with difficulty scaling', () => {
    const progression: Array<{ completed: number; size: number; difficulty: number }> = [];

    for (let completed = 0; completed < 18; completed++) {
      const size = getNextSize(completed);
      const difficulty = getPuzzleDifficulty(completed, size);
      progression.push({ completed, size, difficulty });
    }

    // Size 1: 1 puzzle (medium)
    expect(progression[0]).toEqual({ completed: 0, size: 1, difficulty: 0.5 });

    // Size 2: 2 puzzles (easy -> hard)
    expect(progression[1]).toEqual({ completed: 1, size: 2, difficulty: 0 });
    expect(progression[2]).toEqual({ completed: 2, size: 2, difficulty: 1 });

    // Size 3: 3 puzzles (easy -> medium -> hard)
    expect(progression[3]).toEqual({ completed: 3, size: 3, difficulty: 0 });
    expect(progression[4]).toEqual({ completed: 4, size: 3, difficulty: 0.5 });
    expect(progression[5]).toEqual({ completed: 5, size: 3, difficulty: 1 });

    // Size 4: 2 puzzles (easy -> hard)
    expect(progression[6]).toEqual({ completed: 6, size: 4, difficulty: 0 });
    expect(progression[7]).toEqual({ completed: 7, size: 4, difficulty: 1 });

    // Size 5: 2 puzzles (easy -> hard)
    expect(progression[8]).toEqual({ completed: 8, size: 5, difficulty: 0 });
    expect(progression[9]).toEqual({ completed: 9, size: 5, difficulty: 1 });

    // Size 6: 2 puzzles (easy -> hard)
    expect(progression[10]).toEqual({ completed: 10, size: 6, difficulty: 0 });
    expect(progression[11]).toEqual({ completed: 11, size: 6, difficulty: 1 });
  });
});
