import { Modal } from '../Modal';
import type { LeaderboardEntry } from '../../hooks/useLeaderboard';
import styles from './GameModals.module.css';

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
        overlayClassName={styles.gameOverOverlay}
        contentClassName={styles.gameOverModal}
      >
        <h2>Speed Stack</h2>
        <p className={styles.subheading}>
          By <a href="https://marcnitzsche.de/about">Marc Nitzsche</a>
        </p>
        <div className={styles.gameStats}>
          <p className={styles.finalLevel}>{score} points</p>
          <p className={styles.finalScore}>
            Level {completedCount} ({currentSize}×{currentSize})
          </p>

          <button className={styles.restartButton} onClick={onRestart}>
            Play Again
          </button>
        </div>

        {leaderboard.length > 0 && (
          <div className={styles.leaderboardSection}>
            <table className={styles.leaderboardTable}>
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
                    <tr
                      key={entryId}
                      className={entry.id === lastSavedId ? styles.currentScore : ''}
                    >
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
