import { describe, it, expect } from 'vitest';
import {
  calculatePoints,
  shouldApplyPenalty,
  isPuzzleCorrectlyCompleted,
  createBoardWithCell,
  createBoardWithClearedCell,
  isCluCell,
} from './gameLogic';

describe('gameLogic', () => {
  describe('calculatePoints', () => {
    it('should calculate points with speed multiplier', () => {
      // Size 3, completed instantly (3x multiplier)
      // Base: 3 * 8 = 24, With multiplier: 24 * 3 = 72
      expect(calculatePoints(3, 0)).toBe(72);
    });

    it('should give maximum points for fast completion', () => {
      // Size 5, 0 seconds (3x multiplier)
      // Base: 5 * 8 = 40, With multiplier: 40 * 3 = 120
      expect(calculatePoints(5, 0)).toBe(120);
    });

    it('should give reduced points for slower completion', () => {
      // Size 3, 15 seconds (2x multiplier: 3.0 - 15/15 = 2.0)
      // Base: 3 * 8 = 24, With multiplier: 24 * 2.0 = 48
      expect(calculatePoints(3, 15)).toBe(48);
    });

    it('should give minimum points for very slow completion', () => {
      // Size 3, 30+ seconds (1x multiplier)
      // Base: 3 * 8 = 24, With multiplier: 24 * 1 = 24
      expect(calculatePoints(3, 30)).toBe(24);
      expect(calculatePoints(3, 100)).toBe(24);
    });

    it('should scale with grid size', () => {
      // Same time, different sizes
      const time = 10;
      const points1 = calculatePoints(1, time);
      const points3 = calculatePoints(3, time);
      const points9 = calculatePoints(9, time);

      expect(points1).toBeLessThan(points3);
      expect(points3).toBeLessThan(points9);
    });

    it('should return integer points (rounded)', () => {
      // Ensure no floating point results
      for (let size = 1; size <= 9; size++) {
        for (let time = 0; time <= 30; time += 5) {
          const points = calculatePoints(size as any, time);
          expect(points).toBe(Math.floor(points));
        }
      }
    });
  });

  describe('shouldApplyPenalty', () => {
    // Use 4x4 board for clearer test cases (2x2 boxes)
    const validBoard = [
      [1, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    it('should return true when timer started and move is invalid', () => {
      // Placing 1 in same row is invalid
      expect(shouldApplyPenalty(validBoard, 0, 2, 1, true)).toBe(true);
      // Placing 1 in same column is invalid
      expect(shouldApplyPenalty(validBoard, 1, 0, 1, true)).toBe(true);
    });

    it('should return false when timer has not started', () => {
      // Invalid move, but timer not started
      expect(shouldApplyPenalty(validBoard, 0, 2, 1, false)).toBe(false);
    });

    it('should return false when move is valid', () => {
      // Valid move (3 can be placed in row 1, col 0 - not in row, col, or box)
      expect(shouldApplyPenalty(validBoard, 1, 0, 3, true)).toBe(false);
    });

    it('should return false for valid move regardless of timer', () => {
      // 3 is valid in row 1, col 0
      expect(shouldApplyPenalty(validBoard, 1, 0, 3, false)).toBe(false);
      expect(shouldApplyPenalty(validBoard, 1, 0, 3, true)).toBe(false);
    });

    it('should handle edge cases for 1x1 grid', () => {
      const board1x1 = [[0]];
      expect(shouldApplyPenalty(board1x1, 0, 0, 1, true)).toBe(false);
    });
  });

  describe('isPuzzleCorrectlyCompleted', () => {
    it('should return true for correctly completed puzzle', () => {
      const completed = [
        [1, 2, 3],
        [2, 3, 1],
        [3, 1, 2],
      ];
      expect(isPuzzleCorrectlyCompleted(completed)).toBe(true);
    });

    it('should return false for incomplete puzzle', () => {
      const incomplete = [
        [1, 2, 3],
        [2, 0, 1],
        [3, 1, 2],
      ];
      expect(isPuzzleCorrectlyCompleted(incomplete)).toBe(false);
    });

    it('should return false for completed but invalid puzzle', () => {
      const invalid = [
        [1, 2, 3],
        [1, 2, 3], // Duplicate row
        [1, 2, 3],
      ];
      expect(isPuzzleCorrectlyCompleted(invalid)).toBe(false);
    });

    it('should return true for 1x1 completed puzzle', () => {
      expect(isPuzzleCorrectlyCompleted([[1]])).toBe(true);
    });

    it('should return false for empty 1x1 puzzle', () => {
      expect(isPuzzleCorrectlyCompleted([[0]])).toBe(false);
    });

    it('should handle 2x2 puzzle correctly', () => {
      const valid2x2 = [
        [1, 2],
        [2, 1],
      ];
      expect(isPuzzleCorrectlyCompleted(valid2x2)).toBe(true);

      const invalid2x2 = [
        [1, 1], // Duplicate
        [2, 2],
      ];
      expect(isPuzzleCorrectlyCompleted(invalid2x2)).toBe(false);
    });
  });

  describe('createBoardWithCell', () => {
    it('should create new board with cell filled', () => {
      const original = [
        [1, 0, 3],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const newBoard = createBoardWithCell(original, 0, 1, 2);

      expect(newBoard[0][1]).toBe(2);
      expect(original[0][1]).toBe(0); // Original unchanged
    });

    it('should not mutate original board', () => {
      const original = [
        [1, 2, 3],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const originalCopy = JSON.parse(JSON.stringify(original));

      createBoardWithCell(original, 1, 1, 5);

      expect(original).toEqual(originalCopy);
    });

    it('should handle 1x1 board', () => {
      const board = [[0]];
      const newBoard = createBoardWithCell(board, 0, 0, 1);

      expect(newBoard[0][0]).toBe(1);
      expect(board[0][0]).toBe(0);
    });

    it('should allow overwriting existing values', () => {
      const board = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const newBoard = createBoardWithCell(board, 1, 1, 9);

      expect(newBoard[1][1]).toBe(9);
      expect(board[1][1]).toBe(5);
    });
  });

  describe('createBoardWithClearedCell', () => {
    it('should create new board with cell cleared', () => {
      const original = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const newBoard = createBoardWithClearedCell(original, 1, 1);

      expect(newBoard[1][1]).toBe(0);
      expect(original[1][1]).toBe(5); // Original unchanged
    });

    it('should not mutate original board', () => {
      const original = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const originalCopy = JSON.parse(JSON.stringify(original));

      createBoardWithClearedCell(original, 1, 1);

      expect(original).toEqual(originalCopy);
    });

    it('should handle already cleared cell', () => {
      const board = [
        [1, 0, 3],
        [0, 0, 0],
        [0, 0, 0],
      ];
      const newBoard = createBoardWithClearedCell(board, 0, 1);

      expect(newBoard[0][1]).toBe(0);
    });

    it('should handle 1x1 board', () => {
      const board = [[1]];
      const newBoard = createBoardWithClearedCell(board, 0, 0);

      expect(newBoard[0][0]).toBe(0);
      expect(board[0][0]).toBe(1);
    });
  });

  describe('isCluCell', () => {
    it('should return true for clue cells', () => {
      const puzzle = [
        [1, 0, 3],
        [0, 0, 0],
        [7, 0, 9],
      ];

      expect(isCluCell(puzzle, 0, 0)).toBe(true); // 1
      expect(isCluCell(puzzle, 0, 2)).toBe(true); // 3
      expect(isCluCell(puzzle, 2, 0)).toBe(true); // 7
      expect(isCluCell(puzzle, 2, 2)).toBe(true); // 9
    });

    it('should return false for empty cells', () => {
      const puzzle = [
        [1, 0, 3],
        [0, 0, 0],
        [7, 0, 9],
      ];

      expect(isCluCell(puzzle, 0, 1)).toBe(false); // 0
      expect(isCluCell(puzzle, 1, 0)).toBe(false); // 0
      expect(isCluCell(puzzle, 1, 1)).toBe(false); // 0
      expect(isCluCell(puzzle, 2, 1)).toBe(false); // 0
    });

    it('should handle 1x1 puzzle', () => {
      expect(isCluCell([[1]], 0, 0)).toBe(true);
      expect(isCluCell([[0]], 0, 0)).toBe(false);
    });

    it('should handle fully filled puzzle', () => {
      const puzzle = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];

      // All cells are clues
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(isCluCell(puzzle, i, j)).toBe(true);
        }
      }
    });
  });
});
