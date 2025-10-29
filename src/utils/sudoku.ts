export type SudokuBoard = number[][];

export type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyConfig {
  min: number;
  max: number;
}

const DIFFICULTY_MAP: Record<Difficulty, DifficultyConfig> = {
  easy: { min: 30, max: 35 },
  medium: { min: 40, max: 45 },
  hard: { min: 50, max: 55 },
};

/**
 * Get random number of cells to remove based on difficulty
 */
function getCellsToRemove(difficulty: Difficulty): number {
  const config = DIFFICULTY_MAP[difficulty];
  return Math.floor(Math.random() * (config.max - config.min + 1)) + config.min;
}

/**
 * Check if a number is valid in a specific position
 */
function isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRow + i][boxCol + j] === num) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Fill the board using backtracking
 */
function fillBoard(board: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        // Try numbers 1-9 in random order
        const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
 * Shuffle array in place using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Create an empty 9x9 board
 */
function createEmptyBoard(): SudokuBoard {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
}

/**
 * Deep copy a board
 */
function copyBoard(board: SudokuBoard): SudokuBoard {
  return board.map(row => [...row]);
}

/**
 * Generate a complete valid sudoku board
 */
export function generateCompleteBoard(): SudokuBoard {
  const board = createEmptyBoard();
  fillBoard(board);
  return board;
}

/**
 * Generate a sudoku puzzle by removing numbers from a complete board
 * @param difficulty Difficulty level: 'easy', 'medium', or 'hard' (default: 'medium')
 */
export function generatePuzzle(difficulty: Difficulty = 'medium'): { puzzle: SudokuBoard; solution: SudokuBoard } {
  const solution = generateCompleteBoard();
  const puzzle = copyBoard(solution);

  // Get number of cells to remove based on difficulty
  const cellsToRemove = getCellsToRemove(difficulty);
  const positions: [number, number][] = [];

  // Create list of all positions
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
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
export function isValidBoard(board: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
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
