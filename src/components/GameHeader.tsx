interface GameHeaderProps {
  timeRemaining: number;
  score: number;
  currentSize: number;
  completedCount: number;
  getTimerColor: () => string;
}

export function GameHeader({
  timeRemaining,
  score,
  currentSize,
  completedCount,
  getTimerColor,
}: GameHeaderProps) {
  return (
    <>
      <h1>Speed Stack Sudoku</h1>

      <div className="stats">
        <div className={`timer ${getTimerColor()}`}>Time: {timeRemaining}s</div>
        <div className="score">Score: {score}</div>
        <div className="level">
          Level: {currentSize}×{currentSize} (#{completedCount + 1})
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${((completedCount % 3) / 3) * 100}%`,
          }}
        />
      </div>
    </>
  );
}
