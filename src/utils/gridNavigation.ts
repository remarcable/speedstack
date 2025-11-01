export type Direction = 'up' | 'down' | 'left' | 'right';

export interface NavigationInput {
  /** Current row position (0-indexed) */
  currentRow: number;
  /** Current column position (0-indexed) */
  currentCol: number;
  /** Grid size (N for an N×N grid) */
  gridSize: number;
  /** Direction to move */
  direction: Direction;
  /** If true, jump to edge of grid instead of moving one cell */
  jump?: boolean;
}

export interface NavigationResult {
  /** New row position */
  row: number;
  /** New column position */
  col: number;
  /** Whether navigation was successful (false if no valid cell found) */
  moved: boolean;
}

/**
 * Calculate the next cell position when navigating in a given direction.
 * Simply moves one cell in the requested direction, or jumps to edge if jump is true.
 *
 * @param input - Navigation parameters including current position, grid size, direction, and jump mode
 * @returns New position and whether navigation was successful
 */
export function calculateNextCell(input: NavigationInput): NavigationResult {
  const { currentRow, currentCol, gridSize, direction, jump = false } = input;

  // Validate input
  if (currentRow < 0 || currentRow >= gridSize || currentCol < 0 || currentCol >= gridSize) {
    return { row: currentRow, col: currentCol, moved: false };
  }

  if (direction === 'up' || direction === 'down') {
    return navigateVertical(currentRow, currentCol, gridSize, direction, jump);
  } else {
    return navigateHorizontal(currentRow, currentCol, gridSize, direction, jump);
  }
}

/**
 * Navigate vertically (up or down).
 * Strategy: Move one cell in the direction, or jump to top/bottom edge if jump is true.
 */
function navigateVertical(
  row: number,
  col: number,
  gridSize: number,
  direction: 'up' | 'down',
  jump: boolean
): NavigationResult {
  if (jump) {
    // Jump to edge: top row (0) or bottom row (gridSize - 1)
    const targetRow = direction === 'up' ? 0 : gridSize - 1;

    // If already at the edge, don't move
    if (row === targetRow) {
      return { row, col, moved: false };
    }

    return { row: targetRow, col, moved: true };
  }

  // Normal movement: one cell at a time
  const directionValue = direction === 'up' ? -1 : 1;
  const targetRow = row + directionValue;

  // Check if we're at the boundary
  if (targetRow < 0 || targetRow >= gridSize) {
    return { row, col, moved: false };
  }

  // Move to the next cell
  return { row: targetRow, col, moved: true };
}

/**
 * Navigate horizontally (left or right).
 * Strategy: Move one cell in the direction, or jump to left/right edge if jump is true.
 */
function navigateHorizontal(
  row: number,
  col: number,
  gridSize: number,
  direction: 'left' | 'right',
  jump: boolean
): NavigationResult {
  if (jump) {
    // Jump to edge: leftmost column (0) or rightmost column (gridSize - 1)
    const targetCol = direction === 'left' ? 0 : gridSize - 1;

    // If already at the edge, don't move
    if (col === targetCol) {
      return { row, col, moved: false };
    }

    return { row, col: targetCol, moved: true };
  }

  // Normal movement: one cell at a time
  const directionValue = direction === 'left' ? -1 : 1;
  const targetCol = col + directionValue;

  // Check if we're at the boundary
  if (targetCol < 0 || targetCol >= gridSize) {
    return { row, col, moved: false };
  }

  // Move to the next cell
  return { row, col: targetCol, moved: true };
}
