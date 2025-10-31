import type { Board, GridSize } from '../utils/genericSudoku';
import { BOX_CONFIG } from '../utils/genericSudoku';

interface GameBoardProps {
  userBoard: Board;
  puzzle: Board;
  selectedCell: [number, number] | null;
  feedback: 'correct' | 'incorrect' | null;
  isNewPuzzle: boolean;
  onCellClick: (row: number, col: number) => void;
}

export function GameBoard({
  userBoard,
  puzzle,
  selectedCell,
  feedback,
  isNewPuzzle,
  onCellClick,
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

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={classes}
                onClick={() => onCellClick(rowIndex, colIndex)}
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
