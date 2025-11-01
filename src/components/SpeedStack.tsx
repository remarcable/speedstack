import { useState, useEffect, useCallback } from 'react';
import { isValidMove, isBoardComplete, isValidBoard, type Board } from '../utils/genericSudoku';
import {
  TIME_PENALTY,
  POINTS_PER_SIZE_MULTIPLIER,
  FEEDBACK_ANIMATION_DURATION,
  getTimeBonus,
  calculateSpeedMultiplier,
} from '../constants/gameConfig';
import { calculateNextCell, type Direction } from '../utils/gridNavigation';
import { useTimer } from '../hooks/useTimer';
import { useGameState } from '../hooks/useGameState';
import { usePuzzle } from '../hooks/usePuzzle';
import { useLeaderboard } from '../hooks/useLeaderboard';
import { GameHeader } from './GameHeader';
import { GameBoard } from './GameBoard';
import { NumberPad } from './NumberPad';
import { GameModals } from './GameModals';
import '../SpeedStack.css';

function SpeedStack() {
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [timeDelta, setTimeDelta] = useState<number | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipFadingOut, setTooltipFadingOut] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [focusedCell, setFocusedCell] = useState<[number, number] | null>(null);

  // Custom hooks
  const gameState = useGameState();
  const puzzle = usePuzzle();
  const leaderboard = useLeaderboard();
  const timer = useTimer(timerStarted, gameState.isGameOver, () => {
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
  });

  // Generate puzzle on mount and whenever size changes
  useEffect(() => {
    puzzle.generateNewPuzzle(gameState.currentSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentSize, gameState.completedCount]);

  // Show tooltip after 5 seconds if timer hasn't started
  useEffect(() => {
    if (!timerStarted && !gameState.isGameOver) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true);
      }, 5000);

      return () => clearTimeout(tooltipTimer);
    } else if (showTooltip) {
      // Fade out before hiding
      setTooltipFadingOut(true);
      const fadeTimer = setTimeout(() => {
        setShowTooltip(false);
        setTooltipFadingOut(false);
      }, 300);
      return () => clearTimeout(fadeTimer);
    }
  }, [timerStarted, gameState.isGameOver, showTooltip]);

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
          // Fade out tooltip before starting timer
          if (showTooltip) {
            setTooltipFadingOut(true);
            setTimeout(() => {
              setShowTooltip(false);
              setTooltipFadingOut(false);
            }, 300);
          }
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
        setTimeDelta(bonus);
        setTimeout(() => setTimeDelta(null), 600);

        // Show points earned animation
        setPointsEarned(points);
        setTimeout(() => setPointsEarned(null), 600);

        // Reset selections for new level
        puzzle.setSelectedCell(null);
        puzzle.setSelectedNumber(null);
        setFocusedCell(null);

        // Fade out transition
        setIsTransitioning(true);
        setTimeout(() => {
          // Progress to next level (puzzle generation happens in effect above)
          gameState.completeLevel(points);
          // Fade back in
          setTimeout(() => setIsTransitioning(false), 50);
        }, 200);

        setFeedback('correct');
        setTimeout(() => setFeedback(null), FEEDBACK_ANIMATION_DURATION);
      }
    },
    [gameState, timer, timerStarted, showTooltip, puzzle]
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
        // Invalid move - penalty (only if timer has started)
        if (timerStarted) {
          timer.subtractTime(TIME_PENALTY);
          gameState.addPenalty(TIME_PENALTY);

          // Show time delta animation (negative)
          setTimeDelta(-TIME_PENALTY);
          setTimeout(() => setTimeDelta(null), 600);
        }

        setFeedback('incorrect');
        setTimeout(() => setFeedback(null), 500);
      }
    },
    [puzzle, checkCompletion, timer, timerStarted, gameState]
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

    const isClue = puzzle.puzzle[row][col] !== 0;
    const currentValue = puzzle.userBoard[row][col];

    // If it's a clue cell, just select it (but don't allow editing)
    if (isClue) {
      puzzle.setSelectedCell([row, col]);
      return;
    }

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

  const handleCellKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    if (!gameState.hasStarted || gameState.isGameOver) return;

    const gridSize = gameState.currentSize;
    const isClue = puzzle.puzzle[row][col] !== 0;

    // Arrow key navigation (including WASD and vim hjkl)
    const isUpKey = ['ArrowUp', 'w', 'W', 'k', 'K'].includes(e.key);
    const isDownKey = ['ArrowDown', 's', 'S', 'j', 'J'].includes(e.key);
    const isLeftKey = ['ArrowLeft', 'a', 'A', 'h', 'H'].includes(e.key);
    const isRightKey = ['ArrowRight', 'd', 'D', 'l', 'L'].includes(e.key);

    if (isUpKey || isDownKey || isLeftKey || isRightKey) {
      e.preventDefault();

      // Set focused cell when user first uses navigation keys
      if (!focusedCell) {
        setFocusedCell([row, col]);
        return;
      }

      // Determine direction
      let direction: Direction;
      if (isUpKey) direction = 'up';
      else if (isDownKey) direction = 'down';
      else if (isLeftKey) direction = 'left';
      else direction = 'right';

      // Check if Shift is held for jump mode
      const jump = e.shiftKey;

      // Use navigation algorithm to find next cell
      const result = calculateNextCell({
        currentRow: row,
        currentCol: col,
        gridSize,
        direction,
        jump,
      });

      if (!result.moved) {
        return;
      }

      setFocusedCell([result.row, result.col]);
      // Focus the cell element
      setTimeout(() => {
        const cellElement = document.querySelector(`.cell[tabindex="0"]`) as HTMLElement;
        cellElement?.focus();
      }, 0);
      return;
    }

    // Enter or Space to select/interact with cell
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCellClick(row, col);
      return;
    }

    // Escape to deselect
    if (e.key === 'Escape') {
      e.preventDefault();
      puzzle.setSelectedCell(null);
      puzzle.setSelectedNumber(null);
      return;
    }

    // Prevent editing clue cells with number keys or delete
    if (isClue) {
      return;
    }

    // Number keys to fill cell
    const num = parseInt(e.key);
    if (!isNaN(num) && num >= 1 && num <= gridSize) {
      e.preventDefault();
      const currentValue = puzzle.userBoard[row][col];

      // If pressing the same number as current value, clear it
      if (currentValue === num) {
        clearCell(row, col);
      } else {
        fillCell(row, col, num);
      }
      return;
    }

    // Delete/Backspace to clear cell
    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      if (puzzle.userBoard[row][col] !== 0) {
        clearCell(row, col);
      }
      return;
    }
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

      // Handle navigation keys when no cell is focused - focus the first non-clue cell
      const isNavigationKey = [
        'ArrowUp',
        'ArrowDown',
        'ArrowLeft',
        'ArrowRight',
        'w',
        'W',
        'a',
        'A',
        's',
        'S',
        'd',
        'D',
        'h',
        'H',
        'j',
        'J',
        'k',
        'K',
        'l',
        'L',
      ].includes(e.key);

      if (isNavigationKey) {
        e.preventDefault();

        // If we have a focused cell, try to focus it (in case user clicked outside)
        if (focusedCell) {
          const [row, col] = focusedCell;
          // Check if the focused cell is still valid (within bounds)
          if (puzzle.puzzle[row] && puzzle.puzzle[row][col] !== undefined) {
            setTimeout(() => {
              const cellElement = document.querySelector(`.cell[tabindex="0"]`) as HTMLElement;
              cellElement?.focus();
            }, 0);
            return;
          }
        }

        // If no focused cell or it's invalid, find first cell (any cell, clue or not)
        if (puzzle.puzzle.length > 0 && puzzle.puzzle[0].length > 0) {
          setFocusedCell([0, 0]);
          // Focus the cell element
          setTimeout(() => {
            const cellElement = document.querySelector(`.cell[tabindex="0"]`) as HTMLElement;
            cellElement?.focus();
          }, 0);
          return;
        }
        return;
      }

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
    focusedCell,
    handleNumberClick,
    clearCell,
  ]);

  const handleRestart = () => {
    gameState.resetGame();
    timer.resetTimer();
    puzzle.setSelectedCell(null);
    puzzle.setSelectedNumber(null);
    setFeedback(null);
    setTimerStarted(false);
    setShowTooltip(false);
    setFocusedCell(null);
    // Puzzle will be regenerated by the effect when currentSize resets to 1
  };

  const getTimerColor = () => {
    if (timer.timeRemaining > 15) return 'timer-green';
    if (timer.timeRemaining > 10) return 'timer-yellow';
    return 'timer-red';
  };

  return (
    <div className="speed-stack">
      <div className={`game-ui ${timerStarted ? '' : 'hidden'}`}>
        <GameHeader
          timeRemaining={timer.timeRemaining}
          currentSize={gameState.currentSize}
          score={gameState.score}
          completedCount={gameState.completedCount}
          pointsEarned={pointsEarned}
          timeDelta={timeDelta}
          getTimerColor={getTimerColor}
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
      <div className={`game-ui ${gameState.isGameOver ? 'hidden' : ''}`}>
        <div className={`game-transition-container ${isTransitioning ? 'transitioning' : ''}`}>
          <div className="game-container">
            <GameBoard
              userBoard={puzzle.userBoard}
              puzzle={puzzle.puzzle}
              selectedCell={puzzle.selectedCell}
              feedback={feedback}
              isNewPuzzle={puzzle.isNewPuzzle}
              focusedCell={focusedCell}
              onCellClick={handleCellClick}
              onCellKeyDown={handleCellKeyDown}
            />
          </div>

          <NumberPad
            gridSize={gameState.currentSize}
            selectedNumber={puzzle.selectedNumber}
            onNumberClick={handleNumberClick}
          />

          {showTooltip && (
            <div className="tooltip-container">
              <div className={`instruction-tooltip ${tooltipFadingOut ? 'fading-out' : ''}`}>
                Click the number, then click the box
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpeedStack;
