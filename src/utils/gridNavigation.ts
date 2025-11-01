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
 * Simply moves one cell in the requested direction.
 *
 * @param input - Navigation parameters including current position, grid size, and direction
 * @returns New position and whether navigation was successful
 */
export function calculateNextCell(input: NavigationInput): NavigationResult {
  const { currentRow, currentCol, gridSize, direction } = input;

  // Validate input
  if (currentRow < 0 || currentRow >= gridSize || currentCol < 0 || currentCol >= gridSize) {
    return { row: currentRow, col: currentCol, moved: false };
  }

  if (direction === 'up' || direction === 'down') {
    return navigateVertical(currentRow, currentCol, gridSize, direction);
  } else {
    return navigateHorizontal(currentRow, currentCol, gridSize, direction);
  }
}

/**
 * Navigate vertically (up or down).
 * Strategy: Simply move one cell in the direction, staying in same column.
 */
function navigateVertical(
  row: number,
  col: number,
  gridSize: number,
  direction: 'up' | 'down'
): NavigationResult {
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
 * Strategy: Simply move one cell in the direction, staying in same row.
 */
function navigateHorizontal(
  row: number,
  col: number,
  gridSize: number,
  direction: 'left' | 'right'
): NavigationResult {
  const directionValue = direction === 'left' ? -1 : 1;
  const targetCol = col + directionValue;

  // Check if we're at the boundary
  if (targetCol < 0 || targetCol >= gridSize) {
    return { row, col, moved: false };
  }

  // Move to the next cell
  return { row, col: targetCol, moved: true };
}
