interface GameHeaderProps {
  timeRemaining: number;
  currentSize: number;
  score: number;
  getTimerColor: () => string;
}

export function GameHeader({ timeRemaining, currentSize, score, getTimerColor }: GameHeaderProps) {
  return (
    <div className="top-bar">
      <h1 className="game-title">Speed Stack</h1>
      <div className={`timer ${getTimerColor()}`}>{Math.round(timeRemaining)}s</div>
      <div className="game-info">
        <div className="level-info">
          {currentSize}×{currentSize}
        </div>
        <div className="score-info">{score} pts</div>
      </div>
    </div>
  );
}
