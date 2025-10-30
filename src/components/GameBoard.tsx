import type { Board } from '../utils/genericSudoku';

interface GameBoardProps {
  userBoard: Board;
  puzzle: Board;
  selectedCell: [number, number] | null;
  feedback: 'correct' | 'incorrect' | null;
  isNewPuzzle: boolean;
  cellSize: number;
  onCellClick: (row: number, col: number) => void;
}

export function GameBoard({
  userBoard,
  puzzle,
  selectedCell,
  feedback,
  isNewPuzzle,
  cellSize,
  onCellClick,
}: GameBoardProps) {
  return (
    <div className={`game-board ${feedback || ''} ${isNewPuzzle ? 'new-puzzle' : ''}`}>
      {userBoard.map((row, rowIndex) => (
        <div key={rowIndex} className="board-row">
          {row.map((cell, colIndex) => {
            const isInitialClue = puzzle[rowIndex][colIndex] !== 0;
            const isSelected =
              selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${isInitialClue ? 'clue' : ''} ${isSelected ? 'selected' : ''}`}
                style={{
                  width: `${cellSize}px`,
                  height: `${cellSize}px`,
                  fontSize: `${cellSize * 0.5}px`,
                }}
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
