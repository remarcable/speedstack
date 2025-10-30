interface NumberPadProps {
  gridSize: number;
  selectedNumber: number | null;
  onNumberClick: (num: number) => void;
}

export function NumberPad({ gridSize, selectedNumber, onNumberClick }: NumberPadProps) {
  return (
    <div className="number-buttons">
      {Array.from({ length: gridSize }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          className={`number-button ${selectedNumber === num ? 'selected' : ''}`}
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
