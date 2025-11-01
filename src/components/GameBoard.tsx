import type { Board, GridSize } from '../utils/genericSudoku';
import { BOX_CONFIG } from '../utils/genericSudoku';

interface GameBoardProps {
  userBoard: Board;
  puzzle: Board;
  selectedCell: [number, number] | null;
  feedback: 'correct' | 'incorrect' | null;
  isNewPuzzle: boolean;
  focusedCell: [number, number] | null;
  onCellClick: (row: number, col: number) => void;
  onCellKeyDown: (row: number, col: number, e: React.KeyboardEvent) => void;
}

export function GameBoard({
  userBoard,
  puzzle,
  selectedCell,
  feedback,
  isNewPuzzle,
  focusedCell,
  onCellClick,
  onCellKeyDown,
}: GameBoardProps) {
  const gridSize = userBoard.length as GridSize;

  // Return empty board if no valid grid size
  if (!gridSize || gridSize < 1 || gridSize > 9) {
    return <div className="game-board" />;
  }

  const boxConfig = BOX_CONFIG[gridSize];
  const isLastRow = (rowIndex: number) => rowIndex === gridSize - 1;
  const isLastCol = (colIndex: number) => colIndex === gridSize - 1;

  // Only show thick borders for grids with actual box subdivisions (rows > 1 and cols > 1)
  const hasBoxSubdivisions = boxConfig.rows > 1 && boxConfig.cols > 1;

  return (
    <div
      className={`game-board ${feedback || ''} ${isNewPuzzle ? 'new-puzzle' : ''}`}
      data-grid-size={gridSize}
    >
      {userBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isInitialClue = puzzle[rowIndex][colIndex] !== 0;
            const isSelected =
              selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;
            const isFocused =
              focusedCell && focusedCell[0] === rowIndex && focusedCell[1] === colIndex;

            // Add thick borders for subdivision boundaries (only if boxes are used)
            const hasThickRightBorder =
              hasBoxSubdivisions && !isLastCol(colIndex) && (colIndex + 1) % boxConfig.cols === 0;
            const hasThickBottomBorder =
              hasBoxSubdivisions && !isLastRow(rowIndex) && (rowIndex + 1) % boxConfig.rows === 0;

            const classes = [
              'cell',
              isInitialClue ? 'clue' : '',
              isSelected ? 'selected' : '',
              hasThickRightBorder ? 'thick-right' : '',
              hasThickBottomBorder ? 'thick-bottom' : '',
            ]
              .filter(Boolean)
              .join(' ');

            // Use roving tabindex: only the focused cell (or first cell if none focused) is in tab order
            const isFirstCell = !focusedCell && rowIndex === 0 && colIndex === 0;
            const tabIndex = isFocused || isFirstCell ? 0 : -1;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={classes}
                onClick={() => onCellClick(rowIndex, colIndex)}
                onKeyDown={e => onCellKeyDown(rowIndex, colIndex, e)}
                tabIndex={tabIndex}
                role="gridcell"
                aria-label={`Row ${rowIndex + 1}, Column ${colIndex + 1}${isInitialClue ? ', initial clue' : ''}`}
              >
                {cell !== 0 ? cell : ''}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
