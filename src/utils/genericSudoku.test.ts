import { describe, it, expect } from 'vitest';
import {
  generateCompleteBoard,
  generatePuzzle,
  isValidBoard,
  isValidMove,
  isBoardComplete,
  type GridSize,
} from './genericSudoku';

describe('genericSudoku', () => {
  const sizes: GridSize[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  describe('generateCompleteBoard', () => {
    sizes.forEach(size => {
      describe(`size ${size}×${size}`, () => {
        it(`should generate a ${size}×${size} board`, () => {
          const board = generateCompleteBoard(size);
          expect(board).toHaveLength(size);
          board.forEach(row => {
            expect(row).toHaveLength(size);
          });
        });

        it(`should generate a board with numbers 1-${size}`, () => {
          const board = generateCompleteBoard(size);
          board.forEach(row => {
            row.forEach(cell => {
              expect(cell).toBeGreaterThanOrEqual(1);
              expect(cell).toBeLessThanOrEqual(size);
            });
          });
        });

        it('should generate a valid sudoku board', () => {
          const board = generateCompleteBoard(size);
          expect(isValidBoard(board)).toBe(true);
        });

        it('should have no duplicates in rows', () => {
          const board = generateCompleteBoard(size);
          board.forEach(row => {
            const seen = new Set<number>();
            row.forEach(cell => {
              expect(seen.has(cell)).toBe(false);
              seen.add(cell);
            });
          });
        });

        it('should have no duplicates in columns', () => {
          const board = generateCompleteBoard(size);
          for (let col = 0; col < size; col++) {
            const seen = new Set<number>();
            for (let row = 0; row < size; row++) {
              const cell = board[row][col];
              expect(seen.has(cell)).toBe(false);
              seen.add(cell);
            }
          }
        });

        // Only test box constraints for grids with proper box divisions
        if ([4, 6, 8, 9].includes(size)) {
          it('should have no duplicates in boxes', () => {
            const board = generateCompleteBoard(size);
            const boxConfigs: Record<number, { rows: number; cols: number }> = {
              4: { rows: 2, cols: 2 },
              6: { rows: 2, cols: 3 },
              8: { rows: 2, cols: 4 },
              9: { rows: 3, cols: 3 },
            };

            const config = boxConfigs[size];
            const numBoxRows = size / config.rows;
            const numBoxCols = size / config.cols;

            for (let boxRow = 0; boxRow < numBoxRows; boxRow++) {
              for (let boxCol = 0; boxCol < numBoxCols; boxCol++) {
                const seen = new Set<number>();
                for (let i = 0; i < config.rows; i++) {
                  for (let j = 0; j < config.cols; j++) {
                    const cell = board[boxRow * config.rows + i][boxCol * config.cols + j];
                    expect(seen.has(cell)).toBe(false);
                    seen.add(cell);
                  }
                }
              }
            }
          });
        }

        it('should generate different boards on multiple calls', () => {
          // Skip for 1×1 (only 1 possible board) and 2×2 (only 2 possible boards)
          if (size <= 2) return;

          const board1 = generateCompleteBoard(size);
          const board2 = generateCompleteBoard(size);

          let different = false;
          for (let i = 0; i < size && !different; i++) {
            for (let j = 0; j < size && !different; j++) {
              if (board1[i][j] !== board2[i][j]) {
                different = true;
              }
            }
          }

          expect(different).toBe(true);
        });
      });
    });
  });

  describe('generatePuzzle', () => {
    sizes.forEach(size => {
      describe(`size ${size}×${size}`, () => {
        it('should generate a puzzle and solution', () => {
          const { puzzle, solution } = generatePuzzle(size);
          expect(puzzle).toHaveLength(size);
          expect(solution).toHaveLength(size);
        });

        it('should have a valid solution', () => {
          const { solution } = generatePuzzle(size);
          expect(isValidBoard(solution)).toBe(true);
        });

        it('should have empty cells (zeros) in the puzzle', () => {
          const { puzzle } = generatePuzzle(size);
          let emptyCells = 0;
          puzzle.forEach(row => {
            row.forEach(cell => {
              if (cell === 0) emptyCells++;
            });
          });

          expect(emptyCells).toBeGreaterThan(0);
        });

        it('should have puzzle cells that are subset of solution', () => {
          const { puzzle, solution } = generatePuzzle(size);

          for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
              if (puzzle[i][j] !== 0) {
                expect(puzzle[i][j]).toBe(solution[i][j]);
              }
            }
          }
        });

        it('should generate puzzles where initial clues do not conflict', () => {
          // Generate multiple puzzles to check consistency
          for (let attempt = 0; attempt < 5; attempt++) {
            const { puzzle } = generatePuzzle(size);

            // Check that no two clues in the same row have the same value
            for (let row = 0; row < size; row++) {
              const rowValues = puzzle[row].filter(val => val !== 0);
              const uniqueRowValues = new Set(rowValues);
              expect(rowValues.length).toBe(uniqueRowValues.size);
            }

            // Check that no two clues in the same column have the same value
            for (let col = 0; col < size; col++) {
              const colValues = [];
              for (let row = 0; row < size; row++) {
                if (puzzle[row][col] !== 0) {
                  colValues.push(puzzle[row][col]);
                }
              }
              const uniqueColValues = new Set(colValues);
              expect(colValues.length).toBe(uniqueColValues.size);
            }
          }
        });

        it('should have appropriate number of empty cells for difficulty', () => {
          const { puzzle } = generatePuzzle(size);

          let emptyCells = 0;
          puzzle.forEach(row => {
            row.forEach(cell => {
              if (cell === 0) emptyCells++;
            });
          });

          const expectedRanges: Record<number, { min: number; max: number }> = {
            1: { min: 1, max: 1 },
            2: { min: 2, max: 3 },
            3: { min: 4, max: 5 },
            4: { min: 6, max: 8 },
            5: { min: 10, max: 12 },
            6: { min: 15, max: 18 },
            7: { min: 20, max: 24 },
            8: { min: 28, max: 32 },
            9: { min: 40, max: 45 },
          };

          const range = expectedRanges[size];
          expect(emptyCells).toBeGreaterThanOrEqual(range.min);
          expect(emptyCells).toBeLessThanOrEqual(range.max);
        });
      });
    });
  });

  describe('isValidBoard', () => {
    sizes.forEach(size => {
      describe(`size ${size}×${size}`, () => {
        it('should return true for a valid complete board', () => {
          const board = generateCompleteBoard(size);
          expect(isValidBoard(board)).toBe(true);
        });

        it('should return true for a valid partial board (puzzle)', () => {
          const { puzzle } = generatePuzzle(size);
          expect(isValidBoard(puzzle)).toBe(true);
        });

        it('should return false for a board with duplicate in row', () => {
          if (size === 1) return; // Can't create duplicate in 1×1

          const board = generateCompleteBoard(size);
          // Create duplicate in first row
          if (size >= 2) {
            board[0][0] = board[0][1];
            expect(isValidBoard(board)).toBe(false);
          }
        });

        it('should return false for a board with duplicate in column', () => {
          if (size === 1) return; // Can't create duplicate in 1×1

          const board = generateCompleteBoard(size);
          // Create duplicate in first column
          if (size >= 2) {
            board[0][0] = board[1][0];
            expect(isValidBoard(board)).toBe(false);
          }
        });
      });
    });
  });

  describe('isValidMove', () => {
    it('should return true for a valid move', () => {
      const board = [[0]];
      expect(isValidMove(board, 0, 0, 1)).toBe(true);
    });

    it('should return false for out of bounds row', () => {
      const board = [[0]];
      expect(isValidMove(board, 1, 0, 1)).toBe(false);
    });

    it('should return false for out of bounds column', () => {
      const board = [[0]];
      expect(isValidMove(board, 0, 1, 1)).toBe(false);
    });

    it('should return false for invalid number (too low)', () => {
      const board = [[0]];
      expect(isValidMove(board, 0, 0, 0)).toBe(false);
    });

    it('should return false for invalid number (too high)', () => {
      const board = [[0]];
      expect(isValidMove(board, 0, 0, 2)).toBe(false);
    });

    it('should return false for number already in row', () => {
      const board = [
        [1, 0],
        [0, 0],
      ];
      expect(isValidMove(board, 0, 1, 1)).toBe(false);
    });

    it('should return false for number already in column', () => {
      const board = [
        [1, 0],
        [0, 0],
      ];
      expect(isValidMove(board, 1, 0, 1)).toBe(false);
    });

    it('should validate moves correctly for generated puzzles', () => {
      // Test that all solution cells are valid moves when placed on the puzzle
      [4, 6, 8, 9].forEach(size => {
        const { puzzle, solution } = generatePuzzle(size as GridSize);

        for (let row = 0; row < size; row++) {
          for (let col = 0; col < size; col++) {
            if (puzzle[row][col] === 0) {
              const correctNumber = solution[row][col];
              expect(isValidMove(puzzle, row, col, correctNumber)).toBe(true);
            }
          }
        }
      });
    });

    it('should correctly detect conflicts in boxes for 4x4', () => {
      // 4x4 has 2x2 boxes
      const board = [
        [1, 2, 0, 0],
        [3, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      // Trying to place 1 in top-left box should fail (box conflict)
      expect(isValidMove(board, 1, 1, 1)).toBe(false);

      // Trying to place 1 in same row or column should fail
      expect(isValidMove(board, 0, 2, 1)).toBe(false); // Same row as existing 1
      expect(isValidMove(board, 2, 0, 1)).toBe(false); // Same column as existing 1

      // Trying to place 1 in different row, column, and box should work
      expect(isValidMove(board, 2, 2, 1)).toBe(true);
      expect(isValidMove(board, 3, 3, 1)).toBe(true);

      // Test box constraint specifically
      const board2 = [
        [1, 0, 3, 4],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      // Can't place 1 in same box (top-left 2x2)
      expect(isValidMove(board2, 0, 1, 1)).toBe(false); // Same row
      expect(isValidMove(board2, 1, 0, 1)).toBe(false); // Same box
      expect(isValidMove(board2, 1, 1, 1)).toBe(false); // Same box

      // Can place 1 in different box
      expect(isValidMove(board2, 0, 2, 1)).toBe(false); // Same row!
      expect(isValidMove(board2, 2, 2, 1)).toBe(true); // Different box, row, and column
    });
  });

  describe('isBoardComplete', () => {
    it('should return true for a complete board', () => {
      const board = generateCompleteBoard(3);
      expect(isBoardComplete(board)).toBe(true);
    });

    it('should return false for an incomplete board', () => {
      const { puzzle } = generatePuzzle(3);
      // Only check if puzzle has empty cells (for sizes > 1)
      let hasEmpty = false;
      puzzle.forEach(row => {
        row.forEach(cell => {
          if (cell === 0) hasEmpty = true;
        });
      });

      if (hasEmpty) {
        expect(isBoardComplete(puzzle)).toBe(false);
      }
    });

    it('should return false for a board with one empty cell', () => {
      const board = [[1, 2], [2, 0]];
      expect(isBoardComplete(board)).toBe(false);
    });
  });
});
