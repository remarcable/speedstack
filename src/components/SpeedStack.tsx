import { useState, useEffect, useCallback } from 'react';
import { isValidMove, isBoardComplete, isValidBoard, type Board } from '../utils/genericSudoku';
import {
  TIME_PENALTY,
  POINTS_PER_SIZE_MULTIPLIER,
  MAX_CELL_SIZE,
  BOARD_MAX_WIDTH,
  FEEDBACK_ANIMATION_DURATION,
  getTimeBonus,
} from '../constants/gameConfig';
import { useTimer } from '../hooks/useTimer';
import { useGameState } from '../hooks/useGameState';
import { usePuzzle } from '../hooks/usePuzzle';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { NumberPad } from './NumberPad';
import { GameModals } from './GameModals';
import '../SpeedStack.css';

function SpeedStack() {
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [timeBonus, setTimeBonus] = useState<number | null>(null);

  // Custom hooks
  const gameState = useGameState();
  const puzzle = usePuzzle();
  const timer = useTimer(gameState.hasStarted, gameState.isGameOver, () =>
    gameState.setIsGameOver(true)
  );

  // Generate puzzle on mount and whenever size changes
  useEffect(() => {
    puzzle.generateNewPuzzle(gameState.currentSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentSize, gameState.completedCount]);

  // Check for puzzle completion
  const checkCompletion = useCallback(
    (boardToCheck: Board) => {
      // Check if board is complete
      const isComplete = isBoardComplete(boardToCheck);
      if (!isComplete) return;

      // Check if solution is valid (follows all sudoku rules)
      // This accepts ANY valid solution, not just one specific solution
      const isCorrect = isValidBoard(boardToCheck);

      if (isCorrect) {
        // Calculate points and time bonus based on current size
        const currentSize = gameState.currentSize;
        const points: number = currentSize * POINTS_PER_SIZE_MULTIPLIER;
        const bonus: number = getTimeBonus(currentSize);

        // Add time bonus
        timer.addTime(bonus);

        // Show time bonus animation
        setTimeBonus(bonus);
        setTimeout(() => setTimeBonus(null), 600);

        // Progress to next level (puzzle generation happens in effect above)
        gameState.completeLevel(points);

        setFeedback('correct');
        setTimeout(() => setFeedback(null), FEEDBACK_ANIMATION_DURATION);
      }
    },
    [gameState, timer]
  );

  const fillCell = useCallback(
    (row: number, col: number, num: number) => {
      const newBoard = puzzle.userBoard.map(r => [...r]);
      newBoard[row][col] = num;

      if (isValidMove(puzzle.userBoard, row, col, num)) {
        puzzle.updateUserBoard(newBoard);

        // Check completion with the new board
        checkCompletion(newBoard);
      } else {
        // Invalid move - penalty
        timer.subtractTime(TIME_PENALTY);
        setFeedback('incorrect');
        setTimeout(() => setFeedback(null), 500);
      }
    },
    [puzzle, checkCompletion, timer]
  );

  const clearCell = useCallback(
    (row: number, col: number) => {
      const newBoard = puzzle.userBoard.map(r => [...r]);
      newBoard[row][col] = 0;
      puzzle.updateUserBoard(newBoard);
    },
    [puzzle]
  );

  const handleCellClick = (row: number, col: number) => {
    if (!gameState.hasStarted || gameState.isGameOver) return;
    if (puzzle.puzzle[row][col] !== 0) return; // Can't change initial clues

    const currentValue = puzzle.userBoard[row][col];

    // If a number is selected
    if (puzzle.selectedNumber !== null) {
      // If clicking a cell with the same number, clear it (keep number selected)
      if (currentValue === puzzle.selectedNumber) {
        clearCell(row, col);
        puzzle.setSelectedCell(null);
        return;
      }

      // Otherwise, fill/replace the cell with the selected number (keep number selected)
      fillCell(row, col, puzzle.selectedNumber);
      return;
    }

    // If no number is selected
    // If cell has a value, clear it
    if (currentValue !== 0) {
      clearCell(row, col);
      puzzle.setSelectedCell(null);
      return;
    }

    // Otherwise, just select the cell
    puzzle.setSelectedCell([row, col]);
  };

  const handleStartGame = () => {
    gameState.startGame();
  };

  const handleNumberClick = useCallback(
    (num: number) => {
      if (!gameState.hasStarted || gameState.isGameOver) return;

      // Toggle number selection
      if (puzzle.selectedNumber === num) {
        puzzle.setSelectedNumber(null);
      } else {
        puzzle.setSelectedNumber(num);

        // If a cell is already selected, fill it immediately
        if (puzzle.selectedCell) {
          const [row, col] = puzzle.selectedCell;
          if (puzzle.puzzle[row][col] === 0) {
            fillCell(row, col, num);
            puzzle.setSelectedCell(null);
          }
        }
      }
    },
    [gameState, puzzle, fillCell]
  );

  // Keyboard input support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.hasStarted || gameState.isGameOver) return;

      // Handle number keys 1-9
      const num = parseInt(e.key);
      if (!isNaN(num) && num >= 1 && num <= gameState.currentSize) {
        handleNumberClick(num);
        return;
      }

      // Handle Delete/Backspace to clear selected cell
      if ((e.key === 'Delete' || e.key === 'Backspace') && puzzle.selectedCell) {
        const [row, col] = puzzle.selectedCell;
        if (puzzle.puzzle[row][col] === 0 && puzzle.userBoard[row][col] !== 0) {
          clearCell(row, col);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    gameState.hasStarted,
    gameState.isGameOver,
    gameState.currentSize,
    puzzle.selectedCell,
    puzzle.puzzle,
    puzzle.userBoard,
    handleNumberClick,
    clearCell,
  ]);

  const handleRestart = () => {
    gameState.resetGame();
    timer.resetTimer();
    puzzle.setSelectedCell(null);
    puzzle.setSelectedNumber(null);
    setFeedback(null);
    // Puzzle will be regenerated by the effect when currentSize resets to 1
  };

  const getTimerColor = () => {
    if (timer.timeRemaining > 15) return 'timer-green';
    if (timer.timeRemaining > 10) return 'timer-yellow';
    return 'timer-red';
  };

  const cellSize = Math.min(MAX_CELL_SIZE, Math.floor(BOARD_MAX_WIDTH / gameState.currentSize));

  const showModal = !gameState.hasStarted || gameState.isGameOver;

  return (
    <div className="speed-stack">
      <div className={`game-ui ${showModal ? 'hidden' : ''}`}>
        <GameHeader
          timeRemaining={timer.timeRemaining}
          currentSize={gameState.currentSize}
          score={gameState.score}
          getTimerColor={getTimerColor}
        />
      </div>

      <GameModals
        hasStarted={gameState.hasStarted}
        isGameOver={gameState.isGameOver}
        score={gameState.score}
        currentSize={gameState.currentSize}
        completedCount={gameState.completedCount}
        onStart={handleStartGame}
        onRestart={handleRestart}
      />

      <div className={`game-ui ${showModal ? 'hidden' : ''}`}>
        <div className="game-container">
          {timeBonus !== null && <div className="time-bonus-popup">+{timeBonus}s</div>}
          <GameBoard
            userBoard={puzzle.userBoard}
            puzzle={puzzle.puzzle}
            selectedCell={puzzle.selectedCell}
            feedback={feedback}
            isNewPuzzle={puzzle.isNewPuzzle}
            cellSize={cellSize}
            onCellClick={handleCellClick}
          />
        </div>

        <NumberPad
          gridSize={gameState.currentSize}
          selectedNumber={puzzle.selectedNumber}
          onNumberClick={handleNumberClick}
        />
      </div>
    </div>
  );
}

export default SpeedStack;
