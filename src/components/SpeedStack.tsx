import { useState, useEffect, useCallback } from 'react';
import { isValidMove } from '../utils/genericSudoku';
import {
  TIME_BONUS,
  TIME_PENALTY,
  MAX_TIME,
  POINTS_PER_SIZE_MULTIPLIER,
  MAX_CELL_SIZE,
  BOARD_MAX_WIDTH,
  FEEDBACK_ANIMATION_DURATION,
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

  // Custom hooks
  const gameState = useGameState();
  const puzzle = usePuzzle();
  const timer = useTimer(gameState.hasStarted, gameState.isGameOver, () =>
    gameState.setIsGameOver(true)
  );

  // Initialize first puzzle on mount
  useEffect(() => {
    puzzle.generateNewPuzzle(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for puzzle completion
  const checkCompletion = useCallback(() => {
    if (puzzle.checkIfComplete() && puzzle.checkIfCorrect()) {
      // Calculate points and add time bonus
      const points = gameState.currentSize * POINTS_PER_SIZE_MULTIPLIER;
      const newTime = Math.min(timer.timeRemaining + TIME_BONUS, MAX_TIME);
      timer.setTimeRemaining(newTime);

      // Progress to next level
      const nextSize = gameState.completeLevel(points);
      puzzle.generateNewPuzzle(nextSize);

      setFeedback('correct');
      setTimeout(() => setFeedback(null), FEEDBACK_ANIMATION_DURATION);
    }
  }, [puzzle, gameState, timer]);

  const fillCell = (row: number, col: number, num: number) => {
    const newBoard = puzzle.userBoard.map(r => [...r]);
    newBoard[row][col] = num;

    if (isValidMove(puzzle.userBoard, row, col, num)) {
      puzzle.updateUserBoard(newBoard);
      setFeedback('correct');
      setTimeout(() => setFeedback(null), 300);

      // Check completion
      checkCompletion();
    } else {
      // Invalid move - penalty
      timer.subtractTime(TIME_PENALTY);
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!gameState.hasStarted || gameState.isGameOver) return;
    if (puzzle.puzzle[row][col] !== 0) return; // Can't change initial clues

    // If a number is already selected, fill the cell
    if (puzzle.selectedNumber !== null) {
      fillCell(row, col, puzzle.selectedNumber);
    } else {
      // Otherwise, just select the cell
      puzzle.setSelectedCell([row, col]);
    }
  };

  const handleStartGame = () => {
    gameState.startGame();
  };

  const handleNumberClick = (num: number) => {
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
  };

  const handleRestart = () => {
    gameState.resetGame();
    timer.resetTimer();
    puzzle.setSelectedCell(null);
    puzzle.setSelectedNumber(null);
    setFeedback(null);
    puzzle.generateNewPuzzle(1);
  };

  const getTimerColor = () => {
    if (timer.timeRemaining > 15) return 'timer-green';
    if (timer.timeRemaining > 10) return 'timer-yellow';
    return 'timer-red';
  };

  const cellSize = Math.min(MAX_CELL_SIZE, Math.floor(BOARD_MAX_WIDTH / gameState.currentSize));

  return (
    <div className="speed-stack">
      <GameHeader
        timeRemaining={timer.timeRemaining}
        score={gameState.score}
        currentSize={gameState.currentSize}
        completedCount={gameState.completedCount}
        getTimerColor={getTimerColor}
      />

      <GameModals
        hasStarted={gameState.hasStarted}
        isGameOver={gameState.isGameOver}
        score={gameState.score}
        currentSize={gameState.currentSize}
        completedCount={gameState.completedCount}
        onStart={handleStartGame}
        onRestart={handleRestart}
      />

      <GameBoard
        userBoard={puzzle.userBoard}
        puzzle={puzzle.puzzle}
        selectedCell={puzzle.selectedCell}
        feedback={feedback}
        isNewPuzzle={puzzle.isNewPuzzle}
        cellSize={cellSize}
        onCellClick={handleCellClick}
      />

      <NumberPad
        gridSize={gameState.currentSize}
        selectedNumber={puzzle.selectedNumber}
        onNumberClick={handleNumberClick}
      />
    </div>
  );
}

export default SpeedStack;
