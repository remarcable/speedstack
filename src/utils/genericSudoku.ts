export type GridSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Board = number[][];

interface BoxConfig {
  rows: number;
  cols: number;
}

const BOX_CONFIG: Record<GridSize, BoxConfig> = {
  1: { rows: 1, cols: 1 },
  2: { rows: 1, cols: 2 }, // row-only constraint
  3: { rows: 1, cols: 3 }, // row-only constraint
  4: { rows: 2, cols: 2 },
  5: { rows: 1, cols: 5 }, // row-only constraint
  6: { rows: 2, cols: 3 },
  7: { rows: 1, cols: 7 }, // row-only constraint
  8: { rows: 2, cols: 4 },
  9: { rows: 3, cols: 3 },
};

interface DifficultyConfig {
  min: number;
  max: number;
}

const DIFFICULTY_MAP: Record<GridSize, DifficultyConfig> = {
  1: { min: 1, max: 1 },   // 1 empty cell (the only cell)
  2: { min: 2, max: 3 },   // 2-3 empty cells out of 4
  3: { min: 4, max: 5 },   // 4-5 empty cells out of 9
  4: { min: 6, max: 8 },
  5: { min: 10, max: 12 },
  6: { min: 15, max: 18 },
  7: { min: 20, max: 24 },
  8: { min: 28, max: 32 },
  9: { min: 40, max: 45 },
};

/**
 * Create an empty N×N board
 */
function createEmptyBoard(size: GridSize): Board {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
}

/**
 * Deep copy a board
 */
function copyBoard(board: Board): Board {
  return board.map(row => [...row]);
}

/**
 * Shuffle array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Check if a number is valid in a specific position
 */
function isValid(board: Board, row: number, col: number, num: number): boolean {
  const size = board.length;

  // Check row
  for (let x = 0; x < size; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < size; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check box (if applicable)
  const boxConfig = BOX_CONFIG[size as GridSize];
  if (boxConfig.rows > 1 && boxConfig.cols > 1) {
    const boxRow = Math.floor(row / boxConfig.rows) * boxConfig.rows;
    const boxCol = Math.floor(col / boxConfig.cols) * boxConfig.cols;

    for (let i = 0; i < boxConfig.rows; i++) {
      for (let j = 0; j < boxConfig.cols; j++) {
        if (board[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Fill the board using backtracking
 */
function fillBoard(board: Board): boolean {
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (board[row][col] === 0) {
        // Try numbers 1-N in random order
        const numbers = Array.from({ length: size }, (_, i) => i + 1);
        shuffleArray(numbers);

        for (const num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;

            if (fillBoard(board)) {
              return true;
            }

            board[row][col] = 0;
          }
        }

        return false;
      }
    }
  }

  return true;
}

/**
 * Generate a complete valid sudoku board of size N×N
 */
export function generateCompleteBoard(size: GridSize): Board {
  const board = createEmptyBoard(size);
  fillBoard(board);
  return board;
}

/**
 * Generate a sudoku puzzle by removing numbers from a complete board
 * @param size Grid size (1-9)
 */
export function generatePuzzle(size: GridSize): { puzzle: Board; solution: Board } {
  const solution = generateCompleteBoard(size);
  const puzzle = copyBoard(solution);

  const difficultyConfig = DIFFICULTY_MAP[size];
  const cellsToRemove =
    Math.floor(Math.random() * (difficultyConfig.max - difficultyConfig.min + 1)) + difficultyConfig.min;

  const positions: [number, number][] = [];

  // Create list of all positions
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  shuffleArray(positions);

  // Remove numbers from random positions
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    puzzle[row][col] = 0;
  }

  return { puzzle, solution };
}

/**
 * Validate if a board is a valid sudoku (no duplicates in rows, columns, or boxes)
 */
export function isValidBoard(board: Board): boolean {
  const size = board.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      const num = board[row][col];
      if (num !== 0) {
        // Temporarily remove the number to check validity
        board[row][col] = 0;
        const valid = isValid(board, row, col, num);
        board[row][col] = num;

        if (!valid) {
          return false;
        }
      }
    }
  }

  return true;
}

/**
 * Check if a specific move is valid
 */
export function isValidMove(board: Board, row: number, col: number, num: number): boolean {
  if (row < 0 || row >= board.length || col < 0 || col >= board.length) {
    return false;
  }

  if (num < 1 || num > board.length) {
    return false;
  }

  return isValid(board, row, col, num);
}

/**
 * Check if a board is completely filled (no zeros)
 */
export function isBoardComplete(board: Board): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      if (board[row][col] === 0) {
        return false;
      }
    }
  }
  return true;
}
