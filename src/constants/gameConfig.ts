import type { GridSize } from '../utils/genericSudoku';

// Timer Configuration
export const INITIAL_TIME = 5;
export const TIME_PENALTY = 5;

// Scoring Configuration
export const POINTS_PER_SIZE_MULTIPLIER = 8;

/**
 * Calculate time bonus based on puzzle size
 * Formula: size² × 1.8 seconds
 * This creates a tighter time pressure for more challenge
 * Rounded to avoid floating point precision errors
 */
export function getTimeBonus(size: GridSize): number {
  return Math.round(size * size * 1.4 * 10) / 10;
}

/**
 * Calculate speed multiplier based on time elapsed
 * Starts at 3x and decays linearly to 1x over 30 seconds
 * Formula: max(1.0, 3.0 - (timeElapsed / 15))
 *
 * Examples:
 * - 0s: 3.0x
 * - 7.5s: 2.0x
 * - 15s: 1.5x
 * - 30+s: 1.0x
 */
export function calculateSpeedMultiplier(timeElapsedSeconds: number): number {
  return Math.max(1.0, 3.0 - timeElapsedSeconds / 15);
}

// UI Configuration
export const NEW_PUZZLE_ANIMATION_DURATION = 800;
export const FEEDBACK_ANIMATION_DURATION = 500;

/**
 * Level progression configuration
 * Defines how many puzzles to complete for each grid size
 */
const LEVEL_PROGRESSION: Record<GridSize, number> = {
  1: 1,
  2: 2,
  3: 3,
  4: 3,
  5: 2,
  6: 2,
  7: 2,
  8: 2,
  9: 2,
};

/**
 * Get the next grid size based on the number of completed puzzles
 * Uses LEVEL_PROGRESSION to determine when to advance to the next size
 */
export function getNextSize(completed: number): GridSize {
  let cumulativeCount = 0;

  for (const size of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    cumulativeCount += LEVEL_PROGRESSION[size];
    if (completed < cumulativeCount) {
      return size;
    }
  }

  return 9; // Max size
}

/**
 * Get the puzzle difficulty based on completed count and current size
 * Returns a value from 0 (easiest) to 1 (hardest)
 * Within each size, difficulty increases with each puzzle
 */
export function getPuzzleDifficulty(completed: number, currentSize: GridSize): number {
  // Calculate the starting index for this size
  let startIndex = 0;
  for (const size of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
    if (size === currentSize) break;
    startIndex += LEVEL_PROGRESSION[size];
  }

  // Calculate which puzzle of this size we're on (0-indexed)
  const puzzleIndex = completed - startIndex;
  const puzzlesPerSize = LEVEL_PROGRESSION[currentSize];

  // Calculate difficulty: 0 for first puzzle, increasing to 1 for last puzzle
  // If only 1 puzzle, use 0.5 (medium difficulty)
  if (puzzlesPerSize === 1) {
    return 0.5;
  }

  return puzzleIndex / (puzzlesPerSize - 1);
}
