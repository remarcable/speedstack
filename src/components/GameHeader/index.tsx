import styles from './GameHeader.module.css';

interface GameHeaderProps {
  timeRemaining: number;
  currentSize: number;
  score: number;
  completedCount: number;
  pointsEarned: number | null;
  timeDelta: number | null;
  getTimerColor: () => string;
}

export function GameHeader({
  timeRemaining,
  currentSize,
  score,
  completedCount,
  pointsEarned,
  timeDelta,
  getTimerColor,
}: GameHeaderProps) {
  // Map old class names to new CSS module names
  const timerColorClass = getTimerColor().replace('timer-', 'timer');
  const timerColorStyle = timerColorClass.charAt(5).toUpperCase() + timerColorClass.slice(6); // timerGreen, timerYellow, timerRed

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
