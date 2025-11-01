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
 * Get the next grid size based on the number of completed puzzles
 * Progression: 1 of 1x1, 2 of 2x2, 3 of 3x3, then 3 of each size after
 */
export function getNextSize(completed: number): GridSize {
  if (completed < 1) return 1;
  if (completed < 3) return 2;
  if (completed < 6) return 3;
  if (completed < 8) return 4;
  if (completed < 10) return 5;
  if (completed < 12) return 6;
  if (completed < 14) return 7;
  if (completed < 16) return 8;
  return 9;
}
