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
 */
export function getTimeBonus(size: GridSize): number {
  return size * size * 1.8;
}

// UI Configuration
export const MAX_CELL_SIZE = 80;
export const BOARD_MAX_WIDTH = 350;
export const NEW_PUZZLE_ANIMATION_DURATION = 800;
export const FEEDBACK_ANIMATION_DURATION = 500;

// Level Progression Configuration
export const LEVEL_THRESHOLDS: Record<number, GridSize> = {
  0: 1, // 1 puzzle of 1x1
  1: 2, // 2 puzzles of 2x2
  3: 3, // 3 puzzles of 3x3
  6: 4, // 3 puzzles of 4x4
  9: 5, // 3 puzzles of 5x5
  12: 6, // 3 puzzles of 6x6
  15: 7, // 3 puzzles of 7x7
  18: 8, // 3 puzzles of 8x8
  21: 9, // 3 puzzles of 9x9
};

/**
 * Get the next grid size based on the number of completed puzzles
 * Progression: 1 of 1x1, 2 of 2x2, 3 of 3x3, then 3 of each size after
 */
export function getNextSize(completed: number): GridSize {
  if (completed < 1) return 1;
  if (completed < 3) return 2;
  if (completed < 6) return 3;
  if (completed < 9) return 4;
  if (completed < 12) return 5;
  if (completed < 15) return 6;
  if (completed < 18) return 7;
  if (completed < 21) return 8;
  return 9;
}
