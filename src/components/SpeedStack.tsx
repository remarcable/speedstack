import { useState, useEffect, useCallback } from 'react';
import { isBoardComplete, isValidBoard, type Board } from '../utils/genericSudoku';
import {
  POINTS_PER_SIZE_MULTIPLIER,
  FEEDBACK_ANIMATION_DURATION,
  getTimeBonus,
  calculateSpeedMultiplier,
} from '../constants/gameConfig';
import { useTimer } from '../hooks/useTimer';
import { useGameState } from '../hooks/useGameState';
import { usePuzzle } from '../hooks/usePuzzle';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { useUIFeedback } from '../hooks/useUIFeedback';
import { useCellInteraction } from '../hooks/useCellInteraction';
import { useKeyboard } from '../hooks/useKeyboard';
import { blurCellElement } from '../utils/keyboardHelpers';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { NumberPad } from './NumberPad';
import { GameModals } from './GameModals';
import { Tooltip } from './Tooltip';
import styles from './SpeedStack.module.css';

function SpeedStack() {
  const [timerStarted, setTimerStarted] = useState(false);
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);

  // Custom hooks
  const gameState = useGameState();
  const puzzle = usePuzzle();
  const leaderboard = useLeaderboard();
  const uiFeedback = useUIFeedback();

  // Memoize onTimeUp callback to prevent timer effect from restarting
  const handleTimeUp = useCallback(() => {
    gameState.setIsGameOver(true);
    // Save to leaderboard when game ends
    leaderboard.saveScore({
      score: gameState.score,
      maxLevel: gameState.currentSize,
      completedCount: gameState.completedCount,
      bonuses: gameState.totalBonuses,
      penalties: gameState.totalPenalties,
      playTime: gameState.getPlayTime(),
    });
  }, [gameState, leaderboard]);

  const timer = useTimer(timerStarted, gameState.isGameOver, handleTimeUp);

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
        // Start timer after first puzzle completion
        if (!timerStarted) {
          setTimerStarted(true);
        }

        // Calculate points with speed multiplier
        const currentSize = gameState.currentSize;
        const basePoints = currentSize * POINTS_PER_SIZE_MULTIPLIER;
        const timeElapsed: number = puzzle.getPuzzleElapsedTime();
        const speedMultiplier: number = calculateSpeedMultiplier(timeElapsed);
        const points: number = Math.round(basePoints * speedMultiplier);
        const bonus: number = getTimeBonus(currentSize);

        // Add time bonus
        timer.addTime(bonus);
        gameState.addBonus(bonus);

        // Show time delta animation
        uiFeedback.showTimeDelta(bonus);

        // Show points earned animation
        uiFeedback.showPointsEarned(points);

        // Reset selections for new level
        puzzle.setSelectedCell(null);
        puzzle.setSelectedNumber(null);
        setFocusedCell(null);
        blurCellElement();

        // Fade out transition and progress to next level
        uiFeedback.triggerTransition(200, () => {
          gameState.completeLevel(points);
        });

        uiFeedback.showFeedback('correct', FEEDBACK_ANIMATION_DURATION);
      }
    },
    [gameState, timer, timerStarted, puzzle, uiFeedback]
  );

  // Cell interaction hook
  const cellInteraction = useCellInteraction({
    puzzle: puzzle.puzzle,
    userBoard: puzzle.userBoard,
    selectedNumber: puzzle.selectedNumber,
    timerStarted,
    onUpdateBoard: puzzle.updateUserBoard,
    onCheckCompletion: checkCompletion,
    onSubtractTime: timer.subtractTime,
    onAddPenalty: gameState.addPenalty,
    onShowTimeDelta: uiFeedback.showTimeDelta,
    onShowFeedback: uiFeedback.showFeedback,
    onSetSelectedCell: puzzle.setSelectedCell,
  });

  // Wrapper for cell click that adds game state checks
  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!gameState.hasStarted || gameState.isGameOver) return;
      cellInteraction.handleCellClick(row, col);
    },
    [gameState.hasStarted, gameState.isGameOver, cellInteraction]
  );

  // Deselect all selections
  const handleDeselectAll = useCallback(() => {
    puzzle.setSelectedCell(null);
    puzzle.setSelectedNumber(null);
  }, [puzzle]);

  const handleStartGame = useCallback(() => {
    gameState.startGame();
  }, [gameState]);

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
            cellInteraction.fillCell(row, col, num);
            puzzle.setSelectedCell(null);
          }
        }
      }
    },
    [gameState, puzzle, cellInteraction]
  );

  // Keyboard handling
  const keyboard = useKeyboard({
    hasStarted: gameState.hasStarted,
    isGameOver: gameState.isGameOver,
    gridSize: gameState.currentSize,
    puzzle: puzzle.puzzle,
    userBoard: puzzle.userBoard,
    selectedCell: puzzle.selectedCell,
    focusedCell,
    setFocusedCell,
    onCellClick: handleCellClick,
    onFillCell: cellInteraction.fillCell,
    onClearCell: cellInteraction.clearCell,
    onNumberClick: handleNumberClick,
    onDeselectAll: handleDeselectAll,
  });

  // Generate puzzle on mount and whenever size changes
  useEffect(() => {
    puzzle.generateNewPuzzle(gameState.currentSize, gameState.completedCount);
    // Clear DOM focus and state when new puzzle appears
    blurCellElement();
    setFocusedCell(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentSize, gameState.completedCount]);

  const handleRestart = () => {
    gameState.resetGame();
    timer.resetTimer();
    puzzle.setSelectedCell(null);
    puzzle.setSelectedNumber(null);
    uiFeedback.resetFeedback();
    setTimerStarted(false);
    setFocusedCell(null);
    // Puzzle will be regenerated by the effect when currentSize resets to 1
  };

  return (
    <div className={styles.speedStack}>
      <div
        className={`${styles.gameUi} ${timerStarted && !gameState.isGameOver ? '' : styles.hidden}`}
      >
        <GameHeader
          timeRemaining={timer.timeRemaining}
          currentSize={gameState.currentSize}
          score={gameState.score}
          completedCount={gameState.completedCount}
          pointsEarned={uiFeedback.pointsEarned}
          timeDelta={uiFeedback.timeDelta}
        />
      </div>

      <GameModals
        hasStarted={gameState.hasStarted}
        isGameOver={gameState.isGameOver}
        score={gameState.score}
        currentSize={gameState.currentSize}
        completedCount={gameState.completedCount}
        totalBonuses={gameState.totalBonuses}
        totalPenalties={gameState.totalPenalties}
        playTime={gameState.getPlayTime()}
        leaderboard={leaderboard.leaderboard}
        lastSavedId={leaderboard.lastSavedId}
        onStart={handleStartGame}
        onRestart={handleRestart}
      />
      <div className={`${styles.gameUi} ${gameState.isGameOver ? styles.hidden : ''}`}>
        <div
          className={`${styles.gameTransitionContainer} ${uiFeedback.isTransitioning ? styles.transitioning : ''}`}
        >
          <div className={styles.gameContainer}>
            <GameBoard
              userBoard={puzzle.userBoard}
              puzzle={puzzle.puzzle}
              selectedCell={puzzle.selectedCell}
              feedback={uiFeedback.feedback}
              isNewPuzzle={puzzle.isNewPuzzle}
              focusedCell={focusedCell}
              onCellClick={handleCellClick}
              onCellKeyDown={keyboard.handleCellKeyDown}
            />
          </div>

          <NumberPad
            gridSize={gameState.currentSize}
            selectedNumber={puzzle.selectedNumber}
            onNumberClick={handleNumberClick}
          />

          <Tooltip
            message="Click the number, then click the box"
            show={!timerStarted && !gameState.isGameOver}
          />
        </div>
      </div>
    </div>
  );
}

export default SpeedStack;
