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
  return (
    <div className="top-bar">
      <h1 className="game-title">Speed Stack</h1>
      <div className="timer-container">
        <div className={`timer ${getTimerColor()}`}>{timeRemaining.toFixed(1)}s</div>
        {timeDelta !== null && (
          <div className={`time-delta-popup ${timeDelta > 0 ? 'positive' : 'negative'}`}>
            {timeDelta > 0 ? '+' : ''}
            {Math.round(timeDelta)}s
          </div>
        )}
      </div>
      <div className="game-info">
        <div className="level-info">
          Lvl {completedCount} ({currentSize}×{currentSize})
        </div>
        <div className="score-info">
          {score} pts
          {pointsEarned !== null && <div className="points-earned-popup">+{pointsEarned}</div>}
        </div>
      </div>
    </div>
  );
}
