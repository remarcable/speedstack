import { SudokuBoard } from '../utils/sudoku';

interface SudokuGridProps {
  board: SudokuBoard;
}

export default function SudokuGrid({ board }: SudokuGridProps) {
  return (
    <div className="sudoku-grid">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="sudoku-row">
          {row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`sudoku-cell ${
                rowIndex % 3 === 2 && rowIndex !== 8 ? 'border-bottom' : ''
              } ${colIndex % 3 === 2 && colIndex !== 8 ? 'border-right' : ''}`}
            >
              {cell !== 0 ? cell : ''}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
