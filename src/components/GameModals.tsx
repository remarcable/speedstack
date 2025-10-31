import { Modal } from './Modal';
import type { LeaderboardEntry } from '../hooks/useLeaderboard';

interface GameModalsProps {
  hasStarted: boolean;
  isGameOver: boolean;
  score: number;
  currentSize: number;
  completedCount: number;
  totalBonuses: number;
  totalPenalties: number;
  playTime: number;
  leaderboard: LeaderboardEntry[];
  onStart: () => void;
  onRestart: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}

export function GameModals({
  hasStarted,
  isGameOver,
  score,
  currentSize,
  completedCount,
  totalBonuses,
  totalPenalties,
  playTime,
  leaderboard,
  onStart,
  onRestart,
}: GameModalsProps) {
  // Check if current score is in leaderboard
  const currentScoreRank =
    leaderboard.findIndex(
      entry =>
        entry.score === score &&
        entry.completedCount === completedCount &&
        entry.playTime === playTime
    ) + 1;
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
        <div className="game-stats">
          <p className="final-level">
            Level: {completedCount} ({currentSize}×{currentSize})
          </p>
          <p className="final-score">Score: {score}</p>
          <p className="play-time">Time: {formatTime(playTime)}</p>
          <div className="bonus-penalty-stats">
            <span className="bonuses">Bonuses: +{totalBonuses}s</span>
            <span className="penalties">Penalties: -{totalPenalties}s</span>
          </div>
        </div>

        {leaderboard.length > 0 && (
          <div className="leaderboard-section">
            <h3>Top 5 Scores</h3>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Score</th>
                  <th>Level</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={`${entry.date}-${index}`}
                    className={index + 1 === currentScoreRank ? 'current-score' : ''}
                  >
                    <td>{index + 1}</td>
                    <td>{entry.score}</td>
                    <td>
                      {entry.completedCount} ({entry.maxLevel}×{entry.maxLevel})
                    </td>
                    <td>{formatTime(entry.playTime)}</td>
                    <td>{formatDate(entry.date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="restart-button" onClick={onRestart}>
          Play Again
        </button>
      </Modal>
    </>
  );
}
