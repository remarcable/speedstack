import type { GridSize } from '../utils/genericSudoku';

// Timer Configuration
export const INITIAL_TIME = 30;
export const TIME_BONUS = 8;
export const TIME_PENALTY = 5;
export const MAX_TIME = 99;

// Scoring Configuration
export const POINTS_PER_SIZE_MULTIPLIER = 10;

// UI Configuration
export const MAX_CELL_SIZE = 80;
export const BOARD_MAX_WIDTH = 350;
export const NEW_PUZZLE_ANIMATION_DURATION = 800;
export const FEEDBACK_ANIMATION_DURATION = 500;

// Level Progression Configuration
export const LEVEL_THRESHOLDS: Record<number, GridSize> = {
  0: 1, // Start with 1x1
  3: 2, // After 3 completions, move to 2x2
  6: 3, // After 6 completions, move to 3x3
  9: 4,
  12: 5,
  14: 6,
  16: 7,
  18: 8,
  20: 9,
};

/**
 * Get the next grid size based on the number of completed puzzles
 */
export function getNextSize(completed: number): GridSize {
  if (completed < 3) return 1;
  if (completed < 6) return 2;
  if (completed < 9) return 3;
  if (completed < 12) return 4;
  if (completed < 14) return 5;
  if (completed < 16) return 6;
  if (completed < 18) return 7;
  if (completed < 20) return 8;
  return 9;
}
