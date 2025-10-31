interface GameHeaderProps {
  timeRemaining: number;
  score: number;
  currentSize: number;
  completedCount: number;
  timeBonus: number | null;
  getTimerColor: () => string;
}

export function GameHeader({
  timeRemaining,
  score: _score,
  currentSize: _currentSize,
  completedCount: _completedCount,
  timeBonus,
  getTimerColor,
}: GameHeaderProps) {
  return (
    <div className="stats">
      <div className={`timer ${getTimerColor()}`}>
        {Math.round(timeRemaining)}s
        {timeBonus !== null && <div className="time-bonus-popup">+{timeBonus}s</div>}
      </div>
    </div>
  );
}
