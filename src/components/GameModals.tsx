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
  lastSavedId: string | null;
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
  isGameOver,
  score,
  currentSize,
  completedCount,
  leaderboard,
  lastSavedId,
  onRestart,
}: GameModalsProps) {
  return (
    <>
      <Modal
        isOpen={isGameOver}
        overlayClassName="game-over-overlay"
        contentClassName="game-over-modal"
      >
        <h2>Speed Stack</h2>
        <p className="subheading">
          By <a href="https://marcnitzsche.de/about">Marc Nitzsche</a>
        </p>
        <div className="game-stats">
          <p className="final-level">{score} points</p>
          <p className="final-score">
            Level {completedCount} ({currentSize}×{currentSize})
          </p>

          <button className="restart-button" onClick={onRestart}>
            Play Again
          </button>
        </div>

        {leaderboard.length > 0 && (
          <div className="leaderboard-section">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Points</th>
                  <th>Level</th>
                  <th>Time</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => {
                  const entryId = entry.id ?? `${entry.date}-${index}`;
                  return (
                    <tr key={entryId} className={entry.id === lastSavedId ? 'current-score' : ''}>
                      <td>{index + 1}</td>
                      <td>{entry.score}</td>
                      <td>
                        {entry.completedCount} ({entry.maxLevel}×{entry.maxLevel})
                      </td>
                      <td>{formatTime(entry.playTime)}</td>
                      <td>{formatDate(entry.date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </>
  );
}
