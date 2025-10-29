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
      const { puzzle } = generatePuzzle(45);
      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });
      expect(emptyCells).toBeGreaterThan(0);
    });

    it('should respect difficulty parameter', () => {
      const difficulty = 30;
      const { puzzle } = generatePuzzle(difficulty);

      let emptyCells = 0;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) emptyCells++;
        });
      });

      expect(emptyCells).toBe(difficulty);
    });

    it('should clamp difficulty between 20 and 64', () => {
      const { puzzle: easyPuzzle } = generatePuzzle(10); // Too easy
      const { puzzle: hardPuzzle } = generatePuzzle(70); // Too hard

      let easyEmpty = 0;
      let hardEmpty = 0;

      easyPuzzle.forEach(row => row.forEach(cell => { if (cell === 0) easyEmpty++; }));
      hardPuzzle.forEach(row => row.forEach(cell => { if (cell === 0) hardEmpty++; }));

      expect(easyEmpty).toBe(20);
      expect(hardEmpty).toBe(64);
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
