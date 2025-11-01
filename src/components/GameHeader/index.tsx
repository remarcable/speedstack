import styles from './GameHeader.module.css';

interface GameHeaderProps {
  timeRemaining: number;
  currentSize: number;
  score: number;
  completedCount: number;
  pointsEarned: number | null;
  timeDelta: number | null;
}

export function GameHeader({
  timeRemaining,
  currentSize,
  score,
  completedCount,
  pointsEarned,
  timeDelta,
}: GameHeaderProps) {
  // Calculate timer color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 15) return 'timerGreen';
    if (timeRemaining > 10) return 'timerYellow';
    return 'timerRed';
  };

  const timerColorStyle = getTimerColor();

  return (
    <div className={styles.topBar}>
      <h1 className={styles.gameTitle}>Speed Stack</h1>
      <div className={styles.timerContainer}>
        <div className={`${styles.timer} ${styles[timerColorStyle] || ''}`}>
          {timeRemaining.toFixed(1)}s
        </div>
        {timeDelta !== null && (
          <div
            className={`${styles.timeDeltaPopup} ${timeDelta > 0 ? styles.positive : styles.negative}`}
          >
            {timeDelta > 0 ? '+' : ''}
            {Math.round(timeDelta)}s
          </div>
        )}
      </div>
      <div className={styles.gameInfo}>
        <div className={styles.levelInfo}>
          Lvl {completedCount} ({currentSize}×{currentSize})
        </div>
        <div className={styles.scoreInfo}>
          {score} pts
          {pointsEarned !== null && <div className={styles.pointsEarnedPopup}>+{pointsEarned}</div>}
        </div>
      </div>
    </div>
  );
}
