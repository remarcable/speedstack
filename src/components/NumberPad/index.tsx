import styles from './NumberPad.module.css';

interface NumberPadProps {
  gridSize: number;
  selectedNumber: number | null;
  onNumberClick: (num: number) => void;
}

export function NumberPad({ gridSize, selectedNumber, onNumberClick }: NumberPadProps) {
  return (
    <div className={styles.numberButtons}>
      {Array.from({ length: gridSize }, (_, i) => i + 1).map(num => (
        <button
          key={num}
          className={`${styles.numberButton} ${selectedNumber === num ? styles.selected : ''}`}
          onClick={() => onNumberClick(num)}
        >
          {num}
        </button>
      ))}
    </div>
  );
}
