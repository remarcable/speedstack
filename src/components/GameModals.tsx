import { Modal } from './Modal';

interface GameModalsProps {
  hasStarted: boolean;
  isGameOver: boolean;
  score: number;
  currentSize: number;
  completedCount: number;
  onStart: () => void;
  onRestart: () => void;
}

export function GameModals({
  hasStarted,
  isGameOver,
  score,
  currentSize,
  completedCount,
  onStart,
  onRestart,
}: GameModalsProps) {
  return (
    <>
      <Modal isOpen={!hasStarted} overlayClassName="start-overlay" contentClassName="start-modal">
        <h2>Speed Stack</h2>
        <button className="start-button" onClick={onStart}>
          Start Game
        </button>
      </Modal>

      <Modal
        isOpen={isGameOver}
        overlayClassName="game-over-overlay"
        contentClassName="game-over-modal"
      >
        <h2>Game Over!</h2>
        <p className="final-score">Final Score: {score}</p>
        <p className="final-level">
          Reached Level: {currentSize}×{currentSize}
        </p>
        <p className="total-completed">Puzzles Completed: {completedCount}</p>
        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </Modal>
    </>
  );
}
