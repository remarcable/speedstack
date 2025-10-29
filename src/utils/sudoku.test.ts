import { describe, it, expect } from 'vitest';
import { generateCompleteBoard, generatePuzzle, isValidBoard } from './sudoku';

describe('sudoku', () => {
  describe('generateCompleteBoard', () => {
    it('should generate a 9x9 board', () => {
      const board = generateCompleteBoard();
      expect(board).toHaveLength(9);
      board.forEach(row => {
        expect(row).toHaveLength(9);
      });
    });

    it('should generate a board with numbers 1-9', () => {
      const board = generateCompleteBoard();
      board.forEach(row => {
        row.forEach(cell => {
          expect(cell).toBeGreaterThanOrEqual(1);
          expect(cell).toBeLessThanOrEqual(9);
        });
      });
    });

    it('should generate a valid sudoku board', () => {
      const board = generateCompleteBoard();
      expect(isValidBoard(board)).toBe(true);
    });

    it('should have no duplicates in rows', () => {
      const board = generateCompleteBoard();
      board.forEach(row => {
        const seen = new Set<number>();
        row.forEach(cell => {
          expect(seen.has(cell)).toBe(false);
          seen.add(cell);
        });
      });
    });

    it('should have no duplicates in columns', () => {
      const board = generateCompleteBoard();
      for (let col = 0; col < 9; col++) {
        const seen = new Set<number>();
        for (let row = 0; row < 9; row++) {
          const cell = board[row][col];
          expect(seen.has(cell)).toBe(false);
          seen.add(cell);
        }
      }
    });

    it('should have no duplicates in 3x3 boxes', () => {
      const board = generateCompleteBoard();
      for (let boxRow = 0; boxRow < 3; boxRow++) {
        for (let boxCol = 0; boxCol < 3; boxCol++) {
          const seen = new Set<number>();
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              const cell = board[boxRow * 3 + i][boxCol * 3 + j];
              expect(seen.has(cell)).toBe(false);
              seen.add(cell);
            }
          }
        }
      }
    });

    it('should generate different boards on multiple calls', () => {
      const board1 = generateCompleteBoard();
      const board2 = generateCompleteBoard();

      // Compare boards - they should be different (extremely unlikely to be the same)
      let different = false;
      for (let i = 0; i < 9 && !different; i++) {
        for (let j = 0; j < 9 && !different; j++) {
          if (board1[i][j] !== board2[i][j]) {
            different = true;
          }
        }
      }

      expect(different).toBe(true);
    });
  });

  describe('generatePuzzle', () => {
    it('should generate a puzzle and solution', () => {
      const { puzzle, solution } = generatePuzzle();
      expect(puzzle).toHaveLength(9);
      expect(solution).toHaveLength(9);
    });

    it('should have a valid solution', () => {
      const { solution } = generatePuzzle();
      expect(isValidBoard(solution)).toBe(true);
    });

    it('should have empty cells (zeros) in the puzzle', () => {
      const { puzzle } = generatePuzzle('medium');
      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });
      expect(emptyCells).toBeGreaterThan(0);
    });

    it('should generate easy puzzle with 30-35 empty cells', () => {
      const { puzzle } = generatePuzzle('easy');

      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });

      expect(emptyCells).toBeGreaterThanOrEqual(30);
      expect(emptyCells).toBeLessThanOrEqual(35);
    });

    it('should generate medium puzzle with 40-45 empty cells', () => {
      const { puzzle } = generatePuzzle('medium');

      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });

      expect(emptyCells).toBeGreaterThanOrEqual(40);
      expect(emptyCells).toBeLessThanOrEqual(45);
    });

    it('should generate hard puzzle with 50-55 empty cells', () => {
      const { puzzle } = generatePuzzle('hard');

      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });

      expect(emptyCells).toBeGreaterThanOrEqual(50);
      expect(emptyCells).toBeLessThanOrEqual(55);
    });

    it('should default to medium difficulty', () => {
      const { puzzle } = generatePuzzle();

      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });

      expect(emptyCells).toBeGreaterThanOrEqual(40);
      expect(emptyCells).toBeLessThanOrEqual(45);
    });

    it('should have puzzle cells that are subset of solution', () => {
      const { puzzle, solution } = generatePuzzle();

      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if (puzzle[i][j] !== 0) {
            expect(puzzle[i][j]).toBe(solution[i][j]);
          }
        }
      }
    });
  });

  describe('isValidBoard', () => {
    it('should return true for a valid complete board', () => {
      const board = generateCompleteBoard();
      expect(isValidBoard(board)).toBe(true);
    });

    it('should return true for a valid partial board (puzzle)', () => {
      const { puzzle } = generatePuzzle();
      expect(isValidBoard(puzzle)).toBe(true);
    });

    it('should return false for a board with duplicate in row', () => {
      const board = generateCompleteBoard();
      // Create duplicate in first row
      board[0][0] = board[0][1];
      expect(isValidBoard(board)).toBe(false);
    });

    it('should return false for a board with duplicate in column', () => {
      const board = generateCompleteBoard();
      // Create duplicate in first column
      board[0][0] = board[1][0];
      expect(isValidBoard(board)).toBe(false);
    });

    it('should return false for a board with duplicate in 3x3 box', () => {
      const board = generateCompleteBoard();
      // Create duplicate in top-left box
      board[0][0] = board[1][1];
      expect(isValidBoard(board)).toBe(false);
    });
  });
});
