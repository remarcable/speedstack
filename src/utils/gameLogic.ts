import {
  isBoardComplete,
  isValidBoard,
  isValidMove,
  type Board,
  type GridSize,
} from './genericSudoku';
import { POINTS_PER_SIZE_MULTIPLIER, calculateSpeedMultiplier } from '../constants/gameConfig';

/**
 * Calculate points earned for completing a puzzle.
 * Points = basePoints * speedMultiplier
 * Base points = gridSize * POINTS_PER_SIZE_MULTIPLIER
 * Speed multiplier decays from 3x to 1x based on time elapsed
 *
 * @param gridSize - Size of the completed puzzle (1-9)
 * @param timeElapsedSeconds - Time taken to complete the puzzle in seconds
 * @returns Points earned (rounded to nearest integer)
 */
export function calculatePoints(gridSize: GridSize, timeElapsedSeconds: number): number {
  const basePoints = gridSize * POINTS_PER_SIZE_MULTIPLIER;
  const speedMultiplier = calculateSpeedMultiplier(timeElapsedSeconds);
  return Math.round(basePoints * speedMultiplier);
}

/**
 * Check if a move should trigger a time penalty.
 * Penalty applies when:
 * - Timer has started (not the first puzzle)
 * - The move is invalid (violates sudoku rules)
 *
 * @param board - Current board state
 * @param row - Row to place number (0-indexed)
 * @param col - Column to place number (0-indexed)
 * @param num - Number to place (1-9)
 * @param timerStarted - Whether the timer has started
 * @returns True if penalty should be applied
 */
export function shouldApplyPenalty(
  board: Board,
  row: number,
  col: number,
  num: number,
  timerStarted: boolean
): boolean {
  return timerStarted && !isValidMove(board, row, col, num);
}

/**
 * Check if a puzzle is correctly completed.
 * A puzzle is correct when:
 * - All cells are filled (no zeros)
 * - The board follows all sudoku rules (no duplicates in rows/cols/boxes)
 *
 * Note: This accepts ANY valid solution, not just one specific solution
 *
 * @param board - Board to check
 * @returns True if the puzzle is correctly completed
 */
export function isPuzzleCorrectlyCompleted(board: Board): boolean {
  return isBoardComplete(board) && isValidBoard(board);
}

/**
 * Create a new board with a cell filled in.
 * Does not mutate the original board.
 *
 * @param board - Original board
 * @param row - Row to fill (0-indexed)
 * @param col - Column to fill (0-indexed)
 * @param num - Number to place (1-9)
 * @returns New board with the cell filled
 */
export function createBoardWithCell(board: Board, row: number, col: number, num: number): Board {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = num;
  return newBoard;
}

/**
 * Create a new board with a cell cleared.
 * Does not mutate the original board.
 *
 * @param board - Original board
 * @param row - Row to clear (0-indexed)
 * @param col - Column to clear (0-indexed)
 * @returns New board with the cell cleared (set to 0)
 */
export function createBoardWithClearedCell(board: Board, row: number, col: number): Board {
  const newBoard = board.map(r => [...r]);
  newBoard[row][col] = 0;
  return newBoard;
}

/**
 * Check if a cell is a clue (initial/given cell).
 * Clue cells cannot be edited by the player.
 *
 * @param puzzle - Original puzzle (with clues)
 * @param row - Row to check (0-indexed)
 * @param col - Column to check (0-indexed)
 * @returns True if the cell is a clue
 */
export function isCluCell(puzzle: Board, row: number, col: number): boolean {
  return puzzle[row][col] !== 0;
}
