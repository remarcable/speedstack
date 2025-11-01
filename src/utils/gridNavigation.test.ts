import { describe, it, expect } from 'vitest';
import { calculateNextCell } from './gridNavigation';

describe('gridNavigation', () => {
  describe('calculateNextCell', () => {
    describe('basic movement', () => {
      it('should move down one cell', () => {
        const result = calculateNextCell({
          currentRow: 0,
          currentCol: 1,
          gridSize: 3,
          direction: 'down',
        });
        expect(result).toEqual({ row: 1, col: 1, moved: true });
      });

      it('should move up one cell', () => {
        const result = calculateNextCell({
          currentRow: 2,
          currentCol: 1,
          gridSize: 3,
          direction: 'up',
        });
        expect(result).toEqual({ row: 1, col: 1, moved: true });
      });

      it('should move right one cell', () => {
        const result = calculateNextCell({
          currentRow: 1,
          currentCol: 0,
          gridSize: 3,
          direction: 'right',
        });
        expect(result).toEqual({ row: 1, col: 1, moved: true });
      });

      it('should move left one cell', () => {
        const result = calculateNextCell({
          currentRow: 1,
          currentCol: 2,
          gridSize: 3,
          direction: 'left',
        });
        expect(result).toEqual({ row: 1, col: 1, moved: true });
      });
    });

    describe('boundary handling', () => {
      it('should not move down from bottom edge', () => {
        const result = calculateNextCell({
          currentRow: 2,
          currentCol: 1,
          gridSize: 3,
          direction: 'down',
        });
        expect(result).toEqual({ row: 2, col: 1, moved: false });
      });

      it('should not move up from top edge', () => {
        const result = calculateNextCell({
          currentRow: 0,
          currentCol: 1,
          gridSize: 3,
          direction: 'up',
        });
        expect(result).toEqual({ row: 0, col: 1, moved: false });
      });

      it('should not move right from right edge', () => {
        const result = calculateNextCell({
          currentRow: 1,
          currentCol: 2,
          gridSize: 3,
          direction: 'right',
        });
        expect(result).toEqual({ row: 1, col: 2, moved: false });
      });

      it('should not move left from left edge', () => {
        const result = calculateNextCell({
          currentRow: 1,
          currentCol: 0,
          gridSize: 3,
          direction: 'left',
        });
        expect(result).toEqual({ row: 1, col: 0, moved: false });
      });
    });

    describe('navigation over clue cells', () => {
      it('should move to next cell when moving down', () => {
        const result = calculateNextCell({
          currentRow: 0,
          currentCol: 1,
          gridSize: 3,
          direction: 'down',
        });
        // Should move to cell at (1, 1) regardless of whether it's a clue
        expect(result).toEqual({ row: 1, col: 1, moved: true });
      });

      it('should move to next cell when moving right', () => {
        const result = calculateNextCell({
          currentRow: 1,
          currentCol: 0,
          gridSize: 3,
          direction: 'right',
        });
        // Should move to cell at (1, 1) regardless of whether it's a clue
        expect(result).toEqual({ row: 1, col: 1, moved: true });
      });

      it('should navigate through multiple cells', () => {
        const result = calculateNextCell({
          currentRow: 0,
          currentCol: 0,
          gridSize: 4,
          direction: 'right',
        });
        // Should move to (0, 1) regardless of board content
        expect(result).toEqual({ row: 0, col: 1, moved: true });
      });
    });

    describe('larger grids', () => {
      it('should work with 5x5 grid', () => {
        const result = calculateNextCell({
          currentRow: 0,
          currentCol: 0,
          gridSize: 5,
          direction: 'right',
        });
        // Should move one cell right to (0, 1)
        expect(result).toEqual({ row: 0, col: 1, moved: true });
      });

      it('should work with 9x9 grid', () => {
        const result = calculateNextCell({
          currentRow: 4,
          currentCol: 4,
          gridSize: 9,
          direction: 'down',
        });
        expect(result).toEqual({ row: 5, col: 4, moved: true });
      });
    });

    describe('invalid input handling', () => {
      it('should handle out of bounds current position', () => {
        const result = calculateNextCell({
          currentRow: -1,
          currentCol: 1,
          gridSize: 3,
          direction: 'down',
        });
        expect(result).toEqual({ row: -1, col: 1, moved: false });
      });

      it('should handle 1x1 grid', () => {
        const result = calculateNextCell({
          currentRow: 0,
          currentCol: 0,
          gridSize: 1,
          direction: 'down',
        });
        expect(result).toEqual({ row: 0, col: 0, moved: false });
      });

      it('should handle 1x1 grid with all directions', () => {
        expect(
          calculateNextCell({
            currentRow: 0,
            currentCol: 0,
            gridSize: 1,
            direction: 'up',
          })
        ).toEqual({ row: 0, col: 0, moved: false });

        expect(
          calculateNextCell({
            currentRow: 0,
            currentCol: 0,
            gridSize: 1,
            direction: 'left',
          })
        ).toEqual({ row: 0, col: 0, moved: false });

        expect(
          calculateNextCell({
            currentRow: 0,
            currentCol: 0,
            gridSize: 1,
            direction: 'right',
          })
        ).toEqual({ row: 0, col: 0, moved: false });
      });
    });
  });
});
