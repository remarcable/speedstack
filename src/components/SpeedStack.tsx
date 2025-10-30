import { useState, useEffect, useCallback } from 'react';
import {
  generatePuzzle,
  isValidMove,
  isBoardComplete,
  type GridSize,
  type Board,
} from '../utils/genericSudoku';
import '../SpeedStack.css';

const INITIAL_TIME = 30;
const TIME_BONUS = 8;
const TIME_PENALTY = 5;

function SpeedStack() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSize, setCurrentSize] = useState<GridSize>(1);
  const [puzzle, setPuzzle] = useState<Board>([]);
  const [solution, setSolution] = useState<Board>([]);
  const [userBoard, setUserBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [score, setScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isNewPuzzle, setIsNewPuzzle] = useState(false);

  const getNextSize = (completed: number): GridSize => {
    if (completed < 3) return 1;
    if (completed < 6) return 2;
    if (completed < 9) return 3;
    if (completed < 12) return 4;
    if (completed < 14) return 5;
    if (completed < 16) return 6;
    if (completed < 18) return 7;
    if (completed < 20) return 8;
    return 9;
  };

  const generateNewPuzzle = useCallback((size: GridSize) => {
    const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(size);
    setPuzzle(newPuzzle);
    setSolution(newSolution);
    setUserBoard(newPuzzle.map(row => [...row]));
    setSelectedCell(null);
    setSelectedNumber(null);

    // Trigger new puzzle animation
    setIsNewPuzzle(true);
    setTimeout(() => setIsNewPuzzle(false), 800);
  }, []);

  const checkCompletion = useCallback((boardToCheck: Board) => {
    if (isBoardComplete(boardToCheck)) {
      // Check if the solution is correct
      let isCorrect = true;
      for (let i = 0; i < boardToCheck.length; i++) {
        for (let j = 0; j < boardToCheck[i].length; j++) {
          if (boardToCheck[i][j] !== solution[i][j]) {
            isCorrect = false;
            break;
          }
        }
        if (!isCorrect) break;
      }

      if (isCorrect) {
        // Puzzle completed correctly
        const newCompleted = completedCount + 1;
        const newScore = score + currentSize * 10;
        const newTime = Math.min(timeRemaining + TIME_BONUS, 99);

        setCompletedCount(newCompleted);
        setScore(newScore);
        setTimeRemaining(newTime);

        const nextSize = getNextSize(newCompleted);
        setCurrentSize(nextSize);
        generateNewPuzzle(nextSize);

        setFeedback('correct');
        setTimeout(() => setFeedback(null), 500);
      }
    }
  }, [solution, completedCount, score, currentSize, timeRemaining, generateNewPuzzle]);

  useEffect(() => {
    generateNewPuzzle(1);
  }, [generateNewPuzzle]);

  useEffect(() => {
    if (!hasStarted || isGameOver) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, isGameOver]);

  const handleCellClick = (row: number, col: number) => {
    if (!hasStarted || isGameOver) return;
    if (puzzle[row][col] !== 0) return; // Can't change initial clues

    // If a number is already selected, fill the cell
    if (selectedNumber !== null) {
      fillCell(row, col, selectedNumber);
    } else {
      // Otherwise, just select the cell
      setSelectedCell([row, col]);
    }
  };

  const fillCell = (row: number, col: number, num: number) => {
    const newBoard = userBoard.map(r => [...r]);
    newBoard[row][col] = num;

    if (isValidMove(userBoard, row, col, num)) {
      setUserBoard(newBoard);
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 300);

      // Check completion with the new board directly
      checkCompletion(newBoard);
    } else {
      // Invalid move - penalty
      setTimeRemaining(prev => Math.max(0, prev - TIME_PENALTY));
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const handleStartGame = () => {
    setHasStarted(true);
  };

  const handleNumberClick = (num: number) => {
    if (!hasStarted || isGameOver) return;

    // Toggle number selection
    if (selectedNumber === num) {
      setSelectedNumber(null);
    } else {
      setSelectedNumber(num);

      // If a cell is already selected, fill it immediately
      if (selectedCell) {
        const [row, col] = selectedCell;
        if (puzzle[row][col] === 0) {
          fillCell(row, col, num);
          setSelectedCell(null);
        }
      }
    }
  };

  const handleRestart = () => {
    setHasStarted(false);
    setCurrentSize(1);
    setScore(0);
    setCompletedCount(0);
    setTimeRemaining(INITIAL_TIME);
    setIsGameOver(false);
    setSelectedCell(null);
    setSelectedNumber(null);
    setFeedback(null);
    generateNewPuzzle(1);
  };

  const getTimerColor = () => {
    if (timeRemaining > 15) return 'timer-green';
    if (timeRemaining > 10) return 'timer-yellow';
    return 'timer-red';
  };

  const cellSize = Math.min(80, Math.floor(350 / currentSize));

  return (
    <div className="speed-stack">
      <h1>Speed Stack Sudoku</h1>

      <div className="stats">
        <div className={`timer ${getTimerColor()}`}>
          Time: {timeRemaining}s
        </div>
        <div className="score">Score: {score}</div>
        <div className="level">
          Level: {currentSize}×{currentSize} (#{completedCount + 1})
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((completedCount % 3) / 3) * 100}%`,
          }}
        />
      </div>

      {!hasStarted && (
        <div className="start-overlay">
          <div className="start-modal">
            <h2>Ready to Stack?</h2>
            <p>Start with simple 1×1 puzzles and progress all the way to 9×9!</p>
            <p className="instructions">
              • Click a number, then click cells to fill them
              • Or click a cell first, then choose a number
              • Complete puzzles quickly to level up
              • Wrong answers cost you 5 seconds
            </p>
            <button className="start-button" onClick={handleStartGame}>
              Start Game
            </button>
          </div>
        </div>
      )}

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
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell !== 0 ? cell : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="number-buttons">
        {Array.from({ length: currentSize }, (_, i) => i + 1).map(num => (
          <button
            key={num}
            className={`number-button ${selectedNumber === num ? 'selected' : ''}`}
            onClick={() => handleNumberClick(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {isGameOver && (
        <div className="game-over-overlay">
          <div className="game-over-modal">
            <h2>Game Over!</h2>
            <p className="final-score">Final Score: {score}</p>
            <p className="final-level">
              Reached Level: {currentSize}×{currentSize}
            </p>
            <p className="total-completed">Puzzles Completed: {completedCount}</p>
            <button className="restart-button" onClick={handleRestart}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SpeedStack;
